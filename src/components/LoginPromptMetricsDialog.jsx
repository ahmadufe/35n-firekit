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

export default function LoginPromptMetricsDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Sign in Required</DialogTitle>
          <DialogDescription className="text-base pt-2">
            To complete, save and extract this data, please login.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-slate-900 hover:bg-slate-800"
          >
            Sign up / Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}