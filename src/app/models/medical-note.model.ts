export interface MedicalNote {
  Id?: string;
  type: 'general' | 'diagnosis' | 'treatment' | 'follow-up';
  Text: string;
  dateTime: Date;
} 