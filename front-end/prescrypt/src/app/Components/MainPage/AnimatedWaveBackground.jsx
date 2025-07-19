// import React from 'react';

// const HealthcareAnimatedBackground = () => {
//   // Generate network points for lines
//   const networkPoints = Array.from({ length: 15 }, (_, i) => ({
//     id: i,
//     x: Math.random() * 100,
//     y: Math.random() * 100,
//     radius: Math.random() * 1.5 + 0.5, // Smaller radius
//     duration: Math.random() * 10 + 5,
//   }));

//   // Generate healthcare-themed particles
//   const healthcareParticles = Array.from({ length: 8 }, (_, i) => ({
//     id: i,
//     x: Math.random() * 100,
//     y: Math.random() * 100,
//     duration: Math.random() * 30 + 20,
//     delay: Math.random() * 15,
//     type: i % 4, // Different healthcare icons
//   }));

//   // Generate dropping hearts
//   const droppingHearts = Array.from({ length: 10 }, (_, i) => ({
//     id: i,
//     x: Math.random() * 100,
//     duration: Math.random() * 10 + 5,
//     delay: Math.random() * 5,
//   }));

//   const HealthcareIcon = ({ type, className }) => {
//     switch (type) {
//       case 0: // Stethoscope
//         return (
//           <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//             <path d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 4A8 8 0 0 1 20 12A8 8 0 0 1 12 20A8 8 0 0 1 4 12A8 8 0 0 1 12 4M11 6V12L16.2 16.2L17.6 14.8L13 10.2V6H11Z"/>
//           </svg>
//         );
//       case 1: // Cross
//         return (
//           <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//             <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
//           </svg>
//         );
//       case 2: // Heart
//         return (
//           <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//             <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"/>
//           </svg>
//         );
//       case 3: // Pill
//         return (
//           <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//             <path d="M17 8H7C5.9 8 5 8.9 5 10V14C5 15.1 5.9 16 7 16H17C18.1 16 19 15.1 19 14V10C19 8.9 18.1 8 17 8M17 14H7V10H17V14Z"/>
//           </svg>
//         );
//       default:
//         return null;
//     }
//   };

//   const HeartbeatLine = () => (
//     <svg className="absolute w-16 h-16 text-teal-500 opacity-30 animate-heartbeat" style={{ top: '10%', left: '20%', animationDelay: '0s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M3 12L6 9L9 12L12 9L15 12L18 9L21 12" />
//     </svg>
//   );

//   const AnimatedStethoscope = () => (
//     <svg className="absolute w-12 h-12 text-teal-500 opacity-30 animate-rotate" style={{ top: '30%', right: '10%', animationDelay: '2s' }} viewBox="0 0 24 24" fill="currentColor">
//       <path d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 4A8 8 0 0 1 20 12A8 8 0 0 1 12 20A8 8 0 0 1 4 12A8 8 0 0 1 12 4M11 6V12L16.2 16.2L17.6 14.8L13 10.2V6H11Z"/>
//     </svg>
//   );

//   const MedicalCross = () => (
//     <svg className="absolute w-10 h-10 text-teal-500 opacity-30 animate-pulse" style={{ top: '50%', left: '70%', animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor">
//       <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
//     </svg>
//   );

//   return (
//     <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
//       {/* Gradient Background (White to Teal) */}
//       <div className="absolute inset-0 bg-gradient-to-br from-white via-teal-50 to-teal-200 opacity-80"></div>

//       {/* Network Lines and Dots */}
//       <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
//         {networkPoints.map((point) => (
//           <React.Fragment key={point.id}>
//             <circle
//               cx={point.x}
//               cy={point.y}
//               r={point.radius}
//               fill="rgba(20, 184, 166, 0.6)" // Teal color
//               className="animate-pulse"
//               style={{ animationDuration: `${point.duration}s` }}
//             />
//             {networkPoints
//               .filter((otherPoint) => Math.hypot(point.x - otherPoint.x, point.y - otherPoint.y) < 20)
//               .map((otherPoint) => (
//                 <line
//                   key={`${point.id}-${otherPoint.id}`}
//                   x1={point.x}
//                   y1={point.y}
//                   x2={otherPoint.x}
//                   y2={otherPoint.y}
//                   stroke="rgba(20, 184, 166, 0.2)" // Teal color
//                   strokeWidth="0.5"
//                   className="animate-line"
//                 />
//               ))}
//           </React.Fragment>
//         ))}
//       </svg>

