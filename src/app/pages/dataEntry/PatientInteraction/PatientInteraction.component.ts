import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

// Import model interfaces
import { LabTest } from '../../../models/lab-test.model';
import { Prescription } from '../../../models/prescription.model';
import { MedicalScan } from '../../../models/medical-scan.model';
import { MedicalNote } from '../../../models/medical-note.model';
import { 
  DataEntryService, 
  PatientDataResponse, 
  AddTestDto, 
  AddMedicineDto, 
  AddScanDto, 
  AddNoteDto 
} from '../../../core/services/DataEntry/DataEntry.service';

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
  patientData: PatientDataResponse | null = null;
  patientId: string | null = null;
  
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

  selectedPatient: any = null;
  userName: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private dataEntryService: DataEntryService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    console.log('PatientInteractionComponent ngOnInit', this.route.queryParams);
    this.route.queryParams.subscribe(params => {
      // Accept both 'patientID' and 'patientId'
      this.userName = params['patientID'] || params['patientId'];
      this.patientId = params['patientID'] || params['patientId'];
      if (this.userName) {
        this.userSearchForm.get('userId')?.setValue(this.userName);
        this.fetchPatientData();
      }
    });
  }

  private initializeForms(): void {
    this.userSearchForm = this.formBuilder.group({ userId: ['', [Validators.required]] });
    this.labTestForm = this.formBuilder.group({
      testName: ['', [Validators.required]],
      testType: ['', [Validators.required]],
      notes: ['', [Validators.required]]
    });
    this.prescriptionForm = this.formBuilder.group({
      medicineName: ['', [Validators.required]],
      dosage: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      timing: ['', [Validators.required]],
      instructions: ['']
    });
    this.scanForm = this.formBuilder.group({
      scanType: ['', [Validators.required]],
      bodyPart: ['', [Validators.required]],
      scheduledDate: ['', [Validators.required]],
      notes: ['']
    });
    this.noteForm = this.formBuilder.group({
      noteType: ['general', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  fetchPatientData(): void {
    this.patientId = this.userSearchForm.get('userId')?.value;
    if (!this.patientId || !this.patientId.trim()) {
      this.errorMessage = 'Please enter a User ID first';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    const patientId = this.patientId.trim();
    this.patientId = patientId;

    this.dataEntryService.fetchPatientData(patientId).subscribe({
      next: (patientData) => {
        this.patientData = patientData;
        this.successMessage = 'Patient data loaded successfully!';
        this.loadPatientInteractions(patientId);
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to fetch patient data';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  private loadPatientInteractions(patientId: string | null): void {
    if (!patientId) {
        this.isLoading = false;
        this.errorMessage = 'Cannot load interactions without a patient ID.';
        return;
    }
    const labTests$ = this.dataEntryService.fetchLabTests(patientId);
    const prescriptions$ = this.dataEntryService.fetchPrescriptions(patientId);
    const scans$ = this.dataEntryService.fetchScans(patientId);
    const notes$ = this.dataEntryService.fetchNotes(patientId);

    forkJoin({
      labTests: labTests$,
      prescriptions: prescriptions$,
      scans: scans$,
      notes: notes$
    }).subscribe({
      next: (interactions) => {
        this.labTests = interactions.labTests || [];
        this.prescriptions = interactions.prescriptions || [];
        this.scans = interactions.scans || [];
        this.notes = interactions.notes || [];
        this.isLoading = false; // Stop loading after all interactions are fetched
        this.cdr.detectChanges(); 
      },
      error: (error: any) => {
        console.error('Error loading patient interactions:', error);
        this.errorMessage = 'Failed to load patient interactions.';
        this.isLoading = false;
        this.labTests = [];
        this.prescriptions = [];
        this.scans = [];
        this.notes = [];
      }
    });
  }

  onLabTestFileSelected(event: any): void {
    this.selectedLabTestFile = event.target.files[0] || null;
  }

  onScanFileSelected(event: any): void {
    this.selectedScanFile = event.target.files[0] || null;
  }

  addLabTest(): void {
    if (this.labTestForm.valid && this.patientId) {
      const patientId = this.patientId;
      this.isSaving = true;
      const formValues = this.labTestForm.value;

      const newLabTest: AddTestDto = {
        patientID: patientId,
        testName: formValues.testName,
        testType: formValues.testType,
        note: formValues.notes,
        image: this.selectedLabTestFile || undefined
      };

      this.dataEntryService.addLabTest(newLabTest).subscribe({
        next: () => {
          this.isSaving = false;
          this.showSuccessMessage('Lab test added successfully!');
          this.loadPatientInteractions(this.patientId);
          this.labTestForm.reset();
          this.selectedLabTestFile = null;
        },
        error: (error: any) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Failed to save lab test';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  addPrescription(): void {
    if (this.prescriptionForm.valid && this.patientId) {
      const patientId = this.patientId;
      this.isSaving = true;
      const formValues = this.prescriptionForm.value;

      const newPrescription: AddMedicineDto = {
        patientID: patientId,
        medicineName: formValues.medicineName,
        dosage: formValues.dosage,
        frequency: formValues.frequency,
        duration: formValues.duration,
        timing: formValues.timing,
        medicineNotes: formValues.instructions
      };

      this.dataEntryService.addPrescription(newPrescription).subscribe({
        next: () => {
          this.isSaving = false;
          this.showSuccessMessage('Prescription added successfully!');
          this.loadPatientInteractions(this.patientId);
          this.prescriptionForm.reset();
          this.fetchPatientData();
        },
        error: (error: any) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Failed to save prescription';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  addScan(): void {
    if (this.scanForm.valid && this.patientId) {
      const patientId = this.patientId;
      this.isSaving = true;
      const formValues = this.scanForm.value;

      const newScan: AddScanDto = {
        patientID: patientId,
        scanType: formValues.scanType,
        scanPart: formValues.bodyPart,
        note: formValues.notes,
        image: this.selectedScanFile || undefined
      };

      this.dataEntryService.addScan(newScan).subscribe({
        next: () => {
          this.isSaving = false;
          this.showSuccessMessage('Scan scheduled successfully!');
          this.loadPatientInteractions(this.patientId);
          this.scanForm.reset();
          this.selectedScanFile = null;
          this.fetchPatientData();
        },
        error: (error: any) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Failed to save scan';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  addNote(): void {
    if (this.noteForm.valid && this.patientId) {
      const patientId = this.patientId;
      this.isSaving = true;
      const formValues = this.noteForm.value;

      const newNote: AddNoteDto = {
        patientID: patientId,
        noteType: formValues.noteType,
        noteContent: formValues.content
      };

      this.dataEntryService.addNote(newNote).subscribe({
        next: () => {
          this.isSaving = false;
          this.showSuccessMessage('Note added successfully!');
          this.loadPatientInteractions(this.patientId);
          this.noteForm.reset({ noteType: 'general' });
          this.fetchPatientData();
        },
        error: (error: any) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Failed to save note';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

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

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getNoteTypeBadgeClass(noteType: string): string {
    switch (noteType) {
      case 'diagnosis': return 'bg-red-100 text-red-800';
      case 'treatment': return 'bg-blue-100 text-blue-800';
      case 'follow-up': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  checkoutPatient(): void {
    if (!this.patientId) {
      this.errorMessage = 'No patient data to checkout';
      return;
    }
    this.isCheckingOut = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.dataEntryService.checkoutPatient(this.patientId).subscribe({
      next: () => {
        this.isCheckingOut = false;
        this.successMessage = 'Patient checkout completed successfully!';
        this.clearPatientData();
      },
      error: (error) => {
        this.isCheckingOut = false;
        this.errorMessage = error.message || 'Failed to checkout patient';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  /**
   * Clear patient data and reset forms
   */
  clearPatientData(): void {
    this.patientData = null;
    this.patientId = null;
    this.labTests = [];
    this.prescriptions = [];
    this.scans = [];
    this.notes = [];
    this.userSearchForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  startPatientInteraction(): void {
    if (this.selectedPatient && this.selectedPatient.id) {
      this.router.navigate(['/data-entry/patient-interaction'], {
        queryParams: { userName: this.selectedPatient.userName }
      });
    }
  }
}
