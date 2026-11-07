import { TestBed } from '@angular/core/testing';
import { CookieService } from '../../../services/cookie.service';
import { CommentPasswordService } from './comment-password.service';

// Same pattern as the backend (CommentRules.PASSWORD_PATTERN): a password outside it is refused.
const BACKEND_PASSWORD_PATTERN = /^[A-Za-z0-9_-]{32,128}$/;

describe('CommentPasswordService', () => {
  let service: CommentPasswordService;
  let cookies: CookieService;

  beforeEach(() => {
    service = TestBed.inject(CommentPasswordService);
    cookies = TestBed.inject(CookieService);
  });

  it('generates a password accepted by the backend (32 random bytes in base64url = 43 chars)', () => {
    for (let i = 0; i < 50; i++) {
      const password = service.generatePassword();
      expect(password).toMatch(BACKEND_PASSWORD_PATTERN);
      expect(password).toHaveLength(43);
    }
  });

  it('never generates the same password twice', () => {
    const passwords = new Set(Array.from({ length: 200 }, () => service.generatePassword()));
    expect(passwords.size).toBe(200);
  });

  it('keeps the password of each message in its own cookie for the 7-day edit window', () => {
    const setSpy = vi.spyOn(cookies, 'set');

    service.save(12, 'secret-12');

    expect(setSpy).toHaveBeenCalledWith('gb_pw_12', 'secret-12', 7);
    expect(service.get(12)).toBe('secret-12');
    expect(service.get(13)).toBeNull();
  });

  it('forgets the password once the message is deleted', () => {
    service.save(12, 'secret-12');
    service.remove(12);
    expect(service.get(12)).toBeNull();
  });
});
