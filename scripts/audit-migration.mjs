import fs from 'node:fs'
import path from 'node:path'
import { matchRoutes } from 'react-router-dom'
import { resolveLegacyHashRoute } from '../src/routes/roleRoutes.js'

// Read-only source inventory. Outputs are evidence, not a functional parity score.
const legacy = path.resolve(process.argv[2] || 'E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp')
const output = path.resolve('artifacts/migration-audit')
fs.mkdirSync(output, { recursive: true })
const read = file => fs.readFileSync(file, 'utf8')
const slash = value => value.replaceAll('\\', '/')
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? files(file) : [file]
  })
}
// Preserve offsets/line numbers and quoted URLs while removing JS comments.
function uncomment(source) {
  return source.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\/\*[\s\S]*?\*\/|\/\/[^\r\n]*)/g,
    (whole, string) => string || whole.replace(/[^\r\n]/g, ' '))
}
function csv(name, rows) {
  const keys = Object.keys(rows[0] || {})
  const cell = value => `"${String(value ?? '').replaceAll('"', '""')}"`
  fs.writeFileSync(path.join(output, name), '\uFEFF' + [keys, ...rows.map(row => keys.map(key => row[key]))].map(row => row.map(cell).join(',')).join('\r\n') + '\r\n')
}
const react = []
let parent = ''
read('src/routes/AppRoutes.jsx').split(/\r?\n/).forEach((line, index) => {
  if (line.includes('</Route>')) parent = ''
  const parentMatch = line.match(/^\s+path="([^"]+)"/)
  if (parentMatch) parent = parentMatch[1]
  const leaf = line.match(/<Route\s+path="([^"]+)"\s+element=\{<([\w]+)/)
  if (!leaf) return
  const route = leaf[1].startsWith('/') || leaf[1] === '*' ? leaf[1] : `${parent}/${leaf[1]}`
  const component = leaf[2]
  const status = component === 'LegacyHashRedirect' || component === 'Navigate' ? 'Redirect only'
    : component === 'NotFoundPage' ? '404 fallback'
      : ['AdminDashboard', 'DepartmentDashboard'].includes(component) ? 'Static dashboard; reused for other routes'
        : component === 'ApplicantDashboard' && !route.endsWith('/dashboard') ? 'Dashboard placeholder'
          : component === 'HomePage' && route !== '/' ? 'Homepage alias; no dedicated page'
            : 'Page component exists; functionality/content parity unverified'
  react.push({ path: route, component, status, source: `src/routes/AppRoutes.jsx:${index + 1}` })
})
const routeTree = react.filter(row => row.path !== '*').map(row => ({ path: row.path, handle: row }))
const match = route => matchRoutes(routeTree, route.replace(/:[\w]+/g, 'audit-id'))?.at(-1)?.route.handle
const planned = new Map()
let docFile = ''
for (const line of read('route-mapping.md').split(/\r?\n/)) {
  const file = line.match(/Angular File\*\*: `[^`]*webapp\/(.*?)`/)
  if (file) docFile = file[1]
  const row = line.match(/^\| `#([^`]+)` \| `([^`]+)`/)
  if (row) planned.set(`${docFile}|${row[1]}`, row[2])
}
const angularFiles = files(path.join(legacy, 'angular')).filter(file => file.endsWith('.js') && !file.endsWith('.min.js'))
const routes = []
for (const file of angularFiles) {
  const source = uncomment(read(file))
  if (!source.includes('$routeProvider')) continue
  const registrations = [...source.matchAll(/\.when\(\s*(['"])(.*?)\1\s*,/g)]
  registrations.forEach((entry, index) => {
    const body = source.slice(entry.index, registrations[index + 1]?.index ?? source.length)
    const fileName = slash(path.relative(legacy, file))
    const destination = planned.get(`${fileName}|${entry[2]}`) || ''
    const target = destination ? match(destination) : null
    routes.push({ module: fileName.split('/')[1], file: fileName, line: source.slice(0, entry.index).split('\n').length,
      legacyHash: `#${entry[2]}`, templateExpression: body.match(/templateUrl\s*:\s*([^\r\n]+)/)?.[1]?.trim() || '',
      controller: body.match(/controller\s*:\s*['"]([^'"]+)/)?.[1] || '',
      documentedReactRoute: destination, matchedComponent: target?.component || '',
      routeStatus: !destination ? 'No documented mapping; manual review' : !target ? 'Documented route missing from React' : target.status,
      parity: 'Not established; route match alone is insufficient' })
  })
}
const templates = files(path.join(legacy, 'pages')).filter(file => /\.(html|jsp)$/i.test(file)).map(file => ({
  file: slash(path.relative(legacy, file)), group: slash(path.relative(path.join(legacy, 'pages'), file)).split('/')[0],
  parity: 'Legacy template inventoried; field/content comparison not completed',
}))
const translations = [
  ['/applicant/home', '#/dashboard'], ['/applicant/home', '#/id/landApplications'],
  ['/applicant/home', '#/id/landAllotment'], ['/applicant/home', '#/id/vacantLands'],
  ['/applicant/home', '#/changepassword'], ['/applicant/home', '#/updateindustryprofileapplicant'],
  ['/applicant/home', '#/fa/newapplicantform'], ['/adminSection/home', '#/addOfficer'],
  ['/dtic/home', '#/changepassword'], ['/idSection/home', '#/dashboard'],
].map(([entry, hash]) => {
  const destination = resolveLegacyHashRoute(entry, hash)
  const target = match(destination)
  return { legacyUrl: entry + hash, actualReactDestination: destination, matchedComponent: target?.component || '', status: target?.status || 'Missing React route (404)' }
})
csv('react-routes.csv', react)
csv('angular-routes.csv', routes)
csv('legacy-templates.csv', templates)
csv('legacy-redirect-checks.csv', translations)
const byModule = {}
for (const row of routes) {
  const count = byModule[row.module] ||= { declarations: 0, mappedRouteExists: 0, documentedRouteMissing: 0, noDocumentedMapping: 0 }
  count.declarations++
  if (row.matchedComponent) count.mappedRouteExists++
  else if (row.documentedReactRoute) count.documentedRouteMissing++
  else count.noDocumentedMapping++
}
const summary = {
  generatedAt: new Date().toISOString(), legacyRoot: slash(legacy),
  scope: 'Static route inventory, documented mapping cross-check, and selected actual redirect resolutions. Not an end-to-end content or workflow certification.',
  angularRoutingFiles: new Set(routes.map(row => row.file)).size,
  angularRouteDeclarations: routes.length,
  uniqueFileAndHashPairs: new Set(routes.map(row => row.file + row.legacyHash)).size,
  legacyTemplateFiles: templates.length,
  reactExplicitPathDeclarations: react.length,
  reactRedirectDeclarations: react.filter(row => row.status === 'Redirect only').length,
  distinctReactPageComponents: [...new Set(react.filter(row => !['Redirect only', '404 fallback'].includes(row.status)).map(row => row.component))],
  byModule,
}
fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n')
console.log(JSON.stringify(summary, null, 2))
console.table(translations)
