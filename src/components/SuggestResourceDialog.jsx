import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function SuggestResourceDialog({ open, onOpenChange, onSuccess, userProfile }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save to database
      await base44.entities.SuggestedResource.create({
        user_email: userProfile.user_email,
        user_name: userProfile.name,
        company: userProfile.company,
        team: userProfile.team,
        title: title.trim(),
        description: description.trim(),
        status: 'pending'
      });

      // Send email notification
      await base44.integrations.Core.SendEmail({
        to: 'hello@35nventures.com',
        subject: 'New Resource Suggestion',
        body: `
New resource suggestion from ${userProfile.name} (${userProfile.user_email})

Company: ${userProfile.company}
Team: ${userProfile.team}

Title: ${title}

Description: ${description}
        `.trim()
      });

      setTitle('');
      setDescription('');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error('Failed to submit suggestion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Suggest a Resource</DialogTitle>
          <DialogDescription>
            Have a tool, guide, or resource that would be valuable? Let us know!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource title"
              className="mt-1.5"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the resource and why it would be valuable"
              rows={5}
              className="mt-1.5"
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}