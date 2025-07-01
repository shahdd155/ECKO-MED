import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, Router } from '@angular/router';
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
  private readonly router = inject(Router)
  isLogin = input<boolean>(true);
  isPatient = input<boolean>(true);
  isPharmacy = input<boolean>(false);

  getUserType(): 'patient' | 'dataEntry' | 'pharmacy' {
    const currentUrl = this.router.url;
    
    // Check for data entry routes
    if (currentUrl.includes('dEntrydashboard') || 
        currentUrl.includes('addpatient') || 
        currentUrl.includes('dentryprofile') || 
        currentUrl.includes('dentry-helpcenter') ||  
        currentUrl.includes('departmentinteraction') || 
        currentUrl.includes('patientinteraction'))
         {
      return 'dataEntry';
    }
    
    // Check for pharmacy routes
    if (currentUrl.includes('viewrequests') || 
       currentUrl.includes('pharmacy-helpcenter') || 
        currentUrl.includes('managerequests')) {
      return 'pharmacy';
    }
    
    // Default to patient routes
    return 'patient';
  }

  logOut(): void {
    this.authService.logout();
  }
}