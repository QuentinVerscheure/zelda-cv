package zeldaCV.util;

import java.time.Duration;

/**
 * Business rules of the guestbook messages, shared by validation and services.
 * The text limits come from the fixed message box (131x44, see CommentServiceImpl): longer texts
 * would overflow it. Keep them in sync with front/src/app/game/scenes/guestBookHouse/comment-rules.ts.
 */
public final class CommentRules {

    private CommentRules() {
    }

    public static final int PSEUDO_MAX_LENGTH = 20;
    public static final int COMMENT_MAX_LENGTH = 250;

    /** How long the author can edit/delete a message after creating it. */
    public static final int EDIT_WINDOW_DAYS = 7;
    public static final Duration EDIT_WINDOW = Duration.ofDays(EDIT_WINDOW_DAYS);

    /** The browser generates 32 random bytes encoded in base64url (43 chars); accept a reasonable range. */
    public static final String PASSWORD_PATTERN = "^[A-Za-z0-9_-]{32,128}$";
    public static final String PASSWORD_PATTERN_MESSAGE = "Mot de passe invalide";
}
