import { Injectable } from '@angular/core';

/**
 * Minimal helper around document.cookie.
 * Cookies are only used client-side (they are never read by the backend).
 */
@Injectable({
  providedIn: 'root',
})
export class CookieService {
  get(name: string): string | null {
    const prefix = `${encodeURIComponent(name)}=`;
    const cookie = document.cookie
      .split('; ')
      .find((c) => c.startsWith(prefix));
    return cookie ? decodeURIComponent(cookie.substring(prefix.length)) : null;
  }

  /** Names of all the cookies starting with the given prefix. */
  getNamesStartingWith(prefix: string): string[] {
    return document.cookie
      .split('; ')
      .map((c) => decodeURIComponent(c.split('=')[0]))
      .filter((name) => name.startsWith(prefix));
  }

  set(name: string, value: string, days: number): void {
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie =
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}` +
      `; Max-Age=${Math.round(days * 24 * 60 * 60)}; Path=/; SameSite=Lax${secure}`;
  }

  delete(name: string): void {
    document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=/; SameSite=Lax`;
  }
}
