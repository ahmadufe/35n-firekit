import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function FeedbackThankYouDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl text-center">Thank you for your feedback</DialogTitle>
          <DialogDescription className="text-center text-base">
            We will look into it.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-2">
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-slate-900 hover:bg-slate-800"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}