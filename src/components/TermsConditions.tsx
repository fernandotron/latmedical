import React from 'react';
import { AlertTriangle, Scale } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

export const TermsConditions: React.FC = () => {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      {/* Hero Header */}
      <section style={{
        position: 'relative',
        height: '25vh',
        minHeight: '200px',
        marginTop: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--primary-dark)',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url("${getAssetUrl('/images/parallax-gris.png')}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(41, 192, 147, 0.2) 100%)',
          zIndex: 2
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 3, color: '#FFFFFF' }}>
          <span className="badge badge-accent-green" style={{ marginBottom: '0.5rem' }}>Legal</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
            Términos y Condiciones
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-white)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-medium)', lineHeight: '1.7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Scale size={32} color="var(--accent-green)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>
              Condiciones de Uso y Contratación Comercial B2B
            </h2>
          </div>

          <p>
            Bienvenido a <strong>Latmedical</strong>. El acceso y uso de este portal web, así como la cotización de nuestros productos médicos (hilos tensores PDO Vlift Pro y sistemas de microinjerto Seffiline) están sujetos a los siguientes términos y condiciones de contratación y uso legal.
          </p>

          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            borderLeft: '4px solid #ef4444',
            borderRadius: '6px',
            padding: '1.25rem',
            margin: '2rem 0',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start'
          }}>
            <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#b91c1c', fontWeight: 600 }}>
              ADVERTENCIA LEGAL RESTRICCION DE VENTA (ANMAT): Todos los productos distribuidos por Latmedical son exclusivamente de uso profesional de la salud. Solo se procesarán ventas y despachos a profesionales médicos colegiados (cirujanos plásticos, dermatólogos, ginecólogos, odontólogos habilitados, etc.) que cuenten con matrícula nacional o provincial vigente en la República Argentina. Queda terminantemente prohibida la venta al público general.
            </p>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            1. Objeto y Alcance del Sitio Web
          </h3>
          <p>
            Este sitio web funciona como un catálogo interactivo de exhibición y cotización comercial para el territorio de la República Argentina.
          </p>
          <ul>
            <li>La inclusión de artículos en el carro de compras no constituye un contrato de compraventa cerrado ni obliga al despacho inmediato de mercadería.</li>
            <li>La confirmación final del pedido se inicia a través del carro web y se deriva directamente a nuestro <strong>WhatsApp Comercial Oficial</strong>, donde un asesor clínico de Latmedical procesará la matrícula médica habilitante, validará las credenciales profesionales del solicitante y coordinará la cotización final en pesos argentinos, métodos de pago y condiciones del flete estéril/refrigerado.</li>
          </ul>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            2. Validación de Credenciales Médicas
          </h3>
          <p>
            Al iniciar el checkout del carro o enviar solicitudes de contacto:
          </p>
          <ul>
            <li>El usuario declara bajo juramento ser profesional médico matriculado y estar habilitado legalmente para la aplicación clínica de hilos de sustentación tisular y procesamiento de tejido adiposo autólogo.</li>
            <li>Nos reservamos el derecho unilateral de anular o congelar cualquier pedido de cotización si no se proveen las acreditaciones solicitadas por el asesor de ventas o si las mismas no son validables frente a los registros públicos de colegios médicos y ministerios de salud pertinentes.</li>
          </ul>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            3. Responsabilidad por Aplicación y Uso Clínico
          </h3>
          <p>
            Los productos Vlift Pro y Seffiline cuentan con acreditación europea y habilitación regulatoria ANMAT. No obstante:
          </p>
          <ul>
            <li>Latmedical no es responsable por complicaciones clínicas, mala praxis o daños ocasionados por la impericia, falta de capacitación clínica o desviaciones en la técnica quirúrgica aplicada por el profesional médico tratante.</li>
            <li>Es responsabilidad del profesional médico capacitarse debidamente y seguir los protocolos científicos autorizados. Latmedical ofrece programas y planes de formación técnica oficiales que el médico puede solicitar formalmente.</li>
          </ul>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            4. Precios, Pagos y Despacho de Mercaderías
          </h3>
          <ul>
            <li>Los precios de los insumos y equipamiento médico son informados de forma privada por el asesor comercial debido al carácter dinámico del mercado y la variación en las cantidades de compra mayorista.</li>
            <li>Los despachos se realizan únicamente bajo acreditación de pago y tras la validación de matrícula correspondiente.</li>
            <li>Para envíos al interior del país, nos comprometemos a embalar los productos siguiendo altos estándares de conservación y esterilidad. La logística se coordina individualmente en la conversación de WhatsApp oficial.</li>
          </ul>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            5. Jurisdicción y Ley Aplicable
          </h3>
          <p>
            Cualquier diferendo legal o conflicto derivado de la interpretación de los presentes términos se regirá exclusivamente por las leyes de la República Argentina, sometiéndose las partes a la jurisdicción de los Tribunales Ordinarios en lo Comercial de la Ciudad Autónoma de Buenos Aires (C.A.B.A.).
          </p>

          <p style={{ marginTop: '3rem', fontSize: '0.85rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            Última actualización: Julio 2026. Latmedical International, Argentina.
          </p>
        </div>
      </section>
    </div>
  );
};
