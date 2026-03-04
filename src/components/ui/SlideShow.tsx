import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  highlights?: string[];
  link?: string;
  linkText?: string;
  featureImage?: string;
}

interface Props {
  slides: Slide[];
  autoPlayInterval?: number;
  height?: string;
}

export default function SlideShow({ slides, autoPlayInterval = 6000, height = '75vh' }: Props) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgress = useCallback(() => {
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + (100 / (autoPlayInterval / 30))));
    }, 30);
  }, [autoPlayInterval]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    startProgress();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
      startProgress();
    }, autoPlayInterval);
  }, [startProgress, autoPlayInterval, slides.length]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, slides.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, slides.length, goTo]);

  useEffect(() => {
    startProgress();
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
      startProgress();
    }, autoPlayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const kenBurns = [
    { initial: { scale: 1.15, x: '-2%' }, animate: { scale: 1.02, x: '2%' } },
    { initial: { scale: 1.2, x: '2%' }, animate: { scale: 1.05, x: '-1%' } },
    { initial: { scale: 1.1, y: '-2%' }, animate: { scale: 1.18, y: '1%' } },
  ];

  const slide = slides[current];
  const kb = kenBurns[current % kenBurns.length];

  return (
    <div style={{ position: 'relative', width: '100%', height, minHeight: '500px', overflow: 'hidden', background: '#000', borderRadius: '0 0 24px 24px' }}>
      {/* Background with Ken Burns */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0, ...kb.initial }}
          animate={{ opacity: 1, ...kb.animate }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{
            opacity: { duration: 0.8, ease: 'easeInOut' },
            scale: { duration: autoPlayInterval / 1000, ease: 'linear' },
            x: { duration: autoPlayInterval / 1000, ease: 'linear' },
            y: { duration: autoPlayInterval / 1000, ease: 'linear' },
          }}
          style={{
            position: 'absolute', inset: '-5%', width: '110%', height: '110%',
            backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>

      {/* Overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,10,30,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,20,60,0.6) 100%)', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', zIndex: 1 }} />

      {/* Decorative grid lines */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={{ padding: '0 clamp(2rem, 8vw, 10rem)', maxWidth: '100%', width: '100%', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Left text area */}
          <div style={{ flex: '0 1 55%', minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div key={`c-${current}`}>
              {/* Tag badge */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '7px 18px', border: '1px solid rgba(0,123,255,0.5)', borderRadius: '50px',
                  color: '#a4d8ff', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-english)',
                  letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1.25rem',
                  background: 'rgba(0,123,255,0.1)', backdropFilter: 'blur(10px)',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#007BFF', boxShadow: '0 0 8px #007BFF' }} />
                  {slide.tag}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-1.5px', color: '#fff', marginBottom: '1rem', wordBreak: 'keep-all' }}
              >
                {slide.title.split('\n').map((line, i) => (
                  <span key={i}>{line}{i < slide.title.split('\n').length - 1 && <br />}</span>
                ))}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, wordBreak: 'keep-all', maxWidth: '560px' }}
              >
                {slide.subtitle}
              </motion.p>

              {/* Highlights */}
              {slide.highlights && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.65 }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1.25rem' }}
                >
                  {slide.highlights.map((h, i) => (
                    <span key={i} style={{
                      padding: '5px 12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 500,
                    }}>
                      {h}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* CTA + secondary link */}
              <motion.div
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '1.75rem', flexWrap: 'wrap' }}
              >
                {slide.link && (
                  <a href={slide.link} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px',
                    background: '#007BFF', borderRadius: '50px', color: '#fff', fontSize: '14px', fontWeight: 600,
                    textDecoration: 'none', transition: 'all 0.3s', boxShadow: '0 4px 20px rgba(0,123,255,0.35)',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#0060B7'; e.currentTarget.style.boxShadow = '0 6px 30px rgba(0,123,255,0.5)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#007BFF'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,123,255,0.35)'; }}
                  >
                    {slide.linkText || '자세히 보기'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </a>
                )}
                <a href="/inquiries" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 24px',
                  border: '1px solid rgba(255,255,255,0.25)', borderRadius: '50px', color: '#fff', fontSize: '14px', fontWeight: 500,
                  textDecoration: 'none', transition: 'all 0.3s', background: 'rgba(255,255,255,0.05)',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  무료 상담받기
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          </div>

          {/* Right feature image */}
          {slide.featureImage && (
            <div className="hidden lg:block" style={{ flex: '0 1 40%', position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`feat-${current}`}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: 'relative' }}
                >
                  {/* Glow behind image */}
                  <div style={{
                    position: 'absolute', inset: '-10%',
                    background: 'radial-gradient(circle, rgba(0,123,255,0.15) 0%, transparent 70%)',
                    filter: 'blur(30px)',
                  }} />
                  <img
                    src={slide.featureImage}
                    alt=""
                    style={{
                      position: 'relative',
                      width: '100%',
                      maxHeight: '380px',
                      objectFit: 'contain',
                      borderRadius: '16px',
                      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
                    }}
                  />
                  {/* Floating badge */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    style={{
                      position: 'absolute', bottom: '-12px', left: '-12px',
                      background: 'rgba(0,123,255,0.9)', backdropFilter: 'blur(10px)',
                      padding: '8px 16px', borderRadius: '12px',
                      color: '#fff', fontSize: '12px', fontWeight: 600,
                      boxShadow: '0 4px 15px rgba(0,123,255,0.4)',
                    }}
                  >
                    SafeD Platform
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Right side dots */}
      <div style={{ position: 'absolute', right: 'clamp(1rem, 3vw, 3rem)', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 3 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`슬라이드 ${i + 1}`} style={{
            width: '4px', height: i === current ? '36px' : '16px', borderRadius: '4px', padding: 0,
            background: i === current ? '#007BFF' : 'rgba(255,255,255,0.25)', border: 'none', cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: i === current ? '0 0 10px rgba(0,123,255,0.5)' : 'none',
          }} />
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3 }}>
        {/* Segmented progress */}
        <div style={{ display: 'flex', gap: '3px', padding: '0 clamp(2rem, 8vw, 10rem)', marginBottom: '12px' }}>
          {slides.map((_, i) => (
            <div key={i} style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                background: 'linear-gradient(90deg, #007BFF, #00c6ff)',
                width: i < current ? '100%' : i === current ? `${progress}%` : '0%',
                transition: i === current ? 'width 0.03s linear' : 'width 0.3s ease',
              }} />
            </div>
          ))}
        </div>

        {/* Nav bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px clamp(2rem, 8vw, 10rem)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={prev} aria-label="이전" style={{
              width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <span style={{ color: '#fff', fontSize: '13px', fontFamily: 'var(--font-english)', fontWeight: 600, letterSpacing: '2px' }}>
              {String(current + 1).padStart(2, '0')}
              <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 4px' }}>/</span>
              {String(slides.length).padStart(2, '0')}
            </span>
            <button onClick={next} aria-label="다음" style={{
              width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Slide tab buttons */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {slides.map((s, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                background: i === current ? 'rgba(0,123,255,0.15)' : 'transparent',
                border: i === current ? '1px solid rgba(0,123,255,0.3)' : '1px solid transparent',
                borderRadius: '20px', padding: '5px 14px',
                color: i === current ? '#a4d8ff' : 'rgba(255,255,255,0.35)', fontSize: '12px',
                fontWeight: i === current ? 600 : 400, cursor: 'pointer', transition: 'all 0.3s', whiteSpace: 'nowrap',
              }}>
                {s.tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
