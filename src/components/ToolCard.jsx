import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock, Bell } from "lucide-react";
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
  accessType = "free"
}) {
  const handleClick = () => {
    if (comingSoon) return;
    
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else if (link) {
      window.open(link, '_blank');
    }
  };

  // If there's a file or link, use div with onClick; otherwise use Link
  if (fileUrl || link) {
    return (
      <div onClick={handleClick} className={`${comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <Card className={`group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 ${comingSoon ? 'opacity-60' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
        
        {/* Access Type Badge - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <Badge 
            variant="secondary" 
            className={`${accessType === 'exclusive' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'} font-medium text-xs px-2 py-1`}
          >
            {accessType === 'exclusive' ? 'Exclusive' : 'Free'}
          </Badge>
        </div>

        <CardContent className="relative p-8 pt-16">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-4 rounded-2xl ${comingSoon ? 'bg-slate-100' : 'bg-slate-900'} transition-colors duration-300`}>
              <Icon className={`h-6 w-6 ${comingSoon ? 'text-slate-400' : 'text-white'}`} />
            </div>
          </div>

          {/* Type Badge */}
          {type && (
            <Badge variant="outline" className="mb-3 text-xs border-slate-300 text-slate-600">
              {type}
            </Badge>
          )}
          
          <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">
            {title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">
            {description}
          </p>

          {/* Topic Labels */}
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {topics.slice(0, 3).map((topic, index) => (
                <span key={index} className="text-xs text-slate-500">
                  #{topic.toLowerCase().replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          )}
          
          {comingSoon ? (
            <div className="flex items-center text-slate-600 font-medium text-sm">
              <Bell className="mr-2 h-4 w-4" />
              Notify me when available
            </div>
          ) : (
            <div className="flex items-center text-slate-900 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
              Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    );
  }

  // For pages or coming soon
  const CardWrapper = comingSoon ? 'div' : Link;
  const wrapperProps = comingSoon ? {} : { to: href };

  return (
    <CardWrapper {...wrapperProps}>
      <Card className={`group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 ${comingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
        
        {/* Access Type Badge - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <Badge 
            variant="secondary" 
            className={`${accessType === 'exclusive' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'} font-medium text-xs px-2 py-1`}
          >
            {accessType === 'exclusive' ? 'Exclusive' : 'Free'}
          </Badge>
        </div>

        <CardContent className="relative p-8 pt-16">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-4 rounded-2xl ${comingSoon ? 'bg-slate-100' : 'bg-slate-900'} transition-colors duration-300`}>
              <Icon className={`h-6 w-6 ${comingSoon ? 'text-slate-400' : 'text-white'}`} />
            </div>
          </div>

          {/* Type Badge */}
          {type && (
            <Badge variant="outline" className="mb-3 text-xs border-slate-300 text-slate-600">
              {type}
            </Badge>
          )}
          
          <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">
            {title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">
            {description}
          </p>

          {/* Topic Labels */}
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {topics.slice(0, 3).map((topic, index) => (
                <span key={index} className="text-xs text-slate-500">
                  #{topic.toLowerCase().replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          )}
          
          {comingSoon ? (
            <div className="flex items-center text-slate-600 font-medium text-sm">
              <Bell className="mr-2 h-4 w-4" />
              Notify me when available
            </div>
          ) : (
            <div className="flex items-center text-slate-900 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
              Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}