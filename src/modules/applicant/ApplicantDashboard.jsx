import React from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import ApplicantOverview from './ApplicantOverview'
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
      <ApplicantOverview hindi={hindi} />
    </div>
  )
}

