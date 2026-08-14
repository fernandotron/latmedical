import React, { useState } from 'react';
import { useInventory, ClearanceOffer } from '../context/InventoryContext';
import { useCart } from '../context/CartContext';
import { products, Product } from '../data/products';
import { 
  Flame, 
  ShieldCheck, 
  Clock, 
  Check, 
  AlertTriangle, 
  ArrowLeft, 
  ShoppingCart, 
  Package,
  TrendingDown,
  FileCheck2
} from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

interface ClearancePageProps {
  onBackToCatalog: () => void;
  onViewProduct?: (product: Product) => void;
}

export const ClearancePage: React.FC<ClearancePageProps> = ({ onBackToCatalog }) => {
  const { clearanceOffers } = useInventory();
  const { addToCart } = useCart();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedFeedbacks, setAddedFeedbacks] = useState<Record<string, boolean>>({});
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'Vlift Pro' | 'Seffiline'>('all');

  const activeOffers = clearanceOffers.filter(o => o.active && o.stock > 0);

  const filteredOffers = activeOffers.filter(o => {
    if (selectedBrand === 'all') return true;
    return o.brand === selectedBrand;
  });

  const getQty = (id: string) => quantities[id] || 1;

  const handleQtyChange = (id: string, val: number, maxStock: number) => {
    const validQty = Math.max(1, Math.min(val, maxStock));
    setQuantities(prev => ({ ...prev, [id]: validQty }));
  };

  const handleAddToCart = (offer: ClearanceOffer) => {
    const product = products.find(p => p.id === offer.productId) || {
      id: offer.productId,
      name: offer.productName,
      brand: offer.brand as any,
      category: 'Hilos PDO' as any,
      shortDesc: offer.note || '',
      description: offer.note || '',
      features: [],
      specs: [],
      image: offer.image,
      price: offer.regularPrice
    };

    const qty = getQty(offer.id);

    addToCart(
      product,
      qty,
      offer.variantName,
      offer.clearancePrice,
      {
        isClearance: true,
        clearanceId: offer.id,
        expiryDate: offer.expiryDate,
        batchNumber: offer.batchNumber,
        maxStock: offer.stock
      }
    );

    setAddedFeedbacks(prev => ({ ...prev, [offer.id]: true }));
    setTimeout(() => {
      setAddedFeedbacks(prev => ({ ...prev, [offer.id]: false }));
    }, 2000);
  };

  return (
    <div style={{ paddingTop: 'var(--header-height)', animation: 'fadeIn 0.4s ease' }}>
      
      {/* 100% FULL-WIDTH MEDICAL OUTLET HERO BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, #091b2e 0%, #0d2847 50%, #034b75 100%)',
        color: '#ffffff',
        padding: 'clamp(2.5rem, 5vw, 4.5rem) 0',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Subtle decorative grid lines */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          
          {/* Back button */}
          <div style={{ marginBottom: '1.75rem' }}>
            <button
              onClick={onBackToCatalog}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#e2e8f0',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#e2e8f0';
              }}
            >
              <ArrowLeft size={15} /> Volver al Catálogo Regular
            </button>
          </div>

          <div style={{ maxWidth: '900px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.25) 0%, rgba(220, 38, 38, 0.25) 100%)', border: '1px solid rgba(251, 146, 60, 0.5)', padding: '0.35rem 0.95rem', borderRadius: '30px', marginBottom: '1.25rem' }}>
              <Flame size={15} color="#fb923c" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffedd5' }}>
                OUTLET MÉDICO B2B • VENTA EXCLUSIVA PROFESIONAL
              </span>
            </div>

            <h1 style={{ 
              color: '#ffffff', 
              fontSize: 'clamp(2rem, 3.8vw, 3.1rem)', 
              fontWeight: 800, 
              lineHeight: 1.15, 
              margin: '0 0 1.25rem 0',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              Oportunidades Médicas • <span style={{ color: '#03bfd7' }}>Lotes con Descuento</span>
            </h1>

            <p style={{ 
              color: '#e2e8f0', 
              fontSize: 'clamp(0.95rem, 1.8vw, 1.08rem)', 
              lineHeight: 1.6, 
              margin: '0 0 2.5rem 0', 
              maxWidth: '800px' 
            }}>
              Insumos estéticos y quirúrgicos originales con empaque indemne y <strong>100% de esterilidad garantizada de fábrica</strong>. Precios reducidos exclusivos por rotación de lotes para profesionales con alto volumen de procedimientos inmediatos.
            </p>

            {/* Value proposition badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '1rem 1.15rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <ShieldCheck size={24} color="#34d399" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>Esterilidad Certificada</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1' }}>Sellado original intacto de fábrica</p>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '1rem 1.15rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <FileCheck2 size={24} color="#38bdf8" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>Trazabilidad & Lote</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1' }}>Fecha de caducidad declarada</p>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '1rem 1.15rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <TrendingDown size={24} color="#fb923c" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>Descuentos del 20% al 60%</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1' }}>Ahorro directo en compra por lote</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* OFFERS LISTING CONTAINER */}
      <section style={{ padding: '3.5rem 0 6rem 0', background: '#f8fafc' }}>
        <div className="container">
          
          {/* Filter and Title bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '1.25rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={22} color="#ea580c" /> Lotes Disponibles en Liquidación ({filteredOffers.length})
              </h2>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-medium)' }}>
                Stock limitado estrictamente a las unidades declaradas por lote. Se despachan por orden de compra confirmada.
              </p>
            </div>

            {/* Brand Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', background: '#e2e8f0', padding: '0.25rem', borderRadius: '8px' }}>
              <button
                onClick={() => setSelectedBrand('all')}
                style={{
                  border: 'none',
                  background: selectedBrand === 'all' ? '#ffffff' : 'transparent',
                  color: selectedBrand === 'all' ? 'var(--primary-dark)' : 'var(--text-medium)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  boxShadow: selectedBrand === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
              >
                Todas las Marcas
              </button>
              <button
                onClick={() => setSelectedBrand('Vlift Pro')}
                style={{
                  border: 'none',
                  background: selectedBrand === 'Vlift Pro' ? '#ffffff' : 'transparent',
                  color: selectedBrand === 'Vlift Pro' ? 'var(--primary-dark)' : 'var(--text-medium)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  boxShadow: selectedBrand === 'Vlift Pro' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
              >
                V Lift Pro
              </button>
              <button
                onClick={() => setSelectedBrand('Seffiline')}
                style={{
                  border: 'none',
                  background: selectedBrand === 'Seffiline' ? '#ffffff' : 'transparent',
                  color: selectedBrand === 'Seffiline' ? 'var(--primary-dark)' : 'var(--text-medium)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  boxShadow: selectedBrand === 'Seffiline' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
              >
                Seffiline
              </button>
            </div>
          </div>

          {/* OFFERS GRID */}
          {filteredOffers.length === 0 ? (
            <div style={{
              background: '#ffffff',
              border: '1px dashed var(--border-light)',
              borderRadius: '16px',
              padding: '4rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <Package size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--primary-dark)' }}>
                No hay lotes de liquidación activos en este momento
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', maxWidth: '480px', margin: 0 }}>
                Todos los productos del inventario actual cuentan con vigencia estándar. Puedes consultar el catálogo regular para realizar tus pedidos habituales.
              </p>
              <button
                onClick={onBackToCatalog}
                className="btn-primary"
                style={{ marginTop: '0.5rem', padding: '0.7rem 1.75rem', fontSize: '0.85rem' }}
              >
                Ver Catálogo Regular
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem'
            }}>
              {filteredOffers.map((offer) => {
                const currentQty = getQty(offer.id);
                const isAdded = addedFeedbacks[offer.id] || false;
                const discountPct = offer.regularPrice > 0 
                  ? Math.round(((offer.regularPrice - offer.clearancePrice) / offer.regularPrice) * 100)
                  : 0;

                // Find parent product to ensure high-resolution packaging image fallback
                const parentProduct = products.find(p => p.id === offer.productId);
                const finalImage = (offer.image && offer.image !== '/logo-symbol.png') 
                  ? offer.image 
                  : (parentProduct?.image || '/logo-symbol.png');

                return (
                  <div
                    key={offer.id}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #fed7aa',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px -5px rgba(251, 146, 60, 0.12)',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 20px 35px -10px rgba(251, 146, 60, 0.22)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(251, 146, 60, 0.12)';
                    }}
                  >
                    {/* Top Bar with Expiration Badge and Discount Pill */}
                    <div style={{
                      background: 'linear-gradient(90deg, #fff7ed 0%, #ffedd5 100%)',
                      padding: '0.75rem 1.15rem',
                      borderBottom: '1px solid #fed7aa',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: '#c2410c'
                      }}>
                        <Clock size={15} /> Vence: <strong>{offer.expiryDate}</strong>
                      </span>

                      {discountPct > 0 && (
                        <span style={{
                          background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
                          color: '#ffffff',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '20px',
                          letterSpacing: '0.02em',
                          boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)'
                        }}>
                          -{discountPct}% OFF
                        </span>
                      )}
                    </div>

                    {/* Image container */}
                    <div style={{
                      height: '190px',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1.25rem',
                      position: 'relative',
                      borderBottom: '1px solid #f1f5f9'
                    }}>
                      <img
                        src={getAssetUrl(finalImage)}
                        alt={offer.productName}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                      <div style={{ position: 'absolute', bottom: '8px', left: '12px' }}>
                        <span className="badge badge-dark" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem' }}>{offer.brand}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)', margin: '0 0 0.35rem 0' }}>
                        {offer.productName}
                      </h3>

                      {offer.variantName && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <span style={{
                            background: 'rgba(3, 191, 215, 0.1)',
                            color: '#0284c7',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.6rem',
                            borderRadius: '4px',
                            display: 'inline-block'
                          }}>
                            Medida: {offer.variantName}
                          </span>
                        </div>
                      )}

                      {offer.note && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', lineHeight: 1.45, margin: '0 0 1rem 0', flexGrow: 1 }}>
                          {offer.note}
                        </p>
                      )}

                      {/* Stock Alert bar */}
                      <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        padding: '0.65rem 0.9rem',
                        marginBottom: '1.25rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <AlertTriangle size={13} color="#dc2626" /> Lote Limitado
                          </span>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#b91c1c' }}>
                            ¡Solo {offer.stock} {offer.stock === 1 ? 'unidad' : 'unidades'}!
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '5px', background: '#fee2e2', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${Math.min(100, Math.max(20, (offer.stock / 10) * 100))}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #f97316 0%, #ef4444 100%)',
                            borderRadius: '10px'
                          }} />
                        </div>
                      </div>

                      {/* Price and Cart Action */}
                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', textDecoration: 'line-through' }}>
                              Precio regular: USD ${offer.regularPrice.toFixed(2)}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginTop: '0.1rem' }}>
                              <span style={{ fontSize: '0.82rem', color: 'var(--text-medium)', fontWeight: 700 }}>USD</span>
                              <span style={{ fontSize: '1.55rem', fontWeight: 900, color: '#c2410c' }}>
                                ${offer.clearancePrice.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {offer.batchNumber && (
                            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                              {offer.batchNumber}
                            </span>
                          )}
                        </div>

                        {/* Quantity & CTA */}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid var(--border-light)',
                            borderRadius: '6px',
                            height: '40px',
                            background: '#f8fafc'
                          }}>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(offer.id, currentQty - 1, offer.stock)}
                              style={{ background: 'none', border: 'none', width: '32px', height: '100%', cursor: 'pointer', fontWeight: 700 }}
                              disabled={currentQty <= 1}
                            >
                              -
                            </button>
                            <span style={{ width: '28px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                              {currentQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(offer.id, currentQty + 1, offer.stock)}
                              style={{ background: 'none', border: 'none', width: '32px', height: '100%', cursor: 'pointer', fontWeight: 700 }}
                              disabled={currentQty >= offer.stock}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(offer)}
                            style={{
                              flex: 1,
                              height: '40px',
                              background: isAdded ? 'var(--success)' : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.45rem',
                              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
                              transition: 'all 0.2s',
                              fontFamily: 'inherit'
                            }}
                          >
                            {isAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
                            {isAdded ? '¡Añadido al Carrito!' : 'Comprar Lote'}
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

    </div>
  );
};
