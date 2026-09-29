import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await api.login(email, password);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || "Failed to login");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Platform Login</h1>
                    <p className="text-slate-500 mt-2">Sign in to monitor projects</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition">
                        Log In
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-200">
                    <p className="text-sm text-slate-500 mb-4 font-semibold text-center">Demo Credentials</p>
                    <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-lg">
                        <div className="flex justify-between border-b pb-1">
                            <span className="font-semibold">Admin:</span>
                            <span>admin@example.com / admin123</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span className="font-semibold">Manager:</span>
                            <span>manager@example.com / manager123</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Member:</span>
                            <span>member@example.com / member123</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
