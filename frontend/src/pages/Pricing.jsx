import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

function Pricing() {
  const packages = [
    {
      id: "basic",
      name: "Basic",
      price: "2,999",
      description:
        "A simple visual review for customers who need the essential vehicle condition information.",
      features: [
        "Exterior visual inspection",
        "Interior visual inspection",
        "Vehicle photo review",
        "Basic dashboard observations",
        "Digital inspection report",
        "Customer dashboard access",
      ],
    },
    {
      id: "standard",
      name: "Standard",
      price: "4,999",
      description:
        "A more detailed inspection for used-car buyers who want greater visibility before making a decision.",
      popular: true,
      features: [
        "Everything included in Basic",
        "Detailed body condition review",
        "Interior condition assessment",
        "Dashboard & visible warning review",
        "Tyre and wheel observations",
        "Photo and video assessment",
        "Detailed digital inspection report",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "7,999",
      description:
        "Our most comprehensive remote visual assessment with priority review.",
      features: [
        "Everything included in Standard",
        "Expanded vehicle visual assessment",
        "Additional submitted media review",
        "Detailed visible defect observations",
        "Priority inspection processing",
        "Comprehensive digital report",
        "Priority customer support",
      ],
    },
  ];

  return (
    <main>
      {/* Header */}
      <section className="bg-[#0b1220] text-white">
        <div className="gc-container py-14 sm:py-16 md:py-20 text-center">

          <div className="gc-eyebrow">
            Simple Pricing
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-4 leading-tight">
            Choose your inspection package.
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto mt-5 text-base sm:text-lg leading-7 sm:leading-8">
            Select the level of vehicle review that matches
            your needs. After choosing a package, submit your
            payment details for GaariCheck verification before
            starting the inspection.
          </p>

        </div>
      </section>

      {/* Packages */}
      <section className="gc-section">
        <div className="gc-container">

          <div className="grid lg:grid-cols-3 gap-5 sm:gap-7">

            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-[22px] sm:rounded-[24px] p-5 sm:p-7 md:p-8 border ${
                  pkg.popular
                    ? "border-orange-500 shadow-2xl lg:-translate-y-4"
                    : "border-gray-200 shadow-sm"
                }`}
              >

                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold tracking-wide px-4 py-2 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-2xl font-black text-[#0b1220]">
                    {pkg.name}
                  </h2>

                  <p className="text-gray-500 leading-6 mt-3 min-h-[72px]">
                    {pkg.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-end gap-2 mb-7">

                  <span className="text-sm font-semibold text-gray-500 mb-2">
                    PKR
                  </span>

                  <span className="text-4xl sm:text-5xl font-black text-[#0b1220]">
                    {pkg.price}
                  </span>

                  <span className="text-gray-400 mb-2">
                    / inspection
                  </span>

                </div>

                <Link
                  to={`/checkout?plan=${pkg.id}`}
                  className={`w-full ${
                    pkg.popular
                      ? "gc-btn-primary"
                      : "gc-btn-secondary"
                  } gap-2`}
                >
                  Select {pkg.name}
                  <ArrowRight size={18} />
                </Link>

                <div className="border-t border-gray-200 my-7" />

                <p className="font-bold text-[#0b1220] mb-5">
                  What's included:
                </p>

                <div className="space-y-4">

                  {pkg.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex gap-3 items-start"
                    >
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check
                          size={13}
                          className="text-green-700"
                        />
                      </div>

                      <span className="text-sm text-gray-600 leading-6">
                        {feature}
                      </span>
                    </div>
                  ))}

                </div>

              </div>
            ))}

          </div>

          {/* Payment info */}
          <div className="mt-10 sm:mt-14 bg-[#0b1220] rounded-[22px] sm:rounded-[24px] p-5 sm:p-7 md:p-10">

            <div className="grid lg:grid-cols-3 gap-8 items-center">

              <div className="lg:col-span-2">

                <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                  <ShieldCheck size={19} />
                  Payment Verification
                </div>

                <h3 className="text-white text-2xl md:text-3xl font-black mt-3">
                  Submit payment for verification before starting your inspection.
                </h3>

                <p className="text-slate-400 mt-3 leading-7">
                  After selecting your package, choose an available
                  payment method, enter the transaction ID and upload
                  the payment receipt. GaariCheck will verify the
                  payment before the inspection can be started.
                </p>

              </div>

              <div className="space-y-3">

                <PaymentItem text="Manual payment verification" />
                <PaymentItem text="Transaction ID and receipt submission" />
                <PaymentItem text="Start inspection after approval" />

              </div>

            </div>

          </div>

          {/* FAQ */}
          <div className="mt-14 sm:mt-20 max-w-4xl mx-auto">

            <div className="text-center mb-10">
              <div className="gc-eyebrow">
                Pricing FAQ
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-[#0b1220] mt-3">
                Questions before you start?
              </h2>
            </div>

            <div className="space-y-4">

              <Faq
                question="Is payment required before inspection?"
                answer="Yes. Once GaariCheck verifies and approves your submitted payment, you can proceed with your vehicle inspection submission."
              />

              <Faq
                question="Can I change my package later?"
                answer="Package upgrade rules will be finalized with the payment system before launch."
              />

              <Faq
                question="How do I receive the final report?"
                answer="Once the inspection is completed, you'll receive an email notification and can view or download the PDF report from your GaariCheck dashboard."
              />

              <Faq
                question="Is the inspection performed physically?"
                answer="GaariCheck's current service is a remote visual inspection based on customer-submitted vehicle photos, videos and information."
              />

            </div>

          </div>

        </div>
      </section>
    </main>
  );
}


function PaymentItem({ text }) {
  return (
    <div className="flex gap-3 items-center text-slate-300">
      <CheckCircle2
        size={18}
        className="text-green-400 shrink-0"
      />
      <span className="text-sm">
        {text}
      </span>
    </div>
  );
}


function Faq({ question, answer }) {
  return (
    <div className="gc-card p-5 sm:p-6">
      <h3 className="font-bold text-[#0b1220]">
        {question}
      </h3>

      <p className="text-gray-500 leading-7 mt-2">
        {answer}
      </p>
    </div>
  );
}

export default Pricing;