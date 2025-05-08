import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Receipt } from '../../models/receipt'; // Import the Receipt interface

@Component({
  selector: 'app-receipts',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './receipts.component.html',
  styleUrl: './receipts.component.scss'
})
export class ReceiptsComponent {
  // Define the receipt property with dummy data
  receipt: Receipt = {
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


}