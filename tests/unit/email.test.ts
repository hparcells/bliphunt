import { isValidEmail } from '../../src/util/email';

import { BAD_EMAILS } from '../../src/data/test';

describe("Utility - Email", () => {
  it('validates emails correctly', () => {
    BAD_EMAILS.forEach((email) => {
      expect(isValidEmail(email)).toBe(false);
    });
  
    expect(isValidEmail('username@domain.com')).toBe(true);
    expect(isValidEmail('username.last@domain.com')).toBe(true);
  });
});
