import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function BuildVSBuyMatrix() {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Sign in Required</h2>
          <p className="text-slate-600 mb-6">Please sign in to access the Build VS Buy Matrix tool.</p>
          <Button onClick={() => base44.auth.redirectToLogin()}>
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-12 pt-24">
        {/* Back Button */}
        <Link to={createPageUrl('Dashboard')}>
          <Button variant="ghost" className="mb-6">
            ← Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">
            Build VS Buy Matrix
          </h1>
          
          {/* Introduction Text */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
            <p className="text-slate-700 mb-6 leading-relaxed">
              This tool helps executives and company teams quickly determine whether to build technology internally or purchase external solutions by guiding them through the most critical strategic, financial, operational, and risk-based considerations.
            </p>
            <p className="text-slate-700 mb-6 leading-relaxed">
              The objective is to help them reach evidence-based conclusions that reduce costly misalignment and accelerate confident decision-making.
            </p>
            
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <p className="text-slate-900 font-semibold mb-4">
                To get the best out of it, we recommend the following:
              </p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Score based on your organization's REALITY, not ideals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Be honest about capability gaps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>When in doubt, score conservatively (closer to 3)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tool Options */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Executive Decision Tool */}
          <Link to={createPageUrl('ExecutiveDecisionTool')}>
            <div className="cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <FolderOpen className="w-12 h-12 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                    Executive decision tool
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    A rapid & high-level diagnostic made for leadership teams
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Detailed Assessment Tool */}
          <div className="cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FolderOpen className="w-12 h-12 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                  Detailed assessment tool
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  A comprehensive scoring framework covering a wide range of factors
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}