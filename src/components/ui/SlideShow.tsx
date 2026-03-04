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
}

interface Props {
  slides: Slide[];
  autoPlayInterval?: number;
}

export default function SlideShow({ slides, autoPlayInterval = 6000 }: Props) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgress = useCallback(() => {
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + (100 / (autoPlayInterval / 30))));
    }, 30);
  }, [autoPlayInterval]);

  const goTo = useCallback((index: number, dir: number = 1) => {
    setDirection(dir);
    setCurrent(index);
    startProgress();
  }, [startProgress]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 1);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, -1);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    startProgress();
    intervalRef.current = setInterval(() => {
      setCurrent((c) => {
        const nextIdx = (c + 1) % slides.length;
        setDirection(1);
        return nextIdx;
      });
      startProgress();
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [autoPlayInterval, slides.length, startProgress]);

  // Ken Burns animation variants - alternating zoom directions
  const kenBurnsVariants = [
    { initial: { scale: 1.15, x: '-3%' }, animate: { scale: 1, x: '3%' } },
    { initial: { scale: 1.2, x: '3%' }, animate: { scale: 1.05, x: '-2%' } },
    { initial: { scale: 1.1, y: '-3%' }, animate: { scale: 1.2, y: '2%' } },
  ];

  const slide = slides[current];
  const kb = kenBurnsVariants[current % kenBurnsVariants.length];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {/* Background with Ken Burns */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0, ...kb.initial }}
          animate={{ opacity: 1, ...kb.animate }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{
            opacity: { duration: 1, ease: 'easeInOut' },
            scale: { duration: autoPlayInterval / 1000, ease: 'linear' },
            x: { duration: autoPlayInterval / 1000, ease: 'linear' },
            y: { duration: autoPlayInterval / 1000, ease: 'linear' },
          }}
          style={{
            position: 'absolute',
            inset: '-5%',
            width: '110%',
            height: '110%',
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.5) 100%)',
        zIndex: 1,
      }} />

      {/* Bottom gradient for better readability */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 clamp(2rem, 8vw, 10rem)',
        maxWidth: '900px',
      }}>
        <AnimatePresence mode="wait">
          <motion.div key={`content-${current}`}>
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span style={{
                display: 'inline-block',
                padding: '6px 16px',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'var(--font-english)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.08)',
              }}>
                {slide.tag}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-2px',
                color: '#fff',
                marginBottom: '1.25rem',
                wordBreak: 'keep-all',
              }}
            >
              {slide.title.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < slide.title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{
                fontSize: 'clamp(0.95rem, 1.5vw, 1.2rem)',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.7,
                wordBreak: 'keep-all',
                maxWidth: '600px',
              }}
            >
              {slide.subtitle}
            </motion.p>

            {/* Highlights */}
            {slide.highlights && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1.5rem' }}
              >
                {slide.highlights.map((h, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '6px 14px',
                      background: 'rgba(0,123,255,0.2)',
                      border: '1px solid rgba(0,123,255,0.4)',
                      borderRadius: '8px',
                      color: '#a4d8ff',
                      fontSize: '13px',
                      fontWeight: 500,
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {h}
                  </span>
                ))}
              </motion.div>
            )}

            {/* CTA Button */}
            {slide.link && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                style={{ marginTop: '2rem' }}
              >
                <a
                  href={slide.link}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 32px',
                    background: '#007BFF',
                    borderRadius: '50px',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 20px rgba(0,123,255,0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0060B7';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 30px rgba(0,123,255,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#007BFF';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,123,255,0.4)';
                  }}
                >
                  {slide.linkText || '자세히 보기'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicator - Right side vertical */}
      <div style={{
        position: 'absolute',
        right: 'clamp(1.5rem, 4vw, 4rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 3,
      }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`슬라이드 ${i + 1}`}
            style={{
              width: i === current ? '4px' : '4px',
              height: i === current ? '40px' : '20px',
              borderRadius: '4px',
              background: i === current ? '#007BFF' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Bottom Navigation Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 3,
      }}>
        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '3px',
          background: 'rgba(255,255,255,0.1)',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #007BFF, #00c6ff)',
            transition: 'width 0.03s linear',
          }} />
        </div>

        {/* Bottom info bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px clamp(2rem, 8vw, 10rem)',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
        }}>
          {/* Arrows + Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={prev}
              aria-label="이전 슬라이드"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <span style={{
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'var(--font-english)',
              fontWeight: 600,
              letterSpacing: '2px',
            }}>
              {String(current + 1).padStart(2, '0')}
              <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 6px' }}>/</span>
              {String(slides.length).padStart(2, '0')}
            </span>
            <button
              onClick={next}
              aria-label="다음 슬라이드"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Slide mini titles */}
          <div style={{
            display: 'flex',
            gap: '24px',
          }}>
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: i === current ? '#fff' : 'rgba(255,255,255,0.35)',
                  fontSize: '13px',
                  fontWeight: i === current ? 600 : 400,
                  cursor: 'pointer',
                  padding: '4px 0',
                  borderBottom: i === current ? '2px solid #007BFF' : '2px solid transparent',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: 'var(--font-english)', letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
          <rect x="1" y="1" width="14" height="22" rx="7" />
          <motion.circle
            cx="8"
            cy="8"
            r="2"
            fill="rgba(255,255,255,0.6)"
            animate={{ cy: [6, 14, 6] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
