import React, { useEffect, useRef, useState } from "react";
import ChronoSVG from "../../assets/Game/ChronoSVG";
import { useGameContext } from "../../context/GameContext";

export interface TimerProps {
    handleTimeOver: () => void;
}

const Timer: React.FC<TimerProps> = ({ handleTimeOver }) => {
    const intervalRef = useRef<NodeJS.Timeout>();
    const { remainingSeconds: contextSeconds, setRemainingSeconds } = useGameContext();
    const [seconds, setSeconds] = useState<number>(contextSeconds);

    useEffect(() => {
        setSeconds(contextSeconds);
    }, [contextSeconds]);

    useEffect(() => {
        if (seconds <= 0) return;

        intervalRef.current = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        setRemainingSeconds(seconds);

        if (seconds === 0) {
            handleTimeOver();
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [seconds, setRemainingSeconds, handleTimeOver]);

    if (seconds <= 0) return null;

    const minutesLeft = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    const formattedTime = `${minutesLeft}:${secondsLeft.toString().padStart(2, "0")}`;

    return (
        <div className="sticky top-0 left-0 m-4 p-3 bg-gray-800 text-white rounded-2xl flex items-center gap-3 border-2 border-blueSecondary ring-2 ring-blueSecondary shadow-lg shadow-blueSecondary/50">
            <ChronoSVG />
            <span className="text-lg tracking-wider">{formattedTime}</span>
        </div>
    );
};

export default Timer;
