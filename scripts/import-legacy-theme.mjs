import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import postcss from 'postcss'

// Read-only import from the original webapp. No Java, templates or scripts are copied.
const source = process.argv[2]
if (!source || !fs.existsSync(path.join(source, 'css/sb-admin-2.css'))) {
  throw new Error('Usage: node scripts/import-legacy-theme.mjs <original-webapp-directory>')
}
const output = path.resolve('public/legacy')
const website = 'pages/website/msme_new/app_assets'
const manifest = []
const missingImages = new Set()
function copy(relative) {
  const from = path.join(source, relative)
  const to = path.join(output, relative)
  if (fs.statSync(from).isDirectory()) {
    for (const entry of fs.readdirSync(from)) copy(`${relative}/${entry}`)
    return
  }
  if (!/\.(css|woff2?|ttf|eot|otf|png|jpe?g|gif|svg|bmp|ico)$/i.test(relative)) return
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to)
  manifest.push({ file: relative, sha256: createHash('sha256').update(fs.readFileSync(from)).digest('hex') })
}
for (const relative of [website + '/assets_img', website + '/fonts', website + '/assets_css',
  'image', 'fonts', 'font-awesome-4.1.0', 'pages/website/logo', 'pages/website/images',
  'css/bootstrap.min.css', 'css/sb-admin-2.css']) copy(relative)

function scoped(relative, scope) {
  const root = postcss.parse(fs.readFileSync(path.join(source, relative), 'utf8'))
  root.walkRules(rule => {
    if (rule.parent.type === 'atrule' && /keyframes$/.test(rule.parent.name)) return
    rule.selectors = rule.selectors.map(selector => {
      const normalized = selector.replace(/^(html\s+body|html|body|:root)(?=[\s.:#[]|$)/, scope)
      return normalized.startsWith(scope) ? normalized : `${scope} ${normalized}`
    })
  })
  root.walkDecls(decl => {
    decl.value = decl.value.replace(/url\((['"]?)([^)'"\s]+)\1\)/g, (match, quote, url) => {
      if (/^(data:|https?:|\/|#)/.test(url)) return match
      const asset = path.posix.normalize(path.posix.join(path.posix.dirname(relative), url))
      if (!fs.existsSync(path.join(source, asset.split(/[?#]/)[0]))) {
        missingImages.add(asset)
        return 'none'
      }
      return `url("/legacy/${asset}")`
    })
  })
  root.walkComments(comment => { if (/sourceMappingURL/.test(comment.text)) comment.remove() })
  return `/* Original: ${relative}. Selectors scoped for React. */\n${root.toString()}`
}
fs.mkdirSync('src/styles', { recursive: true })
fs.writeFileSync('src/styles/legacy-public.css', [
  `${website}/assets_css/bootstrap.min.css`, `${website}/assets_css/main_css.css`,
  `${website}/assets_css/modern-ticker.css`, `${website}/assets_css/theme1.css`,
].map(file => scoped(file, '.legacy-public')).join('\n'))
fs.writeFileSync('src/styles/legacy-portal.css', ['css/bootstrap.min.css', 'css/sb-admin-2.css']
  .map(file => scoped(file, '.legacy-portal')).join('\n'))
fs.writeFileSync(path.join(output, 'asset-manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
fs.writeFileSync(path.join(output, 'missing-source-assets.json'), JSON.stringify([...missingImages], null, 2) + '\n')
console.log(`Imported ${manifest.length} original style, font and image files; generated scoped stylesheets.`)
