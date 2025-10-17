"use client";

import { Login } from "@/components/login";
import { MainDashboard } from "@/components/main-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// page.tsx — Home route (client)
// This file contains a very simple mock authentication flow used for demo.
// Comments are added to explain each piece so you can follow step-by-step.
// ---------------------------------------------------------------------------

// Mock user object used to simulate a logged-in user.
// In a real application this would come from an auth API (Firebase, NextAuth, etc.).
const MOCK_USER = {
  uid: "mock-user-id",
  displayName: "Demo User",
  email: "demo@example.com",
  photoURL: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
};

export default function Home() {
  // user: holds the logged-in user object or null
  const [user, setUser] = useState<any>(null);

  // loading: shows a skeleton loader while checking session or during login/logout
  const [loading, setLoading] = useState(true);

  // useEffect runs once on mount to check for a stored session in sessionStorage.
  // This simulates restoring a session on page load.
  useEffect(() => {
    const session = sessionStorage.getItem("user-session");
    if (session) {
      // If session exists, parse and set the user
      setUser(JSON.parse(session));
    }

    // Small delay to show the skeleton. Remove or shorten in production.
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // handleLogin: called when Login component signals success (onLogin prop)
  // We simulate an API call here by setting sessionStorage and updating state.
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem("user-session", JSON.stringify(MOCK_USER));
      setUser(MOCK_USER);
      setLoading(false);
    }, 500);
  };

  // handleLogout: clears the session and returns to the login screen.
  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      sessionStorage.removeItem("user-session");
      setUser(null);
      setLoading(false);
    }, 500);
  };

  // Render a skeleton loader while 'loading' is true
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* large avatar skeleton */}
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            {/* two text lines skeleton */}
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  // If user exists, show the dashboard and pass a logout handler
  if (user) {
    return <MainDashboard user={user} onLogout={handleLogout} />;
  }

  // Otherwise render the Login component and pass the onLogin callback
  return <Login onLogin={handleLogin} />;
}
