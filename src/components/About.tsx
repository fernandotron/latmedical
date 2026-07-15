import React from 'react';
import { ShieldCheck, Award, GraduationCap, ExternalLink } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      
      {/* 1. HERO HEADER BANNER */}
      <section style={{
        position: 'relative',
        height: '35vh',
        minHeight: '280px',
        marginTop: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--primary-dark)',
        overflow: 'hidden'
      }}>
        {/* Parallax style background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("/2020/2025/04/parallax-gris.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 1
        }} />
        {/* Dark emerald mesh gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(41, 192, 147, 0.2) 100%)',
          zIndex: 2
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 3, color: '#FFFFFF' }}>
          <span className="badge badge-accent-green" style={{ marginBottom: '0.75rem' }}>Nuestra Empresa</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
            Sobre Nosotros
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '600px' }}>
            Trayectoria y respaldo europeo en medicina de precisión y rejuvenecimiento celular.
          </p>
        </div>
      </section>

      {/* 2. CORPORATE HISTORY SECTION */}
      <section className="section-padding" style={{ background: 'var(--bg-white)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '4rem',
            alignItems: 'center'
          }} className="about-grid-marenostrum">
            
            {/* Left: Branding Image */}
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-light)',
              height: '350px'
            }}>
              <img 
                src="/2020/2025/04/intro-1.png" 
                alt="Medicina Estética Latmedical" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '1.5rem',
                right: '1.5rem',
                background: 'rgba(17, 24, 39, 0.85)',
                backdropFilter: 'blur(4px)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#FFFFFF'
              }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-green)', fontWeight: 700, letterSpacing: '0.1em' }}>
                  Calidad de Importación
                </span>
                <p style={{ fontSize: '0.8rem', margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.8)' }}>
                  Insumos biológicos autorizados bajo rigurosa cadena estéril.
                </p>
              </div>
            </div>

            {/* Right: Text content */}
            <div>
              <span className="badge badge-accent-green" style={{ marginBottom: '1rem' }}>Latmedical Argentina</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.25rem', lineHeight: 1.2 }}>
                Líderes en Distribución de <span className="text-gradient-accent">Dispositivos Médicos Premium</span>
              </h2>
              <p style={{ color: 'var(--text-medium)', marginBottom: '1rem', lineHeight: 1.6 }}>
                En **Latmedical International** somos distribuidores exclusivos autorizados en Argentina de las firmas europeas más influyentes en el sector de la medicina estética y biológica: **Vlift Pro** y **Seffiline**.
              </p>
              <p style={{ color: 'var(--text-medium)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Replicando los estrictos estándares de **Marenostrum Medical Devices S.L.** en Europa, facilitamos a cirujanos plásticos, dermatólogos y médicos especialistas del país el acceso directo a hilos tensores de PDO de última generación y kits de terapia celular cerrada para microinjertos de tejido adiposo autólogo. 
              </p>

              <div style={{
                background: 'var(--bg-light)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'start'
              }}>
                <ShieldCheck size={24} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>Garantía ANMAT</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', margin: 0 }}>
                    Todos los productos comercializados en este portal poseen sus correspondientes registros regulatorios de importación vigentes, garantizando absoluta seguridad legal y biológica para tu práctica médica.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CORPORATE PILLARS (3-COLUMN GRID) */}
      <section className="section-padding" style={{ background: 'var(--bg-light)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem auto' }}>
            <span className="badge badge-accent-green" style={{ marginBottom: '1rem' }}>Pilares Corporativos</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>¿Por qué los médicos nos eligen?</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {/* Pillar 1 */}
            <div style={{
              background: 'var(--bg-white)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '6px',
                background: 'rgba(41, 192, 147, 0.1)',
                color: 'var(--accent-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Award size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Distribución Exclusiva</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', lineHeight: 1.6, margin: 0 }}>
                Garantizamos la legitimidad de cada caja de hilos PDO Vlift Pro o kits autólogos Seffiline, importando de forma directa sin intermediarios.
              </p>
            </div>

            {/* Pillar 2 */}
            <div style={{
              background: 'var(--bg-white)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '6px',
                background: 'rgba(45, 156, 218, 0.1)',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Trazabilidad Biológica</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', lineHeight: 1.6, margin: 0 }}>
                Preservamos el almacenamiento de los productos bajo estrictos controles térmicos y de humedad, garantizando la viabilidad estéril de cada lote.
              </p>
            </div>

            {/* Pillar 3 */}
            <div style={{
              background: 'var(--bg-white)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '6px',
                background: 'rgba(41, 192, 147, 0.1)',
                color: 'var(--accent-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <GraduationCap size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Formación Médica Continua</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', lineHeight: 1.6, margin: 0 }}>
                Respaldamos a nuestros profesionales organizando cursos prácticos ("Hands-On") y conferencias con expertos nacionales sobre hilos y medicina regenerativa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STRATEGIC PARTNERS / EUROPEAN BACKUP */}
      <section className="section-padding" style={{ background: 'var(--bg-white)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge badge-accent-green" style={{ marginBottom: '1rem' }}>Alianzas Internacionales</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>Respaldo Científico de Vanguardia</h2>
          <p style={{ color: 'var(--text-medium)', maxWidth: '600px', margin: '0 auto 3rem auto', fontSize: '0.9rem' }}>
            Nuestros productos y metodologías están respaldados por las sociedades y comités científicos oficiales en Europa.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '3rem',
            flexWrap: 'wrap'
          }}>
            <a 
              href="https://vliftpro.org" 
              target="_blank" 
              rel="noreferrer" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                textDecoration: 'none',
                color: 'var(--primary-dark)',
                fontWeight: 700,
                fontSize: '1.1rem',
                border: '1px solid var(--border-light)',
                padding: '1.25rem 2.5rem',
                borderRadius: '16px',
                transition: 'var(--transition-fast)',
                background: '#ffffff',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <img src="/images/logos/vliftpro-part.png" alt="Vlift Pro" style={{ height: '110px', width: 'auto', display: 'block' }} />
              <ExternalLink size={16} color="var(--text-light)" />
            </a>

            <a 
              href="https://marenostrum-med.com" 
              target="_blank" 
              rel="noreferrer" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                textDecoration: 'none',
                color: 'var(--primary-dark)',
                fontWeight: 700,
                fontSize: '1.1rem',
                border: '1px solid var(--border-light)',
                padding: '1.25rem 2.5rem',
                borderRadius: '16px',
                transition: 'var(--transition-fast)',
                background: '#ffffff',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <img src="/images/logos/marenosturm-med.png" alt="Marenostrum Devices" style={{ height: '110px', width: 'auto', display: 'block' }} />
              <ExternalLink size={16} color="var(--text-light)" />
            </a>

            <a 
              href="https://www.instagram.com/seffiline_sp/" 
              target="_blank" 
              rel="noreferrer" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                textDecoration: 'none',
                color: 'var(--primary-dark)',
                fontWeight: 700,
                fontSize: '1.1rem',
                border: '1px solid var(--border-light)',
                padding: '1.25rem 2.5rem',
                borderRadius: '16px',
                transition: 'var(--transition-fast)',
                background: '#ffffff',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <img src="/images/logos/seffiline_sp.png" alt="Seffiline Terapia" style={{ height: '110px', width: 'auto', display: 'block' }} />
              <ExternalLink size={16} color="var(--text-light)" />
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 992px) {
          .about-grid-marenostrum {
            grid-template-columns: 0.95fr 1.05fr !important;
            gap: 5rem !important;
          }
        }
      `}</style>

    </div>
  );
};
