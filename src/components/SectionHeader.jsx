import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

export default function SectionHeader({ title, comingSoon = false }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <h2 className={`text-2xl font-semibold tracking-tight ${comingSoon ? 'text-slate-400' : 'text-slate-900'}`}>
        {title}
      </h2>
      {comingSoon && (
        <Badge variant="outline" className="border-slate-300 text-slate-400 font-normal">
          <Lock className="h-3 w-3 mr-1" />
          Coming Soon
        </Badge>
      )}
      <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
    </div>
  );
}