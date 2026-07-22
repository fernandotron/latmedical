import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, ChevronDown, ChevronUp, Activity, Sparkles, ShieldCheck } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

interface SeffilinePageProps {
  onContact: () => void;
  onBack: () => void;
  onViewProduct: (productId: string) => void;
}

const BRAND_SEFFI = '#2179a3'; // Seffiline blue-teal
const ACCENT_GOLD = '#c0a063'; // gold details
const DARK_BG = '#111827';
const LIGHT_GRAY = '#f9fafb';



const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: '1px solid #e5e7eb',
      padding: '1.25rem 0',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          fontWeight: 700,
          fontSize: '0.95rem',
          color: '#1f2937',
          cursor: 'pointer',
          padding: 0,
          fontFamily: 'inherit'
        }}
      >
        <span>{question}</span>
        {open ? <ChevronUp size={18} color={BRAND_SEFFI} /> : <ChevronDown size={18} color="#9ca3af" />}
      </button>
      {open && (
        <p style={{
          marginTop: '0.75rem',
          fontSize: '0.88rem',
          lineHeight: 1.6,
          color: '#4b5563',
          animation: 'fadeIn 0.3s ease'
        }}>
          {answer}
        </p>
      )}
    </div>
  );
};

export const SeffilinePage: React.FC<SeffilinePageProps> = ({ onContact, onBack, onViewProduct }) => {
  const productKits = [
    {
      id: 'seffi-filler',
      title: 'SEFFILLER®',
      color: '#d36a4b', // Coral/Orange
      subtitle: 'The new age of AUTOLOGOUS AESTHETIC MEDICINE',
      tagline: 'EASY · SAFE · STANDARDIZED',
      description: 'Dispositivo médico patentado para el microinjerto autólogo de tejido adiposo y su fracción estromal, rica en células madre derivadas de adipocitos (ADSCs). Diseñado para tratamientos estéticos de rejuvenecimiento facial natural, reposición de volumen tridimensional y restauración profunda de la matriz extracelular.',
      features: [
        'Cánula de recolección ultrafina de plano superficial guiado',
        'Cero manipulación del tejido: jeringas precargadas listas para usar',
        'Preservación íntegra de la viabilidad celular de células madre',
        'Resultados biológicos progresivos y sumamente duraderos'
      ],
      image: '/2020/2026/01/Seffiller-producto.png',
      bgImg: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
      overlayColor: 'rgba(211, 106, 75, 0.75)',
      logoImg: '/logo-seffiller.png'
    },
    {
      id: 'seffi-hair',
      title: 'SEFFIHAIR®',
      color: '#2179a3', // Blue-teal
      subtitle: 'The autologous treatment of HAIR LOSS AND ALOPECIA',
      tagline: 'NATURAL · EFFECTIVE · AUTOLOGOUS',
      description: 'Kit especializado para terapia regenerativa capilar. Permite la recolección y preparación del microinjerto adiposo rico en células madre y factores de crecimiento autólogos para infiltración directa en el cuero cabelludo, reactivando los folículos pilosos en fase de miniaturización y deteniendo la caída capilar.',
      features: [
        'Guías de profundidad optimizadas para la región capilar peri-folicular',
        'Micrografting autólogo y enriquecido en exosomas naturales',
        'Procedimiento rápido en consultorio médico bajo anestesia local',
        'Alternativa biológica no quirúrgica de alta potencia para alopecias'
      ],
      image: '/2020/2026/07/Seffihair-producto.png',
      bgImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
      overlayColor: 'rgba(33, 121, 163, 0.75)',
      logoImg: '/logo-seffihair.png'
    },
    {
      id: 'seffi-care',
      title: 'SEFFICARE®',
      color: '#218559', // Green
      subtitle: 'The autologous treatment of TISSUE REGENERATION',
      tagline: 'CLINICAL · RECONSTRUCTIVE · STERILE',
      description: 'Kit de medicina regenerativa clínica orientado a traumatología, ortopedia y cicatrización compleja. Facilita la obtención de tejido conectivo estromal adiposo para infiltraciones articulares (artrosis, dolor crónico, lesiones tendinosas) o el tratamiento de heridas/úlceras de difícil cicatrización.',
      features: [
        'Kit con instrumental quirúrgico descartable estéril de grado médico',
        'Potente acción biológica antiinflamatoria y moduladora del dolor',
        'Estimulación activa de la neovascularización y cierre de tejidos',
        'Tratamiento 100% autólogo libre de rechazos o incompatibilidades'
      ],
      image: '/2020/2026/07/Sefficare-producto.png',
      bgImg: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=800',
      overlayColor: 'rgba(33, 133, 89, 0.75)',
      logoImg: '/logo-sefficare.png'
    },
    {
      id: 'seffi-gyn',
      title: 'SEFFIGYN®',
      color: '#d11565', // Pink-magenta
      subtitle: 'The autologous treatment of GSM AND INTIMATE REJUVENATION',
      tagline: 'SAFE · DISCREET · RESTORATIVE',
      description: 'Dispositivo médico patentado para ginecología regenerativa y estética íntima femenina. Permite recolectar tejido adiposo superficial e infiltrarlo en la mucosa vulvovaginal para restaurar la hidratación, elasticidad y tono celular, mitigando la atrofia vaginal y el Síndrome Genitourinario de la Menopausia (GSM).',
      features: [
        'Cánulas ginecológicas y guías anatómicas específicas de zona',
        'Tratamiento biológico no hormonal alternativo a los estrógenos locales',
        'Mejora funcional y estética de la región íntima en sesión única',
        'Mínimo tiempo de inactividad con rápida recuperación de la paciente'
      ],
      image: '/2020/2026/07/Seffigyn-producto.png',
      bgImg: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
      overlayColor: 'rgba(209, 21, 101, 0.75)',
      logoImg: '/logo-seffigyn.png'
    }
  ].map(kit => ({
    ...kit,
    image: getAssetUrl(kit.image),
    logoImg: getAssetUrl(kit.logoImg)
  }));

  return (
    <div style={{ fontFamily: "'Montserrat', 'Open Sans', sans-serif", background: '#ffffff' }}>
      
      {/* ── HERO BANNER ── */}
      <section style={{
        background: `linear-gradient(rgba(17, 24, 39, 0.75), rgba(17, 24, 39, 0.85)), url("${getAssetUrl('/seffiline-biology-bg.png')}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '8rem 0 5rem 0',
        color: '#ffffff',
        position: 'relative'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 5 }}>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '30px',
              padding: '0.5rem 1.25rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '2rem',
              transition: 'background 0.2s',
              fontFamily: 'inherit'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            <ArrowLeft size={16} /> Volver al Catálogo
          </button>
          
          <div style={{ maxWidth: '750px' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#10b981',
              display: 'block',
              marginBottom: '1rem'
            }}>MEDICINA REGENERATIVA AUTÓLOGA</span>
            
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
              color: '#ffffff'
            }}>
              Terapia Celular<br />
              <span style={{ color: '#03bfd7' }}>Seffiline®</span>
            </h1>
            
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '2.5rem'
            }}>
              Sistemas médicos estériles "todo en uno" para la recolección, selección y microfragmentación guiada de tejido adiposo superficial. Obtención limpia y estéril de Fracción Vascular Estromal (SVF) y células madre mesenquimales (ADSCs) sin manipulación ni centrifugadoras.
            </p>
          </div>
        </div>
      </section>

      {/* ── SEFFILINE FULL-WIDTH SPLIT SECTIONS (Copied layout) ── */}
      <section style={{ width: '100%', margin: 0, padding: 0 }}>
        {productKits.map((kit, index) => {
          const even = index % 2 === 0;
          return (
            <div
              key={kit.id}
              style={{
                display: 'flex',
                flexDirection: even ? 'row' : 'row-reverse',
                width: '100%',
                minHeight: '520px',
                background: '#ffffff',
                flexWrap: 'wrap',
                borderBottom: '1px solid #f0f0f0'
              }}
              className="seffiline-split-row"
            >
              {/* Left Column: Visual Image with Colored Overlay */}
              <div
                style={{
                  width: '50%',
                  minWidth: '350px',
                  position: 'relative',
                  backgroundImage: `url(${kit.bgImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                className="seffiline-split-col"
              >
                {/* Overlay filter */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: kit.overlayColor,
                  mixBlendMode: 'multiply'
                }} />
                {/* Gradient tint */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
                  zIndex: 2
                }} />
              </div>

              {/* Right Column: Dotted Logo, Product Picture, CTAs */}
              <div
                style={{
                  width: '50%',
                  minWidth: '350px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4.5rem 3rem',
                  boxSizing: 'border-box'
                }}
                className="seffiline-split-col"
              >
                <div style={{ maxWidth: '440px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  {/* Brand logo image */}
                  <img
                    src={kit.logoImg}
                    alt={kit.title}
                    style={{
                      height: '95px',
                      objectFit: 'contain',
                      marginBottom: '1rem',
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.03))'
                    }}
                  />
                  
                  {/* Product line visual */}
                  <img
                    src={kit.image}
                    alt={kit.title}
                    style={{
                      height: '70px',
                      objectFit: 'contain',
                      margin: '1.25rem 0',
                      filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.08))'
                    }}
                  />
                  
                  {/* Subtitle / Tag */}
                  <p style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: '#4b5563',
                    margin: '0 0 0.5rem 0',
                    textTransform: 'uppercase'
                  }}>{kit.subtitle}</p>
                  
                  <p style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#9ca3af',
                    margin: '0 0 1.5rem 0',
                    letterSpacing: '0.08em'
                  }}>{kit.tagline}</p>
                  
                  {/* Detail description */}
                  <p style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.7,
                    color: '#555555',
                    margin: '0 0 2rem 0'
                  }}>{kit.description}</p>
                  
                  {/* CTAs */}
                  <div style={{ display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'center' }}>
                    <button
                      onClick={() => onViewProduct(kit.id)}
                      style={{
                        background: kit.color,
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.85rem 1.8rem',
                        borderRadius: '5px',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        letterSpacing: '0.06em',
                        fontFamily: 'inherit',
                        transition: 'opacity 0.2s',
                        boxShadow: `0 4px 15px ${kit.color}25`
                      }}
                      onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                      onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    >
                      <ShoppingBag size={15} style={{ marginRight: '0.4rem', verticalAlign: 'middle', display: 'inline-block' }} />
                      COMPRAR KIT
                    </button>
                    <a
                      href="/folleto-vlift.pdf"
                      download="Folleto_Seffiline.pdf"
                      style={{
                        display: 'inline-block',
                        background: 'transparent',
                        color: '#4b5563',
                        border: '1.5px solid #d1d5db',
                        padding: '0.85rem 1.5rem',
                        borderRadius: '5px',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        letterSpacing: '0.06em',
                        fontFamily: 'inherit',
                        textDecoration: 'none',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.borderColor = '#9ca3af';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }}
                    >
                      DESCARGAR FOLLETO
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── SCIENCE SECTION (Educational Addition) ── */}
      <section style={{ padding: '6rem 0', background: LIGHT_GRAY }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 4rem auto' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: BRAND_SEFFI }}>TECNOLOGÍA REGENERATIVA</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#1f2937', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              La Ciencia Detrás de Seffiline®
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#4b5563' }}>
              El secreto reside en el plano de recolección y en el procesamiento físico cerrado. El tejido adiposo del plano subcutáneo superficial contiene la mayor abundancia de células estromales y vasculares.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem'
          }}>
            {/* Pillar 1 */}
            <div style={{
              background: '#ffffff',
              padding: '2.5rem 2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '10px',
                background: `${BRAND_SEFFI}12`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem', color: BRAND_SEFFI
              }}>
                <Activity size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.75rem' }}>Cosecha Guiada Atraumática</h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#4b5563', margin: 0 }}>
                La cánula SEFFI cuenta con una guía patentada de profundidad regulada que separa los lóbulos de grasa del plano subcutáneo superficial sin riesgo de lesionar estructuras profundas ni vasos mayores.
              </p>
            </div>

            {/* Pillar 2 */}
            <div style={{
              background: '#ffffff',
              padding: '2.5rem 2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '10px',
                background: `${BRAND_SEFFI}12`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem', color: BRAND_SEFFI
              }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.75rem' }}>Procesamiento Cerrado Físico</h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#4b5563', margin: 0 }}>
                El tejido se microfragmenta y filtra de forma mecánica dentro de las jeringas interconectadas estériles. No requiere el uso de enzimas digestivas (colagenasa) ni procesos de centrifugación.
              </p>
            </div>

            {/* Pillar 3 */}
            <div style={{
              background: '#ffffff',
              padding: '2.5rem 2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '10px',
                background: `${BRAND_SEFFI}12`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem', color: BRAND_SEFFI
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.75rem' }}>Máxima Viabilidad Celular</h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#4b5563', margin: 0 }}>
                Conserva intacta la Fracción Vascular Estromal (SVF) y las células madre derivadas de adipocitos (ADSCs), garantizando que las células trasplantadas permanezcan viables y estimulen la regeneración tisular.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION (Educational Addition) ── */}
      <section style={{ padding: '6rem 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: BRAND_SEFFI }}>SOPORTE MÉDICO</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1f2937', marginTop: '0.5rem' }}>Preguntas Frecuentes</h2>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb' }}>
            <FAQItem
              question="¿Qué es la terapia autóloga regenerativa y cómo funciona?"
              answer="Es un tratamiento biológico que emplea las propias células regenerativas del paciente (obtenidas de su tejido adiposo) para reparar o rejuvenecer tejidos en la zona de injerto. Al tratarse de material 100% autólogo (del propio organismo), no existe posibilidad alguna de rechazo, incompatibilidad o reacciones alérgicas."
            />
            <FAQItem
              question="¿En qué consiste el sistema de recolección SEFFI?"
              answer="SEFFI (Superficial Enhanced Fluid Fat Injection) es una técnica médica y de ingeniería patentada que cuenta con cánulas especiales y guías físicas adaptadas a la anatomía subcutánea. Permite recolectar de manera uniforme y atraumática la grasa del plano superficial de la piel, que es la que posee mayor abundancia de células estromales y vasculares activas."
            />
            <FAQItem
              question="¿Cómo es el flujo de trabajo del procedimiento?"
              answer="El procedimiento se realiza de forma ambulatoria en el propio consultorio médico en unos 45 minutos. Consiste en tres etapas: 1) Cosecha del tejido adiposo bajo anestesia local, 2) Filtrado y microfragmentación en un circuito cerrado y estéril, y 3) Reinfiltración en la zona receptora. El paciente puede retomar sus actividades cotidianas de inmediato."
            />
            <FAQItem
              question="¿Qué diferencia técnica hay entre cada kit de Seffiline?"
              answer="Cada kit (Seffiller, Seffihair, Sefficare, Seffigyn) viene configurado con el instrumental estéril optimizado para su área de aplicación. Se diferencian principalmente en los calibres de las microcánulas de recolección y en las guías físicas diseñadas para adaptarse al contorno facial, cuero cabelludo, articulaciones o anatomía íntima femenina."
            />
          </div>
        </div>
      </section>

      {/* ── BOTTOM BANNER (B2B CTA) ── */}
      <section style={{
        background: DARK_BG,
        color: '#ffffff',
        padding: '5.5rem 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
          background: `linear-gradient(90deg, ${BRAND_SEFFI}, ${ACCENT_GOLD}, ${BRAND_SEFFI})`
        }} />
        <div className="container">
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT_GOLD, marginBottom: '1rem' }}>
            DISTRIBUIDOR OFICIAL · ARGENTINA
          </p>
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, marginBottom: '1rem' }}>
            Incorpora Seffiline® en tu Clínica
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Ofrece a tus pacientes el tratamiento regenerativo de tejido adiposo superficial más seguro, estandarizado y de mayor viabilidad clínica. Exclusivo para profesionales médicos autorizados.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onContact}
              style={{
                background: BRAND_SEFFI, color: '#fff', border: 'none',
                padding: '0.95rem 2.5rem', borderRadius: '5px',
                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                fontFamily: 'inherit', letterSpacing: '0.06em',
                transition: 'opacity 0.2s',
                boxShadow: `0 4px 15px ${BRAND_SEFFI}30`
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              CONTACTAR ASESOR →
            </button>
            <a
              href="/folleto-vlift.pdf"
              download="Folleto_Seffiline.pdf"
              style={{
                display: 'inline-block',
                background: 'transparent', color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.3)',
                padding: '0.95rem 2.5rem', borderRadius: '5px',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                fontFamily: 'inherit', letterSpacing: '0.06em',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              DESCARGAR FOLLETO
            </a>
          </div>
        </div>
      </section>

      {/* Style overrides for Responsive Split-Row Layout */}
      <style>{`
        @media (max-width: 820px) {
          .seffiline-split-row {
            flex-direction: column !important;
          }
          .seffiline-split-col {
            width: 100% !important;
            min-width: auto !important;
            padding: 3rem 1.5rem !important;
          }
          .seffiline-split-col:first-of-type {
            height: 320px !important;
            padding: 0 !important;
          }
        }
        @media (max-width: 480px) {
          .seffiline-split-col {
            padding: 2.25rem 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};
