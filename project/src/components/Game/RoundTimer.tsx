import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface RoundTimerProps {
  startTime: number;
  duration: number;
  onComplete: () => void;
}

export function RoundTimer({ startTime, duration, onComplete }: RoundTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        onComplete();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, duration, onComplete]);

  const seconds = Math.ceil(timeLeft / 1000);
  const progress = (timeLeft / duration) * 100;

  return (
    <div className="flex items-center gap-3 bg-black/30 rounded-lg p-3">
      <Clock className="w-5 h-5 text-blue-400" />
      <div className="flex-1">
        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <span className="text-blue-200 min-w-[3ch] text-center">
        {seconds}s
      </span>
    </div>
  );
}