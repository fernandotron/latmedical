import React, { useState } from 'react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';
import { useCurrency } from '../context/CurrencyContext';
import { Check, Eye } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const { inventory } = useInventory();
  const { formatPrice } = useCurrency();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleQtyChange = (val: number) => {
    if (val < 1) return;
    setQty(val);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card details click
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const inv = inventory.find(i => i.productId === product.id);
  const isOutOfStock = inv 
    ? (inv.hasVariants 
        ? (inv.variants || []).every(v => v.stock <= 0) 
        : inv.stock <= 0) 
    : false;

  return (
    <div 
      onClick={() => onViewDetails(product)}
      style={{
        background: 'var(--bg-white)',
        border: '1px solid var(--border-light)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        transition: 'var(--transition-medium)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        cursor: 'pointer'
      }}
      className="product-card-hover"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Product Image and Badges */}
      <div style={{ position: 'relative', height: '190px', overflow: 'hidden', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem' }}>
        <img 
          src={getAssetUrl(product.image)} 
          alt={product.name} 
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.triedFallback) {
              target.dataset.triedFallback = 'true';
              target.src = getAssetUrl('/images/products/mono.png');
            }
          }}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transition: 'transform 0.4s ease',
            opacity: isOutOfStock ? 0.35 : 1
          }}
          className="product-card-img"
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          pointerEvents: 'none',
          zIndex: 11
        }}>
          <span className="badge badge-brand">{product.brand}</span>
          <span className="badge badge-accent-green">{product.category}</span>
        </div>

        {isOutOfStock && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(1.5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none'
          }}>
            <div style={{
              background: '#ef4444',
              color: '#ffffff',
              padding: '0.5rem 1.25rem',
              borderRadius: '30px',
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              boxShadow: '0 8px 16px rgba(239, 68, 68, 0.35)',
              transform: 'rotate(-5deg)',
              border: '2px solid #ffffff'
            }}>
              Sin Stock
            </div>
          </div>
        )}
      </div>

      {/* Product Info Body */}
      <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
          {product.name}
        </h3>
        <p style={{ 
          fontSize: '0.82rem', 
          color: 'var(--text-medium)', 
          marginBottom: '1rem',
          flexGrow: 1,
          lineHeight: '1.5'
        }}>
          {product.shortDesc}
        </p>

        {/* View details quick trigger */}
        <div style={{
          fontSize: '0.8rem',
          color: '#0891b2',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          marginBottom: '1rem'
        }}>
          <Eye size={14} /> Ver Ficha Técnica Completa →
        </div>

        {/* E-commerce controls row */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '1rem',
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem'
        }}>
          {/* Price display */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 500 }}>Precio Profesional</span>
            <span style={{ 
              fontSize: '0.88rem', 
              color: '#0891b2', 
              fontWeight: 800,
              background: 'rgba(3, 191, 215, 0.12)',
              border: '1px solid rgba(3, 191, 215, 0.3)',
              padding: '0.2rem 0.6rem',
              borderRadius: '6px'
            }}>
              {(() => {
                if (inv && inv.hasVariants && inv.variants && inv.variants.length > 0) {
                  const prices = inv.variants.map(v => v.price !== undefined ? v.price : product.price).filter(p => !isNaN(p));
                  if (prices.length > 0) {
                    const minP = Math.min(...prices);
                    const maxP = Math.max(...prices);
                    if (minP !== maxP) {
                      return `Desde ${formatPrice(minP)}`;
                    }
                    return formatPrice(minP);
                  }
                }
                return formatPrice(product.price || 0);
              })()}
            </span>
          </div>

          {/* Quick Add controls */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--border-light)',
              borderRadius: '4px',
              height: '34px',
              background: 'var(--bg-light)'
            }}>
              <button
                onClick={() => handleQtyChange(qty - 1)}
                disabled={isOutOfStock}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  width: '26px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isOutOfStock ? '#cbd5e1' : 'var(--text-medium)',
                  fontWeight: 'bold'
                }}
              >
                -
              </button>
              <span style={{
                width: '22px',
                textAlign: 'center',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: isOutOfStock ? '#9ca3af' : 'inherit'
              }}>{isOutOfStock ? 0 : qty}</span>
              <button
                onClick={() => handleQtyChange(qty + 1)}
                disabled={isOutOfStock}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  width: '26px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isOutOfStock ? '#cbd5e1' : 'var(--text-medium)',
                  fontWeight: 'bold'
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="btn-primary"
              style={{
                flexGrow: 1,
                justifyContent: 'center',
                height: '34px',
                padding: 0,
                fontSize: '0.8rem',
                borderRadius: '4px',
                background: isOutOfStock ? '#9ca3af' : (added ? 'var(--success)' : 'var(--accent-gradient)'),
                cursor: isOutOfStock ? 'not-allowed' : 'pointer'
              }}
              disabled={added || isOutOfStock}
            >
              {isOutOfStock ? (
                <span>Sin Stock</span>
              ) : added ? (
                <>
                  <Check size={14} color="white" />
                  <span>Comprado</span>
                </>
              ) : (
                <span>Comprar</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .product-card-hover:hover .product-card-img {
          transform: scale(1.04);
        }
      `}</style>
    </div>
  );
};
