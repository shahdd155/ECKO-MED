import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private destroy$ = new Subject<void>();

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
  imagePreviewUrl: string | null = null;

  // UI State
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  static confirmPassword(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    // No-op
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle file selection for profile picture
   */
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select a valid image file.';
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size must be less than 5MB.';
        return;
      }
      
      this.selectedFile = file;
      this.errorMessage = '';
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Remove selected file
   */
  removeSelectedFile(): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    // Reset file input
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  /**
   * Submit registration form
   */
  submitForm(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();

    // Append all user fields as strings, except username
    Object.keys(this.registerForm.controls).forEach(key => {
      if (key !== 'username') {
        formData.append(key, this.registerForm.get(key)?.value || '');
      }
    });

    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    }

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        // Display the success message and the username returned from the backend
        this.successMessage = `${response.message}`;
        this.registerForm.reset();
        this.removeSelectedFile();
        // Navigate to login after a delay
        setTimeout(() => {
          this.router.navigate(['/verifyemail']);
        }, 4000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
}