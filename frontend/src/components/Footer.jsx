import { Link } from "react-router-dom";
import {
  Mail,
  ShieldCheck,
  Car,
} from "lucide-react";

function Footer() {
  const contactEmail =
    import.meta.env.VITE_CONTACT_EMAIL;

  return (
    <footer className="bg-[#0b1220] text-white border-t border-white/10">

      <div className="gc-container py-10 sm:py-12 md:py-14">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-9 sm:gap-10">

          {/* BRAND */}
          <div className="col-span-2 lg:col-span-1">

            <Link
                to="/"
                className="inline-flex items-center"
                aria-label="GaariCheck Home"
                >
                <div className="w-[170px] sm:w-[185px] h-[52px] bg-white rounded-xl overflow-hidden flex items-center justify-center">

                    <img
                    src="/gaaricheck-logo.png"
                    alt="GaariCheck Vehicle Inspection"
                    className="w-full h-full object-contain scale-[1.18]"
                    />

                </div>
            </Link>

            <p className="text-sm text-slate-400 leading-7 mt-5 max-w-sm">
              Remote vehicle inspection through structured
              customer-submitted photos, videos and
              professional human review.
            </p>

          </div>

          {/* COMPANY */}
          <div>

            <h3 className="font-bold">
              Company
            </h3>

            <div className="space-y-3 mt-5 text-sm">

              <FooterLink
                to="/about"
                text="About Us"
              />

              <FooterLink
                to="/services"
                text="What We Do"
              />

              <FooterLink
                to="/pricing"
                text="Pricing"
              />

              <FooterLink
                to="/sample-report"
                text="Sample Report"
              />

              <FooterLink
                to="/reviews"
                text="Reviews"
              />

            </div>

          </div>

          {/* CUSTOMER */}
          <div>

            <h3 className="font-bold">
              Customer
            </h3>

            <div className="space-y-3 mt-5 text-sm">

              <FooterLink
                to="/login"
                text="Login"
              />

              <FooterLink
                to="/register"
                text="Create Account"
              />

              <FooterLink
                to="/dashboard"
                text="My Dashboard"
              />

              <FooterLink
                to="/contact"
                text="Contact Support"
              />

            </div>

          </div>

          {/* CONTACT */}
          <div className="col-span-2 lg:col-span-1">

            <h3 className="font-bold">
              Contact
            </h3>

            <div className="mt-5 space-y-4">

              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-start gap-3 text-sm text-slate-400 hover:text-white"
                >
                  <Mail
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span className="break-all">
                    {contactEmail}
                  </span>
                </a>
              )}

              <div className="flex items-start gap-3 text-sm text-slate-400">

                <ShieldCheck
                  size={17}
                  className="mt-0.5 text-green-400 shrink-0"
                />

                <span>
                  Human-reviewed remote vehicle inspections
                </span>

              </div>

              <div className="flex items-start gap-3 text-sm text-slate-400">

                <Car
                  size={17}
                  className="mt-0.5 text-orange-400 shrink-0"
                />

                <span>
                  Pakistan-focused vehicle inspection service
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 mt-9 sm:mt-12 pt-6 sm:pt-7">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} GaariCheck.
              All rights reserved.
            </p>

            <p className="text-xs text-slate-500 max-w-xl md:text-right">
              GaariCheck currently provides remote visual
              inspection based on submitted photos,
              videos and information. It does not replace
              physical workshop diagnostics.
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}


function FooterLink({
  to,
  text,
}) {
  return (
    <div>
      <Link
        to={to}
        className="text-slate-400 hover:text-orange-400 transition"
      >
        {text}
      </Link>
    </div>
  );
}

export default Footer;