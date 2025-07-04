import { Component, OnInit } from '@angular/core';
import { MedicineService } from '../../../core/services/medicine/medicine.service';
import { Medicine, PharmacyInventory } from '../../../models/medicine.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-searchmedicine',
  imports: [CommonModule, ReactiveFormsModule],
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

  // Add these properties for template binding
  selectedMedicine: Medicine | null = null;
  selectedQuantity: number | null = null;

  sendingAll = false;

  constructor(private medicineService: MedicineService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      medicineId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    // Update selectedMedicine and selectedQuantity when form changes
    this.searchForm.valueChanges.subscribe(val => {
      this.selectedMedicine = this.medicines.find(m => m.id === val.medicineId) || null;
      this.selectedQuantity = val.quantity;
    });

    // Re-search pharmacies when medicine changes (with debounce)
    this.searchForm.get('medicineId')?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        if (this.searchForm.valid) {
          this.performSearch();
        }
      });
  }

  ngOnInit(): void {
    this.medicineService.getMedicines().subscribe(meds => {
      this.medicines = meds;
      // Automatically select the first medicine and quantity if not set
      if (this.medicines.length > 0 && !this.searchForm.value.medicineId) {
        this.searchForm.patchValue({ medicineId: this.medicines[0].id });
      }
      // Request location only once on load
      this.requestLocationOnce();
    });
  }

  // Request location only once
  requestLocationOnce(): void {
    this.locationPermissionVisible = true;
    this.locationDenied = false;
    this.locationPermissionMessage = 'This page would like to access your current location to show nearby pharmacies. Please allow location access.';
    this.medicineService.getCurrentLocation().then(loc => {
      this.userLocation = loc;
      this.locationPermissionMessage = 'Location access granted.';
      setTimeout(() => {
        this.locationPermissionVisible = false;
        this.performSearch();
      }, 1000);
    }).catch(() => {
      this.locationPermissionMessage = 'Location access denied. Results may not be accurate.';
      this.locationDenied = true;
      this.userLocation = null;
      setTimeout(() => {
        this.locationPermissionVisible = false;
        this.performSearch();
      }, 1000);
    });
  }

  performSearch(): void {
    
    this.loading = true;
    this.searchDone = false;
    const { medicineId } = this.searchForm.value;
    const selectedMedicine = this.medicines.find(m => m.id === medicineId);
    if (!selectedMedicine) {
      this.loading = false;
      this.searchDone = true;
      return;
    }
    const request: any = { medicineName: selectedMedicine.name };
    if (this.userLocation) {
      request.latitude = this.userLocation.latitude;
      request.longitude = this.userLocation.longitude;
    }console.log(this.searchForm.value);
    request.distance = 9999; // or any default max distance
    this.medicineService.searchPharmacies(request).subscribe({
      next: (res) => {
        this.pharmacies = res;
        this.loading = false;
        this.searchDone = true;
      },
      error: () => {
        this.loading = false;
        this.searchDone = true;
      }
    });
  }

  sendRequest(pharmacy: PharmacyInventory): void {
    const selectedMedicine = this.medicines.find(m => m.id === this.searchForm.value.medicineId);
    if (!selectedMedicine) {
      console.error('Medicine not found');
      return;
    }

    const { quantity } = this.searchForm.value;
    this.requestStatus[pharmacy.pharmacyID] = 'loading';

    this.medicineService.sendPharmacyRequest({
      pharmacyId: pharmacy.pharmacyID.toString(),
      medicineName: selectedMedicine.name,
      quantity,
    }).subscribe({
      next: () => {
        this.requestStatus[pharmacy.pharmacyID] = 'success';
        setTimeout(() => {
          this.pharmacies = this.pharmacies.filter(p => p.pharmacyID !== pharmacy.pharmacyID);
          delete this.requestStatus[pharmacy.pharmacyID];
        }, 1000);
      },
      error: () => {
        this.requestStatus[pharmacy.pharmacyID] = 'error';
      }
    });
  }

  openInMaps(pharmacy: PharmacyInventory): void {
    // Assumes pharmacy has latitude and longitude properties from backend
    const lat = pharmacy.latitude;
    const lng = pharmacy.longitude;
    if (lat && lng) {
      const url = `https://www.google.com/maps?q=${lat},${lng}&z=15&t=m`;
      window.open(url, '_blank');
    } else {
      alert('Location not available for this pharmacy.');
    }
  }

  // Add this method for template button
  sendRequestToSelected(): void {
    if (!this.selectedMedicine || !this.selectedQuantity) return;
    // Find a pharmacy to send to (for demo, just pick the first one)
    const pharmacy = this.pharmacies[0];
    if (pharmacy) {
      this.sendRequest(pharmacy);
    }
  }

  // Add this method to send requests to all pharmacies
  sendRequestToAll(): void {
    if (!this.selectedMedicine || !this.selectedQuantity) return;
    if (!this.pharmacies || this.pharmacies.length === 0) return;
    this.sendingAll = true;
    const pharmaciesCopy = [...this.pharmacies];
    pharmaciesCopy.forEach((pharmacy, index) => {
      setTimeout(() => {
        this.sendRequest(pharmacy);
      }, index * 500); // Staggered for effect
    });
    setTimeout(() => {
      this.sendingAll = false;
    }, Math.max(1500, pharmaciesCopy.length * 500));
  }

  // TrackBy function for pharmacy cards
  trackPharmacyId(index: number, pharmacy: any) {
    return pharmacy.pharmacyID;
  }
}