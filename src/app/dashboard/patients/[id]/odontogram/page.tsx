"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Tooth, Surface } from "./Tooth";

const surfaceTranslations: Record<string, string> = {
  TOP: "Gore", BOTTOM: "Dolje", LEFT: "Lijevo", RIGHT: "Desno", CENTER: "Centar",
};

export default function OdontogramPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const utils = api.useUtils();
  
  // 1. YENİ EKLENEN KISIM: Hasta bilgilerini getiren sorgu
  const { data: patientData } = api.patient.get.useQuery({ id: patientId });
  
  // Mevcut diş verileri sorgusu
  const { data: teethData } = api.odontogram.get.useQuery({ patientId });
  
  const saveMutation = api.odontogram.save.useMutation({
    onSuccess: () => {
      utils.odontogram.get.invalidate({ patientId });
      setSelectedTooth(null);
      setSelectedSurface(null);
      alert("Status zuba uspješno spremljen!");
    },
  });

  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerLeft = [38, 37, 36, 35, 34, 33, 32, 31];
  const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48];

  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedSurface, setSelectedSurface] = useState<Surface>(null);
  const [condition, setCondition] = useState("healthy");
  const [notes, setNotes] = useState("");

  const handleToothSelect = (toothNumber: number, surface: Surface) => {
    setSelectedTooth(toothNumber);
    setSelectedSurface(surface);
  };

  useEffect(() => {
    if (selectedTooth && teethData) {
      const tooth = teethData.find((t) => t.toothNumber === selectedTooth);
      setCondition(tooth?.condition || "healthy");
      setNotes(tooth?.notes || "");
    } else {
      setCondition("healthy");
      setNotes("");
    }
  }, [selectedTooth, teethData]);

  const handleSave = () => {
    if (selectedTooth) {
      saveMutation.mutate({ patientId, toothNumber: selectedTooth, condition, notes });
    }
  };

  const renderTooth = (t: number) => {
    const dbTooth = teethData?.find((dbT) => dbT.toothNumber === t);
    return (
      <Tooth 
        key={t} 
        number={t} 
        selectedTooth={selectedTooth} 
        selectedSurface={selectedSurface} 
        condition={dbTooth?.condition} 
        onSelect={handleToothSelect} 
      />
    );
  };

  return (
    <div className="w-full min-h-screen bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <div>
          <button onClick={() => router.push(`/dashboard/patients/${patientId}`)} className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-1">
            ← Nazad na profil pacijenta
          </button>
          
          {/* 2. YENİ EKLENEN KISIM: ID yerine Hastanın Adını ve Soyadını Gösterme */}
          <h1 className="text-2xl font-bold text-gray-800">
            Odontogram: {patientData ? `${patientData.name || ""} ${patientData.surname || ""}` : "Učitavanje..."}
          </h1>
          
          <p className="text-xs text-gray-500 mt-1">ID Pacijenta: {patientId}</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">FDI Šema Zuba Aktivna</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-sm font-medium text-gray-600 mb-8 text-center">🦷 Kliknite na površinu zuba da biste unijeli dijagnozu.</p>

          <div className="flex flex-col items-center gap-4 w-full border-b border-dashed border-gray-300 pb-6 mb-6">
            <span className="text-xs font-bold text-gray-400 tracking-wider">GORNJA VILICA (MAXILLA)</span>
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <div className="flex gap-2">{upperRight.map((t) => renderTooth(t))}</div>
              <div className="w-[2px] h-12 bg-gray-300 hidden sm:block"></div>
              <div className="flex gap-2">{upperLeft.map((t) => renderTooth(t))}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <div className="flex gap-2">{lowerRight.slice().reverse().map((t) => renderTooth(t))}</div>
              <div className="w-[2px] h-12 bg-gray-300 hidden sm:block"></div>
              <div className="flex gap-2">{lowerLeft.map((t) => renderTooth(t))}</div>
            </div>
            <span className="text-xs font-bold text-gray-400 tracking-wider mt-2">DONJA VILICA (MANDIBULA)</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[450px]">
          <div>
            <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Dijagnoza i Plan Tretmana</h3>
            {selectedTooth ? (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800 font-semibold">Odabrani Zub: Br. {selectedTooth}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Površina: <strong>{selectedSurface ? surfaceTranslations[selectedSurface] : "Cijeli zub"}</strong>
                  </p>
                </div>
                
                <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white text-gray-700">
                  <option value="healthy">Zdrav zub (Healthy)</option>
                  <option value="caries">Karijes (Caries)</option>
                  <option value="missing">Nedostaje zub (Missing)</option>
                  <option value="filled">Plomba (Filled)</option>
                  <option value="bridge">Most (Bridge)</option>
                  <option value="implant">Implantat (Implant)</option>
                </select>
                <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Unesite zapažanja..." className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-700" />
                
                <button onClick={handleSave} disabled={saveMutation.isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-sm">
                  {saveMutation.isPending ? "Spremanje..." : "Spremi Status Zuba"}
                </button>
              </div>
            ) : (
              <p className="text-center py-12 text-gray-400 text-sm">Odaberite zub sa šeme.</p>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">Legenda Statusa</h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white border border-gray-300 inline-block shadow-sm"></span>
                <span className="text-gray-600 font-medium">Zdrav zub</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ef4444] inline-block shadow-sm"></span>
                <span className="text-gray-600 font-medium">Karijes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#10b981] inline-block shadow-sm"></span>
                <span className="text-gray-600 font-medium">Plomba</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#475569] inline-block shadow-sm"></span>
                <span className="text-gray-600 font-medium">Nedostaje zub</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8b5cf6] inline-block shadow-sm"></span>
                <span className="text-gray-600 font-medium">Most</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#f59e0b] inline-block shadow-sm"></span>
                <span className="text-gray-600 font-medium">Implantat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}