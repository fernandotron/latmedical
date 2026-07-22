import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getAssetUrl } from '../utils/assets';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleCart: () => void;
  isAdminLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, toggleCart, isAdminLoggedIn = false }) => {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Inicio', isExternal: false },
    { id: 'about', label: 'Nosotros', isExternal: false },
    { 
      id: 'products', 
      label: 'Productos', 
      isExternal: false,
      submenu: [
        { id: 'products', label: 'Todos los Productos' },
        { id: 'hilos-pdo', label: 'Hilos PDO (Vlift Pro)' },
        { id: 'seffiline', label: 'Medicina Regenerativa (Seffiline)' }
      ]
    },
    { id: 'curso', label: 'Curso Internacional', isExternal: true, url: 'https://international.acadelift.org/' },
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
      transition: 'var(--transition-fast)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <img 
            src={getAssetUrl('/logo-full.png')} 
            alt="Latmedical International" 
            style={{
              height: '42px',
              width: 'auto',
              display: 'block'
            }} 
          />
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none' }} className="desktop-nav">
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '2.5rem',
            alignItems: 'center',
            margin: 0,
            padding: 0
          }}>
            {navLinks.map((link) => (
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
                      fontSize: '0.9rem',
                      fontWeight: 500,
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
                        fontSize: '0.9rem',
                        fontWeight: (activeTab === 'products' || activeTab === 'hilos-pdo' || activeTab === 'seffiline') ? 600 : 500,
                        color: (activeTab === 'products' || activeTab === 'hilos-pdo' || activeTab === 'seffiline') ? 'var(--accent-green)' : 'var(--text-medium)',
                        cursor: 'pointer',
                        position: 'relative',
                        padding: '0.5rem 0',
                        transition: 'var(--transition-fast)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      {link.label} <span style={{ fontSize: '0.65rem' }}>▼</span>
                      {(activeTab === 'products' || activeTab === 'hilos-pdo' || activeTab === 'seffiline') && (
                        <span style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '10%',
                          width: '80%',
                          height: '3px',
                          background: 'var(--accent-gradient)',
                          borderRadius: '2px'
                        }} />
                      )}
                    </button>
                    <div className="nav-dropdown-menu">
                      {link.submenu.map((sub) => (
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
                      fontSize: '0.9rem',
                      fontWeight: activeTab === link.id ? 600 : 500,
                      color: activeTab === link.id ? 'var(--accent-green)' : 'var(--text-medium)',
                      cursor: 'pointer',
                      position: 'relative',
                      padding: '0.5rem 0',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    {link.label}
                    {activeTab === link.id && (
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '10%',
                        width: '80%',
                        height: '3px',
                        background: 'var(--accent-gradient)',
                        borderRadius: '2px'
                      }} />
                    )}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
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
              boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05)'
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

          {/* Contact CTA Button (Desktop) */}
          <button
            className="btn-primary"
            onClick={() => handleNavClick('products')}
            style={{
              padding: '0.5rem 1.2rem',
              fontSize: '0.85rem',
              display: 'none'
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
