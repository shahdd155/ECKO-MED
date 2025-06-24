import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite.service';
import { NgxSpinnerModule,NgxSpinnerService } from "ngx-spinner";


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
  }

  ngxSpinnerService =inject(NgxSpinnerService)
}