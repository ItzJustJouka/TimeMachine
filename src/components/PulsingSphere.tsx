import styled from 'styled-components';

const PulsingSphere = () => {
  return (
    <StyledWrapper>
      <div style={{ position: 'absolute', left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
        <ul id="sphere">
          <li className="pulse"></li>
          <li className="pulse"></li>
          <li className="pulse"></li>
          <li className="pulse"></li>
          <li className="pulse"></li>
          <li className="pulse"></li>
          <li className="pulse"></li>
          <li className="pulse"></li>
          <li className="pulse"></li>
          <li className="pulse"></li>
          <li className="pulse"></li>
          <li className="pulse"></li>
          <li className="pulse"></li>
          <li className="pulse"></li>
          <li className="pulse"></li>
        </ul>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
#sphere {
  bottom: -50%;
  list-style-type: none;
  height: 65vw;
  width: 65vw;
  opacity: 0.15;
  z-index: -1;
  margin: 0 auto;
  padding: 0;
  border-radius: 50%;
  perspective: 300px;
//   animation: turn 4s infinite ease-in-out;
}

#sphere .pulse {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  border: 3px solid #FFF;
  animation: grow 4s infinite ease-in-out;
}

#sphere .pulse:nth-child(1) {
  animation-delay: 0.4s;
}

#sphere .pulse:nth-child(2) {
  animation-delay: 0.8s;
}

#sphere .pulse:nth-child(3) {
  animation-delay: 1.2s;
}

#sphere .pulse:nth-child(4) {
  animation-delay: 1.6s;
}

#sphere .pulse:nth-child(5) {
  animation-delay: 2s;
}

#sphere .pulse:nth-child(6) {
  animation-delay: 2.4s;
}

#sphere .pulse:nth-child(7) {
  animation-delay: 2.8s;
}

#sphere .pulse:nth-child(8) {
  animation-delay: 3.2s;
}

#sphere .pulse:nth-child(9) {
  animation-delay: 3.6s;
}

#sphere .pulse:nth-child(10) {
  animation-delay: 4s;
}

#sphere .pulse:nth-child(11) {
  animation-delay: 4.4s;
}

#sphere .pulse:nth-child(12) {
  animation-delay: 4.8s;
}

#sphere .pulse:nth-child(13) {
  animation-delay: 5.2s;
}

#sphere .pulse:nth-child(14) {
  animation-delay: 5.6s;
}

#sphere .pulse:nth-child(15) {
  animation-delay: 6s;
}

@keyframes grow {
  0% {
    transform: scale(0);
  }
  30% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0;
    transform: scale(1);
  }

@keyframes grow {
	0% {
		transform: scale(0);
	}
	30% {
		opacity: 0;
	}
	50% {
		opacity: 1;
	}
	75% {
		opacity: 0;
		transform: scale(1);
	}
}

@keyframes turn {
	40% {
		transform: scale(0.85);
	}
	60% {
		transform: rotateY(20deg);
	}
	90% {
		transform: rotateY(-20deg);
	}
}`;

export default PulsingSphere;
