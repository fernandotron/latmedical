import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  CheckCircle2, 
  Phone, 
  Send, 
  BookOpen, 
  X,
  ArrowLeft
} from 'lucide-react';

export interface Workshop {
  id: string;
  title: string;
  partner: 'Acadelift' | 'Seffiline Academy' | 'Marenostrum Med';
  partnerLogo?: string;
  type: 'Presencial Hands-On' | 'Híbrido (Teórico + Práctica en Vivo)' | 'Masterclass Intensiva';
  date: string;
  city: string;
  venue: string;
  spotsTotal: number;
  spotsLeft: number;
  instructor: string;
  instructorRole: string;
  description: string;
  syllabus: string[];
  includes: string[];
  priceARS?: string;
  badge?: string;
}

const WORKSHOPS_DATA: Workshop[] = [
  {
    id: 'masterclass-hilos-avanzados',
    title: 'Masterclass Hands-On: Hilos Tensores Faciales Avanzados (Vectores, Cones & Cánula L)',
    partner: 'Acadelift',
    partnerLogo: '/images/logos/acadelift.png',
    type: 'Presencial Hands-On',
    date: '18 y 19 de Septiembre, 2026',
    city: 'Buenos Aires, Argentina',
    venue: 'Centro de Entrenamiento Quirúrgico Acadelift (Recoleta)',
    spotsTotal: 8,
    spotsLeft: 3,
    instructor: 'Dr. Alejandro M. Varela & Equipo Acadelift',
    instructorRole: 'Cirujano Plástico & Key Opinion Leader Internacional V-Lift Pro',
    description: 'Entrenamiento intensivo en grupos reducidos con pacientes reales. Aborda la arquitectura de anclaje fascial, vectorización en abanico, técnica atraumática con cánula L Genesis 19G y tracción con conos moldeados 18G.',
    syllabus: [
      'Anatomía fascial y compartimentos grasos del tercio medio e inferior.',
      'Planificación de vectores de tracción según biomecánica del descolgamiento.',
      'Técnica de anclaje preauricular y temporal sin sutura quirúrgica.',
      'Tratamiento de jowls severos con Hilos Cones 18G y Tensio 19G.',
      'Práctica directa en pacientes reales provistos por la academia.'
    ],
    includes: [
      'Certificado Oficial Universitario con aval Acadelift Internacional',
      'Kit completo de hilos para la práctica con el paciente',
      'Material didáctico impreso y acceso a grabaciones de casos clínicos',
      'Almuerzo de trabajo y networking con speakers'
    ],
    badge: 'Últimos 3 Cupos'
  },
  {
    id: 'taller-seffiline-regenerativa',
    title: 'Workshop Hands-On: Terapia Celular Autóloga SEFFILLER® Facial & SEFFIHAIR® Capilar',
    partner: 'Seffiline Academy',
    partnerLogo: '/images/logos/seffiline-academy.png',
    type: 'Presencial Hands-On',
    date: '02 y 03 de Octubre, 2026',
    city: 'Buenos Aires, Argentina',
    venue: 'Auditorio Médico Latmedical & Quirófano Ambulatorio',
    spotsTotal: 10,
    spotsLeft: 4,
    instructor: 'Dra. Florencia S. Rossi',
    instructorRole: 'Especialista en Medicina Regenerativa & Certified SEFFI Trainer',
    description: 'Capacitación teórico-práctica para la recolección estandarizada de tejido adiposo superficial y fracción estromal vascular (SVF + ADSCs) sin centrifugación traumática.',
    syllabus: [
      'Bases biológicas de las ADSCs y factores de crecimiento autólogo.',
      'Técnica anestésica tumescente local y preparación del campo estéril.',
      'Manejo del dispositivo desechable patentado SEFFILLER®.',
      'Protocolos de microinfiltración facial para bio-restauración dérmica.',
      'Protocolo SEFFIHAIR® para alopecia androgenética y efluvio telógeno.',
      'Práctica en vivo paso a paso.'
    ],
    includes: [
      'Diploma Oficial Seffiline Academy Italia & Latmedical',
      'Kit estéril SEFFILLER® para la práctica clínica',
      'Guías de consentimiento y protocolos de bioseguridad',
      'Acceso al grupo privado de interconsulta médica médica internacional'
    ],
    badge: 'Certificación Internacional'
  },
  {
    id: 'rinomodelacion-periocular-pdo',
    title: 'Curso de Especialización: Rinomodelación Biológica & Lifting Periocular con Hilos PDO',
    partner: 'Acadelift',
    partnerLogo: '/images/logos/acadelift.png',
    type: 'Híbrido (Teórico + Práctica en Vivo)',
    date: '24 de Octubre, 2026',
    city: 'Buenos Aires & Transmisión HD Virtual',
    venue: 'Sede Acadelift / Campus Virtual',
    spotsTotal: 12,
    spotsLeft: 5,
    instructor: 'Dr. Martín E. Peralta',
    instructorRole: 'Médico Estético & Docente de Posgrado',
    description: 'Dominio de las técnicas mínimamente invasivas más demandadas: elevación y soporte de la punta nasal con Hilos Nose 19G/21G y tratamiento de surco lagrimal y ojeras con hilos Eye 30G.',
    syllabus: [
      'Anatomía vascular de seguridad nasal y periorbitaria (evitar complicaciones).',
      'Creación del pilar columelar con hilos rígidos moldeados.',
      'Afinamiento del dorso y rectificación de giba ósea-cartilaginosa.',
      'Técnica en malla cruzada (cross-hatching) para ojeras hundidas.',
      'Manejo preventivo de hematomas y cuidados post-inmediatos.'
    ],
    includes: [
      'Certificado de Aprobación de Especialización en Rinomodelación',
      'Insumos provistos para la práctica en modelos anatómicos y pacientes',
      'Plantillas de consentimiento informado y folletos para el paciente'
    ]
  },
  {
    id: 'ginecoestetica-seffigyn',
    title: 'Simposio Internacional de Ginecoestética & Medicina Regenerativa Íntima SEFFIGYN®',
    partner: 'Marenostrum Med',
    partnerLogo: '/images/logos/marenosturm-med.png',
    type: 'Masterclass Intensiva',
    date: '14 de Noviembre, 2026',
    city: 'Córdoba, Argentina',
    venue: 'Hotel Quinto Centenario & Centro Médico Quirúrgico',
    spotsTotal: 15,
    spotsLeft: 7,
    instructor: 'Dra. Mariana Lucero & Dr. Roberto Gómez',
    instructorRole: 'Ginecólogos Especialistas en Regeneración Funcional y Estética',
    description: 'Protocolos de vanguardia para el tratamiento del síndrome genitourinario de la menopausia (GSM), liquen escleroso, laxitud vaginal y bio-rejuvenecimiento vulvar con células madre autólogas.',
    syllabus: [
      'Fisiopatología del envejecimiento urogenital y opciones terapéuticas no hormonales.',
      'Mecanismo de acción de las ADSCs en la regeneración de mucosa vaginal.',
      'Procedimiento ambulatorio con dispositivo estéril SEFFIGYN®.',
      'Bioplastia de labios mayores y restablecimiento del volumen autólogo.',
      'Demostración quirúrgica en vivo transmitida en circuito cerrado 4K.'
    ],
    includes: [
      'Certificación avalada por Marenostrum Med & Sociedad Científica',
      'Coffee breaks, lunch ejecutivo y material científico impreso',
      'Seguimiento de casos clínicos y asesoramiento de puesta en marcha'
    ],
    badge: 'Alta Especialidad'
  }
];

