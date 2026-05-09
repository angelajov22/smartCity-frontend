const categories = [
  { icon: "💡", name: "Јавно осветлување" },
  { icon: "🛣️", name: "Оштетен пат / Дупки" },
  { icon: "🗑️", name: "Отпад и хигиена" },
  { icon: "🚰", name: "Водовод и канализација" },
  { icon: "🌳", name: "Паркови и зеленило" },
  { icon: "❓", name: "Останато" },
]

function ReportCategorySelector({ selectedCategory, setSelectedCategory }) {
  return (
    <section className="!mt-10">
      <h2 className="!text-xl !font-bold !mb-5">
        1. Категорија на проблемот
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name

          return (
            <button
              type="button"
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`h-20 border rounded-2xl !px-5 !flex !items-center !gap-3 font-semibold text-[17px] whitespace-nowrap transition
                ${
                  isSelected
                    ? "!border-blue-500 !bg-blue-50 !text-blue-600"
                    : "!border-gray-200 !text-gray-800 hover:!border-blue-400 hover:!bg-blue-50"
                }`}
            >
              <span className="!text-xl">{category.icon}</span>
              {category.name}
            </button>
          )
        })}
      </div>

      {selectedCategory && (
        <p className="!mt-4 !text-blue-500 !font-semibold">
          Избрана категорија: {selectedCategory}
        </p>
      )}
    </section>
  )
}

export default ReportCategorySelector