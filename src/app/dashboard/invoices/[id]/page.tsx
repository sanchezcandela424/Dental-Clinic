import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import type { Invoice } from "@/types/invoice";
const mockInvoice: Invoice = {
  id: "INV-001",
  patientName: "Ajša Jusić",
  date: "2026-05-30",
  status: "unpaid",
  total: 210,
  items: [
    {
      id: "1",
      serviceName: "Pregled",
      quantity: 1,
      price: 30,
    },
    {
      id: "2",
      serviceName: "Čišćenje kamenca",
      quantity: 1,
      price: 80,
    },
    {
      id: "3",
      serviceName: "Popravka zuba",
      quantity: 1,
      price: 100,
    },
  ],
};

export default function InvoiceDetailsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        <Link
          href="/dashboard/invoices"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Nazad na račune
        </Link>

        <InvoicePreview invoice={mockInvoice} />
      </div>
    </div>
  );
}