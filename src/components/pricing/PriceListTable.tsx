import { Trash2 } from "lucide-react";
type Service = {
  code: string;
  name: string;
  price: number;
};

type Props = {
  services: Service[];
  onDeleteService: (code: string) => void;
};

export default function PriceListTable({
                                         services,
                                         onDeleteService,
                                       }: Props) {

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b bg-gray-50">
        <tr className="text-left text-sm text-gray-500">
          <th className="px-6 py-4">Šifra</th>
          <th className="px-6 py-4">Usluga</th>
          <th className="px-6 py-4">Cijena</th>
          <th className="px-6 py-4 text-right">
            Akcije
          </th>
        </tr>
        </thead>

        <tbody>
        {services.map((service) => (
          <tr
            key={service.code}
            className="border-b transition hover:bg-gray-50"
          >
            <td className="px-6 py-4 text-gray-600">
              {service.code}
            </td>

            <td className="px-6 py-4 font-medium">
              {service.name}
            </td>

            <td className="px-6 py-4 text-gray-600">
              {service.price} KM
            </td>
            <td className="px-6 py-4 text-right">
              <button
                onClick={() => {
                  const confirmed = window.confirm(
                    `Da li ste sigurni da želite obrisati uslugu "${service.name}"?`
                  );

                  if (confirmed) {
                    onDeleteService(service.code);
                  }
                }}
                className="text-red-500 transition hover:text-red-700"
                title="Obriši uslugu"
              >
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}

        {services.length === 0 && (
          <tr>
            <td
              colSpan={4}
              className="px-6 py-8 text-center text-gray-500"
            >
              Nema unesenih usluga.
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
}