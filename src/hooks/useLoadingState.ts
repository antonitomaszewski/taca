/**
 * Custom hook do zarządzania stanami ładowania i błędów
 */

import { useState, useCallback } from 'react';

export interface UseLoadingStateResult {
  loading: boolean;
  error: string | null;
  success: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  clearMessages: () => void;
  executeAsync: <T>(
    asyncFn: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
      successMessage?: string;
    }
  ) => Promise<T | null>;
}

export function useLoadingState(): UseLoadingStateResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options: {
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
      successMessage?: string;
    } = {}
  ): Promise<T | null> => {
    const { onSuccess, onError, successMessage } = options;
    
    setLoading(true);
    clearMessages();

    try {
      const result = await asyncFn();
      
      if (successMessage) {
        setSuccess(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd';
      setError(errorMessage);
      
      if (onError && err instanceof Error) {
        onError(err);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  return {
    loading,
    error,
    success,
    setLoading,
    setError,
    setSuccess,
    clearMessages,
    executeAsync
  };
}
