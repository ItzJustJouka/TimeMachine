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
  const quail = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyH") {
        setIsVisible(v => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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
            zIndex: 10,
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
          <TimeInterface currentYear={currentYear} destYear={destYear} setCurrentYear={setCurrentYear} setDestYear={setDestYear} />
          <LaunchButton />
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
