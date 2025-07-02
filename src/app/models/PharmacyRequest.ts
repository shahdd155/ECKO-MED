/**
 * Main interface for pharmacy requests (patient direct requests)
 */
export interface PharmacyRequest {
  id: number;
  medicineName: string;
  qty: number;
  state: 'closed' | null; // Only 'closed' for processed requests
  Response: 'approved' | 'rejected' | null; // Backend uses Response for status
  userName: string | null;
  email: string | null;
  phoneNum: string | null;
  dateTime: string | null; // Keep for compatibility
  ClosedAt?: string | null; // For closed date if present
  // Remove or comment out any other fields not present in the backend response
}

// Response interface for API calls
export interface PharmacyRequestResponse {
  success: boolean;
  message: string;
  data?: PharmacyRequest | PharmacyRequest[];
  total?: number;
  page?: number;
  limit?: number;
}

// Filter interface for searching/filtering requests
export interface PharmacyRequestFilter {
  status?: string;
  patientName?: string;
  medication?: string;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
