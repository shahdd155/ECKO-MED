import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Prescription } from '../../../models/prescription.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prescriptions',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.scss'
})
export class PrescriptionsComponent implements OnInit {
 
  searchTerm = signal('');
  sortBy = signal('date');
  viewMode = signal<'grid' | 'list'>('grid');

  prescriptions: Prescription[] = [
    {
      id: 1,
      name: 'Amoxicillin 500mg',
      dosage: '500mg',
      frequency: '3 times daily',
      timing: 'After meals',
      medDate: '2024-01-15',
      duration: '7 days',
      doctorNotes: 'Complete the full course. Take with plenty of water. Avoid alcohol during treatment.'
    },
    {
      id: 2,
      name: 'Ibuprofen 400mg',
      dosage: '400mg',
      frequency: 'Every 6 hours',
      timing: 'With food',
      medDate: '2024-01-12',
      duration: '5 days',
      doctorNotes: 'Take with food to prevent stomach upset. Do not exceed 4 tablets per day.'
    },
    {
      id: 3,
      name: 'Metformin 850mg',
      dosage: '850mg',
      frequency: 'Twice daily',
      timing: 'Morning and evening',
      medDate: '2024-01-10',
      duration: '30 days',
      doctorNotes: 'Monitor blood sugar regularly. Take with meals. Report any side effects immediately.'
    },
    {
      id: 4,
      name: 'Lisinopril 10mg',
      dosage: '10mg',
      frequency: 'Once daily',
      timing: 'Morning',
      medDate: '2024-01-08',
      duration: '30 days',
      doctorNotes: 'Take at the same time each day. Monitor blood pressure weekly.'
    },
    {
      id: 5,
      name: 'Omeprazole 20mg',
      dosage: '20mg',
      frequency: 'Once daily',
      timing: 'Before breakfast',
      medDate: '2024-01-05',
      duration: '14 days',
      doctorNotes: 'Take on empty stomach 30 minutes before breakfast. Avoid taking with other medications.'
    },
    {
      id: 6,
      name: 'Cetirizine 10mg',
      dosage: '10mg',
      frequency: 'Once daily',
      timing: 'Evening',
      medDate: '2024-01-03',
      duration: '10 days',
      doctorNotes: 'May cause drowsiness. Avoid driving if affected. Take with or without food.'
    },
    {
      id: 7,
      name: 'Paracetamol 500mg',
      dosage: '500mg',
      frequency: 'Every 4-6 hours',
      timing: 'As needed',
      medDate: '2024-01-01',
      duration: '7 days',
      doctorNotes: 'Maximum 4 tablets per day. Take for fever or pain relief.'
    },
    {
      id: 8,
      name: 'Vitamin D3 1000IU',
      dosage: '1000IU',
      frequency: 'Once daily',
      timing: 'Morning',
      medDate: '2023-12-28',
      duration: '90 days',
      doctorNotes: 'Take with fatty meal for better absorption. Continue as maintenance therapy.'
    }
  ];

  // Computed property for filtered and sorted prescriptions
  filteredPrescriptions = computed(() => {
    let filtered = this.prescriptions;

    // Apply search filter
    const search = this.searchTerm();
    if (search.trim()) {
      filtered = filtered.filter(prescription =>
        prescription.name.toLowerCase().includes(search.toLowerCase()) ||
        prescription.dosage.toLowerCase().includes(search.toLowerCase()) ||
        prescription.frequency.toLowerCase().includes(search.toLowerCase()) ||
        prescription.timing.toLowerCase().includes(search.toLowerCase()) ||
        prescription.doctorNotes.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    const sortBy = this.sortBy();
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'duration':
          return this.extractDurationDays(a.duration) - this.extractDurationDays(b.duration);
        case 'date':
        default:
          return new Date(b.medDate).getTime() - new Date(a.medDate).getTime();
      }
    });

    return filtered;
  });

  private route = inject(ActivatedRoute);

  ngOnInit(): void {}

  // Helper method to extract duration in days for sorting
  private extractDurationDays(duration: string): number {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  // Methods to update signals
  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  updateSortBy(value: string): void {
    this.sortBy.set(value);
  }

  updateViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }
}