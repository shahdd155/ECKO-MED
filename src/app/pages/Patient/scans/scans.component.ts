import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientsService } from '../../../core/services/patient/patients.service';
import { CommonModule } from '@angular/common';
import { MedicalScan } from '../../../models/medical-scan.model';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-scans',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './scans.component.html',
  styleUrl: './scans.component.scss'
})
export class ScansComponent implements OnInit {
  private patientsService = inject(PatientsService);
  private route = inject(ActivatedRoute);

  // Signals for reactive state management
  scans = signal<MedicalScan[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedScan = signal<MedicalScan | null>(null);

  // Computed values
  hasScans = computed(() => this.scans().length > 0);
  scansByType = computed(() => {
    const scans = this.scans();
    const grouped = scans.reduce((acc, scan) => {
      if (!acc[scan.type]) {
        acc[scan.type] = [];
      }
      acc[scan.type].push(scan);
      return acc;
    }, {} as Record<string, MedicalScan[]>);
    return Object.entries(grouped).map(([type, scans]) => ({ type, scans }));
  });

  ngOnInit() {
    this.loadScans();
  }

  loadScans() {
    this.loading.set(true);
    this.error.set(null);

    // For demo purposes, creating mock data since we're using MedicalScan model
    // In real implementation, you would call the service
    setTimeout(() => {
      const mockScans: MedicalScan[] = [
        {
          id: 1,
          type: 'X-Ray',
          bodypart: 'Chest',
          description: 'Chest X-ray showing normal cardiac silhouette and clear lung fields. No evidence of pneumonia or other abnormalities.',
          date: '2024-01-15T10:30:00',
          imagePath: 'assets/images/xray-chest.jpg'
        },
        {
          id: 2,
          type: 'MRI',
          bodypart: 'Brain',
          description: 'Brain MRI showing normal brain parenchyma. No mass lesions or significant abnormalities detected.',
          date: '2024-01-10T14:20:00',
          imagePath: 'assets/images/mri-brain.jpg'
        },
        {
          id: 3,
          type: 'CT Scan',
          bodypart: 'Abdomen',
          description: 'Abdominal CT scan showing normal liver, spleen, and kidneys. No evidence of masses or fluid collections.',
          date: '2024-01-05T09:15:00',
          imagePath: 'assets/images/ct-abdomen.jpg'
        },
        {
          id: 4,
          type: 'Ultrasound',
          bodypart: 'Heart',
          description: 'Echocardiogram showing normal cardiac function with ejection fraction of 65%. No valvular abnormalities.',
          date: '2023-12-28T16:45:00',
          imagePath: 'assets/images/ultrasound-heart.jpg'
        },
        {
          id: 5,
          type: 'X-Ray',
          bodypart: 'Spine',
          description: 'Spinal X-ray showing normal vertebral alignment. No fractures or degenerative changes noted.',
          date: '2023-12-20T11:30:00',
          imagePath: 'assets/images/xray-spine.jpg'
        }
      ];

      this.scans.set(mockScans);
      this.loading.set(false);
    }, 1000);

    // Real implementation would be:
    // this.patientsService.getScans(visitId).pipe(
    //   catchError(err => {
    //     this.error.set('Failed to load scans. Please try again.');
    //     return of([]);
    //   }),
    //   finalize(() => this.loading.set(false))
    // ).subscribe(scans => {
    //   this.scans.set(scans);
    // });
  }

  selectScan(scan: MedicalScan) {
    this.selectedScan.set(scan);
  }

  closeModal() {
    this.selectedScan.set(null);
  }

  getScanIcon(type: string): string {
    const icons: Record<string, string> = {
      'X-Ray': 'fa-solid fa-x-ray',
      'MRI': 'fa-solid fa-brain',
      'CT Scan': 'fa-solid fa-layer-group',
      'Ultrasound': 'fa-solid fa-wave-pulse',
      'default': 'fa-solid fa-stethoscope'
    };
    return icons[type] || icons['default'];
  }

  getScanColor(type: string): string {
    const colors: Record<string, string> = {
      'X-Ray': 'from-blue-500 to-blue-600',
      'MRI': 'from-purple-500 to-purple-600',
      'CT Scan': 'from-green-500 to-green-600',
      'Ultrasound': 'from-orange-500 to-orange-600',
      'default': 'from-gray-500 to-gray-600'
    };
    return colors[type] || colors['default'];
  }
}