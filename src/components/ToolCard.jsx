import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Bookmark, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const TYPE_COLORS = {
  'Tools': 'bg-violet-50 text-violet-700 border-violet-200',
  'Insights': 'bg-sky-50 text-sky-700 border-sky-200',
  'Playbooks': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Deep dive series': 'bg-amber-50 text-amber-700 border-amber-200',
};

const TYPE_ICON_BG = {
  'Tools': 'bg-violet-100 text-violet-700',
  'Insights': 'bg-sky-100 text-sky-700',
  'Playbooks': 'bg-emerald-100 text-emerald-700',
  'Deep dive series': 'bg-amber-100 text-amber-700',
};

function CardInner({ title, description, Icon, type, topics, comingSoon, isComingSoon, showBookmark, isBookmarked, onBookmarkClick, resourceId }) {
  const typeBadgeClass = TYPE_COLORS[type] || 'bg-slate-50 text-slate-600 border-slate-200';
  const iconBgClass = TYPE_ICON_BG[type] || 'bg-slate-100 text-slate-700';

  return (
    <Card className="group relative overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col cursor-pointer bg-white">
      <CardContent className="p-5 flex flex-col h-full gap-3">

        {/* Top row: icon + type badge + exclusive/coming soon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${iconBgClass}`}>
              <Icon className="h-4 w-4" />
            </div>
            {type && (
              <Badge variant="outline" className={`text-xs px-2 py-0.5 font-medium border ${typeBadgeClass}`}>
                {type}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {comingSoon && (
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5 font-medium">
                <Lock className="h-3 w-3 mr-1" />Exclusive
              </Badge>
            )}
            {isComingSoon && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5">
                Coming Soon
              </Badge>
            )}
          </div>
        </div>

        {/* Title & description */}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900 mb-1.5 leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Topics as plain pills */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topics.slice(0, 3).map((topic, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
                {topic}
              </span>
            ))}
            {topics.length > 3 && (
              <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">
                +{topics.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className={`flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform duration-200 ${isComingSoon ? 'text-slate-400' : 'text-slate-900'}`}>
            Access <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </span>
          {showBookmark && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBookmarkClick}
              className="h-7 w-7 hover:bg-slate-100 z-10"
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-slate-900 fill-slate-900" />
              ) : (
                <Bookmark className="h-4 w-4 text-slate-400" />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

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
  showBookmark = true,
  coverImage
}) {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try { return await base44.auth.me(); } catch { return null; }
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
      toast.error('Please sign in to save this resource in your bookmarks');
      return;
    }
    bookmarkMutation.mutate();
  };

  const commonProps = { title, description, Icon, type, topics, comingSoon, isComingSoon, showBookmark, isBookmarked, onBookmarkClick: handleBookmarkClick, resourceId };

  if (fileUrl || link) {
    const handleClick = () => {
      if (comingSoon) { if (onExclusiveClick) onExclusiveClick(); return; }
      window.open(link || fileUrl, '_blank');
    };
    return <div onClick={handleClick} className="h-full"><CardInner {...commonProps} /></div>;
  }

  const shouldBlock = comingSoon;
  const CardWrapper = shouldBlock ? 'div' : Link;
  const wrapperProps = shouldBlock ? {} : { to: href };
  const cardClickHandler = shouldBlock
    ? () => { if (onExclusiveClick) onExclusiveClick(); }
    : onClick ? (e) => { e.preventDefault(); onClick(); }
    : undefined;

  return (
    <CardWrapper {...wrapperProps} onClick={cardClickHandler} className="h-full">
      <CardInner {...commonProps} />
    </CardWrapper>
  );
}