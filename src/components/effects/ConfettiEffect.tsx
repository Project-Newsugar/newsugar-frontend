import { useState, useEffect } from 'react';

interface ConfettiEffectProps {
  isActive: boolean;
  duration?: number; // 효과 지속 시간 (ms)
}

export default function ConfettiEffect({ isActive, duration = 3000 }: ConfettiEffectProps) {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [confetti] = useState(() =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 2 + Math.random() * 3,
      animationDelay: Math.random() * 0.5,
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][Math.floor(Math.random() * 5)],
      rotation: Math.random() * 360
    }))
  );

  useEffect(() => {
    if (isActive) {
      setShow(true);
      setFadeOut(false);

      // duration - 1000ms 전에 페이드아웃 시작
      const fadeOutTimer = setTimeout(() => {
        setFadeOut(true);
      }, duration - 1000);

      // duration 후에 완전히 숨김
      const hideTimer = setTimeout(() => {
        setShow(false);
        setFadeOut(false);
      }, duration);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isActive, duration]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-50 transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="absolute w-2 h-3 animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDuration: `${piece.animationDuration}s`,
            animationDelay: `${piece.animationDelay}s`,
            transform: `rotate(${piece.rotation}deg)`
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti-fall {
          animation: confetti-fall ease-in infinite;
        }
      `}</style>
    </div>
  );
}
