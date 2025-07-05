"use client";

import { useEffect, useState } from "react";
import Dither from "@/components/assistant-ui/Dither";

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show loading screen for minimum 5 seconds
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      // Remove from DOM after fade out animation
      setTimeout(() => {
        setIsVisible(false);
      }, 800);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`loading-screen ${isFadingOut ? 'fade-out' : ''}`}
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 9999, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'transparent'
      }}
    >
      {/* Dither Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={false}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
      
      {/* Loading Content */}
      <div 
        className="loading-content"
        style={{ 
          position: 'relative', 
          zIndex: 1, 
          textAlign: 'center',
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        <div className="mb-6">
          <h1 
            style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              marginBottom: '1rem',
              fontFamily: 'EB Garamond, serif'
            }}
          >
            Chatloom
          </h1>
          <p 
            style={{ 
              fontSize: '1.1rem',
              opacity: 0.8,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Your AI Assistant
          </p>
        </div>
        
        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div 
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255,255,255,0.3)',
              borderTop: '3px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
        </div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
} 