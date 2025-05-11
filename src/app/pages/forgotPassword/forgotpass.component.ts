import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgotpass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgotpass.component.html',
  styleUrl: './forgotpass.component.scss'
})
export class ForgotpassComponent {
  private readonly router = inject(Router);
  step: number = 1;

  verifyEmail: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  verifyCode: FormGroup = new FormGroup({
    resetCode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{5,}$/)])
  });

  resetPassword: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ])
  });

  private readonly authService = inject(AuthService);

  verifyEmailSubmit(): void {
    let emailValue = this.verifyEmail.get('email')?.value;
    this.resetPassword.get('email')?.patchValue(emailValue);
    this.authService.setEmailVerify(this.verifyEmail.value).subscribe({
      next: (res:any) => {
        if (res.statusMsg === "success") {
          this.step = 2;
        }
      }
    });
  }

  verifyCodeSubmit(): void {
    this.authService.setCodeVerify(this.verifyCode.value).subscribe({
      next: (res) => {
        if (res.status === "Success") {
          this.step = 3;
        }
      }
    });
  }

  verifyPasswordSubmit(): void {
    this.authService.resetPassword(this.resetPassword.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        // this.authService.getUserData();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Reset password error:', error);
      } 
    });
  }
}
