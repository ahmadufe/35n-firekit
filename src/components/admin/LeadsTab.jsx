import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { downloadJSON } from "@/lib/exportData";

export default function LeadsTab() {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date')
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Leads from Exclusive Resources</CardTitle>
            <p className="text-sm text-slate-500 mt-2">
              Users who accessed exclusive resources by providing their details
            </p>
          </div>
          {leads.length > 0 && (
            <Button onClick={() => downloadJSON(leads, "leads")} className="bg-slate-900 hover:bg-slate-800">
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No leads yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">First Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Last Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Organization</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Resource</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr key={lead.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 text-sm text-slate-900">{lead.first_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{lead.last_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{lead.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{lead.organization}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{lead.resource_title || lead.resource_id}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(lead.created_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}