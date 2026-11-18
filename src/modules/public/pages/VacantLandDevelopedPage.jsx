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
export default function VacantLandDevelopedPage() {
  return <BackendTablePage title="Developed Land Allotment" endpoint="/idLanding/fetchAllLandAllotmentList"
    params={{ industrialArea: 'Industrial Area' }} columns={columns}
    actions={<ServiceLink to="/applicant/land-allotment/new">Open application workflow</ServiceLink>} />
}
