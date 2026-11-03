package zeldaCV.ratelimit;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Minimal in-memory fixed-window rate limiter, keyed by "bucket + client IP".
 * State is lost on restart, which is fine for anti-spam purposes on a single instance.
 */
@Component
public class RateLimiter {

    static final Duration WINDOW = Duration.ofHours(1);

    private final Map<String, Window> windows = new ConcurrentHashMap<>();
    private final Clock clock;

    public RateLimiter() {
        this(Clock.systemUTC());
    }

    RateLimiter(Clock clock) {
        this.clock = clock;
    }

    /**
     * Counts one request for this key.
     * @return true if the request is allowed, false if the limit for the current window is reached
     */
    public boolean tryAcquire(String key, int limit) {
        Instant now = clock.instant();
        Window window = windows.compute(key, (k, current) ->
                current == null || current.isExpired(now) ? new Window(now, 1) : current.increment());
        return window.count() <= limit;
    }

    /** Forget expired windows so the map does not grow forever. */
    @Scheduled(fixedRate = 10 * 60 * 1000)
    public void purgeExpired() {
        Instant now = clock.instant();
        windows.values().removeIf(window -> window.isExpired(now));
    }

    private record Window(Instant start, int count) {
        boolean isExpired(Instant now) {
            return !now.isBefore(start.plus(WINDOW));
        }

        Window increment() {
            return new Window(start, count + 1);
        }
    }
}
