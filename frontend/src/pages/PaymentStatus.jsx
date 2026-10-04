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
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";

import api from "../services/api";


function PaymentStatus() {
  const { id } =
    useParams();


  const [
    payment,
    setPayment,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  /* =====================================
     FETCH PAYMENT
  ===================================== */

  const fetchPayment =
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
            `/payments/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        setPayment(
          response.data.payment
        );

      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Unable to load payment."
        );

      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    fetchPayment();
  }, [id]);


  /* =====================================
     LOADING
  ===================================== */

  if (loading) {
    return (
      <PageMessage>

        <Loader2
          size={38}
          className="animate-spin text-orange-500 mx-auto"
        />


        <h1 className="font-black text-xl sm:text-2xl text-[#0b1220] mt-5">

          Checking payment

        </h1>


        <p className="mt-2 text-sm sm:text-base text-gray-500">

          Please wait while we load
          your payment status.

        </p>

      </PageMessage>
    );
  }


  /* =====================================
     ERROR
  ===================================== */

  if (
    error ||
    !payment
  ) {
    return (
      <PageMessage>

        <XCircle
          size={44}
          className="text-red-500 mx-auto"
        />


        <h1 className="font-black text-2xl text-[#0b1220] mt-4">

          Payment not found

        </h1>


        <p className="text-sm sm:text-base text-gray-500 mt-2 leading-7">

          {error ||
            "Unable to find this payment."}

        </p>


        <Link
          to="/my-payments"
          className="gc-btn-primary mt-6"
        >

          My Payments

        </Link>

      </PageMessage>
    );
  }


  return (
    <main className="min-h-[75vh] bg-[#f5f7fa] px-4 py-7 sm:py-10 md:py-12">


      <div className="max-w-lg mx-auto">


        {/* BACK */}

        <Link
          to="/my-payments"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0b1220] mb-5 transition"
        >

          <ArrowLeft
            size={16}
          />

          My Payments

        </Link>


        {/* MAIN CARD */}

        <div className="gc-card w-full p-5 sm:p-7 md:p-8 text-center">


          {/* =====================================
              PENDING
          ===================================== */}

          {payment.status ===
            "Pending" && (
            <>

              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto">

                <Clock3
                  size={42}
                  className="text-orange-500"
                />

              </div>


              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold mt-5">

                Verification Pending

              </div>


              <h1 className="text-2xl sm:text-3xl font-black text-[#0b1220] mt-3">

                Payment Pending

              </h1>


              <p className="text-sm sm:text-base text-gray-500 leading-7 mt-3 max-w-md mx-auto">

                Your payment has been
                submitted and is waiting
                for GaariCheck
                verification.

              </p>

            </>
          )}


          {/* =====================================
              APPROVED
          ===================================== */}

          {payment.status ===
            "Approved" && (
            <>

              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto">

                <CheckCircle2
                  size={44}
                  className="text-green-600"
                />

              </div>


              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold mt-5">

                Verified

              </div>


              <h1 className="text-2xl sm:text-3xl font-black text-[#0b1220] mt-3">

                Payment Approved

              </h1>


              <p className="text-sm sm:text-base text-gray-500 leading-7 mt-3 max-w-md mx-auto">

                Your payment has been
                verified. You can now
                start your vehicle
                inspection.

              </p>

            </>
          )}


          {/* =====================================
              REJECTED
          ===================================== */}

          {payment.status ===
            "Rejected" && (
            <>

              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">

                <XCircle
                  size={44}
                  className="text-red-500"
                />

              </div>


              <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mt-5">

                Verification Failed

              </div>


              <h1 className="text-2xl sm:text-3xl font-black text-[#0b1220] mt-3">

                Payment Rejected

              </h1>


              <p className="text-sm sm:text-base text-gray-500 leading-7 mt-3 max-w-md mx-auto">

                {payment.rejectionReason ||
                  "The payment could not be verified."}

              </p>

            </>
          )}


          {/* =====================================
              PAYMENT DETAILS
          ===================================== */}

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-5 mt-7 text-left">

            <div className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-4">

              Payment Details

            </div>


            <div className="space-y-4">

              <Row
                label="Package"
                value={
                  payment.plan
                }
              />


              <Row
                label="Amount"
                value={`PKR ${payment.amount.toLocaleString()}`}
              />


              <Row
                label="Method"
                value={
                  payment.paymentMethod
                }
              />


              <Row
                label="Transaction ID"
                value={
                  payment.transactionId
                }
                breakValue
              />


              <Row
                label="Status"
                value={
                  payment.status
                }
                status={
                  payment.status
                }
              />

            </div>

          </div>


          {/* =====================================
              ACTIONS
          ===================================== */}

          {payment.status ===
            "Pending" && (

            <button
              type="button"
              onClick={
                fetchPayment
              }
              className="w-full min-h-12 mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0b1220] hover:bg-[#151e2e] text-white font-bold transition"
            >

              <RefreshCw
                size={17}
              />

              Check Again

            </button>
          )}


          {payment.status ===
            "Approved" &&
            !payment.inspectionCreated && (

            <Link
              to={`/new-inspection?plan=${payment.plan}&payment=${payment._id}`}
              className="gc-btn-primary w-full min-h-12 mt-6"
            >

              Start Inspection

            </Link>
          )}


          {payment.inspectionCreated && (

            <Link
              to="/dashboard"
              className="gc-btn-primary w-full min-h-12 mt-6"
            >

              View Inspection

            </Link>
          )}


          {payment.status ===
            "Rejected" && (

            <Link
              to={`/checkout?plan=${payment.plan}`}
              className="gc-btn-primary w-full min-h-12 mt-6"
            >

              Submit New Payment

            </Link>
          )}


          {/* FOOTER MESSAGE */}

          {payment.status ===
            "Pending" && (

            <p className="text-xs text-gray-400 leading-5 mt-4">

              You can return to this page
              later from My Payments to
              check whether your payment
              has been approved.

            </p>
          )}

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
    <main className="min-h-[70vh] flex items-center justify-center bg-[#f5f7fa] px-4 py-10">

      <div className="gc-card p-6 sm:p-8 text-center max-w-md w-full">

        {children}

      </div>

    </main>
  );
}


/* =====================================
   DETAIL ROW
===================================== */

function Row({
  label,
  value,
  breakValue = false,
  status,
}) {
  const statusStyles = {
    Pending:
      "bg-orange-100 text-orange-700",

    Approved:
      "bg-green-100 text-green-700",

    Rejected:
      "bg-red-100 text-red-700",
  };


  return (
    <div className="grid grid-cols-[105px_minmax(0,1fr)] sm:grid-cols-[130px_minmax(0,1fr)] gap-3 sm:gap-4 items-start text-sm">

      <span className="text-gray-500">

        {label}

      </span>


      {status ? (

        <div className="text-right">

          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
              statusStyles[
                status
              ] ||
              "bg-gray-100 text-gray-600"
            }`}
          >

            {value}

          </span>

        </div>

      ) : (

        <span
          className={`font-bold text-[#0b1220] capitalize text-right ${
            breakValue
              ? "break-all"
              : "break-words"
          }`}
        >

          {value || "—"}

        </span>
      )}

    </div>
  );
}


export default PaymentStatus;