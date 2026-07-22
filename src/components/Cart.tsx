import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, Landmark, CheckCircle2, ArrowLeft, ExternalLink, Printer } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getAssetUrl } from '../utils/assets';
import { useInventory, OrderItem } from '../context/InventoryContext';
import defaultSettings from '../data/general_settings.json';

interface CartProps {
  isOpen: boolean;
  toggleCart: () => void;
}

type CheckoutStep = 'cart' | 'checkout' | 'success';

export const Cart: React.FC<CartProps> = ({ isOpen, toggleCart }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, getItemFreeQty } = useCart();
  const { addOrder } = useInventory();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [orderNumber, setOrderNumber] = useState<string>('');
  
  // Checkout form state
  const [formData, setFormData] = useState({
    fullName: '',
    specialty: '',
    licenseNumber: '',
    province: 'CABA',
    city: '',
    address: '',
    phone: '',
    email: '',
    paymentMethod: 'transfer', // 'transfer' | 'card' | 'mercadopago'
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Step 1: Doctor Credentials & Contact
    if (!formData.fullName.trim()) newErrors.fullName = 'Nombre obligatorio';
    if (!formData.specialty.trim()) newErrors.specialty = 'Especialidad obligatoria';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'Matrícula obligatoria';
    if (!formData.phone.trim()) newErrors.phone = 'Teléfono obligatorio';
    
    // Step 2: Shipping
    if (!formData.address.trim()) newErrors.address = 'Dirección de envío obligatoria';
    if (!formData.city.trim()) newErrors.city = 'Ciudad/Localidad obligatoria';

    // Step 3: Card Details if card selected
    if (formData.paymentMethod === 'card') {
      if (!formData.cardName.trim()) newErrors.cardName = 'Nombre en tarjeta obligatorio';
      if (!formData.cardNumber.trim().replace(/\s/g, '')) {
        newErrors.cardNumber = 'Número de tarjeta obligatorio';
      } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Debe tener 16 dígitos';
      }
      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Vencimiento obligatorio';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Formato inválido (MM/AA)';
      }
      if (!formData.cardCvc.trim()) {
        newErrors.cardCvc = 'Código CVC obligatorio';
      } else if (formData.cardCvc.length < 3 || formData.cardCvc.length > 4) {
        newErrors.cardCvc = '3 o 4 dígitos';
      }
    }

    return newErrors;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Map cart items to database OrderItem format
    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      brand: item.product.brand,
      variantName: item.selectedVariant,
      quantity: item.quantity,
      price: item.product.price
    }));

    // Register order and decrement stock automatically
    const newOrder = addOrder({
      fullName: formData.fullName,
      specialty: formData.specialty,
      licenseNumber: formData.licenseNumber,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      province: formData.province,
      paymentMethod: formData.paymentMethod,
      items: orderItems,
      total: cartTotal
    });

    setOrderNumber(newOrder.id);
    setStep('success');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleSendWhatsAppConfirmation = () => {
    const itemsText = cartItems
      .map(item => {
        if (!item || !item.product) return '';
        const price = typeof item.product.price === 'number' ? item.product.price : 0;
        const freeQty = getItemFreeQty(item);
        const paidQty = item.quantity - freeQty;
        if (freeQty > 0) {
          return `• ${item.quantity}x ${item.product.name} ${item.selectedVariant ? `[${item.selectedVariant}]` : ''} (🎁 ¡Incluye ${freeQty} gratis!) - USD $${(price * paidQty).toFixed(2)}`;
        }
        return `• ${item.quantity}x ${item.product.name} ${item.selectedVariant ? `[${item.selectedVariant}]` : ''} - USD $${(price * item.quantity).toFixed(2)}`;
      })
      .filter(Boolean)
      .join('\n');

    const paymentText = formData.paymentMethod === 'transfer' 
      ? 'Transferencia Bancaria (Pendiente de acreditación)' 
      : formData.paymentMethod === 'mercadopago'
      ? 'Mercado Pago (Online)'
      : 'Tarjeta de Crédito / Débito (Aprobado)';

    const text = `*COMPRA CONFIRMADA - LATMEDICAL ARGENTINA*\n\n` +
                 `Hola Latmedical, acabo de realizar una compra online en su portal:\n\n` +
                 `*Orden:* ${orderNumber}\n` +
                 `*Total:* USD $${cartTotal.toFixed(2)}\n` +
                 `*Método de Pago:* ${paymentText}\n\n` +
                 `*Detalle de Productos:*\n${itemsText}\n\n` +
                 `*Datos de Despacho:*\n` +
                 `• Profesional: ${formData.fullName}\n` +
                 `• Matrícula: ${formData.licenseNumber}\n` +
                 `• Especialidad: ${formData.specialty}\n` +
                 `• Teléfono: ${formData.phone}\n` +
                 `• Dirección: ${formData.address}, ${formData.city}, ${formData.province}\n\n` +
                 `Adjunto los datos profesionales para la facturación y validación del despacho. ¡Muchas gracias!`;

    const savedSettings = localStorage.getItem('latmedical_web_settings');
    const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    const whatsappNumber = settings.whatsappNumber || defaultSettings.whatsappNumber;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSuccessClose = () => {
    clearCart();
    setStep('cart');
    toggleCart();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      backgroundColor: 'rgba(17, 24, 39, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease'
    }}>
      {/* Click outside backdrop */}
      <div 
        onClick={step === 'success' ? undefined : toggleCart} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: step === 'success' ? 'default' : 'pointer'
        }} 
      />

      {/* Cart Container Drawer */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        height: '100%',
        backgroundColor: 'var(--bg-white)',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 1001
      }}>
        
        {/* Drawer Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {step === 'checkout' ? (
            <button 
              onClick={() => setStep('cart')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.85rem',
                color: 'var(--accent-green)',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} /> Volver al Carrito
            </button>
          ) : (
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              {step === 'success' ? 'Compra Exitosa' : 'Tu Compra (B2B)'}
            </h2>
          )}
          
          {step !== 'success' && (
            <button 
              onClick={toggleCart}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-medium)',
                padding: '0.25rem'
              }}
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* STEP 1: CART ITEMS VIEW */}
          {step === 'cart' && (
            cartItems.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                color: 'var(--text-medium)',
                margin: 'auto 0'
              }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Tu carrito está vacío</p>
                <p style={{ fontSize: '0.85rem' }}>Explora el catálogo y agrega productos para realizar tu compra.</p>
                <button 
                  onClick={toggleCart}
                  className="btn-primary" 
                  style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}
                >
                  Ver Catálogo
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
                {/* List items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
                  {cartItems.map((item) => {
                    if (!item || !item.product) return null;
                    return (
                      <div 
                        key={`${item.product.id}-${item.selectedVariant || 'none'}`}
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'center',
                          background: '#F9FAFB',
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-light)'
                        }}
                      >
                        <img 
                          src={getAssetUrl(item.product.image)} 
                          alt={item.product.name} 
                          style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', background: '#ffffff' }}
                        />
                      <div style={{ flexGrow: 1 }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                          {item.product.name}
                        </h4>
                        {item.selectedVariant && (
                          <span className="badge badge-accent-green" style={{ textTransform: 'none', padding: '0.1rem 0.4rem', fontSize: '0.65rem', marginBottom: '0.2rem', display: 'inline-block' }}>
                            Medida: {item.selectedVariant}
                          </span>
                        )}
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-medium)', margin: '0 0 0.25rem 0' }}>{item.product.brand}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                            USD ${Number(item.product.price || 0).toFixed(2)}
                          </span>
                          {getItemFreeQty(item) > 0 && (
                            <span style={{ color: '#10B981', fontSize: '0.7rem', fontWeight: 700 }}>
                              🎁 ¡{getItemFreeQty(item)} unidad{getItemFreeQty(item) > 1 ? 'es' : ''} de regalo!
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <button 
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-light)',
                          borderRadius: '4px',
                          height: '26px',
                          background: 'var(--bg-white)'
                        }}>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                            style={{ background: 'none', border: 'none', width: '22px', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                          >
                            <Minus size={10} />
                          </button>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, width: '20px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                            style={{ background: 'none', border: 'none', width: '22px', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );})}
                </div>

                {/* Subtotals & Proceed */}
                <div style={{
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '1.5rem',
                  marginTop: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-medium)' }}>Subtotal</span>
                    <span style={{ fontWeight: 600 }}>USD ${cartTotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-medium)' }}>Envío (Todo el país)</span>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Bonificado</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderTop: '1px dashed var(--border-light)',
                    paddingTop: '0.75rem',
                    color: 'var(--primary-dark)'
                  }}>
                    <span>Total Compra</span>
                    <span className="text-gradient-accent">USD ${cartTotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => setStep('checkout')}
                    className="btn-primary"
                    style={{
                      justifyContent: 'center',
                      width: '100%',
                      padding: '0.9rem',
                      marginTop: '0.5rem',
                      fontSize: '0.95rem'
                    }}
                  >
                    Proceder al Pago
                  </button>
                </div>
              </div>
            )
          )}

          {/* STEP 2: CHECKOUT VIEW */}
          {step === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-green)', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                1. Datos Profesionales
              </h3>
              
              {/* Full Name */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Nombre y Apellido Médico</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Dr. Esteban Colombo"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderColor: errors.fullName ? 'var(--danger)' : 'var(--border-light)' }}
                />
                {errors.fullName && <p style={{ color: 'var(--danger)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{errors.fullName}</p>}
              </div>

              {/* Specialty & License */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Especialidad</label>
                  <input
                    type="text"
                    name="specialty"
                    placeholder="Dermatología"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderColor: errors.specialty ? 'var(--danger)' : 'var(--border-light)' }}
                  />
                  {errors.specialty && <p style={{ color: 'var(--danger)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{errors.specialty}</p>}
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Matrícula</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    placeholder="MN 12345"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderColor: errors.licenseNumber ? 'var(--danger)' : 'var(--border-light)' }}
                  />
                  {errors.licenseNumber && <p style={{ color: 'var(--danger)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{errors.licenseNumber}</p>}
                </div>
              </div>

              {/* Contact phone and email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>WhatsApp Comercial</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+54 9 11 ..."
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderColor: errors.phone ? 'var(--danger)' : 'var(--border-light)' }}
                  />
                  {errors.phone && <p style={{ color: 'var(--danger)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{errors.phone}</p>}
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="correo@medico.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: '36px', padding: '0 0.5rem' }}
                  />
                </div>
              </div>

              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-green)', letterSpacing: '0.05em', marginTop: '0.5rem', marginBottom: '0.2rem' }}>
                2. Destino de Despacho
              </h3>

              {/* Address */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Dirección Completa (Calle y N°)</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Av. Santa Fe 2400, Piso 3"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderColor: errors.address ? 'var(--danger)' : 'var(--border-light)' }}
                />
                {errors.address && <p style={{ color: 'var(--danger)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{errors.address}</p>}
              </div>

              {/* Province & City */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Provincia</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: '36px', padding: '0 0.5rem', background: '#fff' }}
                  >
                    <option value="CABA">CABA</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="Córdoba">Córdoba</option>
                    <option value="Santa Fe">Santa Fe</option>
                    <option value="Mendoza">Mendoza</option>
                    <option value="Tucumán">Tucumán</option>
                    <option value="Salta">Salta</option>
                    <option value="Neuquén">Neuquén</option>
                    <option value="Otra">Otra</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Ciudad/Localidad</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Palermo"
                    value={formData.city}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: '36px', padding: '0 0.75rem', borderColor: errors.city ? 'var(--danger)' : 'var(--border-light)' }}
                  />
                  {errors.city && <p style={{ color: 'var(--danger)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{errors.city}</p>}
                </div>
              </div>

              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-green)', letterSpacing: '0.05em', marginTop: '0.5rem', marginBottom: '0.2rem' }}>
                3. Medio de Pago
              </h3>

              {/* Payment selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Transfer option */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: formData.paymentMethod === 'transfer' ? 'var(--accent-green)' : 'var(--border-light)',
                  background: formData.paymentMethod === 'transfer' ? 'var(--accent-green-light)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={formData.paymentMethod === 'transfer'}
                    onChange={handleInputChange}
                    style={{ cursor: 'pointer' }}
                  />
                  <Landmark size={18} color="var(--accent-green)" />
                  <div>
                    <strong>Transferencia Bancaria</strong>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-medium)' }}>Alias/CBU. Despacho al acreditar fondos.</span>
                  </div>
                </label>

                {/* Card option */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: formData.paymentMethod === 'card' ? 'var(--accent-green)' : 'var(--border-light)',
                  background: formData.paymentMethod === 'card' ? 'var(--accent-green-light)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    style={{ cursor: 'pointer' }}
                  />
                  <CreditCard size={18} color="var(--accent-blue)" />
                  <div>
                    <strong>Tarjeta de Crédito / Débito</strong>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-medium)' }}>Visa, MasterCard, AMEX.</span>
                  </div>
                </label>

                {/* Mercado Pago option */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: formData.paymentMethod === 'mercadopago' ? 'var(--accent-green)' : 'var(--border-light)',
                  background: formData.paymentMethod === 'mercadopago' ? 'var(--accent-green-light)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mercadopago"
                    checked={formData.paymentMethod === 'mercadopago'}
                    onChange={handleInputChange}
                    style={{ cursor: 'pointer' }}
                  />
                  <img 
                    src="https://img.icons8.com/color/48/000000/mercado-pago.png" 
                    alt="Mercado Pago" 
                    style={{ width: '18px', height: '18px', objectFit: 'contain' }} 
                  />
                  <div>
                    <strong>Mercado Pago</strong>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-medium)' }}>Paga con saldo o tarjeta de forma segura.</span>
                  </div>
                </label>
              </div>

              {/* Conditional Card inputs */}
              {formData.paymentMethod === 'mercadopago' && (
                <div style={{
                  background: '#F0F9FF',
                  border: '1px solid #B9E6FE',
                  padding: '1rem',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <p style={{ fontSize: '0.8rem', color: '#0369A1', fontWeight: 600, margin: 0 }}>
                    ⚠️ Integración Mercado Pago (Simulado)
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#0284C7', margin: 0, lineHeight: 1.4 }}>
                    Al confirmar tu pedido, podrás enviar los detalles de la compra a través de WhatsApp e iniciar el pago. Validaremos tu acreditación antes de liberar el equipamiento.
                  </p>
                </div>
              )}

              {formData.paymentMethod === 'card' && (
                <div style={{
                  background: '#F9FAFB',
                  border: '1px solid var(--border-light)',
                  padding: '1rem',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  {/* Card Owner */}
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Nombre del Titular</label>
                    <input
                      type="text"
                      name="cardName"
                      placeholder="ESTEBAN COLOMBO"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      style={{ width: '100%', height: '32px', padding: '0 0.5rem', fontSize: '0.8rem', textTransform: 'uppercase' }}
                    />
                    {errors.cardName && <p style={{ color: 'var(--danger)', fontSize: '0.65rem', marginTop: '0.1rem' }}>{errors.cardName}</p>}
                  </div>

                  {/* Card number */}
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Número de Tarjeta</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="4517 9812 3456 7890"
                      maxLength={19}
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      style={{ width: '100%', height: '32px', padding: '0 0.5rem', fontSize: '0.8rem' }}
                    />
                    {errors.cardNumber && <p style={{ color: 'var(--danger)', fontSize: '0.65rem', marginTop: '0.1rem' }}>{errors.cardNumber}</p>}
                  </div>

                  {/* Expiry & CVC */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Vencimiento (MM/AA)</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="12/28"
                        maxLength={5}
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        style={{ width: '100%', height: '32px', padding: '0 0.5rem', fontSize: '0.8rem', textAlign: 'center' }}
                      />
                      {errors.cardExpiry && <p style={{ color: 'var(--danger)', fontSize: '0.65rem', marginTop: '0.1rem' }}>{errors.cardExpiry}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Código CVC</label>
                      <input
                        type="password"
                        name="cardCvc"
                        placeholder="•••"
                        maxLength={4}
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        style={{ width: '100%', height: '32px', padding: '0 0.5rem', fontSize: '0.8rem', textAlign: 'center' }}
                      />
                      {errors.cardCvc && <p style={{ color: 'var(--danger)', fontSize: '0.65rem', marginTop: '0.1rem' }}>{errors.cardCvc}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Total review */}
              <div style={{
                background: 'var(--bg-light)',
                padding: '1rem',
                borderRadius: '8px',
                marginTop: '0.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>Total Compra</span>
                  <span style={{ color: 'var(--accent-green)', fontSize: '1rem', fontWeight: 700 }}>USD ${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Checkout */}
              <button
                type="submit"
                className="btn-primary"
                style={{
                  justifyContent: 'center',
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '0.95rem',
                  marginTop: '0.5rem'
                }}
              >
                Pagar y Confirmar Pedido
              </button>
            </form>
          )}

          {/* STEP 3: SUCCESS VIEW */}
          {step === 'success' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1.5rem',
              margin: 'auto 0',
              animation: 'fadeIn 0.4s ease'
            }}>
              <CheckCircle2 size={56} color="var(--success)" fill="rgba(16, 185, 129, 0.1)" />
              
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>
                  ¡Compra Confirmada!
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>
                  Gracias Dr./Dra. <strong>{formData.fullName}</strong>. Su pedido ha sido ingresado correctamente en el sistema de despacho e inventarios.
                </p>
              </div>

              {/* Details card */}
              <div style={{
                background: '#F9FAFB',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                width: '100%',
                padding: '1.25rem',
                textAlign: 'left',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', fontWeight: 600 }}>
                  <span>N° de Orden</span>
                  <span style={{ color: 'var(--accent-blue)' }}>{orderNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-medium)' }}>Total abonado</span>
                  <span style={{ fontWeight: 700 }}>USD ${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-medium)' }}>Método de pago</span>
                  <span>{formData.paymentMethod === 'transfer' ? 'Transferencia Bancaria' : formData.paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Tarjeta de Crédito'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-medium)' }}>Dirección de despacho</span>
                  <span style={{ textAlign: 'right', fontWeight: 500 }}>{formData.address}, {formData.city}</span>
                </div>
              </div>

              {/* Payment instructions if Transfer */}
              {formData.paymentMethod === 'transfer' && (
                <div style={{
                  background: 'rgba(45, 156, 218, 0.05)',
                  border: '1px solid var(--accent-blue)',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  width: '100%'
                }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.4rem', color: '#1c7ba8' }}>Instrucciones de Transferencia:</h4>
                  <p style={{ color: 'var(--text-medium)', marginBottom: '0.5rem' }}>Realice el depósito en la siguiente cuenta corriente de Latmedical:</p>
                  {(() => {
                    const savedSettings = localStorage.getItem('latmedical_web_settings');
                    const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
                    return (
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.2rem', fontWeight: 600 }}>
                        <li>Banco: {settings.bankName || defaultSettings.bankName}</li>
                        <li>CBU: {settings.bankCbu || defaultSettings.bankCbu}</li>
                        <li>Alias: {settings.bankAlias || defaultSettings.bankAlias}</li>
                        <li>Titular: {settings.bankHolder || defaultSettings.bankHolder}</li>
                      </ul>
                    );
                  })()}
                  <p style={{ color: 'var(--text-light)', fontSize: '0.65rem', marginTop: '0.5rem' }}>El despacho se liberará automáticamente al acreditarse la transferencia.</p>
                </div>
              )}

              {/* Payment instructions if Mercado Pago */}
              {formData.paymentMethod === 'mercadopago' && (
                <div style={{
                  background: 'rgba(0, 156, 242, 0.05)',
                  border: '1px solid #009cf2',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  width: '100%'
                }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.4rem', color: '#007fc5' }}>Pago con Mercado Pago:</h4>
                  <p style={{ color: 'var(--text-medium)', marginBottom: '0.5rem' }}>Para completar tu pago de forma instantánea mediante Mercado Pago, pulsa el botón de WhatsApp abajo para recibir tu link de pago oficial o escanea los detalles de acreditación.</p>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.65rem', marginTop: '0.5rem' }}>El despacho quedará reservado temporalmente y se validará al acreditarse tu saldo en nuestra cuenta.</p>
                </div>
              )}

              {/* CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
                <button
                  onClick={handleSendWhatsAppConfirmation}
                  className="btn-primary"
                  style={{
                    justifyContent: 'center',
                    width: '100%',
                    padding: '0.85rem'
                  }}
                >
                  Confirmar Despacho vía WhatsApp <ExternalLink size={14} />
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    onClick={handlePrintReceipt}
                    className="btn-secondary"
                    style={{
                      justifyContent: 'center',
                      padding: '0.85rem',
                      fontSize: '0.8'
                    }}
                  >
                    <Printer size={14} /> Imprimir Ticket
                  </button>

                  <button
                    onClick={handleSuccessClose}
                    className="btn-secondary"
                    style={{
                      justifyContent: 'center',
                      padding: '0.85rem',
                      fontSize: '0.8rem',
                      borderColor: 'var(--border-light)'
                    }}
                  >
                    Seguir Comprando
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
