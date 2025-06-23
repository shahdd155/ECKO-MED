export interface Prescription {
  id?: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: string;
  instructions?: string;
  prescribedDate: Date;
} 