import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-entry-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './data-entry-layout.component.html',
  styleUrl: './data-entry-layout.component.scss'
})
export class DataEntryLayoutComponent {
  showNavbar = false;
  toggleNavbar() {
    this.showNavbar = !this.showNavbar;
  }
  closeNavbar() {
    this.showNavbar = false;
  }
}
