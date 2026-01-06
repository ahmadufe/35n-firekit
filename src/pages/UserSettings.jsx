import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";


export default function UserSettings() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    team: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: userProfiles = [], isLoading } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => base44.entities.UserProfile.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const userProfile = userProfiles[0];

  useEffect(() => {
    if (userProfile && user) {
      setFormData({
        name: userProfile.name || '',
        company: userProfile.company || '',
        team: userProfile.team || ''
      });
    }
  }, [userProfile, user]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.company.trim() || !formData.team.trim()) {
      toast.error('All fields are required');
      return;
    }

    setIsSaving(true);
    await base44.entities.UserProfile.update(userProfile.id, {
      name: formData.name,
      company: formData.company,
      team: formData.team
    });
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    toast.success('Profile updated successfully');
    setIsSaving(false);
  };

  const handlePasswordReset = async () => {
    setIsResettingPassword(true);
    try {
      await base44.auth.requestPasswordReset(user.email);
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error('Failed to send password reset link');
    }
    setIsResettingPassword(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 tracking-tight">User Details</h1>
              <p className="text-xs text-slate-500">Manage your profile information</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  {formData.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <CardTitle className="text-xl tracking-tight">{formData.name || 'Your Profile'}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="h-12 border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500">
                Email address cannot be changed. Contact support at <a href="mailto:hello@35nventures.com" className="text-slate-900 underline hover:text-slate-700">hello@35nventures.com</a> if you need to update it.
              </p>
              </div>

              <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value="••••••••••••"
                  disabled
                  className="h-12 border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                type="button"
                onClick={handlePasswordReset}
                disabled={isResettingPassword}
                variant="outline"
                className="w-full mt-2 h-10 border-slate-200"
              >
                {isResettingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Reset Password via Email
                  </>
                )}
              </Button>
              <p className="text-xs text-slate-500">
                Click the button above to receive a password reset link in your email.
              </p>
              </div>

              <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium text-slate-700">
                Company
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Enter your company name"
                className="h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team" className="text-sm font-medium text-slate-700">
                Team
              </Label>
              <Input
                id="team"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                placeholder="Enter your team name"
                className="h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
              />
            </div>

            <div className="pt-6">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium tracking-wide"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      </div>
  );
}