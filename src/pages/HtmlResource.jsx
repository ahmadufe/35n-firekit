import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HtmlResource() {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resourceId = urlParams.get('resource_id');

    if (!resourceId) {
      setLoading(false);
      return;
    }

    const fetchResource = async () => {
      try {
        const configs = await base44.entities.LandingPageConfig.filter({ config_name: 'published' });
        const publishedConfig = configs.length > 0 ? configs[0] : null;

        if (publishedConfig?.sections) {
          for (const section of publishedConfig.sections) {
            const found = (section.tools || []).find(t => t && t.id === resourceId);
            if (found) {
              setResource(found);
              break;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Resource not found</p>
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-semibold text-slate-900 mb-4 tracking-tight">{resource.title}</h1>
        {resource.description && (
          <p className="text-slate-500 mb-8">{resource.description}</p>
        )}

        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: resource.html_content || '' }}
        />
      </div>
    </div>
  );
}