"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-4xl" role="img" aria-label="leaf">
            🌿
          </span>
          <h1 className="mt-3 text-2xl font-semibold text-sage-700">
            Libby&apos;s Board
          </h1>
          <p className="mt-1 text-sm text-warm-400">
            Sign in to manage your tasks
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-warm-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-medium text-warm-500"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="drrhee@lioradermatology.com"
              required
              className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm focus:border-sage-500 focus:ring-1 focus:ring-sage-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-medium text-warm-500"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm focus:border-sage-500 focus:ring-1 focus:ring-sage-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="mb-3 text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sage-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-600 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
