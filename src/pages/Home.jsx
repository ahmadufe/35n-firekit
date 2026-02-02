import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_695a45a00c41aebc946dc291/dcce5d331_VenturesBlack.png)',
        backgroundColor: '#000',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-7xl font-light text-white tracking-tight mb-6">
          Welcome to <span className="text-orange-500 font-semibold">Fire</span><span className="font-semibold">Kit</span> by 35N
        </h1>
        
        <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-light">
          Practical insights, frameworks & tools for leaders, builders, innovators and dreamers building great things
        </p>
        
        <Link to={createPageUrl('Dashboard')}>
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-slate-200 text-lg px-12 py-6 h-auto font-semibold"
          >
            Explore
          </Button>
        </Link>
      </div>
    </div>
  );
}