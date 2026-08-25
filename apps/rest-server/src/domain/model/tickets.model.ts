export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date;
}

export interface TicketInput {
  title: string;
  description: string;
}
