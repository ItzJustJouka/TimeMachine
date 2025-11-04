import styled from "styled-components";

interface TimeInterfaceProps {
  currentYear: number,
  destYear: number | null
  setCurrentYear: (year: number) => void,
  setDestYear: (year: number | null) => void,
}

const TimeInterface = (props: TimeInterfaceProps) => {
  function handleDestYearChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!/^\d{0,4}$/.test(value)) {
      return;
    }

    const year = value ? parseInt(value, 10) : null;
    props.setDestYear(year);

  }
  return (
    <StyledWrapper>
      <div className="time-interface">
        {/* Current Year Display */}
        <div className="year-display">
          <div className="year-label">ANNO CORRENTE</div>
          <div className="year-value">{props.currentYear}</div>
          <div className="year-indicator">
            <div className="indicator-dot" />
            <div className="indicator-pulse" />
          </div>
        </div>

        {/* Target Year Input */}
        <div className="year-input">
          <div className="input-label">INSERIRE DESTINAZIONE</div>
          <div className="input-container">
            <input 
              type="text" 
              placeholder="YYYY" 
              className="year-field"
              style={{fontWeight: "bold", fontSize: "2rem"}}
              maxLength={4}
              defaultValue={props.destYear ?? ''}
              onChange={handleDestYearChange}
            />
            {/* <div className="input-scan-line" /> */}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .time-interface {
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin-bottom: 20px;
    align-items: center;
  }

  .year-display, .year-input {
    position: relative;
    background: rgba(10, 10, 30, 0.7);
    border: 1px solid rgba(0, 221, 255, 0.3);
    border-radius: 4px;
    padding: 20px 30px;
    min-width: 250px;
    width: 300px;
    backdrop-filter: blur(10px);
    overflow: hidden;
  }

  .year-display::before, .year-input::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(0, 221, 255, 0.1) 0%,
      transparent 50%,
      rgba(255, 0, 222, 0.1) 100%
    );
    opacity: 0;
    animation: container-glow 4s infinite alternate;
    pointer-events: none;
  }

  @keyframes container-glow {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.3;
    }
  }

  .year-label, .input-label {
    font-size: 1rem;
    color: rgba(0, 221, 255, 0.8);
    letter-spacing: 2px;
    margin-bottom: 16px;
    text-shadow: 0 0 5px rgba(0, 221, 255, 0.5);
    font-family: "Orbitron", monospace;
    text-align: center;
  }

  .year-value {
    font-size: 3rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 700;
    font-family: "Orbitron", monospace;
    text-align: center;
    text-shadow: 0 0 10px rgba(0, 221, 255, 0.6);
    position: relative;
    z-index: 2;
  }

  .year-indicator {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 12px;
    height: 12px;
  }

  .indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(0, 221, 255, 0.8);
    box-shadow: 0 0 10px rgba(0, 221, 255, 0.6);
    animation: dot-pulse 2s infinite;
  }

  .indicator-pulse {
    position: absolute;
    top: -2px;
    left: -2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid rgba(0, 221, 255, 0.4);
    animation: pulse-ring 2s infinite;
  }

  @keyframes dot-pulse {
    0%, 100% {
      opacity: 0.8;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  @keyframes pulse-ring {
    0% {
      transform: scale(1);
      opacity: 0.4;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  .input-container {
    position: relative;
    z-index: 2;
  }

  .year-field {
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 221, 255, 0.5);
    border-radius: 2px;
    padding: 12px 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 22px;
    font-family: "Orbitron", monospace;
    text-align: center;
    outline: none;
    transition: all 0.3s ease;
    text-shadow: 0 0 5px rgba(0, 221, 255, 0.3);
  }

  .year-field::placeholder {
    color: rgba(0, 221, 255, 0.4);
    text-shadow: none;
  }

  .year-field:focus {
    border-color: rgba(0, 221, 255, 0.8);
    box-shadow: 0 0 15px rgba(0, 221, 255, 0.4);
    text-shadow: 0 0 8px rgba(0, 221, 255, 0.6);
  }

  .year-field:focus + .input-scan-line {
    animation: input-scan 2s infinite;
  }

  .input-scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 221, 255, 0.8) 50%,
      transparent 100%
    );
    opacity: 0;
    transform: translateY(-1px);
  }

  @keyframes input-scan {
    0% {
      opacity: 0;
      transform: translateX(-100%) translateY(-1px);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateX(100%) translateY(-1px);
    }
  }

  @keyframes border-shimmer {
    0%, 100% {
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Corner decorations */
  .year-display::after, .year-input::after {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    width: 10px;
    height: 10px;
    border-top: 2px solid rgba(0, 221, 255, 0.6);
    border-left: 2px solid rgba(0, 221, 255, 0.6);
    animation: corner-glow 3s infinite alternate;
  }

  @keyframes corner-glow {
    0% {
      border-color: rgba(0, 221, 255, 0.6);
    }
    100% {
      border-color: rgba(255, 0, 222, 0.6);
    }
  }

  /* Data streams */
  .year-display {
    overflow: hidden;
  }

  .year-display::before {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 221, 255, 0.1) 20%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 0, 222, 0.1) 80%,
      transparent 100%
    );
    animation: data-stream 8s infinite linear;
  }

  @keyframes data-stream {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    10% {
      opacity: 0.3;
    }
    90% {
      opacity: 0.3;
    }
    100% {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;

export default TimeInterface;