import { Component, OnInit } from '@angular/core';
import { MedicineService } from '../../../core/services/medicine/medicine.service';
import { Medicine, PharmacyInventory } from '../../../models/medicine.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-searchmedicine',
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './searchmedicine.component.html',
  styleUrl: './searchmedicine.component.scss'
})
export class SearchmedicineComponent implements OnInit {
  medicines: Medicine[] = [];
  pharmacies: PharmacyInventory[] = [];
  loading = false;
  searchForm: FormGroup;
  searchDone = false;
  requestStatus: { [pharmacyId: number]: string } = {};
  locationPermissionMessage = '';
  locationPermissionVisible = false;
  userLocation: { latitude: number; longitude: number } | null = null;
  locationDenied = false;

  constructor(private medicineService: MedicineService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      medicineId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.medicineService.getMedicines().subscribe(meds => {
      this.medicines = meds;
    });
  }

  askForLocationAndSearch(): void {
    this.locationPermissionVisible = true;
    this.locationDenied = false;
    this.locationPermissionMessage = 'This page would like to access your current location to show nearby pharmacies. Please allow location access.';
    setTimeout(() => {
      this.medicineService.getCurrentLocation().then(loc => {
        this.userLocation = loc;
        this.locationPermissionMessage = 'Location access granted. Searching for nearby pharmacies...';
        setTimeout(() => {
          this.locationPermissionVisible = false;
          this.performSearch();
        }, 1000);
      }).catch(() => {
        this.locationPermissionMessage = 'Location access denied. Results may not be accurate.';
        this.locationDenied = true;
        // Keep the message visible and still perform the search without location
        this.userLocation = null;
        this.performSearch();
      });
    }, 300); // Small delay to ensure message is visible before prompt
  }

  onSearch(): void {
    if (this.searchForm.invalid) return;
    this.askForLocationAndSearch();
  }

  performSearch(): void {
    this.loading = true;
    this.searchDone = false;
    const { medicineId, quantity } = this.searchForm.value;
    const request: any = { medicineId, quantity };
    if (this.userLocation) {
      request.latitude = this.userLocation.latitude;
      request.longitude = this.userLocation.longitude;
    }
    this.medicineService.searchPharmacies(request).subscribe(res => {
      this.pharmacies = res.data;
      this.loading = false;
      this.searchDone = true;
    }, () => {
      this.loading = false;
      this.searchDone = true;
    });
  }

  sendRequest(pharmacy: PharmacyInventory): void {
    // For demo, use mock patient info
    const patientId = 1;
    const patientName = 'John Doe';
    const patientEmail = 'john@example.com';
    const patientPhone = '+1234567890';
    const { medicineId, quantity } = this.searchForm.value;
    this.requestStatus[pharmacy.pharmacyId] = 'loading';
    this.medicineService.sendPharmacyRequest({
      pharmacyId: pharmacy.pharmacyId,
      medicineId,
      quantity,
      unit: pharmacy.unit,
      patientId,
      patientName,
      patientEmail,
      patientPhone
    }).subscribe(res => {
      this.requestStatus[pharmacy.pharmacyId] = res.success ? 'success' : 'error';
    }, () => {
      this.requestStatus[pharmacy.pharmacyId] = 'error';
    });
  }
}