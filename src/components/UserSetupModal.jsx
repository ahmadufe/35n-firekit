import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function UserSetupModal({ open, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    team: '',
    interested_resources: [],
    interested_areas: []
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.team.trim()) newErrors.team = 'Team is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_695a45a00c41aebc946dc291/dcce5d331_VenturesBlack.png" 
              alt="35N Ventures" 
              className="h-12 object-contain"
            />
          </div>
          <DialogTitle className="text-2xl font-light text-center tracking-tight">
            Welcome to Builder Base
          </DialogTitle>
          <DialogDescription className="text-center text-slate-500">
            Please complete your profile to get started
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
              Full Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              className={`h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium text-slate-700">
              Company *
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Enter your company name"
              className={`h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900 ${errors.company ? 'border-red-500' : ''}`}
            />
            {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="team" className="text-sm font-medium text-slate-700">
              Team *
            </Label>
            <Input
              id="team"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              placeholder="Enter your team name"
              className={`h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900 ${errors.team ? 'border-red-500' : ''}`}
            />
            {errors.team && <p className="text-xs text-red-500">{errors.team}</p>}
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium tracking-wide transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}