import { useState, useEffect, useCallback } from 'react';

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

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval]);

  return (
    <div>
      {/* Cards grid - show 2 at a time on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {testimonials.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                background: isActive ? '#fff' : '#f9fafb',
                borderRadius: '16px',
                padding: '20px',
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
            onClick={() => setActive(i)}
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
