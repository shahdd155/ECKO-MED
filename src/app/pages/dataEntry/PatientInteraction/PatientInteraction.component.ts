import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Import model interfaces
import { PatientData, LabTest, Prescription, MedicalScan, MedicalNote } from '../../../models';
import { DataEntryService, PatientInteractionData, CheckoutData } from '../../../core/services/DataEntry/DataEntry.service';

@Component({
  selector: 'app-patientinteraction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './PatientInteraction.component.html',
  styleUrl: './PatientInteraction.component.scss'
})
export class PatientInteractionComponent implements OnInit {
  
  // Forms
  userSearchForm!: FormGroup;
  labTestForm!: FormGroup;
  prescriptionForm!: FormGroup;
  scanForm!: FormGroup;
  noteForm!: FormGroup;

  // Patient data
  patientData: PatientData | null = null;
  
  // Interaction data
  labTests: LabTest[] = [];
  prescriptions: Prescription[] = [];
  scans: MedicalScan[] = [];
  notes: MedicalNote[] = [];

  // File upload state
  selectedLabTestFile: File | null = null;
  selectedScanFile: File | null = null;

  // UI State
  isLoading = false;
  isSaving = false;
  isCheckingOut = false;
  activeTab = 'lab-tests';
  errorMessage = '';
  successMessage = '';

  // Dropdown options
  labTestTypes = [
    'Blood Test',
    'Urine Test',
    'X-Ray',
    'CT Scan',
    'MRI',
    'Ultrasound',
    'ECG',
    'Biopsy',
    'Allergy Test',
    'Genetic Test'
  ];

  scanTypes = [
    'X-Ray',
    'CT Scan',
    'MRI',
    'Ultrasound',
    'PET Scan',
    'Mammography',
    'Bone Scan',
    'Nuclear Medicine'
  ];

  bodyParts = [
    'Head',
    'Chest',
    'Abdomen',
    'Pelvis',
    'Spine',
    'Upper Extremity',
    'Lower Extremity',
    'Full Body'
  ];

  // Prescription dropdown options
  commonMedicines = [
    'Paracetamol',
    'Ibuprofen',
    'Aspirin',
    'Amoxicillin',
    'Azithromycin',
    'Omeprazole',
    'Metformin',
    'Lisinopril',
    'Atorvastatin',
    'Levothyroxine',
    'Amlodipine',
    'Metoprolol',
    'Losartan',
    'Hydrochlorothiazide',
    'Prednisone'
  ];

  dosageOptions = [
    '250mg',
    '500mg',
    '1g',
    '5mg',
    '10mg',
    '20mg',
    '25mg',
    '50mg',
    '100mg',
    '1 tablet',
    '2 tablets',
    '1 capsule',
    '2 capsules',
    '5ml',
    '10ml'
  ];

  frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Weekly',
    'Twice weekly'
  ];

  durationOptions = [
    '3 days',
    '5 days',
    '7 days',
    '10 days',
    '14 days',
    '21 days',
    '1 month',
    '2 months',
    '3 months',
    '6 months',
    'Until finished',
    'Ongoing'
  ];

  timingOptions = [
    'Before meals',
    'After meals',
    'With meals',
    'On empty stomach',
    'Before bedtime',
    'Morning',
    'Evening',
    'Anytime',
    'As directed'
  ];

  noteTypes = [
    { value: 'general', label: 'General Note' },
    { value: 'diagnosis', label: 'Diagnosis' },
    { value: 'treatment', label: 'Treatment Plan' },
    { value: 'follow-up', label: 'Follow-up' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dataEntryService: DataEntryService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    // Component initialization
  }

  /**
   * Initialize all reactive forms
   */
  private initializeForms(): void {
    // User search form
    this.userSearchForm = this.formBuilder.group({
      userId: ['', [Validators.required]]
    });

    // Lab test form
    this.labTestForm = this.formBuilder.group({
      testName: ['', [Validators.required]],
      testType: ['', [Validators.required]],
      notes: ['']
    });

    // Prescription form - medicine details only
    this.prescriptionForm = this.formBuilder.group({
      medicineName: ['', [Validators.required]],
      dosage: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      timing: ['', [Validators.required]],
      instructions: ['']
    });

    // Scan form
    this.scanForm = this.formBuilder.group({
      scanType: ['', [Validators.required]],
      bodyPart: ['', [Validators.required]],
      scheduledDate: ['', [Validators.required]],
      notes: ['']
    });

    // Note form
    this.noteForm = this.formBuilder.group({
      noteType: ['general', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  /**
   * Fetch patient data from backend
   */
  fetchPatientData(): void {
    const userId = this.userSearchForm.get('userId')?.value;
    
    if (!userId || !userId.trim()) {
      this.errorMessage = 'Please enter a User ID first';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.dataEntryService.fetchPatientData(userId.trim()).subscribe({
      next: (patientData) => {
        this.patientData = patientData;
        this.isLoading = false;
        this.successMessage = 'Patient data loaded successfully!';
        
        // Load existing interactions
        this.loadPatientInteractions(userId.trim());
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);

        console.log('Patient data fetched for ID:', userId.trim());
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to fetch patient data';
        console.error('Error fetching patient data:', error);
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  /**
   * Load existing patient interactions
   */
  private loadPatientInteractions(patientId: string): void {
    this.dataEntryService.fetchPatientInteractions(patientId).subscribe({
      next: (interactions: PatientInteractionData) => {
        this.labTests = interactions.labTests || [];
        this.prescriptions = interactions.prescriptions || [];
        this.scans = interactions.scans || [];
        this.notes = interactions.notes || [];
        
        console.log('Patient interactions loaded:', {
          labTests: this.labTests.length,
          prescriptions: this.prescriptions.length,
          scans: this.scans.length,
          notes: this.notes.length
        });
      },
      error: (error: any) => {
        console.error('Error loading patient interactions:', error);
        // Initialize with empty arrays if no interactions found
        this.labTests = [];
        this.prescriptions = [];
        this.scans = [];
        this.notes = [];
      }
    });
  }

  /**
   * Handle lab test file selection
   */
  onLabTestFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Please select a valid file type (JPEG, PNG, PDF)';
        return;
      }

      if (file.size > maxSize) {
        this.errorMessage = 'File size must be less than 10MB';
        return;
      }

      this.selectedLabTestFile = file;
      this.errorMessage = '';
    }
  }

  /**
   * Handle scan file selection
   */
  onScanFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg', 'application/dicom'];
      const maxSize = 50 * 1024 * 1024; // 50MB for medical images

      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Please select a valid file type (JPEG, PNG, PDF, DICOM)';
        return;
      }

      if (file.size > maxSize) {
        this.errorMessage = 'File size must be less than 50MB';
        return;
      }

      this.selectedScanFile = file;
      this.errorMessage = '';
    }
  }

  /**
   * Add new lab test
   */
  addLabTest(): void {
    if (this.labTestForm.valid && this.patientData) {
      this.isSaving = true;
      
      const newLabTest: LabTest = {
        id: Date.now().toString(),
        testName: this.labTestForm.get('testName')?.value,
        testType: this.labTestForm.get('testType')?.value,
        status: 'pending',
        orderedDate: new Date(),
        notes: this.labTestForm.get('notes')?.value,
        uploadedFile: this.selectedLabTestFile || undefined,
        fileName: this.selectedLabTestFile?.name,
        fileUrl: this.selectedLabTestFile ? URL.createObjectURL(this.selectedLabTestFile) : undefined
      };

      this.dataEntryService.saveLabTest(this.patientData.userId, newLabTest).subscribe({
        next: (savedTest: LabTest) => {
          this.labTests.unshift(savedTest);
          this.labTestForm.reset();
          this.selectedLabTestFile = null;
          // Reset file input
          const fileInput = document.getElementById('labTestFile') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
          
          this.isSaving = false;
          this.showSuccessMessage('Lab test added successfully!');
        },
        error: (error: any) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Failed to save lab test';
          console.error('Error saving lab test:', error);
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }

  /**
   * Add new prescription
   */
  addPrescription(): void {
    if (this.prescriptionForm.valid && this.patientData) {
      this.isSaving = true;
      
      const newPrescription: Prescription = {
        id: Date.now().toString(),
        medicineName: this.prescriptionForm.get('medicineName')?.value,
        dosage: this.prescriptionForm.get('dosage')?.value,
        frequency: this.prescriptionForm.get('frequency')?.value,
        duration: this.prescriptionForm.get('duration')?.value,
        timing: this.prescriptionForm.get('timing')?.value,
        instructions: this.prescriptionForm.get('instructions')?.value,
        prescribedDate: new Date()
      };

      this.dataEntryService.savePrescription(this.patientData.userId, newPrescription).subscribe({
        next: (savedPrescription: Prescription) => {
          this.prescriptions.unshift(savedPrescription);
          this.prescriptionForm.reset();
          this.isSaving = false;
          this.showSuccessMessage('Prescription added successfully!');
        },
        error: (error: any) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Failed to save prescription';
          console.error('Error saving prescription:', error);
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }

  /**
   * Add new scan
   */
  addScan(): void {
    if (this.scanForm.valid && this.patientData) {
      this.isSaving = true;
      
      const newScan: MedicalScan = {
        id: Date.now().toString(),
        scanType: this.scanForm.get('scanType')?.value,
        bodyPart: this.scanForm.get('bodyPart')?.value,
        status: 'scheduled',
        scheduledDate: new Date(this.scanForm.get('scheduledDate')?.value),
        notes: this.scanForm.get('notes')?.value,
        uploadedFile: this.selectedScanFile || undefined,
        fileName: this.selectedScanFile?.name,
        fileUrl: this.selectedScanFile ? URL.createObjectURL(this.selectedScanFile) : undefined
      };

      this.dataEntryService.saveScan(this.patientData.userId, newScan).subscribe({
        next: (savedScan: MedicalScan) => {
          this.scans.unshift(savedScan);
          this.scanForm.reset();
          this.selectedScanFile = null;
          // Reset file input
          const fileInput = document.getElementById('scanFile') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
          
          this.isSaving = false;
          this.showSuccessMessage('Scan scheduled successfully!');
        },
        error: (error: any) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Failed to save scan';
          console.error('Error saving scan:', error);
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }

  /**
   * Add new note
   */
  addNote(): void {
    if (this.noteForm.valid && this.patientData) {
      this.isSaving = true;
      
      const newNote: MedicalNote = {
        id: Date.now().toString(),
        noteType: this.noteForm.get('noteType')?.value,
        content: this.noteForm.get('content')?.value,
        createdDate: new Date(),
        createdBy: 'Current User' // Replace with actual user
      };

      this.dataEntryService.saveNote(this.patientData.userId, newNote).subscribe({
        next: (savedNote: MedicalNote) => {
          this.notes.unshift(savedNote);
          this.noteForm.reset();
          this.noteForm.patchValue({ noteType: 'general' });
          this.isSaving = false;
          this.showSuccessMessage('Note added successfully!');
        },
        error: (error: any) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Failed to save note';
          console.error('Error saving note:', error);
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }

  /**
   * Set active tab
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * Get patient age
   */
  getPatientAge(): number | null {
    if (!this.patientData?.dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(this.patientData.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Show success message
   */
  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  /**
   * Get status badge class
   */
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get note type badge class
   */
  getNoteTypeBadgeClass(noteType: string): string {
    switch (noteType) {
      case 'diagnosis':
        return 'bg-red-100 text-red-800';
      case 'treatment':
        return 'bg-blue-100 text-blue-800';
      case 'follow-up':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Save all patient interactions
   */
  savePatientInteractions(): void {
    if (!this.patientData) {
      this.errorMessage = 'No patient data to save';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const interactionData: PatientInteractionData = {
      patientId: this.patientData.userId,
      labTests: this.labTests,
      prescriptions: this.prescriptions,
      scans: this.scans,
      notes: this.notes,
      savedAt: new Date()
    };

    this.dataEntryService.savePatientInteractions(interactionData).subscribe({
      next: (savedData) => {
        this.isSaving = false;
        this.successMessage = 'All patient interactions saved successfully!';
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);

        console.log('Patient interactions saved:', savedData);
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error.message || 'Failed to save patient interactions';
        console.error('Error saving patient interactions:', error);
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  /**
   * Checkout patient (finalize visit)
   */
  checkoutPatient(): void {
    if (!this.patientData) {
      this.errorMessage = 'No patient data to checkout';
      return;
    }

    // Check if there are any pending items
    const pendingLabTests = this.labTests.filter(test => test.status === 'pending').length;
    const scheduledScans = this.scans.filter(scan => scan.status === 'scheduled').length;

    if (pendingLabTests > 0 || scheduledScans > 0) {
      const pendingItems = [];
      if (pendingLabTests > 0) pendingItems.push(`${pendingLabTests} pending lab test(s)`);
      if (scheduledScans > 0) pendingItems.push(`${scheduledScans} scheduled scan(s)`);
      
      if (!confirm(`Patient has ${pendingItems.join(' and ')}. Are you sure you want to checkout?`)) {
        return;
      }
    }

    this.isCheckingOut = true;
    this.errorMessage = '';
    this.successMessage = '';

    const checkoutData: CheckoutData = {
      patientId: this.patientData.userId,
      checkoutTime: new Date(),
      totalLabTests: this.labTests.length,
      totalPrescriptions: this.prescriptions.length,
      totalScans: this.scans.length,
      totalNotes: this.notes.length,
      pendingItems: {
        labTests: this.labTests.filter(test => test.status === 'pending').length,
        scans: this.scans.filter(scan => scan.status === 'scheduled').length
      }
    };

    this.dataEntryService.checkoutPatient(checkoutData).subscribe({
      next: (result) => {
        this.isCheckingOut = false;
        this.successMessage = 'Patient checkout completed successfully!';
        
        setTimeout(() => {
          this.successMessage = '';
          // Clear all data after checkout
          this.clearPatientData();
        }, 3000);

        console.log('Patient checkout completed:', result);
      },
      error: (error) => {
        this.isCheckingOut = false;
        this.errorMessage = error.message || 'Failed to checkout patient';
        console.error('Error during patient checkout:', error);
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  /**
   * Get interaction summary for checkout
   */
  getInteractionSummary(): any {
    if (!this.patientData) return null;

    return {
      totalInteractions: this.labTests.length + this.prescriptions.length + this.scans.length + this.notes.length,
      labTests: {
        total: this.labTests.length,
        completed: this.labTests.filter(test => test.status === 'completed').length,
        pending: this.labTests.filter(test => test.status === 'pending').length
      },
      prescriptions: {
        total: this.prescriptions.length
      },
      scans: {
        total: this.scans.length,
        completed: this.scans.filter(scan => scan.status === 'completed').length,
        scheduled: this.scans.filter(scan => scan.status === 'scheduled').length
      },
      notes: {
        total: this.notes.length,
        byType: {
          general: this.notes.filter(note => note.noteType === 'general').length,
          diagnosis: this.notes.filter(note => note.noteType === 'diagnosis').length,
          treatment: this.notes.filter(note => note.noteType === 'treatment').length,
          followUp: this.notes.filter(note => note.noteType === 'follow-up').length
        }
      }
    };
  }

  /**
   * Get pending lab tests count
   */
  getPendingLabTestsCount(): number {
    return this.labTests.filter(test => test.status === 'pending').length;
  }

  /**
   * Get scheduled scans count
   */
  getScheduledScansCount(): number {
    return this.scans.filter(scan => scan.status === 'scheduled').length;
  }

  /**
   * Check if there are pending items
   */
  hasPendingItems(): boolean {
    return this.getPendingLabTestsCount() > 0 || this.getScheduledScansCount() > 0;
  }

  /**
   * Clear patient data and reset forms
   */
  clearPatientData(): void {
    this.patientData = null;
    this.labTests = [];
    this.prescriptions = [];
    this.scans = [];
    this.notes = [];
    this.userSearchForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }
}
