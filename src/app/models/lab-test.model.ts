export interface LabTest {
  id?: string;
  testName: string;
  testType: string;
  status: 'pending' | 'completed' | 'cancelled';
  orderedDate: Date;
  resultDate?: Date;
  notes?: string;
  uploadedFile?: File;
  fileName?: string;
  fileUrl?: string;
} 