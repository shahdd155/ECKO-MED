import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserLogin } from '../../../models/loginModels';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
    rememberMe: new FormControl(false),
  });

  submitLogin(): void {
    if (this.loginForm.valid) {
      const credentials: UserLogin = this.loginForm.value;
      this.authService.loginPharmacy(credentials).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.router.navigate(['/patient/dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    }
  }
}