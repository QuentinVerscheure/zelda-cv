import { COMMENT_RULES, normalizeCommentText } from './comment-rules';

describe('normalizeCommentText', () => {
  it('replaces line breaks (and the spaces around them) with a single space', () => {
    expect(normalizeCommentText('Première ligne  \r\n\n   seconde ligne')).toBe(
      'Première ligne seconde ligne'
    );
  });

  it('trims the text', () => {
    expect(normalizeCommentText('   Bonjour   ')).toBe('Bonjour');
  });

  it('a text made only of line breaks becomes empty (refused by the form and the backend)', () => {
    expect(normalizeCommentText('\n\r\n  ')).toBe('');
  });
});

describe('COMMENT_RULES', () => {
  // The same limits are enforced by the backend (CommentRules.java); a backend test checks both
  // files stay in sync. These values come from the fixed 131x44 message box.
  it('matches the size of the message box', () => {
    expect(COMMENT_RULES.PSEUDO_MAX_LENGTH).toBe(20);
    expect(COMMENT_RULES.COMMENT_MAX_LENGTH).toBe(250);
    expect(COMMENT_RULES.EDIT_WINDOW_DAYS).toBe(7);
  });
});
