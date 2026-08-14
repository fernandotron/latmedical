import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Activity } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const [lastSubmission, setLastSubmission] = useState<{ name: string; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      id: 'sub-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      date: new Date().toLocaleString('es-AR'),
      type: 'Contacto Web',
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      country: formData.specialty.trim(),
      message: formData.message.trim()
    };

    // Backup in localStorage
    try {
      const saved = localStorage.getItem('latmedical_submissions');
      const existing = saved ? JSON.parse(saved) : [];
      existing.push(submissionData);
      localStorage.setItem('latmedical_submissions', JSON.stringify(existing));
    } catch (err) {
      console.error('Error saving submission to localStorage:', err);
    }
    
    // Save contact submission on server
    fetch('/api/save-submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData)
    })
      .then(res => {
        if (!res.ok) console.warn('Servidor respondió con estado no OK al guardar formulario:', res.status);
      })
      .catch(err => console.error('Error saving contact submission:', err));

    setLastSubmission({ name: formData.name.trim(), message: formData.message.trim() });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', specialty: '', message: '' });
    }, 8000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      {/* 1. HERO HEADER BANNER */}
      <section style={{
        position: 'relative',
        height: '35vh',
        minHeight: '280px',
        marginTop: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--primary-dark)',
        overflow: 'hidden'
      }}>
        {/* Parallax style background */}
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
        {/* Dark emerald mesh gradient */}
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
          <span className="badge badge-accent-green" style={{ marginBottom: '0.75rem' }}>Contacto Latmedical</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
            Contacto
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '600px' }}>
            Comunícate con nuestros asesores clínicos y solicita tu cotización personalizada.
          </p>
        </div>
      </section>

      {/* Main Contact Content */}
      <section id="contact" style={{ padding: '5rem 0', background: 'var(--bg-light)', position: 'relative' }}>
        <div className="container">

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '4rem'
        }} className="contact-grid">
          
          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Información del Distribuidor
            </h3>
            <p style={{ color: 'var(--text-medium)', marginBottom: '1rem' }}>
              Nuestras oficinas de distribución en Argentina gestionan entregas en todo el territorio nacional con rigurosos controles de conservación.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Address */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  background: 'var(--bg-white)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-sm)',
                  color: 'var(--accent-green)',
                  border: '1px solid var(--border-light)'
                }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>Oficina Comercial</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)' }}>
                    Av. Cabildo 1237, Piso 7.<br />
                    (CP: C1426AAM). Buenos Aires,<br />
                    Argentina
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  background: 'var(--bg-white)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-sm)',
                  color: 'var(--accent-green)',
                  border: '1px solid var(--border-light)'
                }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>Línea Comercial</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', margin: 0 }}>
                    <a 
                      href="https://wa.me/5491154577210?text=Hola%20Latmedical%2C%20deseo%20realizar%20una%20consulta%20comercial." 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: 'inherit', textDecoration: 'none' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-green)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                      onClick={() => {
                        (window as any).gtag?.('event', 'click_whatsapp_contact_page', {
                          'event_category': 'Contact',
                          'event_label': 'Contact Page Link'
                        });
                      }}
                    >
                      +54 9 11 5457-7210 (Comercial)
                    </a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  background: 'var(--bg-white)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-sm)',
                  color: 'var(--accent-green)',
                  border: '1px solid var(--border-light)'
                }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>Correo Electrónico</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', margin: 0 }}>
                    info@latmedical.com.ar
                  </p>
                </div>
              </div>
            </div>

            {/* Elegant Map Placeholder */}
            <div style={{
              background: 'var(--bg-white)',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              height: '180px',
              marginTop: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Abstract map lines */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.05,
                backgroundImage: 'radial-gradient(circle, #29c093 1px, transparent 1px)',
                backgroundSize: '16px 16px',
                pointerEvents: 'none'
              }} />
              <Activity size={24} color="var(--accent-green)" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Cobertura Nacional</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', maxWidth: '300px', marginTop: '0.25rem' }}>
                Envíos refrigerados y garantizados a Córdoba, Mendoza, Santa Fe, Tucumán y todo el país.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            background: 'var(--bg-white)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 0.8s ease'
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Formulario de Consulta
            </h3>
            
            {submitted ? (
              <div style={{
                background: 'var(--accent-green-light)',
                border: '1px solid var(--success)',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--success)'
              }}>
                <Send size={32} style={{ marginBottom: '1rem', transform: 'rotate(-45deg)' }} />
                <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>¡Consulta Enviada con Éxito!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginBottom: '1.25rem' }}>
                  Tu mensaje ha sido registrado en nuestro sistema y notificado a nuestros asesores.
                </p>
                {lastSubmission && (
                  <a
                    href={`https://wa.me/5491154577210?text=${encodeURIComponent(`Hola Latmedical, acabo de enviar una consulta desde la web. Mi nombre es ${lastSubmission.name}. Consulta: ${lastSubmission.message}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: '#25D366',
                      color: '#ffffff',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    💬 Contactar también por WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Name */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Nombre y Apellido</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dr. Esteban Colombo"
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Email and Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }} className="form-row-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ejemplo@medico.com"
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Teléfono / Celular</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ej. +54 9 11 1234 5678"
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Specialty */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Especialidad / Cargo</label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="Ej. Dermatólogo, Gerente de Clínica"
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Mensaje o Consulta</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escribe aquí tu consulta o solicitud..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    justifyContent: 'center',
                    padding: '0.8rem 2rem',
                    fontSize: '0.9rem',
                    width: '100%'
                  }}
                >
                  <Send size={16} /> Enviar Mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .contact-grid {
            grid-template-columns: 0.9fr 1.1fr !important;
            gap: 6rem !important;
          }
        }
        @media (min-width: 768px) {
          .form-row-2 {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
      </section>

      {/* Full-width Google Map */}
      <div style={{ width: '100%', height: '450px', border: 0, borderTop: '1px solid var(--border-light)', display: 'block' }}>
        <iframe
          src="https://maps.google.com/maps?q=Av.%20Cabildo%201237%2C%20C1426AAM%20Buenos%20Aires%2C%20Argentina&t=&z=16&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          allowFullScreen={true}
          loading="lazy"
          title="Ubicación Latmedical"
        ></iframe>
      </div>
    </div>
  );
};
