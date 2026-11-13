import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { backendLink } from './legacyWebsite'
import { WebsiteContent } from './WebsiteContent'
import ImageWithFallback from './WebsiteImage'
import Spinner from '../../components/loaders/Spinner'
import { useTranslation } from '../../hooks/useTranslation'

const FALLBACK_SLIDES = [
  { src: '/img/hero-slider.jpg', alt: 'MSME Madhya Pradesh – Empowering Entrepreneurs' },
]

function validUpdates(items) {
  return (items || []).filter(item => {
    if (typeof item?.title !== 'string' || typeof item?.href !== 'string' || !item.href.trim()) return false
    const title = item.title.trim().replace(/\s+/g, ' ').toLowerCase()
    // Reject explicit test labels without matching words such as "latest" or "contest".
    return title && !/^(?:test|testing)(?:$|\s|[:_-])/.test(title)
  })
}

export default function HomePage() {
  const website = useOutletContext() || {}
  const { locale } = useTranslation()
  const hindi = locale === 'hi'
  const [tickerIndex, setTickerIndex] = useState(0)
  const [tickerPaused, setTickerPaused] = useState(false)
  const backendSlides = website.slides?.filter(Boolean)
  const slides = backendSlides?.length ? backendSlides : FALLBACK_SLIDES
  const [slideIndex, setSlideIndex] = useState(0)
  const activeSlide = slides[slideIndex % slides.length]

  const backendOfficers = website.officers?.filter(Boolean)
  const officers = backendOfficers?.length ? backendOfficers : []
  const validNews = validUpdates(website.news)
  const news = validNews

  const validCirculars = validUpdates(website.circulars)
  const circulars = validCirculars

  const backendEvents = website.events?.filter(Boolean) || []
  const events = backendEvents
  const ticker = validNews.slice(0, 5)
  useEffect(() => {
    if (ticker.length < 2 || tickerPaused) return
    const timer = setInterval(() => setTickerIndex(i => (i + 1) % ticker.length), 5000)
    return () => clearInterval(timer)
  }, [ticker.length, tickerPaused])
  const backendServices = website.features?.filter(Boolean)
  const services = backendServices?.length ? backendServices : []
  const [featurePosition, setFeaturePosition] = useState(0)
  const [featureTransition, setFeatureTransition] = useState(true)
  const [featuresPaused, setFeaturesPaused] = useState(false)
  const backendPartners = website.partners?.filter(Boolean)
  const partners = backendPartners?.length ? backendPartners : []
  const [partnerPosition, setPartnerPosition] = useState(0)
  const [partnerTransition, setPartnerTransition] = useState(true)
  const [partnersPaused, setPartnersPaused] = useState(false)
  const galleryPreview = website.gallery?.find(item => typeof item?.src === 'string' && item.src.trim())
  const hasAbout = website.about?.some(text => text.trim())

  useEffect(() => {
    setFeaturePosition(0)
    setFeatureTransition(true)
  }, [services.length])

  useEffect(() => {
    if (services.length <= 5 || featuresPaused) return undefined
    const timer = setInterval(() => {
      setFeatureTransition(true)
      setFeaturePosition(position => position + 1)
    }, 5000)
    return () => clearInterval(timer)
  }, [services.length, featuresPaused])

  useEffect(() => {
    if (featurePosition !== services.length) return undefined
    const timer = setTimeout(() => {
      setFeatureTransition(false)
      setFeaturePosition(0)
      requestAnimationFrame(() => setFeatureTransition(true))
    }, 650)
    return () => clearTimeout(timer)
  }, [featurePosition, services.length])

  useEffect(() => {
    if (partners.length <= 5 || partnersPaused) return undefined
    const timer = setInterval(() => {
      setPartnerTransition(true)
      setPartnerPosition(position => position + 1)
    }, 4500)
    return () => clearInterval(timer)
  }, [partners.length, partnersPaused])

  useEffect(() => {
    if (partnerPosition !== partners.length) return undefined
    const timer = setTimeout(() => {
      setPartnerTransition(false)
      setPartnerPosition(0)
      requestAnimationFrame(() => setPartnerTransition(true))
    }, 700)
    return () => clearTimeout(timer)
  }, [partnerPosition, partners.length])

  if (website.loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
        <Spinner />

      </div>
    )
  }

  return (
    <>
      {website.error && (
        <div className="container" role="alert">
          <p>{hindi ? 'वेबसाइट की सामग्री लोड नहीं हो सकी। कृपया पुनः प्रयास करें।' : 'Website content could not be loaded. Please retry.'}</p>
          {website.retry && <button type="button" className="btn btn-default" onClick={website.retry}>{hindi ? 'पुनः प्रयास करें' : 'Retry'}</button>}
        </div>
      )}
      {/* ── 1. Hero Slider Banner ────────────────────────────── */}
      <section className="hp-hero" aria-label="MSME Highlights" aria-roledescription="carousel">
        <div className="hp-hero__container">
          <div className="hp-hero__slide">
            {activeSlide?.href ? (
              <a href={activeSlide.href} style={{ display: 'block', height: '100%' }}>
                <ImageWithFallback src={activeSlide.src} alt={activeSlide.alt || 'MSME Madhya Pradesh'} fallback={<img src="/img/hero-slider.jpg" alt="MSME Madhya Pradesh" />} />
              </a>
            ) : (
              <ImageWithFallback src={activeSlide?.src} alt={activeSlide?.alt || 'MSME Madhya Pradesh'} fallback={<img src="/img/hero-slider.jpg" alt="MSME Madhya Pradesh" />} />
            )}
            <div className="hp-hero__overlay" aria-hidden="true" />
          </div>
          <button
            className="hp-hero__arrow hp-hero__arrow--prev"
            aria-label="Previous slide"
            onClick={() => setSlideIndex((i) => (i + slides.length - 1) % slides.length)}
          >
            <i className="fa fa-chevron-left" aria-hidden="true" />
          </button>
          <button
            className="hp-hero__arrow hp-hero__arrow--next"
            aria-label="Next slide"
            onClick={() => setSlideIndex((i) => (i + 1) % slides.length)}
          >
            <i className="fa fa-chevron-right" aria-hidden="true" />
          </button>
          <div className="hp-hero__dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`hp-hero__dot${i === slideIndex % slides.length ? ' active' : ''}`}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setSlideIndex(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. News Ticker ──────────────────────────────────── */}
      <div className="hp-ticker" aria-label={hindi ? 'नवीनतम समाचार' : 'Latest news'}
        onMouseEnter={() => setTickerPaused(true)} onMouseLeave={() => setTickerPaused(false)}
        onFocus={() => setTickerPaused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setTickerPaused(false) }}>
        <div className="hp-ticker__container">
          <span className="hp-ticker__label">{hindi ? 'नवीनतम' : 'LATEST'}</span>
          <div className="hp-ticker__track">
            {!ticker.length && <span>{hindi ? 'कोई नई सूचना उपलब्ध नहीं है।' : 'No new updates available.'}</span>}
            <div className="hp-ticker__inner hp-ticker__inner--manual" aria-live="polite">
              {ticker.slice(tickerIndex % (ticker.length || 1), tickerIndex % (ticker.length || 1) + 1).map((item, i) => (
                <a key={i} href={item.href} className="hp-ticker__item">
                  {item.title}
                  {item.date && <span> ({item.date})</span>}
                </a>
              ))}
            </div>
          </div>
          <div className="hp-ticker__controls">
            <button aria-label="Ticker previous" disabled={ticker.length < 2} onClick={() => setTickerIndex(i => (i + ticker.length - 1) % ticker.length)}>&#10094;</button>
            <button aria-label="Ticker next" disabled={ticker.length < 2} onClick={() => setTickerIndex(i => (i + 1) % ticker.length)}>&#10095;</button>
          </div>
        </div>
      </div>

      {/* ── 3. Department About Section ──────────────────────── */}
      <section className="hp-about" id="about" aria-labelledby="hp-about-title">
        <div className="hp-about__title-wrap">
          <h2 className="hp-about__title" id="hp-about-title">
            {website.departmentName || 'Department of Micro, Small & Medium Enterprises'}
          </h2>
        </div>
        <div className="hp-about__container">
          <div className="hp-about__officer">
            <OfficerCard officer={officers[0]} />
          </div>
          <div className="hp-about__content">
            <div className="hp-about__text">
              {hasAbout ? (
                website.aboutContent?.length ? <WebsiteContent nodes={website.aboutContent} /> : website.about.map((text, index) => <p key={index}>{text}</p>)
              ) : <p>{hindi ? 'सामग्री उपलब्ध नहीं है।' : 'Content is not available.'}</p>}
            </div>
          </div>
          <div className="hp-about__officer">
            <OfficerCard officer={officers[1]} />
          </div>
        </div>
        {/* Floating scroll to top button */}
        <button
          className="hp-about__scroll-top"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <i className="fa fa-chevron-up" aria-hidden="true" />
        </button>
      </section>

      {/* ── 4. Online Services (Teal Card Carousel Section) ── */}
      <section
        className="hp-features"
        id="services"
        aria-label="Online services"
        onMouseEnter={() => setFeaturesPaused(true)}
        onMouseLeave={() => setFeaturesPaused(false)}
        onFocus={() => setFeaturesPaused(true)}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFeaturesPaused(false)
        }}
      >
        <div className="hp-features__card-wrapper">
          {!services.length && <p role="status">{hindi ? 'सेवाओं की जानकारी उपलब्ध नहीं है।' : 'Service information is not available.'}</p>}
          <div className="hp-features__viewport" aria-live="polite">
            <div
              className="hp-features__track"
              style={{
                '--feature-offset': featurePosition,
                '--feature-transition': featureTransition ? 'transform 650ms cubic-bezier(.22, .61, .36, 1)' : 'none',
              }}
            >
              {[...services, ...services].map((item, itemIndex) => {
                const ServiceCard = item.href ? 'a' : 'div'
                return (
                  <ServiceCard
                    key={`${item.href}-${itemIndex}`}
                    href={item.href || undefined}
                    className="hp-features__item"
                    style={{ '--feature-image': item.src ? `url("${item.src}")` : 'none' }}
                  >
                    <div className="hp-features__icon-circle">
                      <ImageWithFallback
                        src={item.src}
                        alt={item.title || 'Online service'}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        fallback={<i className={`fa ${item.icon || 'fa-link'}`} aria-hidden="true" />}
                      />
                    </div>
                    <h3 className="hp-features__name">{item.title}</h3>
                    <span className="hp-features__separator" aria-hidden="true">
                      <span />
                    </span>
                    {item.description && <p className="hp-features__desc">{item.description}</p>}
                  </ServiceCard>
                )
              })}
            </div>
          </div>
          {/* Controls and dots */}
          {services.length > 5 && (
            <>
              <div className="hp-features__controls">
                <button
                  className="hp-features__nav-btn"
                  aria-label="Previous service slide"
                  onClick={() => {
                    setFeatureTransition(true)
                    setFeaturePosition(position => position === 0 ? services.length - 1 : position - 1)
                  }}
                >&#10094;</button>
                <button
                  className="hp-features__nav-btn"
                  aria-label="Next service slide"
                  onClick={() => {
                    setFeatureTransition(true)
                    setFeaturePosition(position => position + 1)
                  }}
                >&#10095;</button>
              </div>
              <div className="hp-features__dots" aria-label="Service slides">
                {services.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`hp-features__dot${index === featurePosition % services.length ? ' active' : ''}`}
                    aria-label={`Show service slide ${index + 1}`}
                    aria-current={index === featurePosition % services.length ? 'true' : undefined}
                    onClick={() => {
                      setFeatureTransition(true)
                      setFeaturePosition(index)
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── 5. 4-Column News, Circulars, Events & Gallery ──── */}
      <section className="hp-panels" aria-label="Information and updates">
        <div className="hp-panels__container">
          <NewsPanel
            number={1}
            title={hindi ? 'नया क्या है' : "WHAT'S NEW"}
            icon="fa-bullhorn"
            items={news}
            href="/website/whatsNew"
          />
          <NewsPanel
            number={2}
            title={hindi ? 'आदेश / परिपत्र' : 'ORDER/CIRCULARS'}
            icon="fa-file-text-o"
            items={circulars}
            href="/website/orderCirculars"
          />
          <NewsPanel
            number={3}
            title={hindi ? 'कार्यक्रम' : 'EVENTS'}
            icon="fa-calendar"
            items={events}
            href="/website/events"
          />
          <div className="hp-panel hp-panel--4" role="region" aria-labelledby="hp-gallery-hd">
            <h3 className="hp-panel__heading" id="hp-gallery-hd">
              <i className="fa fa-picture-o" aria-hidden="true" /> {hindi ? 'चित्र दीर्घा' : 'GALLERY SECTION'}
            </h3>
            <div className="hp-panel__body hp-panel__body--gallery">
              <a href={backendLink('/website/albums')} style={{ width: '100%' }}>
                <ImageWithFallback
                  src={galleryPreview?.src}
                  alt={galleryPreview?.alt || 'MSME gallery'}
                  className="hp-gallery__img"
                  fallback={<img src="/img/gallery-meeting.jpg" alt="MSME Conference and Meeting" className="hp-gallery__img" />}
                />
              </a>
            </div>
            <div className="hp-panel__footer">
              <a href={backendLink('/website/albums')} className="hp-panel__more">
                {hindi ? 'सभी देखें' : 'VIEW ALL'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Partner Logos ───────────────────────────────── */}
      <section
        className="hp-partners"
        aria-label="Our partners"
        onMouseEnter={() => setPartnersPaused(true)}
        onMouseLeave={() => setPartnersPaused(false)}
      >
        <div className="hp-partners__viewport">
          <div
            className="hp-partners__container"
            style={{
              '--partner-position': partnerPosition,
              '--partner-transition': partnerTransition ? 'transform 700ms ease' : 'none',
            }}
          >
            {[...partners, ...partners].map((item, i) => (
              <a
                key={`${item.href}-${i}`}
                href={item.href}
                className="hp-partners__item"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.title}
              >
                <ImageWithFallback
                  src={item.src}
                  alt={item.title}
                  style={{ width: '100%', maxWidth: 140, height: 48, objectFit: 'contain' }}
                  fallback={<span>{item.title}</span>}
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function OfficerCard({ officer }) {
  if (!officer) return null
  return (
    <figure className="hp-officer">
      <div className="hp-officer__photo">
        <ImageWithFallback src={officer.src} alt={officer.name}
          fallback={<span role="img" aria-label="Officer photo unavailable" style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}><i className="fa fa-user" aria-hidden="true" /></span>} />
      </div>
      <figcaption className="hp-officer__caption">
        <span className="hp-officer__name">{officer.name}</span>
        <span className="hp-officer__role">{officer.position}</span>
      </figcaption>
    </figure>
  )
}

function NewsPanel({ number, title, icon, items, href }) {
  const { locale } = useTranslation()
  const hindi = locale === 'hi'
  const [page, setPage] = useState(0)
  const pages = Math.ceil(items.length / 3)
  const current = Math.min(page, Math.max(0, pages - 1))
  return (
    <div className={`hp-panel hp-panel--${number}`} role="region" aria-labelledby={`hp-panel-hd-${number}`}>
      <h3 className="hp-panel__heading" id={`hp-panel-hd-${number}`}>
        <i className={`fa ${icon}`} aria-hidden="true" /> {title}
      </h3>
      <div className="hp-panel__body">
        <ul className="hp-panel__list">
          {items.length ? (
            items.slice(current * 3, current * 3 + 3).map((item, i) => (
              <li key={i} className="hp-panel__item">
                <a href={item.href}>{item.title}</a>
                {item.date && (
                  <span className="hp-panel__date">
                    <i className="fa fa-calendar" aria-hidden="true" /> {item.date}
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className="hp-panel__item">{hindi ? 'सामग्री उपलब्ध नहीं है।' : 'Content is not available.'}</li>
          )}
        </ul>
      </div>
      <div className="hp-panel__footer">
        <a href={backendLink(href)} className="hp-panel__more">
          {hindi ? 'और पढ़ें' : 'READ MORE'}
        </a>
        <div className="hp-panel__nav">
          <button aria-label={hindi ? 'पिछला' : 'Previous'} disabled={current === 0} onClick={() => setPage(current - 1)}>&#10094;</button>
          <button aria-label={hindi ? 'अगला' : 'Next'} disabled={current + 1 >= pages} onClick={() => setPage(current + 1)}>&#10095;</button>
        </div>
      </div>
    </div>
  )
}
