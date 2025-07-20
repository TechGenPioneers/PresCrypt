import React, { useState, useEffect } from 'react';

const HealthcareAnimatedBackground = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Seeded random function for consistent results
  const seededRandom = (seed) => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Generate network points with seeded random for consistency
  const networkPoints = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: seededRandom(i * 10 + 1) * 100,
    y: seededRandom(i * 10 + 2) * 100,
    radius: seededRandom(i * 10 + 3) * 1.5 + 0.8,
    duration: seededRandom(i * 10 + 4) * 8 + 6,
    opacity: seededRandom(i * 10 + 5) * 0.6 + 0.3,
    delay: seededRandom(i * 10 + 6) * 3,
  }));

  // Generate floating healthcare icons with seeded random
  const healthcareIcons = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: seededRandom(i * 20 + 7) * 100,
    y: seededRandom(i * 20 + 8) * 100,
    duration: seededRandom(i * 20 + 9) * 20 + 15,
    delay: seededRandom(i * 20 + 10) * 8,
    type: i % 6,
    size: seededRandom(i * 20 + 11) * 0.5 + 0.3,
  }));

  // Generate DNA helix particles with seeded random
  const dnaParticles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: seededRandom(i * 30 + 12) * 100,
    y: seededRandom(i * 30 + 13) * 100,
    duration: seededRandom(i * 30 + 14) * 15 + 10,
    delay: seededRandom(i * 30 + 15) * 5,
  }));

  // Generate subtle pulse circles with seeded random
  const pulseCircles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: seededRandom(i * 40 + 16) * 100,
    y: seededRandom(i * 40 + 17) * 100,
    size: seededRandom(i * 40 + 18) * 60 + 40,
    duration: seededRandom(i * 40 + 19) * 8 + 5,
    delay: seededRandom(i * 40 + 20) * 4,
  }));

  const HealthcareIcon = ({ type, className, opacity = 0.3 }) => {
    const iconStyle = { opacity };
    
    switch (type) {
      case 0: // Stethoscope
        return (
          <svg className={className} style={iconStyle} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
          </svg>
        );
      case 1: // Medical Cross
        return (
          <svg className={className} style={iconStyle} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5 12c0 .28-.11.53-.29.71l-4.5 4.5c-.18.18-.43.29-.71.29s-.53-.11-.71-.29l-4.5-4.5c-.18-.18-.29-.43-.29-.71s.11-.53.29-.71l4.5-4.5c.18-.18.43-.29.71-.29s.53.11.71.29l4.5 4.5c.18.18.29.43.29.71z"/>
            <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/>
          </svg>
        );
      case 2: // Heart
        return (
          <svg className={className} style={iconStyle} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      case 3: // Pills
        return (
          <svg className={className} style={iconStyle} viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.22 11.29l6.36-6.36c.79-.79 2.07-.79 2.86 0l6.36 6.36c.79.79.79 2.07 0 2.86l-6.36 6.36c-.79.79-2.07.79-2.86 0l-6.36-6.36c-.79-.79-.79-2.07 0-2.86z"/>
            <path d="M15 9l-6 6"/>
          </svg>
        );
      case 4: // Microscope
        return (
          <svg className={className} style={iconStyle} viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5 12c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zM20 19.5c0 .28-.22.5-.5.5H4.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h15c.28 0 .5.22.5.5zm-8-16c0-.28-.22-.5-.5-.5s-.5.22-.5.5V5h-1c-.28 0-.5.22-.5.5S9.72 6 10 6h1v1.5c0 .28.22.5.5.5s.5-.22.5-.5V6h1c.28 0 .5-.22.5-.5S12.28 5 12 5h-1V3.5z"/>
          </svg>
        );
      case 5: // Medical Chart
        return (
          <svg className={className} style={iconStyle} viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 10h2v7H7v-7zm4-3h2v10h-2V7zm4 6h2v4h-2v-4z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const DNAHelix = ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 7c0 0 4-3 9 0s9 0 9 0"/>
      <path d="M3 12c0 0 4 3 9 0s9 0 9 0"/>
      <path d="M3 17c0 0 4-3 9 0s9 0 9 0"/>
      <circle cx="6" cy="7" r="1"/>
      <circle cx="18" cy="7" r="1"/>
      <circle cx="12" cy="12" r="1"/>
      <circle cx="6" cy="17" r="1"/>
      <circle cx="18" cy="17" r="1"/>
    </svg>
  );

  const HeartbeatLine = () => (
    <svg 
      className="absolute w-24 h-24 text-teal-100 opacity-10 animate-heartbeat" 
      style={{ top: '10%', left: '5%', animationDelay: '0s' }} 
      viewBox="0 0 100 20" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1"
    >
      <path d="M0 10 L20 10 L25 5 L30 15 L35 0 L40 20 L45 10 L80 10 L100 10" />
    </svg>
  );

  // Don't render animated content during SSR
  if (!isClient) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Enhanced Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-teal-50/80 to-teal-100/90"></div>
        
        {/* Radial gradients for depth */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-teal-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-radial from-teal-300/20 to-transparent rounded-full blur-3xl"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-teal-50/80 to-teal-100/90"></div>
      
      {/* Radial gradients for depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-teal-200/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-radial from-teal-300/20 to-transparent rounded-full blur-3xl"></div>

      {/* Entire Animation Container with Blur Effect */}
      <div className="absolute inset-0 blur-sm">
        {/* Advanced Network Lines and Nodes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          {/* Connection Lines */}
          {networkPoints.map((point) => (
            <React.Fragment key={point.id}>
              {networkPoints
                .filter((otherPoint) => {
                  const distance = Math.hypot(point.x - otherPoint.x, point.y - otherPoint.y);
                  return distance < 20 && distance > 0;
                })
                .map((otherPoint) => (
                  <line
                    key={`${point.id}-${otherPoint.id}`}
                    x1={point.x}
                    y1={point.y}
                    x2={otherPoint.x}
                    y2={otherPoint.y}
                    stroke={`rgba(20, 184, 166, ${point.opacity * 0.3})`}
                    strokeWidth="0.4"
                    className="animate-networkLine"
                    style={{ 
                      animationDuration: `${point.duration}s`,
                      animationDelay: `${point.delay}s`
                    }}
                  />
                ))}
              
              {/* Network Nodes */}
              <circle
                cx={point.x}
                cy={point.y}
                r={point.radius}
                fill={`rgba(20, 184, 166, ${point.opacity})`}
                className="animate-networkPulse"
                style={{ 
                  animationDuration: `${point.duration}s`,
                  animationDelay: `${point.delay}s`
                }}
              />
              
              {/* Node Glow Effect */}
              <circle
                cx={point.x}
                cy={point.y}
                r={point.radius * 2}
                fill={`rgba(20, 184, 166, ${point.opacity * 0.2})`}
                className="animate-networkGlow"
                style={{ 
                  animationDuration: `${point.duration * 1.5}s`,
                  animationDelay: `${point.delay}s`
                }}
              />
            </React.Fragment>
          ))}
        </svg>

        {/* Floating Healthcare Icons */}
        <div className="absolute inset-0">
          {healthcareIcons.map((icon) => (
            <div
              key={icon.id}
              className="absolute"
              style={{
                left: `${icon.x}%`,
                top: `${icon.y}%`,
                animation: `healthcareFloat ${icon.duration}s ease-in-out infinite`,
                animationDelay: `${icon.delay}s`,
                transform: `scale(${icon.size})`,
              }}
            >
              <HealthcareIcon
                type={icon.type}
                className="w-6 h-6 md:w-8 md:h-8 text-teal-500"
                opacity={0.25}
              />
            </div>
          ))}
        </div>

        {/* DNA Helix Elements */}
        <div className="absolute inset-0">
          {dnaParticles.map((dna) => (
            <div
              key={dna.id}
              className="absolute"
              style={{
                left: `${dna.x}%`,
                top: `${dna.y}%`,
                animation: `dnaRotate ${dna.duration}s linear infinite`,
                animationDelay: `${dna.delay}s`,
              }}
            >
              <DNAHelix
                className="w-8 h-8 text-teal-600"
                style={{ opacity: 0.15 }}
              />
            </div>
          ))}
        </div>

        {/* Pulse Circles */}
        <div className="absolute inset-0">
          {pulseCircles.map((circle) => (
            <div
              key={circle.id}
              className="absolute rounded-full bg-gradient-radial from-teal-100/10 to-transparent animate-subtlePulse"
              style={{
                left: `${circle.x}%`,
                top: `${circle.y}%`,
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                transform: 'translate(-50%, -50%)',
                animationDuration: `${circle.duration}s`,
                animationDelay: `${circle.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Animated Medical Elements */}
        <HeartbeatLine />
        
        {/* Floating Medical Symbols */}
        <div className="absolute top-1/3 right-1/5 w-12 h-12 text-teal-500 opacity-15 animate-slowSpin">
          <HealthcareIcon type={0} className="w-full h-full" opacity={0.15} />
        </div>
        
        <div className="absolute bottom-1/4 left-1/6 w-10 h-10 text-teal-600 opacity-20 animate-gentleBob">
          <HealthcareIcon type={2} className="w-full h-full" opacity={0.2} />
        </div>

        {/* Geometric Patterns */}
        <svg className="absolute top-1/2 left-1/2 w-32 h-32 text-teal-400 opacity-10 animate-slowRotate" style={{ transform: 'translate(-50%, -50%)' }} viewBox="0 0 100 100">
          <polygon points="50,15 90,85 10,85" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes networkPulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.6; 
          }
          50% { 
            transform: scale(1.4); 
            opacity: 0.9; 
          }
        }

        @keyframes networkGlow {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.1; 
          }
          50% { 
            transform: scale(1.8); 
            opacity: 0.3; 
          }
        }

        @keyframes networkLine {
          0%, 100% { 
            stroke-opacity: 0.2; 
          }
          50% { 
            stroke-opacity: 0.6; 
          }
        }

        @keyframes healthcareFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
          }
          25% { 
            transform: translateY(-25px) translateX(20px) rotate(5deg); 
          }
          50% { 
            transform: translateY(-10px) translateX(-15px) rotate(-3deg); 
          }
          75% { 
            transform: translateY(-20px) translateX(-25px) rotate(2deg); 
          }
        }

        @keyframes dnaRotate {
          0% { 
            transform: rotate(0deg) scale(1); 
          }
          50% { 
            transform: rotate(180deg) scale(1.1); 
          }
          100% { 
            transform: rotate(360deg) scale(1); 
          }
        }

        @keyframes subtlePulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 0.1; 
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.2); 
            opacity: 0.3; 
          }
        }

        @keyframes heartbeat {
          0%, 100% { 
            transform: scale(1); 
          }
          25% { 
            transform: scale(1.1); 
          }
          50% { 
            transform: scale(1.05); 
          }
          75% { 
            transform: scale(1.15); 
          }
        }

        @keyframes slowSpin {
          0% { 
            transform: rotate(0deg); 
          }
          100% { 
            transform: rotate(360deg); 
          }
        }

        @keyframes gentleBob {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }

        @keyframes slowRotate {
          0% { 
            transform: translate(-50%, -50%) rotate(0deg); 
          }
          100% { 
            transform: translate(-50%, -50%) rotate(360deg); 
          }
        }

        .animate-networkPulse {
          animation: networkPulse 6s ease-in-out infinite;
        }

        .animate-networkGlow {
          animation: networkGlow 8s ease-in-out infinite;
        }

        .animate-networkLine {
          animation: networkLine 4s ease-in-out infinite;
        }

        .animate-subtlePulse {
          animation: subtlePulse 8s ease-in-out infinite;
        }

        .animate-heartbeat {
          animation: heartbeat 20s ease-in-out infinite;
        }

        .animate-slowSpin {
          animation: slowSpin 20s linear infinite;
        }

        .animate-gentleBob {
          animation: gentleBob 3s ease-in-out infinite;
        }

        .animate-slowRotate {
          animation: slowRotate 25s linear infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default HealthcareAnimatedBackground;