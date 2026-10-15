export const routes = [1,2,3,4].map(n => ({path:`ox${n}Form`}))
export function fixture(url, method) {
  const endpoint = url.pathname.split('/').at(-1)
  if (method === 'POST') return { successMessage: 'Saved successfully' }
  const match = endpoint.match(/^fetchOx([1-4])FormDetails$/)
  if (match) {
    const n = Number(match[1])
    const row = { supplierDistrictName:'Bhopal', supplierName:`Supplier ${n}`, openingStock:10, receivedQty:5, totalAvailable:15, closingStock:12,
      openingStockDType:10, openingStockBType:20, dtypeFilled:5, btypeFilled:5, dtypeOpening:10, btypeOpening:20, dtypeReceived:5, btypeReceived:5,
      perDayCapacity:100, totalOxygenMfg:50, remarks:'Reference fixture',
      [`ox${n}DetailsBeans`]:[{supplyTypeId:'1',supplyNameId:'2',supplyName:'Facility A',supplyType:'Hospital',supplyQty:3,dtype:2,btype:3}],
      [`ox${n}ReceivedFromBeans`]:[{receivedFromId:'1',nameOfFillerReceived:'1',receivedFrom:'Supplier A',quantity:5,quantityDType:5,quantityBType:5}] }
    const date = new Date().toLocaleDateString('en-GB')
    return { entryDate:url.searchParams.get('entryDate') || date, [`ox${n}BeanList`]:[row] }
  }
  if (endpoint === 'fetchSupplyTypes') return [{key:'1', value:'Hospital'}]
  if (/fetchSupplyNames/.test(endpoint)) return [{id:'1',key:'2',value:'Facility A'}, {id:'1',key:'3',value:'Facility B'}]
  if (/fetchSupplyFromSuppliers/.test(endpoint)) return [{key:'1',value:'Supplier A'}]
  if (endpoint === 'fetchHistoricDataListDTIC') return {aaData:[{id:1, nameOfUnit:'Legacy Unit',verifyedEntity:false}], iTotalRecords:1,iTotalDisplayRecords:1}
  if (/fetchLegacyDataWithID/.test(url.pathname)) return {id:1,nameOfUnit:'Legacy Unit',industrialArea:'Area A'}
  if (/fetchIndustrialAreaList/.test(endpoint)) return [{key:'1',value:'Area A',locationId:1,locationName:'Area A'}]
  if (/fetchDticWiseCompleteDataOfLandApplicant|fetchEsignPaymentPendencyReport/.test(endpoint)) return [{nameOfUnit:'Unit A',district:'Bhopal',applicantName:'Applicant A'}]
  return []
}
