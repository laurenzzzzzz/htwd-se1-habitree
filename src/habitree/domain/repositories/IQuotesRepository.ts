import { Quote } from '../entities/Quote';

export interface IQuotesRepository {
  fetchQuotes(): Promise<Quote[]>;
}

export default IQuotesRepository;
