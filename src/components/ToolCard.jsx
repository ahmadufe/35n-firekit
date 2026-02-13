import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Bookmark, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ToolCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  comingSoon = false, 
  isComingSoon = false,
  fileUrl, 
  link, 
  actionText = "Open Tool",
  type,
  topics = [],
  onClick,
  onExclusiveClick,
  resourceId,
  showBookmark = true
}) {
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

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks', user?.email],
    queryFn: () => base44.entities.Bookmark.filter({ user_email: user?.email }),
    enabled: !!user?.email && showBookmark
  });

  const isBookmarked = bookmarks.some(b => b.resource_id === resourceId);

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        const bookmark = bookmarks.find(b => b.resource_id === resourceId);
        await base44.entities.Bookmark.delete(bookmark.id);
      } else {
        await base44.entities.Bookmark.create({
          user_email: user.email,
          resource_id: resourceId,
          resource_title: title,
          resource_description: description,
          resource_icon: Icon.name || 'ClipboardCheck',
          resource_type: type,
          resource_topics: topics,
          resource_page: href?.includes('?') ? href.split('?')[0].replace('/app/', '') : href?.replace('/app/', ''),
          resource_file_url: fileUrl || null,
          resource_link: link || null,
          resource_coming_soon: comingSoon
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success(isBookmarked ? 'Bookmark removed' : 'Bookmark added');
    }
  });

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to bookmark resources');
      return;
    }
    bookmarkMutation.mutate();
  };

  const handleClick = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else if (link) {
      window.open(link, '_blank');
    }
  };

  // Check access code for exclusive resources
  React.useEffect(() => {
    if (comingSoon && resourceId) {
      const hasAccess = sessionStorage.getItem(`access_code_${resourceId}`);
      if (hasAccess) {
        // Resource can be accessed
      }
    }
  }, [comingSoon, resourceId]);

  // If there's a file or link, use div with onClick; otherwise use Link
  if (fileUrl || link) {
    // Check if user has access to exclusive resource
    const hasAccessCode = comingSoon && resourceId ? sessionStorage.getItem(`access_code_${resourceId}`) : null;
    
    const actualClickHandler = () => {
      if (comingSoon && !hasAccessCode) {
        if (onExclusiveClick) {
          onExclusiveClick();
        }
        return;
      }
      handleClick();
    };

    return (
      <div onClick={actualClickHandler} className="cursor-pointer h-full">
         <Card className={`group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col`}>
         <div className={`absolute inset-0 bg-gradient-to-br ${comingSoon ? 'from-orange-50 to-orange-50/50' : isComingSoon ? 'from-blue-50 to-blue-50/50' : 'from-slate-50 to-white'}`} />
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />

        <CardContent className="relative p-6 flex flex-col h-full">
         {/* Header: Icon, Type, and Exclusive Badge */}
         <div className="flex items-center justify-between mb-3">
           <div className="flex items-center gap-2">
             <div className={`p-2 rounded-lg bg-slate-900`}>
               <Icon className={`h-4 w-4 text-white`} />
             </div>
             {type && (
               <Badge variant="outline" className="text-xs border-slate-300 text-slate-600 px-2 py-0.5">
                 {type}
               </Badge>
             )}
           </div>
           {comingSoon && (
             hasAccessCode ? (
               <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5">
                 Unlocked
               </Badge>
             ) : (
               <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5">
                 Exclusive
               </Badge>
             )
           )}
           {isComingSoon && (
             <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5">
               Coming Soon
             </Badge>
           )}
           </div>

         <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight line-clamp-2">
           {title}
         </h3>
         <p className="text-slate-500 text-sm leading-relaxed mb-3 line-clamp-3">
           {description}
         </p>

         {/* Topic Labels */}
         {topics.length > 0 && (
           <div className="flex flex-wrap gap-1.5 mb-3 min-h-[1.5rem]">
             {topics.slice(0, 3).map((topic, index) => (
               <span key={index} className="text-xs text-blue-600 font-medium">
                 #{topic.toLowerCase().replace(/\s+/g, '')}
               </span>
             ))}
             {topics.length > 3 && (
               <span className="text-xs text-blue-600 font-medium">
                 +{topics.length - 3}
               </span>
             )}
           </div>
         )}

         <div className="mt-auto">
           <div className="flex items-center justify-between">
             <div className="flex items-center text-slate-900 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
               Access
               <ArrowRight className="ml-2 h-4 w-4" />
             </div>
             {showBookmark && (
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={handleBookmarkClick}
                 className="h-8 w-8 hover:bg-slate-200 z-10"
               >
                 {isBookmarked ? (
                   <BookmarkCheck className="h-4 w-4 text-slate-900 fill-slate-900" />
                 ) : (
                   <Bookmark className="h-4 w-4 text-slate-500" />
                 )}
               </Button>
             )}
           </div>
         </div>
         </CardContent>
         </Card>
         </div>
         );
         }

  // For pages or coming soon
   const hasAccessCode = comingSoon && resourceId ? sessionStorage.getItem(`access_code_${resourceId}`) : null;
   const shouldBlock = comingSoon && !hasAccessCode;

   // If not exclusive (comingSoon=false), allow direct navigation
   const CardWrapper = shouldBlock ? 'div' : Link;
   const wrapperProps = shouldBlock ? {} : { to: href };

  const cardClickHandler = shouldBlock ? (e) => {
    e.preventDefault();
    if (onExclusiveClick) {
      onExclusiveClick();
    }
  } : onClick ? (e) => {
    if (!hasAccessCode) {
      e.preventDefault();
      onClick();
    }
  } : undefined;

  return (
    <CardWrapper {...wrapperProps} onClick={cardClickHandler} className="h-full">
      <Card className={`group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col cursor-pointer`}>
         <div className={`absolute inset-0 bg-gradient-to-br ${comingSoon ? 'from-orange-50 to-orange-50/50' : isComingSoon ? 'from-blue-50 to-blue-50/50' : 'from-slate-50 to-white'}`} />
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />

        <CardContent className="relative p-6 flex flex-col h-full">
          {/* Header: Icon, Type, and Exclusive Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-slate-900`}>
                <Icon className={`h-4 w-4 text-white`} />
              </div>
              {type && (
                <Badge variant="outline" className="text-xs border-slate-300 text-slate-600 px-2 py-0.5">
                  {type}
                </Badge>
              )}
            </div>
            {comingSoon && (
              hasAccessCode ? (
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5">
                  Unlocked
                </Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5">
                  Exclusive
                </Badge>
              )
            )}
            {isComingSoon && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5">
                Coming Soon
              </Badge>
            )}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight line-clamp-2">
            {title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-3 line-clamp-3">
            {description}
          </p>

          {/* Topic Labels */}
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 min-h-[1.5rem]">
              {topics.slice(0, 3).map((topic, index) => (
                <span key={index} className="text-xs text-blue-600 font-medium">
                  #{topic.toLowerCase().replace(/\s+/g, '')}
                </span>
              ))}
              {topics.length > 3 && (
                <span className="text-xs text-blue-600 font-medium">
                  +{topics.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-slate-900 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
              {showBookmark && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmarkClick}
                  className="h-8 w-8 hover:bg-slate-200 z-10"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-4 w-4 text-slate-900 fill-slate-900" />
                  ) : (
                    <Bookmark className="h-4 w-4 text-slate-500" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}