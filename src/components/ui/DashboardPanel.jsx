import { Link } from 'react-router-dom'

/** Dashboard tile structure from pages/dtic/dashboard.html. */
export default function DashboardPanel({ label, value, href, icon = 'tasks', children }) {
  return <div className="panel panel-primary">
    <div className="panel-heading">
      <div className="dashboard-stat"><i className={`fa fa-${icon} fa-4x`} aria-hidden="true" /><div className="huge">{value}</div></div>
      <div className="dashboard-label">{label}</div>
    </div>
    {href ? <Link to={href} className="panel-footer"><span>View Details</span><i className="fa fa-arrow-circle-right" aria-hidden="true" /></Link> : <div className="panel-footer">{children}</div>}
  </div>
}
