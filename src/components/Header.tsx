import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Settings, ChevronDown } from 'lucide-react';
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
  desc?: string;
  badge?: string;
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
    { 
      id: 'products', 
      label: 'Productos & Pedidos', 
      isExternal: false,
      submenu: [
        { 
          id: 'quick-order', 
          label: '⚡ Pedido Rápido B2B', 
          desc: 'Matriz masiva por calibres para clínicas y quirófanos',
          badge: 'B2B'
        },
        { 
          id: 'products', 
          label: '📦 Catálogo Completo', 
          desc: 'Dispositivos médicos y equipamiento estético' 
        },
        { 
          id: 'hilos-pdo', 
          label: '🧵 Hilos PDO (V-Lift Pro)', 
          desc: 'Mono, Screw, Genesis, Cones, Nose, Eye y Biocánulas' 
        },
        { 
          id: 'seffiline', 
          label: '🧬 Medicina Regenerativa (Seffiline)', 
          desc: 'Kits autólogos Seffiller, Seffihair, Sefficare y Seffigyn' 
        },
        { 
          id: 'clearance', 
          label: '🔥 Oportunidades & Outlet', 
          desc: 'Lotes especiales con 20% a 60% OFF por caducidad',
          badge: 'OUTLET'
        }
      ]
    },
    { 
      id: 'academia', 
      label: 'Área Médica', 
      isExternal: false,
      submenu: [
        { 
          id: 'academia', 
          label: '🎓 Academia & Workshops', 
          desc: 'Masterclasses con práctica hands-on en pacientes reales',
          badge: 'HANDS-ON'
        },
        { 
          id: 'descargas', 
          label: '📄 Descargas & Consentimientos', 
          desc: 'Modelos legales listos para imprimir en A4 y ANMAT',
          badge: 'ANMAT'
        },
        { 
          id: 'roi', 
          label: '📊 Calculadora ROI Médica', 
          desc: 'Simulador de ganancias y retorno por tratamiento',
          badge: 'PRO'
        }
      ]
    },
    { id: 'about', label: 'Nosotros', isExternal: false },
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
            {navLinks.map((link: any) => {
              const isSubActive = link.submenu && link.submenu.some((sub: any) => sub.id === activeTab);
              const isItemActive = activeTab === link.id || isSubActive;

              return (
                <li key={link.id} className={link.submenu ? "nav-item-dropdown" : ""} style={{ position: 'relative' }}>
                  {link.submenu ? (
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => handleNavClick(link.id)}
                        className="nav-dropdown-trigger"
                        style={{
                          background: 'none',
                          border: 'none',
                          fontFamily: 'var(--font-headings)',
                          fontSize: '0.88rem',
                          fontWeight: isItemActive ? 700 : 600,
                          color: isItemActive ? 'var(--accent-green)' : 'var(--text-medium)',
                          cursor: 'pointer',
                          position: 'relative',
                          padding: '0.6rem 0',
                          transition: 'var(--transition-fast)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <span>{link.label}</span>
                        <ChevronDown size={14} className="nav-chevron-icon" style={{ transition: 'transform 0.2s ease' }} />
                        {isItemActive && (
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

                      {/* Dropdown Menu Popup */}
                      <div className="nav-dropdown-menu">
                        {link.submenu.map((sub: any) => {
                          const isSubSelected = activeTab === sub.id;
                          return (
                            <button
                              key={sub.id}
                              className="nav-dropdown-item"
                              onClick={() => handleNavClick(sub.id)}
                              style={{
                                background: isSubSelected ? 'rgba(41, 192, 147, 0.08)' : 'transparent'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: sub.desc ? '0.2rem' : 0 }}>
                                <span style={{
                                  fontWeight: isSubSelected ? 700 : 600,
                                  color: isSubSelected ? 'var(--accent-green)' : 'var(--primary-dark)',
                                  fontSize: '0.86rem'
                                }}>
                                  {sub.label}
                                </span>
                                {sub.badge && (
                                  <span style={{
                                    fontSize: '0.62rem',
                                    fontWeight: 800,
                                    padding: '0.12rem 0.45rem',
                                    borderRadius: '12px',
                                    background: sub.badge === 'B2B' ? 'rgba(3, 191, 215, 0.15)' : sub.badge === 'OUTLET' ? 'rgba(234, 88, 12, 0.15)' : 'rgba(41, 192, 147, 0.15)',
                                    color: sub.badge === 'B2B' ? '#038e9f' : sub.badge === 'OUTLET' ? '#ea580c' : '#15803d',
                                    letterSpacing: '0.04em'
                                  }}>
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              {sub.desc && (
                                <span style={{
                                  display: 'block',
                                  fontSize: '0.72rem',
                                  color: 'var(--text-medium)',
                                  lineHeight: 1.3,
                                  fontWeight: 400
                                }}>
                                  {sub.desc}
                                </span>
                              )}
                            </button>
                          );
                        })}
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
                        color: activeTab === link.id ? 'var(--accent-green)' : 'var(--text-medium)',
                        cursor: 'pointer',
                        position: 'relative',
                        padding: '0.6rem 0',
                        transition: 'var(--transition-fast)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                      onMouseEnter={e => {
                        if (activeTab !== link.id) {
                          e.currentTarget.style.color = 'var(--accent-green)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (activeTab !== link.id) {
                          e.currentTarget.style.color = 'var(--text-medium)';
                        }
                      }}
                    >
                      <span>{link.label}</span>
                      {activeTab === link.id && (
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
                  )}
                </li>
              );
            })}
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
          maxHeight: 'calc(100vh - var(--header-height))',
          overflowY: 'auto',
          background: 'var(--bg-white)',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          zIndex: 99,
          animation: 'slideUp 0.3s ease'
        }}>
          {navLinks.map((link) => {
            if (link.submenu) {
              const isSubActive = link.submenu.some((sub: any) => sub.id === activeTab);
              return (
                <div key={link.id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                  <div style={{
                    padding: '0.4rem 0',
                    fontFamily: 'var(--font-headings)',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 800,
                    color: isSubActive ? 'var(--accent-green)' : '#94A3B8'
                  }}>
                    {link.label}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
                    {link.submenu.map((sub) => {
                      const isSelected = activeTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleNavClick(sub.id)}
                          style={{
                            background: isSelected ? 'rgba(41, 192, 147, 0.08)' : 'none',
                            border: 'none',
                            textAlign: 'left',
                            padding: '0.6rem 0.75rem',
                            borderRadius: '8px',
                            fontFamily: 'var(--font-headings)',
                            fontSize: '0.92rem',
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? 'var(--accent-green)' : 'var(--text-dark)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span>{sub.label}</span>
                          {sub.badge && (
                            <span style={{
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              padding: '0.1rem 0.4rem',
                              borderRadius: '10px',
                              background: sub.badge === 'B2B' ? 'rgba(3, 191, 215, 0.15)' : sub.badge === 'OUTLET' ? 'rgba(234, 88, 12, 0.15)' : 'rgba(41, 192, 147, 0.15)',
                              color: sub.badge === 'B2B' ? '#038e9f' : sub.badge === 'OUTLET' ? '#ea580c' : '#15803d'
                            }}>
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: activeTab === link.id ? 'rgba(41, 192, 147, 0.08)' : 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-headings)',
                  fontSize: '0.95rem',
                  fontWeight: activeTab === link.id ? 700 : 600,
                  color: activeTab === link.id ? 'var(--accent-green)' : 'var(--text-dark)',
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
              marginTop: '0.75rem',
              padding: '0.8rem'
            }}
          >
            Comprar Ahora
          </button>
        </div>
      )}

      {/* Style overrides for Responsive Header Layout & Submenu */}
      <style>{`
        @media (min-width: 860px) {
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
          display: flex;
          animation: fadeInMenu 0.2s ease forwards;
        }

        .nav-item-dropdown:hover .nav-chevron-icon {
          transform: rotate(180deg);
        }

        .nav-dropdown-menu {
          display: none;
          flex-direction: column;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #ffffff;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.8);
          border-radius: 14px;
          padding: 0.5rem;
          min-width: 320px;
          z-index: 1000;
          gap: 0.25rem;
        }

        .nav-dropdown-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: var(--font-headings);
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .nav-dropdown-item:hover {
          background: #F8FAFC !important;
          transform: translateX(3px);
        }

        @keyframes fadeInMenu {
          from {
            opacity: 0;
            transform: translate(-50%, 6px);
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
