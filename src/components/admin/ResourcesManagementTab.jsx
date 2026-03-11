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
import { Plus, Edit2, Trash2, Eye, EyeOff, Upload, X, ExternalLink, GripVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ICON_OPTIONS = ['ClipboardCheck', 'BookOpen', 'Wrench'];

export default function ResourcesManagementTab() {
  const [editingResource, setEditingResource] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topics: [],
    icon: 'ClipboardCheck',
    page: '',
    link: '',
    file_url: '',
    cover_image: '',
    coming_soon: false,
    is_coming_soon: false,
    published_date: '',
    featured: false,
    asset_type: ''
  });
  const [filterView, setFilterView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedResources, setExpandedResources] = useState({});
  const [deleteConfirmResource, setDeleteConfirmResource] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['landingPageConfigs'],
    queryFn: () => base44.entities.LandingPageConfig.list()
  });

  const { data: filterConfig } = useQuery({
    queryKey: ['filterConfig'],
    queryFn: async () => {
      const configs = await base44.entities.FilterConfig.filter({ config_name: 'published' });
      return configs.length > 0 ? configs[0] : null;
    }
  });

  const AVAILABLE_TOPICS = filterConfig?.filters?.topic || [
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

  const AVAILABLE_TYPES = filterConfig?.filters?.type || [
    'Tools',
    'Insights',
    'Playbooks',
    'Deep dive series'
  ];

  const publishedConfig = configs.find(c => c.config_name === 'published');
  const draftConfig = configs.find(c => c.config_name === 'draft');

  // Get resources from all sections (flatten for display)
  const getResources = (config, isPublished) => {
    const resources = [];
    (config?.sections || []).forEach(section => {
      (section.tools || []).forEach(tool => {
        if (tool && typeof tool === 'object' && tool.id) {
          resources.push({
            ...tool,
            published: isPublished
          });
        }
      });
    });
    return resources;
  };

  const allResources = getResources(publishedConfig, true);
  const draftResources = getResources(draftConfig, false);

  // Combine and deduplicate - ALWAYS prefer draft version
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
        topics: resource.topics || [],
        icon: resource.icon || 'ClipboardCheck',
        page: resource.page || '',
        link: resource.link || '',
        file_url: resource.file_url || '',
        cover_image: resource.cover_image || '',
        coming_soon: resource.coming_soon || false,
        is_coming_soon: resource.is_coming_soon || false,
        published_date: resource.published_date || '',
        featured: resource.featured || false,
        asset_type: resource.asset_type || ''
      });
    } else {
      setEditingResource(null);
      setFormData({
        title: '',
        description: '',
        topics: [],
        icon: 'ClipboardCheck',
        page: '',
        link: '',
        file_url: '',
        coming_soon: false,
        is_coming_soon: false,
        published_date: '',
        featured: false,
        asset_type: ''
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
    const allCurrentResources = getResources(config, false);

    const toolData = {
      id: editingResource?.id || `tool_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      topics: Array.isArray(formData.topics) ? formData.topics : [],
      icon: formData.icon,
      page: formData.page || null,
      link: formData.link || null,
      file_url: formData.file_url || null,
      coming_soon: formData.coming_soon,
      is_coming_soon: formData.is_coming_soon,
      published_date: formData.published_date || new Date().toISOString(),
      featured: formData.featured,
      asset_type: formData.asset_type || null
    };

    let updatedResources;
    if (editingResource) {
      updatedResources = allCurrentResources.map(r => {
        if (!r) return null;
        if (r.id === editingResource.id) {
          return toolData;
        }
        const { published, ...cleanResource } = r;
        return cleanResource;
      }).filter(Boolean);
    } else {
      updatedResources = [...allCurrentResources.map(r => {
        if (!r) return null;
        const { published, ...cleanResource } = r;
        return cleanResource;
      }).filter(Boolean), toolData];
    }

    const updatedConfig = {
      config_name: 'draft',
      sections: [{
        id: 'all',
        title: 'All Resources',
        coming_soon: false,
        tools: updatedResources.filter(r => r && typeof r === 'object' && r.id)
      }]
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
    const allResources = getResources(config, false)
      .filter(r => r && r.id !== resource.id)
      .map(r => {
        if (!r) return null;
        const { published, ...cleanResource } = r;
        return cleanResource;
      })
      .filter(Boolean);

    const updatedConfig = {
      config_name: 'draft',
      sections: [{
        id: 'all',
        title: 'All Resources',
        coming_soon: false,
        tools: allResources.filter(r => r && typeof r === 'object' && r.id)
      }]
    };

    if (draftConfig) {
      await base44.entities.LandingPageConfig.update(draftConfig.id, updatedConfig);
    } else {
      await base44.entities.LandingPageConfig.create(updatedConfig);
    }

    await queryClient.invalidateQueries({ queryKey: ['landingPageConfigs'] });
    await queryClient.invalidateQueries({ queryKey: ['publishedLandingPage'] });
    setDeleteConfirmResource(null);
    toast.success('Resource deleted from draft');
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const config = draftConfig || publishedConfig;
    const allResources = getResources(config, false);
    
    const items = Array.from(allResources);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Clean published field before saving
    const cleanedItems = items.map(r => {
      if (!r) return null;
      const { published, ...cleanResource } = r;
      return cleanResource;
    }).filter(Boolean);

    const updatedConfig = {
      config_name: 'draft',
      sections: [{
        id: 'all',
        title: 'All Resources',
        coming_soon: false,
        tools: cleanedItems.filter(r => r && typeof r === 'object' && r.id)
      }]
    };

    if (draftConfig) {
      await base44.entities.LandingPageConfig.update(draftConfig.id, updatedConfig);
    } else {
      await base44.entities.LandingPageConfig.create(updatedConfig);
    }

    await queryClient.invalidateQueries({ queryKey: ['landingPageConfigs'] });
    await queryClient.invalidateQueries({ queryKey: ['publishedLandingPage'] });
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
            variant="outline"
            size="sm"
            onClick={() => {
              const allExpanded = {};
              filteredResources.forEach(r => { allExpanded[r.id] = true; });
              setExpandedResources(allExpanded);
            }}
          >
            Expand All
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setExpandedResources({})}
          >
            Collapse All
          </Button>
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="resources">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid gap-4"
            >
              {filteredResources.map((resource, index) => (
                <Draggable key={resource.id} draggableId={resource.id} index={index}>
                  {(provided, snapshot) => (
                    <Card 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`border-slate-200 ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div 
                            {...provided.dragHandleProps}
                            className="flex items-center cursor-grab active:cursor-grabbing pt-2"
                          >
                            <GripVertical className="h-5 w-5 text-slate-400" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-slate-900">{resource.title}</h3>
                              {resource.coming_soon && (
                                <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                                  Exclusive
                                </Badge>
                              )}
                              {resource.is_coming_soon && (
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                  Coming Soon
                                </Badge>
                              )}
                              {resource.featured && (
                               <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                                 Featured
                               </Badge>
                              )}
                              {resource.asset_type && (
                               <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                 {resource.asset_type}
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
                            
                            <p className="text-sm text-slate-600 mb-2">{resource.description}</p>
                            
                            {resource.topics?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {resource.topics.map((topic, idx) => {
                                  const isValidTopic = AVAILABLE_TOPICS.includes(topic);
                                  return (
                                    <Badge 
                                      key={idx} 
                                      variant="outline" 
                                      className={`text-xs ${!isValidTopic ? 'border-orange-300 bg-orange-50 text-orange-700' : ''}`}
                                    >
                                      {topic}
                                      {!isValidTopic && ' ⚠️'}
                                    </Badge>
                                  );
                                })}
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
                              onClick={() => setDeleteConfirmResource(resource)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={!!deleteConfirmResource} onOpenChange={() => setDeleteConfirmResource(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 py-4">
            Are you sure you want to delete <span className="font-semibold">"{deleteConfirmResource?.title}"</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmResource(null)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDeleteResource(deleteConfirmResource)}
            >
              Delete Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

              <div>
                <Label>Asset Type</Label>
                <Select value={formData.asset_type} onValueChange={(value) => setFormData({ ...formData, asset_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Topics</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {/* Show outdated topics first */}
                {formData.topics.filter(t => !AVAILABLE_TOPICS.includes(t)).map(topic => (
                  <Badge
                    key={topic}
                    variant="default"
                    className="cursor-pointer bg-orange-500 hover:bg-orange-600"
                    onClick={() => toggleTopic(topic)}
                  >
                    {topic} ⚠️ (outdated)
                  </Badge>
                ))}
                {/* Show current available topics */}
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
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    coming_soon: e.target.checked,
                    is_coming_soon: e.target.checked ? false : formData.is_coming_soon
                  })}
                  className="rounded"
                />
                <Label htmlFor="coming-soon">Mark as Exclusive</Label>
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-coming-soon"
                  checked={formData.is_coming_soon}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    is_coming_soon: e.target.checked,
                    coming_soon: e.target.checked ? false : formData.coming_soon
                  })}
                  className="rounded"
                />
                <Label htmlFor="is-coming-soon">Mark as Coming Soon</Label>
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