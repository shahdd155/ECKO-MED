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
  id?: number;
  type: string;
  date: string;
  description: string;
  imageBase64: string;
  bodypart?: string;
}
