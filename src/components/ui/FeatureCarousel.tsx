import { useState, useEffect, useRef, useCallback } from 'react';

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface Props {
  features: Feature[];
  interval?: number;
}

export default function FeatureCarousel({ features, interval = 4000 }: Props) {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % features.length);
    }, interval);
  }, [features.length, interval]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const goTo = useCallback((idx: number) => {
    setActive(idx);
    resetTimer();
  }, [resetTimer]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goTo((active + 1) % features.length);
      else goTo((active - 1 + features.length) % features.length);
    }
  };

  // Calculate position for each card relative to active
  const getOffset = (index: number) => {
    let diff = index - active;
    // Wrap around for circular
    if (diff > features.length / 2) diff -= features.length;
    if (diff < -features.length / 2) diff += features.length;
    return diff;
  };

  const cardWidth = isMobile ? 60 : 32; // % of viewport
  const gapPx = isMobile ? 8 : 16;

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      {/* Carousel track */}
      <div
        style={{
          position: 'relative',
          height: isMobile ? '280px' : '330px',
          perspective: '1200px',
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {features.map((item, i) => {
          const offset = getOffset(i);
          const absOffset = Math.abs(offset);

          // Only render nearby cards for performance
          if (absOffset > 3) return null;

          const isActive = offset === 0;
          const translateX = offset * (cardWidth + (isMobile ? 2 : 4));
          const scale = isActive ? 1 : Math.max(0.75, 1 - absOffset * 0.12);
          const opacity = isActive ? 1 : Math.max(0.12, 0.5 - absOffset * 0.2);
          const zIndex = 10 - absOffset;

          return (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${cardWidth}%`,
                transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale})`,
                opacity,
                zIndex,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: isActive ? 'default' : 'pointer',
                pointerEvents: absOffset > 2 ? 'none' : 'auto',
              }}
            >
              <div style={{
                background: '#fff',
                border: isActive ? '2px solid #2563EB' : '1px solid #E0E0E0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                height: isMobile ? '260px' : '300px',
                boxShadow: isActive
                  ? '0 16px 48px rgba(37,99,235,0.15), 0 4px 16px rgba(0,0,0,0.08)'
                  : '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                {/* Image area — edge-to-edge */}
                <div style={{
                  flex: isMobile ? '0 0 50%' : '0 0 44%',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <img
                    src={item.icon}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                </div>

                {/* Text area */}
                <div style={{
                  flex: 1,
                  padding: isMobile ? '0.6rem 0.75rem' : '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minWidth: 0,
                }}>
                  <span style={{
                    fontSize: isMobile ? '11px' : '13px',
                    fontWeight: 700,
                    color: '#2563EB',
                    letterSpacing: '0.05em',
                    fontFamily: 'var(--font-english)',
                    marginBottom: isMobile ? '0.15rem' : '0.3rem',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 style={{
                    fontSize: isMobile ? '1rem' : '1.3rem',
                    fontWeight: 700,
                    letterSpacing: '-0.3px',
                    color: '#111',
                    marginBottom: isMobile ? '0.3rem' : '0.5rem',
                    lineHeight: 1.25,
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: isMobile ? '0.75rem' : '0.95rem',
                    color: '#6B6B6B',
                    lineHeight: 1.6,
                    wordBreak: 'keep-all',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: isMobile ? 4 : 5,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? '12px' : '20px',
        marginTop: isMobile ? '0.5rem' : '1rem',
      }}>
        {/* Prev button */}
        <button
          onClick={() => goTo((active - 1 + features.length) % features.length)}
          aria-label="이전"
          style={{
            width: isMobile ? '28px' : '36px',
            height: isMobile ? '28px' : '36px',
            borderRadius: '50%',
            border: '1px solid #E0E0E0',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          <svg width={isMobile ? 12 : 16} height={isMobile ? 12 : 16} viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`기능 ${i + 1}`}
              style={{
                width: i === active ? (isMobile ? '18px' : '24px') : (isMobile ? '5px' : '6px'),
                height: isMobile ? '5px' : '6px',
                borderRadius: '3px',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background: i === active ? '#2563EB' : '#d1d5db',
                transition: 'all 0.35s ease',
              }}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => goTo((active + 1) % features.length)}
          aria-label="다음"
          style={{
            width: isMobile ? '28px' : '36px',
            height: isMobile ? '28px' : '36px',
            borderRadius: '50%',
            border: '1px solid #E0E0E0',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          <svg width={isMobile ? 12 : 16} height={isMobile ? 12 : 16} viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Counter */}
      <div style={{
        textAlign: 'center',
        marginTop: isMobile ? '0.3rem' : '0.5rem',
      }}>
        <span style={{
          fontSize: isMobile ? '11px' : '13px',
          fontFamily: 'var(--font-english)',
          fontWeight: 600,
          color: '#111',
          letterSpacing: '2px',
        }}>
          {String(active + 1).padStart(2, '0')}
          <span style={{ color: '#d1d5db', margin: '0 4px' }}>/</span>
          {String(features.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
