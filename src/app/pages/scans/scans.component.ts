import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Scan } from '../../models/scan'; // Import the Scan interface

@Component({
  selector: 'app-scans',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './scans.component.html',
  styleUrl: './scans.component.scss'
})
export class ScansComponent {
  // Define the scans property with dummy data using the Scan interface
  scans: Scan[] = [
    { type: 'MRI', date: '2023-10-01', imageUrl: 'https://via.placeholder.com/150', description: 'Detailed MRI scan of the brain.' },
    { type: 'CT Scan', date: '2023-09-15', imageUrl: 'https://via.placeholder.com/150', description: 'CT scan of the head.' },
    { type: 'X-Ray', date: '2023-08-20', imageUrl: 'https://via.placeholder.com/150', description: 'X-ray of the skull.' }
  ];

  constructor(private router: Router) {}


}