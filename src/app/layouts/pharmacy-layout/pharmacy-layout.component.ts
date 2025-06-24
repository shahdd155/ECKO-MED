import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from "../navbar/navbar.component";
@Component({
  selector: 'app-pharmacy-layout',
  imports: [RouterOutlet, FooterComponent, NavbarComponent],
  templateUrl: './pharmacy-layout.component.html',
  styleUrl: './pharmacy-layout.component.scss'
})
export class PharmacyLayoutComponent {

}
