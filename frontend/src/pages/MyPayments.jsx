import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";

import api from "../services/api";


function MyPayments() {
  const [
    payments,
    setPayments,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  /* =====================================
     LOAD PAYMENTS
  ===================================== */

  const loadPayments =
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
            "/payments/my",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        setPayments(
          response.data.payments ||
          []
        );

      } catch (err) {
        console.error(
          "My payments error:",
          err
        );


        setError(
          err.response?.data
            ?.message ||
            "Unable to load payments."
        );

      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    loadPayments();
  }, []);


  return (
    <main className="min-h-screen bg-[#f5f7fa]">


      {/* =====================================
          HEADER
      ===================================== */}

      <section className="bg-[#0b1220] text-white">

        <div className="gc-container py-9 sm:py-10 md:py-12">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">


            <div>

              <div className="flex items-center gap-2 text-orange-400 text-sm font-bold">

                <CreditCard
                  size={17}
                />

                Customer Account

              </div>


              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2 leading-tight">

                My Payments

              </h1>


              <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-xl leading-7">

                Check payment status,
                view verification results
                and start approved vehicle
                inspections.

              </p>

            </div>


            <button
              type="button"
              onClick={
                loadPayments
              }
              disabled={
                loading
              }
              className="inline-flex items-center justify-center gap-2 border border-white/20 rounded-xl px-5 py-3 font-semibold hover:bg-white/10 transition disabled:opacity-60 w-full sm:w-auto"
            >

              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>

          </div>

        </div>

      </section>


      {/* =====================================
          PAGE
      ===================================== */}

      <div className="gc-container py-7 sm:py-9 md:py-10">


        {/* LOADING */}

        {loading && (

          <div className="gc-card p-9 sm:p-12 text-center">

            <Loader2
              size={30}
              className="animate-spin text-orange-500 mx-auto"
            />


            <h2 className="font-black text-xl text-[#0b1220] mt-5">

              Loading payments

            </h2>


            <p className="text-gray-500 mt-2">

              Please wait while we load
              your payment history.

            </p>

          </div>
        )}


        {/* ERROR */}

        {!loading &&
          error && (

          <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-5 sm:p-6">

            <div className="flex items-start gap-3">

              <XCircle
                size={20}
                className="shrink-0 mt-0.5"
              />


              <div>

                <div className="font-bold">

                  Unable to load payments

                </div>


                <p className="text-sm mt-1">

                  {error}

                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={
                loadPayments
              }
              className="mt-4 text-sm font-bold underline"
            >

              Try Again

            </button>

          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          payments.length ===
            0 && (

          <div className="gc-card p-7 sm:p-10 md:p-12 text-center">

            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto">

              <CreditCard
                size={30}
                className="text-orange-500"
              />

            </div>


            <h2 className="text-xl sm:text-2xl font-black text-[#0b1220] mt-5">

              No payments yet

            </h2>


            <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-md mx-auto leading-7">

              Choose an inspection
              package and complete payment
              to get started.

            </p>


            <Link
              to="/pricing"
              className="gc-btn-primary mt-6 gap-2"
            >

              View Packages

              <ArrowRight
                size={16}
              />

            </Link>

          </div>
        )}


        {/* PAYMENT LIST */}

        {!loading &&
          !error &&
          payments.length >
            0 && (

          <div className="space-y-4 sm:space-y-5">

            {payments.map(
              (payment) => (

                <PaymentCard
                  key={
                    payment._id
                  }
                  payment={
                    payment
                  }
                />

              )
            )}

          </div>
        )}

      </div>

    </main>
  );
}


/* =====================================
   PAYMENT CARD
===================================== */

function PaymentCard({
  payment,
}) {
  return (
    <article className="gc-card overflow-hidden">


      <div className="p-5 sm:p-6">

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">


          {/* DETAILS */}

          <div className="min-w-0 flex-1">

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">

              <h2 className="text-xl font-black text-[#0b1220] capitalize">

                {payment.plan}
                {" "}
                Inspection

              </h2>


              <div>
                <StatusBadge
                  status={
                    payment.status
                  }
                />
              </div>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-5 gap-y-5 mt-6">

              <Info
                label="Amount"
                value={`PKR ${Number(
                  payment.amount || 0
                ).toLocaleString()}`}
              />


              <Info
                label="Method"
                value={
                  payment.paymentMethod
                }
              />


              <Info
                label="Transaction ID"
                value={
                  payment.transactionId
                }
                breakValue
              />


              <Info
                label="Submitted"
                value={
                  formatDate(
                    payment.createdAt
                  )
                }
              />

            </div>


            {/* REJECTION REASON */}

            {payment.status ===
              "Rejected" && (

              <div className="mt-5 bg-red-50 border border-red-100 text-red-700 rounded-xl p-4">

                <div className="flex items-start gap-2">

                  <XCircle
                    size={17}
                    className="shrink-0 mt-0.5"
                  />


                  <div className="text-sm leading-6">

                    <strong>
                      Reason:
                    </strong>
                    {" "}

                    {payment.rejectionReason ||
                      "Payment could not be verified."}

                  </div>

                </div>

              </div>
            )}

          </div>


          {/* ACTION */}

          <div className="lg:min-w-[195px] w-full lg:w-auto">

            <PaymentAction
              payment={
                payment
              }
            />

          </div>

        </div>

      </div>


      {/* FOOTER */}

      <div className="border-t border-gray-100 bg-gray-50 px-5 sm:px-6 py-4">

        <PaymentFooter
          payment={
            payment
          }
        />

      </div>

    </article>
  );
}


