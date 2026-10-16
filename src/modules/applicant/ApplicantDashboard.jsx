import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import './applicant-dashboard.css'

export default function ApplicantDashboard() {
  const { locale } = useTranslation()
  const hindi = locale === 'hi'

  return (
    <div className="applicant-dashboard" lang={hindi ? 'hi' : 'en'}>
      <header className="applicant-dashboard__header">
        <span className="applicant-dashboard__eyebrow">{hindi ? 'एमपी एमएसएमई • आवेदक पोर्टल' : 'MP MSME • Applicant Portal'}</span>
        <h1>{hindi ? 'आवेदक डैशबोर्ड' : 'Applicant Dashboard'}</h1>
        <p>{hindi ? 'अपने आवेदन प्रबंधित करें और अपने उद्योग के लिए सही सेवा चुनें।' : 'Manage your applications and find the right services for your business.'}</p>
      </header>
      <h2 className="applicant-dashboard__section-title">{hindi ? 'आपकी सेवाएं' : 'Your Services'}</h2>

      {/* Quick Action Tiles */}
      <div className="applicant-dashboard__grid">
        {/* 1. Land Allotment Applications */}
        <div className="applicant-dashboard__cell">
          <div className="applicant-service">
            <div className="applicant-service__content">
              <span className="applicant-service__icon" aria-hidden="true"><i className="fa fa-file-text-o" /></span>
              <h3>
                {hindi ? 'भूमि आवंटन आवेदन' : 'Land Allotment Applications'}
              </h3>
              <p className="applicant-service__description">
                {hindi
                  ? 'आपके द्वारा जमा किए गए आवेदनों की स्थिति देखें व प्रबंधित करें'
                  : 'Track and monitor your submitted land applications and status'}
              </p>
            </div>
            <Link
              to="/applicant/land-allotment"
              className="applicant-service__link"
            >
              {hindi ? 'सभी आवेदन देखें' : 'View All Applications'} <span className="applicant-service__arrow" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* 2. Developed Land Allotment */}
        <div className="applicant-dashboard__cell">
          <div className="applicant-service">
            <div className="applicant-service__content">
              <span className="applicant-service__icon" aria-hidden="true"><i className="fa fa-building-o" /></span>
              <h3>
                {hindi ? 'विकसित भूमि आवंटन' : 'Developed Land Allotment'}
              </h3>
              <p className="applicant-service__description">
                {hindi
                  ? 'विकसित औद्योगिक क्षेत्रों में उपलब्ध भूखंडों की सूची देखें एवं आवेदन करें'
                  : 'Browse available industrial plots in developed areas and apply online'}
              </p>
            </div>
            <Link
              to="/applicant/land-allotment/new"
              className="applicant-service__link"
            >
              {hindi ? 'आवेदन शुरू करें' : 'Apply For Land'} <span className="applicant-service__arrow" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* 3. Undeveloped Land Allotment */}
        <div className="applicant-dashboard__cell">
          <div className="applicant-service">
            <div className="applicant-service__content">
              <span className="applicant-service__icon" aria-hidden="true"><i className="fa fa-map-marker" /></span>
              <h3>
                {hindi ? 'अविकसित भूमि आवंटन' : 'Undeveloped Land Allotment'}
              </h3>
              <p className="applicant-service__description">
                {hindi
                  ? 'अविकसित क्षेत्रों में बड़े औद्योगिक भूखंडों हेतु पार्सल देखें एवं आवेदन करें'
                  : 'Explore large industrial land parcels in undeveloped areas and quote'}
              </p>
            </div>
            <Link
              to="/applicant/land-allotment/explore"
              className="applicant-service__link"
            >
              {hindi ? 'अविकसित भूमि देखें' : 'Explore Land'} <span className="applicant-service__arrow" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* 4. MSME */}
        <div className="applicant-dashboard__cell">
          <div className="applicant-service">
            <div className="applicant-service__content">
              <span className="applicant-service__icon" aria-hidden="true"><i className="fa fa-bar-chart-o" /></span>
              <h3>
                {hindi ? 'एमएसएमई (वित्तीय सहायता)' : 'MSME'}
              </h3>
              <p className="applicant-service__description">
                {hindi
                  ? 'औद्योगिक इकाइयों हेतु वित्तीय सहायता, सब्सिडी एवं एमएसएमई पुरस्कार'
                  : 'Financial assistance, incentives and award schemes for MSME units'}
              </p>
            </div>
            <div className="applicant-service__actions">
              <Link
                to="/applicant/financial-assistance"
                className="applicant-service__link"
              >
                {hindi ? 'वित्तीय सहायता' : 'Financial Assistance'} <span className="applicant-service__arrow" aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                to="/applicant/msme-award"
                className="applicant-service__link applicant-service__link--secondary"
              >
                {hindi ? 'पुरस्कार' : 'Award'} <span className="applicant-service__arrow" aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

