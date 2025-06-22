/**
 * Main interface for pharmacy requests (patient direct requests)
 */
export interface PharmacyRequest {
  // Request identification
  id: number;
  
  // Patient information
  patientId: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  
  // Medication details
  medicationId: number;
  medication: string;
  dosage: string;
  quantity: number;
  unit: string;
  
  // Request status and workflow
  status: PharmacyRequestStatus;
  requestDate: string;
  
  // Approval workflow
  approvedDate?: string;
  approvedBy?: number;
  approvedByName?: string;
  
  // Rejection workflow
  rejectedDate?: string;
  rejectedBy?: number;
  rejectedByName?: string;
  rejectionReason?: string;
  
  // Additional information
  notes?: string;
  
  // Financial information
  cost?: number;
  currency?: string;
  insuranceCovered?: boolean;
  
  // Audit trail
  createdAt: string;
  updatedAt: string;
}

export enum PharmacyRequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
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
  status?: PharmacyRequestStatus[];
  patientName?: string;
  medication?: string;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
