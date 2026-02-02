import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Eye, EyeOff, Upload, X, ExternalLink, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AVAILABLE_TYPES = ['Tools', 'Guides & Insights', 'Playbooks', 'Deep Dive'];
const AVAILABLE_TOPICS = [
  'Fintech',
  'Trade & Logistics',
  'Gov-tech',
  'SaaS',
  'Banking technology',
  'AI',
  'Digital transformation & platforms',
  'Product building',
  'Venture building',
  'Africa startups & tech',
  'Middle East startups & tech',
  'Emerging markets startups & tech'
];
const ICON_OPTIONS = ['ClipboardCheck', 'BookOpen', 'Wrench'];

export default function ResourcesManagementTab() {
  const [editingResource, setEditingResource] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Tools',
    topics: [],
    icon: 'ClipboardCheck',
    page: '',
    link: '',
    file_url: '',
    coming_soon: false,
    published_date: '',
    featured: false
  });
  const [filterView, setFilterView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const queryClient = useQueryClient();

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['landingPageConfigs'],
    queryFn: () => base44.entities.LandingPageConfig.list()
  });

  const publishedConfig = configs.find(c => c.config_name === 'published');
  const draftConfig = configs.find(c => c.config_name === 'draft');

  // Flatten all resources from sections
  const allResources = (publishedConfig?.sections || []).flatMap(section =>
    (section.tools || []).map(tool => ({
      ...tool,
      sectionTitle: section.title,
      sectionId: section.id,
      published: true
    }))
  );

  const draftResources = (draftConfig?.sections || []).flatMap(section =>
    (section.tools || []).map(tool => ({
      ...tool,
      sectionTitle: section.title,
      sectionId: section.id,
      published: false
    }))
  );

  // Combine and deduplicate - ALWAYS prefer draft version over published
  const combinedResources = [
    ...draftResources,
    ...allResources.filter(pub => !draftResources.find(draft => draft.id === pub.id))
  ];

  const filteredResources = combinedResources.filter(resource => {
    const matchesView = 
      filterView === 'all' ? true :
      filterView === 'published' ? resource.published :
      !resource.published;
    
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesView && matchesSearch;
  });

  const handleOpenDialog = (resource = null) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        title: resource.title || '',
        description: resource.description || '',
        type: resource.sectionTitle || 'Tools',
        topics: resource.topics || [],
        icon: resource.icon || 'ClipboardCheck',
        page: resource.page || '',
        link: resource.link || '',
        file_url: resource.file_url || '',
        coming_soon: resource.coming_soon || false,
        published_date: resource.published_date || '',
        featured: resource.featured || false
      });
    } else {
      setEditingResource(null);
      setFormData({
        title: '',
        description: '',
        type: 'Tools',
        topics: [],
        icon: 'ClipboardCheck',
        page: '',
        link: '',
        file_url: '',
        coming_soon: false,
        published_date: '',
        featured: false
      });
    }
    setShowDialog(true);
  };

  const handleSaveResource = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    const config = draftConfig || publishedConfig;
    const sections = config?.sections || [];

    let targetSection = sections.find(s => s.title === formData.type);
    
    if (!targetSection) {
      targetSection = {
        id: `section_${Date.now()}`,
        title: formData.type,
        coming_soon: false,
        tools: []
      };
      sections.push(targetSection);
    }

    const toolData = {
      id: editingResource?.id || `tool_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      icon: formData.icon,
      page: formData.page,
      link: formData.link,
      file_url: formData.file_url,
      coming_soon: formData.coming_soon,
      topics: formData.topics,
      published_date: formData.published_date || new Date().toISOString(),
      featured: formData.featured
    };

    if (editingResource) {
      // Update existing tool - find it across all sections if needed
      const oldSection = sections.find(s => 
        (s.tools || []).some(t => t.id === editingResource.id)
      );
      
      if (oldSection && oldSection.title !== formData.type) {
        // Tool moved to different section, remove from old section
        oldSection.tools = (oldSection.tools || []).filter(t => t.id !== editingResource.id);
        targetSection.tools = [...(targetSection.tools || []), toolData];
      } else if (oldSection) {
        // Tool stays in same section, update it
        oldSection.tools = (oldSection.tools || []).map(t =>
          t.id === editingResource.id ? toolData : t
        );
      } else {
        // Fallback: just add to target section
        targetSection.tools = [...(targetSection.tools || []), toolData];
      }
    } else {
      // Add new tool
      targetSection.tools = [...(targetSection.tools || []), toolData];
    }

    const updatedConfig = {
      config_name: 'draft',
      sections
    };

    if (draftConfig) {
      await base44.entities.LandingPageConfig.update(draftConfig.id, updatedConfig);
    } else {
      await base44.entities.LandingPageConfig.create(updatedConfig);
    }

    await queryClient.invalidateQueries({ queryKey: ['landingPageConfigs'] });
    await queryClient.invalidateQueries({ queryKey: ['publishedLandingPage'] });
    setShowDialog(false);
    toast.success(editingResource ? 'Resource updated in draft' : 'Resource added to draft');
  };

  const handleDeleteResource = async (resource) => {
    const config = draftConfig || publishedConfig;
    const sections = (config?.sections || []).map(section => ({
      ...section,
      tools: (section.tools || []).filter(t => t.id !== resource.id)
    }));

    const updatedConfig = {
      config_name: 'draft',
      sections
    };

    if (draftConfig) {
      await base44.entities.LandingPageConfig.update(draftConfig.id, updatedConfig);
    } else {
      await base44.entities.LandingPageConfig.create(updatedConfig);
    }

    await queryClient.invalidateQueries({ queryKey: ['landingPageConfigs'] });
    await queryClient.invalidateQueries({ queryKey: ['publishedLandingPage'] });
    toast.success('Resource deleted from draft');
  };

  const handleMoveResource = async (resource, direction) => {
    const config = draftConfig || publishedConfig;
    const sections = JSON.parse(JSON.stringify(config?.sections || []));
    
    // Flatten all resources with their section reference
    const flatResources = [];
    sections.forEach(section => {
      (section.tools || []).forEach(tool => {
        flatResources.push({ tool, sectionId: section.id });
      });
    });

    const resourceIndex = flatResources.findIndex(r => r.tool.id === resource.id);
    if (resourceIndex === -1) return;

    let newIndex = resourceIndex;
    if (direction === 'up' && resourceIndex > 0) {
      newIndex = resourceIndex - 1;
    } else if (direction === 'down' && resourceIndex < flatResources.length - 1) {
      newIndex = resourceIndex + 1;
    } else {
      return;
    }

    // Swap
    [flatResources[resourceIndex], flatResources[newIndex]] = 
      [flatResources[newIndex], flatResources[resourceIndex]];

    // Reconstruct sections with new order
    sections.forEach(section => {
      section.tools = [];
    });

    flatResources.forEach(({ tool, sectionId }) => {
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        section.tools.push(tool);
      }
    });

    const updatedConfig = {
      config_name: 'draft',
      sections
    };

    if (draftConfig) {
      await base44.entities.LandingPageConfig.update(draftConfig.id, updatedConfig);
    } else {
      await base44.entities.LandingPageConfig.create(updatedConfig);
    }

    await queryClient.invalidateQueries({ queryKey: ['landingPageConfigs'] });
    await queryClient.invalidateQueries({ queryKey: ['publishedLandingPage'] });
    toast.success('Order updated in draft');
  };

  const handlePublish = async () => {
    if (!draftConfig) {
      toast.error('No draft to publish');
      return;
    }

    try {
      setIsPublishing(true);
      const publishData = {
        config_name: 'published',
        sections: draftConfig.sections
      };

      if (publishedConfig) {
        await base44.entities.LandingPageConfig.update(publishedConfig.id, publishData);
      } else {
        await base44.entities.LandingPageConfig.create(publishData);
      }

      await queryClient.invalidateQueries({ queryKey: ['landingPageConfigs'] });
      await queryClient.invalidateQueries({ queryKey: ['publishedLandingPage'] });
      toast.success('Changes published successfully!');
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish changes');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, file_url });
      toast.success('File uploaded');
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const toggleTopic = (topic) => {
    setFormData({
      ...formData,
      topics: formData.topics.includes(topic)
        ? formData.topics.filter(t => t !== topic)
        : [...formData.topics, topic]
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Resources Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage all tools, guides, and resources</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handlePublish} 
            disabled={isPublishing || !draftConfig}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish Changes'
            )}
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search resources by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant={filterView === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterView('all')}
        >
          All ({combinedResources.length})
        </Button>
        <Button
          variant={filterView === 'published' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterView('published')}
        >
          Published ({allResources.length})
        </Button>
        <Button
          variant={filterView === 'draft' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterView('draft')}
        >
          Draft Only ({draftResources.filter(d => !allResources.find(p => p.id === d.id)).length})
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredResources.map((resource, index) => {
          // Calculate position based on actual global order
          const config = draftConfig || publishedConfig;
          const allTools = config?.sections?.flatMap(s => s.tools || []) || [];
          const globalIndex = allTools.findIndex(t => t.id === resource.id);
          const isFirst = globalIndex <= 0;
          const isLast = globalIndex === -1 || globalIndex >= allTools.length - 1;

          return (
          <Card key={resource.id} className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleMoveResource(resource, 'up')}
                      disabled={isFirst}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleMoveResource(resource, 'down')}
                      disabled={isLast}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 truncate">{resource.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {resource.sectionTitle}
                    </Badge>
                    {resource.coming_soon && (
                      <Badge variant="outline" className="border-amber-300 text-amber-600 text-xs">
                        Coming Soon
                      </Badge>
                    )}
                    {resource.featured && (
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                        Featured
                      </Badge>
                    )}
                    {resource.published ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Draft
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2 line-clamp-2">{resource.description}</p>
                  {resource.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {resource.topics.map((topic, idx) => (
                        <span key={idx} className="text-xs text-slate-500">
                          #{topic.toLowerCase().replace(/\s+/g, '')}
                        </span>
                      ))}
                    </div>
                  )}
                  {(resource.page || resource.link || resource.file_url) && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      {resource.page && <span>Page: {resource.page}</span>}
                      {resource.link && <ExternalLink className="h-3 w-3" />}
                      {resource.file_url && <span>Has attachment</span>}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(resource)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteResource(resource)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        })}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Resource title"
              />
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Resource description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Icon</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map(icon => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Topics</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {AVAILABLE_TOPICS.map(topic => (
                  <Badge
                    key={topic}
                    variant={formData.topics.includes(topic) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTopic(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Page Name (optional)</Label>
                <Input
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  placeholder="e.g., Scorecard"
                />
              </div>

              <div>
                <Label>External Link (optional)</Label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <Label>Attachment (optional)</Label>
              <div className="flex items-center gap-3 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('resource-file-upload').click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
                <input
                  id="resource-file-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                {formData.file_url && (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-700">File attached</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData({ ...formData, file_url: '' })}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Published Date</Label>
              <Input
                type="datetime-local"
                value={formData.published_date ? new Date(formData.published_date).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData({ ...formData, published_date: e.target.value ? new Date(e.target.value).toISOString() : '' })}
              />
              <p className="text-xs text-slate-500 mt-1">Used to determine "New resources" on dashboard</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="coming-soon"
                  checked={formData.coming_soon}
                  onChange={(e) => setFormData({ ...formData, coming_soon: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="coming-soon">Mark as Coming Soon</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="featured">Mark as Featured</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveResource}>
              {editingResource ? 'Update' : 'Add'} Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}