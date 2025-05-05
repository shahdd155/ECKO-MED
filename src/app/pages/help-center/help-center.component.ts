import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [FormsModule], // Add FormsModule here
  templateUrl: './help-center.component.html',
  styleUrl: './help-center.component.scss'
})
export class HelpCenterComponent {
  // Define the ticket object
  ticket = {
    name: '',
    email: '',
    message: ''
  };

  // Method to handle ticket submission
  submitTicket() {
    console.log('Ticket submitted:', this.ticket);
    // Add your logic to handle the ticket submission here
  }
}