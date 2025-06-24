import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Department {
  id: string;
  name: string;
  description: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  waitingTime: string;
  condition: string;
}

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Department.component.html',
  styleUrl: './Department.component.scss'
})
export class DepartmentComponent implements OnInit {
  departments: Department[] = [
    { id: 'cardio', name: 'Cardiology', description: 'Heart and cardiovascular system' },
    { id: 'neuro', name: 'Neurology', description: 'Brain and nervous system' },
    { id: 'ortho', name: 'Orthopedics', description: 'Bones and joints' },
    { id: 'pedia', name: 'Pediatrics', description: 'Children\'s healthcare' },
    { id: 'derm', name: 'Dermatology', description: 'Skin conditions' }
  ];

  patients: Patient[] = [];
  selectedDepartment: Department | null = null;
  selectedPatient: Patient | null = null;
  isLoading: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onDepartmentSelect(department: Department): void {
    this.selectedDepartment = department;
    this.selectedPatient = null;
    this.loadDepartmentPatients(department.id);
  }

  loadDepartmentPatients(departmentId: string): void {
    this.isLoading = true;
    // Simulating API call with setTimeout
    setTimeout(() => {
      // Sample data - in real app, this would come from an API
      this.patients = [
        {
          id: '1',
          name: 'John Smith',
          age: 45,
          gender: 'Male',
          waitingTime: '30 mins',
          condition: 'Chest Pain'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          age: 32,
          gender: 'Female',
          waitingTime: '45 mins',
          condition: 'Migraine'
        },
        {
          id: '3',
          name: 'Michael Brown',
          age: 28,
          gender: 'Male',
          waitingTime: '1 hour',
          condition: 'Sprained Ankle'
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  onPatientSelect(patient: Patient): void {
    this.selectedPatient = patient;
  }

  startPatientInteraction(): void {
    if (this.selectedPatient) {
      // Navigate to PatientInteraction component with patient ID
      this.router.navigate(['/patientinteraction'], {
        queryParams: { patientId: this.selectedPatient.id }
      });
    }
  }
}
