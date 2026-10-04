import { useState } from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Camera,
  Car,
  CheckCircle2,
  ClipboardList,
  FileVideo,
  Image as ImageIcon,
  Info,
  Loader2,
  Trash2,
  Upload,
  User,
} from "lucide-react";

import api from "../services/api";


function NewInspection() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const plan =
    searchParams.get("plan");

  const paymentId =
    searchParams.get("payment");


  const storedUser = JSON.parse(
    localStorage.getItem("user") ||
      "{}"
  );


  const [formData, setFormData] =
    useState({
      name: storedUser.name || "",
      email: storedUser.email || "",
      phone: storedUser.phone || "",
      city: "",

      make: "",
      model: "",
      year: "",
      registrationNumber: "",
      mileage: "",
      color: "",
      transmission: "",
      fuelType: "",

      purpose: "",
      notes: "",
    });


  /*
    selectedFiles structure:

    [
      {
        file: File,
        captureType: "front",
        title: "Front View"
      }
    ]
  */

  const [
    selectedFiles,
    setSelectedFiles,
  ] = useState([]);


  const [loading, setLoading] =
    useState(false);

  const [
    uploadProgress,
    setUploadProgress,
  ] = useState(0);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  /* ======================================
     PLAN DATA
  ====================================== */

  const plans = {
    basic: {
      name: "Basic",
      price: "2,999",
    },

    standard: {
      name: "Standard",
      price: "4,999",
    },

    premium: {
      name: "Premium",
      price: "7,999",
    },
  };


  const selectedPlan =
    plans[plan];


  /* ======================================
     GUIDED CAPTURE LIST
  ====================================== */

  const requiredCaptures = [
    {
      id: "front",
      title: "Front View",
      description:
        "Capture the complete front of the vehicle.",
    },

    {
      id: "rear",
      title: "Rear View",
      description:
        "Capture the complete rear of the vehicle.",
    },

    {
      id: "left-side",
      title: "Left Side",
      description:
        "Capture the complete left side of the vehicle.",
    },

    {
      id: "right-side",
      title: "Right Side",
      description:
        "Capture the complete right side of the vehicle.",
    },

    {
      id: "front-left",
      title: "Front Left",
      description:
        "Take a clear diagonal front-left photo or video.",
    },

    {
      id: "front-right",
      title: "Front Right",
      description:
        "Take a clear diagonal front-right photo or video.",
    },

    {
      id: "rear-left",
      title: "Rear Left",
      description:
        "Take a clear diagonal rear-left photo or video.",
    },

    {
      id: "rear-right",
      title: "Rear Right",
      description:
        "Take a clear diagonal rear-right photo or video.",
    },

    {
      id: "dashboard",
      title: "Dashboard",
      description:
        "Capture the complete dashboard clearly.",
    },

    {
      id: "odometer",
      title: "Odometer",
      description:
        "Capture a clear photo showing the mileage.",
    },

    {
      id: "front-interior",
      title: "Front Interior",
      description:
        "Capture front seats, console and visible interior condition.",
    },

    {
      id: "rear-interior",
      title: "Rear Interior",
      description:
        "Capture rear seats and visible interior condition.",
    },

    {
      id: "engine-bay",
      title: "Engine Bay",
      description:
        "Open the bonnet and capture the engine compartment clearly.",
    },

    {
      id: "tyres-wheels",
      title: "Tyres / Wheels",
      description:
        "Capture the tyres and wheels clearly.",
    },
  ];


  const captureProgress =
    Math.round(
      (selectedFiles.length /
        requiredCaptures.length) *
        100
    );


  /* ======================================
     FORM CHANGE
  ====================================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };


  /* ======================================
     GUIDED FILE CHANGE
  ====================================== */

  const handleGuidedFileChange = (
    e,
    capture
  ) => {
    setError("");

    const file =
      e.target.files?.[0];


    if (!file) {
      return;
    }


    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/quicktime",
    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Only JPG, PNG, WEBP, MP4 and MOV files are allowed."
      );

      e.target.value = "";

      return;
    }


    if (
      file.size >
      30 * 1024 * 1024
    ) {
      setError(
        "Each file must be smaller than 30 MB."
      );

      e.target.value = "";

      return;
    }


    setSelectedFiles(
      (currentFiles) => {

        const remainingFiles =
          currentFiles.filter(
            (item) =>
              item.captureType !==
              capture.id
          );


        return [
          ...remainingFiles,

          {
            file,
            captureType:
              capture.id,
            title:
              capture.title,
          },
        ];
      }
    );


    e.target.value = "";
  };


  /* ======================================
     REMOVE FILE
  ====================================== */

  const removeFile = (
    captureType
  ) => {
    setSelectedFiles(
      (currentFiles) =>
        currentFiles.filter(
          (item) =>
            item.captureType !==
            captureType
        )
    );
  };


  /* ======================================
     SUBMIT
  ====================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setUploadProgress(0);


    const token =
      localStorage.getItem(
        "token"
      );


    /* LOGIN CHECK */

    if (!token) {
      setError(
        "Please login before submitting an inspection."
      );

      return;
    }


    /* PACKAGE CHECK */

    if (!selectedPlan) {
      setError(
        "Please select an inspection package first."
      );

      return;
    }


    /* ======================================
       PAYMENT CHECK
       KEEPING YOUR EXISTING PAYMENT FLOW
    ====================================== */

    if (!paymentId) {
      setError(
        "An approved payment is required before starting an inspection."
      );

      return;
    }


    /* ======================================
       GUIDED MEDIA CHECK
    ====================================== */

    const missingCaptures =
      requiredCaptures.filter(
        (capture) =>
          !selectedFiles.some(
            (item) =>
              item.captureType ===
              capture.id
          )
      );


    if (
      missingCaptures.length > 0
    ) {
      setError(
        `Please complete all required vehicle views. ${missingCaptures.length} remaining.`
      );

      return;
    }


    try {
      setLoading(true);


      /* ==================================
         CREATE INSPECTION
      ================================== */

      const inspectionResponse =
        await api.post(
          "/inspections",

          {
            plan,

            paymentId,

            customer: {
              name:
                formData.name,

              email:
                formData.email,

              phone:
                formData.phone,

              city:
                formData.city,
            },

            vehicle: {
              make:
                formData.make,

              model:
                formData.model,

              year:
                formData.year,

              registrationNumber:
                formData.registrationNumber,

              mileage:
                formData.mileage,

              color:
                formData.color,

              transmission:
                formData.transmission,

              fuelType:
                formData.fuelType,
            },

            purpose:
              formData.purpose,

            notes:
              formData.notes,
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const createdInspection =
        inspectionResponse.data
          .inspection ||
        inspectionResponse.data;


      const inspectionId =
        createdInspection._id;


      if (!inspectionId) {
        throw new Error(
          "Inspection ID was not returned by the server."
        );
      }


      /* ==================================
         ORDER GUIDED FILES
      ================================== */

      const orderedFiles =
        requiredCaptures.map(
          (capture) =>
            selectedFiles.find(
              (item) =>
                item.captureType ===
                capture.id
            )
        );


      /* ==================================
         UPLOAD MEDIA
      ================================== */

      const mediaFormData =
        new FormData();


      orderedFiles.forEach(
        (item) => {
          mediaFormData.append(
            "media",
            item.file
          );
        }
      );


      mediaFormData.append(
        "captureTypes",

        JSON.stringify(
          orderedFiles.map(
            (item) =>
              item.captureType
          )
        )
      );


      await api.post(
        `/inspections/${inspectionId}/upload`,

        mediaFormData,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          onUploadProgress: (
            progressEvent
          ) => {

            if (
              progressEvent.total
            ) {

              const percent =
                Math.round(
                  (progressEvent.loaded *
                    100) /
                    progressEvent.total
                );


              setUploadProgress(
                percent
              );
            }
          },
        }
      );


      setMessage(
        "Vehicle inspection submitted successfully."
      );


      setUploadProgress(100);


      setTimeout(() => {
        navigate(
          "/dashboard"
        );
      }, 1800);


    } catch (err) {

      console.error(
        "Inspection submit error:",
        err
      );


      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Unable to submit inspection."
      );


    } finally {

      setLoading(false);
    }
  };


  /* ======================================
     NO PLAN
  ====================================== */

  if (!selectedPlan) {
    return (
      <main className="min-h-[70vh] bg-[#f5f7fa] flex items-center justify-center px-4">

        <div className="gc-card max-w-md w-full p-8 text-center">

          <Car
            size={42}
            className="text-orange-500 mx-auto"
          />


          <h1 className="text-2xl font-black text-[#0b1220] mt-5">
            Select an inspection package
          </h1>


          <p className="text-gray-500 leading-7 mt-3">
            Choose Basic, Standard or
            Premium before submitting
            your vehicle.
          </p>


          <Link
            to="/pricing"
            className="gc-btn-primary mt-6"
          >
            View Packages
          </Link>

        </div>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#f5f7fa]">


      {/* ======================================
          HEADER
      ====================================== */}

      <section className="bg-[#0b1220] text-white">

        <div className="gc-container py-8 sm:py-10">

          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft
              size={16}
            />

            Back to packages
          </Link>


          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-7">

            <div>

              <div className="text-orange-400 text-sm font-bold">
                New Inspection
              </div>


              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2 leading-tight">
                Tell us about the vehicle.
              </h1>


              <p className="text-slate-400 max-w-2xl mt-3 leading-7">
                Complete the vehicle
                details and upload the
                required guided photos or
                videos for remote review.
              </p>

            </div>


            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">

              <div className="text-xs text-slate-400 uppercase tracking-wider">
                Selected Package
              </div>


              <div className="flex items-end gap-3 mt-1">

                <span className="font-black text-xl">
                  {
                    selectedPlan.name
                  }
                </span>


                <span className="text-orange-400 font-bold">
                  PKR{" "}
                  {
                    selectedPlan.price
                  }
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      <div className="gc-container py-9">


        {/* SUCCESS */}

        {message && (
          <div className="mb-6 bg-green-50 border border-green-100 text-green-700 rounded-xl p-4 flex items-start gap-3">

            <CheckCircle2
              size={20}
              className="mt-0.5"
            />


            <span>
              {message}
            </span>

          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-700 rounded-xl p-4">

            {error}

          </div>
        )}


        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="grid xl:grid-cols-[minmax(0,1fr)_330px] gap-6 xl:gap-7">


            {/* ======================================
                FORM CONTENT
            ====================================== */}

            <div className="space-y-6 md:space-y-7 min-w-0">


              {/* CUSTOMER */}

              <FormSection
                icon={
                  <User
                    size={21}
                  />
                }
                title="Customer Information"
                subtitle="Tell us who is requesting the inspection."
              >

                <div className="grid md:grid-cols-2 gap-5">

                  <InputField
                    label="Full Name"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Full name"
                  />


                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="you@example.com"
                  />


                  <InputField
                    label="Phone Number"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="03XX XXXXXXX"
                  />


                  <InputField
                    label="City"
                    name="city"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Karachi"
                  />

                </div>

              </FormSection>


              {/* VEHICLE */}

              <FormSection
                icon={
                  <Car
                    size={21}
                  />
                }
                title="Vehicle Information"
                subtitle="Enter the vehicle details as accurately as possible."
              >

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                  <InputField
                    label="Make"
                    name="make"
                    value={
                      formData.make
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Toyota"
                  />


                  <InputField
                    label="Model"
                    name="model"
                    value={
                      formData.model
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Corolla"
                  />


                  <InputField
                    label="Year"
                    name="year"
                    type="number"
                    value={
                      formData.year
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="2021"
                  />


                  <InputField
                    label="Registration Number"
                    name="registrationNumber"
                    value={
                      formData.registrationNumber
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="ABC-123"
                  />


                  <InputField
                    label="Mileage (km)"
                    name="mileage"
                    type="number"
                    value={
                      formData.mileage
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="45000"
                  />


                  <InputField
                    label="Color"
                    name="color"
                    value={
                      formData.color
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="White"
                  />


                  <SelectField
                    label="Transmission"
                    name="transmission"
                    value={
                      formData.transmission
                    }
                    onChange={
                      handleChange
                    }
                    options={[
                      "Automatic",
                      "Manual",
                      "CVT",
                      "Other",
                    ]}
                  />


                  <SelectField
                    label="Fuel Type"
                    name="fuelType"
                    value={
                      formData.fuelType
                    }
                    onChange={
                      handleChange
                    }
                    options={[
                      "Petrol",
                      "Diesel",
                      "Hybrid",
                      "Electric",
                      "CNG",
                      "Other",
                    ]}
                  />

                </div>

              </FormSection>


              {/* PURPOSE */}

              <FormSection
                icon={
                  <ClipboardList
                    size={21}
                  />
                }
                title="Inspection Request"
                subtitle="Help our team understand why the vehicle is being checked."
              >

                <div className="space-y-5">

                  <div>

                    <label className="block text-sm font-semibold text-[#0b1220] mb-2">
                      Inspection Purpose
                    </label>


                    <select
                      name="purpose"
                      value={
                        formData.purpose
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    >

                      <option value="">
                        Select purpose
                      </option>


                      <option value="Buying a used vehicle">
                        Buying a used vehicle
                      </option>


                      <option value="Selling a vehicle">
                        Selling a vehicle
                      </option>


                      <option value="General condition check">
                        General condition check
                      </option>


                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>


                  <div>

                    <label className="block text-sm font-semibold text-[#0b1220] mb-2">
                      Additional Notes
                    </label>


                    <textarea
                      name="notes"
                      value={
                        formData.notes
                      }
                      onChange={
                        handleChange
                      }
                      rows={5}
                      placeholder="Tell us anything specific you want our team to pay attention to..."
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />

                  </div>

                </div>

              </FormSection>


              {/* ======================================
                  GUIDED MEDIA
              ====================================== */}

              <FormSection
                icon={
                  <Camera
                    size={21}
                  />
                }
                title="Guided Vehicle Capture"
                subtitle="Complete each required vehicle view for a structured remote visual review."
              >


                {/* PROGRESS */}

                <div className="bg-[#0b1220] rounded-2xl p-5 text-white">

                  <div className="flex items-center justify-between gap-5">

                    <div>

                      <div className="text-sm text-slate-400">
                        Capture Progress
                      </div>


                      <div className="text-xl font-black mt-1">
                        {selectedFiles.length}
                        {" / "}
                        {requiredCaptures.length}
                        {" completed"}
                      </div>

                    </div>


                    <div className="text-2xl font-black text-orange-400">
                      {captureProgress}%
                    </div>

                  </div>


                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mt-4">

                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-300"
                      style={{
                        width:
                          `${captureProgress}%`,
                      }}
                    />

                  </div>

                </div>


                {/* INSTRUCTIONS */}

                <div className="mt-5 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">

                  <Info
                    size={19}
                    className="text-blue-600 shrink-0 mt-0.5"
                  />


                  <p className="text-sm text-blue-800 leading-6">

                    Capture each required
                    view in good lighting.
                    Keep the requested
                    vehicle area visible
                    and avoid blurry photos
                    or videos.

                  </p>

                </div>


                {/* CAPTURE CARDS */}

                <div className="grid md:grid-cols-2 gap-4 mt-6">

                  {requiredCaptures.map(
                    (capture) => {

                      const selected =
                        selectedFiles.find(
                          (item) =>
                            item.captureType ===
                            capture.id
                        );


                      return (
                        <GuidedCaptureCard
                          key={
                            capture.id
                          }
                          capture={
                            capture
                          }
                          selected={
                            selected
                          }
                          onFileChange={
                            handleGuidedFileChange
                          }
                          onRemove={
                            removeFile
                          }
                        />
                      );
                    }
                  )}

                </div>


                {/* UPLOAD PROGRESS */}

                {loading &&
                  uploadProgress > 0 && (

                  <div className="mt-7">

                    <div className="flex justify-between text-xs text-gray-500 mb-2">

                      <span>
                        Uploading vehicle media
                      </span>


                      <span>
                        {uploadProgress}%
                      </span>

                    </div>


                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-300"
                        style={{
                          width:
                            `${uploadProgress}%`,
                        }}
                      />

                    </div>

                  </div>
                )}


                <div className="mt-6 flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl p-4">

                  <Info
                    size={19}
                    className="text-orange-600 shrink-0 mt-0.5"
                  />


                  <p className="text-sm text-orange-900 leading-6">

                    GaariCheck performs a
                    remote visual review
                    based on the photos,
                    videos and information
                    submitted by the
                    customer. It does not
                    replace physical
                    mechanical inspection
                    or workshop diagnostics.

                  </p>

                </div>

              </FormSection>

            </div>


            {/* ======================================
                SIDEBAR
            ====================================== */}

            <aside className="space-y-5 xl:sticky xl:top-28 self-start">


              {/* PACKAGE */}

              <div className="gc-card p-6">

                <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                  Inspection Package
                </div>


                <h3 className="text-2xl font-black text-[#0b1220] mt-2">
                  {
                    selectedPlan.name
                  }
                </h3>


                <div className="mt-4">

                  <span className="text-xs text-gray-400">
                    PKR
                  </span>


                  <span className="text-3xl font-black text-[#0b1220] ml-2">
                    {
                      selectedPlan.price
                    }
                  </span>

                </div>


                {/* KEEPING EXISTING PAYMENT DISPLAY */}

                <div className="mt-5 bg-green-50 border border-green-100 rounded-xl p-3">

                  <div className="flex items-start gap-2">

                    <CheckCircle2
                      size={17}
                      className="text-green-600 shrink-0 mt-0.5"
                    />


                    <div>

                      <div className="text-sm font-bold text-green-800">
                        Payment Approved
                      </div>


                      <div className="text-xs text-green-700 mt-1 break-all">

                        Payment ID:{" "}
                        {paymentId}

                      </div>

                    </div>

                  </div>

                </div>

              </div>


              {/* CHECKLIST */}

              <div className="bg-[#0b1220] rounded-[20px] p-6 text-white">

                <div className="text-orange-400 text-xs uppercase tracking-wider font-bold">
                  Before submitting
                </div>


                <div className="space-y-4 mt-5">

                  <ChecklistItem
                    text={`${selectedFiles.length}/${requiredCaptures.length} required vehicle views completed`}
                    complete={
                      selectedFiles.length ===
                      requiredCaptures.length
                    }
                  />


                  <ChecklistItem
                    text="Vehicle details are correct"
                  />


                  <ChecklistItem
                    text="Registration number is correct"
                  />


                  <ChecklistItem
                    text="Photos/videos are clear and visible"
                  />


                  <ChecklistItem
                    text="Any specific concerns are mentioned"
                  />

                </div>

              </div>


              {/* SUBMIT */}

              <div className="gc-card p-6">

                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  className="gc-btn-primary w-full py-4 gap-2"
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload
                        size={18}
                      />

                      Submit Inspection
                    </>
                  )}

                </button>


                {selectedFiles.length !==
                  requiredCaptures.length && (

                  <p className="text-xs text-orange-600 leading-5 mt-4 text-center">

                    Complete all{" "}
                    {requiredCaptures.length}
                    {" "}
                    required vehicle views
                    before submitting.

                  </p>
                )}


                <p className="text-xs text-gray-400 leading-5 mt-4 text-center">

                  Your approved payment
                  can be used for one
                  inspection only.

                </p>

              </div>

            </aside>

          </div>

        </form>

      </div>

    </main>
  );
}


/* ======================================
   GUIDED CAPTURE CARD
====================================== */

function GuidedCaptureCard({
  capture,
  selected,
  onFileChange,
  onRemove,
}) {

  const isVideo =
    selected?.file?.type?.startsWith(
      "video/"
    );


  return (
    <div
      className={`border rounded-2xl p-5 transition ${
        selected
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-white"
      }`}
    >

      <div className="flex items-start gap-3">

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            selected
              ? "bg-green-100 text-green-600"
              : "bg-orange-50 text-orange-600"
          }`}
        >

          {selected ? (
            <CheckCircle2
              size={19}
            />
          ) : (
            <Camera
              size={19}
            />
          )}

        </div>


        <div>

          <h3 className="font-black text-[#0b1220]">
            {capture.title}
          </h3>


          <p className="text-sm text-gray-500 mt-1 leading-6">
            {capture.description}
          </p>

        </div>

      </div>


      {selected ? (

        <div className="mt-4">

          <div className="bg-white border border-green-100 rounded-xl p-3 flex items-center gap-3">

            <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center shrink-0">

              {isVideo ? (
                <FileVideo
                  size={19}
                />
              ) : (
                <ImageIcon
                  size={19}
                />
              )}

            </div>


            <div className="min-w-0 flex-1">

              <div className="text-sm font-semibold text-[#0b1220] truncate">
                {
                  selected.file.name
                }
              </div>


              <div className="text-xs text-gray-400 mt-1">
                {formatFileSize(
                  selected.file.size
                )}
              </div>

            </div>

          </div>


          <div className="grid grid-cols-[1fr_auto] gap-2 mt-3">

            <label className="min-h-11 flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#0b1220] text-white text-sm font-bold cursor-pointer hover:bg-[#151e2e]">

              Replace


              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                className="hidden"
                onChange={(e) =>
                  onFileChange(
                    e,
                    capture
                  )
                }
              />

            </label>


            <button
              type="button"
              onClick={() =>
                onRemove(
                  capture.id
                )
              }
              className="w-11 h-11 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
              aria-label={`Remove ${capture.title}`}
            >

              <Trash2
                size={17}
              />

            </button>

          </div>

        </div>

      ) : (

        <label className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-50 text-orange-700 font-bold cursor-pointer hover:bg-orange-100">

          <Camera
            size={17}
          />

          Add Photo / Video


          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
            className="hidden"
            onChange={(e) =>
              onFileChange(
                e,
                capture
              )
            }
          />

        </label>
      )}

    </div>
  );
}


/* ======================================
   FORM SECTION
====================================== */

function FormSection({
  icon,
  title,
  subtitle,
  children,
}) {
  return (
    <section className="gc-card p-5 sm:p-6 md:p-8">

      <div className="flex items-start gap-3">

        <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">

          {icon}

        </div>


        <div>

          <h2 className="text-xl md:text-2xl font-black text-[#0b1220]">

            {title}

          </h2>


          <p className="text-sm text-gray-500 mt-1">

            {subtitle}

          </p>

        </div>

      </div>


      <div className="mt-7">

        {children}

      </div>

    </section>
  );
}


/* ======================================
   INPUT
====================================== */

function InputField({
  label,
  type = "text",
  ...props
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-[#0b1220] mb-2">

        {label}

      </label>


      <input
        type={type}
        {...props}
        required
        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />

    </div>
  );
}


/* ======================================
   SELECT
====================================== */

function SelectField({
  label,
  options,
  ...props
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-[#0b1220] mb-2">

        {label}

      </label>


      <select
        {...props}
        required
        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      >

        <option value="">
          Select
        </option>


        {options.map(
          (option) => (

            <option
              key={
                option
              }
              value={
                option
              }
            >

              {option}

            </option>
          )
        )}

      </select>

    </div>
  );
}


/* ======================================
   CHECKLIST
====================================== */

function ChecklistItem({
  text,
  complete = true,
}) {
  return (
    <div className="flex items-start gap-3">

      <CheckCircle2
        size={17}
        className={`shrink-0 mt-0.5 ${
          complete
            ? "text-green-400"
            : "text-slate-600"
        }`}
      />


      <span
        className={`text-sm ${
          complete
            ? "text-slate-300"
            : "text-slate-500"
        }`}
      >

        {text}

      </span>

    </div>
  );
}


/* ======================================
   FILE SIZE
====================================== */

function formatFileSize(
  bytes
) {

  if (bytes < 1024) {
    return `${bytes} B`;
  }


  if (
    bytes <
    1024 * 1024
  ) {

    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }


  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}


export default NewInspection;