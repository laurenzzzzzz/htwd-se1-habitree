import { useState, useCallback } from 'react';
import { quoteService } from '../../infrastructure/di/ServiceContainer';
import { Quote } from '../../domain/entities/Quote';

export function useQuoteController() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuote = useCallback(async () => {
    setIsLoading(true);
    try {
      const q = await quoteService.fetchQuote();
      setQuote(q);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { quote, isLoading, fetchQuote };
}

export default useQuoteController;
