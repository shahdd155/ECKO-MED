import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataEntryService, UserData, AddPatientDto, Department } from '../../../core/services/DataEntry/DataEntry.service';

@Component({
  selector: 'app-addpatient',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addpatient.component.html',
  styleUrl: './addpatient.component.scss'
})
export class AddpatientComponent implements OnInit {

  // Form for patient data
  patientForm: FormGroup;
  
  // Available departments list - will be loaded from backend
  availableDepartments: Department[] = [];

  // Loading and error states
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private dataEntryService: DataEntryService
  ) {
    // Initialize the reactive form
    this.patientForm = this.formBuilder.group({
      // User Information
      userId: ['', [Validators.required]],
      
      // Auto-filled from backend (read-only)
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: [''],
      
      // Address Information (from backend)
      street: ['', [Validators.required]], // Mapped from 'address' in backend
      city: ['', [Validators.required]],
      
      // Patient Entry Information
      department: ['', [Validators.required]],
      doctorName: ['Dr. Default', [Validators.required]], // Added field
      entryDateTime: [this.getCurrentDateTime(), [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Load available departments on component initialization
    this.loadAvailableDepartments();
  }

  /**
   * Load available departments from backend
   */
  private loadAvailableDepartments(): void {
    this.isLoading = true;
    
    this.dataEntryService.getAvailableDepartments().subscribe({
      next: (departments) => {
        this.availableDepartments = departments;
        this.isLoading = false;
        console.log('Departments loaded successfully:', departments.length, 'departments');
      },
      error: (error: any) => {
        console.error('Failed to load departments:', error);
        this.isLoading = false;
        
        this.errorMessage = 'Failed to load departments. Using default list.';
        setTimeout(() => this.errorMessage = '', 5000);
        
        // Fallback to default departments if API fails
        this.availableDepartments = [
          { name: 'Emergency', description: '', capacity: 0, numOfDoctors: 0 },
          { name: 'Cardiology', description: '', capacity: 0, numOfDoctors: 0 },
          { name: 'Neurology', description: '', capacity: 0, numOfDoctors: 0 }
        ];
      }
    });
  }

  /**
   * Gets current date and time in YYYY-MM-DDTHH:mm format
   */
  getCurrentDateTime(): string {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }

  /**
   * Fetches user data from backend based on user ID
   */
  fetchUserData(): void {
    const userId = this.patientForm.get('userId')?.value;
    
    if (!userId || !userId.trim()) {
      this.errorMessage = 'Please enter a User ID first';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.dataEntryService.fetchUserData(userId.trim()).subscribe({
      next: (userData: UserData) => {
        this.patientForm.patchValue({
          firstName: userData.firstName,
          lastName: userData.lastName,
          dateOfBirth: new Date(userData.dateOfBirth).toISOString().split('T')[0],
          gender: userData.gender,
          phoneNumber: userData.phoneNumber,
          email: userData.email,
          street: userData.address, // Map 'address' from backend to 'street' in form
          city: userData.city
        });
        
        this.isLoading = false;
        this.successMessage = 'User data fetched successfully!';
        setTimeout(() => this.successMessage = '', 3000);
        
        console.log('User data fetched for ID:', userId.trim());
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to fetch user data';
        console.error('Error fetching user data:', error);
      }
    });
  }

  /**
   * Saves the new patient
   */
  savePatient(): void {
    if (this.patientForm.valid) {
      this.isSaving = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const formValues = this.patientForm.value;
      
      const newPatient: AddPatientDto = {
        userId: formValues.userId,
        departmentName: formValues.department,
        doctorName: formValues.doctorName,
        dateTime: new Date(formValues.entryDateTime)
      };
      
      this.dataEntryService.createPatient(newPatient).subscribe({
        next: (response) => {
          this.isSaving = false;
          this.successMessage = response.message || 'Patient added successfully!';
          
          setTimeout(() => {
            this.successMessage = '';
            this.resetForm();
          }, 3000);
          
          console.log('New patient created:', response);
        },
        error: (error: any) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Failed to create patient';
          console.error('Error creating patient:', error);
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.markFormGroupTouched();
    }
  }

  /**
   * Resets the form to initial state
   */
  resetForm(): void {
    this.patientForm.reset();
    this.patientForm.patchValue({
      entryDateTime: this.getCurrentDateTime()
    });
    this.errorMessage = '';
    this.successMessage = '';
    this.patientForm.markAsUntouched();
    this.patientForm.markAsPristine();
  }

  /**
   * Cancels the form and resets it
   */
  cancelForm(): void {
    this.resetForm();
  }

  /**
   * Marks all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.patientForm.controls).forEach(key => {
      const control = this.patientForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Gets the current age from date of birth
   */
  getAge(): number | null {
    const dob = this.patientForm.get('dateOfBirth')?.value;
    if (!dob) return null;
    
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}
