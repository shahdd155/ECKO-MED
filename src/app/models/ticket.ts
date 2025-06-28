export interface SupportTicket {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  userId?: string;
  attachments?: string;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
  notes?: string;
}
  