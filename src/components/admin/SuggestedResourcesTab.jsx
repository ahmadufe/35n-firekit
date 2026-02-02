import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Clock, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

export default function SuggestedResourcesTab() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
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

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredSuggestions.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} selected suggestions?`)) return;
    
    for (const id of selectedIds) {
      await base44.entities.SuggestedResource.delete(id);
    }
    
    queryClient.invalidateQueries({ queryKey: ['suggestedResources'] });
    setSelectedIds([]);
    toast.success(`${selectedIds.length} suggestions deleted`);
  };

  const handleBulkExport = () => {
    const selectedSuggestions = suggestions.filter(s => selectedIds.includes(s.id));
    const headers = ['Date', 'Time', 'User Name', 'User Email', 'Company', 'Team', 'Title', 'Description', 'Status'];
    const rows = selectedSuggestions.map(item => {
      const date = new Date(item.created_date);
      const abuDhabiDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
      return [
        format(abuDhabiDate, 'MMM d, yyyy'),
        format(abuDhabiDate, 'HH:mm:ss'),
        item.user_name,
        item.user_email,
        item.company || 'N/A',
        item.team || 'N/A',
        item.title,
        item.description,
        item.status
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `suggestions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    toast.success('Exported to CSV');
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
        {selectedIds.length > 0 && (
          <div className="flex gap-2">
            <Button onClick={handleBulkExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export ({selectedIds.length})
            </Button>
            <Button onClick={handleBulkDelete} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedIds.length})
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
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
        {filteredSuggestions.length > 0 && (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedIds.length === filteredSuggestions.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-slate-600">Select all</span>
          </div>
        )}
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
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedIds.includes(suggestion.id)}
                      onCheckedChange={(checked) => handleSelectOne(suggestion.id, checked)}
                      className="mt-1"
                    />
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
                        Submitted on {new Date(suggestion.created_date).toLocaleString('en-US', { 
                          timeZone: 'Asia/Dubai',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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