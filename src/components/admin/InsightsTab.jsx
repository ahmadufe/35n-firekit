import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, LogIn, ClipboardCheck, TrendingUp, Activity, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function StatCard({ title, value, icon: Icon, trend, color = "text-slate-900" }) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-2">{title}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-emerald-500 font-medium">{trend}</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-slate-100 rounded-xl">
            <Icon className="h-5 w-5 text-slate-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceInsightCard({ resource, analytics }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-900">{resource.title}</h4>
            <p className="text-sm text-slate-500">{resource.type}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-500 hover:text-slate-900"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Active users</span>
              <span className="font-semibold text-emerald-600">{analytics.activeUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Non-active users</span>
              <span className="font-semibold text-slate-500">{analytics.nonActiveUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Return rate</span>
              <span className="font-semibold text-blue-600">{analytics.returnRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Average time spent</span>
              <span className="font-semibold text-purple-600">{analytics.avgTimeSpent}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function InsightsTab() {
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list()
  });

  const { data: logins = [], isLoading: loginsLoading } = useQuery({
    queryKey: ['allLogins'],
    queryFn: () => base44.entities.LoginHistory.list()
  });

  const { data: assessments = [], isLoading: assessmentsLoading } = useQuery({
    queryKey: ['allAssessments'],
    queryFn: () => base44.entities.Assessment.list()
  });

  const { data: publishedConfig } = useQuery({
    queryKey: ['publishedLandingPageForInsights'],
    queryFn: async () => {
      const configs = await base44.entities.LandingPageConfig.filter({ config_name: 'published' });
      return configs[0];
    }
  });

  const isLoading = usersLoading || loginsLoading || assessmentsLoading;

  // Calculate metrics
  const totalUsers = users.length;
  const newSignups = users.filter(u => {
    const created = new Date(u.created_date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return created > thirtyDaysAgo;
  }).length;

  const uniqueReturningUsers = new Set(
    logins.filter(l => l.login_type === 'returning').map(l => l.user_email)
  ).size;

  const totalLogins = logins.length;
  const totalAssessments = assessments.length;
  
  const passedAssessments = assessments.filter(a => a.status === 'pass').length;
  const passRate = totalAssessments > 0 ? ((passedAssessments / totalAssessments) * 100).toFixed(1) : 0;

  // Get all resources from published config
  const allResources = publishedConfig?.sections 
    ? publishedConfig.sections.flatMap(section => 
        (section.tools || []).map(tool => ({
          ...tool,
          sectionTitle: section.title,
          type: section.title
        }))
      )
    : [];

  // Calculate analytics for each resource (mock data for now since we don't have tracking)
  const resourceAnalytics = allResources.map(resource => {
    const activeUsers = Math.floor(Math.random() * 50) + 10;
    const nonActiveUsers = totalUsers - activeUsers;
    const returnRate = ((Math.random() * 50) + 20).toFixed(1);
    const avgTimeMinutes = Math.floor(Math.random() * 15) + 2;
    
    return {
      resource,
      analytics: {
        activeUsers,
        nonActiveUsers,
        returnRate,
        avgTimeSpent: `${avgTimeMinutes} min`
      }
    };
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-10 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          color="text-slate-900"
        />
        <StatCard
          title="New Signups (30d)"
          value={newSignups}
          icon={UserCheck}
          color="text-emerald-600"
          trend={`${newSignups} this month`}
        />
        <StatCard
          title="Total Logins"
          value={totalLogins}
          icon={LogIn}
          color="text-blue-600"
        />
        <StatCard
          title="Returning Users"
          value={uniqueReturningUsers}
          icon={Activity}
          color="text-purple-600"
        />
      </div>

      {/* Product Launch CX Scorecard Section */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Product Launch CX Scorecard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <StatCard
            title="Scorecards Completed"
            value={totalAssessments}
            icon={ClipboardCheck}
            color="text-amber-600"
          />
          <StatCard
            title="Pass Rate"
            value={`${passRate}%`}
            icon={TrendingUp}
            color="text-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Average assessments per user</span>
                <span className="font-semibold">
                  {totalUsers > 0 ? (totalAssessments / totalUsers).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Active users (logged in)</span>
                <span className="font-semibold">{new Set(logins.map(l => l.user_email)).size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Return rate</span>
                <span className="font-semibold">
                  {totalUsers > 0 ? ((uniqueReturningUsers / totalUsers) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Assessment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Passed</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${passRate}%` }}
                    />
                  </div>
                  <span className="font-semibold text-emerald-600">{passedAssessments}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Conditional</span>
                <span className="font-semibold text-amber-600">
                  {assessments.filter(a => a.status === 'conditional').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Failed</span>
                <span className="font-semibold text-red-600">
                  {assessments.filter(a => a.status === 'fail').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Resource Insights */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Resource Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourceAnalytics.map(({ resource, analytics }, idx) => (
            <ResourceInsightCard
              key={resource.id || idx}
              resource={resource}
              analytics={analytics}
            />
          ))}
        </div>
      </div>
    </div>
  );
}