//       {/* Healthcare-themed Particles */}
//       <div className="absolute inset-0">
//         {healthcareParticles.map((particle) => (
//           <div
//             key={particle.id}
//             className="absolute opacity-30"
//             style={{
//               left: `${particle.x}%`,
//               top: `${particle.y}%`,
//               animation: `healthcareFloat ${particle.duration}s ease-in-out infinite`,
//               animationDelay: `${particle.delay}s`,
//             }}
//           >
//             <HealthcareIcon
//               type={particle.type}
//               className="w-6 h-6 md:w-8 md:h-8 text-teal-500"
//             />
//           </div>
//         ))}
//       </div>

//       {/* Dropping Hearts */}
//       <div className="absolute inset-0">
//         {droppingHearts.map((heart) => (
//           <div
//             key={heart.id}
//             className="absolute opacity-20"
//             style={{
//               left: `${heart.x}%`,
//               top: '-5%', // Start above the viewport
//               animation: `dropHeart ${heart.duration}s linear infinite`,
//               animationDelay: `${heart.delay}s`,
//             }}
//           >
//             <svg className="w-4 h-4 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"/>
//             </svg>
//           </div>
//         ))}
//       </div>

//       {/* Animated Health Vectors */}
//       <HeartbeatLine />
//       <AnimatedStethoscope />
//       <MedicalCross />

//       {/* Pulsing Circles (Smaller) */}
//       <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-teal-200 rounded-full opacity-15 animate-ping" style={{ animationDuration: '4s' }}></div>
//       <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-teal-300 rounded-full opacity-15 animate-ping" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
//       <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-teal-600 rounded-full opacity-15 animate-ping" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>

//       {/* CSS Keyframes */}
//       <style jsx>{`
//         @keyframes pulse {
//           0%, 100% { transfor500m: scale(1); }
//           50% { transform: scale(1.2); }
//         }

//         @keyframes line {
//           0%, 100% { stroke-opacity: 0.2; }
//           50% { stroke-opacity: 0.4; }
//         }

//         @keyframes healthcareFloat {
//           0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
//           25% { transform: translateY(-30px) translateX(20px) rotate(5deg); }
//           50% { transform: translateY(-10px) translateX(-10px) rotate(-3deg); }
//           75% { transform: translateY(-25px) translateX(-20px) rotate(2deg); }
//         }

//         @keyframes dropHeart {
//           0% { transform: translateY(-19%) rotate(0deg); }
//           100% { transform: translateY(110%) rotate(360deg); }
//         }

//         @keyframes heartbeat {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.1); }
//         }

//         @keyframes rotate {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         .animate-pulse {
//           animation: pulse 4s infinite;
//         }

//         .animate-line {
//           animation: line 4s infinite;
//         }

//         .animate-heartbeat {
//           animation: heartbeat 2s infinite;
//         }

//         .animate-rotate {
//           animation: rotate 10s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default HealthcareAnimatedBackground;
import React from 'react';

