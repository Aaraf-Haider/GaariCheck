import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
} from "lucide-react";

import api from "../services/api";
import AuthLayout from "../components/AuthLayout";


function ForgotPassword() {
  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setMessage("");
      setError("");
      setLoading(true);


      try {
        const response =
          await api.post(
            "/auth/forgot-password",
            {
              email,
            }
          );


        setMessage(
          response.data.message
        );

        setEmail("");

      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Unable to send reset link."
        );

      } finally {
        setLoading(false);
      }
    };


  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your registered email address and we'll send you a secure reset link."
    >

      {message && (

        <div className="mb-5 bg-green-50 border border-green-100 text-green-700 rounded-xl p-4 text-sm leading-6 flex items-start gap-2">

          <CheckCircle2
            size={18}
            className="shrink-0 mt-0.5"
          />


          <span>
            {message}
          </span>

        </div>
      )}


      {error && (

        <div className="mb-5 bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm leading-6">

          {error}

        </div>
      )}


      <form
        onSubmit={handleSubmit}
      >

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
            value={email}
            onChange={(e) => {
              setEmail(
                e.target.value
              );

              if (error) {
                setError("");
              }
            }}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="w-full min-h-12 pl-11 pr-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
          />

        </div>


        <button
          type="submit"
          disabled={loading}
          className="gc-btn-primary w-full min-h-12 py-3.5 mt-5 gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >

          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}

        </button>

      </form>


      <div className="mt-6 pt-6 border-t border-gray-100">

        <Link
          to="/login"
          className="min-h-11 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0b1220] transition"
        >

          <ArrowLeft
            size={16}
          />

          Back to Login

        </Link>

      </div>

    </AuthLayout>
  );
}


export default ForgotPassword;