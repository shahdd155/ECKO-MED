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
  step = 1;
  isSubmitting = false;
  errorMessage = '';
  
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  verifyEmail = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  verifyCode = new FormGroup({
    resetCode: new FormControl('', [Validators.required])
  });

  resetPassword = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  verifyEmailSubmit(): void {
    if (this.verifyEmail.invalid) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.forgotPassword(this.verifyEmail.value.email!).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.resetPassword.controls.email.setValue(this.verifyEmail.value.email!);
        this.step = 2;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.message || 'An error occurred while verifying the email.';
      }
    });
  }

  verifyCodeSubmit(): void {
    if (this.verifyCode.invalid) return;
    // The "token" is the code the user received.
    // We don't verify it with the backend here, we just pass to the next step.
    this.step = 3;
  }
  
  verifyPasswordSubmit(): void {
    if (this.resetPassword.invalid) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    const resetData = {
      email: this.verifyEmail.value.email!,
      token: this.verifyCode.value.resetCode!,
      newPassword: this.resetPassword.value.newPassword!
    };

    this.authService.resetPassword(resetData).subscribe({
      next: () => {
        this.isSubmitting = false;
        // Optionally show a success message before redirecting
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.message || 'An error occurred while resetting the password.';
      }
    });
  }
}