export interface MedicalAcademyProps {
  onBack?: () => void;
  onContact?: () => void;
}

export const MedicalAcademy: React.FC<MedicalAcademyProps> = ({ onBack, onContact: _onContact }) => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    license: '',
    specialty: 'Medicina Estética',
    city: '',
    workshopId: WORKSHOPS_DATA[0].id
  });

  const handleWhatsAppInquiry = (workshop: Workshop) => {
    const text = encodeURIComponent(
      `Hola Latmedical / Academia. Soy médico/a y deseo consultar vacantes y aranceles para el workshop: "${workshop.title}" (${workshop.date}).`
    );
    window.open(`https://wa.me/5491123456789?text=${text}`, '_blank');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        license: '',
        specialty: 'Medicina Estética',
        city: '',
        workshopId: WORKSHOPS_DATA[0].id
      });
    }, 4000);
  };

  return (
    <div style={{ fontFamily: "'Montserrat', 'Open Sans', sans-serif", background: '#ffffff', animation: 'fadeIn 0.5s ease' }}>
      
      {/* 1. HERO HEADER BANNER (V-LIFT / SEFFILINE STYLE) */}
      <section style={{
        position: 'relative',
        background: `linear-gradient(rgba(17, 24, 39, 0.82), rgba(17, 24, 39, 0.92)), url("/fondo-cursos.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '8rem 0 5rem 0',
        color: '#ffffff'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '0.5rem 1.1rem',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                backdropFilter: 'blur(8px)',
                marginBottom: '1.75rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
            >
              <ArrowLeft size={16} /> Volver al Inicio
            </button>
          )}

          <div style={{ maxWidth: '850px' }}>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#c0a063',
              marginBottom: '0.6rem'
            }}>
              ACADELIFT · SEFFILINE ACADEMY · MARENOSTRUM MED
            </p>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 1rem 0',
              color: '#FFFFFF',
              letterSpacing: '-0.02em'
            }}>
              Academia Médica & Workshops Hands-On 2026
            </h1>

            <p style={{
              color: '#cbd5e1',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 0 2rem 0'
            }}>
              Formación continua de excelencia y perfeccionamiento técnico con práctica en pacientes reales para médicos especialistas en Hilos Tensores PDO y Medicina Regenerativa Autóloga.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <GraduationCap size={14} color="#c0a063" /> 100% Hands-On en Pacientes Reales
              </span>
              <span style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <Award size={14} color="#34d399" /> Certificación Oficial Internacional
              </span>
              <span style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <Users size={14} color="#38bdf8" /> Grupos Reducidos (8 a 12 Médicos)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACADEMY STATS & CERTIFICATION TRUST BAR */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid var(--border-light)', padding: '1.75rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-green)' }}>+850</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-medium)', fontWeight: 600 }}>Médicos Capacitados</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)' }}>100% Hands-On</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-medium)', fontWeight: 600 }}>Práctica con Pacientes Reales</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-blue)' }}>Certificación Oficial</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-medium)', fontWeight: 600 }}>Aval Académico Internacional</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706' }}>Grupos Reducidos</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-medium)', fontWeight: 600 }}>Máximo 8 a 12 Médicos por Sede</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WORKSHOPS SCHEDULE & GRID */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-light)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-accent-green" style={{ marginBottom: '0.5rem' }}>Calendario Oficial 2026</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
              Próximos Workshops & Masterclasses
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', marginTop: '0.5rem' }}>
              Reserva tu vacante con anticipación para asegurar tu lugar en los entrenamientos prácticos.
            </p>
          </div>

          {/* Workshops Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            gap: '2rem'
          }}>
            {WORKSHOPS_DATA.map(ws => (
              <div
                key={ws.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid var(--border-light)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                {/* Card Top Strip */}
                <div style={{
                  background: 'linear-gradient(135deg, #111827 0%, #1e3a5f 100%)',
                  padding: '1.25rem 1.5rem',
                  color: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent-green)' }}>
                    {ws.partner}
                  </span>
                  {ws.badge && (
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#FCA5A5',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px'
                    }}>
                      {ws.badge}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.6rem',
                      borderRadius: '4px',
                      background: 'var(--accent-green-light)',
                      color: '#03543F'
                    }}>
                      {ws.type}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 0.85rem 0', lineHeight: 1.35 }}>
                    {ws.title}
                  </h3>

                  {/* Metadata */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: 'var(--text-medium)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={15} color="var(--accent-green)" />
                      <strong>{ws.date}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={15} color="var(--accent-green)" />
                      <span>{ws.city} — {ws.venue}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={15} color="var(--accent-green)" />
                      <span>Vacantes: <strong>{ws.spotsLeft} disponibles</strong> (Grupo de {ws.spotsTotal})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={15} color="var(--accent-green)" />
                      <span>Docente: <strong>{ws.instructor}</strong></span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-medium)', lineHeight: 1.45, margin: '0 0 1.5rem 0' }}>
                    {ws.description}
                  </p>

                  {/* Actions */}
                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    gap: '0.75rem'
                  }}>
                    <button
                      onClick={() => setSelectedWorkshop(ws)}
                      style={{
                        flex: 1,
                        padding: '0.65rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)',
                        background: '#FFFFFF',
                        color: 'var(--text-dark)',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <BookOpen size={14} /> Ver Programa
                    </button>

                    <button
                      onClick={() => handleWhatsAppInquiry(ws)}
                      style={{
                        flex: 1.2,
                        padding: '0.65rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'var(--accent-gradient)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Phone size={14} /> Reservar Cupo
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. SYLLABUS & DETAILS MODAL */}
      {selectedWorkshop && (
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
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '750px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              background: 'var(--primary-dark)',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {selectedWorkshop.partner}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.2rem 0 0 0', color: '#FFFFFF' }}>
                  {selectedWorkshop.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedWorkshop(null)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
              
              {/* Instructor Box */}
              <div style={{
                background: 'var(--bg-light)',
                borderRadius: '8px',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Director Académico / Docente a Cargo:
                </div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>{selectedWorkshop.instructor}</strong>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                  {selectedWorkshop.instructorRole}
                </p>
              </div>

              {/* Syllabus */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                Temario & Programa Científico:
              </h4>
              <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                {selectedWorkshop.syllabus.map((item, idx) => (
                  <li key={idx} style={{ lineHeight: 1.45 }}>{item}</li>
                ))}
              </ul>

              {/* What is Included */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
                La Inscripción Incluye:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {selectedWorkshop.includes.map((inc, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-dark)' }}>
                    <CheckCircle2 size={16} color="var(--accent-green)" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.25rem 1.75rem',
              background: '#F8FAFC',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>
                Vacantes limitadas para médicos habilitados.
              </div>
              <button
                onClick={() => {
                  handleWhatsAppInquiry(selectedWorkshop);
                  setSelectedWorkshop(null);
                }}
                className="btn-primary"
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem' }}
              >
                <Phone size={15} /> Inscribirme por WhatsApp
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. FAST REGISTRATION / INQUIRY FORM */}
      <section style={{ padding: '4.5rem 0', background: '#FFFFFF', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{
            maxWidth: '750px',
            margin: '0 auto',
            background: '#F8FAFC',
            borderRadius: '16px',
            border: '1px solid var(--border-light)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="badge badge-accent-green" style={{ marginBottom: '0.5rem' }}>Contacto Directo Academia</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                Solicitar Información de Próximas Fechas & Aranceles
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginTop: '0.4rem' }}>
                Completa el formulario y un asesor académico te enviará el programa completo y los requisitos de admisión médica.
              </p>
            </div>

            {formSubmitted ? (
              <div style={{
                background: '#DEF7EC',
                border: '1px solid #31C48D',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                color: '#03543F',
                animation: 'fadeIn 0.4s ease'
              }}>
                <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
                  ¡Solicitud Recibida con Éxito!
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  Un asesor académico de Latmedical se pondrá en contacto contigo a la brevedad vía WhatsApp y correo electrónico con el dossier completo del curso.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Curso o Workshop de Interés:
                  </label>
                  <select
                    value={formData.workshopId}
                    onChange={(e) => setFormData({ ...formData, workshopId: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.85rem',
                      background: '#FFFFFF'
                    }}
                  >
                    {WORKSHOPS_DATA.map(w => (
                      <option key={w.id} value={w.id}>{w.title} ({w.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Nombre y Apellido: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. / Dra. ..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Matrícula Médica (MN / MP): *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: MN 145.890"
                    value={formData.license}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Email Profesional: *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@clinica.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    WhatsApp / Teléfono: *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+54 9 11 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      fontSize: '0.9rem',
                      justifyContent: 'center'
                    }}
                  >
                    <Send size={16} /> Enviar Solicitud de Información
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </section>

    </div>
  );
};
