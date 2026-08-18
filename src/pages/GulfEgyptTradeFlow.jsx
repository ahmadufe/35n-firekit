import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const HTML_FILE_URL = 'https://media.base44.com/files/public/695a4c3829d04b83a5c959f0/25d55d4c1_49693f28d_gulf-egypt-trade-flows.html';

export default function GulfEgyptTradeFlow() {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-3">
        <Link to={createPageUrl('Dashboard')}>
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <iframe
        src={HTML_FILE_URL}
        title="Gulf & Egypt Trade Flow Explorer"
        className="w-full"
        style={{ height: 'calc(100vh - 57px)', border: 'none' }}
      />
    </div>
  );
}