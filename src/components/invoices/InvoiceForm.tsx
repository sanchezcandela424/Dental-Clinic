"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { bs } from "date-fns/locale";
import { Trash2 } from "lucide-react";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const services = [
  { code: "0001", name: "Estetska jednopovršinska plomba", price: 50 },
  { code: "0002", name: "Estetska dvopovršinska plomba", price: 60 },
  { code: "0003", name: "Estetska tropovršinska plomba", price: 70 },
  { code: "0004", name: "Estetska jednopovršinska plomba - molari", price: 60 },
  { code: "0005", name: "Estetska dvopovršinska plomba - molari", price: 70 },
  { code: "0006", name: "Estetska tropovršinska plomba - molari", price: 80 },
  { code: "0007", name: "Nadogradnja zuba", price: 90 },
  { code: "0008", name: "Estetska kompozitna faseta", price: 90 },
  { code: "0009", name: "Plombiranje eq.", price: 40 },
  { code: "0010", name: "Amalgamska plomba", price: 50 },
  { code: "0011", name: "Zalivanje fisura za jedan zub", price: 30 },
  { code: "0012", name: "Ugradnja parapulparnog kočića", price: 50 },
  { code: "0013", name: "Konfekcijski intraradikularni kočić", price: 50 },
  { code: "0014", name: "Livena kočić nadogradnja - jednokorijena", price: 50 },
  { code: "0015", name: "Livena kočić nadogradnja - dvokorijena", price: 60 },
  { code: "0016", name: "Livena kočić nadogradnja - trokorijena", price: 70 },
  { code: "0017", name: "Estetska porculanska navlaka ili član mosta na metalu", price: 250 },
  { code: "0018", name: "Estetska porculanska navlaka sa stepenikom na metalu", price: 280 },
  { code: "0019", name: "Cirkonska navlaka - bezmetalna", price: 380 },
  { code: "0020", name: "Privremena navlaka ili član mosta", price: 30 },
  { code: "0021", name: "Totalna proteza estetska - troslojni zubi", price: 500 },
  { code: "0022", name: "Totalna proteza - fiziodens zubi", price: 700 },
  { code: "0023", name: "Totalna proteza - keramički zubi", price: 1000 },
  { code: "0024", name: "Parcijalna proteza - troslojni zubi", price: 450 },
  { code: "0025", name: "Parcijalna proteza - fiziodens zubi", price: 650 },
  { code: "0026", name: "Parcijalna proteza - keramički zubi", price: 850 },
  { code: "0027", name: "Metalna parcijalna proteza sa kukicama", price: 800 },
  { code: "0028", name: "Estetska metalna skelet proteza sa dvije bravice", price: 1100 },
  { code: "0029", name: "Estetska metalna skelet proteza sa dvije bravice - fiziodens", price: 1300 },
  { code: "0030", name: "Reparacija proteze", price: 50 },
  { code: "0031", name: "Podlaganje proteze", price: 60 },
  { code: "0032", name: "Ekstirpacija pulpe jednokorjenog zuba", price: 140 },
  { code: "0033", name: "Ekstirpacija pulpe dvokorjenog zuba", price: 160 },
  { code: "0034", name: "Ekstirpacija pulpe trokanalnog zuba", price: 200 },
  { code: "0035", name: "Liječenje gangrene jednokorjenog zuba", price: 160 },
  { code: "0036", name: "Liječenje gangrene dvokorjenog zuba", price: 180 },
  { code: "0037", name: "Liječenje gangrene trokanalnog zuba", price: 220 },
  { code: "0038", name: "Tretman periodontalnog džepa lijekovima", price: 30 },
  { code: "0039", name: "Subgingivalna kiretaža", price: 30 },
  { code: "0040", name: "Gingivektomija", price: 30 },
  { code: "0041", name: "Ekstrakcija jednokorijenog zuba", price: 50 },
  { code: "0042", name: "Ekstrakcija dvokorijenog zuba", price: 60 },
  { code: "0043", name: "Ekstrakcija molara", price: 70 },
  { code: "0044", name: "Ekstrakcija RR", price: 80 },
  { code: "0045", name: "Hirurška ekstrakcija umnjaka", price: 180 },
  { code: "0046", name: "Ekstrakcija totalno impaktiranog umnjaka", price: 300 },
  { code: "0047", name: "Premolarizacija zuba", price: 200 },
  { code: "0048", name: "Replantacija zuba", price: 300 },
  { code: "0049", name: "Apikotomija jednokorijenog zuba", price: 200 },
  { code: "0050", name: "Apikotomija dvokorijenog zuba", price: 250 },
  { code: "0051", name: "Incizija sa drenom", price: 50 },
  { code: "0052", name: "Sutura (šivanje)", price: 70 },
  { code: "0053", name: "Splint fiksacija po zubu", price: 30 },
  { code: "0054", name: "Bijeljenje avitalnog zuba", price: 150 },
  { code: "0055", name: "Bijeljenje vitalnih zuba", price: 40 },
  { code: "0056", name: "Ultrazvučno čišćenje i bijeljenje zuba", price: 50 },
  { code: "0057", name: "Kućna posjeta", price: 70 },
  { code: "0058", name: "Prvi pregled", price: 20 },
  { code: "0059", name: "Kontrolni pregled", price: 50 },
  { code: "0060", name: "Anestezija", price: 10 },
];

