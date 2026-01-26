const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface LoginRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  code: string;
  newPassword: string;
  email: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = "Login failed";
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          errorMessage = error.message || error.error || JSON.stringify(error);
          console.error("Login error response:", error);
        } else {
          const text = await response.text();
          errorMessage = text || `Server error: ${response.status}`;
          console.error("Login error text:", text);
        }
      } catch (e) {
        errorMessage = `Server error: ${response.status}`;
        console.error("Error parsing response:", e);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();

    console.log("Login response:", result);
    console.log("Login response structure:", JSON.stringify(result, null, 2));

    // Store tokens in localStorage - handle different response structures
    let accessToken = result.accessToken || result.access_token;
    let refreshToken = result.refreshToken || result.refresh_token;

    // Check if tokens are nested in a data object
    if (!accessToken && result.data) {
      accessToken = result.data.accessToken || result.data.access_token;
      refreshToken = result.data.refreshToken || result.data.refresh_token;
    }

    if (accessToken) {
      console.log("Saving accessToken:", accessToken.substring(0, 20) + "...");
      localStorage.setItem("accessToken", accessToken);
    } else {
      console.error("No access token found in response!");
    }

    if (refreshToken) {
      console.log(
        "Saving refreshToken:",
        refreshToken.substring(0, 20) + "...",
      );
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      console.error("No refresh token found in response!");
    }

    // Verify tokens were saved
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");
    console.log(
      "Verified saved accessToken:",
      savedAccessToken
        ? savedAccessToken.substring(0, 20) + "..."
        : "NOT SAVED",
    );
    console.log(
      "Verified saved refreshToken:",
      savedRefreshToken
        ? savedRefreshToken.substring(0, 20) + "..."
        : "NOT SAVED",
    );

    return result;
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    console.log("Attempting to refresh token...");
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error("Token refresh failed with status:", response.status);
      throw new Error("Token refresh failed");
    }

    const result = await response.json();
    console.log("Refresh token response:", result);

    // Update tokens in localStorage - handle different response structures
    let accessToken = result.accessToken || result.access_token;
    let newRefreshToken = result.refreshToken || result.refresh_token;

    // Check if tokens are nested in a data object
    if (!accessToken && result.data) {
      accessToken = result.data.accessToken || result.data.access_token;
      newRefreshToken = result.data.refreshToken || result.data.refresh_token;
    }

    if (accessToken) {
      console.log("Updating accessToken after refresh");
      localStorage.setItem("accessToken", accessToken);
    }
    if (newRefreshToken) {
      console.log("Updating refreshToken after refresh");
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    return result;
  },

  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/request-reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to request password reset");
    }
  },

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reset password");
    }
  },

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  async fetchWithAuth(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    const token = this.getAccessToken();

    console.log("fetchWithAuth - URL:", url);
    console.log(
      "fetchWithAuth - Token:",
      token ? `${token.substring(0, 20)}...` : "NO TOKEN",
    );

    if (!token) {
      console.error("No access token found, redirecting to login");
      this.logout();
      window.location.href = "/login";
      throw new Error("No access token. Please login.");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Merge any additional headers from options
    if (options.headers) {
      const optionsHeaders = options.headers as Record<string, string>;
      Object.keys(optionsHeaders).forEach((key) => {
        if (
          key.toLowerCase() !== "content-type" &&
          key.toLowerCase() !== "authorization"
        ) {
          headers[key] = optionsHeaders[key];
        }
      });
    }

    console.log("fetchWithAuth - Request headers:", headers);

    let response = await fetch(url, {
      ...options,
      headers,
    });

    console.log("fetchWithAuth - Response status:", response.status);

    // If we get a 401, try to refresh the token and retry
    if (response.status === 401) {
      console.log("Got 401, attempting token refresh...");
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        try {
          await this.refreshToken(refreshToken);
          // Retry the original request with new token
          const newToken = this.getAccessToken();
          console.log("Token refreshed, retrying request with new token");

          const newHeaders: Record<string, string> = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          };

          // Merge any additional headers from options
          if (options.headers) {
            const optionsHeaders = options.headers as Record<string, string>;
            Object.keys(optionsHeaders).forEach((key) => {
              if (
                key.toLowerCase() !== "content-type" &&
                key.toLowerCase() !== "authorization"
              ) {
                newHeaders[key] = optionsHeaders[key];
              }
            });
          }

          response = await fetch(url, { ...options, headers: newHeaders });
          console.log("Retry response status:", response.status);
        } catch (error) {
          console.error("Token refresh failed:", error);
          // Refresh failed, logout and redirect to login
          this.logout();
          window.location.href = "/login";
          throw new Error("Session expired. Please login again.");
        }
      } else {
        console.error("No refresh token available");
        // No refresh token, logout and redirect
        this.logout();
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }
    }

    return response;
  },
};
