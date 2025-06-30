import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { PatientData, LabTest, Prescription, MedicalScan, MedicalNote } from '../../../models';

// ### NEW INTERFACES TO MATCH BACKEND ###

export interface Department {
  name: string;
  description: string;
  capacity: number;
  numOfDoctors: number;
}

export interface AddPatientDto {
  userId: string;
  departmentName: string;
  doctorName: string; // This might need to be added to the form
  dateTime: Date;
}

export interface AddMedicineDto {
  patientID: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: string;
  medicineNotes: string;
}

export interface AddNoteDto {
  patientID: string;
  noteType: string;
  noteContent: string;
}

export interface AddScanDto {
  patientID: string;
  scanType: string;
  scanPart: string;
  note: string;
  image?: File;
}

export interface AddTestDto {
  patientID: string;
  testName: string;
  testType: string;
  note: string;
  image?: File;
}

export interface PatientInDepartment {
    name: string;
    gender: string;
    age: number;
    waiting: number;
}

export interface DashboardData {
    dataEntryName: string;
    currentWeek?: any;
    changeFromLastWeek?: any;
    currentMonth?: any;
    changeFromLastMonth?: any;
    dailyBreakdown: any;
}

export interface DataEntryProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  hospitalName: string;
  city: string;
  profilePicture?: string; // Kept for UI, but not from backend
}

export interface UpdateDataEntryProfileDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}


// Interfaces from previous implementation that might need updates
export interface UserData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  age: number;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
}

export interface PatientDataResponse {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    age: number;
    phoneNumber: string;
    email: string;
    address: string;
    city: string;
    labTestsCount: number;
    medicineCount: number;
    notesCount: number;
    scansCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataEntryService {
  private readonly baseUrl = environment.apiUrl + '/DataEntry';

  constructor(private http: HttpClient) {}

  // =================================================================
  // === ADD PATIENT & RELATED-
  // =================================================================

  fetchUserData(userId: string): Observable<UserData> {
    const params = new HttpParams().set('Id', userId);
    return this.http.get<UserData>(`${this.baseUrl}/FetchData`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  createPatient(patientData: AddPatientDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/AddPatient`, patientData).pipe(
      catchError(this.handleError)
    );
  }

  getAvailableDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/Departments`).pipe(
      catchError(this.handleError)
    );
  }

  // =================================================================
  // === PATIENT INTERACTION
  // =================================================================

  fetchPatientData(userId: string): Observable<PatientDataResponse> {
    const params = new HttpParams().set('Id', userId);
    return this.http.get<PatientDataResponse>(`${this.baseUrl}/PatientData`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  fetchLabTests(patientId: string): Observable<LabTest[]> {
    const params = new HttpParams().set('Id', patientId);
    return this.http.get<LabTest[]>(`${this.baseUrl}/LabTests`, { params }).pipe(
        catchError(this.handleError)
    );
  }

  fetchPrescriptions(patientId: string): Observable<Prescription[]> {
      const params = new HttpParams().set('Id', patientId);
      return this.http.get<Prescription[]>(`${this.baseUrl}/Medicines`, { params }).pipe(
          catchError(this.handleError)
      );
  }

  fetchScans(patientId: string): Observable<MedicalScan[]> {
      const params = new HttpParams().set('Id', patientId);
      return this.http.get<MedicalScan[]>(`${this.baseUrl}/Scans`, { params }).pipe(
          catchError(this.handleError)
      );
  }

  fetchNotes(patientId: string): Observable<MedicalNote[]> {
      const params = new HttpParams().set('Id', patientId);
      return this.http.get<MedicalNote[]>(`${this.baseUrl}/Notes`, { params }).pipe(
          catchError(this.handleError)
      );
  }

  addLabTest(testData: AddTestDto): Observable<any> {
    const formData = new FormData();
    formData.append('PatientID', testData.patientID);
    formData.append('TestName', testData.testName);
    formData.append('TestType', testData.testType);
    formData.append('Note', testData.note);
    if (testData.image) {
      formData.append('Image', testData.image, testData.image.name);
    }
    return this.http.post(`${this.baseUrl}/Add-Test`, formData).pipe(
        catchError(this.handleError)
    );
  }

  addPrescription(prescriptionData: AddMedicineDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/Add-medicine`, prescriptionData).pipe(
        catchError(this.handleError)
    );
  }

  addScan(scanData: AddScanDto): Observable<any> {
    const formData = new FormData();
    formData.append('PatientID', scanData.patientID);
    formData.append('ScanType', scanData.scanType);
    formData.append('ScanPart', scanData.scanPart);
    formData.append('Note', scanData.note);
    if (scanData.image) {
        formData.append('Image', scanData.image, scanData.image.name);
    }
    return this.http.post(`${this.baseUrl}/Add-Scan`, formData).pipe(
        catchError(this.handleError)
    );
  }

  addNote(noteData: AddNoteDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/Add-Note`, noteData).pipe(
        catchError(this.handleError)
    );
  }

  checkoutPatient(patientId: string): Observable<any> {
    const formData = new FormData();
    formData.append('Id', patientId);
    return this.http.post(`${this.baseUrl}/CheckOut`, formData).pipe(
        catchError(this.handleError)
    );
  }
  
  // =================================================================
  // === DEPARTMENTS
  // =================================================================

  getDepartmentPatients(departmentName: string): Observable<PatientInDepartment[]> {
    const params = new HttpParams().set('Department', departmentName);
    return this.http.get<PatientInDepartment[]>(`${this.baseUrl}/DepartmentPatients`, { params }).pipe(
        catchError(this.handleError)
    );
  }

  // =================================================================
  // === DASHBOARD
  // =================================================================
  
  getWeeklyDashboard(): Observable<DashboardData> {
      return this.http.get<DashboardData>(`${this.baseUrl}/DashboardWeakly`).pipe(
          catchError(this.handleError)
      );
  }

  getMonthlyDashboard(): Observable<DashboardData> {
      return this.http.get<DashboardData>(`${this.baseUrl}/DashboardMonthly`).pipe(
          catchError(this.handleError)
      );
  }

  // =================================================================
  // === PROFILE
  // =================================================================
  
  fetchDataEntryProfile(): Observable<DataEntryProfile> {
    return this.http.get<DataEntryProfile>(`${this.baseUrl}/DataEntryprofile`).pipe(
        catchError(this.handleError)
    );
  }
  
  updateDataEntryProfile(profileData: UpdateDataEntryProfileDto): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/UpdateDataEntryProfile`, profileData).pipe(
          catchError(this.handleError)
      );
  }


  // =================================================================
  // === ERROR HANDLER
  // =================================================================

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Bad request. Please check your input.';
            if(error.error.errors) {
                // Handle validation errors
                errorMessage += `\n${JSON.stringify(error.error.errors)}`;
            }
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            break;
          case 403:
            errorMessage = 'Forbidden. You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `Server error: ${error.status} - ${error.message}`;
        }
      }
    }
    
    console.error('DataEntryService error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
