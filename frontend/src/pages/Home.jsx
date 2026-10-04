import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileCheck2,
  SearchCheck,
  ShieldCheck,
  Star,
  Upload,
  Video,
} from "lucide-react";

function Home() {
  const packages = [
    {
      name: "Basic",
      description: "Essential remote visual vehicle check.",
      features: [
        "Exterior visual review",
        "Interior visual review",
        "Uploaded photo assessment",
        "Digital inspection report",
      ],
    },
    {
      name: "Standard",
      description: "More detailed review for confident buyers.",
      popular: true,
      features: [
        "Everything in Basic",
        "Detailed body condition review",
        "Tyre & dashboard assessment",
        "Photo + video review",
        "Detailed digital report",
      ],
    },
    {
      name: "Premium",
      description: "Our most comprehensive remote inspection.",
      features: [
        "Everything in Standard",
        "Expanded visual assessment",
        "More detailed observations",
        "Priority inspection review",
        "Comprehensive report",
      ],
    },
  ];

  return (
    <main className="overflow-hidden">

      {/* HERO */}
      <section className="relative bg-[#0b1220] text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-3xl" />

          <div className="absolute bottom-0 left-0 w-[450px] h-[350px] bg-blue-500/5 blur-3xl" />
        </div>

        <div className="gc-container relative py-12 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-9 sm:gap-12 lg:gap-14 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex max-w-full items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 sm:px-4 py-2 mb-5 sm:mb-6">
                <ShieldCheck
                  size={17}
                  className="text-green-400"
                />

                <span className="text-xs sm:text-sm text-slate-300">
                  Remote Vehicle Inspection • Human Reviewed
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight">
                Know the car
                <span className="block text-orange-500">
                  before you buy it.
                </span>
              </h1>

              <p className="mt-5 sm:mt-6 max-w-xl text-base sm:text-lg text-slate-300 leading-7 sm:leading-8">
                Get a professional remote visual inspection
                using guided vehicle photos and videos.
                Our team reviews the submitted evidence and
                delivers a clear digital inspection report.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">

                <Link
                  to="/pricing"
                  className="gc-btn-primary w-full sm:w-auto gap-2 text-base"
                >
                  Get Your Car Checked
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/sample-report"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition"
                >
                  View Sample Report
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="text-green-400"
                  />
                  No workshop visit
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="text-green-400"
                  />
                  Digital report
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="text-green-400"
                  />
                  Human reviewed
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="relative">

              <div className="relative rounded-[28px] overflow-hidden border border-white/10 shadow-2xl">

                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85"
                  alt="Modern vehicle inspection"
                  className="w-full h-[300px] sm:h-[400px] lg:h-[520px] object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220]/90 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">

                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xs text-slate-300">
                          Inspection Status
                        </div>

                        <div className="font-bold text-white">
                          Vehicle Review
                        </div>
                      </div>

                      <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                        In Progress
                      </div>
                    </div>

                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-orange-500 rounded-full" />
                    </div>

                  </div>

                </div>
              </div>

              {/* Floating card */}
              <div className="hidden md:block absolute -left-8 top-16 bg-white text-[#0b1220] rounded-2xl p-4 shadow-xl w-52">

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Camera
                      size={21}
                      className="text-orange-600"
                    />
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">
                      Vehicle Media
                    </div>

                    <div className="font-bold">
                      14 Guided Views
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-white border-b border-gray-200">
        <div className="gc-container">
          <div className="grid grid-cols-2 lg:grid-cols-4">

            <div className="py-6 sm:py-7 px-3 sm:px-4 text-center border-r border-b border-gray-200 lg:border-b-0">
              <div className="font-black text-xl sm:text-2xl text-[#0b1220]">
                Remote
              </div>
              <div className="text-sm text-gray-500 mt-1">
                No workshop required
              </div>
            </div>

            <div className="py-6 sm:py-7 px-3 sm:px-4 text-center border-b border-gray-200 lg:border-b-0 lg:border-r">
              <div className="font-black text-xl sm:text-2xl text-[#0b1220]">
                Guided
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Photo & video process
              </div>
            </div>

            <div className="py-6 sm:py-7 px-3 sm:px-4 text-center border-r border-gray-200">
              <div className="font-black text-xl sm:text-2xl text-[#0b1220]">
                Reviewed
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Human review
              </div>
            </div>

            <div className="py-6 sm:py-7 px-3 sm:px-4 text-center">
              <div className="font-black text-xl sm:text-2xl text-[#0b1220]">
                Digital
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Downloadable report
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY GAARICHECK */}
      <section className="gc-section">
        <div className="gc-container">

          <div className="max-w-3xl">
            <div className="gc-eyebrow">
              Why GaariCheck
            </div>

            <h2 className="gc-title mt-3">
              Vehicle information that is easier to understand.
            </h2>

            <p className="gc-description mt-5">
              Buying a used vehicle can involve uncertainty.
              GaariCheck helps you review visible vehicle
              condition before making your next decision.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-8 sm:mt-12">

            <FeatureCard
              icon={<Camera />}
              title="Guided Photos"
              description="Customers follow a structured photo checklist so the important vehicle areas are easier to review."
            />

            <FeatureCard
              icon={<Video />}
              title="Video Review"
              description="Supporting vehicle videos provide additional visual information for the inspection."
            />

            <FeatureCard
              icon={<SearchCheck />}
              title="Human Assessment"
              description="Submitted vehicle media is reviewed by the GaariCheck inspection team."
            />

            <FeatureCard
              icon={<FileCheck2 />}
              title="Digital Report"
              description="Inspection observations are provided in a clear downloadable digital report."
            />

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#0b1220] text-white gc-section">
        <div className="gc-container">

          <div className="text-center max-w-2xl mx-auto">
            <div className="gc-eyebrow">
              Simple Process
            </div>

            <h2 className="text-3xl md:text-5xl font-black mt-3">
              How GaariCheck works
            </h2>

            <p className="text-slate-400 mt-5 leading-7">
              From choosing an inspection package to
              receiving your report, the entire process
              happens online.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-5 mt-9 sm:mt-14">

            <ProcessCard
              number="01"
              icon={<ClipboardCheck />}
              title="Choose Package"
              description="Select the inspection level suitable for your vehicle."
            />

            <ProcessCard
              number="02"
              icon={<CreditCard />}
              title="Complete Payment"
              description="Submit payment details and receipt for GaariCheck verification."
            />

            <ProcessCard
              number="03"
              icon={<Upload />}
              title="Submit Vehicle"
              description="Enter vehicle details and upload the required guided media."
            />

            <ProcessCard
              number="04"
              icon={<SearchCheck />}
              title="We Review"
              description="Our inspection team reviews the submitted visual evidence."
            />

            <ProcessCard
              number="05"
              icon={<FileCheck2 />}
              title="Receive Report"
              description="View and download your completed digital inspection report."
            />

          </div>

        </div>
      </section>

      {/* REPORT PREVIEW */}
      <section className="gc-section bg-white">
        <div className="gc-container">

          <div className="grid lg:grid-cols-2 gap-9 sm:gap-12 lg:gap-14 items-center">

            <div>
              <div className="gc-eyebrow">
                Clear Reporting
              </div>

              <h2 className="gc-title mt-3">
                See the inspection before you make your decision.
              </h2>

              <p className="gc-description mt-5">
                Your GaariCheck report organizes vehicle
                observations into an easy-to-understand
                digital format that you can access from
                your customer dashboard.
              </p>

              <div className="mt-7 space-y-4">

                {[
                  "Vehicle identification and details",
                  "Exterior visual observations",
                  "Interior condition observations",
                  "Dashboard and visible warning indicators",
                  "Tyre and wheel observations",
                  "Supporting vehicle images",
                  "Inspection summary",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 items-start"
                  >
                    <CheckCircle2
                      size={20}
                      className="text-green-600 mt-0.5 shrink-0"
                    />

                    <span className="text-gray-700">
                      {item}
                    </span>
                  </div>
                ))}

              </div>

              <Link
                to="/sample-report"
                className="gc-btn-secondary mt-8 gap-2"
              >
                Explore Sample Report
                <ArrowRight size={17} />
              </Link>
            </div>

            {/* Mock report */}
            <div className="relative">

              <div className="absolute inset-0 bg-orange-100 rounded-[30px] rotate-3" />

              <div className="relative gc-card p-5 sm:p-6 md:p-8">

                <div className="flex items-center justify-between border-b border-gray-200 pb-5">

                  <div>
                    <div className="font-black text-xl sm:text-2xl text-[#0b1220]">
                      Gaari
                      <span className="text-orange-500">
                        Check
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      Vehicle Inspection Report
                    </div>
                  </div>

                  <div className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-bold">
                    REPORT READY
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-b border-gray-200">

                  <ReportItem
                    label="Make"
                    value="Toyota"
                  />

                  <ReportItem
                    label="Model"
                    value="Corolla"
                  />

                  <ReportItem
                    label="Year"
                    value="2021"
                  />

                  <ReportItem
                    label="Inspection"
                    value="GC-10284"
                  />

                </div>

                <div className="pt-6">

                  <div className="font-bold text-[#0b1220] mb-4">
                    Inspection Overview
                  </div>

                  <ReportStatus
                    title="Exterior"
                    status="Reviewed"
                  />

                  <ReportStatus
                    title="Interior"
                    status="Reviewed"
                  />

                  <ReportStatus
                    title="Dashboard"
                    status="Reviewed"
                  />

                  <ReportStatus
                    title="Tyres & Wheels"
                    status="Reviewed"
                  />

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="gc-section bg-[#f5f7fa]">
        <div className="gc-container">

          <div className="text-center max-w-2xl mx-auto">

            <div className="gc-eyebrow">
              Inspection Packages
            </div>

            <h2 className="gc-title mt-3">
              Choose the level of inspection you need.
            </h2>

            <p className="gc-description mt-5">
              Select a package based on how detailed
              you want the vehicle review to be.
            </p>

          </div>

          <div className="grid lg:grid-cols-3 gap-5 sm:gap-6 mt-9 sm:mt-12">

            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative bg-white rounded-2xl p-5 sm:p-7 border ${
                  pkg.popular
                    ? "border-orange-500 shadow-xl"
                    : "border-gray-200 shadow-sm"
                }`}
              >

                {pkg.popular && (
                  <div className="absolute -top-3 left-6 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-2xl font-black text-[#0b1220]">
                  {pkg.name}
                </h3>

                <p className="text-gray-500 mt-2 min-h-[48px]">
                  {pkg.description}
                </p>

                <div className="my-6 border-t border-gray-200" />

                <div className="space-y-3">
                  {pkg.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex gap-3"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-green-600 shrink-0 mt-0.5"
                      />

                      <span className="text-sm text-gray-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/pricing"
                  className={`mt-8 w-full ${
                    pkg.popular
                      ? "gc-btn-primary"
                      : "gc-btn-secondary"
                  }`}
                >
                  View Package
                </Link>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* REVIEW PREVIEW */}
      <section className="gc-section bg-white">
        <div className="gc-container">

          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 sm:gap-10 lg:gap-12 items-center">

            <div>
              <div className="gc-eyebrow">
                Customer Confidence
              </div>

              <h2 className="gc-title mt-3">
                Designed to make vehicle checking simpler.
              </h2>

              <p className="gc-description mt-5">
                GaariCheck combines a structured submission
                process with professional human review so
                customers can understand visible vehicle
                condition remotely.
              </p>

              <Link
                to="/reviews"
                className="gc-btn-secondary mt-7 gap-2"
              >
                Customer Reviews
                <ArrowRight size={17} />
              </Link>
            </div>

            <div>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">

                <ReviewCard
                  text="The process was easy to follow and having the report in one place made reviewing the vehicle much simpler."
                  name="Sample Review Preview"
                />

                <ReviewCard
                  text="Uploading the vehicle information remotely saved time and gave me a clearer picture before moving forward."
                  name="Sample Review Preview"
                />

              </div>

              <p className="text-xs text-gray-400 mt-4 leading-5">
                Demonstration review text for website layout preview only.
                These are not real customer testimonials.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 pb-20 bg-white">
        <div className="gc-container">

          <div className="relative overflow-hidden bg-[#0b1220] rounded-[22px] sm:rounded-[30px] px-5 sm:px-6 py-10 sm:py-14 md:px-12 md:py-16">

            <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

              <div className="max-w-2xl">

                <div className="text-orange-400 font-bold text-sm uppercase tracking-wider">
                  Ready to inspect?
                </div>

                <h2 className="text-white font-black text-3xl md:text-5xl mt-3 leading-tight">
                  Check the vehicle before making your next move.
                </h2>

                <p className="text-slate-400 mt-4 text-lg">
                  Choose an inspection package and start
                  your GaariCheck journey online.
                </p>

              </div>

              <Link
                to="/pricing"
                className="gc-btn-primary w-full sm:w-auto whitespace-nowrap gap-2"
              >
                View Inspection Packages
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>
        </div>
      </section>

    </main>
  );
}


/* -----------------------------
   Reusable homepage components
----------------------------- */

function FeatureCard({ icon, title, description }) {
  return (
    <div className="gc-card p-5 sm:p-6 hover:-translate-y-1 transition duration-200">

      <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-[#0b1220] mt-5">
        {title}
      </h3>

      <p className="text-gray-500 leading-7 mt-3 text-sm">
        {description}
      </p>

    </div>
  );
}


function ProcessCard({
  number,
  icon,
  title,
  description,
}) {
  return (
    <div className="relative bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">

      <div className="flex items-center justify-between">

        <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center text-white">
          {icon}
        </div>

        <div className="text-3xl font-black text-white/10">
          {number}
        </div>

      </div>

      <h3 className="font-bold text-xl mt-5">
        {title}
      </h3>

      <p className="text-slate-400 text-sm leading-6 mt-3">
        {description}
      </p>

    </div>
  );
}


function ReportItem({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-400 uppercase tracking-wide">
        {label}
      </div>

      <div className="font-bold text-[#0b1220] mt-1">
        {value}
      </div>
    </div>
  );
}


function ReportStatus({ title, status }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">

      <div className="flex items-center gap-3">
        <CheckCircle2
          size={18}
          className="text-green-600"
        />

        <span className="text-gray-700">
          {title}
        </span>
      </div>

      <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1 rounded-full">
        {status}
      </span>

    </div>
  );
}


function ReviewCard({ text, name }) {
  return (
    <div className="gc-card p-5 sm:p-6">

      <div className="flex gap-1 text-orange-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={17}
            fill="currentColor"
          />
        ))}
      </div>

      <p className="text-gray-600 leading-7 mt-5">
        “{text}”
      </p>

      <div className="mt-5">
        <div className="font-bold text-[#0b1220]">
          {name}
        </div>

        <div className="text-xs text-gray-400">
          Demonstration text only
        </div>
      </div>

    </div>
  );
}

export default Home;