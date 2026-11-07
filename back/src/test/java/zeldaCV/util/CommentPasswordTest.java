package zeldaCV.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CommentPasswordTest {

    private static final String PASSWORD = "q3Jf0c1x9V7mKkZb2Yw8uT4sR6pN5oLhGdEaCiBjQ0M";

    @Test
    void hashIsTheHexSha256OfThePassword() {
        // reference value of SHA-256("abc")
        assertThat(CommentPassword.hash("abc"))
                .isEqualTo("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    }

    @Test
    void hashFitsThe64CharsDatabaseColumnAndNeverContainsThePassword() {
        String hash = CommentPassword.hash(PASSWORD);
        assertThat(hash).hasSize(64).matches("[0-9a-f]{64}").doesNotContain(PASSWORD);
    }

    @Test
    void matchesTheRightPasswordOnly() {
        String storedHash = CommentPassword.hash(PASSWORD);
        assertThat(CommentPassword.matches(PASSWORD, storedHash)).isTrue();
        assertThat(CommentPassword.matches(PASSWORD + "x", storedHash)).isFalse();
        assertThat(CommentPassword.matches(PASSWORD.toLowerCase(), storedHash)).isFalse();
    }

    @Test
    void neverMatchesWhenAValueIsMissing() {
        assertThat(CommentPassword.matches(null, CommentPassword.hash(PASSWORD))).isFalse();
        assertThat(CommentPassword.matches(PASSWORD, null)).isFalse();
    }
}
