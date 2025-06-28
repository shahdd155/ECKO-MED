import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { PatientData, LabTest, Prescription, MedicalScan, MedicalNote } from '../../../models';

// Interfaces
export interface UserData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  street: string;
  city: string;
}

export interface CreatePatientDto {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  phoneNumber: string;
  email?: string;
  address: {
    street: string;
    city: string;
  };
  department: string;
  entryDateTime: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PatientInteractionData {
  patientId: string;
  labTests: LabTest[];
  prescriptions: Prescription[];
  scans: MedicalScan[];
  notes: MedicalNote[];
  savedAt: Date;
}

export interface CheckoutData {
  patientId: string;
  checkoutTime: Date;
  totalLabTests: number;
  totalPrescriptions: number;
  totalScans: number;
  totalNotes: number;
  pendingItems: {
    labTests: number;
    scans: number;
  };
}

export interface DataEntryProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  city: string;
  hospitalName: string;
  departments: string[];
  employeeId: string;
  dateJoined: Date;
  isActive: boolean;
  lastUpdated: Date;
}

export interface UpdateDataEntryProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departments: string[];
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  profile: DataEntryProfile;
}

@Injectable({
  providedIn: 'root'
})
export class DataEntryService {
  private readonly baseUrl = environment.apiUrl + '/data-entry';

  constructor(private http: HttpClient) {}