const HealthcareAnimatedBackground = () => {
  // Generate network points for circles and lines
  const networkPoints = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    radius: Math.random() * 2 + 0.5, // Varied small radius
    size: Math.random() * 5 + 2, // Varied circle size
    duration: Math.random() * 8 + 4, // Varied animation duration
    opacity: Math.random() * 0.4 + 0.2, // Varied opacity
  }));

  // Generate healthcare-themed particles
  const healthcareParticles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 25 + 15,
    delay: Math.random() * 10,
    type: i % 4, // Different healthcare icons
  }));

  // Generate dropping hearts
  const droppingHearts = Array.from({ length: 12 }, (_, i) => ({ // Increased number for more effect
    id: i,
    x: Math.random() * 100,
    duration: Math.random() * 12 + 6,
    delay: Math.random() * 3,
  }));

  const HealthcareIcon = ({ type, className }) => {
    switch (type) {
      case 0: // Stethoscope
        return (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 4A8 8 0 0 1 20 12A8 8 0 0 1 12 20A8 8 0 0 1 4 12A8 8 0 0 1 12 4M11 6V12L16.2 16.2L17.6 14.8L13 10.2V6H11Z"/>
          </svg>
        );
      case 1: // Cross
        return (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
          </svg>
        );
      case 2: // Heart
        return (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"/>
          </svg>
        );
      case 3: // Pill
        return (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 8H7C5.9 8 5 8.9 5 10V14C5 15.1 5.9 16 7 16H17C18.1 16 19 15.1 19 14V10C19 8.9 18.1 8 17 8M17 14H7V10H17V14Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const HeartbeatLine = () => (
    <svg className="absolute w-20 h-20 text-teal-500 opacity-30 animate-heartbeat" style={{ top: '15%', left: '25%', animationDelay: '0s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12L6 9L9 12L12 9L15 12L18 9L21 12" />
    </svg>
  );

  const AnimatedStethoscope = () => (
    <svg className="absolute w-16 h-16 text-teal-500 opacity-30 animate-rotate" style={{ top: '35%', right: '15%', animationDelay: '2s' }} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 4A8 8 0 0 1 20 12A8 8 0 0 1 12 20A8 8 0 0 1 4 12A8 8 0 0 1 12 4M11 6V12L16.2 16.2L17.6 14.8L13 10.2V6H11Z"/>
    </svg>
  );

  const MedicalCross = () => (
    <svg className="absolute w-12 h-12 text-teal-500 opacity-30 animate-pulse" style={{ top: '60%', left: '75%', animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient Background (White to Teal) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-teal-50 to-teal-300 opacity-90"></div>

      {/* Enhanced Network Circles and Lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {networkPoints.map((point) => (
          <React.Fragment key={point.id}>
            <circle
              cx={point.x}
              cy={point.y}
              r={point.radius}
              fill={`rgba(20, 184, 166, ${point.opacity})`} // Teal with varied opacity
              className="animate-pulse"
              style={{ animationDuration: `${point.duration}s`, transformOrigin: `${point.x}% ${point.y}%` }}
            />
            {networkPoints
              .filter((otherPoint) => Math.hypot(point.x - otherPoint.x, point.y - otherPoint.y) < 25) // Increased distance for more connections
              .map((otherPoint) => (
                <line
                  key={`${point.id}-${otherPoint.id}`}
                  x1={point.x}
                  y1={point.y}
                  x2={otherPoint.x}
                  y2={otherPoint.y}
                  stroke={`rgba(20, 184, 166, ${point.opacity * 0.5})`} // Lighter teal lines
                  strokeWidth={0.3}
                  className="animate-line"
                  style={{ animationDuration: `${point.duration}s` }}
                />
              ))}
          </React.Fragment>
        ))}
      </svg>

      {/* Healthcare-themed Particles */}
      <div className="absolute inset-0">
        {healthcareParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute opacity-40"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `healthcareFloat ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          >
            <HealthcareIcon
              type={particle.type}
              className="w-5 h-5 md:w-7 md:h-7 text-teal-500"
            />
          </div>
        ))}
      </div>

      {/* Dropping Hearts */}
      <div className="absolute inset-0">
        {droppingHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute opacity-25"
            style={{
              left: `${heart.x}%`,
              top: '-5%',
              animation: `dropHeart ${heart.duration}s linear infinite`,
              animationDelay: `${heart.delay}s`,
            }}
          >
            <svg className="w-3 h-3 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Animated Health Vectors */}
      <HeartbeatLine />
      <AnimatedStethoscope />
      <MedicalCross />

      {/* Pulsing Circles (Enhanced with varied sizes and positions) */}
      <div className="absolute top-20% left-10% w-12 h-12 bg-teal-200 rounded-full opacity-15 animate-ping" style={{ animationDuration: '3s' }}></div>
      <div className="absolute top-70% right-20% w-10 h-10 bg-teal-300 rounded-full opacity-15 animate-ping" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      <div className="absolute top-40% left-70% w-8 h-8 bg-teal-600 rounded-full opacity-15 animate-ping" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.3) rotate(10deg); }
        }

        @keyframes line {
          0%, 100% { stroke-opacity: 0.2; }
          50% { stroke-opacity: 0.6; }
        }

        @keyframes healthcareFloat {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(15px) rotate(5deg); }
          50% { transform: translateY(-10px) translateX(-10px) rotate(-3deg); }
          75% { transform: translateY(-15px) translateX(-15px) rotate(2deg); }
        }

        @keyframes dropHeart {
          0% { transform: translateY(-10%) rotate(0deg); }
          100% { transform: translateY(110%) rotate(360deg); }
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-pulse {
          animation: pulse 4s infinite;
        }

        .animate-line {
          animation: line 5s infinite;
        }

        .animate-heartbeat {
          animation: heartbeat 2s infinite;
        }

        .animate-rotate {
          animation: rotate 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HealthcareAnimatedBackground;