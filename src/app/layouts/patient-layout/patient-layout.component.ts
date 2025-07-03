import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-layout',
  imports: [RouterOutlet, FooterComponent, NavbarComponent, CommonModule],
  templateUrl: './patient-layout.component.html',
  styleUrl: './patient-layout.component.scss'
})
export class PatientLayoutComponent {
  showNavbar = false;
  toggleNavbar() {
    this.showNavbar = !this.showNavbar;
  }
  closeNavbar() {
    this.showNavbar = false;
  }
}
