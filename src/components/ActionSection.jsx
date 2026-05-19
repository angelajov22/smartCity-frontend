import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="bg-[#0a96f4] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
        <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
          Подготвен си да направиш разлика?
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-sky-100 sm:mt-6 sm:text-base md:text-lg md:leading-8">
          Пријавете проблеми како оштетени патишта, нефункционално улично
          осветлување или нередовно собирање отпад. Со еден клик придонесувате
          за подобра и побезбедна заедница.
        </p>

        <Link
          to="/report"
          className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-sky-500 shadow-lg transition hover:scale-[1.02] hover:bg-sky-50 !no-underline sm:w-auto sm:px-10 sm:py-4 sm:text-base"
        >
          Пријави Веднаш
        </Link>
      </div>
    </section>
  );
}

export default CTASection;
