import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Loader2, Users as UsersIcon, Eye, LogIn } from "lucide-react";
import { format } from "date-fns";

export default function UsersTab() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showLoginHistory, setShowLoginHistory] = useState(false);

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list('-created_date')
  });

  const { data: userProfiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ['allUserProfiles'],
    queryFn: () => base44.entities.UserProfile.list()
  });

  const { data: logins = [] } = useQuery({
    queryKey: ['userLogins', selectedUser?.email],
    queryFn: () => base44.entities.LoginHistory.filter({ user_email: selectedUser?.email }, '-created_date'),
    enabled: !!selectedUser
  });

  const isLoading = usersLoading || profilesLoading;

  const handleViewLoginHistory = (user) => {
    setSelectedUser(user);
    setShowLoginHistory(true);
  };

  const handleExport = () => {
    const headers = ['Email', 'Full Name', 'Role', 'Company', 'Team', 'Created Date'];
    const rows = users.map(user => {
      const profile = userProfiles.find(p => p.user_email === user.email);
      return [
        user.email,
        user.full_name || 'N/A',
        user.role,
        profile?.company || 'N/A',
        profile?.team || 'N/A',
        format(new Date(user.created_date), 'MMM d, yyyy')
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users-${format(new Date(), 'yyyy-MM-dd')}.csv`;
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
          <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
          <p className="text-sm text-slate-500 mt-1">Total users: {users.length}</p>
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
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <UsersIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No users yet</p>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const profile = userProfiles.find(p => p.user_email === user.email);
                return (
                  <TableRow 
                    key={user.id} 
                    className="border-slate-100 hover:bg-slate-50"
                  >
                    <TableCell className="font-medium text-slate-700">{user.email}</TableCell>
                    <TableCell className="text-slate-600">{profile?.name || user.full_name || 'N/A'}</TableCell>
                    <TableCell className="text-slate-600">{profile?.company || 'N/A'}</TableCell>
                    <TableCell className="text-slate-600">{profile?.team || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700 border-purple-200' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {format(new Date(user.created_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewLoginHistory(user)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showLoginHistory} onOpenChange={setShowLoginHistory}>
        <DialogContent className="sm:max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>
              User Details - {selectedUser?.email}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <div className="border-b border-slate-200 pb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Email</p>
                  <p className="text-slate-900">{selectedUser?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Name</p>
                  <p className="text-slate-900">{userProfiles.find(p => p.user_email === selectedUser?.email)?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Company</p>
                  <p className="text-slate-900">{userProfiles.find(p => p.user_email === selectedUser?.email)?.company || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Team</p>
                  <p className="text-slate-900">{userProfiles.find(p => p.user_email === selectedUser?.email)?.team || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Role</p>
                  <Badge 
                    variant="secondary"
                    className={selectedUser?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700 border-purple-200' 
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                    }
                  >
                    {selectedUser?.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Interested Resources</p>
                  <div className="flex flex-wrap gap-2">
                    {userProfiles.find(p => p.user_email === selectedUser?.email)?.interested_resources?.length > 0 ? (
                      userProfiles.find(p => p.user_email === selectedUser?.email).interested_resources.map((resource) => (
                        <Badge key={resource} variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          {resource}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">N/A</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Interested Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {userProfiles.find(p => p.user_email === selectedUser?.email)?.interested_areas?.length > 0 ? (
                      userProfiles.find(p => p.user_email === selectedUser?.email).interested_areas.map((area) => (
                        <Badge key={area} variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                          {area}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">N/A</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Login History</h3>
              {logins.length === 0 ? (
                <div className="text-center py-8">
                  <LogIn className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No login history for this user</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                {logins.map((login) => (
                  <div 
                    key={login.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <LogIn className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {format(new Date(login.created_date), 'MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-slate-500">
                          {format(new Date(login.created_date), 'HH:mm:ss')}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={login.login_type === 'first_time' 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : 'bg-blue-100 text-blue-700 border-blue-200'
                      }
                    >
                      {login.login_type === 'first_time' ? 'First Time' : 'Returning'}
                    </Badge>
                  </div>
                ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}