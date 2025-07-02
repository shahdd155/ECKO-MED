export interface Visit {
  Id: number;
  DoctorName: string;
  HospitalName: string;
  visitDate: string;
  Department: string;
}

export interface Prescription {
  Id: number;
  Dosage: string;
  frequency: string;
  Duration: string;
  DoctorNotes: string;
  MedDate: string;
}

export interface Scan {
  Type: string;
  Date: string;
  Description: string;
  ImageBase64: string;
}
