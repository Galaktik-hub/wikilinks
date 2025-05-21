import React, {useEffect, useState} from "react";

export const Timer: React.FC = () => {
    // Get the target time (08:00 UTC)
    const getTargetTime = (): number => {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth();
        const day = now.getUTCDate();
        // Today at 08:00 UTC
        const todayAt8 = Date.UTC(year, month, day, 8, 0, 0);
        return now.getTime() < todayAt8 ? todayAt8 : todayAt8 + 24 * 60 * 60 * 1000; // demain 08:00 UTC
    };

    // Calculate remaining milliseconds
    const calculateTimeLeft = (): number => getTargetTime() - Date.now();

    const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft());

    useEffect(() => {
        const interval = setInterval(() => {
            const diff = calculateTimeLeft();
            if (diff <= 0) {
                clearInterval(interval);
                window.location.reload();
            } else {
                setTimeLeft(diff);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Formatte milliseconds to HH:MM:SS
    const formatHMS = (ms: number): string => {
        const totalSec = Math.floor(ms / 1000);
        const h = Math.floor(totalSec / 3600)
            .toString()
            .padStart(2, "0");
        const m = Math.floor((totalSec % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const s = (totalSec % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    return <div className="bg-white/20 px-3 md:px-4 py-2 rounded-full text-base md:text-lg">{formatHMS(timeLeft)}</div>;
};
