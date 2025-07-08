import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordService } from '../../../core/services/Record/record.service';
import { CommonModule } from '@angular/common';
import { Scan } from '../../../models/patient-record.model';
import { scan } from 'rxjs';

@Component({
  selector: 'app-scans',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './scans.component.html',
  styleUrl: './scans.component.scss'
})
export class ScansComponent implements OnInit {
  scans: Scan[] = [];
  selectedScan: Scan | null = null;
  private recordService = inject(RecordService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const visitId = this.route.snapshot.paramMap.get('id');
    const userId = this.route.snapshot.queryParamMap.get('userId');
    if (visitId && userId) {
      this.recordService.getScans(+visitId, userId).subscribe((data: Scan[]) => {
        this.scans = data;
      });
      console.log(this.scans);
    }
  }

  get scansByType() {
    const grouped: { [type: string]: Scan[] } = {};
    for (const scan of this.scans) {
      if (!grouped[scan.type]) grouped[scan.type] = [];
      grouped[scan.type].push(scan);
    }
    return Object.entries(grouped).map(([type, scans]) => ({ type, scans }));
  }

  selectScan(scan: Scan) {
    this.selectedScan = scan;
  }

  closeModal() {
    this.selectedScan = null;
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

  trackScanId(index: number, scan: Scan) {
    return scan.id;
  }
}