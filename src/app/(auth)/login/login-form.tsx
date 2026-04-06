"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "../../../lib/supabase/browser";

type LoginFormProps = {
  nextPath?: string;
};

type AuthMode = "login" | "signup";

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  function switchMode(newMode: AuthMode) {
    setMode(newMode);
    setError(null);
    setPassword("");
    setConfirmPassword("");
    setSignupSuccess(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    // Validate
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setPending(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();

      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          setPending(false);
          return;
        }

        // Redirect after successful login
        window.location.href = nextPath || "/dashboard";
      } else {
        // Sign up
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(nextPath || "/setup")}`,
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setPending(false);
          return;
        }

        setSignupSuccess(true);
        setPending(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      if (message.includes("NEXT_PUBLIC_SUPABASE")) {
        setError("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.");
      } else {
        setError(message);
      }
      setPending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="space-y-2">
        <p
          className="text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "var(--accent-electric)" }}
        >
          {mode === "login" ? "Sign in" : "Create account"}
        </p>
        <h2
          className="text-2xl font-bold tracking-tight font-display"
          style={{ color: "var(--text-primary)" }}
        >
          {mode === "login" ? "Welcome back" : "Join Gym Growth OS"}
        </h2>
        <p className="text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
          {mode === "login"
            ? "Enter your email and password to access your workspace."
            : "Create a new account to get started with your gym."}
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="auth-tabs">
        <button
          type="button"
          className={`auth-tab ${mode === "login" ? "auth-tab-active" : ""}`}
          onClick={() => switchMode("login")}
        >
          Log In
        </button>
        <button
          type="button"
          className={`auth-tab ${mode === "signup" ? "auth-tab-active" : ""}`}
          onClick={() => switchMode("signup")}
        >
          Sign Up
        </button>
      </div>

      {!signupSuccess && (
        <>
          {/* Email Field */}
          <label className="block space-y-2">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Email address
            </span>
            <input
              aria-label="Email address"
              autoComplete="email"
              className="input-glass h-12"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </label>

          {/* Password Field */}
          <label className="block space-y-2">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Password
            </span>
            <div className="password-field">
              <input
                aria-label="Password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="input-glass h-12 password-input"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder={mode === "login" ? "Enter your password" : "Create a password (min 6 chars)"}
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  /* Eye-off icon */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  /* Eye icon */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          {/* Confirm Password (Sign Up only) */}
          {mode === "signup" && (
            <label className="block space-y-2">
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Confirm Password
              </span>
              <div className="password-field">
                <input
                  aria-label="Confirm password"
                  autoComplete="new-password"
                  className="input-glass h-12 password-input"
                  name="confirmPassword"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </label>
          )}

          {/* Error Alert */}
          {error ? (
            <p
              className="rounded-xl px-4 py-3 text-sm"
              role="alert"
              style={{
                background: "rgba(255, 0, 110, 0.1)",
                color: "var(--accent-red)",
                border: "1px solid rgba(255, 0, 110, 0.2)",
              }}
            >
              {error}
            </p>
          ) : null}

          {/* Submit Button */}
          <button className="btn-primary w-full h-12 text-base" disabled={pending} type="submit">
            {pending
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </>
      )}

      {/* Sign-up success message */}
      {signupSuccess && (
        <div
          className="rounded-xl px-4 py-6 text-center text-sm"
          role="alert"
          style={{
            background: "rgba(56, 189, 248, 0.1)",
            color: "var(--text-primary)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
          }}
        >
          <span className="block text-2xl mb-2">🎉</span>
          <p className="font-semibold text-lg mb-1" style={{ color: "var(--accent-cyan)" }}>
            Account created!
          </p>
          <p style={{ color: "var(--text-secondary)" }}>
            Check your email at <strong>{email}</strong> to confirm your account, then come back and log in.
          </p>
          <button
            type="button"
            className="btn-primary mt-4 h-10 text-sm"
            onClick={() => switchMode("login")}
          >
            Go to Login
          </button>
        </div>
      )}
    </form>
  );
}
