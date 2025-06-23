export interface Medicine {
    id: number;
    name: string;
    genericName?: string;
    dosage: string;
    form: string;
    strength: string; // 100mg, 500mg, etc.
    manufacturer: string;
    description?: string;
    prescriptionRequired: boolean;
    category: string; // pain relief, antibiotics, etc.
    activeIngredients: string[];
    sideEffects?: string[];
    interactions?: string[];
    imageUrl?: string;
  }
  
  export interface Pharmacy {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email?: string;
    website?: string;
    latitude: number;
    longitude: number;
    distance?: number; // calculated distance from user
    rating: number;
    totalReviews: number;
    isOpen: boolean;
    openingHours: {
      [key: string]: string; // day -> hours
    };
    services: string[]; // delivery, consultation, etc.
    imageUrl?: string;
  }
  
  export interface PharmacyInventory {
    id: number;
    pharmacyId: number;
    pharmacy: Pharmacy;
    medicineId: number;
    medicine: Medicine;
    quantity: number;
    unit: string;
    price: number;
    currency: string;
    discount?: number;
    expiryDate?: string;
    isAvailable: boolean;
    lastUpdated: string;
  }
  
  export interface MedicineSearchRequest {
    medicineId: number;
    quantity: number;
    unit: string;
    latitude?: number;
    longitude?: number;
    radius?: number; // search radius in km
  }
  
  export interface MedicineSearchResponse {
    success: boolean;
    message: string;
    data: PharmacyInventory[];
    total: number;
  }
  
  export interface PharmacyRequest {
    pharmacyId: number;
    medicineId: number;
    quantity: number;
    unit: string;
    patientId: number;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    notes?: string;
  }
  
  export interface PharmacyRequestResponse {
    success: boolean;
    message: string;
    requestId?: number;
    data?: any;
  } 