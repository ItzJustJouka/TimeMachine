import React, { forwardRef } from "react";
import styled from "styled-components";

interface HotQuailProps {
    isVisible: boolean
}

const HotQuail = forwardRef<HTMLDivElement, HotQuailProps>((props: HotQuailProps, ref) => {
  const aros = Array.from({ length: 15 }, (_, i) => { return (
    <div key={i} style={{ animationDelay: `-${i * 0.07}s`, inset: `${i * 15}px` }} className="aro" />
  )});

  return (
    <StyledWrapper ref={ref} style={{display: props.isVisible ? "block" : "none"}}>
      <aside className="hotQuail">
        {aros}
      </aside>
    </StyledWrapper>
  );
});

const StyledWrapper = styled.div`
  .hotQuail {
    width: 450px;
    height: 450px;
    position: relative;
    transform-style: preserve-3d;
    transform: perspective(1000px) rotateX(60deg);

    .aro {
      position: absolute;
      inset: 0;
      box-shadow: inset 0 0 80px #ff08;
      clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
      animation: up_and_down 1s infinite ease-in-out both;
    }
  }

  @keyframes up_and_down {
    0%,
    100% {
      transform: translateZ(-200px) rotate(0deg);
    }
    50% {
      transform: translateZ(200px) rotate(90deg);
    }
  }`;

export default HotQuail;