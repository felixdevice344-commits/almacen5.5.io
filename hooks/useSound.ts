import { useCallback } from 'react';

export const useSound = () => {
  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error("Audio error", e);
    }
  }, []);

  const playClick = useCallback(() => playTone(1200, 'sine', 0.05, 0.05), [playTone]);
  const playSuccess = useCallback(() => {
    playTone(800, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(1200, 'square', 0.1, 0.1), 100);
  }, [playTone]);
  const playError = useCallback(() => playTone(150, 'sawtooth', 0.4, 0.2), [playTone]);
  const playAlert = useCallback(() => {
    playTone(800, 'sawtooth', 0.1, 0.3);
    setTimeout(() => playTone(600, 'sawtooth', 0.1, 0.3), 150);
  }, [playTone]);

  return { playClick, playSuccess, playError, playAlert };
};