import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  LockKeyhole,
  Smartphone,
  Upload,
} from "lucide-react";

import api from "../services/api";


function Checkout() {
  const navigate =
    useNavigate();

  const [searchParams] =
    useSearchParams();


  const planId =
    searchParams.get("plan");


  const token =
    localStorage.getItem(
      "token"
    );


  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem(
        "user"
      ) || "null"
    );
  } catch {
    user = null;
  }


  /* =====================================
     PLANS
  ===================================== */

  const plans = {
    basic: {
      name: "Basic",
      price: 2999,
    },

    standard: {
      name: "Standard",
      price: 4999,
    },

    premium: {
      name: "Premium",
      price: 7999,
    },
  };


  const plan =
    plans[planId];


  /* =====================================
     STATE
  ===================================== */

  const [
    paymentDetails,
    setPaymentDetails,
  ] = useState(null);


  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("");


  const [
    transactionId,
    setTransactionId,
  ] = useState("");


  const [
    receipt,
    setReceipt,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /* =====================================
     LOAD PAYMENT METHODS
  ===================================== */

  useEffect(() => {
    if (!token) {
      return;
    }


    const loadMethods =
      async () => {
        try {
          const response =
            await api.get(
              "/payments/methods",

              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          setPaymentDetails(
            response.data.methods
          );

        } catch (err) {
          console.error(
            "Payment methods error:",
            err
          );


          setError(
            "Unable to load payment details."
          );
        }
      };


    loadMethods();

  }, [token]);


  /* =====================================
     SUBMIT PAYMENT
  ===================================== */

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");


      if (
        !paymentMethod ||
        !transactionId ||
        !receipt
      ) {
        setError(
          "Please select payment method, enter transaction ID and upload receipt."
        );

        return;
      }


      try {
        setLoading(true);


        const formData =
          new FormData();


        formData.append(
          "plan",
          planId
        );


        formData.append(
          "paymentMethod",
          paymentMethod
        );


        formData.append(
          "transactionId",
          transactionId
        );


        formData.append(
          "receipt",
          receipt
        );


        const response =
          await api.post(
            "/payments",

            formData,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const payment =
          response.data.payment;


        navigate(
          `/payment-status/${payment._id}`
        );

      } catch (err) {
        console.error(
          "Payment submit error:",
          err
        );


        setError(
          err.response?.data
            ?.message ||
            "Unable to submit payment."
        );

      } finally {
        setLoading(false);
      }
    };


  /* =====================================
     INVALID PLAN
  ===================================== */

  if (!plan) {
    return (
      <SimpleMessage
        title="No package selected"
        text="Choose an inspection package before continuing."
        buttonText="View Packages"
        buttonLink="/pricing"
      />
    );
  }


  /* =====================================
     LOGIN REQUIRED
  ===================================== */

  if (
    !user ||
    !token
  ) {
    return (
      <SimpleMessage
        title="Login required"
        text="Please login or create an account before making payment."
        buttonText="Login"
        buttonLink="/login"
      />
    );
  }


  const currentDetails =
    paymentDetails?.[
      paymentMethod
    ];


  return (
    <main className="min-h-screen bg-[#f5f7fa]">

      <div className="gc-container py-7 sm:py-9 md:py-12">


        {/* =====================================
            BACK
        ===================================== */}

        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0b1220] mb-6 sm:mb-7 transition"
        >

          <ArrowLeft
            size={16}
          />

          Back to Pricing

        </Link>


        {/* =====================================
            GRID
        ===================================== */}

        <div className="grid lg:grid-cols-[minmax(0,1fr)_390px] gap-6 lg:gap-7 items-start">


          {/* =====================================
              PAYMENT FORM
          ===================================== */}

          <form
            onSubmit={
              handleSubmit
            }
            className="gc-card p-5 sm:p-6 md:p-8 order-2 lg:order-1 min-w-0"
          >


            {/* HEADING */}

            <div className="flex items-center gap-2 text-orange-600 text-sm font-bold">

              <LockKeyhole
                size={17}
              />

              Payment

            </div>


            <h1 className="text-2xl sm:text-3xl font-black text-[#0b1220] mt-3 leading-tight">

              Complete your payment

            </h1>


            <p className="text-sm sm:text-base text-gray-500 mt-2 leading-7">

              Pay using your preferred
              account and submit the
              transaction details below.

            </p>


            {/* ERROR */}

            {error && (

              <div className="mt-5 bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm leading-6">

                {error}

              </div>
            )}


            {/* =====================================
                METHOD
            ===================================== */}

            <div className="mt-7 sm:mt-8">

              <label className="block text-sm font-bold text-[#0b1220]">

                Payment Method

              </label>


              <p className="text-xs text-gray-400 mt-1">

                Select where you sent
                your payment.

              </p>


              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">

                <MethodButton
                  name="JazzCash"
                  icon={
                    <Smartphone
                      size={22}
                    />
                  }
                  selected={
                    paymentMethod ===
                    "JazzCash"
                  }
                  onClick={() => {
                    setPaymentMethod(
                      "JazzCash"
                    );

                    setError("");
                  }}
                />


                <MethodButton
                  name="Easypaisa"
                  icon={
                    <Smartphone
                      size={22}
                    />
                  }
                  selected={
                    paymentMethod ===
                    "Easypaisa"
                  }
                  onClick={() => {
                    setPaymentMethod(
                      "Easypaisa"
                    );

                    setError("");
                  }}
                />


                <MethodButton
                  name="Bank Transfer"
                  icon={
                    <Building2
                      size={22}
                    />
                  }
                  selected={
                    paymentMethod ===
                    "Bank Transfer"
                  }
                  onClick={() => {
                    setPaymentMethod(
                      "Bank Transfer"
                    );

                    setError("");
                  }}
                />

              </div>

            </div>


            {/* =====================================
                ACCOUNT DETAILS
            ===================================== */}

            {currentDetails && (

              <div className="mt-6 bg-[#0b1220] text-white rounded-2xl p-5 sm:p-6 overflow-hidden">

                <div className="flex items-center justify-between gap-3">

                  <div className="text-xs uppercase tracking-wider text-orange-400 font-bold">

                    Send Payment To

                  </div>


                  <div className="text-[10px] sm:text-xs bg-white/10 px-2.5 py-1 rounded-full text-slate-300">

                    {paymentMethod}

                  </div>

                </div>


                <div className="space-y-4 mt-5">

                  {currentDetails.bankName && (

                    <PaymentInfo
                      label="Bank"
                      value={
                        currentDetails.bankName
                      }
                    />
                  )}


                  {(currentDetails.accountName ||
                    currentDetails.accountTitle) && (

                    <PaymentInfo
                      label="Account Name"
                      value={
                        currentDetails.accountName ||
                        currentDetails.accountTitle
                      }
                    />
                  )}


                  {currentDetails.accountNumber && (

                    <PaymentInfo
                      label="Account Number"
                      value={
                        currentDetails.accountNumber
                      }
                    />
                  )}


                  {currentDetails.iban && (

                    <PaymentInfo
                      label="IBAN"
                      value={
                        currentDetails.iban
                      }
                    />
                  )}


                  <div className="border-t border-white/10 pt-4">

                    <PaymentInfo
                      label="Amount"
                      value={`PKR ${plan.price.toLocaleString()}`}
                      highlight
                    />

                  </div>

                </div>

              </div>
            )}


            {!paymentMethod && (

              <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-500">

                Select JazzCash,
                Easypaisa or Bank
                Transfer to view the
                GaariCheck receiving
                account details.

              </div>
            )}


            {/* =====================================
                TRANSACTION ID
            ===================================== */}

            <div className="mt-7">

              <label className="block text-sm font-bold text-[#0b1220] mb-2">

                Transaction ID / Reference

              </label>


              <input
                type="text"
                value={
                  transactionId
                }
                onChange={(e) =>
                  setTransactionId(
                    e.target.value
                  )
                }
                required
                placeholder="Enter transaction ID"
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />


              <p className="text-xs text-gray-400 mt-2 leading-5">

                Enter the transaction
                reference shown in your
                wallet or banking app.

              </p>

            </div>


            {/* =====================================
                RECEIPT
            ===================================== */}

            <div className="mt-6">

              <label className="block text-sm font-bold text-[#0b1220] mb-2">

                Payment Receipt

              </label>


              <label
                className={`border-2 border-dashed rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[170px] ${
                  receipt
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/30"
                }`}
              >

                {receipt ? (

                  <CheckCircle2
                    size={32}
                    className="text-green-600"
                  />

                ) : (

                  <ImageIcon
                    size={30}
                    className="text-orange-500"
                  />
                )}


                <span
                  className={`font-bold mt-3 ${
                    receipt
                      ? "text-green-800"
                      : "text-[#0b1220]"
                  }`}
                >

                  {receipt
                    ? "Receipt Selected"
                    : "Upload Payment Screenshot"}

                </span>


                {receipt ? (

                  <span className="text-xs text-green-700 mt-2 max-w-full break-all">

                    {receipt.name}

                  </span>

                ) : (

                  <span className="text-xs text-gray-400 mt-1">

                    JPG, PNG or WEBP

                  </span>
                )}


                <span className="text-xs text-gray-400 mt-2">

                  Tap to{" "}
                  {receipt
                    ? "replace"
                    : "choose"}{" "}
                  receipt

                </span>


                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {

                    setReceipt(
                      e.target
                        .files?.[0] ||
                        null
                    );

                    setError("");
                  }}
                />

              </label>

            </div>


            {/* =====================================
                SUBMIT
            ===================================== */}

            <button
              type="submit"
              disabled={
                loading
              }
              className="gc-btn-primary w-full mt-7 py-4 gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

                  Submit Payment

                </>
              )}

            </button>


            <p className="text-[11px] sm:text-xs text-gray-400 text-center leading-5 mt-4">

              GaariCheck will verify your
              submitted transaction before
              your inspection becomes
              available.

            </p>

          </form>


          {/* =====================================
              ORDER SUMMARY
          ===================================== */}

          <aside className="gc-card p-5 sm:p-6 lg:sticky lg:top-28 order-1 lg:order-2">

            <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">

              Order Summary

            </div>


            <h2 className="text-xl sm:text-2xl font-black text-[#0b1220] mt-2">

              {plan.name} Inspection

            </h2>


            <div className="border-t border-gray-100 mt-5 sm:mt-6 pt-5 sm:pt-6">


              <div className="flex items-center justify-between gap-4">

                <span className="text-sm text-gray-500">
                  Package
                </span>


                <span className="font-bold text-[#0b1220]">
                  {plan.name}
                </span>

              </div>


              <div className="flex items-end justify-between gap-4 mt-5">

                <span className="font-bold text-[#0b1220]">
                  Total
                </span>


                <div className="text-right">

                  <div className="text-xs text-gray-400">
                    PKR
                  </div>

                  <div className="font-black text-2xl text-[#0b1220]">

                    {plan.price.toLocaleString()}

                  </div>

                </div>

              </div>

            </div>


            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mt-6">

              <p className="text-xs text-orange-900 leading-5">

                After payment submission,
                the status will initially
                show as{" "}
                <strong>
                  Pending
                </strong>
                . You can track verification
                from My Payments.

              </p>

            </div>


            <p className="text-xs text-gray-400 leading-5 mt-5">

              Your inspection will become
              available after GaariCheck
              verifies the submitted
              payment.

            </p>

          </aside>

        </div>

      </div>

    </main>
  );
}


