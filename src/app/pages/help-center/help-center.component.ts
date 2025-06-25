import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { SupportTicket } from '../../models/ticket'; // Import the SupportTicket interface

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [FormsModule], // Add FormsModule here
  templateUrl: './help-center.component.html',
  styleUrl: './help-center.component.scss'
})
export class HelpCenterComponent {
  // Define the ticket object using the SupportTicket interface
  ticket: SupportTicket = {
    name: '',
    email: '',
    mobile: '',
    message: ''
  };

  // Method to handle ticket submission
  submitTicket() {
    console.log('Ticket submitted:', this.ticket);
    // Add your logic to handle the ticket submission here
  }
}