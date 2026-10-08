export function applicantServiceLink(hash) {
  const path = String(hash).replace(/^#\/?/, '')
  const routes = { mpidcServices:'/applicant/online-nocs', msmeAwardList:'/applicant/msme-award', 'bank/addBankDetails':'/applicant/bank-details/new', 'bank/banksList':'/applicant/bank-details' }
  return routes[path] || '/applicant/msme-award/' + path
}
