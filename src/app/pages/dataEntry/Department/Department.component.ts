import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataEntryService, Department, PatientInDepartment } from '../../../core/services/DataEntry/DataEntry.service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Department.component.html',
  styleUrls: ['./Department.component.scss']
})
export class DepartmentComponent implements OnInit {
  departments: Department[] = [];
  patients: PatientInDepartment[] = [];
  selectedDepartment: Department | null = null;
  selectedPatient: PatientInDepartment | null = null;
  isLoading: boolean = false;
  isLoadingDepartments: boolean = false;

  constructor(
    private router: Router,
    private dataEntryService: DataEntryService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoadingDepartments = true;
    this.dataEntryService.getAvailableDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.isLoadingDepartments = false;
      },
      error: (err) => {
        console.error('Failed to load departments', err);
        this.isLoadingDepartments = false;
        // Optionally show an error message to the user
      }
    });
  }

  onDepartmentSelect(department: Department): void {
    this.selectedDepartment = department;
    this.selectedPatient = null;
    this.loadDepartmentPatients(department.name);
  }

  loadDepartmentPatients(departmentName: string): void {
    this.isLoading = true;
    this.dataEntryService.getDepartmentPatients(departmentName).subscribe({
      next: (data) => {
        this.patients = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(`Failed to load patients for ${departmentName}`, err);
        this.isLoading = false;
        this.patients = []; // Clear patients on error
      }
    });
  }

  onPatientSelect(patient: PatientInDepartment): void {
    this.selectedPatient = patient;
  }

  startPatientInteraction(): void {
    if (this.selectedPatient) {
      // The backend needs to provide the patient's ID to navigate.
      console.error('Cannot start interaction: Patient ID is missing from the backend response.');
      // this.router.navigate(['/data-entry/patient-interaction'], {
      //   queryParams: { patientId: this.selectedPatient.id } // .id does not exist
      // });
    }
  }
}
