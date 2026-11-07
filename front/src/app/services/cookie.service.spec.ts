import { TestBed } from '@angular/core/testing';
import { CookieService } from './cookie.service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    service = TestBed.inject(CookieService);
    // start every test with no cookie
    document.cookie
      .split('; ')
      .filter(Boolean)
      .forEach((c) => (document.cookie = `${c.split('=')[0]}=; Max-Age=0; Path=/`));
  });

  it('stores and reads back a value', () => {
    service.set('achievements', 'abc', 7);
    expect(service.get('achievements')).toBe('abc');
  });

  it('encodes values that would break the cookie format', () => {
    const json = JSON.stringify({ cv: true, note: 'a; b=c, é' });
    service.set('achievements', json, 7);
    expect(service.get('achievements')).toBe(json);
  });

  it('returns null for a missing cookie, without matching on a prefix of another name', () => {
    service.set('gb_pw_12', 'x', 7);
    expect(service.get('gb_pw_1')).toBeNull();
  });

  it('lists the cookies starting with a prefix', () => {
    service.set('gb_pw_1', 'a', 7);
    service.set('gb_pw_2', 'b', 7);
    service.set('achievements', '{}', 7);
    expect(service.getNamesStartingWith('gb_pw_').sort()).toEqual(['gb_pw_1', 'gb_pw_2']);
  });

  it('deletes a cookie', () => {
    service.set('gb_pw_1', 'a', 7);
    service.delete('gb_pw_1');
    expect(service.get('gb_pw_1')).toBeNull();
  });

  it('writes the expected attributes (lifetime in seconds, whole site, SameSite)', () => {
    const writes: string[] = [];
    const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')!;
    vi.spyOn(document, 'cookie', 'set').mockImplementation((value: string) => {
      writes.push(value);
      descriptor.set!.call(document, value);
    });

    service.set('gb_pw_1', 'a', 7);

    expect(writes[0]).toContain('Max-Age=604800');
    expect(writes[0]).toContain('Path=/');
    expect(writes[0]).toContain('SameSite=Lax');
    vi.restoreAllMocks();
  });
});
