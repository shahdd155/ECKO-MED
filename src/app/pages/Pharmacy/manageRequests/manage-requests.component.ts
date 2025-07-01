import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmacyRequest, PharmacyRequestStatus } from '../../../models/PharmacyRequest';
import { PharmacyService, RequestStatusUpdateResponse, PharmacyStats } from '../../../core/services/Pharmacy/Pharmacy.service';

// Component that manages processed (non-pending) pharmacy requests
@Component({
  selector: 'app-manage-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-requests.component.html'
})
export class ManageRequestsComponent implements OnInit {

  // Exposes the PharmacyRequestStatus enum to the template
  PharmacyRequestStatus = PharmacyRequestStatus;

  // Tracks the request ID that is currently being actioned
  activeActionRequestId: number | null = null;

  // All pharmacy requests loaded from backend
  allRequests: PharmacyRequest[] = [];

  // Pharmacy statistics
  pharmacyStats: PharmacyStats | null = null;

  // Loading and error states
  isLoading: boolean = false;
  isUpdating: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    this.loadProcessedRequests();
    this.loadPharmacyStats();
  }

  /**
   * Load processed (non-pending) pharmacy requests from backend
   */
  loadProcessedRequests(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.pharmacyService.getProcessedRequests().subscribe({
      next: (response: any) => {
        // Backend returns { totalClosed, approvedCount, rejectedCount, closedItems }
        this.allRequests = response.closedItems || [];
        this.isLoading = false;
        console.log('Processed requests loaded successfully:', this.allRequests.length, 'requests');
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to load requests';
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  /**
   * Load pharmacy statistics from backend
   */
  loadPharmacyStats(): void {
    this.pharmacyService.getPharmacyStats().subscribe({
      next: (stats: PharmacyStats) => {
        this.pharmacyStats = stats;
        console.log('Pharmacy stats loaded successfully:', stats);
      },
      error: (error: any) => {
        console.error('Error loading pharmacy stats:', error);
        // Stats are optional, so we don't show error to user
      }
    });
  }

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
    // TODO: Implement detailed view modal or navigation
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
    
    this.isUpdating = true;
    this.errorMessage = '';
    this.successMessage = '';

    let updateObservable;
    
    if (newStatus === PharmacyRequestStatus.APPROVED) {
      updateObservable = this.pharmacyService.approveRequest(requestId);
    } else if (newStatus === PharmacyRequestStatus.REJECTED) {
      if (!reason || reason.trim() === '') {
        this.errorMessage = 'Rejection reason is required';
        this.isUpdating = false;
        return;
      }
      updateObservable = this.pharmacyService.rejectRequest(requestId);
    } else {
      this.errorMessage = 'Invalid status transition';
      this.isUpdating = false;
      return;
    }

    updateObservable.subscribe({
      next: (response: RequestStatusUpdateResponse) => {
        // Update the local request with the response data
        const requestIndex = this.allRequests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
          this.allRequests[requestIndex] = response.request;
        }

        this.isUpdating = false;
        this.successMessage = response.message || `Request ${newStatus.toLowerCase()} successfully`;
        this.activeActionRequestId = null;

        // Refresh stats after status update
        this.loadPharmacyStats();

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);

        console.log(`✅ Request #${requestId} status changed to ${newStatus}`);
      },
      error: (error: any) => {
        this.isUpdating = false;
        this.errorMessage = error.message || 'Failed to update request status';
        console.error('Error updating request status:', error);
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
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

  /**
   * Refresh all data from backend
   */
  refreshData(): void {
    this.loadProcessedRequests();
    this.loadPharmacyStats();
  }

  /**
   * Search requests by query
   */
  searchRequests(query: string): void {
    if (!query || query.trim() === '') {
      this.loadProcessedRequests();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.pharmacyService.searchRequests(query.trim()).subscribe({
      next: (requests: PharmacyRequest[]) => {
        this.allRequests = requests.filter(request => request.status !== PharmacyRequestStatus.PENDING);
        this.isLoading = false;
        console.log('Search results loaded:', this.allRequests.length, 'requests');
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to search requests';
        console.error('Error searching requests:', error);
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }
}
