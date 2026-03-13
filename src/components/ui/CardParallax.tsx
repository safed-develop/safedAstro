import { useState, useRef, type MouseEvent } from 'react';

interface Props {
  image: string;
  title: string;
  description?: string;
}

export default function CardParallax({ image, title, description }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(600px) rotateY(0deg) rotateX(0deg)');
  const [bgTransform, setBgTransform] = useState('translateX(0px) translateY(0px)');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    const bgX = ((x - centerX) / centerX) * -15;
    const bgY = ((y - centerY) / centerY) * -15;

    setTransform(`perspective(600px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale3d(1.03, 1.03, 1.03)`);
    setBgTransform(`translateX(${bgX}px) translateY(${bgY}px) scale(1.1)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(600px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)');
    setBgTransform('translateX(0px) translateY(0px) scale(1)');
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transform,
        transition: 'transform 0.12s ease-out',
        height: '320px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-20px',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: bgTransform,
          transition: 'transform 0.12s ease-out',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isHovered
            ? 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 100%)',
          transition: 'background 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '1.5rem',
          color: '#fff',
        }}
      >
        <h3 style={{
          fontSize: '20px',
          fontWeight: 700,
          marginBottom: description ? '0.5rem' : 0,
          letterSpacing: '-0.5px',
        }}>
          {title}
        </h3>
        {description && (
          <p style={{
            fontSize: '14px',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            lineHeight: 1.5,
            wordBreak: 'keep-all',
          }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
