"use client";

import React from "react";

export type Surface = "TOP" | "BOTTOM" | "LEFT" | "RIGHT" | "CENTER" | null;

interface ToothProps {
  number: number;
  selectedTooth: number | null;
  selectedSurface: Surface;
  onSelect: (toothNumber: number, surface: Surface) => void;
}

export function Tooth({ number, selectedTooth, selectedSurface, onSelect }: ToothProps) {
  const isToothSelected = selectedTooth === number;
  const isSelected = (surface: Surface) => isToothSelected && selectedSurface === surface;

  const getFill = (surface: Surface) => (isSelected(surface) ? "#3b82f6" : "white");
  const strokeColor = "#94a3b8";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-sm font-bold ${isToothSelected ? "text-blue-600" : "text-gray-600"}`}>
        {number}
      </span>
      <svg width="40" height="40" viewBox="0 0 50 50" className="cursor-pointer transition-transform hover:scale-110">
        <polygon points="0,0 50,0 35,15 15,15" fill={getFill("TOP")} stroke={strokeColor} strokeWidth="1" onClick={() => onSelect(number, "TOP")} />
        <polygon points="0,50 50,50 35,35 15,35" fill={getFill("BOTTOM")} stroke={strokeColor} strokeWidth="1" onClick={() => onSelect(number, "BOTTOM")} />
        <polygon points="0,0 15,15 15,35 0,50" fill={getFill("LEFT")} stroke={strokeColor} strokeWidth="1" onClick={() => onSelect(number, "LEFT")} />
        <polygon points="50,0 35,15 35,35 50,50" fill={getFill("RIGHT")} stroke={strokeColor} strokeWidth="1" onClick={() => onSelect(number, "RIGHT")} />
        <polygon points="15,15 35,15 35,35 15,35" fill={getFill("CENTER")} stroke={strokeColor} strokeWidth="1" onClick={() => onSelect(number, "CENTER")} />
      </svg>
    </div>
  );
}