"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categoryApi, Category } from "@/state/api";

export default function CategoriesFilter() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedId = searchParams.get("categoryId");

  useEffect(() => {
    const run = async () => {
      try {
        const data = await categoryApi.getAll(); // usa tu API
        setCategories(data);
      } catch (e) {
        console.error(e);
        setErr("No se pudieron cargar las categorías");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const setCategory = (id?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("categoryId", String(id));
    } else {
      params.delete("categoryId");
    }
    // Mantiene los demás filtros (q, fuel, year) y solo cambia categoryId
    router.push(`${pathname}?${params.toString()}`);
  };

  if (loading) return <div className="text-gray-500">Cargando categorías…</div>;
  if (err) return <div className="text-red-500">{err}</div>;

  return (
    <div className="flex items-center gap-3 overflow-x-auto py-2">
      {/* Chip "Todas" */}
      <button
        onClick={() => setCategory(undefined)}
        className={`px-4 py-2 rounded-full border transition whitespace-nowrap ${
          !selectedId ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"
        }`}
      >
        Todas
      </button>

      {categories.map((c) => {
        const active = selectedId === String(c.id);
        return (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2 rounded-full border transition whitespace-nowrap ${
              active ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"
            }`}
            title={c.name}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
