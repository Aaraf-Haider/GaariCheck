import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  User,
} from "lucide-react";

import api from "../services/api";
import AuthLayout from "../components/AuthLayout";


function Register() {
  const navigate =
    useNavigate();


  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });


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

      setMessage("");
      setError("");


      if (
        formData.password !==
        formData.confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );

        return;
      }


      if (
        formData.password.length <
        6
      ) {
        setError(
          "Password must be at least 6 characters."
        );

        return;
      }


      setLoading(true);


      try {
        const response =
          await api.post(
            "/auth/register",
            {
              name:
                formData.name,

              email:
                formData.email,

              phone:
                formData.phone,

              password:
                formData.password,
            }
          );


        setMessage(
          response.data.message ||
          "Account created successfully."
        );


        setTimeout(() => {
          navigate("/login");
        }, 1500);

      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Unable to create account."
        );

      } finally {
        setLoading(false);
      }
    };


  return (
    <AuthLayout
      title="Create your account"
      subtitle="Create a GaariCheck account to purchase inspections, upload vehicle media and access reports."
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
        className="space-y-4 sm:space-y-5"
      >

        <InputField
          icon={
            <User size={18} />
          }
          label="Full Name"
          name="name"
          type="text"
          placeholder="Your full name"
          value={
            formData.name
          }
          onChange={
            handleChange
          }
          autoComplete="name"
        />


        <InputField
          icon={
            <Mail size={18} />
          }
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={
            formData.email
          }
          onChange={
            handleChange
          }
          autoComplete="email"
        />


        <InputField
          icon={
            <Phone size={18} />
          }
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="03XX XXXXXXX"
          value={
            formData.phone
          }
          onChange={
            handleChange
          }
          autoComplete="tel"
        />


        {/* PASSWORD */}

        <div>

          <label className="block text-sm font-semibold text-[#0b1220] mb-2">
            Password
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
              name="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              required
              minLength={6}
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


          <p className="text-xs text-gray-400 mt-2">
            Minimum 6 characters.
          </p>

        </div>


        <InputField
          icon={
            <LockKeyhole
              size={18}
            />
          }
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          value={
            formData.confirmPassword
          }
          onChange={
            handleChange
          }
          autoComplete="new-password"
        />


        <button
          type="submit"
          disabled={loading}
          className="gc-btn-primary w-full min-h-12 py-3.5 mt-2 gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >

          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Creating Account...
            </>
          ) : (
            "Create Account"
          )}

        </button>

      </form>


      <p className="text-center text-sm text-gray-500 mt-6 leading-6">

        Already have an account?{" "}

        <Link
          to="/login"
          className="font-bold text-orange-600 hover:text-orange-700"
        >
          Login
        </Link>

      </p>

    </AuthLayout>
  );
}


/* =====================================
   INPUT
===================================== */

function InputField({
  icon,
  label,
  ...props
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-[#0b1220] mb-2">

        {label}

      </label>


      <div className="relative">

        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">

          {icon}

        </div>


        <input
          {...props}
          required
          className="w-full min-h-12 pl-11 pr-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
        />

      </div>

    </div>
  );
}


export default Register;