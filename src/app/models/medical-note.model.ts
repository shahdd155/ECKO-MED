export interface MedicalNote {
  id?: string;
  noteType: 'general' | 'diagnosis' | 'treatment' | 'follow-up';
  content: string;
  createdDate: Date;
  createdBy: string;
} 