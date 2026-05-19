import { BarChart3, Clock, CheckCircle } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Јан", prijaveni: 45, reseni: 38 },
  { month: "Фев", prijaveni: 52, reseni: 42 },
  { month: "Мар", prijaveni: 48, reseni: 45 },
  { month: "Апр", prijaveni: 61, reseni: 50 },
  { month: "Мај", prijaveni: 55, reseni: 52 },
  { month: "Јун", prijaveni: 68, reseni: 58 },
];

function StatsSection() {
  return (
    <section className="bg-slate-50 py-20 max-md:py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 max-md:gap-8 max-md:px-5">
        {/* GRAPH */}
        <div className="rounded-xl bg-white p-5 max-md:order-2 max-md:p-2 max-md:max-w-[330px] max-md:mx-auto max-md:shadow-sm">
          {" "}
          <div className="mb-2 flex items-center gap-2 justify-center lg:justify-start">
            <BarChart3 size={20} className="text-sky-500 max-md:size-[18px]" />

            <h3 className="text-base font-semibold text-gray-900 max-md:text-sm">
              Месечна ефикасност
            </h3>
          </div>
          <div className="h-64 max-md:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={25}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="prijaveni"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />

                <Area
                  type="monotone"
                  dataKey="reseni"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TEXT + STATS */}
        <div className="max-md:order-1 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-gray-900 max-md:text-2xl max-md:leading-tight">
            Транспарентноста е наш приоритет.
          </h2>

          <p className="mt-6 max-w-xl text-gray-600 leading-7 max-md:mt-4 max-md:text-sm max-md:leading-relaxed lg:mx-0 mx-auto">
            Секоја пријава е јавно достапна и нејзиниот статус може да се следи
            во реално време. Општината е должна да одговори во рок од 48 часа.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto place-items-center max-md:max-w-[290px] max-md:gap-2 lg:mx-0 lg:place-items-stretch">
            {/* FIRST CARD */}
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition duration-200 transform hover:scale-105 hover:shadow-lg max-md:flex-col max-md:items-center max-md:justify-center max-md:text-center max-md:gap-2 max-md:px-3 max-md:py-4 max-md:min-h-[125px]">
              <Clock size={22} className="text-gray-700 max-md:size-[20px]" />

              <div className="max-md:flex max-md:flex-col max-md:items-center">
                <p className="text-lg font-bold text-gray-900 max-md:text-base">
                  42ч
                </p>

                <p className="text-xs text-gray-500 max-md:text-[10px]">
                  ВРЕМЕ ЗА ОДГОВОР
                </p>
              </div>
            </div>

            {/* SECOND CARD */}
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition duration-200 transform hover:scale-105 hover:shadow-lg max-md:flex-col max-md:items-center max-md:justify-center max-md:text-center max-md:gap-2 max-md:px-3 max-md:py-4 max-md:min-h-[125px]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-500 max-md:h-7 max-md:w-7">
                <CheckCircle size={18} className="max-md:size-[16px]" />
              </div>

              <div className="max-md:flex max-md:flex-col max-md:items-center">
                <p className="text-lg font-bold text-gray-900 max-md:text-base">
                  89%
                </p>

                <p className="text-xs text-gray-500 max-md:text-[10px]">
                  УСПЕШНО РЕШЕНИ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
