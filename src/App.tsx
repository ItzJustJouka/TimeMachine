import { useEffect, useRef, useState } from 'react'
import './App.css'
import Globe from './components/Globe'
import { HackBar } from './components/Hackbar'
import LaunchButton from './components/LaunchButton'
import Loader from './components/Loader'
import PulsingSphere from './components/PulsingSphere'
import HotQuail from './components/HotQuail'
import TimeInterface from './components/TimeInterface'

function App() {
  const bar = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [destYear, setDestYear] = useState<number | null>(null);
  const [isTimeTraveling, setIsTimeTraveling] = useState(false);
  const quail = useRef<HTMLDivElement | null>(null);
  const timeTravelInterval = useRef<NodeJS.Timeout | null>(null);

  // Function to validate if a year is reasonable
  const isValidYear = (year: number): boolean => {
    return year >= 1 && year <= 9999;
  };

  // Time travel function that gradually changes currentYear to destYear over 4 seconds
  const executeTimeTravel = (currentYear: number, destYear: number) => {
    if (!isValidYear(destYear) || (currentYear == destYear)) {
      console.warn('Invalid destination year:', destYear);
      return;
    }

    setIsVisible(true);

    if (currentYear === destYear) {
      return; // Already at destination
    }

    setIsTimeTraveling(true);
    
    // Clear any existing interval
    if (timeTravelInterval.current) {
      clearInterval(timeTravelInterval.current);
    }

    const duration = 4500; // 4 seconds in milliseconds
    const yearDifference = Math.abs(destYear - currentYear);
    const direction = destYear > currentYear ? 1 : -1;
    
    const startTime = Date.now();
    let lastYear = currentYear;
    
    // Ease-in-out cubic function
    const easeInOutCubic = (t: number, intensity: number = 0.7): number => {
      const power = 3 * intensity; // Controls how "sharp" the curve is
      return t < 0.5 
        ? Math.pow(2, power - 1) * Math.pow(t, power)
        : 1 - Math.pow(-2 * t + 2, power) / Math.pow(2, power - 1);
    };
    
    timeTravelInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1); // 0 to 1
      
      // Apply ease-in-out curve
      const easedProgress = easeInOutCubic(progress);
      
      // Calculate target year based on eased progress
      const targetYear = Math.round(currentYear + (yearDifference * easedProgress * direction));
      
      // Only update if the year has changed to avoid redundant state updates
      if (targetYear !== lastYear) {
        setCurrentYear(targetYear);
        lastYear = targetYear;
      }
      
      // Check if we've reached the destination or time is up
      if (progress >= 1 || targetYear === destYear) {
        setCurrentYear(destYear); // Ensure we end exactly at destination
        setTimeout(() => {
          clearInterval(timeTravelInterval.current!);
          timeTravelInterval.current = null;
          setIsTimeTraveling(false);
          setIsVisible(false);
        }, 500);
      }
    }, 16); // ~60fps for smooth animation
  };

  useEffect(() => {
    // Cleanup interval on unmount
    return () => {
      if (timeTravelInterval.current) {
        clearInterval(timeTravelInterval.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        height: '100vh',
        width: '100vw',
        position: 'relative',
      }}
    >
      {/* Left column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          opacity: 0.5,
        }}
      >
        {/* Globe - top half, positioned towards top-left */}
        <div 
          style={{
            height: '50%', 
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Globe />
        </div>
        {/* Loader - bottom half, positioned towards bottom-left */}
        <div 
          style={{
            height: '50%', 
            width: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
          }}
        >
          <Loader />
        </div>
      </div>

      {/* Middle column */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        {/* HotQuail and PulsingSphere - absolutely positioned in center */}
        <div
          id="hot__quail"
          style={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: -1,
          }}
        >
          <HotQuail ref={quail} isVisible={isVisible} />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
          }}
        >
          <PulsingSphere />
        </div>
        
        {/* Time Interface and Launch Button at bottom center */}
        <div style={{ margin: '40px 0', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'space-between', gap: '20px', height: "100%" }}>
          <TimeInterface 
            currentYear={currentYear} 
            destYear={destYear} 
            setCurrentYear={setCurrentYear} 
            setDestYear={setDestYear}
            onTimeTravel={executeTimeTravel}
            isTimeTraveling={isTimeTraveling}
          />
          <LaunchButton currentYear={currentYear} destYear={destYear} />
        </div>
      </div>

      {/* Right column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* 45% empty space at top */}
        <div style={{ height: '45%' }} />
        
        {/* Process Monitor - takes remaining space, positioned towards right edge */}
        <div
          style={{
            height: '55%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            paddingTop: '20px',
            paddingRight: '20px',
          }}
        >
          <HackBar ref={bar} title="PROCESS MONITOR" showChrome={false} />
        </div>
      </div>
    </div>
  );
}

export default App;
