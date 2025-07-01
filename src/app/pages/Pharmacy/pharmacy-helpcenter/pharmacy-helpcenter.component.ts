import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupportTicket } from '../../../models/ticket';
import { HelpCenterService, TicketSubmissionResponse } from '../../../core/services/help-center/help-center.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pharmacy-helpcenter',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './pharmacy-helpcenter.component.html',
  styleUrl: './pharmacy-helpcenter.component.scss'
})
export class PharmacyHelpcenterComponent implements OnInit, OnDestroy {
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
          phone: '+20 123 456 7890',
          email: 'support@eckomed.com',
          address: '123 Medical Center St., Cairo, Egypt',
          workingHours: 'Sunday - Thursday: 8:00 AM - 6:00 PM'
        };
      }
    });
  }

  /**
   * Load user ticket history
   */
  private loadUserTicketHistory(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) return;

    this.helpCenterService.getUserTickets(currentUser.id).subscribe({
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
   * Submit support ticket
   */
  submitTicket(): void {
    if (this.ticketForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const ticketData = {
      ...this.ticketForm.value,
      userId: this.authService.getCurrentUser()?.id || null,
      userType: 'pharmacy'
    };

    this.helpCenterService.submitTicket(ticketData).subscribe({
      next: (response: TicketSubmissionResponse) => {
        this.isSubmitting = false;
        this.successMessage = `Ticket submitted successfully! Ticket ID: ${response.ticketId}`;
        this.ticketForm.reset({
          category: 'general',
          priority: 'medium'
        });
        
        // Reload user tickets if logged in
        if (this.isUserLoggedIn) {
          this.loadUserTicketHistory();
        }
        
        console.log('Ticket submitted successfully:', response);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to submit ticket. Please try again.';
        console.error('Error submitting ticket:', error);
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
      name: this.ticketForm.value.name,
      email: this.ticketForm.value.email,
      subject: this.ticketForm.value.subject,
      message: this.ticketForm.value.message,
      category: this.ticketForm.value.category
    };

    this.helpCenterService.sendContactForm(contactData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.successMessage = 'Message sent successfully! We will get back to you soon.';
        this.ticketForm.reset({
          category: 'general',
          priority: 'medium'
        });
        console.log('Contact message sent successfully:', response);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to send message. Please try again.';
        console.error('Error sending contact message:', error);
      }
    });
  }

  /**
   * Show different sections
   */
  showSection(section: 'ticket' | 'faq' | 'contact' | 'history'): void {
    this.showTicketForm = section === 'ticket';
    this.showFaq = section === 'faq';
    this.showContact = section === 'contact';
    this.showTicketHistory = section === 'history';

    // Clear messages when switching sections
    this.errorMessage = '';
    this.successMessage = '';

    // Load data for the selected section
    if (section === 'faq' && this.faqItems.length === 0) {
      this.loadFaqByCategory('general');
    }
  }

  /**
   * Get CSS class for ticket status
   */
  getTicketStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get CSS class for priority
   */
  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
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
   * Mark all form controls as touched
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
    
    if (control.touched || control.dirty) {
      return control.valid ? 'valid' : 'invalid';
    }
    return 'neutral';
  }

  /**
   * Get field error message
   */
  getFieldMessage(fieldName: string): string {
    const control = this.ticketForm.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['minlength']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${errors['maxlength'].requiredLength} characters`;
    if (errors['pattern']) return 'Please enter a valid format';

    return 'Invalid input';
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.isUserLoggedIn;
  }
}
