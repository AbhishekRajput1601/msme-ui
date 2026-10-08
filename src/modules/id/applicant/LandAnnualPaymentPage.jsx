import LandReferencePage from './reference/LandReferencePage'
const names = { list:'annualPayments', form:'applicantAnnualPayment', history:'viewAnnualPaymentHistory', detail:'viewAnnualPaymentDetails' }
export default function LandAnnualPaymentPage({ mode = 'list' }) { return <LandReferencePage name={names[mode]} /> }
