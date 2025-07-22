import { useRef } from "react";

const useSoundManager = () => {
  const sounds = useRef({});

  const playSound = (key, src, loop = false) => {
    if (!sounds.current[key]) {
      const audio = new Audio(src);
      audio.loop = loop;
      sounds.current[key] = audio;
    }

    const sound = sounds.current[key];
    sound.currentTime = 0;
    sound.play().catch((e) => console.warn("Autoplay failed:", e));
  };

  const stopSound = (key) => {
    const sound = sounds.current[key];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  };

  return { playSound, stopSound };
};

export default useSoundManager;
