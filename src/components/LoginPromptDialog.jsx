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

export default function LoginPromptDialog({ open, onOpenChange, onClose, type = 'resource' }) {
  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  const content = {
    timed: {
      title: "Join us for free",
      description: "Signing up gives you free access to all our open tools and resources and lets you bookmark, use the tools without limits, and come back anytime. No spam. Promise."
    },
    resource: {
      title: "This one is for close friends. Join us",
      description: "Signing up gives you free access to all our open tools and resources and lets you bookmark, use the tools without limits, and come back anytime."
    }
  };

  const { title, description } = content[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-8">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl text-center">{title}</DialogTitle>
          <DialogDescription className="text-sm pt-2 px-4">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-6 pb-2">
          <Button 
            onClick={handleLogin}
            className="bg-slate-900 hover:bg-slate-800 text-white h-11 text-sm font-bold px-6"
          >
            Sign up / Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}