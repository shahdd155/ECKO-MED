import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PatientsService } from '../../../core/services/patient/patients.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-myvisits',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './myvisits.component.html',
  styleUrls: ['./myvisits.component.scss']
})
export class MyvisitsComponent implements OnInit {

  visits: any[] = [];
  private patientsService = inject(PatientsService);

  ngOnInit(): void {
    this.patientsService.getVisits().subscribe(data => {
      this.visits = data;
    });
  }
}
