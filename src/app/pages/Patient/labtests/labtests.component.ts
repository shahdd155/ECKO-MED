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
  labTests: LabTest[] = [
    {
      id: 1,
      name: 'Complete Blood Count (CBC)',
      type: 'Blood',
      notes: 'All values within normal range.',
      date: '2024-06-10T09:30:00',
      imagePath: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      name: 'Liver Function Test',
      type: 'Blood',
      notes: 'Slightly elevated ALT.',
      date: '2024-06-08T14:15:00',
      imagePath: ''
    },
    {
      id: 3,
      name: 'Urine Analysis',
      type: 'Urine',
      notes: 'No infection detected.',
      date: '2024-06-05T11:00:00',
      imagePath: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 4,
      name: 'Thyroid Panel',
      type: 'Blood',
      notes: '',
      date: '2024-05-30T16:45:00',
      imagePath: ''
    },
    {
      id: 5,
      name: 'COVID-19 PCR',
      type: 'Swab',
      notes: 'Negative result.',
      date: '2024-05-25T10:20:00',
      imagePath: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 6,
      name: 'Vitamin D',
      type: 'Blood',
      notes: 'Deficiency detected.',
      date: '2024-05-20T13:10:00',
      imagePath: ''
    }
  ];

  selectedTest: LabTest | null = null;

  private patientsService = inject(PatientsService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
  
  }
}