export default function InvoiceForm() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState<Date>();
  const [status, setStatus] = useState("draft");
  const [patientError, setPatientError] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [items, setItems] = useState([
    {
      serviceId: "",
      quantity: 1,
    },
  ]);

  const total = items.reduce((sum, item) => {
    const service = services.find((s) => s.code === item.serviceId);
    return sum + (service?.price ?? 0) * item.quantity;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setPatientError("");
    setServiceError("");

    let hasError = false;

    if (!patientName.trim()) {
      setPatientError("Unesite ime pacijenta.");
      hasError = true;
    }

    if (
      items.length === 0 ||
      items.every((item) => item.serviceId === "")
    ) {
      setServiceError("Dodajte barem jednu uslugu.");
      hasError = true;
    }

    if (hasError) return;

    console.log({
      patientName,
      date,
      status,
      items,
      total,
    });
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        serviceId: "",
        quantity: 1,
      },
    ]);
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold">
        Novi račun
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Pacijent
          </label>

          <Input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Ime i prezime pacijenta"
          />

          {patientError && (
            <p className="mt-1 text-sm text-red-500">
              {patientError}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Datum
          </label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-medium h-12 rounded-xl"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />

                {date
                  ? format(date, "dd.MM.yyyy.")
                  : "Odaberite datum"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-3 rounded-xl">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={bs}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Usluge
          </label>

          {items.map((item, index) => {
            const service = services.find(
              (s) => s.code === item.serviceId
            );

            return (
              <div
                key={index}
                className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 items-center"
              >
                <Popover
                  open={openIndex === index}
                  onOpenChange={(open) =>
                    setOpenIndex(open ? index : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="h-12 w-full justify-between rounded-xl font-normal"
                    >
                      {item.serviceId
                        ? services.find(
                          (s) => s.code === item.serviceId
                        )?.name
                        : "Odaberite uslugu"}

                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-[450px] p-0">
                    <Command>
                      <CommandInput placeholder="Pretraži uslugu..." />

                      <CommandEmpty>
                        Nema pronađenih usluga.
                      </CommandEmpty>

                      <CommandGroup className="max-h-72 overflow-y-auto">
                        {services.map((service) => (
                          <CommandItem
                            key={service.code}
                            value={`${service.code} ${service.name}`}
                            onSelect={() => {
                              const updated = [...items];
                              updated[index].serviceId =
                                service.code;
                              setItems(updated);
                              setOpenIndex(null);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                item.serviceId === service.code
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />

                            {service.code} - {service.name} (
                            {service.price} KM)
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[index].quantity =
                      Number(e.target.value);

                    setItems(updated);
                  }}
                />

                <>
                  <Input
                    disabled
                    value={
                      service
                        ? `${service.price} KM`
                        : ""
                    }
                  />


                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setItems(
                        items.filter(
                          (_, itemIndex) => itemIndex !== index
                        )
                      );
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                </>
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            onClick={addItem}
          >
            + Dodaj uslugu
          </Button>

          {serviceError && (
            <p className="text-sm text-red-500">
              {serviceError}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-lg font-semibold">
            Ukupno: {total} KM
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3 h-12"
          >
            <option value="draft">Nacrt</option>
            <option value="paid">Plaćen</option>
            <option value="unpaid">Neplaćen</option>
          </select>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sačuvaj račun
          </Button>
        </div>
      </form>
    </div>
  );
}