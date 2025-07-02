import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { PharmacyRequest } from '../../../models/PharmacyRequest';
export enum PharmacyRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}
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
    
    return this.http.get<ApiResponse<PharmacyRequest[]>>(url, { withCredentials: true }).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No requests data received');
        }
        return response.data;
      })
    );
  }

  /**
   * Fetch processed (non-pending) pharmacy requests
   */
  getProcessedRequests(): Observable<any> {
    const url = `${this.baseUrl}/Closed-requests`;
    return this.http.get<any>(url, { withCredentials: true });
  }

  /**
   * Fetch pending pharmacy requests (matches backend: GET /Pharmacy/Pending-requests)
   */
  getRequestsByStatus(): Observable<any> {
    const url = `${this.baseUrl}/Pending-requests`;
    return this.http.get<any>(url, { withCredentials: true });
  }

  /**
   * Get pharmacy statistics
   */
  getPharmacyStats(): Observable<PharmacyStats> {
    const url = `${this.baseUrl}/stats`;
    
    return this.http.get<ApiResponse<PharmacyStats>>(url, { withCredentials: true }).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No statistics data received');
        }
        return response.data;
      })
    );
  }

  /**
   * Get request details by ID
   */
  getRequestById(requestId: number): Observable<PharmacyRequest> {
    const url = `${this.baseUrl}/requests/${requestId}`;
    
    return this.http.get<ApiResponse<PharmacyRequest>>(url, { withCredentials: true }).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No request data received');
        }
        return response.data;
      })
    );
  }

  /**
   * Update request status (approve/reject)
   */
  updateRequestStatus(updateData: UpdateRequestStatusDto): Observable<RequestStatusUpdateResponse> {
    const url = `${this.baseUrl}/requests/${updateData.requestId}/status`;
    
    return this.http.put<ApiResponse<RequestStatusUpdateResponse>>(url, updateData, { withCredentials: true }).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No update response received');
        }
        return response.data;
      })
    );
  }

  /**
   * Approve a single pharmacy request (POST /Pharmacy/Approve-request)
   */
  approveRequest(requestId: number): Observable<any> {
    const url = `${this.baseUrl}/Approve-request`;
    return this.http.post<any>(url, requestId, { withCredentials: true });
  }

  /**
   * Approve multiple pharmacy requests (matches backend: POST /Pharmacy/Approve-requests)
   */
  approveRequests(requestIds: number[]): Observable<any> {
    const url = `${this.baseUrl}/Approve-requests`;
    return this.http.post<any>(url, requestIds, { withCredentials: true });
  }

  /**
   * Reject a single pharmacy request (POST /Pharmacy/Reject-request)
   */
  rejectRequest(requestId: number): Observable<any> {
    const url = `${this.baseUrl}/Reject-request`;
    return this.http.post<any>(url, requestId, { withCredentials: true });
  }

  /**
   * Reject multiple pharmacy requests (matches backend: POST /Pharmacy/Reject-requests)
   */
  rejectRequests(requestIds: number[]): Observable<any> {
    const url = `${this.baseUrl}/Reject-requests`;
    return this.http.post<any>(url, requestIds, { withCredentials: true });
  }

  /**
   * Get available status transitions for a request
   */
  getAvailableStatusTransitions(currentStatus: PharmacyRequestStatus): Observable<PharmacyRequestStatus[]> {
    const url = `${this.baseUrl}/requests/status-transitions/${currentStatus}`;
    
    return this.http.get<ApiResponse<PharmacyRequestStatus[]>>(url, { withCredentials: true }).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No status transitions data received');
        }
        return response.data;
      })
    );
  }

  /**
   * Search requests by patient name or medication
   */
  searchRequests(query: string): Observable<PharmacyRequest[]> {
    const url = `${this.baseUrl}/requests/search?q=${encodeURIComponent(query)}`;
    
    return this.http.get<ApiResponse<PharmacyRequest[]>>(url, { withCredentials: true }).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No search results received');
        }
        return response.data;
      })
    );
  }

  /**
   * Get requests within a date range
   */
  getRequestsByDateRange(startDate: string, endDate: string): Observable<PharmacyRequest[]> {
    const url = `${this.baseUrl}/requests/date-range?start=${startDate}&end=${endDate}`;
    
    return this.http.get<ApiResponse<PharmacyRequest[]>>(url, { withCredentials: true }).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No requests data received');
        }
        return response.data;
      })
    );
  }

  /**
   * Toggle response for a closed request (POST /Pharmacy/Toggle-response)
   */
  toggleResponse(requestId: number): Observable<any> {
    const url = `${this.baseUrl}/Toggle-response`;
    return this.http.post<any>(url, requestId, { withCredentials: true });
  }
}
