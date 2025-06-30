import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataEntryService, UpdateDataEntryProfileDto, Department } from '../../../core/services/DataEntry/DataEntry.service';
import { DataEntryProfile } from '../../../models/user.model';

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
          email: profile.email,
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
            ...this.currentProfile!,
            ...updateData,
            email: this.currentProfile!.email,
            // departments will be handled separately if needed
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
        email: this.currentProfile.email,
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
    return this.currentProfile?.profilePicture || '';
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      // You can implement upload logic here
      console.log('Selected file:', input.files[0]);
    }
  }

  isDepartmentSelected(department: string): boolean {
    return this.profileForm.value.departments
      ? this.profileForm.value.departments.includes(department)
      : (this.currentProfile?.departments?.includes(department) ?? false);
  }

  onDepartmentChange(department: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    let departments = this.profileForm.value.departments || [...(this.currentProfile?.departments || [])];
    if (checked) {
      if (!departments.includes(department)) {
        departments.push(department);
      }
    } else {
      departments = departments.filter((d: string) => d !== department);
    }
    this.profileForm.patchValue({ departments });
  }
}
