import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_FILTERS = {
  type: ['Tools', 'Guides & Insights', 'Playbooks', 'Deep Dive'],
  topic: [
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
  ],
  access: ['Free', 'Exclusive']
};

export default function FilterAttributesTab() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [newFilterName, setNewFilterName] = useState('');
  const [editingFilter, setEditingFilter] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [editingValue, setEditingValue] = useState({ filter: null, index: null, value: '' });

  const handleAddFilter = () => {
    if (!newFilterName.trim()) {
      toast.error('Filter name cannot be empty');
      return;
    }
    
    const filterKey = newFilterName.toLowerCase().replace(/\s+/g, '_');
    
    if (filters[filterKey]) {
      toast.error('Filter already exists');
      return;
    }

    setFilters({
      ...filters,
      [filterKey]: []
    });
    setNewFilterName('');
    toast.success('Filter added');
  };

  const handleDeleteFilter = (filterKey) => {
    if (['type', 'topic', 'access'].includes(filterKey)) {
      toast.error('Cannot delete default filters');
      return;
    }
    
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    setFilters(newFilters);
    toast.success('Filter deleted');
  };

  const handleAddValue = (filterKey) => {
    if (!newValue.trim()) {
      toast.error('Value cannot be empty');
      return;
    }

    if (filters[filterKey].includes(newValue.trim())) {
      toast.error('Value already exists');
      return;
    }

    setFilters({
      ...filters,
      [filterKey]: [...filters[filterKey], newValue.trim()]
    });
    setNewValue('');
    setEditingFilter(null);
    toast.success('Value added');
  };

  const handleDeleteValue = (filterKey, index) => {
    setFilters({
      ...filters,
      [filterKey]: filters[filterKey].filter((_, i) => i !== index)
    });
    toast.success('Value deleted');
  };

  const handleStartEditValue = (filterKey, index, value) => {
    setEditingValue({ filter: filterKey, index, value });
  };

  const handleSaveEditValue = () => {
    if (!editingValue.value.trim()) {
      toast.error('Value cannot be empty');
      return;
    }

    const newValues = [...filters[editingValue.filter]];
    newValues[editingValue.index] = editingValue.value.trim();
    
    setFilters({
      ...filters,
      [editingValue.filter]: newValues
    });
    setEditingValue({ filter: null, index: null, value: '' });
    toast.success('Value updated');
  };

  const handleCancelEdit = () => {
    setEditingValue({ filter: null, index: null, value: '' });
  };

  const formatFilterName = (key) => {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Filter Attributes</h2>
        <p className="text-sm text-slate-500 mt-1">Manage filter categories and their values</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Add New Filter Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newFilterName}
              onChange={(e) => setNewFilterName(e.target.value)}
              placeholder="e.g., Industry, Region, Stage"
              onKeyDown={(e) => e.key === 'Enter' && handleAddFilter()}
            />
            <Button onClick={handleAddFilter}>
              <Plus className="mr-2 h-4 w-4" />
              Add Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {Object.entries(filters).map(([filterKey, values]) => (
          <Card key={filterKey} className="border-slate-200">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{formatFilterName(filterKey)}</CardTitle>
                {!['type', 'topic', 'access'].includes(filterKey) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFilter(filterKey)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {values.map((value, index) => (
                    <div key={index} className="group relative">
                      {editingValue.filter === filterKey && editingValue.index === index ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={editingValue.value}
                            onChange={(e) => setEditingValue({ ...editingValue, value: e.target.value })}
                            className="h-8 w-40"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditValue();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <Button variant="ghost" size="sm" onClick={handleSaveEditValue}>
                            <Check className="h-3 w-3 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                            <X className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="px-3 py-1.5 pr-16 relative cursor-pointer hover:bg-slate-50"
                        >
                          {value}
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={() => handleStartEditValue(filterKey, index, value)}
                              className="p-1 hover:bg-slate-200 rounded"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteValue(filterKey, index)}
                              className="p-1 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </button>
                          </div>
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {editingFilter === filterKey ? (
                  <div className="flex gap-2">
                    <Input
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Enter new value"
                      className="max-w-xs"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddValue(filterKey);
                        if (e.key === 'Escape') {
                          setEditingFilter(null);
                          setNewValue('');
                        }
                      }}
                    />
                    <Button size="sm" onClick={() => handleAddValue(filterKey)}>
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingFilter(null);
                        setNewValue('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingFilter(filterKey)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Value
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}