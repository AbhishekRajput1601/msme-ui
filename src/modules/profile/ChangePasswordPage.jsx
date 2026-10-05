import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../hooks/useAuth'
import ProfileNavTabs from './components/ProfileNavTabs'
import {
  generateChangePasswordOtp,
  submitChangePassword,
  submitFirstPasswordChange,
} from './services/profileService'

export default function ChangePasswordPage({ mode }) {
  const { locale } = useTranslation()
  const hindi = locale === 'hi'
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const isFirstChange = mode === 'first' || location.pathname.includes('first-password-change')

  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [otpGenerated, setOtpGenerated] = useState(false)
  const [otpMessage, setOtpMessage] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // Countdown timer for OTP
  useEffect(() => {
    let timer
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendCountdown])

  // Password policy criteria
  const criteria = useMemo(() => {
    return {
      length: password.length >= 6 && password.length <= 15,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&#^~_\-]/.test(password),
      noSpaces: password.length > 0 && !/\s/.test(password),
    }
  }, [password])

  const isValidPassword =
    criteria.length &&
    criteria.upper &&
    criteria.lower &&
    criteria.number &&
    criteria.special &&
    criteria.noSpaces

  const strengthScore = useMemo(() => {
    if (!password) return 0
    let score = 0
    if (criteria.length) score += 1
    if (criteria.upper) score += 1
    if (criteria.lower) score += 1
    if (criteria.number) score += 1
    if (criteria.special) score += 1
    return score
  }, [criteria, password])

  // 5 colors matching checkStrength directive in CommonController.js: ['#F00', '#F90', '#FF0', '#9F0', '#0F0']
  const strengthColors = ['#DDD', '#FF4444', '#FF9900', '#FFCC00', '#99FF00', '#00CC00']

  const handleGenerateOtp = async (e) => {
    e.preventDefault()
    setMessage(null)
    setErrorMessage(null)

    if (!isFirstChange && !currentPassword) {
      setErrorMessage(hindi ? 'कृपया वर्तमान पासवर्ड दर्ज करें।' : 'Please enter current password.')
      return
    }

    if (!password) {
      setErrorMessage(hindi ? 'कृपया नया पासवर्ड दर्ज करें।' : 'Please enter new password.')
      return
    }

    if (!isValidPassword) {
      setErrorMessage(
        hindi
          ? 'पासवर्ड न्यूनतम मानकों को पूरा नहीं करता है।'
          : 'Password does not meet the minimum security standards.'
      )
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage(hindi ? 'नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।' : 'New password and confirm password do not match.')
      return
    }

    if (!isFirstChange && currentPassword === password) {
      setErrorMessage(
        hindi
          ? 'नया पासवर्ड वर्तमान पासवर्ड के समान नहीं हो सकता।'
          : 'New password cannot be the same as your current password.'
      )
      return
    }

    // For first password change, directly submit
    if (isFirstChange) {
      setSubmitting(true)
      try {
        const res = await submitFirstPasswordChange({ password, confirmPassword })
        setMessage(res.successMessage || (hindi ? 'पासवर्ड सफलतापूर्वक बदल दिया गया है।' : 'Password changed successfully.'))
        setTimeout(() => navigate('/applicant/dashboard'), 2000)
      } catch (err) {
        setErrorMessage(err.message || 'Failed to change password.')
      } finally {
        setSubmitting(false)
      }
      return
    }

    // Standard change password: request OTP
    setLoading(true)
    try {
      const res = await generateChangePasswordOtp({ currentPassword, password, confirmPassword })
      setOtpGenerated(true)
      setOtpMessage(
        res.successMessage ||
        (hindi
          ? 'आपके पंजीकृत मोबाइल नंबर पर ओटीपी भेजा गया है।'
          : 'OTP has been sent to your registered mobile number.')
      )
      setResendCountdown(60)
    } catch (err) {
      setErrorMessage(err.message || (hindi ? 'ओटीपी उत्पन्न करने में त्रुटि।' : 'Failed to generate OTP.'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setErrorMessage(null)

    if (!otp || otp.length < 4) {
      setErrorMessage(hindi ? 'कृपया 6-अंकीय ओटीपी दर्ज करें।' : 'Please enter the 6-digit OTP.')
      return
    }

    setSubmitting(true)
    try {
      const res = await submitChangePassword({
        currentPassword,
        password,
        confirmPassword,
        otp,
      })
      setMessage(
        res.successMessage ||
        (hindi
          ? 'पासवर्ड सफलतापूर्वक बदल दिया गया है! कृपया नए पासवर्ड के साथ पुनः लॉगिन करें।'
          : 'Password has been changed successfully! Please log in again.')
      )
      setCurrentPassword('')
      setPassword('')
      setConfirmPassword('')
      setOtp('')
      setOtpGenerated(false)

      setTimeout(async () => {
        try {
          await logout()
          navigate('/login?passwordChanged=true')
        } catch {
          navigate('/login')
        }
      }, 2500)
    } catch (err) {
      setErrorMessage(err.message || (hindi ? 'पासवर्ड बदलने में त्रुटि।' : 'Failed to change password.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="profile-page-container">
      {/* Top Tab Navigation & Breadcrumbs */}
      {!isFirstChange && (
        <ProfileNavTabs activeTab="password" pageTitle={hindi ? 'पासवर्ड बदलें' : 'Change Password'} />
      )}

      {/* Legacy Government Form Banner */}
      <div className="gov-form-banner">
        <div className="gov-form-banner-title">
          <h2>
            {isFirstChange
              ? (hindi ? 'पहला लॉगिन: पासवर्ड अनिवार्य परिवर्तन' : 'Initial Login: Mandatory Password Change')
              : (hindi ? 'पासवर्ड बदलें' : 'Change Account Password')}
          </h2>
          <p>{hindi ? 'मध्य प्रदेश शासन — सूक्ष्म, लघु एवं मध्यम उद्यम विभाग' : 'Government of Madhya Pradesh — Department of MSME'}</p>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="alert alert-success" role="alert">
          <i className="fa fa-check-circle" /> {message}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          <i className="fa fa-exclamation-triangle" /> {errorMessage}
        </div>
      )}

      {otpMessage && otpGenerated && (
        <div className="alert alert-info" role="alert">
          <i className="fa fa-mobile-phone fa-lg" /> <strong>{otpMessage}</strong>
          <span style={{ display: 'block', fontSize: '12px', marginTop: '4px' }}>
            Please enter the 6-digit OTP code below to finalize your password update.
          </span>
        </div>
      )}

      {/* Main Government Form Panel matching changepassword.html */}
      <div className="panel panel-primary">
        <div className="panel-heading">
          <i className="fa fa-key" /> {hindi ? 'पासवर्ड सुरक्षा प्रबंधन' : 'Account Security & Password Management'}
        </div>

        <div className="panel-body">
          <div className="row">
            {/* Left Column: Form Fields */}
            <div className="col-md-6 col-sm-12">
              <form onSubmit={otpGenerated ? handleSubmit : handleGenerateOtp}>
                {/* Current Password */}
                {!isFirstChange && (
                  <div className="form-group">
                    <label>
                      {hindi ? 'वर्तमान पासवर्ड' : 'Current Password'} <span className="required-star">*</span>
                    </label>
                    <div className="password-container">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={otpGenerated}
                        required
                        autoComplete="current-password"
                        placeholder="Current Password"
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowCurrent(!showCurrent)}
                        title={showCurrent ? 'Hide password' : 'Show password'}
                        aria-label="Toggle Current Password Visibility"
                      >
                        <i className={`fa ${showCurrent ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>
                    </div>
                  </div>
                )}

                {/* New Password */}
                <div className="form-group">
                  <label>
                    {hindi ? 'नया पासवर्ड' : 'New Password'} <span className="required-star">*</span>
                  </label>
                  <div className="password-container">
                    <input
                      type={showNew ? 'text' : 'password'}
                      className="form-control"
                      value={password}
                      maxLength={15}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={otpGenerated}
                      required
                      autoComplete="new-password"
                      placeholder="New Password (6-15 chars)"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowNew(!showNew)}
                      title={showNew ? 'Hide password' : 'Show password'}
                      aria-label="Toggle New Password Visibility"
                    >
                      <i className={`fa ${showNew ? 'fa-eye-slash' : 'fa-eye'}`} />
                    </button>
                  </div>

                  {/* 5-Point Strength Bar matching legacy check-strength directive */}
                  <div style={{ marginTop: '5px' }}>
                    <ul id="strength">
                      {[1, 2, 3, 4, 5].map((idx) => {
                        const filled = strengthScore >= idx
                        const color = filled ? strengthColors[strengthScore] : '#DDD'
                        return (
                          <li
                            key={idx}
                            className="point"
                            style={{ backgroundColor: color }}
                          />
                        )
                      })}
                    </ul>
                    {password && (
                      <span style={{ fontSize: '11px', marginLeft: '10px', fontWeight: 'bold', color: strengthColors[strengthScore] }}>
                        {strengthScore <= 2 ? 'Weak' : strengthScore <= 4 ? 'Moderate' : 'Strong'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label>
                    {hindi ? 'नए पासवर्ड की पुष्टि करें' : 'Confirm Password'} <span className="required-star">*</span>
                  </label>
                  <div className="password-container">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      className="form-control"
                      value={confirmPassword}
                      maxLength={15}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={otpGenerated}
                      required
                      autoComplete="new-password"
                      placeholder="Re-enter New Password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirm(!showConfirm)}
                      title={showConfirm ? 'Hide password' : 'Show password'}
                      aria-label="Toggle Confirm Password Visibility"
                    >
                      <i className={`fa ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`} />
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-danger" style={{ fontSize: '12px', marginTop: '4px' }}>
                      Passwords do not match.
                    </p>
                  )}
                </div>

                {/* OTP Field (shown after Generate OTP is clicked) */}
                {otpGenerated && (
                  <div className="panel panel-info" style={{ marginTop: '15px' }}>
                    <div className="panel-heading" style={{ fontSize: '13px' }}>
                      <i className="fa fa-shield" /> Enter One-Time Password (OTP)
                    </div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label>6-Digit OTP <span className="required-star">*</span></label>
                        <input
                          type="text"
                          maxLength={6}
                          className="form-control"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter 6-digit OTP"
                          style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}
                          required
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                        {resendCountdown > 0 ? (
                          <span className="text-muted">
                            Resend code in <strong>{resendCountdown}s</strong>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleGenerateOtp}
                            disabled={loading}
                            className="btn btn-link btn-xs"
                            style={{ padding: 0 }}
                          >
                            Resend OTP
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setOtpGenerated(false)}
                          className="btn btn-link btn-xs"
                          style={{ padding: 0 }}
                        >
                          Modify Passwords
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ marginTop: '20px' }}>
                  {!otpGenerated ? (
                    <button
                      type="submit"
                      disabled={loading || submitting || !password || (confirmPassword && password !== confirmPassword)}
                      className="btn btn-primary"
                    >
                      {loading ? (
                        <>
                          <i className="fa fa-spinner fa-spin" /> Generating OTP...
                        </>
                      ) : isFirstChange ? (
                        <>
                          <i className="fa fa-check" /> Update Password
                        </>
                      ) : (
                        <>
                          <i className="fa fa-shield" /> Generate OTP
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting || !otp}
                      className="btn btn-success"
                    >
                      {submitting ? (
                        <>
                          <i className="fa fa-spinner fa-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-lock" /> Submit &amp; Change Password
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Column: Password Standards Box matching changepassword.html */}
            <div className="col-md-6 col-sm-12">
              <div className="password-standards-box">
                <h3>
                  <span>{hindi ? 'न्यूनतम पासवर्ड सुरक्षा मानक' : 'Minimum password standards.'}</span>
                </h3>

                <ul>
                  <li>
                    <span>{hindi ? 'लंबाई में न्यूनतम 6 वर्ण (अधिकतम 15)।' : 'Minimum 6 characters in length (maximum 15).'}</span>
                  </li>
                  <li>
                    <span>{hindi ? 'निम्नलिखित में से प्रत्येक कम से कम 1 होना चाहिए:' : 'Must contain atleast:'}</span>
                    <ul>
                      <li>
                        <span>
                          <i className={`fa ${criteria.upper ? 'fa-check text-success' : 'fa-circle-o text-muted'}`} />{' '}
                          {hindi ? '1 अपरकेस अक्षर (A-Z)' : '1 Uppercase Letter.'}
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className={`fa ${criteria.lower ? 'fa-check text-success' : 'fa-circle-o text-muted'}`} />{' '}
                          {hindi ? '1 लोअरकेस अक्षर (a-z)' : '1 Lowercase Letter.'}
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className={`fa ${criteria.number ? 'fa-check text-success' : 'fa-circle-o text-muted'}`} />{' '}
                          {hindi ? '1 संख्यात्मक अंक (0-9)' : '1 Numeric Character.'}
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className={`fa ${criteria.special ? 'fa-check text-success' : 'fa-circle-o text-muted'}`} />{' '}
                          {hindi ? '1 विशेष वर्ण (@, $, #, !, %, आदि)' : '1 Special Character (@, $, #, !, %, etc.).'}
                        </span>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span>
                      <i className={`fa ${criteria.noSpaces ? 'fa-check text-success' : 'fa-circle-o text-muted'}`} />{' '}
                      {hindi ? 'पासवर्ड में कोई रिक्त स्थान (Spaces) नहीं होना चाहिए।' : 'No spaces allowed in password.'}
                    </span>
                  </li>
                  <li style={{ marginTop: '10px', color: '#8a3b14' }}>
                    <i className="fa fa-history" /> Cannot reuse any of your last 3 passwords.
                  </li>
                  <li style={{ color: '#8a3b14' }}>
                    <i className="fa fa-clock-o" /> The OTP sent to your registered mobile is valid for 10 minutes.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
