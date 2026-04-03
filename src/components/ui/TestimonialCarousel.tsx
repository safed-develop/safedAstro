import { useState, useEffect, useCallback, useRef } from 'react';

interface Testimonial {
  title: string;
  review: string;
  iconPath: string;
  color: string;
}

interface Props {
  testimonials: Testimonial[];
  interval?: number;
}

export default function TestimonialCarousel({ testimonials, interval = 4000 }: Props) {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSlide, setMobileSlide] = useState(0);
  const touchStartX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalPages = Math.ceil(testimonials.length / 2);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  // Auto-advance: desktop highlights, mobile slides
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (isMobile) {
        setMobileSlide((p) => (p + 1) % totalPages);
      } else {
        next();
      }
    }, interval);
  }, [isMobile, totalPages, next, interval]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const goSlide = useCallback((idx: number) => {
    setMobileSlide(idx);
    resetTimer();
  }, [resetTimer]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goSlide(Math.min(mobileSlide + 1, totalPages - 1));
      else goSlide(Math.max(mobileSlide - 1, 0));
    }
  };

  /* ==================== MOBILE ==================== */
  if (isMobile) {
    return (
      <div>
        <div
          style={{ overflow: 'hidden' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div style={{
            display: 'flex',
            transform: `translateX(-${mobileSlide * 100}%)`,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {Array.from({ length: totalPages }).map((_, pageIdx) => {
              const pageItems = testimonials.slice(pageIdx * 2, pageIdx * 2 + 2);
              return (
                <div key={pageIdx} style={{
                  display: 'flex', gap: '6px', width: '100%', flexShrink: 0,
                }}>
                  {pageItems.map((item, idx) => {
                    const gi = pageIdx * 2 + idx;
                    const isActive = gi === active;
                    return (
                      <button
                        key={gi}
                        onClick={() => { setActive(gi); resetTimer(); }}
                        style={{
                          flex: 1, minWidth: 0,
                          background: isActive ? '#fff' : '#f9fafb',
                          borderRadius: '0',
                          padding: '10px',
                          border: isActive ? '2px solid var(--color-primary)' : '1px solid #e5e7eb',
                          boxShadow: isActive ? '0 2px 12px rgba(0,123,255,0.1)' : 'none',
                          transition: 'all 0.3s ease',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <div style={{
                            width: '24px', height: '24px', borderRadius: '6px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: `${item.color}12`, flexShrink: 0,
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5">
                              <path d={item.iconPath} />
                            </svg>
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '10px', margin: 0, lineHeight: 1.2 }}>{item.title}</p>
                            <div style={{ display: 'flex', gap: '1px', marginTop: '1px' }}>
                              {Array.from({ length: 5 }).map((_, j) => (
                                <svg key={j} width="7" height="7" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '9.5px', lineHeight: 1.45, margin: 0 }}>
                          &ldquo;{item.review}&rdquo;
                        </p>
                      </button>
                    );
                  })}
                  {pageItems.length === 1 && <div style={{ flex: 1 }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '10px' }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => goSlide(i)} aria-label={`페이지 ${i + 1}`} style={{
              width: i === mobileSlide ? '18px' : '5px', height: '5px',
              borderRadius: '3px', border: 'none', padding: 0, cursor: 'pointer',
              background: i === mobileSlide ? 'var(--color-primary)' : '#d1d5db',
              transition: 'all 0.35s ease',
            }} />
          ))}
        </div>
      </div>
    );
  }

  /* ==================== DESKTOP ==================== */
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        {testimonials.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              onClick={() => { setActive(i); resetTimer(); }}
              style={{
                background: isActive ? '#fff' : '#f9fafb',
                borderRadius: '0',
                padding: '14px',
                border: isActive ? '2px solid var(--color-primary)' : '1px solid #e5e7eb',
                boxShadow: isActive ? '0 4px 20px rgba(0,123,255,0.12)' : 'none',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                cursor: 'pointer',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${item.color}12`, flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5">
                    <path d={item.iconPath} />
                  </svg>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '13px', margin: 0 }}>{item.title}</p>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                &ldquo;{item.review}&rdquo;
              </p>
            </button>
          );
        })}
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); resetTimer(); }}
            aria-label={`리뷰 ${i + 1}`}
            style={{
              width: i === active ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === active ? 'var(--color-primary)' : '#d1d5db',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
