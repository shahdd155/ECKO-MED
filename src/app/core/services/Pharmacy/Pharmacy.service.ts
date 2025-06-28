import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { PharmacyRequest, PharmacyRequestStatus } from '../../../models/PharmacyRequest';

// API Response interface
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Interfaces for pharmacy operations
export interface UpdateRequestStatusDto {
  requestId: number;
  newStatus: PharmacyRequestStatus;
  reason?: string;
  approvedBy?: number;
  rejectedBy?: number;
}

export interface RequestStatusUpdateResponse {
  success: boolean;
  message: string;
  request: PharmacyRequest;
}

export interface PharmacyStats {
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  totalCost: number;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  private baseUrl = environment.apiUrl + '/pharmacy';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all pharmacy requests
   */
  getAllRequests(): Observable<PharmacyRequest[]> {
    const url = `${this.baseUrl}/requests`;
    
    return this.http.get<ApiResponse<PharmacyRequest[]>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No requests data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Fetch processed (non-pending) pharmacy requests
   */
  getProcessedRequests(): Observable<PharmacyRequest[]> {
    const url = `${this.baseUrl}/requests/processed`;
    
    return this.http.get<ApiResponse<PharmacyRequest[]>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No processed requests data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Fetch requests by status
   */
  getRequestsByStatus(status: PharmacyRequestStatus): Observable<PharmacyRequest[]> {
    const url = `${this.baseUrl}/requests/status/${status}`;
    
    return this.http.get<ApiResponse<PharmacyRequest[]>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No requests data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get pharmacy statistics
   */
  getPharmacyStats(): Observable<PharmacyStats> {
    const url = `${this.baseUrl}/stats`;
    
    return this.http.get<ApiResponse<PharmacyStats>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No statistics data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get request details by ID
   */
  getRequestById(requestId: number): Observable<PharmacyRequest> {
    const url = `${this.baseUrl}/requests/${requestId}`;
    
    return this.http.get<ApiResponse<PharmacyRequest>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No request data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update request status (approve/reject)
   */
  updateRequestStatus(updateData: UpdateRequestStatusDto): Observable<RequestStatusUpdateResponse> {
    const url = `${this.baseUrl}/requests/${updateData.requestId}/status`;
    
    return this.http.put<ApiResponse<RequestStatusUpdateResponse>>(url, updateData).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No update response received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Approve a pharmacy request
   */
  approveRequest(requestId: number, approvedBy: number, notes?: string): Observable<RequestStatusUpdateResponse> {
    const updateData: UpdateRequestStatusDto = {
      requestId,
      newStatus: PharmacyRequestStatus.APPROVED,
      approvedBy,
      reason: notes
    };
    
    return this.updateRequestStatus(updateData);
  }

  /**
   * Reject a pharmacy request
   */
  rejectRequest(requestId: number, rejectedBy: number, rejectionReason: string): Observable<RequestStatusUpdateResponse> {
    const updateData: UpdateRequestStatusDto = {
      requestId,
      newStatus: PharmacyRequestStatus.REJECTED,
      rejectedBy,
      reason: rejectionReason
    };
    
    return this.updateRequestStatus(updateData);
  }

  /**
   * Get available status transitions for a request
   */
  getAvailableStatusTransitions(currentStatus: PharmacyRequestStatus): Observable<PharmacyRequestStatus[]> {
    const url = `${this.baseUrl}/requests/status-transitions/${currentStatus}`;
    
    return this.http.get<ApiResponse<PharmacyRequestStatus[]>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No status transitions data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Search requests by patient name or medication
   */
  searchRequests(query: string): Observable<PharmacyRequest[]> {
    const url = `${this.baseUrl}/requests/search?q=${encodeURIComponent(query)}`;
    
    return this.http.get<ApiResponse<PharmacyRequest[]>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No search results received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get requests within a date range
   */
  getRequestsByDateRange(startDate: string, endDate: string): Observable<PharmacyRequest[]> {
    const url = `${this.baseUrl}/requests/date-range?start=${startDate}&end=${endDate}`;
    
    return this.http.get<ApiResponse<PharmacyRequest[]>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No requests data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request data';
          break;
        case 401:
          errorMessage = 'Unauthorized access';
          break;
        case 403:
          errorMessage = 'Access forbidden';
          break;
        case 404:
          errorMessage = 'Request not found';
          break;
        case 409:
          errorMessage = 'Request conflict - status may have already been updated';
          break;
        case 422:
          errorMessage = 'Validation error';
          break;
        case 500:
          errorMessage = 'Internal server error';
          break;
        default:
          errorMessage = `Server error: ${error.status}`;
      }
    }
    
    console.error('Pharmacy service error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
