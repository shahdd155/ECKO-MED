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
    // return this.http.get<Medicine[]>(`${this.baseUrl}/api/medicines`);
    
    // Mock data for now
    return of([
      { id: 1, name: 'Aspirin' },
      { id: 2, name: 'Ibuprofen' },
      { id: 3, name: 'Amoxicillin' },
      { id: 4, name: 'Metformin' },
      { id: 5, name: 'Lisinopril' }
    ]);
  }

  // Search for pharmacies with specific medicine in stock
  searchPharmacies(request: MedicineSearchRequest): Observable<MedicineSearchResponse> {
    // TODO: Replace with actual API call when backend is ready.
    // The pharmacysearch endpoint in UserController.cs does not support searching by medicine ID.
    // Leaving mock data for now.
    
    // Mock data
    const mockPharmacies: PharmacyInventory[] = [
      {
        id: 1,
        pharmacyId: 1,
        pharmacy: {
          id: 1,
          name: 'City Pharmacy',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phone: '+1 (555) 123-4567',
          email: 'info@citypharmacy.com',
          latitude: 40.7128,
          longitude: -74.0060,
          distance: 0.5,
          rating: 4.5,
          totalReviews: 128,
          isOpen: true,
          openingHours: {
            'Monday': '8:00 AM - 9:00 PM',
            'Tuesday': '8:00 AM - 9:00 PM',
            'Wednesday': '8:00 AM - 9:00 PM',
            'Thursday': '8:00 AM - 9:00 PM',
            'Friday': '8:00 AM - 9:00 PM',
            'Saturday': '9:00 AM - 7:00 PM',
            'Sunday': '10:00 AM - 6:00 PM'
          },
          services: ['Delivery', 'Consultation', 'Prescription Filling']
        },
        medicineId: request.medicineId,
        medicine: {
          id: request.medicineId,
          name: 'Aspirin',
          dosage: '100mg',
          form: 'tablet',
          strength: '100mg',
          manufacturer: 'Bayer',
          prescriptionRequired: false,
          category: 'Pain Relief',
          activeIngredients: ['Acetylsalicylic Acid']
        },
        quantity: 150,
        unit: request.unit,
        price: 8.99,
        currency: 'USD',
        discount: 0.10,
        isAvailable: true,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 2,
        pharmacyId: 2,
        pharmacy: {
          id: 2,
          name: 'Health Mart Pharmacy',
          address: '456 Oak Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          phone: '+1 (555) 234-5678',
          email: 'contact@healthmart.com',
          latitude: 40.7589,
          longitude: -73.9851,
          distance: 1.2,
          rating: 4.2,
          totalReviews: 89,
          isOpen: true,
          openingHours: {
            'Monday': '7:00 AM - 10:00 PM',
            'Tuesday': '7:00 AM - 10:00 PM',
            'Wednesday': '7:00 AM - 10:00 PM',
            'Thursday': '7:00 AM - 10:00 PM',
            'Friday': '7:00 AM - 10:00 PM',
            'Saturday': '8:00 AM - 8:00 PM',
            'Sunday': '9:00 AM - 7:00 PM'
          },
          services: ['Delivery', '24/7 Service', 'Immunizations']
        },
        medicineId: request.medicineId,
        medicine: {
          id: request.medicineId,
          name: 'Aspirin',
          dosage: '100mg',
          form: 'tablet',
          strength: '100mg',
          manufacturer: 'Bayer',
          prescriptionRequired: false,
          category: 'Pain Relief',
          activeIngredients: ['Acetylsalicylic Acid']
        },
        quantity: 75,
        unit: request.unit,
        price: 7.50,
        currency: 'USD',
        isAvailable: true,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 3,
        pharmacyId: 3,
        pharmacy: {
          id: 3,
          name: 'Care Pharmacy',
          address: '789 Pine Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10003',
          phone: '+1 (555) 345-6789',
          email: 'hello@carepharmacy.com',
          latitude: 40.7505,
          longitude: -73.9934,
          distance: 2.1,
          rating: 4.7,
          totalReviews: 156,
          isOpen: false,
          openingHours: {
            'Monday': '9:00 AM - 8:00 PM',
            'Tuesday': '9:00 AM - 8:00 PM',
            'Wednesday': '9:00 AM - 8:00 PM',
            'Thursday': '9:00 AM - 8:00 PM',
            'Friday': '9:00 AM - 8:00 PM',
            'Saturday': '10:00 AM - 6:00 PM',
            'Sunday': 'Closed'
          },
          services: ['Delivery', 'Compounding', 'Health Screenings']
        },
        medicineId: request.medicineId,
        medicine: {
          id: request.medicineId,
          name: 'Aspirin',
          dosage: '100mg',
          form: 'tablet',
          strength: '100mg',
          manufacturer: 'Bayer',
          prescriptionRequired: false,
          category: 'Pain Relief',
          activeIngredients: ['Acetylsalicylic Acid']
        },
        quantity: 200,
        unit: request.unit,
        price: 9.25,
        currency: 'USD',
        discount: 0.15,
        isAvailable: true,
        lastUpdated: new Date().toISOString()
      }
    ];
    return of({ data: mockPharmacies, success: true, message: 'Mock search successful' });
  }

  // Send a medicine request to a pharmacy
  sendPharmacyRequest(request: {pharmacyId: string, medicineName: string, quantity: number}): Observable<any> {
    const payload = {
      pharmacyId: request.pharmacyId,
      medicineName: request.medicineName,
      qty: request.quantity
    };
    return this.http.post<any>(`${this.apiUrl}/medicine-request`, payload);
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