import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle, ArrowLeft, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";

export default function ResultDialog({ open, onClose, result }) {
  if (!result) return null;

  const statusConfig = {
    pass: {
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      title: 'Ready to Launch! 🎉',
      description: 'Your product has passed the CX Launch Scorecard assessment.'
    },
    conditional: {
      icon: AlertTriangle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      title: 'Conditional Pass',
      description: 'Your product needs some improvements before launch.'
    },
    fail: {
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: 'Not Ready for Launch',
      description: 'Your product requires significant improvements before launch.'
    }
  };

  const config = statusConfig[result.status];
  const Icon = config.icon;

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white border-0 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className={`mx-auto p-6 rounded-full ${config.bgColor}`}>
            <Icon className={`h-16 w-16 ${config.color}`} />
          </div>
          <DialogTitle className="text-2xl font-semibold text-center tracking-tight">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-500 text-base">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className={`mt-4 p-6 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-2">Final Score</p>
            <p className="text-4xl font-bold text-slate-900">
              {result.total_score} <span className="text-xl font-normal text-slate-400">/ 72</span>
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Minimum passing score: 58
            </p>
          </div>

          {result.critical_failures && result.critical_failures.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm font-medium text-red-600 mb-2">Critical Sections Failed:</p>
              <ul className="text-sm text-slate-600 space-y-1">
                {result.critical_failures.map((section, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    {section}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link to={createPageUrl('Dashboard')} className="flex-1">
            <Button variant="outline" className="w-full h-12 border-slate-200 hover:bg-slate-50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="flex-1 h-12 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}