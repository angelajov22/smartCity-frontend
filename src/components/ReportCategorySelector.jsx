function ReportCategorySelector({
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <section className="!mt-10">
      <h2 className="!text-xl !font-bold !mb-5">
        1. Категорија на проблемот
      </h2>

      {categories.length === 0 ? (
        <p className="!text-gray-400">Се вчитуваат категории...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 !gap-4 max-h-[420px] sm:max-h-none overflow-y-auto sm:overflow-visible !pr-1">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.key;

            return (
              <button
                type="button"
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`!min-h-20 !border !rounded-2xl !px-5 !py-4 !flex !items-center !gap-3 !font-semibold !text-[16px] sm:!text-[17px] !text-left !leading-snug !transition
                  ${
                    isSelected
                      ? "!border-blue-500 !bg-blue-50 !text-blue-600"
                      : "!border-gray-200 !text-gray-800 hover:!border-blue-400 hover:!bg-blue-50"
                  }`}
              >
                <span className="!text-xl !shrink-0">{category.icon}</span>

                <span className="!break-words !whitespace-normal">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {selectedCategory && (
        <p className="!mt-4 !text-blue-500 !font-semibold">
          Избрана категорија:{" "}
          {categories.find((c) => c.key === selectedCategory)?.name ||
            selectedCategory}
        </p>
      )}
    </section>
  );
}

export default ReportCategorySelector;