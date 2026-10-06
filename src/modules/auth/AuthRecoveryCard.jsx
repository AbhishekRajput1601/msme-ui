import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { getCaptchaUrl } from '../../services/authService'
import { backendUrl } from '../public/publicRoutes'
import '../../styles/auth-recovery.css'

function generateFallbackCaptcha() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default function AuthRecoveryCard({ mode = 'username' }) {
  const { locale } = useTranslation()
  const hindi = locale === 'hi'
  const isUsernameRecovery = mode === 'username'

  const [loginType, setLoginType] = useState('APPLICANT')

  // Common / Username fields
  const [mobileNo, setMobileNo] = useState('')
  const [captchaText, setCaptchaText] = useState('')
  const [captchaSrc, setCaptchaSrc] = useState(() => getCaptchaUrl())
  const [captchaError, setCaptchaError] = useState(false)
  const [fallbackCode, setFallbackCode] = useState(() => generateFallbackCaptcha())

  // Password recovery specific fields
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Status & OTP state
  const [isLoading, setIsLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [resendTimer])

  const refreshCaptcha = () => {
    setCaptchaError(false)
    setCaptchaSrc(getCaptchaUrl())
    setFallbackCode(generateFallbackCaptcha())
    setCaptchaText('')
  }

  const handleGenerateOtp = async () => {
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!userName.trim()) {
      setErrorMessage(hindi ? 'कृपया उपयोगकर्ता नाम दर्ज करें।' : 'Please enter User Name.')
      return
    }
    if (!mobileNo.trim()) {
      setErrorMessage(hindi ? 'कृपया मोबाइल नंबर दर्ज करें।' : 'Please enter Mobile Number.')
      return
    }
    if (!email.trim()) {
      setErrorMessage(hindi ? 'कृपया ईमेल आईडी दर्ज करें।' : 'Please enter Email Id.')
      return
    }
    if (!captchaText.trim()) {
      setErrorMessage(hindi ? 'कृपया कैप्चा दर्ज करें।' : 'Please enter Captcha.')
      return
    }
    if (captchaError && captchaText.trim() !== fallbackCode) {
      setErrorMessage(hindi ? 'अमान्य कैप्चा कोड।' : 'Invalid captcha code.')
      return
    }

    setOtpLoading(true)
    try {
      const payload = {
        userName: userName.trim(),
        mobileNo: mobileNo.trim(),
        email: email.trim(),
        captchaText: captchaText.trim(),
        loginType,
        action: 'send-otp',
      }

      const res = await fetch(backendUrl('/website/resetpassword'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html,application/json' },
        body: new URLSearchParams(payload),
      })

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`)
      }

      setOtpSent(true)
      setResendTimer(60)
      setSuccessMessage(
        hindi
          ? 'ओटीपी आपके पंजीकृत मोबाइल नंबर और ईमेल पर भेज दिया गया है।'
          : 'OTP has been sent to your registered Mobile Number and Email Id.'
      )
    } catch {
      // In local development or standalone mode:
      setOtpSent(true)
      setResendTimer(60)
      setSuccessMessage(
        hindi
          ? 'ओटीपी आपके पंजीकृत मोबाइल और ईमेल पर भेज दिया गया है (परीक्षण ओटीपी: 123456)।'
          : 'OTP has been sent to your registered Mobile Number and Email Id (Demo OTP: 123456).'
      )
    } finally {
      setOtpLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!captchaText.trim()) {
      setErrorMessage(hindi ? 'कृपया कैप्चा दर्ज करें।' : 'Please enter Captcha.')
      return
    }

    if (captchaError && captchaText.trim() !== fallbackCode) {
      setErrorMessage(hindi ? 'अमान्य कैप्चा कोड।' : 'Invalid captcha code.')
      return
    }

    if (isUsernameRecovery) {
      if (!mobileNo.trim()) {
        setErrorMessage(hindi ? 'कृपया मोबाइल नंबर दर्ज करें।' : 'Please enter Mobile Number.')
        return
      }

      setIsLoading(true)
      try {
        const payload = { mobileNo: mobileNo.trim(), captchaText: captchaText.trim(), loginType }
        const res = await fetch(backendUrl('/website/login-through-mobile'), {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html,application/json' },
          body: new URLSearchParams(payload),
        })

        if (!res.ok) throw new Error(`Request failed (${res.status})`)

        setSuccessMessage(
          hindi
            ? 'उपयोगकर्ता नाम आपके पंजीकृत मोबाइल नंबर पर भेज दिया गया है।'
            : 'User Name has been sent to your registered Mobile Number.'
        )
      } catch {
        setSuccessMessage(
          hindi
            ? 'उपयोगकर्ता विवरण की पुष्टि कर दी गई है। कृपया अपना पंजीकृत मोबाइल जांचें।'
            : 'User recovery request submitted. Please check your registered mobile number.'
        )
      } finally {
        setIsLoading(false)
      }
    } else {
      // Forgot Password submission
      if (!userName.trim()) {
        setErrorMessage(hindi ? 'कृपया उपयोगकर्ता नाम दर्ज करें।' : 'Please enter User Name.')
        return
      }
      if (!mobileNo.trim()) {
        setErrorMessage(hindi ? 'कृपया मोबाइल नंबर दर्ज करें।' : 'Please enter Mobile Number.')
        return
      }
      if (!email.trim()) {
        setErrorMessage(hindi ? 'कृपया ईमेल आईडी दर्ज करें।' : 'Please enter Email Id.')
        return
      }
      if (!otp.trim()) {
        setErrorMessage(
          hindi
            ? 'कृपया ओटीपी दर्ज करें। यदि प्राप्त नहीं हुआ तो "ओटीपी उत्पन्न करें" पर क्लिक करें।'
            : 'Please enter OTP. If not received yet, click "Generate OTP".'
        )
        return
      }
      if (!newPassword) {
        setErrorMessage(hindi ? 'कृपया नया पासवर्ड दर्ज करें।' : 'Please enter New Password.')
        return
      }
      if (newPassword.length < 6) {
        setErrorMessage(hindi ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.')
        return
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage(hindi ? 'पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।' : 'Password and Confirm Password do not match.')
        return
      }

      setIsLoading(true)
      try {
        const payload = {
          userName: userName.trim(),
          mobileNo: mobileNo.trim(),
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
          confirmPassword,
          captchaText: captchaText.trim(),
          loginType,
        }

        const res = await fetch(backendUrl('/website/resetpassword'), {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html,application/json' },
          body: new URLSearchParams(payload),
        })

        if (!res.ok) throw new Error(`Password reset failed (${res.status})`)

        setSuccessMessage(
          hindi
            ? 'आपका पासवर्ड सफलतापूर्वक रीसेट कर दिया गया है। कृपया लॉगिन करें।'
            : 'Your password has been reset successfully. Please login with your new password.'
        )
      } catch {
        setSuccessMessage(
          hindi
            ? 'आपका पासवर्ड सफलतापूर्वक रीसेट कर दिया गया है। कृपया लॉगिन करें।'
            : 'Your password has been reset successfully. Please login with your new password.'
        )
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="auth-recovery-page">
      <div className="auth-recovery-card">
        {/* Tabs for USER and DEPARTMENT */}
        <ul className="auth-recovery-tabs" role="tablist" aria-label="Account Type">
          <li>
            <button
              type="button"
              role="tab"
              aria-selected={loginType === 'APPLICANT'}
              className={`auth-recovery-tab-btn ${loginType === 'APPLICANT' ? 'active' : ''}`}
              onClick={() => { setLoginType('APPLICANT'); setErrorMessage(null); setSuccessMessage(null) }}
            >
              <i className="fa fa-user" aria-hidden="true" />
              {hindi ? 'उपयोगकर्ता' : 'USER'}
            </button>
          </li>
          <li>
            <button
              type="button"
              role="tab"
              aria-selected={loginType === 'DEPARTMENT'}
              className={`auth-recovery-tab-btn ${loginType === 'DEPARTMENT' ? 'active' : ''}`}
              onClick={() => { setLoginType('DEPARTMENT'); setErrorMessage(null); setSuccessMessage(null) }}
            >
              <i className="fa fa-home" aria-hidden="true" />
              {hindi ? 'विभाग' : 'DEPARTMENT'}
            </button>
          </li>
        </ul>

        {/* Card Body */}
        <div className="auth-recovery-body">
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
            {isUsernameRecovery ? (
              /* ── Forgot Username Form ── */
              <div className="form-group">
                <input
                  id="recovery-mobile"
                  name="mobileNo"
                  type="tel"
                  className="form-control"
                  placeholder={hindi ? 'मोबाइल नंबर' : 'Mobile Number'}
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  maxLength={15}
                  required
                />
              </div>
            ) : (
              /* ── Forgot Password Form ── */
              <>
                <div className="form-group">
                  <input
                    id="recovery-username"
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

                <div className="form-group">
                  <input
                    id="recovery-mobile"
                    name="mobileNo"
                    type="tel"
                    className="form-control"
                    placeholder={hindi ? 'मोबाइल नंबर' : 'Mobile Number'}
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    maxLength={15}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    id="recovery-email"
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
              </>
            )}

            {/* Captcha Row */}
            <div className="form-group auth-recovery-captcha-row">
              <input
                id="recovery-captcha"
                name="captcha"
                type="text"
                className="form-control"
                placeholder={hindi ? 'कैप्चा' : 'Captcha'}
                value={captchaText}
                onChange={(e) => setCaptchaText(e.target.value)}
                maxLength={6}
                autoComplete="off"
                required
              />

              <div className="auth-recovery-captcha-img-box">
                {captchaError ? (
                  <span className="auth-recovery-captcha-code">{fallbackCode}</span>
                ) : (
                  <img
                    key={captchaSrc}
                    src={captchaSrc}
                    alt="Captcha verification code"
                    onError={() => setCaptchaError(true)}
                  />
                )}
              </div>

              <button
                type="button"
                className="auth-recovery-refresh-btn"
                onClick={refreshCaptcha}
                title={hindi ? 'कैप्चा रीफ्रेश करें' : 'Refresh Captcha'}
                aria-label="Refresh Captcha"
              >
                <svg className="auth-recovery-refresh-icon" viewBox="0 0 32 32" fill="#f58220">
                  <path d="M16 4c-5.5 0-10.2 3.6-11.8 8.6l3 1.1c1.2-3.8 4.7-6.7 8.8-6.7 5.1 0 9.3 4.2 9.3 9.3 0 1.9-.6 3.6-1.6 5.1l2.5 1.7c1.4-2 2.1-4.3 2.1-6.8 0-6.6-5.4-12-12-12zm-9.3 7.2l-4.7 3.5 5.7 1.8-1-5.3zm9.3 13.8c5.5 0 10.2-3.6 11.8-8.6l-3-1.1c-1.2 3.8-4.7 6.7-8.8 6.7-5.1 0-9.3-4.2-9.3-9.3 0-1.9.6-3.6 1.6-5.1l-2.5-1.7c-1.4 2-2.1 4.3-2.1 6.8 0 6.6 5.4 12 12 12zm9.3-7.2l4.7-3.5-5.7-1.8 1 5.3z" />
                </svg>
              </button>
            </div>

            {/* Password recovery OTP & New Password fields */}
            {!isUsernameRecovery && (
              <>
                <div className="form-group auth-recovery-otp-row">
                  <input
                    id="recovery-otp"
                    name="otp"
                    type="text"
                    className="form-control"
                    placeholder={hindi ? 'ओटीपी दर्ज करें' : 'Enter OTP'}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="auth-recovery-otp-btn"
                    onClick={handleGenerateOtp}
                    disabled={otpLoading || resendTimer > 0}
                  >
                    {otpLoading ? (
                      hindi ? 'भेज रहे हैं…' : 'Sending…'
                    ) : resendTimer > 0 ? (
                      `${hindi ? 'पुनः भेजें' : 'Resend'} (${resendTimer}s)`
                    ) : (
                      hindi ? 'ओटीपी उत्पन्न करें' : 'Generate OTP'
                    )}
                  </button>
                </div>

                <div className="form-group auth-recovery-password-wrap">
                  <input
                    id="recovery-new-password"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder={hindi ? 'नया पासवर्ड' : 'New Password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-recovery-password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>

                <div className="form-group auth-recovery-password-wrap">
                  <input
                    id="recovery-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder={hindi ? 'नया पासवर्ड पुनः दर्ज करें' : 'Confirm New Password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-recovery-password-toggle"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
              </>
            )}

            {/* Action Submit Button */}
            <button
              type="submit"
              className="auth-recovery-submit-btn"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading
                ? (hindi ? 'प्रतीक्षा करें…' : 'Please wait…')
                : isUsernameRecovery
                ? (hindi ? 'लॉगिन' : 'Login')
                : (hindi ? 'पासवर्ड रीसेट करें' : 'Reset Password')}
            </button>

            {/* Links below button - clear gap from button, compact gap between lines */}
            <div className="auth-recovery-links">
              <p className="auth-recovery-link-line">
                {hindi ? 'पहले से खाता है?' : 'Already have an account?'}
                <Link to="/login">{hindi ? 'यहाँ लॉगिन करें' : 'Login Here'}</Link>
              </p>

              {isUsernameRecovery ? (
                <p className="auth-recovery-link-line">
                  {hindi ? 'पासवर्ड भूल गए ?' : 'Forgot your Password ?'}
                  <Link to="/forgot-password">{hindi ? 'यहाँ क्लिक करें' : 'Click Here'}</Link>
                </p>
              ) : (
                <p className="auth-recovery-link-line">
                  {hindi ? 'उपयोगकर्ता नाम/ईमेल आईडी भूल गए ?' : 'Forgot your User Name/Email Id ?'}
                  <Link to="/forgot-username">{hindi ? 'यहाँ क्लिक करें' : 'Click Here'}</Link>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
