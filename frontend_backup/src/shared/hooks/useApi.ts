/**
 * Hook générique pour les appels API avec loading/error states
 */

import { useState, useEffect, useCallback } from 'react';
import type { LoadingState, ApiResponse } from '@/shared/types';

interface UseApiOptions<T> {
  initialData?: T;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
) {
  const { initialData, enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<LoadingState>('idle');

  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isSuccess = status === 'success';

  const execute = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      const response = await apiCall();
      
      if (response.data) {
        setData(response.data);
        setStatus('success');
        onSuccess?.(response.data);
      } else if (response.error) {
        throw new Error(response.error);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setStatus('error');
      onError?.(error);
    }
  }, [apiCall, onSuccess, onError]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setStatus('idle');
  }, [initialData]);

  useEffect(() => {
    if (enabled) {
      execute();
    }
  }, [enabled, execute]);

  return {
    data,
    error,
    status,
    isLoading,
    isError,
    isSuccess,
    refetch,
    reset,
  };
}

export default useApi;
