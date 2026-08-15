import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  Eye, 
  Printer, 
  FileCheck2, 
  Search, 
  X,
  ArrowLeft
} from 'lucide-react';

export interface MedicalDoc {
  id: string;
  title: string;
  category: 'consentimiento' | 'anmat' | 'paper' | 'guia';
  categoryLabel: string;
  description: string;
  format: string;
  fileSize: string;
  badge?: string;
  downloadUrl?: string;
  contentMarkdown?: string;
}

const MEDICAL_DOCS: MedicalDoc[] = [
  {
    id: 'consentimiento-hilos-pdo',
    title: 'Consentimiento Informado: Hilos Tensores de Polidioxanona (PDO)',
    category: 'consentimiento',
    categoryLabel: 'Consentimiento Legal',
    description: 'Documento médico-legal completo para la aplicación de hilos tensores faciales y corporales V-Lift Pro. Incluye declaración de riesgos, contraindicaciones y aceptación voluntaria.',
    format: 'PDF / Imprimible A4',
    fileSize: '185 KB',
    badge: 'Uso Obligatorio',
    contentMarkdown: `
# FORMULARIO DE CONSENTIMIENTO INFORMADO
## PROCEDIMIENTO DE IMPLANTACIÓN DE HILOS TENSORES DE POLIDIOXANONA (PDO)

**Institución / Profesional Actuante:** ________________________________________  
**Matrícula Médica (MN/MP):** ___________________ **Fecha:** ___/___/2026  

---

### DATOS DEL PACIENTE
- **Nombre y Apellido:** __________________________________________________
- **DNI / Pasaporte:** __________________________ **Edad:** _____ años
- **Teléfono de Contacto:** ____________________ **Email:** _____________________

---

### I. DECLARACIÓN DEL MÉDICO
Certifico que he informado al paciente detalladamente sobre la naturaleza del tratamiento con Hilos Tensores reabsorbibles de Polidioxanona (PDO) marca V-LIFT PRO, sus objetivos estéticos, técnica de implantación, duración esperada de los resultados (12 a 18 meses) y posibles efectos secundarios transitorios (edema, hematomas, ligera asimetría temporal, sensación de tirantez).

### II. DECLARACIÓN DEL PACIENTE
1. He sido ampliamente informado/a sobre el procedimiento de colocación de hilos PDO y he podido formular todas las preguntas necesarias, las cuales fueron respondidas a mi entera satisfacción.
2. Comprendo que la polidioxanona es un polímero 100% biocompatible y reabsorbible mediante hidrólisis en un plazo de 6 a 8 meses, y que los resultados dependen de la respuesta biológica individual.
3. Me comprometo a cumplir estrictamente las indicaciones post-tratamiento provistas por el profesional médico (evitar gesticulación excesiva por 72h, no realizar actividad física intensa por 7 días, dormir boca arriba).
4. Declaro no padecer enfermedades autoinmunes activas, procesos infecciosos locales, ni trastornos de la coagulación no controlados.

---

**Firma del Paciente:** _____________________________  
**Aclaración:** ___________________________________  
**DNI:** _________________________________________  

**Firma y Sello del Profesional Médico:** _____________________________
`
  },
  {
    id: 'consentimiento-seffiline',
    title: 'Consentimiento Informado: Terapia Celular Autóloga SEFFILLER® / SEFFIHAIR®',
    category: 'consentimiento',
    categoryLabel: 'Consentimiento Legal',
    description: 'Modelo de consentimiento para recolección y microinjerto de tejido adiposo autólogo y fracción estromal vascular (SVF + ADSCs) con tecnología guiada SEFFI.',
    format: 'PDF / Imprimible A4',
    fileSize: '210 KB',
    badge: 'Medicina Regenerativa',
    contentMarkdown: `
# CONSENTIMIENTO INFORMADO PARA TRATAMIENTO DE REGENERACIÓN CELULAR AUTÓLOGA
## SISTEMA DE RECOLECCIÓN Y MICROINJERTO GUIADO SEFFILLER® / SEFFIHAIR®

**Profesional Responsable:** ________________________________________  
**Matrícula:** ___________________ **Fecha del Procedimiento:** ___/___/2026  

---

### NATURALEZA DEL PROCEDIMIENTO
El procedimiento consiste en la recolección ambulatoria y mínimamente invasiva de una pequeña muestra de tejido adiposo subcutáneo autólogo (grasa propia del paciente) mediante cánulas fenestradas patentadas SEFFI, con el propósito de aislar y preparar una suspensión rica en células madre mesenquimales derivadas del tejido adiposo (ADSCs) y Fracción Vascular Estromal (SVF) para su reinfiltración en zonas de rejuvenecimiento facial, capilar o íntimo.

### COMPRENSIÓN DE RIESGOS Y CUIDADOS
- El paciente declara comprender que, al tratarse de tejido autólogo autodonado, se elimina el riesgo de rechazo inmunológico o reacciones alérgicas a cuerpos extraños.
- Se ha explicado la técnica anestésica tumescente local y el período de recuperación estimado (24 a 48 horas).
- El paciente otorga su consentimiento libre e informado para la realización del tratamiento.

---

**Firma del Paciente:** _____________________________  
**Firma y Matrícula del Médico:** _____________________________
`
  },
  {
    id: 'consentimiento-rinomodelacion',
    title: 'Consentimiento Informado: Rinomodelación Biológica con Hilos PDO Nose',
    category: 'consentimiento',
    categoryLabel: 'Consentimiento Legal',
    description: 'Documento legal específico para soporte de punta nasal, columela y rectificación de dorso mediante Hilos V-Lift Pro Nose.',
    format: 'PDF / Imprimible A4',
    fileSize: '175 KB',
    contentMarkdown: `
# CONSENTIMIENTO INFORMADO - RINOMODELACIÓN CON HILOS PDO
## ELEVACIÓN DE PUNTA Y PROYECCIÓN DE COLUMELA V-LIFT PRO NOSE

**Médico Especialista:** ________________________________________  
**Matrícula:** ___________________ **Fecha:** ___/___/2026  

---

### INDICACIONES Y LÍMITES
El paciente ha sido informado de que la rinomodelación con hilos de polidioxanona es un procedimiento no quirúrgico destinado a corregir ángulos nasales, elevar la punta caída y armonizar el dorso nasal. No sustituye una rinoplastia estructural quirúrgica compleja en casos de desviaciones septales severas con compromiso funcional respiratorio.

---

**Firma del Paciente:** _____________________________  
**Firma del Profesional:** _____________________________
`
  },
  {
    id: 'cuidados-post-tratamiento',
    title: 'Guía de Cuidados Post-Tratamiento y Pautas de Alarma para el Paciente',
    category: 'guia',
    categoryLabel: 'Guía para Pacientes',
    description: 'Folleto entregable al paciente con indicaciones claras de higiene, frío local, reposo facial, medicamentos indicados y teléfonos de urgencia del consultorio.',
    format: 'PDF / Imprimible A4',
    fileSize: '140 KB',
    badge: 'Recomendado',
    contentMarkdown: `
# GUÍA DE CUIDADOS POST-PROCEDIMIENTO
## INSTRUCCIONES PARA EL PACIENTE TRAS LA APLICACIÓN DE HILOS PDO

¡Felicitaciones por tu tratamiento! Para asegurar los mejores resultados tensores y de bioestimulación, sigue estas recomendaciones:

### PRIMERAS 48 A 72 HORAS:
1. **Frío local:** Aplica compresas frías secas sobre las zonas tratadas durante 10 minutos cada 2 horas el primer día (no colocar hielo directo).
2. **Posición al dormir:** Duerme boca arriba con la cabeza ligeramente elevada por 5 a 7 noches.
3. **Reposo facial:** Evita gesticulaciones excesivas, masticar alimentos muy duros o abrir la boca de forma forzada.
4. **Higiene:** Lava tu rostro con suavidad con agua templada y limpiador neutro sin masajear ni frotar.

### PRIMERA SEMANA:
- No realices actividad física intensa ni deportes de impacto.
- Evita saunas, baños de inmersión calientes y exposición solar directa.
- No realices tratamientos odontológicos ni limpiezas faciales profundas durante 14 días.

---
**En caso de dolor agudo, inflamación progresiva o dudas:** Comunícate de inmediato con tu médico tratante al teléfono ____________________.
`
  },
  {
    id: 'anmat-vlift-registro',
    title: 'Certificado de Registro y Aprobación ANMAT: Hilos V-Lift Pro',
    category: 'anmat',
    categoryLabel: 'Certificación ANMAT',
    description: 'Disposición oficial de la ANMAT de habilitación para importación y distribución de dispositivos médicos de polidioxanona estéril (PM-2020).',
    format: 'PDF Institucional',
    fileSize: '320 KB',
    badge: 'Oficial ANMAT',
    downloadUrl: '/folleto-vlift.pdf'
  },
  {
    id: 'iso-biocompatibilidad',
    title: 'Certificación ISO 13485 & Ensayos de Biocompatibilidad y Esterilidad',
    category: 'anmat',
    categoryLabel: 'Calidad & Calibración',
    description: 'Auditoría de Buenas Prácticas de Fabricación Médica (GMP), esterilización por óxido de etileno (EtO) y testeo de citotoxicidad.',
    format: 'PDF Técnico',
    fileSize: '410 KB',
    badge: 'ISO 13485'
  },
  {
    id: 'paper-seffiline-adscs',
    title: 'Dossier Científico SEFFI: Cuantificación y Viabilidad de ADSCs y SVF',
    category: 'paper',
    categoryLabel: 'Estudios Científicos',
    description: 'Estudio clínico e histológico publicado sobre la viabilidad celular del microinjerto autólogo obtenido con la tecnología guiada SEFFI.',
    format: 'Paper Científico (PDF)',
    fileSize: '1.8 MB',
    badge: 'Peer Reviewed'
  },
  {
    id: 'folleto-clinico-vlift-2026',
    title: 'Catálogo y Manual Clínico de Aplicación V-Lift Pro 2026',
    category: 'guia',
    categoryLabel: 'Catálogo Técnico',
    description: 'Guía completa con esquemas anatómicos, vectores de inserción, calibres y parámetros de tracción para todos los modelos V-Lift Pro.',
    format: 'PDF Digital Completo',
    fileSize: '4.2 MB',
    badge: 'Catálogo Oficial',
    downloadUrl: '/folleto-vlift.pdf'
  }
];

