import React from 'react';
import { ShieldAlert, Heart } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: 'var(--primary-dark)',
      color: 'var(--text-white)',
      padding: '4rem 0 2rem 0',
      borderTop: '3px solid var(--accent-green)'
    }}>
      <div className="container">
        
        {/* Footer Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          
          {/* Logo & Warning */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <img 
                src={getAssetUrl('/logo-full.png')} 
                alt="Latmedical International" 
                style={{
                  height: '42px',
                  width: 'auto',
                  display: 'block',
                  filter: 'brightness(0) invert(1)'
                }} 
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              Distribuidor oficial exclusivo en Argentina de Vlift Pro y Seffiline. Suministro médico premium y formación profesional de vanguardia.
            </p>
          </div>

          {/* Site links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--accent-green)', fontWeight: 600, letterSpacing: '0.05em' }}>
              Navegación
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {[
                { id: 'home', label: 'Inicio' },
                { id: 'about', label: 'Nosotros' },
                { id: 'products', label: 'Catálogo de Productos' },
                { id: 'academia', label: 'Academia & Workshops' },
                { id: 'descargas', label: 'Descargas & Consentimientos' },
                { id: 'roi', label: 'Calculadora ROI' },
                { id: 'clearance', label: 'Outlet B2B' },
                { id: 'contact', label: 'Contacto & Asesoría' }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                      padding: 0,
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-green)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Partner Sites */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--accent-green)', fontWeight: 600, letterSpacing: '0.05em' }}>
              Sitios Aliados
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <a 
                  href="https://vliftpro.org" 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-green)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >
                  vlift.org (Vlift Pro Oficial)
                </a>
              </li>
              <li>
                <a 
                  href="https://marenostrum-med.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-green)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >
                  marenostrum-med.com (Marenostrum Devices)
                </a>
              </li>
              <li>
                <a 
                  href="https://seffiline.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-green)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >
                  seffiline.com (Terapia Regenerativa)
                </a>
              </li>
            </ul>
          </div>

          {/* Contact hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--accent-green)', fontWeight: 600, letterSpacing: '0.05em' }}>
              Atención
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              ¿Necesitas asistencia inmediata? Chatea con un representante técnico para recibir asesoría sobre productos.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              Lun a Vie: 9:00 a 18:00 hs
            </p>
          </div>
        </div>

        {/* Regulatory Warnings */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderLeft: '3px solid var(--accent-green)',
          borderRadius: '4px',
          padding: '1.25rem',
          marginBottom: '2.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <ShieldAlert size={20} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>
            <strong>ADVERTENCIA REGULATORIA (Argentina):</strong> El uso de hilos tensores de PDO (Vlift Pro) y kits de microinjerto autólogo (Seffiline) está limitado por ley a cirujanos plásticos, dermatólogos, ginecólogos y médicos especialistas debidamente acreditados y matriculados. Queda prohibida la venta, manipulación o aplicación por personas no profesionales del área de la salud. Latmedical exige validación de credenciales antes del procesamiento de despachos.
          </p>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.5)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span>&copy; {new Date().getFullYear()} Latmedical. Todos los derechos reservados.</span>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => handleNavClick('privacy')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  padding: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-green)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >
                Política de Privacidad
              </button>
              <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>|</span>
              <button
                onClick={() => handleNavClick('cookies')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  padding: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-green)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >
                Política de Cookies
              </button>
              <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>|</span>
              <button
                onClick={() => handleNavClick('terms')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  padding: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-green)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >
                Términos y Condiciones
              </button>
            </div>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Desarrollado con <Heart size={10} fill="var(--accent-green)" color="var(--accent-green)" /> para profesionales médicos.
          </span>
        </div>
      </div>
    </footer>
  );
};
