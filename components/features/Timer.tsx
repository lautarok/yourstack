"use client";

import { useEffect, useRef, useState } from "react";

interface TimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

export default function Timer({ durationMinutes, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    const startTime = Date.now();

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft <= 300;
  const isCritical = timeLeft <= 60;

  return (
    <div
      className={`w-fit h-fit font-mono text-xl font-semibold ${
        isCritical
          ? "text-red-700"
          : isWarning
            ? "text-yellow-700"
            : "text-blue-700"
      }`}
    >
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
