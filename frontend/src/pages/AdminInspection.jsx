import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Car,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileCheck2,
  FileText,
  Image as ImageIcon,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  Upload,
  User,
  Video,
} from "lucide-react";

import api from "../services/api";


/* =====================================
   GUIDED CAPTURE LABELS
===================================== */

const CAPTURE_LABELS = {
  front: "Front View",
  rear: "Rear View",
  "left-side": "Left Side",
  "right-side": "Right Side",
  "front-left": "Front Left",
  "front-right": "Front Right",
  "rear-left": "Rear Left",
  "rear-right": "Rear Right",
  dashboard: "Dashboard",
  odometer: "Odometer",
  "front-interior": "Front Interior",
  "rear-interior": "Rear Interior",
  "engine-bay": "Engine Bay",
  "tyres-wheels": "Tyres / Wheels",
};


const CAPTURE_ORDER = [
  "front",
  "rear",
  "left-side",
  "right-side",
  "front-left",
  "front-right",
  "rear-left",
  "rear-right",
  "dashboard",
  "odometer",
  "front-interior",
  "rear-interior",
  "engine-bay",
  "tyres-wheels",
];


function getCaptureLabel(
  captureType
) {
  if (
    !captureType ||
    captureType === "Other"
  ) {
    return "Other Vehicle Media";
  }


  return (
    CAPTURE_LABELS[
      captureType
    ] ||
    captureType
  );
}


function getCaptureIndex(
  captureType
) {
  const index =
    CAPTURE_ORDER.indexOf(
      captureType
    );


  return index === -1
    ? 999
    : index;
}


/* =====================================
   PAGE
===================================== */

