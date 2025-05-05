import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-myvisits',
  imports: [RouterLink],
  templateUrl: './myvisits.component.html',
  styleUrl: './myvisits.component.scss'
})
export class MyvisitsComponent {
  // visits list from backend
  visits = [
    {
      doctor: 'Dr. Ali',
      department: 'Neurology',
      hospital: 'Al Salam El Dawly',
      date: '2021/12/10',
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

  expanded = false; 

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
