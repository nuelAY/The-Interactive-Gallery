// client/components/LoginSignupForm.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login, signup } from '../store/authSlice';
import { RootState, AppDispatch } from '../store';
import { toast } from 'react-hot-toast';

const LoginSignupForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loading, error, user } = useSelector((state: RootState) => state.auth);

    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const loadingToast = toast.loading(isSignup ? 'Signing up...' : 'Logging in...');

        try {
            if (isSignup) {
                await dispatch(signup(form)).unwrap();
                toast.success('Signup successful!');
            } else {
                await dispatch(login({ email: form.email, password: form.password })).unwrap();
                toast.success('Login successful!');
            }
            router.push('/GalleryPage');
        } catch (err: any) {
            toast.error(err?.message || 'Authentication failed');
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">{isSignup ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? 'Submitting...' : isSignup ? 'Sign Up' : 'Login'}
                </button>
            </form>

            {error && <p className="text-red-600 mt-2">{error}</p>}

            <p className="mt-4 text-sm">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button className="text-blue-600" onClick={() => setIsSignup(!isSignup)}>
                    {isSignup ? 'Login' : 'Sign Up'}
                </button>
            </p>
        </div>
    );
};

export default LoginSignupForm;
