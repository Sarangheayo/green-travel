// src/utils/string/truncateChars.test.js
import { describe, it, expect } from 'vitest';
import { truncateChars } from './truncateChars';

describe('truncateChars', () => {
  it('9자 초과면 ...', () => {
    expect(truncateChars('광명시 책축제 좋아요', 9)).toBe('광명시 책축...');
  });

  it('9자 이하면 원본', () => {
    expect(truncateChars('고성명태축', 9)).toBe('고성명태축');
  });

  it('이모지도 안전', () => {
    expect(truncateChars('😀😀😀😀😀😀😀😀😀😀', 9)).toBe('😀😀😀😀😀😀😀😀😀...');
  });
});
