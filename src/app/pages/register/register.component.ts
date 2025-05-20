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
    gender: new FormControl(null, [Validators.required]),
    dateOfBirth: new FormControl(null, [Validators.required]),
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
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]),
    confirmPassword: new FormControl(null, [Validators.required])
  }, { validators: RegisterComponent.confirmPassword });

  selectedFile: File | null = null;

  static confirmPassword(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.selectedFile = file || null;
  }

  submitForm(): void {
    if (this.registerForm.invalid) return;

    const formData = new FormData();

    // Append all user fields as strings
    formData.append('firstName', this.registerForm.get('firstName')?.value || '');
    formData.append('lastName', this.registerForm.get('lastName')?.value || '');
    formData.append('gender', this.registerForm.get('gender')?.value || '');
    formData.append('dateOfBirth', this.registerForm.get('dateOfBirth')?.value || '');
    formData.append('phoneNumber', this.registerForm.get('phoneNumber')?.value || '');
    formData.append('username', this.registerForm.get('username')?.value || '');
    formData.append('email', this.registerForm.get('email')?.value || '');
    formData.append('street', this.registerForm.get('street')?.value || '');
    formData.append('city', this.registerForm.get('city')?.value || '');
    formData.append('country', this.registerForm.get('country')?.value || '');
    formData.append('password', this.registerForm.get('password')?.value || '');
    formData.append('confirmPassword', this.registerForm.get('confirmPassword')?.value || '');

    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    }

    this.authService.register(formData).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (error) => {
        console.error('Registration failed', error);
      }
    });
  }
}