import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTranslation } from '../../hooks/useTranslation'
import { getCaptchaUrl } from '../../services/authService'
import { getDefaultRouteForRoles } from '../../routes/roleRoutes'
import '../../styles/login-page.css'

export default function LoginPage() {
  const { login } = useAuth()
  const { locale } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [captchaText, setCaptchaText] = useState('')
  const [loginType, setLoginType] = useState('APPLICANT')
  const [captchaSrc, setCaptchaSrc] = useState(() => getCaptchaUrl())
  const [captchaError, setCaptchaError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const hindi = locale === 'hi'

  const refreshCaptcha = () => {
    setCaptchaError(false)
    setCaptchaSrc(getCaptchaUrl())
    setCaptchaText('')
  }
  const handleSubmit = async event => {
    event.preventDefault()
    setErrorMessage(null)
    if (!username.trim() || !password) {
      setErrorMessage('Please provide both username and password.')
      return
    }
    setIsLoading(true)
    try {
      const user = await login({ username: username.trim(), password, captchaText: captchaText.trim(), loginType, language: hindi ? 'hi_IN' : 'en_US' })
      navigate(location.state?.from?.pathname || getDefaultRouteForRoles(user.roles), { replace: true })
    } catch (error) {
      refreshCaptcha()
      setErrorMessage(error?.response?.data?.message || error.message || 'Authentication failed. Please verify credentials.')
    } finally { setIsLoading(false) }
  }

  return <div className="container legacy-login-page">
    <div className="inner-content"><div className="panel panel-default content_text"><div className="panel-body content_text_body">
      <div className="side-bar"><div className="login"><div className="with-nav-tabs legacy-login-box">
        <p className="login-notice">Note: Only single login per User Name is allowed at a time. <br />If you try to login multiple, then only last logged in session will active.</p>
        {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
        <ul className="nav nav-tabs" aria-label="Login type">
          <li><button type="button" className={loginType === 'APPLICANT' ? 'active' : ''} aria-pressed={loginType === 'APPLICANT'} onClick={() => setLoginType('APPLICANT')}><i className="fa fa-user" />{hindi ? 'उपयोगकर्ता' : 'User'}</button></li>
          <li><button type="button" className={loginType === 'DEPARTMENT' ? 'active' : ''} aria-pressed={loginType === 'DEPARTMENT'} onClick={() => setLoginType('DEPARTMENT')}><i className="fa fa-home" />{hindi ? 'विभाग' : 'Department'}</button></li>
        </ul>
        <div className="log-body"><div className="tab-content log-main">
          <form onSubmit={handleSubmit} aria-label={loginType === 'APPLICANT' ? 'User login' : 'Department login'}>
            <div className="form-group login-through"><strong>{hindi ? 'लॉगिन माध्यम:' : 'Login Through:'}</strong><label><input type="radio" checked readOnly name="loginThrough" value="userName" /> {hindi ? 'उपयोगकर्ता नाम' : 'User Name'}</label></div>
            <div className="form-group"><label className="sr-only" htmlFor="j_username">User Name</label><input id="j_username" name="j_username" className="form-control" value={username} onChange={event => setUsername(event.target.value)} placeholder={hindi ? 'उपयोगकर्ता नाम' : 'User Name'} autoComplete="username" required /></div>
            <div className="form-group login-password"><label className="sr-only" htmlFor="j_password">Password</label><input id="j_password" name="j_password" className="form-control" type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} placeholder={hindi ? 'पासवर्ड' : 'Password'} autoComplete="current-password" required /><button type="button" className="login-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-controls="j_password" onClick={() => setShowPassword(value => !value)}><i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" /> {showPassword ? (hindi ? '\u091b\u093f\u092a\u093e\u090f\u0901' : 'Hide') : (hindi ? '\u0926\u093f\u0916\u093e\u090f\u0901' : 'Show')}</button></div>
            <div className="form-group legacy-captcha"><label className="sr-only" htmlFor="captchaText">Captcha</label><input id="captchaText" name="captchaText" className="form-control" value={captchaText} onChange={event => setCaptchaText(event.target.value)} maxLength={6} placeholder={hindi ? 'कैप्चा' : 'Captcha'} autoComplete="off" required /><div className="captcha-image">{captchaError ? <span role="status">Captcha unavailable</span> : <img key={captchaSrc} src={captchaSrc} alt="Captcha verification code" onError={() => setCaptchaError(true)} />}</div><button type="button" onClick={refreshCaptcha} aria-label="Refresh captcha"><img src="/legacy/image/refresh.ico" alt="" /></button></div>
            <div className="legacy-login-actions"><button type="submit" className="btn btn-warning" disabled={isLoading} aria-busy={isLoading}>{isLoading ? 'Logging in…' : hindi ? 'लॉगिन' : 'Login'}</button>{loginType === 'APPLICANT' && <Link className="btn btn-warning" to="/signup">{hindi ? 'पंजीकरण' : 'Sign Up'}</Link>}</div>
            <p className="login-recovery">Forgot your password ? <Link to="/forgot-password">Click Here</Link></p>
            <p className="login-recovery">Forgot your user name ? <Link to="/forgot-username">Click Here</Link></p>
          </form>
        </div></div>
      </div></div></div>
    </div></div></div>
  </div>
}
