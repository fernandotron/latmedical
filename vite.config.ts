import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    watch: {
      ignored: ['**/src/data/*.json']
    }
  },
  plugins: [
    react(),
    {
      name: 'save-data-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'POST') {
            let filename = '';
            if (req.url === '/api/save-products') {
              filename = 'src/data/products.json';
            } else if (req.url === '/api/save-inventory') {
              filename = 'src/data/inventory.json';
            } else if (req.url === '/api/save-settings') {
              filename = 'src/data/general_settings.json';
            } else if (req.url === '/api/save-slides') {
              filename = 'src/data/home_slides.json';
            } else if (req.url === '/api/save-orders') {
              filename = 'src/data/orders.json';
            }

            if (filename) {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const targetPath = path.resolve(filename);
                  fs.writeFileSync(targetPath, body, 'utf-8');
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true }));
                } catch (error: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: false, error: error.message }));
                }
              });
              return;
            }

            if (req.url === '/api/save-submissions') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const newSubmission = JSON.parse(body);
                  const subFile = 'public/api/data/form_submissions.json';
                  const targetPath = path.resolve(subFile);
                  
                  let existing = [];
                  if (fs.existsSync(targetPath)) {
                    const content = fs.readFileSync(targetPath, 'utf-8');
                    if (content.trim()) {
                      existing = JSON.parse(content);
                    }
                  }
                  
                  existing.push({
                    id: 'sub-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                    date: new Date().toLocaleString('es-AR'),
                    ...newSubmission
                  });
                  
                  fs.writeFileSync(targetPath, JSON.stringify(existing, null, 2), 'utf-8');
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true }));
                } catch (error: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: false, error: error.message }));
                }
              });
              return;
            }

            if (req.url === '/api/upload-image') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const payload = JSON.parse(body);
                  const { name, data } = payload;
                  
                  // Extract base64 part
                  const base64String = data.split(';base64,').pop();
                  
                  // Ensure upload folder exists
                  const uploadDir = path.resolve('public/images/uploads');
                  if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                  }
                  
                  const targetPath = path.join(uploadDir, name);
                  fs.writeFileSync(targetPath, base64String, { encoding: 'base64' });
                  
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, url: '/images/uploads/' + name }));
                } catch (error: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: false, error: error.message }));
                }
              });
              return;
            }
          }
          next();
        });
      }
    }
  ]
})
