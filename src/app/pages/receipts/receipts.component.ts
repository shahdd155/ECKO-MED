import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receipts',
  imports: [],
  templateUrl: './receipts.component.html',
  styleUrl: './receipts.component.scss'
})
export class ReceiptsComponent {
  // Define the receipt property with dummy data
  receipt = {
    patientName: 'John Doe',
    visitDate: '2023-10-01',
    doctor: 'Dr. Ali',
    charges: [
      { description: 'Consultation', amount: 150 },
      { description: 'MRI Scan', amount: 500 },
      { description: 'Prescription', amount: 20 }
    ],
    total: 670
  };

  constructor(private router: Router) {}

  // Method to navigate to /myvisits
  navigateToMyVisits() {
    this.router.navigate(['/myvisits']);
  }
}