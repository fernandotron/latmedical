import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X
} from 'lucide-react';
import { Product } from '../data/products';
import { ProductInventory, VariantStock, ClearanceOffer } from '../context/InventoryContext';
import { useCurrency } from '../context/CurrencyContext';
import { getAssetUrl } from '../utils/assets';

interface StockReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  inventory: ProductInventory[];
  clearanceOffers: ClearanceOffer[];
  editState: Record<string, { stock: number; price: number }>;
  onExportCSV: () => void;
}

export const StockReportModal: React.FC<StockReportModalProps> = ({
  isOpen,
  onClose,
  products,
  inventory,
  clearanceOffers,
  editState,
  onExportCSV
}) => {
  const { exchangeRate } = useCurrency();
  const [reportId] = useState<string>(() => `INV-LAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [reportDate] = useState<string>(() => new Date().toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short' }));

  if (!isOpen) return null;

  // Calculate statistics
  let totalRegularUnits = 0;
  let totalRegularValueUSD = 0;
  let totalSKUs = 0;

  const catalogRows: Array<{
    productId: string;
    productName: string;
    brand: string;
    category: string;
    variantName: string;
    stock: number;
    unitPrice: number;
    totalValue: number;
  }> = [];

  products.forEach(p => {
    const inv = inventory.find(i => i.productId === p.id);
    if (inv && inv.hasVariants && inv.variants) {
      inv.variants.forEach((v: VariantStock) => {
        const key = `${p.id}-${v.id}`;
        const currentStock = editState[key] ? editState[key].stock : v.stock;
        const currentPrice = editState[key] ? editState[key].price : (v.price !== undefined ? v.price : p.price);
        const totalVal = currentStock * currentPrice;
        
        totalRegularUnits += currentStock;
        totalRegularValueUSD += totalVal;
        totalSKUs += 1;

        catalogRows.push({
          productId: p.id,
          productName: p.name,
          brand: p.brand,
          category: p.category,
          variantName: v.name,
          stock: currentStock,
          unitPrice: currentPrice,
          totalValue: totalVal
        });
      });
    } else {
      const currentStock = editState[p.id] ? editState[p.id].stock : (inv ? inv.stock : 0);
      const currentPrice = editState[p.id] ? editState[p.id].price : p.price;
      const totalVal = currentStock * currentPrice;

      totalRegularUnits += currentStock;
      totalRegularValueUSD += totalVal;
      totalSKUs += 1;

      catalogRows.push({
        productId: p.id,
        productName: p.name,
        brand: p.brand,
        category: p.category,
        variantName: 'Estándar',
        stock: currentStock,
        unitPrice: currentPrice,
        totalValue: totalVal
      });
    }
  });

  let totalOutletUnits = 0;
  let totalOutletValueUSD = 0;

  clearanceOffers.forEach(c => {
    totalOutletUnits += c.stock;
    totalOutletValueUSD += (c.stock * c.clearancePrice);
  });

  const totalGlobalUnits = totalRegularUnits + totalOutletUnits;
  const totalGlobalValueUSD = totalRegularValueUSD + totalOutletValueUSD;
  const totalGlobalValueARS = Math.round(totalGlobalValueUSD * exchangeRate);

  const handlePrint = () => {
    // Generate an isolated, clean printable document via a hidden iframe for perfect multi-page A4 PDF export
    const printElement = document.getElementById('printable-stock-report');
    if (!printElement) {
      window.print();
      return;
    }

    const existingIframe = document.getElementById('latmedical-print-frame');
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'latmedical-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const logoFullUrl = window.location.origin + getAssetUrl('/logo-full.png');

    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) {
      window.print();
      return;
    }

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Reporte_Auditoria_${reportId}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 10mm 14mm 10mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              color: #1e293b;
              background: #ffffff;
              font-size: 8.5pt;
              line-height: 1.4;
            }
            .print-container {
              width: 100%;
              max-width: 100%;
              margin: 0 auto;
            }
            .avoid-break {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              page-break-inside: auto;
              font-size: 8pt;
            }
            thead {
              display: table-header-group;
            }
            tbody {
              display: table-row-group;
            }
            tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            th, td {
              padding: 5px 7px;
            }
            .section-box {
              margin-bottom: 18px;
            }
            .kpi-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 8px;
              margin-bottom: 16px;
            }
            .kpi-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 8px 10px;
            }
            .badge-report {
              display: inline-block;
              background: #0f172a;
              color: #ffffff;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 7pt;
              font-weight: 800;
              letter-spacing: 0.05em;
              text-transform: uppercase;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${printElement.innerHTML.replace(/src="[^"]*logo-full\.png"/g, `src="${logoFullUrl}"`)}
          </div>
        </body>
      </html>
    `);
    iframeDoc.close();

    // Wait for assets and font to render, then invoke print
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.error('Iframe print error, falling back to window.print():', e);
        window.print();
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 3000);
      }
    }, 350);
  };

  return (
    <div 
      className="stock-report-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        overflowY: 'auto'
      }}>
      <div 
        className="stock-report-modal-dialog"
        style={{
          background: '#f8fafc',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}>
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print" style={{
          padding: '1rem 1.75rem',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(41, 192, 147, 0.1)',
              color: 'var(--accent-green)',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex'
            }}>
              <FileText size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                Reporte Oficial de Inventario y Stock Físico
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-medium)' }}>
                Documento formal auditado con membrete corporativo Latmedical
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={onExportCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                padding: '0.6rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)'
              }}
            >
              <Download size={15} /> Descargar Excel (.CSV)
            </button>

            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'var(--primary-dark)',
                color: '#ffffff',
                border: 'none',
                padding: '0.6rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(15, 23, 42, 0.2)'
              }}
            >
              <Printer size={15} /> Imprimir / Guardar PDF (A4)
            </button>

            <button
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-medium)'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Area */}
        <div 
          className="stock-report-scroll-wrapper"
          style={{
            overflowY: 'auto',
            padding: '2rem',
            display: 'flex',
            justifyContent: 'center',
            background: '#f1f5f9'
          }}>
          
          {/* A4 Sheet Container */}
          <div id="printable-stock-report" style={{
            background: '#ffffff',
            width: '100%',
            maxWidth: '850px',
            padding: '2.5rem',
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            boxSizing: 'border-box',
            fontFamily: "'Inter', sans-serif",
            color: '#1e293b'
          }}>
            
            {/* Header / Institutional Brand */}
            <div className="avoid-break" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #0f172a',
              paddingBottom: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div>
                <img 
                  src={getAssetUrl('/logo-full.png')} 
                  alt="Latmedical International" 
                  style={{ height: '46px', width: 'auto', marginBottom: '0.4rem', display: 'block' }} 
                />
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  Latmedical International S.A. | CUIT: 30-71689241-9
                </p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                  Distribución Oficial Exclusiva V-Lift Pro & Seffiline
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{
                  display: 'inline-block',
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem'
                }}>
                  Informe de Auditoría
                </div>
                <h4 style={{ margin: '0.1rem 0', fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                  {reportId}
                </h4>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748b' }}>
                  <strong>Fecha de Emisión:</strong> {reportDate}
                </p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                  Certificación ANMAT PM 1234-56 | ISO 13485:2016
                </p>
              </div>
            </div>

            {/* Executive KPI Summary Cards */}
            <div className="avoid-break" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.65rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                  Total Existencias
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {totalGlobalUnits.toLocaleString('es-AR')} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>u.</span>
                </span>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                  Valorización (USD)
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
                  USD ${totalGlobalValueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                  Valorización (ARS)
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0369a1' }}>
                  $ {totalGlobalValueARS.toLocaleString('es-AR')}
                </span>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                  SKUs / Variantes
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6d28d9' }}>
                  {totalSKUs} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>referencias</span>
                </span>
              </div>
            </div>

            {/* Section 1: Catálogo Regular */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div className="avoid-break" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.35rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  1. Catálogo Regular (Hilos PDO V-Lift Pro & Medicina Regenerativa)
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  Subtotal: {totalRegularUnits} unidades (USD ${totalRegularValueUSD.toFixed(2)})
                </span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.73rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderTop: '1px solid #cbd5e1', borderBottom: '1.5px solid #0f172a' }}>
                    <th style={{ padding: '0.4rem 0.55rem', textAlign: 'left', fontWeight: 700 }}>Producto / Línea</th>
                    <th style={{ padding: '0.4rem 0.55rem', textAlign: 'left', fontWeight: 700 }}>Marca</th>
                    <th style={{ padding: '0.4rem 0.55rem', textAlign: 'left', fontWeight: 700 }}>Variedad / Calibre</th>
                    <th style={{ padding: '0.4rem 0.55rem', textAlign: 'center', fontWeight: 700 }}>Stock Físico</th>
                    <th style={{ padding: '0.4rem 0.55rem', textAlign: 'right', fontWeight: 700 }}>Precio Unit. (USD)</th>
                    <th style={{ padding: '0.4rem 0.55rem', textAlign: 'right', fontWeight: 700 }}>Total (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {catalogRows.map((row, idx) => (
                    <tr 
                      key={`${row.productId}-${row.variantName}-${idx}`}
                      style={{ 
                        borderBottom: '1px solid #e2e8f0',
                        background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                        pageBreakInside: 'avoid'
                      }}
                    >
                      <td style={{ padding: '0.38rem 0.55rem', fontWeight: 600, color: '#0f172a' }}>{row.productName}</td>
                      <td style={{ padding: '0.38rem 0.55rem', color: '#64748b' }}>{row.brand}</td>
                      <td style={{ padding: '0.38rem 0.55rem', fontWeight: 600, color: '#0369a1' }}>{row.variantName}</td>
                      <td style={{ padding: '0.38rem 0.55rem', textAlign: 'center', fontWeight: 700, color: row.stock > 0 ? '#059669' : '#dc2626' }}>
                        {row.stock} {row.stock === 0 ? '(Agotado)' : ''}
                      </td>
                      <td style={{ padding: '0.38rem 0.55rem', textAlign: 'right' }}>USD ${row.unitPrice.toFixed(2)}</td>
                      <td style={{ padding: '0.38rem 0.55rem', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        USD ${row.totalValue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 2: Outlet / Clearance Batches */}
            {clearanceOffers.length > 0 && (
              <div style={{ marginBottom: '1.75rem' }}>
                <div className="avoid-break" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid #fed7aa', paddingBottom: '0.35rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#9a3412' }}>
                    2. Lotes Especiales en Oferta (Outlet por Vencimiento Cercano)
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#c2410c', fontWeight: 600 }}>
                    Subtotal: {totalOutletUnits} unidades (USD ${totalOutletValueUSD.toFixed(2)})
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.73rem' }}>
                  <thead>
                    <tr style={{ background: '#fff7ed', borderTop: '1px solid #fed7aa', borderBottom: '1.5px solid #ea580c' }}>
                      <th style={{ padding: '0.4rem 0.55rem', textAlign: 'left', fontWeight: 700, color: '#9a3412' }}>Lote / Batch</th>
                      <th style={{ padding: '0.4rem 0.55rem', textAlign: 'left', fontWeight: 700, color: '#9a3412' }}>Producto</th>
                      <th style={{ padding: '0.4rem 0.55rem', textAlign: 'left', fontWeight: 700, color: '#9a3412' }}>Medida / Calibre</th>
                      <th style={{ padding: '0.4rem 0.55rem', textAlign: 'center', fontWeight: 700, color: '#9a3412' }}>Caducidad</th>
                      <th style={{ padding: '0.4rem 0.55rem', textAlign: 'center', fontWeight: 700, color: '#9a3412' }}>Stock</th>
                      <th style={{ padding: '0.4rem 0.55rem', textAlign: 'right', fontWeight: 700, color: '#9a3412' }}>Precio Reg.</th>
                      <th style={{ padding: '0.4rem 0.55rem', textAlign: 'right', fontWeight: 700, color: '#9a3412' }}>Precio Oferta</th>
                      <th style={{ padding: '0.4rem 0.55rem', textAlign: 'right', fontWeight: 700, color: '#9a3412' }}>Total Lote</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clearanceOffers.map((c, idx) => {
                      const totalVal = c.stock * c.clearancePrice;
                      return (
                        <tr 
                          key={c.id}
                          style={{ 
                            borderBottom: '1px solid #ffedd5',
                            background: idx % 2 === 0 ? '#ffffff' : '#fffbeb',
                            pageBreakInside: 'avoid'
                          }}
                        >
                          <td style={{ padding: '0.38rem 0.55rem', fontWeight: 700, color: '#9a3412' }}>{c.batchNumber || 'LOTE-ESP'}</td>
                          <td style={{ padding: '0.38rem 0.55rem', fontWeight: 600 }}>{c.productName}</td>
                          <td style={{ padding: '0.38rem 0.55rem' }}>{c.variantName || 'Estándar'}</td>
                          <td style={{ padding: '0.38rem 0.55rem', textAlign: 'center', color: '#b45309', fontWeight: 600 }}>{c.expiryDate}</td>
                          <td style={{ padding: '0.38rem 0.55rem', textAlign: 'center', fontWeight: 800, color: '#ea580c' }}>{c.stock}</td>
                          <td style={{ padding: '0.38rem 0.55rem', textAlign: 'right', color: '#94a3b8', textDecoration: 'line-through' }}>
                            USD ${(c.regularPrice || 0).toFixed(2)}
                          </td>
                          <td style={{ padding: '0.38rem 0.55rem', textAlign: 'right', fontWeight: 700, color: '#ea580c' }}>
                            USD ${c.clearancePrice.toFixed(2)}
                          </td>
                          <td style={{ padding: '0.38rem 0.55rem', textAlign: 'right', fontWeight: 800, color: '#9a3412' }}>
                            USD ${totalVal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Legal Certification and Signatures */}
            <div className="avoid-break" style={{
              borderTop: '2px solid #0f172a',
              paddingTop: '1.25rem',
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr',
              gap: '2rem',
              alignItems: 'flex-start'
            }}>
              <div>
                <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                  <strong>Aviso de Confidencialidad y Control de Calidad:</strong><br />
                  Este documento refleja el estado de stock físico en almacén central de Latmedical International al momento de su generación. Todos los dispositivos médicos cuentan con certificación ANMAT y trazabilidad por lote.
                </p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>
                  Sistema de Gestión Latmedical Cloud • Registro generado automáticamente.
                </p>
              </div>

              <div style={{ textAlign: 'center', paddingTop: '1.25rem' }}>
                <div style={{ borderTop: '1px dashed #64748b', width: '80%', margin: '0 auto 0.4rem auto' }} />
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                  Responsable de Control de Stock
                </p>
                <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b' }}>
                  Latmedical International S.A.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Global & Fallback Print Stylesheet for Pure Multi-Page A4 PDF Export */}
      <style>{`
        @media print {
          /* Reset root layout constraints for multi-page flow */
          html, body {
            overflow: visible !important;
            height: auto !important;
            min-height: auto !important;
            background: #ffffff !important;
            color: #1e293b !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Hide everything except the modal report */
          .wp-admin-bar,
          header,
          footer,
          nav,
          .no-print,
          .admin-sidebar,
          .admin-layout > *:not(.admin-main-content),
          .admin-main-content > *:not(.stock-report-modal-overlay) {
            display: none !important;
          }

          /* Neutralize modal positioning to let document flow naturally */
          .stock-report-modal-overlay {
            position: static !important;
            display: block !important;
            background: transparent !important;
            backdrop-filter: none !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            height: auto !important;
            width: 100% !important;
            z-index: auto !important;
          }

          .stock-report-modal-dialog {
            position: static !important;
            display: block !important;
            max-height: none !important;
            height: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
          }

          .stock-report-scroll-wrapper {
            position: static !important;
            display: block !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            height: auto !important;
            background: #ffffff !important;
          }

          #printable-stock-report {
            position: static !important;
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
          }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
            page-break-inside: auto !important;
          }

          thead {
            display: table-header-group !important;
          }

          tbody {
            display: table-row-group !important;
          }

          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          @page {
            size: A4 portrait;
            margin: 12mm 10mm 14mm 10mm;
          }
        }
      `}</style>
    </div>
  );
};
