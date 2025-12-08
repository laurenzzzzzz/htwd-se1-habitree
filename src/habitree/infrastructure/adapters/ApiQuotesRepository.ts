import axios from 'axios';
import IQuotesRepository from '../../domain/repositories/IQuotesRepository';
import { Quote, QuoteData } from '../../domain/entities/Quote';

const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';
const QUOTES_API_URL = `${API_BASE_URL}/quotes`;

export class ApiQuotesRepository implements IQuotesRepository {
  async fetchQuotes(): Promise<Quote[]> {
    const response = await axios.get<QuoteData[]>(QUOTES_API_URL);
    // Convert raw data to domain entities
    return response.data.map(data => new Quote(data));
  }
}

export default ApiQuotesRepository;
