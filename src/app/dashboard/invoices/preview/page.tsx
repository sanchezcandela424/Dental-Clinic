import InvoiceTemplate from "@/invoice-template/invoice-template";
const invoice = {
  id: "INV-001",
  patientName: "Ajša Jusić",
  date: "2026-05-30",
  total: 210,
  status: "paid",
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

export default function Page() {
  return (
    <InvoiceTemplate invoice={invoice} />
  );
}