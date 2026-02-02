import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function AccessRequestDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Request received</DialogTitle>
              <p className="text-sm text-slate-500 mt-1">We will get back to you asap</p>
            </div>
          </div>
        </DialogHeader>
        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)} className="bg-slate-900 hover:bg-slate-800">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}