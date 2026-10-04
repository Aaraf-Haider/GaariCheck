import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Car,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  Image as ImageIcon,
  ShieldCheck,
} from "lucide-react";

function SampleReport() {
  const [activeSection, setActiveSection] =
    useState("summary");

  const sections = {
    summary: {
      title: "Inspection Summary",
      icon: <ClipboardCheck size={20} />,
    },

    exterior: {
      title: "Exterior",
      icon: <Car size={20} />,
    },

    interior: {
      title: "Interior",
      icon: <ImageIcon size={20} />,
    },

    dashboard: {
      title: "Dashboard",
      icon: <Gauge size={20} />,
    },

    tyres: {
      title: "Tyres & Wheels",
      icon: <ShieldCheck size={20} />,
    },
  };

  return (
    <main className="bg-[#f5f7fa]">

      {/* HERO */}
      <section className="bg-[#0b1220] text-white">

        <div className="gc-container py-14 sm:py-16 md:py-24">

          <div className="grid lg:grid-cols-2 gap-9 sm:gap-12 items-center">

            <div>

              <div className="gc-eyebrow">
                Sample Inspection Report
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight mt-4">
                See what a GaariCheck
                <span className="block text-orange-500">
                  inspection report looks like.
                </span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg leading-7 sm:leading-8 mt-5 sm:mt-6 max-w-xl">
                Explore a demonstration report showing how
                vehicle information, visual observations
                and inspection findings can be presented
                after review.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">

                <Link
                  to="/pricing"
                  className="gc-btn-primary w-full sm:w-auto gap-2"
                >
                  Choose Inspection Package
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/services"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/10"
                >
                  What We Inspect
                </Link>

              </div>

            </div>

            {/* MINI REPORT */}
            <div className="bg-white rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 md:p-8 text-[#0b1220] shadow-2xl">

              <div className="flex items-center justify-between border-b border-gray-200 pb-5">

                <div className="flex items-center">

                    <div className="w-[145px] sm:w-[165px] h-[48px] sm:h-[52px] overflow-hidden flex items-center justify-start">

                        <img
                        src="/gaaricheck-logo.png"
                        alt="GaariCheck Vehicle Inspection"
                        className="w-full h-full object-contain object-left scale-[1.12]"
                        />

                    </div>

                </div>

                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                  SAMPLE
                </span>

              </div>

              <div className="grid grid-cols-2 gap-5 py-6">

                <ReportInfo
                  label="Make"
                  value="Toyota"
                />

                <ReportInfo
                  label="Model"
                  value="Corolla"
                />

                <ReportInfo
                  label="Year"
                  value="2021"
                />

                <ReportInfo
                  label="Inspection ID"
                  value="GC-SAMPLE-01"
                />

              </div>

              <div className="border-t border-gray-200 pt-5">

                <StatusLine
                  text="Exterior reviewed"
                  type="success"
                />

                <StatusLine
                  text="Interior reviewed"
                  type="success"
                />

                <StatusLine
                  text="Dashboard observations noted"
                  type="warning"
                />

                <StatusLine
                  text="Tyres & wheels reviewed"
                  type="success"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* DISCLAIMER */}
      <section className="bg-orange-50 border-b border-orange-100">

        <div className="gc-container py-5">

          <div className="flex items-start gap-3">

            <AlertTriangle
              size={20}
              className="text-orange-600 shrink-0 mt-0.5"
            />

            <p className="text-sm text-orange-900 leading-6">
              This is a demonstration report only. The vehicle,
              findings and observations shown below are sample
              content designed to illustrate the GaariCheck
              reporting format.
            </p>

          </div>

        </div>

      </section>

      {/* INTERACTIVE REPORT */}
      <section className="gc-section">

        <div className="gc-container">

          <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-5 sm:gap-7">

            {/* LEFT MENU */}
            <aside className="gc-card p-3 sm:p-4 self-start lg:sticky lg:top-28 overflow-hidden">

              <div className="px-2 sm:px-3 py-2 sm:py-3">

                <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                  Report Sections
                </div>

              </div>

              <div className="flex lg:block gap-2 lg:space-y-1 overflow-x-auto pb-1 lg:pb-0">

                {Object.entries(
                  sections
                ).map(
                  ([
                    key,
                    section,
                  ]) => (

                    <button
                      key={key}
                      onClick={() =>
                        setActiveSection(
                          key
                        )
                      }
                      className={`shrink-0 lg:w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-sm font-semibold whitespace-nowrap transition ${
                        activeSection ===
                        key
                          ? "bg-orange-50 text-orange-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {section.icon}

                      {
                        section.title
                      }

                    </button>
                  )
                )}

              </div>

            </aside>

            {/* REPORT CONTENT */}
            <div className="gc-card overflow-hidden">

              {/* REPORT HEADER */}
              <div className="p-5 sm:p-6 md:p-8 border-b border-gray-200">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  <div>

                    <div className="text-xs uppercase tracking-wider text-gray-400">
                      Inspection Report
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-[#0b1220] mt-1">
                      Toyota Corolla 2021
                    </h2>

                    <div className="text-sm text-gray-500 mt-2 break-words">
                      Registration: ABC-123
                      {" • "}
                      Inspection ID:
                      GC-SAMPLE-01
                    </div>

                  </div>

                  <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold self-start">
                    Sample Report
                  </div>

                </div>

              </div>

              {/* ACTIVE SECTION */}
              <div className="p-5 sm:p-6 md:p-8">

                {activeSection ===
                  "summary" && (
                  <SummarySection />
                )}

                {activeSection ===
                  "exterior" && (
                  <ExteriorSection />
                )}

                {activeSection ===
                  "interior" && (
                  <InteriorSection />
                )}

                {activeSection ===
                  "dashboard" && (
                  <DashboardSection />
                )}

                {activeSection ===
                  "tyres" && (
                  <TyresSection />
                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* REPORT CONTENT EXPLANATION */}
      <section className="gc-section bg-white">

        <div className="gc-container">

          <div className="text-center max-w-2xl mx-auto">

            <div className="gc-eyebrow">
              Your Final Report
            </div>

            <h2 className="gc-title mt-3">
              Clear information in one place.
            </h2>

            <p className="gc-description mt-5">
              Your completed inspection report will be
              available from your GaariCheck customer
              dashboard once the inspection team has
              completed its review.
            </p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-8 sm:mt-12">

            <Benefit
              icon={
                <ClipboardCheck />
              }
              title="Structured Findings"
              text="Vehicle observations are grouped into clear inspection sections."
            />

            <Benefit
              icon={<ImageIcon />}
              title="Supporting Evidence"
              text="Relevant submitted photos can support the observations included in the report."
            />

            <Benefit
              icon={<FileCheck2 />}
              title="Digital PDF"
              text="Customers can view and download the final report from their dashboard."
            />

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="px-4 pb-20 bg-white">

        <div className="gc-container">

          <div className="bg-[#0b1220] rounded-[22px] sm:rounded-[28px] px-5 sm:px-7 py-9 sm:py-12 md:px-12">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

              <div>

                <div className="text-orange-400 uppercase tracking-wider text-sm font-bold">
                  Ready to start?
                </div>

                <h2 className="text-white text-3xl md:text-4xl font-black mt-3">
                  Get your vehicle checked with GaariCheck.
                </h2>

                <p className="text-slate-400 mt-3">
                  Compare the available inspection packages
                  and choose the level of review you need.
                </p>

              </div>

              <Link
                to="/pricing"
                className="gc-btn-primary w-full sm:w-auto gap-2 whitespace-nowrap"
              >
                View Packages
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}


/* ======================================
   SUMMARY
====================================== */

function SummarySection() {
  return (
    <div>

      <SectionTitle
        title="Inspection Summary"
        text="Overview of the vehicle information and key visual observations."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">

        <SummaryBox
          label="Vehicle"
          value="Toyota Corolla"
        />

        <SummaryBox
          label="Model Year"
          value="2021"
        />

        <SummaryBox
          label="Mileage"
          value="48,200 km"
        />

        <SummaryBox
          label="Transmission"
          value="Automatic"
        />

      </div>

      <div className="mt-8">

        <h3 className="font-black text-xl text-[#0b1220]">
          Sample Overall Observation
        </h3>

        <div className="bg-gray-50 rounded-xl p-5 mt-4">

          <p className="text-gray-600 leading-7">
            Based on the submitted visual evidence,
            the vehicle shows generally clean visible
            condition. Minor exterior cosmetic marks
            are visible in selected areas. Customers
            should review the detailed observations
            below before making a decision.
          </p>

        </div>

      </div>

      <div className="mt-8 space-y-3">

        <Finding
          title="Exterior"
          status="Reviewed"
          statusType="success"
        />

        <Finding
          title="Interior"
          status="Reviewed"
          statusType="success"
        />

        <Finding
          title="Dashboard"
          status="Observation"
          statusType="warning"
        />

        <Finding
          title="Tyres & Wheels"
          status="Reviewed"
          statusType="success"
        />

      </div>

    </div>
  );
}


/* ======================================
   EXTERIOR
====================================== */

function ExteriorSection() {
  return (
    <div>

      <SectionTitle
        title="Exterior Condition"
        text="Sample visual observations from submitted exterior vehicle photographs."
      />

      <div className="grid md:grid-cols-2 gap-5 mt-7">

        <ObservationCard
          title="Front Exterior"
          status="Reviewed"
          text="Front bumper, headlights and bonnet appear visually aligned in the submitted images."
        />

        <ObservationCard
          title="Driver Side"
          status="Minor Observation"
          warning
          text="A small cosmetic mark is visible near the lower section of the front door."
        />

        <ObservationCard
          title="Passenger Side"
          status="Reviewed"
          text="No major visible body damage is identified from the submitted view."
        />

        <ObservationCard
          title="Rear Exterior"
          status="Reviewed"
          text="Rear lights, boot area and bumper appear visually intact in the submitted media."
        />

      </div>

      <SamplePhotos />

    </div>
  );
}


/* ======================================
   INTERIOR
====================================== */

function InteriorSection() {
  return (
    <div>

      <SectionTitle
        title="Interior Condition"
        text="Sample review of the vehicle cabin and visible interior condition."
      />

      <div className="space-y-4 mt-7">

        <Finding
          title="Front seats"
          description="Visible upholstery appears generally clean with normal signs of use."
          status="Reviewed"
          statusType="success"
        />

        <Finding
          title="Rear seats"
          description="No obvious visible tearing identified in the submitted images."
          status="Reviewed"
          statusType="success"
        />

        <Finding
          title="Dashboard & trim"
          description="Dashboard trim appears complete from the submitted visual evidence."
          status="Reviewed"
          statusType="success"
        />

        <Finding
          title="Cabin cleanliness"
          description="Minor normal-use marks are visible."
          status="Observation"
          statusType="warning"
        />

      </div>

    </div>
  );
}


/* ======================================
   DASHBOARD
====================================== */

function DashboardSection() {
  return (
    <div>

      <SectionTitle
        title="Dashboard & Indicators"
        text="Visible dashboard information from the submitted vehicle images."
      />

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mt-7">

        <div className="flex gap-3">

          <AlertTriangle
            size={21}
            className="text-orange-600 shrink-0 mt-0.5"
          />

          <div>

            <div className="font-bold text-orange-900">
              Sample Observation
            </div>

            <p className="text-orange-800 text-sm leading-6 mt-1">
              A dashboard warning indicator appears
              illuminated in the sample photograph.
              Further physical or diagnostic verification
              would be recommended.
            </p>

          </div>

        </div>

      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-6">

        <SummaryBox
          label="Odometer"
          value="48,200 km"
        />

        <SummaryBox
          label="Fuel Level"
          value="Visible"
        />

      </div>

    </div>
  );
}


/* ======================================
   TYRES
====================================== */

function TyresSection() {
  return (
    <div>

      <SectionTitle
        title="Tyres & Wheels"
        text="Visual review based on the tyre and wheel images submitted by the customer."
      />

      <div className="grid md:grid-cols-2 gap-5 mt-7">

        <ObservationCard
          title="Front Left"
          status="Reviewed"
          text="Tyre and wheel appear visually intact in the supplied photograph."
        />

        <ObservationCard
          title="Front Right"
          status="Reviewed"
          text="No obvious visible wheel damage identified from the submitted image."
        />

        <ObservationCard
          title="Rear Left"
          status="Reviewed"
          text="Visible tyre condition appears consistent with normal use."
        />

        <ObservationCard
          title="Rear Right"
          status="Review Recommended"
          warning
          text="Image angle does not clearly show the complete tread surface."
        />

      </div>

    </div>
  );
}


/* ======================================
   COMPONENTS
====================================== */

function SectionTitle({
  title,
  text,
}) {
  return (
    <div>

      <h2 className="text-2xl md:text-3xl font-black text-[#0b1220]">
        {title}
      </h2>

      <p className="text-gray-500 leading-7 mt-2">
        {text}
      </p>

    </div>
  );
}


function ReportInfo({
  label,
  value,
}) {
  return (
    <div>

      <div className="text-xs uppercase tracking-wider text-gray-400">
        {label}
      </div>

      <div className="font-bold mt-1">
        {value}
      </div>

    </div>
  );
}


function StatusLine({
  text,
  type,
}) {
  const success =
    type === "success";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">

      {success ? (
        <CheckCircle2
          size={18}
          className="text-green-600"
        />
      ) : (
        <AlertTriangle
          size={18}
          className="text-orange-600"
        />
      )}

      <span className="text-sm text-gray-600">
        {text}
      </span>

    </div>
  );
}


function SummaryBox({
  label,
  value,
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 sm:p-5">

      <div className="text-xs uppercase tracking-wider text-gray-400">
        {label}
      </div>

      <div className="font-black text-[#0b1220] mt-2">
        {value}
      </div>

    </div>
  );
}


function Finding({
  title,
  description,
  status,
  statusType,
}) {
  const warning =
    statusType === "warning";

  return (
    <div className="border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      <div>

        <h3 className="font-bold text-[#0b1220]">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-gray-500 leading-6 mt-1">
            {description}
          </p>
        )}

      </div>

      <span
        className={`self-start whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold ${
          warning
            ? "bg-orange-50 text-orange-700"
            : "bg-green-50 text-green-700"
        }`}
      >
        {status}
      </span>

    </div>
  );
}


function ObservationCard({
  title,
  status,
  text,
  warning,
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 sm:p-5">

      <div className="flex justify-between gap-3">

        <h3 className="font-black text-[#0b1220]">
          {title}
        </h3>

        {warning ? (
          <AlertTriangle
            size={18}
            className="text-orange-500 shrink-0"
          />
        ) : (
          <CheckCircle2
            size={18}
            className="text-green-600 shrink-0"
          />
        )}

      </div>

      <div
        className={`text-xs font-bold mt-3 ${
          warning
            ? "text-orange-700"
            : "text-green-700"
        }`}
      >
        {status}
      </div>

      <p className="text-sm text-gray-500 leading-6 mt-3">
        {text}
      </p>

    </div>
  );
}


function SamplePhotos() {
  return (
    <div className="mt-8">

      <h3 className="font-black text-[#0b1220]">
        Supporting Images
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">

        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="aspect-[4/3] rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center"
            >
              <div className="text-center">

                <ImageIcon
                  size={24}
                  className="text-gray-300 mx-auto"
                />

                <div className="text-[11px] text-gray-400 mt-2">
                  Sample Vehicle Photo
                </div>

              </div>
            </div>
          )
        )}

      </div>

    </div>
  );
}


function Benefit({
  icon,
  title,
  text,
}) {
  return (
    <div className="gc-card p-5 sm:p-6">

      <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
        {icon}
      </div>

      <h3 className="font-black text-xl text-[#0b1220] mt-5">
        {title}
      </h3>

      <p className="text-sm text-gray-500 leading-7 mt-3">
        {text}
      </p>

    </div>
  );
}

export default SampleReport;