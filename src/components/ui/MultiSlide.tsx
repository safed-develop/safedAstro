import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

interface SlideItem {
  imgSrc?: string;
  title: string;
  review?: string;
  background?: string;
}

interface Props {
  slides: SlideItem[];
  slidesPerView?: number;
  spaceBetween?: number;
  className?: string;
  slideHeight?: string;
}

export default function MultiSlide({
  slides,
  slidesPerView = 4,
  spaceBetween = 30,
  className = '',
  slideHeight = '200px',
}: Props) {
  return (
    <Swiper
      modules={[FreeMode, Autoplay]}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      freeMode
      grabCursor
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      breakpoints={{
        0: { slidesPerView: 1.5, spaceBetween: 15 },
        640: { slidesPerView: 2.5, spaceBetween: 20 },
        1024: { slidesPerView: slidesPerView, spaceBetween },
      }}
      className={className}
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div
            style={{
              height: slideHeight,
              background: slide.background || '#f4f4f4',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              textAlign: 'center',
            }}
          >
            {slide.imgSrc && (
              <img
                src={slide.imgSrc}
                alt={slide.title}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  background: '#fff',
                  padding: '8px',
                }}
              />
            )}
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{slide.title}</h3>
            {slide.review && (
              <p style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: 1.5,
                wordBreak: 'keep-all',
                margin: 0,
              }}>
                {slide.review}
              </p>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
