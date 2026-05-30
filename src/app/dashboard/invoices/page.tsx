"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function InvoicesPage() {
  const invoices = [

    {
      id: "1",
      patientName: "Ajša Jusić",
      date: "28.05.2026",
      amount: 210,
      status: "Neplaćen",
    },
  ];
  const [search, setSearch] = useState("");
  const filteredInvoices = invoices.filter((invoice) =>
    invoice.patientName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">
              Računi i Naplata
            </h1>

            <p className="mt-1 text-gray-500">
              Pregled svih računa i uplata.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/invoices/create"
              className="rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
            >
              + Novi račun
            </Link>

            <Link
              href="/dashboard/price-list"
              className="rounded-xl bg-teal-600 px-5 py-3 text-white transition hover:bg-teal-700"
            >
              Cjenovnik
            </Link>
          </div>
        </div>
        {/* SEARCH */}
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pretraži račune..."
            className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-4">Pacijent</th>
              <th className="px-6 py-4">Datum</th>
              <th className="px-6 py-4">Iznos</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Akcije</th>
            </tr>
            </thead>

            <tbody>
            {filteredInvoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b transition hover:bg-gray-50 last:border-0"
              >
                <td className="px-6 py-4 font-medium">
                  {invoice.patientName}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {invoice.date}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {invoice.amount} KM
                </td>

                <td className="px-6 py-4">
                                    <span
                                      className={`rounded-full px-3 py-1 text-sm ${
                                        invoice.status === "Plaćen"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                        {invoice.status}
                                    </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">

                    <Link
                      href={`/dashboard/invoices/${invoice.id}`}
                      className="text-blue-600 transition hover:text-blue-800"
                      title="Pregled"
                    >
                      <Eye size={18} />
                    </Link>

                    <Link
                      href={`/dashboard/invoices/${invoice.id}/edit`}
                      className="text-gray-600 transition hover:text-gray-800"
                      title="Uredi"
                    >
                      <Pencil size={18} />
                    </Link>

                    <button
                      onClick={() => alert(`Obriši račun ${invoice.id}`)}
                      className="text-red-500 transition hover:text-red-700"
                      title="Obriši"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}

            {filteredInvoices.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Nema pronađenih računa.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}