import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            // Check if we got a response at all
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Login failed. Please check your credentials.');
            }

            const data = await response.json();

            if (data.success && data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            // More specific error message based on error type
            if (error.message.includes('Failed to fetch')) {
                setError('Cannot connect to the server. Please make sure the backend is running.');
            } else {
                setError(error.message || 'Failed to login. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            {/* Dark teal mesh background pattern */}
            <div className="absolute inset-0 overflow-hidden opacity-40">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #00C0BB 1px, transparent 1px), linear-gradient(to bottom, #00C0BB 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        maskImage: 'linear-gradient(45deg, black 25%, transparent 25%, transparent 50%, black 50%, black 75%, transparent 75%, transparent)',
                        WebkitMaskImage: 'linear-gradient(45deg, black 25%, transparent 25%, transparent 50%, black 50%, black 75%, transparent 75%, transparent)',
                        maskSize: '10px 40px',
                        WebkitMaskSize: '100px 40px'
                    }}
                />
            </div>
            <div className="absolute inset-0 bg-linear-to-br from-teal-[#580ce0] to-cyan-900/40" />

            <div className="w-full max-w-md z-10">
                <div className="bg-[#11224E] rounded-xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                        <p className="text-white ">To <b className='text-[#9B5DE0]'>Hostel MS</b></p>
                        <p className="text-white">Please enter your credentials to login</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error message */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className={`h-5 w-5 ${formData.email ? 'text-blue-400' : 'text-white'} transition-colors duration-200`} />
                            </div>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pt-4 pb-2 pl-10 pr-4 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none text-white"
                                required
                            />
                            <label
                                className={`absolute left-2 -top-2.5 px-2 transition-all duration-200 pointer-events-none ${formData.email ? 'text-xs bg-[#430ba2] text-white' : 'text-sm bg-transparent top-1/2 -translate-y-1/2 left-10 text-white/70'}`}
                            >
                                Email
                            </label>
                        </div>

                        {/* Password Field */}

                        <div className="relative group mt-6">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className={`h-5 w-5 ${formData.password ? 'text-blue-400' : 'text-white'} transition-colors duration-200`} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pt-4 pb-2 pl-10 pr-12 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-white"
                                required
                            />
                            <label
                                className={`absolute left-2 -top-2.5 px-2 transition-all duration-200 pointer-events-none ${formData.password ? 'text-xs bg-[#420f99] text-white' : 'text-sm bg-transparent top-1/2 -translate-y-1/2 left-10 text-white/70'}`}
                            >
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white hover:text-white"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="h-5 w-5 cursor-pointer" />
                                ) : (
                                    <FaEye className="h-5 w-5 cursor-pointer" />
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <span className="ml-2 text-sm text-white">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-white hover:text-white">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            className={`w-full flex items-center justify-center gap-2 bg-[#9B5DE0] hover:bg-[#D78FEE] cursor-pointer text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin h-5 w-5" />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>


                </div>
            </div>
        </div>
    );
};

export default Login;
