import { useRef } from "react";
import {
  Camera,
  MapPin,
  LayoutGrid,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function StepsSection() {
  const scrollRef = useRef(null);

  const steps = [
    {
      number: "1",
      title: "Фотографирај",
      description:
        "Направете јасна слика од проблемот на кој сте наишле во околината.",
      icon: Camera,
    },
    {
      number: "2",
      title: "Лоцирај",
      description: "Автоматски ќе ја откриеме локацијата или внесете ја рачно.",
      icon: MapPin,
    },
    {
      number: "3",
      title: "Опиши",
      description: "Додадете краток опис и категорија за полесно насочување.",
      icon: LayoutGrid,
    },
    {
      number: "4",
      title: "Испрати",
      description:
        "Нашите служби ќе бидат известени веднаш и ќе започнат со работа.",
      icon: Send,
    },
  ];

  const scrollSteps = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          Како до подобар град во 4 чекори?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-500 sm:text-base">
          Пријавувањето е брзо и едноставно, без комплицирани чекори
        </p>

        <div className="relative mt-12 sm:mt-16 lg:mt-20">
          <div className="absolute left-0 right-0 top-8 hidden h-[2px] bg-gray-200 lg:block" />

          <button
            type="button"
            onClick={() => scrollSteps("left")}
            className="absolute left-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition hover:bg-sky-50 hover:text-sky-500 sm:hidden"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={() => scrollSteps("right")}
            className="absolute right-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition hover:bg-sky-50 hover:text-sky-500 sm:hidden"
          >
            <ChevronRight size={20} />
          </button>

          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-10 pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:gap-8 lg:grid-cols-4 lg:gap-10"
          >
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative flex min-w-[220px] snap-center flex-col items-center rounded-2xl bg-white px-4 py-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:min-w-0"
                >
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white sm:h-16 sm:w-16">
                    <Icon size={26} strokeWidth={2.4} />

                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white transition group-hover:bg-white group-hover:text-sky-500">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-gray-900 sm:text-lg">
                    {step.title}
                  </h3>

                  <p className="mt-2 max-w-[230px] text-sm leading-6 text-gray-500 sm:max-w-[260px]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StepsSection;
