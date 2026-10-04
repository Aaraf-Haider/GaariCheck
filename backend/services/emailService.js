const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReportReadyEmail = async ({
  customerName,
  customerEmail,
  inspectionNumber,
  vehicle,
}) => {
  const loginUrl =
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_USER}>`,

    to: customerEmail,

    subject: `Your GaariCheck Report is Ready - ${inspectionNumber}`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

        <h2 style="color: #1d4ed8;">
          Your GaariCheck Inspection Report is Ready
        </h2>

        <p>
          Hello ${customerName},
        </p>

        <p>
          Your remote vehicle inspection has been completed
          and your report is now available.
        </p>

        <hr />

        <p>
          <strong>Inspection ID:</strong>
          ${inspectionNumber}
        </p>

        <p>
          <strong>Vehicle:</strong>
          ${vehicle.make} ${vehicle.model} ${vehicle.year}
        </p>

        <p>
          <strong>Status:</strong>
          Report Ready
        </p>

        <div style="margin: 30px 0;">
          <a
            href="${loginUrl}/login"
            style="
              background: #1d4ed8;
              color: white;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
            "
          >
            Login to View Report
          </a>
        </div>

        <p>
          After logging in, open your dashboard to
          view or download your inspection report.
        </p>

        <hr />

        <p style="font-size: 12px; color: #666;">
          GaariCheck provides remote visual inspection
          based on customer-submitted photographs,
          videos and information.
        </p>

      </div>
    `,
  });
};

const sendPasswordResetEmail = async ({
  customerName,
  customerEmail,
  resetToken,
}) => {
  const frontendUrl =
    process.env.FRONTEND_URL || "http://localhost:5173";

  const resetUrl =
    `${frontendUrl}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: "Reset Your GaariCheck Password",

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

        <h2>Reset Your GaariCheck Password</h2>

        <p>Hello ${customerName},</p>

        <p>
          We received a request to reset your GaariCheck password.
        </p>

        <p>Click below to create a new password.</p>

        <div style="margin: 30px 0;">
          <a
            href="${resetUrl}"
            style="
              background: #1d4ed8;
              color: white;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
            "
          >
            Reset Password
          </a>
        </div>

        <p>This link will expire in 15 minutes.</p>

        <p>
          If you did not request this reset,
          you can ignore this email.
        </p>

      </div>
    `,
  });
};

const sendPaymentApprovedEmail = async ({
  to,
  customerName,
  plan,
  amount,
  paymentId,
}) => {
  const myPaymentsUrl =
    `${process.env.FRONTEND_URL}/my-payments`;

  await transporter.sendMail({
    from: `"GaariCheck" <${process.env.EMAIL_USER}>`,
    to,

    subject:
      "Your GaariCheck Payment Has Been Approved",

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        
        <h2 style="color:#16a34a;">
          Payment Approved
        </h2>

        <p>
          Hi ${customerName || "Customer"},
        </p>

        <p>
          Your payment for the
          <strong>${plan}</strong>
          inspection package has been successfully verified.
        </p>

        <p>
          <strong>Amount:</strong>
          PKR ${amount}
        </p>

        <p>
          You can now start your vehicle inspection.
        </p>

        <a
          href="${myPaymentsUrl}"
          style="
            display:inline-block;
            margin-top:15px;
            background:#f97316;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          Start Inspection
        </a>

        <p style="margin-top:30px;color:#6b7280;font-size:13px;">
          Payment ID: ${paymentId}
        </p>

        <p>
          Regards,<br/>
          <strong>GaariCheck Team</strong>
        </p>

      </div>
    `,
  });
};


const sendPaymentRejectedEmail = async ({
  to,
  customerName,
  plan,
  rejectionReason,
}) => {
  const myPaymentsUrl =
    `${process.env.FRONTEND_URL}/my-payments`;

  await transporter.sendMail({
    from: `"GaariCheck" <${process.env.EMAIL_USER}>`,
    to,

    subject:
      "Update Regarding Your GaariCheck Payment",

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

        <h2 style="color:#dc2626;">
          Payment Could Not Be Verified
        </h2>

        <p>
          Hi ${customerName || "Customer"},
        </p>

        <p>
          We were unable to verify your payment for the
          <strong>${plan}</strong>
          inspection package.
        </p>

        <p>
          <strong>Reason:</strong>
          ${rejectionReason}
        </p>

        <p>
          Please review the payment details and submit a new payment.
        </p>

        <a
          href="${myPaymentsUrl}"
          style="
            display:inline-block;
            margin-top:15px;
            background:#f97316;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          View My Payments
        </a>

        <p style="margin-top:30px;">
          Regards,<br/>
          <strong>GaariCheck Team</strong>
        </p>

      </div>
    `,
  });
};

module.exports = {
  sendReportReadyEmail,
  sendPasswordResetEmail,
  sendPaymentApprovedEmail,
  sendPaymentRejectedEmail,
};