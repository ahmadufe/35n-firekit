import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";

export default function SuggestedResourcesTab() {
  const [filterStatus, setFilterStatus] = useState('all');
  const queryClient = useQueryClient();

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['suggestedResources'],
    queryFn: () => base44.entities.SuggestedResource.list('-created_date')
  });

  const handleUpdateStatus = async (suggestion, newStatus) => {
    await base44.entities.SuggestedResource.update(suggestion.id, { status: newStatus });
    queryClient.invalidateQueries({ queryKey: ['suggestedResources'] });
    toast.success(`Status updated to ${newStatus}`);
  };

  const filteredSuggestions = suggestions.filter(s => 
    filterStatus === 'all' || s.status === filterStatus
  );

  const statusConfig = {
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
    reviewed: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
    approved: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
    rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Suggested Resources</h2>
          <p className="text-sm text-slate-500 mt-1">Review and manage user-submitted resource suggestions</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('all')}
        >
          All ({suggestions.length})
        </Button>
        <Button
          variant={filterStatus === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('pending')}
        >
          Pending ({suggestions.filter(s => s.status === 'pending').length})
        </Button>
        <Button
          variant={filterStatus === 'reviewed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('reviewed')}
        >
          Reviewed ({suggestions.filter(s => s.status === 'reviewed').length})
        </Button>
        <Button
          variant={filterStatus === 'approved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('approved')}
        >
          Approved ({suggestions.filter(s => s.status === 'approved').length})
        </Button>
        <Button
          variant={filterStatus === 'rejected' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('rejected')}
        >
          Rejected ({suggestions.filter(s => s.status === 'rejected').length})
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredSuggestions.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-8 text-center text-slate-500">
              No suggestions found
            </CardContent>
          </Card>
        ) : (
          filteredSuggestions.map((suggestion) => {
            const config = statusConfig[suggestion.status];
            const StatusIcon = config.icon;
            
            return (
              <Card key={suggestion.id} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">{suggestion.title}</h3>
                        <Badge className={`${config.bg} ${config.color} ${config.border} border text-xs`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {suggestion.status}
                        </Badge>
                      </div>
                      
                      <p className="text-slate-600 mb-4 whitespace-pre-wrap">{suggestion.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-slate-900">Submitted by:</span>
                          <p className="text-slate-600">{suggestion.user_name}</p>
                          <p className="text-slate-500 text-xs">{suggestion.user_email}</p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-900">Company/Team:</span>
                          <p className="text-slate-600">{suggestion.company}</p>
                          <p className="text-slate-500 text-xs">{suggestion.team}</p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-400 mt-3">
                        Submitted on {format(toZonedTime(new Date(suggestion.created_date), 'Asia/Dubai'), 'MMMM d, yyyy, HH:mm')}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Select
                        value={suggestion.status}
                        onValueChange={(value) => handleUpdateStatus(suggestion, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}