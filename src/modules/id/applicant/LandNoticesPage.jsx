import { useParams } from 'react-router-dom'
import LandReferencePage, { noticeViews } from './reference/LandReferencePage'
export default function LandNoticesPage() { const { mode } = useParams(); return <LandReferencePage name={mode ? noticeViews[mode] : 'noticeAppealList'} /> }
