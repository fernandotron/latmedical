import React, { useState, useEffect } from 'react';
import { useInventory, Order } from '../context/InventoryContext';
import { products, Product } from '../data/products';
import { 
  Package, 
  ClipboardList, 
  Check, 
  Edit2, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Trash2, 
  Settings, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Info, 
  Sparkles, 
  Plus, 
  Upload, 
  RefreshCw,
  Flame,
  Download,
  FileText,
  ShoppingCart,
  Receipt,
  Search,
  User,
  Send,
  Printer,
  CheckCircle2,
  AlertCircle,
  LogOut
} from 'lucide-react';
import defaultSettings from '../data/general_settings.json';
import defaultSlides from '../data/home_slides.json';
import { StockReportModal } from './StockReportModal';

type AdminTab = 'inventory' | 'clearance' | 'orders' | 'manual-order' | 'settings' | 'submissions' | 'add-product' | 'edit-product';

interface AdminPanelProps {
  isAdminLoggedIn: boolean;
  onAdminLoginChange: (loggedIn: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isAdminLoggedIn, onAdminLoginChange }) => {
  const { 
    inventory, 
    orders, 
    clearanceOffers,
    updateStock, 
    updateOrderStatus, 
    deleteOrder,
    addOrder,
    addClearanceOffer,
    updateClearanceOffer,
    deleteClearanceOffer,
    toggleClearanceOffer
  } = useInventory();
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

  // Clearance Offers Creation State
  const [clrProductId, setClrProductId] = useState(products[0]?.id || '');
  const [clrVariantId, setClrVariantId] = useState('');
  const [clrClearancePrice, setClrClearancePrice] = useState('');
  const [clrStock, setClrStock] = useState('3');
  const [clrExpiryDate, setClrExpiryDate] = useState('Octubre 2026');
  const [clrBatchNumber, setClrBatchNumber] = useState('');
  const [clrNote, setClrNote] = useState('');
  const [clrFormFeedback, setClrFormFeedback] = useState(false);
  const [isStockReportOpen, setIsStockReportOpen] = useState(false);

  // Clearance Inline Edits State
  const [clrEditState, setClrEditState] = useState<Record<string, { stock: number; price: number; expiryDate: string; batchNumber: string; note: string }>>({});

  // Sync clrEditState from clearanceOffers
  useEffect(() => {
    setClrEditState(prev => {
      const next = { ...prev };
      clearanceOffers.forEach(o => {
        if (!next[o.id]) {
          next[o.id] = {
            stock: o.stock,
            price: o.clearancePrice,
            expiryDate: o.expiryDate,
            batchNumber: o.batchNumber || '',
            note: o.note || ''
          };
        }
      });
      return next;
    });
  }, [clearanceOffers]);

  // Handler to add new clearance offer
  const handleCreateClearanceOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === clrProductId);
    if (!product) return;

    const inv = inventory.find(i => i.productId === clrProductId);
    let variantName: string | undefined = undefined;
    let regPrice = product.price;

    if (inv && inv.hasVariants && clrVariantId) {
      const variant = inv.variants.find(v => v.id === clrVariantId);
      if (variant) {
        variantName = variant.name;
        if (variant.price !== undefined) regPrice = variant.price;
      }
    }

    const clearancePriceNum = Math.max(0, parseFloat(clrClearancePrice) || 0);
    const stockNum = Math.max(1, parseInt(clrStock, 10) || 1);

    addClearanceOffer({
      productId: product.id,
      variantId: clrVariantId || undefined,
      variantName: variantName,
      productName: product.name,
      brand: product.brand,
      image: product.image,
      regularPrice: regPrice,
      clearancePrice: clearancePriceNum,
      stock: stockNum,
      expiryDate: clrExpiryDate.trim() || 'Caducidad Próxima',
      batchNumber: clrBatchNumber.trim() || undefined,
      note: clrNote.trim() || 'Empaque indemne y esterilidad 100% garantizada.',
      active: true
    });

    setClrClearancePrice('');
    setClrBatchNumber('');
    setClrNote('');
    setClrFormFeedback(true);
    setTimeout(() => setClrFormFeedback(false), 2500);
  };

  const handleClrValChange = (id: string, field: 'stock' | 'price' | 'expiryDate' | 'batchNumber' | 'note', val: string) => {
    setClrEditState(prev => {
      const current = prev[id] || { stock: 0, price: 0, expiryDate: '', batchNumber: '', note: '' };
      if (field === 'stock') {
        const parsed = parseInt(val, 10);
        return { ...prev, [id]: { ...current, stock: isNaN(parsed) ? 0 : parsed } };
      }
      if (field === 'price') {
        const parsed = parseFloat(val);
        return { ...prev, [id]: { ...current, price: isNaN(parsed) ? 0 : parsed } };
      }
      return { ...prev, [id]: { ...current, [field]: val } };
    });
  };

  const handleSaveClearanceRow = (id: string) => {
    const edit = clrEditState[id];
    if (!edit) return;

    updateClearanceOffer(id, {
      stock: Math.max(0, edit.stock),
      clearancePrice: Math.max(0, edit.price),
      expiryDate: edit.expiryDate,
      batchNumber: edit.batchNumber.trim() || undefined,
      note: edit.note.trim() || undefined
    });

    setSavedFeedback(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setSavedFeedback(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  // Manual Order (Holded ERP style) State
  interface ManualOrderItem {
    lineId: string;
    productId: string;
    variantId?: string;
    variantName?: string;
    productName: string;
    brand: string;
    image: string;
    stock: number;
    regularPrice: number;
    price: number; // Editable custom price (USD)
    quantity: number;
  }

  const [moItems, setMoItems] = useState<ManualOrderItem[]>([]);
  const [moSearchQuery, setMoSearchQuery] = useState('');
  const [moSelectedBrand, setMoSelectedBrand] = useState<'all' | 'Vlift Pro' | 'Seffiline'>('all');
  
  // Customer Details
  const [moCustomerName, setMoCustomerName] = useState('');
  const [moCustomerPhone, setMoCustomerPhone] = useState('');
  const [moCustomerEmail, setMoCustomerEmail] = useState('');
  const [moCustomerSpecialty, setMoCustomerSpecialty] = useState('');
  const [moCustomerLicense, setMoCustomerLicense] = useState('');
  const [moCustomerAddress, setMoCustomerAddress] = useState('');
  const [moCustomerCity, setMoCustomerCity] = useState('');
  const [moCustomerProvince, setMoCustomerProvince] = useState('Buenos Aires');
  const [moPaymentMethod, setMoPaymentMethod] = useState('Transferencia Bancaria');
  const [moOrderStatus, setMoOrderStatus] = useState<Order['status']>('Aprobado');
  const [moOrderNotes, setMoOrderNotes] = useState('');
  const [moGlobalDiscountUSD, setMoGlobalDiscountUSD] = useState<string>('0');
  const [moDecrementStock, setMoDecrementStock] = useState<boolean>(true);

  // Success Feedback
  const [moCreatedOrder, setMoCreatedOrder] = useState<Order | null>(null);
  const [moError, setMoError] = useState<string>('');

  // Add a product or variant line to the order
  const handleAddProductToManualOrder = (prod: Product, variant?: { id: string; name: string; price?: number; stock: number }, initialStock?: number) => {
    const vName = variant ? variant.name : undefined;
    const vId = variant ? variant.id : undefined;
    const regPrice = (variant && variant.price !== undefined) ? variant.price : prod.price;
    const stockAvailable = variant ? variant.stock : (initialStock !== undefined ? initialStock : 0);

    const existingIndex = moItems.findIndex(i => i.productId === prod.id && i.variantName === vName);

    if (existingIndex >= 0) {
      setMoItems(prev => prev.map((item, idx) => idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      const newItem: ManualOrderItem = {
        lineId: `line-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId: prod.id,
        variantId: vId,
        variantName: vName,
        productName: prod.name,
        brand: prod.brand,
        image: prod.image,
        stock: stockAvailable,
        regularPrice: regPrice,
        price: regPrice, // Starts with default price, completely editable!
        quantity: 1
      };
      setMoItems(prev => [newItem, ...prev]);
    }
  };

  const handleUpdateManualOrderLine = (lineId: string, field: 'quantity' | 'price', val: number) => {
    setMoItems(prev => prev.map(item => {
      if (item.lineId !== lineId) return item;
      if (field === 'quantity') {
        return { ...item, quantity: Math.max(1, Math.round(val) || 1) };
      }
      if (field === 'price') {
        return { ...item, price: Math.max(0, val || 0) };
      }
      return item;
    }));
  };

  const handleRemoveManualOrderLine = (lineId: string) => {
    setMoItems(prev => prev.filter(item => item.lineId !== lineId));
  };

  const handleClearManualOrder = () => {
    setMoItems([]);
    setMoCustomerName('');
    setMoCustomerPhone('');
    setMoCustomerEmail('');
    setMoCustomerSpecialty('');
    setMoCustomerLicense('');
    setMoCustomerAddress('');
    setMoCustomerCity('');
    setMoCustomerProvince('Buenos Aires');
    setMoPaymentMethod('Transferencia Bancaria');
    setMoOrderStatus('Aprobado');
    setMoOrderNotes('');
    setMoGlobalDiscountUSD('0');
    setMoCreatedOrder(null);
    setMoError('');
  };

  // Calculations
  const moSubtotalUSD = moItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const moDiscountNum = Math.max(0, parseFloat(moGlobalDiscountUSD) || 0);
  const moTotalUSD = Math.max(0, moSubtotalUSD - moDiscountNum);
  const moTotalUnits = moItems.reduce((sum, item) => sum + item.quantity, 0);

  // Process and save manual order
  const handleProcessManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setMoError('');

    if (moItems.length === 0) {
      setMoError('Debe agregar al menos un producto a la orden de venta.');
      return;
    }

    if (!moCustomerName.trim()) {
      setMoError('Por favor ingrese el nombre del médico, clínica o cliente.');
      return;
    }

    const orderItems = moItems.map(item => ({
      productId: item.productId,
      productName: item.productName,
      brand: item.brand,
      variantName: item.variantName,
      quantity: item.quantity,
      price: item.price
    }));

    const created = addOrder({
      fullName: moCustomerName.trim(),
      phone: moCustomerPhone.trim() || 'Sin teléfono',
      email: moCustomerEmail.trim() || undefined,
      specialty: moCustomerSpecialty.trim() || 'Médico / Clínica B2B',
      licenseNumber: moCustomerLicense.trim() || 'Venta Especial Admin',
      address: moCustomerAddress.trim() || 'Despacho a convenir',
      city: moCustomerCity.trim() || 'CABA',
      province: moCustomerProvince.trim() || 'Buenos Aires',
      paymentMethod: moPaymentMethod,
      items: orderItems,
      total: moTotalUSD
    });

    if (moOrderStatus !== 'Pendiente') {
      updateOrderStatus(created.id, moOrderStatus);
    }

    setMoCreatedOrder({ ...created, status: moOrderStatus });
  };

  // Expanded Products state for collapsing multiple calibers
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

  const toggleProductExpand = (productId: string) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Fetch Form Submissions dynamically on mount or tab change and merge with localStorage backup
  const loadSubmissions = () => {
    let localSubs: any[] = [];
    try {
      const saved = localStorage.getItem('latmedical_submissions');
      if (saved) localSubs = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading local submissions:', e);
    }

    fetch(`/api/data/form_submissions.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const remoteSubs = Array.isArray(data) ? data : [];
        const mergedMap = new Map<string, any>();
        
        // Populate local first
        localSubs.forEach(sub => {
          if (sub && sub.id) mergedMap.set(sub.id, sub);
        });
        // Override or append remote
        remoteSubs.forEach(sub => {
          if (sub && sub.id) mergedMap.set(sub.id, sub);
        });
        
        const mergedList = Array.from(mergedMap.values());
        setSubmissions(mergedList);
      })
      .catch(err => {
        console.error('Error loading submissions from server:', err);
        setSubmissions(localSubs);
      });
  };

  useEffect(() => {
    loadSubmissions();
  }, [activeTab]);

  // Initialize editing states from product data without wiping in-progress user inputs
  useEffect(() => {
    setEditState(prev => {
      const next = { ...prev };
      products.forEach(product => {
        const inv = inventory.find(i => i.productId === product.id);
        if (inv) {
          if (inv.hasVariants) {
            inv.variants.forEach(variant => {
              const key = `${product.id}-${variant.id}`;
              if (!next[key]) {
                next[key] = {
                  stock: variant.stock,
                  price: variant.price !== undefined ? variant.price : product.price
                };
              }
            });
          } else {
            const key = product.id;
            if (!next[key]) {
              next[key] = {
                stock: inv.stock,
                price: product.price
              };
            }
          }
        }
      });
      return next;
    });
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

    const newStock = Math.max(0, Math.floor(itemData.stock));
    const newPrice = Math.max(0, Number(itemData.price) || 0);

    // 1. Update stock context in memory (and variant price if variant)
    updateStock(productId, variantId, newStock, newPrice);

    // 2. Only update product.price override dynamically if it has no variants
    if (!variantId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        product.price = newPrice;
      }
    }

    // 3. Prepare updated data for JSON files
    const updatedProductsList = products.map(p => {
      if (p.id === productId && !variantId) {
        return { ...p, price: newPrice };
      }
      return p;
    });

    const updatedInventoryList = inventory.map(item => {
      if (item.productId !== productId) return item;
      if (item.hasVariants && variantId) {
        return {
          ...item,
          variants: item.variants.map(v => 
            v.id === variantId ? { ...v, stock: newStock, price: newPrice } : v
          )
        };
      } else {
        return { ...item, stock: newStock };
      }
    });

    // 4. Persist to server backend
    persistProductsAndInventory(updatedProductsList, updatedInventoryList);

    // 5. Keep saved state preserved in editState
    setEditState(prev => ({
      ...prev,
      [key]: { stock: newStock, price: newPrice }
    }));

    setSavedFeedback(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setSavedFeedback(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  // Bulk save all inventory rows
  const handleSaveAllProducts = () => {
    const updatedProductsList = products.map(product => {
      const inv = inventory.find(i => i.productId === product.id);
      if (inv && !inv.hasVariants) {
        const edit = editState[product.id];
        if (edit) {
          const newPrice = Math.max(0, Number(edit.price) || 0);
          product.price = newPrice;
          return { ...product, price: newPrice };
        }
      }
      return product;
    });

    const updatedInventoryList = inventory.map(item => {
      if (item.hasVariants) {
        return {
          ...item,
          variants: item.variants.map(v => {
            const key = `${item.productId}-${v.id}`;
            const edit = editState[key];
            const newStock = edit ? Math.max(0, Math.floor(edit.stock)) : v.stock;
            const newPrice = edit ? Math.max(0, Number(edit.price) || 0) : (v.price !== undefined ? v.price : (products.find(p => p.id === item.productId)?.price ?? 0));
            return {
              ...v,
              stock: newStock,
              price: newPrice
            };
          })
        };
      } else {
        const edit = editState[item.productId];
        const newStock = edit ? Math.max(0, Math.floor(edit.stock)) : item.stock;
        return {
          ...item,
          stock: newStock
        };
      }
    });

    // Update inventory context
    updatedInventoryList.forEach(item => {
      if (item.hasVariants) {
        item.variants.forEach(v => {
          updateStock(item.productId, v.id, v.stock, v.price);
        });
      } else {
        updateStock(item.productId, undefined, item.stock);
      }
    });

    // Persist
    persistProductsAndInventory(updatedProductsList, updatedInventoryList);

    // Provide feedback
    const feedbackMap: Record<string, boolean> = { all: true };
    Object.keys(editState).forEach(k => {
      feedbackMap[k] = true;
    });
    setSavedFeedback(feedbackMap);
    setTimeout(() => {
      setSavedFeedback({});
    }, 2500);
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

  // Export Complete Inventory Report to CSV / Excel
  const handleExportStockCSV = (includeOutlet: boolean = true) => {
    const headers = [
      'Tipo de Inventario',
      'ID Producto',
      'Nombre Comercial',
      'Marca',
      'Categoría',
      'Variante / Calibre',
      'Stock Físico (Unidades)',
      'Precio Base (USD)',
      'Precio Final (USD)',
      'Valor Total Stock (USD)',
      'Fecha de Vencimiento',
      'Lote / Observaciones'
    ];

    const rows: string[][] = [];

    // 1. Regular Catalog Products
    products.forEach(p => {
      const inv = inventory.find(i => i.productId === p.id);
      if (inv && inv.hasVariants && inv.variants) {
        inv.variants.forEach(v => {
          const key = `${p.id}-${v.id}`;
          const currentStock = editState[key] ? editState[key].stock : v.stock;
          const currentPrice = editState[key] ? editState[key].price : (v.price !== undefined ? v.price : p.price);
          const totalVal = currentStock * currentPrice;
          rows.push([
            'Catálogo Regular',
            p.id,
            `"${p.name.replace(/"/g, '""')}"`,
            p.brand,
            p.category,
            `"${v.name.replace(/"/g, '""')}"`,
            currentStock.toString(),
            currentPrice.toFixed(2),
            currentPrice.toFixed(2),
            totalVal.toFixed(2),
            'Vigente',
            'Stock disponible almacén central'
          ]);
        });
      } else {
        const currentStock = editState[p.id] ? editState[p.id].stock : (inv ? inv.stock : 0);
        const currentPrice = editState[p.id] ? editState[p.id].price : p.price;
        const totalVal = currentStock * currentPrice;
        rows.push([
          'Catálogo Regular',
          p.id,
          `"${p.name.replace(/"/g, '""')}"`,
          p.brand,
          p.category,
          'Único / Estándar',
          currentStock.toString(),
          currentPrice.toFixed(2),
          currentPrice.toFixed(2),
          totalVal.toFixed(2),
          'Vigente',
          'Stock disponible almacén central'
        ]);
      }
    });

    // 2. Outlet / Clearance Items
    if (includeOutlet && clearanceOffers && clearanceOffers.length > 0) {
      clearanceOffers.forEach(c => {
        const totalVal = c.stock * c.clearancePrice;
        rows.push([
          'Outlet / Oportunidad por Caducidad',
          c.id,
          `"${(c.productName || '').replace(/"/g, '""')}"`,
          c.brand || 'Vlift Pro',
          'Outlet B2B',
          `"${(c.variantName || 'Lote Especial').replace(/"/g, '""')}"`,
          c.stock.toString(),
          (c.regularPrice || 0).toFixed(2),
          (c.clearancePrice || 0).toFixed(2),
          totalVal.toFixed(2),
          c.expiryDate || 'Consultar',
          `"${(c.batchNumber ? `Lote: ${c.batchNumber}. ` : '') + (c.note || '')}"`
        ]);
      });
    }

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `Inventario_Latmedical_Completo_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    <div style={{ padding: 'calc(var(--header-height) + 1.5rem) 0 6rem 0', animation: 'fadeIn 0.5s ease', background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1600px', width: '100%', padding: '0 1.25rem' }}>
        
        {/* Holded-Style 2-Column Dashboard Layout */}
        <div className="admin-layout" style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start' }}>
          
          {/* ============================================================== */}
          {/* LEFT SIDEBAR (HOLDED ERP STYLE) */}
          {/* ============================================================== */}
          <aside className="admin-sidebar" style={{
            width: '280px',
            flexShrink: 0,
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: '1.5rem 1.25rem',
            boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            position: 'sticky',
            top: 'calc(var(--header-height) + 1.5rem)',
            maxHeight: 'calc(100vh - var(--header-height) - 3rem)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            
            {/* Sidebar Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--primary-dark) 0%, #0f172a 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                flexShrink: 0
              }}>
                LM
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                  Latmedical
                </div>
                <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a', display: 'inline-block', boxShadow: '0 0 0 2px #dcfce7' }}></span>
                  Panel B2B Activo
                </div>
              </div>
            </div>

            {/* Navigation Groups */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Group 1: Catálogo & Comercial */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem 0.5rem 0.5rem' }}>
                  Gestión Comercial
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  
                  {/* Tab: Inventario */}
                  <button
                    onClick={() => setActiveTab('inventory')}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.7rem 0.85rem',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: (activeTab === 'inventory' || activeTab === 'add-product' || activeTab === 'edit-product') ? 700 : 500,
                      cursor: 'pointer',
                      background: (activeTab === 'inventory' || activeTab === 'add-product' || activeTab === 'edit-product') ? '#f0fdf4' : 'transparent',
                      color: (activeTab === 'inventory' || activeTab === 'add-product' || activeTab === 'edit-product') ? '#166534' : 'var(--text-dark)',
                      boxShadow: (activeTab === 'inventory' || activeTab === 'add-product' || activeTab === 'edit-product') ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                      borderLeft: (activeTab === 'inventory' || activeTab === 'add-product' || activeTab === 'edit-product') ? '4px solid #16a34a' : '4px solid transparent',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      fontFamily: 'inherit'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Package size={17} color={(activeTab === 'inventory' || activeTab === 'add-product' || activeTab === 'edit-product') ? '#16a34a' : '#64748b'} />
                      <span>Inventario y Precios</span>
                    </div>
                  </button>

                  {/* Tab: Lotes Outlet */}
                  <button
                    onClick={() => setActiveTab('clearance')}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.7rem 0.85rem',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: activeTab === 'clearance' ? 700 : 500,
                      cursor: 'pointer',
                      background: activeTab === 'clearance' ? '#fef2f2' : 'transparent',
                      color: activeTab === 'clearance' ? '#dc2626' : 'var(--text-dark)',
                      boxShadow: activeTab === 'clearance' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                      borderLeft: activeTab === 'clearance' ? '4px solid #dc2626' : '4px solid transparent',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      fontFamily: 'inherit'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Flame size={17} color={activeTab === 'clearance' ? '#dc2626' : '#64748b'} />
                      <span>Lotes en Oferta</span>
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '12px',
                      background: activeTab === 'clearance' ? '#fee2e2' : '#f1f5f9',
                      color: activeTab === 'clearance' ? '#b91c1c' : '#64748b'
                    }}>
                      {clearanceOffers.length}
                    </span>
                  </button>

                  {/* Tab: Pedidos */}
                  <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.7rem 0.85rem',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: activeTab === 'orders' ? 700 : 500,
                      cursor: 'pointer',
                      background: activeTab === 'orders' ? '#f0fdf4' : 'transparent',
                      color: activeTab === 'orders' ? '#166534' : 'var(--text-dark)',
                      boxShadow: activeTab === 'orders' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                      borderLeft: activeTab === 'orders' ? '4px solid #16a34a' : '4px solid transparent',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      fontFamily: 'inherit'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <ClipboardList size={17} color={activeTab === 'orders' ? '#16a34a' : '#64748b'} />
                      <span>Historial de Pedidos</span>
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '12px',
                      background: activeTab === 'orders' ? '#dcfce7' : '#f1f5f9',
                      color: activeTab === 'orders' ? '#15803d' : '#64748b'
                    }}>
                      {orders.length}
                    </span>
                  </button>

                </div>
              </div>

              {/* Group 2: Punto de Venta & Cotizaciones */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem 0.5rem 0.5rem' }}>
                  Punto de Venta (POS)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  
                  {/* Tab: Manual Order (Holded ERP style) */}
                  <button
                    onClick={() => {
                      setMoCreatedOrder(null);
                      setActiveTab('manual-order');
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0.85rem',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: activeTab === 'manual-order' ? '#eff6ff' : '#f8fafc',
                      color: activeTab === 'manual-order' ? '#1d4ed8' : '#2563eb',
                      boxShadow: activeTab === 'manual-order' ? '0 1px 3px rgba(37, 99, 235, 0.1)' : 'none',
                      borderLeft: activeTab === 'manual-order' ? '4px solid #2563eb' : '4px solid #93c5fd',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      fontFamily: 'inherit'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Receipt size={17} color="#2563eb" />
                      <span>+ Crear Venta / Pedido</span>
                    </div>
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      background: '#dbeafe',
                      color: '#1e40af',
                      textTransform: 'uppercase'
                    }}>
                      POS
                    </span>
                  </button>

                </div>
              </div>

              {/* Group 3: Formularios & Configuración Web */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem 0.5rem 0.5rem' }}>
                  Administración & Web
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  
                  {/* Tab: Submissions */}
                  <button
                    onClick={() => setActiveTab('submissions')}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.7rem 0.85rem',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: activeTab === 'submissions' ? 700 : 500,
                      cursor: 'pointer',
                      background: activeTab === 'submissions' ? '#f0fdf4' : 'transparent',
                      color: activeTab === 'submissions' ? '#166534' : 'var(--text-dark)',
                      boxShadow: activeTab === 'submissions' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                      borderLeft: activeTab === 'submissions' ? '4px solid #16a34a' : '4px solid transparent',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      fontFamily: 'inherit'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <FileText size={17} color={activeTab === 'submissions' ? '#16a34a' : '#64748b'} />
                      <span>Formularios Web</span>
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '12px',
                      background: activeTab === 'submissions' ? '#dcfce7' : '#f1f5f9',
                      color: activeTab === 'submissions' ? '#15803d' : '#64748b'
                    }}>
                      {submissions.length}
                    </span>
                  </button>

                  {/* Tab: Settings */}
                  <button
                    onClick={() => setActiveTab('settings')}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.7rem 0.85rem',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: activeTab === 'settings' ? 700 : 500,
                      cursor: 'pointer',
                      background: activeTab === 'settings' ? '#f0fdf4' : 'transparent',
                      color: activeTab === 'settings' ? '#166534' : 'var(--text-dark)',
                      boxShadow: activeTab === 'settings' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                      borderLeft: activeTab === 'settings' ? '4px solid #16a34a' : '4px solid transparent',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      fontFamily: 'inherit'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Settings size={17} color={activeTab === 'settings' ? '#16a34a' : '#64748b'} />
                      <span>Configuración Web</span>
                    </div>
                  </button>

                </div>
              </div>

            </nav>

            {/* Sidebar Footer / User Profile & Logout */}
            <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#e2e8f0', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem' }}>
                  <User size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Admin Principal
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>
                    Acceso Total
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#dc2626',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                  e.currentTarget.style.borderColor = '#fca5a5';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <LogOut size={15} /> Cerrar Sesión
              </button>
            </div>

          </aside>

          {/* ============================================================== */}
          {/* RIGHT MAIN CONTENT AREA */}
          {/* ============================================================== */}
          <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.4s ease' }}>
            
            {/* Top Toolbar Container: Grouped Action Buttons + Full-Width Info Banner */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Header Title + Action Buttons Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                    Control General de Inventario & Precios
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-medium)' }}>
                    Administre calibres, stock disponible y precios mayoristas oficiales de la tienda.
                  </p>
                </div>

                {/* Right Action Buttons */}
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setIsStockReportOpen(true)}
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.65rem 1.15rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'var(--transition-fast)',
                      fontFamily: 'inherit'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#1e293b'}
                    onMouseOut={e => e.currentTarget.style.background = '#0f172a'}
                  >
                    <FileText size={15} /> Reporte PDF (A4)
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleExportStockCSV(true)}
                    style={{
                      background: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.65rem 1.15rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'var(--transition-fast)',
                      fontFamily: 'inherit'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#047857'}
                    onMouseOut={e => e.currentTarget.style.background = '#059669'}
                  >
                    <Download size={15} /> Descargar Excel (.CSV)
                  </button>

                  <button
                    onClick={handleSaveAllProducts}
                    style={{
                      background: savedFeedback['all'] ? 'var(--success)' : 'var(--primary-dark)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.65rem 1.3rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'var(--transition-fast)',
                      fontFamily: 'inherit'
                    }}
                  >
                    {savedFeedback['all'] ? <Check size={15} /> : <Save size={15} />}
                    {savedFeedback['all'] ? '¡Todo Guardado!' : 'Guardar Todos los Cambios'}
                  </button>

                  <button
                    onClick={handleOpenAddPage}
                    className="btn-primary"
                    style={{
                      padding: '0.65rem 1.3rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: 'var(--shadow-sm)',
                      fontFamily: 'inherit'
                    }}
                  >
                    <Plus size={15} /> Añadir Producto
                  </button>
                </div>
              </div>

              {/* Full-width informative banner */}
              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '0.75rem 1.15rem',
                display: 'flex',
                gap: '0.6rem',
                alignItems: 'center'
              }}>
                <Info size={18} color="#1d4ed8" style={{ flexShrink: 0 }} />
                <p style={{ color: '#1e3a8a', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                  <strong>Modificación Rápida de Precios y Stock:</strong> Puede modificar múltiples calibres o productos en simultáneo y guardar uno por uno con su botón correspondiente, o presionar <strong>"Guardar Todos los Cambios"</strong> para aplicar toda la tabla a la vez.
                </p>
              </div>
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
                                const data = editState[key] || { stock: variant.stock, price: variant.price !== undefined ? variant.price : product.price };

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
        {/* TAB: CLEARANCE & EXPIRY DEALS MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'clearance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.4s ease' }}>
            
            {/* Info Banner */}
            <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 }}>
                <Flame size={24} color="#ea580c" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#9a3412' }}>
                    Gestión de Lotes con Descuento por Vencimiento Cercano (Outlet B2B)
                  </h3>
                  <p style={{ color: '#c2410c', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                    Configure ofertas especiales para lotes con fecha de caducidad próxima. Las unidades que asigne aquí tendrán su propio stock y precio con descuento en la sección <strong>"🔥 Oportunidades"</strong> de la tienda, sin alterar el inventario ni el precio regular del producto en el catálogo general.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsStockReportOpen(true)}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.7rem 1.1rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: 'var(--shadow-sm)',
                    fontFamily: 'inherit',
                    flexShrink: 0
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#1e293b'}
                  onMouseOut={e => e.currentTarget.style.background = '#0f172a'}
                >
                  <FileText size={15} /> Reporte PDF (A4)
                </button>
                <button
                  type="button"
                  onClick={() => handleExportStockCSV(true)}
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.7rem 1.1rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: 'var(--shadow-sm)',
                    fontFamily: 'inherit',
                    flexShrink: 0
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#047857'}
                  onMouseOut={e => e.currentTarget.style.background = '#059669'}
                >
                  <Download size={15} /> Descargar Excel (.CSV)
                </button>
              </div>
            </div>

            {/* Form to create a new clearance offer */}
            <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <Plus size={18} color="#ea580c" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                  Crear Nuevo Lote en Oferta / Oportunidad Médica
                </h3>
              </div>

              <form onSubmit={handleCreateClearanceOffer} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  
                  {/* Select Product */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                      1. Seleccionar Producto
                    </label>
                    <select
                      value={clrProductId}
                      onChange={e => {
                        setClrProductId(e.target.value);
                        setClrVariantId('');
                      }}
                      required
                      style={{ width: '100%', height: '38px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', fontSize: '0.85rem' }}
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.brand})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Caliber/Variant (if product has variants) */}
                  {(() => {
                    const activeInv = inventory.find(i => i.productId === clrProductId);
                    if (!activeInv || !activeInv.hasVariants || activeInv.variants.length === 0) return null;
                    return (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                          2. Medida / Calibre
                        </label>
                        <select
                          value={clrVariantId}
                          onChange={e => setClrVariantId(e.target.value)}
                          required
                          style={{ width: '100%', height: '38px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-green)' }}
                        >
                          <option value="">Seleccione medida...</option>
                          {activeInv.variants.map(v => (
                            <option key={v.id} value={v.id}>
                              {v.name} (Stock reg: {v.stock} | Precio reg: USD ${v.price ?? products.find(p => p.id === clrProductId)?.price})
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })()}

                  {/* Regular Price Indicator */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                      Precio Regular de Referencia
                    </label>
                    <div style={{ height: '38px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', padding: '0 0.75rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-medium)' }}>
                      USD ${(() => {
                        const p = products.find(prod => prod.id === clrProductId);
                        if (!p) return '0.00';
                        const inv = inventory.find(i => i.productId === clrProductId);
                        if (inv && inv.hasVariants && clrVariantId) {
                          const v = inv.variants.find(item => item.id === clrVariantId);
                          if (v && v.price !== undefined) return v.price.toFixed(2);
                        }
                        return p.price.toFixed(2);
                      })()}
                    </div>
                  </div>

                  {/* Special Clearance Price */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#c2410c', marginBottom: '0.4rem' }}>
                      3. Precio Especial con Descuento (USD) *
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Ej: 15.00"
                      value={clrClearancePrice}
                      onChange={e => setClrClearancePrice(e.target.value)}
                      required
                      style={{ width: '100%', height: '38px', padding: '0 0.6rem', borderRadius: '6px', border: '2px solid #fdba74', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 800, color: '#c2410c' }}
                    />
                  </div>

                  {/* Stock allocated for this batch */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                      4. Stock en este Lote (Unidades) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ej: 3"
                      value={clrStock}
                      onChange={e => setClrStock(e.target.value)}
                      required
                      style={{ width: '100%', height: '38px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', fontSize: '0.88rem' }}
                    />
                  </div>

                  {/* Expiration Date */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                      5. Fecha de Caducidad / Vto *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Octubre 2026 o 10/2026"
                      value={clrExpiryDate}
                      onChange={e => setClrExpiryDate(e.target.value)}
                      required
                      style={{ width: '100%', height: '38px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', fontSize: '0.88rem' }}
                    />
                  </div>

                  {/* Batch Number */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                      6. Número de Lote (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: LOTE-GEN-2610"
                      value={clrBatchNumber}
                      onChange={e => setClrBatchNumber(e.target.value)}
                      style={{ width: '100%', height: '38px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', fontSize: '0.88rem' }}
                    />
                  </div>

                  {/* Clinical note */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.4rem' }}>
                      7. Nota o Detalle del Lote
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Empaque y esterilidad sellada 100% de fábrica."
                      value={clrNote}
                      onChange={e => setClrNote(e.target.value)}
                      style={{ width: '100%', height: '38px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', fontSize: '0.88rem' }}
                    />
                  </div>

                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  {clrFormFeedback ? (
                    <span style={{ color: 'var(--success)', fontSize: '0.82rem', fontWeight: 700 }}>
                      ✅ ¡Lote de liquidación publicado con éxito en la tienda!
                    </span>
                  ) : <span />}

                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.75rem 2rem',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
                      fontFamily: 'inherit'
                    }}
                  >
                    <Plus size={16} /> Publicar Lote en Oferta
                  </button>
                </div>
              </form>
            </div>

            {/* Table of active and inactive clearance lots */}
            <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                  Lotes en Liquidación Existentes ({clearanceOffers.length})
                </h3>
              </div>

              {clearanceOffers.length === 0 ? (
                <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-medium)', fontSize: '0.88rem' }}>
                  No hay lotes creados todavía. Utilice el formulario superior para añadir su primer lote con descuento.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="admin-table">
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                      <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-medium)' }}>Estado</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-medium)' }}>Producto / Medida</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-medium)', textAlign: 'center' }}>Precio Regular</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-medium)', textAlign: 'center' }}>Precio Oferta (USD)</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-medium)', textAlign: 'center' }}>Stock Lote</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-medium)' }}>Vencimiento</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-medium)' }}>Lote / Nota</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-medium)', width: '150px' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clearanceOffers.map(offer => {
                      const edit = clrEditState[offer.id] || {
                        stock: offer.stock,
                        price: offer.clearancePrice,
                        expiryDate: offer.expiryDate,
                        batchNumber: offer.batchNumber || ''
                      };
                      const isSaved = savedFeedback[offer.id] || false;

                      return (
                        <tr key={offer.id} style={{ borderBottom: '1px solid var(--border-light)', background: offer.active ? '#ffffff' : '#f8fafc', opacity: offer.active ? 1 : 0.65 }}>
                          {/* Status toggle */}
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <button
                              type="button"
                              onClick={() => toggleClearanceOffer(offer.id)}
                              style={{
                                background: offer.active ? '#dcfce7' : '#f1f5f9',
                                color: offer.active ? '#15803d' : '#64748b',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '0.25rem 0.6rem',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontFamily: 'inherit'
                              }}
                            >
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: offer.active ? '#22c55e' : '#94a3b8' }} />
                              {offer.active ? 'Activo' : 'Pausado'}
                            </button>
                          </td>

                          {/* Product info */}
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                              {offer.productName}
                            </div>
                            {offer.variantName ? (
                              <span style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '0.75rem' }}>
                                Medida: {offer.variantName}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-light)', fontSize: '0.72rem' }}>
                                Kit Estándar
                              </span>
                            )}
                          </td>

                          {/* Regular Price */}
                          <td style={{ padding: '0.85rem 1.25rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                            USD ${offer.regularPrice.toFixed(2)}
                          </td>

                          {/* Clearance Price Input */}
                          <td style={{ padding: '0.4rem 1rem', textAlign: 'center' }}>
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={edit.price}
                              onChange={e => handleClrValChange(offer.id, 'price', e.target.value)}
                              style={{
                                width: '80px',
                                height: '30px',
                                textAlign: 'center',
                                borderRadius: '4px',
                                border: '1.5px solid #fdba74',
                                fontWeight: 800,
                                color: '#c2410c',
                                outline: 'none',
                                fontFamily: 'inherit'
                              }}
                            />
                          </td>

                          {/* Stock Input */}
                          <td style={{ padding: '0.4rem 1rem', textAlign: 'center' }}>
                            <input
                              type="number"
                              min="0"
                              value={edit.stock}
                              onChange={e => handleClrValChange(offer.id, 'stock', e.target.value)}
                              style={{
                                width: '65px',
                                height: '30px',
                                textAlign: 'center',
                                borderRadius: '4px',
                                border: '1px solid #cbd5e1',
                                outline: 'none',
                                fontWeight: 700,
                                fontFamily: 'inherit'
                              }}
                            />
                          </td>

                          {/* Expiry Date Input */}
                          <td style={{ padding: '0.4rem 1rem' }}>
                            <input
                              type="text"
                              value={edit.expiryDate}
                              onChange={e => handleClrValChange(offer.id, 'expiryDate', e.target.value)}
                              style={{
                                width: '110px',
                                height: '30px',
                                padding: '0 0.4rem',
                                borderRadius: '4px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                outline: 'none',
                                fontFamily: 'inherit'
                              }}
                            />
                          </td>

                          {/* Batch / Note Editable Inputs */}
                          <td style={{ padding: '0.4rem 0.75rem', minWidth: '180px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              <input
                                type="text"
                                placeholder="Nº Lote (ej: 46277)"
                                value={edit.batchNumber}
                                onChange={e => handleClrValChange(offer.id, 'batchNumber', e.target.value)}
                                title="Número de lote"
                                style={{
                                  width: '100%',
                                  height: '28px',
                                  padding: '0 0.45rem',
                                  borderRadius: '4px',
                                  border: '1px solid #cbd5e1',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  color: '#1e293b',
                                  outline: 'none',
                                  fontFamily: 'inherit'
                                }}
                              />
                              <input
                                type="text"
                                placeholder="Nota del lote (ej: Promoción 2x1...)"
                                value={edit.note}
                                onChange={e => handleClrValChange(offer.id, 'note', e.target.value)}
                                title="Nota o descripción del lote"
                                style={{
                                  width: '100%',
                                  height: '28px',
                                  padding: '0 0.45rem',
                                  borderRadius: '4px',
                                  border: '1px solid #e2e8f0',
                                  fontSize: '0.74rem',
                                  color: '#475569',
                                  outline: 'none',
                                  fontFamily: 'inherit'
                                }}
                              />
                            </div>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '0.4rem 1.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleSaveClearanceRow(offer.id)}
                                style={{
                                  background: isSaved ? 'var(--success)' : 'var(--primary-dark)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  height: '28px',
                                  padding: '0 0.6rem',
                                  color: '#FFFFFF',
                                  cursor: 'pointer',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.2rem',
                                  fontFamily: 'inherit'
                                }}
                              >
                                {isSaved ? <Check size={12} /> : <Save size={12} />}
                                {isSaved ? 'OK' : 'Guardar'}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('¿Desea eliminar esta oferta de lote?')) {
                                    deleteClearanceOffer(offer.id);
                                  }
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--danger)',
                                  cursor: 'pointer',
                                  padding: '0.3rem'
                                }}
                                title="Eliminar oferta"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: MANUAL ORDER BUILDER (HOLDED ERP STYLE WITH CUSTOM PRICES) */}
        {/* ============================================================== */}
        {activeTab === 'manual-order' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
            
            {/* 1. Header Banner */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Receipt size={24} />
                </div>
                <div>
                  <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                    Creador de Pedidos & Ventas B2B (Precios Personalizados)
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-medium)', lineHeight: 1.4 }}>
                    Agregue productos, modifique libremente el precio unitario en la tabla para ventas con descuento especial o acuerdos comerciales, y procese la venta directo al inventario.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                {moItems.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearManualOrder}
                    style={{
                      background: '#fee2e2',
                      color: '#b91c1c',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.55rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontFamily: 'inherit'
                    }}
                  >
                    <Trash2 size={14} /> Limpiar Todo
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  style={{
                    background: '#f1f5f9',
                    color: 'var(--text-dark)',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.55rem 1.1rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontFamily: 'inherit'
                  }}
                >
                  <ClipboardList size={14} /> Ver Pedidos ({orders.length})
                </button>
              </div>
            </div>

            {/* Error Message */}
            {moError && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                padding: '0.85rem 1.25rem',
                color: '#991b1b',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={18} color="#dc2626" />
                {moError}
              </div>
            )}

            {/* Success Confirmation Card */}
            {moCreatedOrder && (
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '2px solid #86efac',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(22, 163, 74, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                animation: 'fadeIn 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#166534' }}>
                        ¡Pedido #{moCreatedOrder.id} Procesado y Registrado!
                      </h3>
                      <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.85rem', color: '#15803d' }}>
                        Cliente: <strong>{moCreatedOrder.fullName}</strong> • Total Venta: <strong>USD ${moCreatedOrder.total.toFixed(2)}</strong> • Estado: <strong>{moCreatedOrder.status}</strong>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const printWindow = window.open('', '_blank');
                        if (!printWindow) return;
                        const itemsRows = moCreatedOrder.items.map(item => `
                          <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${item.productName} ${item.variantName ? `<span style="color: #64748b; font-size: 12px;">(${item.variantName})</span>` : ''}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">USD $${item.price.toFixed(2)}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">USD $${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        `).join('');

                        printWindow.document.write(`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <title>Nota de Venta / Proforma - ${moCreatedOrder.id}</title>
                              <style>
                                body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1e293b; }
                                .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 25px; }
                                .logo { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
                                .badge { background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                                .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
                                .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; font-size: 13px; line-height: 1.6; }
                                table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px; }
                                th { background: #0f172a; color: #ffffff; padding: 10px; text-align: left; font-size: 13px; }
                                .total-box { text-align: right; font-size: 18px; font-weight: bold; padding: 15px; background: #f1f5f9; border-radius: 8px; color: #0f172a; }
                                @media print { body { margin: 0; } }
                              </style>
                            </head>
                            <body>
                              <div class="header">
                                <div>
                                  <div class="logo">LATMEDICAL</div>
                                  <div style="font-size: 12px; color: #64748b;">Dispositivos Médicos & Estética Avanzada</div>
                                </div>
                                <div style="text-align: right;">
                                  <span class="badge">ORDEN DE VENTA #${moCreatedOrder.id}</span>
                                  <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Fecha: ${moCreatedOrder.date}</div>
                                </div>
                              </div>
                              <div class="meta">
                                <div class="box">
                                  <strong style="color: #0f172a; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Cliente / Profesional:</strong><br/>
                                  <strong style="font-size: 15px;">${moCreatedOrder.fullName}</strong><br/>
                                  ${moCreatedOrder.specialty} ${moCreatedOrder.licenseNumber ? `• Mat: ${moCreatedOrder.licenseNumber}` : ''}<br/>
                                  Tel / WhatsApp: ${moCreatedOrder.phone}<br/>
                                  ${moCreatedOrder.email ? `Email: ${moCreatedOrder.email}` : ''}
                                </div>
                                <div class="box">
                                  <strong style="color: #0f172a; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Condiciones Comerciales:</strong><br/>
                                  Método de Pago: <strong>${moCreatedOrder.paymentMethod}</strong><br/>
                                  Estado: <strong>${moCreatedOrder.status}</strong><br/>
                                  Entrega: ${moCreatedOrder.address}, ${moCreatedOrder.city} (${moCreatedOrder.province})
                                </div>
                              </div>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Producto / Insumo</th>
                                    <th style="text-align: center;">Cantidad</th>
                                    <th style="text-align: right;">Precio Unitario</th>
                                    <th style="text-align: right;">Total Línea</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  ${itemsRows}
                                </tbody>
                              </table>
                              <div class="total-box">
                                TOTAL A PAGAR: USD $${moCreatedOrder.total.toFixed(2)}
                              </div>
                              <div style="margin-top: 30px; border-top: 1px dashed #cbd5e1; padding-top: 15px; font-size: 11px; color: #64748b; text-align: center;">
                                Documento no válido como factura fiscal. Comprobante de venta y despacho interno Latmedical.
                              </div>
                              <script>
                                window.onload = function() { window.print(); }
                              </script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      }}
                      style={{
                        background: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.65rem 1.1rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontFamily: 'inherit'
                      }}
                    >
                      <Printer size={15} /> Imprimir / PDF Proforma
                    </button>

                    {moCreatedOrder.phone && (
                      <a
                        href={`https://wa.me/${moCreatedOrder.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `*LATMEDICAL - DETALLE DE SU PEDIDO #${moCreatedOrder.id}*\n` +
                          `Doctor/a: ${moCreatedOrder.fullName}\n` +
                          `Fecha: ${moCreatedOrder.date}\n` +
                          `----------------------------------------\n` +
                          moCreatedOrder.items.map(i => `• ${i.quantity}x ${i.productName} ${i.variantName ? `(${i.variantName})` : ''} - USD $${(i.price * i.quantity).toFixed(2)}`).join('\n') +
                          `\n----------------------------------------\n` +
                          `*TOTAL: USD $${moCreatedOrder.total.toFixed(2)}*\n` +
                          `Forma de Pago: ${moCreatedOrder.paymentMethod}\n` +
                          `Estado: ${moCreatedOrder.status}\n\n` +
                          `¡Muchas gracias por su compra!`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: '#16a34a',
                          color: '#ffffff',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          padding: '0.65rem 1.1rem',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontFamily: 'inherit'
                        }}
                      >
                        <Send size={15} /> Enviar por WhatsApp
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={handleClearManualOrder}
                      style={{
                        background: '#ffffff',
                        color: '#166534',
                        border: '1px solid #86efac',
                        borderRadius: '6px',
                        padding: '0.65rem 1.1rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                    >
                      + Crear Otra Venta
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Main Holded ERP Order Builder Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '1.5rem',
              alignItems: 'start'
            }}>
              
              {/* LEFT COLUMN: Product Selector + Holded-style Editable Line Items Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Product Search & Quick Add Box */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Search size={16} color="#2563eb" /> 1. Buscar y Agregar Insumos al Pedido
                    </h3>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {(['all', 'Vlift Pro', 'Seffiline'] as const).map(b => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setMoSelectedBrand(b)}
                          style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '15px',
                            border: '1px solid',
                            borderColor: moSelectedBrand === b ? '#2563eb' : '#cbd5e1',
                            background: moSelectedBrand === b ? '#eff6ff' : '#ffffff',
                            color: moSelectedBrand === b ? '#1d4ed8' : 'var(--text-medium)',
                            fontSize: '0.75rem',
                            fontWeight: moSelectedBrand === b ? 700 : 500,
                            cursor: 'pointer',
                            fontFamily: 'inherit'
                          }}
                        >
                          {b === 'all' ? 'Todos' : b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search input */}
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o calibre (ej: 19G, 30G, Mono, Cones, Genesis, Seffihair)..."
                      value={moSearchQuery}
                      onChange={e => setMoSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 0.75rem 0 2.4rem',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.85rem',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  {/* Quick Products Pick Grid */}
                  <div style={{
                    maxHeight: '260px',
                    overflowY: 'auto',
                    border: '1px solid #f1f5f9',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}>
                    {products
                      .filter(p => {
                        const matchBrand = moSelectedBrand === 'all' || p.brand === moSelectedBrand;
                        const matchSearch = p.name.toLowerCase().includes(moSearchQuery.toLowerCase()) ||
                                            p.category.toLowerCase().includes(moSearchQuery.toLowerCase()) ||
                                            p.brand.toLowerCase().includes(moSearchQuery.toLowerCase());
                        return matchBrand && matchSearch;
                      })
                      .map(p => {
                        const inv = inventory.find(i => i.productId === p.id);
                        const hasVariants = inv && inv.hasVariants && inv.variants && inv.variants.length > 0;

                        return (
                          <div
                            key={p.id}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              padding: '0.65rem 0.85rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '0.5rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img
                                src={p.image}
                                alt={p.name}
                                style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '4px', background: '#fff', border: '1px solid #f1f5f9' }}
                              />
                              <div>
                                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                                  {p.name}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                  <span className="badge badge-dark" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>{p.brand}</span>
                                  <span>Precio Base: USD ${p.price.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions / Variants */}
                            <div>
                              {hasVariants ? (
                                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                  {inv.variants.map(v => (
                                    <button
                                      key={v.id}
                                      type="button"
                                      onClick={() => handleAddProductToManualOrder(p, v)}
                                      style={{
                                        background: '#eff6ff',
                                        border: '1px solid #bfdbfe',
                                        borderRadius: '4px',
                                        padding: '0.25rem 0.55rem',
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        color: '#1d4ed8',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        fontFamily: 'inherit'
                                      }}
                                      title={`Agregar calibre ${v.name} (Stock: ${v.stock})`}
                                    >
                                      + {v.name}
                                      <span style={{ fontSize: '0.65rem', color: v.stock > 0 ? '#16a34a' : '#dc2626' }}>
                                        ({v.stock})
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAddProductToManualOrder(p, undefined, inv?.stock || 0)}
                                  style={{
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.35rem 0.85rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    fontFamily: 'inherit'
                                  }}
                                >
                                  <Plus size={13} /> Agregar
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Holded-Style Editable Order Lines Table */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid var(--border-light)',
                    background: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      2. Líneas de Venta (Precios Especiales Editables)
                    </h3>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                      {moItems.length} {moItems.length === 1 ? 'Producto' : 'Productos'} en Orden
                    </span>
                  </div>

                  {moItems.length === 0 ? (
                    <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--text-medium)' }}>
                      <ShoppingCart size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                      <p style={{ margin: '0 0 0.3rem 0', fontWeight: 700, fontSize: '0.95rem' }}>No hay productos cargados en esta venta</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        Utilice el buscador superior para añadir calibres de hilos o kits Seffiline a la orden.
                      </p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)', color: 'var(--text-medium)', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '0.75rem 1rem' }}>Producto / Medida</th>
                            <th style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>Stock</th>
                            <th style={{ padding: '0.75rem 0.75rem', textAlign: 'center', width: '90px' }}>Cantidad</th>
                            <th style={{ padding: '0.75rem 0.75rem', textAlign: 'right' }}>Precio Lista</th>
                            <th style={{ padding: '0.75rem 0.75rem', textAlign: 'center', width: '130px' }}>
                              <span style={{ color: '#ea580c', fontWeight: 800 }}>Precio Especial (USD)</span>
                            </th>
                            <th style={{ padding: '0.75rem 0.75rem', textAlign: 'right' }}>Subtotal</th>
                            <th style={{ padding: '0.75rem 0.75rem', textAlign: 'center', width: '50px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {moItems.map((item, idx) => {
                            const lineTotal = item.price * item.quantity;
                            const isDiscounted = item.price < item.regularPrice;

                            return (
                              <tr key={item.lineId} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                                {/* Product info */}
                                <td style={{ padding: '0.75rem 1rem' }}>
                                  <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>
                                    {item.productName}
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.15rem' }}>
                                    <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: '#f1f5f9', color: 'var(--text-medium)', fontWeight: 600 }}>
                                      {item.brand}
                                    </span>
                                    {item.variantName && (
                                      <span style={{ fontSize: '0.72rem', color: '#0369a1', fontWeight: 700, background: '#e0f2fe', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                                        {item.variantName}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Stock available */}
                                <td style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>
                                  <span style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    color: item.stock > 0 ? '#16a34a' : '#dc2626',
                                    background: item.stock > 0 ? '#dcfce7' : '#fee2e2',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '12px',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {item.stock > 0 ? `${item.stock} disp.` : 'Agotado'}
                                  </span>
                                </td>

                                {/* Quantity Input */}
                                <td style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={e => handleUpdateManualOrderLine(item.lineId, 'quantity', parseInt(e.target.value, 10))}
                                    style={{
                                      width: '65px',
                                      height: '32px',
                                      textAlign: 'center',
                                      borderRadius: '6px',
                                      border: '1.5px solid #cbd5e1',
                                      fontWeight: 800,
                                      outline: 'none',
                                      fontFamily: 'inherit'
                                    }}
                                  />
                                </td>

                                {/* Regular price */}
                                <td style={{ padding: '0.75rem 0.75rem', textAlign: 'right', color: 'var(--text-light)', textDecoration: isDiscounted ? 'line-through' : 'none' }}>
                                  USD ${item.regularPrice.toFixed(2)}
                                </td>

                                {/* EDITABLE PRICE (HOLDED STYLE) */}
                                <td style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>
                                  <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', fontWeight: 800, color: '#ea580c' }}>$</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={item.price}
                                      onChange={e => handleUpdateManualOrderLine(item.lineId, 'price', parseFloat(e.target.value))}
                                      title="Modificar precio unitario para este cliente"
                                      style={{
                                        width: '95px',
                                        height: '32px',
                                        padding: '0 0.4rem 0 1.2rem',
                                        textAlign: 'right',
                                        borderRadius: '6px',
                                        border: '2px solid #fdba74',
                                        background: '#fff7ed',
                                        fontWeight: 800,
                                        color: '#c2410c',
                                        fontSize: '0.85rem',
                                        outline: 'none',
                                        fontFamily: 'inherit'
                                      }}
                                    />
                                  </div>
                                </td>

                                {/* Line Subtotal */}
                                <td style={{ padding: '0.75rem 0.75rem', textAlign: 'right', fontWeight: 800, color: 'var(--primary-dark)', fontSize: '0.88rem' }}>
                                  USD ${lineTotal.toFixed(2)}
                                </td>

                                {/* Delete button */}
                                <td style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveManualOrderLine(item.lineId)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#dc2626',
                                      cursor: 'pointer',
                                      padding: '0.25rem',
                                      borderRadius: '4px'
                                    }}
                                    title="Quitar línea"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: Customer Information + Order Summary */}
              <form onSubmit={handleProcessManualOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Customer Details Box */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={16} color="#2563eb" /> 3. Datos del Médico / Clínica
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                        Nombre del Médico o Razón Social *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Dr. Martín Benítez / Clínica Estética"
                        value={moCustomerName}
                        onChange={e => setMoCustomerName(e.target.value)}
                        required
                        style={{ width: '100%', height: '36px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none', fontFamily: 'inherit' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                          Teléfono / WhatsApp *
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: 11 4455-6677"
                          value={moCustomerPhone}
                          onChange={e => setMoCustomerPhone(e.target.value)}
                          required
                          style={{ width: '100%', height: '36px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none', fontFamily: 'inherit' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                          Email (Opcional)
                        </label>
                        <input
                          type="email"
                          placeholder="doctor@clinica.com"
                          value={moCustomerEmail}
                          onChange={e => setMoCustomerEmail(e.target.value)}
                          style={{ width: '100%', height: '36px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none', fontFamily: 'inherit' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                          Especialidad
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Cirugía Plástica / Dermato"
                          value={moCustomerSpecialty}
                          onChange={e => setMoCustomerSpecialty(e.target.value)}
                          style={{ width: '100%', height: '36px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none', fontFamily: 'inherit' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                          Matrícula Médica
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: MN 145.890"
                          value={moCustomerLicense}
                          onChange={e => setMoCustomerLicense(e.target.value)}
                          style={{ width: '100%', height: '36px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none', fontFamily: 'inherit' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                        Dirección de Envío / Entrega
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Av. Santa Fe 3200, Piso 4 B"
                        value={moCustomerAddress}
                        onChange={e => setMoCustomerAddress(e.target.value)}
                        style={{ width: '100%', height: '36px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none', fontFamily: 'inherit' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                          Método de Pago
                        </label>
                        <select
                          value={moPaymentMethod}
                          onChange={e => setMoPaymentMethod(e.target.value)}
                          style={{ width: '100%', height: '36px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none', fontFamily: 'inherit', background: '#fff' }}
                        >
                          <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                          <option value="Efectivo Contra-entrega">Efectivo Contra-entrega</option>
                          <option value="Tarjeta de Crédito / Débito">Tarjeta de Crédito / Débito</option>
                          <option value="Cuenta Corriente B2B">Cuenta Corriente B2B</option>
                          <option value="Dólar Billete">Dólar Billete</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                          Estado Inicial
                        </label>
                        <select
                          value={moOrderStatus}
                          onChange={e => setMoOrderStatus(e.target.value as Order['status'])}
                          style={{ width: '100%', height: '36px', padding: '0 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none', fontFamily: 'inherit', background: '#fff' }}
                        >
                          <option value="Aprobado">Aprobado (Venta Firme)</option>
                          <option value="Pendiente">Pendiente de Pago</option>
                          <option value="Despachado">Despachado</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-medium)', marginBottom: '0.3rem' }}>
                        Observaciones / Notas Internas del Pedido
                      </label>
                      <textarea
                        placeholder="Ej: Precio especial acordado por volumen mensual. Despacho urgente."
                        value={moOrderNotes}
                        onChange={e => setMoOrderNotes(e.target.value)}
                        rows={2}
                        style={{ width: '100%', padding: '0.5rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Summary & Process Button */}
                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                    4. Resumen y Cierre de Venta
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-medium)' }}>
                    <span>Cajas / Unidades Totales:</span>
                    <strong>{moTotalUnits} unidades</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-medium)' }}>
                    <span>Subtotal Productos:</span>
                    <span>USD ${moSubtotalUSD.toFixed(2)}</span>
                  </div>

                  {/* Global Discount input */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-medium)' }}>
                    <span>Descuento Global Adicional (USD):</span>
                    <div style={{ position: 'relative', width: '90px' }}>
                      <span style={{ position: 'absolute', left: '6px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: '#16a34a', fontWeight: 800 }}>$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={moGlobalDiscountUSD}
                        onChange={e => setMoGlobalDiscountUSD(e.target.value)}
                        style={{
                          width: '100%',
                          height: '28px',
                          padding: '0 0.3rem 0 1rem',
                          textAlign: 'right',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{
                    borderTop: '2px solid #e2e8f0',
                    paddingTop: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-dark)' }}>
                      TOTAL A FACTURAR:
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '1.35rem', color: '#2563eb' }}>
                      USD ${moTotalUSD.toFixed(2)}
                    </span>
                  </div>

                  {/* Stock decrement toggle */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-medium)',
                    cursor: 'pointer',
                    background: '#f8fafc',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <input
                      type="checkbox"
                      checked={moDecrementStock}
                      onChange={e => setMoDecrementStock(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Descontar stock automáticamente del inventario</span>
                  </label>

                  {/* Process button */}
                  <button
                    type="submit"
                    disabled={moItems.length === 0}
                    style={{
                      background: moItems.length > 0 ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#94a3b8',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.85rem 1.5rem',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: moItems.length > 0 ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: moItems.length > 0 ? '0 4px 14px rgba(37, 99, 235, 0.3)' : 'none',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit',
                      marginTop: '0.5rem'
                    }}
                  >
                    <Receipt size={18} /> Procesar y Guardar Pedido ({moTotalUnits})
                  </button>
                </div>

              </form>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', margin: 0 }}>
                  Registro de mensajes recibidos a través del formulario de contacto y del formulario de inscripción a cursos internacionales.
                </p>
                <button
                  onClick={loadSubmissions}
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <RefreshCw size={14} /> Actualizar Formularios
                </button>
              </div>

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

          </main>
        </div>

        {/* Stock PDF / Excel Report Modal */}
        <StockReportModal
          isOpen={isStockReportOpen}
          onClose={() => setIsStockReportOpen(false)}
          products={products}
          inventory={inventory}
          clearanceOffers={clearanceOffers}
          editState={editState}
          onExportCSV={() => handleExportStockCSV(true)}
        />

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .admin-layout {
            flex-direction: column !important;
          }
          .admin-sidebar {
            width: 100% !important;
            position: static !important;
            max-height: none !important;
          }
        }
        
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
