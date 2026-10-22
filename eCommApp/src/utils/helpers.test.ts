import { describe, expect, it } from 'vitest';
import { calculateTotal, formatPrice, validateEmail } from './helpers';

describe('formatPrice', () => {
    it('formats prices as US dollars with two decimal places', () => {
        expect(formatPrice(12)).toBe('$12.00');
        expect(formatPrice(12.5)).toBe('$12.50');
        expect(formatPrice(0)).toBe('$0.00');
    });
});

describe('calculateTotal', () => {
    it('calculates the total for multiple cart items', () => {
        expect(calculateTotal([
            { price: 3.5, quantity: 2 },
            { price: 4, quantity: 3 }
        ])).toBe(19);
    });

    it('returns zero for an empty cart', () => {
        expect(calculateTotal([])).toBe(0);
    });
});

describe('validateEmail', () => {
    it.each([
        'person@example.com',
        'first.last+tag@example.co.uk'
    ])('accepts a valid address: %s', (email) => {
        expect(validateEmail(email)).toBe(true);
    });

    it.each([
        '',
        'missing-at.example.com',
        'missing-domain@',
        'missing-tld@example',
        'contains spaces@example.com'
    ])('rejects an invalid address: %s', (email) => {
        expect(validateEmail(email)).toBe(false);
    });
});
