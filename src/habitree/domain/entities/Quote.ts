export type QuoteData = {
  id: number;
  quote: string;
};

/**
 * Quote Domain Entity
 * Represents a motivational quote with business logic
 */
export class Quote {
  readonly id: number;
  readonly quote: string;

  constructor(data: QuoteData) {
    this.id = data.id;
    this.quote = data.quote;
  }

  /**
   * Formats quote for display with quotation marks
   */
  getFormattedQuote(): string {
    return `"${this.quote}"`;
  }

  /**
   * Gets quote length for analytics
   */
  getLength(): number {
    return this.quote.length;
  }

  /**
   * Checks if quote is empty or too short
   */
  isValid(): boolean {
    return this.quote.trim().length > 0 && this.quote.length <= 500;
  }

  /**
   * Gets first sentence of quote (for preview)
   */
  getPreview(maxLength: number = 100): string {
    const trimmed = this.quote.trim();
    if (trimmed.length <= maxLength) return trimmed;
    return trimmed.substring(0, maxLength) + '...';
  }
}

export default Quote;
