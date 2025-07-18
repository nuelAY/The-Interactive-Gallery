'use client';

// This is the login and sign forms merge into one but can be navigated through when necessary

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login, signup } from '../store/authSlice';
import { RootState, AppDispatch } from '../store';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginSignupForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, password } = form;

    // Trimmed fields
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    // Validation logic
    if (!trimmedEmail || !trimmedPassword || (isSignup && !trimmedName)) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Password length validation
    if (trimmedPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    const loadingToast = toast.loading(isSignup ? 'Signing up...' : 'Logging in...');

    try {
      if (isSignup) {
        await dispatch(signup({ name: trimmedName, email: trimmedEmail, password: trimmedPassword })).unwrap();
        toast.success('Signup successful!');
      } else {
        await dispatch(login({ email: trimmedEmail, password: trimmedPassword })).unwrap();
        toast.success('Login successful!');
      }

      router.push('/gallery');
    } catch (err: any) {
      toast.error(err?.message || 'Invalid credentials. Please try again.');
    } finally {
      toast.dismiss(loadingToast);
    }
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          {isSignup ? 'Create an Account' : 'Welcome Back'}
        </h2>


        {/* The form including both authentication, login and signup */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <div>
              <label className="block mb-1 text-sm font-medium dark:text-gray-300">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full p-3 border rounded-lg dark:bg-[#2a2a2a] dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm font-medium dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full p-3 border rounded-lg dark:bg-[#2a2a2a] dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium dark:text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-3 pr-10 border rounded-lg dark:bg-[#2a2a2a] dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 focus:outline-none mt-2"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>


          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-lg font-semibold transition-all ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading && <FiLoader className="animate-spin text-xl" />}
            {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline font-medium"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginSignupForm;
