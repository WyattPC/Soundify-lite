import React from 'react';

export default function LoginPage() {
  // Backend login endpoint
  const handleLogin = () => {
    window.location.href = 'https://127.0.0.1:8888/login';
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to Soundify Lite</h1>
      <p className="mb-8 text-lg">Sign in with your Spotify account to get started.</p>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-xl font-semibold shadow-lg transition-colors duration-200"
      >
        Login with Spotify
      </button>
    </div>
  );
}  