function AdminInspection() {
  const { id } =
    useParams();


  const [
    inspection,
    setInspection,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("");


  const [
    statusLoading,
    setStatusLoading,
  ] = useState(false);


  const [
    statusMessage,
    setStatusMessage,
  ] = useState("");


  const [
    reportFile,
    setReportFile,
  ] = useState(null);


  const [
    reportLoading,
    setReportLoading,
  ] = useState(false);


  const [
    reportMessage,
    setReportMessage,
  ] = useState("");


  const [
    reportError,
    setReportError,
  ] = useState("");


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
     FETCH INSPECTION
  ===================================== */

  const fetchInspection =
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
            `/admin/inspections/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const data =
          response.data
            .inspection ||
          response.data;


        setInspection(
          data
        );


        setSelectedStatus(
          data.status ||
          "Submitted"
        );

      } catch (err) {
        console.error(
          "Inspection fetch error:",
          err
        );


        setError(
          err.response?.data
            ?.message ||
            "Unable to load inspection."
        );

      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    fetchInspection();
  }, [id]);


  /* =====================================
     UPDATE STATUS
  ===================================== */

  const handleStatusUpdate =
    async () => {
      try {
        setStatusLoading(true);
        setStatusMessage("");


        const token =
          localStorage.getItem(
            "token"
          );


        const response =
          await api.patch(
            `/admin/inspections/${id}/status`,

            {
              status:
                selectedStatus,
            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const updatedInspection =
          response.data
            .inspection ||
          response.data;


        setInspection(
          (previous) => ({
            ...previous,
            ...updatedInspection,

            status:
              updatedInspection.status ||
              selectedStatus,
          })
        );


        setStatusMessage(
          "Inspection status updated successfully."
        );

      } catch (err) {
        console.error(
          "Status update error:",
          err
        );


        setStatusMessage(
          err.response?.data
            ?.message ||
            "Unable to update status."
        );

      } finally {
        setStatusLoading(false);
      }
    };


  /* =====================================
     REPORT FILE
  ===================================== */

  const handleReportFileChange =
    (e) => {
      const file =
        e.target.files?.[0];


      setReportError("");
      setReportMessage("");


      if (!file) {
        setReportFile(null);
        return;
      }


      if (
        file.type !==
        "application/pdf"
      ) {
        setReportError(
          "Please select a PDF file only."
        );

        e.target.value = "";

        return;
      }


      if (
        file.size >
        10 * 1024 * 1024
      ) {
        setReportError(
          "PDF must be smaller than 10 MB."
        );

        e.target.value = "";

        return;
      }


      setReportFile(
        file
      );
    };


  /* =====================================
     UPLOAD REPORT
  ===================================== */

  const handleReportUpload =
    async () => {
      if (!reportFile) {
        setReportError(
          "Please select a PDF report first."
        );

        return;
      }


      try {
        setReportLoading(true);

        setReportMessage("");
        setReportError("");


        const token =
          localStorage.getItem(
            "token"
          );


        const formData =
          new FormData();


        formData.append(
          "report",
          reportFile
        );


        const response =
          await api.post(
            `/admin/inspections/${id}/report`,

            formData,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const updatedInspection =
          response.data
            .inspection;


        if (
          updatedInspection
        ) {
          setInspection(
            updatedInspection
          );

          setSelectedStatus(
            updatedInspection.status
          );

        } else {
          await fetchInspection();
        }


        setReportFile(
          null
        );


        setReportMessage(
          "Final report uploaded successfully. Customer status is now Report Ready."
        );


        const fileInput =
          document.getElementById(
            "final-report-file"
          );


        if (fileInput) {
          fileInput.value = "";
        }

      } catch (err) {
        console.error(
          "Report upload error:",
          err
        );


        setReportError(
          err.response?.data
            ?.message ||
            "Unable to upload report."
        );

      } finally {
        setReportLoading(false);
      }
    };


  /* =====================================
     ADMIN ACCESS
  ===================================== */

  if (
    !user ||
    user.role !== "admin"
  ) {
    return (
      <PageMessage>

        <ShieldCheck
          size={44}
          className="text-red-500 mx-auto"
        />


        <h1 className="text-2xl font-black text-[#0b1220] mt-4">

          Admin Access Required

        </h1>


        <p className="text-gray-500 mt-3 leading-7">

          You do not have permission
          to access this inspection.

        </p>


        <Link
          to="/"
          className="gc-btn-primary mt-6"
        >

          Return Home

        </Link>

      </PageMessage>
    );
  }


  /* =====================================
     LOADING
  ===================================== */

  if (loading) {
    return (
      <PageMessage>

        <Loader2
          size={36}
          className="animate-spin text-orange-500 mx-auto"
        />


        <h1 className="text-xl font-black text-[#0b1220] mt-5">

          Loading inspection

        </h1>


        <p className="text-gray-500 mt-2">

          Please wait...

        </p>

      </PageMessage>
    );
  }


  /* =====================================
     ERROR
  ===================================== */

  if (
    error ||
    !inspection
  ) {
    return (
      <PageMessage>

        <p className="text-red-600">

          {error ||
            "Inspection not found."}

        </p>


        <button
          type="button"
          onClick={
            fetchInspection
          }
          className="gc-btn-primary mt-5"
        >

          Try Again

        </button>

      </PageMessage>
    );
  }


  /* =====================================
     DATA
  ===================================== */

  const vehicle =
    inspection.vehicle ||
    {};


  const customer =
    inspection.customer ||
    {};


  const account =
    inspection.user ||
    {};


  const media =
    inspection.media ||
    [];


  const sortedMedia = [
    ...media,
  ].sort(
    (a, b) =>
      getCaptureIndex(
        a.captureType
      ) -
      getCaptureIndex(
        b.captureType
      )
  );


  const images =
    sortedMedia.filter(
      (item) =>
        item.resourceType ===
          "image" ||
        item.mimeType?.startsWith(
          "image/"
        )
    );


  const videos =
    sortedMedia.filter(
      (item) =>
        item.resourceType ===
          "video" ||
        item.mimeType?.startsWith(
          "video/"
        )
    );


  const guidedCount =
    media.filter(
      (item) =>
        item.captureType &&
        item.captureType !==
          "Other"
    ).length;


  const guidedComplete =
    guidedCount >=
    CAPTURE_ORDER.length;


  return (
    <main className="min-h-screen bg-[#f5f7fa]">


      {/* =====================================
          HEADER
      ===================================== */}

      <section className="bg-[#0b1220] text-white">

        <div className="gc-container py-8 sm:py-9 md:py-11">

          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-5 sm:mb-6"
          >

            <ArrowLeft
              size={16}
            />

            Back to Admin Dashboard

          </Link>


          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-3 mb-3">

                <div className="text-orange-400 text-sm font-semibold break-all">

                  {
                    inspection.inspectionNumber
                  }

                </div>


                <StatusBadge
                  status={
                    inspection.status
                  }
                />

              </div>


              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight break-words">

                {vehicle.make ||
                  "Vehicle"}{" "}

                {vehicle.model ||
                  ""}

              </h1>


              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-slate-400">

                {vehicle.year && (

                  <span>
                    {vehicle.year}
                  </span>
                )}


                {vehicle.registrationNumber && (

                  <span className="break-all">

                    Registration:{" "}

                    {
                      vehicle.registrationNumber
                    }

                  </span>
                )}


                <span className="capitalize">

                  {inspection.plan}
                  {" Package"}

                </span>

              </div>

            </div>


            <button
              type="button"
              onClick={
                fetchInspection
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/15 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-white/10 transition"
            >

              <RefreshCw
                size={16}
              />

              Refresh

            </button>

          </div>

        </div>

      </section>


      {/* =====================================
          CONTENT
      ===================================== */}

      <div className="gc-container py-7 sm:py-9">

        <div className="grid xl:grid-cols-[minmax(0,1fr)_350px] gap-6 xl:gap-7">


          {/* =====================================
              LEFT SIDE
          ===================================== */}

          <div className="space-y-6 sm:space-y-7 min-w-0">


            {/* =====================================
                VEHICLE OVERVIEW
            ===================================== */}

            <section className="gc-card p-5 sm:p-6 md:p-8">

              <SectionHeading
                icon={
                  <Car
                    size={20}
                  />
                }
                title="Vehicle Overview"
                subtitle="Information submitted by the customer."
              />


              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 sm:gap-x-8 gap-y-6 mt-7">

                <DetailItem
                  label="Make"
                  value={
                    vehicle.make
                  }
                />


                <DetailItem
                  label="Model"
                  value={
                    vehicle.model
                  }
                />


                <DetailItem
                  label="Year"
                  value={
                    vehicle.year
                  }
                />


                <DetailItem
                  label="Registration"
                  value={
                    vehicle.registrationNumber
                  }
                  breakValue
                />


                <DetailItem
                  label="Mileage"
                  value={
                    vehicle.mileage
                      ? `${vehicle.mileage} km`
                      : null
                  }
                />


                <DetailItem
                  label="Color"
                  value={
                    vehicle.color
                  }
                />


                <DetailItem
                  label="Transmission"
                  value={
                    vehicle.transmission
                  }
                />


                <DetailItem
                  label="Fuel Type"
                  value={
                    vehicle.fuelType
                  }
                />


                <DetailItem
                  label="Package"
                  value={
                    inspection.plan
                  }
                  capitalize
                />

              </div>

            </section>


            {/* =====================================
                PURPOSE / NOTES
            ===================================== */}

            <section className="gc-card p-5 sm:p-6 md:p-8">

              <SectionHeading
                icon={
                  <ClipboardList
                    size={20}
                  />
                }
                title="Inspection Request"
                subtitle="Customer's purpose and additional notes."
              />


              <div className="grid md:grid-cols-2 gap-4 sm:gap-5 mt-6 sm:mt-7">

                <TextBox
                  title="Inspection Purpose"
                  text={
                    inspection.purpose
                  }
                />


                <TextBox
                  title="Additional Notes"
                  text={
                    inspection.notes
                  }
                />

              </div>

            </section>


            {/* =====================================
                GUIDED VEHICLE MEDIA
            ===================================== */}

            <section className="gc-card overflow-hidden">

              <div className="p-5 sm:p-6 md:p-8 border-b border-gray-100">

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                  <SectionHeading
                    icon={
                      <ImageIcon
                        size={20}
                      />
                    }
                    title="Submitted Vehicle Media"
                    subtitle={`${images.length} photos • ${videos.length} videos • ${guidedCount} guided views`}
                  />


                  <div
                    className={`self-start inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                      guidedComplete
                        ? "bg-green-50 text-green-700"
                        : "bg-orange-50 text-orange-700"
                    }`}
                  >

                    {guidedComplete ? (

                      <CheckCircle2
                        size={15}
                      />

                    ) : (

                      <ImageIcon
                        size={15}
                      />
                    )}


                    {guidedCount}/
                    {
                      CAPTURE_ORDER.length
                    }{" "}
                    Guided Views

                  </div>

                </div>

              </div>


              {media.length === 0 ? (

                <div className="p-8 sm:p-10 text-center">

                  <ImageIcon
                    size={38}
                    className="text-gray-300 mx-auto"
                  />


                  <p className="text-gray-500 mt-3">

                    No vehicle media uploaded.

                  </p>

                </div>

              ) : (

                <div className="p-5 sm:p-6 md:p-8">


                  {/* =====================================
                      PHOTOS
                  ===================================== */}

                  {images.length >
                    0 && (

                    <div>

                      <h3 className="font-bold text-[#0b1220] flex items-center gap-2">

                        <ImageIcon
                          size={17}
                        />

                        Guided Photos

                      </h3>


                      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4">

                        {images.map(
                          (
                            item,
                            index
                          ) => (

                            <a
                              key={
                                item._id ||
                                `${item.captureType}-${index}`
                              }
                              href={
                                item.url
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="group min-w-0 rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-orange-300 hover:shadow-md transition"
                            >

                              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">

                                <img
                                  src={
                                    item.url
                                  }
                                  alt={
                                    getCaptureLabel(
                                      item.captureType
                                    )
                                  }
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />


                                <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">

                                  <span className="inline-flex items-center bg-[#0b1220]/90 text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-lg shadow">

                                    {
                                      getCaptureLabel(
                                        item.captureType
                                      )
                                    }

                                  </span>

                                </div>


                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">

                                  <ExternalLink
                                    size={24}
                                    className="text-white opacity-0 group-hover:opacity-100 transition"
                                  />

                                </div>

                              </div>


                              <div className="p-4 min-w-0">

                                <div className="font-bold text-[#0b1220] break-words">

                                  {
                                    getCaptureLabel(
                                      item.captureType
                                    )
                                  }

                                </div>


                                <div className="text-xs text-gray-400 mt-1 truncate">

                                  {
                                    item.originalName ||
                                    `Vehicle Photo ${index + 1}`
                                  }

                                </div>


                                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 mt-3">

                                  <ExternalLink
                                    size={13}
                                  />

                                  Open Full Image

                                </div>

                              </div>

                            </a>
                          )
                        )}

                      </div>

                    </div>
                  )}


                  {/* =====================================
                      VIDEOS
                  ===================================== */}

                  {videos.length >
                    0 && (

                    <div
                      className={
                        images.length
                          ? "mt-9"
                          : ""
                      }
                    >

                      <h3 className="font-bold text-[#0b1220] flex items-center gap-2">

                        <Video
                          size={17}
                        />

                        Guided Videos

                      </h3>


                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">

                        {videos.map(
                          (
                            item,
                            index
                          ) => (

                            <div
                              key={
                                item._id ||
                                `${item.captureType}-${index}`
                              }
                              className="min-w-0 rounded-2xl overflow-hidden border border-gray-200 bg-white"
                            >

                              <div className="px-4 py-3 border-b border-gray-100 flex items-start justify-between gap-3">

                                <div className="min-w-0">

                                  <div className="font-bold text-[#0b1220] break-words">

                                    {
                                      getCaptureLabel(
                                        item.captureType
                                      )
                                    }

                                  </div>


                                  <div className="text-xs text-gray-400 mt-0.5 truncate">

                                    {
                                      item.originalName ||
                                      `Vehicle Video ${index + 1}`
                                    }

                                  </div>

                                </div>


                                <span className="shrink-0 text-[10px] uppercase tracking-wider font-bold bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full">

                                  Video

                                </span>

                              </div>


                              <video
                                controls
                                src={
                                  item.url
                                }
                                className="w-full aspect-video bg-black"
                              />

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                </div>
              )}

            </section>

          </div>


          {/* =====================================
              RIGHT SIDEBAR
          ===================================== */}

          <aside className="space-y-5 sm:space-y-6 min-w-0">


            {/* =====================================
                CUSTOMER
            ===================================== */}

            <section className="gc-card p-5 sm:p-6">

              <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">

                Customer

              </div>


              <div className="flex items-center gap-3 mt-4 min-w-0">

                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">

                  <User
                    size={21}
                  />

                </div>


                <div className="min-w-0">

                  <div className="font-black text-[#0b1220] break-words">

                    {customer.name ||
                      account.name ||
                      "Customer"}

                  </div>


                  <div className="text-xs text-gray-400 mt-1">

                    GaariCheck Customer

                  </div>

                </div>

              </div>


              <div className="space-y-3 mt-6">

                <ContactItem
                  icon={
                    <Mail
                      size={16}
                    />
                  }
                  value={
                    customer.email ||
                    account.email
                  }
                />


                <ContactItem
                  icon={
                    <Phone
                      size={16}
                    />
                  }
                  value={
                    customer.phone ||
                    account.phone
                  }
                />


                <ContactItem
                  icon={
                    <MapPin
                      size={16}
                    />
                  }
                  value={
                    customer.city
                  }
                />

              </div>

            </section>


            {/* =====================================
                STATUS MANAGEMENT
            ===================================== */}

            <section className="gc-card p-5 sm:p-6">

              <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">

                Inspection Management

              </div>


              <h3 className="font-black text-xl text-[#0b1220] mt-2">

                Update Status

              </h3>


              <div className="mt-4">

                <div className="text-xs text-gray-400">
                  Current Status
                </div>


                <div className="mt-2">

                  <LightStatusBadge
                    status={
                      inspection.status
                    }
                  />

                </div>

              </div>


              <label className="block text-sm font-bold text-[#0b1220] mt-5">

                Change Status

              </label>


              <select
                value={
                  selectedStatus
                }
                onChange={(e) => {
                  setSelectedStatus(
                    e.target.value
                  );

                  setStatusMessage(
                    ""
                  );
                }}
                className="w-full mt-2 px-4 py-3.5 border border-gray-200 rounded-xl bg-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >

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


              <button
                type="button"
                onClick={
                  handleStatusUpdate
                }
                disabled={
                  statusLoading
                }
                className="gc-btn-primary w-full min-h-12 mt-4 gap-2 disabled:opacity-60"
              >

                {statusLoading ? (
                  <>

                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Updating...

                  </>
                ) : (
                  <>

                    <Save
                      size={17}
                    />

                    Update Status

                  </>
                )}

              </button>


              {statusMessage && (

                <div className="mt-3 bg-gray-50 rounded-lg p-3 text-xs text-gray-600 leading-5">

                  {statusMessage}

                </div>
              )}

            </section>


            {/* =====================================
                REPORT
            ===================================== */}

            <section className="gc-card p-5 sm:p-6">

              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 font-bold">

                <FileCheck2
                  size={16}
                />

                Final Report

              </div>


              {inspection.reportUrl ? (

                <div className="mt-5">

                  <div className="bg-green-50 border border-green-100 rounded-xl p-4">

                    <div className="flex items-start gap-3">

                      <CheckCircle2
                        size={20}
                        className="text-green-600 shrink-0 mt-0.5"
                      />


                      <div className="min-w-0">

                        <div className="font-bold text-green-800">

                          Report Available

                        </div>


                        <div className="text-xs text-green-700 mt-1 break-all">

                          {
                            inspection.reportOriginalName ||
                            "Inspection Report.pdf"
                          }

                        </div>

                      </div>

                    </div>

                  </div>


                  <a
                    href={
                      inspection.reportUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="w-full min-h-12 mt-3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#0b1220] font-bold hover:border-orange-300 transition"
                  >

                    <ExternalLink
                      size={16}
                    />

                    View Current Report

                  </a>


                  <p className="text-xs text-gray-400 mt-4 leading-5">

                    Uploading another PDF
                    will replace the current
                    report.

                  </p>

                </div>

              ) : (

                <div className="mt-5 bg-gray-50 rounded-xl p-4 text-sm text-gray-500 leading-6">

                  No final report has been
                  uploaded yet.

                </div>
              )}


              {/* FILE INPUT */}

              <div className="mt-5">

                <label className="block text-sm font-bold text-[#0b1220] mb-2">

                  {
                    inspection.reportUrl
                      ? "Replace PDF Report"
                      : "Upload PDF Report"
                  }

                </label>


                <label className="block border-2 border-dashed border-gray-200 hover:border-orange-300 rounded-xl p-4 cursor-pointer transition">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 shrink-0 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">

                      <Upload
                        size={19}
                      />

                    </div>


                    <div className="min-w-0">

                      <div className="text-sm font-bold text-[#0b1220]">

                        {reportFile
                          ? "PDF selected"
                          : "Choose PDF report"}

                      </div>


                      <div className="text-xs text-gray-400 mt-1 break-all">

                        {reportFile
                          ? reportFile.name
                          : "PDF only • Maximum 10 MB"}

                      </div>

                    </div>

                  </div>


                  <input
                    id="final-report-file"
                    type="file"
                    accept="application/pdf"
                    onChange={
                      handleReportFileChange
                    }
                    className="hidden"
                  />

                </label>

              </div>


              {reportError && (

                <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-600 leading-5">

                  {reportError}

                </div>
              )}


              {reportMessage && (

                <div className="mt-3 bg-green-50 border border-green-100 rounded-lg p-3 text-xs text-green-700 leading-5">

                  {reportMessage}

                </div>
              )}


              <button
                type="button"
                onClick={
                  handleReportUpload
                }
                disabled={
                  reportLoading ||
                  !reportFile
                }
                className="w-full min-h-12 mt-4 bg-[#0b1220] text-white rounded-xl py-3 px-4 font-bold flex items-center justify-center gap-2 hover:bg-[#151e2e] transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >

                {reportLoading ? (
                  <>

                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Uploading...

                  </>
                ) : (
                  <>

                    <Upload
                      size={17}
                    />

                    {
                      inspection.reportUrl
                        ? "Replace Report"
                        : "Upload Final Report"
                    }

                  </>
                )}

              </button>


              <p className="text-[11px] text-gray-400 leading-5 mt-3">

                PDF only • Maximum 10 MB.
                Uploading a report will set
                the inspection status to
                Report Ready and send the
                customer notification email.

              </p>

            </section>


            {/* =====================================
                SUBMISSION DETAILS
            ===================================== */}

            <section className="gc-card p-5 sm:p-6">

              <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">

                Submission Details

              </div>


              <div className="space-y-4 mt-5">

                <SmallInfo
                  icon={
                    <CalendarDays
                      size={16}
                    />
                  }
                  label="Submitted"
                  value={
                    formatDateTime(
                      inspection.createdAt
                    )
                  }
                />


                <SmallInfo
                  icon={
                    <ImageIcon
                      size={16}
                    />
                  }
                  label="Media Files"
                  value={`${media.length} uploaded`}
                />


                <SmallInfo
                  icon={
                    <CheckCircle2
                      size={16}
                    />
                  }
                  label="Guided Views"
                  value={`${guidedCount}/${CAPTURE_ORDER.length}`}
                />


                <SmallInfo
                  icon={
                    <FileText
                      size={16}
                    />
                  }
                  label="Inspection ID"
                  value={
                    inspection.inspectionNumber
                  }
                />

              </div>

            </section>

          </aside>

        </div>

      </div>

    </main>
  );
}


/* =====================================
   PAGE MESSAGE
===================================== */

function PageMessage({
  children,
}) {
  return (
    <main className="min-h-[70vh] bg-[#f5f7fa] flex items-center justify-center px-4 py-10">

      <div className="gc-card p-6 sm:p-8 text-center max-w-md w-full">

        {children}

      </div>

    </main>
  );
}


/* =====================================
   SECTION HEADING
===================================== */

function SectionHeading({
  icon,
  title,
  subtitle,
}) {
  return (
    <div className="min-w-0">

      <div className="flex items-center gap-2">

        <div className="text-orange-600 shrink-0">
          {icon}
        </div>


        <h2 className="text-xl md:text-2xl font-black text-[#0b1220]">

          {title}

        </h2>

      </div>


      {subtitle && (

        <p className="text-sm text-gray-500 mt-2 leading-6">

          {subtitle}

        </p>
      )}

    </div>
  );
}


/* =====================================
   DETAIL ITEM
===================================== */

function DetailItem({
  label,
  value,
  capitalize,
  breakValue = false,
}) {
  return (
    <div className="min-w-0">

      <div className="text-[11px] sm:text-xs uppercase tracking-wider text-gray-400">

        {label}

      </div>


      <div
        className={`font-semibold text-sm sm:text-base text-[#0b1220] mt-1.5 ${
          capitalize
            ? "capitalize"
            : ""
        } ${
          breakValue
            ? "break-all"
            : "break-words"
        }`}
      >

        {value || "—"}

      </div>

    </div>
  );
}


/* =====================================
   TEXT BOX
===================================== */

function TextBox({
  title,
  text,
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 sm:p-5 min-w-0">

      <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">

        {title}

      </div>


      <p className="text-sm sm:text-base text-gray-700 mt-2 leading-7 break-words">

        {text ||
          "No information provided."}

      </p>

    </div>
  );
}


/* =====================================
   CONTACT ITEM
===================================== */

function ContactItem({
  icon,
  value,
}) {
  if (!value) {
    return null;
  }


  return (
    <div className="flex items-start gap-3 text-sm text-gray-500 min-w-0">

      <div className="text-gray-400 mt-0.5 shrink-0">

        {icon}

      </div>


      <span className="break-all min-w-0">

        {value}

      </span>

    </div>
  );
}


/* =====================================
   SMALL INFO
===================================== */

function SmallInfo({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex gap-3 min-w-0">

      <div className="w-9 h-9 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center shrink-0">

        {icon}

      </div>


      <div className="min-w-0">

        <div className="text-xs text-gray-400">

          {label}

        </div>


        <div className="text-sm font-semibold text-[#0b1220] mt-0.5 break-all">

          {value || "—"}

        </div>

      </div>

    </div>
  );
}


/* =====================================
   DARK STATUS BADGE
===================================== */

function StatusBadge({
  status,
}) {
  const styles = {
    Submitted:
      "bg-blue-500/15 text-blue-300",

    "Under Review":
      "bg-yellow-500/15 text-yellow-300",

    "Inspection In Progress":
      "bg-orange-500/15 text-orange-300",

    "Report Ready":
      "bg-green-500/15 text-green-300",

    Completed:
      "bg-green-500/15 text-green-300",
  };


  return (
    <span
      className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
        styles[status] ||
        "bg-white/10 text-slate-300"
      }`}
    >

      {status}

    </span>
  );
}


/* =====================================
   LIGHT STATUS BADGE
===================================== */

function LightStatusBadge({
  status,
}) {
  const styles = {
    Submitted:
      "bg-blue-50 text-blue-700",

    "Under Review":
      "bg-yellow-50 text-yellow-700",

    "Inspection In Progress":
      "bg-orange-50 text-orange-700",

    "Report Ready":
      "bg-green-50 text-green-700",

    Completed:
      "bg-green-50 text-green-700",
  };


  return (
    <span
      className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${
        styles[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >

      {status}

    </span>
  );
}


/* =====================================
   DATE
===================================== */

function formatDateTime(
  date
) {
  if (!date) {
    return "—";
  }


  return new Date(
    date
  ).toLocaleString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


export default AdminInspection;