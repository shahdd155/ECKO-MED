import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule,CurrencyPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchText = '';
 
  selectedDepartment = '';
  minPrice = 0;
  maxPrice = 10000;
  minLimit = 0;
  maxLimit = 10000;
  hasInsurance = false;

  selectedCity = '';
  cities = ['Cairo', 'Alexandria', 'Aswan'];
  selectedArea = '';
  areas = ['Nasr City', 'Maadi', 'Zamalek'];
  insuranceName = '';
  selectedPriceRange = '';
  priceRanges = [
    { label: '0 - 500 EGP', value: '0-500' },
    { label: '500 - 1000 EGP', value: '500-1000' },
    { label: '1000 - 2000 EGP', value: '1000-2000' },
    { label: '2000+ EGP', value: '2000+' }
  ];
  selectedDistance = '';
  distanceRanges = [
    { label: '0 - 5 km', value: '0-5' },
    { label: '5 - 10 km', value: '5-10' },
    { label: '10 - 20 km', value: '10-20' },
    { label: '20+ km', value: '20+' }
  ];

  departments = ['Cardiology', 'Neurology', 'Pediatrics'];

  hospitals = [
    { hospital: 'El-Azhar Hospital', distance: 15, budget: 800, healthInsurance: 'no', department: 'Cardiology', city: 'Cairo', area: 'Nasr City', insuranceName: 'MedCare' },
    { hospital: 'Alexandria Hospital', distance: 20, budget: 600, healthInsurance: 'yes', department: 'Neurology', city: 'Alexandria', area: 'Gleem', insuranceName: 'HealthPlus' },
    { hospital: 'Aswan Medical Center', distance: 10, budget: 1000, healthInsurance: 'no', department: 'Pediatrics', city: 'Aswan', area: 'Downtown', insuranceName: 'MedCare' },
    { hospital: 'Cairo Care', distance: 12, budget: 300, healthInsurance: 'yes', department: 'Cardiology', city: 'Cairo', area: 'Maadi', insuranceName: 'LifeSecure' }
  ];

  filteredHospitalsList = this.hospitals;

  get filteredHospitals() {
    // Deprecated: use filteredHospitalsList instead
    return this.filteredHospitalsList;
  }

  expanded = false;
  toggleExpand() {
    this.expanded = !this.expanded;
  }

  constructor() {
    this.search(); // Initialize filteredHospitalsList
  }

  validateRange(type: 'max') {
    if (this.maxPrice < 0) {
      this.maxPrice = 0;
    }
  }

  search() {
    // Apply all filters to hospitals array
    this.filteredHospitalsList = this.hospitals.filter(h => {
      // Hospital name filter (case-insensitive, startsWith)
      const matchesHospital = this.searchText === '' || h.hospital.toLowerCase().startsWith(this.searchText.toLowerCase());
      // Department filter
      const matchesDepartment = this.selectedDepartment === '' || h.department === this.selectedDepartment;
      // City filter
      const matchesCity = this.selectedCity === '' || h.city === this.selectedCity;
      // Area filter (case-insensitive)
      const matchesArea = this.selectedArea === '' || (h.area && h.area.toLowerCase() === this.selectedArea.toLowerCase());
      // Insurance name filter (case-insensitive)
      const matchesInsurance = this.insuranceName === '' || (h.insuranceName && h.insuranceName.toLowerCase() === this.insuranceName.toLowerCase());
      // Price range filter
      let matchesPrice = true;
      if (this.selectedPriceRange) {
        const [min, max] = this.selectedPriceRange.split('-');
        if (max) {
          matchesPrice = h.budget >= +min && h.budget <= +max;
        } else {
          matchesPrice = h.budget >= +min;
        }
      }
      // Distance filter
      let matchesDistance = true;
      if (this.selectedDistance) {
        const [minD, maxD] = this.selectedDistance.split('-');
        if (maxD) {
          matchesDistance = h.distance >= +minD && h.distance <= +maxD;
        } else {
          matchesDistance = h.distance >= +minD;
        }
      }
      return matchesHospital && matchesDepartment && matchesCity && matchesArea && matchesInsurance && matchesPrice && matchesDistance;
    });
  }
}
