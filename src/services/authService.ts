const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = error.message || error.error || JSON.stringify(error);
          console.error('Login error response:', error);
        } else {
          const text = await response.text();
          errorMessage = text || `Server error: ${response.status}`;
          console.error('Login error text:', text);
        }
      } catch (e) {
        errorMessage = `Server error: ${response.status}`;
        console.error('Error parsing response:', e);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    // Store tokens in localStorage
    if (result.accessToken) {
      localStorage.setItem('accessToken', result.accessToken);
    }
    if (result.refreshToken) {
      localStorage.setItem('refreshToken', result.refreshToken);
    }

    return result;
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const result = await response.json();
    
    // Update tokens in localStorage
    if (result.accessToken) {
      localStorage.setItem('accessToken', result.accessToken);
    }
    if (result.refreshToken) {
      localStorage.setItem('refreshToken', result.refreshToken);
    }

    return result;
  },

  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/request-reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to request password reset');
    }
  },

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset password');
    }
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};
