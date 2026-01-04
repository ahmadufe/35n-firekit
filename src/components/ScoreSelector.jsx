import React from 'react';
import { cn } from "@/lib/utils";

export default function ScoreSelector({ value, onChange, disabled = false }) {
  const options = [
    { value: 0, label: '0', description: 'Not addressed' },
    { value: 1, label: '1', description: 'Partial' },
    { value: 2, label: '2', description: 'Validated' }
  ];

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative w-12 h-12 rounded-xl font-semibold text-lg transition-all duration-200",
            "border-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2",
            value === option.value
              ? "bg-slate-900 border-slate-900 text-white shadow-lg scale-105"
              : "bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}