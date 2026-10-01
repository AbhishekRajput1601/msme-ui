import BackendAccountForm from './BackendAccountForm'
import { useTranslation } from '../../hooks/useTranslation'

export default function ForgotUsernamePage() {
  const { locale } = useTranslation()
  return <BackendAccountForm entry="/website/viewforgotusername" fallbackAction="/website/login-through-mobile" title={locale === 'hi' ? 'उपयोगकर्ता नाम प्राप्त करें' : 'Recover username'} />
}
