import React from 'react';
import { Shield } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

export const PrivacyPolicy: React.FC = () => {
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
            Política de Privacidad
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-white)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-medium)', lineHeight: '1.7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Shield size={32} color="var(--accent-green)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>
              Compromiso de Confidencialidad y Protección de Datos
            </h2>
          </div>

          <p>
            En <strong>Latmedical</strong> (en adelante, "nosotros" o "el Distribuidor"), nos tomamos muy en serio la privacidad y seguridad de la información. Debido al carácter estrictamente profesional y regulado de las actividades de comercialización de hilos tensores de PDO (Vlift Pro) y sistemas de microinjerto autólogo (Seffiline), nuestra política de tratamiento de datos está adaptada a los requerimientos de la Ley de Protección de Datos Personales de la República Argentina (Ley N° 25.326) y las normativas de la Administración Nacional de Medicamentos, Alimentos y Tecnología Médica (ANMAT).
          </p>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            1. Información que Recopilamos
          </h3>
          <p>
            Recopilamos información únicamente con propósitos comerciales B2B y regulatorios:
          </p>
          <ul>
            <li><strong>Datos de Identificación Profesional</strong>: Nombre, apellido, especialidad clínica, número de matrícula médica provincial o nacional y credenciales profesionales. Esta información es mandatoria para dar cumplimiento a las regulaciones de ANMAT.</li>
            <li><strong>Datos de Contacto Comercial</strong>: Teléfono celular/WhatsApp, dirección de correo electrónico y dirección fiscal o del consultorio para el despacho del equipamiento.</li>
            <li><strong>Información de Transacciones</strong>: Detalle de solicitudes de cotización, matrículas registradas y comprobantes de despacho o capacitación profesional asociados.</li>
          </ul>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            2. Uso y Finalidad de los Datos
          </h3>
          <p>
            Los datos personales proporcionados a través del formulario de contacto, el registro de formación médica y el proceso del carro de cotización se procesan con las siguientes finalidades:
          </p>
          <ul>
            <li><strong>Validación Legal y Regulatoria</strong>: Verificar la matrícula y habilitación del médico solicitante antes de procesar cualquier envío de insumos de uso médico restringido.</li>
            <li><strong>Gestión de Pedidos</strong>: Facilitar la comunicación a través de WhatsApp Comercial para coordinar pagos de transferencias bancarias y verificar acreditaciones.</li>
            <li><strong>Formación Profesional</strong>: Registrar la participación en cursos clínicos oficiales y enviar planes de estudios o accesos a los programas científicos.</li>
          </ul>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            3. Almacenamiento y Seguridad de Datos
          </h3>
          <p>
            Implementamos rigurosas medidas técnicas y organizativas para resguardar la información:
          </p>
          <ul>
            <li>Todos los datos son tratados bajo confidencialidad absoluta y almacenados en servidores seguros.</li>
            <li>La información de transacciones y matrículas se almacena a efectos de trazabilidad del producto médico tal como lo exige el marco regulatorio vigente.</li>
            <li>No comercializamos ni transferimos información personal de nuestros clientes a terceros, salvo a las autoridades regulatorias competentes (como ANMAT) en caso de inspección oficial o requerimiento legal legítimo.</li>
          </ul>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            4. Derechos de Acceso, Rectificación y Supresión (Derechos ARCO)
          </h3>
          <p>
            De conformidad con la normativa argentina, los profesionales médicos titulares de los datos tienen derecho a acceder, rectificar, actualizar o suprimir sus datos de nuestra base de datos activa. Para ejercer este derecho, pueden enviar un correo electrónico formal a <strong>info@latmedical.com.ar</strong> adjuntando copia de su matrícula o credencial profesional para validar identidad.
          </p>
          
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)', marginTop: '2rem', marginBottom: '0.8rem' }}>
            5. Modificaciones a esta Política
          </h3>
          <p>
            Nos reservamos el derecho de modificar esta Política de Privacidad para adecuarla a cambios legislativos o nuevas directivas de ANMAT. El uso continuado del sitio web y los canales de WhatsApp oficiales posterior a las modificaciones implica la plena aceptación de la nueva versión.
          </p>

          <p style={{ marginTop: '3rem', fontSize: '0.85rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            Última actualización: Julio 2026. Latmedical International, Argentina.
          </p>
        </div>
      </section>
    </div>
  );
};
