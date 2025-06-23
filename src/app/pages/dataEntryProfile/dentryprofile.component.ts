import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataEntryProfile, UpdateDataEntryProfileDto } from '../../models/user.model';

@Component({
  selector: 'app-dentryprofile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dentryprofile.component.html',
  styleUrl: './dentryprofile.component.scss'
})
export class DentryprofileComponent implements OnInit {
  
  // Form for editable profile fields
  profileForm: FormGroup;
  
  // Current profile data
  currentProfile: DataEntryProfile | null = null;
  
  // Available departments list
  availableDepartments: string[] = [
    'Emergency',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Radiology',
    'Laboratory',
    'Pharmacy',
    'Surgery',
    'Internal Medicine',
    'Oncology',
    'Psychiatry'
  ];
  
  // Selected file for profile picture
  selectedFile: File | null = null;
  
  // Preview URL for selected image
  imagePreviewUrl: string | null = null;
  
  // Loading and error states
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private formBuilder: FormBuilder) {
    // Initialize the reactive form
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      departments: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  /**
   * Loads the current user's profile data
   * In a real application, this would fetch from a backend service
   */
  loadProfile(): void {
    this.isLoading = true;
    
    // Sample data - replace with actual API call
    setTimeout(() => {
      this.currentProfile = {
        id: 1,
        firstName: 'Abdico',
        lastName: 'ElGEn',
        email: 'abdico.elgen@hospital.com',
        phoneNumber: '+1-555-0123',
        profilePicture: '/images/default-avatar.jpg',
        city: 'Cairo', // Immutable
        hospitalName: 'Shawerma el reem', // Immutable
        departments: ['Emergency', 'Cardiology'],
        employeeId: 'DE001',
        dateJoined: new Date('2025-06-23'),
        isActive: true,
        lastUpdated: new Date()
      };
      
      // Populate the form with current data
      this.profileForm.patchValue({
        firstName: this.currentProfile.firstName,
        lastName: this.currentProfile.lastName,
        email: this.currentProfile.email,
        phoneNumber: this.currentProfile.phoneNumber,
        departments: this.currentProfile.departments
      });
      
      this.isLoading = false;
    }, 1000);
  }

  /**
   * Handles file selection for profile picture
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
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
   * Handles department selection/deselection
   */
  onDepartmentChange(department: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const currentDepartments = this.profileForm.get('departments')?.value || [];
    
    if (checkbox.checked) {
      // Add department if not already present
      if (!currentDepartments.includes(department)) {
        this.profileForm.patchValue({
          departments: [...currentDepartments, department]
        });
      }
    } else {
      // Remove department
      this.profileForm.patchValue({
        departments: currentDepartments.filter((d: string) => d !== department)
      });
    }
  }

  /**
   * Checks if a department is currently selected
   */
  isDepartmentSelected(department: string): boolean {
    const selectedDepartments = this.profileForm.get('departments')?.value || [];
    return selectedDepartments.includes(department);
  }

  /**
   * Saves the profile changes
   */
  saveProfile(): void {
    if (this.profileForm.valid && this.currentProfile) {
      this.isSaving = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const updateData: UpdateDataEntryProfileDto = {
        firstName: this.profileForm.get('firstName')?.value,
        lastName: this.profileForm.get('lastName')?.value,
        email: this.profileForm.get('email')?.value,
        phoneNumber: this.profileForm.get('phoneNumber')?.value,
        departments: this.profileForm.get('departments')?.value
      };
      
      // Simulate API call
      setTimeout(() => {
        // Update current profile with new data
        this.currentProfile = {
          ...this.currentProfile!,
          ...updateData,
          lastUpdated: new Date()
        };
        
        this.isSaving = false;
        this.successMessage = 'Profile updated successfully!';
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        
        console.log('Profile updated:', updateData);
        // TODO: Implement actual API call to update profile
        // TODO: Handle profile picture upload if selectedFile exists
      }, 1500);
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.markFormGroupTouched();
    }
  }

  /**
   * Cancels changes and resets form to original values
   */
  cancelChanges(): void {
    if (this.currentProfile) {
      this.profileForm.patchValue({
        firstName: this.currentProfile.firstName,
        lastName: this.currentProfile.lastName,
        email: this.currentProfile.email,
        phoneNumber: this.currentProfile.phoneNumber,
        departments: this.currentProfile.departments
      });
      
      // Reset file selection
      this.selectedFile = null;
      this.imagePreviewUrl = null;
      
      // Clear messages
      this.errorMessage = '';
      this.successMessage = '';
      
      // Reset form validation state
      this.profileForm.markAsUntouched();
      this.profileForm.markAsPristine();
    }
  }

  /**
   * Marks all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Gets the current profile picture URL for display
   */
  getProfilePictureUrl(): string {
    if (this.imagePreviewUrl) {
      return this.imagePreviewUrl;
    }
    return this.currentProfile?.profilePicture || '/images/default-avatar.png';
  }

  /**
   * Gets initials from first and last name for avatar fallback
   */
  getInitials(): string {
    if (!this.currentProfile) return '';
    const first = this.currentProfile.firstName?.[0] || '';
    const last = this.currentProfile.lastName?.[0] || '';
    return (first + last).toUpperCase();
  }

  /**
   * Checks if the form has unsaved changes
   */
  hasUnsavedChanges(): boolean {
    return this.profileForm.dirty || this.selectedFile !== null;
  }

  /**
   * Handles image loading errors by setting a default image
   */
  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '/images/default-avatar.png';
  }
}
