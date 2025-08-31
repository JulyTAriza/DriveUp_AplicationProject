"use client";

export default function ReportsPage() {
  // Datos de ejemplo estáticos
  const reportData = [
    { month: "Enero", reservations: 20, income: 5000 },
    { month: "Febrero", reservations: 15, income: 4200 },
    { month: "Marzo", reservations: 25, income: 6000 },
  ];

  const popularCars = [
    { carName: "Toyota Corolla", count: 12 },
    { carName: "Honda Civic", count: 9 },
    { carName: "Ford Focus", count: 7 },
  ];

  return (
    <div className="mx-auto pb-5 w-full">
      <h1 className="text-2xl font-bold mb-6">Reportes</h1>

      {/* RESERVAS E INGRESOS (simulados) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Reservas por mes</h2>
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
            Gráfico de barras simulado
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Ingresos por mes</h2>
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
            Gráfico de líneas simulado
          </div>
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

      {/* BOTÓN DE EXPORTAR */}
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Exportar a CSV
        </button>
      </div>
    </div>
  );
}

