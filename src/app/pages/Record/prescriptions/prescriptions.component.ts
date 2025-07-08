import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecordService } from '../../../core/services/Record/record.service';
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
  private recordService = inject(RecordService);
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
    const userId = this.route.snapshot.queryParamMap.get('userId');
    if (visitId && userId) {
      this.recordService.getPrescriptions(+visitId, userId).subscribe((data: Prescription[]) => {
        this.prescriptions = data;
      });
    }
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