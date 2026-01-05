import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, GripVertical, Save, Eye, Edit2, X, ChevronUp, ChevronDown, Upload, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export default function LandingPageTab() {
  const [sections, setSections] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const queryClient = useQueryClient();

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['landingPageConfigs'],
    queryFn: () => base44.entities.LandingPageConfig.list()
  });

  const draftConfig = configs.find(c => c.config_name === 'draft');
  const publishedConfig = configs.find(c => c.config_name === 'published');

  useEffect(() => {
    if (draftConfig) {
      setSections(draftConfig.sections || []);
    } else if (publishedConfig) {
      setSections(publishedConfig.sections || []);
    } else {
      // Initialize with default sections
      setSections([
        {
          id: 'tools',
          title: 'Tools',
          coming_soon: false,
          tools: [
            {
              id: 'cx_scorecard',
              title: 'Product Launch CX Scorecard',
              description: 'A non-technical launch gate assessment for fintech, enterprise, and emerging markets products.',
              icon: 'ClipboardCheck',
              page: 'Scorecard',
              coming_soon: false
            }
          ]
        },
        {
          id: 'resources',
          title: 'Resources',
          coming_soon: true,
          tools: []
        },
        {
          id: 'playbooks',
          title: 'Playbooks',
          coming_soon: true,
          tools: []
        }
      ]);
    }
  }, [draftConfig, publishedConfig]);

  const handleAddSection = () => {
    const newSection = {
      id: `section_${Date.now()}`,
      title: 'New Section',
      coming_soon: true,
      tools: []
    };
    setSections([...sections, newSection]);
    setHasChanges(true);
  };

  const handleRemoveSection = (sectionId) => {
    setSections(sections.filter(s => s.id !== sectionId));
    setHasChanges(true);
  };

  const handleUpdateSection = (sectionId, updates) => {
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    ));
    setHasChanges(true);
  };

  const handleAddTool = (sectionId) => {
    const newTool = {
      id: `tool_${Date.now()}`,
      title: 'New Tool',
      description: 'Tool description',
      icon: 'ClipboardCheck',
      page: '',
      coming_soon: true
    };
    
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, tools: [...(s.tools || []), newTool] }
        : s
    ));
    setHasChanges(true);
  };

  const handleRemoveTool = (sectionId, toolId) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, tools: (s.tools || []).filter(t => t.id !== toolId) }
        : s
    ));
    setHasChanges(true);
  };

  const handleUpdateTool = (sectionId, toolId, updates) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { 
            ...s, 
            tools: (s.tools || []).map(t => 
              t.id === toolId ? { ...t, ...updates } : t
            )
          }
        : s
    ));
    setHasChanges(true);
  };

  const handleMoveSectionUp = (index) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setSections(newSections);
    setHasChanges(true);
  };

  const handleMoveSectionDown = (index) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    setSections(newSections);
    setHasChanges(true);
  };

  const handleFileUpload = async (sectionId, toolId, file) => {
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      handleUpdateTool(sectionId, toolId, { file_url });
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const handleSaveDraft = async () => {
    const configData = {
      config_name: 'draft',
      sections
    };

    if (draftConfig) {
      await base44.entities.LandingPageConfig.update(draftConfig.id, configData);
    } else {
      await base44.entities.LandingPageConfig.create(configData);
    }

    queryClient.invalidateQueries({ queryKey: ['landingPageConfigs'] });
    setHasChanges(false);
    toast.success('Draft saved successfully');
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    const configData = {
      config_name: 'published',
      sections
    };

    if (publishedConfig) {
      await base44.entities.LandingPageConfig.update(publishedConfig.id, configData);
    } else {
      await base44.entities.LandingPageConfig.create(configData);
    }

    // Also save as draft
    await handleSaveDraft();

    queryClient.invalidateQueries({ queryKey: ['landingPageConfigs'] });
    queryClient.invalidateQueries({ queryKey: ['publishedLandingPage'] });
    setIsPublishing(false);
    setHasChanges(false);
    toast.success('Changes published successfully!');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Landing Page Editor</h2>
          <p className="text-sm text-slate-500 mt-1">Manage sections and tools on the landing page</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button onClick={handleSaveDraft} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
          )}
          <Button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isPublishing ? 'Publishing...' : 'Publish Changes'}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            You have unsaved changes. Save as draft or publish to make them live.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section, sectionIndex) => (
          <Card key={section.id} className="border-0 shadow-md">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0"
                      onClick={() => handleMoveSectionUp(sectionIndex)}
                      disabled={sectionIndex === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0"
                      onClick={() => handleMoveSectionDown(sectionIndex)}
                      disabled={sectionIndex === sections.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  {editingSection === section.id ? (
                    <Input
                      value={section.title}
                      onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                      className="max-w-xs"
                    />
                  ) : (
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  )}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!section.coming_soon}
                      onCheckedChange={(checked) => 
                        handleUpdateSection(section.id, { coming_soon: !checked })
                      }
                    />
                    <span className="text-sm text-slate-600">Active</span>
                  </div>
                  {section.coming_soon && (
                    <Badge variant="outline" className="border-amber-300 text-amber-600">
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                  >
                    {editingSection === section.id ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {(section.tools || []).map((tool) => (
                  <div key={tool.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Input
                            value={tool.title}
                            onChange={(e) => handleUpdateTool(section.id, tool.id, { title: e.target.value })}
                            placeholder="Tool title"
                            className="max-w-md"
                          />
                          <Switch
                            checked={!tool.coming_soon}
                            onCheckedChange={(checked) => 
                              handleUpdateTool(section.id, tool.id, { coming_soon: !checked })
                            }
                          />
                          <span className="text-sm text-slate-600">Active</span>
                        </div>
                        <Textarea
                          value={tool.description}
                          onChange={(e) => handleUpdateTool(section.id, tool.id, { description: e.target.value })}
                          placeholder="Tool description"
                          className="resize-none"
                          rows={2}
                        />
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Label className="text-xs text-slate-500 mb-1">Page Name (optional)</Label>
                            <Input
                              value={tool.page || ''}
                              onChange={(e) => handleUpdateTool(section.id, tool.id, { page: e.target.value })}
                              placeholder="e.g., Scorecard"
                              className="mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs text-slate-500 mb-1">External Link (optional)</Label>
                            <Input
                              value={tool.link || ''}
                              onChange={(e) => handleUpdateTool(section.id, tool.id, { link: e.target.value })}
                              placeholder="https://..."
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500 mb-2 block">
                            Attachment (optional) - Will be displayed when user clicks the card
                          </Label>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById(`file-${tool.id}`).click()}
                              className="flex items-center gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              Upload File
                            </Button>
                            <input
                              id={`file-${tool.id}`}
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) handleFileUpload(section.id, tool.id, file);
                              }}
                            />
                            {tool.file_url && (
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                  File attached
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateTool(section.id, tool.id, { file_url: null })}
                                >
                                  <X className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTool(section.id, tool.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => handleAddTool(section.id)}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tool
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={handleAddSection}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Section
      </Button>
    </div>
  );
}