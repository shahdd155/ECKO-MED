import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreatePatientDto } from '../../../models/user.model';

@Component({
  selector: 'app-addpatient',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addpatient.component.html',
  styleUrl: './addpatient.component.scss'
})
export class AddpatientComponent implements OnInit {

  // Form for patient data
  patientForm: FormGroup;
  
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
    'Psychiatry',
    'Dermatology',
    'Ophthalmology',
    'Obstetrics and Gynecology'
  ];



  // Loading and error states
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private formBuilder: FormBuilder) {
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
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      
      // Patient Entry Information
      department: ['', [Validators.required]],
      entryDateTime: [this.getCurrentDateTime(), [Validators.required]]
    });
  }

  ngOnInit(): void {
    // No automatic fetching - user will click button to fetch data
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
    
    // Simulate API call to fetch user data
    setTimeout(() => {
      // Sample user data - replace with actual API call
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-05-15',
        gender: 'male',
        phoneNumber: '+1-555-0123',
        email: 'john.doe@email.com',
        street: '123 Main Street',
        city: 'New York'
      };
      
      // Fill the form with fetched data
      this.patientForm.patchValue({
        firstName: userData.firstName,
        lastName: userData.lastName,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        street: userData.street,
        city: userData.city
      });
      
      this.isLoading = false;
      this.successMessage = 'User data fetched successfully!';
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
      
      console.log('User data fetched for ID:', userId.trim());
      // TODO: Implement actual API call to fetch user data
    }, 1000);
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
      
      const newPatient: CreatePatientDto = {
        userId: formValues.userId,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        dateOfBirth: new Date(formValues.dateOfBirth),
        gender: formValues.gender,
        phoneNumber: formValues.phoneNumber,
        email: formValues.email || undefined,
        address: {
          street: formValues.street,
          city: formValues.city
        },
        department: formValues.department,
        entryDateTime: new Date(formValues.entryDateTime)
      };
      
      // Simulate API call
      setTimeout(() => {
        this.isSaving = false;
        this.successMessage = 'Patient added successfully!';
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
          this.resetForm();
        }, 3000);
        
        console.log('New patient created:', newPatient);
        // TODO: Implement actual API call to create patient
      }, 1500);
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
