import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3001/auth/signUp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            console.log(data);
            setLoading(false);
            console.log(formData);

            if (data.error) {
                setError(data.error);
                return;
            }
            navigate('/signIn');
        } catch (error) {
            setLoading(false);
            setError("Server Error");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#111B21] text-white p-6">
            <div className="w-full max-w-lg bg-[#202C33] p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        id="username"
                        className="bg-[#2A3942] p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        className="bg-[#2A3942] p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        className="bg-[#2A3942] p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                        onChange={handleChange}
                    />
                    <button
                        className="bg-[#25D366] hover:bg-[#1EBE5C] text-white p-3 rounded-lg uppercase font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-70"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Sign Up'}
                    </button>
                </form>
                <div className="flex gap-2 mt-4 justify-center">
                    <p className="text-gray-400">Have an account?</p>
                    <Link to="/signIn">
                        <span className="text-[#25D366] hover:underline">Sign In</span>
                    </Link>
                </div>
                {error && (
                    <div className="text-red-400 mt-4 animate-fade-in text-center">
                        {error || 'Something went wrong!'}
                    </div>
                )}
            </div>
        </div>
    );
}