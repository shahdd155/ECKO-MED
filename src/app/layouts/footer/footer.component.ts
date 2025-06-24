import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private readonly authService = inject(AuthService)
  isLogin = input<boolean>(true);
  isPatient = input<boolean>(true);
  isdataEntry = input<boolean>(false);

  getUserType(): 'patient' | 'dataEntry' {
    if (this.isPatient()) {
      return 'patient';
    } else if(this.isdataEntry()) {
      return 'dataEntry';
    }
    return 'patient'; 
  }
}