/* =====================================
   PAYMENT ACTION
===================================== */

function PaymentAction({
  payment,
}) {
  if (
    payment.status ===
    "Pending"
  ) {
    return (
      <Link
        to={`/payment-status/${payment._id}`}
        className="w-full min-h-12 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0b1220] hover:bg-[#151e2e] text-white text-sm font-bold transition"
      >

        Check Status

        <ArrowRight
          size={15}
        />

      </Link>
    );
  }


  if (
    payment.status ===
      "Approved" &&
    !payment.inspectionCreated
  ) {
    return (
      <Link
        to={`/new-inspection?plan=${payment.plan}&payment=${payment._id}`}
        className="gc-btn-primary w-full min-h-12"
      >

        Start Inspection

      </Link>
    );
  }


  if (
    payment.status ===
      "Approved" &&
    payment.inspectionCreated
  ) {
    return (
      <Link
        to="/dashboard"
        className="w-full min-h-12 inline-flex items-center justify-center px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-orange-300 text-[#0b1220] text-sm font-bold transition"
      >

        View Inspection

      </Link>
    );
  }


  if (
    payment.status ===
    "Rejected"
  ) {
    return (
      <Link
        to={`/checkout?plan=${payment.plan}`}
        className="gc-btn-primary w-full min-h-12"
      >

        Submit Again

      </Link>
    );
  }


  return null;
}


/* =====================================
   PAYMENT FOOTER
===================================== */

function PaymentFooter({
  payment,
}) {
  if (
    payment.status ===
    "Pending"
  ) {
    return (
      <div className="flex items-start gap-2 text-sm text-gray-500">

        <Clock3
          size={16}
          className="text-orange-500 shrink-0 mt-0.5"
        />

        Waiting for GaariCheck
        verification.

      </div>
    );
  }


  if (
    payment.status ===
      "Approved" &&
    !payment.inspectionCreated
  ) {
    return (
      <div className="flex items-start gap-2 text-sm text-green-700 font-semibold">

        <CheckCircle2
          size={16}
          className="shrink-0 mt-0.5"
        />

        Payment verified — inspection
        can now be started.

      </div>
    );
  }


  if (
    payment.status ===
      "Approved" &&
    payment.inspectionCreated
  ) {
    return (
      <div className="flex items-start gap-2 text-sm text-green-700 font-semibold">

        <CheckCircle2
          size={16}
          className="shrink-0 mt-0.5"
        />

        Payment used for an inspection.

      </div>
    );
  }


  if (
    payment.status ===
    "Rejected"
  ) {
    return (
      <div className="flex items-start gap-2 text-sm text-red-600">

        <XCircle
          size={16}
          className="shrink-0 mt-0.5"
        />

        Payment verification was not
        successful.

      </div>
    );
  }


  return null;
}


/* =====================================
   STATUS BADGE
===================================== */

function StatusBadge({
  status,
}) {
  const styles = {
    Pending:
      "bg-orange-50 text-orange-700",

    Approved:
      "bg-green-50 text-green-700",

    Rejected:
      "bg-red-50 text-red-700",
  };


  const icons = {
    Pending:
      <Clock3
        size={14}
      />,

    Approved:
      <CheckCircle2
        size={14}
      />,

    Rejected:
      <XCircle
        size={14}
      />,
  };


  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
        styles[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >

      {icons[status]}

      {status ||
        "Unknown"}

    </span>
  );
}


/* =====================================
   INFO
===================================== */

function Info({
  label,
  value,
  breakValue = false,
}) {
  return (
    <div className="min-w-0">

      <div className="text-[11px] sm:text-xs uppercase tracking-wide text-gray-400">

        {label}

      </div>


      <div
        className={`text-sm font-bold text-[#0b1220] mt-1.5 ${
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


export default MyPayments;