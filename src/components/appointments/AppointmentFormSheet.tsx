import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { api } from "~/trpc/react"; 

// Formun alacağı propları güncelledik. Artık initialData alabilir.
type AppointmentFormProps = {
  patientId: string;
  initialData?: {
    id: string;
    startTime: Date;
    reason?: string | null;
  };
};

export default function AppointmentFormSheet({ patientId, initialData }: AppointmentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const isUpdateMode = !!initialData;
  const utils = api.useUtils();

  // Modal her açıldığında verileri temizle veya Update modundaysa eski verileri doldur
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Date objesini native inputlar için YYYY-MM-DD ve HH:MM formatına çeviriyoruz
        const d = new Date(initialData.startTime);
        const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split("T")[0];
        const localTime = d.toTimeString().slice(0, 5);
        
        setDate(localDate || "");
        setTime(localTime || "");
        setReason(initialData.reason || "");
      } else {
        setDate("");
        setTime("");
        setReason("");
      }
    }
  }, [isOpen, initialData]);

  // 1. CREATE MUTATION (Senin yazdığın çalışan kısım)
  const createAppointment = api.appointment.create.useMutation({
    onSuccess: () => {
      alert("Termin je uspješno kreiran!");
      setIsOpen(false);
      utils.patients.getById.invalidate({ id: patientId });
    },
    onError: (error) => {
      alert("Greška: " + error.message);
    }
  });

  // 2. UPDATE & VALIDATION MUTATIONS (Sanjin bitirince '//' kısımlarını kaldır)
  // const updateAppointment = api.appointment.update.useMutation({
  //   onSuccess: () => {
  //     alert("Termin je uspješno ažuriran!");
  //     setIsOpen(false);
  //     utils.patients.getById.invalidate({ id: patientId });
  //   }
  // });
  // const checkAvailability = api.appointment.checkAvailability.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      alert("Molimo odaberite datum i vrijeme.");
      return;
    }

    const startDateTime = new Date(`${date}T${time}`);

    // --- ADIM 1: ÇAKIŞMA KONTROLÜ (Validation) ---
    // Sanjin'in endpoint'i bitince burayı aktif et:
    /*
    const isAvailable = await checkAvailability.mutateAsync({ startTime: startDateTime });
    if (!isAvailable) {
      alert("Odabrano vrijeme je već zauzeto! Molimo odaberite drugi termin.");
      return;
    }
    */

    // --- ADIM 2: CREATE VEYA UPDATE ---
    if (isUpdateMode && initialData) {
      // updateAppointment.mutate({
      //   id: initialData.id,
      //   startTime: startDateTime,
      //   reason,
      // });
      console.log("Sanjin bekleniyor: Güncelleme tetiklendi");
      alert("Update endpoint u pripremi..."); 
    } else {
      createAppointment.mutate({
        patientId,
        startTime: startDateTime,
        reason,
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {isUpdateMode ? (
          <Button variant="outline" className="rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2">
            ✏️ Uredi
          </Button>
        ) : (
          <Button className="rounded-xl bg-orange-600 px-4 py-2 text-white font-medium transition hover:bg-orange-700 flex items-center gap-2 h-auto">
            📅 Dodaj termin
          </Button>
        )}
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-xl">
            {isUpdateMode ? "Ažuriranje termina" : "Zakazivanje novog termina"}
          </SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Datum</label>
            <Input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Vrijeme</label>
            <Input 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              required 
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Razlog posjete (Opciono)</label>
            <Input 
              type="text" 
              placeholder="Npr. Čišćenje kamenca" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-4 py-2"
            >
              Odustani
            </Button>
            <Button 
              type="submit" 
              disabled={createAppointment.isPending}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-4 py-2"
            >
              {createAppointment.isPending 
                ? "Zapisivanje..." 
                : isUpdateMode 
                  ? "Sačuvaj izmjene" 
                  : "Sačuvaj termin"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}