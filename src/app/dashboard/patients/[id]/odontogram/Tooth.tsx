"use client";

import React from "react";

export type Surface = "TOP" | "BOTTOM" | "LEFT" | "RIGHT" | "CENTER" | null;

interface ToothProps {
  number: number;
  selectedTooth: number | null;
  selectedSurface: Surface;
  condition?: string; // Scrum-70: Dişin veritabanındaki durumunu buraya alıyoruz
  onSelect: (toothNumber: number, surface: Surface) => void;
}

export function Tooth({ number, selectedTooth, selectedSurface, condition = "healthy", onSelect }: ToothProps) {
  const isToothSelected = selectedTooth === number;
  const isSelected = (surface: Surface) => isToothSelected && selectedSurface === surface;

  // Scrum-70: Teşhislere Göre Renk Paleti
  const getConditionColor = () => {
    switch (condition) {
      case "caries": return "#ef4444"; // red-500 (Çürük)
      case "filled": return "#10b981"; // emerald-500 (Dolgu)
      case "missing": return "#475569"; // slate-600 (Eksik)
      case "bridge": return "#8b5cf6"; // violet-500 (Most)
      case "implant": return "#f59e0b"; // amber-500 (Implantat)
      default: return "white"; // healthy
    }
  };

  const selectedColor = "#3b82f6"; // blue-500 (Aktif Tıklama)
  const strokeColor = condition === "missing" ? "#334155" : "#94a3b8";

  // Renk Karar Mantığı: Yüzey seçiliyse mavi, değilse teşhis rengi (kırmızı/yeşil vs.)
  const getFill = (surface: Surface) => (isSelected(surface) ? selectedColor : getConditionColor());

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-sm font-bold ${isToothSelected ? "text-blue-600" : "text-gray-600"}`}>
        {number}
      </span>

      <svg
        width="44"
        height="44"
        viewBox="0 0 50 50"
        className={`transition-transform ${isToothSelected ? "scale-110 drop-shadow-md" : "hover:scale-105"}`}
      >
        <polygon points="0,0 50,0 35,15 15,15" fill={getFill("TOP")} stroke={strokeColor} strokeWidth="1" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelect(number, "TOP")} />
        <polygon points="0,50 50,50 35,35 15,35" fill={getFill("BOTTOM")} stroke={strokeColor} strokeWidth="1" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelect(number, "BOTTOM")} />
        <polygon points="0,0 15,15 15,35 0,50" fill={getFill("LEFT")} stroke={strokeColor} strokeWidth="1" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelect(number, "LEFT")} />
        <polygon points="50,0 35,15 35,35 50,50" fill={getFill("RIGHT")} stroke={strokeColor} strokeWidth="1" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelect(number, "RIGHT")} />
        <polygon points="15,15 35,15 35,35 15,35" fill={getFill("CENTER")} stroke={strokeColor} strokeWidth="1" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelect(number, "CENTER")} />
      </svg>
    </div>
  );
}