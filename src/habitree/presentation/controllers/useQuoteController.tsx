import { useState, useCallback } from 'react';
import { useApplicationServices } from '../providers/ApplicationServicesProvider';
import { Quote } from '../../domain/entities/Quote';

export function useQuoteController() {
  const { quoteService } = useApplicationServices();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuote = useCallback(async () => {
    setIsLoading(true);
    try {
      const q = await quoteService.fetchQuoteOfDay();
      setQuote(q);
    } finally {
      setIsLoading(false);
    }
  }, [quoteService]);

  return { quote, isLoading, fetchQuote };
}

export default useQuoteController;
