import React, { useState, useEffect } from 'react';
import { useInventory, Order } from '../context/InventoryContext';
import { products, Product } from '../data/products';
import { Package, ClipboardList, Check, Edit2, ShieldCheck, Phone, MapPin, Trash2, Settings, Lock, Eye, EyeOff, Save, Info, Sparkles, Plus, Upload } from 'lucide-react';
import defaultSettings from '../data/general_settings.json';
import defaultSlides from '../data/home_slides.json';

type AdminTab = 'inventory' | 'orders' | 'settings' | 'submissions' | 'add-product' | 'edit-product';

interface AdminPanelProps {
  isAdminLoggedIn: boolean;
  onAdminLoginChange: (loggedIn: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isAdminLoggedIn, onAdminLoginChange }) => {
  const { inventory, orders, updateStock, updateOrderStatus, deleteOrder } = useInventory();
  const [activeTab, setActiveTab] = useState<AdminTab>('inventory');
  
  // Expanded Orders state for collapsing/expanding
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  
  // Status edits state for saving explicitly
  const [tempOrderStatus, setTempOrderStatus] = useState<Record<string, Order['status']>>({});

  // Pagination states
  const [ordersPage, setOrdersPage] = useState(1);
  const [submissionsPage, setSubmissionsPage] = useState(1);

  // Login State
  const [userVal, setUserVal] = useState('');
  const [passVal, setPassVal] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Web Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('latmedical_web_settings');
    if (saved) return JSON.parse(saved);
    return defaultSettings;
  });

  // Slides State
  const [slidesState, setSlidesState] = useState(defaultSlides);

  // Form Submissions State
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Image Uploading indicators
  const [imageUploading, setImageUploading] = useState<Record<string, boolean>>({});

  const handleSlideChange = (index: number, field: string, value: string) => {
    setSlidesState(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  // States for creating/editing products
  const [productIdVal, setProductIdVal] = useState('');
  const [productNameVal, setProductNameVal] = useState('');
  const [productBrandVal, setProductBrandVal] = useState<'Vlift Pro' | 'Seffiline'>('Vlift Pro');
  const [productCategoryVal, setProductCategoryVal] = useState<'Hilos PDO' | 'Medicina Regenerativa'>('Hilos PDO');
  const [productShortDescVal, setProductShortDescVal] = useState('');
  const [productDescVal, setProductDescVal] = useState('');
  const [productFeaturesVal, setProductFeaturesVal] = useState('');
  const [productSpecsVal, setProductSpecsVal] = useState<{ label: string; value: string }[]>([]);
  const [productImageVal, setProductImageVal] = useState('');
  const [productPriceVal, setProductPriceVal] = useState('0');
  const [productHasVariantsVal, setProductHasVariantsVal] = useState(false);
  
  const [tempSpecLabel, setTempSpecLabel] = useState('');
  const [tempSpecValue, setTempSpecValue] = useState('');
  const [modalVariantsList, setModalVariantsList] = useState<{ name: string; stock: number }[]>([]);
  const [tempVariantName, setTempVariantName] = useState('');
  const [tempVariantStock, setTempVariantStock] = useState('0');
  const [productSingleStockVal, setProductSingleStockVal] = useState('0');

  // Track edits in state for quick prices/stocks save in table
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

  // Fetch Form Submissions dynamically on mount or tab change
  useEffect(() => {
    fetch('/api/data/form_submissions.json')
      .then(res => res.json())
      .then(data => setSubmissions(data))
      .catch(err => console.error('Error loading submissions:', err));
  }, [activeTab]);

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

  // Local helper to hit Vite middleware save APIs
  const persistProductsAndInventory = (updatedProducts: any[], updatedInventory: any[]) => {
    // 1. Save products.json
    fetch('/api/save-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: updatedProducts }, null, 2)
    }).catch(err => console.error('Error saving products:', err));

    // 2. Save inventory.json
    fetch('/api/save-inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedInventory, null, 2)
    }).catch(err => console.error('Error saving inventory:', err));
  };

  const handleSaveProduct = (productId: string, variantId: string | undefined) => {
    const key = variantId ? `${productId}-${variantId}` : productId;
    const itemData = editState[key];
    if (!itemData) return;

    // 1. Update stock context in memory
    updateStock(productId, variantId, Math.floor(itemData.stock));

    // 2. Update price override dynamically in products database array in memory
    const product = products.find(p => p.id === productId);
    if (product) {
      product.price = itemData.price;
    }

    // 3. Prepare updated data for JSON files
    const updatedProductsList = products.map(p => {
      if (p.id === productId) {
        return { ...p, price: itemData.price };
      }
      return p;
    });

    const updatedInventoryList = inventory.map(item => {
      if (item.productId !== productId) return item;
      if (item.hasVariants && variantId) {
        return {
          ...item,
          variants: item.variants.map(v => 
            v.id === variantId ? { ...v, stock: Math.floor(itemData.stock) } : v
          )
        };
      } else {
        return { ...item, stock: Math.floor(itemData.stock) };
      }
    });

    // 4. Persist
    persistProductsAndInventory(updatedProductsList, updatedInventoryList);

    setSavedFeedback({ ...savedFeedback, [key]: true });
    setTimeout(() => {
      setSavedFeedback(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('latmedical_web_settings', JSON.stringify(settings));

    // Save general settings file
    fetch('/api/save-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings, null, 2)
    })
    .then(() => {
      // Save slides file
      return fetch('/api/save-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slidesState, null, 2)
      });
    })
    .then(() => {
      setSettingsFeedback(true);
      setTimeout(() => setSettingsFeedback(false), 2500);
    })
    .catch(err => {
      console.error('Error saving settings or slides:', err);
      alert('Error al guardar la configuración.');
    });
  };

  // File Upload base64 reader
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'product' | number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetKey = typeof targetField === 'number' ? `slide-${targetField}` : 'product';
    setImageUploading(prev => ({ ...prev, [targetKey]: true }));

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          data: base64Data
        })
      })
      .then(res => res.json())
      .then(data => {
        setImageUploading(prev => ({ ...prev, [targetKey]: false }));
        if (data.success && data.url) {
          if (targetField === 'product') {
            setProductImageVal(data.url);
          } else {
            handleSlideChange(targetField, 'image', data.url);
          }
        } else {
          alert('Error al subir imagen.');
        }
      })
      .catch(err => {
        setImageUploading(prev => ({ ...prev, [targetKey]: false }));
        console.error('Error uploading image:', err);
        alert('Error al subir imagen.');
      });
    };
    reader.readAsDataURL(file);
  };

  // Full Page navigation Handlers (Replaces modal popups)
  const handleOpenAddPage = () => {
    setProductIdVal('');
    setProductNameVal('');
    setProductBrandVal('Vlift Pro');
    setProductCategoryVal('Hilos PDO');
    setProductShortDescVal('');
    setProductDescVal('');
    setProductFeaturesVal('');
    setProductSpecsVal([]);
    setProductImageVal('');
    setProductPriceVal('0');
    setProductHasVariantsVal(false);
    setModalVariantsList([]);
    setProductSingleStockVal('0');
    setActiveTab('add-product');
  };

  const handleOpenEditPage = (product: Product) => {
    setProductIdVal(product.id);
    setProductNameVal(product.name);
    setProductBrandVal(product.brand);
    setProductCategoryVal(product.category);
    setProductShortDescVal(product.shortDesc);
    setProductDescVal(product.description);
    setProductFeaturesVal(product.features.join('\n'));
    setProductSpecsVal(product.specs || []);
    setProductImageVal(product.image);
    setProductPriceVal(product.price.toString());
    
    // Fill inventory data
    const inv = inventory.find(i => i.productId === product.id);
    if (inv && inv.hasVariants) {
      setProductHasVariantsVal(true);
      setModalVariantsList(inv.variants.map(v => ({ name: v.name, stock: v.stock })));
      setProductSingleStockVal('0');
    } else {
      setProductHasVariantsVal(false);
      setModalVariantsList([]);
      setProductSingleStockVal(inv ? inv.stock.toString() : '0');
    }
    
    setActiveTab('edit-product');
  };

  // Specs List Handlers
  const handleAddSpec = () => {
    if (!tempSpecLabel.trim() || !tempSpecValue.trim()) return;
    setProductSpecsVal([...productSpecsVal, { label: tempSpecLabel.trim(), value: tempSpecValue.trim() }]);
    setTempSpecLabel('');
    setTempSpecValue('');
  };

  const handleRemoveSpec = (index: number) => {
    setProductSpecsVal(productSpecsVal.filter((_, i) => i !== index));
  };

  // Variants List Handlers
  const handleAddVariant = () => {
    if (!tempVariantName.trim()) return;
    setModalVariantsList([...modalVariantsList, { name: tempVariantName.trim(), stock: Number(tempVariantStock) || 0 }]);
    setTempVariantName('');
    setTempVariantStock('0');
  };

  const handleRemoveVariant = (index: number) => {
    setModalVariantsList(modalVariantsList.filter((_, i) => i !== index));
  };

  // Save Product Creation or Details Edit Form
  const handleSaveModalProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productIdVal.trim() || !productNameVal.trim()) return;

    const formattedId = productIdVal.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');

    const productObj = {
      id: formattedId,
      name: productNameVal.trim(),
      brand: productBrandVal,
      category: productCategoryVal,
      shortDesc: productShortDescVal.trim(),
      description: productDescVal.trim(),
      features: productFeaturesVal.split('\n').map(f => f.trim()).filter(Boolean),
      specs: productSpecsVal,
      image: productImageVal.trim() || '/logo-symbol.png',
      price: Number(productPriceVal) || 0
    };

    const newInvItem = {
      productId: formattedId,
      hasVariants: productHasVariantsVal,
      stock: productHasVariantsVal ? 0 : Number(productSingleStockVal) || 0,
      variants: productHasVariantsVal ? modalVariantsList.map((v) => ({
        id: v.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: v.name,
        stock: Number(v.stock) || 0
      })) : []
    };

    let updatedProducts = [...products];
    let updatedInventory = [...inventory];

    if (activeTab === 'add-product') {
      if (products.some(p => p.id === formattedId)) {
        alert('Ya existe un producto con este ID.');
        return;
      }
      updatedProducts.push(productObj);
      updatedInventory.push(newInvItem);
    } else {
      // Edit mode
      updatedProducts = products.map(p => p.id === formattedId ? productObj : p);
      updatedInventory = inventory.map(item => {
        if (item.productId === formattedId) {
          return {
            ...item,
            hasVariants: productHasVariantsVal,
            stock: productHasVariantsVal ? 0 : Number(productSingleStockVal) || 0,
            variants: productHasVariantsVal ? modalVariantsList.map((v) => ({
              id: v.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              name: v.name,
              stock: Number(v.stock) || 0
            })) : []
          };
        }
        return item;
      });
    }

    // Save to files
    fetch('/api/save-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: updatedProducts }, null, 2)
    })
    .then(() => {
      return fetch('/api/save-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInventory, null, 2)
      });
    })
    .then(() => {
      setActiveTab('inventory');
      window.location.reload();
    })
    .catch(err => {
      console.error('Error saving new/edited product:', err);
      alert('Error al guardar el producto.');
    });
  };

  // Delete Product completely
  const handleDeleteProduct = () => {
    if (!productIdVal) return;
    if (!window.confirm(`¿Está seguro de que desea eliminar el producto "${productNameVal}"? Esta acción eliminará el producto del catálogo y su inventario permanentemente.`)) {
      return;
    }

    const updatedProducts = products.filter(p => p.id !== productIdVal);
    const updatedInventory = inventory.filter(i => i.productId !== productIdVal);

    // Save changes
    fetch('/api/save-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: updatedProducts }, null, 2)
    })
    .then(() => {
      return fetch('/api/save-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInventory, null, 2)
      });
    })
    .then(() => {
      setActiveTab('inventory');
      window.location.reload();
    })
    .catch(err => {
      console.error('Error deleting product:', err);
      alert('Error al eliminar el producto.');
    });
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
                  background: (activeTab === 'inventory' || activeTab === 'add-product' || activeTab === 'edit-product') ? '#ffffff' : 'transparent',
                  color: (activeTab === 'inventory' || activeTab === 'add-product' || activeTab === 'edit-product') ? 'var(--accent-green)' : 'var(--text-medium)',
                  boxShadow: (activeTab === 'inventory' || activeTab === 'add-product' || activeTab === 'edit-product') ? 'var(--shadow-sm)' : 'none',
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
                onClick={() => setActiveTab('submissions')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1.1rem', border: 'none', borderRadius: '6px',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  background: activeTab === 'submissions' ? '#ffffff' : 'transparent',
                  color: activeTab === 'submissions' ? 'var(--accent-green)' : 'var(--text-medium)',
                  boxShadow: activeTab === 'submissions' ? 'var(--shadow-sm)' : 'none',
                  transition: 'var(--transition-fast)',
                  fontFamily: 'inherit'
                }}
              >
                <ClipboardList size={14} /> Formularios ({submissions.length})
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
        {/* EDIT / CREATE PRODUCT: FULL-SCREEN VIEWS */}
        {/* ============================================================== */}
        {(activeTab === 'add-product' || activeTab === 'edit-product') && (
          <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '2rem', boxShadow: 'var(--shadow-sm)', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
                {activeTab === 'add-product' ? 'Crear Nuevo Producto (Página Completa)' : `Editar Detalles del Producto: ${productNameVal}`}
              </h2>
              <button 
                type="button" 
                onClick={() => setActiveTab('inventory')}
                style={{ 
                  background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', 
                  fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-medium)',
                  padding: '0.5rem 1rem', borderRadius: '6px', fontFamily: 'inherit'
                }}
              >
                Volver a Inventario
              </button>
            </div>

            <form onSubmit={handleSaveModalProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* General inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                    ID Único (ej. vlift-mono, vlift-nose)
                  </label>
                  <input
                    type="text"
                    value={productIdVal}
                    onChange={e => setProductIdVal(e.target.value)}
                    disabled={activeTab === 'edit-product'}
                    placeholder="vlift-cooper"
                    required
                    style={{ width: '100%', height: '38px', padding: '0 0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', background: activeTab === 'edit-product' ? '#f1f5f9' : '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                    Nombre Comercial
                  </label>
                  <input
                    type="text"
                    value={productNameVal}
                    onChange={e => setProductNameVal(e.target.value)}
                    placeholder="V Lift Pro Cooper"
                    required
                    style={{ width: '100%', height: '38px', padding: '0 0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                    Marca
                  </label>
                  <select
                    value={productBrandVal}
                    onChange={e => setProductBrandVal(e.target.value as any)}
                    style={{ width: '100%', height: '38px', padding: '0 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', background: '#fff' }}
                  >
                    <option value="Vlift Pro">Vlift Pro</option>
                    <option value="Seffiline">Seffiline</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                    Categoría
                  </label>
                  <select
                    value={productCategoryVal}
                    onChange={e => setProductCategoryVal(e.target.value as any)}
                    style={{ width: '100%', height: '38px', padding: '0 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', background: '#fff' }}
                  >
                    <option value="Hilos PDO">Hilos PDO</option>
                    <option value="Medicina Regenerativa">Medicina Regenerativa</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                    Precio Base (USD)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={productPriceVal}
                    onChange={e => setProductPriceVal(e.target.value)}
                    required
                    style={{ width: '100%', height: '38px', padding: '0 0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                  Descripción Corta
                </label>
                <input
                  type="text"
                  value={productShortDescVal}
                  onChange={e => setProductShortDescVal(e.target.value)}
                  placeholder="Hilos PDO avanzados para soporte estructural..."
                  required
                  style={{ width: '100%', height: '38px', padding: '0 0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                  Descripción Completa
                </label>
                <textarea
                  value={productDescVal}
                  onChange={e => setProductDescVal(e.target.value)}
                  rows={4}
                  placeholder="Los hilos..."
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                  Imagen del Producto (Seleccione del Dispositivo o ingrese una ruta)
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={productImageVal}
                    onChange={e => setProductImageVal(e.target.value)}
                    placeholder="/images/uploads/my-photo.png"
                    style={{ flex: 1, height: '38px', padding: '0 0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit' }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageFileChange(e, 'product')}
                    style={{ display: 'none' }}
                    id="product-image-file"
                  />
                  <label
                    htmlFor="product-image-file"
                    style={{
                      background: 'var(--accent-blue-light)',
                      color: 'var(--accent-blue)',
                      padding: '0 1.25rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      height: '38px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: '1px solid var(--accent-blue)',
                      boxSizing: 'border-box',
                      gap: '0.25rem'
                    }}
                  >
                    <Upload size={14} /> {imageUploading['product'] ? 'Subiendo...' : 'Seleccionar Archivo'}
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                  Características Clave (Una característica por línea)
                </label>
                <textarea
                  value={productFeaturesVal}
                  onChange={e => setProductFeaturesVal(e.target.value)}
                  rows={3}
                  placeholder="Estimulación de colágeno&#10;Aguja ultra-fina painless"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              {/* Specs Manager Section */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', background: '#f8fafc' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)', display: 'block', marginBottom: '0.75rem' }}>
                  Especificaciones Técnicas
                </span>
                
                {productSpecsVal.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    {productSpecsVal.map((spec, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.82rem' }}>
                        <span><strong>{spec.label}:</strong> {spec.value}</span>
                        <button type="button" onClick={() => handleRemoveSpec(idx)} style={{ border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>Eliminar</button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Material (ej. PDO)"
                    value={tempSpecLabel}
                    onChange={e => setTempSpecLabel(e.target.value)}
                    style={{ flex: 1, height: '34px', padding: '0 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', background: '#fff' }}
                  />
                  <input
                    type="text"
                    placeholder="Valor (ej. Polidioxanona)"
                    value={tempSpecValue}
                    onChange={e => setTempSpecValue(e.target.value)}
                    style={{ flex: 1.2, height: '34px', padding: '0 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', background: '#fff' }}
                  />
                  <button type="button" onClick={handleAddSpec} style={{ height: '34px', padding: '0 1rem', background: 'var(--accent-blue)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                    Añadir
                  </button>
                </div>
              </div>

              {/* Variants and Stocks Section */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={productHasVariantsVal}
                      onChange={e => setProductHasVariantsVal(e.target.checked)}
                    />
                    ¿Tiene múltiples Medidas / Calibres? (Variantes de inventario)
                  </label>
                </div>

                {!productHasVariantsVal ? (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                      Stock Inicial Disponible
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={productSingleStockVal}
                      onChange={e => setProductSingleStockVal(e.target.value)}
                      style={{ width: '100px', height: '34px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit' }}
                    />
                  </div>
                ) : (
                  <div>
                    {modalVariantsList.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                        {modalVariantsList.map((variant, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.82rem' }}>
                            <span><strong>{variant.name}</strong> - Stock: {variant.stock}</span>
                            <button type="button" onClick={() => handleRemoveVariant(idx)} style={{ border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>Eliminar</button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Calibre (ej. 30G x 25mm)"
                        value={tempVariantName}
                        onChange={e => setTempVariantName(e.target.value)}
                        style={{ flex: 1.5, height: '34px', padding: '0 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', background: '#fff' }}
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={tempVariantStock}
                        onChange={e => setTempVariantStock(e.target.value)}
                        style={{ width: '85px', height: '34px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', background: '#fff' }}
                      />
                      <button type="button" onClick={handleAddVariant} style={{ height: '34px', padding: '0 1rem', background: 'var(--accent-blue)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                        Añadir
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '1rem' }}>
                <div>
                  {activeTab === 'edit-product' && (
                    <button 
                      type="button" 
                      onClick={handleDeleteProduct} 
                      style={{ background: 'var(--danger)', border: 'none', color: '#fff', borderRadius: '6px', padding: '0.75rem 1.5rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Eliminar Producto
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setActiveTab('inventory')} style={{ background: '#e2e8f0', border: 'none', color: 'var(--text-medium)', borderRadius: '6px', padding: '0.75rem 1.5rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Cancelar
                  </button>
                  <button type="submit" style={{ background: 'var(--primary-dark)', border: 'none', color: '#fff', borderRadius: '6px', padding: '0.75rem 2.5rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {activeTab === 'add-product' ? 'Crear Producto' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: INVENTORY & PRICES MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flex: 1 }}>
                <Info size={18} color="#1d4ed8" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                <p style={{ color: '#1e3a8a', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                  <strong>Modificación de Precios y Stock:</strong> Especifique el inventario disponible y el precio por unidad en dólares estadounidenses (USD) para cada artículo. El catálogo, las tarjetas del producto y el flujo de compra se actualizarán instantáneamente.
                </p>
              </div>
              <button
                onClick={handleOpenAddPage}
                className="btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.82rem', fontWeight: 800, flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Plus size={16} /> Añadir Producto
              </button>
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
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)', width: '180px' }}>Acciones</th>
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
                                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); toggleProductExpand(product.id); }}
                                      style={{
                                        background: isExpanded ? '#cbd5e1' : 'var(--accent-green-light)',
                                        color: isExpanded ? 'var(--text-medium)' : 'var(--accent-green)',
                                        border: 'none', borderRadius: '4px', padding: '0.35rem 0.5rem',
                                        fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', flex: 1,
                                        fontFamily: 'inherit', transition: 'all 0.2s'
                                      }}
                                    >
                                      {isExpanded ? 'Contraer' : 'Medidas'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); handleOpenEditPage(product); }}
                                      style={{
                                        background: 'rgba(3, 191, 215, 0.1)',
                                        color: '#03bfd7',
                                        border: 'none', borderRadius: '4px', padding: '0.35rem 0.5rem',
                                        fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                                        fontFamily: 'inherit', transition: 'all 0.2s'
                                      }}
                                    >
                                      Editar
                                    </button>
                                  </div>
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
                              <td style={{ padding: '0.4rem 1.5rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                <button
                                  onClick={() => handleSaveProduct(product.id, undefined)}
                                  style={{
                                    background: isSaved ? 'var(--success)' : 'var(--primary-dark)',
                                    border: 'none', borderRadius: '4px', height: '30px', flex: 1,
                                    color: '#FFFFFF', cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: '0.25rem',
                                    fontSize: '0.75rem', fontWeight: 700, transition: 'var(--transition-fast)',
                                    fontFamily: 'inherit'
                                  }}
                                >
                                  {isSaved ? <Check size={14} /> : <Edit2 size={12} />}
                                  {isSaved ? 'OK' : 'Guardar'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditPage(product)}
                                  style={{
                                    background: 'rgba(3, 191, 215, 0.1)',
                                    color: '#03bfd7',
                                    border: 'none', borderRadius: '4px', height: '30px', padding: '0 0.6rem',
                                    fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                                    fontFamily: 'inherit', transition: 'all 0.2s'
                                  }}
                                >
                                  Editar
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
        {activeTab === 'orders' && (() => {
          const sortedOrders = [...orders].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          const ordersPerPage = 10;
          const totalOrdersPages = Math.ceil(sortedOrders.length / ordersPerPage);
          const paginatedOrders = sortedOrders.slice((ordersPage - 1) * ordersPerPage, ordersPage * ordersPerPage);

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
              <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', margin: 0 }}>
                Historial de órdenes registradas a través del checkout B2B. Valide la matrícula médica del comprador antes de despachar.
              </p>

              {sortedOrders.length === 0 ? (
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
                  {paginatedOrders.map((order) => {
                    const currentStatus = tempOrderStatus[order.id] || order.status;
                    const hasStatusChanged = currentStatus !== order.status;
                    const isExpanded = expandedOrders[order.id];

                    return (
                      <div
                         key={order.id}
                         style={{
                           background: '#ffffff', border: '1px solid var(--border-light)',
                           borderRadius: '10px', boxShadow: 'var(--shadow-sm)',
                           padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem'
                         }}
                      >
                        {/* Order header row */}
                        <div 
                          style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            borderBottom: isExpanded ? '1px solid var(--border-light)' : 'none', 
                            paddingBottom: isExpanded ? '0.75rem' : '0rem',
                            flexWrap: 'wrap', gap: '0.5rem', cursor: 'pointer'
                          }}
                          onClick={() => setExpandedOrders(prev => ({ ...prev, [order.id]: !prev[order.id] }))}
                        >
                          <div>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                              Orden {order.id}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginLeft: '1rem' }}>
                              {order.date}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', marginLeft: '1rem', fontWeight: 600 }}>
                              {isExpanded ? '▲ Ocultar Detalle' : '▼ Ver Detalle'}
                            </span>
                          </div>
                          
                          {/* Action status dropdown & Delete order */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} onClick={(e) => e.stopPropagation()}>
                            <select
                              value={currentStatus}
                              onChange={(e) => setTempOrderStatus(prev => ({ ...prev, [order.id]: e.target.value as Order['status'] }))}
                              style={{
                                height: '32px', padding: '0 0.5rem', borderRadius: '4px', border: '1px solid',
                                borderColor: currentStatus === 'Pendiente' ? '#f59e0b' : currentStatus === 'Aprobado' ? 'var(--accent-green)' : currentStatus === 'Despachado' ? 'var(--accent-blue)' : 'var(--text-light)',
                                background: '#FFFFFF', fontSize: '0.8rem', fontWeight: 600,
                                color: currentStatus === 'Pendiente' ? '#d97706' : currentStatus === 'Aprobado' ? '#10b981' : currentStatus === 'Despachado' ? '#2563eb' : 'var(--text-medium)',
                                outline: 'none', fontFamily: 'inherit'
                              }}
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="Aprobado">Aprobado</option>
                              <option value="Despachado">Despachado</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>

                            {hasStatusChanged && (
                              <button
                                onClick={() => {
                                  updateOrderStatus(order.id, currentStatus);
                                  setTempOrderStatus(prev => {
                                    const updated = { ...prev };
                                    delete updated[order.id];
                                    return updated;
                                  });
                                }}
                                style={{
                                  background: 'var(--accent-green)',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '0.4rem 0.75rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)',
                                  transition: 'var(--transition-fast)'
                                }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.05)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                              >
                                Guardar
                              </button>
                            )}
                            
                            <button
                              onClick={() => deleteOrder(order.id)}
                              style={{
                                background: 'none', border: 'none', color: 'var(--danger)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', padding: '0.25rem', borderRadius: '4px',
                                transition: 'background 0.2s'
                              }}
                              onMouseOver={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
                              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              title="Eliminar Pedido"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Order details grid (Only visible if expanded) */}
                        {isExpanded && (
                          <div className="order-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', animation: 'fadeIn 0.25s ease' }}>
                            {/* Left side: Buyer info & Payment */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                <div>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>Comprador</span>
                                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)' }}>{order.fullName}</span>
                                </div>
                                <div>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>Especialidad / Matrícula</span>
                                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-medium)' }}>{order.specialty} - M.N. {order.licenseNumber}</span>
                                </div>
                                <div>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>Contacto</span>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-medium)' }}>
                                    <span>📞 {order.phone}</span>
                                    {order.email && <span>✉️ {order.email}</span>}
                                  </div>
                                </div>
                                <div>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>Método de Pago</span>
                                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: order.paymentMethod === 'transfer' ? 'var(--accent-blue)' : order.paymentMethod === 'mercadopago' ? 'var(--accent-green)' : 'var(--accent-green)' }}>
                                    {order.paymentMethod === 'transfer' ? 'Landmark Transferencia' : order.paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Tarjeta Online'}
                                  </span>
                                </div>
                              </div>

                              {/* Order items table */}
                              <div style={{ border: '1px solid var(--border-light)', borderRadius: '6px', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                                  <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                                      <th style={{ padding: '0.5rem 1rem', fontWeight: 600, color: 'var(--text-medium)' }}>Insumo</th>
                                      <th style={{ padding: '0.5rem 1rem', fontWeight: 600, color: 'var(--text-medium)' }}>Medida/Calibre</th>
                                      <th style={{ padding: '0.5rem 1rem', fontWeight: 600, color: 'var(--text-medium)', textAlign: 'center' }}>Cant.</th>
                                      <th style={{ padding: '0.5rem 1rem', fontWeight: 600, color: 'var(--text-medium)', textAlign: 'right' }}>Unitario</th>
                                      <th style={{ padding: '0.5rem 1rem', fontWeight: 600, color: 'var(--text-medium)', textAlign: 'right' }}>Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, idx) => (
                                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                        <td style={{ padding: '0.6rem 1rem', fontWeight: 600, color: 'var(--primary-dark)' }}>{item.productName}</td>
                                        <td style={{ padding: '0.6rem 1rem', color: 'var(--text-medium)' }}>{item.variantName || 'Estándar'}</td>
                                        <td style={{ padding: '0.6rem 1rem', textAlign: 'center', fontWeight: 700 }}>{item.quantity}</td>
                                        <td style={{ padding: '0.6rem 1rem', textAlign: 'right', color: 'var(--text-medium)' }}>USD ${item.price.toFixed(2)}</td>
                                        <td style={{ padding: '0.6rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--text-dark)' }}>USD ${(item.quantity * item.price).toFixed(2)}</td>
                                      </tr>
                                    ))}
                                    <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                                      <td colSpan={4} style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.88rem' }}>Total General:</td>
                                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '1rem', color: 'var(--accent-blue)' }}>USD ${order.total.toFixed(2)}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Right side: Delivery address */}
                            <div style={{ background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
                              <span style={{ fontWeight: 700, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <MapPin size={16} color="var(--accent-green)" /> Dirección de Despacho
                              </span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text-medium)', fontWeight: 500, paddingLeft: '1.25rem' }}>
                                <span>Calle: {order.address}</span>
                                <span>Ciudad: {order.city}</span>
                                <span>Provincia: {order.province}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Orders Pagination Controls */}
              {totalOrdersPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <button 
                    disabled={ordersPage === 1}
                    onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: ordersPage === 1 ? 0.5 : 1 }}
                  >
                    Anterior
                  </button>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Página {ordersPage} de {totalOrdersPages}</span>
                  <button 
                    disabled={ordersPage === totalOrdersPages}
                    onClick={() => setOrdersPage(p => Math.min(totalOrdersPages, p + 1))}
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: ordersPage === totalOrdersPages ? 0.5 : 1 }}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* ============================================================== */}
        {/* TAB 3: FORM SUBMISSIONS LIST */}
        {/* ============================================================== */}
        {activeTab === 'submissions' && (() => {
          const sortedSubmissions = [...submissions].reverse();
          const submissionsPerPage = 10;
          const totalSubmissionsPages = Math.ceil(sortedSubmissions.length / submissionsPerPage);
          const paginatedSubmissions = sortedSubmissions.slice((submissionsPage - 1) * submissionsPerPage, submissionsPage * submissionsPerPage);

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
              <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', margin: 0 }}>
                Registro de mensajes recibidos a través del formulario de contacto y del formulario de inscripción a cursos internacionales.
              </p>

              {sortedSubmissions.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '4rem 2rem', background: '#ffffff',
                  border: '1px solid var(--border-light)', borderRadius: '10px', color: 'var(--text-medium)'
                }}>
                  <ClipboardList size={40} style={{ opacity: 0.4, marginBottom: '1rem' }} />
                  <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No hay formularios registrados</p>
                  <p style={{ fontSize: '0.85rem' }}>Las consultas de contacto e inscripciones aparecerán en esta lista.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)' }}>Fecha</th>
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)' }}>Tipo</th>
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)' }}>Nombre</th>
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)' }}>Email</th>
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)' }}>Teléfono</th>
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)' }}>País / Especialidad</th>
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-medium)' }}>Mensaje / Consulta</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedSubmissions.map((sub: any) => (
                          <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-medium)' }}>{sub.date}</td>
                            <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.82rem' }}>
                              <span className={`badge ${sub.type === 'Contacto Web' ? 'badge-accent-blue' : 'badge-dark'}`}>{sub.type}</span>
                            </td>
                            <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{sub.name}</td>
                            <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.82rem', color: 'var(--text-medium)' }}>{sub.email}</td>
                            <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.82rem', color: 'var(--text-medium)' }}>{sub.phone}</td>
                            <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-medium)' }}>{sub.country || 'N/A'}</td>
                            <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.82rem', color: 'var(--text-medium)' }}>{sub.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Submissions Pagination Controls */}
                  {totalSubmissionsPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                      <button 
                        disabled={submissionsPage === 1}
                        onClick={() => setSubmissionsPage(p => Math.max(1, p - 1))}
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: submissionsPage === 1 ? 0.5 : 1 }}
                      >
                        Anterior
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Página {submissionsPage} de {totalSubmissionsPages}</span>
                      <button 
                        disabled={submissionsPage === totalSubmissionsPages}
                        onClick={() => setSubmissionsPage(p => Math.min(totalSubmissionsPages, p + 1))}
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: submissionsPage === totalSubmissionsPages ? 0.5 : 1 }}
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* ============================================================== */}
        {/* TAB 4: SITE GENERAL WEB CONFIGURATION */}
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

              {/* Box 4: Homepage slides */}
              <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', gridColumn: 'span 2' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="var(--accent-green)" /> Banners de la Página de Inicio (Slides)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {slidesState.map((slide, index) => {
                    const targetKey = `slide-${index}`;
                    return (
                      <div key={slide.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', background: '#f8fafc' }}>
                        <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent-blue)', marginBottom: '1rem' }}>
                          Diapositiva {index + 1} ({slide.badge})
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                              Etiqueta Superior (Badge)
                            </label>
                            <input
                              type="text"
                              value={slide.badge}
                              onChange={e => handleSlideChange(index, 'badge', e.target.value)}
                              style={{ width: '100%', height: '34px', padding: '0 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', background: '#ffffff' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                              Texto Resaltado (Highlight)
                            </label>
                            <input
                              type="text"
                              value={slide.highlightText}
                              onChange={e => handleSlideChange(index, 'highlightText', e.target.value)}
                              style={{ width: '100%', height: '34px', padding: '0 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', background: '#ffffff' }}
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                            Título Principal
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={e => handleSlideChange(index, 'title', e.target.value)}
                            style={{ width: '100%', height: '34px', padding: '0 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', background: '#ffffff' }}
                          />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                            Subtítulo / Descripción
                          </label>
                          <textarea
                            value={slide.subtitle}
                            onChange={e => handleSlideChange(index, 'subtitle', e.target.value)}
                            rows={2}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', background: '#ffffff', resize: 'vertical' }}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                              Imagen (Seleccione archivo o ingrese ruta)
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <input
                                type="text"
                                value={slide.image}
                                onChange={e => handleSlideChange(index, 'image', e.target.value)}
                                style={{ flex: 1, height: '34px', padding: '0 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', background: '#ffffff' }}
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => handleImageFileChange(e, index)}
                                style={{ display: 'none' }}
                                id={`slide-file-${index}`}
                              />
                              <label
                                htmlFor={`slide-file-${index}`}
                                style={{
                                  background: 'var(--accent-blue-light)',
                                  color: 'var(--accent-blue)',
                                  padding: '0 0.75rem',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  height: '34px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  border: '1px solid var(--accent-blue)',
                                  boxSizing: 'border-box',
                                  gap: '0.2rem'
                                }}
                              >
                                <Upload size={12} /> {imageUploading[targetKey] ? 'Subiendo...' : 'Subir'}
                              </label>
                            </div>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                              Texto del Botón
                            </label>
                            <input
                              type="text"
                              value={slide.buttonText}
                              onChange={e => handleSlideChange(index, 'buttonText', e.target.value)}
                              style={{ width: '100%', height: '34px', padding: '0 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', background: '#ffffff' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
