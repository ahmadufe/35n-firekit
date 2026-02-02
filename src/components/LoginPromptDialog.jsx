import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function LoginPromptDialog({ open, onOpenChange, onClose }) {
  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
        <DialogHeader>
          <DialogTitle className="text-2xl">Sign up or Log in</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Get free access to all our tools, resources, and frameworks. Save your progress and come back anytime.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={handleLogin}
            className="bg-slate-900 hover:bg-slate-800 text-white w-full h-12 text-base"
          >
            Sign up / Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}