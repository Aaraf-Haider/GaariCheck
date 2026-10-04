import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Car,
  CheckCircle2,
  ClipboardList,
  FileText,
  SearchCheck,
  Upload,
  CreditCard,
  Video,
} from "lucide-react";

function Services() {
  return (
    <main>

      <section className="bg-[#0b1220] text-white">
        <div className="gc-container py-14 sm:py-16 md:py-24 text-center">

          <div className="gc-eyebrow">
            What We Do
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-4 leading-tight">
            Remote vehicle inspection,
            <span className="text-orange-500 block">
              from submission to report.
            </span>
          </h1>

          <p className="text-slate-400 max-w-3xl mx-auto text-base sm:text-lg leading-7 sm:leading-8 mt-5 sm:mt-6">
            GaariCheck gives customers a structured way
            to submit vehicle information and media for
            professional remote visual review.
          </p>

        </div>
      </section>

      {/* PROCESS */}
      <section className="gc-section">
        <div className="gc-container">

          <div className="max-w-3xl">
            <div className="gc-eyebrow">
              Inspection Process
            </div>

            <h2 className="gc-title mt-3">
              Everything happens online.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-5 mt-8 sm:mt-12">

            <ServiceStep
              number="01"
              icon={<ClipboardList />}
              title="Choose Package"
              text="Select Basic, Standard or Premium based on the level of review required."
            />

            <ServiceStep
              number="02"
              icon={<CreditCard />}
              title="Complete Payment"
              text="Submit your payment details and receipt for GaariCheck verification."
            />

            <ServiceStep
              number="03"
              icon={<Upload />}
              title="Submit Vehicle"
              text="Provide customer and vehicle details through the GaariCheck inspection form."
            />

            <ServiceStep
              number="04"
              icon={<Camera />}
              title="Upload Media"
              text="Upload the required guided vehicle photos or videos for visual assessment."
            />

            <ServiceStep
              number="05"
              icon={<FileText />}
              title="Receive Report"
              text="Track progress online and receive your completed digital inspection report."
            />

          </div>

        </div>
      </section>

      {/* REVIEW AREAS */}
      <section className="gc-section bg-white">
        <div className="gc-container">

          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 sm:gap-10 lg:gap-14">

            <div>
              <div className="gc-eyebrow">
                Vehicle Review
              </div>

              <h2 className="gc-title mt-3">
                Areas we can review visually.
              </h2>

              <p className="gc-description mt-5">
                The exact depth of assessment depends on
                the selected package and the quality and
                completeness of the submitted evidence.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">

              <AreaCard
                icon={<Car />}
                title="Exterior"
                items={[
                  "Body panels",
                  "Visible dents or scratches",
                  "Lights and glass",
                  "Visible exterior condition",
                ]}
              />

              <AreaCard
                icon={<Camera />}
                title="Interior"
                items={[
                  "Seats and upholstery",
                  "Dashboard",
                  "Cabin condition",
                  "Visible controls",
                ]}
              />

              <AreaCard
                icon={<Video />}
                title="Tyres & Wheels"
                items={[
                  "Visible tyre condition",
                  "Wheel condition",
                  "Obvious visible damage",
                ]}
              />

              <AreaCard
                icon={<SearchCheck />}
                title="Submitted Evidence"
                items={[
                  "Photos",
                  "Videos",
                  "Odometer information",
                  "Customer notes",
                ]}
              />

            </div>

          </div>
        </div>
      </section>

      {/* LIMITATIONS */}
      <section className="gc-section bg-[#f5f7fa]">
        <div className="gc-container">

          <div className="gc-card p-5 sm:p-8 md:p-10">

            <div className="grid lg:grid-cols-2 gap-10">

              <div>
                <div className="gc-eyebrow">
                  Service Scope
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-[#0b1220] mt-3">
                  What remote inspection does not replace.
                </h2>
              </div>

              <div className="space-y-4">

                {[
                  "Mechanical dismantling or workshop diagnostics",
                  "Road testing performed by GaariCheck",
                  "Laboratory or computerized diagnostic testing",
                  "Verification of defects that are not visible in submitted evidence",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3"
                  >
                    <CheckCircle2
                      size={19}
                      className="text-orange-600 mt-1 shrink-0"
                    />

                    <span className="text-gray-600 leading-7">
                      {item}
                    </span>
                  </div>
                ))}

              </div>

            </div>

          </div>

          <div className="text-center mt-12">
            <Link
              to="/pricing"
              className="gc-btn-primary w-full sm:w-auto gap-2"
            >
              Compare Packages
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}


function ServiceStep({
  number,
  icon,
  title,
  text,
}) {
  return (
    <div className="gc-card p-5 sm:p-6">

      <div className="flex items-center justify-between">
        <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
          {icon}
        </div>

        <span className="text-3xl font-black text-gray-100">
          {number}
        </span>
      </div>

      <h3 className="font-black text-xl text-[#0b1220] mt-5">
        {title}
      </h3>

      <p className="text-sm text-gray-500 leading-7 mt-3">
        {text}
      </p>
    </div>
  );
}


function AreaCard({ icon, title, items }) {
  return (
    <div className="gc-card p-5 sm:p-6">

      <div className="text-orange-600">
        {icon}
      </div>

      <h3 className="text-xl font-black text-[#0b1220] mt-4">
        {title}
      </h3>

      <div className="space-y-3 mt-5">
        {items.map((item) => (
          <div
            key={item}
            className="flex gap-2 text-sm text-gray-600"
          >
            <CheckCircle2
              size={16}
              className="text-green-600 mt-0.5 shrink-0"
            />

            {item}
          </div>
        ))}
      </div>

    </div>
  );
}

export default Services;