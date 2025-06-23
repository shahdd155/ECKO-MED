export interface MedicalScan {
  id?: string;
  scanType: string;
  bodyPart: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduledDate: Date;
  completedDate?: Date;
  notes?: string;
  uploadedFile?: File;
  fileName?: string;
  fileUrl?: string;
} 