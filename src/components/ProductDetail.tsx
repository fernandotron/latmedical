import React, { useState, useEffect } from 'react';
import { Product, products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';
import { useCurrency } from '../context/CurrencyContext';
import { ArrowLeft, ShoppingCart, Check, ShieldAlert, Award, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onViewProduct?: (product: Product) => void;
}

type DetailTab = 'desc' | 'specs' | 'clinical';

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onViewProduct }) => {
  const { addToCart } = useCart();
  const { inventory } = useInventory();
  const { formatPrice, currency } = useCurrency();
  
  // Find this product's inventory from the database
  const productInventory = inventory.find(item => item.productId === product.id);
  const hasVariants = productInventory?.hasVariants ?? false;

  // Selected variant state
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  const [activeTab, setActiveTab] = useState<DetailTab>('desc');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [mainImage, setMainImage] = useState(getAssetUrl(product.image));
  
  // Zoom states
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  // Sync state whenever the viewed product changes
  useEffect(() => {
    setMainImage(getAssetUrl(product.image));
    setQty(1);
    setAdded(false);
    setActiveTab('desc');
    setIsZoomed(false);
    if (hasVariants && productInventory?.variants && productInventory.variants.length > 0) {
      setSelectedVariantId(productInventory.variants[0].id);
    } else {
      setSelectedVariantId('');
    }
  }, [product.id, product.image, hasVariants, productInventory]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Helper to get active stock & price
  const getActiveStockInfo = () => {
    if (!productInventory) return { stock: 0, name: '', price: product.price };
    if (hasVariants) {
      const variant = (productInventory.variants || []).find(v => v.id === selectedVariantId);
      return {
        stock: variant ? variant.stock : 0,
        name: variant ? variant.name : '',
        price: (variant && variant.price !== undefined) ? variant.price : product.price
      };
    }
    return {
      stock: productInventory.stock,
      name: '',
      price: product.price
    };
  };

  const { stock: activeStock, name: selectedVariantName, price: activePrice } = getActiveStockInfo();

  // Alternative images placeholder (only primary image is kept)
  const alternativeImages = [getAssetUrl(product.image)];

  const handleQtyChange = (val: number) => {
    if (val < 1) return;
    if (val > activeStock) return; // Prevent ordering more than stock
    setQty(val);
  };

  const handleAdd = () => {
    if (activeStock <= 0) return;
    addToCart(product, qty, hasVariants ? selectedVariantName : undefined, activePrice);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ padding: 'calc(var(--header-height) + 2rem) 0 5rem 0', animation: 'fadeIn 0.5s ease' }}>
      <div className="container">
        
        {/* Breadcrumb & Back navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1rem'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--accent-green)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <ArrowLeft size={18} /> Volver al Catálogo
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 500 }}>
            Catálogo &gt; {product.category} &gt; {product.name}
          </span>
        </div>

        {/* Product Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '3rem',
          alignItems: 'start'
        }} className="detail-layout">
          
          {/* Left Column: Interactive Image Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div 
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-light)',
                height: '400px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
              }}
            >
              <img 
                src={mainImage} 
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
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? 'scale(1.4)' : 'scale(1)',
                  transition: isZoomed ? 'none' : 'transform 0.3s ease',
                  cursor: 'zoom-in'
                }}
              />

              {/* Subtle navigation arrows */}
              {alternativeImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const idx = alternativeImages.indexOf(mainImage);
                      const prevIdx = (idx - 1 + alternativeImages.length) % alternativeImages.length;
                      setMainImage(alternativeImages[prevIdx]);
                    }}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.65)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.65)'}
                  >
                    <ChevronLeft size={20} color="var(--primary-dark)" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const idx = alternativeImages.indexOf(mainImage);
                      const nextIdx = (idx + 1) % alternativeImages.length;
                      setMainImage(alternativeImages[nextIdx]);
                    }}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.65)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.65)'}
                  >
                    <ChevronRight size={20} color="var(--primary-dark)" />
                  </button>
                </>
              )}
            </div>

            {/* Gallery Thumbnails (Unconditional - shows at least 1) */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              {alternativeImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: mainImage === img ? '2px solid var(--accent-green)' : '1px solid var(--border-light)',
                    padding: '0.25rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'var(--transition-fast)',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img src={img} alt="Vista alternativa" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Order panel & Technical Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Brand and Category tags */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-brand">{product.brand}</span>
              <span className="badge badge-accent-green">{product.category}</span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 700, lineHeight: 1.2 }}>
              {product.name}
            </h1>

            {/* Short Desc */}
            <p style={{ color: 'var(--text-medium)', fontSize: '1rem', lineHeight: 1.6 }}>
              {product.shortDesc}
            </p>

            {/* Sizing dropdown / Selector if has variants */}
            {hasVariants && productInventory?.variants && (
              <div style={{
                background: 'var(--bg-white)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)', display: 'block', marginBottom: '0.5rem' }}>
                  Seleccionar Medida / Calibre
                </label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => {
                    setSelectedVariantId(e.target.value);
                    setQty(1); // reset quantity on variant change
                  }}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.5rem',
                    background: '#FFFFFF',
                    borderColor: 'var(--border-light)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  {productInventory.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} {v.stock === 0 ? '(Sin stock)' : `(${v.stock} sobres en stock)`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price & Stock Badge panel */}
            <div style={{
              padding: '1.25rem',
              background: 'var(--bg-white)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
                    Precio Profesional ({currency})
                  </span>
                  <span className="text-gradient-accent" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                    {formatPrice(activePrice)}
                  </span>
                  {currency === 'ARS' && (
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-medium)', marginTop: '0.1rem' }}>
                      Eqv: USD ${activePrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Stock Level Indicator */}
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
                    Inventario Activo
                  </span>
                  {activeStock > 0 ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.85rem',
                      color: 'var(--success)',
                      fontWeight: 600
                    }}>
                      <Check size={16} /> En Stock ({activeStock} disp.)
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.85rem',
                      color: 'var(--danger)',
                      fontWeight: 600
                    }}>
                      <AlertCircle size={16} /> Sin Stock
                    </span>
                  )}
                </div>
              </div>
              
              {/* Add to Cart Actions */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  height: '42px',
                  background: 'var(--bg-light)'
                }}>
                  <button 
                    onClick={() => handleQtyChange(qty - 1)}
                    style={{ background: 'none', border: 'none', width: '32px', height: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                    disabled={activeStock <= 0}
                  >
                    -
                  </button>
                  <span style={{ width: '30px', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem' }}>
                    {activeStock <= 0 ? 0 : qty}
                  </span>
                  <button 
                    onClick={() => handleQtyChange(qty + 1)}
                    style={{ background: 'none', border: 'none', width: '32px', height: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                    disabled={activeStock <= 0 || qty >= activeStock}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="btn-primary"
                  style={{
                    flexGrow: 1,
                    height: '42px',
                    justifyContent: 'center',
                    background: added ? 'var(--success)' : activeStock <= 0 ? 'var(--text-light)' : 'var(--accent-gradient)',
                    fontSize: '0.9rem'
                  }}
                  disabled={added || activeStock <= 0}
                >
                  {added ? (
                    <>
                      <Check size={18} /> Agregado
                    </>
                  ) : activeStock <= 0 ? (
                    <span>Agotado</span>
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Comprar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div> {/* End Right Column */}
        </div> {/* End Product Layout Grid */}

        {/* Interactive Tabbed Panel (Long Description, Specs Sheet, Clinical Studies) - Full Width Below */}
        <div style={{
          background: 'var(--bg-white)',
          border: '1px solid var(--border-light)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          marginTop: '3rem'
        }}>
          {/* Tabs list header */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-light)',
            background: '#F9FAFB'
          }}>
            <button
              onClick={() => setActiveTab('desc')}
              style={{
                flexGrow: 1,
                background: 'none',
                border: 'none',
                padding: '1rem',
                fontFamily: 'var(--font-headings)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: activeTab === 'desc' ? 'var(--accent-green)' : 'var(--text-medium)',
                borderBottom: activeTab === 'desc' ? '2px solid var(--accent-green)' : 'none',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              Descripción
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              style={{
                flexGrow: 1,
                background: 'none',
                border: 'none',
                padding: '1rem',
                fontFamily: 'var(--font-headings)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: activeTab === 'specs' ? 'var(--accent-green)' : 'var(--text-medium)',
                borderBottom: activeTab === 'specs' ? '2px solid var(--accent-green)' : 'none',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              Especificaciones
            </button>
            <button
              onClick={() => setActiveTab('clinical')}
              style={{
                flexGrow: 1,
                background: 'none',
                border: 'none',
                padding: '1rem',
                fontFamily: 'var(--font-headings)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: activeTab === 'clinical' ? 'var(--accent-green)' : 'var(--text-medium)',
                borderBottom: activeTab === 'clinical' ? '2px solid var(--accent-green)' : 'none',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              Detalles Clínicos
            </button>
          </div>

          {/* Tab Contents */}
          <div style={{ padding: '1.5rem', fontSize: '0.9rem', minHeight: '180px' }}>
            
            {/* Description Tab */}
            {activeTab === 'desc' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <p style={{ color: 'var(--text-medium)', lineHeight: 1.6 }}>{product.description}</p>
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                  background: 'var(--accent-green-light)',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  marginTop: '1.25rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-dark)'
                }}>
                  <ShieldAlert size={16} color="var(--accent-green)" />
                  <span>Este producto requiere validación de matrícula médica vigente antes de su entrega física en Argentina.</span>
                </div>
              </div>
            )}

            {/* Specs Tab */}
            {activeTab === 'specs' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {product.specs.map((spec, index) => (
                      <tr key={index} style={{ borderBottom: index < product.specs.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                        <td style={{ padding: '0.6rem 0', color: 'var(--text-medium)', fontWeight: 500, width: '40%' }}>{spec.label}</td>
                        <td style={{ padding: '0.6rem 0', color: 'var(--text-dark)', fontWeight: 600 }}>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Clinical details Tab */}
            {activeTab === 'clinical' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>Indicaciones y Beneficios Clínicos:</h4>
                <ul style={{
                  paddingLeft: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  color: 'var(--text-medium)'
                }}>
                  {product.features.map((feat, index) => (
                    <li key={index} style={{ lineHeight: 1.5 }}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* Shipping note */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.8rem',
          color: 'var(--text-medium)',
          marginTop: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '2.5rem'
        }}>
          <Award size={18} color="var(--accent-green)" />
          <span>Garantía oficial importada. Distribución directa autorizada en toda Argentina.</span>
        </div>

        {/* Related Products Section */}
        {(() => {
          const relatedProducts = products
            .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
            .slice(0, 4);

          if (relatedProducts.length === 0) return null;

          return (
            <div style={{ marginTop: '4rem' }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--primary-dark)',
                marginBottom: '2rem',
                textTransform: 'uppercase',
                borderBottom: '2px solid var(--accent-green)',
                paddingBottom: '0.5rem',
                display: 'inline-block',
                letterSpacing: '0.04em'
              }}>
                Productos Relacionados
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '2rem'
              }}>
                {relatedProducts.map(relProduct => (
                  <div 
                    key={relProduct.id}
                    onClick={() => onViewProduct && onViewProduct(relProduct)}
                    style={{
                      background: 'var(--bg-white)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
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
                    <div style={{ height: '180px', overflow: 'hidden', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem' }}>
                      <img src={getAssetUrl(relProduct.image)} alt={relProduct.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{relProduct.brand}</span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0, lineHeight: '1.4' }}>{relProduct.name}</h4>
                      <span style={{ fontSize: '0.95rem', color: 'var(--accent-green)', fontWeight: 700, marginTop: 'auto' }}>USD ${relProduct.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

      </div>

      <style>{`
        @media (min-width: 768px) {
          .detail-layout {
            grid-template-columns: 1fr 1.1fr !important;
            gap: 4rem !important;
          }
        }
      `}</style>
    </div>
  );
};
