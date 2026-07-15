import React, { useState, useEffect } from 'react';
import { useInventory, Order } from '../context/InventoryContext';
import { products } from '../data/products';
import { Package, ClipboardList, Check, Edit2, ShieldCheck, Phone, MapPin, Trash2, Settings, Lock, Eye, EyeOff, Save, Info } from 'lucide-react';

type AdminTab = 'inventory' | 'orders' | 'settings';

interface AdminPanelProps {
  isAdminLoggedIn: boolean;
  onAdminLoginChange: (loggedIn: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isAdminLoggedIn, onAdminLoginChange }) => {
  const { inventory, orders, updateStock, updateOrderStatus, deleteOrder } = useInventory();
  const [activeTab, setActiveTab] = useState<AdminTab>('inventory');
  
  // Login State
  const [userVal, setUserVal] = useState('');
  const [passVal, setPassVal] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Web Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('latmedical_web_settings');
    if (saved) return JSON.parse(saved);
    return {
      whatsappNumber: '5491123456789',
      email: 'ventas@latmedical.com',
      bankName: 'Galicia',
      bankCbu: '0070123420000012345678',
      bankAlias: 'LATMEDICAL.GALICIA',
      bankHolder: 'LATMEDICAL S.A.',
      adminUsername: 'admin@latmedical.com',
      adminPassword: 'AdminLatmedical2026!'
    };
  });

  // Track edits in state
  const [editState, setEditState] = useState<Record<string, { stock: number; price: number }>>({});
  const [savedFeedback, setSavedFeedback] = useState<Record<string, boolean>>({});
  const [settingsFeedback, setSettingsFeedback] = useState(false);

  // Expanded Products state for collapsing multiple calibers
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

  const toggleProductExpand = (productId: string) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Initialize editing states from product data
  useEffect(() => {
    const initialState: Record<string, { stock: number; price: number }> = {};
    products.forEach(product => {
      const inv = inventory.find(i => i.productId === product.id);
      if (inv) {
        if (inv.hasVariants) {
          inv.variants.forEach(variant => {
            initialState[`${product.id}-${variant.id}`] = {
              stock: variant.stock,
              price: product.price
            };
          });
        } else {
          initialState[product.id] = {
            stock: inv.stock,
            price: product.price
          };
        }
      }
    });
    setEditState(initialState);
  }, [inventory]);

  // Handle credentials fetch defaults
  const currentAdminUser = settings.adminUsername || 'admin@latmedical.com';
  const currentAdminPass = settings.adminPassword || 'AdminLatmedical2026!';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userVal === currentAdminUser && passVal === currentAdminPass) {
      onAdminLoginChange(true);
      setLoginError('');
    } else {
      setLoginError('Usuario o contraseña incorrectos.');
    }
  };

  const handleLogout = () => {
    onAdminLoginChange(false);
  };

  const handleValChange = (key: string, field: 'stock' | 'price', val: string) => {
    const parsedVal = parseFloat(val);
    const prev = editState[key] || { stock: 0, price: 0 };
    setEditState({
      ...editState,
      [key]: {
        ...prev,
        [field]: isNaN(parsedVal) ? 0 : parsedVal
      }
    });
  };

  const handleSaveProduct = (productId: string, variantId: string | undefined) => {
    const key = variantId ? `${productId}-${variantId}` : productId;
    const itemData = editState[key];
    if (!itemData) return;

    // 1. Update stock context
    updateStock(productId, variantId, Math.floor(itemData.stock));

    // 2. Update price override dynamically in products database array
    const product = products.find(p => p.id === productId);
    if (product) {
      product.price = itemData.price;
    }

    setSavedFeedback({ ...savedFeedback, [key]: true });
    setTimeout(() => {
      setSavedFeedback(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('latmedical_web_settings', JSON.stringify(settings));
    setSettingsFeedback(true);
    setTimeout(() => setSettingsFeedback(false), 2500);
  };

  // ── RENDER LOGIN PANEL ──
  if (!isAdminLoggedIn) {
    return (
      <div style={{
        padding: 'calc(var(--header-height) + 4rem) 0 8rem 0',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        minHeight: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '400px',
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.06)',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease'
        }}>
          {/* Lock Header */}
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'rgba(3, 191, 215, 0.1)', color: '#03bfd7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Lock size={28} />
          </div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
            Acceso Administrativo
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', marginBottom: '2rem' }}>
            Autentíquese para gestionar inventario, cambiar precios y configurar la plataforma.
          </p>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.5rem' }}>
                Usuario / Correo B2B
              </label>
              <input
                type="text"
                placeholder="admin@latmedical.com"
                value={userVal}
                onChange={e => setUserVal(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 1rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  boxSizing: 'border-box',
                  outline: 'none',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.5rem' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={passVal}
                  onChange={e => setPassVal(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 2.5rem 0 1rem',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {loginError && (
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--danger)', fontWeight: 600, textAlign: 'center' }}>
                ⚠️ {loginError}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                height: '42px',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                marginTop: '0.5rem'
              }}
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── RENDER AUTHENTICATED ADMIN PANEL ──
  return (
    <div style={{ padding: 'calc(var(--header-height) + 2rem) 0 6rem 0', animation: 'fadeIn 0.5s ease', background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Admin Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span className="badge badge-dark">Panel Administrativo B2B</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.5rem 0 0 0', color: 'var(--primary-dark)' }}>
              Consola de Control Latmedical
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleLogout}
              style={{
                background: 'none', border: '1.5px solid var(--border-light)',
                borderRadius: '6px', padding: '0.5rem 1rem', fontSize: '0.78rem',
                fontWeight: 700, cursor: 'pointer', color: 'var(--text-medium)',
                fontFamily: 'inherit'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cerrar Sesión
            </button>

            {/* Tab buttons switcher */}
            <div style={{ display: 'flex', gap: '0.25rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <button
                onClick={() => setActiveTab('inventory')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1.1rem', border: 'none', borderRadius: '6px',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  background: activeTab === 'inventory' ? '#ffffff' : 'transparent',
                  color: activeTab === 'inventory' ? 'var(--accent-green)' : 'var(--text-medium)',
                  boxShadow: activeTab === 'inventory' ? 'var(--shadow-sm)' : 'none',
                  transition: 'var(--transition-fast)',
                  fontFamily: 'inherit'
                }}
              >
                <Package size={14} /> Inventario y Precios
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1.1rem', border: 'none', borderRadius: '6px',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  background: activeTab === 'orders' ? '#ffffff' : 'transparent',
                  color: activeTab === 'orders' ? 'var(--accent-green)' : 'var(--text-medium)',
                  boxShadow: activeTab === 'orders' ? 'var(--shadow-sm)' : 'none',
                  transition: 'var(--transition-fast)',
                  fontFamily: 'inherit'
                }}
              >
                <ClipboardList size={14} /> Pedidos ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1.1rem', border: 'none', borderRadius: '6px',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  background: activeTab === 'settings' ? '#ffffff' : 'transparent',
                  color: activeTab === 'settings' ? 'var(--accent-green)' : 'var(--text-medium)',
                  boxShadow: activeTab === 'settings' ? 'var(--shadow-sm)' : 'none',
                  transition: 'var(--transition-fast)',
                  fontFamily: 'inherit'
                }}
              >
                <Settings size={14} /> Configuración Web
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: INVENTORY & PRICES MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Info size={18} color="#1d4ed8" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
              <p style={{ color: '#1e3a8a', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                <strong>Modificación de Precios y Stock:</strong> Especifique el inventario disponible y el precio por unidad en dólares estadounidenses (USD) para cada artículo. El catálogo, las tarjetas del producto y el flujo de compra se actualizarán instantáneamente.
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              overflowX: 'auto',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="admin-table">
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)' }}>Producto / Línea</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)' }}>Marca</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)' }}>Variedad / Calibre</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)', textAlign: 'center' }}>Stock</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)', textAlign: 'center' }}>Precio Unitario</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)', width: '150px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const vliftProducts = products.filter(p => p.brand === 'Vlift Pro');
                    const seffilineProducts = products.filter(p => p.brand === 'Seffiline');
                    const isSeffilineExpanded = expandedProducts['seffiline-group'] ?? false;
                    
                    return (
                      <React.Fragment>
                        {/* 1. Map Vlift products (with their variants) */}
                        {vliftProducts.map((product) => {
                          const inv = inventory.find(i => i.productId === product.id);
                          if (!inv) return null;
                          const isExpanded = expandedProducts[product.id] ?? false;
                          
                          return (
                            <React.Fragment key={product.id}>
                              {/* Parent Row Toggle */}
                              <tr 
                                onClick={() => toggleProductExpand(product.id)}
                                style={{ 
                                  background: '#ffffff', 
                                  borderBottom: '1px solid var(--border-light)',
                                  cursor: 'pointer',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                              >
                                <td style={{ padding: '1.1rem 1.5rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary-dark)' }}>
                                  <span style={{ 
                                    display: 'inline-block', 
                                    marginRight: '0.6rem', 
                                    fontSize: '0.75rem', 
                                    transition: 'transform 0.2s', 
                                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                    color: '#9ca3af'
                                  }}>
                                    ▶
                                  </span>
                                  {product.name}
                                </td>
                                <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.82rem' }}>
                                  <span className="badge badge-dark">{product.brand}</span>
                                </td>
                                <td style={{ padding: '1.1rem 1.5rem', fontWeight: 600, color: 'var(--text-medium)', fontSize: '0.82rem' }}>
                                  {inv.variants.length} Medidas / Calibres
                                </td>
                                <td colSpan={2} style={{ padding: '1.1rem 1.5rem', fontSize: '0.78rem', color: 'var(--text-light)', fontStyle: 'italic', textAlign: 'center' }}>
                                  {isExpanded ? 'Haga clic para contraer variedad' : 'Haga clic para expandir variedad y editar'}
                                </td>
                                <td style={{ padding: '1.1rem 1.5rem' }}>
                                  <button
                                    type="button"
                                    style={{
                                      background: isExpanded ? '#cbd5e1' : 'var(--accent-green-light)',
                                      color: isExpanded ? 'var(--text-medium)' : 'var(--accent-green)',
                                      border: 'none', borderRadius: '4px', padding: '0.35rem 0.6rem',
                                      fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', width: '100%',
                                      fontFamily: 'inherit', transition: 'all 0.2s'
                                    }}
                                  >
                                    {isExpanded ? 'Contraer' : 'Ver Medidas'}
                                  </button>
                                </td>
                              </tr>

                              {/* Expanded Variant Sub-Rows */}
                              {isExpanded && inv.variants.map((variant) => {
                                const key = `${product.id}-${variant.id}`;
                                const isSaved = savedFeedback[key] ?? false;
                                const data = editState[key] || { stock: variant.stock, price: product.price };

                                return (
                                  <tr key={key} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: '#fcfcfc' }}>
                                    <td style={{ padding: '0.85rem 1.5rem 0.85rem 2.75rem', fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 500 }}>
                                      <span style={{ marginRight: '0.4rem', color: '#cbd5e1' }}>↳</span>
                                      {product.name}
                                    </td>
                                    <td style={{ padding: '0.85rem 1.5rem' }}>
                                      {/* Empty brand cell for subrows */}
                                    </td>
                                    <td style={{ padding: '0.85rem 1.5rem', fontWeight: 700, color: 'var(--accent-green)', fontSize: '0.85rem' }}>
                                      {variant.name}
                                    </td>
                                    {/* Stock input */}
                                    <td style={{ padding: '0.4rem 1rem', textAlign: 'center' }}>
                                      <input
                                        type="number"
                                        min={0}
                                        value={data.stock}
                                        onChange={e => handleValChange(key, 'stock', e.target.value)}
                                        style={{
                                          width: '70px', height: '30px', textAlign: 'center',
                                          borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none',
                                          fontFamily: 'inherit'
                                        }}
                                      />
                                    </td>
                                    {/* Price input */}
                                    <td style={{ padding: '0.4rem 1rem', textAlign: 'center' }}>
                                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-medium)', fontWeight: 600 }}>USD</span>
                                        <input
                                          type="number"
                                          min={0}
                                          step="0.01"
                                          value={data.price}
                                          onChange={e => handleValChange(key, 'price', e.target.value)}
                                          style={{
                                            width: '85px', height: '30px', padding: '0 0.2rem', textAlign: 'center',
                                            borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600,
                                            fontFamily: 'inherit'
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td style={{ padding: '0.4rem 1.5rem' }}>
                                      <button
                                        onClick={() => handleSaveProduct(product.id, variant.id)}
                                        style={{
                                          background: isSaved ? 'var(--success)' : 'var(--primary-dark)',
                                          border: 'none', borderRadius: '4px', height: '30px', width: '100%',
                                          color: '#FFFFFF', cursor: 'pointer', display: 'flex',
                                          alignItems: 'center', justifyContent: 'center', gap: '0.25rem',
                                          fontSize: '0.75rem', fontWeight: 700, transition: 'var(--transition-fast)',
                                          fontFamily: 'inherit'
                                        }}
                                      >
                                        {isSaved ? <Check size={14} /> : <Edit2 size={12} />}
                                        {isSaved ? 'OK' : 'Guardar'}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}

                        {/* 2. Parent Row for Seffiline Group Toggle */}
                        <tr 
                          onClick={() => toggleProductExpand('seffiline-group')}
                          style={{ 
                            background: '#ffffff', 
                            borderBottom: '1px solid var(--border-light)',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                        >
                          <td style={{ padding: '1.1rem 1.5rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary-dark)' }}>
                            <span style={{ 
                              display: 'inline-block', 
                              marginRight: '0.6rem', 
                              fontSize: '0.75rem', 
                              transition: 'transform 0.2s', 
                              transform: isSeffilineExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                              color: '#9ca3af'
                            }}>
                              ▶
                            </span>
                            Seffiline® (Medicina Regenerativa Autóloga)
                          </td>
                          <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.82rem' }}>
                            <span className="badge badge-accent-blue">SEFFILINE</span>
                          </td>
                          <td style={{ padding: '1.1rem 1.5rem', fontWeight: 600, color: 'var(--text-medium)', fontSize: '0.82rem' }}>
                            {seffilineProducts.length} Kits Estandarizados
                          </td>
                          <td colSpan={2} style={{ padding: '1.1rem 1.5rem', fontSize: '0.78rem', color: 'var(--text-light)', fontStyle: 'italic', textAlign: 'center' }}>
                            {isSeffilineExpanded ? 'Haga clic para contraer kits' : 'Haga clic para expandir kits y editar'}
                          </td>
                          <td style={{ padding: '1.1rem 1.5rem' }}>
                            <button
                              type="button"
                              style={{
                                background: isSeffilineExpanded ? '#cbd5e1' : 'var(--accent-green-light)',
                                color: isSeffilineExpanded ? 'var(--text-medium)' : 'var(--accent-green)',
                                border: 'none', borderRadius: '4px', padding: '0.35rem 0.6rem',
                                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', width: '100%',
                                fontFamily: 'inherit', transition: 'all 0.2s'
                              }}
                            >
                              {isSeffilineExpanded ? 'Contraer' : 'Ver Kits'}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Seffiline Sub-Rows */}
                        {isSeffilineExpanded && seffilineProducts.map((product) => {
                          const inv = inventory.find(i => i.productId === product.id);
                          if (!inv) return null;
                          const key = product.id;
                          const isSaved = savedFeedback[key] ?? false;
                          const data = editState[key] || { stock: inv.stock, price: product.price };

                          return (
                            <tr key={key} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: '#fcfcfc' }}>
                              <td style={{ padding: '0.85rem 1.5rem 0.85rem 2.75rem', fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 500 }}>
                                <span style={{ marginRight: '0.4rem', color: '#cbd5e1' }}>↳</span>
                                {product.name}
                              </td>
                              <td style={{ padding: '0.85rem 1.5rem' }}>
                                {/* Empty brand cell for subrows */}
                              </td>
                              <td style={{ padding: '0.85rem 1.5rem', fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.85rem' }}>
                                Kit Standard (Único)
                              </td>
                              {/* Stock input */}
                              <td style={{ padding: '0.4rem 1rem', textAlign: 'center' }}>
                                <input
                                  type="number"
                                  min={0}
                                  value={data.stock}
                                  onChange={e => handleValChange(key, 'stock', e.target.value)}
                                  style={{
                                    width: '70px', height: '30px', textAlign: 'center',
                                    borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none',
                                    fontFamily: 'inherit'
                                  }}
                                />
                              </td>
                              {/* Price input */}
                              <td style={{ padding: '0.4rem 1rem', textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-medium)', fontWeight: 600 }}>USD</span>
                                  <input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={data.price}
                                    onChange={e => handleValChange(key, 'price', e.target.value)}
                                    style={{
                                      width: '85px', height: '30px', padding: '0 0.2rem', textAlign: 'center',
                                      borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600,
                                      fontFamily: 'inherit'
                                    }}
                                  />
                                </div>
                              </td>
                              <td style={{ padding: '0.4rem 1.5rem' }}>
                                <button
                                  onClick={() => handleSaveProduct(product.id, undefined)}
                                  style={{
                                    background: isSaved ? 'var(--success)' : 'var(--primary-dark)',
                                    border: 'none', borderRadius: '4px', height: '30px', width: '100%',
                                    color: '#FFFFFF', cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: '0.25rem',
                                    fontSize: '0.75rem', fontWeight: 700, transition: 'var(--transition-fast)',
                                    fontFamily: 'inherit'
                                  }}
                                >
                                  {isSaved ? <Check size={14} /> : <Edit2 size={12} />}
                                  {isSaved ? 'OK' : 'Guardar'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: RECEIVED ORDERS HISTORY */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', margin: 0 }}>
              Historial de órdenes registradas a través del checkout B2B. Valide la matrícula médica del comprador antes de despachar.
            </p>

            {orders.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '4rem 2rem', background: '#ffffff',
                border: '1px solid var(--border-light)', borderRadius: '10px', color: 'var(--text-medium)'
              }}>
                <ClipboardList size={40} style={{ opacity: 0.4, marginBottom: '1rem' }} />
                <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No hay pedidos registrados</p>
                <p style={{ fontSize: '0.85rem' }}>Las compras simuladas en la web aparecerán registradas en este historial.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      background: '#ffffff', border: '1px solid var(--border-light)',
                      borderRadius: '10px', boxShadow: 'var(--shadow-sm)',
                      padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem'
                    }}
                  >
                    {/* Order header row */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem',
                      flexWrap: 'wrap', gap: '0.5rem'
                    }}>
                      <div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                          Orden {order.id}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginLeft: '1rem' }}>
                          {order.date}
                        </span>
                      </div>
                      
                      {/* Action status dropdown & Delete order */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          style={{
                            height: '32px', padding: '0 0.5rem', borderRadius: '4px', border: '1px solid',
                            borderColor: order.status === 'Pendiente' ? '#f59e0b' : order.status === 'Aprobado' ? 'var(--accent-green)' : order.status === 'Despachado' ? 'var(--accent-blue)' : 'var(--text-light)',
                            background: '#FFFFFF', fontSize: '0.8rem', fontWeight: 600,
                            color: order.status === 'Pendiente' ? '#d97706' : order.status === 'Aprobado' ? '#10b981' : order.status === 'Despachado' ? '#2563eb' : 'var(--text-medium)',
                            outline: 'none', fontFamily: 'inherit'
                          }}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Aprobado">Aprobado (Validado)</option>
                          <option value="Despachado">Despachado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>

                        <button
                          onClick={() => deleteOrder(order.id)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--danger)', padding: '0.25rem'
                          }}
                          title="Eliminar registro"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem'
                    }} className="order-details-grid">
                      {/* Left side: Buyer credentials */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.05em' }}>
                          Médico Comprador
                        </h4>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <ShieldCheck size={18} color="var(--accent-green)" />
                          <span style={{ fontWeight: 600 }}>{order.fullName}</span>
                          <span className="badge badge-dark" style={{ textTransform: 'none' }}>Matrícula: {order.licenseNumber}</span>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <span>Especialidad: <strong>{order.specialty}</strong></span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Phone size={14} /> {order.phone} {order.email ? ` | ${order.email}` : ''}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'start', gap: '0.25rem' }}>
                            <MapPin size={14} style={{ marginTop: '0.1rem', flexShrink: 0 }} /> 
                            <span>{order.address}, {order.city} ({order.province})</span>
                          </span>
                        </div>
                      </div>

                      {/* Right side: Items details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.05em' }}>
                          Detalle de Productos
                        </h4>
                        
                        <div style={{
                          background: 'var(--bg-light)', borderRadius: '8px', border: '1px solid var(--border-light)',
                          padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                        }}>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span>
                                <strong>{item.quantity}x</strong> {item.productName} 
                                {item.variantName && <span className="badge badge-accent-green" style={{ fontSize: '0.65rem', padding: '0 0.3rem', marginLeft: '0.4rem', textTransform: 'none' }}>{item.variantName}</span>}
                              </span>
                              <span style={{ fontWeight: 600 }}>USD ${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}

                          <div style={{
                            display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-light)',
                            paddingTop: '0.5rem', marginTop: '0.25rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-dark)'
                          }}>
                            <span>Monto Total</span>
                            <span style={{ color: 'var(--accent-green)' }}>USD ${order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Payment method information */}
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>
                          Método de Pago: <strong>{order.paymentMethod === 'transfer' ? 'Transferencia Bancaria' : 'Tarjeta de Crédito'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SITE GENERAL WEB CONFIGURATION */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              
              {/* Box 1: Contact details */}
              <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={18} color="var(--accent-green)" /> Canales de Contacto B2B
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                      Número de WhatsApp Comercial (Formato Internacional sin +)
                    </label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      required
                      style={{
                        width: '100%', height: '38px', padding: '0 0.75rem', borderRadius: '4px',
                        border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit'
                      }}
                    />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>
                      Ejemplo: 5491123456789. Aquí se enviarán las confirmaciones del carro.
                    </span>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                      Email Comercial / De Soporte
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={e => setSettings({ ...settings, email: e.target.value })}
                      required
                      style={{
                        width: '100%', height: '38px', padding: '0 0.75rem', borderRadius: '4px',
                        border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Box 2: Bank details */}
              <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="var(--accent-green)" /> Datos de Transferencia Bancaria
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                      Nombre del Banco
                    </label>
                    <input
                      type="text"
                      value={settings.bankName}
                      onChange={e => setSettings({ ...settings, bankName: e.target.value })}
                      required
                      style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                      CBU (Clave Bancaria Uniforme)
                    </label>
                    <input
                      type="text"
                      value={settings.bankCbu}
                      onChange={e => setSettings({ ...settings, bankCbu: e.target.value })}
                      required
                      style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                        Alias de la Cuenta
                      </label>
                      <input
                        type="text"
                        value={settings.bankAlias}
                        onChange={e => setSettings({ ...settings, bankAlias: e.target.value })}
                        required
                        style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                        Titular de la Cuenta
                      </label>
                      <input
                        type="text"
                        value={settings.bankHolder}
                        onChange={e => setSettings({ ...settings, bankHolder: e.target.value })}
                        required
                        style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 3: Authentication credentials */}
              <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={18} color="var(--accent-green)" /> Credenciales del Administrador
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                      Usuario de Acceso (Email)
                    </label>
                    <input
                      type="text"
                      value={settings.adminUsername}
                      onChange={e => setSettings({ ...settings, adminUsername: e.target.value })}
                      required
                      style={{
                        width: '100%', height: '38px', padding: '0 0.75rem', borderRadius: '4px',
                        border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                      Nueva Contraseña
                    </label>
                    <input
                      type="text"
                      value={settings.adminPassword}
                      onChange={e => setSettings({ ...settings, adminPassword: e.target.value })}
                      required
                      style={{
                        width: '100%', height: '38px', padding: '0 0.75rem', borderRadius: '4px',
                        border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom buttons save bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              {settingsFeedback && (
                <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, animation: 'fadeIn 0.3s ease' }}>
                  ✓ ¡Configuración guardada correctamente!
                </span>
              )}
              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '0.85rem 2.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}
              >
                <Save size={16} /> Guardar Configuración
              </button>
            </div>
          </form>
        )}

      </div>

      <style>{`
        @media (min-width: 768px) {
          .order-details-grid {
            grid-template-columns: 1.1fr 0.9fr !important;
          }
        }
        
        /* Table scroll support for small devices */
        .admin-table {
          min-width: 700px;
        }
        @media (max-width: 767px) {
          .admin-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};
