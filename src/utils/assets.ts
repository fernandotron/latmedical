export const getAssetUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  
  // Detect basename dynamically based on the current URL path
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
    '/contacto', 
    '/admin', 
    '/inicio', 
    '/index.html',
    '/politica-de-privacidad',
    '/politica-de-cookies',
    '/terminos-y-condiciones'
  ];
  let sub = window.location.pathname;
  routes.forEach(r => {
    if (sub.endsWith(r)) {
      sub = sub.substring(0, sub.length - r.length);
    }
  });
  
  if (sub.includes('/producto/')) {
    sub = sub.split('/producto/')[0];
  }
  
  if (sub.endsWith('/')) {
    sub = sub.substring(0, sub.length - 1);
  }
  
  return sub + cleanPath;
};
