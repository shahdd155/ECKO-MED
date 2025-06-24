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
    { hospital: 'El-Azhar Hospital', distance: 15, budget: 800, department: 'Cardiology', area: 'Nasr City', insuranceName: 'MedCare', availability: 15, coordinates: { lat: 30.0444, lng: 31.2357 } },
    { hospital: 'Alexandria Hospital', distance: 20, budget: 600, department: 'Neurology', area: 'Gleem', insuranceName: 'HealthPlus', availability: 12, coordinates: { lat: 31.2001, lng: 29.9187 } },
    { hospital: 'Aswan Medical Center', distance: 10, budget: 1000, department: 'Pediatrics', area: 'Downtown', insuranceName: 'MedCare', availability: 8, coordinates: { lat: 24.0889, lng: 32.8998 } },
    { hospital: 'Cairo Care', distance: 12, budget: 300, department: 'Cardiology', area: 'Maadi', insuranceName: 'LifeSecure', availability: 5, coordinates: { lat: 29.9792, lng: 31.1342 } }
  ];

  filteredHospitalsList = this.hospitals;

  get filteredHospitals() {
    return this.filteredHospitalsList;
  }

  expanded = false;
  toggleExpand() {
    this.expanded = !this.expanded;
  }

  constructor() {
    this.search(); 
  }

  validateRange(type: 'max') {
    if (this.maxPrice < 0) {
      this.maxPrice = 0;
    }
  }

  search() {
   
    this.filteredHospitalsList = this.hospitals.filter(h => {
  
      const matchesHospital = this.searchText === '' || h.hospital.toLowerCase().startsWith(this.searchText.toLowerCase());
      // Department filter
      const matchesDepartment = this.selectedDepartment === '' || h.department === this.selectedDepartment;
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
      return matchesHospital && matchesDepartment && matchesArea && matchesInsurance && matchesPrice && matchesDistance;
    });
  }

 
  getAvailabilityColor(availability: number): string {
    if (availability >= 0 && availability <= 5) {
      return 'bg-green-500';
    } else if (availability >= 6 && availability <= 10) {
      return 'bg-orange-500';
    } else if (availability >= 11 && availability <= 15) {
      return 'bg-red-500';
    } else {
      return 'bg-gray-400'; // fallback color
    }
  }

  openInMaps(hospital: any) {
    const { lat, lng } = hospital.coordinates;
    const hospitalName = encodeURIComponent(hospital.hospital);
    
    // Open in Google Maps
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&t=m`;
    
    // Alternative: Open in Apple Maps (for iOS users)
    // const appleMapsUrl = `https://maps.apple.com/?q=${hospitalName}&ll=${lat},${lng}&z=15`;
    
    window.open(googleMapsUrl, '_blank');
  }
}