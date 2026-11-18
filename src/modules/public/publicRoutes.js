const authPages = {
  '/website/home': '/', '/website/login': '/login', '/website/viewsignup': '/signup',
  '/website/viewforgotpassword': '/forgot-password', '/website/viewforgotusername': '/forgot-username',
  '/msefcLanding/caseListLanding': '/website/msefc-cases',
  '/msefcLanding/home': '/website/facilitation-council',
  '/idLanding/vacantLandListLanding': '/website/vacant-land-developed',
  '/idLanding/vacantLandListLandingUL': '/website/vacant-land-undeveloped',
  '/idLanding/seekingLandAllotmentReport': '/website/land-reports',
  '/idLanding/unifiedPortal/applicationStatus': '/website/application-status',
  '/advanceSearch/home': '/website/advanceSearch',
  '/advanceSearch/advanceSearchLanding': '/website/advanceSearch',
  '/orderCirculars': '/website/orderCirculars',
}

export function publicPagePath(pathname) {
  const clean = pathname.replace(/^\/(mpmsme|backend)(?=\/)/, '').replace(/\/$/, '')
  if (authPages[clean]) return authPages[clean]
  if (/^\/website\/[^/.]+$/.test(clean) && !/^\/website\/(captcha|signup|presignup|presignupauth|resetpassword|login-through-mobile.*|fetch.*)$/.test(clean)) return clean
  return null
}

/** Dedicated transport prefix: fetching a document must never return Vite's SPA. */
export const backendUrl = path => `/backend${path.startsWith('/') ? path : `/${path}`}`
