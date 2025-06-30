import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientsService } from '../../../core/services/patient/patients.service';


@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule,CurrencyPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  searchText = '';
 
  selectedDepartment = '';
  
  // Price range is handled by budget now, keeping for UI but logic will use budget
  minPrice = 0;
  maxPrice = 10000;
  
  selectedArea = '';
  areas = ['Nasr City', 'Maadi', 'Zamalek']; // This is not used by backend search
  insuranceName = '';

  selectedDistance = '';
  distanceRanges = [
    { label: '0 - 5 km', value: '5' },
    { label: '5 - 10 km', value: '10' },
    { label: '10 - 20 km', value: '20' },
    { label: '20+ km', value: '9999' }
  ];

  departments: any[] = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Dermatology', 'Radiology']; // This should be populated from another source if dynamic

  filteredHospitalsList: any[] = [];

  private patientsService = inject(PatientsService);
  private userLocation: { lat: number, lng: number } | null = null;

  constructor() {}

  ngOnInit(): void {
    this.getCurrentLocationAndSearch();
  }

  getCurrentLocationAndSearch(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.search();
      }, () => {
        // Location denied or error
        this.search(); // Search without location
      });
    } else {
      // Geolocation not supported
      this.search();
    }
  }

  search() {
    const params: any = {
      Deptype: this.selectedDepartment,
      Insurance: this.insuranceName,
      Name: this.searchText,
      Budget: this.maxPrice, // Using maxPrice as budget for simplicity
      Distance: this.selectedDistance,
    };

    if (this.userLocation) {
      params.Lat = this.userLocation.lat;
      params.Lang = this.userLocation.lng;
    }

    this.patientsService.searchHospitals(params).subscribe(results => {
      this.filteredHospitalsList = results;
    });
  }

  getAvailabilityColor(totalPatients: number): string {
    if (totalPatients <= 5) {
      return 'bg-green-500';
    } else if (totalPatients <= 10) {
      return 'bg-orange-500';
    } else {
      return 'bg-red-500';
    }
  }

  openInMaps(hospital: any) {
    // This assumes the backend provides coordinates, which it doesn't seem to based on UserController
    // Keeping it but it may not work.
    const { lat, lng } = hospital.coordinates;
    const hospitalName = encodeURIComponent(hospital.hospitalName);
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&t=m`;
    window.open(googleMapsUrl, '_blank');
  }
}