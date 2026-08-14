import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Send, 
  Copy, 
  X
} from 'lucide-react';
import { CartItem } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { getAssetUrl } from '../utils/assets';

interface QuotationGeneratorProps {
  cartItems: CartItem[];
  cartTotal: number;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationGenerator: React.FC<QuotationGeneratorProps> = ({
  cartItems,
  cartTotal,
  isOpen,
  onClose
}) => {
  const { exchangeRate } = useCurrency();
  // Quote metadata
  const [quoteNumber] = useState<string>(() => `COT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [issueDate] = useState<string>(() => new Date().toLocaleDateString('es-AR'));
  const [expiryDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toLocaleDateString('es-AR');
  });

  // Doctor / Clinic Form Data
  const [clientData, setClientData] = useState({
    institutionName: '',
    doctorName: '',
    medicalLicense: '',
    specialty: '',
    taxId: '', // CUIT / DNI
    taxCondition: 'Responsable Inscripto', // 'Responsable Inscripto' | 'Monotributo' | 'Consumidor Final' | 'Exento'
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summary = `PRESUPUESTO FORMAL ${quoteNumber} - LATMEDICAL\n` +
      `Fecha: ${issueDate} (Validez: 15 días)\n` +
      `Cliente: ${clientData.institutionName || clientData.doctorName || 'Dr./Dra.'}\n` +
      `Matrícula: ${clientData.medicalLicense || 'S/D'}\n` +
      `Total Cotizado: USD $${cartTotal.toFixed(2)}\n\n` +
      `Ítems:\n` +
      cartItems.map(item => `• ${item.quantity}x ${item.product.name}${item.selectedVariant ? ` [${item.selectedVariant}]` : ''} - USD $${((item.unitPrice ?? item.product.price) * item.quantity).toFixed(2)}`).join('\n');

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppSend = () => {
    const itemsList = cartItems
      .map(item => `• *${item.quantity}x* ${item.product.name}${item.selectedVariant ? ` [${item.selectedVariant}]` : ''} - USD $${((item.unitPrice ?? item.product.price) * item.quantity).toFixed(2)}`)
      .join('%0A');

    const text = `*SOLICITUD DE COTIZACIÓN FORMAL - LATMEDICAL*%0A` +
      `*Nº Cotización:* ${quoteNumber}%0A` +
      `*Fecha:* ${issueDate}%0A%0A` +
      `*Profesional / Institución:* ${encodeURIComponent(clientData.institutionName || clientData.doctorName || 'Médico Especialista')}%0A` +
      `*Matrícula Médica:* ${encodeURIComponent(clientData.medicalLicense || 'A validar')}%0A` +
      `*Especialidad:* ${encodeURIComponent(clientData.specialty || 'Medicina Estética')}%0A` +
      `*CUIT / ID Fiscal:* ${encodeURIComponent(clientData.taxId || 'Consumidor Final')}%0A` +
      `*Teléfono:* ${encodeURIComponent(clientData.phone || '')}%0A%0A` +
      `*Detalle de Insumos:*%0A${itemsList}%0A%0A` +
      `*TOTAL ESTIMADO:* USD $${cartTotal.toFixed(2)}%0A%0A` +
      `_Por favor confirmar disponibilidad de stock y datos para transferencia bancaria._`;

    window.open(`https://wa.me/5491136453982?text=${text}`, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div 
        className="quotation-modal-content"
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Action Bar (Hidden on print) */}
        <div className="no-print" style={{
          padding: '1rem 1.5rem',
          background: 'var(--primary-dark)',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={20} color="var(--accent-green)" />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>
              Generador de Presupuesto Formal B2B
            </span>
            <span style={{
              fontSize: '0.75rem',
              background: 'rgba(41, 192, 147, 0.2)',
              color: '#38EF7D',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
              fontWeight: 700
            }}>
              {quoteNumber}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--accent-gradient)',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Printer size={15} /> Imprimir / Guardar PDF
            </button>

            <button
              onClick={handleWhatsAppSend}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                border: '1px solid #25D366',
                background: 'rgba(37, 211, 102, 0.15)',
                color: '#25D366',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Send size={15} /> Enviar a Asesor
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                padding: '0.4rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }} className="quotation-print-area">
          
          {/* Form to complete client details (Interactive before print) */}
          <div className="no-print" style={{
            background: 'var(--bg-light)',
            padding: '1.25rem',
            borderRadius: '10px',
            border: '1px solid var(--border-light)',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.75rem 0', color: 'var(--text-dark)' }}>
              Completar datos de la Institución / Médico Solicitante:
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem'
            }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-medium)', display: 'block', marginBottom: '0.2rem' }}>
                  Nombre del Médico / Dra.
                </label>
                <input
                  type="text"
                  placeholder="Ej: Dr. Juan Pérez"
                  value={clientData.doctorName}
                  onChange={e => setClientData({ ...clientData, doctorName: e.target.value })}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-medium)', display: 'block', marginBottom: '0.2rem' }}>
                  Matrícula Médica
                </label>
                <input
                  type="text"
                  placeholder="Ej: MN 142.890 / MP 45.210"
                  value={clientData.medicalLicense}
                  onChange={e => setClientData({ ...clientData, medicalLicense: e.target.value })}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-medium)', display: 'block', marginBottom: '0.2rem' }}>
                  Institución / Clínica / Razón Social
                </label>
                <input
                  type="text"
                  placeholder="Ej: Clínica Estética Belgrano"
                  value={clientData.institutionName}
                  onChange={e => setClientData({ ...clientData, institutionName: e.target.value })}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-medium)', display: 'block', marginBottom: '0.2rem' }}>
                  CUIT / Condición Fiscal
                </label>
                <input
                  type="text"
                  placeholder="Ej: 20-33445566-9 (Resp. Inscripto)"
                  value={clientData.taxId}
                  onChange={e => setClientData({ ...clientData, taxId: e.target.value })}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-medium)', display: 'block', marginBottom: '0.2rem' }}>
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  placeholder="Ej: +54 9 11 3456-7890"
                  value={clientData.phone}
                  onChange={e => setClientData({ ...clientData, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-medium)', display: 'block', marginBottom: '0.2rem' }}>
                  Email de Envío
                </label>
                <input
                  type="email"
                  placeholder="doctor@clinica.com"
                  value={clientData.email}
                  onChange={e => setClientData({ ...clientData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                />
              </div>
            </div>
          </div>

          {/* PRINTABLE DOCUMENT STARTS HERE */}
          <div style={{
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            padding: '2.5rem',
            background: '#FFFFFF',
            color: '#1F2937'
          }}>
            
            {/* 1. Header with Logos and Company Info */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '1.5rem',
              borderBottom: '2px solid #111827',
              marginBottom: '1.5rem'
            }}>
              <div>
                <img 
                  src={getAssetUrl('/logo-full.png')} 
                  alt="Latmedical" 
                  style={{ height: '42px', width: 'auto', marginBottom: '0.5rem' }} 
                />
                <div style={{ fontSize: '0.8rem', color: '#4B5563', lineHeight: 1.4 }}>
                  <strong>Latmedical International S.A.</strong><br />
                  Distribuidor Oficial Exclusivo V-Lift Pro & Seffiline<br />
                  Habilitación ANMAT Disposición Nº 7421/18<br />
                  Buenos Aires, Argentina | info@latmedical.com
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#111827',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Presupuesto Formal
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', marginTop: '0.25rem' }}>
                  Nº {quoteNumber}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.35rem' }}>
                  <strong>Fecha de Emisión:</strong> {issueDate}<br />
                  <strong>Válido hasta:</strong> {expiryDate} (15 días)
                </div>
              </div>
            </div>

            {/* 2. Client and Shipping Details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              padding: '1rem',
              background: '#F9FAFB',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280' }}>
                  Datos del Destinatario / Profesional:
                </span>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                  {clientData.doctorName || clientData.institutionName || 'Profesional Médico'}
                </div>
                {clientData.medicalLicense && (
                  <div style={{ color: '#4B5563' }}>Matrícula: {clientData.medicalLicense}</div>
                )}
                {clientData.specialty && (
                  <div style={{ color: '#4B5563' }}>Especialidad: {clientData.specialty}</div>
                )}
                {clientData.taxId && (
                  <div style={{ color: '#4B5563' }}>CUIT / ID Fiscal: {clientData.taxId}</div>
                )}
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280' }}>
                  Condiciones Comerciales:
                </span>
                <div style={{ color: '#4B5563', marginTop: '0.25rem' }}>
                  <strong>Moneda:</strong> Dólares Estadounidenses (USD)
                </div>
                <div style={{ color: '#4B5563' }}>
                  <strong>Forma de Pago:</strong> Transferencia Bancaria Oficial / Tarjetas
                </div>
                <div style={{ color: '#4B5563' }}>
                  <strong>Plazo de Entrega:</strong> 24-48 hs hábiles CABA/GBA, 48-72 hs Interior
                </div>
                <div style={{ color: '#4B5563' }}>
                  <strong>Garantía:</strong> Cadena estéril y trazabilidad oficial ANMAT
                </div>
              </div>
            </div>

            {/* 3. Itemized Table */}
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}>
              <thead>
                <tr style={{ background: '#111827', color: '#FFFFFF', textAlign: 'left' }}>
                  <th style={{ padding: '0.65rem 0.75rem', borderRadius: '4px 0 0 0' }}>Cant.</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Descripción del Dispositivo Médico</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Marca</th>
                  <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Precio Unit.</th>
                  <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right', borderRadius: '0 4px 0 0' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => {
                  const price = item.unitPrice ?? item.product.price;
                  const rowSubtotal = price * item.quantity;

                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{item.quantity}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{item.product.name}</div>
                        {item.selectedVariant && (
                          <div style={{ fontSize: '0.75rem', color: '#059669' }}>Calibre / Medida: {item.selectedVariant}</div>
                        )}
                        {item.isClearance && (
                          <div style={{ fontSize: '0.75rem', color: '#D97706' }}>Lote Promocional (Vto: {item.expiryDate || 'Cercano'})</div>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem', color: '#4B5563' }}>{item.product.brand}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: '#4B5563' }}>USD ${price.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                        USD ${rowSubtotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* 4. Totals and Banking Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '2rem',
              alignItems: 'flex-start',
              paddingTop: '1rem',
              borderTop: '2px solid #E5E7EB'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#4B5563', lineHeight: 1.4 }}>
                <strong style={{ color: '#111827' }}>Datos Bancarios Oficiales para Transferencias:</strong><br />
                Banco Santander Río | Cuenta Corriente en USD / ARS<br />
                CBU: 0720123420000001234567<br />
                Alias: LATMEDICAL.OFICIAL<br />
                Razón Social: Latmedical International S.A. | CUIT: 30-71689241-9
              </div>

              <div style={{
                background: '#F9FAFB',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                textAlign: 'right'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#6B7280' }}>Subtotal Neto:</span>
                  <span style={{ fontWeight: 600 }}>USD ${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#6B7280' }}>Despacho Asegurado:</span>
                  <span style={{ fontWeight: 600, color: '#059669' }}>BONIFICADO</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.6rem',
                  borderTop: '2px solid #111827',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#111827'
                }}>
                  <span>TOTAL ESTIMADO:</span>
                  <span style={{ color: '#059669' }}>USD ${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '0.25rem' }}>
                  Equivalente: <strong>$ {Math.round(cartTotal * exchangeRate).toLocaleString('es-AR')} ARS</strong> (TC: ${exchangeRate} ARS)
                </div>
              </div>
            </div>

            {/* 5. Legal & Scientific Regulatory Footer */}
            <div style={{
              marginTop: '2rem',
              paddingTop: '1rem',
              borderTop: '1px solid #E5E7EB',
              fontSize: '0.72rem',
              color: '#6B7280',
              textAlign: 'center',
              lineHeight: 1.4
            }}>
              La adquisición de estos dispositivos médicos está reservada exclusivamente a profesionales médicos habilitados con matrícula vigente en la República Argentina. Cotización sujeta a disponibilidad de stock y tipo de cambio al momento de la acreditación efectiva del pago.
            </div>

          </div>
        </div>

        {/* Modal Bottom Actions (Hidden on print) */}
        <div className="no-print" style={{
          padding: '1rem 1.5rem',
          background: '#F9FAFB',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handleCopySummary}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid var(--border-light)',
              background: '#FFFFFF',
              color: 'var(--text-dark)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Copy size={16} /> {copied ? '¡Copiado al Portapapeles!' : 'Copiar Resumen'}
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid var(--border-light)',
                background: 'transparent',
                color: 'var(--text-medium)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--accent-gradient)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Printer size={16} /> Imprimir Presupuesto
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
