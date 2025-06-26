import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

// Add interface for user with password (for internal storage)
interface UserWithPassword extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin email - you can modify this or make it configurable
const ADMIN_EMAIL = 'chadgigaa404@gmail.com';


// Mock user database - properly typed to include password
const mockUsers: UserWithPassword[] = [
  { id: '1', email: ADMIN_EMAIL, password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: '2', email: 'pandeykritika2059518@gmail.com', password: 'user123', name: 'Regular User', role: 'user' },
  { id: '3', email: 'Aryal.rebanta@gmail.com', password: 'admin456', name: 'Admin User 2', role: 'admin' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - replace with actual API call
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      };
      
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setLoading(false);
      return { success: false, error: 'User with this email already exists' };
    }
    
    // Determine role based on email
    const role: 'user' | 'admin' = email === ADMIN_EMAIL ? 'admin' : 'user';
    
    // Create new user with password for storage
    const newUserWithPassword: UserWithPassword = {
      id: Date.now().toString(),
      email,
      name,
      role,
      password
    };
    
    // Add to mock database (in real app, this would be an API call)
    mockUsers.push(newUserWithPassword);
    
    // Create user object without password for state/localStorage
    const newUser: User = {
      id: newUserWithPassword.id,
      email: newUserWithPassword.email,
      name: newUserWithPassword.name,
      role: newUserWithPassword.role
    };
    
    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};