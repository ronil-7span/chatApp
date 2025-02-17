import React from "react";
import { Link } from "react-router-dom";

export default function Base() {

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0d3b2a] to-[#1a5c40] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d3b2a] to-[#1a5c40] animate-gradient-x"></div>

            <div className="text-center px-6 relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                    Chat App
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-6 animate-fade-in animate-delay-200">
                    Chat with your Network or Friends 😊
                </p>
                <Link to="/signin">
                    <button className="px-6 py-3 text-lg bg-[#2ecc71] hover:bg-[#27ae60] rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-fade-in animate-delay-400">
                        Login to Access
                    </button>
                </Link>
            </div>
        </div>
    );
}