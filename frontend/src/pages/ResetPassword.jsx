import { useState } from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react";

import api from "../services/api";
import AuthLayout from "../components/AuthLayout";


function ResetPassword() {
  const [searchParams] =
    useSearchParams();

  const navigate =
    useNavigate();


  const token =
    searchParams.get(
      "token"
    );


  const [
    newPassword,
    setNewPassword,
  ] = useState("");


  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


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


      if (!token) {
        setError(
          "This password reset link is invalid."
        );

        return;
      }


      if (
        newPassword.length <
        6
      ) {
        setError(
          "Password must be at least 6 characters."
        );

        return;
      }


      if (
        newPassword !==
        confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );

        return;
      }


      setLoading(true);


      try {
        const response =
          await api.post(
            "/auth/reset-password",
            {
              token,
              newPassword,
            }
          );


        setMessage(
          response.data.message
        );


        setNewPassword("");
        setConfirmPassword("");


        setTimeout(() => {
          navigate("/login");
        }, 2000);

      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Unable to reset password."
        );

      } finally {
        setLoading(false);
      }
    };


  return (
    <AuthLayout
      title="Create a new password"
      subtitle="Enter and confirm your new GaariCheck password below."
    >

      {!token && (

        <div className="mb-5 bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm leading-6">

          Invalid password reset link.

        </div>
      )}


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


      {token && (

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <PasswordField
            label="New Password"
            value={
              newPassword
            }
            setValue={
              setNewPassword
            }
            showPassword={
              showPassword
            }
            setShowPassword={
              setShowPassword
            }
          />


          <div>

            <label className="block text-sm font-semibold text-[#0b1220] mb-2">

              Confirm New Password

            </label>


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
                value={
                  confirmPassword
                }
                onChange={(e) => {
                  setConfirmPassword(
                    e.target.value
                  );

                  if (error) {
                    setError("");
                  }
                }}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Repeat new password"
                className="w-full min-h-12 pl-11 pr-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
              />

            </div>

          </div>


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

                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}

          </button>

        </form>
      )}


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


/* =====================================
   PASSWORD FIELD
===================================== */

function PasswordField({
  label,
  value,
  setValue,
  showPassword,
  setShowPassword,
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-[#0b1220] mb-2">

        {label}

      </label>


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
          value={value}
          onChange={(e) =>
            setValue(
              e.target.value
            )
          }
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Minimum 6 characters"
          className="w-full min-h-12 pl-11 pr-14 py-3.5 text-base border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
        />


        <button
          type="button"
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition"
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
  );
}


export default ResetPassword;