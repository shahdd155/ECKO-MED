import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite.service';
import { NgxSpinnerModule,NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private flowbiteService: FlowbiteService) {}
  name = 'eckomed';
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {
      // Your custom code here
      console.log('Flowbite loaded', flowbite);
      // this.ngxSpinnerService.show();
      // setTimeout(() => {
      //   this.ngxSpinnerService.hide(); 
      // }, 1000);
    
     });

    // Root path redirection logic
    if (window.location.pathname === '/' || window.location.pathname === '') {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const router = (this as any).router || inject(Router);
      if (token && role) {
        if (role === 'patient') {
          router.navigate(['/patientdashboard']);
        } else if (role === 'data-entry') {
          router.navigate(['/dEntrydashboard']);
        } else if (role === 'pharmacy') {
          router.navigate(['/managerequests']);
        }
      } else {
        router.navigate(['/login']);
      }
    }
  }

  ngxSpinnerService =inject(NgxSpinnerService)
}