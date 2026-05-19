function ReportDetails({ description, setDescription }) {
  return (
    <section className="!mt-10">
      <div className="!flex !justify-between !mb-4">
        <h2 className="!text-xl !font-bold">
          2. Детален опис
        </h2>

        <span className="!text-sm !text-gray-500">
          Задолжително
        </span>
      </div>

      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        className="!w-full !h-40 !border !border-gray-200 !rounded-2xl !p-5 !outline-none resize-none focus:!ring-2 focus:!ring-blue-300"
        placeholder="Опишете го проблемот што е можно попрецизно (пр. каде точно се наоѓа, колку време е присутен...)"
      />

      <div className="!mt-4 !bg-gray-50 !rounded-xl !px-4 !py-3 !text-sm !text-gray-500">
        ⓘ Добриот опис помага надлежните служби побрзо да го разберат и лоцираат дефектот.
      </div>
    </section>
  )
}

export default ReportDetails