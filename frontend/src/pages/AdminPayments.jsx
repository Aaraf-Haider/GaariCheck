import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";

import api from "../services/api";


function AdminPayments() {
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
            "/admin/payments",
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
          "Admin payments error:",
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


  /* =====================================
     APPROVE / REJECT
  ===================================== */

  const updatePayment =
    async (
      paymentId,
      status
    ) => {
      let rejectionReason = "";


      if (
        status ===
        "Rejected"
      ) {
        rejectionReason =
          window.prompt(
            "Reason for rejecting payment:"
          ) || "";


        if (
          !rejectionReason.trim()
        ) {
          return;
        }
      }


      try {
        const token =
          localStorage.getItem(
            "token"
          );


        await api.patch(
          `/admin/payments/${paymentId}/status`,

          {
            status,
            rejectionReason:
              rejectionReason.trim(),
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        await loadPayments();

      } catch (err) {
        console.error(
          "Update payment error:",
          err
        );


        alert(
          err.response?.data
            ?.message ||
            "Unable to update payment."
        );
      }
    };


  return (
    <main className="min-h-screen bg-[#f5f7fa]">


      {/* =====================================
          HEADER
      ===================================== */}

      <section className="bg-[#0b1220] text-white">

        <div className="gc-container py-9 sm:py-11 md:py-12">

          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-6"
          >

            <ArrowLeft
              size={16}
            />

            Admin Dashboard

          </Link>


          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">


            <div className="min-w-0">

              <div className="flex items-center gap-2 text-orange-400 text-sm font-bold">

                <CreditCard
                  size={17}
                />

                Administration

              </div>


              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2 leading-tight">

                Payment Requests

              </h1>


              <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-2xl leading-7">

                Verify customer payment
                receipts before activating
                their vehicle inspections.

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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 rounded-xl px-5 py-3 font-semibold hover:bg-white/10 transition disabled:opacity-60"
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
              size={32}
              className="animate-spin text-orange-500 mx-auto"
            />


            <h2 className="font-black text-xl text-[#0b1220] mt-5">

              Loading payment requests

            </h2>


            <p className="text-gray-500 mt-2">

              Please wait...

            </p>

          </div>
        )}


        {/* ERROR */}

        {!loading &&
          error && (

          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 sm:p-6 text-red-700">

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
              className="text-sm font-bold underline mt-4"
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

          <div className="gc-card p-8 sm:p-12 text-center">

            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto">

              <CreditCard
                size={30}
                className="text-orange-500"
              />

            </div>


            <h2 className="text-xl sm:text-2xl font-black text-[#0b1220] mt-5">

              No payment requests

            </h2>


            <p className="text-gray-500 mt-2">

              New customer payments will
              appear here for verification.

            </p>

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
                  updatePayment={
                    updatePayment
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
  updatePayment,
}) {
  const customerName =
    payment.user?.name ||
    "Customer";


  const customerEmail =
    payment.user?.email ||
    "—";


  return (
    <article className="gc-card overflow-hidden">


      {/* MAIN */}

      <div className="p-5 sm:p-6">

        <div className="grid lg:grid-cols-[minmax(0,1fr)_190px] gap-6">


          {/* DETAILS */}

          <div className="min-w-0">

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">

              <h2 className="font-black text-xl text-[#0b1220] break-words">

                {customerName}

              </h2>


              <div>

                <StatusBadge
                  status={
                    payment.status
                  }
                />

              </div>

            </div>


            <p className="text-sm text-gray-500 mt-1 break-all">

              {customerEmail}

            </p>


            {/* DETAILS GRID */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-5 gap-y-5 mt-6">

              <Info
                label="Package"
                value={
                  payment.plan
                }
                capitalize
              />


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


              {payment.verifiedAt && (

                <Info
                  label="Verified"
                  value={
                    formatDate(
                      payment.verifiedAt
                    )
                  }
                />
              )}


              {payment.verifiedBy && (

                <Info
                  label="Verified By"
                  value={
                    payment.verifiedBy
                      ?.name ||
                    payment.verifiedBy
                      ?.email ||
                    "Admin"
                  }
                />
              )}

            </div>


            {/* RECEIPT */}

            {payment.receiptUrl && (

              <a
                href={
                  payment.receiptUrl
                }
                target="_blank"
                rel="noreferrer"
                className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-sm transition"
              >

                <ExternalLink
                  size={16}
                />

                View Payment Receipt

              </a>
            )}


            {/* REJECTION REASON */}

            {payment.status ===
              "Rejected" && (

              <div className="mt-5 bg-red-50 border border-red-100 rounded-xl p-4 text-red-700">

                <div className="flex items-start gap-2">

                  <XCircle
                    size={17}
                    className="shrink-0 mt-0.5"
                  />


                  <div className="text-sm leading-6">

                    <strong>
                      Rejection reason:
                    </strong>
                    {" "}

                    {payment.rejectionReason ||
                      "Payment could not be verified."}

                  </div>

                </div>

              </div>
            )}

          </div>


          {/* =====================================
              ACTIONS
          ===================================== */}

          <div className="w-full">

            {payment.status ===
              "Pending" ? (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    updatePayment(
                      payment._id,
                      "Approved"
                    )
                  }
                  className="min-h-12 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold inline-flex items-center justify-center gap-2 transition"
                >

                  <CheckCircle2
                    size={17}
                  />

                  Approve

                </button>


                <button
                  type="button"
                  onClick={() =>
                    updatePayment(
                      payment._id,
                      "Rejected"
                    )
                  }
                  className="min-h-12 px-5 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold inline-flex items-center justify-center gap-2 transition"
                >

                  <XCircle
                    size={17}
                  />

                  Reject

                </button>

              </div>

            ) : (

              <VerificationResult
                payment={
                  payment
                }
              />
            )}

          </div>

        </div>

      </div>


      {/* FOOTER */}

      <div className="border-t border-gray-100 bg-gray-50 px-5 sm:px-6 py-4">

        <PaymentStateText
          payment={
            payment
          }
        />

      </div>

    </article>
  );
}


/* =====================================
   VERIFICATION RESULT
===================================== */

function VerificationResult({
  payment,
}) {
  if (
    payment.status ===
    "Approved"
  ) {
    return (
      <div className="rounded-xl bg-green-50 border border-green-100 p-4 text-center">

        <CheckCircle2
          size={24}
          className="text-green-600 mx-auto"
        />


        <div className="font-bold text-green-700 mt-2">
          Approved
        </div>


        <div className="text-xs text-green-600 mt-1">
          Payment verified
        </div>

      </div>
    );
  }


  if (
    payment.status ===
    "Rejected"
  ) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-center">

        <XCircle
          size={24}
          className="text-red-500 mx-auto"
        />


        <div className="font-bold text-red-700 mt-2">
          Rejected
        </div>


        <div className="text-xs text-red-600 mt-1">
          Verification failed
        </div>

      </div>
    );
  }


  return null;
}


/* =====================================
   PAYMENT STATE FOOTER
===================================== */

function PaymentStateText({
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

        Waiting for admin verification.

      </div>
    );
  }


  if (
    payment.status ===
    "Approved"
  ) {
    return (
      <div className="flex items-start gap-2 text-sm text-green-700 font-semibold">

        <CheckCircle2
          size={16}
          className="shrink-0 mt-0.5"
        />

        Payment approved. Customer can
        proceed with the inspection.

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

        Payment was rejected.

      </div>
    );
  }


  return null;
}


/* =====================================
   INFO
===================================== */

function Info({
  label,
  value,
  capitalize = false,
  breakValue = false,
}) {
  return (
    <div className="min-w-0">

      <div className="text-[11px] sm:text-xs text-gray-400 uppercase tracking-wide">

        {label}

      </div>


      <div
        className={`font-bold text-sm text-[#0b1220] mt-1.5 ${
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


export default AdminPayments;