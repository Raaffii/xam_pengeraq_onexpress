import { useEffect, useState } from "react";

const MAX_DURATION = 15 * 60; // 15 menit

export default function CountDown({ startDateTime }) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!startDateTime) return;

    const startTime = new Date(startDateTime).getTime();

    const update = () => {
      const now = Date.now();
      const diffSeconds = Math.floor((now - startTime) / 1000);
      const left = MAX_DURATION - diffSeconds;

      setRemaining(left > 0 ? left : 0);
    };

    update();

    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [startDateTime]);

  if (remaining === null) return null;

  if (remaining === 0) {
    return (
      <p className='text-sm text-red-500 text-center'>QR Code has expired</p>
    );
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <p className='text-sm text-gray-600 text-center'>
      QR code expires in{" "}
      <span className='font-medium'>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </p>
  );
}
