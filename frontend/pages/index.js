// Home Page - Redirects user based on login status
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (token) {
      // Already logged in - go to dashboard
      router.push('/dashboard');
    } else {
      // Not logged in - go to login page
      router.push('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
        <p className="text-gray-600 mt-2">Please wait</p>
      </div>
    </div>
  );
}