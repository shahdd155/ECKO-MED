import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataEntryService, DataEntryProfile, UpdateDataEntryProfileDto, Department } from '../../../core/services/DataEntry/DataEntry.service';

@Component({
  selector: 'app-dentryprofile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dentryprofile.component.html',
  styleUrls: ['./dentryprofile.component.scss']
})
export class DentryprofileComponent implements OnInit {
  
  profileForm: FormGroup;
  currentProfile: DataEntryProfile | null = null;
  availableDepartments: Department[] = [];
  
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private dataEntryService: DataEntryService
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.dataEntryService.fetchDataEntryProfile().subscribe({
      next: (profile: DataEntryProfile) => {
        this.currentProfile = profile;
        
        this.profileForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.emailAddress,
          phoneNumber: profile.phoneNumber
        });
        
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to load profile';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.valid && this.currentProfile) {
      this.isSaving = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const formValues = this.profileForm.getRawValue();

      const updateData: UpdateDataEntryProfileDto = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        phoneNumber: formValues.phoneNumber
      };
      
      this.dataEntryService.updateDataEntryProfile(updateData).subscribe({
        next: (response: any) => {
          this.currentProfile = {
            ...updateData,
            emailAddress: this.currentProfile!.emailAddress,
            hospitalName: this.currentProfile?.hospitalName || '',
            city: this.currentProfile?.city || '',
            profilePicture: this.currentProfile?.profilePicture
          };
          
          this.isSaving = false;
          this.successMessage = response.message || 'Profile updated successfully!';
          
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error: any) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Failed to update profile';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.markFormGroupTouched();
    }
  }

  cancelChanges(): void {
    if (this.currentProfile) {
      this.profileForm.patchValue({
        firstName: this.currentProfile.firstName,
        lastName: this.currentProfile.lastName,
        email: this.currentProfile.emailAddress,
        phoneNumber: this.currentProfile.phoneNumber
      });
      this.errorMessage = '';
      this.successMessage = '';
      this.profileForm.markAsUntouched();
      this.profileForm.markAsPristine();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  getProfilePictureUrl(): string {
    return this.currentProfile?.profilePicture || '/images/default-avatar.png';
  }

  getInitials(): string {
    if (!this.currentProfile) return '';
    const first = this.currentProfile.firstName?.[0] || '';
    const last = this.currentProfile.lastName?.[0] || '';
    return (first + last).toUpperCase();
  }

  hasUnsavedChanges(): boolean {
    return this.profileForm.dirty;
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '/images/default-avatar.png';
  }
}
