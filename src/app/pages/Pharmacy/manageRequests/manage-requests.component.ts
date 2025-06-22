import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmacyRequest, PharmacyRequestStatus } from '../../../models/PharmacyRequest';

// Component that manages processed (non-pending) pharmacy requests
@Component({
  selector: 'app-manage-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-requests.component.html'
})
export class ManageRequestsComponent {

  // Exposes the PharmacyRequestStatus enum to the template
  PharmacyRequestStatus = PharmacyRequestStatus;

  // Tracks the request ID that is currently being actioned
  activeActionRequestId: number | null = null;

  // All pharmacy requests (sample data for the component)
  allRequests: PharmacyRequest[] = [
    {
      id: 2,
      patientId: 102,
      patientName: 'Jane Smith',
      patientEmail: 'jane.smith@email.com',
      patientPhone: '+1 (555) 987-6543',
      medication: 'Ibuprofen 200mg',
      medicationId: 1002,
      dosage: '200mg',
      quantity: 20,
      unit: 'tablets',
      status: PharmacyRequestStatus.APPROVED,
      requestDate: '2024-01-14',
      approvedDate: '2024-01-14T14:30:00Z',
      approvedBy: 401,
      approvedByName: 'Pharmacist Brown',
      notes: 'Patient experiencing inflammation',
      cost: 18.75,
      currency: 'USD',
      insuranceCovered: false,
      createdAt: '2024-01-14T10:00:00Z',
      updatedAt: '2024-01-14T14:30:00Z'
    },
    {
      id: 4,
      patientId: 104,
      patientName: 'Sarah Wilson',
      patientEmail: 'sarah.wilson@email.com',
      patientPhone: '+1 (555) 234-5678',
      medication: 'Codeine 30mg',
      medicationId: 1004,
      dosage: '30mg',
      quantity: 10,
      unit: 'tablets',
      status: PharmacyRequestStatus.REJECTED,
      requestDate: '2024-01-13',
      rejectedDate: '2024-01-13T16:45:00Z',
      rejectedBy: 401,
      rejectedByName: 'Pharmacist Brown',
      rejectionReason: 'Patient has history of substance abuse',
      notes: 'Alternative pain management recommended',
      cost: 45.00,
      currency: 'USD',
      insuranceCovered: true,
      createdAt: '2024-01-13T11:00:00Z',
      updatedAt: '2024-01-13T16:45:00Z'
    },
    {
      id: 5,
      patientId: 105,
      patientName: 'Robert Chen',
      patientEmail: 'robert.chen@email.com',
      patientPhone: '+1 (555) 345-6789',
      medication: 'Insulin Glargine 100U/mL',
      medicationId: 1005,
      dosage: '100U/mL',
      quantity: 1,
      unit: 'vial',
      status: PharmacyRequestStatus.APPROVED,
      requestDate: '2024-01-15',
      approvedDate: '2024-01-15T09:15:00Z',
      approvedBy: 402,
      approvedByName: 'Pharmacist Lee',
      notes: 'Diabetic patient, refrigeration required',
      cost: 125.00,
      currency: 'USD',
      insuranceCovered: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 1,
      patientId: 101,
      patientName: 'John Doe',
      patientEmail: 'john.doe@email.com',
      patientPhone: '+1 (555) 123-4567',
      medication: 'Aspirin 100mg',
      medicationId: 1001,
      dosage: '100mg',
      quantity: 30,
      unit: 'tablets',
      status: PharmacyRequestStatus.PENDING,
      requestDate: '2024-01-15',
      cost: 25.50,
      currency: 'USD',
      insuranceCovered: true,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    }
  ];

  // Returns only non-pending (processed) requests
  get processedRequests(): PharmacyRequest[] {
    return this.allRequests.filter(request => request.status !== PharmacyRequestStatus.PENDING);
  }

  // Returns processed requests filtered by a specific status
  getRequestsByStatus(status: PharmacyRequestStatus): PharmacyRequest[] {
    return this.processedRequests.filter(request => request.status === status);
  }

  // Returns CSS classes for status badges based on status
  getStatusClass(status: PharmacyRequestStatus): string {
    switch (status) {
      case PharmacyRequestStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case PharmacyRequestStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case PharmacyRequestStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Returns the count of approved requests
  getApprovedCount(): number {
    return this.getRequestsByStatus(PharmacyRequestStatus.APPROVED).length;
  }

  // Returns the count of rejected requests
  getRejectedCount(): number {
    return this.getRequestsByStatus(PharmacyRequestStatus.REJECTED).length;
  }

  // Logs request details for viewing (to be implemented)
  viewDetails(requestId: number): void {
    console.log('Viewing details for processed request:', requestId);
  }

  // Starts the take-action workflow for a request
  startTakeAction(requestId: number): void {
    console.log('Starting take action workflow for request:', requestId);
    this.activeActionRequestId = requestId;
  }

  // Cancels the current action workflow
  cancelAction(): void {
    console.log('Cancelling action workflow');
    this.activeActionRequestId = null;
  }

  // Executes the action to update a request's status
  executeAction(requestId: number, newStatus: PharmacyRequestStatus, reason?: string): void {
    console.log('Executing action:', { requestId, newStatus, reason });
    const request = this.allRequests.find(r => r.id === requestId);
    if (request) {
      const oldStatus = request.status;
      request.status = newStatus;
      request.updatedAt = new Date().toISOString();
      if (reason && reason.trim()) {
        request.notes = reason.trim();
      }
      switch (newStatus) {
        case PharmacyRequestStatus.APPROVED:
          request.approvedDate = new Date().toISOString();
          delete request.rejectedDate;
          break;
        case PharmacyRequestStatus.REJECTED:
          request.rejectedDate = new Date().toISOString();
          if (reason) {
            request.rejectionReason = reason;
          }
          delete request.approvedDate;
          break;
      }
      console.log(`✅ Request #${requestId} status changed from ${oldStatus} to ${newStatus}`);
      this.activeActionRequestId = null;
    }
  }

  // Returns available status transitions for a request
  getAvailableStatusOptions(currentStatus: PharmacyRequestStatus): PharmacyRequestStatus[] {
    const options: PharmacyRequestStatus[] = [];
    switch (currentStatus) {
      case PharmacyRequestStatus.APPROVED:
        options.push(PharmacyRequestStatus.REJECTED);
        break;
      case PharmacyRequestStatus.REJECTED:
        options.push(PharmacyRequestStatus.APPROVED);
        break;
    }
    return options;
  }

  // Returns label text for a given status
  getStatusLabel(status: PharmacyRequestStatus): string {
    const labels: Record<PharmacyRequestStatus, string> = {
      [PharmacyRequestStatus.PENDING]: 'Mark as Pending',
      [PharmacyRequestStatus.APPROVED]: 'Approve Request',
      [PharmacyRequestStatus.REJECTED]: 'Reject Request'
    };
    return labels[status] || status;
  }

  // Checks if a request is currently active for action
  isActionActive(requestId: number): boolean {
    return this.activeActionRequestId === requestId;
  }

  // Handles closing the action dropdown on outside click
  handleClickOutside(): void {
    this.activeActionRequestId = null;
  }

  // Generates initials from patient name
  getPatientInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
