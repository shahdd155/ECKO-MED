export interface Visit {
  id: number;
  doctorName: string;
  hospitalName: string;
  visitDate: string;
  department: string;
}

export interface Prescription {
  id: number;
  dosage: string;
  frequency: string;
  duration: string;
  doctorNotes: string;
  medDate: string;
  timing : string;
}

export interface Scan {
  id: number;
  type: string;
  bodypart: string;
  date: string;
  description: string;
  ImageBase64: string;
}
