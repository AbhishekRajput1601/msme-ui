import { useEffect, useState } from 'react'

// Remote CMS images must not leave an empty space indefinitely.
export default function WebsiteImage({ src, fallback, ...props }) {
  const [failedSources, setFailedSources] = useState(() => new Set())
  const [loadedSrc, setLoadedSrc] = useState(null)
  const failed = failedSources.has(src)
  useEffect(() => {
    if (!src || failed || loadedSrc === src) return
    const timer = setTimeout(() => setFailedSources(previous => new Set(previous).add(src)), 5000)
    return () => clearTimeout(timer)
  }, [src, failed, loadedSrc])
  if (!src || failed) return fallback
  return <img {...props} key={src} src={src} onLoad={() => setLoadedSrc(src)}
    onError={() => setFailedSources(previous => new Set(previous).add(src))} />
}
