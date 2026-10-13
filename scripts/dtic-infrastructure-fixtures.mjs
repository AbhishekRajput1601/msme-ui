import fs from 'node:fs'
export const routes = JSON.parse(fs.readFileSync('src/modules/dtic/infrastructure/generated/routes.json','utf8'))
const reference = 'E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp/pages/'
const land = { vacantLandId:1,industrialAreaId:1,locationId:1,districtId:1,dticId:1,tehsilId:1,collectorRateId:1,plotNumber:'P-1',industrialAreaName:'Test Industrial Area',totalPlotArea:100,plotShed:'Plot',premiumCharges:1000,developmentCharges:100,maintenanceCharges:10,leaseRent:20,securityDeposit:30,advanceRent:40,totalAmount:1200,totalAmountHidden:1200,otherRentCharges:0,category:'OpenForAll',bookingStartDate:'01/11/2026 11:00',bookingEndDate:'15/11/2026 17:00' }
export function fixture(url, method='GET', viewOverride) {
  const key = url.pathname.replace(/^\/mpmsme\/dtic\//,'').replace(/\/$/,'')
  if (method==='POST') return { successMessage:'Saved',vcId:1 }
  if (key.startsWith('getMessage/')) return { value:'Confirm this action?' }
  if (key==='fetchdticdistrictsmap') return [{key:1,value:'Bhopal'}]
  if (key==='fetchdticmap') return {1:'DTIC Bhopal'}
  if (/fetchtehsilmap|fetchalltehsilsmap|fetchindustrialareamapbydistrict/.test(key)) return [{key:1,value:'Test Area'}]
  if (key==='fetchIndustrialAreaList') return [{industrialAreaId:1,industrialAreaName:'Test Industrial Area',key:1,value:'Test Industrial Area'}]
  if (key==='fetchIndustrialAreas') return [{...land,location:'Test Location',totalLandArea:10}]
  if (/fetchIndustrialAreaBy|fetchIndustrialAreaDetail/.test(key)) return {...land,location:'Test Location',totalLandArea:10}
  if (key==='fetchFinancialYear') return [{financialYearId:1,financialYear:'2026-27',key:1,value:'2026-27'}]
  if (key==='fetchRateTypeList') return [{rateTypeId:1,rateType:'Micro',key:1,value:'Micro'}]
  if (key==='fetchPurposeList') return [{purposeId:1,purposeName:'Industrial'}]
  if (/fetchCollectorRateById|fetchIndustrialAreaRateById/.test(key)) return {...land,collectorRate:100,rateTypeId:1,financialYearId:1,areaId:1}
  if (key==='fetchAreaName') return {responseMessage:'Test Industrial Area'}
  if (key==='fetchMasterRatesByCollectorRateId') return 100
  if (key==='fetchRatesByCollectorRateIdAndAreaLeaseRent') return land
  if (key.startsWith('fetchvacantlanddetail/')) return land
  if (/generateLOILetter1|fetchApplicationDetail/.test(key)) return {applicantId:1,applicationId:'ID-1',fullName:'Test Applicant',vacantLandBean:land}
  if (/fetchLOI|fetchLOIDetail/.test(key)) return {}
  if (/loadNoticeDetails/.test(key)) return {noticeId:1,applicantId:1,documentId:1}
  if (/fetchHearingDetails/.test(key)) return {appealConditionalDecisionZOBean:{},appealConditionalDecisionICBean:{}}
  if (/loadAppealDetails/.test(key)) return {appealId:1}
  if (key==='fetchLandAllotmentList') return {aaData:[{...land,industrialAreaMap:true,mapName:'plot.pdf',mapFileName:'plot.kml',googleMap:'https://maps.google.com/?q=23,77',isEditable:true,districtName:'Bhopal',tehsilName:'Huzur',location:'Test location'}],iTotalRecords:1,iTotalDisplayRecords:1}
  if (key==='fetchApplicationForNoticeList') return {aaData:[{applicantId:1,statusId:15,fullName:'Test Applicant',vacantLandBean:land,idNoticeBean:null}],iTotalRecords:1,iTotalDisplayRecords:1}
  const page = routes.find(route => key===route.endpoint.slice(1) || key.startsWith(route.endpoint.slice(1)+'/'))
  if (page) {
    const name = viewOverride && page.views.includes(viewOverride) ? viewOverride : page.views.at(-1)
    return fs.readFileSync(reference+name+'.html','utf8').replace(/th:value="\$\{(?:decryptedIdString|encryptedString)\}"/g,'value="1"')
  }
  return []
}