export interface MedicalDownloadsProps {
  onBack?: () => void;
  onContact?: () => void;
}

export const MedicalDownloads: React.FC<MedicalDownloadsProps> = ({ onBack, onContact: _onContact }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePreviewDoc, setActivePreviewDoc] = useState<MedicalDoc | null>(null);

  const filteredDocs = useMemo(() => {
    return MEDICAL_DOCS.filter(doc => {
      const matchCat = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ fontFamily: "'Montserrat', 'Open Sans', sans-serif", background: '#ffffff', animation: 'fadeIn 0.5s ease' }}>
      
      {/* 1. HERO HEADER BANNER (V-LIFT / SEFFILINE STYLE) */}
      <section style={{
        position: 'relative',
        background: `linear-gradient(rgba(17, 24, 39, 0.84), rgba(17, 24, 39, 0.94)), url("/vlift-texture.png")`,
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
              RESPALDO LEGAL · HABILITACIONES ANMAT · CERTIFICACIONES ISO
            </p>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 1rem 0',
              color: '#FFFFFF',
              letterSpacing: '-0.02em'
            }}>
              Centro de Descargas & Consentimientos
            </h1>

            <p style={{
              color: '#cbd5e1',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 0 2rem 0'
            }}>
              Acceso a modelos de consentimiento informado médico-legal en PDF listos para imprimir en A4, habilitaciones ANMAT, certificados ISO 13485 y dossiers científicos.
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
                <ShieldCheck size={14} color="#34d399" /> Conforme Ley 26.529 Derechos del Paciente
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
                <FileCheck2 size={14} color="#38bdf8" /> Modelos Editables e Imprimibles A4
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT */}
      <section style={{ padding: '3.5rem 0 5rem 0', background: 'var(--bg-light)', position: 'relative' }}>
        <div className="container">
          
          {/* Security Notice */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderLeft: '4px solid var(--accent-green)',
            borderRadius: '8px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <ShieldCheck size={28} color="var(--accent-green)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  Validez Legal & Respaldo ANMAT Argentina
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-medium)' }}>
                  Todos los modelos de consentimiento informado cumplen con las pautas de la Ley 26.529 de Derechos del Paciente y normas éticas del Colegio Médico.
                </p>
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-medium)', fontWeight: 600 }}>
              Actualizado: Año 2026
            </span>
          </div>

          {/* Filter and Search Bar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2.5rem',
            background: 'var(--bg-white)',
            padding: '1.25rem',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'Todos los Documentos (8)' },
                  { id: 'consentimiento', label: 'Consentimientos Informados' },
                  { id: 'anmat', label: 'ANMAT & Calidad ISO' },
                  { id: 'paper', label: 'Dossiers & Papers' },
                  { id: 'guia', label: 'Guías de Paciente & Catálogos' }
                ].map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        padding: '0.45rem 1rem',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--accent-green)' : 'var(--border-light)',
                        background: isSelected ? 'var(--accent-green-light)' : 'transparent',
                        color: isSelected ? '#03543F' : 'var(--text-medium)',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', minWidth: '260px' }}>
                <Search size={16} color="var(--text-light)" style={{
                  position: 'absolute',
                  top: '50%',
                  left: '10px',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }} />
                <input
                  type="text"
                  placeholder="Buscar documento o protocolo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.75rem 0 2rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Document Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredDocs.map(doc => (
              <div
                key={doc.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      background: doc.category === 'consentimiento' ? 'var(--accent-green-light)' : doc.category === 'anmat' ? '#EFF6FF' : '#FEF3C7',
                      color: doc.category === 'consentimiento' ? 'var(--accent-green)' : doc.category === 'anmat' ? '#2563EB' : '#D97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileText size={22} />
                    </div>

                    {doc.badge && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        background: 'var(--bg-light)',
                        color: 'var(--text-dark)',
                        border: '1px solid var(--border-light)'
                      }}>
                        {doc.badge}
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize: '0.72rem', color: 'var(--text-medium)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {doc.categoryLabel}
                  </span>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', margin: '0.35rem 0 0.6rem 0', lineHeight: 1.35 }}>
                    {doc.title}
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-medium)', margin: '0 0 1.25rem 0', lineHeight: 1.45 }}>
                    {doc.description}
                  </p>
                </div>

                <div style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                    <strong>{doc.format}</strong> · {doc.fileSize}
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {doc.contentMarkdown ? (
                      <button
                        onClick={() => setActivePreviewDoc(doc)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid var(--accent-green)',
                          background: 'var(--accent-green-light)',
                          color: '#03543F',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <Eye size={14} /> Ver & Imprimir
                      </button>
                    ) : (
                      <a
                        href={doc.downloadUrl || '/folleto-vlift.pdf'}
                        download
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'var(--accent-gradient)',
                          color: '#FFFFFF',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <Download size={14} /> Descargar
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. MODAL PREVIEW & PRINT FOR LEGAL CONSENTS */}
      {activePreviewDoc && (
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
            borderRadius: '14px',
            width: '100%',
            maxWidth: '850px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            
            {/* Modal Top Bar */}
            <div style={{
              padding: '1rem 1.5rem',
              background: 'var(--primary-dark)',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="var(--accent-green)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                  {activePreviewDoc.title}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={handlePrint}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--accent-green)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={14} /> Imprimir A4
                </button>
                <button
                  onClick={() => setActivePreviewDoc(null)}
                  style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Modal Body: Document Sheet formatted for A4 */}
            <div style={{
              padding: '2.5rem',
              overflowY: 'auto',
              background: '#F8FAFC',
              flex: 1
            }}>
              <div 
                className="print-content"
                style={{
                  background: '#FFFFFF',
                  padding: '2.5rem 3rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                  border: '1px solid var(--border-light)',
                  fontFamily: 'serif',
                  color: '#1E293B',
                  lineHeight: 1.6,
                  fontSize: '0.92rem'
                }}
              >
                {/* Institutional Letterhead */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '2px solid #0F172A',
                  paddingBottom: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0F172A', fontFamily: 'sans-serif' }}>
                      LATMEDICAL INTERNATIONAL S.A.
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', fontFamily: 'sans-serif' }}>
                      División Medicina Estética & Regenerativa · Registro ANMAT PM-2020
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#64748B', fontFamily: 'sans-serif' }}>
                    Documento Clínico Oficial<br />
                    <strong>Confidencial & Médico-Legal</strong>
                  </div>
                </div>

                <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'system-ui, sans-serif' }}>
                  {activePreviewDoc.contentMarkdown}
                </div>
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div style={{
              padding: '0.75rem 1.5rem',
              background: '#FFFFFF',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-medium)' }}>
                Listo para imprimir y adjuntar a la historia clínica del paciente.
              </span>
              <button
                onClick={() => setActivePreviewDoc(null)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  background: '#FFFFFF',
                  color: 'var(--text-dark)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
