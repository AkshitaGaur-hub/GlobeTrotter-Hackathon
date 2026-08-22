import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Mail, Lock, ArrowRight, AlertCircle, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, fillDemoAccount } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in. Please verify your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await fillDemoAccount();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Demo login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white mx-auto mb-3">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to GlobeTrotter
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access your adaptive AI travel itineraries
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickDemo}
          disabled={isSubmitting}
          className="w-full mb-5 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-300/80 text-xs font-bold transition-all duration-200 active:scale-95 group shadow-sm"
        >
          <Zap className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          <span>⚡ Instant 1-Click Demo Sign In (demo@globetrotter.app)</span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase">or sign in with email</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <span
                onClick={() => alert("Password reset is not available in the hackathon demo.")}
                className="text-[11px] text-brand-600 hover:underline cursor-pointer font-medium"
              >
                Forgot Password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-brand-600 font-bold hover:underline">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}
