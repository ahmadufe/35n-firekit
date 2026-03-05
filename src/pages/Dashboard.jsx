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
import { ClipboardCheck, BookOpen, Wrench, User, LogOut, Settings, ChevronDown, Shield, Search, X, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import UserSetupModal from "@/components/UserSetupModal";
import ToolCard from "@/components/ToolCard";
import SectionHeader from "@/components/SectionHeader";
import LoginPromptDialog from "@/components/LoginPromptDialog";
import LoginConfirmDialog from "@/components/LoginConfirmDialog";
import SuggestResourceDialog from "@/components/SuggestResourceDialog";
import ThankYouDialog from "@/components/ThankYouDialog";
import FeedbackDialog from "@/components/FeedbackDialog";
import FeedbackThankYouDialog from "@/components/FeedbackThankYouDialog";
import AccessRequestDialog from "@/components/AccessRequestDialog";
import BrevoLeadDialog, { hasSubmittedLead } from "@/components/BrevoLeadDialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

Dashboard.public = true;

export default function Dashboard() {
  const [showSetup, setShowSetup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showExclusiveOnly, setShowExclusiveOnly] = useState(false);
  const [showComingSoonOnly, setShowComingSoonOnly] = useState(false);
  const [openFilter, setOpenFilter] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptType, setLoginPromptType] = useState('timed'); // 'timed' or 'resource'
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasShownTimedPrompt, setHasShownTimedPrompt] = useState(false);
  const [showSuggestDialog, setShowSuggestDialog] = useState(false);
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showFeedbackThankYou, setShowFeedbackThankYou] = useState(false);
  const [showAccessRequestDialog, setShowAccessRequestDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const [pendingResource, setPendingResource] = useState(null);
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

  const handleExclusiveResourceClick = (resource) => {
    if (hasSubmittedLead()) {
      // Already gave details — navigate directly
      navigateToResource(resource);
    } else {
      setPendingResource(resource);
      setShowLeadDialog(true);
    }
  };

  const navigateToResource = (resource) => {
    if (resource.page) {
      window.location.href = createPageUrl(resource.page);
    } else if (resource.file_url) {
      window.open(resource.file_url, '_blank');
    } else if (resource.link) {
      window.open(resource.link, '_blank');
    }
  };

  const handleLeadSuccess = () => {
    setShowLeadDialog(false);
    if (pendingResource) {
      navigateToResource(pendingResource);
      setPendingResource(null);
    }
  };

  const handleSuggestResource = () => {
    if (user) {
      setShowSuggestDialog(true);
    } else {
      setLoginPromptType('timed');
      setShowLoginPrompt(true);
    }
  };

  const handleSuggestSuccess = () => {
    setShowThankYouDialog(true);
  };

  const handleFeedbackSuccess = () => {
    setShowFeedbackThankYou(true);
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
    const toolDate = tool.published_date 
      ? new Date(tool.published_date) 
      : publishedConfig?.updated_date 
        ? new Date(publishedConfig.updated_date)
        : null;
    
    if (!toolDate) return false;
    return toolDate > cutoffDate;
  }).length;



  // Fetch filter configuration
  const { data: filterConfig } = useQuery({
    queryKey: ['filterConfig'],
    queryFn: async () => {
      const configs = await base44.entities.FilterConfig.filter({ config_name: 'published' });
      return configs.length > 0 ? configs[0] : null;
    }
  });

  // Topics from filter configuration or fallback to defaults
  const availableTopics = filterConfig?.filters?.topic || [
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

  // Get unique asset types from all tools
  const availableTypes = [...new Set(allTools.map(tool => tool.asset_type).filter(Boolean))];

  // Filter tools based on search and filters
  const filteredTools = allTools.filter(tool => {
    // Search filter
    const matchesSearch = !searchQuery || 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Topic filter
    const matchesTopic = selectedTopics.length === 0 || 
      (tool.topics && tool.topics.some(topic => selectedTopics.includes(topic)));

    // Type filter
    const matchesType = selectedTypes.length === 0 || 
      (tool.asset_type && selectedTypes.includes(tool.asset_type));

    // New resources filter
    const matchesNew = !showNewOnly || (() => {
      const toolDate = tool.published_date 
        ? new Date(tool.published_date) 
        : publishedConfig?.updated_date 
          ? new Date(publishedConfig.updated_date)
          : null;

      if (!toolDate) return false;
      return toolDate > cutoffDate;
    })();

    // Featured filter
    const matchesFeatured = !showFeaturedOnly || tool.featured;

    // Exclusive filter
    const matchesExclusive = !showExclusiveOnly || tool.coming_soon;

    // Coming soon filter
    const matchesComingSoon = !showComingSoonOnly || tool.is_coming_soon;

    return matchesSearch && matchesTopic && matchesType && matchesNew && matchesFeatured && matchesExclusive && matchesComingSoon;
  });

  const toggleTopic = (topic) => {
    const isAdding = !selectedTopics.includes(topic);
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
    base44.analytics.track({
      eventName: 'filter_topic_toggle',
      properties: { topic, action: isAdding ? 'add' : 'remove' }
    });
  };

  const toggleType = (type) => {
    const isAdding = !selectedTypes.includes(type);
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    base44.analytics.track({
      eventName: 'filter_type_toggle',
      properties: { type, action: isAdding ? 'add' : 'remove' }
    });
  };



  const hasActiveFilters = selectedTopics.length > 0 || selectedTypes.length > 0 || showNewOnly || showFeaturedOnly || showExclusiveOnly || showComingSoonOnly;

  const clearAllFilters = () => {
    setSelectedTopics([]);
    setSelectedTypes([]);
    setShowNewOnly(false);
    setShowFeaturedOnly(false);
    setShowExclusiveOnly(false);
    setShowComingSoonOnly(false);
    base44.analytics.track({
      eventName: 'filter_clear_all',
      properties: {}
    });
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

      {user && userProfile && (
        <SuggestResourceDialog
          open={showSuggestDialog}
          onOpenChange={setShowSuggestDialog}
          onSuccess={handleSuggestSuccess}
          userProfile={userProfile}
        />
      )}

      <ThankYouDialog
        open={showThankYouDialog}
        onOpenChange={setShowThankYouDialog}
      />

      <FeedbackDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        onSuccess={handleFeedbackSuccess}
        userProfile={userProfile}
        user={user}
      />

      <FeedbackThankYouDialog
        open={showFeedbackThankYou}
        onOpenChange={setShowFeedbackThankYou}
      />

      <AccessRequestDialog
        open={showAccessRequestDialog}
        onOpenChange={setShowAccessRequestDialog}
      />

      <BrevoLeadDialog
        open={showLeadDialog}
        onSuccess={handleLeadSuccess}
        onClose={() => { setShowLeadDialog(false); setPendingResource(null); }}
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
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                  <span className="text-orange-500">Fire</span>Kit
                </h1>
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
                  <Link to={createPageUrl('Bookmarks')}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Bookmarks
                    </DropdownMenuItem>
                  </Link>
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
                onClick={() => base44.auth.redirectToLogin()}
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



        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {filteredTools.length} {filteredTools.length === 1 ? 'result' : 'results'} found
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSuggestResource}
              className="text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Suggest a resource
            </button>
            <button
              onClick={() => setShowFeedbackDialog(true)}
              className="text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Give feedback
            </button>
          </div>
        </div>

        {/* Tools grouped by section */}
        {publishedConfig?.sections?.filter(section => section.tools?.length > 0).map((section) => {
          const iconMap = { ClipboardCheck, BookOpen, Wrench };
          return (
            <div key={section.id} className="mb-14">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 pb-3 border-b border-slate-200">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.tools.map((tool) => {
                  const IconComponent = iconMap[tool.icon] || ClipboardCheck;
                  const isToolOrDeepDive = section.id === 'deep-dive' || section.title?.toLowerCase().includes('tool');
                  const needsLoginCheck = !user && isToolOrDeepDive && tool.page;
                  return (
                    <ToolCard
                      key={tool.id}
                      onClick={needsLoginCheck ? () => handleResourceClick(tool) : undefined}
                      onExclusiveClick={() => handleExclusiveResourceClick({ ...tool, sectionTitle: section.title, sectionId: section.id })}
                      title={tool.title}
                      description={tool.description}
                      icon={IconComponent}
                      href={tool.page ? createPageUrl(tool.page) : '#'}
                      comingSoon={!hasSubmittedLead()}
                      isComingSoon={tool.is_coming_soon}
                      fileUrl={tool.file_url}
                      link={tool.link}
                      actionText={getActionText(section.id)}
                      type={tool.asset_type || section.title}
                      topics={tool.topics || []}
                      resourceId={tool.id}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
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