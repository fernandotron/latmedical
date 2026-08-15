import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  CheckCircle2, 
  ShoppingCart, 
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

interface TreatmentProtocol {
  id: string;
  name: string;
  category: 'Hilos PDO' | 'Medicina Regenerativa';
  description: string;
  suggestedFee: number; // Suggested market price to charge the patient (USD)
  typicalSessions: number;
  badge: string;
  items: {
    productId: string;
    quantity: number;
    role: string;
  }[];
}

const PRESET_PROTOCOLS: TreatmentProtocol[] = [
  {
    id: 'lifting-full-face',
    name: 'Lifting Facial Vectorial Completo',
    category: 'Hilos PDO',
    description: 'Protocolo de alta tracción y recolocación de volumen malar y mandibular. Combina hilos espiculados Genesis / Cones con hilos Mono de redensificación.',
    suggestedFee: 750,
    typicalSessions: 1,
    badge: 'Máxima Demanda',
    items: [
      { productId: 'vlift-cones', quantity: 1, role: '4-8 hilos de suspensión y anclaje malar/mandibular' },
      { productId: 'vlift-genesis', quantity: 1, role: 'Tracción vectorial en vectores cortos' },
      { productId: 'vlift-mono', quantity: 1, role: 'Redensificación de soporte dérmico' }
    ]
  },
  {
    id: 'rinomodelacion-pdo',
    name: 'Rinomodelación Biológica no Quirúrgica',
    category: 'Hilos PDO',
    description: 'Elevación de la punta nasal, alineación de dorso y afinamiento de alas nasales con hilos rígidos específicos.',
    suggestedFee: 400,
    typicalSessions: 1,
    badge: 'Alta Rentabilidad',
    items: [
      { productId: 'vlift-nose', quantity: 1, role: 'Sobre de 4 hilos PDO rígidos específicos para cartílago nasal' }
    ]
  },
  {
    id: 'bioestimulacion-cuello-rostro',
    name: 'Bioestimulación Intensiva Rostro & Cuello',
    category: 'Hilos PDO',
    description: 'Malla biológica redensificante para recuperar firmeza, tono dérmico y atenuar pliegues en cuello y mejillas.',
    suggestedFee: 350,
    typicalSessions: 1,
    badge: 'Procedimiento Rápido',
    items: [
      { productId: 'vlift-mono', quantity: 2, role: 'Bioestimulación dérmica en malla' },
      { productId: 'vlift-single-screw', quantity: 1, role: 'Efecto muelle en surcos peribucales' }
    ]
  },
  {
    id: 'seffiller-facial',
    name: 'Terapia Celular Autóloga SEFFILLER®',
    category: 'Medicina Regenerativa',
    description: 'Microinjerto estandarizado de tejido adiposo y SVF rico en células madre mesenquimales (ADSCs) para regeneración facial completa.',
    suggestedFee: 1200,
    typicalSessions: 1,
    badge: 'Premium Regenerativo',
    items: [
      { productId: 'seffi-filler', quantity: 1, role: 'Kit quirúrgico estéril desechable todo en uno SEFFILLER' }
    ]
  },
  {
    id: 'seffihair-capilar',
    name: 'Tricología Médica Celular SEFFIHAIR®',
    category: 'Medicina Regenerativa',
    description: 'Tratamiento celular para alopecia androgenética y efluvios mediante factores autólogos y células estromales vasculares.',
    suggestedFee: 1100,
    typicalSessions: 1,
    badge: 'Tratamiento Exclusivo',
    items: [
      { productId: 'seffi-hair', quantity: 1, role: 'Kit específico capilar SEFFIHAIR estéril' }
    ]
  },
  {
    id: 'seffigyn-intimo',
    name: 'Ginecoestética Regenerativa SEFFIGYN®',
    category: 'Medicina Regenerativa',
    description: 'Restauración funcional y bioplastia de mucosa y tejidos íntimos para atrofia vulvovaginal y laxitud.',
    suggestedFee: 1500,
    typicalSessions: 1,
    badge: 'Alta Especialidad',
    items: [
      { productId: 'seffi-gyn', quantity: 1, role: 'Kit ginecológico patentado SEFFIGYN' }
    ]
  }
];

