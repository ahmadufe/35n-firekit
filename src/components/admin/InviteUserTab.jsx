import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

export default function InviteUserTab() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsInviting(true);
    try {
      await base44.users.inviteUser(email, role);
      toast.success(`Invitation sent to ${email}`);
      setEmail('');
      setRole('user');
    } catch (error) {
      toast.error('Failed to send invitation. Please try again.');
    }
    setIsInviting(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Invite Users</h2>
        <p className="text-sm text-slate-500 mt-1">Send invitations to new users or admins</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Invitation
          </CardTitle>
          <CardDescription>
            Invite new users to join the platform. Admin users will have access to this dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-slate-700">
                Role
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-12 border-slate-200">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Admin users can access the admin dashboard and manage the platform.
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isInviting}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium"
            >
              {isInviting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Invitation...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">How it works</h3>
              <p className="text-sm text-blue-800">
                The invited user will receive an email with a link to create their account. 
                Once they complete the signup process, they'll be able to access the platform with the role you assigned.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}