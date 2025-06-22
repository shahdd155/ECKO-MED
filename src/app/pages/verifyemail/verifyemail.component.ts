import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-verifyemail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verifyemail.component.html',
  styleUrl: './verifyemail.component.scss'
})
export class VerifyemailComponent {
  userEmail: string = 'useremail@gmail.com';
  constructor() {}


}
