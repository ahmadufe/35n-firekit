import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
    if (formData.interested_resources.length === 0) newErrors.interested_resources = 'Please select at least one resource';
    if (formData.interested_areas.length === 0) newErrors.interested_areas = 'Please select at least one area';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResourceToggle = (resource) => {
    setFormData(prev => ({
      ...prev,
      interested_resources: prev.interested_resources.includes(resource)
        ? prev.interested_resources.filter(r => r !== resource)
        : [...prev.interested_resources, resource]
    }));
  };

  const handleAreaToggle = (area) => {
    setFormData(prev => ({
      ...prev,
      interested_areas: prev.interested_areas.includes(area)
        ? prev.interested_areas.filter(a => a !== area)
        : [...prev.interested_areas, area]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-4xl bg-white border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
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
              placeholder="e.g. Product, Marketing & Growth, etc."
              className={`h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900 ${errors.team ? 'border-red-500' : ''}`}
            />
            {errors.team && <p className="text-xs text-red-500">{errors.team}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              What resources are you most interested in? *
            </Label>
            <div className="space-y-3">
              {['Tools', 'Playbooks', 'Knowledge resources & material'].map((resource) => (
                <div key={resource} className="flex items-center space-x-2">
                  <Checkbox
                    id={`resource-${resource}`}
                    checked={formData.interested_resources.includes(resource)}
                    onCheckedChange={() => handleResourceToggle(resource)}
                  />
                  <label
                    htmlFor={`resource-${resource}`}
                    className="text-sm text-slate-700 cursor-pointer"
                  >
                    {resource}
                  </label>
                </div>
              ))}
            </div>
            {errors.interested_resources && <p className="text-xs text-red-500">{errors.interested_resources}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Which areas are you most interested in? *
            </Label>
            <p className="text-xs text-slate-500">
              Pick all that interest you
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                'Fintech',
                'Trade & Logistics',
                'Gov-tech',
                'SaaS',
                'Banking technology',
                'AI',
                'Digital transformation & platforms',
                'Product building',
                'Venture building',
                'Africa startups & tech',
                'Middle East startups & tech',
                'Emerging markets startups & tech'
              ].map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={`area-${area}`}
                    checked={formData.interested_areas.includes(area)}
                    onCheckedChange={() => handleAreaToggle(area)}
                  />
                  <label
                    htmlFor={`area-${area}`}
                    className="text-sm text-slate-700 cursor-pointer"
                  >
                    {area}
                  </label>
                </div>
              ))}
            </div>
            {errors.interested_areas && <p className="text-xs text-red-500">{errors.interested_areas}</p>}
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