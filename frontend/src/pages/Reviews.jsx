import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageSquareQuote,
  ShieldCheck,
  Star,
} from "lucide-react";

function Reviews() {
  return (
    <main>

      <section className="bg-[#0b1220] text-white">
        <div className="gc-container py-14 sm:py-16 md:py-24 text-center">

          <div className="gc-eyebrow">
            Customer Reviews
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-4 leading-tight">
            Confidence built through
            <span className="text-orange-500 block">
              a clear inspection process.
            </span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto mt-5 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8">
            Verified customer reviews will appear here as
            GaariCheck begins completing live inspections.
          </p>

        </div>
      </section>

      <section className="gc-section">
        <div className="gc-container">

          <div className="max-w-3xl mx-auto text-center">

            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto">
              <MessageSquareQuote size={30} />
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-[#0b1220] mt-6">
              Real customers. Real reviews.
            </h2>

            <p className="gc-description mt-4">
              We won't publish invented customer identities
              or misleading testimonials. Once real customers
              use GaariCheck, their approved feedback can be
              displayed here.
            </p>

          </div>

          {/* SAMPLE VISUAL LAYOUT */}
          <div className="mt-10 sm:mt-14">

            <div className="text-center mb-7">
              <span className="inline-flex bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-xs font-bold">
                SAMPLE REVIEW LAYOUT
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">

              <SampleReview
                text="The vehicle submission process was easy to understand and the report helped organize the visible findings clearly."
              />

              <SampleReview
                text="Being able to upload the vehicle details remotely could make checking a car more convenient before travelling to see it."
              />

              <SampleReview
                text="The dashboard makes it easy to track the inspection status and access the final report from one place."
              />

            </div>

            <p className="text-xs text-gray-400 text-center mt-5">
              These are demonstration texts for the website
              layout only and are not presented as real
              customer testimonials.
            </p>

          </div>

        </div>
      </section>

      <section className="gc-section bg-white">
        <div className="gc-container">

          <div className="bg-[#0b1220] rounded-[22px] sm:rounded-[28px] p-5 sm:p-8 md:p-12">

            <div className="grid lg:grid-cols-2 gap-8 items-center">

              <div>
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <ShieldCheck size={18} />
                  Transparent Feedback
                </div>

                <h2 className="text-white text-3xl md:text-4xl font-black mt-4">
                  Reviews should help customers make informed decisions.
                </h2>
              </div>

              <div>
                <p className="text-slate-400 leading-7">
                  As GaariCheck grows, we can connect the
                  review section to completed inspection
                  orders so only genuine customers can submit
                  verified feedback.
                </p>

                <Link
                  to="/pricing"
                  className="gc-btn-primary w-full sm:w-auto mt-6 gap-2"
                >
                  View Packages
                  <ArrowRight size={17} />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}


function SampleReview({ text }) {
  return (
    <div className="gc-card p-5 sm:p-6">

      <div className="flex text-orange-500 gap-1">
        {[1, 2, 3, 4, 5].map((item) => (
          <Star
            key={item}
            size={17}
            fill="currentColor"
          />
        ))}
      </div>

      <p className="text-gray-600 leading-7 mt-5">
        “{text}”
      </p>

      <div className="mt-6 text-xs text-gray-400 font-semibold">
        Sample Review Preview
      </div>

    </div>
  );
}

export default Reviews;