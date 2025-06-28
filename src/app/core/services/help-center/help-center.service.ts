import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { SupportTicket } from '../../../models/ticket';

// API Response interfaces
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface TicketSubmissionResponse {
  success: boolean;
  message: string;
  ticketId?: string;
  ticket?: SupportTicket;
}

interface TicketHistoryResponse {
  success: boolean;
  message: string;
  tickets?: SupportTicket[];
  totalCount?: number;
}

interface TicketStatus {
  id: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  updatedAt: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface TicketUpdate {
  ticketId: string;
  status: TicketStatus['status'];
  priority: TicketStatus['priority'];
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HelpCenterService {
  private baseUrl = environment.apiUrl + '/help-center';

  constructor(private http: HttpClient) {}

  /**
   * Submit a new support ticket
   */
  submitTicket(ticket: SupportTicket): Observable<TicketSubmissionResponse> {
    const url = `${this.baseUrl}/tickets`;
    
    return this.http.post<ApiResponse<TicketSubmissionResponse>>(url, ticket).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No submission response received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get user's ticket history
   */
  getUserTickets(userId: string, page: number = 1, limit: number = 10): Observable<TicketHistoryResponse> {
    const url = `${this.baseUrl}/tickets/user/${userId}?page=${page}&limit=${limit}`;
    
    return this.http.get<ApiResponse<TicketHistoryResponse>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No ticket history received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get ticket by ID
   */
  getTicketById(ticketId: string): Observable<SupportTicket> {
    const url = `${this.baseUrl}/tickets/${ticketId}`;
    
    return this.http.get<ApiResponse<SupportTicket>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No ticket data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update ticket status
   */
  updateTicketStatus(update: TicketUpdate): Observable<TicketStatus> {
    const url = `${this.baseUrl}/tickets/${update.ticketId}/status`;
    
    return this.http.put<ApiResponse<TicketStatus>>(url, update).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No status update response received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Add comment to ticket
   */
  addTicketComment(ticketId: string, comment: string, isInternal: boolean = false): Observable<any> {
    const url = `${this.baseUrl}/tickets/${ticketId}/comments`;
    
    const commentData = {
      comment,
      isInternal,
      timestamp: new Date().toISOString()
    };
    
    return this.http.post<ApiResponse<any>>(url, commentData).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No comment response received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get ticket comments
   */
  getTicketComments(ticketId: string): Observable<any[]> {
    const url = `${this.baseUrl}/tickets/${ticketId}/comments`;
    
    return this.http.get<ApiResponse<any[]>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No comments data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Search tickets
   */
  searchTickets(query: string, userId?: string): Observable<SupportTicket[]> {
    let url = `${this.baseUrl}/tickets/search?q=${encodeURIComponent(query)}`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    
    return this.http.get<ApiResponse<SupportTicket[]>>(url).pipe(
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
   * Get ticket statistics for user
   */
  getUserTicketStats(userId: string): Observable<any> {
    const url = `${this.baseUrl}/tickets/stats/user/${userId}`;
    
    return this.http.get<ApiResponse<any>>(url).pipe(
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
   * Get FAQ categories
   */
  getFaqCategories(): Observable<any[]> {
    const url = `${this.baseUrl}/faq/categories`;
    
    return this.http.get<ApiResponse<any[]>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No FAQ categories received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get FAQ by category
   */
  getFaqByCategory(categoryId: string): Observable<any[]> {
    const url = `${this.baseUrl}/faq/category/${categoryId}`;
    
    return this.http.get<ApiResponse<any[]>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No FAQ data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Search FAQ
   */
  searchFaq(query: string): Observable<any[]> {
    const url = `${this.baseUrl}/faq/search?q=${encodeURIComponent(query)}`;
    
    return this.http.get<ApiResponse<any[]>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No FAQ search results received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Rate FAQ helpfulness
   */
  rateFaqHelpfulness(faqId: string, isHelpful: boolean): Observable<any> {
    const url = `${this.baseUrl}/faq/${faqId}/rate`;
    
    return this.http.post<ApiResponse<any>>(url, { isHelpful }).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No rating response received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get contact information
   */
  getContactInfo(): Observable<any> {
    const url = `${this.baseUrl}/contact-info`;
    
    return this.http.get<ApiResponse<any>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No contact information received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Send contact form
   */
  sendContactForm(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    category: string;
  }): Observable<any> {
    const url = `${this.baseUrl}/contact`;
    
    return this.http.post<ApiResponse<any>>(url, contactData).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No contact form response received');
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
          errorMessage = 'Resource not found';
          break;
        case 409:
          errorMessage = 'Ticket already exists';
          break;
        case 422:
          errorMessage = 'Validation error';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Internal server error';
          break;
        default:
          errorMessage = `Server error: ${error.status}`;
      }
    }
    
    console.error('Help center service error:', error);
    return throwError(() => new Error(errorMessage));
  }
} 