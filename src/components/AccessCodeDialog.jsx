import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { Loader2, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AccessCodeDialog({ open, onOpenChange, resource }) {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  const resourceId = resource?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsChecking(true);

    try {
      // Find the access code in database
      const accessCodes = await base44.entities.AccessCode.filter({
        code: code.trim()
      });

      if (accessCodes.length === 0) {
        setError('Code is incorrect. Please try again or check with the admin.');
        setIsValid(false);
        return;
      }

      const accessCode = accessCodes[0];

      // Check if resource is in the allowed resources for this code
      if (!accessCode.resources.includes(resourceId)) {
        setError('This code does not grant access to this resource.');
        setIsValid(false);
        return;
      }

      // Code is valid
      setIsValid(true);
      setError('');
      
      // Store the code in session storage so the user can access the resource
      sessionStorage.setItem(`access_code_${resourceId}`, code.trim());
      
      // Close dialog and redirect to resource
      setTimeout(() => {
        onOpenChange(false);
        toast.success('Access granted!');
        
        // Redirect based on resource type
        if (resource.file_url) {
          window.open(resource.file_url, '_blank');
        } else if (resource.link) {
          window.open(resource.link, '_blank');
        } else if (resource.page) {
          navigate(createPageUrl(resource.page));
        }
      }, 1000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleReset = () => {
    setCode('');
    setError('');
    setIsValid(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleReset}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Access Code</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isValid ? (
            <>
              <p className="text-sm text-slate-600">
                This is an exclusive resource. Please enter the access code provided to you.
              </p>
              <Input
                type="text"
                placeholder="Enter access code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                disabled={isChecking}
                className="font-mono"
                autoFocus
              />

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={!code.trim() || isChecking}
                className="w-full"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-3 py-4">
              <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-700">Code verified!</p>
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