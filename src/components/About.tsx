import React from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  Target, 
  Compass, 
  BookOpen, 
  Microscope, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  HeartHandshake, 
  Stethoscope, 
  Scale, 
  Building2,
  Globe
} from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

export const About: React.FC = () => {
  const milestones = [
    {
      year: '2024',
      title: 'Fundación Corporativa',
      desc: 'Constitución de Latmedical International SRL por Cirujanos Plásticos y Médicos Estéticos en Buenos Aires.'
    },
    {
      year: '2025',
      title: 'Registros ANMAT & Primeras Importaciones',
      desc: 'Obtención de habilitaciones ANMAT, dictado de cursos pre-registro y arribo de las primeras importaciones oficiales europeas.'
    },
    {
      year: '2026',
      title: 'Consolidación & Red Federal',
      desc: 'Despliegue de la red de subdistribuidores nacional, programa integral de masterclasses y participación en congresos médicos.'
    },
    {
      year: '2027',
      title: 'Nuevas Líneas & Liderazgo',
      desc: 'Incorporación de nuevas tecnologías de medicina regenerativa, ampliación de registros ANMAT y escalamiento comercial.'
    }
  ];

  const team = [
    {
      name: 'Dr. Aldo Álvarez',
      role: 'Chief Executive Officer (CEO)',
      desc: 'Liderazgo corporativo estratégico y visión integral de la distribución médica en Argentina.',
      badge: 'Dirección General'
    },
    {
      name: 'Dra. Vicenta Llorca',
      role: 'Scientific Advisor',
      desc: 'Supervisión de protocolos clínicos y respaldo científico de las tecnologías médicas.',
      badge: 'Asesora Científica'
    },
    {
      name: 'Cintia Maglieri',
      role: 'Commercial Director',
      desc: 'Gestión y relacionamiento comercial con clínicas, profesionales e instituciones del país.',
      badge: 'Dirección Comercial'
    },
    {
      name: 'Dr. Julio Ferreira',
      role: 'Trainer',
      desc: 'Dictado de programas de entrenamiento técnico, talleres Hands-On y demostraciones en vivo.',
      badge: 'Capacitador Clínico'
    },
    {
      name: 'Juan Catarino',
      role: 'Legal Advisor',
      desc: 'Garantía de cumplimiento normativo, trazabilidad y asesoramiento legal regulatorio.',
      badge: 'Asesor Legal'
    }
  ];

  const coreValues = [
    {
      icon: <Stethoscope size={22} color="var(--accent-green)" />,
      title: 'Liderazgo Médico',
      desc: 'Fundada y dirigida por médicos, combinando la formación clínica de élite con el conocimiento profundo de cada producto.'
    },
    {
      icon: <HeartHandshake size={22} color="var(--accent-blue)" />,
      title: 'Experiencia Clínica Real',
      desc: 'Nuestras decisiones son impulsadas por médicos en ejercicio y fundadas en la práctica asistencial y quirúrgica diaria.'
    },
    {
      icon: <Microscope size={22} color="var(--accent-green)" />,
      title: 'Excelencia Científica',
      desc: 'La medicina basada en la evidencia es el cimiento insustituible de cada producto y programa educativo que ofrecemos.'
    },
    {
      icon: <GraduationCap size={22} color="var(--accent-blue)" />,
      title: 'Educación Continua',
      desc: 'El desarrollo profesional permanente es fundamental para mejorar los resultados clínicos y la seguridad del paciente.'
    },
    {
      icon: <ShieldCheck size={22} color="var(--accent-green)" />,
      title: 'Calidad & Trazabilidad',
      desc: 'Trabajamos exclusivamente con insumos médicos que cumplen los más altos estándares internacionales y registros ANMAT.'
    },
    {
      icon: <Scale size={22} color="var(--accent-blue)" />,
      title: 'Integridad & Ética',
      desc: 'Conducta ética, absoluta transparencia y relaciones de confianza a largo plazo definen nuestro modo de trabajar.'
    }
  ];

  const educationPillars = [
    'Congresos Médicos Oficiales',
    'Workshops Prácticos Hands-On',
    'Cursos de Disecación en Cadáveres',
    'Mesas Redondas de Expertos',
    'Discusión de Casos Clínicos',
    'Demostraciones en Vivo',
    'Masterclasses Internacionales',
    'Actividades de Posgrado Académico'
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      
      {/* 1. HERO HEADER BANNER */}
      <section style={{
        position: 'relative',
        height: '38vh',
        minHeight: '300px',
        marginTop: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--primary-dark)',
        overflow: 'hidden'
      }}>
        {/* Background texture & mesh gradient */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: `url("${getAssetUrl('/2020/2025/04/parallax-gris.png')}")`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.15, zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(41, 192, 147, 0.25) 100%)',
          zIndex: 2
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 3, color: '#FFFFFF' }}>
          <span className="badge badge-accent-green" style={{ marginBottom: '0.75rem' }}>
            Empresa Liderada por Médicos
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
            Sobre Latmedical International
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', marginTop: '0.75rem', maxWidth: '680px', lineHeight: 1.6 }}>
            Especialistas en la distribución, educación y promoción de tecnología médica, hilos tensores PDO y medicina regenerativa en Argentina.
          </p>
        </div>
      </section>

      {/* 2. CORPORATE INTRODUCTION SECTION */}
      <section className="section-padding" style={{ background: 'var(--bg-white)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '4rem',
            alignItems: 'center'
          }} className="about-grid-marenostrum">
            
            {/* Left Image Box */}
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-light)',
              height: '380px'
            }}>
              <img 
                src={getAssetUrl('/2020/2025/04/intro-1.png')} 
                alt="Latmedical Medicina Estética" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '1.5rem',
                right: '1.5rem',
                background: 'rgba(17, 24, 39, 0.88)',
                backdropFilter: 'blur(8px)',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#FFFFFF'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  <Building2 size={14} /> Latmedical International SRL
                </div>
                <p style={{ fontSize: '0.85rem', margin: 0, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                  Fundada en Buenos Aires por Cirujanos Plásticos y Médicos Estéticos para respaldar la excelencia asistencial.
                </p>
              </div>
            </div>

            {/* Right Content */}
            <div>
              <span className="badge badge-accent-green" style={{ marginBottom: '1rem' }}>Perspectiva Médica Real</span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '1.25rem', lineHeight: 1.25 }}>
                Creados por Médicos para <span className="text-gradient-accent">Potenciar a Médicos</span>
              </h2>
              <p style={{ color: 'var(--text-medium)', marginBottom: '1rem', lineHeight: 1.65, fontSize: '0.95rem' }}>
                <strong>Latmedical International Argentina</strong> fue creada en 2024 por Cirujanos Plásticos y Médicos Estéticos con un propósito claro: apoyar a los profesionales de la salud argentinos con productos médicos innovadores, evidencia científica sólida y un servicio de atención médica de excelencia.
              </p>
              <p style={{ color: 'var(--text-medium)', marginBottom: '1.5rem', lineHeight: 1.65, fontSize: '0.95rem' }}>
                Nuestra formación clínica nos permite comprender las necesidades de los profesionales de la salud desde su misma perspectiva asistencial, garantizando que cada producto comercializado y cada actividad educativa contribuya directamente a <strong>procedimientos más seguros y mejores resultados clínicos para los pacientes</strong>.
              </p>

              {/* Key Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                <div style={{ background: 'var(--bg-light)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-green)' }}>2024</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', fontWeight: 600 }}>Fundación en CABA</div>
                </div>
                <div style={{ background: 'var(--bg-light)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-blue)' }}>ANMAT</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', fontWeight: 600 }}>Trazabilidad Oficial</div>
                </div>
                <div style={{ background: 'var(--bg-light)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-green)' }}>100%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', fontWeight: 600 }}>Cobertura Nacional</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION DUAL CARDS */}
      <section className="section-padding" style={{ background: 'var(--bg-light)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem'
          }}>
            {/* Mission Card */}
            <div style={{
              background: 'var(--bg-white)',
              border: '1px solid var(--border-light)',
              borderRadius: '16px',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '120px', height: '120px',
                background: 'radial-gradient(circle, rgba(41, 192, 147, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
              <div style={{
                width: '50px', height: '50px', borderRadius: '12px',
                background: 'rgba(41, 192, 147, 0.12)', color: 'var(--accent-green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
              }}>
                <Target size={24} />
              </div>
              <span className="badge badge-accent-green" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>Propósito Fundamental</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Nuestra Misión</h3>
              <p style={{ color: 'var(--text-medium)', lineHeight: 1.65, fontSize: '0.92rem', margin: 0 }}>
                Proveer a los médicos de Argentina soluciones médicas innovadoras respaldadas por evidencia científica sólida, educación continua permanente y un servicio profesional personalizado. Estamos comprometidos con elevar el cuidado del paciente empoderando a los profesionales de la salud con los más altos estándares de calidad.
              </p>
            </div>

            {/* Vision Card */}
            <div style={{
              background: 'var(--bg-white)',
              border: '1px solid var(--border-light)',
              borderRadius: '16px',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '120px', height: '120px',
                background: 'radial-gradient(circle, rgba(45, 156, 218, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
              <div style={{
                width: '50px', height: '50px', borderRadius: '12px',
                background: 'rgba(45, 156, 218, 0.12)', color: 'var(--accent-blue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
              }}>
                <Compass size={24} />
              </div>
              <span className="badge badge-accent-green" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem', backgroundColor: 'rgba(45, 156, 218, 0.12)', color: 'var(--accent-blue)' }}>Aspiración Futura</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Nuestra Visión</h3>
              <p style={{ color: 'var(--text-medium)', lineHeight: 1.65, fontSize: '0.92rem', margin: 0 }}>
                Posicionarnos como el socio estratégico y distribuidor referente en medicina estética en Argentina, reconocidos nacional e internacionalmente por nuestra excelencia científica, innovación tecnológica constante, prácticas comerciales éticas y programas de capacitación médica continua.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES SECTION */}
      <section className="section-padding" style={{ background: 'var(--bg-white)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-accent-green" style={{ marginBottom: '1rem' }}>Identidad & Principios</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Valores que Guían Nuestra Práctica</h2>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Principios éticos y científicos que definen nuestra relación con los médicos y el sistema de salud.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem'
          }}>
            {coreValues.map((val, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-light)',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '1.75rem',
                transition: 'var(--transition-fast)'
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  background: '#ffffff', boxShadow: 'var(--shadow-sm)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem', border: '1px solid var(--border-light)'
                }}>
                  {val.icon}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{val.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: 1.6, margin: 0 }}>
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EDUCATION AS A STRATEGIC PILLAR */}
      <section className="section-padding" style={{ background: 'var(--primary-dark)', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(3, 191, 215, 0.15) 100%)',
          zIndex: 1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr', gap: '3.5rem', alignItems: 'center'
          }} className="about-grid-marenostrum">
            
            {/* Left column info */}
            <div>
              <span className="badge badge-accent-green" style={{ marginBottom: '1rem' }}>Compromiso Académico</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '1.25rem', color: '#FFFFFF', lineHeight: 1.25 }}>
                La Educación como <span className="text-gradient-accent">Pilar Estratégico</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                En <strong>Latmedical</strong> la educación médica no es un servicio adicional: es uno de nuestros compromisos fundamentales. Impulsamos la medicina estética basada en la evidencia y el aprendizaje continuo a lo largo de toda la carrera profesional.
              </p>
              
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '1.25rem',
                backdropFilter: 'blur(4px)'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-green)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe size={18} /> Alianzas & Cooperación Académica
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>
                  Mantenemos acuerdos estratégicos con <strong>Acadelift Academy</strong>, <strong>Seffiline Academy</strong>, programas de posgrado de la <strong>Universidad de Buenos Aires (UBA)</strong> y reconocidas Sociedades Científicas.
                </p>
              </div>
            </div>

            {/* Right column checklist */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '2.25rem',
              color: 'var(--primary-dark)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} color="var(--accent-green)" /> Formatos & Programas de Formación
              </h3>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem'
              }}>
                {educationPillars.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-dark)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. COMMERCIAL NETWORK & NATIONWIDE COVERAGE */}
      <section className="section-padding" style={{ background: 'var(--bg-white)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-accent-green" style={{ marginBottom: '1rem' }}>Distribución Federal</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Red Comercial y Cobertura Nacional</h2>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Un modelo comercial que combina atención personalizada directa con alcance y flete garantizado en todo el país.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem'
          }}>
            {/* Direct Representatives */}
            <div style={{
              background: 'var(--bg-light)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(41, 192, 147, 0.1)', color: 'var(--accent-green)' }}>
                  <MapPin size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Representantes Médicos Directos</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', lineHeight: 1.65, margin: 0 }}>
                Equipo propio de visitadores médicos brindando soporte profesional directo a cirujanos, clínicas e instituciones en la <strong>Ciudad Autónoma de Buenos Aires (CABA)</strong> (concentrando el 55% del volumen comercial).
              </p>
            </div>

            {/* Subdistributors Network */}
            <div style={{
              background: 'var(--bg-light)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(45, 156, 218, 0.1)', color: 'var(--accent-blue)' }}>
                  <TrendingUp size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Red Nacional de Subdistribuidores</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', lineHeight: 1.65, margin: 0 }}>
                Para el resto del país, trabajamos con subdistribuidores regionales seleccionados en las zonas <strong>Centro (22%), NOA/NEA (10%), Cuyo (9%) y Patagonia (4%)</strong>, garantizando logística estéril eficiente y soporte técnico continuo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CORPORATE MILESTONES TIMELINE */}
      <section className="section-padding" style={{ background: 'var(--bg-light)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-accent-green" style={{ marginBottom: '1rem' }}>Trayectoria & Evolución</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Nuestros Hitos Corporativos</h2>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Evolución y hoja de ruta estratégica de Latmedical International en Argentina.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem'
          }}>
            {milestones.map((m, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-white)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', position: 'relative'
              }}>
                <div style={{
                  fontSize: '2rem', fontWeight: 800, color: 'var(--accent-green)', fontFamily: "'Montserrat', sans-serif", marginBottom: '0.5rem'
                }}>
                  {m.year}
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>{m.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', lineHeight: 1.6, margin: 0 }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. MANAGEMENT TEAM SECTION */}
      <section className="section-padding" style={{ background: 'var(--bg-white)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-accent-green" style={{ marginBottom: '1rem' }}>Liderazgo Profesional</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Equipo Directivo y de Gestión</h2>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Médicos y especialistas comprometidos con la excelencia científica y operativa de Latmedical.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.75rem'
          }}>
            {team.map((member, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-light)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '1.75rem', textAlign: 'center', transition: 'var(--transition-fast)'
              }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-green) 0%, var(--accent-blue) 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontSize: '1.25rem', fontWeight: 700, boxShadow: 'var(--shadow-sm)'
                }}>
                  {member.name.replace('Dr. ', '').replace('Dra. ', '').substring(0, 2).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>
                  {member.badge}
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--primary-dark)' }}>{member.name}</h4>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-blue)', marginBottom: '0.75rem' }}>{member.role}</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-medium)', lineHeight: 1.5, margin: 0 }}>
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. STRATEGIC PARTNERS / EUROPEAN BACKUP */}
      <section className="section-padding" style={{ background: 'var(--bg-light)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge badge-accent-green" style={{ marginBottom: '1rem' }}>Alianzas Internacionales</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>Respaldo Científico de Vanguardia</h2>
          <p style={{ color: 'var(--text-medium)', maxWidth: '600px', margin: '0 auto 3rem auto', fontSize: '0.9rem' }}>
            Nuestros productos y metodologías están respaldados por las sociedades y comités científicos oficiales en Europa.
          </p>

          <div className="partner-grid">
            <a 
              href="https://vliftpro.org" 
              target="_blank" 
              rel="noreferrer" 
              className="partner-card"
            >
              <img 
                src={getAssetUrl('/images/logos/vliftpro-part.png')} 
                alt="Vlift Pro" 
                className="partner-logo" 
              />
            </a>

            <a 
              href="https://marenostrum-med.com" 
              target="_blank" 
              rel="noreferrer" 
              className="partner-card"
            >
              <img 
                src={getAssetUrl('/images/logos/marenosturm-med.png')} 
                alt="Marenostrum Devices" 
                className="partner-logo" 
                style={{ transform: 'scale(1.1)' }} 
              />
            </a>

            <a 
              href="https://www.instagram.com/seffiline_sp/" 
              target="_blank" 
              rel="noreferrer" 
              className="partner-card"
            >
              <img 
                src={getAssetUrl('/images/logos/seffiline_sp.png')} 
                alt="Seffiline Terapia" 
                className="partner-logo" 
                style={{ transform: 'scale(1.15)' }} 
              />
            </a>

            <a 
              href="https://acadelift.org/" 
              target="_blank" 
              rel="noreferrer" 
              className="partner-card"
            >
              <img 
                src={getAssetUrl('/images/logos/acadelift.png')} 
                alt="Acadelift" 
                className="partner-logo" 
                style={{ transform: 'scale(1.25)' }} 
              />
            </a>

            <a 
              href="https://academy.seffiline.com/" 
              target="_blank" 
              rel="noreferrer" 
              className="partner-card"
            >
              <img 
                src={getAssetUrl('/images/logos/seffiline-academy.png')} 
                alt="Seffiline Academy" 
                className="partner-logo" 
              />
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .partner-grid {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }

        .partner-card {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          border: 1px solid var(--border-light);
          padding: 1.25rem 1.5rem;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          flex: 1 1 170px;
          max-width: 220px;
          min-width: 150px;
          height: 110px;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .partner-card:hover {
          border-color: rgba(0, 0, 0, 0.15);
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
        }

        .partner-logo {
          max-height: 48px;
          max-width: 82%;
          width: auto;
          height: auto;
          display: block;
          object-fit: contain;
          filter: grayscale(100%) contrast(0.85);
          opacity: 0.5;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .partner-card:hover .partner-logo {
          filter: grayscale(0%) contrast(1);
          opacity: 0.95;
        }

        @media (min-width: 992px) {
          .about-grid-marenostrum {
            grid-template-columns: 0.95fr 1.05fr !important;
            gap: 5rem !important;
          }
        }
      `}</style>

    </div>
  );
};
