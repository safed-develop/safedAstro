import { useState, useEffect, useRef } from 'react';

interface PinItem {
  tag: string;
  tagKo?: string;
  headline: string;
  desc: string;
  stat: string;
  statLabel: string;
  image?: string;
}

interface Props {
  items: PinItem[];
}

export default function PinScrollSection({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = itemRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6, rootMargin: '-20% 0px -20% 0px' }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / total));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={sectionRef} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: '0', maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        {/* Sticky left side */}
        <div style={{
          flex: '0 0 45%', position: 'sticky', top: '120px', height: 'fit-content',
          paddingRight: '3rem',
        }}
        className="hidden lg:block"
        >
          <p style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-english)', marginBottom: '1rem' }}>
            Why SafeD?
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-1px', color: '#111', marginBottom: '1rem' }}>
            도입하지 않으면,<br />
            <span style={{ background: 'linear-gradient(135deg, #007BFF, #00c6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              당신의 현장이 위험합니다.
            </span>
          </h2>
          <p style={{ color: '#374151', lineHeight: 1.7, fontSize: '15px', marginBottom: '1rem', fontWeight: 500 }}>
            서류로 때우는 안전관리, 형식적인 위험성평가,<br />
            소통 안 되는 외국인 근로자.<br />
            <strong style={{ color: '#111' }}>사고는 예고 없이 찾아옵니다.</strong>
          </p>
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px',
            padding: '12px 16px', marginBottom: '2rem',
          }}>
            <p style={{ color: '#991b1b', fontSize: '13px', fontWeight: 600, lineHeight: 1.6 }}>
              2024년 건설업 사망사고 <strong>401건</strong> · 중대재해처벌법 위반 시 <strong>징역 1년+</strong>
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', height: '2px', background: '#e5e7eb', borderRadius: '1px', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <div style={{
              width: `${((activeIndex + 1) / items.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #007BFF, #00c6ff)',
              borderRadius: '1px',
              transition: 'width 0.5s ease',
            }} />
          </div>

          {/* Progress indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  itemRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '8px 0', textAlign: 'left',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{
                  width: '3px', height: i === activeIndex ? '32px' : '16px',
                  borderRadius: '2px',
                  background: i === activeIndex ? '#007BFF' : '#e5e7eb',
                  transition: 'all 0.3s',
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{
                    fontSize: '13px', fontWeight: i === activeIndex ? 700 : 400,
                    color: i === activeIndex ? '#111' : '#9ca3af',
                    transition: 'all 0.3s',
                  }}>
                    {item.tagKo || item.tag}
                  </span>
                  <span style={{
                    fontSize: '10px', fontWeight: 500,
                    color: i === activeIndex ? '#007BFF' : '#d1d5db',
                    fontFamily: 'var(--font-english)',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase' as const,
                    transition: 'all 0.3s',
                  }}>
                    {item.tag}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable right side */}
        <div style={{ flex: 1 }}>
          {/* Mobile title */}
          <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-english)', marginBottom: '0.75rem' }}>
              Why SafeD?
            </p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-1px' }}>
              도입하지 않으면,{' '}
              <span style={{ background: 'linear-gradient(135deg, #007BFF, #00c6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                당신의 현장이 위험합니다.
              </span>
            </h2>
          </div>

          {items.map((item, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              style={{
                minHeight: '50vh',
                display: 'flex',
                alignItems: 'center',
                padding: '2rem 0',
              }}
            >
              <div style={{
                width: '100%',
                background: i === activeIndex ? '#fff' : '#f9fafb',
                borderRadius: '24px',
                overflow: 'hidden',
                border: i === activeIndex ? '2px solid rgba(0,123,255,0.15)' : '1px solid #e5e7eb',
                boxShadow: i === activeIndex ? '0 12px 48px rgba(0,123,255,0.1)' : 'none',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: i === activeIndex ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)',
                opacity: i === activeIndex ? 1 : 0.7,
              }}>
                {/* Image area */}
                {item.image && (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <img
                      src={item.image}
                      alt={item.tag}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.8s ease',
                        transform: i === activeIndex ? 'scale(1.05)' : 'scale(1)',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.9) 90%, #fff 100%)',
                    }} />
                    {/* Floating stat badge on image */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(10px)',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '6px',
                      transition: 'all 0.5s ease',
                      transform: i === activeIndex ? 'translateY(0)' : 'translateY(-10px)',
                      opacity: i === activeIndex ? 1 : 0,
                    }}>
                      <span style={{
                        fontSize: '1.3rem', fontWeight: 800,
                        background: 'linear-gradient(135deg, #007BFF, #00c6ff)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        fontFamily: 'var(--font-english)',
                      }}>
                        {item.stat}
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                        {item.statLabel}
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: '#007BFF', boxShadow: '0 0 8px rgba(0,123,255,0.4)',
                      transition: 'all 0.3s',
                      transform: i === activeIndex ? 'scale(1.5)' : 'scale(1)',
                    }} />
                    <span style={{
                      fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px',
                      textTransform: 'uppercase', color: '#007BFF',
                      fontFamily: 'var(--font-english)',
                    }}>
                      {item.tag}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', fontWeight: 800,
                    lineHeight: 1.3, letterSpacing: '-0.5px', marginBottom: '0.75rem', color: '#111',
                    whiteSpace: 'pre-line',
                  }}>
                    {item.headline}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '480px' }}>
                    {item.desc}
                  </p>

                  {/* Stat badge (shown only when no image) */}
                  {!item.image && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'baseline', gap: '8px',
                      background: 'linear-gradient(135deg, rgba(0,123,255,0.05), rgba(0,198,255,0.05))',
                      padding: '12px 20px', borderRadius: '12px',
                      border: '1px solid rgba(0,123,255,0.1)',
                    }}>
                      <span style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800,
                        background: 'linear-gradient(135deg, #007BFF, #00c6ff)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        fontFamily: 'var(--font-english)',
                      }}>
                        {item.stat}
                      </span>
                      <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
                        {item.statLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
