"use client";

import React, {createContext, useContext, useRef, useState, useCallback, useEffect} from "react";

// Types for our context
interface AudioContextType {
    stopMusic: () => void;
    playEffect: (effect: AudioEffect) => void;
    isMusicPlaying: boolean;
    playAudioOnce: (url: string) => void;
    playAudioOnLoop: (url: string) => {stop: () => void};
}

export type AudioEffect = "victory" | "defeat" | "foundPage" | "message" | "startGame" | "notification" | "mine" | "eraser" | "back" | "backpack" | "gps";

// URLs or imports for audio files
const EFFECTS: Record<AudioEffect, string> = {
    victory: "/audio/victory.mp3",
    defeat: "/audio/defeat.mp3",
    foundPage: "/audio/foundPage.mp3",
    message: "/audio/message.mp3",
    startGame: "/audio/startGame.mp3",
    notification: "/audio/notification.mp3",
    mine: "/audio/mine.mp3",
    eraser: "/audio/eraser.mp3",
    back: "/audio/back.mp3",
    backpack: "/audio/backpack.mp3",
    gps: "/audio/gps.mp3",
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const musicRef = useRef<HTMLAudioElement | null>(null);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);

    // Stop background music
    const stopMusic = useCallback(() => {
        if (musicRef.current) {
            musicRef.current.pause();
            musicRef.current.currentTime = 0;
            setIsMusicPlaying(false);
        }
    }, []);

    // Play a sound effect (one-shot, not looped)
    const playEffect = useCallback((effect: AudioEffect) => {
        const url = EFFECTS[effect];
        const audio = new window.Audio(url);
        audio.play();
    }, []);

    // Generic: play any audio once
    const playAudioOnce = useCallback((url: string) => {
        const audio = new window.Audio(url);
        audio.play();
    }, []);

    // Generic: play any audio on loop, returns a stop handle
    const playAudioOnLoop = useCallback((url: string) => {
        const audio = new window.Audio(url);
        audio.loop = true;
        audio.play();
        return {
            stop: () => {
                audio.pause();
                audio.currentTime = 0;
            },
        };
    }, []);

    // Stop music on unmount
    useEffect(() => {
        return () => {
            if (musicRef.current) {
                musicRef.current.pause();
                musicRef.current = null;
            }
        };
    }, []);

    return <AudioContext.Provider value={{stopMusic, playEffect, isMusicPlaying, playAudioOnce, playAudioOnLoop}}>{children}</AudioContext.Provider>;
};

// Custom hook for easier usage
export function useAudio() {
    const ctx = useContext(AudioContext);
    if (!ctx) throw new Error("useAudio must be used within an AudioProvider");
    return ctx;
}
