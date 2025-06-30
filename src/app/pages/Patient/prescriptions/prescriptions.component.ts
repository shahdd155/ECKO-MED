import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientsService } from '../../../core/services/patient/patients.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prescriptions',
  imports: [RouterLink, CommonModule],
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.scss'
})
export class PrescriptionsComponent implements OnInit {
  prescriptions: any[] = [];
  
  private patientsService = inject(PatientsService);
  private route = inject(ActivatedRoute);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const visitId = this.route.snapshot.paramMap.get('id');
    if (visitId) {
      this.patientsService.getPrescriptions(+visitId).subscribe(data => {
        this.prescriptions = data;
      });
    }
  }
}