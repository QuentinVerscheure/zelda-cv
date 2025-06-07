package zeldaCV.security.jwt;

// DTO for JWT response
public class JwtAuthResponse {
    private String accessToken;

    public String getAccessToken() {
        return accessToken;
    }
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}
