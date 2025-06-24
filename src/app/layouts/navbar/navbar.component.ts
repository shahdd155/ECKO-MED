import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule, RouterModule, NgxSpinnerModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly authService = inject(AuthService)
  isLogin = input<boolean>(true);
  isPatient = input<boolean>(true);
  isPharmacy = input<boolean>(false);

  getUserType(): 'patient' | 'dataEntry' | 'pharmacy' {
    if (this.isPharmacy()) {
      return 'pharmacy';
    } else if (this.isPatient()) {
      return 'patient';
    } else {
      return 'dataEntry';
    }
  }

  logOut(): void {
    this.authService.logout();
  }
}