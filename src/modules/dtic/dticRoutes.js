import existing from './generated/routes.json'
import infrastructure from './infrastructure/generated/routes.json'
import ox from './ox/generated/routes.json'
import reports from './reports/generated/routes.json'

const aliases = [
  { path: 'enrollmentList', views: ['dtic/enrolmentList'], endpoint: '/enrolmentList', controller: 'DTICController' },
  { path: 'viewenrollmentform/:userId', views: ['dtic/enrolment/viewenrolmentform'], endpoint: '/viewenrolmentform', controller: 'DTICController' },
]

export default [...reports, ...ox, ...existing, ...infrastructure, ...aliases]
