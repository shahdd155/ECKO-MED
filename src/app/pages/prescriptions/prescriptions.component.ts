import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prescriptions',
  imports: [],
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.scss'
})
export class PrescriptionsComponent {
  // Define the prescriptions property with dummy data
  prescriptions = [
    { medicineName: 'Medicine A', date: '2023-10-01', dosage: '10mg', frequency: 'Once a day', duration: '1 month', notes: 'Take with food.' },
    { medicineName: 'Medicine B', date: '2023-09-15', dosage: '5mg', frequency: 'Twice a day', duration: '2 weeks', notes: 'Avoid alcohol.' },
    { medicineName: 'Medicine C', date: '2023-08-20', dosage: '20mg', frequency: 'Once every 12 hours', duration: '3 months', notes: 'Take as directed.' }
  ];

  constructor(private router: Router) {}

  // Method to navigate to /myvisits
  navigateToMyVisits() {
    this.router.navigate(['/myvisits']);
  }
}