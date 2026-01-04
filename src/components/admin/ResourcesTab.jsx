import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, BookOpen, Wrench, Lock, TrendingUp, Users, CheckCircle2 } from "lucide-react";

const TOOL_SECTIONS = [
  {
    id: 'tools',
    title: 'Tools',
    tools: [
      {
        id: 'cx_scorecard',
        title: 'Product Launch CX Scorecard',
        description: 'A non-technical launch gate assessment for fintech, enterprise, and emerging markets products.',
        icon: 'ClipboardCheck',
        page: 'Scorecard',
        coming_soon: false
      }
    ]
  },
  {
    id: 'resources',
    title: 'Resources',
    coming_soon: true,
    tools: [
      {
        id: 'launch_checklist',
        title: 'Launch Checklist Templates',
        description: 'Comprehensive templates to ensure nothing is missed before your product launch.',
        icon: 'BookOpen',
        coming_soon: true
      }
    ]
  },
  {
    id: 'playbooks',
    title: 'Playbooks',
    coming_soon: true,
    tools: [
      {
        id: 'cx_best_practices',
        title: 'CX Best Practices',
        description: 'Proven strategies and frameworks for delivering exceptional customer experiences.',
        icon: 'Wrench',
        coming_soon: true
      }
    ]
  }
];

const getIconComponent = (iconName) => {
  const icons = {
    ClipboardCheck,
    BookOpen,
    Wrench
  };
  return icons[iconName] || ClipboardCheck;
};

export default function ResourcesTab() {
  const { data: assessments = [] } = useQuery({
    queryKey: ['allAssessments'],
    queryFn: () => base44.entities.Assessment.list()
  });

  const getToolStats = (toolId) => {
    if (toolId === 'cx_scorecard') {
      const totalCompleted = assessments.length;
      const passedCount = assessments.filter(a => a.status === 'pass').length;
      const avgScore = totalCompleted > 0 
        ? (assessments.reduce((sum, a) => sum + a.total_score, 0) / totalCompleted).toFixed(1)
        : 0;
      
      return {
        totalCompleted,
        passedCount,
        avgScore,
        uniqueUsers: new Set(assessments.map(a => a.user_email)).size
      };
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Resources & Tools</h2>
        <p className="text-sm text-slate-500 mt-1">Manage all resources and tools available on the platform</p>
      </div>

      {TOOL_SECTIONS.map((section) => (
        <Card key={section.id} className="border-0 shadow-md">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{section.title}</CardTitle>
              {section.coming_soon && (
                <Badge variant="outline" className="border-amber-300 text-amber-600">
                  <Lock className="h-3 w-3 mr-1" />
                  Coming Soon
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {section.tools.map((tool) => {
                const Icon = getIconComponent(tool.icon);
                const stats = getToolStats(tool.id);
                
                return (
                  <div 
                    key={tool.id}
                    className="border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors overflow-hidden"
                  >
                    <div className="flex items-start gap-4 p-4">
                      <div className={`p-3 rounded-xl ${tool.coming_soon ? 'bg-slate-100' : 'bg-slate-900'}`}>
                        <Icon className={`h-5 w-5 ${tool.coming_soon ? 'text-slate-400' : 'text-white'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{tool.title}</h3>
                          {tool.coming_soon && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                              Coming Soon
                            </Badge>
                          )}
                          {tool.page && (
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{tool.description}</p>
                        {tool.page && (
                          <p className="text-xs text-slate-500">
                            Page: <span className="font-mono">{tool.page}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {stats && (
                      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                              <ClipboardCheck className="h-3 w-3" />
                              Completed
                            </div>
                            <p className="text-lg font-bold text-slate-900">{stats.totalCompleted}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Passed
                            </div>
                            <p className="text-lg font-bold text-emerald-600">{stats.passedCount}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                              <TrendingUp className="h-3 w-3" />
                              Avg Score
                            </div>
                            <p className="text-lg font-bold text-slate-900">{stats.avgScore}/60</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                              <Users className="h-3 w-3" />
                              Users
                            </div>
                            <p className="text-lg font-bold text-slate-900">{stats.uniqueUsers}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}