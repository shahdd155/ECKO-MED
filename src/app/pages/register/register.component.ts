import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

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
  imagePreviewUrl: string | null = null;

  // UI State
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  // Validation states
  isCheckingUsername = false;
  isCheckingEmail = false;
  isCheckingPhone = false;
  usernameAvailable: boolean | null = null;
  emailAvailable: boolean | null = null;
  phoneAvailable: boolean | null = null;

  static confirmPassword(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    this.setupValidationListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup real-time validation listeners
   */
  private setupValidationListeners(): void {
    // Username validation
    this.registerForm.get('username')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(username => {
        if (username && this.registerForm.get('username')?.valid) {
          this.validateUsername(username);
        } else {
          this.usernameAvailable = null;
        }
      });

    // Email validation
    this.registerForm.get('email')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(email => {
        if (email && this.registerForm.get('email')?.valid) {
          this.validateEmail(email);
        } else {
          this.emailAvailable = null;
        }
      });

    // Phone validation
    this.registerForm.get('phoneNumber')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(phone => {
        if (phone && this.registerForm.get('phoneNumber')?.valid) {
          this.validatePhone(phone);
        } else {
          this.phoneAvailable = null;
        }
      });
  }

  /**
   * Validate username availability
   */
  private validateUsername(username: string): void {
    this.isCheckingUsername = true;
    this.usernameAvailable = null;

    this.authService.validateUsername(username).subscribe({
      next: (response) => {
        this.isCheckingUsername = false;
        this.usernameAvailable = response.available;
        if (!response.available) {
          this.registerForm.get('username')?.setErrors({ usernameTaken: true });
        }
      },
      error: (error) => {
        this.isCheckingUsername = false;
        console.error('Username validation error:', error);
        this.usernameAvailable = null;
      }
    });
  }

  /**
   * Validate email availability
   */
  private validateEmail(email: string): void {
    this.isCheckingEmail = true;
    this.emailAvailable = null;

    this.authService.validateEmail(email).subscribe({
      next: (response) => {
        this.isCheckingEmail = false;
        this.emailAvailable = response.available;
        if (!response.available) {
          this.registerForm.get('email')?.setErrors({ emailTaken: true });
        }
      },
      error: (error) => {
        this.isCheckingEmail = false;
        console.error('Email validation error:', error);
        this.emailAvailable = null;
      }
    });
  }

  /**
   * Validate phone availability
   */
  private validatePhone(phone: string): void {
    this.isCheckingPhone = true;
    this.phoneAvailable = null;

    this.authService.validatePhone(phone).subscribe({
      next: (response) => {
        this.isCheckingPhone = false;
        this.phoneAvailable = response.available;
        if (!response.available) {
          this.registerForm.get('phoneNumber')?.setErrors({ phoneTaken: true });
        }
      },
      error: (error) => {
        this.isCheckingPhone = false;
        console.error('Phone validation error:', error);
        this.phoneAvailable = null;
      }
    });
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
   * Check if form is ready for submission
   */
  isFormReady(): boolean {
    return this.registerForm.valid && 
           this.usernameAvailable === true && 
           this.emailAvailable === true && 
           this.phoneAvailable === true &&
           !this.isCheckingUsername &&
           !this.isCheckingEmail &&
           !this.isCheckingPhone;
  }

  /**
   * Get validation status for a field
   */
  getFieldStatus(fieldName: string): 'valid' | 'invalid' | 'checking' | 'neutral' {
    const control = this.registerForm.get(fieldName);
    if (!control) return 'neutral';

    if (fieldName === 'username' && this.isCheckingUsername) return 'checking';
    if (fieldName === 'email' && this.isCheckingEmail) return 'checking';
    if (fieldName === 'phoneNumber' && this.isCheckingPhone) return 'checking';

    if (control.invalid && control.touched) return 'invalid';
    if (control.valid && control.touched) return 'valid';
    return 'neutral';
  }

  /**
   * Get validation message for a field
   */
  getFieldMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (!control) return '';

    if (control.hasError('required')) return `${fieldName} is required`;
    if (control.hasError('email')) return 'Please enter a valid email address';
    if (control.hasError('minlength')) return `${fieldName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    if (control.hasError('maxlength')) return `${fieldName} must be at most ${control.errors?.['maxlength'].requiredLength} characters`;
    if (control.hasError('pattern')) return `Please enter a valid ${fieldName}`;
    if (control.hasError('usernameTaken')) return 'Username is already taken';
    if (control.hasError('emailTaken')) return 'Email is already registered';
    if (control.hasError('phoneTaken')) return 'Phone number is already registered';
    if (control.hasError('mismatch')) return 'Passwords do not match';

    return '';
  }

  /**
   * Submit registration form
   */
  submitForm(): void {
    if (!this.isFormReady()) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

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
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = response.message || 'Registration successful! Please check your email to verify your account.';
        
        // Clear form after successful registration
        this.registerForm.reset();
        this.selectedFile = null;
        this.imagePreviewUrl = null;
        this.usernameAvailable = null;
        this.emailAvailable = null;
        this.phoneAvailable = null;
        
        // Navigate to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        console.error('Registration failed:', error);
        
        // Clear error message after 5 seconds
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

  /**
   * Clear all validation states
   */
  clearValidationStates(): void {
    this.usernameAvailable = null;
    this.emailAvailable = null;
    this.phoneAvailable = null;
    this.errorMessage = '';
    this.successMessage = '';
  }
}