export interface User {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    phoneNumber: string;
    username: string;
    email: string;
    profilePicture?: FormData;
    street: string;
    city: string;
    country: string;
    password: string;
    confirmPassword: string;
}

// Data Entry Staff Profile Interface
export interface DataEntryProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePicture?: string; // URL to profile picture
    city: string; // Immutable
    hospitalName: string; // Immutable
    departments: string[]; // Array of departments they work with
    employeeId: string;
    dateJoined: Date;
    isActive: boolean;
    lastUpdated: Date;
}

// DTO for updating data entry profile (excludes immutable fields)
export interface UpdateDataEntryProfileDto {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    departments: string[];
}

// Patient Interface
export interface Patient {
    id?: number;
    patientId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'male' | 'female';
    phoneNumber: string;
    email?: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    emergencyContact: {
        name: string;
        relationship: string;
        phoneNumber: string;
    };
    medicalInfo: {
        bloodType?: string;
        allergies: string[];
        medications: string[];
        medicalHistory: string[];
    };
    insurance?: {
        provider: string;
        policyNumber: string;
        groupNumber?: string;
    };
    department: string;
    admissionDate: Date;
    amountPaid: number;
    paymentStatus: 'paid' | 'pending' | 'partial';
    language: string;
    createdAt: Date;
    updatedAt: Date;
}

// DTO for creating new patient entry
export interface CreatePatientDto {
    userId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'male' | 'female';
    phoneNumber: string;
    email?: string;
    address: {
        street: string;
        city: string;
    };
    department: string;
    entryDateTime: Date;
}