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