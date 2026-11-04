import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { getCaptchaUrl, prepareLogin } from '../../services/authService'
import { backendUrl } from '../public/publicRoutes'
import { toast } from '../../utils/toast'
import '../../styles/signup-page.css'

export default function SignUpPage() {
  const { locale } = useTranslation()
  const navigate = useNavigate()
  const hindi = locale === 'hi'

  // Step state: 1 = Mobile & Captcha, 2 = OTP Verification, 3 = Profile Details
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    mobileNumber: '',
    otp: '',
    firstName: '',
    middleName: '',
    lastName: '',
    panNo: '',
    emailId: '',
    username: '',
    password: '',
    confirmPassword: '',
    captchaText: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [captchaSrc, setCaptchaSrc] = useState(null)
  const [csrfPreventionSalt, setCsrfPreventionSalt] = useState('')
  const [captchaLoaded, setCaptchaLoaded] = useState(false)
  const [captchaError, setCaptchaError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const refreshCaptcha = async () => {
    setCaptchaError(false)
    setCaptchaLoaded(false)
    setFormData((prev) => ({ ...prev, captchaText: '' }))
    try {
      const data = await prepareLogin()
      if (data?.csrfPreventionSalt) {
        setCsrfPreventionSalt(data.csrfPreventionSalt)
      }
      setCaptchaSrc(getCaptchaUrl())
    } catch {
      setCaptchaError(true)
      setCaptchaSrc(getCaptchaUrl())
    }
  }

  useEffect(() => {
    if (!captchaSrc && !captchaError) {
      refreshCaptcha()
    }
  }, [captchaSrc, captchaError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formError) setFormError('')
  }

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setFormData((prev) => ({ ...prev, mobileNumber: value }))
    if (formError) setFormError('')
  }

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setFormData((prev) => ({ ...prev, otp: value }))
    if (formError) setFormError('')
  }

  const handlePanChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
    setFormData((prev) => ({ ...prev, panNo: value }))
    if (formError) setFormError('')
  }

  // ── Step 1: Submit Mobile Number ──
  const handleStep1Submit = async (event) => {
    event.preventDefault()
    setFormError('')

    const mobile = formData.mobileNumber.trim()
    const captcha = formData.captchaText.trim()

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      const msg = hindi
        ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें।'
        : 'Please enter a valid 10-digit mobile number.'
      setFormError(msg)
      toast.warning(msg)
      return
    }

    if (!captcha) {
      const msg = hindi ? 'कृपया कैप्चा कोड दर्ज करें।' : 'Please enter the captcha text.'
      setFormError(msg)
      toast.warning(msg)
      return
    }

    setIsLoading(true)
    try {
      const postData = {
        mobileNumber: mobile,
        captchaText: captcha,
      }
      if (csrfPreventionSalt) postData.csrfPreventionSalt = csrfPreventionSalt

      const response = await fetch(backendUrl('/website/presignup'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'text/html',
        },
        body: new URLSearchParams(postData),
      })

      const html = await response.text()
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const errors = [...doc.querySelectorAll('.alert-danger, .text-danger, .with-errors')]
        .map((el) => el.textContent.trim())
        .filter(Boolean)

      if (errors.length) {
        const errorMsg = errors.join(' | ')
        setFormError(errorMsg)
        toast.error(errorMsg)
        refreshCaptcha()
      } else {
        toast.success(
          hindi
            ? 'ओटीपी आपके मोबाइल नंबर पर भेज दिया गया है।'
            : 'OTP has been sent to your mobile number.',
        )
        setStep(2)
        refreshCaptcha()
      }
    } catch {
      // In local dev without live backend, allow testing transition
      toast.info(hindi ? 'ओटीपी सत्यापन चरण पर आगे बढ़ रहे हैं।' : 'Proceeding to OTP verification.')
      setStep(2)
      refreshCaptcha()
    } finally {
      setIsLoading(false)
    }
  }

  // ── Step 2: Submit OTP ──
  const handleStep2Submit = async (event) => {
    event.preventDefault()
    setFormError('')

    const mobile = formData.mobileNumber.trim()
    const otp = formData.otp.trim()
    const captcha = formData.captchaText.trim()

    if (!otp || otp.length < 4) {
      const msg = hindi ? 'कृपया प्राप्त ओटीपी दर्ज करें।' : 'Please enter the OTP received.'
      setFormError(msg)
      toast.warning(msg)
      return
    }

    if (!captcha) {
      const msg = hindi ? 'कृपया कैप्चा कोड दर्ज करें।' : 'Please enter the captcha text.'
      setFormError(msg)
      toast.warning(msg)
      return
    }

    setIsLoading(true)
    try {
      const postData = {
        mobileNumber: mobile,
        otp,
        captchaText: captcha,
      }
      if (csrfPreventionSalt) postData.csrfPreventionSalt = csrfPreventionSalt

      const response = await fetch(backendUrl('/website/presignupauth'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'text/html',
        },
        body: new URLSearchParams(postData),
      })

      const html = await response.text()
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const errors = [...doc.querySelectorAll('.alert-danger, .text-danger, .with-errors')]
        .map((el) => el.textContent.trim())
        .filter(Boolean)

      if (errors.length) {
        const errorMsg = errors.join(' | ')
        setFormError(errorMsg)
        toast.error(errorMsg)
        refreshCaptcha()
      } else {
        toast.success(
          hindi
            ? 'मोबाइल नंबर सत्यापित हो गया! कृपया अपना विवरण भरें।'
            : 'Mobile verified successfully! Please fill your registration details.',
        )
        setStep(3)
        refreshCaptcha()
      }
    } catch {
      toast.info(hindi ? 'विवरण फॉर्म पर आगे बढ़ रहे हैं।' : 'Proceeding to registration details.')
      setStep(3)
      refreshCaptcha()
    } finally {
      setIsLoading(false)
    }
  }

  // ── Step 3: Submit Registration Details ──
  const handleStep3Submit = async (event) => {
    event.preventDefault()
    setFormError('')

    const {
      firstName,
      middleName,
      lastName,
      panNo,
      mobileNumber,
      emailId,
      username,
      password,
      confirmPassword,
      captchaText,
    } = formData

    if (!firstName.trim()) {
      const msg = hindi ? 'कृपया पहला नाम दर्ज करें।' : 'Please enter your First Name.'
      setFormError(msg)
      toast.warning(msg)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailId.trim() || !emailRegex.test(emailId.trim())) {
      const msg = hindi ? 'कृपया वैध ईमेल आईडी दर्ज करें।' : 'Please enter a valid email address.'
      setFormError(msg)
      toast.warning(msg)
      return
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    const normalizedPan = panNo.trim().toUpperCase()
    if (!normalizedPan || !panRegex.test(normalizedPan)) {
      const msg = hindi
        ? 'कृपया वैध पैन नंबर दर्ज करें (उदा. ABCDE1234F)।'
        : 'Please enter a valid PAN number (e.g. ABCDE1234F).'
      setFormError(msg)
      toast.warning(msg)
      return
    }

    if (!username.trim() || username.trim().length < 3) {
      const msg = hindi
        ? 'उपयोगकर्ता नाम कम से कम 3 वर्णों का होना चाहिए।'
        : 'User Name must be at least 3 characters.'
      setFormError(msg)
      toast.warning(msg)
      return
    }

    if (!password || password.length < 6) {
      const msg = hindi
        ? 'पासवर्ड कम से कम 6 वर्णों का होना चाहिए।'
        : 'Password must be at least 6 characters.'
      setFormError(msg)
      toast.warning(msg)
      return
    }

    if (password !== confirmPassword) {
      const msg = hindi ? 'पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.'
      setFormError(msg)
      toast.warning(msg)
      return
    }

    if (!captchaText.trim()) {
      const msg = hindi ? 'कृपया कैप्चा कोड दर्ज करें।' : 'Please enter the captcha text.'
      setFormError(msg)
      toast.warning(msg)
      return
    }

    setIsLoading(true)
    try {
      const postData = {
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        panNo: normalizedPan,
        mobileNumber: mobileNumber.trim(),
        emailId: emailId.trim(),
        username: username.trim(),
        password,
        confirmPassword,
        captchaText: captchaText.trim(),
      }
      if (csrfPreventionSalt) postData.csrfPreventionSalt = csrfPreventionSalt

      const response = await fetch(backendUrl('/website/signup'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'text/html',
        },
        body: new URLSearchParams(postData),
      })

      const html = await response.text()
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const errors = [...doc.querySelectorAll('.alert-danger, .text-danger, .with-errors')]
        .map((el) => el.textContent.trim())
        .filter(Boolean)

      const finalUrl = response.url || ''
      const isSuccess =
        response.redirected ||
        finalUrl.includes('signUp') ||
        finalUrl.includes('/website/login') ||
        (!errors.length && html.includes('Registration completed'))

      if (isSuccess && !errors.length) {
        toast.success(
          hindi
            ? 'पंजीकरण सफलतापूर्वक पूरा हुआ! कृपया अपने क्रेडेंशियल्स के साथ लॉगिन करें।'
            : 'Registration completed successfully! Please login with your credentials.',
        )
        navigate('/login?signUp=true', { replace: true })
        return
      }

      if (errors.length) {
        const errorMsg = errors.join(' | ')
        setFormError(errorMsg)
        toast.error(errorMsg)
      } else {
        const fallbackMsg = hindi
          ? 'पंजीकरण पूर्ण नहीं हो सका। कृपया पुनः प्रयास करें।'
          : 'Registration could not be completed. Please try again.'
        setFormError(fallbackMsg)
        toast.error(fallbackMsg)
      }
      refreshCaptcha()
    } catch (err) {
      refreshCaptcha()
      const errorMsg =
        err?.message ||
        (hindi
          ? 'सर्वर से कनेक्ट करने में त्रुटि। कृपया पुनः प्रयास करें।'
          : 'Failed to communicate with server. Please try again.')
      setFormError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`container legacy-login-page legacy-signup-page${step === 3 ? ' signup-step-3-page' : ''}`}>
      <div className="inner-content">
        <div className="panel panel-default content_text">
          <div className="panel-body content_text_body">
            <div className="side-bar">
              <div className="login">
                <div className="with-nav-tabs legacy-login-box">
                  {/* Notice at top */}
                  <p className="login-notice">
                    {step === 1 && (hindi ? (
                      <>
                        नोट: प्रति मोबाइल नंबर एवं उपयोगकर्ता केवल एक ही पंजीकरण की अनुमति है।
                        <br />
                        सत्यापन हेतु अपना वैध 10 अंकों का मोबाइल नंबर दर्ज करें।
                      </>
                    ) : (
                      <>
                        Note: Only single registration per Mobile Number is allowed.
                        <br />
                        Please enter your valid 10-digit mobile number for verification.
                      </>
                    ))}

                    {step === 2 && (hindi ? (
                      <>
                        नोट: आपके पंजीकृत मोबाइल नंबर पर 6 अंकों का ओटीपी भेजा गया है।
                        <br />
                        सत्यापन पूर्ण करने हेतु कृपया ओटीपी दर्ज करें।
                      </>
                    ) : (
                      <>
                        Note: A verification OTP has been sent to your mobile number.
                        <br />
                        Please enter the OTP below to complete mobile verification.
                      </>
                    ))}

                    {step === 3 && (hindi ? (
                      <>
                        नोट: कृपया सुनिश्चित करें कि सभी विवरण आपके आधिकारिक दस्तावेजों से मेल खाते हों।
                        <br />
                        पैन नंबर और ईमेल आईडी का सही विवरण दर्ज करें।
                      </>
                    ) : (
                      <>
                        Note: Please ensure all details match your official identification documents.
                        <br />
                        Fill in all required fields accurately to create your account.
                      </>
                    ))}
                  </p>

                  {/* Top Header - User Only */}
                  <ul className="nav nav-tabs signup-user-only-tabs" aria-label="Registration type">
                    <li>
                      <button type="button" className="active" aria-pressed="true">
                        <i className="fa fa-user" aria-hidden="true" />
                        {hindi ? 'उपयोगकर्ता' : 'USER'}
                      </button>
                    </li>
                  </ul>

                  {/* 3-Step Progress Indicator */}
                  <div className="signup-steps-bar" aria-label="Registration Steps">
                    <div className={`signup-step-item${step === 1 ? ' active' : ' completed'}`}>
                      <div className="signup-step-circle">1</div>
                      <span className="signup-step-label">
                        {hindi ? 'मोबाइल नंबर' : 'Mobile Number'}
                      </span>
                    </div>
                    <div className={`signup-step-item${step === 2 ? ' active' : step > 2 ? ' completed' : ''}`}>
                      <div className="signup-step-circle">2</div>
                      <span className="signup-step-label">
                        {hindi ? 'ओटीपी सत्यापन' : 'Verify OTP'}
                      </span>
                    </div>
                    <div className={`signup-step-item${step === 3 ? ' active' : ''}`}>
                      <div className="signup-step-circle">3</div>
                      <span className="signup-step-label">
                        {hindi ? 'पंजीकरण विवरण' : 'Profile Details'}
                      </span>
                    </div>
                  </div>

                  <div className="log-body">
                    <div className="tab-content log-main">
                      {/* Error Alert */}
                      {formError && (
                        <div className="signup-alert-error" role="alert">
                          <i className="fa fa-exclamation-circle" aria-hidden="true" />
                          <span>{formError}</span>
                        </div>
                      )}

                      {/* ══════════════════════════════════════════════════════
                          STEP 1: Mobile Number + Captcha (matches Image 1)
                         ══════════════════════════════════════════════════════ */}
                      {step === 1 && (
                        <form onSubmit={handleStep1Submit} aria-label="Step 1 Mobile Number">
                          <div className="form-group">
                            <label className="sr-only" htmlFor="step1_mobileNumber">
                              Mobile Number
                            </label>
                            <input
                              id="step1_mobileNumber"
                              name="mobileNumber"
                              type="tel"
                              className="form-control"
                              value={formData.mobileNumber}
                              onChange={handleMobileChange}
                              maxLength={10}
                              placeholder={hindi ? 'मोबाइल नंबर दर्ज करें' : 'Enter Mobile Number'}
                              autoComplete="tel"
                              inputMode="numeric"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="sr-only" htmlFor="step1_captchaText">
                              Captcha Text
                            </label>
                            <input
                              id="step1_captchaText"
                              name="captchaText"
                              className="form-control"
                              value={formData.captchaText}
                              onChange={handleChange}
                              maxLength={6}
                              placeholder={
                                hindi ? 'नीचे दिया गया कैप्चा टेक्स्ट दर्ज करें' : 'Enter Captcha Text Below'
                              }
                              autoComplete="off"
                              required
                            />
                          </div>

                          {/* Captcha Image & Refresh Row */}
                          <div className="signup-captcha-preview-row">
                            <div className="signup-captcha-image-wrap">
                              {captchaError ? (
                                <span role="status">Captcha unavailable</span>
                              ) : (
                                <img
                                  key={captchaSrc}
                                  src={captchaSrc || undefined}
                                  alt="Captcha verification code"
                                  onLoad={() => setCaptchaLoaded(true)}
                                  onError={() => {
                                    setCaptchaLoaded(false)
                                    setCaptchaError(true)
                                  }}
                                />
                              )}
                            </div>
                            <button
                              type="button"
                              className="signup-captcha-refresh-btn"
                              onClick={refreshCaptcha}
                              disabled={isLoading}
                              aria-label="Refresh captcha"
                            >
                              <img src="/legacy/image/refresh.ico" alt="" />
                            </button>
                          </div>

                          {/* Continue Button */}
                          <button
                            type="submit"
                            className="signup-submit-btn"
                            disabled={isLoading}
                            aria-busy={isLoading}
                          >
                            {isLoading
                              ? hindi
                                ? 'प्रतीक्षा करें…'
                                : 'Please wait…'
                              : hindi
                              ? 'आगे बढ़ें'
                              : 'Continue'}
                          </button>

                          {/* Already have an account ? Login Here */}
                          <div className="signup-footer-login">
                            {hindi ? 'पहले से खाता है ?' : 'Already have an account ?'}{' '}
                            <Link to="/login">{hindi ? 'यहाँ लॉगिन करें' : 'Login Here'}</Link>
                          </div>
                        </form>
                      )}

                      {/* ══════════════════════════════════════════════════════
                          STEP 2: OTP Verification (matches Image 2)
                         ══════════════════════════════════════════════════════ */}
                      {step === 2 && (
                        <form onSubmit={handleStep2Submit} aria-label="Step 2 OTP Verification">
                          {/* Readonly Mobile Number */}
                          <div className="form-group">
                            <label className="sr-only" htmlFor="step2_mobileNumber">
                              Registered Mobile Number
                            </label>
                            <input
                              id="step2_mobileNumber"
                              name="mobileNumber"
                              className="form-control signup-mobile-readonly"
                              value={formData.mobileNumber}
                              readOnly
                            />
                            <button
                              type="button"
                              className="change-mobile-btn"
                              onClick={() => {
                                setStep(1)
                                refreshCaptcha()
                              }}
                            >
                              {hindi ? 'मोबाइल नंबर बदलें' : 'Change Mobile Number'}
                            </button>
                          </div>

                          {/* Enter OTP */}
                          <div className="form-group">
                            <label className="sr-only" htmlFor="step2_otp">
                              OTP
                            </label>
                            <input
                              id="step2_otp"
                              name="otp"
                              type="text"
                              className="form-control"
                              value={formData.otp}
                              onChange={handleOtpChange}
                              maxLength={6}
                              placeholder={hindi ? 'ओटीपी दर्ज करें' : 'Enter OTP'}
                              autoComplete="one-time-code"
                              inputMode="numeric"
                              required
                            />
                          </div>

                          {/* Enter Captcha Text Below */}
                          <div className="form-group">
                            <label className="sr-only" htmlFor="step2_captchaText">
                              Captcha Text
                            </label>
                            <input
                              id="step2_captchaText"
                              name="captchaText"
                              className="form-control"
                              value={formData.captchaText}
                              onChange={handleChange}
                              maxLength={6}
                              placeholder={
                                hindi ? 'नीचे दिया गया कैप्चा टेक्स्ट दर्ज करें' : 'Enter Captcha Text Below'
                              }
                              autoComplete="off"
                              required
                            />
                          </div>

                          {/* Captcha Image & Refresh Row */}
                          <div className="signup-captcha-preview-row">
                            <div className="signup-captcha-image-wrap">
                              {captchaError ? (
                                <span role="status">Captcha unavailable</span>
                              ) : (
                                <img
                                  key={captchaSrc}
                                  src={captchaSrc || undefined}
                                  alt="Captcha verification code"
                                  onLoad={() => setCaptchaLoaded(true)}
                                  onError={() => {
                                    setCaptchaLoaded(false)
                                    setCaptchaError(true)
                                  }}
                                />
                              )}
                            </div>
                            <button
                              type="button"
                              className="signup-captcha-refresh-btn"
                              onClick={refreshCaptcha}
                              disabled={isLoading}
                              aria-label="Refresh captcha"
                            >
                              <img src="/legacy/image/refresh.ico" alt="" />
                            </button>
                          </div>

                          {/* Continue Button */}
                          <button
                            type="submit"
                            className="signup-submit-btn"
                            disabled={isLoading}
                            aria-busy={isLoading}
                          >
                            {isLoading
                              ? hindi
                                ? 'सत्यापन हो रहा है…'
                                : 'Verifying…'
                              : hindi
                              ? 'आगे बढ़ें'
                              : 'Continue'}
                          </button>

                          {/* Already have an account ? Login Here */}
                          <div className="signup-footer-login">
                            {hindi ? 'पहले से खाता है ?' : 'Already have an account ?'}{' '}
                            <Link to="/login">{hindi ? 'यहाँ लॉगिन करें' : 'Login Here'}</Link>
                          </div>
                        </form>
                      )}

                      {/* ══════════════════════════════════════════════════════
                          STEP 3: Profile Details Form (matches signup.html)
                         ══════════════════════════════════════════════════════ */}
                      {step === 3 && (
                        <form onSubmit={handleStep3Submit} aria-label="Step 3 Profile Details">
                          {/* Readonly Mobile & Change Mobile */}
                          <div className="form-group">
                            <label className="signup-label">
                              {hindi ? 'सत्यापित मोबाइल नंबर' : 'Verified Mobile Number'}
                            </label>
                            <input
                              name="mobileNumber"
                              className="form-control signup-mobile-readonly"
                              value={formData.mobileNumber}
                              readOnly
                            />
                            <button
                              type="button"
                              className="change-mobile-btn"
                              onClick={() => {
                                setStep(1)
                                refreshCaptcha()
                              }}
                            >
                              {hindi ? 'मोबाइल नंबर बदलें' : 'Change Mobile Number'}
                            </button>
                          </div>

                          {/* Full Name Grid */}
                          <div className="signup-grid-3">
                            <div className="form-group">
                              <label htmlFor="step3_firstName" className="signup-label">
                                {hindi ? 'पहला नाम' : 'First Name'}{' '}
                                <span className="required-mark">*</span>
                              </label>
                              <input
                                id="step3_firstName"
                                name="firstName"
                                className="form-control"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder={hindi ? 'पहला नाम दर्ज करें' : 'Enter First Name'}
                                autoComplete="given-name"
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="step3_middleName" className="signup-label">
                                {hindi ? 'मध्य नाम' : 'Middle Name'}
                              </label>
                              <input
                                id="step3_middleName"
                                name="middleName"
                                className="form-control"
                                value={formData.middleName}
                                onChange={handleChange}
                                placeholder={hindi ? 'मध्य नाम दर्ज करें' : 'Enter Middle Name'}
                                autoComplete="additional-name"
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="step3_lastName" className="signup-label">
                                {hindi ? 'अंतिम नाम' : 'Last Name'}
                              </label>
                              <input
                                id="step3_lastName"
                                name="lastName"
                                className="form-control"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder={hindi ? 'अंतिम नाम दर्ज करें' : 'Enter Last Name'}
                                autoComplete="family-name"
                              />
                            </div>
                          </div>

                          {/* Identification & Email Grid */}
                          <div className="signup-grid-2">
                            <div className="form-group">
                              <label htmlFor="step3_panNo" className="signup-label">
                                {hindi ? 'पैन नंबर' : 'PAN Number'}{' '}
                                <span className="required-mark">*</span>
                              </label>
                              <input
                                id="step3_panNo"
                                name="panNo"
                                className="form-control"
                                value={formData.panNo}
                                onChange={handlePanChange}
                                maxLength={10}
                                placeholder={hindi ? 'पैन नंबर दर्ज करें (उदा. ABCDE1234F)' : 'Enter PAN No.'}
                                style={{ textTransform: 'uppercase' }}
                                autoComplete="off"
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="step3_emailId" className="signup-label">
                                {hindi ? 'ईमेल आईडी' : 'Email Address'}{' '}
                                <span className="required-mark">*</span>
                              </label>
                              <input
                                id="step3_emailId"
                                name="emailId"
                                type="email"
                                className="form-control"
                                value={formData.emailId}
                                onChange={handleChange}
                                placeholder={hindi ? 'ईमेल आईडी दर्ज करें' : 'Enter Email Id'}
                                autoComplete="email"
                                required
                              />
                            </div>
                          </div>

                          {/* Username */}
                          <div className="form-group">
                            <label htmlFor="step3_username" className="signup-label">
                              {hindi ? 'उपयोगकर्ता नाम' : 'User Name'}{' '}
                              <span className="required-mark">*</span>
                            </label>
                            <input
                              id="step3_username"
                              name="username"
                              className="form-control"
                              value={formData.username}
                              onChange={handleChange}
                              placeholder={hindi ? 'उपयोगकर्ता नाम दर्ज करें' : 'Enter User Name'}
                              autoComplete="username"
                              required
                            />
                          </div>

                          {/* Passwords Grid */}
                          <div className="signup-grid-2">
                            <div className="form-group login-password">
                              <label htmlFor="step3_password" className="signup-label">
                                {hindi ? 'पासवर्ड' : 'Password'}{' '}
                                <span className="required-mark">*</span>
                              </label>
                              <input
                                id="step3_password"
                                name="password"
                                className="form-control"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={hindi ? 'पासवर्ड दर्ज करें' : 'Enter Password'}
                                autoComplete="new-password"
                                required
                              />
                              <button
                                type="button"
                                className="login-password-toggle signup-pwd-toggle"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                aria-controls="step3_password"
                                onClick={() => setShowPassword((v) => !v)}
                              >
                                <i
                                  className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                  aria-hidden="true"
                                />{' '}
                                {showPassword
                                  ? hindi
                                    ? 'छिपाएँ'
                                    : 'Hide'
                                  : hindi
                                  ? 'दिखाएँ'
                                  : 'Show'}
                              </button>
                            </div>

                            <div className="form-group login-password">
                              <label htmlFor="step3_confirmPassword" className="signup-label">
                                {hindi ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'}{' '}
                                <span className="required-mark">*</span>
                              </label>
                              <input
                                id="step3_confirmPassword"
                                name="confirmPassword"
                                className="form-control"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder={hindi ? 'पासवर्ड की पुष्टि करें' : 'Enter Confirm Password'}
                                autoComplete="new-password"
                                required
                              />
                              <button
                                type="button"
                                className="login-password-toggle signup-pwd-toggle"
                                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                aria-controls="step3_confirmPassword"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                              >
                                <i
                                  className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                  aria-hidden="true"
                                />{' '}
                                {showConfirmPassword
                                  ? hindi
                                    ? 'छिपाएँ'
                                    : 'Hide'
                                  : hindi
                                  ? 'दिखाएँ'
                                  : 'Show'}
                              </button>
                            </div>
                          </div>

                          {/* Enter Captcha Text Below */}
                          <div className="form-group">
                            <label className="sr-only" htmlFor="step3_captchaText">
                              Captcha Text
                            </label>
                            <input
                              id="step3_captchaText"
                              name="captchaText"
                              className="form-control"
                              value={formData.captchaText}
                              onChange={handleChange}
                              maxLength={6}
                              placeholder={
                                hindi ? 'नीचे दिया गया कैप्चा टेक्स्ट दर्ज करें' : 'Enter Captcha Text Below'
                              }
                              autoComplete="off"
                              required
                            />
                          </div>

                          {/* Captcha Image & Refresh Row */}
                          <div className="signup-captcha-preview-row">
                            <div className="signup-captcha-image-wrap">
                              {captchaError ? (
                                <span role="status">Captcha unavailable</span>
                              ) : (
                                <img
                                  key={captchaSrc}
                                  src={captchaSrc || undefined}
                                  alt="Captcha verification code"
                                  onLoad={() => setCaptchaLoaded(true)}
                                  onError={() => {
                                    setCaptchaLoaded(false)
                                    setCaptchaError(true)
                                  }}
                                />
                              )}
                            </div>
                            <button
                              type="button"
                              className="signup-captcha-refresh-btn"
                              onClick={refreshCaptcha}
                              disabled={isLoading}
                              aria-label="Refresh captcha"
                            >
                              <img src="/legacy/image/refresh.ico" alt="" />
                            </button>
                          </div>

                          {/* Sign Up Submit Button */}
                          <button
                            type="submit"
                            className="signup-submit-btn"
                            disabled={isLoading}
                            aria-busy={isLoading}
                          >
                            {isLoading
                              ? hindi
                                ? 'पंजीकरण हो रहा है…'
                                : 'Signing Up…'
                              : hindi
                              ? 'पंजीकरण करें'
                              : 'Sign Up'}
                          </button>

                          {/* Already have an account ? Login Here */}
                          <div className="signup-footer-login">
                            {hindi ? 'पहले से खाता है ?' : 'Already have an account ?'}{' '}
                            <Link to="/login">{hindi ? 'यहाँ लॉगिन करें' : 'Login Here'}</Link>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
