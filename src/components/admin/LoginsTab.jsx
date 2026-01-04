import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, LogIn } from "lucide-react";
import { format } from "date-fns";

export default function LoginsTab() {
  const { data: logins = [], isLoading } = useQuery({
    queryKey: ['allLogins'],
    queryFn: () => base44.entities.LoginHistory.list('-created_date')
  });

  const handleExport = () => {
    const headers = ['Date', 'Time', 'User Email', 'User Name', 'Login Type'];
    const rows = logins.map(login => [
      format(new Date(login.created_date), 'MMM d, yyyy'),
      format(new Date(login.created_date), 'HH:mm:ss'),
      login.user_email,
      login.user_name || 'N/A',
      login.login_type
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `login-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
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
          <h2 className="text-2xl font-semibold text-slate-900">Login History</h2>
          <p className="text-sm text-slate-500 mt-1">Total logins: {logins.length}</p>
        </div>
        <Button onClick={handleExport} className="bg-slate-900 hover:bg-slate-800">
          <Download className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100">
              <TableHead>Date & Time</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Login Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <LogIn className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No login history yet</p>
                </TableCell>
              </TableRow>
            ) : (
              logins.map((login) => (
                <TableRow key={login.id} className="border-slate-100 hover:bg-slate-50">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {format(new Date(login.created_date), 'MMM d, yyyy')}
                      </span>
                      <span className="text-xs text-slate-500">
                        {format(new Date(login.created_date), 'HH:mm:ss')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">{login.user_email}</TableCell>
                  <TableCell className="text-slate-600">{login.user_name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={login.login_type === 'first_time' 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : 'bg-blue-100 text-blue-700 border-blue-200'
                      }
                    >
                      {login.login_type === 'first_time' ? 'First Time' : 'Returning'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}