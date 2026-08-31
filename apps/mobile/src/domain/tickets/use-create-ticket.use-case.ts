import { useCallback, useState } from 'react';
import type { ApiError } from '../../data/http-client';
import { createTicket } from '../../data/tickets/tickets.datasource';
import type { CreateTicketInput, Ticket } from '../../model/ticket';

interface UseCreateTicketResult {
  createTicket: (input: CreateTicketInput) => Promise<Ticket | null>;
  isLoading: boolean;
  error: ApiError | null;
}

export function useCreateTicket(): UseCreateTicketResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const submit = useCallback(async (input: CreateTicketInput) => {
    setIsLoading(true);
    setError(null);
    try {
      return await createTicket(input);
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createTicket: submit, isLoading, error };
}
