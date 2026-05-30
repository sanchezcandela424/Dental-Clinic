import { Invoice } from "@/types/invoice";
import Image from "next/image";

type Props = {
  invoice: Invoice;
};

export default function InvoiceTemplate({
                                          invoice,
                                        }: Props) {
  const formattedDate = new Date(invoice.date).toLocaleDateString(
    "bs-BA",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  return (
    <div className="bg-gray-200 py-10">
      <div className="mx-auto w-[210mm] min-h-[297mm] bg-white p-10 shadow-xl">

        {/* Header */}
        <div className="flex justify-between border-b pb-6">

          <div className="flex items-center gap-5">

            <div className="relative h-20 w-28">
              <Image
                src="/clinic-logo-v3.png"
                alt="City Dent Logo"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-xs tracking-wide">
                PRIVATNA STOMATOLOŠKA ORDINACIJA
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                CITY DENT
              </h1>

              <div className="mt-2 text-sm text-gray-700">
                <p>Dr. Erdin Tatarević</p>
                <p>Višnjik 34 B</p>
                <p>Sarajevo</p>
              </div>
            </div>

          </div>

          <div className="text-right text-sm">
            <p>
              <strong>Broj računa:</strong> {invoice.id}
            </p>

            <p className="mt-2">
              <strong>Datum:</strong> {formattedDate}
            </p>
          </div>

        </div>

        {/* Title */}
        <h2 className="my-10 text-center text-3xl font-bold tracking-wide">
          RAČUN
        </h2>

        {/* Patient */}
        <div className="mb-8 border p-4">
          <p className="text-sm text-gray-500">
            Pacijent
          </p>

          <p className="mt-1 text-lg font-semibold">
            {invoice.patientName}
          </p>
        </div>

        {/* Services */}
        <table className="w-full border-collapse">
          <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">
              Usluga
            </th>

            <th className="border p-3 text-center">
              Količina
            </th>

            <th className="border p-3 text-right">
              Cijena
            </th>

            <th className="border p-3 text-right">
              Ukupno
            </th>
          </tr>
          </thead>

          <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id}>
              <td className="border p-3">
                {item.serviceName}
              </td>

              <td className="border p-3 text-center">
                {item.quantity}
              </td>

              <td className="border p-3 text-right">
                {item.price.toFixed(2)} KM
              </td>

              <td className="border p-3 text-right font-medium">
                {(item.quantity * item.price).toFixed(2)} KM
              </td>
            </tr>
          ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="mt-8 flex justify-end">
          <div className="w-64 border-t-2 border-black pt-4 text-right">
            <p className="text-sm uppercase tracking-wide text-gray-500">
              Ukupno za platiti
            </p>

            <p className="text-3xl font-bold">
              {invoice.total.toFixed(2)} KM
            </p>

            <p className="mt-2 text-xs text-gray-500">
              U cijenu je uračunat PDV 17%.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-32 border-t pt-6">
          <div className="flex justify-between">

            <div className="text-sm text-gray-700">
              <p className="font-medium">
                Hvala na povjerenju!
              </p>

              <p className="mt-4">
                Sarajevo, {formattedDate}
              </p>
            </div>

            <div className="text-right">
              <p className="mb-12 text-sm text-gray-500">
                Potpis i pečat
              </p>

              <div className="mb-3 w-48 border-b border-black" />

              <p className="font-medium">
                Dr. Erdin Tatarević
              </p>

              <p className="text-sm text-gray-500">
                Stomatolog
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}