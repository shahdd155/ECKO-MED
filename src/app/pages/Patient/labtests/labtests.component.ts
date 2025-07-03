import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PatientsService } from '../../../core/services/patient/patients.service';
import { LabTest } from '../../../models/lab-test.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-labtests',
  imports: [RouterLink, CommonModule],
  templateUrl: './labtests.component.html',
  styleUrl: './labtests.component.scss'
})
export class LabtestsComponent implements OnInit {
  labTests: LabTest[] = [];

  private patientsService = inject(PatientsService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const visitId = this.route.snapshot.paramMap.get('id');
      if (visitId) {
        this.patientsService.getLabTests(+visitId).subscribe((data: LabTest[]) => {
          this.labTests = data;
        });
      }
  }
}
