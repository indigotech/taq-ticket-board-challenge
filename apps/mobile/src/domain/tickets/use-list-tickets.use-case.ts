import { useCallback, useEffect, useRef, useState } from 'react';
import type { ApiError } from '../../data/http-client';
import { listTickets } from '../../data/tickets/tickets.datasource';
import type { Status, StatusFilter, Ticket } from '../../model/ticket';

const PAGE_SIZE = 20;

type LoadMode = 'initial' | 'refresh' | 'more';

interface UseListTicketsResult {
  tickets: Ticket[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  error: ApiError | null;
  refetch: () => void;
  refresh: () => void;
  loadMore: () => void;
  retry: () => void;
  applyLocalStatusOverride: (id: string, status: Status) => void;
}

export function useListTickets(status: StatusFilter): UseListTicketsResult {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const offsetRef = useRef(0);
  const requestIdRef = useRef(0);
  const lastModeRef = useRef<LoadMode>('initial');

  const load = useCallback(
    async (mode: LoadMode) => {
      const requestId = ++requestIdRef.current;
      const offset = mode === 'more' ? offsetRef.current : 0;

      lastModeRef.current = mode;
      setIsLoading(mode === 'initial');
      setIsRefreshing(mode === 'refresh');
      setIsLoadingMore(mode === 'more');
      setError(null);

      try {
        const result = await listTickets({
          status: status === 'all' ? undefined : status,
          limit: PAGE_SIZE,
          offset,
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        setTickets((prev) => (mode === 'more' ? [...prev, ...result.tickets] : result.tickets));
        offsetRef.current = offset + result.tickets.length;
        setHasNextPage(result.hasNextPage);
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }
        console.error('useListTickets: listTickets failed', err);
        setError(err as ApiError);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
          setIsLoadingMore(false);
        }
      }
    },
    [status],
  );

  useEffect(() => {
    offsetRef.current = 0;
    load('initial');
  }, [load]);

  const loadMore = useCallback(() => {
    if (!hasNextPage || isLoading || isRefreshing || isLoadingMore) {
      return;
    }
    load('more');
  }, [hasNextPage, isLoading, isRefreshing, isLoadingMore, load]);

  const refetch = useCallback(() => load('initial'), [load]);
  const refresh = useCallback(() => load('refresh'), [load]);
  const retry = useCallback(() => load(lastModeRef.current), [load]);

  const applyLocalStatusOverride = useCallback((id: string, newStatus: Status) => {
    setTickets(prev => prev.map(ticket => (ticket.id === id ? { ...ticket, status: newStatus } : ticket)));
  }, []);

  return {
    tickets,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasNextPage,
    error,
    refetch,
    refresh,
    loadMore,
    retry,
    applyLocalStatusOverride,
  };
}
