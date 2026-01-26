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
  message: string;
  email: string;
}

interface VerifyOtpRequest {
  otp: string;
  email: string;
}

interface NewPasswordRequest {
  email: string;
  password: string;
}

interface BlockedResponse {
  message: string;
  email: string;
  permanent: boolean;
  blockedUntil: string | null;
  minutesLeft: number | null;
}

export interface UserBlockedError {
  type: "USER_BLOCKED";
  data: BlockedResponse;
}

// Track if a refresh is in progress to avoid multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<LoginResponse> | null = null;

// Helper function to decode JWT and check expiration
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    // Consider token expired if it expires within the next 60 seconds
    return currentTime >= expirationTime - 60000;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}

// Helper function to make authenticated requests with auto-retry on 401
async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const accessToken = localStorage.getItem("accessToken");

  // Add authorization header
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  // Make the request
  let response = await fetch(url, { ...options, headers });

  // If we get a 401, try to refresh the token and retry
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      // No refresh token available, logout
      authService.logout();
      window.location.href = "/login";
      throw new Error("Authentication required");
    }

    try {
      // Refresh the token
      await authService.refreshToken(refreshToken);

      // Retry the original request with the new token
      const newAccessToken = localStorage.getItem("accessToken");
      headers["Authorization"] = `Bearer ${newAccessToken}`;
      response = await fetch(url, { ...options, headers });
    } catch (error) {
      // Refresh failed, logout
      authService.logout();
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }
  }

  return response;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const url = `${API_BASE_URL}/api/auth/login`;
    console.log("Login request:", {
      url,
      email: data.email,
      hasPassword: !!data.password,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Login response:", {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Server returned non-JSON response:", {
        status: response.status,
        contentType,
        url: response.url,
        body: text.substring(0, 500), // Log first 500 chars for debugging
      });

      if (response.status === 401) {
        throw new Error("Email o password errati. Riprova.");
      } else if (response.status === 500) {
        throw new Error(
          "Server error occurred. Please try again later or contact support.",
        );
      } else if (response.status === 404) {
        throw new Error(
          "Login endpoint not found. Please check your API configuration.",
        );
      } else {
        throw new Error(`Server error: ${response.status}. Please try again.`);
      }
    }

    const result = await response.json();

    // Check for blocked user in response
    if (result.permanent !== undefined) {
      throw {
        type: "USER_BLOCKED",
        data: result as BlockedResponse,
      };
    }

    // Handle 401 - Wrong credentials
    if (response.status === 401) {
      throw new Error("Email o password errati. Riprova.");
    }

    if (!response.ok) {
      // Throw the specific error message from the backend
      throw new Error(result.message || result.error || "Login failed");
    }

    // Supporta sia token che accessToken
    const accessToken = result.accessToken ?? result.token;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (result.refreshToken) {
      localStorage.setItem("refreshToken", result.refreshToken);
    }

    return {
      ...result,
      accessToken,
    };
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Token refresh returned non-JSON response:", {
            status: response.status,
            contentType,
            url: response.url,
            body: text.substring(0, 500),
          });
          throw new Error("Session refresh failed. Please login again.");
        }

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || "Token refresh failed");
        }

        const result = await response.json();

        const accessToken = result.accessToken ?? result.token;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
        if (result.refreshToken) {
          localStorage.setItem("refreshToken", result.refreshToken);
        }

        return {
          ...result,
          accessToken,
        };
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },

  async requestPasswordReset(email: string): Promise<void> {
    console.log("Request password reset for:", email);

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

    console.log("Request password reset response:", {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
    });

    if (!response.ok) {
      // Backend returns plain text error messages
      const errorText = await response.text();
      console.error("Password reset request failed:", errorText);

      const errorMessage =
        errorText || `Errore ${response.status}: Impossibile inviare il codice`;
      throw new Error(errorMessage);
    }

    // Success - OTP sent
    console.log("Password reset OTP sent successfully");
  },

  async verifyOtp(data: VerifyOtpRequest): Promise<void> {
    console.log("Verify OTP request:", {
      email: data.email,
      hasOtp: !!data.otp,
    });

    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Verify OTP response:", {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
    });

    // Read response as text first (backend returns plain text)
    const responseText = await response.text();
    console.log("Response body:", responseText);

    if (!response.ok) {
      // Backend returns plain text error messages
      const errorMessage =
        responseText || `Errore ${response.status}: OTP non valido`;
      throw new Error(errorMessage);
    }

    // Success - OTP is valid
  },

  async setNewPassword(data: NewPasswordRequest): Promise<void> {
    console.log("Set new password request:", {
      email: data.email,
      hasPassword: !!data.password,
    });

    const response = await fetch(`${API_BASE_URL}/api/auth/new-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Set new password response:", {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
    });

    // Read response as text first (backend returns plain text)
    const responseText = await response.text();
    console.log("Response body:", responseText);

    if (!response.ok) {
      // Backend returns plain text error messages
      const errorMessage =
        responseText ||
        `Errore ${response.status}: Impossibile reimpostare la password`;
      throw new Error(errorMessage);
    }

    // Success - Password set successfully
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
    const token = this.getAccessToken();
    if (!token) return false;

    // Check if token is expired
    if (isTokenExpired(token)) {
      // Try to refresh if we have a refresh token
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        // Trigger refresh in background
        this.refreshToken(refreshToken).catch(() => {
          this.logout();
        });
      } else {
        this.logout();
        return false;
      }
    }

    return true;
  },

  // New method to check token expiration without triggering refresh
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    return isTokenExpired(token);
  },

  // Export the fetchWithAuth helper for use in other services
  fetchWithAuth,
};

export const userService = {
  getAll: () =>
    authService
      .fetchWithAuth(`${API_BASE_URL}/api/users`)
      .then((r) => r.json()),

  getById: (id: number) =>
    authService
      .fetchWithAuth(`${API_BASE_URL}/api/users/${id}`)
      .then((r) => r.json()),

  delete: (id: number) =>
    authService.fetchWithAuth(`${API_BASE_URL}/api/users/${id}`, {
      method: "DELETE",
    }),
};
