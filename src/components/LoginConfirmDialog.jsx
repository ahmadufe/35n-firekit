import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function LoginConfirmDialog({ open, onOpenChange, onSkip }) {
  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Are you sure you don't want to sign up?</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Signing up gives you free access to all our open tools and resources and lets you bookmark, use the tools without limits, and come back anytime. No spam. Promise.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={handleLogin}
            className="bg-slate-900 hover:bg-slate-800 text-white w-full h-12 text-base"
          >
            Sign up / Login
          </Button>
          <Button 
            onClick={onSkip}
            variant="outline"
            className="w-full h-12 text-base"
          >
            Skip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}