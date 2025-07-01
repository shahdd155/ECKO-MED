import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environment/environment';
import { 
  Medicine, 
  PharmacyInventory, 
  MedicineSearchRequest, 
  MedicineSearchResponse,
  PharmacyRequest,
  PharmacyRequestResponse 
} from '../../../models/medicine.model';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private apiUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) { }

  // Get all available medicines from backend
  getMedicines(): Observable<Medicine[]> {
    // TODO: Replace with actual API call when backend is ready
    // This endpoint does not exist in UserController.cs
    // return this.http.get<Medicine[]>(`${this.baseUrl}/api/medicines`, { withCredentials: true });

    // Mock data for now
    return of([
      {
        id: 1,
        name: 'Aspirin',
        genericName: 'Acetylsalicylic Acid',
        dosage: '100mg',
        form: 'tablet',
        strength: '100mg',
        manufacturer: 'Bayer',
        description: 'Pain reliever and fever reducer',
        prescriptionRequired: false,
        category: 'Pain Relief',
        activeIngredients: ['Acetylsalicylic Acid'],
        sideEffects: ['Stomach upset', 'Bleeding risk'],
        interactions: ['Blood thinners', 'Alcohol']
      },
      {
        id: 2,
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        dosage: '200mg',
        form: 'tablet',
        strength: '200mg',
        manufacturer: 'Advil',
        description: 'Non-steroidal anti-inflammatory drug',
        prescriptionRequired: false,
        category: 'Pain Relief',
        activeIngredients: ['Ibuprofen'],
        sideEffects: ['Stomach irritation', 'Kidney problems'],
        interactions: ['Blood pressure medications']
      }
    ]);
  }

  // Search for pharmacies with specific medicine in stock
  searchPharmacies(request: { medicineName: string, latitude?: number, longitude?: number, distance?: number }): Observable<any> {
    // Compose query params
    let params = `?MedicineName=${encodeURIComponent(request.medicineName)}`;
    if (request.latitude !== undefined && request.longitude !== undefined) {
      params += `&Lat=${request.latitude}&Lang=${request.longitude}`;
    }
    if (request.distance !== undefined) {
      params += `&Distance=${request.distance}`;
    }
    return this.http.get<any>(`${this.apiUrl}/pharmacysearch${params}`, { withCredentials: true });
  }

  // Send a medicine request to a pharmacy
  sendPharmacyRequest(request: { pharmacyId: string, medicineName: string, quantity: number }): Observable<any> {
    const payload = {
      PharmacyId: request.pharmacyId,
      MedicineName: request.medicineName,
      qty: request.quantity
    };
    return this.http.post<any>(`${this.apiUrl}/medicine-request`, payload, { withCredentials: true });
  }

  getCurrentLocation(): Promise<{latitude: number, longitude: number}> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }
}