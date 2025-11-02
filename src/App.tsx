import { useEffect, useRef, useState } from 'react'
import './App.css'
import Globe from './components/Globe'
import { HackBar } from './components/Hackbar'
import LaunchButton from './components/LaunchButton'
import Loader from './components/Loader'
import PulsingSphere from './components/PulsingSphere'
import HotQuail from './components/HotQuail'

function App() {
  const bar = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
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
      }}
    >
      {/* Left column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 0.5,
        }}
      >
        <div style={{height: '50%', width: '100%'}}><Loader /></div>
        <div style={{height: '50%', width: '100%'}}><Globe /></div>
      </div>

      {/* Middle column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <PulsingSphere />
        <LaunchButton />
      </div>

      {/* Right column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <HotQuail ref={quail} isVisible={isVisible} />
        <HackBar ref={bar} title="PROCESS MONITOR" showChrome={false} />
      </div>
    </div>
  );
}

export default App;
