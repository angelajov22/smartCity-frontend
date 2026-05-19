import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export const MOCK_USERS = [
  { id: 1, name: "Никола Петровски", reports: 12, trusted: true },
  { id: 2, name: "Марија Стојановска", reports: 5, trusted: false },
];

export const CATEGORIES = [
  "Јавна Хигиена",
  "Патишта",
  "Јавно Осветлување",
  "Паркови",
  "Друго",
];

const INITIAL_CASES = [
  {
    id: 3421,
    category: "Јавна Хигиена",
    status: "solved",
    address: "ул. Партизански Одреди бр. 42, Скопје",
    date: "10 Март, 2024",
    reportedById: 1,
    description:
      "На оваа локација подолго време стоеше голема количина на отпад и градежен шут кој ги попречуваше пешаците. Покрај тоа, се ширеше непријатна миризба.",
    supports: [2],
    comments: [
      {
        id: 1,
        userId: 2,
        text: "И јас го забележав ова! Благодарам за пријавата.",
        date: "11 Март, 2024",
      },
    ],
    history: [
      { date: "12 Март, 2024", time: "14:20", text: "Случајот е означен како решен од страна на Општина Инспекторат." },
      { date: "11 Март, 2024", time: "09:15", text: "Екипа на Комунална Хигиена е испратена на терен." },
      { date: "10 Март, 2024", time: "16:45", text: "Пријавата е примена и доделена на надлежен орган." },
    ],
  },
  {
    id: 3420,
    category: "Јавно Осветлување",
    status: "pending",
    address: "бул. Александар Македонски бр. 15, Скопје",
    date: "8 Март, 2024",
    reportedById: 2,
    description: "Три улични светилки не работат веќе две недели. Навечер е многу темно и опасно за пешаците.",
    supports: [1],
    comments: [],
    history: [
      { date: "9 Март, 2024", time: "10:00", text: "Пријавата е примена и доделена на надлежен орган." },
      { date: "8 Март, 2024", time: "18:30", text: "Пријавата е поднесена." },
    ],
  },
  {
    id: 3419,
    category: "Патишта",
    status: "in-progress",
    address: "ул. Даме Груев бр. 8, Скопје",
    date: "5 Март, 2024",
    reportedById: 1,
    description: "Голема дупка на коловозот која предизвикува опасност за возилата и велосипедистите.",
    supports: [],
    comments: [
      { id: 2, userId: 1, text: "Оштетив гума поради оваа дупка. Итно треба да се поправи!", date: "6 Март, 2024" },
    ],
    history: [
      { date: "7 Март, 2024", time: "11:00", text: "ЈП Улици и Патишта е известено." },
      { date: "5 Март, 2024", time: "09:20", text: "Пријавата е примена." },
    ],
  },
];

export function AppProvider({ children }) {
  const [cases, setCases] = useState(INITIAL_CASES);

  const updateCase = (updated) => {
    setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const addCase = (newCase) => {
    setCases((prev) => [newCase, ...prev]);
  };

  return (
    <AppContext.Provider value={{ cases, updateCase, addCase }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
