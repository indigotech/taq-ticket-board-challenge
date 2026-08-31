import type { CreateTicketInput, Priority, Status, Ticket } from '../../model/ticket';
import { apiRequest } from '../http-client';

export const TITLE_MAX_LENGTH = 200;
export const DESCRIPTION_MAX_LENGTH = 5000;

interface TicketResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
}

interface TicketsResponse {
  nodes: TicketResponse[];
  count: number;
  pageInfo: { limit: number; offset: number; hasNextPage: boolean; hasPreviousPage: boolean };
}

function mapStatusFromApi(status: string): Status {
  return status === 'resolved' ? 'done' : (status as Status);
}

function mapStatusToApi(status: Status): string {
  return status === 'done' ? 'resolved' : status;
}

function mapTicketResponse(raw: TicketResponse): Ticket {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    priority: raw.priority as Priority,
    status: mapStatusFromApi(raw.status),
    createdAt: raw.createdAt,
  };
}

interface ListTicketsParams {
  status?: Status;
  limit?: number;
  offset?: number;
}

interface ListTicketsResult {
  tickets: Ticket[];
  count: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export async function listTickets(params: ListTicketsParams = {}): Promise<ListTicketsResult> {
  const query = new URLSearchParams();
  if (params.status) {
    query.set('status', mapStatusToApi(params.status));
  }
  if (params.limit != null) {
    query.set('limit', String(params.limit));
  }
  if (params.offset != null) {
    query.set('offset', String(params.offset));
  }

  const queryString = query.toString();
  const response = await apiRequest<TicketsResponse>(`/tickets${queryString ? `?${queryString}` : ''}`);

  return {
    tickets: response.nodes.map(mapTicketResponse),
    count: response.count,
    hasNextPage: response.pageInfo.hasNextPage,
    hasPreviousPage: response.pageInfo.hasPreviousPage,
  };
}

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const response = await apiRequest<TicketResponse>('/tickets', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  return mapTicketResponse(response);
}
