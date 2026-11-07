package zeldaCV.util;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.jupiter.api.Test;

/**
 * The guestbook limits are duplicated in the frontend (comment-rules.ts) so the form can block
 * a text before sending it. This test fails as soon as the two copies disagree.
 */
class CommentRulesSyncTest {

    private static final Path FRONT_RULES =
            Path.of("..", "front", "src", "app", "game", "scenes", "guestBookHouse", "comment-rules.ts");

    private static int frontValue(String source, String name) {
        Matcher matcher = Pattern.compile(name + "\\s*:\\s*(\\d+)").matcher(source);
        assertThat(matcher.find()).as(name + " not found in " + FRONT_RULES).isTrue();
        return Integer.parseInt(matcher.group(1));
    }

    @Test
    void frontendAndBackendUseTheSameLimits() throws IOException {
        String source = Files.readString(FRONT_RULES);

        assertThat(frontValue(source, "PSEUDO_MAX_LENGTH")).isEqualTo(CommentRules.PSEUDO_MAX_LENGTH);
        assertThat(frontValue(source, "COMMENT_MAX_LENGTH")).isEqualTo(CommentRules.COMMENT_MAX_LENGTH);
        assertThat(frontValue(source, "EDIT_WINDOW_DAYS")).isEqualTo(CommentRules.EDIT_WINDOW_DAYS);
    }
}
