import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-myvisits',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './myvisits.component.html',
  styleUrls: ['./myvisits.component.scss']
})
export class MyvisitsComponent {

  // Visits data from backend 
  visits = [
    {
      doctor: 'Dr. Ali',
      department: 'Neurology',
      hospital: 'Al Salam El Dawly',
      date: '2021/12/10',
      actions: [
        { label: 'Scans', icon: 'fa-arrow-right' },
        { label: 'Receipt', icon: 'fa-arrow-right' },
        { label: 'Prescription', icon: 'fa-arrow-right' }
      ]
    },
    {
      doctor: 'Dr. Ali',
      department: 'Neurology',
      hospital: 'Al Salam El Dawly',
      date: '2021/12/10',
      actions: [
        { label: 'Scans', icon: 'fa-arrow-right' },
        { label: 'Receipt', icon: 'fa-arrow-right' },
        { label: 'Prescription', icon: 'fa-arrow-right' }
      ]
    },
    {
      doctor: 'Dr. Ali',
      department: 'Neurology',
      hospital: 'Al Salam El Dawly',
      date: '2021/12/10',
      actions: [
        { label: 'Scans', icon: 'fa-arrow-right' },
        { label: 'Receipt', icon: 'fa-arrow-right' },
        { label: 'Prescription', icon: 'fa-arrow-right' }
      ]
    }
  ];
}
