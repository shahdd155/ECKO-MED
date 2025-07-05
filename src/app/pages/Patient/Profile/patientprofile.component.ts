import { Component, OnInit, inject } from '@angular/core';
import { PatientsService } from '../../../core/services/patient/patients.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-patientprofile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patientprofile.component.html',
  styleUrl: './patientprofile.component.scss'
})
export class PatientprofileComponent implements OnInit {
  profileForm: FormGroup;
  userImage: string | null = null;
  
  private patientsService = inject(PatientsService);
  private fb = inject(FormBuilder);

  constructor() {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      insurance: [''],
      username:['']
    });
  }

  ngOnInit(): void {
    this.patientsService.getProfileData().subscribe(data => {
      this.profileForm.patchValue({
        firstName: data.firstName,
        lastName: data.lastName,
        insurance: data.insurance,
        username: data.username
      });
      if (data.image) {
        this.userImage = 'data:image/png;base64,' + data.image;
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.patientsService.updateProfileImage(file).subscribe(response => {
        if (response.base64Image) {
          this.userImage = 'data:image/png;base64,' + response.base64Image;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.patientsService.updateProfile(this.profileForm.value).subscribe(() => {
        // Optionally show a success message
      });
    }
  }
}
