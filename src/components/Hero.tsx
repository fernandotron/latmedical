import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Award, ShieldCheck, Activity, ArrowRight } from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: string) => void;
}

interface Slide {
  id: number;
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  highlightText: string;
  subtitle: string;
  buttonText: string;
  buttonAction: string;
  image: string;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      badge: 'Distribuidor Oficial Exclusivo',
      badgeIcon: <Award size={14} color="var(--accent-green)" />,
      title: 'Hilos PDO & Hilos Tensores ',
      highlightText: 'V Lift Pro',
      subtitle: 'La gama más completa de monofilamentos, espiculados y conos moldeados con tecnología Painless para lifting biológico no quirúrgico.',
      buttonText: 'Comprar Hilos PDO',
      buttonAction: 'products',
      image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 2,
      badge: 'Medicina Regenerativa Autóloga',
      badgeIcon: <Activity size={14} color="var(--accent-green)" />,
      title: 'Terapia de Microinjerto Celular ',
      highlightText: 'Seffiline',
      subtitle: 'Dispositivos médicos estériles y patentados para recolección de tejido adiposo superficial rico en células madre ADSCs. Soluciones SEFFILLER®, SEFFIHAIR® y SEFFIGYN®.',
      buttonText: 'Ver Kits Seffiline',
      buttonAction: 'products',
      image: '/seffiline-biology-bg.png'
    },
    {
      id: 3,
      badge: 'Garantía y Habilitación ANMAT',
      badgeIcon: <ShieldCheck size={14} color="var(--accent-green)" />,
      title: 'Excelencia y Soporte Técnico en ',
      highlightText: 'Toda Argentina',
      subtitle: 'Garantizamos la legitimidad y trazabilidad de cada insumo importado. Provisión exclusiva para profesionales de la salud matriculados.',
      buttonText: 'Contactar un Asesor',
      buttonAction: 'contact',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleCtaClick = (action: string) => {
    setActiveTab(action);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (action === 'products') {
      setTimeout(() => {
        const element = document.getElementById('catalog-section');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <section style={{
      position: 'relative',
      height: '75vh',
      minHeight: '550px',
      marginTop: 'var(--header-height)',
      overflow: 'hidden',
      background: 'var(--primary-dark)'
    }}>
      {/* Slides Container */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: idx === currentSlide ? 1 : 0,
            visibility: idx === currentSlide ? 'visible' : 'hidden',
            transition: 'opacity 0.8s ease, visibility 0.8s ease',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {/* Background Image with Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(17, 24, 39, 0.9) 0%, rgba(17, 24, 39, 0.7) 50%, rgba(17, 24, 39, 0.4) 100%)',
            zIndex: 2
          }} />

          {/* Slide Content */}
          <div className="container" style={{
            position: 'relative',
            zIndex: 3,
            color: 'var(--text-white)',
            maxWidth: '850px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            textAlign: 'left'
          }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(41, 192, 147, 0.3)',
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              marginBottom: '1.5rem',
              animation: idx === currentSlide ? 'slideUp 0.6s ease' : 'none'
            }}>
              {slide.badgeIcon}
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--text-white)'
              }}>{slide.badge}</span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
              lineHeight: 1.15,
              fontWeight: 700,
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              animation: idx === currentSlide ? 'slideUp 0.8s ease' : 'none'
            }}>
              {slide.title}
              <span className="text-gradient-accent" style={{ display: 'block', marginTop: '0.2rem' }}>
                {slide.highlightText}
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '2.5rem',
              lineHeight: 1.6,
              maxWidth: '650px',
              animation: idx === currentSlide ? 'slideUp 1s ease' : 'none'
            }}>
              {slide.subtitle}
            </p>

            {/* CTA Button */}
            <button
              onClick={() => handleCtaClick(slide.buttonAction)}
              className="btn-primary"
              style={{
                fontSize: '0.9rem',
                padding: '0.8rem 2.2rem',
                animation: idx === currentSlide ? 'slideUp 1.2s ease' : 'none'
              }}
            >
              {slide.buttonText} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        style={{
          position: 'absolute',
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-green)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-green)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div style={{
        position: 'absolute',
        bottom: '25px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.75rem',
        zIndex: 10
      }}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: idx === currentSlide ? 'var(--accent-green)' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              padding: 0
            }}
          />
        ))}
      </div>
    </section>
  );
};
