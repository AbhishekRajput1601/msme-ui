import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { publicPagePath } from './src/modules/public/publicRoutes.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    watch: {
      ignored: ['**/artifacts/**'],
    },
    proxy: {
      '/backend': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/backend/, ''),
        configure: proxy => proxy.on('proxyRes', (response, request) => {
          const location = response.headers.location
          if (!location) return
          const target = new URL(location, `http://localhost:8080${request.url}`)
          if (target.origin === 'http://localhost:8080') response.headers.location = `/backend${target.pathname}${target.search}${target.hash}`
        }),
      },
      // These migrated page URLs must reach React, including old bookmarks.
      '^/(?:mpmsme/)?website/screen-reader/?(?:\\?|$)': {
        target: 'http://localhost:8080',
        bypass: () => '/index.html',
      },
      '/mpmsme': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        autoRewrite: true,
        bypass: (req) => {
          // Workflow fragment requests need the backend-selected HTML, not the SPA shell.
          if (req.headers['x-requested-with'] === 'XMLHttpRequest') return null
          const accept = req.headers['accept'] || ''
          const url = req.url || ''
          if (
            url.includes('/captcha') ||
            url.includes('j_spring_security_check') ||
            url.includes('/logout') ||
            url.includes('/fetch') ||
            url.includes('/download') ||
            // Meeting agenda opens in a new tab with an HTML Accept header,
            // but Spring returns an Excel attachment rather than a React page.
            url.includes('/generateExcelNewMeetingAgenda/') ||
            url.includes('/upload') ||
            req.method === 'POST'
          ) {
            return null // proxy to backend
          }
          if (req.method === 'GET' && accept.includes('text/html')) {
            return '/index.html'
          }
          return null
        },
        rewrite: (path) => path.replace(/^\/mpmsme/, ''),
        headers: {
          'X-Forwarded-Host': 'localhost:5173',
          'X-Forwarded-Proto': 'http',
          'X-Forwarded-Port': '5173',
        },
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const location = proxyRes.headers['location']
            if (location && location.includes('localhost:8080')) {
              proxyRes.headers['location'] = location.replace('localhost:8080', 'localhost:5173')
            }
          })
        },
      },
      // Fallback proxy for legacy static assets so they don't 404 if requested
      '^/(js|angular|css|images|img)/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Backend routes running directly on context root (port 8080)
      '^/(website|pages|j_spring_security_check|logout|applicant|idSection|zonal|dtic|idLanding|enterCompliance|addAppeal|uploadQueryDoc|fetchApplicationNoticeList)': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        autoRewrite: true,
        // Crucial: If browser navigates directly to a page route (e.g. /applicant/dashboard, /applicant/home)
        // with Accept: text/html, DO NOT proxy it to Tomcat (which serves the old AngularJS page).
        // Let Vite serve index.html so React Router renders the new React application!
        bypass: (req) => {
          const accept = req.headers['accept'] || ''
          const url = req.url || ''
          if (req.method === 'GET' && accept.includes('text/html') && url.startsWith('/applicant/land-allotment/')) return '/index.html'
          if (req.method === 'GET' && accept.includes('text/html') && url.startsWith('/applicant/msme-award/')) return '/index.html'
          if (req.method === 'GET' && accept.includes('text/html') && publicPagePath(url.split('?')[0])) return '/index.html'
          // Allow captcha image, static scripts/css, or API requests through to Tomcat:
          if (
            url.includes('/captcha') ||
            url.includes('j_spring_security_check') ||
            url.includes('/logout') ||
            url.startsWith('/pages/') ||
            url.includes('/fetch') ||
            url.includes('/download') ||
            url.includes('/upload') ||
            req.method === 'POST'
          ) {
            return null // proxy to backend
          }
          // If browser is requesting an HTML page navigation, do not proxy to legacy Tomcat
          if (accept.includes('text/html')) {
            return '/index.html'
          }
          return null
        },
        headers: {
          'X-Forwarded-Host': 'localhost:5173',
          'X-Forwarded-Proto': 'http',
          'X-Forwarded-Port': '5173',
        },
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const location = proxyRes.headers['location']
            if (location && location.includes('localhost:8080')) {
              proxyRes.headers['location'] = location.replace('localhost:8080', 'localhost:5173')
            }
          })
        },
      },
    },
  },
})
