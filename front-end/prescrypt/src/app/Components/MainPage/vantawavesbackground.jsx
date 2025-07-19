// "use client";
// import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import WAVES from "vanta/dist/vanta.waves.min";

// export default function VantaWavesBackground() {
//   const vantaRef = useRef(null);
//   const [vantaEffect, setVantaEffect] = useState(null);

//   useEffect(() => {
//     if (!vantaEffect) {
//       setVantaEffect(
//         WAVES({
//           el: vantaRef.current,
//           THREE: THREE,
//           mouseControls: false,
//           touchControls: false,
//           gyroControls: false,
//           color: 0x008080, // teal
//           shininess: 10,
//           waveHeight: 10,
//           waveSpeed: 0.3,
//           zoom: 1.0,
//           backgroundColor: 0xffffff, // white background
//         })
//       );
//     }

//     return () => {
//       if (vantaEffect) vantaEffect.destroy();
//     };
//   }, [vantaEffect]);

//   return (
//     <div
//       ref={vantaRef}
//       className="absolute top-0 left-0 w-full h-full z-0 opacity-20"
//     ></div>
//   );
// }
