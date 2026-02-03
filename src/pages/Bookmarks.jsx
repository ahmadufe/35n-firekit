import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ClipboardCheck, BookOpen, Wrench, User, LogOut, Settings, ChevronDown, Shield, Bookmark as BookmarkIcon, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ToolCard from "@/components/ToolCard";
import { toast } from "sonner";

export default function Bookmarks() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch (error) {
        return null;
      }
    }
  });

  const { data: userProfiles = [] } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => base44.entities.UserProfile.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const userProfile = userProfiles[0];

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['bookmarks', user?.email],
    queryFn: () => base44.entities.Bookmark.filter({ user_email: user?.email }, '-created_date'),
    enabled: !!user?.email
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: (bookmarkId) => base44.entities.Bookmark.delete(bookmarkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Bookmark removed');
    }
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const handleRemoveBookmark = (bookmarkId) => {
    deleteBookmarkMutation.mutate(bookmarkId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Please log in to view bookmarks</h2>
          <Button onClick={() => base44.auth.redirectToLogin()}>
            Sign up / Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
                <Link to={createPageUrl('Dashboard')}>
                  <DropdownMenuItem className="cursor-pointer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                </Link>
                <Link to={createPageUrl('Bookmarks')}>
                  <DropdownMenuItem className="cursor-pointer">
                    <BookmarkIcon className="mr-2 h-4 w-4" />
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-light text-slate-900 tracking-tight mb-4">
            My Bookmarks
          </h2>
          <p className="text-lg text-slate-500">
            Quick access to your saved resources
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full" />
              <div className="h-4 w-32 bg-slate-200 rounded" />
            </div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookmarkIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No bookmarks yet</h3>
            <p className="text-slate-500 mb-6">Start bookmarking resources to save them here</p>
            <Link to={createPageUrl('Dashboard')}>
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-slate-600">
                {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => {
                const iconMap = {
                  ClipboardCheck,
                  BookOpen,
                  Wrench
                };
                const IconComponent = iconMap[bookmark.resource_icon] || ClipboardCheck;

                return (
                  <div key={bookmark.id} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBookmark(bookmark.id)}
                      className="absolute top-2 right-2 z-10 h-8 w-8 bg-white/90 hover:bg-red-50 hover:text-red-600 shadow-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ToolCard
                      title={bookmark.resource_title}
                      description={bookmark.resource_description}
                      icon={IconComponent}
                      href={bookmark.resource_page ? createPageUrl(bookmark.resource_page) : '#'}
                      comingSoon={bookmark.resource_coming_soon}
                      fileUrl={bookmark.resource_file_url}
                      link={bookmark.resource_link}
                      type={bookmark.resource_type}
                      topics={bookmark.resource_topics || []}
                      resourceId={bookmark.resource_id}
                      showBookmark={false}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}