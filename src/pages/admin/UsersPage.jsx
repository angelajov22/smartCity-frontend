import { useEffect, useState } from "react";
import { CircleDot } from "lucide-react";
import { getUsers } from "../../api/apiService";

const UsersPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAdmins = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getUsers();
        if (!Array.isArray(data)) {
          throw new Error("Неочекуван одговор од серверот за Администратори.");
        }
        setAdmins(data);
      } catch (err) {
        setError(err.message || "Не можеме да ги поврзаме податоците за администраторите.");
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] border border-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Администратори</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Листа на регистрирани администратори со корисничко име и улога.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0a96f4]/10 px-4 py-2 text-sm font-semibold text-[#0a96f4]">
            <CircleDot size={16} /> Живо вчитување
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[32px] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Корисничко име
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Улога
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-sm text-slate-500">
                  Се вчитуваат администратори...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-sm text-red-600">
                  {error}
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-sm text-slate-500">
                  Нема регистрирани администратори.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id ?? admin.username} className="transition-all hover:bg-slate-50/80">
                  <td className="px-6 py-5 text-base font-semibold text-slate-900">
                    {admin.username || admin.email || `Корисник ${admin.id || "-"}`}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {admin.role || admin.type || "Администратор"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;