import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface LoginFormProps {
  onLogin: (userData: any) => void;
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-blue-100">Sign in to your account</p>
            </div>

            <div className="flex items-center justify-center bg-gray-50 px-4">
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
                <h2 className="text-2xl font-bold text-center">Sign In</h2>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="text-center text-sm mt-4">
                  Don’t have an account?{' '}
                  <button type="button" onClick={onSwitchToSignup} className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Sign up
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/2 hidden md:flex items-center justify-center p-4">
        <div className="relative h-[760px] w-full rounded-2xl overflow-hidden shadow-lg">
          <img
            src="https://thumbs.dreamstime.com/b/glowing-human-brain-dark-purple-neon-vertical-background-artificial-intelligence-futuristic-style-ai-generative-glowing-human-294095516.jpg"
            alt="Login Visual"
            className="object-cover w-full h-full rounded-2xl"
          />
          <div className="absolute inset-0 bg-black/40 flex items-start justify-center p-6">
            <h2 className="text-white text-4xl md:text-5xl font-bold text-center px-4">
              Content Generator App
            </h2>
          </div>
        </div>
      </div>
    </div>
);
};

export default LoginForm;
