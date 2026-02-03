import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, LogIn, Users, FolderOpen, Layout, Lightbulb } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import InsightsTab from "@/components/admin/InsightsTab";
import LoginsTab from "@/components/admin/LoginsTab";
import UsersTab from "@/components/admin/UsersTab";
import ResourcesManagementTab from "@/components/admin/ResourcesManagementTab";
import FilterAttributesTab from "@/components/admin/FilterAttributesTab";
import SuggestedResourcesTab from "@/components/admin/SuggestedResourcesTab";
import FeedbackTab from "@/components/admin/FeedbackTab";
import AccessRequestsTab from "@/components/admin/AccessRequestsTab";
import AccessCodesTab from "@/components/admin/AccessCodesTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('manage');
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      navigate(createPageUrl('Dashboard'));
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_695a45a00c41aebc946dc291/dcce5d331_VenturesBlack.png" 
                alt="35N Ventures" 
                className="h-8 object-contain"
              />
              <div className="hidden sm:block h-8 w-px bg-slate-200" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-xs text-slate-500">Manage your platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white border border-slate-200 p-1">
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="logins" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Logins
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Filters
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Access Requests
            </TabsTrigger>
            <TabsTrigger value="codes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Access Codes
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Suggestions
            </TabsTrigger>
            </TabsList>

          <TabsContent value="insights">
            <InsightsTab />
          </TabsContent>

          <TabsContent value="logins">
            <LoginsTab />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>

          <TabsContent value="manage">
            <ResourcesManagementTab />
          </TabsContent>

          <TabsContent value="filters">
            <FilterAttributesTab />
          </TabsContent>

          <TabsContent value="suggestions">
            <SuggestedResourcesTab />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackTab />
          </TabsContent>

          <TabsContent value="access">
            <AccessRequestsTab />
          </TabsContent>

          <TabsContent value="codes">
            <AccessCodesTab />
          </TabsContent>
          </Tabs>
      </main>
    </div>
  );
}