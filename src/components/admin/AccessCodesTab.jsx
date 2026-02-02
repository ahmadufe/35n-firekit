import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Copy, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const AVAILABLE_TYPES = ['Tools', 'Guides & Insights', 'Playbooks', 'Deep Dive'];

function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function AccessCodesTab() {
  const [showDialog, setShowDialog] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    beneficiary_name: '',
    position: '',
    organization: '',
    resources: []
  });
  const [searchQuery, setSearchQuery] = useState('');

  const queryClient = useQueryClient();

  // Fetch all access codes
  const { data: accessCodes = [], isLoading: codesLoading } = useQuery({
    queryKey: ['accessCodes'],
    queryFn: () => base44.entities.AccessCode.list()
  });

  // Fetch landing page config to get exclusive resources
  const { data: publishedConfig } = useQuery({
    queryKey: ['publishedLandingPage'],
    queryFn: async () => {
      const configs = await base44.entities.LandingPageConfig.filter({ config_name: 'published' });
      return configs[0];
    }
  });

  // Extract exclusive resources
  const exclusiveResources = publishedConfig?.sections
    ? publishedConfig.sections.flatMap(section =>
        (section.tools || [])
          .filter(tool => tool.coming_soon)
          .map(tool => ({
            id: tool.id,
            title: tool.title,
            type: section.title
          }))
      )
    : [];

  const filteredCodes = accessCodes.filter(code => {
    if (!searchQuery) return true;
    return (
      (code.beneficiary_name && code.beneficiary_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (code.organization && code.organization.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleOpenDialog = () => {
    setGeneratedCode(null);
    setFormData({
      beneficiary_name: '',
      position: '',
      organization: '',
      resources: []
    });
    setShowDialog(true);
  };

  const toggleResource = (resourceId) => {
    setFormData({
      ...formData,
      resources: formData.resources.includes(resourceId)
        ? formData.resources.filter(r => r !== resourceId)
        : [...formData.resources, resourceId]
    });
  };

  const handleGenerateCode = async () => {
    if (formData.resources.length === 0) {
      toast.error('Please select at least one resource');
      return;
    }

    try {
      setIsGenerating(true);
      const newCode = generateRandomCode();

      const user = await base44.auth.me();

      await base44.entities.AccessCode.create({
        code: newCode,
        beneficiary_name: formData.beneficiary_name || null,
        position: formData.position || null,
        organization: formData.organization || null,
        resources: formData.resources,
        created_by_admin: user.email,
        is_used: false
      });

      setGeneratedCode(newCode);
      await queryClient.invalidateQueries({ queryKey: ['accessCodes'] });
      toast.success('Access code generated successfully');
    } catch (error) {
      toast.error('Failed to generate access code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success('Code copied to clipboard');
  };

  const handleDeleteCode = async (codeId) => {
    if (!window.confirm('Are you sure you want to delete this access code?')) return;

    try {
      await base44.entities.AccessCode.delete(codeId);
      await queryClient.invalidateQueries({ queryKey: ['accessCodes'] });
      toast.success('Access code deleted');
    } catch (error) {
      toast.error('Failed to delete access code');
    }
  };

  if (codesLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Access Codes</h2>
          <p className="text-sm text-slate-500 mt-1">Manage exclusive resource access codes</p>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Generate Access Code
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search by beneficiary name, code, or organization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid gap-4">
        {filteredCodes.length > 0 ? (
          filteredCodes.map((code) => {
            const resourceNames = exclusiveResources
              .filter(r => code.resources.includes(r.id))
              .map(r => r.title);

            return (
              <Card key={code.id} className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm font-mono font-semibold text-slate-900 bg-slate-100 px-3 py-1 rounded">
                          {code.code}
                        </code>
                        {code.is_used && (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                            Used
                          </Badge>
                        )}
                      </div>
                      
                      {code.beneficiary_name && (
                        <p className="text-sm font-medium text-slate-900">
                          {code.beneficiary_name}
                          {code.position && ` • ${code.position}`}
                        </p>
                      )}
                      
                      {code.organization && (
                        <p className="text-sm text-slate-600 mb-2">{code.organization}</p>
                      )}

                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 font-medium">Resources:</p>
                        <div className="flex flex-wrap gap-1">
                          {resourceNames.length > 0 ? (
                            resourceNames.map((name, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500">No resources</span>
                          )}
                        </div>
                      </div>

                      {code.is_used && code.used_by && (
                        <p className="text-xs text-slate-500 mt-2">
                          Used by: {code.used_by} on {new Date(code.used_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyCode}
                        title="Copy code"
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCode(code.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 border border-slate-200 rounded-lg bg-slate-50">
            <p className="text-slate-500">No access codes generated yet</p>
          </div>
        )}
      </div>

      {/* Generate Code Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Access Code</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Beneficiary Name (optional)</Label>
              <Input
                value={formData.beneficiary_name}
                onChange={(e) => setFormData({ ...formData, beneficiary_name: e.target.value })}
                placeholder="Enter beneficiary name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Position (optional)</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g., CEO, Manager"
                />
              </div>

              <div>
                <Label>Organization (optional)</Label>
                <Input
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Enter organization"
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold">Resources *</Label>
              <p className="text-xs text-slate-500 mb-3">Select which exclusive resources this code grants access to</p>
              <div className="space-y-2">
                {exclusiveResources.length > 0 ? (
                  exclusiveResources.map(resource => (
                    <label key={resource.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.resources.includes(resource.id)}
                        onChange={() => toggleResource(resource.id)}
                        className="rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{resource.title}</p>
                        <p className="text-xs text-slate-500">{resource.type}</p>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 py-2">No exclusive resources available</p>
                )}
              </div>
            </div>

            {generatedCode && (
              <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="font-semibold text-green-700">Code Generated!</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-green-300 rounded p-3">
                  <code className="text-lg font-mono font-bold text-slate-900 flex-1">
                    {generatedCode}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyCode}
                    className="text-green-700 hover:bg-green-100"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              {generatedCode ? 'Close' : 'Cancel'}
            </Button>
            {!generatedCode && (
              <Button onClick={handleGenerateCode} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Code'
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}