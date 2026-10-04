import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import api from "../services/api";


function Dashboard() {
  const [
    inspections,
    setInspections,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem(
        "user"
      )
    );
  } catch {
    user = null;
  }


  /* =====================================
     VIEW REPORT
  ===================================== */

  const handleViewReport =
    async (
      inspectionId
    ) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );


        const response =
          await api.get(
            `/inspections/${inspectionId}/report`,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              responseType:
                "blob",
            }
          );


        const pdfBlob =
          new Blob(
            [response.data],
            {
              type:
                "application/pdf",
            }
          );


        const pdfUrl =
          URL.createObjectURL(
            pdfBlob
          );


        window.open(
          pdfUrl,
          "_blank"
        );


        setTimeout(() => {
          URL.revokeObjectURL(
            pdfUrl
          );
        }, 60000);

      } catch (err) {
        console.error(
          "View report error:",
          err
        );


        alert(
          err.response?.data
            ?.message ||
            "Unable to open report."
        );
      }
    };


  /* =====================================
     DOWNLOAD REPORT
  ===================================== */

  const handleDownloadReport =
    async (
      inspection
    ) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );


        const response =
          await api.get(
            `/inspections/${inspection._id}/report/download`,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              responseType:
                "blob",
            }
          );


        const pdfBlob =
          new Blob(
            [response.data],
            {
              type:
                "application/pdf",
            }
          );


        const pdfUrl =
          URL.createObjectURL(
            pdfBlob
          );


        const link =
          document.createElement(
            "a"
          );


        link.href =
          pdfUrl;


        link.download =
          inspection.reportOriginalName ||
          `${inspection.inspectionNumber}-Report.pdf`;


        document.body.appendChild(
          link
        );


        link.click();


        document.body.removeChild(
          link
        );


        URL.revokeObjectURL(
          pdfUrl
        );

      } catch (err) {
        console.error(
          "Download report error:",
          err
        );


        alert(
          err.response?.data
            ?.message ||
            "Unable to download report."
        );
      }
    };


  /* =====================================
     GET INSPECTIONS
  ===================================== */

  const fetchInspections =
    async () => {
      try {
        setLoading(true);

        setError("");


        const token =
          localStorage.getItem(
            "token"
          );


        const response =
          await api.get(
            "/inspections",

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        setInspections(
          response.data
            .inspections ||
          response.data ||
          []
        );

      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );


        setError(
          err.response?.data
            ?.message ||
            "Unable to load your inspections."
        );

      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    fetchInspections();
  }, []);


  /* =====================================
     DASHBOARD STATS
  ===================================== */

  const totalInspections =
    inspections.length;


  const activeInspections =
    inspections.filter(
      (inspection) =>
        [
          "Submitted",
          "Under Review",
          "Inspection In Progress",
        ].includes(
          inspection.status
        )
    ).length;


  const readyReports =
    inspections.filter(
      (inspection) =>
        inspection.reportUrl ||
        inspection.status ===
          "Report Ready" ||
        inspection.status ===
          "Completed"
    ).length;


  return (
    <main className="min-h-screen bg-[#f5f7fa]">


      {/* =====================================
          HEADER
      ===================================== */}

      <section className="bg-[#0b1220] text-white">

        <div className="gc-container py-9 sm:py-11 md:py-14">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">


            {/* HEADER TEXT */}

            <div className="min-w-0">

              <div className="flex items-center gap-2 text-orange-400 text-sm font-semibold mb-3">

                <ShieldCheck
                  size={17}
                />

                Customer Dashboard

              </div>


              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">

                Welcome back
                {user?.name
                  ? `, ${user.name.split(" ")[0]}`
                  : ""}
                .

              </h1>


              <p className="text-slate-400 mt-3 max-w-xl leading-7 text-sm sm:text-base">

                Manage your vehicle
                inspections, track progress
                and access your completed
                inspection reports.

              </p>

            </div>


            {/* HEADER ACTIONS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 w-full sm:w-auto">

              <Link
                to="/my-payments"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/15 text-white font-bold hover:bg-white/10 transition"
              >

                <CreditCard
                  size={18}
                />

                My Payments

              </Link>


              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition"
              >

                <Plus
                  size={18}
                />

                New Inspection

              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          PAGE CONTENT
      ===================================== */}

      <div className="gc-container py-7 sm:py-9 md:py-10">


        {/* =====================================
            STAT CARDS
        ===================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">

          <StatCard
            icon={
              <Car
                size={22}
              />
            }
            label="Total Inspections"
            value={
              totalInspections
            }
            description="All submitted vehicles"
          />


          <StatCard
            icon={
              <Clock3
                size={22}
              />
            }
            label="In Progress"
            value={
              activeInspections
            }
            description="Currently being processed"
          />


          <StatCard
            icon={
              <FileText
                size={22}
              />
            }
            label="Reports Available"
            value={
              readyReports
            }
            description="Ready to view or download"
          />

        </div>


        {/* =====================================
            MAIN CONTENT
        ===================================== */}

        <div className="grid xl:grid-cols-[minmax(0,1fr)_310px] gap-7 mt-8">


          {/* =====================================
              INSPECTIONS
          ===================================== */}

          <section className="min-w-0">

            <div className="flex items-start sm:items-center justify-between gap-4 mb-5">

              <div className="min-w-0">

                <h2 className="text-xl sm:text-2xl font-black text-[#0b1220]">
                  My Inspections
                </h2>


                <p className="text-sm text-gray-500 mt-1">
                  Track your submitted
                  vehicle inspections.
                </p>

              </div>


              <button
                type="button"
                onClick={
                  fetchInspections
                }
                disabled={
                  loading
                }
                className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:text-[#0b1220] hover:bg-white transition disabled:opacity-50"
              >

                <RefreshCw
                  size={16}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                <span className="hidden sm:inline">
                  Refresh
                </span>

              </button>

            </div>


            {/* LOADING */}

            {loading && (

              <div className="gc-card p-9 sm:p-12 text-center">

                <Loader2
                  size={30}
                  className="animate-spin text-orange-500 mx-auto"
                />


                <p className="text-gray-500 mt-4">
                  Loading your inspections...
                </p>

              </div>
            )}


            {/* ERROR */}

            {!loading &&
              error && (

              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 sm:p-6">

                <p className="text-red-700 text-sm sm:text-base">
                  {error}
                </p>


                <button
                  type="button"
                  onClick={
                    fetchInspections
                  }
                  className="mt-4 text-sm font-bold text-red-700 underline"
                >
                  Try Again
                </button>

              </div>
            )}


            {/* EMPTY */}

            {!loading &&
              !error &&
              inspections.length ===
                0 && (

              <div className="gc-card p-7 sm:p-10 md:p-12 text-center">

                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto">

                  <Car
                    size={30}
                    className="text-orange-600"
                  />

                </div>


                <h3 className="text-xl sm:text-2xl font-black text-[#0b1220] mt-5">

                  No inspections yet

                </h3>


                <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-md mx-auto leading-7">

                  Choose an inspection
                  package to start your
                  first GaariCheck vehicle
                  review.

                </p>


                <Link
                  to="/pricing"
                  className="gc-btn-primary mt-6 gap-2"
                >

                  View Packages

                  <ArrowRight
                    size={17}
                  />

                </Link>

              </div>
            )}


            {/* INSPECTION LIST */}

            {!loading &&
              !error &&
              inspections.length >
                0 && (

              <div className="space-y-4 sm:space-y-5">

                {inspections.map(
                  (
                    inspection
                  ) => (

                    <InspectionCard
                      key={
                        inspection._id
                      }
                      inspection={
                        inspection
                      }
                      onViewReport={
                        handleViewReport
                      }
                      onDownloadReport={
                        handleDownloadReport
                      }
                    />
                  )
                )}

              </div>
            )}

          </section>


          {/* =====================================
              RIGHT SIDEBAR
          ===================================== */}

          <aside className="space-y-5">


            {/* ACCOUNT */}

            <div className="gc-card p-5 sm:p-6">

              <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Account
              </div>


              <div className="mt-4">

                <div className="font-black text-lg text-[#0b1220] break-words">

                  {user?.name ||
                    "Customer"}

                </div>


                <div className="text-sm text-gray-500 mt-1 break-all">

                  {user?.email}

                </div>


                {user?.phone && (

                  <div className="text-sm text-gray-500 mt-1">

                    {
                      user.phone
                    }

                  </div>
                )}

              </div>


              <div className="border-t border-gray-100 mt-5 pt-5">

                <div className="flex items-center gap-2 text-sm text-green-700 font-semibold">

                  <CheckCircle2
                    size={17}
                  />

                  GaariCheck Account

                </div>

              </div>

            </div>


            {/* PROCESS GUIDE */}

            <div className="bg-[#0b1220] rounded-[20px] p-5 sm:p-6 text-white">

              <div className="text-orange-400 text-xs uppercase tracking-wider font-bold">

                Inspection Journey

              </div>


              <h3 className="font-black text-xl mt-2">

                What happens next?

              </h3>


              <div className="space-y-5 mt-6">

                <JourneyItem
                  number="1"
                  text="Choose a package and complete payment"
                />


                <JourneyItem
                  number="2"
                  text="Submit vehicle information and guided media"
                />


                <JourneyItem
                  number="3"
                  text="GaariCheck reviews your submission"
                />


                <JourneyItem
                  number="4"
                  text="Receive your digital inspection report"
                />

              </div>

            </div>


            {/* HELP */}

            <div className="gc-card p-5 sm:p-6">

              <h3 className="font-black text-[#0b1220]">
                Need help?
              </h3>


              <p className="text-sm text-gray-500 leading-6 mt-2">

                Have a question about
                your inspection, payment
                or report?

              </p>


              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 mt-4"
              >

                Contact GaariCheck

                <ArrowRight
                  size={15}
                />

              </Link>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}


/* =====================================
   INSPECTION CARD
===================================== */

function InspectionCard({
  inspection,
  onViewReport,
  onDownloadReport,
}) {
  const vehicle =
    inspection.vehicle || {};


  const customer =
    inspection.customer || {};


  const hasReport =
    Boolean(
      inspection.reportUrl
    );


  return (
    <article className="gc-card overflow-hidden">


      {/* =====================================
          TOP
      ===================================== */}

      <div className="p-5 sm:p-6 md:p-7">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">


          {/* VEHICLE */}

          <div className="flex gap-3 sm:gap-4 min-w-0">

            <div className="w-12 h-12 sm:w-13 sm:h-13 shrink-0 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">

              <Car
                size={24}
              />

            </div>


            <div className="min-w-0 flex-1">

              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">

                <h3 className="font-black text-lg sm:text-xl text-[#0b1220] break-words">

                  {vehicle.make ||
                    "Vehicle"}{" "}

                  {vehicle.model ||
                    ""}

                </h3>


                <div>
                  <StatusBadge
                    status={
                      inspection.status
                    }
                  />
                </div>

              </div>


              <div className="text-sm text-gray-500 mt-2 break-words">

                {vehicle.year
                  ? `${vehicle.year} • `
                  : ""}

                {vehicle.registrationNumber ||
                  "Registration not provided"}

              </div>


              <div className="text-xs text-gray-400 mt-2 break-all">

                Inspection ID:{" "}

                <span className="font-semibold text-gray-600">

                  {
                    inspection.inspectionNumber
                  }

                </span>

              </div>

            </div>

          </div>


          {/* PACKAGE */}

          <div className="md:text-right pl-[60px] sm:pl-[64px] md:pl-0">

            <div className="text-xs text-gray-400 uppercase tracking-wide">
              Package
            </div>


            <div className="font-black text-[#0b1220] capitalize mt-1">

              {
                inspection.plan
              }

            </div>

          </div>

        </div>


        {/* DETAILS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5 mt-7">

          <InfoItem
            label="Submitted"
            value={
              formatDate(
                inspection.createdAt
              )
            }
            icon={
              <CalendarDays
                size={15}
              />
            }
          />


          <InfoItem
            label="Fuel"
            value={
              vehicle.fuelType ||
              "—"
            }
          />


          <InfoItem
            label="Transmission"
            value={
              vehicle.transmission ||
              "—"
            }
          />


          <InfoItem
            label="City"
            value={
              customer.city ||
              "—"
            }
          />

        </div>

      </div>


      {/* =====================================
          FOOTER
      ===================================== */}

      <div className="border-t border-gray-100 bg-gray-50 px-5 sm:px-6 md:px-7 py-4">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">


          {/* REPORT STATUS */}

          <div>

            {hasReport ? (

              <div className="flex items-start sm:items-center gap-2 text-sm font-semibold text-green-700">

                <CheckCircle2
                  size={17}
                  className="shrink-0 mt-0.5 sm:mt-0"
                />

                Inspection report available

              </div>

            ) : (

              <div className="flex items-start sm:items-center gap-2 text-sm text-gray-500">

                <Clock3
                  size={17}
                  className="shrink-0 mt-0.5 sm:mt-0"
                />

                Report will appear here
                when ready

              </div>
            )}

          </div>


          {/* REPORT BUTTONS */}

          {hasReport && (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full md:w-auto">

              <button
                type="button"
                onClick={() =>
                  onViewReport(
                    inspection._id
                  )
                }
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#0b1220] hover:border-orange-300 transition"
              >

                <FileText
                  size={16}
                />

                View Report

              </button>


              <button
                type="button"
                onClick={() =>
                  onDownloadReport(
                    inspection
                  )
                }
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0b1220] text-white rounded-xl text-sm font-bold hover:bg-[#151e2e] transition"
              >

                <Download
                  size={16}
                />

                Download

              </button>

            </div>
          )}

        </div>

      </div>

    </article>
  );
}


/* =====================================
   STAT CARD
===================================== */

function StatCard({
  icon,
  label,
  value,
  description,
}) {
  return (
    <div className="gc-card p-5 sm:p-6">

      <div className="flex items-start justify-between gap-5">

        <div>

          <div className="text-sm text-gray-500">
            {label}
          </div>


          <div className="text-3xl sm:text-4xl font-black text-[#0b1220] mt-2">

            {value}

          </div>

        </div>


        <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">

          {icon}

        </div>

      </div>


      <p className="text-xs text-gray-400 mt-4 leading-5">

        {description}

      </p>

    </div>
  );
}


/* =====================================
   STATUS BADGE
===================================== */

function StatusBadge({
  status,
}) {
  const styles = {
    Submitted:
      "bg-blue-50 text-blue-700",

    "Under Review":
      "bg-amber-50 text-amber-700",

    "Inspection In Progress":
      "bg-orange-50 text-orange-700",

    "Report Ready":
      "bg-green-50 text-green-700",

    Completed:
      "bg-green-50 text-green-700",
  };


  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
        styles[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >

      {status}

    </span>
  );
}


/* =====================================
   INFO ITEM
===================================== */

function InfoItem({
  label,
  value,
  icon,
}) {
  return (
    <div className="min-w-0">

      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-400 uppercase tracking-wide">

        {icon}

        {label}

      </div>


      <div className="font-semibold text-sm text-[#0b1220] mt-1.5 capitalize break-words">

        {value}

      </div>

    </div>
  );
}


/* =====================================
   JOURNEY
===================================== */

function JourneyItem({
  number,
  text,
}) {
  return (
    <div className="flex gap-3 items-start">

      <div className="w-7 h-7 min-w-7 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center mt-0.5">

        {number}

      </div>


      <span className="text-sm text-slate-300 leading-6">

        {text}

      </span>

    </div>
  );
}


/* =====================================
   DATE
===================================== */

function formatDate(
  date
) {
  if (!date) {
    return "—";
  }


  return new Date(
    date
  ).toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


export default Dashboard;