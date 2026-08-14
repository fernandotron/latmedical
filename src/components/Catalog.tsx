import React, { useState } from 'react';
import { products, Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { Search, Filter, ShieldAlert, LayoutGrid, Stethoscope, GitCompare, Zap } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';
import { AnatomicalFinder } from './AnatomicalFinder';
import { ThreadComparator } from './ThreadComparator';
import { QuickOrderPad } from './QuickOrderPad';

type BrandFilter = 'All' | 'Vlift Pro' | 'Seffiline';
type ViewMode = 'grid' | 'quick-order' | 'anatomical' | 'comparator';

interface CatalogProps {
  onViewDetails: (product: Product) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ onViewDetails }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterBrand, setFilterBrand] = useState<BrandFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesBrand = filterBrand === 'All' || product.brand === filterBrand;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      
      {/* 1. HERO HEADER BANNER */}
      <section style={{
        position: 'relative',
        height: '35vh',
        minHeight: '280px',
        marginTop: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--primary-dark)',
        overflow: 'hidden'
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

        <div className="container" style={{ position: 'relative', zIndex: 3, color: '#FFFFFF' }}>
          <span className="badge badge-accent-green" style={{ marginBottom: '0.75rem' }}>Catálogo Profesional</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
            Productos & Dispositivos Médicos
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '650px' }}>
            Equipamiento médico avanzado, Hilos PDO V-Lift Pro y kits de terapia celular autóloga Seffiline con aval científico.
          </p>
        </div>
      </section>

      {/* 2. CATALOG CONTENT */}
      <section id="catalog-section" style={{ padding: '3.5rem 0 5rem 0', background: 'var(--bg-light)', position: 'relative' }}>
        <div className="container">
          
          {/* Professional Alert */}
          <div style={{
            background: 'var(--accent-green-light)',
            border: '1px solid var(--accent-green)',
            borderRadius: '8px',
            padding: '1.15rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)',
            animation: 'fadeIn 0.8s ease'
          }}>
            <ShieldAlert size={24} color="var(--accent-green)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', margin: 0, fontWeight: 500 }}>
              <strong>Aviso de exclusividad médica:</strong> La venta de estos dispositivos médicos está restringida en Argentina. Es obligatorio ingresar tu matrícula médica al realizar el pago para validar y procesar el despacho de la compra.
            </p>
          </div>

          {/* View Mode Switcher Toolbar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
            background: 'var(--bg-white)',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-medium)', marginRight: '0.25rem' }}>
                Modo de Exploración:
              </span>

              <button
                onClick={() => setViewMode('grid')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: viewMode === 'grid' ? 'var(--accent-green)' : 'transparent',
                  background: viewMode === 'grid' ? 'var(--accent-green-light)' : 'transparent',
                  color: viewMode === 'grid' ? '#03543F' : 'var(--text-medium)',
                  fontWeight: viewMode === 'grid' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <LayoutGrid size={16} /> Catálogo de Productos
              </button>

              <button
                onClick={() => setViewMode('quick-order')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: viewMode === 'quick-order' ? 'var(--primary-dark)' : 'transparent',
                  background: viewMode === 'quick-order' ? 'var(--primary-dark)' : 'transparent',
                  color: viewMode === 'quick-order' ? '#FFFFFF' : 'var(--text-medium)',
                  fontWeight: viewMode === 'quick-order' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <Zap size={16} color={viewMode === 'quick-order' ? 'var(--accent-green)' : 'currentColor'} /> Pedido Rápido B2B
              </button>

              <button
                onClick={() => setViewMode('anatomical')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: viewMode === 'anatomical' ? 'var(--accent-green)' : 'transparent',
                  background: viewMode === 'anatomical' ? 'var(--accent-green-light)' : 'transparent',
                  color: viewMode === 'anatomical' ? '#03543F' : 'var(--text-medium)',
                  fontWeight: viewMode === 'anatomical' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <Stethoscope size={16} /> Navegador Anatómico
              </button>

              <button
                onClick={() => setViewMode('comparator')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: viewMode === 'comparator' ? 'var(--accent-blue)' : 'transparent',
                  background: viewMode === 'comparator' ? 'rgba(45, 156, 218, 0.12)' : 'transparent',
                  color: viewMode === 'comparator' ? '#1E40AF' : 'var(--text-medium)',
                  fontWeight: viewMode === 'comparator' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <GitCompare size={16} /> Comparador Hilos PDO
              </button>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>
              Mostrando <strong>{filteredProducts.length}</strong> dispositivos habilitados
            </div>
          </div>

          {/* VIEW MODE 1: Standard Products Grid */}
          {viewMode === 'grid' && (
            <>
              {/* Filter and Search Bar */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                marginBottom: '2.5rem',
                background: 'var(--bg-white)',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)'
              }} className="controls-row">
                
                {/* Brand Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-medium)',
                    marginRight: '0.5rem'
                  }}>
                    <Filter size={16} />
                    Filtrar marca:
                  </span>

                  <button
                    onClick={() => setFilterBrand('All')}
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '4px',
                      border: '1px solid',
                      borderColor: filterBrand === 'All' ? 'var(--accent-green)' : 'var(--border-light)',
                      background: filterBrand === 'All' ? 'var(--accent-gradient)' : 'transparent',
                      color: filterBrand === 'All' ? 'var(--text-white)' : 'var(--text-medium)',
                      fontFamily: 'var(--font-headings)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilterBrand('Vlift Pro')}
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '4px',
                      border: '1px solid',
                      borderColor: filterBrand === 'Vlift Pro' ? 'var(--accent-green)' : 'var(--border-light)',
                      background: filterBrand === 'Vlift Pro' ? 'var(--accent-gradient)' : 'transparent',
                      color: filterBrand === 'Vlift Pro' ? 'var(--text-white)' : 'var(--text-medium)',
                      fontFamily: 'var(--font-headings)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    Hilos PDO (Vlift Pro)
                  </button>
                  <button
                    onClick={() => setFilterBrand('Seffiline')}
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '4px',
                      border: '1px solid',
                      borderColor: filterBrand === 'Seffiline' ? 'var(--accent-green)' : 'var(--border-light)',
                      background: filterBrand === 'Seffiline' ? 'var(--accent-gradient)' : 'transparent',
                      color: filterBrand === 'Seffiline' ? 'var(--text-white)' : 'var(--text-medium)',
                      fontFamily: 'var(--font-headings)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    Seffiline (Terapia Celular)
                  </button>
                </div>

                {/* Search Box */}
                <div style={{
                  position: 'relative',
                  flexGrow: 1
                }}>
                  <Search size={18} color="var(--text-light)" style={{
                    position: 'absolute',
                    top: '50%',
                    left: '12px',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }} />
                  <input
                    type="text"
                    placeholder="Buscar por nombre de producto, indicación o calibre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 1rem 0 2.5rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.9rem',
                      color: 'var(--text-dark)',
                      outline: 'none',
                      transition: 'var(--transition-fast)'
                    }}
                  />
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '2.5rem'
                }}>
                  {filteredProducts.map((product) => (
                    <div key={product.id} style={{ animation: 'slideUp 0.4s ease' }}>
                      <ProductCard product={product} onViewDetails={onViewDetails} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  background: 'var(--bg-white)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '10px',
                  color: 'var(--text-medium)'
                }}>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>No se encontraron productos</p>
                  <p style={{ fontSize: '0.85rem' }}>Prueba ajustando los filtros o el término de búsqueda.</p>
                </div>
              )}
            </>
          )}

          {/* VIEW MODE 2: Quick Order Pad */}
          {viewMode === 'quick-order' && (
            <QuickOrderPad onSelectProduct={onViewDetails} />
          )}

          {/* VIEW MODE 3: Anatomical Finder */}
          {viewMode === 'anatomical' && (
            <AnatomicalFinder onSelectProduct={onViewDetails} />
          )}

          {/* VIEW MODE 4: Thread Comparator */}
          {viewMode === 'comparator' && (
            <ThreadComparator onSelectProduct={onViewDetails} />
          )}

        </div>

        <style>{`
          @media (min-width: 768px) {
            .controls-row {
              flex-direction: row !important;
              align-items: center !important;
              justify-content: space-between !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
};
