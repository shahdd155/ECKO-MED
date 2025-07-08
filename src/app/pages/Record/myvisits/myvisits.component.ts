import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { RecordService } from '../../../core/services/Record/record.service';
import { CommonModule } from '@angular/common';
import { Visit } from '../../../models/patient-record.model';

@Component({
  selector: 'app-myvisits',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './myvisits.component.html',
  styleUrls: ['./myvisits.component.scss']
})
export class MyvisitsComponent implements OnInit {
  visits: Visit[] = [];
  private recordService = inject(RecordService);
  public route = inject(ActivatedRoute);

  ngOnInit(): void {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    if (userId) {
      this.recordService.getVisits(userId).subscribe((data: Visit[]) => {
        this.visits = data;
      });
    }
  }
}
