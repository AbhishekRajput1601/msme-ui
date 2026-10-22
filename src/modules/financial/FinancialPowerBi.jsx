import './financial-powerbi.css'

const reports = [
  { title: 'View Details', href: 'https://app.powerbi.com/reportEmbed?reportId=863a42fe-2ab1-48a5-8c34-e089462fa983&autoAuth=true&ctid=1fdf7842-4678-46ae-a274-c03e2c64098d' },
  { title: 'View Details FA', href: '/mpmsme/dashboard/FA-dashboard' },
]

export default function FinancialPowerBi() {
  return <section className="fa-powerbi" aria-labelledby="fa-powerbi-title">
    <div className="fa-powerbi-content">
      <header className="fa-powerbi-heading">
        <h1 id="fa-powerbi-title">Power BI dashboard</h1>
      </header>
      <article className="fa-powerbi-card" aria-labelledby="fa-powerbi-card-title">
        <div className="fa-powerbi-banner">
          <h2 id="fa-powerbi-card-title">MSME Financial Assistance</h2>
        </div>
        <nav className="fa-powerbi-reports" aria-label="Financial assistance reports">
          {reports.map(report => <a key={report.title} href={report.href} target="_blank" rel="noopener noreferrer" className="fa-powerbi-report">
            <span className="fa-powerbi-report-text">{report.title}</span>
            <span aria-hidden="true">&#8599;</span>
            <span className="fa-powerbi-sr-only"> (opens in a new tab)</span>
          </a>)}
        </nav>
        <p className="fa-powerbi-footnote">Reports open in a new tab</p>
      </article>
    </div>
  </section>
}
