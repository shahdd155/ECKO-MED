import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Scan } from '../../../models/scan'; // Import the Scan interface
import { PatientsService } from '../../../core/services/patient/patients.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scans',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './scans.component.html',
  styleUrl: './scans.component.scss'
})
export class ScansComponent implements OnInit {
  scans: Scan[] = [];

  private patientsService = inject(PatientsService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const visitId = this.route.snapshot.paramMap.get('id');
    if (visitId) {
      this.patientsService.getScans(+visitId).subscribe((data: Scan[]) => {
        this.scans = data;
      });
    }
  }
}