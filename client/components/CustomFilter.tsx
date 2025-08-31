"use client";

import { useRouter } from "next/navigation";

interface Option {
  title: string;
  value: string;
}

interface CustomFilterProps {
  title: string;
  options: Option[];
}

const CustomFilter = ({ title, options }: CustomFilterProps) => {
  const router = useRouter();

  const handleUpdateParams = (value: string) => {
    const searchParams = new URLSearchParams(window.location.search);

    if (value) {
      searchParams.set(title.toLowerCase(), value.toLowerCase());
    } else {
      searchParams.delete(title.toLowerCase());
    }

    // Corregido con template string
    const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
    router.push(newPathname);
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">{title}</label>
      <select
        onChange={(e) => handleUpdateParams(e.target.value)}
        className="p-3 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {/* ✅ También corregido el template string */}
        <option value="">{`Seleccionar ${title}`}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomFilter;

