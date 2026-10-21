import { useEffect, useRef, useState } from 'react'
import toast from '../../../utils/toast'

let library
function loadLeaflet() {
  if (!library) library = new Promise((resolve, reject) => {
    if (window.L) { resolve(window.L); return }
    const css = document.createElement('link')
    css.rel = 'stylesheet'; css.href = '/legacy/js/leaflet/leaflet.css'; document.head.append(css)
    const script = document.createElement('script')
    script.src = '/legacy/js/leaflet/leaflet.js'
    script.onload = () => resolve(window.L)
    script.onerror = () => { library = null; reject(new Error('The map could not be loaded.')) }
    document.head.append(script)
  })
  return library
}

export default function InfrastructureMap({ state }) {
  const host = useRef(null), mapRef = useRef(null), polygonRef = useRef(null)
  const [ready,setReady] = useState(false), [error,setError] = useState('')
  useEffect(() => {
    let disposed = false, marker
    loadLeaflet().then(L => {
      if (disposed) return
      const map = L.map(host.current).setView([23.25,77.41],6)
      mapRef.current = map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:18, attribution:'© OpenStreetMap contributors' }).addTo(map)
      L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom:19, subdomains:['mt0','mt1','mt2','mt3'], attribution:'Google' }).addTo(map)
      map.on('click', ({ latlng }) => {
        if (latlng.lat < 21 || latlng.lat > 27 || latlng.lng < 74 || latlng.lng > 83) {
          toast.warning('Location must be within Madhya Pradesh')
          return
        }
        if (marker) map.removeLayer(marker)
        marker = L.marker(latlng).addTo(map)
        state.vacantLandData.latitude = latlng.lat.toFixed(6)
        state.vacantLandData.longitude = latlng.lng.toFixed(6)
        state.notify()
      })
      setReady(true)
    }).catch(e => {
      if (!disposed) {
        setError(e.message)
        toast.error(e.message || 'Failed to load map.')
      }
    })
    return () => { disposed = true; mapRef.current?.remove(); mapRef.current = null; polygonRef.current = null }
  }, [state])
  useEffect(() => {
    if (!ready || !state.mapPoints?.length) return
    const map = mapRef.current
    if (polygonRef.current) map.removeLayer(polygonRef.current)
    polygonRef.current = window.L.polygon(state.mapPoints, { color:'blue',weight:2,fillColor:'lightblue',fillOpacity:0.5 }).addTo(map)
    map.fitBounds(polygonRef.current.getBounds())
  }, [ready,state.mapPoints])
  return <>{error && <p role="alert">{error}</p>}<div ref={host} id="map" aria-label="Vacant land location map" style={{ height:400, width:'100%' }} /></>
}
