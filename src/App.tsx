import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { InventoryProvider } from './context/InventoryContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Catalog } from './components/Catalog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Cart } from './components/Cart';
import { ProductDetail } from './components/ProductDetail';
import { AdminPanel } from './components/AdminPanel';
import { ShieldCheck, Activity, Award, ChevronRight, Check, Sparkles } from 'lucide-react';
import { products, Product } from './data/products';
import { ProductCard } from './components/ProductCard';
import { HilosPDOPage } from './components/HilosPDOPage';
import { SeffilinePage } from './components/SeffilinePage';
import { getAssetUrl } from './utils/assets';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { CookiePolicy } from './components/CookiePolicy';
import { TermsConditions } from './components/TermsConditions';
import { ClearancePage } from './components/ClearancePage';
import { RoiCalculator } from './components/RoiCalculator';
import { MedicalAcademy } from './components/MedicalAcademy';
import { MedicalDownloads } from './components/MedicalDownloads';
import { QuickOrderPad } from './components/QuickOrderPad';

// Helper to detect if hosted in a subdirectory (like Hostgator folder)
const getSubdirectoryBasename = () => {
  const path = window.location.pathname;
  const routes = [
    '/nosotros', 
    '/hilos-pdo', 
    '/seffiline', 
    '/productos', 
    '/oportunidades', 
    '/calculadora-roi', 
    '/pedido-rapido',
    '/quick-order',
    '/academia',
    '/workshops',
    '/cursos',
    '/descargas',
    '/documentacion-medica',
    '/contacto', 
    '/admin', 
    '/inicio', 
    '/index.html', 
    '/politica-de-privacidad', 
    '/politica-de-cookies', 
    '/terminos-y-condiciones'
  ];
  
  let sub = path;
  routes.forEach(r => {
    if (sub.endsWith(r)) {
      sub = sub.substring(0, sub.length - r.length);
    }
  });
  
  // Also check if path ends with /producto/something
  if (sub.includes('/producto/')) {
    const parts = sub.split('/producto/');
    sub = parts[0];
  }
  
  if (sub.endsWith('/')) {
    sub = sub.substring(0, sub.length - 1);
  }
  return sub; // e.g. "/website_cfa7e982" or ""
};

