import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { base44 } from "@/api/base44Client";

export default function FeedbackDialog({ open, onOpenChange, onSuccess, userProfile, user }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate fields
    if (user) {
      if (!formData.message.trim()) {
        return;
      }
    } else {
      if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim() || !formData.message.trim()) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let feedbackData;
      
      if (user && userProfile) {
        // Logged-in user
        const nameParts = userProfile.name.split(' ');
        feedbackData = {
          first_name: nameParts[0] || userProfile.name,
          last_name: nameParts.slice(1).join(' ') || '',
          email: user.email,
          message: formData.message,
          company: userProfile.company || '',
          team: userProfile.team || ''
        };
      } else {
        // Non-logged-in user
        feedbackData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          message: formData.message,
          company: '',
          team: ''
        };
      }

      // Save to database
      await base44.entities.Feedback.create(feedbackData);

      // Send email
      await base44.integrations.Core.SendEmail({
        to: 'hello@35nventures.com',
        subject: 'New Feedback Received',
        body: `
New feedback has been received:

Name: ${feedbackData.first_name} ${feedbackData.last_name}
Email: ${feedbackData.email}
${feedbackData.company ? `Company: ${feedbackData.company}` : ''}
${feedbackData.team ? `Team: ${feedbackData.team}` : ''}

Message:
${feedbackData.message}
        `
      });

      // Reset form
      setFormData({ first_name: '', last_name: '', email: '', message: '' });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Give Feedback</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!user && (
            <>
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Enter your last name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="message">Your Feedback *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Share your thoughts, suggestions, or recommendations..."
              rows={6}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-slate-900 hover:bg-slate-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}