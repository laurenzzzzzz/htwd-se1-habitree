import { Quote } from '../../domain/entities/Quote';
import IQuotesRepository from '../../domain/repositories/IQuotesRepository';

export class QuoteService {
  private repo: IQuotesRepository;

  constructor(repo: IQuotesRepository) {
    this.repo = repo;
  }

  async fetchQuote(): Promise<Quote | null> {
    const quotes = await this.repo.fetchQuotes();
    if (quotes.length === 0) return null;
    const idx = Math.floor(Math.random() * quotes.length);
    return quotes[idx];
  }
}

export default QuoteService;