const basename = getSubdirectoryBasename();

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [logoScale, setLogoScale] = useState<number>(0.8);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('latmedical_admin_logged') === 'true';
  });

  const handleAdminLogin = (loggedIn: boolean) => {
    setIsAdminLoggedIn(loggedIn);
    if (loggedIn) {
      sessionStorage.setItem('latmedical_admin_logged', 'true');
    } else {
      sessionStorage.removeItem('latmedical_admin_logged');
    }
  };

  // Course form states
  const [courseName, setCourseName] = useState('');
  const [courseCountry, setCourseCountry] = useState('');
  const [coursePhone, setCoursePhone] = useState('');
  const [courseEmail, setCourseEmail] = useState('');
  const [coursePolicy, setCoursePolicy] = useState(false);
  const [courseFormErrors, setCourseFormErrors] = useState<Record<string, string>>({});
  const [courseFormSubmitted, setCourseFormSubmitted] = useState(false);

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!courseName.trim()) {
      errors.name = 'El nombre es obligatorio.';
    }
    if (!courseCountry.trim()) {
      errors.country = 'El país es obligatorio.';
    }
    if (!coursePhone.trim()) {
      errors.phone = 'El teléfono es obligatorio.';
    }
    if (!courseEmail.trim()) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(courseEmail)) {
      errors.email = 'El correo electrónico no es válido.';
    }
    if (!coursePolicy) {
      errors.policy = 'Debes aceptar la política de privacidad y datos.';
    }

    if (Object.keys(errors).length > 0) {
      setCourseFormErrors(errors);
      return;
    }

    // Success flow
    setCourseFormErrors({});
    setCourseFormSubmitted(true);
    
    const submissionData = {
      id: 'sub-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      date: new Date().toLocaleString('es-AR'),
      type: 'Curso Internacional',
      name: courseName.trim(),
      email: courseEmail.trim(),
      phone: coursePhone.trim(),
      country: courseCountry.trim(),
      message: 'Inscripción a curso internacional'
    };

    // Backup in localStorage
    try {
      const saved = localStorage.getItem('latmedical_submissions');
      const existing = saved ? JSON.parse(saved) : [];
      existing.push(submissionData);
      localStorage.setItem('latmedical_submissions', JSON.stringify(existing));
    } catch (err) {
      console.error('Error saving course submission to localStorage:', err);
    }
    
    // Save submission on server
    fetch('/api/save-submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData)
    })
      .then(res => {
        if (!res.ok) console.warn('Servidor respondió con estado no OK al guardar inscripción a curso:', res.status);
      })
      .catch(err => console.error('Error saving course registry:', err));

    // Clear inputs after showing success message
    setTimeout(() => {
      setCourseFormSubmitted(false);
      setCourseName('');
      setCourseCountry('');
      setCoursePhone('');
      setCourseEmail('');
      setCoursePolicy(false);
    }, 4500);
  };

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('tecnologia-latmedical');
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how close the section is to the center of the screen
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      const distance = Math.abs(elementCenter - viewportCenter);
      const maxDistance = windowHeight * 0.8;
      
      // Map distance to a scale from 0.5 to 1.1
      const scaleFactor = Math.max(0.5, 1.1 - (distance / maxDistance) * 0.6);
      setLogoScale(scaleFactor);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Path Router implementation (Removing the "#" routing)
  useEffect(() => {
    const parsePath = () => {
      let path = window.location.pathname || '/inicio';
      if (basename && path.startsWith(basename)) {
        path = path.substring(basename.length);
      }
      if (path === '' || path === '/') {
        path = '/inicio';
      }

      if (path.startsWith('/producto/')) {
        const productId = path.replace('/producto/', '');
        const found = products.find(p => p.id === productId);
        if (found) {
          setSelectedProduct(found);
          setActiveTab('products');
          return;
        }
      }
      
      setSelectedProduct(null);
      switch (path) {
        case '/nosotros':
          setActiveTab('about');
          break;
        case '/hilos-pdo':
          setActiveTab('hilos-pdo');
          break;
        case '/seffiline':
          setActiveTab('seffiline');
          break;
        case '/productos':
          setActiveTab('products');
          break;
        case '/oportunidades':
          setActiveTab('clearance');
          break;
        case '/calculadora-roi':
          setActiveTab('roi');
          break;
        case '/pedido-rapido':
        case '/quick-order':
          setActiveTab('quick-order');
          break;
        case '/academia':
        case '/workshops':
        case '/cursos':
          setActiveTab('academia');
          break;
        case '/descargas':
        case '/documentacion-medica':
          setActiveTab('descargas');
          break;
        case '/contacto':
          setActiveTab('contact');
          break;
        case '/admin':
          setActiveTab('admin');
          break;
        case '/politica-de-privacidad':
          setActiveTab('privacy');
          break;
        case '/politica-de-cookies':
          setActiveTab('cookies');
          break;
        case '/terminos-y-condiciones':
          setActiveTab('terms');
          break;
        case '/inicio':
        default:
          setActiveTab('home');
          break;
      }
    };

    window.addEventListener('popstate', parsePath);
    parsePath(); // Execute on mount to parse initial path

    return () => window.removeEventListener('popstate', parsePath);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', basename + path);
    window.dispatchEvent(new Event('popstate'));
  };

  // Dynamic Document Title and Meta tags for SEO July 2026
  useEffect(() => {
    let title = 'Latmedical | Hilos PDO V Lift Pro y Medicina Regenerativa Seffiline';
    let metaDesc = 'Distribuidor oficial exclusivo de Hilos PDO V Lift Pro y kits de medicina regenerativa Seffiline en Argentina. Habilitación ANMAT y cadena estéril.';

    if (selectedProduct) {
      title = `${selectedProduct.name} | Calibres y Venta Oficial - Latmedical`;
      metaDesc = `${selectedProduct.shortDesc} Adquiere online con soporte técnico y garantía de trazabilidad ANMAT.`;
    } else {
      switch (activeTab) {
        case 'about':
          title = 'Nosotros | Medicina de Precisión y Respaldo Europeo - Latmedical';
          metaDesc = 'Nuestra trayectoria y respaldo en medicina estética y rejuvenecimiento celular. Importaciones oficiales desde Europa en Argentina.';
          break;
        case 'hilos-pdo':
          title = 'Hilos PDO V Lift Pro | Distribuidor Oficial Argentina - Latmedical';
          metaDesc = 'Catálogo completo de hilos PDO V Lift Pro. Hilos Mono, Premium, Genesis, Cones, Nose, y Biocánulas de alta resistencia con agujas Painless.';
          break;
        case 'seffiline':
          title = 'Terapia Celular Seffiline | Distribuidor Oficial Argentina - Latmedical';
          metaDesc = 'Explora los kits de microinjerto de tejido adiposo autólogo Seffiline. Soluciones estandarizadas SEFFILLER®, SEFFIHAIR®, SEFFICARE® y SEFFIGYN®.';
          break;
        case 'products':
          title = 'Catálogo de Productos | Hilos PDO y Terapia Autóloga - Latmedical';
          metaDesc = 'Adquiere online Hilos PDO V Lift Pro y kits de recolección de tejido Seffiline (Seffiller, Seffihair, Sefficare, Seffigyn) con matrícula médica.';
          break;
        case 'clearance':
          title = '🔥 Outlet Médico B2B | Oportunidades por Caducidad Cercana - Latmedical';
          metaDesc = 'Descuentos del 20% al 60% en lotes especiales de Hilos PDO y kits con caducidad próxima. 100% esterilidad y trazabilidad de fábrica garantizada.';
          break;
        case 'roi':
          title = 'Calculadora de Rentabilidad (ROI) Médica | Simulador B2B - Latmedical';
          metaDesc = 'Simula tus ganancias mensuales por consultorio con Hilos PDO V-Lift Pro y kits Seffiline. Calcula costos de insumos, margen neto y retorno de inversión.';
          break;
        case 'quick-order':
          title = '⚡ Matriz de Pedido Rápido B2B | Pedidos Masivos por Calibre - Latmedical';
          metaDesc = 'Selecciona cantidades masivas de múltiples calibres de Hilos PDO V-Lift Pro y kits Seffiline en una sola vista unificada para clínicas y quirófanos.';
          break;
        case 'academia':
          title = 'Academia Médica & Workshops Hands-On 2026 | Latmedical';
          metaDesc = 'Capacitaciones con práctica en pacientes en vivo avaladas por Acadelift y Seffiline Academy. Masterclasses en Hilos Faciales y Terapia Celular.';
          break;
        case 'descargas':
          title = 'Centro de Descargas Médicas & Consentimientos Informados | Latmedical';
          metaDesc = 'Descarga modelos oficiales de consentimiento informado en PDF A4, habilitaciones ANMAT, certificados ISO 13485 y dossiers científicos.';
          break;
        case 'contact':
          title = 'Contacto y Asesoramiento Clínico | Latmedical';
          metaDesc = 'Comunícate con nuestros asesores comerciales para cotizaciones personalizadas de hilos PDO y kits Seffiline en Argentina.';
          break;
        case 'admin':
          title = 'Panel de Control del Inventario - Latmedical';
          break;
        case 'privacy':
          title = 'Política de Privacidad | Latmedical';
          metaDesc = 'Política de privacidad y protección de datos personales de Latmedical.';
          break;
        case 'cookies':
          title = 'Política de Cookies | Latmedical';
          metaDesc = 'Detalles sobre el uso de cookies y almacenamiento local de Latmedical.';
          break;
        case 'terms':
          title = 'Términos y Condiciones de Uso | Latmedical';
          metaDesc = 'Términos y condiciones legales para el uso del sitio web y la adquisición de productos médicos en Latmedical.';
          break;
        case 'home':
        default:
          title = 'Latmedical | Hilos PDO V Lift Pro y Medicina Regenerativa Seffiline';
          metaDesc = 'Distribuidor exclusivo en Argentina. Venta profesional de Hilos PDO V Lift Pro y kits Seffiline para medicina regenerativa con trazabilidad ANMAT.';
          break;
      }
    }

    document.title = title;
    
    // Update HTML meta description dynamically for search engine bots
    let metaDescriptionEl = document.querySelector('meta[name="description"]');
    if (!metaDescriptionEl) {
      metaDescriptionEl = document.createElement('meta');
      metaDescriptionEl.setAttribute('name', 'description');
      document.head.appendChild(metaDescriptionEl);
    }
    metaDescriptionEl.setAttribute('content', metaDesc);
  }, [activeTab, selectedProduct]);

  const toggleCart = () => setCartOpen(!cartOpen);

  const handleSetActiveTab = (tab: string) => {
    switch (tab) {
      case 'about':
        navigateTo('/nosotros');
        break;
      case 'hilos-pdo':
        navigateTo('/hilos-pdo');
        break;
      case 'seffiline':
        navigateTo('/seffiline');
        break;
      case 'products':
        navigateTo('/productos');
        break;
      case 'clearance':
        navigateTo('/oportunidades');
        break;
      case 'roi':
        navigateTo('/calculadora-roi');
        break;
      case 'quick-order':
        navigateTo('/pedido-rapido');
        break;
      case 'academia':
        navigateTo('/academia');
        break;
      case 'descargas':
        navigateTo('/descargas');
        break;
      case 'contact':
        navigateTo('/contacto');
        break;
      case 'admin':
        navigateTo('/admin');
        break;
      case 'privacy':
        navigateTo('/politica-de-privacidad');
        break;
      case 'cookies':
        navigateTo('/politica-de-cookies');
        break;
      case 'terms':
        navigateTo('/terminos-y-condiciones');
        break;
      case 'home':
      default:
        navigateTo('/inicio');
        break;
    }
  };

  const handleViewProduct = (product: Product) => {
    navigateTo(`/producto/${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch top 3 featured products for the home page preview
  const featuredProducts = products.filter(p => 
    p.id === 'vlift-mono' || p.id === 'vlift-genesis' || p.id === 'seffi-filler'
  );

  // Load total pending orders count directly from localStorage
  const getOrdersCount = () => {
    try {
      const savedOrders = localStorage.getItem('latmedical_orders');
      if (!savedOrders) return 0;
      const parsed = JSON.parse(savedOrders);
      return parsed.filter((o: any) => o.status === 'pending').length;
    } catch {
      return 0;
    }
  };

  const pendingOrdersCount = getOrdersCount();

  return (
    <InventoryProvider>
      <CartProvider>
        <CurrencyProvider>
          {/* WordPress style top admin bar */}
        {isAdminLoggedIn && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '32px',
            background: '#1d2327',
            color: '#c3c4c7',
            zIndex: 99999,
            fontSize: '13px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 1rem',
            boxSizing: 'border-box',
            borderBottom: '1px solid #2c3338'
          }} className="wp-admin-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span 
                onClick={() => handleSetActiveTab('admin')}
                style={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '15px' }}>🌐</span> Latmedical Console
              </span>
              <button 
                onClick={() => handleSetActiveTab('home')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.color = '#72aee6'}
                onMouseLeave={e => e.currentTarget.style.color = 'inherit'}
              >
                <span>🏠</span> Ver Sitio
              </button>
              <button 
                onClick={() => handleSetActiveTab('admin')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.color = '#72aee6'}
                onMouseLeave={e => e.currentTarget.style.color = 'inherit'}
              >
                <span>📦</span> WooCommerce B2B
                {pendingOrdersCount > 0 && (
                  <span style={{
                    background: '#d63638',
                    color: '#ffffff',
                    borderRadius: '10px',
                    padding: '0.05rem 0.35rem',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    marginLeft: '0.3rem'
                  }}>
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span style={{ fontSize: '12px' }}>
                👤 Hola, <strong>Administrador</strong>
              </span>
              <button 
                onClick={() => handleAdminLogin(false)}
                style={{ 
                  background: '#d63638', border: 'none', borderRadius: '3px', color: '#fff', 
                  cursor: 'pointer', fontSize: '11px', padding: '0.2rem 0.5rem', fontWeight: 'bold',
                  fontFamily: 'inherit', transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#b32124'}
                onMouseLeave={e => e.currentTarget.style.background = '#d63638'}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Global Navigation Header */}
          <Header 
            activeTab={activeTab} 
            setActiveTab={handleSetActiveTab} 
            toggleCart={toggleCart} 
            isAdminLoggedIn={isAdminLoggedIn}
          />

          {/* Dynamic Main Body Content */}
          <main style={{ flexGrow: 1, marginTop: isAdminLoggedIn ? '32px' : '0px' }}>
            {selectedProduct ? (
              /* Dedicated Product Detail Page */
              <ProductDetail 
                product={selectedProduct} 
                onBack={() => setSelectedProduct(null)} 
                onViewProduct={handleViewProduct}
              />
            ) : (
              /* Standard Tabs */
              <>
                {activeTab === 'hilos-pdo' && (
                  <div style={{ animation: 'fadeIn 0.5s ease', paddingTop: 'var(--header-height)' }}>
                    <HilosPDOPage
                      onContact={() => handleSetActiveTab('contact')}
                      onBack={() => handleSetActiveTab('products')}
                      onViewProduct={(productId) => {
                        const found = products.find(p => p.id === productId);
                        if (found) {
                          handleViewProduct(found);
                        } else {
                          handleSetActiveTab('contact');
                        }
                      }}
                    />
                  </div>
                )}

                {activeTab === 'seffiline' && (
                  <div style={{ animation: 'fadeIn 0.5s ease' }}>
                    <SeffilinePage
                      onContact={() => handleSetActiveTab('contact')}
                      onBack={() => handleSetActiveTab('products')}
                      onViewProduct={(productId) => {
                        const found = products.find(p => p.id === productId);
                        if (found) {
                          handleViewProduct(found);
                        } else {
                          handleSetActiveTab('contact');
                        }
                      }}
                    />
                  </div>
                )}

                {activeTab === 'home' && (
                  <div style={{ animation: 'fadeIn 0.5s ease' }}>
                    {/* Hero Slider */}
                    <Hero setActiveTab={handleSetActiveTab} />

                    {/* Medyglobal inspired 2-column technology section */}
                    <section 
                      id="tecnologia-latmedical"
                      style={{
                        background: '#03bfd7',
                        padding: '6rem 0',
                        overflow: 'hidden',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div className="container">
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr',
                          gap: '3rem',
                          alignItems: 'center'
                        }} className="tecnologia-grid">
                          
                          {/* Left Column: Symbol Logo with scroll zoom effect */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative'
                          }}>
                            <div style={{
                              width: '260px',
                              height: '260px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.15)',
                              backdropFilter: 'blur(8px)',
                              border: '2px solid rgba(255, 255, 255, 0.25)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                              transform: `scale(${logoScale})`,
                              transition: 'transform 0.1s ease-out'
                            }}>
                              <img 
                                src={getAssetUrl('/logo-symbol.png')} 
                                alt="Latmedical Isotipo" 
                                style={{
                                  width: '140px',
                                  height: 'auto',
                                  filter: 'brightness(0) invert(1) drop-shadow(0 8px 16px rgba(0,0,0,0.15))'
                                }}
                              />
                            </div>
                          </div>

                          {/* Right Column: Heading and 3 Subcards */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                              2 Líneas de Tratamiento
                            </span>
                            <h2 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.1rem)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3, marginBottom: '2.5rem' }}>
                              2 LÍNEAS DE PRODUCTOS COMBINADAS PARA EL REJUVENECIMIENTO FACIAL Y CORPORAL
                            </h2>

                            {/* 3 cards side-by-side inside the right column */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                              gap: '1rem',
                              width: '100%'
                            }} className="sub-cards-grid">
                              
                              {/* Card 1 */}
                              <div style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '16px',
                                padding: '1.75rem 1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                                transition: 'transform 0.3s ease'
                              }} className="treatment-card">
                                <div style={{ marginBottom: '1rem', height: '40px', display: 'flex', alignItems: 'center' }}>
                                  <Activity size={32} color="#535b6d" />
                                </div>
                                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#03bfd7', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                                  HILOS PDO<br/>VLIFT PRO
                                </h4>
                                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#535b6d', lineHeight: 1.3, flexGrow: 1, margin: '0 0 1rem 0' }}>
                                  Reposición<br/>de Tejidos
                                </p>
                                <button
                                  onClick={() => handleSetActiveTab('hilos-pdo')}
                                  className="sub-card-btn"
                                >
                                  V Lift Pro
                                </button>
                              </div>

                              {/* Card 2 */}
                              <div style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '16px',
                                padding: '1.75rem 1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                                transition: 'transform 0.3s ease'
                              }} className="treatment-card">
                                <div style={{ marginBottom: '1rem', height: '40px', display: 'flex', alignItems: 'center' }}>
                                  <Sparkles size={32} color="#535b6d" />
                                </div>
                                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#03bfd7', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                                  TERAPIA CELL<br/>SEFFILINE
                                </h4>
                                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#535b6d', lineHeight: 1.3, flexGrow: 1, margin: '0 0 1rem 0' }}>
                                  Estimulación<br/>de Colágeno
                                </p>
                                <button
                                  onClick={() => handleSetActiveTab('seffiline')}
                                  className="sub-card-btn"
                                >
                                  Seffiline
                                </button>
                              </div>

                              {/* Card 3 */}
                              <div style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '16px',
                                padding: '1.75rem 1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                                transition: 'transform 0.3s ease'
                              }} className="treatment-card">
                                <div style={{ marginBottom: '1rem', height: '40px', display: 'flex', alignItems: 'center' }}>
                                  <ShieldCheck size={32} color="#535b6d" />
                                </div>
                                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#03bfd7', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                                  GARANTÍA<br/>ANMAT
                                </h4>
                                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#535b6d', lineHeight: 1.3, flexGrow: 1, margin: '0 0 1rem 0' }}>
                                  Trazabilidad<br/>y Seguridad
                                </p>
                                <button
                                  onClick={() => handleSetActiveTab('contact')}
                                  className="sub-card-btn"
                                >
                                  Ver Más
                                </button>
                              </div>

                            </div>
                          </div>

                        </div>
                      </div>
                    </section>

                    {/* Medyglobal inspired "¿Qué ofrecemos?" section */}
                    <section style={{
                      background: 'var(--bg-white)',
                      padding: '6rem 0',
                      borderBottom: '1px solid var(--border-light)'
                    }}>
                      <div className="container">
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr',
                          gap: '4rem',
                          alignItems: 'center'
                        }} className="checklist-grid">
                          {/* Left side checklist */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <span className="badge badge-accent-green" style={{ alignSelf: 'flex-start' }}>¿Qué Ofrecemos?</span>
                            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2 }}>
                              Soluciones Clínicas No Quirúrgicas para tu Consultorio
                            </h2>
                            <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                              Brindamos a los especialistas las herramientas más seguras y avanzadas para tratamientos estéticos faciales y corporales de alto rendimiento:
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                              {/* Item 1 */}
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                  background: 'var(--accent-green-light)',
                                  borderRadius: '50%',
                                  padding: '0.35rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginTop: '0.2rem'
                                }}>
                                  <Check size={16} color="var(--accent-green)" strokeWidth={3} />
                                </div>
                                <div>
                                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>Resultados Naturales</h4>
                                  <p style={{ color: 'var(--text-medium)', fontSize: '0.88rem' }}>Terapias autólógenas y bioestimulantes que respetan la armonía y anatomía facial original.</p>
                                </div>
                              </div>

                              {/* Item 2 */}
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                  background: 'var(--accent-green-light)',
                                  borderRadius: '50%',
                                  padding: '0.35rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginTop: '0.2rem'
                                }}>
                                  <Check size={16} color="var(--accent-green)" strokeWidth={3} />
                                </div>
                                <div>
                                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>Procedimientos Ambulatorios</h4>
                                  <p style={{ color: 'var(--text-medium)', fontSize: '0.88rem' }}>Técnicas mínimamente invasivas realizadas en cabina, con anestesia local y rápida recuperación.</p>
                                </div>
                              </div>

                              {/* Item 3 */}
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                  background: 'var(--accent-green-light)',
                                  borderRadius: '50%',
                                  padding: '0.35rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginTop: '0.2rem'
                                }}>
                                  <Check size={16} color="var(--accent-green)" strokeWidth={3} />
                                </div>
                                <div>
                                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>Materiales Biocompatibles</h4>
                                  <p style={{ color: 'var(--text-medium)', fontSize: '0.88rem' }}>Dispositivos médicos reabsorbibles de polidioxanona y kits estériles para injerto autólogo sin riesgo de rechazo.</p>
                                </div>
                              </div>

                              {/* Item 4 */}
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                  background: 'var(--accent-green-light)',
                                  borderRadius: '50%',
                                  padding: '0.35rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginTop: '0.2rem'
                                }}>
                                  <Check size={16} color="var(--accent-green)" strokeWidth={3} />
                                </div>
                                <div>
                                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>Soporte Técnico y Formación</h4>
                                  <p style={{ color: 'var(--text-medium)', fontSize: '0.88rem' }}>Talleres de capacitación práctica y asesoramiento constante a cargo de especialistas calificados.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right side Image block */}
                          <div style={{
                            position: 'relative',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-lg)',
                            height: '450px'
                          }}>
                            <img
                              src={getAssetUrl('/distribucion_medica.png')}
                              alt="Distribución Médica de Europa Latmedical"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                            <div style={{
                              position: 'absolute',
                              bottom: '2rem',
                              left: '2rem',
                              right: '2rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(8px)',
                              padding: '1.5rem',
                              borderRadius: '12px',
                              boxShadow: 'var(--shadow-md)',
                              border: '1px solid rgba(255, 255, 255, 0.3)'
                            }}>
                              <h5 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>
                                Distribución Oficial Exclusiva
                              </h5>
                              <p style={{ color: 'var(--text-medium)', fontSize: '0.8rem', margin: 0 }}>
                                Importaciones directas de Europa con certificación ANMAT y estricto control de temperatura y cadena de custodia.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* B2B ROI & Quotation Simulator Teaser Banner */}
                    <section style={{
                      background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
                      padding: '5rem 0',
                      color: '#FFFFFF',
                      position: 'relative',
                      overflow: 'hidden',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '350px',
                        height: '350px',
                        background: 'radial-gradient(circle, rgba(41, 192, 147, 0.2) 0%, transparent 70%)',
                        pointerEvents: 'none'
                      }} />

                      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '3rem',
                          alignItems: 'center'
                        }}>
                          <div>
                            <span className="badge badge-accent-green" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Sparkles size={13} /> Área Exclusiva Profesionales Médicos
                            </span>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.25, margin: '0 0 1rem 0' }}>
                              Calcula la Rentabilidad de tus Procedimientos Médicos
                            </h2>
                            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: '0 0 1.75rem 0' }}>
                              Utiliza nuestro simulador financiero para estimar tu retorno de inversión (ROI), margen neto por paciente y proyección mensual al incorporar <strong>Hilos PDO V-Lift Pro</strong> y kits de medicina regenerativa <strong>Seffiline</strong>.
                            </p>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => handleSetActiveTab('roi')}
                                className="btn-primary"
                                style={{
                                  padding: '0.85rem 1.75rem',
                                  fontSize: '0.9rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}
                              >
                                Abrir Calculadora ROI <ChevronRight size={18} />
                              </button>

                              <button
                                onClick={() => {
                                  handleSetActiveTab('products');
                                  setCartOpen(true);
                                }}
                                style={{
                                  padding: '0.85rem 1.5rem',
                                  fontSize: '0.9rem',
                                  fontWeight: 600,
                                  borderRadius: '6px',
                                  border: '1px solid rgba(255,255,255,0.25)',
                                  background: 'rgba(255,255,255,0.08)',
                                  color: '#FFFFFF',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                              >
                                Emitir Presupuesto Formal
                              </button>
                            </div>
                          </div>

                          {/* Interactive Preview Card */}
                          <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '16px',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-green)', textTransform: 'uppercase' }}>
                                Ejemplo de Rendimiento Clínico
                              </span>
                              <span style={{ fontSize: '0.75rem', background: 'rgba(41, 192, 147, 0.2)', color: '#38EF7D', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>
                                70% Margen Promedio
                              </span>
                            </div>

                            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                              Lifting Facial Vectorial con Hilos Cones + Genesis
                            </h4>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px' }}>
                              <div>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Honorario Sugerido:</span>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF' }}>USD $750</div>
                              </div>
                              <div>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Ganancia Neta / Pac.:</span>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38EF7D' }}>USD $420</div>
                              </div>
                            </div>

                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>
                              Con solo <strong>6 pacientes al mes</strong>, tu consultorio genera una utilidad neta estimada de <strong>USD $2,520 / mes</strong> (USD $30,240 anuales).
                            </p>

                            <button
                              onClick={() => handleSetActiveTab('roi')}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--accent-green)',
                                background: 'transparent',
                                color: 'var(--accent-green)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={e => {
                                e.currentTarget.style.background = 'var(--accent-green)';
                                e.currentTarget.style.color = '#FFFFFF';
                              }}
                              onMouseOut={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--accent-green)';
                              }}
                            >
                              Simular con tus propios valores →
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Hilos V Lift PRO CONES Video Section */}
                    <section 
                      id="vlift-cones-video-section"
                      style={{
                        position: 'relative',
                        height: '550px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        textAlign: 'center',
                      }}
                    >
                      {/* Looping background video */}
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          zIndex: 0
                        }}
                      >
                        <source src={getAssetUrl('/vlift-cones-video.mp4')} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>

                      {/* Diagonal scanline texture overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundImage: `url("${getAssetUrl('/vlift-texture.png')}")`,
                          backgroundRepeat: 'repeat',
                          zIndex: 1,
                        }}
                      />

                      {/* Dark overlay mask to increase text legibility */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(rgba(17, 24, 39, 0.45) 0%, rgba(17, 24, 39, 0.65) 100%)',
                          zIndex: 2,
                        }}
                      />

                      {/* Content Container */}
                      <div 
                        className="container"
                        style={{
                          position: 'relative',
                          zIndex: 3,
                          maxWidth: '800px',
                          padding: '0 1.5rem',
                        }}
                      >
                        <p style={{
                          fontFamily: "'Montserrat', 'Helvetica', 'Arial', sans-serif",
                          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                          fontWeight: 500,
                          letterSpacing: '0.05em',
                          marginBottom: '0.75rem',
                          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                        }}>
                          Descubre los nuevos Hilos V Lift PRO
                        </p>
                        
                        <h2 style={{
                          fontFamily: "'Montserrat', 'Helvetica', 'Arial', sans-serif",
                          fontSize: 'clamp(3.5rem, 8vw, 6rem)',
                          fontWeight: 900,
                          color: '#ed6f81',
                          letterSpacing: '0.15em',
                          lineHeight: 1.1,
                          margin: '0.5rem 0 1.5rem 0',
                          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                          display: 'inline-block',
                          animation: 'pulse 3s infinite alternate'
                        }}>
                          CONES
                        </h2>
                        
                        <p style={{
                          fontFamily: "'Montserrat', 'Helvetica', 'Arial', sans-serif",
                          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                          fontWeight: 500,
                          lineHeight: 1.6,
                          marginBottom: '2rem',
                          textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                        }}>
                          Espículas en forma de conos bidireccionales.<br />
                          <span style={{ fontWeight: 700 }}>Mayor tracción. Mayor fuerza.</span>
                        </p>
                        
                        <div>
                          <button
                            onClick={() => {
                              handleSetActiveTab('hilos-pdo');
                              setTimeout(() => {
                                const el = document.getElementById('cones');
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }, 150);
                            }}
                            className="btn-primary"
                            style={{
                              background: '#ed6f81',
                              borderColor: '#ed6f81',
                              color: '#ffffff',
                              padding: '0.85rem 2.2rem',
                              fontSize: '0.88rem',
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              boxShadow: '0 10px 20px rgba(237, 111, 129, 0.3)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={e => {
                              e.currentTarget.style.background = '#ffffff';
                              e.currentTarget.style.color = '#ed6f81';
                              e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 255, 255, 0.4)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.background = '#ed6f81';
                              e.currentTarget.style.color = '#ffffff';
                              e.currentTarget.style.boxShadow = '0 10px 20px rgba(237, 111, 129, 0.3)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            Más información
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* Curated Catalog Preview */}
                    <section style={{ padding: '6rem 0', background: 'var(--bg-light)' }}>
                      <div className="container">
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                          marginBottom: '3rem',
                          flexWrap: 'wrap',
                          gap: '1rem'
                        }}>
                          <div>
                            <span className="badge badge-accent-green" style={{ marginBottom: '0.75rem' }}>Destacados del Catálogo</span>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Productos Más Vendidos</h2>
                          </div>
                          <button
                            onClick={() => handleSetActiveTab('products')}
                            className="btn-primary"
                            style={{ fontSize: '0.85rem' }}
                          >
                            Ver Catálogo Completo <ChevronRight size={16} />
                          </button>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))',
                          gap: '2rem'
                        }}>
                          {featuredProducts.map(product => (
                            <ProductCard 
                              key={product.id} 
                              product={product} 
                              onViewDetails={handleViewProduct} 
                            />
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* Outlet / Clearance Spotlight Banner */}
                    <section style={{
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #7c2d12 100%)',
                      color: '#ffffff',
                      padding: '4rem 0',
                      position: 'relative',
                      overflow: 'hidden',
                      borderTop: '1px solid rgba(251, 146, 60, 0.2)',
                      borderBottom: '1px solid rgba(251, 146, 60, 0.2)'
                    }}>
                      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '2rem',
                          background: 'rgba(255, 255, 255, 0.04)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(251, 146, 60, 0.3)',
                          borderRadius: '16px',
                          padding: 'clamp(1.5rem, 4vw, 2.5rem)'
                        }}>
                          <div style={{ maxWidth: '640px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.25rem 0.75rem', borderRadius: '20px', marginBottom: '0.85rem' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#fca5a5' }}>
                                🔥 OUTLET MÉDICO B2B • STOCK LIMITADO
                              </span>
                            </div>
                            <h3 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.85rem)', fontWeight: 800, margin: '0 0 0.6rem 0', lineHeight: 1.25, color: '#ffffff' }}>
                              Lotes con Descuento por <span style={{ color: '#fb923c' }}>Vencimiento Próximo</span>
                            </h3>
                            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                              Insumos estéticos originales con <strong>100% de esterilidad certificada</strong> y trazabilidad de lote declarada. Precios mayoristas especiales de liquidación para profesionales médicos.
                            </p>
                          </div>

                          <div>
                            <button
                              onClick={() => handleSetActiveTab('clearance')}
                              style={{
                                background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.85rem 1.8rem',
                                fontSize: '0.88rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 8px 20px rgba(234, 88, 12, 0.35)',
                                transition: 'all 0.25s',
                                fontFamily: 'inherit'
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 25px rgba(234, 88, 12, 0.5)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(234, 88, 12, 0.35)';
                              }}
                            >
                              Ver Lotes en Oferta <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* B2B Credential Notice Banner */}
                    <section style={{
                      background: 'var(--primary-dark)',
                      color: 'var(--text-white)',
                      padding: '5rem 0',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div className="container" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 2,
                        maxWidth: '800px'
                      }}>
                        <Award size={36} color="var(--accent-green)" style={{ marginBottom: '1.5rem' }} />
                        <h2 style={{ color: 'var(--text-white)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                          ¿Eres profesional médico matriculado?
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                          Ingresa tus credenciales y obtén precios de distribuidor con despacho inmediato. Habilitación ANMAT y cadena estéril asegurada.
                        </p>
                        <button
                          onClick={() => handleSetActiveTab('products')}
                          className="btn-primary"
                          style={{ padding: '0.8rem 2.5rem' }}
                        >
                          Comprar Productos
                        </button>
                      </div>
                    </section>

                    {/* DUAL SHOWCASE: Academia & Descargas Médicas */}
                    <section style={{ padding: '5rem 0', background: '#F8FAFC', borderBottom: '1px solid var(--border-light)' }}>
                      <div className="container">
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                          gap: '2rem'
                        }}>
                          {/* Card 1: Academia & Workshops */}
                          <div style={{
                            background: '#FFFFFF',
                            borderRadius: '16px',
                            border: '1px solid var(--border-light)',
                            padding: '2.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: 'var(--shadow-sm)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              width: '120px',
                              height: '120px',
                              background: 'radial-gradient(circle at top right, rgba(41, 192, 147, 0.15) 0%, transparent 70%)',
                              pointerEvents: 'none'
                            }} />
                            <div>
                              <span className="badge badge-accent-green" style={{ marginBottom: '0.75rem' }}>
                                🎓 Práctica Hands-On en Pacientes
                              </span>
                              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 0.75rem 0' }}>
                                Academia Médica & Workshops 2026
                              </h3>
                              <p style={{ fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                                Domina las técnicas de tracción con cánula L, vectores de anclaje fascial y microinjerto de tejido autólogo SEFFI en grupos reducidos con certificación universitaria y aval internacional.
                              </p>
                            </div>
                            <button
                              onClick={() => handleSetActiveTab('academia')}
                              className="btn-primary"
                              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                            >
                              Ver Calendario & Reservar Cupo →
                            </button>
                          </div>

                          {/* Card 2: Descargas & Consentimientos */}
                          <div style={{
                            background: '#FFFFFF',
                            borderRadius: '16px',
                            border: '1px solid var(--border-light)',
                            padding: '2.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: 'var(--shadow-sm)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              width: '120px',
                              height: '120px',
                              background: 'radial-gradient(circle at top right, rgba(45, 156, 218, 0.15) 0%, transparent 70%)',
                              pointerEvents: 'none'
                            }} />
                            <div>
                              <span className="badge badge-accent-blue" style={{ marginBottom: '0.75rem' }}>
                                📄 Respaldo Legal & ANMAT
                              </span>
                              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 0.75rem 0' }}>
                                Centro de Descargas & Consentimientos
                              </h3>
                              <p style={{ fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                                Accede a modelos de consentimiento informado médico-legal en PDF listos para imprimir en A4, habilitaciones ANMAT, certificados ISO 13485 y dossiers científicos histológicos.
                              </p>
                            </div>
                            <button
                              onClick={() => handleSetActiveTab('descargas')}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                border: '1px solid var(--accent-blue)',
                                background: 'rgba(45, 156, 218, 0.1)',
                                color: '#1E40AF',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              Explorar Documentación & Descargas →
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Apúntate a nuestros cursos Form Section */}
                    <section
                      id="cursos-form-section"
                      style={{
                        position: 'relative',
                        padding: '6.5rem 0',
                        backgroundImage: 'url("/fondo-cursos.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'scroll',
                        color: '#ffffff',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Teal-emerald overlay gradient to match the screenshot and site aesthetic */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, rgba(3, 191, 215, 0.88) 0%, rgba(41, 192, 147, 0.88) 100%)',
                          zIndex: 1
                        }}
                      />

                      <div 
                        className="container"
                        style={{
                          position: 'relative',
                          zIndex: 2,
                          maxWidth: '650px',
                          textAlign: 'center',
                          padding: '0 1.5rem',
                          margin: '0 auto'
                        }}
                      >
                        <h2 style={{
                          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                          fontWeight: 700,
                          marginBottom: '0.75rem',
                          fontFamily: "'Montserrat', sans-serif",
                          color: '#ffffff'
                        }}>
                          Apúntate a nuestros cursos
                        </h2>
                        
                        <p style={{
                          fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                          fontWeight: 400,
                          opacity: 0.95,
                          marginBottom: '3rem',
                          lineHeight: 1.5
                        }}>
                          Plan de formación, déjanos tu correo y haz click para más info.
                        </p>

                        {/* Glassmorphic Form Container */}
                        <form 
                          onSubmit={handleCourseSubmit}
                          noValidate
                          style={{
                            background: '#ffffff',
                            borderRadius: '24px',
                            padding: '3rem 2.5rem',
                            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            textAlign: 'left',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            color: '#1e293b'
                          }}
                        >
                          {/* Name Input */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label htmlFor="courseName" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.1rem' }}>
                              Nombre Completo *
                            </label>
                            <input
                              type="text"
                              id="courseName"
                              placeholder="Tu nombre completo"
                              value={courseName}
                              onChange={e => {
                                setCourseName(e.target.value);
                                if (courseFormErrors.name) {
                                  setCourseFormErrors(prev => ({ ...prev, name: '' }));
                                }
                              }}
                              style={{
                                width: '100%',
                                padding: '0.85rem 1.25rem',
                                borderRadius: '10px',
                                border: `1.5px solid ${courseFormErrors.name ? '#ef4444' : '#cbd5e1'}`,
                                background: '#f8fafc',
                                color: '#0f172a',
                                fontSize: '0.9rem',
                                fontFamily: 'inherit',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                              }}
                              className="course-input"
                            />
                            {courseFormErrors.name && (
                              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                                {courseFormErrors.name}
                              </span>
                            )}
                          </div>

                          {/* Country Input */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label htmlFor="courseCountry" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.1rem' }}>
                              País *
                            </label>
                            <input
                              type="text"
                              id="courseCountry"
                              placeholder="País de residencia"
                              value={courseCountry}
                              onChange={e => {
                                setCourseCountry(e.target.value);
                                if (courseFormErrors.country) {
                                  setCourseFormErrors(prev => ({ ...prev, country: '' }));
                                }
                              }}
                              style={{
                                width: '100%',
                                padding: '0.85rem 1.25rem',
                                borderRadius: '10px',
                                border: `1.5px solid ${courseFormErrors.country ? '#ef4444' : '#cbd5e1'}`,
                                background: '#f8fafc',
                                color: '#0f172a',
                                fontSize: '0.9rem',
                                fontFamily: 'inherit',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                              }}
                              className="course-input"
                            />
                            {courseFormErrors.country && (
                              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                                {courseFormErrors.country}
                              </span>
                            )}
                          </div>

                          {/* Phone Input */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label htmlFor="coursePhone" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.1rem' }}>
                              Teléfono *
                            </label>
                            <input
                              type="tel"
                              id="coursePhone"
                              placeholder="Ej: +54 9 11 1234 5678"
                              value={coursePhone}
                              onChange={e => {
                                setCoursePhone(e.target.value);
                                if (courseFormErrors.phone) {
                                  setCourseFormErrors(prev => ({ ...prev, phone: '' }));
                                }
                              }}
                              style={{
                                width: '100%',
                                padding: '0.85rem 1.25rem',
                                borderRadius: '10px',
                                border: `1.5px solid ${courseFormErrors.phone ? '#ef4444' : '#cbd5e1'}`,
                                background: '#f8fafc',
                                color: '#0f172a',
                                fontSize: '0.9rem',
                                fontFamily: 'inherit',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                              }}
                              className="course-input"
                            />
                            {courseFormErrors.phone && (
                              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                                {courseFormErrors.phone}
                              </span>
                            )}
                          </div>

                          {/* Email Input */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label htmlFor="courseEmail" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.1rem' }}>
                              Correo Electrónico *
                            </label>
                            <input
                              type="email"
                              id="courseEmail"
                              placeholder="nombre@ejemplo.com"
                              value={courseEmail}
                              onChange={e => {
                                setCourseEmail(e.target.value);
                                if (courseFormErrors.email) {
                                  setCourseFormErrors(prev => ({ ...prev, email: '' }));
                                }
                              }}
                              style={{
                                width: '100%',
                                padding: '0.85rem 1.25rem',
                                borderRadius: '10px',
                                border: `1.5px solid ${courseFormErrors.email ? '#ef4444' : '#cbd5e1'}`,
                                background: '#f8fafc',
                                color: '#0f172a',
                                fontSize: '0.9rem',
                                fontFamily: 'inherit',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                              }}
                              className="course-input"
                            />
                            {courseFormErrors.email && (
                              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                                {courseFormErrors.email}
                              </span>
                            )}
                          </div>

                          {/* Policy Checkbox */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.5rem' }}>
                            <label 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.65rem', 
                                fontSize: '0.85rem', 
                                fontWeight: 500,
                                color: '#475569',
                                cursor: 'pointer',
                                userSelect: 'none'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={coursePolicy}
                                onChange={e => {
                                  setCoursePolicy(e.target.checked);
                                  if (courseFormErrors.policy) {
                                    setCourseFormErrors(prev => ({ ...prev, policy: '' }));
                                  }
                                }}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  cursor: 'pointer',
                                  accentColor: '#03bfd7',
                                }}
                              />
                              <span>Acepto la política de privacidad y datos.</span>
                            </label>
                            {courseFormErrors.policy && (
                              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, marginLeft: '1.75rem' }}>
                                {courseFormErrors.policy}
                              </span>
                            )}
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            style={{
                              background: '#EC6255',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '1rem',
                              fontSize: '0.95rem',
                              fontWeight: 800,
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                              marginTop: '0.75rem',
                              boxShadow: '0 8px 16px rgba(236, 98, 85, 0.25)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={e => {
                              e.currentTarget.style.background = '#e55345';
                              e.currentTarget.style.boxShadow = '0 10px 20px rgba(229, 83, 69, 0.4)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.background = '#EC6255';
                              e.currentTarget.style.boxShadow = '0 8px 16px rgba(236, 98, 85, 0.25)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            ENVIAR
                          </button>
                        </form>
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === 'about' && <About />}
                {activeTab === 'products' && (
                  <Catalog onViewDetails={handleViewProduct} />
                )}
                {activeTab === 'clearance' && (
                  <ClearancePage 
                    onBackToCatalog={() => handleSetActiveTab('products')} 
                    onViewProduct={handleViewProduct} 
                  />
                )}
                {activeTab === 'roi' && (
                  <RoiCalculator 
                    onNavigateToCatalog={() => handleSetActiveTab('products')} 
                    onContact={() => handleSetActiveTab('contact')}
                    onBack={() => handleSetActiveTab('home')}
                  />
                )}
                {activeTab === 'quick-order' && (
                  <QuickOrderPad 
                    onSelectProduct={handleViewProduct} 
                    onBackToCatalog={() => handleSetActiveTab('products')}
                  />
                )}
                {activeTab === 'academia' && (
                  <MedicalAcademy 
                    onBack={() => handleSetActiveTab('home')} 
                    onContact={() => handleSetActiveTab('contact')} 
                  />
                )}
                {activeTab === 'descargas' && (
                  <MedicalDownloads 
                    onBack={() => handleSetActiveTab('home')} 
                    onContact={() => handleSetActiveTab('contact')} 
                  />
                )}
                {activeTab === 'contact' && <Contact />}
                 {activeTab === 'admin' && (
                   <AdminPanel 
                     isAdminLoggedIn={isAdminLoggedIn} 
                     onAdminLoginChange={handleAdminLogin} 
                   />
                 )}
                 {activeTab === 'privacy' && <PrivacyPolicy />}
                 {activeTab === 'cookies' && <CookiePolicy />}
                 {activeTab === 'terms' && <TermsConditions />}
              </>
            )}
          </main>

          {/* Global Footer */}
          <Footer setActiveTab={handleSetActiveTab} />

          {/* Sliding Cart Drawer overlay */}
          <Cart isOpen={cartOpen} toggleCart={toggleCart} />

          {/* Course Submission Success Dialog */}
          {courseFormSubmitted && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.3s ease'
            }}>
              <div style={{
                background: '#ffffff',
                color: '#1a1a1a',
                padding: '3rem 2rem',
                borderRadius: '24px',
                maxWidth: '450px',
                width: '90%',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255,255,255,0.8)',
                animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#29c093',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 8px 20px rgba(41, 192, 147, 0.3)'
                }}>
                  <Check size={40} color="#ffffff" strokeWidth={3} />
                </div>
                <h3 style={{
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  color: '#111827'
                }}>
                  ¡Inscripción Exitosa!
                </h3>
                <p style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  color: '#4b5563',
                  marginBottom: '1.5rem'
                }}>
                  Gracias por tu interés, <strong style={{ color: '#03bfd7' }}>{courseName}</strong>. Hemos recibido tu solicitud desde <strong>{courseCountry}</strong>.
                </p>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#9ca3af',
                  margin: 0
                }}>
                  Te enviaremos el plan de formación por correo a la brevedad.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Floating WhatsApp Button Container */}
        <div className="whatsapp-container">
          {/* Tooltip Message */}
          <div className="whatsapp-tooltip">
            ¿Tienes dudas? ¡Escríbenos!
          </div>

          {/* Floating WhatsApp Button */}
          <a
            href="https://wa.me/5491154577210?text=Hola%20Latmedical%2C%20deseo%20realizar%20una%20consulta%20comercial%20B2B."
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button"
            title="Contactar Asesor WhatsApp"
            onClick={() => {
              (window as any).gtag?.('event', 'click_whatsapp_floating', {
                'event_category': 'Contact',
                'event_label': 'Floating Button'
              });
            }}
          >
            <svg 
              viewBox="0 0 24 24" 
              width="32" 
              height="32" 
              fill="#FFFFFF"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.747 1.451 5.436.002 9.861-4.422 9.864-9.865.003-2.637-1.022-5.116-2.887-6.983-1.866-1.868-4.349-2.897-6.989-2.899-5.443 0-9.87 4.423-9.873 9.867-.001 1.704.455 3.364 1.322 4.825L1.888 22.09l4.759-1.936zM17.487 14.39c-.3-.15-1.782-.88-2.057-.98-.275-.1-.475-.15-.675.15-.2.3-.775.98-.95 1.18-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.49-1.127-1.006-1.888-2.25-2.11-2.625-.222-.375-.025-.578.125-.727.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525C9.444 8.71 8.8 7.15 8.525 6.49c-.268-.646-.54-.558-.75-.569-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8 1.075-.275 1.08-.75 2.1-.825 2.25-.075.15-.15.3.35.775 2.5 2.375 5.25 2.3 5.75 2.3.5 0 .825-.325 1.075-.625.25-.3.725-.975.8-1.075.075-.1.15-.3.45-.15z" />
            </svg>
          </a>
        </div>

        <style>{`
          @media (min-width: 992px) {
            .dual-brands-grid {
              grid-template-columns: 1fr 1fr !important;
              gap: 6rem !important;
            }
            .checklist-grid {
              grid-template-columns: 1.2fr 1fr !important;
              gap: 5rem !important;
            }
            .tecnologia-grid {
              grid-template-columns: 1fr 1.3fr !important;
              gap: 5rem !important;
            }
          }
          .treatment-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12) !important;
          }
          .sub-card-btn {
            background: #535b6d;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            padding: 0.45rem 0.8rem;
            font-size: 0.72rem;
            font-weight: 600;
            width: 100%;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .sub-card-btn:hover {
            background: #03bfd7;
          }
          .course-input::placeholder {
            color: #94a3b8;
            opacity: 1;
          }
          .course-input:focus {
            background: #ffffff !important;
            border-color: #03bfd7 !important;
            box-shadow: 0 0 0 4px rgba(3, 191, 215, 0.12) !important;
          }

          /* Floating WhatsApp styles */
          .whatsapp-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            display: flex;
            align-items: center;
            z-index: 9999;
          }
          .whatsapp-tooltip {
            background: #ffffff;
            color: #1e293b;
            padding: 12px 20px;
            border-radius: 14px;
            font-size: 0.95rem;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04);
            margin-right: 16px;
            opacity: 0;
            visibility: hidden;
            transform: translateX(15px) scale(0.95);
            transition: opacity 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                        transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                        visibility 0.35s;
            position: relative;
            pointer-events: none;
          }
          .whatsapp-tooltip::after {
            content: '';
            position: absolute;
            top: 50%;
            right: -6px;
            transform: translateY(-50%) rotate(45deg);
            width: 12px;
            height: 12px;
            background: #ffffff;
            box-shadow: 3px -3px 6px rgba(0, 0, 0, 0.02);
          }
          .whatsapp-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #25D366;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 24px rgba(37, 211, 102, 0.3), 0 0 0 6px rgba(37, 211, 102, 0.15);
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                        box-shadow 0.3s ease;
            text-decoration: none;
          }
          .whatsapp-container:hover .whatsapp-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateX(0) scale(1);
          }
          .whatsapp-container:hover .whatsapp-button {
            transform: scale(1.12) rotate(5deg);
            box-shadow: 0 12px 28px rgba(37, 211, 102, 0.45), 0 0 0 8px rgba(37, 211, 102, 0.2);
          }
        `}</style>
        </CurrencyProvider>
      </CartProvider>
    </InventoryProvider>
  );
};

export default App;
