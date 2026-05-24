"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function OdontogramPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  // tRPC işlemleri
  const utils = api.useUtils();
  const { data: teethData } = api.odontogram.get.useQuery({ patientId });
  const saveMutation = api.odontogram.save.useMutation({
    onSuccess: () => {
      utils.odontogram.get.invalidate({ patientId });
      alert("Status zuba uspješno spremljen!");
    },
  });

  // FDI numeracija
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerLeft = [38, 37, 36, 35, 34, 33, 32, 31];
  const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48];

  // State yönetimi
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [condition, setCondition] = useState("healthy");
  const [notes, setNotes] = useState("");

  // Seçili dişin verilerini veritabanından çekip forma doldur
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
      saveMutation.mutate({
        patientId,
        toothNumber: selectedTooth,
        condition,
        notes,
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <div>
          <button
            onClick={() => router.push(`/dashboard/patients/${patientId}`)}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-1"
          >
            ← Nazad na profil pacijenta
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Odontogram Pacijenta (Scrum-65)</h1>
          <p className="text-xs text-gray-500">ID Pacijenta: {patientId}</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
          FDI Šema Zuba Aktivna
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-sm font-medium text-gray-600 mb-8 text-center">🦷 Kliknite na zub da biste unijeli dijagnozu ili pregledali status.</p>

          <div className="flex flex-col items-center gap-4 w-full border-b border-dashed border-gray-300 pb-6 mb-6">
            <span className="text-xs font-bold text-gray-400 tracking-wider">GORNJA VILICA (MAXILLA)</span>
            <div className="flex gap-2 sm:gap-4 justify-center items-center flex-wrap">
              <div className="flex gap-1.5">{upperRight.map(t => <ToothButton key={t} n={t} sel={selectedTooth} set={setSelectedTooth} />)}</div>
              <div className="w-[2px] h-8 bg-gray-300 hidden sm:block"></div>
              <div className="flex gap-1.5">{upperLeft.map(t => <ToothButton key={t} n={t} sel={selectedTooth} set={setSelectedTooth} />)}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex gap-2 sm:gap-4 justify-center items-center flex-wrap">
              <div className="flex gap-1.5">{lowerRight.slice().reverse().map(t => <ToothButton key={t} n={t} sel={selectedTooth} set={setSelectedTooth} />)}</div>
              <div className="w-[2px] h-8 bg-gray-300 hidden sm:block"></div>
              <div className="flex gap-1.5">{lowerLeft.map(t => <ToothButton key={t} n={t} sel={selectedTooth} set={setSelectedTooth} />)}</div>
            </div>
            <span className="text-xs font-bold text-gray-400 tracking-wider mt-2">DONJA VILICA (MANDIBULA)</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Dijagnoza i Plan Tretmana</h3>
            {selectedTooth ? (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800 font-semibold">Odabrani Zub: Br. {selectedTooth}</p>
                </div>
                <select 
                  value={condition} 
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white text-gray-700"
                >
                  <option value="healthy">Zdrav zub (Healthy)</option>
                  <option value="caries">Karijes (Caries)</option>
                  <option value="missing">Nedostaje zub (Missing)</option>
                  <option value="filled">Plomba (Filled)</option>
                  <option value="bridge">Most (Bridge)</option>
                  <option value="implant">Implantat (Implant)</option>
                </select>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Unesite zapažanja..."
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-700"
                />
              </div>
            ) : (
              <p className="text-center py-12 text-gray-400 text-sm">Odaberite zub sa šeme.</p>
            )}
          </div>
          {selectedTooth && (
            <button 
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors mt-6 shadow-sm"
            >
              {saveMutation.isPending ? "Spremanje..." : "Spremi Status Zuba"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ToothButton({ n, sel, set }: { n: number; sel: number | null; set: (n: number) => void }) {
  return (
    <button
      onClick={() => set(n)}
      className={`w-10 h-12 flex flex-col items-center justify-center font-bold text-sm rounded-md transition-all border ${
        sel === n ? "bg-blue-600 text-white border-blue-700 shadow-md scale-105" : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
      }`}
    >
      <span className="text-[10px] text-gray-400 font-normal">#</span>
      {n}
    </button>
  );
}