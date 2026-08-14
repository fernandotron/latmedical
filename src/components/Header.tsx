import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { getAssetUrl } from '../utils/assets';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleCart: () => void;
  isAdminLoggedIn?: boolean;
}

interface NavSubmenuItem {
  id: string;
  label: string;
}

interface NavLinkItem {
  id: string;
  label: string;
  isExternal: boolean;
  url?: string;
  badge?: string;
  submenu?: NavSubmenuItem[];
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, toggleCart, isAdminLoggedIn = false }) => {
  const { cartCount } = useCart();
  const { currency, setCurrency, exchangeRate } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: NavLinkItem[] = [
    { id: 'home', label: 'Inicio', isExternal: false },
    { id: 'about', label: 'Nosotros', isExternal: false },
    { 
      id: 'products', 
      label: 'Productos', 
      isExternal: false,
      submenu: [
        { id: 'products', label: 'Todos los Productos' },
        { id: 'quick-order', label: '⚡ Matriz de Pedido Rápido' },
        { id: 'hilos-pdo', label: 'Hilos PDO (Vlift Pro)' },
        { id: 'seffiline', label: 'Medicina Regenerativa (Seffiline)' },
        { id: 'clearance', label: '🏷️ Outlet por Caducidad' }
      ]
    },
    { id: 'quick-order', label: 'Pedido Rápido', badge: 'B2B', isExternal: false },
    { id: 'academia', label: 'Academia & Cursos', badge: 'HANDS-ON', isExternal: false },
    { id: 'descargas', label: 'Descargas Médicas', badge: 'ANMAT', isExternal: false },
    { id: 'roi', label: 'Calculadora ROI', badge: 'PRO', isExternal: false },
    { id: 'clearance', label: 'Oportunidades', badge: 'OUTLET', isExternal: false },
    { id: 'contact', label: 'Contacto', isExternal: false },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="glass-header" style={{
      position: 'fixed',
      top: isAdminLoggedIn ? '32px' : 0,
      left: 0,
      width: '100%',
      height: 'var(--header-height)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      transition: 'var(--transition-fast)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.07)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '0 clamp(1.25rem, 3.5vw, 3.5rem)'
      }}>
        {/* Brand Logo - Aligned to far left */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <img 
            src={getAssetUrl('/logo-full.png')} 
            alt="Latmedical International" 
            style={{
              height: '40px',
              width: 'auto',
              display: 'block'
            }} 
          />
        </div>

        {/* Desktop Navigation - Centered with balanced spacing */}
        <nav style={{ display: 'none' }} className="desktop-nav">
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: 'clamp(1.5rem, 2.5vw, 2.5rem)',
            alignItems: 'center',
            margin: 0,
            padding: 0
          }}>
            {navLinks.map((link: any) => (
              <li key={link.id} className={link.submenu ? "nav-item-dropdown" : ""} style={{ position: 'relative' }}>
                {link.isExternal ? (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--font-headings)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--text-medium)',
                      cursor: 'pointer',
                      position: 'relative',
                      padding: '0.5rem 0',
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'var(--transition-fast)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-green)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-medium)'}
                  >
                    {link.label}
                  </a>
                ) : link.submenu ? (
                  <div style={{ display: 'inline-block' }}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontFamily: 'var(--font-headings)',
                        fontSize: '0.88rem',
                        fontWeight: (activeTab === 'products' || activeTab === 'hilos-pdo' || activeTab === 'seffiline') ? 700 : 600,
                        color: (activeTab === 'products' || activeTab === 'hilos-pdo' || activeTab === 'seffiline') ? 'var(--accent-green)' : 'var(--text-medium)',
                        cursor: 'pointer',
                        position: 'relative',
                        padding: '0.5rem 0',
                        transition: 'var(--transition-fast)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {link.label} <span style={{ fontSize: '0.65rem' }}>▼</span>
                      {(activeTab === 'products' || activeTab === 'hilos-pdo' || activeTab === 'seffiline') && (
                        <span style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '0',
                          width: '100%',
                          height: '2.5px',
                          background: 'var(--accent-gradient)',
                          borderRadius: '2px'
                        }} />
                      )}
                    </button>
                    <div className="nav-dropdown-menu">
                      {link.submenu.map((sub: any) => (
                        <button
                          key={sub.id}
                          className="nav-dropdown-item"
                          onClick={() => handleNavClick(sub.id)}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavClick(link.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--font-headings)',
                      fontSize: '0.88rem',
                      fontWeight: activeTab === link.id ? 700 : 600,
                      color: activeTab === link.id ? (link.id === 'clearance' ? '#ea580c' : 'var(--accent-green)') : 'var(--text-medium)',
                      cursor: 'pointer',
                      position: 'relative',
                      padding: '0.5rem 0',
                      transition: 'var(--transition-fast)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                    onMouseEnter={e => {
                      if (activeTab !== link.id) {
                        e.currentTarget.style.color = link.id === 'clearance' ? '#ea580c' : 'var(--accent-green)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (activeTab !== link.id) {
                        e.currentTarget.style.color = 'var(--text-medium)';
                      }
                    }}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span style={{
                        background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
                        color: '#ffffff',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '0.12rem 0.45rem',
                        borderRadius: '20px',
                        letterSpacing: '0.04em',
                        boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)'
                      }}>
                        {link.badge}
                      </span>
                    )}
                    {activeTab === link.id && (
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '0',
                        width: '100%',
                        height: '2.5px',
                        background: link.id === 'clearance' ? 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)' : 'var(--accent-gradient)',
                        borderRadius: '2px'
                      }} />
                    )}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Buttons - Aligned to far right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
          {/* Currency Switcher (USD / ARS) */}
          <div 
            title={`Moneda de cotización activa (Tipo de Cambio: $1 USD = $${exchangeRate.toLocaleString('es-AR')} ARS)`}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F1F5F9',
              borderRadius: '20px',
              padding: '2px',
              border: '1px solid var(--border-light)'
            }}
          >
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '16px',
                border: 'none',
                background: currency === 'USD' ? 'var(--primary-dark)' : 'transparent',
                color: currency === 'USD' ? '#FFFFFF' : 'var(--text-medium)',
                fontWeight: 700,
                fontSize: '0.72rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              USD $
            </button>
            <button
              type="button"
              onClick={() => setCurrency('ARS')}
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '16px',
                border: 'none',
                background: currency === 'ARS' ? 'var(--accent-green)' : 'transparent',
                color: currency === 'ARS' ? '#FFFFFF' : 'var(--text-medium)',
                fontWeight: 700,
                fontSize: '0.72rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              ARS $
            </button>
          </div>

          {/* Cart Trigger */}
          <button
            onClick={toggleCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              padding: '0.6rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-dark)',
              transition: 'var(--transition-fast)',
              boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.06)'
            }}
            title="Ver carrito de compras"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-green-light)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="badge-accent-green" style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                padding: 0
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Panel Trigger */}
          {isAdminLoggedIn && (
            <button
              onClick={() => handleNavClick('admin')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                padding: '0.6rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeTab === 'admin' ? 'var(--accent-green)' : 'var(--primary-dark)',
                transition: 'var(--transition-fast)',
                boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05)',
                backgroundColor: activeTab === 'admin' ? 'var(--accent-green-light)' : 'transparent'
              }}
              title="Panel de Administración (B2B Staff)"
              onMouseEnter={(e) => { if (activeTab !== 'admin') e.currentTarget.style.backgroundColor = 'var(--accent-green-light)'; }}
              onMouseLeave={(e) => { if (activeTab !== 'admin') e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Settings size={20} />
            </button>
          )}

          {/* Contact / Catalog CTA Button (Desktop) */}
          <button
            className="btn-primary"
            onClick={() => handleNavClick('products')}
            style={{
              padding: '0.6rem 1.4rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'none',
              borderRadius: '8px'
            }}
            id="cta-header-contact"
          >
            Comprar Ahora
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--primary-dark)',
              padding: '0.5rem'
            }}
            className="mobile-menu-trigger"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: `calc(var(--header-height) + ${isAdminLoggedIn ? '32px' : '0px'})`,
          left: 0,
          width: '100%',
          background: 'var(--bg-white)',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          zIndex: 99,
          animation: 'slideUp 0.3s ease'
        }}>
          {navLinks.map((link) => {
            if (link.submenu) {
              return (
                <React.Fragment key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      padding: '0.8rem 0 0.4rem 0',
                      fontFamily: 'var(--font-headings)',
                      fontSize: '1rem',
                      fontWeight: (activeTab === 'products' || activeTab === 'hilos-pdo' || activeTab === 'seffiline') ? 600 : 500,
                      color: (activeTab === 'products' || activeTab === 'hilos-pdo' || activeTab === 'seffiline') ? 'var(--accent-green)' : 'var(--text-medium)',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    {link.label}
                  </button>
                  {link.submenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleNavClick(sub.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        padding: '0.6rem 0 0.6rem 1.5rem',
                        fontFamily: 'var(--font-headings)',
                        fontSize: '0.9rem',
                        fontWeight: activeTab === sub.id ? 600 : 500,
                        color: activeTab === sub.id ? 'var(--accent-green)' : 'var(--text-medium)',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.03)',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      ↳ {sub.label}
                    </button>
                  ))}
                </React.Fragment>
              );
            }
            return link.isExternal ? (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0.8rem 0',
                  fontFamily: 'var(--font-headings)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--text-medium)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'block'
                }}
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0.8rem 0',
                  fontFamily: 'var(--font-headings)',
                  fontSize: '1rem',
                  fontWeight: activeTab === link.id ? 600 : 500,
                  color: activeTab === link.id ? 'var(--accent-green)' : 'var(--text-medium)',
                  borderBottom: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                {link.label}
              </button>
            );
          })}
          <button
            className="btn-primary"
            onClick={() => handleNavClick('products')}
            style={{
              justifyContent: 'center',
              marginTop: '0.5rem'
            }}
          >
            Comprar Ahora
          </button>
        </div>
      )}

      {/* Style overrides for Responsive Header Layout & Submenu */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: block !important;
          }
          #cta-header-contact {
            display: inline-flex !important;
          }
          .mobile-menu-trigger {
            display: none !important;
          }
        }

        /* Hover Submenu CSS styles */
        .nav-item-dropdown:hover .nav-dropdown-menu {
          display: block;
          animation: fadeInMenu 0.25s ease;
        }

        .nav-dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          border-radius: 8px;
          padding: 0.5rem 0;
          min-width: 250px;
          z-index: 1000;
          border: 1px solid var(--border-light);
        }

        .nav-dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 0.7rem 1.25rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-medium);
          cursor: pointer;
          font-family: var(--font-headings);
          transition: background 0.2s ease, color 0.2s ease;
        }

        .nav-dropdown-item:hover {
          background: var(--accent-green-light);
          color: var(--accent-green);
        }

        @keyframes fadeInMenu {
          from {
            opacity: 0;
            transform: translate(-50%, 8px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </header>
  );
};
