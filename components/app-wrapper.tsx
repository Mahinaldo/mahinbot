"use client";

import { useEffect, useState } from "react";
import { LoadingScreen } from "./loading-screen";

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated once component mounts
    setIsHydrated(true);
    
    // Function to check if all critical resources are loaded
    const checkResourcesLoaded = () => {
      // Check if fonts are loaded
      const fontsLoaded = document.fonts?.status === 'loaded' || 
                         document.fonts?.ready || 
                         true; // Fallback if fonts API not available
      
      // Check if images are loaded (if any critical ones exist)
      const imagesLoaded = true; // For now, assume images are loaded
      
      return fontsLoaded && imagesLoaded;
    };

    // Function to handle loading completion
    const handleLoad = () => {
      // Ensure minimum loading time of 5 seconds for smooth UX
      const minLoadingTime = 5000;
      const startTime = Date.now();
      
      const completeLoading = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoadingTime - elapsed);
        
        setTimeout(() => {
          setIsLoading(false);
        }, remaining);
      };

      // Always wait for minimum time, regardless of resource loading
      completeLoading();
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Show loading screen until everything is ready
  if (!isHydrated || isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
} 