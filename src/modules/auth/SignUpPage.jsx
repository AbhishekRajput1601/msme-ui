import BackendAccountForm from './BackendAccountForm'
import { useTranslation } from '../../hooks/useTranslation'

export default function SignUpPage() {
  const { locale } = useTranslation()
  return <BackendAccountForm entry="/website/viewsignup" fallbackAction="/website/presignup" title={locale === 'hi' ? 'नया खाता बनाएँ' : 'Create an account'} />
}
