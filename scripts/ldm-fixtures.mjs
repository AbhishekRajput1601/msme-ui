export function fixture(url,method) {
  const app={applicationId:'LDM-1',unitOrInstName:'Industrial Unit One',applicationDate:'20/10/2026',currentStatusId:21,status:'Secretary Verified'}
  const detail={...app,indOrgName:'Industrial Unit One',fullName:'Test Applicant',schemeYear:'2025',district:'Bhopal',panNo:'ABCDE1234F',panUploadId:19,faIndustrialUnitBean:{unitType:'Other',capitalInvestmentBeans:[{investmentName:'Plant & Machinery',amount:150000}],unitProductDetailsBeans:[],oldApplicationId:'OLD-1'},faRequiredAssistanceBean:{}}
  if(method==='POST')return {successMessage:'Submitted successfully.'}
  if(url.pathname.endsWith('/fetchApplications'))return [app,{...app,applicationId:'LOCKED-2',currentStatusId:22,status:'LDM Verified'}]
  if(url.pathname.endsWith('/fetchBatches'))return [{batchId:4,batchCode:'BATCH-4',totalApplications:1,coveringLetterNo:'LETTER-4',ldmReceivedDate:'21/10/2026',batchStatus:'LDM Pending'}]
  if(url.pathname.endsWith('/batchDetail/4'))return {batchId:4,batchCode:'BATCH-4',totalApplications:1,applications:[{applicationNo:'LDM-1',unitOrInstName:app.unitOrInstName,applicationDate:app.applicationDate,gmRemark:'Checked',secretaryRemark:'Approved',assistanceList:[{assistanceType:'Capital subsidy',eligibleAmount:0,remark:'Document needs verification'},{assistanceType:'Power subsidy',eligibleAmount:1500}]}]}
  if(/\/history\//.test(url.pathname))return [{roleName:'Secretary',actionStatus:'Verified',remarks:'Checked',verifiedBy:'Officer',verifiedDate:'20/10/2026'}]
  if(/\/detailData\/|fetchUserIndustrialDetailsByApplicationId/.test(url.pathname))return detail
  if(/\/dticEligible\//.test(url.pathname))return {eligibleAmount:1500,gmRemark:'Checked'}
  if(/\/applicantAssistances\//.test(url.pathname))return [{assistanceType:'Power subsidy',eligibleAmount:1500,sanctionedAmount:1200}]
  if(url.pathname.endsWith('/fa/fetchHistory'))return [{status:'Secretary Verified',remarks:'Checked',processDate:'20/10/2026'}]
  if(url.pathname.endsWith('/fetchAllIndustryCategory'))return {'1':'Manufacturing'}
  if(/download/.test(url.pathname))return 'test document'
  return {}
}
