import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { backendLink } from './legacyWebsite'
import { WebsiteContent } from './WebsiteContent'

const FALLBACK_SLIDES = [
  { src: '/img/hero-slider.jpg', alt: 'MSME Madhya Pradesh – Empowering Entrepreneurs' },
]

const FALLBACK_OFFICERS = [
  {
    src: '/img/chief-minister.png',
    name: 'Dr. Mohan Yadav',
    position: 'Hon. Chief Minister'
  },
  {
    src: '/img/minister.png',
    name: 'Shri Chetanya Kasyap',
    position: 'Hon. Minister'
  },
]

const FALLBACK_ABOUT = `Micro, Small & Medium Enterprises (MSME) is known as engine of economic growth and for promoting equitable development. To strengthen them Department of Micro, Small & Medium Enterprises (MSME) was formed on 5 April, 2016. The aim of MSME Department is to make such policies for MSMEs that not only make them competent but also help foster their development. The department helps MSMEs to promote socio-economic growth and employment opportunity in MP. By promoting rural entrepreneurship the department promotes the rural economy and hence empowers rural people in general and rural women in particular. It also provides access to credit, technology and local as well as global market for MSMEs. It also develops clusters to provide common minimum facility to MSMEs. Through Self-employment schemes it encourages youth to establish their enterprise at their home town/village.`

const FALLBACK_NEWS = [
  {
    title: 'Industrial Area Ratibad, District - Bhopal, Rate of Industrial Land for the year 2025-',
    href: backendLink('/website/whatsNew'),
    date: ''
  },
  {
    title: 'List of Recommended EoIs for issuance of Letter of Intent and Not Recommended EoIs',
    href: backendLink('/website/whatsNew'),
    date: '28/01/2026'
  },
]

const FALLBACK_CIRCULARS = [
  {
    title: 'Amendments in Coal Distribution Procedure & Policy - 2022',
    href: backendLink('/website/orderCirculars'),
    date: ''
  },
  {
    title: 'PMEGP New Guidelines 2022',
    href: backendLink('/website/orderCirculars'),
    date: '14/06/2022'
  },
  {
    title: 'Decisions of State Govt. on proposals of M/s Fairdeal Export Co-operative Society ltd.',
    href: backendLink('/website/orderCirculars'),
    date: ''
  },
]

const FALLBACK_EVENTS = [
  {
    title: 'Bharat Nutraverse Expo, New Delhi (7-9 September 2026)',
    href: backendLink('/website/events'),
    date: ''
  },
  {
    title: 'Bharat Nutraverse Expo, New Delhi (7-9 September 2026)',
    href: backendLink('/website/events'),
    date: ''
  },
]

const FALLBACK_TICKER = [
  {
    title: 'List of Recommended EoIs under the process held in July 2026',
    href: backendLink('/website/whatsNew')
  },
]

const FALLBACK_SERVICES = [
  {
    title: 'Mukhyamantri Udyam Kranti Yojana',
    description: 'Apply Online',
    href: backendLink('/website/home'),
    icon: 'fa-university',
  },
  {
    title: 'Udyam Registration',
    description: 'Udyam Registration is a government registration that is provided along with a recognition certificate and a unique number',
    href: 'https://udyamregistration.gov.in/',
    icon: 'fa-file-text-o',
  },
  {
    title: 'Lok Seva Guarantee',
    description: 'Services of MSME Department under Madhya Pradesh Public Services Guarantee Act, 2010',
    href: backendLink('/website/home'),
    icon: 'fa-shield',
  },
  {
    title: 'MSME Award',
    description: 'To recognize and honor the MSMEs of the state who play a vital role in the MSME\'s transformation',
    href: backendLink('/website/home'),
    icon: 'fa-trophy',
  },
  {
    title: 'Right to Information',
    description: 'Right to Information',
    href: backendLink('/website/home'),
    icon: 'fa-info-circle',
  },
]

const FALLBACK_PARTNERS = [
  { title: 'MP Govt Logo', href: 'https://mp.gov.in/' },
  { title: 'MSME India', href: 'https://msme.gov.in/' },
  { title: 'GeM Portal', href: 'https://gem.gov.in/' },
  { title: 'Invest MP', href: 'https://invest.mp.gov.in/' },
  { title: 'Digital India', href: 'https://digitalindia.gov.in/' },
  { title: 'Make in India', href: 'https://www.makeinindia.com/' },
]

