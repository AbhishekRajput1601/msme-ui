import BackendTablePage from '../components/BackendTablePage'
const columns = [{"field": "areaName", "label": "Industrial area"}, {"field": "districtName", "label": "District"}, {"field": "tehsilName", "label": "Tehsil"}, {"field": "location", "label": "Location"}, {"field": "totalArea", "label": "Total area (as supplied)"}]
export default function IndustrialAreasPage() {
  return <BackendTablePage title="Industrial Areas Directory" endpoint="/idLanding/fetchIndustrialAreas" envelope="data" columns={columns} />
}
