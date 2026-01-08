import { QuoteService } from '../../application/services/QuoteService';
import IQuotesRepository from '../../domain/repositories/IQuotesRepository';
import { Quote } from '../../domain/entities/Quote';

describe('QuoteService', () => {
  let quoteService: QuoteService;
  let mockRepo: jest.Mocked<IQuotesRepository>;

  beforeEach(() => {
    mockRepo = {
      fetchQuotes: jest.fn(),
    } as jest.Mocked<IQuotesRepository>;

    quoteService = new QuoteService(mockRepo);
  });

  describe('fetchQuote', () => {
    it('should_return_random_quote_when_quotes_are_available', async () => {
      const mockQuotes = [
        new Quote({ id: 1, quote: 'First motivational quote' }),
        new Quote({ id: 2, quote: 'Second motivational quote' }),
        new Quote({ id: 3, quote: 'Third motivational quote' }),
      ];
      mockRepo.fetchQuotes.mockResolvedValue(mockQuotes);

      const result = await quoteService.fetchQuote();

      expect(mockRepo.fetchQuotes).toHaveBeenCalledTimes(1);
      expect(result).not.toBeNull();
      expect(mockQuotes).toContainEqual(result);
    });

    it('should_return_null_when_no_quotes_are_available', async () => {
      mockRepo.fetchQuotes.mockResolvedValue([]);

      const result = await quoteService.fetchQuote();

      expect(result).toBeNull();
      expect(mockRepo.fetchQuotes).toHaveBeenCalledTimes(1);
    });

    it('should_return_only_quote_when_only_one_quote_exists', async () => {
      const singleQuote = new Quote({ id: 1, quote: 'Only motivational quote' });
      mockRepo.fetchQuotes.mockResolvedValue([singleQuote]);

      const result = await quoteService.fetchQuote();

      expect(result).toEqual(singleQuote);
      expect(mockRepo.fetchQuotes).toHaveBeenCalledTimes(1);
    });

    it('should_handle_repository_error_gracefully', async () => {
      mockRepo.fetchQuotes.mockRejectedValue(new Error('Database connection failed'));

      await expect(quoteService.fetchQuote()).rejects.toThrow('Database connection failed');
    });

    it('should_return_different_quotes_on_multiple_calls', async () => {
      const mockQuotes = [
        new Quote({ id: 1, quote: 'First motivational quote' }),
        new Quote({ id: 2, quote: 'Second motivational quote' }),
        new Quote({ id: 3, quote: 'Third motivational quote' }),
        new Quote({ id: 4, quote: 'Fourth motivational quote' }),
        new Quote({ id: 5, quote: 'Fifth motivational quote' }),
      ];
      mockRepo.fetchQuotes.mockResolvedValue(mockQuotes);

      const results = new Set();
      for (let i = 0; i < 20; i++) {
        const quote = await quoteService.fetchQuote();
        if (quote) results.add(quote.id);
      }

      // Statistically, with 20 calls and 5 quotes, we should get some variety
      // (This test might occasionally fail due to randomness, but it's highly unlikely)
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('fetchQuoteOfDay', () => {
    it('returns null when no quotes available', async () => {
      mockRepo.fetchQuotes.mockResolvedValue([]);
      const res = await quoteService.fetchQuoteOfDay(new Date('2025-01-01'));
      expect(res).toBeNull();
      expect(mockRepo.fetchQuotes).toHaveBeenCalledTimes(1);
    });

    it('selects a deterministic quote based on date regardless of input order', async () => {
      // Create quotes out of order to ensure stable sort is applied
      const q1 = new Quote({ id: 10, quote: 'Q10' });
      const q2 = new Quote({ id: 2, quote: 'Q2' });
      const q3 = new Quote({ id: 7, quote: 'Q7' });
      // Provide shuffled array
      mockRepo.fetchQuotes.mockResolvedValue([q1, q3, q2]);

      const date = new Date('2025-06-15');
      const first = await quoteService.fetchQuoteOfDay(date);

      // Call again with the same date and different shuffle to verify stability
      mockRepo.fetchQuotes.mockResolvedValue([q2, q1, q3]);
      const second = await quoteService.fetchQuoteOfDay(date);

      expect(first).not.toBeNull();
      expect(second).not.toBeNull();
      expect(first).toEqual(second);
    });

    it('returns null when repository returns undefined or falsy', async () => {
      // Force undefined
      (mockRepo.fetchQuotes as jest.Mock).mockResolvedValue(undefined as any);
      const res = await quoteService.fetchQuoteOfDay(new Date());
      expect(res).toBeNull();
    });

    it('propagates repository errors for fetchQuoteOfDay', async () => {
      mockRepo.fetchQuotes.mockRejectedValue(new Error('repo-down'));
      await expect(quoteService.fetchQuoteOfDay(new Date())).rejects.toThrow('repo-down');
    });
  });
});
