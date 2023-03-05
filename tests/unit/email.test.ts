import { isValidEmail } from '../../src/util/email';

describe("Utility - Email", () => {
  it('validates emails correctly', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('username')).toBe(false);
    expect(isValidEmail('username.com')).toBe(false);
    expect(isValidEmail('username@')).toBe(false);
    expect(isValidEmail('username@.com')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('username@domain')).toBe(false);
  
    expect(isValidEmail('username@domain.com')).toBe(true);
    expect(isValidEmail('username.last@domain.com')).toBe(true);
  });
});
