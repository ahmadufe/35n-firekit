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
import { ClipboardCheck, BookOpen, Wrench, User, LogOut, Settings, ChevronDown, Shield, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import UserSetupModal from "@/components/UserSetupModal";
import ToolCard from "@/components/ToolCard";
import SectionHeader from "@/components/SectionHeader";
import LoginPromptDialog from "@/components/LoginPromptDialog";
import LoginConfirmDialog from "@/components/LoginConfirmDialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

Dashboard.public = true;

export default function Dashboard() {
  const [showSetup, setShowSetup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedAccess, setSelectedAccess] = useState([]);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [openFilter, setOpenFilter] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptType, setLoginPromptType] = useState('timed'); // 'timed' or 'resource'
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasShownTimedPrompt, setHasShownTimedPrompt] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch (error) {
        return null;
      }
    }
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

  const { data: lastLogin } = useQuery({
    queryKey: ['lastLogin', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const logins = await base44.entities.LoginHistory.filter(
        { user_email: user.email },
        '-created_date',
        2
      );
      return logins.length > 1 ? logins[1] : null;
    },
    enabled: !!user?.email
  });

  useEffect(() => {
    if (!profileLoading && !userLoading && user && !userProfile) {
      setShowSetup(true);
    }
  }, [userProfile, profileLoading, userLoading, user]);

  // Show login prompt after 10 seconds for non-logged-in users
  useEffect(() => {
    if (!user && !hasShownTimedPrompt) {
      const timer = setTimeout(() => {
        setLoginPromptType('timed');
        setShowLoginPrompt(true);
        setHasShownTimedPrompt(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [user, hasShownTimedPrompt]);

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
    base44.auth.logout(createPageUrl('Home'));
  };

  const handleLoginPromptClose = () => {
    setShowLoginPrompt(false);
  };

  const handleConfirmSkip = () => {
    setShowConfirmDialog(false);
  };

  const handleResourceClick = (tool) => {
    const isToolOrDeepDive = tool.sectionId === 'deep-dive' || 
                             tool.sectionTitle?.toLowerCase().includes('tool');

    if (!user && isToolOrDeepDive && tool.page) {
      setLoginPromptType('resource');
      setShowLoginPrompt(true);
    }
  };

  // Extract all tools from all sections
  const allTools = publishedConfig?.sections 
    ? publishedConfig.sections.flatMap(section => 
        (section.tools || []).map(tool => ({
          ...tool,
          sectionTitle: section.title,
          sectionId: section.id,
          sectionComingSoon: section.coming_soon
        }))
      )
    : [];

  // Calculate cutoff date for new resources
  const getNewResourcesCutoff = () => {
    if (user && lastLogin?.created_date) {
      return new Date(lastLogin.created_date);
    }
    // For non-logged-in users, show items from past week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return oneWeekAgo;
  };

  const cutoffDate = getNewResourcesCutoff();
  
  const newToolsCount = allTools.filter(tool => {
    if (!tool.published_date && !tool.created_date) return false;
    const toolDate = new Date(tool.published_date || tool.created_date);
    return toolDate > cutoffDate;
  }).length;

  // Get unique types (section titles)
  const availableTypes = publishedConfig?.sections 
    ? [...new Set(publishedConfig.sections.map(s => s.title))]
    : [];

  // Topics from user setup form
  const availableTopics = [
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
  ];

  // Filter tools based on search and filters
  const filteredTools = allTools.filter(tool => {
    // Search filter
    const matchesSearch = !searchQuery || 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(tool.sectionTitle);

    // Topic filter - for now, show all if no topics selected
    // In the future, you might want to add topic metadata to tools
    const matchesTopic = selectedTopics.length === 0;

    // Access filter - tools with file_url or link are free, others might be exclusive
    // For now, all tools are free
    const matchesAccess = selectedAccess.length === 0 || selectedAccess.includes('free');

    // New resources filter
    const matchesNew = !showNewOnly || (() => {
      if (!tool.published_date && !tool.created_date) return false;
      const toolDate = new Date(tool.published_date || tool.created_date);
      return toolDate > cutoffDate;
    })();

    return matchesSearch && matchesType && matchesTopic && matchesAccess && matchesNew;
  });

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleTopic = (topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const toggleAccess = (access) => {
    setSelectedAccess(prev => 
      prev.includes(access) ? prev.filter(a => a !== access) : [...prev, access]
    );
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedTopics.length > 0 || selectedAccess.length > 0 || showNewOnly;

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedTopics([]);
    setSelectedAccess([]);
    setShowNewOnly(false);
  };

  const toggleFilterSection = (filterName) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const getActionText = (sectionId) => {
    if (['resources', 'insights', 'playbooks'].includes(sectionId)) return 'Read';
    if (sectionId === 'deep-dive') return 'Explore';
    return 'Open Tool';
  };

  if (userLoading) {
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
      {user && (
        <UserSetupModal 
          open={showSetup} 
          onSubmit={handleSetupSubmit}
          isLoading={isSubmitting}
        />
      )}

      <LoginPromptDialog 
        open={showLoginPrompt} 
        onOpenChange={setShowLoginPrompt}
        onClose={handleLoginPromptClose}
        type={loginPromptType}
      />

      <LoginConfirmDialog 
        open={showConfirmDialog} 
        onOpenChange={setShowConfirmDialog}
        onSkip={handleConfirmSkip}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Home')}>
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_695a45a00c41aebc946dc291/dcce5d331_VenturesBlack.png" 
                  alt="35N Ventures" 
                  className="h-10 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
              <div className="hidden sm:block h-8 w-px bg-slate-200" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                  <span className="text-orange-500">Fire</span>Kit
                </h1>
                <p className="text-xs text-slate-500">Tools for builders, innovators, and dreamers to build products and ventures</p>
              </div>
            </div>

            {user ? (
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
            ) : (
              <Button 
                onClick={() => base44.auth.redirectToLogin(window.location.href)}
                className="bg-slate-900 hover:bg-slate-800"
              >
                Sign up / Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        {user && (
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-light text-slate-900 tracking-tight mb-4">
              Welcome back{userProfile?.name ? `, ${userProfile.name.split(' ')[0]}` : ''}
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Access tools, resources, and playbooks to help you build better products
            </p>
          </div>
        )}

        {/* Search Bar and Filters */}
        <div className="mb-8 max-w-5xl mx-auto">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search tools, resources, and playbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 pr-4 text-base border-slate-200 focus:border-slate-900 focus:ring-slate-900 shadow-sm"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Filter by:</span>
            <div className="flex items-center gap-2">
              {newToolsCount > 0 && (
                <Button
                  variant={showNewOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowNewOnly(!showNewOnly)}
                  className={`${showNewOnly ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-white text-orange-600 border-orange-300 hover:bg-orange-50'}`}
                >
                  New resources {showNewOnly && `(${newToolsCount})`}
                </Button>
              )}
              <Button
                variant={openFilter === 'topic' || selectedTopics.length > 0 ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilterSection('topic')}
                className={`${openFilter === 'topic' || selectedTopics.length > 0 ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border-slate-300'}`}
              >
                Topic {selectedTopics.length > 0 && `(${selectedTopics.length})`}
              </Button>
              <Button
                variant={openFilter === 'type' || selectedTypes.length > 0 ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilterSection('type')}
                className={`${openFilter === 'type' || selectedTypes.length > 0 ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border-slate-300'}`}
              >
                Type {selectedTypes.length > 0 && `(${selectedTypes.length})`}
              </Button>
              <Button
                variant={openFilter === 'access' || selectedAccess.length > 0 ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilterSection('access')}
                className={`${openFilter === 'access' || selectedAccess.length > 0 ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border-slate-300'}`}
              >
                Access {selectedAccess.length > 0 && `(${selectedAccess.length})`}
              </Button>
            </div>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-slate-600 hover:text-slate-900 ml-auto"
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Filter Options */}
          {openFilter === 'topic' && (
            <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenFilter(null)}
                className="absolute top-2 right-2 h-6 w-6 text-slate-500 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex flex-wrap gap-2">
                {availableTopics.map(topic => (
                  <Badge
                    key={topic}
                    variant={selectedTopics.includes(topic) ? "default" : "outline"}
                    className={`cursor-pointer px-3 py-1.5 text-xs transition-all ${
                      selectedTopics.includes(topic)
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                    onClick={() => toggleTopic(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {openFilter === 'type' && availableTypes.length > 0 && (
            <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenFilter(null)}
                className="absolute top-2 right-2 h-6 w-6 text-slate-500 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex flex-wrap gap-2">
                {availableTypes.map(type => (
                  <Badge
                    key={type}
                    variant={selectedTypes.includes(type) ? "default" : "outline"}
                    className={`cursor-pointer px-3 py-1.5 text-xs transition-all ${
                      selectedTypes.includes(type)
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                    onClick={() => toggleType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {openFilter === 'access' && (
            <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenFilter(null)}
                className="absolute top-2 right-2 h-6 w-6 text-slate-500 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex flex-wrap gap-2">
                {['Free', 'Exclusive'].map(access => (
                  <Badge
                    key={access}
                    variant={selectedAccess.includes(access.toLowerCase()) ? "default" : "outline"}
                    className={`cursor-pointer px-3 py-1.5 text-xs transition-all ${
                      selectedAccess.includes(access.toLowerCase())
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                    onClick={() => toggleAccess(access.toLowerCase())}
                  >
                    {access}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-sm text-slate-600">
            {filteredTools.length} {filteredTools.length === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const iconMap = {
                ClipboardCheck,
                BookOpen,
                Wrench
              };
              const IconComponent = iconMap[tool.icon] || ClipboardCheck;

              const isToolOrDeepDive = tool.sectionId === 'deep-dive' || 
                                       tool.sectionTitle?.toLowerCase().includes('tool');
              const needsLoginCheck = !user && isToolOrDeepDive && tool.page;

              return (
                <ToolCard
                  key={tool.id}
                  onClick={needsLoginCheck ? () => handleResourceClick(tool) : undefined}
                  title={tool.title}
                  description={tool.description}
                  icon={IconComponent}
                  href={tool.page ? createPageUrl(tool.page) : '#'}
                  comingSoon={tool.coming_soon || tool.sectionComingSoon}
                  fileUrl={tool.file_url}
                  link={tool.link}
                  actionText={getActionText(tool.sectionId)}
                  type={tool.sectionTitle}
                  topics={tool.topics || []}
                  accessType={tool.access_type || 'free'}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
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
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-400">
              <a href="mailto:hello@35nventures.com" className="hover:text-slate-600 transition-colors">
                hello@35nventures.com
              </a>
              <span className="hidden sm:inline">•</span>
              <p>© 2024 35N Ventures. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}