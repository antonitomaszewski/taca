/**
 * Testy dla funkcji formatujących w src/lib/formatters.ts
 */

import {
  formatBankAccount,
  unformatBankAccount,
  validateBankAccount,
  formatCurrency,
  formatPhoneNumber,
  validatePhoneNumber,
  unformatPhoneNumber,
  normalizePhoneNumber
} from '../lib/formatters';

describe('formatters.ts', () => {
  
  describe('formatBankAccount', () => {
    it('should format Polish IBAN correctly', () => {
      expect(formatBankAccount('12345678901234567890123456')).toBe('12 3456 7890 1234 5678 9012 3456');
    });

    it('should handle input with spaces and special characters', () => {
      expect(formatBankAccount('12 3456 7890-1234/5678 9012 3456')).toBe('12 3456 7890 1234 5678 9012 3456');
    });

    it('should limit to 26 digits', () => {
      expect(formatBankAccount('123456789012345678901234567890')).toBe('12 3456 7890 1234 5678 9012 3456');
    });

    it('should handle shorter numbers', () => {
      expect(formatBankAccount('123456789012')).toBe('12 3456 7890 12');
    });

    it('should return empty string for empty input', () => {
      expect(formatBankAccount('')).toBe('');
      expect(formatBankAccount(null as any)).toBe('');
      expect(formatBankAccount(undefined as any)).toBe('');
    });
  });

  describe('unformatBankAccount', () => {
    it('should remove all non-digit characters', () => {
      expect(unformatBankAccount('12 3456 7890 1234 5678 9012 3456')).toBe('12345678901234567890123456');
    });

    it('should handle various separators', () => {
      expect(unformatBankAccount('12-3456_7890/1234 5678.9012#3456')).toBe('12345678901234567890123456');
    });

    it('should return empty string for empty input', () => {
      expect(unformatBankAccount('')).toBe('');
    });
  });

  describe('validateBankAccount', () => {
    it('should validate correct 26-digit IBAN', () => {
      expect(validateBankAccount('12345678901234567890123456')).toBe(true);
      expect(validateBankAccount('12 3456 7890 1234 5678 9012 3456')).toBe(true);
    });

    it('should reject incorrect length', () => {
      expect(validateBankAccount('1234567890123456789012345')).toBe(false); // 25 digits
      expect(validateBankAccount('123456789012345678901234567')).toBe(false); // 27 digits
    });

    it('should reject empty input', () => {
      expect(validateBankAccount('')).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with PLN symbol by default', () => {
      expect(formatCurrency(1234.56)).toBe('1 234,56 zł');
    });

    it('should format currency without symbol when requested', () => {
      expect(formatCurrency(1234.56, false)).toBe('1 234,56');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('0,00 zł');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1234567.89)).toBe('1 234 567,89 zł');
    });

    it('should handle decimal precision', () => {
      expect(formatCurrency(10.1)).toBe('10,10 zł');
      expect(formatCurrency(10)).toBe('10,00 zł');
    });
  });

  describe('formatPhoneNumber', () => {
    describe('mobile numbers', () => {
      it('should format mobile number with +48 prefix', () => {
        expect(formatPhoneNumber('+48713572729')).toBe('+48 71 357 27 29');
        expect(formatPhoneNumber('+48 713 572 729')).toBe('+48 71 357 27 29');
      });

      it('should format mobile number starting with 0', () => {
        expect(formatPhoneNumber('0713572729')).toBe('+48 71 357 27 29');
      });

      it('should format 9-digit mobile number', () => {
        expect(formatPhoneNumber('713572729')).toBe('+48 71 357 27 29');
      });

      it('should handle various mobile prefixes', () => {
        expect(formatPhoneNumber('500123456')).toBe('+48 500 123 456');
        expect(formatPhoneNumber('600987654')).toBe('+48 600 987 654');
        expect(formatPhoneNumber('780555444')).toBe('+48 780 555 444');
      });
    });

    describe('landline numbers', () => {
      it('should format landline numbers correctly', () => {
        expect(formatPhoneNumber('+48123456789')).toBe('+48 12 345 67 89');
        expect(formatPhoneNumber('123456789')).toBe('+48 12 345 67 89');
        expect(formatPhoneNumber('0123456789')).toBe('+48 12 345 67 89');
      });

      it('should handle various landline area codes', () => {
        expect(formatPhoneNumber('225551234')).toBe('+48 22 555 12 34'); // Warsaw
        expect(formatPhoneNumber('126661234')).toBe('+48 12 666 12 34'); // Krakow
        expect(formatPhoneNumber('713334567')).toBe('+48 71 333 45 67'); // Wrocław
      });
    });

    describe('edge cases', () => {
      it('should return empty string for empty input', () => {
        expect(formatPhoneNumber('')).toBe('');
        expect(formatPhoneNumber(null as any)).toBe('');
        expect(formatPhoneNumber(undefined as any)).toBe('');
      });

      it('should clean input with special characters', () => {
        expect(formatPhoneNumber('+48-713-572-729')).toBe('+48 71 357 27 29');
        expect(formatPhoneNumber('(713) 572 729')).toBe('+48 71 357 27 29');
      });

      it('should handle incorrect length numbers', () => {
        expect(formatPhoneNumber('12345')).toBe('12345');
        expect(formatPhoneNumber('+481234567890')).toBe('+481234567890');
      });
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct Polish phone numbers', () => {
      expect(validatePhoneNumber('+48713572729')).toBe(true);
      expect(validatePhoneNumber('0713572729')).toBe(true);
      expect(validatePhoneNumber('713572729')).toBe(true);
      expect(validatePhoneNumber('+48 713 572 729')).toBe(true);
    });

    it('should reject incorrect formats', () => {
      expect(validatePhoneNumber('+481234567890')).toBe(false); // too long
      expect(validatePhoneNumber('12345678')).toBe(false); // too short
      expect(validatePhoneNumber('+49713572729')).toBe(false); // wrong country code
    });

    it('should reject empty input', () => {
      expect(validatePhoneNumber('')).toBe(false);
    });
  });

  describe('unformatPhoneNumber', () => {
    it('should remove formatting but keep + and digits', () => {
      expect(unformatPhoneNumber('+48 713 572 729')).toBe('+48713572729');
      expect(unformatPhoneNumber('(713) 572-729')).toBe('713572729');
    });

    it('should return empty string for empty input', () => {
      expect(unformatPhoneNumber('')).toBe('');
    });
  });

  describe('normalizePhoneNumber', () => {
    it('should normalize to +48XXXXXXXXX format', () => {
      expect(normalizePhoneNumber('713572729')).toBe('+48713572729');
      expect(normalizePhoneNumber('0713572729')).toBe('+48713572729');
      expect(normalizePhoneNumber('+48713572729')).toBe('+48713572729');
    });

    it('should handle formatted input', () => {
      expect(normalizePhoneNumber('+48 713 572 729')).toBe('+48713572729');
      expect(normalizePhoneNumber('(0) 713-572-729')).toBe('+48713572729');
    });

    it('should return cleaned input for invalid formats', () => {
      expect(normalizePhoneNumber('12345')).toBe('12345');
    });

    it('should return empty string for empty input', () => {
      expect(normalizePhoneNumber('')).toBe('');
    });
  });

  describe('real-world examples', () => {
    it('should handle real Polish phone numbers correctly', () => {
      // Numery komórkowe
      expect(formatPhoneNumber('+48713572729')).toBe('+48 71 357 27 29');
      expect(formatPhoneNumber('601123456')).toBe('+48 601 123 456');
      expect(formatPhoneNumber('0501987654')).toBe('+48 501 987 654');
      
      // Numery stacjonarne
      expect(formatPhoneNumber('225551234')).toBe('+48 22 555 12 34'); // Warszawa
      expect(formatPhoneNumber('126661234')).toBe('+48 12 666 12 34'); // Kraków
      expect(formatPhoneNumber('0611234567')).toBe('+48 61 123 45 67'); // Poznań
    });

    it('should validate real Polish phone numbers', () => {
      const validNumbers = [
        '+48713572729',
        '0713572729',
        '713572729',
        '+48225551234',
        '0225551234',
        '225551234'
      ];

      validNumbers.forEach(number => {
        expect(validatePhoneNumber(number)).toBe(true);
      });
    });

    it('should normalize various input formats', () => {
      const inputs = [
        '(071) 357-27-29',
        '+48-71-357-27-29',
        '071 357 27 29',
        '+48 (71) 357 27 29'
      ];

      inputs.forEach(input => {
        expect(normalizePhoneNumber(input)).toBe('+48713572729');
      });
    });
  });
});
