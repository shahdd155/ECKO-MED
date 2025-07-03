import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-pharmacy-layout',
  imports: [RouterOutlet, FooterComponent, NavbarComponent, CommonModule],
  templateUrl: './pharmacy-layout.component.html',
  styleUrl: './pharmacy-layout.component.scss'
})
export class PharmacyLayoutComponent {
  showNavbar = false;
  toggleNavbar() {
    this.showNavbar = !this.showNavbar;
  }
  closeNavbar() {
    this.showNavbar = false;
  }
}
