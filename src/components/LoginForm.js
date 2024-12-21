import { useState } from 'react';

export default function LoginForm({ onSubmit, error, setShowForgotPasswordModal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-[#6a5d5e]">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d76d77]"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-[#6a5d5e]">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d76d77]"
          placeholder="Enter your password"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm text-[#6a5d5e]">
          <input type="checkbox" className="mr-2" /> Remember me
        </label>
        <button
          type="button"
          className="text-sm text-[#d76d77] hover:text-[#a34c4f]"
          onClick={() => setShowForgotPasswordModal(true)}
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-[#d76d77] text-white p-3 rounded-md hover:bg-[#a34c4f] focus:outline-none focus:ring-2 focus:ring-[#d76d77]"
      >
        Log In
      </button>

      <p className="mt-4 text-center text-sm text-[#6a5d5e]">
        Don’t have an account?{' '}
        <a href="/signup" className="text-[#d76d77] hover:text-[#a34c4f]">Sign up</a>
      </p>
    </form>
  );
}
