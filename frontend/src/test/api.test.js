import { describe, test, expect } from 'vitest';
import { getUploadUrl } from '../services/api';

describe('api service', () => {
  describe('getUploadUrl', () => {
    test('returns falsy values as-is', () => {
      expect(getUploadUrl(null)).toBeNull();
      expect(getUploadUrl(undefined)).toBeUndefined();
      expect(getUploadUrl('')).toBe('');
    });

    test('returns absolute URLs unchanged', () => {
      expect(getUploadUrl('https://example.com/img.png')).toBe('https://example.com/img.png');
      expect(getUploadUrl('http://example.com/img.png')).toBe('http://example.com/img.png');
    });

    test('prepends backend URL to paths starting with /', () => {
      const result = getUploadUrl('/uploads/projects/img.png');
      expect(result).toContain('/uploads/projects/img.png');
    });

    test('prepends backend URL to paths without leading /', () => {
      const result = getUploadUrl('uploads/projects/img.png');
      expect(result).toContain('/uploads/projects/img.png');
    });
  });
});
