import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';

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
    { id: 'products', label: 'Productos', isExternal: false },
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
            src="/logo-full.png" 
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
            alignItems: 'center'
          }}>
            {navLinks.map((link) => (
              <li key={link.id}>
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
          {/* Admin Panel Trigger (Only visible to logged-in admin) */}
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
          {navLinks.map((link) => (
            link.isExternal ? (
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
            )
          ))}
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

      {/* Style overrides for Responsive Header Layout */}
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
      `}</style>
    </header>
  );
};
