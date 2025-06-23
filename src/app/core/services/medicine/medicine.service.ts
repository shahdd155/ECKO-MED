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
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  // Get all available medicines from backend
  getMedicines(): Observable<Medicine[]> {
    // TODO: Replace with actual API call when backend is ready
    // return this.http.get<Medicine[]>(`${this.baseUrl}/api/medicines`);
    
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
      },
      {
        id: 3,
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        dosage: '500mg',
        form: 'capsule',
        strength: '500mg',
        manufacturer: 'Generic',
        description: 'Antibiotic for bacterial infections',
        prescriptionRequired: true,
        category: 'Antibiotics',
        activeIngredients: ['Amoxicillin'],
        sideEffects: ['Diarrhea', 'Nausea'],
        interactions: ['Birth control pills']
      },
      {
        id: 4,
        name: 'Metformin',
        genericName: 'Metformin',
        dosage: '850mg',
        form: 'tablet',
        strength: '850mg',
        manufacturer: 'Generic',
        description: 'Oral diabetes medicine',
        prescriptionRequired: true,
        category: 'Diabetes',
        activeIngredients: ['Metformin'],
        sideEffects: ['Nausea', 'Diarrhea'],
        interactions: ['Alcohol']
      },
      {
        id: 5,
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        dosage: '10mg',
        form: 'tablet',
        strength: '10mg',
        manufacturer: 'Generic',
        description: 'ACE inhibitor for high blood pressure',
        prescriptionRequired: true,
        category: 'Cardiovascular',
        activeIngredients: ['Lisinopril'],
        sideEffects: ['Dry cough', 'Dizziness'],
        interactions: ['Potassium supplements']
      }
    ]);
  }

  // Search for pharmacies with specific medicine in stock
  searchPharmacies(request: MedicineSearchRequest): Observable<MedicineSearchResponse> {
    // TODO: Replace with actual API call when backend is ready
    // return this.http.post<MedicineSearchResponse>(`${this.baseUrl}/api/pharmacies/search`, request);
    
    // Mock data for now
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

    return of({
      success: true,
      message: 'Pharmacies found successfully',
      data: mockPharmacies,
      total: mockPharmacies.length
    });
  }

  // Send request to pharmacy
  sendPharmacyRequest(request: PharmacyRequest): Observable<PharmacyRequestResponse> {
    // TODO: Replace with actual API call when backend is ready
    // return this.http.post<PharmacyRequestResponse>(`${this.baseUrl}/api/pharmacy-requests`, request);
    
    // Mock response
    return of({
      success: true,
      message: 'Request sent successfully to pharmacy',
      requestId: Math.floor(Math.random() * 1000) + 1
    });
  }

  // Get user's current location
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
            console.error('Error getting location:', error);
            // Default to New York coordinates if location access is denied
            resolve({
              latitude: 40.7128,
              longitude: -74.0060
            });
          }
        );
      } else {
        // Default to New York coordinates if geolocation is not supported
        resolve({
          latitude: 40.7128,
          longitude: -74.0060
        });
      }
    });
  }
} 