import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'

const readers = [
  { name: 'NVDA (NonVisual Desktop Access)', href: 'https://www.nvaccess.org/about-nvda/' },
  { name: 'JAWS', href: 'https://vispero.com/jaws-screen-reader-software/' },
  { name: 'Microsoft Narrator', href: 'https://support.microsoft.com/en-us/accessibility/windows/narrator/complete-guide-to-narrator' },
]

export default function ScreenReaderPage() {
  const { locale } = useTranslation()
  const hindi = locale === 'hi'
  const title = hindi ? 'स्क्रीन रीडर सुविधा' : 'Screen Reader Access'
  const heading = useRef(null)

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} | MPMSME`
    heading.current?.focus()
    return () => { document.title = previousTitle }
  }, [title])

  return (
    <article className="container screen-reader-page" lang={hindi ? 'hi' : 'en'} aria-labelledby="screen-reader-title">
      <nav aria-label={hindi ? 'पृष्ठ पथ' : 'Breadcrumb'}>
        <Link to="/">{hindi ? 'मुख्य पृष्ठ' : 'Home'}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{title}</span>
      </nav>
      <h1 id="screen-reader-title" ref={heading} tabIndex={-1}>{title}</h1>
      <p>{hindi
        ? 'स्क्रीन रीडर स्क्रीन पर मौजूद पाठ और नियंत्रणों की जानकारी बोलकर या ब्रेल में देते हैं। वेबसाइट का उपयोग करने के लिए अपने उपकरण पर स्क्रीन रीडर चालू करें।'
        : 'Screen readers present text and controls through speech or braille. Enable a screen reader on your device to use it while browsing this website.'}</p>
      <section aria-labelledby="screen-reader-navigation">
        <h2 id="screen-reader-navigation">{hindi ? 'वेबसाइट पर नेविगेशन' : 'Navigating the website'}</h2>
        <ul>
          <li>{hindi ? 'लिंक और नियंत्रणों के बीच जाने के लिए Tab और वापस जाने के लिए Shift + Tab दबाएँ।' : 'Press Tab to move between links and controls, and Shift + Tab to move backwards.'}</li>
          <li>{hindi ? 'लिंक खोलने के लिए Enter दबाएँ। बटन सक्रिय करने के लिए Enter या Space दबाएँ।' : 'Press Enter to open a link. Press Enter or Space to activate a button.'}</li>
          <li>{hindi ? 'शीर्ष पर दिए गए “Skip to Main Content” और “Skip to Navigation” लिंक का उपयोग करके संबंधित भाग पर जाएँ।' : 'Use “Skip to Main Content” or “Skip to Navigation” in the toolbar to jump to that part of the page.'}</li>
          <li>{hindi ? 'शीर्ष पर दिए गए A−, A और A+ बटन से पाठ का आकार बदलें। थीम बटन से उच्च कंट्रास्ट चुनें।' : 'Use the A−, A and A+ toolbar buttons to adjust text size, and the theme buttons to select high contrast.'}</li>
        </ul>
      </section>
      <section aria-labelledby="screen-reader-resources">
        <h2 id="screen-reader-resources">{hindi ? 'स्क्रीन रीडर संसाधन' : 'Screen reader resources'}</h2>
        <p>{hindi ? 'स्थापना और उपयोग के निर्देशों के लिए इन आधिकारिक वेबसाइटों पर जाएँ।' : 'Visit these official websites for setup and usage instructions.'}</p>
        <ul>{readers.map(reader => <li key={reader.name}><a href={reader.href} lang="en">{reader.name}</a></li>)}</ul>
      </section>
    </article>
  )
}
