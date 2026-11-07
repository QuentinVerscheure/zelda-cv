import { escapeString } from './sanitize-string.util';

describe('escapeString (pseudos of other players, received over the WebSocket)', () => {
  it('neutralises an HTML/script injection', () => {
    expect(escapeString('<img src=x onerror="alert(1)">')).toBe(
      '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'
    );
  });

  it('escapes every special HTML character, & first so nothing is escaped twice', () => {
    expect(escapeString(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
    expect(escapeString('&lt;')).toBe('&amp;lt;');
  });

  it('leaves normal pseudos untouched', () => {
    expect(escapeString('Link 42 éàç')).toBe('Link 42 éàç');
  });
});
