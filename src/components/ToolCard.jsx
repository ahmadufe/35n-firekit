import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ToolCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  comingSoon = false, 
  fileUrl, 
  link, 
  actionText = "Open Tool",
  type,
  topics = [],
  onClick,
  onExclusiveClick
}) {
  const handleClick = () => {
    if (comingSoon) {
      if (onExclusiveClick) {
        onExclusiveClick();
      }
      return;
    }
    
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else if (link) {
      window.open(link, '_blank');
    }
  };

  // If there's a file or link, use div with onClick; otherwise use Link
  if (fileUrl || link) {
    return (
      <div onClick={handleClick} className={`${comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'} h-full`}>
         <Card className={`group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col`}>
         <div className={`absolute inset-0 bg-gradient-to-br ${comingSoon ? 'from-orange-50 to-orange-50/50' : 'from-slate-50 to-white'}`} />
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />

        <CardContent className="relative p-6 flex flex-col h-full">
          {/* Header: Icon, Type, and Exclusive Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${comingSoon ? 'bg-slate-100' : 'bg-slate-900'}`}>
                <Icon className={`h-4 w-4 ${comingSoon ? 'text-slate-400' : 'text-white'}`} />
              </div>
              {type && (
                <Badge variant="outline" className="text-xs border-slate-300 text-slate-600 px-2 py-0.5">
                  {type}
                </Badge>
              )}
            </div>
            {comingSoon && (
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5">
                Exclusive
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
            <div className="flex flex-wrap gap-1.5 mb-3">
              {topics.slice(0, 3).map((topic, index) => (
                <span key={index} className="text-xs text-slate-500">
                  #{topic.toLowerCase().replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-auto">
            <div className="flex items-center text-slate-900 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
              Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    );
  }

  // For pages or coming soon
  const CardWrapper = (comingSoon || onClick) ? 'div' : Link;
  const wrapperProps = (comingSoon || onClick) ? {} : { to: href };

  const cardClickHandler = onClick ? (e) => {
    e.preventDefault();
    onClick();
  } : undefined;

  return (
    <CardWrapper {...wrapperProps} onClick={cardClickHandler} className="h-full">
      <Card className={`group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col ${comingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />

        <CardContent className="relative p-6 flex flex-col h-full">
          {/* Header: Icon, Type, and Exclusive Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${comingSoon ? 'bg-slate-100' : 'bg-slate-900'}`}>
                <Icon className={`h-4 w-4 ${comingSoon ? 'text-slate-400' : 'text-white'}`} />
              </div>
              {type && (
                <Badge variant="outline" className="text-xs border-slate-300 text-slate-600 px-2 py-0.5">
                  {type}
                </Badge>
              )}
            </div>
            {comingSoon && (
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5">
                Exclusive
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
            <div className="flex flex-wrap gap-1.5 mb-3">
              {topics.slice(0, 3).map((topic, index) => (
                <span key={index} className="text-xs text-slate-500">
                  #{topic.toLowerCase().replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto">
            <div className="flex items-center text-slate-900 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
              Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}