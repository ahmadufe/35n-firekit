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
      fileUrl: "https://drive.google.com/file/d/1MEU8PUuL6OcTdtgZXbSo7IS82y0aTBG7/view?usp=sharing",
      thumbnail: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695a4c3829d04b83a5c959f0/5abd5639f_The5ArchetypesofDigitalOnboarding.png"
    },
    {
      id: 2,
      title: "3 Metric Types to Assess the Benefits of Digital Onboarding",
      fileUrl: "https://drive.google.com/file/d/1yrpQ8zg8QDPFHND6BDTWSk48zJBGuI4o/view?usp=sharing",
      thumbnail: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695a4c3829d04b83a5c959f0/69bff9bf3_3MetricTypestoAssesstheBenefitsofDigitalOnboarding.png"
    },
    {
      id: 3,
      title: "4 Steps to Calculate the ROI of Digital Onboarding",
      fileUrl: "https://drive.google.com/file/d/1fHibTiWvuswJHDLdNoZ7x8A6lHn1Et5W/view?usp=sharing",
      thumbnail: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695a4c3829d04b83a5c959f0/f315381e2_4StepstoCalculatetheROIofDigitalOnboarding.png"
    },
    {
      id: 4,
      title: "14 Best Practices to Design & Build Stellar Digital Onboarding",
      fileUrl: "https://drive.google.com/file/d/1MwzYLHWAO40_AiFiZwy1dsIvsw136lqr/view?usp=sharing",
      thumbnail: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695a4c3829d04b83a5c959f0/b5cc588d9_14BestPracticestoDesignBuildStellarDigitalOnboarding.png"
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
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
          {tiles.map((tile) => (
            <a
              key={tile.id}
              href={tile.fileUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`group bg-white rounded-2xl border-2 border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                !tile.fileUrl ? 'cursor-not-allowed opacity-60' : 'hover:border-slate-300'
              }`}
              onClick={(e) => {
                if (!tile.fileUrl) {
                  e.preventDefault();
                }
              }}
            >
              {/* Thumbnail */}
              <div className="aspect-[4/5] bg-slate-100 flex items-center justify-center overflow-hidden">
                {tile.thumbnail ? (
                  <img 
                    src={tile.thumbnail} 
                    alt={tile.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <FileText className="h-16 w-16 text-slate-400" />
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}