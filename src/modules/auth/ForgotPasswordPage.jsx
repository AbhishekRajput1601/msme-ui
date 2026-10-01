import BackendAccountForm from './BackendAccountForm'
import { useTranslation } from '../../hooks/useTranslation'

export default function ForgotPasswordPage() {
  const { locale } = useTranslation()
  return <BackendAccountForm entry="/website/viewforgotpassword" fallbackAction="/website/resetpassword" title={locale === 'hi' ? 'पासवर्ड रीसेट' : 'Reset password'} />
}
