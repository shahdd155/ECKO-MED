import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecordService } from '../../../core/services/Record/record.service';
import { LabTest } from '../../../models/lab-test.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-labtests',
  imports: [ CommonModule],
  templateUrl: './labtests.component.html',
  styleUrl: './labtests.component.scss'
})
export class LabtestsComponent implements OnInit {
  labTests: LabTest[] = [];
  selectedTest: LabTest | null = null;
  private recordService = inject(RecordService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const visitId = this.route.snapshot.paramMap.get('id');
    const userId = this.route.snapshot.queryParamMap.get('userId');
    if (visitId && userId) {
      this.recordService.getLabTests(+visitId, userId).subscribe((data: LabTest[]) => {
        this.labTests = data;
      });
    }
  }
}
