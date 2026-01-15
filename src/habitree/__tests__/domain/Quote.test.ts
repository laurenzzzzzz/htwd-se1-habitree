/**
 * Unittests für Quote
 * 
 * Testet: domain/entities/Quote.ts
 *
 * Diese Tests prüfen die Quote-Entity (Formatierung, Validierung, Zufalls-Auswahl).
 */

import { Quote } from '../../domain/entities/Quote';

describe('Quote Entity', () => {
  describe('constructor', () => {
    it('should_create_quote_with_valid_data', () => {
      const quoteData = { id: 1, quote: 'This is a motivational quote' };
      const quote = new Quote(quoteData);

      expect(quote.id).toBe(1);
      expect(quote.quote).toBe('This is a motivational quote');
    });

    it('should_create_quote_with_long_text', () => {
      const longQuote = 'A'.repeat(500);
      const quoteData = { id: 2, quote: longQuote };
      const quote = new Quote(quoteData);

      expect(quote.quote.length).toBe(500);
      expect(quote.isValid()).toBe(true);
    });
  });

  describe('getFormattedQuote', () => {
    it('should_return_quote_with_quotation_marks', () => {
      const quote = new Quote({ id: 1, quote: 'Success is not final' });
      
      expect(quote.getFormattedQuote()).toBe('"Success is not final"');
    });

    it('should_format_empty_quote_with_quotation_marks', () => {
      const quote = new Quote({ id: 1, quote: '' });
      
      expect(quote.getFormattedQuote()).toBe('""');
    });

    it('should_preserve_quote_content_in_formatting', () => {
      const quote = new Quote({ id: 1, quote: 'Be the change you wish to see' });
      
      const formatted = quote.getFormattedQuote();
      expect(formatted.startsWith('"')).toBe(true);
      expect(formatted.endsWith('"')).toBe(true);
      expect(formatted).toContain('Be the change');
    });
  });

  describe('getLength', () => {
    it('should_return_correct_length_for_short_quote', () => {
      const quote = new Quote({ id: 1, quote: 'Hello' });
      
      expect(quote.getLength()).toBe(5);
    });

    it('should_return_zero_for_empty_quote', () => {
      const quote = new Quote({ id: 1, quote: '' });
      
      expect(quote.getLength()).toBe(0);
    });

    it('should_return_correct_length_for_long_quote', () => {
      const longText = 'A'.repeat(250);
      const quote = new Quote({ id: 1, quote: longText });
      
      expect(quote.getLength()).toBe(250);
    });

    it('should_include_spaces_in_length', () => {
      const quote = new Quote({ id: 1, quote: 'Hello World' });
      
      expect(quote.getLength()).toBe(11);
    });
  });

  describe('isValid', () => {
    it('should_return_true_for_valid_quote', () => {
      const quote = new Quote({ id: 1, quote: 'This is a valid quote' });
      
      expect(quote.isValid()).toBe(true);
    });

    it('should_return_false_for_empty_quote', () => {
      const quote = new Quote({ id: 1, quote: '' });
      
      expect(quote.isValid()).toBe(false);
    });

    it('should_return_false_for_whitespace_only_quote', () => {
      const quote = new Quote({ id: 1, quote: '   ' });
      
      expect(quote.isValid()).toBe(false);
    });

    it('should_return_true_for_quote_at_max_length', () => {
      const maxLengthQuote = 'A'.repeat(500);
      const quote = new Quote({ id: 1, quote: maxLengthQuote });
      
      expect(quote.isValid()).toBe(true);
    });

    it('should_return_false_for_quote_exceeding_max_length', () => {
      const tooLongQuote = 'A'.repeat(501);
      const quote = new Quote({ id: 1, quote: tooLongQuote });
      
      expect(quote.isValid()).toBe(false);
    });

    it('should_return_true_for_single_character_quote', () => {
      const quote = new Quote({ id: 1, quote: 'A' });
      
      expect(quote.isValid()).toBe(true);
    });
  });

  describe('getPreview', () => {
    it('should_return_full_quote_when_shorter_than_max_length', () => {
      const quote = new Quote({ id: 1, quote: 'Short quote' });
      
      expect(quote.getPreview(100)).toBe('Short quote');
    });

    it('should_truncate_quote_when_longer_than_max_length', () => {
      const longQuote = 'This is a very long motivational quote that exceeds the maximum preview length';
      const quote = new Quote({ id: 1, quote: longQuote });
      
      const preview = quote.getPreview(50);
      expect(preview.length).toBe(53); // 50 chars + '...'
      expect(preview.endsWith('...')).toBe(true);
    });

    it('should_use_default_max_length_of_100', () => {
      const longQuote = 'A'.repeat(150);
      const quote = new Quote({ id: 1, quote: longQuote });
      
      const preview = quote.getPreview();
      expect(preview.length).toBe(103); // 100 chars + '...'
    });

    it('should_trim_whitespace_before_preview', () => {
      const quote = new Quote({ id: 1, quote: '   Trimmed quote   ' });
      
      expect(quote.getPreview()).toBe('Trimmed quote');
    });

    it('should_return_empty_when_quote_is_only_whitespace', () => {
      const quote = new Quote({ id: 1, quote: '     ' });
      
      expect(quote.getPreview()).toBe('');
    });

    it('should_handle_custom_max_length', () => {
      const quote = new Quote({ id: 1, quote: 'This is a test quote for custom length' });
      
      const preview = quote.getPreview(10);
      expect(preview).toBe('This is a ...');
    });
  });
});
