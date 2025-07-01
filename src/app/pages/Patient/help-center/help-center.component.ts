import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupportTicket } from '../../../models/ticket';
import { HelpCenterService, TicketSubmissionResponse } from '../../../core/services/help-center/help-center.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-help-center',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './help-center.component.html',
  styleUrl: './help-center.component.scss'
})
export class HelpCenterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isUserLoggedIn = false;

  // Form for ticket submission
  ticketForm: FormGroup;

  // UI State
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  showTicketForm = true;
  showFaq = false;
  showContact = false;

  // FAQ Data
  faqCategories: any[] = [];
  selectedCategory: string = '';
  faqItems: any[] = [];
  searchQuery = '';

  // Contact Information
  contactInfo: any = null;

  // Ticket History
  userTickets: SupportTicket[] = [];
  showTicketHistory = false;

  constructor(
    private formBuilder: FormBuilder,
    private helpCenterService: HelpCenterService,
    private authService: AuthService
  ) {
    this.ticketForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)]],
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      category: ['general', [Validators.required]],
      priority: ['medium', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      attachments: ['']
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().pipe(takeUntil(this.destroy$)).subscribe(loggedIn => {
      this.isUserLoggedIn = loggedIn;
      if (loggedIn) {
        this.prefillUserData();
        this.loadUserTicketHistory();
      }
    });
    this.loadFaqCategories();
    this.loadContactInfo();
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup form listeners
   */
  private setupFormListeners(): void {
    // Auto-fill email if user is logged in
    this.ticketForm.get('email')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(email => {
        if (email && this.isUserLoggedIn) {
          // You might want to validate if the email matches the logged-in user
        }
      });
  }

  /**
   * Pre-fill form with user data
   */
  private prefillUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.ticketForm.patchValue({
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email
      });
    }
  }

  /**
   * Load FAQ categories
   */
  private loadFaqCategories(): void {
    this.isLoading = true;
    this.helpCenterService.getFaqCategories().subscribe({
      next: (categories) => {
        this.faqCategories = categories;
        this.isLoading = false;
        console.log('FAQ categories loaded:', categories.length);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading FAQ categories:', error);
        // Set default categories if API fails
        this.faqCategories = [
          { id: 'general', name: 'General Questions' },
          { id: 'technical', name: 'Technical Support' },
          { id: 'billing', name: 'Billing & Payments' },
          { id: 'account', name: 'Account Management' }
        ];
      }
    });
  }

  /**
   * Load FAQ by category
   */
  loadFaqByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.isLoading = true;

    this.helpCenterService.getFaqByCategory(categoryId).subscribe({
      next: (faqItems) => {
        this.faqItems = faqItems;
        this.isLoading = false;
        console.log('FAQ items loaded:', faqItems.length);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading FAQ items:', error);
        this.faqItems = [];
      }
    });
  }

  /**
   * Search FAQ
   */
  searchFaq(): void {
    if (!this.searchQuery.trim()) {
      if (this.selectedCategory) {
        this.loadFaqByCategory(this.selectedCategory);
      }
      return;
    }

    this.isLoading = true;
    this.helpCenterService.searchFaq(this.searchQuery.trim()).subscribe({
      next: (results) => {
        this.faqItems = results;
        this.isLoading = false;
        console.log('FAQ search results:', results.length);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error searching FAQ:', error);
        this.faqItems = [];
      }
    });
  }

  /**
   * Rate FAQ helpfulness
   */
  rateFaqHelpfulness(faqId: string, isHelpful: boolean): void {
    this.helpCenterService.rateFaqHelpfulness(faqId, isHelpful).subscribe({
      next: (response) => {
        console.log('FAQ rated successfully:', response);
        // You might want to update the UI to show the rating was recorded
      },
      error: (error) => {
        console.error('Error rating FAQ:', error);
      }
    });
  }

  /**
   * Load contact information
   */
  private loadContactInfo(): void {
    this.helpCenterService.getContactInfo().subscribe({
      next: (contactInfo) => {
        this.contactInfo = contactInfo;
        console.log('Contact info loaded:', contactInfo);
      },
      error: (error) => {
        console.error('Error loading contact info:', error);
        // Set default contact info if API fails
        this.contactInfo = {
          email: 'support@hospital.com',
          phone: '+20 123 456 7890',
          address: '123 Hospital Street, Cairo, Egypt',
          workingHours: '24/7'
        };
      }
    });
  }

  /**
   * Load user ticket history
   */
  private loadUserTicketHistory(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.helpCenterService.getUserTickets(userId).subscribe({
      next: (response) => {
        this.userTickets = response.tickets || [];
        console.log('User tickets loaded:', this.userTickets.length);
      },
      error: (error) => {
        console.error('Error loading user tickets:', error);
        this.userTickets = [];
      }
    });
  }

  /**
   * Submit ticket form
   */
  submitTicket(): void {
    if (this.ticketForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const ticketData: SupportTicket = {
      name: this.ticketForm.get('name')?.value,
      email: this.ticketForm.get('email')?.value,
      mobile: this.ticketForm.get('mobile')?.value,
      subject: this.ticketForm.get('subject')?.value,
      category: this.ticketForm.get('category')?.value,
      priority: this.ticketForm.get('priority')?.value,
      message: this.ticketForm.get('message')?.value,
      attachments: this.ticketForm.get('attachments')?.value || '',
      userId: this.authService.getUserId() || undefined,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.helpCenterService.submitTicket(ticketData).subscribe({
      next: (response: TicketSubmissionResponse) => {
        this.isSubmitting = false;
        this.successMessage = response.message || 'Ticket submitted successfully! We will get back to you soon.';
        
        // Reset form after successful submission
        this.ticketForm.reset();
        this.ticketForm.patchValue({
          category: 'general',
          priority: 'medium'
        });
        
        // Refresh ticket history if user is logged in
        if (this.isUserLoggedIn) {
          this.loadUserTicketHistory();
        }
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
        
        console.log('Ticket submitted successfully:', response);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Failed to submit ticket. Please try again.';
        console.error('Error submitting ticket:', error);
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  /**
   * Send contact form
   */
  sendContactForm(): void {
    if (this.ticketForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const contactData = {
      name: this.ticketForm.get('name')?.value,
      email: this.ticketForm.get('email')?.value,
      subject: this.ticketForm.get('subject')?.value,
      message: this.ticketForm.get('message')?.value,
      category: this.ticketForm.get('category')?.value
    };

    this.helpCenterService.sendContactForm(contactData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Contact form sent successfully! We will get back to you soon.';
        
        // Reset form
        this.ticketForm.reset();
        this.ticketForm.patchValue({
          category: 'general',
          priority: 'medium'
        });
        
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
        
        console.log('Contact form sent successfully:', response);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Failed to send contact form. Please try again.';
        console.error('Error sending contact form:', error);
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  /**
   * Toggle view sections
   */
  showSection(section: 'ticket' | 'faq' | 'contact' | 'history'): void {
    this.showTicketForm = section === 'ticket';
    this.showFaq = section === 'faq';
    this.showContact = section === 'contact';
    this.showTicketHistory = section === 'history';
    
    // Load data for the selected section
    if (section === 'faq' && this.faqCategories.length > 0) {
      this.loadFaqByCategory(this.faqCategories[0].id);
    } else if (section === 'history' && this.isUserLoggedIn) {
      this.loadUserTicketHistory();
    }
  }

  /**
   * Get ticket status badge class
   */
  getTicketStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get priority badge class
   */
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Format date for display
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.ticketForm.controls).forEach(key => {
      const control = this.ticketForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Get field validation status
   */
  getFieldStatus(fieldName: string): 'valid' | 'invalid' | 'neutral' {
    const control = this.ticketForm.get(fieldName);
    if (!control) return 'neutral';

    if (control.invalid && control.touched) return 'invalid';
    if (control.valid && control.touched) return 'valid';
    return 'neutral';
  }

  /**
   * Get field validation message
   */
  getFieldMessage(fieldName: string): string {
    const control = this.ticketForm.get(fieldName);
    if (!control) return '';

    if (control.hasError('required')) return `${fieldName} is required`;
    if (control.hasError('email')) return 'Please enter a valid email address';
    if (control.hasError('minlength')) return `${fieldName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    if (control.hasError('maxlength')) return `${fieldName} must be at most ${control.errors?.['maxlength'].requiredLength} characters`;
    if (control.hasError('pattern')) return `Please enter a valid ${fieldName}`;

    return '';
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.isUserLoggedIn;
  }
}