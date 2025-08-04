import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import WalletConnect from "../components/WalletConnect";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnected = (address: string) => {
    setWalletAddress(address);
    console.log("Wallet connected:", address);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300/20 via-white/20 to-blue-100/10 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-8">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-600/80 rounded-full flex items-center justify-center shadow-lg">
            <LogIn className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-blue-100 mt-2">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-200 hover:underline font-medium"
            >
              Register here
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="text-sm text-white font-medium block mb-1"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-100" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm text-white font-medium block mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-100" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-blue-100 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Wallet Connect */}
          <div className="mt-4">
            <WalletConnect onWalletConnected={handleWalletConnected} />
            {walletAddress && (
              <p className="mt-2 text-xs text-green-200">
                Connected: {walletAddress}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-blue-100">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-white/40 text-blue-600"
              />
              Remember me
            </label>
            <a href="#" className="text-blue-200 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-blue-600/90 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-blue-100">
          By signing in, you agree to our{" "}
          <a href="#" className="text-blue-200 hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-200 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
