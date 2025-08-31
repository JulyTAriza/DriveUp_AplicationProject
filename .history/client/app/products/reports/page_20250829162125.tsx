"use client";

import { useEffect, useState } from "react";
import { reportApi } from "@/state/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";

interface ReportData {
  month: string;
  reservations: number;
  income: number;
}

interface PopularCar {
  carName: string;
  count: number;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [popularCars, setPopularCars] = useState<PopularCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const stats = await reportApi.getMonthlyStats();
        const cars = await reportApi.getPopularCars();
        setReportData(stats);
        setPopularCars(cars);
      } catch (err) {
        console.error("Error cargando reportes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <p className="text-center py-6">Cargando reportes...</p>;

  return (
    <div className="mx-auto pb-5 w-full">
      <h1 className="text-2xl font-bold mb-6">Reportes</h1>

      {/* RESERVAS E INGRESOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Reservas por mes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="reservations" fill="#3b82f6" name="Reservas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Ingresos por mes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" name="Ingresos ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AUTOS POPULARES */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Autos más rentados</h2>
        <table className="min-w-full bg-white border rounded">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-2 px-4 text-left">Auto</th>
              <th className="py-2 px-4 text-left">Cantidad de Reservas</th>
            </tr>
          </thead>
          <tbody>
            {popularCars.map((c, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{c.carName}</td>
                <td className="py-2 px-4">{c.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EXPORTAR */}
      <div className="flex justify-end">
        <button
          onClick={() => reportApi.exportCSV()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Exportar a CSV
        </button>
      </div>
    </div>
  );
}
