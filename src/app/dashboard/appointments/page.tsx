"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";

// Çalışma saatleri çizelgesi (08:00 - 18:00)
const workingHours = Array.from({ length: 11 }, (_, i) => {
  const hour = 8 + i;
  return `${hour.toString().padStart(2, '0')}:00`;
});

// Bošnjačka imena za pacijente
const mockEvents = [
  { id: 1, patientName: "Amar Hadžić", time: "09:00 - 09:30", type: "Stomatološki pregled", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: 2, patientName: "Lamija Begić", time: "10:30 - 11:30", type: "Čišćenje kamenca", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { id: 3, patientName: "Haris Kovačević", time: "14:00 - 15:00", type: "Hirurška intervencija", color: "bg-red-100 text-red-700 border-red-200" },
];

export default function AppointmentsCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Tarayıcı hatalarını önlemek için özel Boşnakça tarih formatlayıcı
  const formatBosnianDate = (date: Date) => {
    const mjeseci = [
      "januar", "februar", "mart", "april", "maj", "juni",
      "juli", "august", "septembar", "oktobar", "novembar", "decembar"
    ];
    const dan = date.getDate();
    const mjesec = mjeseci[date.getMonth()];
    const godina = date.getFullYear();
    
    return `${dan}. ${mjesec} ${godina}.`;
  };

  // Gün değiştirme fonksiyonları (Arayüzde ileri/geri basınca çalışması için)
  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 1);
    setCurrentDate(next);
  };

  return (
    <div className="flex h-full flex-col p-6 space-y-6">
      {/* Zaglavlje */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-orange-600" />
            Kalendar i termini
          </h1>
          <p className="text-sm text-gray-500 mt-1">Radno vrijeme: 08:00 - 18:00</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={handlePrevDay}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-2 min-w-[140px] text-center text-slate-700 select-none">
              {formatBosnianDate(currentDate)}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={handleNextDay}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Novi termin
          </Button>
        </div>
      </div>

      {/* Grid kalendara */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
          
          {/* Vremenska linija */}
          <div className="hidden md:flex flex-col space-y-[48px] text-sm text-gray-400 font-medium pt-2 border-r border-gray-100 pr-4">
            {workingHours.map((time) => (
              <div key={time} className="h-4 flex items-start justify-end">{time}</div>
            ))}
          </div>

          {/* Glavni prostor za termine */}
          <div className="col-span-7 relative border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
            <div className="absolute top-0 left-0 w-full h-full flex flex-col space-y-[52px] opacity-20 pointer-events-none">
              {workingHours.map((_, i) => (
                <div key={i} className="border-t border-gray-300 w-full"></div>
              ))}
            </div>

            {/* Kartice termina */}
            <div className="relative z-10 flex flex-col gap-3 mt-4">
              {mockEvents.map((event) => (
                <div key={event.id} className={`p-4 rounded-xl border ${event.color} transition hover:shadow-md cursor-pointer`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800">{event.patientName}</h3>
                      <p className="text-sm opacity-80">{event.type}</p>
                    </div>
                    <span className="text-sm font-semibold bg-white/50 px-2 py-1 rounded-lg">
                      {event.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}