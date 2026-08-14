import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  ShoppingCart, 
  Stethoscope,
  Info
} from 'lucide-react';
import { products, Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { getAssetUrl } from '../utils/assets';

export interface AnatomicalZone {
  id: string;
  name: string;
  category: 'facial' | 'cervical' | 'body' | 'specialty';
  icon: string;
  description: string;
  primaryIndication: string;
  insertionPlane: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado' | 'Quirúrgico / Alta Especialidad';
  recommendedProducts: {
    productId: string;
    gauge: string;
    role: string;
    quantitySuggested: number;
  }[];
  clinicalTip: string;
}

const ANATOMICAL_ZONES: AnatomicalZone[] = [
  {
    id: 'tercio-medio',
    name: 'Tercio Medio & Pómulos (Lifting Malar)',
    category: 'facial',
    icon: '✨',
    description: 'Elevación de almohadillas grasas malares y atenuación de surcos nasogenianos por descolgamiento tisular.',
    primaryIndication: 'Reposicionamiento volumétrico malar y tensión vectorial',
    insertionPlane: 'Subcutáneo profundo / Supra-SMAS',
    difficulty: 'Intermedio',
    recommendedProducts: [
      { productId: 'vlift-genesis', gauge: '19G x 90mm / 21G x 70mm', role: 'Tracción y reposicionamiento malar atraumático con cánula L', quantitySuggested: 2 },
      { productId: 'vlift-cones', gauge: '18G x 100mm', role: 'Anclaje de alta fijación para tejidos pesados', quantitySuggested: 1 },
      { productId: 'vlift-single-screw', gauge: '26G x 60mm', role: 'Efecto resorte de soporte en surco nasogeniano', quantitySuggested: 1 }
    ],
    clinicalTip: 'La inserción en abanico desde el arco cigomático hacia el ángulo labial permite crear un vector tensor natural sin generar asimetrías.'
  },
  {
    id: 'tercio-inferior',
    name: 'Óvalo Facial, Mandíbula & Líneas de Marioneta',
    category: 'facial',
    icon: '💎',
    description: 'Definición del reborde mandibular, corrección de jowls (\"papos\") y suspensión de comisuras orales.',
    primaryIndication: 'Redefinición del contorno mandibular y tracción mandibular',
    insertionPlane: 'Subdérmico profundo / Fascia de retención',
    difficulty: 'Avanzado',
    recommendedProducts: [
      { productId: 'vlift-premium', gauge: '19G x 90mm / 21G x 70mm', role: 'Espículas bidireccionales 3D/4D de alta resistencia tensora', quantitySuggested: 2 },
      { productId: 'vlift-tensio', gauge: '19G x 100mm', role: 'Anclaje en fascia preauricular y elevación de jowl', quantitySuggested: 1 },
      { productId: 'vlift-biocanula', gauge: '23G x 60mm', role: 'Refill biológico autólogo de 14 hilos mono para redensificación', quantitySuggested: 1 }
    ],
    clinicalTip: 'Fijar el punto de anclaje 1 cm por delante del trago auricular para maximizar la resistencia mecánica del vector de tracción.'
  },
  {
    id: 'periocular-ojeras',
    name: 'Zona Periocular, Párpados & Ojeras',
    category: 'facial',
    icon: '👁️',
    description: 'Tratamiento de piel fina periorbital, patas de gallo y hundimiento en surco lagrimal / ojeras pigmentadas.',
    primaryIndication: 'Neocolagénesis en dermis fina y redensificación periorbitaria',
    insertionPlane: 'Dérmico superficial / Subdérmico fino',
    difficulty: 'Básico',
    recommendedProducts: [
      { productId: 'vlift-eye', gauge: '30G x 25mm / 30G x 38mm', role: 'Microfilamento painless de polidioxanona para piel extra fina', quantitySuggested: 2 },
      { productId: 'vlift-mono', gauge: '29G x 38mm', role: 'Malla de redensificación para aumento del espesor dérmico', quantitySuggested: 1 }
    ],
    clinicalTip: 'Introducir en disposición de malla cruzada (cross-hatching) para inducir un soporte estructural homogéneo que atenúe la translucidez vascular.'
  },
  {
    id: 'rinomodelacion',
    name: 'Rinomodelación Biológica (Dorso & Punta)',
    category: 'facial',
    icon: '👃',
    description: 'Elevación de la punta nasal, rectificación de giba y proyección de columela sin implantes quirúrgicos.',
    primaryIndication: 'Soporte y tracción sobre cartílago septal y alar',
    difficulty: 'Avanzado',
    insertionPlane: 'Intercartilaginoso / Supraperióstico',
    recommendedProducts: [
      { productId: 'vlift-nose', gauge: '19G x 38mm (Columela) / 21G x 60mm (Dorso)', role: 'Espículas rígidas moldeadas específicas para cartílago nasal', quantitySuggested: 1 }
    ],
    clinicalTip: 'Utilizar hilo 19G x 38mm en pilar columelar para crear un poste de sustentación rígido y 21G x 60mm para rectificar el ángulo nasofrontal.'
  },
  {
    id: 'cuello-escote',
    name: 'Cuello, Papada & Escote (Rejuvenecimiento Cervical)',
    category: 'cervical',
    icon: '🌿',
    description: 'Tensado de piel laxa submentoniana, arrugas horizontales en collar de Venus y flacidez dérmica en escote.',
    primaryIndication: 'Bioestimulación masiva y suspensión submentoniana',
    insertionPlane: 'Subcutáneo superficial / Pre-platismal',
    difficulty: 'Intermedio',
    recommendedProducts: [
      { productId: 'vlift-biocanula', gauge: '23G x 60mm (14 Hilos)', role: 'Redensificación dérmica con técnica en abanico único', quantitySuggested: 2 },
      { productId: 'vlift-mono', gauge: '27G x 50mm / 29G x 38mm', role: 'Malla biológica de colágeno tipo I y III', quantitySuggested: 2 },
      { productId: 'vlift-double-screw', gauge: '26G x 60mm', role: 'Atenuación de líneas estáticas del cuello', quantitySuggested: 1 }
    ],
    clinicalTip: 'El abordaje submandibular en cruz reduce la redundancia cutánea y contrae el tejido mediante fibrosis controlada.'
  },
  {
    id: 'corporal-flacidez',
    name: 'Corporal: Brazos, Abdomen & Glúteos',
    category: 'body',
    icon: '💪',
    description: 'Tratamiento de flacidez en cara interna de brazos, abdomen post-parto y bio-lifting de glúteos.',
    primaryIndication: 'Tensión de grandes superficies y redensificación de tejido subcutáneo',
    insertionPlane: 'Hipodermis superficial / Grasa subcutánea',
    difficulty: 'Intermedio',
    recommendedProducts: [
      { productId: 'vlift-biocanula', gauge: '23G x 60mm', role: '14 hilos por cánula para cobertura amplia de tejido laxo', quantitySuggested: 4 },
      { productId: 'vlift-tensio', gauge: '19G x 100mm', role: 'Tracción de bandas en vectores tensores corporales', quantitySuggested: 2 },
      { productId: 'vlift-mono', gauge: '25G x 90mm', role: 'Redensificación dérmica profunda en cuadrantes corporales', quantitySuggested: 3 }
    ],
    clinicalTip: 'Trazar líneas de tracción diagonales en vectores convergentes hacia las fascias de anclaje profundo para resistir la fuerza de gravedad.'
  },
  {
    id: 'regenerativa-facial',
    name: 'Terapia Celular Autóloga Facial SEFFILLER®',
    category: 'specialty',
    icon: '🧬',
    description: 'Bio-restauración y rejuvenecimiento integral mediante injerto autólogo de tejido adiposo y células estromales vasculares (SVF / ADSCs).',
    primaryIndication: 'Regeneración celular, restauración de volumen y calidad de la matriz dérmica',
    insertionPlane: 'Subcutáneo superficial guiado (Sistema patentado SEFFI)',
    difficulty: 'Avanzado',
    recommendedProducts: [
      { productId: 'seffi-filler', gauge: 'Kit Quirúrgico Desechable All-In-One', role: 'Recolección, preparación y microinjerto de tejido autólogo + células madre', quantitySuggested: 1 }
    ],
    clinicalTip: 'La recolección guiada superficial garantiza obtener tejido con la mayor densidad de células madre mesenquimales viables sin necesidad de centrifugación traumática.'
  },
  {
    id: 'regenerativa-capilar',
    name: 'Tricología Médica Celular SEFFIHAIR®',
    category: 'specialty',
    icon: '🔬',
    description: 'Terapia celular autóloga para alopecias androgenéticas masculinas y femeninas y regeneración folicular activa.',
    primaryIndication: 'Estimulación y rescate de folículos pilosos en miniaturización',
    insertionPlane: 'Galea aponeurótica / Subdérmico capilar',
    difficulty: 'Intermedio',
    recommendedProducts: [
      { productId: 'seffi-hair', gauge: 'Kit Específico Tricología SEFFIHAIR', role: 'Aislamiento estéril de SVF enriquecido para microinfiltración capilar', quantitySuggested: 1 }
    ],
    clinicalTip: 'Infiltrar en microgotas espaciadas 1 cm en las zonas de mayor miniaturización (línea frontal y vértex) para inducir angiogénesis local.'
  },
  {
    id: 'regenerativa-ginecologia',
    name: 'Ginecoestética Regenerativa SEFFIGYN®',
    category: 'specialty',
    icon: '🌸',
    description: 'Restauración funcional y bioplastia de mucosa y tejidos íntimos para atrofia vulvovaginal, liquen escleroso y laxitud tisular.',
    primaryIndication: 'Regeneración de mucosa vaginal, elasticidad e hidratación tisular no hormonal',
    insertionPlane: 'Submucosa vaginal / Tejido celular subcutáneo vulvar',
    difficulty: 'Quirúrgico / Alta Especialidad',
    recommendedProducts: [
      { productId: 'seffi-gyn', gauge: 'Kit Ginecológico Específico SEFFIGYN', role: 'Dispositivo cerrado para recolección y regeneración de mucosa íntima', quantitySuggested: 1 }
    ],
    clinicalTip: 'Procedimiento ambulatorio bajo anestesia tumescente local. Resultados visibles en recuperación del grosor epitelial a partir de la 3ra semana.'
  }
];

export const AnatomicalFinder: React.FC<{
  onSelectProduct: (product: Product) => void;
  onNavigateToCatalog?: () => void;
}> = ({ onSelectProduct }) => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(ANATOMICAL_ZONES[0].id);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const filteredZones = useMemo(() => {
    if (selectedCategory === 'all') return ANATOMICAL_ZONES;
    return ANATOMICAL_ZONES.filter(z => z.category === selectedCategory);
  }, [selectedCategory]);

  const activeZone = useMemo(() => {
    return ANATOMICAL_ZONES.find(z => z.id === selectedZoneId) || ANATOMICAL_ZONES[0];
  }, [selectedZoneId]);

  // Calculate package price for active zone
  const packageTotal = useMemo(() => {
    return activeZone.recommendedProducts.reduce((sum, item) => {
      const prod = products.find(p => p.id === item.productId);
      return sum + (prod ? prod.price * item.quantitySuggested : 0);
    }, 0);
  }, [activeZone]);

  const handleAddZoneKitToCart = () => {
    activeZone.recommendedProducts.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantitySuggested);
      }
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  return (
    <div style={{
      background: 'var(--bg-white)',
      borderRadius: '16px',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden',
      margin: '2rem 0'
    }}>
      {/* 1. Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #111827 0%, #17342b 100%)',
        padding: '2.5rem 2rem',
        color: '#FFFFFF',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '320px',
          height: '100%',
          background: 'radial-gradient(circle at right center, rgba(41, 192, 147, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '850px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-accent-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Stethoscope size={14} /> Guía Clínica & Tratamiento Finder
            </span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
              Protocolos validados para Medicina Estética & Regenerativa
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.3rem)', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#FFFFFF' }}>
            Navegador Anatómico e Indicador de Tratamientos
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
            Selecciona la zona anatómica o indicación clínica del paciente para explorar los calibres recomendados de <strong>Hilos PDO V-Lift Pro</strong> y kits <strong>Seffiline</strong> con sus planos de inserción recomendados.
          </p>
        </div>
      </div>

      {/* 2. Main Interface */}
      <div style={{ padding: '2rem' }}>
        
        {/* Category Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-light)'
        }}>
          {[
            { id: 'all', label: 'Todas las Zonas (9)' },
            { id: 'facial', label: 'Rostro & Periocular' },
            { id: 'cervical', label: 'Cuello & Escote' },
            { id: 'body', label: 'Corporal' },
            { id: 'specialty', label: 'Medicina Regenerativa & Especialidades' }
          ].map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const firstInCat = cat.id === 'all' 
                    ? ANATOMICAL_ZONES[0].id 
                    : ANATOMICAL_ZONES.find(z => z.category === cat.id)?.id || ANATOMICAL_ZONES[0].id;
                  setSelectedZoneId(firstInCat);
                }}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--accent-green)' : 'var(--border-light)',
                  background: isSelected ? 'var(--accent-green-light)' : 'transparent',
                  color: isSelected ? '#03543F' : 'var(--text-medium)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 2-Column Clinical Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          
          {/* Left Column: Anatomical Zones List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxHeight: '650px',
            overflowY: 'auto',
            paddingRight: '0.5rem'
          }}>
            {filteredZones.map(zone => {
              const isSelected = zone.id === selectedZoneId;
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1.1rem',
                    borderRadius: '12px',
                    border: `2px solid ${isSelected ? 'var(--accent-green)' : 'var(--border-light)'}`,
                    background: isSelected ? 'rgba(41, 192, 147, 0.05)' : 'var(--bg-white)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(41, 192, 147, 0.12)' : 'none'
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: isSelected ? 'var(--accent-gradient)' : 'var(--bg-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    flexShrink: 0
                  }}>
                    {zone.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>
                        {zone.name}
                      </h4>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: zone.difficulty === 'Básico' ? '#DEF7EC' : zone.difficulty === 'Intermedio' ? '#FEF08A' : '#FEE2E2',
                        color: zone.difficulty === 'Básico' ? '#03543F' : zone.difficulty === 'Intermedio' ? '#854D0E' : '#991B1B'
                      }}>
                        {zone.difficulty}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-medium)', margin: '0 0 0.4rem 0', lineHeight: 1.35 }}>
                      {zone.description}
                    </p>

                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                      {zone.recommendedProducts.length} Dispositivos Médicos Sugeridos →
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Treatment Protocol & Suggested Products */}
          <div style={{
            background: 'var(--bg-light)',
            borderRadius: '14px',
            border: '1px solid var(--border-light)',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'sticky',
            top: 'calc(var(--header-height) + 1rem)'
          }}>
            
            {/* Header of Active Zone */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{activeZone.icon}</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                  {activeZone.name}
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', margin: 0 }}>
                <strong>Indicación Principal:</strong> {activeZone.primaryIndication}
              </p>
            </div>

            {/* Technical Specifications Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              background: '#FFFFFF',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              fontSize: '0.8rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-medium)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Plano de Inserción:
                </span>
                <strong style={{ color: 'var(--primary-dark)' }}>{activeZone.insertionPlane}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-medium)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Nivel de Complejidad:
                </span>
                <strong style={{ color: 'var(--accent-green)' }}>{activeZone.difficulty}</strong>
              </div>
            </div>

            {/* Clinical Tip Box */}
            <div style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem'
            }}>
              <Info size={18} color="#1D4ED8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.78rem', color: '#1E40AF', lineHeight: 1.45 }}>
                <strong>Recomendación Clínica:</strong> {activeZone.clinicalTip}
              </div>
            </div>

            {/* Recommended Products List */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Dispositivos Médicos Sugeridos:
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                  Total Kit: USD ${packageTotal.toFixed(2)}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {activeZone.recommendedProducts.map((item, idx) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0.9rem',
                        background: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '6px',
                          background: '#FFFFFF',
                          border: '1px solid var(--border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          <img 
                            src={getAssetUrl(product.image)} 
                            alt={product.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                          />
                        </div>
                        <div>
                          <div 
                            onClick={() => onSelectProduct(product)}
                            style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-dark)', cursor: 'pointer' }}
                            onMouseOver={e => e.currentTarget.style.color = 'var(--accent-green)'}
                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-dark)'}
                          >
                            {item.quantitySuggested}x {product.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-medium)' }}>
                            Calibre: <strong style={{ color: 'var(--accent-green)' }}>{item.gauge}</strong> — {item.role}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                          USD ${(product.price * item.quantitySuggested).toFixed(2)}
                        </div>
                        <button
                          onClick={() => onSelectProduct(product)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-green)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          Ver Ficha →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Button: Add Entire Protocol Kit to Cart */}
            <button
              onClick={handleAddZoneKitToCart}
              disabled={addedSuccess}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: addedSuccess ? '#059669' : 'var(--accent-gradient)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {addedSuccess ? (
                <>
                  <CheckCircle2 size={18} /> ¡Kit para {activeZone.name} Añadido al Carrito!
                </>
              ) : (
                <>
                  <ShoppingCart size={18} /> Adquirir Kit para este Procedimiento (USD ${packageTotal.toFixed(2)})
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
