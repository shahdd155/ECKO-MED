import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PharmacyRequest } from '../../../models/PharmacyRequest';
import { PharmacyService } from '../../../core/services/Pharmacy/Pharmacy.service';

@Component({
  selector: 'app-view-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-requests.component.html'
})
export class ViewRequestsComponent implements OnInit {
  
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
  closedTodayRequests: number = 0;
  totalRequests: number = 0;

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
      next: (response: any) => {
        this.allRequests = response.pendingItems || [];
        this.closedTodayRequests = response.closedTodayRequests || 0;
        this.totalRequests = response.totalRequests || 0;
        console.log(this.allRequests);
        this.isLoading = false;
        console.log('Pending requests loaded successfully:', this.allRequests.length, 'requests');
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
    let filtered = this.allRequests.filter(request => request.state === 'pending');
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'date':
          comparison = new Date(a.dateTime || 0).getTime() - new Date(b.dateTime || 0).getTime();
          break;
        case 'patient':
          comparison = (a.userName || '').localeCompare(b.userName || '');
          break;
        case 'medication':
          comparison = (a.medicineName || '').localeCompare(b.medicineName || '');
          break;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
    return filtered;
  }

  // Return CSS classes for status badges
  getStatusClass(status: 'pending' | 'approved' | 'rejected'): string {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return `inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${classes[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`;
  }

  // Count pending requests for dashboard
  getPendingCount(): number {
    return this.pendingRequests.length;
  }

  // Count requests processed today
  getProcessedTodayCount(): number {
    return this.closedTodayRequests;
  }

  // Get total number of all requests
  getTotalRequestsCount(): number {
    return this.totalRequests;
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
      console.log('Viewing details for request:', request);
      this.showNotification(`Viewing details for request #${requestId}`, 'info');
    }
  }

  // Approve a single request
  approveRequest(requestId: number): void {
    const request = this.allRequests.find((r: any) => r.id === requestId);
    if (request && request.state === 'pending') {
      this.isUpdating = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.pharmacyService.approveRequest(requestId).subscribe({
        next: (response: any) => {
          this.loadRequests();
          this.selectedRequests.delete(requestId);
          this.isUpdating = false;
          this.showNotification(response.message || `Request #${requestId} approved successfully`, 'success');
        },
        error: (error: any) => {
          this.isUpdating = false;
          this.errorMessage = error.message || 'Failed to approve request';
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }

  // Reject a single request
  rejectRequest(requestId: number): void {
    const request = this.allRequests.find((r: any) => r.id === requestId);
    if (request && request.state === 'pending') {
      this.isUpdating = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.pharmacyService.rejectRequest(requestId).subscribe({
        next: (response: any) => {
          this.loadRequests();
          this.selectedRequests.delete(requestId);
          this.isUpdating = false;
          this.showNotification(response.message || `Request #${requestId} rejected successfully`, 'success');
        },
        error: (error: any) => {
          this.isUpdating = false;
          this.errorMessage = error.message || 'Failed to reject request';
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }

  // Approve all selected requests at once
  bulkApprove(): void {
    if (!this.hasSelectedRequests) return;
    const selectedIds = Array.from(this.selectedRequests);
    this.isUpdating = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.pharmacyService.approveRequests(selectedIds).subscribe({
      next: (response: any) => {
        this.loadRequests();
        this.selectedRequests.clear();
        this.isUpdating = false;
        this.showNotification('Bulk approve completed', 'success');
      },
      error: (error: any) => {
        this.isUpdating = false;
        this.errorMessage = error.message || 'Failed to bulk approve requests';
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  // Reject all selected requests at once
  bulkReject(): void {
    if (!this.hasSelectedRequests) return;
    const selectedIds = Array.from(this.selectedRequests);
    this.isUpdating = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.pharmacyService.rejectRequests(selectedIds).subscribe({
      next: (response: any) => {
        this.loadRequests();
        this.selectedRequests.clear();
        this.isUpdating = false;
        this.showNotification('Bulk reject completed', 'success');
      },
      error: (error: any) => {
        this.isUpdating = false;
        this.errorMessage = error.message || 'Failed to bulk reject requests';
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  // Reset search and filters to default state
  clearFilters(): void {
    this.selectedRequests.clear();
  }

  // Refresh data from backend
  refreshData(): void {
    this.loadRequests();
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
  getUrgencyClass(dateTime: string | Date | null): string {
    if (!dateTime) return '';
    const daysDiff = Math.floor((new Date().getTime() - new Date(dateTime).getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff >= 3) return 'border-l-4 border-red-500 bg-red-50';
    if (daysDiff >= 1) return 'border-l-4 border-yellow-500 bg-yellow-50';
    return '';
  }

  // Format date for user-friendly display
  formatDate(date: string | Date | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Generate initials from patient name for avatar
  getPatientInitials(name: string | null): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}