import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export default function FeedbackTab() {
  const { data: feedback = [], isLoading } = useQuery({
    queryKey: ['feedback'],
    queryFn: () => base44.entities.Feedback.list('-created_date')
  });

  const handleExport = () => {
    const headers = ['Date', 'Time', 'First Name', 'Last Name', 'Email', 'Company', 'Team', 'Message'];
    const rows = feedback.map(item => {
      const date = new Date(item.created_date);
      const abuDhabiDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
      return [
        format(abuDhabiDate, 'MMM d, yyyy'),
        format(abuDhabiDate, 'HH:mm:ss'),
        item.first_name,
        item.last_name,
        item.email,
        item.company || 'N/A',
        item.team || 'N/A',
        item.message
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `feedback-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
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
          <h2 className="text-2xl font-semibold text-slate-900">Feedback</h2>
          <p className="text-sm text-slate-500 mt-1">Total feedback received: {feedback.length}</p>
        </div>
        {feedback.length > 0 && (
          <Button onClick={handleExport} className="bg-slate-900 hover:bg-slate-800">
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {feedback.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No feedback received yet</p>
            </CardContent>
          </Card>
        ) : (
          feedback.map((item) => (
            <Card key={item.id} className="border-slate-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.first_name} {item.last_name}
                      </h3>
                      <p className="text-sm text-slate-600">{item.email}</p>
                      {(item.company || item.team) && (
                        <p className="text-xs text-slate-500 mt-1">
                          {item.company && `${item.company}`}
                          {item.company && item.team && ' • '}
                          {item.team}
                        </p>
                      )}
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
                    <p className="text-slate-700 whitespace-pre-wrap">{item.message}</p>
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