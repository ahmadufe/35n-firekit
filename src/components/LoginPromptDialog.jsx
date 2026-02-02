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
      <DialogContent className="sm:max-w-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">{title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleLogin}
            className="bg-slate-900 hover:bg-slate-800 text-white h-12 text-base font-bold px-6"
          >
            Sign up / Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}