/**
 * Guestbook rules, shared with the backend (back/src/main/java/zeldaCV/util/CommentRules.java).
 * The text limits come from the fixed size of the message box (131x44): longer texts would overflow it.
 */
export const COMMENT_RULES = {
  PSEUDO_MAX_LENGTH: 20,
  COMMENT_MAX_LENGTH: 250,
  /** How long the author can edit/delete a message (cookie lifetime, also enforced by the backend). */
  EDIT_WINDOW_DAYS: 7,
} as const;

/** Line breaks would push the text out of the message box: they become spaces. */
export function normalizeCommentText(text: string): string {
  return text.replace(/\s*[\r\n]+\s*/g, ' ').trim();
}
