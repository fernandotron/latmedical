import React from 'react';
import { Database } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

export const CookiePolicy: React.FC = () => {
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
            Política de Cookies
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-white)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-medium)', lineHeight: '1.7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Database size={32} color="var(--accent-green)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>
              Uso de Cookies y Almacenamiento Local
            </h2>
          </div>

          <p>
            Esta política detalla cómo <strong>Latmedical</strong> utiliza cookies, tecnologías similares y tecnologías de almacenamiento local en el navegador web (como <code>localStorage</code> y <code>sessionStorage</code>) para garantizar el correcto funcionamiento del portal, resguardar las preferencias del usuario y asegurar el canal comercial B2B.
          </p>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            1. ¿Qué son las Cookies y Almacenamientos Locales?
          </h3>
          <p>
            Las cookies son pequeños archivos de texto que el navegador almacena al visitar un sitio web. Además de las cookies estándar, este sitio utiliza almacenamiento local de HTML5 (<code>localStorage</code> y <code>sessionStorage</code>) que cumple un propósito similar pero de forma más eficiente y sin transferir datos de forma innecesaria en cada consulta de red.
          </p>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            2. Tipos de Almacenamiento Utilizados por Latmedical
          </h3>
          <p>
            No realizamos perfiles de usuario invasivos ni utilizamos cookies publicitarias de terceros. Solo empleamos herramientas de almacenamiento técnicas y esenciales para las siguientes finalidades:
          </p>
          <ul>
            <li><strong>Persistencia del Carro de Compras (<code>localStorage</code>)</strong>: Almacenamos temporalmente los productos (hilos tensores o kits Seffiline), cantidades y calibres seleccionados en tu carro de compras para que no se pierdan al recargar la página o al navegar entre las distintas secciones clínicas.</li>
            <li><strong>Sesión Administrativa (<code>sessionStorage</code>)</strong>: Para el área privada del panel de control de inventario (`/admin`), empleamos variables de sesión que permiten verificar que el usuario administrador ha iniciado sesión de forma legítima. Esta sesión se destruye automáticamente al cerrar el navegador.</li>
            <li><strong>Historial de Órdenes Local</strong>: Almacenamos en el dispositivo local las solicitudes de cotizaciones de compras generadas para que el usuario profesional pueda realizar un seguimiento local de sus despachos pasados de forma cómoda.</li>
          </ul>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            3. Cookies de Terceros y Redirecciones
          </h3>
          <p>
            Dado que la confirmación de la cotización y el pago final se derivan a <strong>WhatsApp Comercial</strong> y plataformas financieras externas (como Mercado Pago o transferencias bancarias), estos portales de destino aplicarán sus propias políticas de cookies y privacidad correspondientes sobre las cuales Latmedical no tiene control directo. Te sugerimos revisar las políticas correspondientes al iniciar sesión o interactuar en esos portales.
          </p>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            4. Control de Cookies y Almacenamiento
          </h3>
          <p>
            Puedes restringir, borrar o bloquear las cookies y el almacenamiento local desde la configuración de tu navegador web (Chrome, Firefox, Safari, Edge, etc.). Ten en cuenta que si desactivas por completo el almacenamiento local o las cookies esenciales:
          </p>
          <ul>
            <li>No podrás añadir productos al carro de compras ni proceder con la cotización vía WhatsApp de forma automatizada.</li>
            <li>El panel de administración podría presentar inconvenientes para validar tu ingreso.</li>
          </ul>

          <p style={{ marginTop: '3rem', fontSize: '0.85rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            Última actualización: Julio 2026. Latmedical International, Argentina.
          </p>
        </div>
      </section>
    </div>
  );
};
