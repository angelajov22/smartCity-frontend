import IntroductionSection from "./IntroductionSection";
import MapSection from "./MapSection";

const IntroSection = () => {
  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-20 lg:py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-6">
        <IntroductionSection />
        <MapSection />
      </div>
    </section>
  );
};

export default IntroSection;
