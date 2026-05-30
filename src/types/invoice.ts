export interface InvoiceItem {
  id: string;
  serviceName: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  patientName: string;
  date: string;
  status: "draft" | "paid" | "unpaid";
  items: InvoiceItem[];
  total: number;
}