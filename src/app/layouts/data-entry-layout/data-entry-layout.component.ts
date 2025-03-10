import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-data-entry-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './data-entry-layout.component.html',
  styleUrl: './data-entry-layout.component.scss'
})
export class DataEntryLayoutComponent {

}
