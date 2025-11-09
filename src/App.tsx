import { useEffect, useRef, useState } from 'react'
import './App.css'
import Globe from './components/Globe'
import { HackBar } from './components/Hackbar'
import LaunchButton from './components/LaunchButton'
import Loader from './components/Loader'
import PulsingSphere from './components/PulsingSphere'
import HotQuail from './components/HotQuail'
import TimeInterface from './components/TimeInterface'
import timeSfx from './assets/timemachine.mp3';

function App() {
  const bar = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [destYear, setDestYear] = useState<number | null>(null);
  const [isTimeTraveling, setIsTimeTraveling] = useState(false);
  const quail = useRef<HTMLDivElement | null>(null);
  const timeTravelInterval = useRef<NodeJS.Timeout | null>(null);

  const [isFading, setIsFading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(timeSfx);
    audioRef.current.preload = 'auto';
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const playTimeSfx = async () => {
  if (!audioRef.current) return;
  try {
    // reset if it was playing
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    await audioRef.current.play(); // returns a promise
  } catch (err) {
    // Ignore NotAllowedError if user hasn't interacted yet
    console.warn('Audio play blocked or failed:', err);
  }
};


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

    playTimeSfx();
    
    // Clear any existing interval
    if (timeTravelInterval.current) {
      clearInterval(timeTravelInterval.current);
    }

    const duration = 4500; // 4 seconds in milliseconds
    const lastSecondThreshold = 800; // ms before end to start fading
    const yearDifference = Math.abs(destYear - currentYear);
    const direction = destYear > currentYear ? 1 : -1;
    
    const startTime = Date.now();
    let lastYear = currentYear;
    setIsFading(false); // reset
    
    // Ease-in-out cubic function
    const easeInOutCubic = (t: number, intensity: number = 0.7): number => {
      const power = 3 * intensity; // Controls how "sharp" the curve is
      return t < 0.5 
        ? Math.pow(2, power - 1) * Math.pow(t, power)
        : 1 - Math.pow(-2 * t + 2, power) / Math.pow(2, power - 1);
    };
    
    timeTravelInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(duration - elapsed, 0);
      const progress = Math.min(elapsed / duration, 1);

      if (!isFading && remaining <= lastSecondThreshold) {
        setIsFading(true);
      }
      
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
          setIsFading(false);
          setDestYear(null);
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
      }}
    >
      {/* Left column */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: '1fr 1fr',
          height: '100%',
          opacity: 1,
        }}
      >
        {/* Globe - top half, positioned towards top-left */}
        <Globe />

        {/* Loader - bottom half, positioned towards bottom-left */}
        <div style={{ display: "flex", alignItems: 'center'}}>
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
            zIndex: 10,
          }}
          className={isFading ? 'fade-out' : ''}
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
            opacity: isVisible ? 1 : 0,
          }}
          className={isFading ? 'fade-out' : ''}
        >
          <PulsingSphere />
        </div>
        <div style={{position: 'absolute', top: '20px', left: '50%', width: "100%", transform: 'translate(-50%, 0)', zIndex: 1}}>

          <TimeInterface 
            currentYear={currentYear} 
            destYear={destYear} 
            setCurrentYear={setCurrentYear} 
            setDestYear={setDestYear}
            onTimeTravel={executeTimeTravel}
            isTimeTraveling={isTimeTraveling}
            />
          </div>
        
        {/* Launch Button at bottom center */}
          <LaunchButton currentYear={currentYear} destYear={destYear} isTraveling={isTimeTraveling} />
      </div>

      {/* Right column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          height: '100vh',
        }}
      >
        {/* 45% empty space at top */}
        <div style={{height: '45%'}}></div>
        
        {/* Process Monitor - takes remaining space, positioned towards right edge */}
        <div
          style={{
            height: '40%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
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
