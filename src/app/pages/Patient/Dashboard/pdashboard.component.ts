import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PatientsService } from '../../../core/services/patient/patients.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-pdashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './pdashboard.component.html',
  styleUrl: './pdashboard.component.scss'
})
export class PdashboardComponent implements OnInit {
  
  userName = '';
  userImage: string | null = null;
  
  // These seem to be static or from another source, leaving them for now.
  hospitalName= 'alsalam';
  dName='Ahmed';

  private patientsService = inject(PatientsService);

  ngOnInit(): void {
    this.patientsService.getDashboardData().subscribe(data => {
      this.userName = data.username;
      if (data.imageBase64) {
        this.userImage = 'data:image/png;base64,' + data.imageBase64;
      }
    });
  }

  // visits = [];
  // clinics = [];
  // news = [];
  // profile = {};
}
