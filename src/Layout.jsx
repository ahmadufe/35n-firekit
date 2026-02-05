import React from 'react';

export default function Layout({ children, currentPageName }) {
  // Pages that should not show the logo (they have their own custom layouts)
  const pagesWithoutLogo = ['Home', 'Dashboard'];

  const shouldShowLogo = !pagesWithoutLogo.includes(currentPageName);

  return (
    <div className="min-h-screen">
      {shouldShowLogo && (
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_695a45a00c41aebc946dc291/dcce5d331_VenturesBlack.png"
            alt="35N Ventures"
            className="h-8 sm:h-10 object-contain"
          />
        </div>
      )}
      {children}
    </div>
  );
}