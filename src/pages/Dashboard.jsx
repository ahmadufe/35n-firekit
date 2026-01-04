import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ClipboardCheck, BookOpen, Wrench, User, LogOut, Settings, ChevronDown, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import UserSetupModal from "@/components/UserSetupModal";
import ToolCard from "@/components/ToolCard";
import SectionHeader from "@/components/SectionHeader";

export default function Dashboard() {
  const [showSetup, setShowSetup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: userProfiles = [], isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => base44.entities.UserProfile.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const userProfile = userProfiles[0];

  const { data: publishedConfig } = useQuery({
    queryKey: ['publishedLandingPage'],
    queryFn: async () => {
      const configs = await base44.entities.LandingPageConfig.filter({ config_name: 'published' });
      return configs[0];
    }
  });

  useEffect(() => {
    if (!profileLoading && !userLoading && user && !userProfile) {
      setShowSetup(true);
    }
  }, [userProfile, profileLoading, userLoading, user]);

  // Track login
  useEffect(() => {
    const trackLogin = async () => {
      if (user && userProfile) {
        const logins = await base44.entities.LoginHistory.filter({ user_email: user.email });
        const loginType = logins.length === 0 ? 'first_time' : 'returning';
        
        await base44.entities.LoginHistory.create({
          user_email: user.email,
          user_name: userProfile.name || user.full_name,
          login_type: loginType
        });
      }
    };

    if (user && userProfile && !showSetup) {
      trackLogin();
    }
  }, [user, userProfile, showSetup]);

  const handleSetupSubmit = async (formData) => {
    setIsSubmitting(true);
    await base44.entities.UserProfile.create({
      ...formData,
      user_email: user.email,
      setup_completed: true
    });
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    setShowSetup(false);
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (userLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-full" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UserSetupModal 
        open={showSetup} 
        onSubmit={handleSetupSubmit}
        isLoading={isSubmitting}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_695a45a00c41aebc946dc291/dcce5d331_VenturesBlack.png" 
                alt="35N Ventures" 
                className="h-10 object-contain"
              />
              <div className="hidden sm:block h-8 w-px bg-slate-200" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Builder Base</h1>
                <p className="text-xs text-slate-500">Free tools for builders</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-slate-100">
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userProfile?.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-slate-700">
                    {userProfile?.name || user?.email}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 shadow-xl">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-slate-900">{userProfile?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <Link to={createPageUrl('UserSettings')}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    User Details
                  </DropdownMenuItem>
                </Link>
                {user?.role === 'admin' && (
                  <>
                    <Link to={createPageUrl('AdminDashboard')}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-slate-900 tracking-tight mb-4">
            Welcome back{userProfile?.name ? `, ${userProfile.name.split(' ')[0]}` : ''}
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Access tools, resources, and playbooks to help you build better products
          </p>
        </div>

        {/* Dynamic Sections */}
        {publishedConfig?.sections ? (
          publishedConfig.sections.map((section) => (
            <section key={section.id} className="mb-16">
              <SectionHeader title={section.title} comingSoon={section.coming_soon} />
              {section.tools && section.tools.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.tools.map((tool) => {
                    const iconMap = {
                      ClipboardCheck,
                      BookOpen,
                      Wrench
                    };
                    const IconComponent = iconMap[tool.icon] || ClipboardCheck;
                    
                    return (
                      <ToolCard
                        key={tool.id}
                        title={tool.title}
                        description={tool.description}
                        icon={IconComponent}
                        href={tool.page ? createPageUrl(tool.page) : '#'}
                        comingSoon={tool.coming_soon}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          ))
        ) : (
          <>
            {/* Default sections if no config */}
            <section className="mb-16">
              <SectionHeader title="Tools" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ToolCard
                  title="Product Launch CX Scorecard"
                  description="A non-technical launch gate assessment for fintech, enterprise, and emerging markets products."
                  icon={ClipboardCheck}
                  href={createPageUrl('Scorecard')}
                />
              </div>
            </section>

            <section className="mb-16">
              <SectionHeader title="Resources" comingSoon />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ToolCard
                  title="Launch Checklist Templates"
                  description="Comprehensive templates to ensure nothing is missed before your product launch."
                  icon={BookOpen}
                  comingSoon
                />
              </div>
            </section>

            <section className="mb-16">
              <SectionHeader title="Playbooks" comingSoon />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ToolCard
                  title="CX Best Practices"
                  description="Proven strategies and frameworks for delivering exceptional customer experiences."
                  icon={Wrench}
                  comingSoon
                />
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_695a45a00c41aebc946dc291/dcce5d331_VenturesBlack.png" 
              alt="35N Ventures" 
              className="h-6 object-contain opacity-50"
            />
            <p className="text-xs text-slate-400">
              © 2024 35N Ventures. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}