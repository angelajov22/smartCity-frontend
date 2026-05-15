import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData.username, formData.password);
      navigate("/admin");
    } catch (err) {
      setError("Погрешно корисничко име или лозинка. Обидете се повторно.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(10,150,244,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(10,150,244,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative w-full" style={{ maxWidth: 420 }}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                background: "rgba(10,150,244,0.08)",
              }}
            >
              <img
                src={logo}
                alt="Мој Град"
                style={{ width: 32, height: 32, objectFit: "contain" }}
              />
            </div>
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ color: "#0a96f4" }}
            >
              Мој Град
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Административен панел
          </p>
        </div>

        <div
          className="bg-white rounded-2xl p-8"
          style={{
            boxShadow:
              "0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
              Добредојдовте назад
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-normal">
              Внесете ги вашите податоци за да продолжите
            </p>
          </div>

          {error && (
            <div
              className="flex items-start gap-3 p-3.5 rounded-xl mb-5 text-sm font-medium"
              style={{
                backgroundColor: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#be123c",
              }}
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Корисничко име
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="username"
                placeholder="Внесете корисничко име"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium transition-all duration-200 focus:border-[#0a96f4] focus:ring-2 focus:ring-blue-100 focus:ring-offset-1 outline-none bg-gray-50/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Лозинка
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  placeholder="Внесете лозинка"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium transition-all duration-200 focus:border-[#0a96f4] focus:ring-2 focus:ring-blue-100 focus:ring-offset-1 outline-none bg-gray-50/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  disabled={loading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.username || !formData.password}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2"
              style={{
                backgroundColor: "#0a96f4",
                boxShadow: "0 4px 14px rgba(10, 150, 244, 0.30)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Најава...
                </>
              ) : (
                "Најави се"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
