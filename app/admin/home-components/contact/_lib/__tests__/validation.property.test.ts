import { describe, expect } from 'vitest';
import { fc, test } from '@fast-check/vitest';
import { isValidUrl, isValidEmail, isValidPhone } from '../validation';

describe('Validation Properties', () => {
  // Property 10: URL Validation Round Trip
  // **Validates: Requirements 7.1, 7.2, 7.3, 4.5**
  test.prop([fc.webUrl()], { numRuns: 100 })('valid URLs return true', (url: string) => {
    expect(isValidUrl(url)).toBe(true);
  });

  test.prop([
    fc.string().filter((s) => {
      if (!s.trim()) return false; // Empty strings are valid
      try {
        new URL(s);
        return false; // Valid URL, skip
      } catch {
        return true; // Invalid URL, include
      }
    }),
  ], { numRuns: 100 })('invalid URLs return false', (invalidUrl: string) => {
    expect(isValidUrl(invalidUrl)).toBe(false);
  });

  test.prop([fc.constant('')], { numRuns: 100 })('empty URL is valid', (emptyUrl: string) => {
    expect(isValidUrl(emptyUrl)).toBe(true);
  });

  // Property 11: Email Validation Pattern Matching
  // **Validates: Requirements 7.2**
  test.prop([fc.emailAddress()], { numRuns: 100 })('valid emails return true', (email: string) => {
    expect(isValidEmail(email)).toBe(true);
  });

  test.prop([
    fc.string().filter((s) => {
      if (!s.trim()) return false; // Empty strings are valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(s); // Only invalid emails
    }),
  ], { numRuns: 100 })('invalid emails return false', (invalidEmail: string) => {
    expect(isValidEmail(invalidEmail)).toBe(false);
  });

  test.prop([fc.constant('')], { numRuns: 100 })('empty email is valid', (emptyEmail: string) => {
    expect(isValidEmail(emptyEmail)).toBe(true);
  });

  // Property 12: Phone Validation Character Whitelist
  // **Validates: Requirements 7.3**
  test.prop([
    fc.array(
      fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '+', '-', '(', ')')
    ).map(arr => arr.join(''))
  ], { numRuns: 100 })('valid phones return true', (phone: string) => {
    expect(isValidPhone(phone)).toBe(true);
  });

  test.prop([
    fc
      .string()
      .filter((s) => {
        if (!s.trim()) return false; // Empty strings are valid
        const phoneRegex = /^[\d\s+\-()]+$/;
        return !phoneRegex.test(s); // Only invalid phones
      }),
  ], { numRuns: 100 })('invalid phones return false', (invalidPhone: string) => {
    expect(isValidPhone(invalidPhone)).toBe(false);
  });

  test.prop([fc.constant('')], { numRuns: 100 })('empty phone is valid', (emptyPhone: string) => {
    expect(isValidPhone(emptyPhone)).toBe(true);
  });
});
