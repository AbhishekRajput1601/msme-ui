import LandReferencePage from './reference/LandReferencePage'
export default function LandAllotmentPage({ undeveloped = false }) {
  return <LandReferencePage name={undeveloped ? 'vacantLandListUN' : 'vacantLandList'} />
}
