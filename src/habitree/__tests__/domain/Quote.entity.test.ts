import { Quote } from '../../domain/entities/Quote';

describe('Quote Entity', () => {
  it('should create a Quote with properties', () => {
    const data = { id: 10, quote: 'Stay hungry, stay foolish.' } as const;
    const q = new Quote(data);

    expect(q.id).toBe(10);
    expect(q.quote).toBe('Stay hungry, stay foolish.');
  });

  it('getFormattedQuote should wrap the quote in double quotes', () => {
    const q = new Quote({ id: 1, quote: 'Hello world' });
    expect(q.getFormattedQuote()).toBe('"Hello world"');
  });

  it('getLength should return correct character count', () => {
    const text = 'abcde';
    const q = new Quote({ id: 2, quote: text });
    expect(q.getLength()).toBe(text.length);
  });

  describe('isValid', () => {
    it('should return false for empty or whitespace-only quote', () => {
      expect(new Quote({ id: 1, quote: '' }).isValid()).toBe(false);
      expect(new Quote({ id: 1, quote: '   ' }).isValid()).toBe(false);
    });

    it('should return false for overly long quote (>500 chars)', () => {
      const long = 'x'.repeat(501);
      expect(new Quote({ id: 1, quote: long }).isValid()).toBe(false);
    });

    it('should return true for valid quote', () => {
      const valid = 'This is a valid quote.';
      expect(new Quote({ id: 1, quote: valid }).isValid()).toBe(true);
    });
  });

  describe('getPreview', () => {
    it('should return full quote when shorter than maxLength', () => {
      const short = 'Short quote';
      const q = new Quote({ id: 3, quote: short });
      expect(q.getPreview(100)).toBe(short);
    });

    it('should truncate and append ellipsis when longer than maxLength', () => {
      const long = 'a'.repeat(120);
      const q = new Quote({ id: 4, quote: long });
      const preview = q.getPreview(50);
      expect(preview).toHaveLength(53); // 50 chars + '...'
      expect(preview.endsWith('...')).toBe(true);
    });

    it('should use default maxLength when not provided', () => {
      const long = 'b'.repeat(150);
      const q = new Quote({ id: 5, quote: long });
      const preview = q.getPreview(); // default 100
      expect(preview).toHaveLength(103);
      expect(preview.endsWith('...')).toBe(true);
    });
  });
});
