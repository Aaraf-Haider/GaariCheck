import { Link } from "react-router-dom";

import {
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";


function AuthLayout({
  children,
  title,
  subtitle,
}) {
  return (
    <main className="min-h-screen bg-[#f5f7fa]">

      <div className="grid lg:grid-cols-2 min-h-screen">


        {/* =====================================
            LEFT DESKTOP HERO
        ===================================== */}

        <div className="hidden lg:flex relative bg-[#0b1220] overflow-hidden">


          {/* BACKGROUND IMAGE */}

          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85"
            alt="Vehicle inspection"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />


          {/* OVERLAY */}

          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220]/95 via-[#0b1220]/85 to-[#0b1220]/55" />


          {/* DECORATIVE GLOW */}

          <div className="absolute -top-32 -left-32 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />

          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />


          {/* CONTENT */}

          <div className="relative z-10 flex flex-col justify-between p-10 xl:p-16 w-full">


            {/* BRAND */}

            <Link
                to="/"
                className="inline-flex self-start"
                aria-label="GaariCheck Home"
                >

                <div className="w-[190px] h-[56px] bg-white rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-black/10">

                    <img
                    src="/gaaricheck-logo.png"
                    alt="GaariCheck Vehicle Inspection"
                    className="w-full h-full object-contain scale-[1.18]"
                    />

                </div>

            </Link>

            {/* HERO CONTENT */}

            <div className="max-w-lg py-10">

              <div className="inline-flex items-center gap-2 text-orange-400 uppercase tracking-wider font-bold text-xs">

                <ShieldCheck
                  size={16}
                />

                Vehicle Confidence

              </div>


              <h2 className="text-white text-4xl xl:text-5xl font-black leading-[1.1] mt-4">

                Know more about the car before you move forward.

              </h2>


              <p className="text-slate-300 leading-7 mt-5">

                Submit vehicle information,
                upload guided photos and videos,
                and receive your human-reviewed
                digital inspection report.

              </p>


              <div className="space-y-4 mt-8">

                <Benefit
                  icon={
                    <ShieldCheck
                      size={19}
                    />
                  }
                  text="Secure customer dashboard"
                />


                <Benefit
                  icon={
                    <CheckCircle2
                      size={19}
                    />
                  }
                  text="Structured remote inspection process"
                />


                <Benefit
                  icon={
                    <FileCheck2
                      size={19}
                    />
                  }
                  text="Digital inspection reports"
                />

              </div>


              {/* SERVICE NOTE */}

              <div className="mt-9 border-t border-white/10 pt-6">

                <p className="text-xs text-slate-400 leading-6 max-w-md">

                  GaariCheck provides a remote
                  visual review based on vehicle
                  information, photos and videos
                  submitted by the customer.

                </p>

              </div>

            </div>


            {/* COPYRIGHT */}

            <div className="flex items-center justify-between gap-4 text-xs text-slate-500">

              <span>
                © {new Date().getFullYear()} GaariCheck
              </span>


              <span>
                Human Reviewed
              </span>

            </div>

          </div>

        </div>


        {/* =====================================
            RIGHT AUTH SIDE
        ===================================== */}

        <div className="relative flex items-start lg:items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-10 lg:py-12 overflow-hidden">


          {/* MOBILE BACKGROUND DETAILS */}

          <div className="lg:hidden absolute top-0 left-0 right-0 h-48 bg-[#0b1220]" />

          <div className="lg:hidden absolute top-20 -right-24 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl" />


          <div className="relative z-10 w-full max-w-md">


            {/* =====================================
                MOBILE BRAND
            ===================================== */}

            <div className="lg:hidden flex items-center justify-between mb-7 sm:mb-9">

              <Link
                to="/"
                className="inline-flex items-center"
                aria-label="GaariCheck Home"
                >

                <div className="w-[145px] sm:w-[165px] h-[46px] sm:h-[50px] bg-white rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-black/10">
                <img
                    src="/gaaricheck-logo.png"
                    alt="GaariCheck Vehicle Inspection"
                    className="w-full h-full object-contain scale-[1.18]"
                    />
                </div>

             </Link>

              <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-semibold">

                <ShieldCheck
                  size={14}
                />

                Human Reviewed

              </div>

            </div>


            {/* =====================================
                AUTH CARD
            ===================================== */}

            <div className="bg-white border border-gray-200 shadow-xl shadow-black/5 rounded-[22px] sm:rounded-[26px] overflow-hidden">


              {/* CARD HEADING */}

              <div className="px-5 sm:px-7 md:px-8 pt-6 sm:pt-8">

                <div className="hidden lg:flex items-center gap-2 text-orange-600 text-xs uppercase tracking-wider font-bold mb-3">

                  <ShieldCheck
                    size={15}
                  />

                  GaariCheck Account

                </div>


                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0b1220] leading-tight">

                  {title}

                </h1>


                <p className="text-sm sm:text-base text-gray-500 leading-6 sm:leading-7 mt-3">

                  {subtitle}

                </p>

              </div>


              {/* FORM CONTENT */}

              <div className="px-5 sm:px-7 md:px-8 pt-6 pb-6 sm:pb-8">

                {children}

              </div>

            </div>


            {/* =====================================
                MOBILE TRUST NOTE
            ===================================== */}

            <div className="lg:hidden mt-5">

              <div className="flex items-start gap-2.5 px-2">

                <ShieldCheck
                  size={16}
                  className="text-green-600 shrink-0 mt-0.5"
                />


                <p className="text-[11px] sm:text-xs text-gray-500 leading-5">

                  GaariCheck performs a remote
                  visual review using the vehicle
                  information and media submitted
                  by the customer.

                </p>

              </div>

            </div>


            {/* MOBILE COPYRIGHT */}

            <div className="lg:hidden text-center text-[11px] text-gray-400 mt-6 pb-2">

              © {new Date().getFullYear()} GaariCheck

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}


/* =====================================
   BENEFIT
===================================== */

function Benefit({
  icon,
  text,
}) {
  return (
    <div className="flex items-center gap-3 text-slate-300">

      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/5 text-green-400 flex items-center justify-center shrink-0">

        {icon}

      </div>


      <span className="text-sm leading-6">

        {text}

      </span>

    </div>
  );
}


export default AuthLayout;