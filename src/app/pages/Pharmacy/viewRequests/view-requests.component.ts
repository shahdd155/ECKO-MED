import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PharmacyRequest, PharmacyRequestStatus } from '../../../models/PharmacyRequest';
import { PharmacyService, RequestStatusUpdateResponse } from '../../../core/services/Pharmacy/Pharmacy.service';

@Component({
  selector: 'app-view-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-requests.component.html'
})
export class ViewRequestsComponent implements OnInit {
  
  // Make enum available in template
  PharmacyRequestStatus = PharmacyRequestStatus;

  // UI state variables
  isLoading = false;
  isUpdating = false;
  searchQuery = '';
  selectedRequests: Set<number> = new Set();
  showSuccessMessage = false;
  successMessage = '';
  showErrorMessage = false;
  errorMessage = '';

  // Filter and sort configuration
  sortBy: 'date' | 'patient' | 'medication' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  // All pharmacy requests loaded from backend
  allRequests: PharmacyRequest[] = [];

  constructor(private pharmacyService: PharmacyService) {}

  // Initialize component on load
  ngOnInit() {
    this.loadRequests();
  }

  // Load pending requests from backend
  loadRequests(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.pharmacyService.getRequestsByStatus().subscribe({
      next: (requests: PharmacyRequest[]) => {
        this.allRequests = requests;
        this.isLoading = false;
        console.log('Pending requests loaded successfully:', requests.length, 'requests');
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to load requests';
        console.error('Error loading pending requests:', error);
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  // Filter and sort pending requests based on current criteria
  get pendingRequests(): PharmacyRequest[] {
    let filtered = this.allRequests.filter(request => 
      request.status === PharmacyRequestStatus.PENDING
    );

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(request =>
        request.patientName.toLowerCase().includes(query) ||
        request.medication.toLowerCase().includes(query) ||
        request.id.toString().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'date':
          comparison = new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime();
          break;
        case 'patient':
          comparison = a.patientName.localeCompare(b.patientName);
          break;
        case 'medication':
          comparison = a.medication.localeCompare(b.medication);
          break;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }

  // Return CSS classes for status badges
  getStatusClass(status: PharmacyRequestStatus): string {
    const classes = {
      [PharmacyRequestStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [PharmacyRequestStatus.APPROVED]: 'bg-green-100 text-green-800 border-green-200',
      [PharmacyRequestStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200'
    };
    return `inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${classes[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`;
  }

  // Count pending requests for dashboard
  getPendingCount(): number {
    return this.pendingRequests.length;
  }

  // Count requests processed today
  getProcessedTodayCount(): number {
    const today = new Date().toDateString();
    return this.allRequests.filter(request => 
      (request.status === PharmacyRequestStatus.APPROVED || request.status === PharmacyRequestStatus.REJECTED) &&
      (new Date(request.updatedAt).toDateString() === today)
    ).length;
  }

  // Get total number of all requests
  getTotalRequestsCount(): number {
    return this.allRequests.length;
  }

  // Toggle selection of all visible requests
  toggleSelectAll(): void {
    if (this.selectedRequests.size === this.pendingRequests.length) {
      this.selectedRequests.clear();
    } else {
      this.selectedRequests.clear();
      this.pendingRequests.forEach(request => this.selectedRequests.add(request.id));
    }
  }

  // Toggle selection of individual request
  toggleSelectRequest(requestId: number): void {
    if (this.selectedRequests.has(requestId)) {
      this.selectedRequests.delete(requestId);
    } else {
      this.selectedRequests.add(requestId);
    }
  }

  // Check if request is selected
  isSelected(requestId: number): boolean {
    return this.selectedRequests.has(requestId);
  }

  // Check if any requests are selected
  get hasSelectedRequests(): boolean {
    return this.selectedRequests.size > 0;
  }

  // Check if all visible requests are selected
  get allSelected(): boolean {
    return this.selectedRequests.size === this.pendingRequests.length && this.pendingRequests.length > 0;
  }

  // Handle column sorting with direction toggle
  sortRequests(column: 'date' | 'patient' | 'medication'): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
  }

  // Get sort direction icon for column headers
  getSortIcon(column: string): string {
    if (this.sortBy !== column) return '↕️';
    return this.sortOrder === 'asc' ? '↑' : '↓';
  }

  // Open request details view
  viewDetails(requestId: number): void {
    const request = this.allRequests.find(r => r.id === requestId);
    if (request) {
      // In a real app, this would open a modal or navigate to detail page
      console.log('Viewing details for request:', request);
      this.showNotification(`Viewing details for request #${requestId}`, 'info');
    }
  }

  // Approve a single request
  approveRequest(requestId: number): void {
    const request = this.allRequests.find(r => r.id === requestId);
    
    if (request && request.status === PharmacyRequestStatus.PENDING) {
      this.isUpdating = true;
      this.errorMessage = '';
      this.successMessage = '';

      // TODO: Get actual user ID from auth service
      const currentUserId = 401; // Replace with actual user ID

      this.pharmacyService.approveRequest(requestId, currentUserId).subscribe({
        next: (response: RequestStatusUpdateResponse) => {
          // Update the local request with the response data
          const requestIndex = this.allRequests.findIndex(r => r.id === requestId);
          if (requestIndex !== -1) {
            this.allRequests[requestIndex] = response.request;
          }

          this.selectedRequests.delete(requestId);
          this.isUpdating = false;
          this.showNotification(response.message || `Request #${requestId} approved successfully`, 'success');
        },
        error: (error: any) => {
          this.isUpdating = false;
          this.errorMessage = error.message || 'Failed to approve request';
          console.error('Error approving request:', error);
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }

  // Reject a single request with optional reason
  rejectRequest(requestId: number): void {
    const reason = prompt('Please provide a reason for rejection (optional):');
    
    if (reason !== null) { // User didn't cancel
      const request = this.allRequests.find(r => r.id === requestId);
      
      if (request && request.status === PharmacyRequestStatus.PENDING) {
        this.isUpdating = true;
        this.errorMessage = '';
        this.successMessage = '';

        // TODO: Get actual user ID from auth service
        const currentUserId = 401; // Replace with actual user ID

        this.pharmacyService.rejectRequest(requestId, currentUserId, reason.trim() || 'No reason provided').subscribe({
          next: (response: RequestStatusUpdateResponse) => {
            // Update the local request with the response data
            const requestIndex = this.allRequests.findIndex(r => r.id === requestId);
            if (requestIndex !== -1) {
              this.allRequests[requestIndex] = response.request;
            }

            this.selectedRequests.delete(requestId);
            this.isUpdating = false;
            this.showNotification(response.message || `Request #${requestId} rejected successfully`, 'success');
          },
          error: (error: any) => {
            this.isUpdating = false;
            this.errorMessage = error.message || 'Failed to reject request';
            console.error('Error rejecting request:', error);
            
            setTimeout(() => {
              this.errorMessage = '';
            }, 5000);
          }
        });
      }
    }
  }

  // Approve all selected requests at once
  bulkApprove(): void {
    if (!this.hasSelectedRequests) return;
    
    const selectedIds = Array.from(this.selectedRequests);
    const count = selectedIds.length;
    
    if (confirm(`Are you sure you want to approve ${count} selected request(s)?`)) {
      this.isUpdating = true;
      this.errorMessage = '';
      this.successMessage = '';

      // TODO: Get actual user ID from auth service
      const currentUserId = 401; // Replace with actual user ID

      // Process each request sequentially
      let processedCount = 0;
      let errorCount = 0;

      const processNext = (index: number) => {
        if (index >= selectedIds.length) {
          // All requests processed
          this.isUpdating = false;
          this.selectedRequests.clear();
          
          if (errorCount === 0) {
            this.showNotification(`${processedCount} request(s) approved successfully`, 'success');
          } else {
            this.showNotification(`${processedCount} approved, ${errorCount} failed`, 'error');
          }
          return;
        }

        const requestId = selectedIds[index];
        this.pharmacyService.approveRequest(requestId, currentUserId).subscribe({
          next: (response: RequestStatusUpdateResponse) => {
            // Update the local request with the response data
            const requestIndex = this.allRequests.findIndex(r => r.id === requestId);
            if (requestIndex !== -1) {
              this.allRequests[requestIndex] = response.request;
            }
            processedCount++;
            processNext(index + 1);
          },
          error: (error: any) => {
            console.error(`Error approving request ${requestId}:`, error);
            errorCount++;
            processNext(index + 1);
          }
        });
      };

      processNext(0);
    }
  }

  // Reject all selected requests with optional reason
  bulkReject(): void {
    if (!this.hasSelectedRequests) return;
    
    const selectedIds = Array.from(this.selectedRequests);
    const count = selectedIds.length;
    const reason = prompt('Please provide a reason for bulk rejection (optional):');
    
    if (reason !== null && confirm(`Are you sure you want to reject ${count} selected request(s)?`)) {
      this.isUpdating = true;
      this.errorMessage = '';
      this.successMessage = '';

      // TODO: Get actual user ID from auth service
      const currentUserId = 401; // Replace with actual user ID

      const rejectionReason = reason.trim() || 'No reason provided';

      // Process each request sequentially
      let processedCount = 0;
      let errorCount = 0;

      const processNext = (index: number) => {
        if (index >= selectedIds.length) {
          // All requests processed
          this.isUpdating = false;
          this.selectedRequests.clear();
          
          if (errorCount === 0) {
            this.showNotification(`${processedCount} request(s) rejected successfully`, 'success');
          } else {
            this.showNotification(`${processedCount} rejected, ${errorCount} failed`, 'error');
          }
          return;
        }

        const requestId = selectedIds[index];
        this.pharmacyService.rejectRequest(requestId, currentUserId, rejectionReason).subscribe({
          next: (response: RequestStatusUpdateResponse) => {
            // Update the local request with the response data
            const requestIndex = this.allRequests.findIndex(r => r.id === requestId);
            if (requestIndex !== -1) {
              this.allRequests[requestIndex] = response.request;
            }
            processedCount++;
            processNext(index + 1);
          },
          error: (error: any) => {
            console.error(`Error rejecting request ${requestId}:`, error);
            errorCount++;
            processNext(index + 1);
          }
        });
      };

      processNext(0);
    }
  }

  // Reset search and filters to default state
  clearFilters(): void {
    this.searchQuery = '';
    this.selectedRequests.clear();
  }

  // Refresh data from backend
  refreshData(): void {
    this.loadRequests();
  }

  // Search requests by query
  searchRequests(): void {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.loadRequests();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.pharmacyService.searchRequests(this.searchQuery.trim()).subscribe({
      next: (requests: PharmacyRequest[]) => {
        this.allRequests = requests.filter(request => request.status === PharmacyRequestStatus.PENDING);
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

  // Display success or error messages to user
  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    if (type === 'success') {
      this.successMessage = message;
      this.showSuccessMessage = true;
      setTimeout(() => this.showSuccessMessage = false, 4000);
    } else if (type === 'error') {
      this.errorMessage = message;
      this.showErrorMessage = true;
      setTimeout(() => this.showErrorMessage = false, 4000);
    }
  }

  // Apply urgency styling based on request age
  getUrgencyClass(requestDate: string | Date): string {
    const daysDiff = Math.floor((new Date().getTime() - new Date(requestDate).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 3) return 'border-l-4 border-red-500 bg-red-50';
    if (daysDiff >= 1) return 'border-l-4 border-yellow-500 bg-yellow-50';
    return '';
  }

  // Format price with currency symbol
  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  }

  // Format date for user-friendly display
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Generate initials from patient name for avatar
  getPatientInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}