  /**
   * Fetch user data by user ID
   */
  fetchUserData(userId: string): Observable<UserData> {
    const url = `${this.baseUrl}/users/${userId}`;
    
    return this.http.get<ApiResponse<UserData>>(url).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to fetch user data');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Create a new patient
   */
  createPatient(patientData: CreatePatientDto): Observable<ApiResponse<any>> {
    const url = `${this.baseUrl}/patients`;
    
    return this.http.post<ApiResponse<any>>(url, patientData).pipe(
      map(response => {
        if (response.success) {
          return response;
        } else {
          throw new Error(response.message || 'Failed to create patient');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get available departments
   */
  getAvailableDepartments(): Observable<string[]> {
    const url = `${this.baseUrl}/departments`;
    
    return this.http.get<ApiResponse<string[]>>(url).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to fetch departments');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Validate user ID exists
   */
  validateUserId(userId: string): Observable<boolean> {
    const url = `${this.baseUrl}/users/${userId}/validate`;
    
    return this.http.get<ApiResponse<{ exists: boolean }>>(url).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data.exists;
        } else {
          throw new Error(response.message || 'Failed to validate user ID');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Fetch patient data by user ID
   */
  fetchPatientData(userId: string): Observable<PatientData> {
    const url = `${this.baseUrl}/patients/${userId}`;
    
    return this.http.get<ApiResponse<PatientData>>(url).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to fetch patient data');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Load patient interactions (lab tests, prescriptions, scans, notes)
   */
  loadPatientInteractions(userId: string): Observable<{
    labTests: LabTest[];
    prescriptions: Prescription[];
    scans: MedicalScan[];
    notes: MedicalNote[];
  }> {
    const url = `${this.baseUrl}/patients/${userId}/interactions`;
    
    return this.http.get<ApiResponse<{
      labTests: LabTest[];
      prescriptions: Prescription[];
      scans: MedicalScan[];
      notes: MedicalNote[];
    }>>(url).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to load patient interactions');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Add new lab test
   */
  addLabTest(userId: string, labTest: LabTest): Observable<ApiResponse<LabTest>> {
    const url = `${this.baseUrl}/patients/${userId}/lab-tests`;
    
    return this.http.post<ApiResponse<LabTest>>(url, labTest).pipe(
      map(response => {
        if (response.success && response.data) {
          return response;
        } else {
          throw new Error(response.message || 'Failed to add lab test');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Add new prescription
   */
  addPrescription(userId: string, prescription: Prescription): Observable<ApiResponse<Prescription>> {
    const url = `${this.baseUrl}/patients/${userId}/prescriptions`;
    
    return this.http.post<ApiResponse<Prescription>>(url, prescription).pipe(
      map(response => {
        if (response.success && response.data) {
          return response;
        } else {
          throw new Error(response.message || 'Failed to add prescription');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Add new scan
   */
  addScan(userId: string, scan: MedicalScan): Observable<ApiResponse<MedicalScan>> {
    const url = `${this.baseUrl}/patients/${userId}/scans`;
    
    return this.http.post<ApiResponse<MedicalScan>>(url, scan).pipe(
      map(response => {
        if (response.success && response.data) {
          return response;
        } else {
          throw new Error(response.message || 'Failed to add scan');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Add new medical note
   */
  addNote(userId: string, note: MedicalNote): Observable<ApiResponse<MedicalNote>> {
    const url = `${this.baseUrl}/patients/${userId}/notes`;
    
    return this.http.post<ApiResponse<MedicalNote>>(url, note).pipe(
      map(response => {
        if (response.success && response.data) {
          return response;
        } else {
          throw new Error(response.message || 'Failed to add note');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Fetch patient interactions by patient ID
   */
  fetchPatientInteractions(patientId: string): Observable<PatientInteractionData> {
    const url = `${this.baseUrl}/patients/${patientId}/interactions`;
    
    return this.http.get<ApiResponse<PatientInteractionData>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No patient interactions data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Save a new lab test for a patient
   */
  saveLabTest(patientId: string, labTest: LabTest): Observable<LabTest> {
    const url = `${this.baseUrl}/patients/${patientId}/lab-tests`;
    
    return this.http.post<ApiResponse<LabTest>>(url, labTest).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No lab test data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Save a new prescription for a patient
   */
  savePrescription(patientId: string, prescription: Prescription): Observable<Prescription> {
    const url = `${this.baseUrl}/patients/${patientId}/prescriptions`;
    
    return this.http.post<ApiResponse<Prescription>>(url, prescription).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No prescription data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Save a new scan for a patient
   */
  saveScan(patientId: string, scan: MedicalScan): Observable<MedicalScan> {
    const url = `${this.baseUrl}/patients/${patientId}/scans`;
    
    return this.http.post<ApiResponse<MedicalScan>>(url, scan).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No scan data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Save a new note for a patient
   */
  saveNote(patientId: string, note: MedicalNote): Observable<MedicalNote> {
    const url = `${this.baseUrl}/patients/${patientId}/notes`;
    
    return this.http.post<ApiResponse<MedicalNote>>(url, note).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No note data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Save all patient interactions
   */
  savePatientInteractions(interactionData: PatientInteractionData): Observable<PatientInteractionData> {
    const url = `${this.baseUrl}/patients/${interactionData.patientId}/interactions`;
    
    return this.http.post<ApiResponse<PatientInteractionData>>(url, interactionData).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No interaction data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Checkout patient (finalize visit)
   */
  checkoutPatient(checkoutData: CheckoutData): Observable<CheckoutData> {
    const url = `${this.baseUrl}/patients/${checkoutData.patientId}/checkout`;
    
    return this.http.post<ApiResponse<CheckoutData>>(url, checkoutData).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No checkout data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Upload file for lab test or scan
   */
  uploadFile(userId: string, fileType: 'lab-test' | 'scan', file: File): Observable<ApiResponse<{ fileUrl: string; fileName: string }>> {
    const url = `${this.baseUrl}/patients/${userId}/upload/${fileType}`;
    
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ApiResponse<{ fileUrl: string; fileName: string }>>(url, formData).pipe(
      map(response => {
        if (response.success && response.data) {
          return response;
        } else {
          throw new Error(response.message || 'Failed to upload file');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Fetch data entry profile by user ID
   */
  fetchDataEntryProfile(userId: string): Observable<DataEntryProfile> {
    const url = `${this.baseUrl}/data-entry/profile/${userId}`;
    
    return this.http.get<ApiResponse<DataEntryProfile>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No profile data received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update data entry profile
   */
  updateDataEntryProfile(userId: string, updateData: UpdateDataEntryProfileDto): Observable<ProfileUpdateResponse> {
    const url = `${this.baseUrl}/data-entry/profile/${userId}`;
    
    return this.http.put<ApiResponse<ProfileUpdateResponse>>(url, updateData).pipe(
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
   * Upload profile picture
   */
  uploadProfilePicture(userId: string, file: File): Observable<{ profilePicture: string }> {
    const url = `${this.baseUrl}/data-entry/profile/${userId}/picture`;
    
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    return this.http.post<ApiResponse<{ profilePicture: string }>>(url, formData).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No upload response received');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get available departments for data entry staff
   */
  getDataEntryDepartments(): Observable<string[]> {
    const url = `${this.baseUrl}/data-entry/departments`;
    
    return this.http.get<ApiResponse<string[]>>(url).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('No departments data received');
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
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'User not found. Please check the User ID.';
          break;
        case 409:
          errorMessage = 'User already exists in the system.';
          break;
        case 422:
          errorMessage = 'Validation error. Please check your input.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Server error: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('DataEntryService error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
