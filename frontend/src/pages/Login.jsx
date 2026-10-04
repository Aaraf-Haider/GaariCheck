import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";

import api from "../services/api";
import AuthLayout from "../components/AuthLayout";


function Login() {
  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

    if (error) {
      setError("");
    }
  };


  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");
      setLoading(true);

      try {
        const response =
          await api.post(
            "/auth/login",
            formData
          );


        localStorage.setItem(
          "token",
          response.data.token
        );


        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );


        if (
          response.data.user
            .role === "admin"
        ) {
          window.location.href =
            "/admin";
        } else {
          window.location.href =
            "/dashboard";
        }

      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Unable to login. Please check your details."
        );

      } finally {
        setLoading(false);
      }
    };


  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to manage your inspections and access your vehicle reports."
    >

      {error && (
        <div className="mb-5 bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm leading-6">
          {error}
        </div>
      )}


      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* EMAIL */}

        <div>

          <label className="block text-sm font-semibold text-[#0b1220] mb-2">
            Email Address
          </label>


          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />


            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full min-h-12 pl-11 pr-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
            />

          </div>

        </div>


        {/* PASSWORD */}

        <div>

          <div className="flex items-center justify-between gap-3 mb-2">

            <label className="text-sm font-semibold text-[#0b1220]">
              Password
            </label>


            <Link
              to="/forgot-password"
              className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 whitespace-nowrap"
            >
              Forgot password?
            </Link>

          </div>


          <div className="relative">

            <LockKeyhole
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />


            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full min-h-12 pl-11 pr-14 py-3.5 text-base border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
            />


            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >

              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}

            </button>

          </div>

        </div>


        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="gc-btn-primary w-full min-h-12 py-3.5 gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >

          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Logging in...
            </>
          ) : (
            "Login to GaariCheck"
          )}

        </button>

      </form>


      <div className="relative my-7">

        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>


        <div className="relative flex justify-center">

          <span className="bg-white px-3 sm:px-4 text-[11px] sm:text-xs uppercase tracking-wide text-gray-400 text-center">
            New to GaariCheck?
          </span>

        </div>

      </div>


      <Link
        to="/register"
        className="w-full min-h-12 inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-200 text-[#0b1220] font-bold hover:border-orange-300 hover:bg-orange-50/30 transition"
      >
        Create an Account
      </Link>

    </AuthLayout>
  );
}


export default Login;