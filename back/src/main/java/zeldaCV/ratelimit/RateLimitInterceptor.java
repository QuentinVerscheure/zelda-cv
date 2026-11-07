package zeldaCV.ratelimit;

import java.io.IOException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import tools.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Per-IP rate limit on the endpoints that write data (guestbook and contact mail), to slow down
 * scripts calling the API directly. The client IP comes from request.getRemoteAddr(), which
 * Tomcat resolves from X-Forwarded-For set by the trusted reverse proxies
 * (server.forward-headers-strategy=native).
 */
@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimiter rateLimiter;
    private final ObjectMapper objectMapper;
    private final int commentCreatePerHour;
    private final int commentEditPerHour;
    private final int mailPerHour;

    public RateLimitInterceptor(
            RateLimiter rateLimiter,
            ObjectMapper objectMapper,
            @Value("${app.rate-limit.comment-create-per-hour:5}") int commentCreatePerHour,
            @Value("${app.rate-limit.comment-edit-per-hour:120}") int commentEditPerHour,
            @Value("${app.rate-limit.mail-per-hour:3}") int mailPerHour) {
        this.rateLimiter = rateLimiter;
        this.objectMapper = objectMapper;
        this.commentCreatePerHour = commentCreatePerHour;
        this.commentEditPerHour = commentEditPerHour;
        this.mailPerHour = mailPerHour;
    }

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull Object handler) throws IOException {
        String method = request.getMethod();
        if (HttpMethod.GET.matches(method) || HttpMethod.OPTIONS.matches(method) || HttpMethod.HEAD.matches(method)) {
            return true;
        }

        String path = request.getRequestURI().substring(request.getContextPath().length());
        String bucket;
        int limit;
        if (path.startsWith("/api/sendMailToOwner")) {
            bucket = "mail";
            limit = mailPerHour;
        } else if (HttpMethod.POST.matches(method) && (path.equals("/api/comments") || path.equals("/api/comments/"))) {
            bucket = "comment-create";
            limit = commentCreatePerHour;
        } else if (path.startsWith("/api/comments/")) {
            bucket = "comment-edit";
            limit = commentEditPerHour;
        } else {
            return true;
        }

        if (rateLimiter.tryAcquire(bucket + "|" + request.getRemoteAddr(), limit)) {
            return true;
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", HttpStatus.TOO_MANY_REQUESTS.value());
        body.put("error", "Trop de requêtes, merci de réessayer plus tard");
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", String.valueOf(RateLimiter.WINDOW.toSeconds()));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), body);
        return false;
    }
}
