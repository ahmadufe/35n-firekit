import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

Home.public = true;

export default function Home() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695a4c3829d04b83a5c959f0/00d47afc3_image.png)',
        backgroundColor: '#000',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>

      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695a4c3829d04b83a5c959f0/928d5846e_VenturesBlack.png"
          alt="35N Ventures"
          className="h-8 sm:h-10 object-contain" />

      </div>
      
      <div className="min-h-screen flex items-center px-6 sm:px-12 lg:px-20 py-20">
        <div className="relative z-10 max-w-3xl w-full">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-8 sm:mb-12 lg:mb-16 text-left">
            Welcome to <span className="text-orange-500">Fire</span>Kit
          </h1>
          
          <p className="text-base sm:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 font-light text-left">Practical insights, tools & frameworks for leaders, founders & innovators building great things

          </p>
          
          <Link to={createPageUrl('Dashboard')}>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-slate-200 text-lg sm:text-xl lg:text-2xl px-8 sm:px-10 py-3 sm:py-4 h-auto font-semibold rounded-full">

              Explore
            </Button>
          </Link>
        </div>
      </div>
    </div>);

}