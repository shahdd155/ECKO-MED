import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PatientsService } from '../../../core/services/patient/patients.service';
import { CommonModule } from '@angular/common';
import { Visit } from '../../../models/patient-record.model';

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
