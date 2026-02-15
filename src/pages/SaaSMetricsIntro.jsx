import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

SaaSMetricsIntro.public = true;

export default function SaaSMetricsIntro() {
  const navigate = useNavigate();
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

  const { data: savedMetrics = [] } = useQuery({
    queryKey: ['allSaasMetrics', user?.email],
    queryFn: () => base44.entities.SaaSMetrics.filter({ user_email: user?.email }, '-created_date'),
    enabled: !!user?.email
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SaaSMetrics.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSaasMetrics'] });
      toast.success('Submission deleted successfully');
    }
  });

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">SaaS Metrics Dashboard</h1>
          
          <div className="prose prose-slate max-w-none mb-8">
            <p className="text-lg text-slate-700 mb-4">This SaaS matrix explainer helps you:</p>
            <ol className="space-y-2 text-slate-700 ml-6 list-[lower-alpha]">
              <li>Understand the key metrics and how to calculate them</li>
              <li>Tracks these metrics in a consolidated dashboard that ties them together so you can tell what's driving performance</li>
            </ol>

            <p className="text-lg text-slate-700 mt-6 mb-3">To get the best out of it, we recommend the following:</p>
            <ul className="space-y-2 text-slate-700 ml-6">
              <li>Read the description and logic carefully</li>
              <li>Update it consistently (monthly at minimum)</li>
              <li>Look at metrics together, rather than in isolation</li>
              <li>Score based on your organization's REALITY, not ideals</li>
              <li>Be honest about capability gaps</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Link to={createPageUrl('SaaSMetricsDashboard')}>
              <Button 
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-lg px-8 py-6"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Access Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {user && savedMetrics.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Previous Submissions</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-300">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-300">Company Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-300">Industry</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-300">Country</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-300">Date Created</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 border border-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedMetrics.map((submission, index) => (
                    <tr key={submission.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-3 text-sm text-slate-900 border border-slate-200">{submission.company_name || '-'}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 border border-slate-200">{submission.industry || '-'}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 border border-slate-200">{submission.country || '-'}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 border border-slate-200">
                        {new Date(submission.created_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 border border-slate-200">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(createPageUrl('SaaSMetricsDashboard'), { state: { viewId: submission.id } })}
                            className="text-slate-600 hover:text-slate-900"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(createPageUrl('SaaSMetricsDashboard'), { state: { editId: submission.id } })}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(submission.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}