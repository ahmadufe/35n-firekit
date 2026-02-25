import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AccessCodeDialog({ open, onOpenChange, resource }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const resourceId = resource?.id;

  // Reset state when dialog opens or resource changes
  React.useEffect(() => {
    if (open) {
      setFormData({
        firstName: '',
        lastName: '',
        organization: '',
        email: ''
      });
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [open, resourceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save lead to database
      await base44.entities.Lead.create({
        first_name: formData.firstName,
        last_name: formData.lastName,
        organization: formData.organization,
        email: formData.email,
        resource_id: resourceId,
        resource_title: resource?.title
      });

      // Store access in session for the resource
      sessionStorage.setItem(`access_code_${resourceId}`, 'true');
      
      // Track the access request with user details
      base44.analytics.track({
        eventName: 'exclusive_resource_access',
        properties: {
          resource_id: resourceId,
          resource_title: resource?.title
        }
      });
      
      setIsSuccess(true);
      toast.success('Access granted! Redirecting...');
      
      // Close dialog and redirect to resource
      setTimeout(() => {
        onOpenChange(false);
        
        // Redirect based on resource type
        if (resource.page) {
          navigate(createPageUrl(resource.page));
        } else if (resource.file_url) {
          window.open(resource.file_url, '_blank');
        } else if (resource.link) {
          window.open(resource.link, '_blank');
        }
      }, 500);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      organization: '',
      email: ''
    });
    setIsSuccess(false);
    onOpenChange(false);
  };

  const isFormValid = formData.firstName.trim() && 
                       formData.lastName.trim() && 
                       formData.organization.trim() && 
                       formData.email.trim() &&
                       formData.email.includes('@');

  return (
    <Dialog open={open} onOpenChange={handleReset}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Access Exclusive Resource</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSuccess ? (
            <>
              <p className="text-sm text-slate-600">
                Please provide your details to access this exclusive resource.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    type="text"
                    placeholder="Enter your organization"
                    value={formData.organization}
                    onChange={(e) => handleChange('organization', e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Access Resource'
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-3 py-4">
              <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-700">Access granted!</p>
              </div>
              <p className="text-sm text-slate-600 text-center">
                You now have access to this resource.
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}