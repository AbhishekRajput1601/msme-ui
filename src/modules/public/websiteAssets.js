const assetRoot = '/legacy/pages/website/msme_new/app_assets/assets_img'
const bundledImages = new Set([
  'finance.png', 'registration.png', 'council.png', 'jobs.png',
  'infrastructure.png', 'employment.png', 'MSME_logo.png',
  'banner1.jpg', 'banner2.jpg', 'msme.jpg', 'Government_E_Marketplace_logo.jpg',
  'MSME_Award_Image.jpg', 'MyGov-MP-logo.jpg', 'Standup.jpg',
])

// These unavailable CMS uploads have no bundled copy. Let the existing image
// components show their fallback without waiting for the unreachable CMS port.
const unavailableImages = new Set(['CM_ReliefFund.jpeg', 'MSME logo 2.png'])

export function resolveWebsiteAsset(url) {
  if (url.hostname !== 'mpmsme.gov.in' || !url.pathname.startsWith('/mpmsmecms/')) return null
  let filename
  try {
    filename = decodeURIComponent(url.pathname.split('/').pop()).replace(/^\d{14}/, '')
  } catch { return null }
  if (bundledImages.has(filename)) return `${assetRoot}/${filename}`
  if (url.port === '8080' && unavailableImages.has(filename)) return ''
  if (url.pathname.endsWith('/27042017025301logo.jpg')) return `${assetRoot}/project-profile.jpg`
  return null
}
