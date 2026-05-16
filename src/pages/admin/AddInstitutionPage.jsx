import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { institutionApi } from "../../services/api";

const AddInstitutionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "OTHER",
    description: "",
    apiUrl: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        url: formData.apiUrl,
      };

      await institutionApi.create(payload);
      navigate("/admin/institutions");
    } catch (err) {
      setError(err.message || "Настана грешка");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <Link
          to="/admin/institutions"
          className="no-underline inline-flex items-center gap-2 text-gray-500 hover:text-[#0a96f4] mb-4 transition-colors text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          Назад кон листата
        </Link>

        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Додај институција
        </h1>

        <p className="text-gray-500 mt-1.5 text-sm font-normal">
          Додавање на нова институција во системот
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
          Грешка при зачувување: {error}
        </div>
      )}

      <div
        className="bg-white rounded-2xl"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Име на институција *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium transition-all duration-200 focus:border-[#0a96f4] focus:ring-2 focus:ring-blue-100 focus:ring-offset-1 outline-none bg-gray-50/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Внесете име на институцијата"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Категорија *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium transition-all duration-200 focus:border-[#0a96f4] focus:ring-2 focus:ring-blue-100 focus:ring-offset-1 outline-none bg-gray-50/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="FIRE">Пожар</option>
                  <option value="WATER">Водовод</option>
                  <option value="ELECTRICITY">Електрика</option>
                  <option value="ROAD">Оштетен пат / дупки</option>
                  <option value="WASTE">Отпад и хигиена</option>
                  <option value="PUBLIC_SAFETY">Јавна безбедност</option>
                  <option value="TRAFFIC">Сообраќај</option>
                  <option value="OTHER">Останато</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Опис
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium transition-all duration-200 focus:border-[#0a96f4] focus:ring-2 focus:ring-blue-100 focus:ring-offset-1 outline-none bg-gray-50/50 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                  placeholder="Внесете опис на институцијата"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  URL
                </label>

                <input
                  type="url"
                  name="apiUrl"
                  value={formData.apiUrl}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium transition-all duration-200 focus:border-[#0a96f4] focus:ring-2 focus:ring-blue-100 focus:ring-offset-1 outline-none bg-gray-50/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          <div className="px-8 py-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{
                backgroundColor: "#0a96f4",
                boxShadow: "0 4px 12px rgba(10, 150, 244, 0.25)",
              }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {loading ? "Зачувување..." : "Зачувај институција"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInstitutionPage;
