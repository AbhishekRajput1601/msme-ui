import { useParams } from 'react-router-dom'
import ResolvedLandPage from './reference/ResolvedLandPage'
export default function LandAnnualReviewPage({ appeal = false }) {
  const { paymentId, appealId } = useParams()
  const id = appeal ? appealId : paymentId
  return <ResolvedLandPage key={id} path={`id/${appeal ? 'reviewAppealPayment' : 'reviewAnnualPayment'}/${encodeURIComponent(id)}`} identity={[appeal ? 'appealId' : 'paymentId', id]} amountField={appeal ? 'appealFees' : 'totalCharges'} />
}
