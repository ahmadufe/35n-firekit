import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ThankYouDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-center text-xl">Thank you for the suggestion</DialogTitle>
          <DialogDescription className="text-center text-base">
            We will consider your suggestion
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}