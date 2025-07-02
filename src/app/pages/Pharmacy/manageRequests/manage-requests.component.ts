import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmacyRequest } from '../../../models/PharmacyRequest';
import { PharmacyService, PharmacyStats } from '../../../core/services/Pharmacy/Pharmacy.service';

export enum PharmacyRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

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

  // Returns only processed (closed) requests
  get processedRequests(): PharmacyRequest[] {
    return this.allRequests.filter(request => request.state === 'closed');
  }

  // Returns processed requests filtered by a specific response (approved/rejected)
  getRequestsByResponse(response: 'approved' | 'rejected'): PharmacyRequest[] {
    return this.processedRequests.filter(request => request.Response === response);
  }

  // Returns CSS classes for status badges based on Response
  getStatusClass(response: string | null): string {
    switch (response) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Returns the count of approved requests
  getApprovedCount(): number {
    return this.getRequestsByResponse('approved').length;
  }

  // Returns the count of rejected requests
  getRejectedCount(): number {
    return this.getRequestsByResponse('rejected').length;
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

  // Executes the action to toggle a request's response
  toggleRequestResponse(requestId: number): void {
    this.isUpdating = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.pharmacyService.toggleResponse(requestId).subscribe({
      next: (response: any) => {
        // Refresh the list after toggling
        this.loadProcessedRequests();
        this.isUpdating = false;
        this.successMessage = response.message || 'Request response toggled successfully';
        this.activeActionRequestId = null;
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error: any) => {
        this.isUpdating = false;
        this.errorMessage = error.message || 'Failed to toggle request response';
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
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
        this.allRequests = requests.filter(request => request.state === 'closed');
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
