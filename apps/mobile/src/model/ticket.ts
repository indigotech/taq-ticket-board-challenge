export type Priority = 'high' | 'normal';
export type Status = 'open' | 'in_progress' | 'done';
export type StatusFilter = 'all' | Status;

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  createdAt: string;
}

export interface CreateTicketInput {
  title: string;
  description: string;
}
