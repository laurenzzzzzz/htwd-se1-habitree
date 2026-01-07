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

  async fetchQuoteOfDay(date: Date = new Date()): Promise<Quote | null> {
    const quotes = await this.repo.fetchQuotes();
    if (!quotes || quotes.length === 0) return null;
    // Stable order to avoid API-return-order fluctuations
    const stable = [...quotes].sort((a, b) => a.id - b.id);
    const y = date.getFullYear();
    const m = date.getMonth() + 1; // 1-12
    const d = date.getDate();
    const key = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    const idx = hash % stable.length;
    return stable[idx];
  }
}

export default QuoteService;
