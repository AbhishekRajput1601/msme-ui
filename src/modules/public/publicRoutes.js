const authPages = {
  '/website/home': '/', '/website/login': '/login', '/website/viewsignup': '/signup',
  '/website/viewforgotpassword': '/forgot-password', '/website/viewforgotusername': '/forgot-username',
}

export function publicPagePath(pathname) {
  const clean = pathname.replace(/^\/(mpmsme|backend)(?=\/)/, '').replace(/\/$/, '')
  if (authPages[clean]) return authPages[clean]
  if (/^\/website\/[^/.]+$/.test(clean) && !/^\/website\/(captcha|signup|presignup|presignupauth|resetpassword|login-through-mobile.*|fetch.*)$/.test(clean)) return clean
  return null
}

/** Dedicated transport prefix: fetching a document must never return Vite's SPA. */
export const backendUrl = path => `/backend${path.startsWith('/') ? path : `/${path}`}`
