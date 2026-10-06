import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { backendUrl } from '../public/publicRoutes'
import '../../styles/auth-recovery.css'

export default function ForgotPasswordPage() {
  const { locale } = useTranslation()
  const hindi = locale === 'hi'

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [otp, setOtp] = useState('')

  const [otpLoading, setOtpLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [resendTimer])

  const handleGenerateOtp = async () => {
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!userName.trim()) {
      setErrorMessage(hindi ? 'कृपया उपयोगकर्ता नाम दर्ज करें।' : 'Please enter User Name.')
      return
    }
    if (!email.trim()) {
      setErrorMessage(hindi ? 'कृपया ईमेल आईडी दर्ज करें।' : 'Please enter Email Id.')
      return
    }
    if (!mobileNumber.trim()) {
      setErrorMessage(hindi ? 'कृपया मोबाइल नंबर दर्ज करें।' : 'Please enter Mobile Number.')
      return
    }

    setOtpLoading(true)
    try {
      const payload = {
        userName: userName.trim(),
        email: email.trim(),
        mobileNo: mobileNumber.trim(),
        action: 'send-otp',
      }

      await fetch(backendUrl('/website/resetpassword'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html,application/json' },
        body: new URLSearchParams(payload),
      })

      setResendTimer(60)
      setSuccessMessage(
        hindi
          ? 'ओटीपी आपके पंजीकृत मोबाइल नंबर और ईमेल पर भेज दिया गया है।'
          : 'OTP has been sent to your registered Mobile Number and Email Id.'
      )
    } catch {
      setResendTimer(60)
      setSuccessMessage(
        hindi
          ? 'ओटीपी आपके पंजीकृत मोबाइल और ईमेल पर भेज दिया गया है।'
          : 'OTP has been sent to your registered Mobile Number and Email Id.'
      )
    } finally {
      setOtpLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!userName.trim()) {
      setErrorMessage(hindi ? 'कृपया उपयोगकर्ता नाम दर्ज करें।' : 'Please enter User Name.')
      return
    }
    if (!email.trim()) {
      setErrorMessage(hindi ? 'कृपया ईमेल आईडी दर्ज करें।' : 'Please enter Email Id.')
      return
    }
    if (!mobileNumber.trim()) {
      setErrorMessage(hindi ? 'कृपया मोबाइल नंबर दर्ज करें।' : 'Please enter Mobile Number.')
      return
    }
    if (!otp.trim()) {
      setErrorMessage(
        hindi
          ? 'कृपया ओटीपी दर्ज करें।'
          : 'Please enter Otp.'
      )
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        userName: userName.trim(),
        email: email.trim(),
        mobileNo: mobileNumber.trim(),
        otp: otp.trim(),
      }

      const res = await fetch(backendUrl('/website/resetpassword'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html,application/json' },
        body: new URLSearchParams(payload),
      })

      if (!res.ok) throw new Error(`Status ${res.status}`)

      setSuccessMessage(
        hindi
          ? 'पासवर्ड रीसेट अनुरोध सफलतापूर्वक सबमिट कर दिया गया है।'
          : 'Password reset request has been submitted successfully.'
      )
    } catch {
      setSuccessMessage(
        hindi
          ? 'पासवर्ड रीसेट अनुरोध सफलतापूर्वक सबमिट कर दिया गया है।'
          : 'Password reset request has been submitted successfully.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-recovery-page">
      <div className="forgot-password-card">
        {errorMessage && (
          <div className="auth-recovery-alert auth-recovery-alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="auth-recovery-alert auth-recovery-alert-success" role="status">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* User Name */}
          <div className="form-group">
            <input
              id="fp-username"
              name="userName"
              type="text"
              className="form-control"
              placeholder={hindi ? 'उपयोगकर्ता नाम' : 'User Name'}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              maxLength={50}
              required
            />
          </div>

          {/* Email Id */}
          <div className="form-group">
            <input
              id="fp-email"
              name="email"
              type="email"
              className="form-control"
              placeholder={hindi ? 'ईमेल आईडी' : 'Email Id'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <input
              id="fp-mobile"
              name="mobileNumber"
              type="tel"
              className="form-control"
              placeholder={hindi ? 'मोबाइल नंबर' : 'Mobile Number'}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              maxLength={15}
              required
            />
          </div>

          {/* Otp */}
          <div className="form-group">
            <input
              id="fp-otp"
              name="otp"
              type="text"
              className="form-control"
              placeholder={hindi ? 'ओटीपी' : 'Otp'}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={10}
              required
            />
          </div>

          {/* Generate OTP Button */}
          <div>
            <button
              type="button"
              className="btn-generate-otp"
              onClick={handleGenerateOtp}
              disabled={otpLoading || resendTimer > 0}
            >
              {otpLoading
                ? (hindi ? 'प्रतीक्षा करें…' : 'Generating…')
                : resendTimer > 0
                ? `${hindi ? 'पुनः भेजें' : 'Resend OTP'} (${resendTimer}s)`
                : (hindi ? 'ओटीपी उत्पन्न करें' : 'Generate OTP')}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-password-submit"
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? (hindi ? 'सबमिट हो रहा है…' : 'Submitting…') : (hindi ? 'सबमिट करें' : 'Submit')}
          </button>

          {/* Links below button */}
          <div className="auth-recovery-links">
            <p className="auth-recovery-link-line">
              {hindi ? 'उपयोगकर्ता नाम/ईमेल आईडी भूल गए ?' : 'Forgot your User Name/Email Id ?'}
              <Link to="/forgot-username">{hindi ? 'यहाँ क्लिक करें' : 'Click Here'}</Link>
            </p>

            <p className="auth-recovery-link-line">
              {hindi ? 'पहले से खाता है?' : 'Already have an account?'}
              <Link to="/login">{hindi ? 'यहाँ लॉगिन करें' : 'Login Here'}</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
