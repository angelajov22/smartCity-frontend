import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="bg-[#0a96f4] py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          Подготвен си да направиш разлика?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-sky-100">
          Пријавете проблеми како оштетени патишта, нефункционално улично
          осветлување или нередовно собирање отпад. Со еден клик придонесувате
          за подобра и побезбедна заедница.
        </p>

        <Link
          to="/report"
          className="mt-8 inline-block rounded-xl bg-white px-10 py-4 font-bold text-sky-500 shadow-lg transition hover:bg-sky-50 !no-underline"
        >
          Пријави Веднаш
        </Link>
      </div>
    </section>
  );
}

export default CTASection;
