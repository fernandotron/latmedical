import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2
} from 'lucide-react';
import { products, Product } from '../data/products';
import { useInventory } from '../context/InventoryContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { getAssetUrl } from '../utils/assets';

interface OrderItemRow {
  productId: string;
  variantId?: string;
  productName: string;
  brand: string;
  category: string;
  variantName: string;
  stock: number;
  unitPriceUSD: number;
  image: string;
  product: Product;
}

import { ArrowLeft } from 'lucide-react';

export const QuickOrderPad: React.FC<{
  onSelectProduct?: (product: Product) => void;
  onBackToCatalog?: () => void;
}> = ({ onSelectProduct, onBackToCatalog }) => {
  const { inventory } = useInventory();
  const { addToCart } = useCart();
  const { currency, exchangeRate, formatPrice } = useCurrency();

  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  // Flatten all products and variants into row items
  const allOrderRows: OrderItemRow[] = useMemo(() => {
    const rows: OrderItemRow[] = [];

    products.forEach(p => {
      const inv = inventory.find(i => i.productId === p.id);
      if (inv && inv.hasVariants && inv.variants && inv.variants.length > 0) {
        inv.variants.forEach(v => {
          const vPrice = v.price !== undefined ? v.price : p.price;
          rows.push({
            productId: p.id,
            variantId: v.id,
            productName: p.name,
            brand: p.brand,
            category: p.category,
            variantName: v.name,
            stock: v.stock,
            unitPriceUSD: vPrice,
            image: p.image,
            product: p
          });
        });
      } else {
        rows.push({
          productId: p.id,
          productName: p.name,
          brand: p.brand,
          category: p.category,
          variantName: 'Estándar / Kit Único',
          stock: inv ? inv.stock : 0,
          unitPriceUSD: p.price,
          image: p.image,
          product: p
        });
      }
    });

    return rows;
  }, [inventory]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return allOrderRows.filter(r => {
      const matchBrand = filterBrand === 'all' || r.brand === filterBrand;
      const matchSearch = r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.variantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBrand && matchSearch;
    });
  }, [allOrderRows, filterBrand, searchQuery]);

  const handleQtyChange = (key: string, qty: number, maxStock: number) => {
    const validQty = Math.max(0, Math.min(qty, maxStock));
    setSelectedQuantities(prev => ({
      ...prev,
      [key]: validQty
    }));
  };

  const handleIncrement = (key: string, amount: number, maxStock: number) => {
    const current = selectedQuantities[key] || 0;
    handleQtyChange(key, current + amount, maxStock);
  };

  const handleClearAll = () => {
    setSelectedQuantities({});
  };

  // Calculations
  const orderSummary = useMemo(() => {
    let totalUnits = 0;
    let totalUSD = 0;
    const itemsToAdd: { row: OrderItemRow; qty: number }[] = [];

    allOrderRows.forEach(row => {
      const key = row.variantId ? `${row.productId}-${row.variantId}` : row.productId;
      const qty = selectedQuantities[key] || 0;
      if (qty > 0) {
        totalUnits += qty;
        totalUSD += qty * row.unitPriceUSD;
        itemsToAdd.push({ row, qty });
      }
    });

    return { totalUnits, totalUSD, itemsToAdd };
  }, [allOrderRows, selectedQuantities]);

  // Add all selected items to cart
  const handleAddAllToCart = () => {
    if (orderSummary.itemsToAdd.length === 0) return;

    orderSummary.itemsToAdd.forEach(({ row, qty }) => {
      addToCart(row.product, qty, row.variantId ? row.variantName : undefined, row.unitPriceUSD);
    });

    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
      setSelectedQuantities({});
    }, 2500);
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
          {onBackToCatalog && (
            <button
              onClick={onBackToCatalog}
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
              <ArrowLeft size={16} /> Volver al Catálogo
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
              MATRIZ MASIVA B2B · CLÍNICAS Y QUIRÓFANOS
            </p>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 1rem 0',
              color: '#FFFFFF',
              letterSpacing: '-0.02em'
            }}>
              Pedido Rápido B2B (Matriz de Calibres)
            </h1>

            <p style={{
              color: '#cbd5e1',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 0 2rem 0'
            }}>
              Selecciona cantidades masivas de múltiples calibres de hilos PDO V-Lift Pro y kits Seffiline en un solo panel consolidado y agrégalos al carrito con un solo clic.
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
                <Zap size={14} color="#c0a063" /> Carga Masiva Multi-Calibre
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
                <ShoppingCart size={14} color="#34d399" /> Agregado Consolidado al Carrito
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

      {/* 2. Control Bar */}
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
        {/* Brand Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Todos los Calibres (31)' },
            { id: 'Vlift Pro', label: 'Hilos PDO V-Lift Pro (27 calibres)' },
            { id: 'Seffiline', label: 'Terapia Celular Seffiline (4 kits)' }
          ].map(f => {
            const isSelected = filterBrand === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilterBrand(f.id)}
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

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="var(--text-light)" style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Buscar por calibre (ej: 19G, 30G, Cones)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              padding: '0 0.75rem 0 2rem',
              borderRadius: '6px',
              border: '1px solid var(--border-light)',
              fontSize: '0.85rem',
              outline: 'none',
              background: '#FFFFFF'
            }}
          />
        </div>
      </div>

      {/* 3. Bulk Order Matrix Table */}
      <div style={{ overflowX: 'auto', padding: '1rem 2rem 5.5rem 2rem' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.82rem',
          color: 'var(--text-dark)'
        }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
              <th style={{ padding: '0.85rem 0.75rem', minWidth: '220px' }}>Dispositivo Médico</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Marca / Línea</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Calibre / Medida</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>Disponibilidad</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>Precio Unitario</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '170px' }}>Cantidad</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'right', minWidth: '100px' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map(row => {
              const key = row.variantId ? `${row.productId}-${row.variantId}` : row.productId;
              const currentQty = selectedQuantities[key] || 0;
              const isOutOfStock = row.stock <= 0;
              const rowSubtotalUSD = currentQty * row.unitPriceUSD;

              return (
                <tr
                  key={key}
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                    background: currentQty > 0 ? 'rgba(41, 192, 147, 0.04)' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                >
                  {/* Product Name & Thumbnail */}
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
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
                          src={getAssetUrl(row.image)} 
                          alt={row.productName} 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                        />
                      </div>
                      <div>
                        <div 
                          onClick={() => onSelectProduct && onSelectProduct(row.product)}
                          style={{ fontWeight: 700, color: 'var(--text-dark)', cursor: onSelectProduct ? 'pointer' : 'default' }}
                          onMouseOver={e => onSelectProduct && (e.currentTarget.style.color = 'var(--accent-green)')}
                          onMouseOut={e => onSelectProduct && (e.currentTarget.style.color = 'var(--text-dark)')}
                        >
                          {row.productName}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-medium)' }}>
                          {row.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Brand */}
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      background: row.brand === 'Vlift Pro' ? 'rgba(184, 38, 43, 0.1)' : 'rgba(3, 191, 215, 0.1)',
                      color: row.brand === 'Vlift Pro' ? '#B8262B' : '#038E9F'
                    }}>
                      {row.brand}
                    </span>
                  </td>

                  {/* Variant / Caliber */}
                  <td style={{ padding: '0.75rem' }}>
                    <strong style={{ color: 'var(--primary-dark)', fontSize: '0.85rem' }}>
                      {row.variantName}
                    </strong>
                  </td>

                  {/* Stock availability */}
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    {isOutOfStock ? (
                      <span style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 700, background: '#FEE2E2', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        Sin Stock
                      </span>
                    ) : row.stock <= 5 ? (
                      <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 700, background: '#FEF3C7', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {row.stock} u. (Crítico)
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                        {row.stock} u. disponibles
                      </span>
                    )}
                  </td>

                  {/* Price */}
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700, color: 'var(--text-dark)' }}>
                    {formatPrice(row.unitPriceUSD)}
                  </td>

                  {/* Quantity Stepper & Presets */}
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    {isOutOfStock ? (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>No disponible</span>
                    ) : (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-light)',
                          borderRadius: '6px',
                          background: '#FFFFFF',
                          overflow: 'hidden'
                        }}>
                          <button
                            type="button"
                            onClick={() => handleIncrement(key, -1, row.stock)}
                            disabled={currentQty <= 0}
                            style={{
                              background: '#F8FAFC',
                              border: 'none',
                              padding: '0.35rem 0.5rem',
                              cursor: currentQty <= 0 ? 'not-allowed' : 'pointer',
                              color: 'var(--text-medium)'
                            }}
                          >
                            <Minus size={13} />
                          </button>

                          <input
                            type="number"
                            min={0}
                            max={row.stock}
                            value={currentQty === 0 ? '' : currentQty}
                            onChange={(e) => handleQtyChange(key, parseInt(e.target.value) || 0, row.stock)}
                            placeholder="0"
                            style={{
                              width: '42px',
                              textAlign: 'center',
                              border: 'none',
                              outline: 'none',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: 'var(--text-dark)',
                              padding: 0
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => handleIncrement(key, 1, row.stock)}
                            disabled={currentQty >= row.stock}
                            style={{
                              background: '#F8FAFC',
                              border: 'none',
                              padding: '0.35rem 0.5rem',
                              cursor: currentQty >= row.stock ? 'not-allowed' : 'pointer',
                              color: 'var(--text-medium)'
                            }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Quick Presets */}
                        <div style={{ display: 'flex', gap: '2px' }}>
                          <button
                            type="button"
                            onClick={() => handleIncrement(key, 5, row.stock)}
                            title="Añadir 5 unidades"
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              background: '#F1F5F9',
                              border: '1px solid #E2E8F0',
                              borderRadius: '4px',
                              padding: '0.2rem 0.35rem',
                              cursor: 'pointer'
                            }}
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleIncrement(key, 10, row.stock)}
                            title="Añadir 10 unidades"
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              background: '#F1F5F9',
                              border: '1px solid #E2E8F0',
                              borderRadius: '4px',
                              padding: '0.2rem 0.35rem',
                              cursor: 'pointer'
                            }}
                          >
                            +10
                          </button>
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Subtotal */}
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 800, color: currentQty > 0 ? 'var(--accent-green)' : 'var(--text-light)' }}>
                    {currentQty > 0 ? formatPrice(rowSubtotalUSD) : '-'}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Floating Order Summary Bar */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '2px solid var(--accent-green)',
        padding: '1rem 2rem',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>
              Cajas / Unidades Seleccionadas:
            </span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--accent-green)' }}>
              {orderSummary.totalUnits} unidades
            </strong>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '1.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>
              Monto Total Estimado:
            </span>
            <strong style={{ fontSize: '1.3rem', color: '#FFFFFF' }}>
              {formatPrice(orderSummary.totalUSD)}
            </strong>
            {currency === 'ARS' && (
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginLeft: '0.5rem' }}>
                (TC: $1 USD = ${exchangeRate.toLocaleString('es-AR')} ARS)
              </span>
            )}
          </div>

          {orderSummary.totalUnits > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              style={{
                background: 'none',
                border: 'none',
                color: '#FCA5A5',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Trash2 size={13} /> Limpiar Selección
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleAddAllToCart}
            disabled={orderSummary.totalUnits === 0 || addedFeedback}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.75rem 1.75rem',
              borderRadius: '8px',
              border: 'none',
              background: addedFeedback ? '#059669' : orderSummary.totalUnits > 0 ? 'var(--accent-gradient)' : '#64748B',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: orderSummary.totalUnits > 0 ? 'pointer' : 'not-allowed',
              boxShadow: orderSummary.totalUnits > 0 ? 'var(--shadow-md)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {addedFeedback ? (
              <>
                <CheckCircle2 size={18} /> ¡{orderSummary.totalUnits} Cajas Añadidas al Carrito!
              </>
            ) : (
              <>
                <ShoppingCart size={18} /> Cargar Pedido Masivo al Carrito ({orderSummary.totalUnits})
              </>
            )}
          </button>
        </div>
      </div>

        </div>
      </div>
    </div>
  );
};
