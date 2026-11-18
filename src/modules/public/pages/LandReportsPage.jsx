import BackendTablePage from '../components/BackendTablePage'
const columns = [{"field": "industrialAreaName", "label": "Industrial area"}, {"field": "financialYear", "label": "Financial year"}, {"field": "collectorRate", "label": "Collector rate (as supplied)"}]
export default function LandReportsPage() {
  return <BackendTablePage title="Land Reports — Collector Rates" endpoint="/idLanding/fetchCollectorRateList" envelope="data" columns={columns} />
}
