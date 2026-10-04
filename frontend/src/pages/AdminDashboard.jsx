import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  Car,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileCheck2,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import api from "../services/api";


function AdminDashboard() {
  const [
    inspections,
    setInspections,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");


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
     FETCH ADMIN INSPECTIONS
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
            "/admin/inspections",

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
          "Admin dashboard error:",
          err
        );


        setError(
          err.response?.data
            ?.message ||
            "Unable to load inspections."
        );

      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    fetchInspections();
  }, []);


  /* =====================================
     STATS
  ===================================== */

  const total =
    inspections.length;


  const submitted =
    inspections.filter(
      (inspection) =>
        inspection.status ===
        "Submitted"
    ).length;


  const inProgress =
    inspections.filter(
      (inspection) =>
        [
          "Under Review",
          "Inspection In Progress",
        ].includes(
          inspection.status
        )
    ).length;


  const reportsReady =
    inspections.filter(
      (inspection) =>
        inspection.status ===
          "Report Ready" ||
        inspection.status ===
          "Completed" ||
        inspection.reportUrl
    ).length;


  /* =====================================
     FILTERING
  ===================================== */

  const filteredInspections =
    useMemo(() => {

      return inspections.filter(
        (inspection) => {

          const vehicle =
            inspection.vehicle ||
            {};

          const customer =
            inspection.customer ||
            {};

          const accountUser =
            inspection.user ||
            {};


          const searchText = `
            ${inspection.inspectionNumber || ""}
            ${vehicle.make || ""}
            ${vehicle.model || ""}
            ${vehicle.registrationNumber || ""}
            ${customer.name || ""}
            ${customer.email || ""}
            ${accountUser.name || ""}
            ${accountUser.email || ""}
          `.toLowerCase();


          const matchesSearch =
            searchText.includes(
              search
                .trim()
                .toLowerCase()
            );


          const matchesStatus =
            statusFilter ===
              "All" ||
            inspection.status ===
              statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    }, [
      inspections,
      search,
      statusFilter,
    ]);


  /* =====================================
     ADMIN CHECK
  ===================================== */

  if (
    !user ||
    user.role !== "admin"
  ) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">

        <div className="gc-card p-7 sm:p-8 text-center max-w-md">

          <ShieldCheck
            size={42}
            className="text-red-500 mx-auto"
          />


          <h1 className="text-2xl font-black text-[#0b1220] mt-4">

            Admin Access Required

          </h1>


          <p className="text-gray-500 mt-3 leading-7">

            You do not have permission
            to access this page.

          </p>


          <Link
            to="/"
            className="gc-btn-primary mt-6"
          >

            Return Home

          </Link>

        </div>

      </div>
    );
  }


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

              <div className="flex items-center gap-2 text-orange-400 text-sm font-semibold">

                <ShieldCheck
                  size={17}
                />

                GaariCheck Administration

              </div>


              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 leading-tight">

                Inspection Management

              </h1>


              <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-2xl leading-7">

                Review customer
                submissions, monitor
                inspection progress and
                manage final inspection
                reports.

              </p>

            </div>


            {/* HEADER ACTIONS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 w-full sm:w-auto">

              <Link
                to="/admin/payments"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition"
              >

                <CreditCard
                  size={18}
                />

                Payment Requests

              </Link>


              <button
                type="button"
                onClick={
                  fetchInspections
                }
                disabled={
                  loading
                }
                className="inline-flex items-center justify-center gap-2 border border-white/15 text-white rounded-xl px-5 py-3 font-semibold hover:bg-white/10 transition disabled:opacity-60"
              >

                <RefreshCw
                  size={17}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh Data

              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          PAGE
      ===================================== */}

      <div className="gc-container py-7 sm:py-9 md:py-10">


        {/* =====================================
            STAT CARDS
        ===================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">

          <AdminStat
            icon={
              <Car
                size={22}
              />
            }
            label="Total Inspections"
            value={
              total
            }
            description="All customer submissions"
          />


          <AdminStat
            icon={
              <Clock3
                size={22}
              />
            }
            label="New Submissions"
            value={
              submitted
            }
            description="Waiting for initial review"
          />


          <AdminStat
            icon={
              <Users
                size={22}
              />
            }
            label="In Progress"
            value={
              inProgress
            }
            description="Currently under assessment"
          />


          <AdminStat
            icon={
              <FileCheck2
                size={22}
              />
            }
            label="Reports Ready"
            value={
              reportsReady
            }
            description="Report uploaded or completed"
          />

        </div>


        {/* =====================================
            INSPECTION MANAGEMENT
        ===================================== */}

        <section className="mt-8 sm:mt-9">


          {/* TITLE + FILTERS */}

          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5 mb-6">

            <div>

              <h2 className="text-xl sm:text-2xl font-black text-[#0b1220]">

                Customer Inspections

              </h2>


              <p className="text-sm text-gray-500 mt-1">

                Search, filter and manage
                submitted vehicle
                inspections.

              </p>

            </div>


            {/* SEARCH & FILTER */}

            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_220px] gap-3 w-full xl:w-auto">

              <div className="relative min-w-0">

                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />


                <input
                  type="text"
                  value={
                    search
                  }
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search customer, vehicle, ID..."
                  className="w-full xl:w-[320px] pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

              </div>


              <select
                value={
                  statusFilter
                }
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >

                <option value="All">
                  All Statuses
                </option>

                <option value="Submitted">
                  Submitted
                </option>

                <option value="Under Review">
                  Under Review
                </option>

                <option value="Inspection In Progress">
                  Inspection In Progress
                </option>

                <option value="Report Ready">
                  Report Ready
                </option>

                <option value="Completed">
                  Completed
                </option>

              </select>

            </div>

          </div>


          {/* =====================================
              LOADING
          ===================================== */}

          {loading && (

            <div className="gc-card p-9 sm:p-12 md:p-14 text-center">

              <Loader2
                size={32}
                className="animate-spin text-orange-500 mx-auto"
              />


              <p className="text-gray-500 mt-4">

                Loading inspections...

              </p>

            </div>
          )}


          {/* =====================================
              ERROR
          ===================================== */}

          {!loading &&
            error && (

            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 sm:p-6">

              <p className="text-red-700">

                {error}

              </p>


              <button
                type="button"
                onClick={
                  fetchInspections
                }
                className="font-bold text-red-700 underline mt-3"
              >

                Try Again

              </button>

            </div>
          )}


          {/* =====================================
              EMPTY
          ===================================== */}

          {!loading &&
            !error &&
            filteredInspections.length ===
              0 && (

            <div className="gc-card p-8 sm:p-12 text-center">

              <Car
                size={40}
                className="text-gray-300 mx-auto"
              />


              <h3 className="font-black text-xl text-[#0b1220] mt-4">

                No inspections found

              </h3>


              <p className="text-gray-500 mt-2">

                Try changing your search
                or status filter.

              </p>

            </div>
          )}


          {/* =====================================
              INSPECTIONS
          ===================================== */}

          {!loading &&
            !error &&
            filteredInspections.length >
              0 && (
            <>

              {/* =====================================
                  MOBILE / TABLET CARDS
              ===================================== */}

              <div className="lg:hidden space-y-4">

                {filteredInspections.map(
                  (
                    inspection
                  ) => (

                    <MobileInspectionCard
                      key={
                        inspection._id
                      }
                      inspection={
                        inspection
                      }
                    />
                  )
                )}

              </div>


              {/* =====================================
                  DESKTOP TABLE
              ===================================== */}

              <div className="hidden lg:block gc-card overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[1000px]">

                    <thead className="bg-gray-50 border-b border-gray-200">

                      <tr>

                        <TableHeading>
                          Inspection
                        </TableHeading>

                        <TableHeading>
                          Customer
                        </TableHeading>

                        <TableHeading>
                          Vehicle
                        </TableHeading>

                        <TableHeading>
                          Package
                        </TableHeading>

                        <TableHeading>
                          Media
                        </TableHeading>

                        <TableHeading>
                          Status
                        </TableHeading>

                        <TableHeading>
                          Report
                        </TableHeading>

                        <TableHeading>
                          Action
                        </TableHeading>

                      </tr>

                    </thead>


                    <tbody>

                      {filteredInspections.map(
                        (
                          inspection
                        ) => (

                          <InspectionRow
                            key={
                              inspection._id
                            }
                            inspection={
                              inspection
                            }
                          />
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </>
          )}


          {/* COUNT */}

          {!loading &&
            !error &&
            inspections.length >
              0 && (

            <p className="text-xs text-gray-400 mt-4">

              Showing{" "}
              {
                filteredInspections.length
              }
              {" of "}
              {
                inspections.length
              }
              {" inspections"}

            </p>
          )}

        </section>

      </div>

    </main>
  );
}


/* =====================================
   MOBILE INSPECTION CARD
===================================== */

function MobileInspectionCard({
  inspection,
}) {
  const vehicle =
    inspection.vehicle || {};

  const customer =
    inspection.customer || {};

  const accountUser =
    inspection.user || {};


  const customerName =
    customer.name ||
    accountUser.name ||
    "Customer";


  const customerEmail =
    customer.email ||
    accountUser.email ||
    "—";


  const mediaCount =
    inspection.media?.length ||
    0;


  return (
    <article className="gc-card overflow-hidden">


      {/* TOP */}

      <div className="p-5">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <div className="text-xs text-gray-400 uppercase tracking-wider">
              Inspection
            </div>


            <div className="font-black text-[#0b1220] mt-1 break-all">

              {
                inspection.inspectionNumber ||
                "—"
              }

            </div>


            <div className="text-xs text-gray-400 mt-1">

              {
                formatDate(
                  inspection.createdAt
                )
              }

            </div>

          </div>


          <StatusBadge
            status={
              inspection.status
            }
          />

        </div>


        {/* VEHICLE */}

        <div className="flex items-center gap-3 mt-5">

          <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">

            <Car
              size={20}
            />

          </div>


          <div className="min-w-0">

            <div className="font-bold text-[#0b1220] break-words">

              {vehicle.make ||
                "Vehicle"}{" "}

              {vehicle.model ||
                ""}

            </div>


            <div className="text-xs text-gray-400 mt-1 break-words">

              {vehicle.year ||
                "Year not provided"}

              {vehicle.registrationNumber
                ? ` • ${vehicle.registrationNumber}`
                : ""}

            </div>

          </div>

        </div>


        {/* CUSTOMER */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-100">

          <MobileInfo
            label="Customer"
            value={
              customerName
            }
          />


          <MobileInfo
            label="Email"
            value={
              customerEmail
            }
          />


          <MobileInfo
            label="Package"
            value={
              inspection.plan ||
              "—"
            }
            capitalize
          />


          <MobileInfo
            label="Media"
            value={`${mediaCount} file${
              mediaCount === 1
                ? ""
                : "s"
            }`}
          />

        </div>

      </div>


      {/* FOOTER */}

      <div className="bg-gray-50 border-t border-gray-100 px-5 py-4">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">


          {/* REPORT */}

          {inspection.reportUrl ? (

            <div className="inline-flex items-center gap-2 text-sm text-green-700 font-semibold">

              <CheckCircle2
                size={16}
              />

              Report Uploaded

            </div>

          ) : (

            <div className="inline-flex items-center gap-2 text-sm text-gray-500">

              <Clock3
                size={16}
              />

              Report Pending

            </div>
          )}


          {/* MANAGE */}

          <Link
            to={`/admin/inspections/${inspection._id}`}
            className="inline-flex items-center justify-center gap-2 bg-[#0b1220] hover:bg-[#151e2e] text-white rounded-xl px-4 py-3 text-sm font-bold transition"
          >

            Manage Inspection

            <ArrowRight
              size={16}
            />

          </Link>

        </div>

      </div>

    </article>
  );
}


/* =====================================
   MOBILE INFO
===================================== */

function MobileInfo({
  label,
  value,
  capitalize = false,
}) {
  return (
    <div className="min-w-0">

      <div className="text-[11px] uppercase tracking-wider text-gray-400">

        {label}

      </div>


      <div
        className={`text-sm font-semibold text-[#0b1220] mt-1 break-words ${
          capitalize
            ? "capitalize"
            : ""
        }`}
      >

        {value || "—"}

      </div>

    </div>
  );
}


/* =====================================
   DESKTOP TABLE ROW
===================================== */

function InspectionRow({
  inspection,
}) {
  const vehicle =
    inspection.vehicle || {};

  const customer =
    inspection.customer || {};

  const accountUser =
    inspection.user || {};


  const customerName =
    customer.name ||
    accountUser.name ||
    "Customer";


  const customerEmail =
    customer.email ||
    accountUser.email ||
    "—";


  const mediaCount =
    inspection.media?.length ||
    0;


  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70 transition">


      {/* INSPECTION */}

      <td className="px-5 py-5">

        <div className="font-bold text-[#0b1220]">

          {
            inspection.inspectionNumber
          }

        </div>


        <div className="text-xs text-gray-400 mt-1">

          {
            formatDate(
              inspection.createdAt
            )
          }

        </div>

      </td>


      {/* CUSTOMER */}

      <td className="px-5 py-5">

        <div className="font-semibold text-[#0b1220]">

          {
            customerName
          }

        </div>


        <div className="text-xs text-gray-400 mt-1 max-w-[180px] truncate">

          {
            customerEmail
          }

        </div>

      </td>


      {/* VEHICLE */}

      <td className="px-5 py-5">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">

            <Car
              size={17}
            />

          </div>


          <div>

            <div className="font-semibold text-[#0b1220]">

              {vehicle.make ||
                "—"}{" "}

              {vehicle.model ||
                ""}

            </div>


            <div className="text-xs text-gray-400 mt-1">

              {vehicle.year ||
                "—"}

              {vehicle.registrationNumber
                ? ` • ${vehicle.registrationNumber}`
                : ""}

            </div>

          </div>

        </div>

      </td>


      {/* PLAN */}

      <td className="px-5 py-5">

        <span className="capitalize font-semibold text-sm text-[#0b1220]">

          {
            inspection.plan ||
            "—"
          }

        </span>

      </td>


      {/* MEDIA */}

      <td className="px-5 py-5">

        <span className="inline-flex items-center gap-2 text-sm text-gray-600">

          <FileText
            size={15}
          />

          {
            mediaCount
          }

        </span>

      </td>


      {/* STATUS */}

      <td className="px-5 py-5">

        <StatusBadge
          status={
            inspection.status
          }
        />

      </td>


      {/* REPORT */}

      <td className="px-5 py-5">

        {inspection.reportUrl ? (

          <div className="inline-flex items-center gap-2 text-green-700 text-sm font-semibold">

            <CheckCircle2
              size={16}
            />

            Uploaded

          </div>

        ) : (

          <span className="text-sm text-gray-400">

            Pending

          </span>
        )}

      </td>


      {/* ACTION */}

      <td className="px-5 py-5">

        <Link
          to={`/admin/inspections/${inspection._id}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
        >

          Manage

          <ArrowRight
            size={15}
          />

        </Link>

      </td>

    </tr>
  );
}


/* =====================================
   STAT CARD
===================================== */

function AdminStat({
  icon,
  label,
  value,
  description,
}) {
  return (
    <div className="gc-card p-5 sm:p-6">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm text-gray-500">

            {label}

          </p>


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
   TABLE HEADING
===================================== */

function TableHeading({
  children,
}) {
  return (
    <th className="text-left px-5 py-4 text-xs uppercase tracking-wider font-bold text-gray-400">

      {children}

    </th>
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
      className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
        styles[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >

      {
        status ||
        "Unknown"
      }

    </span>
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


export default AdminDashboard;