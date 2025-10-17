"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "./icons";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";

// ---------------------------------------------------------------------------
// Login component (client)
// This component renders a simple sign-in / sign-up form used for demo.
// It uses `useToast` to show messages and calls `onLogin` when sign-in succeeds.
// Comments explain where to plug real auth logic (API call or NextAuth).
// ---------------------------------------------------------------------------

type AuthMode = "signin" | "signup";

export function Login({ onLogin }: { onLogin: () => void }) {
  // Form state
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demopassword");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const { toast } = useToast();

  // handleAuthAction: called on form submit
  // Replace the simulated timeout with a real API call (fetch/axios) when ready.
  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please enter both email and password.",
      });
      return;
    }
    setLoading(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      if (authMode === "signup") {
        // Mock: show toast and switch to signin mode
        toast({
          title: "Account Created (Mock)",
          description: "You have successfully signed up! You can now sign in.",
        });
        setAuthMode("signin"); // Switch to signin mode after successful signup
        setLoading(false);
      } else {
        // In signin mode, call the parent's onLogin function
        // In a real app you'd verify credentials and receive a token/session
        onLogin();
      }
    }, 1000);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 text-card-foreground shadow">
        {/* Logo and title */}
        <div className="flex flex-col items-center gap-4">
          <Icons.logo className="h-12 w-12 text-primary" />
          <div className="text-center">
            <h1 className="font-headline text-3xl font-bold">Info Stream AI</h1>
            <p className="text-muted-foreground">Your AI-powered study assistant.</p>
          </div>
        </div>

        {/* Form: replace with react-hook-form + zod for production */}
        <form onSubmit={handleAuthAction} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : authMode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        {/* Toggle between Sign In / Sign Up */}
        <div className="mt-6 text-center text-sm">
          {authMode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <Button variant="link" className="p-0 h-auto" onClick={toggleAuthMode} disabled={loading}>
            {authMode === "signin" ? "Sign Up" : "Sign In"}
          </Button>
        </div>
      </div>
    </div>
  );
}
