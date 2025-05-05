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
  price = 1000;
  selectedDepartment = '';

  departments = ['Cardiology', 'Neurology', 'Pediatrics'];

  hospitals = [
    { hospital: 'El-Azhar Hospital', distance: 15, budget: 800, healthInsurance: 'no', department: 'Cardiology' },
    { hospital: 'Alexandria Hospital', distance: 20, budget: 600, healthInsurance: 'yes', department: 'Neurology' },
    { hospital: 'Aswan Medical Center', distance: 10, budget: 1000, healthInsurance: 'no', department: 'Pediatrics' },
    { hospital: 'Cairo Care', distance: 12, budget: 300, healthInsurance: 'yes', department: 'Cardiology' }
  ];

  get filteredHospitals() {
    return this.hospitals.filter(h =>
      h.hospital.toLowerCase().startsWith(this.searchText.toLowerCase()) &&
      h.budget <= this.price &&
      (this.selectedDepartment === '' || h.department === this.selectedDepartment)
    );
  }

  expanded = false;
  toggleExpand() {
    this.expanded = !this.expanded;
  }

}
