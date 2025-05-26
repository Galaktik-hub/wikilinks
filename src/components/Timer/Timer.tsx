import React, {useEffect, useRef, useState} from "react";
import ChronoSVG from "../../assets/Game/ChronoSVG";
import {useGameContext} from "../../context/GameContext";

export interface TimerProps {
    handleTimeOver: () => void;
}

const Timer: React.FC<TimerProps> = ({handleTimeOver}) => {
    const intervalRef = useRef<NodeJS.Timeout>();
    const {remainingSeconds: contextSeconds, setRemainingSeconds} = useGameContext();
    const [seconds, setSeconds] = useState<number>(contextSeconds);

    useEffect(() => {
        setSeconds(contextSeconds);
    }, [contextSeconds]);

    useEffect(() => {
        if (seconds <= 0) return;

        intervalRef.current = setInterval(() => {
            setSeconds(prev => prev - 1);
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
    }, [seconds, setRemainingSeconds]);

    if (seconds <= 0) return null;

    const minutesLeft = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    const formattedTime = `${minutesLeft}:${secondsLeft.toString().padStart(2, "0")}`;

    return (
        <div className="card-container sticky top-0 left-0 m-2 text-white flex items-center justify-between">
            <ChronoSVG />
            <span className="text-lg tracking-wider min-w-10">{formattedTime}</span>
        </div>
    );
};

export default Timer;
