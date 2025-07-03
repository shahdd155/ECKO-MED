import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PatientsService } from '../../../core/services/patient/patients.service';
import { CommonModule } from '@angular/common';
import { Ad } from '../../../models/Ad';
import { AdsService } from '../../../core/services/Ad.service';

export type AdsResponse = Ad[];

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
  private adsService = inject(AdsService);

  ads: Ad[] = [];

  ngOnInit(): void {
    this.patientsService.getDashboardData().subscribe(data => {
      this.userName = data.username;
      if (data.imageBase64) {
        this.userImage = 'data:image/png;base64,' + data.imageBase64;
      }
    });

    this.adsService.getAds().subscribe(ads => {
      this.ads = ads;
    });
  }


}
