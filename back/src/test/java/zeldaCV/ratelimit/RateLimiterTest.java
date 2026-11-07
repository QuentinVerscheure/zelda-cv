package zeldaCV.ratelimit;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;

class RateLimiterTest {

    /** Clock that the test moves forward by hand. */
    private static final class MutableClock extends Clock {
        private Instant now = Instant.parse("2026-01-01T10:00:00Z");

        void advance(Duration duration) {
            now = now.plus(duration);
        }

        @Override
        public Instant instant() {
            return now;
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }
    }

    private final MutableClock clock = new MutableClock();
    private final RateLimiter rateLimiter = new RateLimiter(clock);

    @Test
    void allowsRequestsUpToTheLimitThenBlocks() {
        for (int i = 0; i < 5; i++) {
            assertThat(rateLimiter.tryAcquire("comment-create|1.2.3.4", 5)).isTrue();
        }
        assertThat(rateLimiter.tryAcquire("comment-create|1.2.3.4", 5)).isFalse();
    }

    @Test
    void eachIpAndEachBucketHasItsOwnCounter() {
        assertThat(rateLimiter.tryAcquire("mail|1.2.3.4", 1)).isTrue();
        assertThat(rateLimiter.tryAcquire("mail|1.2.3.4", 1)).isFalse();

        assertThat(rateLimiter.tryAcquire("mail|5.6.7.8", 1)).isTrue();
        assertThat(rateLimiter.tryAcquire("comment-create|1.2.3.4", 1)).isTrue();
    }

    @Test
    void theCounterRestartsWhenTheOneHourWindowIsOver() {
        assertThat(rateLimiter.tryAcquire("mail|1.2.3.4", 1)).isTrue();
        assertThat(rateLimiter.tryAcquire("mail|1.2.3.4", 1)).isFalse();

        clock.advance(RateLimiter.WINDOW.minusSeconds(1));
        assertThat(rateLimiter.tryAcquire("mail|1.2.3.4", 1)).as("still inside the window").isFalse();

        clock.advance(Duration.ofSeconds(1));
        assertThat(rateLimiter.tryAcquire("mail|1.2.3.4", 1)).as("new window").isTrue();
    }

    @Test
    void purgeOnlyForgetsExpiredWindows() {
        rateLimiter.tryAcquire("mail|1.2.3.4", 1);
        clock.advance(RateLimiter.WINDOW);
        rateLimiter.tryAcquire("mail|5.6.7.8", 1);

        rateLimiter.purgeExpired();

        // the expired window is gone: a new request is allowed again
        assertThat(rateLimiter.tryAcquire("mail|1.2.3.4", 1)).isTrue();
        // the current window is kept: still blocked
        assertThat(rateLimiter.tryAcquire("mail|5.6.7.8", 1)).isFalse();
    }
}
