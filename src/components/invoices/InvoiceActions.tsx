import { Button } from "@/components/ui/button";

export default function InvoiceActions() {
  return (
    <div className="flex gap-3">
      <Button variant="outline">
        Preuzmi PDF
      </Button>

      <Button>
        Označi kao plaćen
      </Button>
    </div>
  );
}