import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageProgressBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
    setProgress(0);

    const t1 = setTimeout(() => setProgress(60), 40);
    const t2 = setTimeout(() => setProgress(85), 300);
    const t3 = setTimeout(() => setProgress(100), 700);
    const t4 = setTimeout(() => setOpacity(0), 900);
    const t5 = setTimeout(() => setProgress(0), 1100);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [location.key]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div
        style={{
          height: '3px',
          width: `${progress}%`,
          opacity,
          transition: progress === 0
            ? 'none'
            : progress === 100
              ? 'width 200ms ease-out, opacity 200ms ease'
              : 'width 600ms cubic-bezier(0.4,0,0.2,1)',
          background: 'linear-gradient(to right, #7c3aed, #a78bfa, #7c3aed)',
          boxShadow: '0 0 10px rgba(124,58,237,0.55), 0 0 4px rgba(124,58,237,0.4)',
        }}
      />
    </div>
  );
}
