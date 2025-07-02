import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PatientsService } from '../../../core/services/patient/patients.service';
import { CommonModule } from '@angular/common';

// Add this interface at the top or import from a shared model file
export interface Visit {
  Id: number;
  DoctorName: string;
  HospitalName: string;
  visitDate: string;
  Department: string;
}

@Component({
  selector: 'app-myvisits',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './myvisits.component.html',
  styleUrls: ['./myvisits.component.scss']
})
export class MyvisitsComponent implements OnInit {

  visits: Visit[] = [];
  private patientsService = inject(PatientsService);

  ngOnInit(): void {
    this.patientsService.getVisits().subscribe((data: Visit[]) => {
      this.visits = data;
    });
  }
}
