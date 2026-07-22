import React, { useState } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

interface HilosPDOPageProps {
  onContact: () => void;
  onBack: () => void;
  onViewProduct: (productId: string) => void;
}

const BRAND = '#b8262b';       // V Lift Pro red/dark
const ACCENT = '#c0a063';      // gold accent used in VLift
const DARK = '#1a1a1a';
const LIGHT_GRAY = '#f7f7f7';

const mapIdToProductId = (id: string) => {
  switch (id) {
    case 'mono': return 'vlift-mono';
    case 'premium': return 'vlift-premium';
    case 'genesis': return 'vlift-genesis';
    case 'cones': return 'vlift-cones';
    case 'nose': return 'vlift-nose';
    case 'screw': return 'vlift-single-screw';
    case 'double-screw': return 'vlift-double-screw';
    case 'biocanula': return 'vlift-biocanula';
    case 'tensio': return 'vlift-tensio';
    case 'age': return 'vlift-eye';
    case 'dual-cog': return 'vlift-dual-cog';
    default: return null;
  }
};

/* ── thread product data (VLift structure) ── */
const PRODUCTS = [
  {
    id: 'mono',
    badge: null,
    tag: 'V LIFT PRO MONO',
    title: 'Estimuladores de colágeno',
    subtitle: 'Hilos biológicos — Redensificación dérmica',
    description: 'Los hilos mono, o biológicos, son hilos inteligentes, generadores de colágeno. Su función principal es mejorar la calidad de la piel mediante la redensificación. La disposición es en forma de malla, imitando la estructura natural del colágeno. Los hilos V LIFT PRO ofrecen diferentes medidas para una mejor aplicación en cara, cuello y zonas corporales. El nivel de inserción es dermis profunda o subcutáneo con agujas de diseño especial prácticamente indoloras.',
    indications: 'Indicado para cara, cuello, escote y zonas corporales (abdomen, brazos, glúteos). Flacidez ligera a media. Dermis profunda / subcutáneo.',
    // Real VLift product image
    img: '/2020/2020/12/Hilo-Mono.png',
    imgLabel: 'V Lift Pro Mono — Hilo liso bioestimulador',
    specs: ['25G · 27G · 29G · 30G', '25mm · 38mm · 50mm · 60mm · 90mm'],
    flip: false,
  },
  {
    id: 'premium',
    badge: null,
    tag: 'V LIFT PRO PREMIUM',
    title: 'Espiculados multidireccional. Aguja guía.',
    subtitle: 'Espículas 360° — Técnica abierta o cerrada',
    description: 'Hilos PDO espiculados bidireccionales. Aguja guía de diseño especial "painless". Su función principal es aproximar dos puntos. Ofrecen la ventaja de elegir técnica cerrada, con un solo punto de entrada, o bien técnica abierta, con punto de entrada y salida. V LIFT PRO ofrece 3 referencias para mejorar los resultados según el tipo de piel. El plano de inserción es subcutáneo.',
    indications: 'Zonas de media flacidez: pómulos, mandíbula, cejas. Plano subcutáneo. Fototipos I–III.',
    img: '/hilo-premium.png',
    imgLabel: 'V Lift Pro Premium — Hilo espiculado bidireccional',
    specs: ['19G · 21G', '60mm · 100mm — USP 0 / USP 1-0'],
    flip: true,
  },
  {
    id: 'genesis',
    badge: null,
    tag: 'V LIFT PRO GENESIS',
    title: 'Espículas 360º. Cánula.',
    subtitle: 'Fijación tridimensional — Sin corte de tejidos',
    description: 'La introducción con cánula es una innovación para introducir hilos de mayor calibre (1-0), puesto que la cánula, no corta, sino que separa tejidos a su paso. Las espículas están en 360º, para una fijación tridimensional de tejido. La indicación principal es para fototipos III y IV de la clasificación Fitzpatrick, con una flacidez media. Plano de inserción, subcutáneo.',
    indications: 'Flacidez media. Fototipos III y IV. Óvalo facial, mejillas, papada. Plano subcutáneo.',
    img: '/2020/2025/05/sobre-genesis-producto.png',
    imgLabel: 'V Lift Pro Genesis — Espículas 360° con cánula',
    specs: ['18G · 19G · 21G (Cánula)', '100mm — USP 1-0'],
    flip: false,
  },
  {
    id: 'cones',
    badge: null,
    tag: 'V LIFT PRO CONES',
    title: 'Espículas en forma de conos. Molding.',
    subtitle: 'Mayor calibre — Tejido de gran flacidez',
    description: 'Hilos fabricados con moldes para que las espículas tengan forma de conos evitando los cortes sobre el hilo, lo que le da una mayor consistencia, al ser una única pieza (molding). Guiado por cánula, y con un calibre mucho mayor, que garantiza un procedimiento efectivo y seguro, para el lifting de tejidos de mayor flacidez y/o peso.',
    indications: 'Tejidos de mayor peso y flacidez avanzada. Ideal corporales y óvalo facial pronunciado.',
    img: '/2020/2025/05/sobre-genesis-producto.png',
    imgLabel: 'V Lift Pro Cones',
    specs: ['18G (Cánula)', '100mm — USP 0'],
    flip: true,
  },
  {
    id: 'nose',
    badge: null,
    tag: 'V LIFT PRO NOSE',
    title: 'Lifting y contorno nasal',
    subtitle: 'Rinomodelación no quirúrgica',
    description: 'Los tratamientos con Hilos PDO han ido abarcando cada vez más áreas. Nose cubre perfectamente la demanda que el profesional requería para la zona nasal. Con un solo hilo, podemos levantar la punta de la nariz más de 1mm. También podemos alinear el dorso de la nariz, o bien aproximar alas nasales anchas. Definición, lifting, mejora estética o reparadora, volumen o contorno, son algunas de las posibilidades que encontramos en esta nueva familia de hilos.',
    indications: 'Zona nasal. Levantamiento de punta, alineación del dorso, cierre de alas nasales.',
    img: '/2020/2025/05/Sobre-Hilos-Nose-producto.png',
    imgLabel: 'V Lift Pro Nose',
    specs: ['19G', '50mm · 60mm'],
    flip: false,
  },
  {
    id: 'screw',
    badge: null,
    tag: 'V LIFT PRO SCREW',
    title: 'Hilo enroscado a la aguja',
    subtitle: 'Efecto muelle — Arrugas específicas',
    description: 'V LIFT PRO lleva 5 años escuchando al profesional. Gracias a este estudio, lanzamos la nueva línea Screw, hilos lisos enroscados a la aguja, que consiguen un efecto muelle al introducirlos. Es la respuesta a la solicitud de indicaciones muy específicas, como arrugas verticales de las mejillas o arrugas de escisión, actúan con un "efecto de resorte" y pueden apretarse sin inserción en estas áreas específicas. Plano de inserción, subcutáneo.',
    indications: 'Arrugas verticales de mejillas, arrugas de escisión. Subcutáneo.',
    img: '/hilo-single-screw.png',
    imgLabel: 'V Lift Pro Single Screw — Hilo espiralado',
    specs: ['26G · 27G · 29G', '50mm · 60mm · 90mm'],
    flip: true,
  },
  {
    id: 'double-screw',
    badge: null,
    tag: 'V LIFT PRO DOUBLE SCREW',
    title: 'Par de Hilos enroscados a la aguja',
    subtitle: 'Doble espiral entrelazada — Efecto "refill" biológico superior',
    description: 'Los hilos Double Screw incorporan dos filamentos independientes de PDO enrollados en espiral sobre la aguja de soporte. Esta doble hélice provee una densidad estructural significativamente mayor, ideal para pacientes que requieren una bioestimulación intensiva y una corrección volumétrica en depresiones faciales marcadas o arrugas profundas, logrando un efecto de relleno natural sin sustancias exógenas.',
    indications: 'Surcos nasogenianos profundos, pliegues del mentón y escote. Bioestimulación profunda y soporte de tejido.',
    img: '/hilo-double-screw.png',
    imgLabel: 'V Lift Pro Double Screw — Doble espiral',
    specs: ['25G · 26G · 27G', '60mm · 90mm'],
    flip: false,
  },
  {
    id: 'biocanula',
    badge: 'BIOCANULA',
    tag: 'V LIFT PRO BIOCANULA',
    title: '14 Hilos MONO',
    subtitle: 'Autorelleno biológico — Efecto «refill»',
    description: 'Es un nuevo concepto de revitalización de tejidos que añade una peculiaridad, el relleno autólogo del área a tratar, sin el uso de productos que den volumen a la zona, por eso decimos que tiene un efecto «refill». Es un producto compuesto por una cánula tipo L, que permite la introducción en el tejido de forma prácticamente atraumática, en el interior de la cánula hay 14 hilos MONO.',
    indications: 'El protocolo prevé un punto de entrada con aguja 21G, se introduce la cánula (previamente se dibuja con lápiz blanco la zona a tratar, generalmente en forma de triángulo), y se retira la cánula, se estiran los 14 hilos MONO ligeramente «cola de pez» o «en abanico», y producen una sobreestimulación de los fibroblastos confinados a la zona tratada, generando una gran cantidad de colágeno tipo I y III.',
    img: '/2020/2020/12/biocanula-producto.png',
    imgLabel: 'V Lift Pro Biocánula 14',
    specs: ['21G (entrada)', '14 hilos Mono — cánula tipo L'],
    flip: false,
  },
  {
    id: 'tensio',
    badge: 'TENSIO',
    tag: 'V LIFT PRO TENSIO',
    title: 'Potente efecto lifting',
    subtitle: 'Máxima sujeción — Tejidos de gran peso',
    description: 'Hilos fabricados con moldes, con una disposición que le infiere una gran fuerza de tensión. Produce un potente efecto lifting. Gran grosor de la sutura. Cánula tipo W, lo que permite que se ancle más fácilmente en el tejido subcutáneo.',
    indications: 'Indicado en pacientes con flacidez media y tejidos de gran peso. Ideal para tratamientos corporales glúteos, mamas, abdomen. También para tratar el óvalo facial cuando la flacidez es mayor.',
    img: '/2020/2025/05/sobre-genesis-producto.png',
    imgLabel: 'V Lift Pro Tensio',
    specs: ['18G (Cánula tipo W)', '100mm — USP 0'],
    flip: true,
  },
  {
    id: 'age',
    badge: '¡NUEVO!',
    tag: 'HILOS AGE',
    title: 'Hilos para la delicada zona periorbital',
    subtitle: 'Contorno de ojos — Estimulación precisa',
    description: 'Diseñados específicamente para el contorno de los ojos, los Hilos AGE son la solución ideal para revitalizar la mirada. Estos hilos, de tamaño y composición optimizados, actúan en las capas superficiales de la piel para estimular la producción de colágeno y elastina. Su aplicación precisa ayuda a suavizar las líneas finas, reducir la apariencia de las arrugas perioculares y mejorar la tensión y luminosidad de la piel en esta área sensible. El resultado es una mirada más joven y fresca, con una piel redensificada y de aspecto saludable.',
    indications: 'Área periorbital, párpados, contorno de ojos. Piel delgada y sensible.',
    img: '/2020/2020/12/Hilo-Mono.png',
    imgLabel: 'Hilos AGE periorbital',
    specs: ['30G', '25mm · 38mm'],
    flip: false,
  },
  {
    id: 'dual-cog',
    badge: '¡NUEVO!',
    tag: 'DOBLE AGUJA DUAL COG',
    title: 'Doble vector. Anclaje bidireccional.',
    subtitle: 'Técnica de doble vector — Lifting avanzado',
    description: 'El Hilo Doble Aguja Dual Cog representa una innovación en el lifting no quirúrgico, ofreciendo una solución potente para el reposicionamiento de tejidos. Cada hilo está equipado con dos agujas, lo que permite una técnica de inserción avanzada y un anclaje bidireccional superior. Sus espículas dobles y multidireccionales aseguran una tracción excepcional, proporcionando un efecto lifting inmediato y duradero. Ideal para zonas que requieren una mayor sujeción y un soporte robusto, este hilo es perfecto para redefinir contornos faciales y corporales.',
    indications: 'Contornos faciales, mandíbula, pómulos. Lifting de doble vector para mayor efecto.',
    img: '/hilo-doble-aguja.png',
    imgLabel: 'Dual Cog doble aguja',
    specs: ['19G (x2 agujas)', '60mm · 100mm'],
    flip: true,
  },
];

