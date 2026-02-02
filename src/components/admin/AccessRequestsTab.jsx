import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AccessRequestsTab() {
  const [selectedIds, setSelectedIds] = useState([]);
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['accessRequests'],
    queryFn: () => base44.entities.AccessRequest.list('-created_date')
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(requests.map(r => r.id));
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
    if (!confirm(`Delete ${selectedIds.length} selected access requests?`)) return;
    
    for (const id of selectedIds) {
      await base44.entities.AccessRequest.delete(id);
    }
    
    queryClient.invalidateQueries({ queryKey: ['accessRequests'] });
    setSelectedIds([]);
    toast.success(`${selectedIds.length} access requests deleted`);
  };

  const handleBulkExport = () => {
    const selectedRequests = requests.filter(r => selectedIds.includes(r.id));
    const headers = ['Date', 'Time', 'Name', 'Email', 'Resource', 'Resource Type'];
    const rows = selectedRequests.map(item => {
      const date = new Date(item.created_date);
      const abuDhabiDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
      return [
        format(abuDhabiDate, 'MMM d, yyyy'),
        format(abuDhabiDate, 'HH:mm:ss'),
        item.user_name,
        item.user_email,
        item.resource_title,
        item.resource_type || 'N/A'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `access-requests-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    toast.success('Exported to CSV');
  };

  const handleExportAll = () => {
    const headers = ['Date', 'Time', 'Name', 'Email', 'Resource', 'Resource Type'];
    const rows = requests.map(item => {
      const date = new Date(item.created_date);
      const abuDhabiDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
      return [
        format(abuDhabiDate, 'MMM d, yyyy'),
        format(abuDhabiDate, 'HH:mm:ss'),
        item.user_name,
        item.user_email,
        item.resource_title,
        item.resource_type || 'N/A'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `access-requests-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    toast.success('Exported to CSV');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Access Requests</h2>
          <p className="text-sm text-slate-500 mt-1">Total requests received: {requests.length}</p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 ? (
            <>
              <Button onClick={handleBulkExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export ({selectedIds.length})
              </Button>
              <Button onClick={handleBulkDelete} variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedIds.length})
              </Button>
            </>
          ) : requests.length > 0 && (
            <Button onClick={handleExportAll} className="bg-slate-900 hover:bg-slate-800">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          )}
        </div>
      </div>

      {requests.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <Checkbox
            checked={selectedIds.length === requests.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-slate-600">Select all</span>
        </div>
      )}

      <div className="grid gap-4">
        {requests.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center">
              <Lock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No access requests yet</p>
            </CardContent>
          </Card>
        ) : (
          requests.map((item) => (
            <Card key={item.id} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={(checked) => handleSelectOne(item.id, checked)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link 
                          to={createPageUrl(`UserSettings?email=${encodeURIComponent(item.user_email)}`)}
                          className="text-lg font-semibold text-slate-900 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          {item.user_name}
                        </Link>
                        <p className="text-sm text-slate-600">{item.user_email}</p>
                      </div>
                      <p className="text-xs text-slate-400">
                        {new Date(item.created_date).toLocaleString('en-US', { 
                          timeZone: 'Asia/Dubai',
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-sm text-slate-600 mb-1">Requested access to:</p>
                      <p className="font-semibold text-slate-900">{item.resource_title}</p>
                      {item.resource_type && (
                        <p className="text-xs text-slate-500 mt-1">{item.resource_type}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}