export default function HomePage() {
  const website = useOutletContext() || {}
  const slides = FALLBACK_SLIDES
  const [slideIndex, setSlideIndex] = useState(0)
  const activeSlide = slides[slideIndex % slides.length]

  const officers = FALLBACK_OFFICERS
  const isRealNews = website.news?.length > 0 && !website.news.some(n => n.title?.toLowerCase().includes('test'))
  const news = isRealNews ? website.news : FALLBACK_NEWS

  const isRealCirculars = website.circulars?.length > 0 && !website.circulars.some(c => c.title?.toLowerCase().includes('test'))
  const circulars = isRealCirculars ? website.circulars : FALLBACK_CIRCULARS

  const events = website.events?.length ? website.events : FALLBACK_EVENTS
  const ticker = FALLBACK_TICKER

  if (website.loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 44, height: 44, border: '4px solid #f57c00', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#555' }}>Loading website content…</p>
      </div>
    )
  }

  return (
    <>
      {/* ── 1. Hero Slider Banner ────────────────────────────── */}
      <section className="hp-hero" aria-label="MSME Highlights" aria-roledescription="carousel">
        <div className="hp-hero__container">
          <div className="hp-hero__slide">
            <img src={activeSlide?.src || '/img/hero-slider.jpg'} alt={activeSlide?.alt || 'MSME Madhya Pradesh'} />
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
                className={`hp-hero__dot${i === slideIndex ? ' active' : ''}`}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setSlideIndex(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. News Ticker ──────────────────────────────────── */}
      <div className="hp-ticker" role="marquee" aria-label="Latest news">
        <div className="hp-ticker__container">
          <span className="hp-ticker__label">LATEST</span>
          <div className="hp-ticker__track">
            <div className="hp-ticker__inner">
              {[...ticker, ...ticker, ...ticker].map((item, i) => (
                <a key={i} href={item.href} className="hp-ticker__item">
                  {item.title}
                </a>
              ))}
            </div>
          </div>
          <div className="hp-ticker__controls">
            <button aria-label="Ticker previous">&#10094;</button>
            <button aria-label="Ticker next">&#10095;</button>
          </div>
        </div>
      </div>

      {/* ── 3. Department About Section ──────────────────────── */}
      <section className="hp-about" id="about" aria-labelledby="hp-about-title">
        <div className="hp-about__title-wrap">
          <h2 className="hp-about__title" id="hp-about-title">
            Department of Micro, Small & Medium Enterprises
          </h2>
        </div>
        <div className="hp-about__container">
          <div className="hp-about__officer">
            <OfficerCard officer={officers[0]} />
          </div>
          <div className="hp-about__content">
            <div className="hp-about__text">
              <p>{FALLBACK_ABOUT}</p>
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
      <section className="hp-features" id="services" aria-label="Online services">
        <div className="hp-features__card-wrapper">
          <div className="hp-features__container">
            {FALLBACK_SERVICES.map((item) => (
              <a key={item.title} href={item.href} className="hp-features__item">
                <div className="hp-features__icon-circle">
                  <i className={`fa ${item.icon}`} aria-hidden="true" />
                </div>
                <h3 className="hp-features__name">{item.title}</h3>
                {item.description && <p className="hp-features__desc">{item.description}</p>}
              </a>
            ))}
          </div>
          {/* Controls and dots */}
          <div className="hp-features__controls">
            <button className="hp-features__nav-btn" aria-label="Previous service">&#10094;</button>
            <button className="hp-features__nav-btn" aria-label="Next service">&#10095;</button>
          </div>
          <div className="hp-features__dots">
            {Array.from({ length: 17 }).map((_, i) => (
              <span key={i} className={`hp-features__dot${i === 8 ? ' active' : ''}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. 4-Column News, Circulars, Events & Gallery ──── */}
      <section className="hp-panels" aria-label="Information and updates">
        <div className="hp-panels__container">
          <NewsPanel
            number={1}
            title="WHAT'S NEW"
            icon="fa-bullhorn"
            items={news}
            href="/website/whatsNew"
          />
          <NewsPanel
            number={2}
            title="ORDER/CIRCULARS"
            icon="fa-file-text-o"
            items={circulars}
            href="/website/orderCirculars"
          />
          <NewsPanel
            number={3}
            title="EVENTS"
            icon="fa-calendar"
            items={events}
            href="/website/events"
          />
          <div className="hp-panel hp-panel--4" role="region" aria-labelledby="hp-gallery-hd">
            <h3 className="hp-panel__heading" id="hp-gallery-hd">
              <i className="fa fa-picture-o" aria-hidden="true" /> GALLERY SECTION
            </h3>
            <div className="hp-panel__body hp-panel__body--gallery">
              <a href={backendLink('/website/albums')} style={{ width: '100%' }}>
                <img
                  src="/img/gallery-meeting.jpg"
                  alt="MSME Conference and Meeting"
                  className="hp-gallery__img"
                />
              </a>
            </div>
            <div className="hp-panel__footer">
              <a href={backendLink('/website/albums')} className="hp-panel__more">
                VIEW ALL
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Partner Logos ───────────────────────────────── */}
      <section className="hp-partners" aria-label="Our partners">
        <div className="hp-partners__container">
          {FALLBACK_PARTNERS.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="hp-partners__item"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.title}
            >
              <span>{item.title}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

function OfficerCard({ officer }) {
  return (
    <figure className="hp-officer">
      <div className="hp-officer__photo">
        <img src={officer.src} alt={officer.name} />
      </div>
      <figcaption className="hp-officer__caption">
        <span className="hp-officer__name">{officer.name}</span>
        <span className="hp-officer__role">{officer.position}</span>
      </figcaption>
    </figure>
  )
}

function NewsPanel({ number, title, icon, items, href }) {
  return (
    <div className={`hp-panel hp-panel--${number}`} role="region" aria-labelledby={`hp-panel-hd-${number}`}>
      <h3 className="hp-panel__heading" id={`hp-panel-hd-${number}`}>
        <i className={`fa ${icon}`} aria-hidden="true" /> {title}
      </h3>
      <div className="hp-panel__body">
        <ul className="hp-panel__list">
          {items.length ? (
            items.map((item, i) => (
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
            <li className="hp-panel__item">Content awaited.</li>
          )}
        </ul>
      </div>
      <div className="hp-panel__footer">
        <a href={backendLink(href)} className="hp-panel__more">
          READ MORE
        </a>
        <div className="hp-panel__nav">
          <button aria-label="Previous">&#10094;</button>
          <button aria-label="Next">&#10095;</button>
        </div>
      </div>
    </div>
  )
}
