import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PatientsService } from '../../../core/services/patient/patients.service';
import { Prescription } from '../../../models/patient-record.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prescriptions',
  imports: [ CommonModule, FormsModule],
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.scss'
})
export class PrescriptionsComponent implements OnInit {
 
  searchTerm = signal('');
  sortBy = signal('date');
  viewMode = signal<'grid' | 'list'>('grid');

  prescriptions: Prescription[] = [];

  private patientsService = inject(PatientsService);
  private route = inject(ActivatedRoute);

  // Computed property for filtered and sorted prescriptions
  filteredPrescriptions = computed(() => {
    let filtered = this.prescriptions;

    // Apply search filter
    const search = this.searchTerm();
    if (search.trim()) {
      filtered = filtered.filter(prescription =>
        prescription.id ||
        prescription.dosage.toLowerCase().includes(search.toLowerCase()) ||
        prescription.frequency.toLowerCase().includes(search.toLowerCase()) ||
        prescription.timing.toLowerCase().includes(search.toLowerCase()) ||
        prescription.doctorNotes.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filtered;
  });

  ngOnInit(): void {
    const visitId = this.route.snapshot.paramMap.get('id');
    if (visitId) {
      this.patientsService.getPrescriptions(+visitId).subscribe((data: Prescription[]) => {
        this.prescriptions = data;
      });
    }
  }

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