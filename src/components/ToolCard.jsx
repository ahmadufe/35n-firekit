import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ToolCard({ title, description, icon: Icon, href, comingSoon = false, fileUrl, link }) {
  const handleClick = (e) => {
    if (comingSoon) return;
    
    if (fileUrl) {
      e.preventDefault();
      window.open(fileUrl, '_blank');
    } else if (link) {
      e.preventDefault();
      window.open(link, '_blank');
    }
  };

  const CardWrapper = (comingSoon || fileUrl || link) ? 'div' : Link;
  const wrapperProps = (comingSoon || fileUrl || link) ? {} : { to: href };

  return (
    <CardWrapper {...wrapperProps} onClick={handleClick}>
      <Card className={`group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 ${comingSoon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
        
        <CardContent className="relative p-8">
          <div className="flex items-start justify-between mb-6">
            <div className={`p-4 rounded-2xl ${comingSoon ? 'bg-slate-100' : 'bg-slate-900'} transition-colors duration-300`}>
              <Icon className={`h-6 w-6 ${comingSoon ? 'text-slate-400' : 'text-white'}`} />
            </div>
            {comingSoon && (
              <Badge variant="secondary" className="bg-slate-200 text-slate-600 font-medium">
                <Lock className="h-3 w-3 mr-1" />
                Coming Soon
              </Badge>
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">
            {title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            {description}
          </p>
          
          {!comingSoon && (
            <div className="flex items-center text-slate-900 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
              Open Tool
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}