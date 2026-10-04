import { useState } from "react";
import {
  Clock3,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactEmail =
    import.meta.env.VITE_CONTACT_EMAIL;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!contactEmail) {
      alert(
        "GaariCheck contact email has not been configured yet."
      );
      return;
    }

    const subject = encodeURIComponent(
      form.subject ||
        `GaariCheck enquiry from ${form.name}`
    );

    const body = encodeURIComponent(
      `Name: ${form.name}\n` +
        `Email: ${form.email}\n\n` +
        `${form.message}`
    );

    window.location.href =
      `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <main>

      {/* HERO */}
      <section className="bg-[#0b1220] text-white">
        <div className="gc-container py-14 sm:py-16 md:py-24 text-center">

          <div className="gc-eyebrow">
            Contact GaariCheck
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-4 leading-tight">
            Have a question about
            <span className="text-orange-500 block">
              your vehicle inspection?
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-5 sm:mt-6 leading-7 sm:leading-8">
            Get in touch with the GaariCheck team for
            inspection, package, payment or report-related
            questions.
          </p>

        </div>
      </section>

      {/* CONTACT */}
      <section className="gc-section">
        <div className="gc-container">

          <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-6 sm:gap-8">

            {/* INFO */}
            <div className="space-y-5">

              <ContactCard
                icon={<Mail />}
                title="Email"
                text={
                  contactEmail ||
                  "Configure your GaariCheck email"
                }
              />

              <ContactCard
                icon={<Clock3 />}
                title="Response"
                text="Customer enquiries will be handled by the GaariCheck support team."
              />

              <ContactCard
                icon={<ShieldCheck />}
                title="Existing Customer?"
                text="Please include your Inspection ID when contacting us about an existing vehicle inspection."
              />

              <div className="bg-[#0b1220] rounded-[22px] p-7 text-white">

                <MessageCircle
                  size={28}
                  className="text-orange-500"
                />

                <h3 className="font-black text-2xl mt-4">
                  Need help with an inspection?
                </h3>

                <p className="text-slate-400 text-sm leading-7 mt-3">
                  Include your vehicle registration
                  number or GaariCheck inspection number
                  so our team can locate the request
                  more quickly.
                </p>

              </div>

            </div>

            {/* FORM */}
            <div className="gc-card p-5 sm:p-6 md:p-8">

              <h2 className="text-2xl md:text-3xl font-black text-[#0b1220]">
                Send us a message
              </h2>

              <p className="text-gray-500 mt-2">
                Fill in the details below and your
                email application will open with the
                message prepared.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">

                  <Field
                    label="Your Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full name"
                  />

                  <Field
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />

                </div>

                <Field
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                />

                <div>
                  <label className="block text-sm font-semibold text-[#0b1220] mb-2">
                    Message
                  </label>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={7}
                    required
                    placeholder="Write your message..."
                    className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <button
                  type="submit"
                  className="gc-btn-primary w-full sm:w-auto gap-2"
                >
                  <Send size={17} />
                  Send Message
                </button>

              </form>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}


function ContactCard({
  icon,
  title,
  text,
}) {
  return (
    <div className="gc-card p-5 sm:p-6 flex gap-4">

      <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div>
        <h3 className="font-black text-[#0b1220]">
          {title}
        </h3>

        <p className="text-sm text-gray-500 leading-6 mt-1 break-all">
          {text}
        </p>
      </div>

    </div>
  );
}


function Field({
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
        className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />

    </div>
  );
}

export default Contact;