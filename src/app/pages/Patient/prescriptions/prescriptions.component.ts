import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PatientsService } from '../../../core/services/patient/patients.service';
import { CommonModule } from '@angular/common';
import { Prescription } from '../../../models/patient-record.model';

@Component({
  selector: 'app-prescriptions',
  imports: [RouterLink, CommonModule],
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.scss'
})
export class PrescriptionsComponent implements OnInit {
  prescriptions: Prescription[] = [];
  
  private patientsService = inject(PatientsService);
  private route = inject(ActivatedRoute);


  ngOnInit(): void {
    const visitId = this.route.snapshot.paramMap.get('id');
    if (visitId) {
      this.patientsService.getPrescriptions(+visitId).subscribe((data: Prescription[]) => {
        this.prescriptions = data;
      });
    }
  }
}