import type { Invoice } from "@/types/invoice";
import InvoiceActions from "./InvoiceActions";
type Props = {
  invoice: Invoice;
};

const statusLabels = {
  draft: "Nacrt",
  paid: "Plaćen",
  unpaid: "Neplaćen",
};

export default function InvoicePreview({ invoice }: Props) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-semibold">
        Račun br. {invoice.id}
      </h2>

      <div className="mb-6 space-y-2">
        <p>
          <span className="font-medium">Pacijent:</span>{" "}
          {invoice.patientName}
        </p>

        <p>
          <span className="font-medium">Datum:</span>{" "}
          {new Date(invoice.date).toLocaleDateString("bs-BA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>

        <p>
          <span className="font-medium">Status:</span>{" "}
          {
            statusLabels[
              invoice.status as keyof typeof statusLabels
              ]
          }
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium">
          Stavke računa
        </h3>

        <table className="w-full">
          <thead>
          <tr className="border-b text-left">
            <th className="py-2">Usluga</th>
            <th className="py-2">Količina</th>
            <th className="py-2">Cijena</th>
          </tr>
          </thead>

          <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-3">
                {item.serviceName}
              </td>

              <td className="py-3">
                {item.quantity}
              </td>

              <td className="py-3">
                {item.price} KM
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-xl bg-gray-50 p-4 text-right">
        <h2 className="text-2xl font-bold">
          Ukupno: {invoice.total} KM
        </h2>
      </div>

      <div className="mt-6 flex justify-end">
        <InvoiceActions />
      </div>
    </div>


  );
}