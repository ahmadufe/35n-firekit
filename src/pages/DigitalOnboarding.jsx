import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function DigitalOnboarding() {
  const tiles = [
    {
      id: 1,
      title: "The 5 Archetypes of Digital Onboarding",
      fileUrl: null, // Will be added when files are uploaded
      thumbnail: null
    },
    {
      id: 2,
      title: "3 Metric Types to Assess the Benefits of Digital Onboarding",
      fileUrl: null,
      thumbnail: null
    },
    {
      id: 3,
      title: "4 Steps to Calculate the ROI of Digital Onboarding",
      fileUrl: null,
      thumbnail: null
    },
    {
      id: 4,
      title: "14 Best Practices to Design & Build Stellar Digital Onboarding",
      fileUrl: null,
      thumbnail: null
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-28">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">
            Digital Onboarding Deep Dive
          </h1>
        </div>

        {/* Tiles Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {tiles.map((tile) => (
            <a
              key={tile.id}
              href={tile.fileUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`group bg-white rounded-lg border border-slate-200 overflow-hidden transition-all hover:shadow-lg ${
                !tile.fileUrl ? 'cursor-not-allowed opacity-60' : 'hover:border-slate-300'
              }`}
              onClick={(e) => {
                if (!tile.fileUrl) {
                  e.preventDefault();
                }
              }}
            >
              {/* Thumbnail */}
              <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center overflow-hidden">
                {tile.thumbnail ? (
                  <img 
                    src={tile.thumbnail} 
                    alt={tile.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileText className="h-16 w-16 text-slate-400" />
                )}
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                  {tile.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}