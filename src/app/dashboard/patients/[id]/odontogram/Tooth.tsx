"use client";

import React from "react";

export type Surface = "TOP" | "BOTTOM" | "LEFT" | "RIGHT" | "CENTER" | null;

interface ToothProps {
    number: number;
    selectedTooth: number | null;
    selectedSurface: Surface;
    surfaceConditions: Record<string, string>; // per-surface conditions from DB
    onSelect: (toothNumber: number, surface: Surface) => void;
}

export function Tooth({ number, selectedTooth, selectedSurface, surfaceConditions, onSelect }: ToothProps) {
    const isToothSelected = selectedTooth === number;
    const isSelected = (surface: Surface) => isToothSelected && selectedSurface === surface;

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case "caries":  return "#ef4444";
            case "filled":  return "#10b981";
            case "missing": return "#475569";
            case "bridge":  return "#8b5cf6";
            case "implant": return "#f59e0b";
            default:        return "white";
        }
    };

    const selectedColor = "#3b82f6";

    // Each surface gets its own color from DB, blue if currently selected
    const getFill = (surface: Surface) => {
        if (isSelected(surface)) return selectedColor;
        return getConditionColor(surfaceConditions[surface ?? ""] ?? "healthy");
    };

    // Stroke is dark only if the whole tooth is missing
    const isMissing = Object.values(surfaceConditions).some((c) => c === "missing");
    const strokeColor = isMissing ? "#334155" : "#94a3b8";

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
                <polygon points="0,0 50,0 35,15 15,15"   fill={getFill("TOP")}    stroke={strokeColor} strokeWidth="1" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelect(number, "TOP")} />
                <polygon points="0,50 50,50 35,35 15,35"  fill={getFill("BOTTOM")} stroke={strokeColor} strokeWidth="1" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelect(number, "BOTTOM")} />
                <polygon points="0,0 15,15 15,35 0,50"    fill={getFill("LEFT")}   stroke={strokeColor} strokeWidth="1" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelect(number, "LEFT")} />
                <polygon points="50,0 35,15 35,35 50,50"  fill={getFill("RIGHT")}  stroke={strokeColor} strokeWidth="1" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelect(number, "RIGHT")} />
                <polygon points="15,15 35,15 35,35 15,35" fill={getFill("CENTER")} stroke={strokeColor} strokeWidth="1" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelect(number, "CENTER")} />
            </svg>
        </div>
    );
}