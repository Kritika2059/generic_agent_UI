// // src/services/authService.ts

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface SignupRequest {
//   name: string;
//   email: string;
//   password: string;
// }

// export interface AuthResponse {
//   success: boolean;
//   user?: {
//     id: string;
//     email: string;
//     name: string;
//     role: 'user' | 'admin';
//   };
//   token?: string;
//   error?: string;
// }

// class AuthService {
//   private getHeaders() {
//     const token = localStorage.getItem('auth_token');
//     return {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//     };
//   }

//   async login(credentials: LoginRequest): Promise<AuthResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: this.getHeaders(),
//         body: JSON.stringify(credentials),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         if (data.token) {
//           localStorage.setItem('auth_token', data.token);
//         }
//         return {
//           success: true,
//           user: data.user,
//           token: data.token,
//         };
//       } else {
//         return {
//           success: false,
//           error: data.message || 'Login failed',
//         };
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: 'Network error. Please try again.',
//       };
//     }
//   }

//   async signup(userData: SignupRequest): Promise<AuthResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/signup`, {
//         method: 'POST',
//         headers: this.getHeaders(),
//         body: JSON.stringify(userData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         if (data.token) {
//           localStorage.setItem('auth_token', data.token);
//         }
//         return {
//           success: true,
//           user: data.user,
//           token: data.token,
//         };
//       } else {
//         return {
//           success: false,
//           error: data.message || 'Signup failed',
//         };
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: 'Network error. Please try again.',
//       };
//     }
//   }

//   async validateToken(): Promise<AuthResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/validate`, {
//         method: 'GET',
//         headers: this.getHeaders(),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         return {
//           success: true,
//           user: data.user,
//         };
//       } else {
//         localStorage.removeItem('auth_token');
//         return {
//           success: false,
//           error: 'Token invalid',
//         };
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: 'Network error',
//       };
//     }
//   }

//   logout() {
//     localStorage.removeItem('auth_token');
//     localStorage.removeItem('auth_user');
//   }
// }

// export const authService = new AuthService();