export const RoiCalculator: React.FC<{ onNavigateToCatalog?: () => void; onContact?: () => void; onBack?: () => void }> = ({ onNavigateToCatalog, onContact: _onContact, onBack }) => {
  const { addToCart } = useCart();
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>(PRESET_PROTOCOLS[0].id);
  const [customFee, setCustomFee] = useState<number>(PRESET_PROTOCOLS[0].suggestedFee);
  const [patientsPerMonth, setPatientsPerMonth] = useState<number>(6);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const selectedProtocol = useMemo(() => {
    return PRESET_PROTOCOLS.find(p => p.id === selectedProtocolId) || PRESET_PROTOCOLS[0];
  }, [selectedProtocolId]);

  // Handle change of preset protocol
  const handleProtocolSelect = (protocol: TreatmentProtocol) => {
    setSelectedProtocolId(protocol.id);
    setCustomFee(protocol.suggestedFee);
  };

  // Calculate supply cost based on products in the protocol
  const supplyCost = useMemo(() => {
    return selectedProtocol.items.reduce((total, item) => {
      const prod = products.find(p => p.id === item.productId);
      const price = prod ? prod.price : 0;
      return total + (price * item.quantity);
    }, 0);
  }, [selectedProtocol]);

  // Financial calculations
  const grossIncomePerPatient = customFee;
  const netMarginPerPatient = Math.max(0, grossIncomePerPatient - supplyCost);
  const profitMarginPercent = grossIncomePerPatient > 0 
    ? Math.round((netMarginPerPatient / grossIncomePerPatient) * 100) 
    : 0;
  const roiMultiplier = supplyCost > 0 ? (grossIncomePerPatient / supplyCost).toFixed(1) : '0';

  const monthlyGrossRevenue = grossIncomePerPatient * patientsPerMonth;
  const monthlySupplyCost = supplyCost * patientsPerMonth;
  const monthlyNetProfit = netMarginPerPatient * patientsPerMonth;
  const annualNetProfit = monthlyNetProfit * 12;

  // Add all protocol supplies directly to cart
  const handleAddSuppliesToCart = () => {
    selectedProtocol.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity);
      }
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3500);
  };

  return (
    <div style={{ fontFamily: "'Montserrat', 'Open Sans', sans-serif", background: '#f8fafc', animation: 'fadeIn 0.5s ease' }}>
      
      {/* 1. HERO HEADER BANNER (V-LIFT / SEFFILINE STYLE) */}
      <section style={{
        position: 'relative',
        background: `linear-gradient(rgba(17, 24, 39, 0.84), rgba(17, 24, 39, 0.94)), url("/vlift-texture.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '8rem 0 5rem 0',
        color: '#ffffff'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '0.5rem 1.1rem',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                backdropFilter: 'blur(8px)',
                marginBottom: '1.75rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
            >
              <ArrowLeft size={16} /> Volver
            </button>
          )}

          <div style={{ maxWidth: '850px' }}>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#c0a063',
              marginBottom: '0.6rem'
            }}>
              SIMULADOR FINANCIERO MÉDICO · RENTABILIDAD B2B
            </p>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 1rem 0',
              color: '#FFFFFF',
              letterSpacing: '-0.02em'
            }}>
              Calculadora de Rentabilidad (ROI) Médica
            </h1>

            <p style={{
              color: '#cbd5e1',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 0 2rem 0'
            }}>
              Simula tus ingresos, costo de insumos médicos y margen neto por tratamiento con dispositivos <strong>V-Lift Pro</strong> y kits <strong>Seffiline</strong>.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <Calculator size={14} color="#c0a063" /> Basado en Precios Mayoristas Oficiales
              </span>
              <span style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <TrendingUp size={14} color="#34d399" /> Simulación de Margen Neto & Retorno
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Container */}
      <div className="container" style={{ padding: '3.5rem 1.5rem 6rem 1.5rem' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}>

      {/* 2. Main Content Grid */}
      <div style={{ padding: '2rem' }}>
        
        {/* Step 1: Select Protocol */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>1</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>
              Selecciona el Procedimiento a Evaluar
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {PRESET_PROTOCOLS.map(protocol => {
              const isSelected = protocol.id === selectedProtocolId;
              return (
                <div
                  key={protocol.id}
                  onClick={() => handleProtocolSelect(protocol)}
                  style={{
                    padding: '1.15rem',
                    borderRadius: '12px',
                    border: `2px solid ${isSelected ? 'var(--accent-green)' : 'var(--border-light)'}`,
                    background: isSelected ? 'rgba(41, 192, 147, 0.05)' : 'var(--bg-white)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      background: protocol.category === 'Hilos PDO' ? '#EBF5FF' : '#F0FDF4',
                      color: protocol.category === 'Hilos PDO' ? '#1E40AF' : '#166534'
                    }}>
                      {protocol.category}
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--accent-green)',
                      background: 'rgba(41, 192, 147, 0.1)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}>
                      {protocol.badge}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 0.35rem 0' }}>
                    {protocol.name}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', margin: 0, lineHeight: 1.4 }}>
                    {protocol.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Configure Fees and Volume */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          background: 'var(--bg-light)',
          padding: '1.75rem',
          borderRadius: '12px',
          border: '1px solid var(--border-light)',
          marginBottom: '2rem'
        }}>
          {/* Fee input */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--accent-green)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>2</div>
              <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                Honorario cobrado al paciente (USD)
              </label>
            </div>
            
            <div style={{ position: 'relative', maxWidth: '280px' }}>
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontWeight: 700,
                color: 'var(--text-dark)'
              }}>USD $</span>
              <input
                type="number"
                min="50"
                max="10000"
                step="25"
                value={customFee}
                onChange={e => setCustomFee(Math.max(0, parseFloat(e.target.value) || 0))}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 4.5rem',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: '2px solid var(--border-light)',
                  color: 'var(--primary-dark)',
                  background: 'var(--bg-white)',
                  outline: 'none'
                }}
              />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-medium)', marginTop: '0.4rem', margin: '0.4rem 0 0 0' }}>
              Precio de mercado sugerido: <strong>USD ${selectedProtocol.suggestedFee}</strong>
            </p>
          </div>

          {/* Volume slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--accent-green)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}>3</div>
                <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                  Pacientes mensuales proyectados
                </label>
              </div>
              <span style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--accent-green)',
                background: 'rgba(41, 192, 147, 0.1)',
                padding: '0.2rem 0.75rem',
                borderRadius: '6px'
              }}>
                {patientsPerMonth} {patientsPerMonth === 1 ? 'paciente' : 'pacientes'} / mes
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="30"
              value={patientsPerMonth}
              onChange={e => setPatientsPerMonth(parseInt(e.target.value, 10))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '5px',
                background: 'var(--border-light)',
                outline: 'none',
                accentColor: 'var(--accent-green)',
                cursor: 'pointer'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-medium)', marginTop: '0.25rem' }}>
              <span>1 pac./mes</span>
              <span>15 pac./mes</span>
              <span>30 pac./mes</span>
            </div>
          </div>
        </div>

        {/* Step 3: Financial Summary & ROI Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {/* Card 1: Cost per procedure */}
          <div style={{
            background: 'var(--bg-white)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)', fontWeight: 600, textTransform: 'uppercase' }}>
              Inversión en Insumos
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0.35rem 0' }}>
              USD ${supplyCost.toFixed(2)}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-medium)', margin: 0 }}>
              Costo total de materiales estériles por paciente.
            </p>
          </div>

          {/* Card 2: Net Margin per patient */}
          <div style={{
            background: 'var(--bg-white)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-medium)', fontWeight: 600, textTransform: 'uppercase' }}>
              Ganancia Neta por Paciente
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-green)', margin: '0.35rem 0' }}>
              USD ${netMarginPerPatient.toFixed(2)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-dark)', fontWeight: 600 }}>
              <span style={{
                background: '#DEF7EC',
                color: '#03543F',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px',
                fontWeight: 700
              }}>
                {profitMarginPercent}% de Margen
              </span>
              <span>(Factor {roiMultiplier}x)</span>
            </div>
          </div>

          {/* Card 3: Monthly Net Profit */}
          <div style={{
            background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
            color: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              opacity: 0.15,
              color: 'var(--accent-green)'
            }}>
              <TrendingUp size={90} />
            </div>

            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase' }}>
              Utilidad Neta Mensual
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38EF7D', margin: '0.35rem 0' }}>
              USD ${monthlyNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', margin: '0.25rem 0 0 0' }}>
              Facturación: <strong>USD ${monthlyGrossRevenue.toFixed(0)}</strong> | Insumos: <strong>USD ${monthlySupplyCost.toFixed(0)}</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', margin: '0.25rem 0 0 0' }}>
              Proyección anual: <strong>USD ${annualNetProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
            </p>
          </div>
        </div>

        {/* Step 4: Breakdown of Supplies Included in this Protocol */}
        <div style={{
          background: 'var(--bg-white)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>
                Insumos requeridos para {selectedProtocol.name}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', margin: 0 }}>
                Dispositivos médicos oficiales y estériles con certificación ANMAT
              </p>
            </div>

            <button
              onClick={handleAddSuppliesToCart}
              disabled={addedSuccess}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: addedSuccess ? '#059669' : 'var(--accent-gradient)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {addedSuccess ? (
                <>
                  <CheckCircle2 size={18} /> ¡Insumos Agregados al Carrito!
                </>
              ) : (
                <>
                  <ShoppingCart size={18} /> Adquirir Kit de Insumos (USD ${supplyCost})
                </>
              )}
            </button>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {selectedProtocol.items.map((item, idx) => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-light)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '6px',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                        {item.quantity}x {product.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)' }}>
                        {item.role}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-dark)' }}>
                      USD ${(product.price * item.quantity).toFixed(2)}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                      Stock Disponible
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Institutional notice & catalog link */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          background: 'rgba(41, 192, 147, 0.08)',
          border: '1px solid rgba(41, 192, 147, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
            <ShieldCheck size={22} color="var(--accent-green)" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dark)', lineHeight: 1.4 }}>
              <strong>Respaldo de Distribución Oficial:</strong> Todos los valores son orientativos basados en promedios de mercado estético en Argentina y Latinoamérica. Los precios mayoristas de insumos incluyen IVA y despacho prioritario.
            </p>
          </div>

          {onNavigateToCatalog && (
            <button
              onClick={onNavigateToCatalog}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid var(--accent-green)',
                background: '#FFFFFF',
                color: 'var(--accent-green)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Ver Catálogo Completo →
            </button>
          )}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};
