import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // ... existing code ...
registerForm: FormGroup = new FormGroup({
  firstName: new FormControl(null, [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(20),
    Validators.pattern(/^[a-zA-Z\s]*$/)
  ]),
  lastName: new FormControl(null, [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(20),
    Validators.pattern(/^[a-zA-Z\s]*$/)
  ]),
  gender: new FormControl(null, [
    Validators.required
  ]),
  dateOfBirth: new FormControl(null, [
    Validators.required
  ]),
  phoneNumber: new FormControl(null, [
    Validators.required,
    Validators.pattern(/^01[0125]\d{8}$/)
  ]),
  username: new FormControl(null, [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(20),
    Validators.pattern(/^[a-zA-Z0-9_]*$/)
  ]),
  email: new FormControl(null, [
    Validators.required,
    Validators.email,
    Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  ]),
  street: new FormControl(null, [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(100)
  ]),
  city: new FormControl(null, [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern(/^[a-zA-Z\s]*$/)
  ]),
  country: new FormControl(null, [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern(/^[a-zA-Z\s]*$/)
  ]),
  profilePic: new FormControl(null),
  password: new FormControl(null, [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  ]),
  confirmPassword: new FormControl(null, [
    Validators.required
  ])
}, { validators: this.confirmPassword });

  submitForm(): void {
    if (this.registerForm.valid) {
      const userData: User = this.registerForm.value;
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          if (error instanceof SyntaxError) {
            console.error('Invalid JSON response:', error.message);
          } else {
            console.error('Server error:', error.message);
          }
        }
      });
    }
  }

  confirmPassword(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
}