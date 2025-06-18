'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function DebugPage() {
  const { user, loading, signOut } = useAuth();
  const [cookies, setCookies] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get all cookies
    const allCookies = Cookies.get();
    setCookies(allCookies);
  }, []);

  const clearAllCookies = () => {
    Object.keys(cookies).forEach(cookieName => {
      Cookies.remove(cookieName);
    });
    setCookies({});
    signOut();
  };

  const clearUserIdCookie = () => {
    Cookies.remove('userId');
    setCookies(Cookies.get());
    signOut();
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication State */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Authentication State</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? 'Logged In' : 'Not Logged In'}</p>
            {user && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Onboarded:</strong> {user.onboarded ? 'Yes' : 'No'}</p>
                <p><strong>Language:</strong> {user.language}</p>
                <p><strong>Dark Mode:</strong> {user.darkMode ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Cookies</h2>
          <div className="space-y-2">
            {Object.keys(cookies).length === 0 ? (
              <p className="text-gray-500">No cookies found</p>
            ) : (
              Object.entries(cookies).map(([name, value]) => (
                <div key={name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm">{name}</span>
                  <span className="font-mono text-sm text-gray-600">{value}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-3">
            <button
              onClick={clearUserIdCookie}
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
            >
              Clear userId Cookie
            </button>
            <button
              onClick={clearAllCookies}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Clear All Cookies
            </button>
            <button
              onClick={signOut}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="space-y-3">
            <a
              href="/auth/login"
              className="block w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-center"
            >
              Go to Login
            </a>
            <a
              href="/auth/register"
              className="block w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors text-center"
            >
              Go to Register
            </a>
            <a
              href="/dashboard"
              className="block w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-center"
            >
              Go to Dashboard
            </a>
            <a
              href="/onboarding"
              className="block w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors text-center"
            >
              Go to Onboarding
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting</h3>
        <ul className="text-yellow-700 space-y-1 text-sm">
          <li>• If you're stuck in a redirect loop, try clearing all cookies</li>
          <li>• If you can't access protected pages, make sure you're logged in</li>
          <li>• If you can't log out, use the "Clear All Cookies" button</li>
          <li>• Check the browser console for any error messages</li>
          <li>• If onboarding keeps repeating, check the "Onboarded" status above</li>
        </ul>
      </div>
    </div>
  );
} 