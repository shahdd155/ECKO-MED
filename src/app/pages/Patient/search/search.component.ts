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
  
  minPrice = 0;
  maxPrice = 10000;
  
  selectedArea = '';
  insuranceName = '';

  selectedDistance = '';
  distanceRanges = [
    { label: '< 5 km', value: 5 },
    { label: '< 10 km', value: 10 },
    { label: '< 20 km', value: 20 },
    { label: '< 50 km', value: 50 }
  ];

  departments: any[] = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Dermatology', 'Radiology'];

  filteredHospitalsList: any[] = [];

  private patientsService = inject(PatientsService);
  private userLocation: { lat: number, lng: number } | null = null;

  // Add department and distance labels for the new UI
  departmentLabels: any[] = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'General'
  ];

  // Add Math property for template access
  Math = Math;

  constructor() {}

  ngOnInit(): void {
    this.getCurrentLocationAndSearch();
  }

  getCurrentLocationAndSearch(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        },
        () => {
          this.userLocation = null;
        }
      );
    } else {
      this.userLocation = null;
    }
  }

  search() {
    const params: any = {
      Deptype: this.selectedDepartment,
      Insurance: this.insuranceName,
      Name: this.searchText,
      Budget: this.maxPrice,
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

  // Update getAvailabilityColor for new border classes
  getAvailabilityColor(totalPatients: number): string {
    if (totalPatients < 50) {
      return 'border-t-green-500';
    } else if (totalPatients < 100) {
      return 'border-t-yellow-500';
    } else {
      return 'border-t-red-500';
    }
  }

  openInMaps(hospital: any) {
    const lat = hospital.latitude;
    const lng = hospital.longitude;
    const hospitalName = encodeURIComponent(hospital.hospitalName);
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&t=m`;
    window.open(googleMapsUrl, '_blank');
  }
}