/* ── Thread image with bg removal ── */
const ThreadImg: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div style={{
    position: 'relative',
    width: '100%',
    maxWidth: '420px',
    margin: '0 auto',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#ffffff',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
    border: '1px solid #eaeaea',
    aspectRatio: '4/3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <img
      src={getAssetUrl(src)}
      alt={alt}
      style={{
        width: '88%',
        height: '88%',
        objectFit: 'contain',
        filter: 'brightness(1.02) contrast(1.02)',
      }}
    />
  </div>
);

/* ── Product row (alternating flip) ── */
const ProductRow: React.FC<{ p: typeof PRODUCTS[0]; idx: number; onViewProduct: (productId: string) => void; onContact: () => void }> = ({ p, idx, onViewProduct, onContact }) => {
  const [open, setOpen] = useState(false);
  const even = idx % 2 === 0;

  return (
    <section
      id={p.id}
      style={{
        padding: '6rem 0',
        background: even ? '#ffffff' : LIGHT_GRAY,
        borderTop: `1px solid #e8e8e8`,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '5rem',
            alignItems: 'center',
          }}
          className="vlift-row"
        >
        {/* ── Image side ── */}
        <div style={{ order: p.flip ? 2 : 1 }}>
          <ThreadImg src={p.img} alt={p.imgLabel} />
          {/* specs chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem', justifyContent: 'center' }}>
            {p.specs.map(s => (
              <span key={s} style={{
                background: DARK, color: '#fff',
                fontSize: '0.72rem', fontWeight: 600,
                padding: '0.3rem 0.75rem', borderRadius: '4px',
                letterSpacing: '0.03em'
              }}>{s}</span>
            ))}
          </div>
        </div>

        {/* ── Text side ── */}
        <div style={{ order: p.flip ? 1 : 2 }}>
          {p.badge && (
            <span style={{
              display: 'inline-block',
              background: BRAND, color: '#fff',
              fontSize: '0.68rem', fontWeight: 800,
              padding: '0.3rem 0.8rem', borderRadius: '4px',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>{p.badge}</span>
          )}

          <p style={{
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: ACCENT, marginBottom: '0.4rem'
          }}>{p.tag}</p>

          <h2 style={{
            fontSize: 'clamp(1.5rem, 2.8vw, 2rem)',
            fontWeight: 800, lineHeight: 1.2,
            color: DARK, marginBottom: '0.5rem'
          }}>{p.title}</h2>

          <p style={{
            fontSize: '0.82rem', fontWeight: 600,
            color: '#888', marginBottom: '1.5rem',
            letterSpacing: '0.02em'
          }}>{p.subtitle}</p>

          <p style={{
            fontSize: '0.9rem', lineHeight: 1.8,
            color: '#444', marginBottom: '1.5rem'
          }}>{p.description}</p>

          {/* Collapsible INDICATIONS */}
          <div style={{
            border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden'
          }}>
            <button
              onClick={() => setOpen(o => !o)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '0.9rem 1.2rem',
                background: '#f4f4f4', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: 700,
                fontSize: '0.8rem', letterSpacing: '0.08em',
                textTransform: 'uppercase', color: DARK,
              }}
            >
              <span>INDICACIONES</span>
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {open && (
              <div style={{
                padding: '1rem 1.2rem',
                fontSize: '0.88rem', lineHeight: 1.7, color: '#555',
                borderTop: '1px solid #e0e0e0'
              }}>
                {p.indications}
              </div>
            )}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const prodId = mapIdToProductId(p.id);
                if (prodId) {
                  onViewProduct(prodId);
                } else {
                  onContact();
                }
              }}
              style={{
                background: BRAND, color: '#fff',
                border: 'none', padding: '0.85rem 2rem',
                borderRadius: '5px', fontWeight: 700,
                fontSize: '0.85rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontFamily: 'inherit', letterSpacing: '0.06em',
                boxShadow: '0 4px 15px rgba(184, 38, 43, 0.15)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <ShoppingBag size={15} />
              COMPRAR
            </button>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const HilosPDOPage: React.FC<HilosPDOPageProps> = ({ onContact, onBack, onViewProduct }) => (
  <div style={{ fontFamily: "'Montserrat', 'Open Sans', sans-serif" }}>

    {/* ── HERO ── */}
    <section style={{
      position: 'relative',
      minHeight: '400px',
      marginTop: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
      background: 'var(--primary-dark)',
      overflow: 'hidden',
      color: '#fff',
      padding: '4rem 0'
    }}>
      {/* Parallax style background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url("${getAssetUrl('/2020/2025/04/parallax-gris.png')}")`,
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
      {/* Bottom border stripe brand lines */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
        background: `linear-gradient(90deg, ${BRAND}, ${ACCENT}, ${BRAND})`,
        zIndex: 3
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 4 }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.82rem', fontWeight: 600, marginBottom: '2rem',
            fontFamily: 'inherit', letterSpacing: '0.05em', padding: 0
          }}
        >
          <ArrowLeft size={16} /> VOLVER AL CATÁLOGO
        </button>

        <div style={{ maxWidth: '720px' }}>
          <span className="badge badge-accent-green" style={{ marginBottom: '1rem' }}>Hilos PDO V Lift PRO</span>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
            fontWeight: 900, lineHeight: 1.05,
            marginBottom: '1.5rem', letterSpacing: '-0.02em',
            color: '#FFFFFF'
          }}>
            Hilos PDO<br />
            <span style={{ color: ACCENT }}>V Lift PRO</span>
          </h1>

          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.75)', maxWidth: '560px', marginBottom: '2rem' }}>
            Nuestra propia marca de hilos nace después de 5 años de andadura, siendo pioneros en tratamientos con hilos de polidioxanona. Diálogos con los profesionales que dan como resultado un mayor número de referencias para ampliar las posibilidades de los tratamientos.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={onBack}
              style={{
                background: BRAND, color: '#fff', border: 'none',
                padding: '0.9rem 2.2rem', borderRadius: '5px',
                fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                letterSpacing: '0.08em', fontFamily: 'inherit',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              COMPRAR PRODUCTOS
            </button>
            <a
              href="/folleto-vlift.pdf"
              download="Folleto_V_Lift_PRO.pdf"
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)',
                padding: '0.9rem 2.2rem', borderRadius: '5px',
                fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                letterSpacing: '0.06em', fontFamily: 'inherit',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              DESCARGAR FOLLETO
            </a>
          </div>
        </div>
      </div>
    </section>

    {/* ── 3 FEATURE BLOCKS (VLift uses 3 horizontal cards) ── */}
    <section style={{ background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }} className="vlift-features">
        {[
          {
            icon: '⚡',
            title: 'Mejor Conservación. Presentación mejorada.',
            body: 'Sobres de aluminio esterilizados y con un proceso de secado que mejora la conservación del producto. Recuerda cerrar siempre el sobre para mantener su calidad.'
          },
          {
            icon: '💉',
            title: 'Aguja Painless. Mayor confort.',
            body: 'Las nuevas agujas están tratadas con un proceso de limado del bisel. Reducción del dolor en cada inserción con un revestimiento de silicona endurecida. Paciente satisfecho.'
          },
          {
            icon: '🔬',
            title: 'PDO Biocompatible. 100% Reabsorbible.',
            body: 'Polidioxanona de uso médico probada desde los años 80 en cirugía cardiovascular. Reabsorción completa entre 6 y 18 meses según el tipo de hilo.'
          },
        ].map(f => (
          <div key={f.title} style={{
            padding: '3rem 2.5rem',
            borderRight: '1px solid #e8e8e8',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: DARK, marginBottom: '0.75rem', lineHeight: 1.3 }}>{f.title}</h3>
            <p style={{ fontSize: '0.87rem', lineHeight: 1.7, color: '#666' }}>{f.body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── PRODUCT QUICK JUMP GRID (like VLift icon grid) ── */}
    <section style={{ background: LIGHT_GRAY, padding: '4rem 0', borderBottom: '1px solid #e0e0e0' }}>
      <div className="container">
        <p style={{
          textAlign: 'center', fontSize: '0.72rem', fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#999', marginBottom: '2.5rem'
        }}>REFERENCIAS DISPONIBLES</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '1rem'
        }}>
          {PRODUCTS.map(p => (
            <a
              key={p.id}
              href={`#${p.id}`}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '0.6rem', padding: '1.25rem 0.75rem',
                background: '#fff', borderRadius: '10px',
                border: '1px solid #e0e0e0',
                textDecoration: 'none', color: DARK,
                fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.04em', textTransform: 'uppercase',
                textAlign: 'center',
                transition: 'box-shadow 0.2s, border-color 0.2s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = `0 6px 20px rgba(0,0,0,0.1)`;
                e.currentTarget.style.borderColor = ACCENT;
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              {/* mini image */}
              <div style={{ width: '56px', height: '56px', background: '#ffffff', border: '1px solid #eaeaea', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={getAssetUrl(p.img)} alt={p.tag} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              {p.badge && (
                <span style={{ background: BRAND, color: '#fff', fontSize: '0.6rem', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>{p.badge}</span>
              )}
              <span>{p.tag.replace('V LIFT PRO ', '').replace('HILOS ', '')}</span>
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* ── PRODUCT ROWS ── */}
    {PRODUCTS.map((p, i) => (
      <ProductRow key={p.id} p={p} idx={i} onViewProduct={onViewProduct} onContact={onContact} />
    ))}

    {/* ── BOTTOM CTA (Tensio-style banner) ── */}
    <section style={{
      background: DARK, color: '#fff',
      padding: '5.5rem 0', textAlign: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
        background: `linear-gradient(90deg, ${BRAND}, ${ACCENT}, ${BRAND})`
      }} />
      <div className="container">
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT, marginBottom: '1rem' }}>
          LATMEDICAL · IMPORTACIÓN DIRECTA · ARGENTINA
        </p>
        <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, marginBottom: '1rem' }}>
          Máxima sujeción y efecto tensor bidireccional
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Distribución oficial de V Lift Pro en Argentina, con certificación ANMAT y cadena de frío garantizada. Exclusivo para profesionales médicos habilitados.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onBack}
            style={{
              background: BRAND, color: '#fff', border: 'none',
              padding: '0.95rem 2.5rem', borderRadius: '5px',
              fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
              fontFamily: 'inherit', letterSpacing: '0.06em',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
          >
            COMPRAR PRODUCTOS →
          </button>
          <a
            href="/folleto-vlift.pdf"
            download="Folleto_V_Lift_PRO.pdf"
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

    <style>{`
      @media (max-width: 900px) {
        .vlift-row {
          grid-template-columns: 1fr !important;
          gap: 2.5rem !important;
        }
        .vlift-row > div[style*="order: 2"] {
          order: 1 !important;
        }
        .vlift-row > div[style*="order: 1"] {
          order: 2 !important;
        }
        .vlift-features {
          grid-template-columns: 1fr !important;
        }
        .vlift-features > div {
          border-right: none !important;
          border-bottom: 1px solid #e8e8e8;
        }
      }
    `}</style>
  </div>
);
