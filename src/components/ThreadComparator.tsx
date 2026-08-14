import React, { useState, useMemo } from 'react';
import { 
  GitCompare, 
  X, 
  ShoppingCart
} from 'lucide-react';
import { products, Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { getAssetUrl } from '../utils/assets';

export interface ThreadTechnicalData {
  productId: string;
  name: string;
  typeCategory: 'Bioestimulación & Redensificación' | 'Lifting & Tracción Pesada' | 'Especialidad (Nariz / Ojos)';
  needleType: string;
  availableGauges: string[];
  threadUsp: string;
  lengthsAvailable: string[];
  barbStructure: string;
  tensilePower: number; // 1 to 5 stars
  primaryIndication: string;
  absorptionMonths: string;
  price: number;
}

const THREAD_DATABASE: ThreadTechnicalData[] = [
  {
    productId: 'vlift-mono',
    name: 'V Lift Pro Mono (Lisos)',
    typeCategory: 'Bioestimulación & Redensificación',
    needleType: 'Aguja Guía Painless Ultra-Fina',
    availableGauges: ['25G', '27G', '29G', '30G'],
    threadUsp: 'USP 5.0 a USP 7.0',
    lengthsAvailable: ['25mm', '38mm', '50mm', '60mm', '90mm'],
    barbStructure: 'Monofilamento liso cilíndrico',
    tensilePower: 2,
    primaryIndication: 'Malla biológica de colágeno en rostro, cuello, escote y abdomen',
    absorptionMonths: '6 - 8 meses',
    price: 30
  },
  {
    productId: 'vlift-biocanula',
    name: 'V Lift Pro Biocánula 14 Mono',
    typeCategory: 'Bioestimulación & Redensificación',
    needleType: 'Cánula Roma tipo L Atraumática',
    availableGauges: ['23G'],
    threadUsp: 'USP 5.0 (14 hilos internos)',
    lengthsAvailable: ['38mm', '60mm'],
    barbStructure: 'Sistema Multi-Hilo (14 hilos precargados)',
    tensilePower: 3,
    primaryIndication: 'Efecto refill y redensificación masiva con único punto de entrada',
    absorptionMonths: '6 - 12 meses',
    price: 70
  },
  {
    productId: 'vlift-single-screw',
    name: 'V Lift Pro Single Screw',
    typeCategory: 'Bioestimulación & Redensificación',
    needleType: 'Aguja Guía con Baño de Silicona',
    availableGauges: ['26G', '27G', '29G'],
    threadUsp: 'USP 5.0 / USP 6.0',
    lengthsAvailable: ['50mm', '60mm', '90mm'],
    barbStructure: 'Espiral helicoidal simple (Efecto resorte)',
    tensilePower: 3,
    primaryIndication: 'Atenuación de surcos nasogenianos y líneas peribucales',
    absorptionMonths: '6 - 8 meses',
    price: 35
  },
  {
    productId: 'vlift-double-screw',
    name: 'V Lift Pro Double Screw',
    typeCategory: 'Bioestimulación & Redensificación',
    needleType: 'Aguja Guía Painless Siliconada',
    availableGauges: ['25G', '26G', '27G'],
    threadUsp: 'USP 5.0 (Doble filamento entrelazado)',
    lengthsAvailable: ['60mm', '90mm'],
    barbStructure: 'Doble espiral entrelazada de alta densidad',
    tensilePower: 3,
    primaryIndication: 'Surcos profundos, arrugas estáticas marcadas y depresiones',
    absorptionMonths: '6 - 8 meses',
    price: 44
  },
  {
    productId: 'vlift-genesis',
    name: 'V Lift Pro Genesis (Cánula L)',
    typeCategory: 'Lifting & Tracción Pesada',
    needleType: 'Cánula Roma tipo L (Atraumática)',
    availableGauges: ['19G', '21G', '23G'],
    threadUsp: 'USP 1-0 / USP 0 Moldeado',
    lengthsAvailable: ['70mm', '90mm'],
    barbStructure: 'Espículas moldeadas 360° en espiral',
    tensilePower: 4,
    primaryIndication: 'Lifting vectorial malar, tercio medio y papada con mínima inflamación',
    absorptionMonths: '8 - 12 meses',
    price: 150
  },
  {
    productId: 'vlift-premium',
    name: 'V Lift Pro Premium (Cog 3D/4D)',
    typeCategory: 'Lifting & Tracción Pesada',
    needleType: 'Aguja Guía Painless Rígida',
    availableGauges: ['19G', '21G', '23G'],
    threadUsp: 'USP 1-0 / USP 2-0',
    lengthsAvailable: ['70mm', '90mm'],
    barbStructure: 'Espículas bidireccionales helicoidales 3D/4D',
    tensilePower: 4,
    primaryIndication: 'Redefinición de línea mandibular, elevación de cejas y pómulos',
    absorptionMonths: '8 - 12 meses',
    price: 120
  },
  {
    productId: 'vlift-cones',
    name: 'V Lift Pro Cones (Conos Moldeados)',
    typeCategory: 'Lifting & Tracción Pesada',
    needleType: 'Cánula Roma de Gran Calibre',
    availableGauges: ['18G'],
    threadUsp: 'USP 0 (Núcleo intacto Molding)',
    lengthsAvailable: ['100mm'],
    barbStructure: 'Conos tridimensionales moldeados por presión',
    tensilePower: 5,
    primaryIndication: 'Máxima tracción biológica en rostros pesados y gran descolgamiento',
    absorptionMonths: '8 - 12 meses',
    price: 150
  },
  {
    productId: 'vlift-tensio',
    name: 'V Lift Pro Tensio',
    typeCategory: 'Lifting & Tracción Pesada',
    needleType: 'Cánula Roma Reforzada',
    availableGauges: ['19G'],
    threadUsp: 'USP 1-0 de Alta Tensión',
    lengthsAvailable: ['100mm'],
    barbStructure: 'Patrón espiculado reforzado para vectores pesados',
    tensilePower: 5,
    primaryIndication: 'Suspensión estructural en fascia, papada y cuello',
    absorptionMonths: '8 - 12 meses',
    price: 150
  },
  {
    productId: 'vlift-dual-cog',
    name: 'V Lift Pro Doble Aguja Dual Cog',
    typeCategory: 'Lifting & Tracción Pesada',
    needleType: 'Sistema Integrado de Doble Aguja',
    availableGauges: ['21G', '23G'],
    threadUsp: 'USP 2-0',
    lengthsAvailable: ['110mm', '150mm'],
    barbStructure: 'Espículas bidireccionales en bucle cerrado',
    tensilePower: 5,
    primaryIndication: 'Anclajes en bucle para cejas, tercio medio y suspensión cervical',
    absorptionMonths: '8 - 12 meses',
    price: 100
  },
  {
    productId: 'vlift-nose',
    name: 'V Lift Pro Nose (Rinomodelación)',
    typeCategory: 'Especialidad (Nariz / Ojos)',
    needleType: 'Aguja Rígida Nasal',
    availableGauges: ['19G', '21G'],
    threadUsp: 'USP 0 Moldeado Rígido',
    lengthsAvailable: ['38mm', '50mm', '60mm'],
    barbStructure: 'Espículas rígidas unidireccionales para cartílago',
    tensilePower: 5,
    primaryIndication: 'Elevación de punta nasal, columela y rectificación de dorso',
    absorptionMonths: '8 - 12 meses',
    price: 80
  },
  {
    productId: 'vlift-eye',
    name: 'V Lift Pro Eye (Periocular)',
    typeCategory: 'Especialidad (Nariz / Ojos)',
    needleType: 'Aguja Corta Extra-Fina Painless',
    availableGauges: ['30G'],
    threadUsp: 'USP 7.0 Ultra-Fino',
    lengthsAvailable: ['25mm', '38mm'],
    barbStructure: 'Monofilamento dérmico periocular',
    tensilePower: 1,
    primaryIndication: 'Atenuación de ojeras hundidas, patas de gallo y piel fina periocular',
    absorptionMonths: '6 - 8 meses',
    price: 50
  }
];

export const ThreadComparator: React.FC<{
  onSelectProduct: (product: Product) => void;
}> = ({ onSelectProduct }) => {
  const { addToCart } = useCart();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [compareList, setCompareList] = useState<string[]>(['vlift-genesis', 'vlift-cones', 'vlift-premium']);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  const filteredThreads = useMemo(() => {
    if (selectedFilter === 'all') return THREAD_DATABASE;
    return THREAD_DATABASE.filter(t => t.typeCategory === selectedFilter);
  }, [selectedFilter]);

  const toggleCompare = (productId: string) => {
    if (compareList.includes(productId)) {
      setCompareList(compareList.filter(id => id !== productId));
    } else {
      if (compareList.length >= 4) {
        alert('Puedes comparar un máximo de 4 hilos simultáneamente.');
        return;
      }
      setCompareList([...compareList, productId]);
    }
  };

  const selectedForComparison = useMemo(() => {
    return THREAD_DATABASE.filter(t => compareList.includes(t.productId));
  }, [compareList]);

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
        background: 'linear-gradient(135deg, #111827 0%, #1e3a5f 100%)',
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
          background: 'radial-gradient(circle at right center, rgba(45, 156, 218, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '850px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-accent-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <GitCompare size={14} /> Matrix Técnica Oficial V-Lift Pro
            </span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
              Calibres, Agujas, Estructura y Capacidad Tensora
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.3rem)', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#FFFFFF' }}>
            Comparador Técnico de Hilos PDO V-Lift Pro
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
            Analiza lado a lado las especificaciones biomecánicas de cada dispositivo de polidioxanona para seleccionar la técnica idónea para tu paciente.
          </p>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div style={{
        padding: '1.25rem 2rem',
        background: 'var(--bg-light)',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Todos los Hilos (11)' },
            { id: 'Bioestimulación & Redensificación', label: 'Bioestimulación & Malla' },
            { id: 'Lifting & Tracción Pesada', label: 'Lifting & Tracción' },
            { id: 'Especialidad (Nariz / Ojos)', label: 'Especiales (Nariz/Ojos)' }
          ].map(f => {
            const isSelected = selectedFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-light)',
                  background: isSelected ? 'rgba(45, 156, 218, 0.12)' : '#FFFFFF',
                  color: isSelected ? '#1E40AF' : 'var(--text-medium)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Selected count and compare trigger button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)', fontWeight: 600 }}>
            {compareList.length} seleccionados para comparar
          </span>
          <button
            onClick={() => setShowCompareModal(true)}
            disabled={compareList.length < 2}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: compareList.length >= 2 ? 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)' : '#9CA3AF',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: compareList.length >= 2 ? 'pointer' : 'not-allowed',
              boxShadow: compareList.length >= 2 ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <GitCompare size={15} /> Comparar Lado a Lado ({compareList.length})
          </button>
        </div>
      </div>

      {/* 3. Full Comparison Table */}
      <div style={{ overflowX: 'auto', padding: '1rem 2rem 2rem 2rem' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.82rem',
          color: 'var(--text-dark)'
        }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
              <th style={{ padding: '0.85rem 0.75rem', width: '50px' }}>Comparar</th>
              <th style={{ padding: '0.85rem 0.75rem', minWidth: '220px' }}>Dispositivo / Hilo PDO</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Tipo de Aguja / Cánula</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Calibres (Gauge)</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>USP del Hilo</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Estructura Espículas</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>Capacidad Tensora</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Reabsorción</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>Precio</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredThreads.map(thread => {
              const product = products.find(p => p.id === thread.productId);
              const isChecked = compareList.includes(thread.productId);

              return (
                <tr 
                  key={thread.productId}
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                    background: isChecked ? 'rgba(45, 156, 218, 0.03)' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                >
                  {/* Checkbox */}
                  <td style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCompare(thread.productId)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--accent-blue)' }}
                    />
                  </td>

                  {/* Name & Thumbnail */}
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {product && (
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '6px',
                          background: '#FFFFFF',
                          border: '1px solid var(--border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <img 
                            src={getAssetUrl(product.image)} 
                            alt={product.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                          />
                        </div>
                      )}
                      <div>
                        <div 
                          onClick={() => product && onSelectProduct(product)}
                          style={{ fontWeight: 700, color: 'var(--text-dark)', cursor: 'pointer' }}
                          onMouseOver={e => e.currentTarget.style.color = 'var(--accent-blue)'}
                          onMouseOut={e => e.currentTarget.style.color = 'var(--text-dark)'}
                        >
                          {thread.name}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-medium)' }}>
                          {thread.typeCategory}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Needle Type */}
                  <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-medium)' }}>
                    {thread.needleType}
                  </td>

                  {/* Available Gauges */}
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {thread.availableGauges.map(g => (
                        <span 
                          key={g} 
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: '#E2E8F0',
                            color: '#1E293B',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '3px'
                          }}
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Thread USP */}
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                    {thread.threadUsp}
                  </td>

                  {/* Barb Structure */}
                  <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-medium)' }}>
                    {thread.barbStructure}
                  </td>

                  {/* Tensile Rating Stars */}
                  <td style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '2px', color: '#F59E0B' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ opacity: i < thread.tensilePower ? 1 : 0.2 }}>
                          ★
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Reabsorption */}
                  <td style={{ padding: '0.85rem 0.75rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                    {thread.absorptionMonths}
                  </td>

                  {/* Price */}
                  <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right', fontWeight: 700, color: 'var(--primary-dark)' }}>
                    USD ${thread.price.toFixed(2)}
                  </td>

                  {/* Quick Actions */}
                  <td style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      {product && (
                        <button
                          onClick={() => addToCart(product, 1)}
                          title="Añadir 1 caja al carrito"
                          style={{
                            background: 'var(--accent-green-light)',
                            border: '1px solid var(--accent-green)',
                            color: '#03543F',
                            padding: '0.35rem 0.6rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          <ShoppingCart size={13} /> Comprar
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Side-by-Side Comparator Modal */}
      {showCompareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '1000px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              background: 'var(--primary-dark)',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <GitCompare size={20} color="var(--accent-blue)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                  Comparativa Técnica Lado a Lado ({selectedForComparison.length} Dispositivos)
                </h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Content Comparison Grid */}
            <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${selectedForComparison.length}, 1fr)`,
                gap: '1.5rem'
              }}>
                {selectedForComparison.map(thread => {
                  const product = products.find(p => p.id === thread.productId);
                  return (
                    <div
                      key={thread.productId}
                      style={{
                        border: '1px solid var(--border-light)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        background: '#F8FAFC',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}
                    >
                      {/* Thumbnail & Title */}
                      <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                        {product && (
                          <div style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 0.75rem auto',
                            background: '#FFFFFF',
                            borderRadius: '8px',
                            border: '1px solid var(--border-light)',
                            padding: '0.4rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <img src={getAssetUrl(product.image)} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          </div>
                        )}
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-dark)' }}>
                          {thread.name}
                        </h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
                          {thread.typeCategory}
                        </span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '0.5rem' }}>
                          USD ${thread.price.toFixed(2)}
                        </div>
                      </div>

                      {/* Attribute rows */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-medium)', fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>Tipo de Aguja / Cánula:</span>
                          <strong>{thread.needleType}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-medium)', fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>Calibres Disponibles:</span>
                          <strong>{thread.availableGauges.join(', ')}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-medium)', fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>Calibre de Hilo (USP):</span>
                          <strong>{thread.threadUsp}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-medium)', fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>Estructura de Espículas:</span>
                          <strong>{thread.barbStructure}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-medium)', fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>Fuerza Tensora:</span>
                          <div style={{ color: '#F59E0B', fontWeight: 700 }}>
                            {'★'.repeat(thread.tensilePower)}{'☆'.repeat(5 - thread.tensilePower)}
                          </div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-medium)', fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>Indicación Principal:</span>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dark)', lineHeight: 1.35 }}>
                            {thread.primaryIndication}
                          </p>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-medium)', fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>Tiempo de Reabsorción:</span>
                          <strong style={{ color: 'var(--accent-green)' }}>{thread.absorptionMonths}</strong>
                        </div>
                      </div>

                      {/* CTA */}
                      {product && (
                        <button
                          onClick={() => {
                            addToCart(product, 1);
                            setShowCompareModal(false);
                          }}
                          className="btn-primary"
                          style={{
                            justifyContent: 'center',
                            padding: '0.65rem',
                            fontSize: '0.8rem',
                            marginTop: 'auto'
                          }}
                        >
                          <ShoppingCart size={14} /> Comprar Insumo
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.75rem',
              background: '#F8FAFC',
              borderTop: '1px solid var(--border-light)',
              textAlign: 'right'
            }}>
              <button
                onClick={() => setShowCompareModal(false)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  background: '#FFFFFF',
                  color: 'var(--text-dark)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cerrar Comparador
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
