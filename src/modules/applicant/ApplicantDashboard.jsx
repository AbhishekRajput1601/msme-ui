import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'

export default function ApplicantDashboard() {
  const { t, locale } = useTranslation()
  const hindi = locale === 'hi'

  return (
    <div className="legacy-dashboard p-4">
      <h1 className="page-header text-xl font-bold text-gray-800 border-b pb-2 mb-4">
        {t('nav.dashboard', 'Applicant Dashboard')}
      </h1>

      {/* Quick Action Tiles */}
      <div className="row mb-4">
        {/* 1. Land Allotment Applications */}
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="panel panel-primary border border-blue-200 rounded p-4 bg-blue-50 shadow-sm flex flex-col justify-between h-full">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                {hindi ? 'भूमि आवंटन आवेदन' : 'Land Allotment Applications'}
              </h4>
              <p className="text-xs text-blue-700 mb-4 mt-2">
                {hindi
                  ? 'आपके द्वारा जमा किए गए आवेदनों की स्थिति देखें व प्रबंधित करें'
                  : 'Track and monitor your submitted land applications and status'}
              </p>
            </div>
            <Link
              to="/applicant/land-allotment"
              className="btn btn-sm btn-primary inline-block text-xs font-semibold px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 self-start"
            >
              {hindi ? 'सभी आवेदन देखें' : 'View All Applications'} &rarr;
            </Link>
          </div>
        </div>

        {/* 2. Developed Land Allotment */}
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="panel panel-success border border-emerald-200 rounded p-4 bg-emerald-50 shadow-sm flex flex-col justify-between h-full">
            <div>
              <h4 className="font-semibold text-emerald-900 mb-1">
                {hindi ? 'विकसित भूमि आवंटन' : 'Developed Land Allotment'}
              </h4>
              <p className="text-xs text-emerald-700 mb-4 mt-2">
                {hindi
                  ? 'विकसित औद्योगिक क्षेत्रों में उपलब्ध भूखंडों की सूची देखें एवं आवेदन करें'
                  : 'Browse available industrial plots in developed areas and apply online'}
              </p>
            </div>
            <Link
              to="/applicant/land-allotment/new"
              className="btn btn-sm btn-success inline-block text-xs font-semibold px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 self-start"
            >
              {hindi ? 'आवेदन शुरू करें' : 'Apply For Land'} &rarr;
            </Link>
          </div>
        </div>

        {/* 3. Undeveloped Land Allotment */}
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="panel panel-warning border border-amber-200 rounded p-4 bg-amber-50 shadow-sm flex flex-col justify-between h-full">
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">
                {hindi ? 'अविकसित भूमि आवंटन' : 'Undeveloped Land Allotment'}
              </h4>
              <p className="text-xs text-amber-700 mb-4 mt-2">
                {hindi
                  ? 'अविकसित क्षेत्रों में बड़े औद्योगिक भूखंडों हेतु पार्सल देखें एवं आवेदन करें'
                  : 'Explore large industrial land parcels in undeveloped areas and quote'}
              </p>
            </div>
            <Link
              to="/applicant/land-allotment/explore"
              className="btn btn-sm btn-warning inline-block text-xs font-semibold px-3 py-1.5 bg-amber-600 text-white rounded hover:bg-amber-700 self-start"
            >
              {hindi ? 'अविकसित भूमि देखें' : 'Explore Land'} &rarr;
            </Link>
          </div>
        </div>

        {/* 4. MSME */}
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="panel border border-purple-200 rounded p-4 bg-purple-50 shadow-sm flex flex-col justify-between h-full">
            <div>
              <h4 className="font-semibold text-purple-900 mb-1">
                {hindi ? 'एमएसएमई (वित्तीय सहायता)' : 'MSME'}
              </h4>
              <p className="text-xs text-purple-700 mb-4 mt-2">
                {hindi
                  ? 'औद्योगिक इकाइयों हेतु वित्तीय सहायता, सब्सिडी एवं एमएसएमई पुरस्कार'
                  : 'Financial assistance, incentives and award schemes for MSME units'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/applicant/financial-assistance"
                className="btn btn-sm inline-block text-xs font-semibold px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                {hindi ? 'वित्तीय सहायता' : 'Financial Assistance'} &rarr;
              </Link>
              <Link
                to="/applicant/msme-award"
                className="btn btn-sm inline-block text-xs font-semibold px-3 py-1.5 bg-white text-purple-700 border border-purple-300 rounded hover:bg-purple-100"
              >
                {hindi ? 'पुरस्कार' : 'Award'} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