/* =====================================
   PAYMENT METHOD BUTTON
===================================== */

function MethodButton({
  name,
  icon,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`min-h-[92px] border-2 rounded-xl p-4 flex sm:flex-col items-center justify-center gap-3 sm:gap-2 font-semibold text-sm transition ${
        selected
          ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
          : "border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50/30"
      }`}
    >

      <span
        className={
          selected
            ? "text-orange-600"
            : "text-gray-400"
        }
      >

        {icon}

      </span>


      <span>
        {name}
      </span>


      {selected && (

        <CheckCircle2
          size={16}
          className="ml-auto sm:ml-0 text-orange-600"
        />
      )}

    </button>
  );
}


/* =====================================
   PAYMENT INFO
===================================== */

function PaymentInfo({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)] sm:grid-cols-[130px_minmax(0,1fr)] gap-3 sm:gap-4 items-start">

      <span className="text-sm text-slate-400">

        {label}

      </span>


      <span
        className={`text-sm text-right break-all ${
          highlight
            ? "font-black text-orange-400 text-base"
            : "font-bold text-white"
        }`}
      >

        {value || "—"}

      </span>

    </div>
  );
}


/* =====================================
   SIMPLE MESSAGE
===================================== */

function SimpleMessage({
  title,
  text,
  buttonText,
  buttonLink,
}) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-[#f5f7fa] px-4 py-10">

      <div className="gc-card p-6 sm:p-8 text-center max-w-md w-full">

        <LockKeyhole
          size={38}
          className="text-orange-500 mx-auto"
        />


        <h1 className="text-2xl font-black text-[#0b1220] mt-4">

          {title}

        </h1>


        <p className="text-sm sm:text-base text-gray-500 mt-3 leading-7">

          {text}

        </p>


        <Link
          to={
            buttonLink
          }
          className="gc-btn-primary mt-6"
        >

          {buttonText}

        </Link>

      </div>

    </main>
  );
}


export default Checkout;