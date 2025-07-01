import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { PatientData, LabTest, Prescription, MedicalScan, MedicalNote } from '../../../models';
import { DataEntryProfile } from '../../../models/user.model';


export interface Department {
  name: string;
  description: string;
  capacity: number;
  numOfDoctors: number;
  estimateWaitingTime: number; // in minutes
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
    return this.http.get<UserData>(`${this.baseUrl}/FetchData`, { params, withCredentials: true });
  }

  createPatient(patientData: AddPatientDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/AddPatient`, patientData, { withCredentials: true });
  }

  getAvailableDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/Departments`, { withCredentials: true });
  }

  // =================================================================
  // === PATIENT INTERACTION
  // =================================================================

  fetchPatientData(userId: string): Observable<PatientDataResponse> {
    const params = new HttpParams().set('Id', userId);
    return this.http.get<PatientDataResponse>(`${this.baseUrl}/PatientData`, { params, withCredentials: true });
  }

  fetchLabTests(patientId: string): Observable<LabTest[]> {
    const params = new HttpParams().set('Id', patientId);
    return this.http.get<LabTest[]>(`${this.baseUrl}/LabTests`, { params, withCredentials: true });
  }

  fetchPrescriptions(patientId: string): Observable<Prescription[]> {
      const params = new HttpParams().set('Id', patientId);
      return this.http.get<Prescription[]>(`${this.baseUrl}/Medicines`, { params, withCredentials: true });
  }

  fetchScans(patientId: string): Observable<MedicalScan[]> {
      const params = new HttpParams().set('Id', patientId);
      return this.http.get<MedicalScan[]>(`${this.baseUrl}/Scans`, { params, withCredentials: true });
  }

  fetchNotes(patientId: string): Observable<MedicalNote[]> {
      const params = new HttpParams().set('Id', patientId);
      return this.http.get<MedicalNote[]>(`${this.baseUrl}/Notes`, { params, withCredentials: true });
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
    return this.http.post(`${this.baseUrl}/Add-Test`, formData, { withCredentials: true });
  }

  addPrescription(prescriptionData: AddMedicineDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/Add-medicine`, prescriptionData, { withCredentials: true });
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
    return this.http.post(`${this.baseUrl}/Add-Scan`, formData, { withCredentials: true });
  }

  addNote(noteData: AddNoteDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/Add-Note`, noteData, { withCredentials: true });
  }

  checkoutPatient(patientId: string): Observable<any> {
    const formData = new FormData();
    formData.append('Id', patientId);
    return this.http.post(`${this.baseUrl}/CheckOut`, formData, { withCredentials: true });
  }
  
  // =================================================================
  // === DEPARTMENTS
  // =================================================================

  getDepartmentPatients(departmentName: string): Observable<PatientInDepartment[]> {
    const params = new HttpParams().set('Department', departmentName);
    return this.http.get<PatientInDepartment[]>(`${this.baseUrl}/DepartmentPatients`, { params, withCredentials: true });
  }

  // =================================================================
  // === DASHBOARD
  // =================================================================
  
  getWeeklyDashboard(): Observable<DashboardData> {
      return this.http.get<DashboardData>(`${this.baseUrl}/DashboardWeakly`, { withCredentials: true });
  }

  getMonthlyDashboard(): Observable<DashboardData> {
      return this.http.get<DashboardData>(`${this.baseUrl}/DashboardMonthly`, { withCredentials: true });
  }

  // =================================================================
  // === PROFILE
  // =================================================================
  
  fetchDataEntryProfile(): Observable<DataEntryProfile> {
    return this.http.get<DataEntryProfile>(`${this.baseUrl}/DataEntryprofile`, { withCredentials: true });
  }
  
  updateDataEntryProfile(profileData: UpdateDataEntryProfileDto): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/UpdateDataEntryProfile`, profileData, { withCredentials: true });
  }
}
