import BackendTablePage, { ServiceLink } from '../components/BackendTablePage'
const columns = [
  { field: 'plotNumber', label: 'Plot number' },
  { field: 'industrialAreaName', label: 'Industrial area' },
  { field: 'districtName', label: 'District' },
  { field: 'tehsilName', label: 'Tehsil' },
  { field: 'totalPlotArea', label: 'Area (sq. m)' },
  { field: 'premiumCharges', label: 'Premium (₹)' },
  { field: 'category', label: 'Category' },
]
export default function VacantLandUndevelopedPage() {
  return <BackendTablePage title="Undeveloped Land Allotment" endpoint="/idLanding/fetchAllLandAllotmentList"
    params={{ industrialArea: 'Undeveloped Land' }} columns={columns}
    actions={<ServiceLink to="/applicant/land-allotment/explore">Open application workflow</ServiceLink>} />
}
