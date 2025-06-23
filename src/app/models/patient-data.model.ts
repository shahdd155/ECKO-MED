export interface PatientData {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  phoneNumber: string;
  email?: string;
  address: {
    street: string;
    city: string;
  };
} 