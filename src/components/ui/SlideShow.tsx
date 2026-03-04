import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  link?: string;
}

interface Props {
  slides: Slide[];
  autoPlayInterval?: number;
}

export default function SlideShow({ slides, autoPlayInterval = 5000 }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgress = () => {
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + (100 / (autoPlayInterval / 30));
      });
    }, 30);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startProgress();
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    startProgress();
    intervalRef.current = setInterval(nextSlide, autoPlayInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [currentSlide]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${slides[currentSlide].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`content-${currentSlide}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: 'clamp(2rem, 8vw, 8rem)',
            maxWidth: '700px',
            color: '#fff',
          }}
        >
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-1.5px',
            marginBottom: '1rem',
            wordBreak: 'keep-all',
          }}>
            {slides[currentSlide].title}
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            opacity: 0.85,
            lineHeight: 1.6,
            wordBreak: 'keep-all',
          }}>
            {slides[currentSlide].subtitle}
          </p>
          {slides[currentSlide].link && (
            <a
              href={slides[currentSlide].link}
              style={{
                marginTop: '2rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 2rem',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: '50px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                width: 'fit-content',
                transition: 'background 0.2s',
              }}
            >
              자세히 보기
            </a>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <div style={{
        position: 'absolute',
        bottom: '3rem',
        left: 'clamp(2rem, 8vw, 8rem)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        zIndex: 3,
      }}>
        <button
          onClick={prevSlide}
          aria-label="이전 슬라이드"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}
        >
          &#8249;
        </button>
        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'var(--font-english)' }}>
          {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
        <button
          onClick={nextSlide}
          aria-label="다음 슬라이드"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}
        >
          &#8250;
        </button>
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: 'rgba(255,255,255,0.15)',
        zIndex: 3,
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: '#007BFF',
          transition: 'width 0.03s linear',
        }} />
      </div>
    </div>
  );
}
