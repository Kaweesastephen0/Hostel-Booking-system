import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'manager' // Default role
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
            const API_URL ='http://localhost:5000';
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Redirect to login page on successful registration
            navigate('/login', { state: { registered: true } });
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
                    <p className="text-gray-600 mt-2">Join us today and get started</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Full Name Input */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9B5DE0] focus:border-transparent"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9B5DE0] focus:border-transparent"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                minLength="6"
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9B5DE0] focus:border-transparent"
                                placeholder="Create a password"
                            />
                            <div 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Password must be at least 6 characters long
                        </p>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9B5DE0] focus:border-transparent"
                        >
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className={`w-full flex items-center justify-center gap-2 bg-[#9B5DE0] hover:bg-[#7B3DBF] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-[#9B5DE0] hover:text-[#7B3DBF]">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
