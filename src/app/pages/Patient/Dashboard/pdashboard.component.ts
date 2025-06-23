import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-pdashboard',
  imports: [RouterLink],
  templateUrl: './pdashboard.component.html',
  styleUrl: './pdashboard.component.scss'
})
export class PdashboardComponent {
  //user name from backend
  
  userName = 'Fawaz Al-Momtaz';
  hospitalName= 'alsalam';
  dName='Ahmed';

  // visits list from backend
  // visits = [];

  //clinics/news/cards from backend
  // clinics = [];
  // news = [];

  //user profile info from backend
  // profile = {};

}
