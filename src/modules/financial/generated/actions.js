// Generated from angular/fa/FAController.js; explicit React IO adapters.
export function installFinancialActions(state, {request,navigation,loading,params,format,later,dom}) {
const each=(items,fn)=>Object.entries(items||{}).forEach(([k,v])=>fn(v,Array.isArray(items)?Number(k):k));
const identity=value=>value;
state.started = false;
state.sectorofinductryList = [];
state.faMsmeDetailData = {};
state.warning = null;
state.timedout = null;
state.IdList = [];
function formatDate(dateString) {
   
var parts = dateString.split("/");


var day = parseInt(parts[0], 10);
var month = parseInt(parts[1], 10);
var year = parseInt(parts[2], 10);
    
    return year + '-' + month + '-' + day;
}
state.loadPages = function() {
				
				if(params.applicationId==null){
					state.applicationIds = params.applicationIds;
				}else{state.applicationIds = params.applicationId;}
				
				state.establishmentType = params.establishmentType;
				
				if (state.establishmentType == 'Unit') {
					state.Unitback = true;
				} else {
					state.UnitInstitue = true;
				}

				

				loading.start('sample-1');

				var responsePromise = request
					.get(
						'fetchpendingapplicantsByIds' + '/' + params.applicationIds + '/' + params.establishmentType
					);


				responsePromise.success(function(data, status, headers,
					config) {
					state.faRequestProcessBeanList = data;
					loading.finish('sample-1');
				});



			};
state.downloadChequeDocuments = function (documentId) {

    loading.start('sample-1');

    
    if (!/^[0-9]+$/.test(documentId)) {
        loading.finish('sample-1');
        return;
    }

    
    var pathParts = window.location.pathname.split('/');
    var contextPath = '/mpmsme';

    var safeUrl = window.location.origin +
        contextPath +
        '/fa/downloadChequeDocumentById/' +
        documentId;

    navigation.open(safeUrl, '_blank');

    loading.finish('sample-1');
};
state.sectorofinductry1 = function () {
    loading.start('sample-1');

    request.get('fetchAllIndustryCategory')
        .then(function (response) {
            state.sectorofinductryList = response.data;

            
            if (state.faData && state.faData.firmSector) {
                state.sectorName = state.getIndustryName(state.faData.firmSector);
            }
        })
        .catch(function (error) {
            console.log("Error while fetching industry category", error);
        })
        .finally(function () {
            loading.finish('sample-1');
        });
};
state.getIndustryName = function (industryId) {	
    return state.sectorofinductryList[industryId] || industryId;
};
state.downloadFaDocuments = function (documentId) {

    loading.start('sample-1');

    
    if (!/^[0-9]+$/.test(documentId)) {
        loading.finish('sample-1');
        return;
    }

    
    var pathParts = window.location.pathname.split('/');
    var contextPath = '/mpmsme';

    var safeUrl = window.location.origin +
        contextPath +
        '/fa/downloadFaDocumentByDocumentId/' +
        documentId;

    navigation.open(safeUrl, '_blank');

    loading.finish('sample-1');
};
state.initTodayDate = function () {
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let dd = String(today.getDate()).padStart(2, '0');
    
    let formattedDate = yyyy + '-' + mm + '-' + dd;
    
    state.faMsmeDetailData.decisionDate = formattedDate;
    state.todayDate = formattedDate;
};
state.loadInfrastructureById = function(){
		loading.start('sample-1');
				var responsePromise = request.get('fetchInfrastructureById', {
					params: {
						'id': params.id
					}
				});
				responsePromise
					.success(function(data, status, headers, config) {
						state.faData = data;

						loading.finish('sample-1');
					});
	};
state.downloadInfrastructuredocument = function(documentCode,documentType,id) {

				navigation.open('/downloadInfrastructuredocument/' + documentCode + ' / '+ documentType+'/'+id);

			};
state.displayMessage = function() {
       state.isButtonDisabled=false;
    };
state.loadList = function(){
			state.isButtonDisabled=true;
			var estType="Unit";
			var searchString=null;
			if(state.searchField==1)
				searchString="applicationDate";
			if(state.searchField==2)
				searchString="sanctionedOrderDate";
			if(state.searchField==3)
				searchString="descending";
			if(state.searchField==4)
				searchString="ascending";
			if(state.searchField==5)
				searchString="district";
			if(state.searchField==6)
				searchString="appAscending";
			if(state.searchField==7)
				searchString="appDescending";
			if(state.searchField==8)
				searchString="sancAscending";
			if(state.searchField==9)
				searchString="sancDescending";
			if(state.searchField==10)
				searchString="disbursAscending";
			if(state.searchField==11)
				searchString="disbursDescending";
			var formattedOrderDate1=null;
			var formattedOrderDate2=null;
			if(state.entryDate1!=null){
				var orderDate1= state.entryDate1;
				 formattedOrderDate1 = formatDate(orderDate1);
			}
			
			if(state.entryDate2!=null){
				var orderDate2 = state.entryDate2;
			   formattedOrderDate2 = formatDate(orderDate2);
			}
				var responsePromise = request.post(
   				 'fetchDisbursementListNew' + '/' + estType + '/' + searchString +'/'+formattedOrderDate1+'/'+formattedOrderDate2
			);
		responsePromise.success(function(data, status, headers, config) {
			state.disbursementList = data;
			if (data === null || data.length === 0) {
       
        alert("No records found for disbursement !!!");
    }
			
							
		});
		};
state.reset = function(){
	state.searchField=false;
	state.entryDate1="";
	state.entryDate2="";
};
state.DisbursementExportToExcel = function() {
	alert("ok");
	
				
		navigation.open('print_disbursementCalculator');
	};
state.proceedtoDisbursement = function () {
				var fd = new FormData();
				 each(state.disbursementList, function(bean){
					if(bean.check){
				
            	if(bean.applicationId!=null){
					fd.append('applicationId',bean.applicationId);
					}
            	if (bean.districtId!=null) {
							fd.append('districtId',bean.districtId);
						}
				if (bean.unitOrInstName!=null) {
							fd.append('unitOrInstName',bean.unitOrInstName);
						}
				if (bean.memoPart2AckNo!=null) {
							fd.append('memoPart2AckNo',bean.memoPart2AckNo);
						}
				if (bean.unitType!=null) {
							fd.append('unitType',bean.unitType);
						}
				if (bean.currentStatusId!=null) {
							fd.append('unitType',bean.currentStatusId);
						}
				if (bean.status!=null) {
							fd.append('unitType',bean.status);
						}
				if (bean.establishmentType!=null) {
							fd.append('establishmentType',bean.establishmentType);
						}
				if (bean.reqStatusId!=null) {
							fd.append('reqStatusId',bean.reqStatusId);
						}
				if (bean.applicationDate!=null) {
							fd.append('reqStatusId',bean.applicationDate);
						}
				if (bean.disbursedAmount!=null) {
							fd.append('disbursedAmount',bean.disbursedAmount);
						}
				if (bean.sanctionedAmount!=null) {
							fd.append('sanctionedAmount',bean.sanctionedAmount);
						}
				if (bean.disbursementAmount!=null) {
							fd.append('disbursementAmount',bean.disbursementAmount);
						}
				}
					})
					console.log("Success"); 
					
				 var responsePromise = request.post('faDisbursementUnit_new2',
							fd, {
							transformRequest: identity,
							headers: {
								'Content-Type': undefined
							}
						});
						
						responsePromise.then(function (response) {
					    
					    
					    console.log('Response:', response.data); 
					   
					}, function (error) {
					    
					    console.log('Error:',error);
					});
						
				
		};
state.onLoadPage = function (){
			
			var encodedList = params.encodedList;
			
			var decodedList = JSON.parse(decodeURIComponent(encodedList));
			var count =0;
		    
		    state.disbursList = decodedList.filter(function (item) {
				if (item.check === true)
					count = count +1;
		       return item.check === true; 
		    });
		    if(count==0){
				alert("Please select item!!");
				navigation.location.href = 'http://localhost:8082/mpmsme/fa/home#/faDisbursementUnit_new';
			}
		    var sAmount=0;
		    for (var index = 0; index < state.disbursList.length; index++) {
				var bean = state.disbursList[index];
				sAmount+=Number(bean.sanctionedAmount);
			}
		    for (var index = 0; index < state.disbursList.length; index++) {
				var bean = state.disbursList[index];
				var per1 = parseFloat(bean.sanctionedAmount/sAmount);
				bean.percent=(per1*100).toFixed(2);
			}
			        state.isButtonDisabled = true;
		
		};
state.distribute = function () {
			var totalRows = state.disbursList.length;
       		var budgetAmt=state.totalDisbursedAmount;
       		var sAmount=0;
       		for (var index = 0; index < state.disbursList.length; index++) {
				var bean = state.disbursList[index];
				sAmount+=Number(bean.sanctionedAmount);
			}
			for (var index = 0; index < state.disbursList.length; index++) {
				var bean = state.disbursList[index];
				
				var per1 = parseFloat(bean.sanctionedAmount/sAmount);
				bean.percent=(per1*100).toFixed(2);
				var disbursementAmount= (budgetAmt * per1).toFixed(0);
				bean.disbursementAmount =  disbursementAmount;
				var reaminingAmount = bean.sanctionedAmount-bean.disbursedAmount
				if(disbursementAmount>reaminingAmount)
					bean.disbursementAmount = reaminingAmount;
				
			}
			
       		
    };
state.encodeDisbursementList = function(disbursementList) {
			
        
        var encodedList = encodeURIComponent(JSON.stringify(disbursementList));
        return encodedList;
        
    };
state.process = function() {
    var encodedList = state.encodeDisbursementList(state.disbursementList);
    if (encodedList) {
        navigation.location.href = '#faDisbursementUnit_new2/' + encodedList;
    } else {
        alert("Please select items before proceeding");
    }
};
state.processDisbursement_old = function () {
			var fd = new FormData();
		var hasError =false;
	
		
		for (var index = 0; index < state.disbursList.length; index++) {
			var bean = state.disbursList[index];
	      if(bean.check){
		
				var remain=bean.sanctionedAmount-bean.disbursedAmount;
				var current=bean.disbursementAmount;
				if(current>remain){
					alert("Disbursement amount is greater than Remaining Amount!");
					hasError = true;
					return;
				}
				
				if(bean.disbursementAmount==null){
					alert("Please Enter Disbursement Amount!");
					hasError = true;
					return;
				}
				if(bean.letterNo==null){
					alert("Please Enter Letter No!");
					hasError = true;
					return;	
				}
				if(bean.letterDate==null){
					alert("Please Enter Letter Date!");
					hasError = true;
					return;	
				}
				if(bean.disbursementDoc==null){
					alert("Please upload disbursement order!");
					hasError = true;
					return;
				}
				if(hasError){
					return;
				}
				else {
				fd.append('disbursementDoc',bean.disbursementDoc);	
				fd.append('applicationId',bean.applicationId);
				 fd.append('disbursementAmt', bean.disbursementAmount);
	            fd.append('faLetterNo', bean.letterNo);
	            fd.append('faLetterDate', bean.letterDate);
	            fd.append('remark', bean.remark);
	            }
		}
		} 
		
		

				var responsePromise = request
									.post(
										'uploadFaDisbursementOrder_new/',
										fd,
										{
											transformRequest: identity,
											headers: {
												 'Content-Type': undefined
											}
										});
				





				
			 
	    
		
			};
state.printPdf = function(){
				var fd = new FormData();
				alert("ok");
				
				fd.append('applicationId','DHR_FA_IU_2023-24_0638');
				navigation.open('print_disbursementCalculator/' ,fd);
				var responsePromise = request
									.post(
										'print_disbursementCalculator/',
										fd,
										{
											transformRequest: identity,
											headers: {
												 'Content-Type': undefined
											}
										});
										
										responsePromise.then(function (response) {
					    
					    
					    console.log('Response:', response.data); 
					   
					}, function (error) {
					    
					    console.log('Error:',error);
					});
		
			};
state.processDisbursement = function () {
			var fd = new FormData();
		var hasError =false;
	
		
		for (var index = 0; index < state.disbursList.length; index++) {
			var bean = state.disbursList[index];
	      if(bean.check){
		
				var remain=bean.sanctionedAmount-bean.disbursedAmount;
				var current=bean.disbursementAmount;
				if(current>remain){
					alert("Disbursement amount is greater than Remaining Amount!");
					hasError = true;
					return;
				}
				
				if(bean.disbursementAmount==null){
					alert("Please Enter Disbursement Amount!");
					hasError = true;
					return;
				}
				
				
				if(hasError){
					return;
				}
				else {
					
				fd.append('applicationId',bean.applicationId);
				fd.append('establishmentName',bean.unitOrInstName);
				 fd.append('disbursementAmt', bean.disbursementAmount);
	            fd.append('remark',"test");
	            fd.append('sanctioneAmount',bean.sanctionedAmount);
	            fd.append('remainingAmount',remain);
	            fd.append('percent',bean.percent);
	            fd.append('disbursedAmount',bean.disbursedAmount);
	            }
		}
		} 
		
		

				var responsePromise = request
									.post(
										'save_disbursementCalculator/',
										fd,
										{
											transformRequest: identity,
											headers: {
												 'Content-Type': undefined
											}
										});
					responsePromise.success(function(data, status, headers, config) {
			alert("Data Saved!!");
			state.isButtonDisabled=false;
			loading.finish('sample-1');
		});





				
			 
	    
		
			};
state.startOrStopSpinner = function(isStart) {

		if (isStart) {
			loading.start('sample-1');
		} else {
			loading.finish('sample-1');
		}

	};
state.loadZones = function() {
		loading.start('sample-1');

		var responsePromise = request.get('fetchZoneList');
		responsePromise.success(function(data, status, headers, config) {
			state.zoneList = data;

			loading.finish('sample-1');
		});
	};
state.loadDivisionByZone = function() {
		loading.start('sample-1');

		var responsePromise = request.get('fetchDivisionByZoneId/' + state.caseData.zoneId);
		responsePromise.success(function(data, status, headers, config) {
			state.divisionList = data;
			state.caseData.divisionId = "";
			state.caseData.districtId = "";
			state.caseData.dticId = "";

			loading.finish('sample-1');
		});
	};
state.loadDistricts = function() {

		loading.start('sample-1');
		var responseDistricts = request.get('fetchdistrictmapbystate', {
			params: { 'stateId': 20 }
		});
		responseDistricts.success(function(data, status, headers, config) {
			state.districts = data;

			loading.finish('sample-1');
		});
	};
state.loadDistrictsByDivision = function() {
		loading.start('sample-1');
		var responseDistricts = request.get('fetchdistrictmapbystateanddivision', {
			params: { 'stateId': null, 'divisionId': state.caseData.divisionId }
		});
		responseDistricts.success(function(data, status, headers, config) {
			state.districts = data;
			state.caseData.districtId = "";
			state.caseData.dticId = "";

			loading.finish('sample-1');
		});
	};
state.loadDTICByDistrict = function() {
		loading.start('sample-1');
		var responseDistricts = request.get('fetchdticmapbydistrict', {
			params: { 'districtId': state.caseData.districtId }
		});
		responseDistricts.success(function(data, status, headers, config) {
			state.dticList = data;
			state.caseData.dticId = "";

			dom('#dticId').prop('disabled', false);
			if (Object.keys(state.dticList).length == 1) {
				for (var i in state.dticList) {
					var dticId = i;
				}
				
				state.caseData.dticId = dticId + "";
				dom('#dticId').prop('disabled', 'disabled');
			} else {
				state.caseData.dticId = null;
			}

			loading.finish('sample-1');
		});
	};
state.loadDepartments = function() {
		loading.start('sample-1');
		var responseDepartments = request.get('fetchdepartmentmap');
		responseDepartments.success(function(data, status, headers, config) {
			state.departments = data;
			loading.finish('sample-1');
		});
	};
state.loadFAReport1 = function() {
		
		var table=dom("#dynamic-table").dataTable;
		
		
		var responsePromise = request.get('fetchReportData');
			loading.finish('sample-1');
		
	};
state.display = function() {
		
	};
state.faReportExportToExcel = function() {
		navigation.open('faReportExportToExcel');
	};
state.loadIndustryDetails = function () {
		if (state.faData.firmConstitution === 'Proprietorship') {
			state.leadByDetails = {
				male: '',
				female: '',
				transgender: '',
				general: '',
				obc: '',
				sc: '',
				st: ''
			};

			if (state.faData.poaGender) {
				if (state.faData.poaGender === '1') state.leadByDetails.male = '100%';
				else if (state.faData.poaGender === '2') state.leadByDetails.female = '100%';
				else state.leadByDetails.transgender = '100%';
			}

			if (state.faData.poaCategory) {
				if (state.faData.poaCategory === '1') state.leadByDetails.sc = '100%';
				else if (state.faData.poaCategory === '2') state.leadByDetails.st = '100%';
				else if (state.faData.poaCategory === '3') state.leadByDetails.obc = '100%';
				else state.leadByDetails.general = '100%';
			}

		} else {
			let malePercent = 0,
				femalePercent = 0,
				transPercent = 0,
				scPercent = 0,
				stPercent = 0,
				obcPercent = 0,
				genPercent = 0;

			each(state.faData.industrialPartnerslist, function (partner) {
				let share = parseFloat(partner.sharePercentage || '0');

				if (isNaN(share)) share = 0; 

				
				if (partner.gender === '1') malePercent += share;
				else if (partner.gender === '2') femalePercent += share;
				else transPercent += share;

				
				if (partner.category === '1') scPercent += share;
				else if (partner.category === '2') stPercent += share;
				else if (partner.category === '3') obcPercent += share;
				else genPercent += share;
			});

			state.leadByDetails = {
				male: malePercent.toFixed(2) + '%',
				female: femalePercent.toFixed(2) + '%',
				transgender: transPercent.toFixed(2) + '%',
				sc: scPercent.toFixed(2) + '%',
				st: stPercent.toFixed(2) + '%',
				obc: obcPercent.toFixed(2) + '%',
				general: genPercent.toFixed(2) + '%'
			};
		}
	};
state.loadUserIndustrialDetailsByApplicationId = function() {
				state.disabled = true;
				loading.start('sample-1');
				var responsePromise = request.get('fetchUserIndustrialDetailsByApplicationId', {
					params: {
						'applicationId': params.applicationId
					}
				});
				responsePromise
					.success(function(data, status, headers, config) {
						state.faData = data;
						state.schemeYear = data.schemeYear;
						state.showFaExpansionTable();
						state.sectorofinductry1();
						if (null == state.faData.industrialPartnerslist)
							state.faData.industrialPartnerslist = [{}];
						if (null == state.faData.regNocList)
							state.faData.regNocList = [{}];
						if (null == state.faData.faIndustrialUnitBean)
							state.faData.faIndustrialUnitBean = {};
						if (null != state.faData.faIndustrialUnitBean.oldApplicationId) {
							state.appliedBefore = 'yes';
						} else {
							state.appliedBefore = 'no';
						}
						state.showTextBox(state.appliedBefore);
						if (null == state.faData.faIndustrialUnitBean.activityDetailsList)
							state.faData.faIndustrialUnitBean.activityDetailsList = [{}];
						if (null == state.faData.faIndustrialUnitBean.capitalInvestmentBeans) {
							state.faData.faIndustrialUnitBean.capitalInvestmentBeans = [];

							state.faData.faIndustrialUnitBean.capitalInvestmentBeans.push({ investmentName: 'Plant & Machinery' });
							state.faData.faIndustrialUnitBean.capitalInvestmentBeans.push({ investmentName: 'Building' });
							if(state.schemeYear === '2025')
								state.faData.faIndustrialUnitBean.capitalInvestmentBeans.push({ investmentName: 'Other' });
                        }
						if (null == state.faData.faIndustrialUnitBean.unitProductDetailsBeans)
							state.faData.faIndustrialUnitBean.unitProductDetailsBeans = [{}];
						if (null == state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans) {
							
							state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans = [{}];
							state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans.push({});
							state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans.push({});
							state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans[0].description = 'Capital Investment in Plant & Machinery (in Lakh Rs.)';
							state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans[1].description = 'Employment';
						}
						if (null == state.faData.faRequiredAssistanceBean)
							state.faData.faRequiredAssistanceBean = {};
						if (null == state.faData.faRequiredAssistanceBean.caExpInvDetailsBean || state.faData.faRequiredAssistanceBean.caExpInvDetailsBean.length == 0)
							state.faData.faRequiredAssistanceBean.caExpInvDetailsBean = [{}];
						if (null == state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompExpInvDetailsBeans || state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompExpInvDetailsBeans.length == 0)
							state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompExpInvDetailsBeans = [{}];
						if (null == state.faData.faRequiredAssistanceBean.entryTaxExempRawMatDetailsBeans || state.faData.faRequiredAssistanceBean.entryTaxExempRawMatDetailsBeans.length == 0)
							state.faData.faRequiredAssistanceBean.entryTaxExempRawMatDetailsBeans = [{}];
						if (null == state.faData.faRequiredAssistanceBean.entryTaxExempFYProdSellDetailsBeans || state.faData.faRequiredAssistanceBean.entryTaxExempFYProdSellDetailsBeans.length == 0)
							state.faData.faRequiredAssistanceBean.entryTaxExempFYProdSellDetailsBeans = [{}];
						if (null == state.faData.faRequiredAssistanceBean.vatCstExempProdDetails || state.faData.faRequiredAssistanceBean.vatCstExempProdDetails.length == 0)
							state.faData.faRequiredAssistanceBean.vatCstExempProdDetails = [{}];
						if (null == state.faData.faRequiredAssistanceBean.pharmaExpInvDetailsBeans || state.faData.faRequiredAssistanceBean.pharmaExpInvDetailsBeans.length == 0)
							state.faData.faRequiredAssistanceBean.pharmaExpInvDetailsBeans = [{}];

						if (null == state.faData.presentAddTelephoneNo) {
							state.faData.presentAddTelephoneNo = "NA";
						}


						if (state.faData.genderId) {
							state.faData.genderId = state.faData.genderId
								+ "";
						}
						if (state.faData.categoryId) {
							state.faData.categoryId = state.faData.categoryId
								+ "";
						}
						if (state.faData.statusId) {
							state.faData.statusId = state.faData.statusId
								+ "";
						}
						if (state.faData.designationCode) {
							state.faData.designationCode = state.faData.designationCode
								+ "";
						}
						if (state.faData.industrialArea) {
							state.faData.industrialArea = state.faData.industrialArea
								+ "";
						}

						if (state.faData.stateId) {
							state.faData.stateId = state.faData.stateId
								+ "";
						}
						if (state.faData.districtId) {
							state.faData.districtId = state.faData.districtId
								+ "";
						}
						if (state.faData.tehsilId) {
							state.faData.tehsilId = state.faData.tehsilId
								+ "";
						}
						if (state.faData.blockId) {
							state.faData.blockId = state.faData.blockId
								+ "";
						}
						if (state.faData.permanentStateId) {
							state.faData.permanentStateId = state.faData.permanentStateId
								+ "";
						}
						if (state.faData.permanentDistrictId) {
							state.faData.permanentDistrictId = state.faData.permanentDistrictId
								+ "";
						}
						if (state.faData.permanentTehsilId) {
							state.faData.permanentTehsilId = state.faData.permanentTehsilId
								+ "";
						}
						if (state.faData.permanentBlockId) {
							state.faData.permanentBlockId = state.faData.permanentBlockId
								+ "";
						}
						
						state.cerfdata={};
									state.cerfdata.CertificationDetails={};
									params.udyamRegNo =  state.faData.udyamRegNo;
									state.cerfdata.cerfnumber=state.faData.faRequiredAssistanceBean.certificateNumber;
		    						state.cerfdata.CertificationDetails.CertificationDate=state.faData.faRequiredAssistanceBean.certificationDate;
								    state.cerfdata.CertificationDetails.ExpiryDate=state.faData.faRequiredAssistanceBean.expiryDate;
								    state.cerfdata.CertificationDetails.BronzeCertified=state.faData.faRequiredAssistanceBean.bronzeCertified;
								    state.cerfdata.CertificationDetails.SilverCertified=state.faData.faRequiredAssistanceBean.silverCertified;
								  	state.cerfdata.CertificationDetails.GoldCertified=state.faData.faRequiredAssistanceBean.goldCertified;
											
						
						loading.finish('sample-1');
					});
			};
state.showFaExpansionTable = function() {

				state.showExpFlag = false;
				if (state.faData.faIndustrialUnitBean.unitType == 'Other') {
					state.showExpFlag = true;
				}
			};
state.showTextBox = function(appliedBefore) {

				state.showprevAppId = false;

				if (appliedBefore == "yes") {
					state.showprevAppId = true;
				}
				else {
					state.showprevAppId = false;
				}

			};
state.loadPage = function() {
				state.applicationId = params.applicationId;
				state.establishmentType = params.establishmentType;
				if (state.establishmentType == 'Unit') {
					state.Unitback = true;
				} else {
					state.UnitInstitue = true;
				}
			};
state.raiseQueryByDtic = function(isValid) {

				if (!isValid) {
					return false;
				}

				request.get('getMessage/common.confirmToSave').then(function(response) {
					
					if (confirm(response.data.value)) {

						var fd = new FormData();
						state.faMsmeDetailData.status= "query";
						if (state.faMsmeDetailData.comments!=null) {
							fd.append('comments',
								state.faMsmeDetailData.comments);
						}

						if (state.faMsmeDetailData.decisionDate!=null) {
							state.faMsmeDetailData.decisionDate = format(
								'date')(
									state.faMsmeDetailData.decisionDate,
									'dd/MM/yyyy');
							fd.append('decisionDate',
								state.faMsmeDetailData.decisionDate);
						}

						if (state.faMsmeDetailData.status!=null) {
							fd.append('status', state.faMsmeDetailData.status);
						}

						fd.append('applicationId', params.applicationId);

						state.faMsmeDetailData.applicationId = params.applicationId;

						loading.start('sample-1');

						var responsePromise = request.post('raiseQueryByDtic',
							fd, {
							transformRequest: identity,
							headers: {
								'Content-Type': undefined
							}
						});

						responsePromise
							.success(function(data, status, headers, config) {

								state.responseObject = data;

								if (state.responseObject.successMessage != null) {
									later(
										function() {
											state.responseObject.successMessage = null;
										}, 3000);
									if (state.establishmentType == 'Unit') {
										navigation.location.href = '#dticfapendingapplicantsunit';
									} else {
										navigation.location.href = '#dticfapendingapplicantsapparel';
									}

								}

								loading.finish('sample-1');

							});
					}
				});

			};
state.loadFAApplicantDetail = function() {

		loading.start('sample-1');
		var responsePromise = request.get('fetchfaapplicantdetail', {
			params: {
				'applicationId': params.applicationId
			}
		});
		responsePromise.success(function(data, status, headers, config) {
			state.faApplicantBean = data;
			loading.finish('sample-1');
		});
	};
state.loadHistory = function() {
	    
		loading.start('sample-1');
		var responsePromise = request.get('fetchHistory', {params: {'applicationId': params.applicationId, 'establishmentType': params.establishmentType}});
		
		state.applicationId =  params.applicationId;
		state.establishmentType =  params.establishmentType;
		
		if(state.establishmentType == 'Unit') {
			state.showUnitList = true;	
		} else {
			state.showInstitueList = true;
		}
		
		responsePromise.success(function(data, status, headers, config) {
		state.faRequestProcessBeanList = data;
		loading.finish('sample-1');
		});
	};
state.test = function() {
	alert("ok");
	};
state.loadpage = function() {
				state.schemeCategory = params.schemeCategory;

			};
state.generateBankCoveringLetter = function() {
				navigation.open('generateBankCoveringLetter/'
					+ params.applicantId + '/'
					+ params.schemeCategory);
			};
state.uploadBankCoveringLetter = function(
				bankCoveringLetter) {

				var fd = new FormData();

				if (bankCoveringLetter) {
					fd.append('bankCoveringLetter', bankCoveringLetter);
				}

				fd.append('applicantId', params.applicantId);

				fd
					.append('schemeCategory',
						params.schemeCategory);

				fd.append('bankCoveringLetterNo',
					state.formData.bankCoveringLetterNo);

				if (state.formData.bankCoveringLetterDate) {
					state.formData.bankCoveringLetterDate = format(
						'date')(
							state.formData.bankCoveringLetterDate,
							'dd/MM/yyyy');
					fd.append('bankCoveringLetterDate',
						state.formData.bankCoveringLetterDate);
				}

				loading.start('sample-1');
				var responsePromise = request.post(
					'uploadBankCoveringLetter', fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject = data;

						if (state.responseObject.successMessage != null) {
							if (params.schemeCategory == 'SE') {
								navigation.location.href = '#dticpendingapplicants';
							} else {
								navigation.location.href = '#dticpendingyuvaudhami';
							}
						}

						loading.finish('sample-1');
					});

			};
state.generateExcel = function(establishmentType) {

				state.showError = false;

				if (state.IdList.length < 1) {
					state.showError = true;
					state.errorMessage = "Please select atleast one Application";
					return;
				}

				navigation.open('generateExcelNewMeetingAgenda/' + establishmentType
					+ '/' + state.IdList);
			};
state.faCommitteesStatusUnit = function(establishmentType, status) {

				state.showError = false;
				state.status2 = status;

				if (state.IdList.length < 1) {
					state.showError = true;
					state.errorMessage = "Please select atleast one Application";
					return;
				}

				params.applicationIds = state.IdList;
				params.establishmentType = establishmentType;
				navigation.location.href = '#faCommitteesStatusUnit/'
					+ params.applicationIds
					+ '/'
					+ params.establishmentType;

			};
state.addtoList = function(applicationId) {
				state.IdList.push(applicationId);

			};
state.removeFromList = function(applicationId) {
				var i = state.IdList.indexOf(applicationId);
				state.IdList.splice(i, 1);

			};
state.addCommitteeStatus = function(isValid) {
				if (!isValid) {
					return false;
				}

				request
					.get('getMessage/fa.applicant.detailsSubmit')
					.then(
						function(response) {
							
							if (navigation
								.confirm(response.data.value)) {

								var fd = new FormData();

								if (state.faMsmeDetailData.comments) {
									fd
										.append(
											'comments',
											state.faMsmeDetailData.comments);
								}

								if (state.faMsmeDetailData.decisionDate) {
									state.faMsmeDetailData.decisionDate = format(
										'date')
										(
											state.faMsmeDetailData.decisionDate,
											'dd/MM/yyyy');
									fd
										.append(
											'decisionDate',
											state.faMsmeDetailData.decisionDate);
								}

								if (state.faMsmeDetailData.status) {
									fd
										.append(
											'status',
											state.faMsmeDetailData.status);
								}

								if (state.faMsmeDetailData.document) {
									fd
										.append(
											'document',
											state.faMsmeDetailData.document);
								}

								fd
									.append(
										'applicationId',
										params.applicationId);

								state.faMsmeDetailData.applicationId = params.applicationId;

								loading.start('sample-1');
								
								
								

								var responsePromise = request
									.post(
										'addCommitteeStatus',
										fd,
										{
											transformRequest: identity,
											headers: {
												'Content-Type': undefined
											}
										});

								responsePromise
									.success(function(data,
										status,
										headers, config) {

										state.responseObject = data;

										if (state.responseObject.successMessage != null) {
											later(
												function() {
													state.responseObject.successMessage = null;
												}, 3000);
											if (state.establishmentType == 'Unit') {
												navigation.location.href = '#dticfapendingapplicantsunit';
											} else {
												navigation.location.href = '#dticfapendingapplicantsapparel';
											}

										}
										loading
											.finish('sample-1');

									});
							} else {
								return false;
							}
						});
			};
state.addCommitteesStatus = function(isValid) {
				if (!isValid) {
					return false;
				}

				if (state.faMsmeDetailData.document==null) {
							alert("Please upload SLAC order");
				}

				else{
					if (dom("#document")[0].files[0].size >2097152){	
						alert("DLAC Minutes File size should not exceed 2MB");
						return false;
					}
				request
					.get('getMessage/fa.applicant.detailsSubmit')
					.then(
						function(response) {
							
							if (navigation
								.confirm(response.data.value)) {
								
								
								var fd = new FormData();

								if (state.faMsmeDetailData.comments!=null) {
									fd
										.append(
											'comments',
											state.faMsmeDetailData.comments);
								}

								if (state.faMsmeDetailData.decisionDate!=null) {
									state.faMsmeDetailData.decisionDate = format(
										'date')
										(
											state.faMsmeDetailData.decisionDate,
											'dd/MM/yyyy');
									fd
										.append(
											'decisionDate',
											state.faMsmeDetailData.decisionDate);
								}

								if (state.faMsmeDetailData.status!=null) {
									fd
										.append(
											'status',
											state.faMsmeDetailData.status);
								}

								if (state.faMsmeDetailData.document!=null) {
									fd
										.append(
											'document',
											state.faMsmeDetailData.document);
								}

								fd
									.append(
										'applicationId',
										params.applicationIds);

								state.faMsmeDetailData.applicationId = params.applicationIds;

								loading.start('sample-1');
								
								
								

								var responsePromise = request
									.post(
										'addCommitteesStatus' + "/" + params.applicationIds,
										fd,
										{
											transformRequest: identity,
											headers: {
												'Content-Type': undefined
											}
										});

								responsePromise
									.success(function(data,
										status,
										headers, config) {

										state.responseObject = data;

										if (state.responseObject.successMessage != null) {
											later(
												function() {
													state.responseObject.successMessage = null;
												}, 3000);
											if (state.establishmentType == 'Unit') {
												navigation.location.href = '#dticfapendingapplicantsunit';
											} else {
												navigation.location.href = '#dticfapendingapplicantsapparel';
											}

										}
										loading
											.finish('sample-1');

									});
							} else {
								return false;
							}
						});
			}};
state.downloadFADocument = function(documentTypeCode) {

				navigation.open('downloadfadocument/' + documentTypeCode
					+ '/' + params.applicationId);

			};
state.uploadOtherDocument = function(isVaild) {

	
	

					

					if (state.faData.faOtherDocument==null) {
									alert("Please upload document file");
					}
					
			
			else if(state.faData.faOtherDocument!=null && state.faData.remarks!=null){
				request
					.get('getMessage/fa.applicant.detailsSubmit')
					.then(
						function(response) {
							
							if (navigation
								.confirm(response.data.value)) {

								var fd = new FormData();
								if (state.faData.faOtherDocument) {
									fd.append(
										
										
										'faOtherDocument',
										state.faData.faOtherDocument);

								}


								if (state.faData.remarks != null) {
									fd.append(
										'remarks',
										state.faData.remarks);
								}

								fd
									.append(
										'applicationId',
										params.applicationId);

								loading.start('sample-1');
								var responsePromise = request
									.post(
										
										'uploadOtherDocument/' + params.applicationId,
										fd,
										{
											transformRequest: identity,
											headers: {
												'Content-Type': undefined
											}
										});

								responsePromise
									.success(function(data,
										status,
										headers, config) {

										state.responseObject = data;

										if (state.responseObject.successMessage != null) {
											later(
												function() {
													state.responseObject.successMessage = null;
												}, 3000);

											navigation.location.href = '#faOtherUploadDocuments/'+ params.applicationId +'/'+'Unit';

										}

										loading
											.finish('sample-1');
									});
							} else {
								return false;
							}
						});
					
			}};
state.getFaOtherDocuments = function() {
				state.applicationId = params.applicationId;
				state.establishmentType = params.establishmentType;

				state.faOtherDocumentsList = {};
			
				loading.start('sample-1');

				var responsePromise = request
					.get(
						'getFaOtherDocuments' + '/' + params.applicationId
					);


				responsePromise.success(function(data, status, headers,
					config) {
					state.faOtherDocumentsList = data;

					loading.finish('sample-1');
				});

           

			};
state.fetchMsmeDetailSelectionByApplicationId = function() {


				loading.start('sample-1');
				var responsePromise2 = request
					.get(
						'fetchMsmeDetailSelectionByApplicationId',
						{
							params: {
								'applicationId': params.applicationId
							}
						});
				state.applicationId = params.applicationId;
				responsePromise2
					.success(function(data, status, headers, config) {
						state.faData2 = data;
						state.faMsmeDetailData={};
						
						if (state.faData2.selectfa1) {
							state.faMsmeDetailData.selectfa1 = state.faData2.selectfa1;
						}

						if (state.faData2.selectfa2) {
							state.faMsmeDetailData.selectfa2 = state.faData2.selectfa2;
						}

						if (state.faData2.selectfa3) {
							state.faMsmeDetailData.selectfa3 = state.faData2.selectfa3;
						}

						if (state.faData2.selectfa4) {
							state.faMsmeDetailData.selectfa4 = state.faData2.selectfa4;
						}
						if (state.faData2.selectfa5) {
							state.faMsmeDetailData.selectfa5 = state.faData2.selectfa5;
						}



						if (state.faData2.selectfa6) {
							state.faMsmeDetailData.selectfa6 = state.faData2.selectfa6;
						}

						if (state.faData2.selectfa7) {
							state.faMsmeDetailData.selectfa7 = state.faData2.selectfa7;
						}

						if (state.faData2.selectfa8) {
							state.faMsmeDetailData.selectfa8 = state.faData2.selectfa8;
						}
						
						if (state.faData2.selectfa9) {
    state.faMsmeDetailData.selectfa9 = state.faData2.selectfa9;
}

if (state.faData2.selectfa10) {
    state.faMsmeDetailData.selectfa10 = state.faData2.selectfa10;
}

if (state.faData2.selectfa11) {
    state.faMsmeDetailData.selectfa11 = state.faData2.selectfa11;
}

if (state.faData2.selectfa12) {
    state.faMsmeDetailData.selectfa12 = state.faData2.selectfa12;
}

if (state.faData2.selectfa13) {
    state.faMsmeDetailData.selectfa13 = state.faData2.selectfa13;
}

if (state.faData2.selectfa14) {
    state.faMsmeDetailData.selectfa14 = state.faData2.selectfa14;
}

if (state.faData2.selectfa15) {
    state.faMsmeDetailData.selectfa15 = state.faData2.selectfa15;
}

if (state.faData2.selectfa16) {
    state.faMsmeDetailData.selectfa16 = state.faData2.selectfa16;
}

if (state.faData2.selectfa17) {
    state.faMsmeDetailData.selectfa17 = state.faData2.selectfa17;
}

if (state.faData2.selectfa18) {
    state.faMsmeDetailData.selectfa18 = state.faData2.selectfa18;
}

if (state.faData2.selectfa19) {
    state.faMsmeDetailData.selectfa19 = state.faData2.selectfa19;
}

if (state.faData2.selectfa20) {
    state.faMsmeDetailData.selectfa20 = state.faData2.selectfa20;
}
if (state.faData2.selectfa21) {
    state.faMsmeDetailData.selectfa21 = state.faData2.selectfa21;
}
if (state.faData2.selectfa22) {
    state.faMsmeDetailData.selectfa22 = state.faData2.selectfa22;
}

						
						loading.finish('sample-1');


					});

			};
state.addFAMSMEDetailUnitForSanction = function(isValid,obj) {
				
				
					

				request
					.get('getMessage/fa.applicant.detailsSubmit')
					.then(
						function(response) {
							
							if (navigation
								.confirm(response.data.value)) {
								if (state.faMsmeDetailData.acceptanceFile ==null ) {
										alert("please upload file");
								}
							else{
			
								var fd = new FormData();

										

								if (state.faMsmeDetailData.faIndustSubsidyAmt) {
									fd
										.append(
											'faIndustSubsidyAmt',
											state.faMsmeDetailData.faIndustSubsidyAmt);
								}



								if (state.faMsmeDetailData.faIndustSubsidyRemarks) {
									fd
										.append(
											'faIndustSubsidyRemarks',
											state.faMsmeDetailData.faIndustSubsidyRemarks);
								}

								if (state.faMsmeDetailData.faQualityCerfAmt) {
									fd
										.append(
											'faQualityCerfAmt',
											state.faMsmeDetailData.faQualityCerfAmt);
								}

								if (state.faMsmeDetailData.faqualityCerfAmtRemarks) {
									fd
										.append(
											'faqualityCerfAmtRemarks',
											state.faMsmeDetailData.faqualityCerfAmtRemarks);
								}

								if (state.faMsmeDetailData.faReimbursementPatentsAmt) {
									fd
										.append(
											'faReimbursementPatentsAmt',
											state.faMsmeDetailData.faReimbursementPatentsAmt);
								}

								if (state.faMsmeDetailData.faReimbursementPatentsAmtRemarks) {
									fd
										.append(
											'faReimbursementPatentsAmtRemarks',
											state.faMsmeDetailData.faReimbursementPatentsAmtRemarks);
								}

								if (state.faMsmeDetailData.faInfraDevAmt) {
									fd
										.append(
											'faInfraDevAmt',
											state.faMsmeDetailData.faInfraDevAmt);
								}


								if (state.faMsmeDetailData.faInfraDevAmtRemarks) {
									fd
										.append(
											'faInfraDevAmtRemarks',
											state.faMsmeDetailData.faInfraDevAmtRemarks);
								}

								if (state.faMsmeDetailData.faPlantTreatAmt) {
									fd
										.append(
											'faPlantTreatAmt',
											state.faMsmeDetailData.faPlantTreatAmt);
								}

								if (state.faMsmeDetailData.faPlantTreatAmtRemarks) {
									fd
										.append(
											'faPlantTreatAmtRemarks',
											state.faMsmeDetailData.faPlantTreatAmtRemarks);
								}

								if (state.faMsmeDetailData.faEnergyAmt) {
									fd
										.append(
											'faEnergyAmt',
											state.faMsmeDetailData.faEnergyAmt);
								}


								if (state.faMsmeDetailData.faEnergyAmtRemarks) {
									fd
										.append(
											'faEnergyAmtRemarks',
											state.faMsmeDetailData.faEnergyAmtRemarks);
								}

								if (state.faMsmeDetailData.faUpgradeAmt) {
									fd
										.append(
											'faUpgradeAmt',
											state.faMsmeDetailData.faUpgradeAmt);
								}

								if (state.faMsmeDetailData.faUpgradeAmtRemarks) {
									fd
										.append(
											'faUpgradeAmtRemarks',
											state.faMsmeDetailData.faUpgradeAmtRemarks);
								}

								if (state.faMsmeDetailData.faPharmLabAmt) {
									fd
										.append(
											'faPharmLabAmt',
											state.faMsmeDetailData.faPharmLabAmt);
								}

								if (state.faMsmeDetailData.faPharmLabAmtRemarks) {
									fd
										.append(
											'faPharmLabAmtRemarks',
											state.faMsmeDetailData.faPharmLabAmtRemarks);
								}

								if (state.faMsmeDetailData.acceptanceFile) {
									fd
										.append(
											'acceptanceFile',
											state.faMsmeDetailData.acceptanceFile);
								}
								if (state.faMsmeDetailData.selectfa11) {

    if (state.faMsmeDetailData.fa11LetterNo) {
        fd.append('fa11LetterNo', state.faMsmeDetailData.fa11LetterNo);
    }

    if (state.faMsmeDetailData.fa11LetterDate) {
        fd.append('fa11LetterDate', state.faMsmeDetailData.fa11LetterDate);
    }

    if (state.faMsmeDetailData.fa11Amt) {
        fd.append('fa11Amount', state.faMsmeDetailData.fa11Amt);
    }

    if (state.faMsmeDetailData.fa11Remarks) {
        fd.append('fa11Remarks', state.faMsmeDetailData.fa11Remarks);
    }
}
if (state.faMsmeDetailData.selectfa12) {

    if (state.faMsmeDetailData.fa12LetterNo) {
        fd.append('fa12LetterNo', state.faMsmeDetailData.fa12LetterNo);
    }

    if (state.faMsmeDetailData.fa12LetterDate) {
        fd.append('fa12LetterDate', state.faMsmeDetailData.fa12LetterDate);
    }

    if (state.faMsmeDetailData.fa12Amt) {
        fd.append('fa12Amount', state.faMsmeDetailData.fa12Amt);
    }

    if (state.faMsmeDetailData.fa12Remarks) {
        fd.append('fa12Remarks', state.faMsmeDetailData.fa12Remarks);
    }
}
if (state.faMsmeDetailData.selectfa13) {

    if (state.faMsmeDetailData.fa13LetterNo) {
        fd.append('fa13LetterNo', state.faMsmeDetailData.fa13LetterNo);
    }

    if (state.faMsmeDetailData.fa13LetterDate) {
        fd.append('fa13LetterDate', state.faMsmeDetailData.fa13LetterDate);
    }

    if (state.faMsmeDetailData.fa13Amt) {
        fd.append('fa13Amount', state.faMsmeDetailData.fa13Amt);
    }

    if (state.faMsmeDetailData.fa13Remarks) {
        fd.append('fa13Remarks', state.faMsmeDetailData.fa13Remarks);
    }
}
if (state.faMsmeDetailData.selectfa14) {

    if (state.faMsmeDetailData.fa14LetterNo) {
        fd.append('fa14LetterNo', state.faMsmeDetailData.fa14LetterNo);
    }

    if (state.faMsmeDetailData.fa14LetterDate) {
        fd.append('fa14LetterDate', state.faMsmeDetailData.fa14LetterDate);
    }

    if (state.faMsmeDetailData.fa14Amt) {
        fd.append('fa14Amount', state.faMsmeDetailData.fa14Amt);
    }

    if (state.faMsmeDetailData.fa14Remarks) {
        fd.append('fa14Remarks', state.faMsmeDetailData.fa14Remarks);
    }
}
if (state.faMsmeDetailData.selectfa15) {

    if (state.faMsmeDetailData.fa15LetterNo) {
        fd.append('fa15LetterNo', state.faMsmeDetailData.fa15LetterNo);
    }

    if (state.faMsmeDetailData.fa15LetterDate) {
        fd.append('fa15LetterDate', state.faMsmeDetailData.fa15LetterDate);
    }

    if (state.faMsmeDetailData.fa15Amt) {
        fd.append('fa15Amount', state.faMsmeDetailData.fa15Amt);
    }

    if (state.faMsmeDetailData.fa15Remarks) {
        fd.append('fa15Remarks', state.faMsmeDetailData.fa15Remarks);
    }
}
if (state.faMsmeDetailData.selectfa16) {

    if (state.faMsmeDetailData.fa16LetterNo) {
        fd.append('fa16LetterNo', state.faMsmeDetailData.fa16LetterNo);
    }

    if (state.faMsmeDetailData.fa16LetterDate) {
        fd.append('fa16LetterDate', state.faMsmeDetailData.fa16LetterDate);
    }

    if (state.faMsmeDetailData.fa16Amt) {
        fd.append('fa16Amount', state.faMsmeDetailData.fa16Amt);
    }

    if (state.faMsmeDetailData.fa16Remarks) {
        fd.append('fa16Remarks', state.faMsmeDetailData.fa16Remarks);
    }
}
if (state.faMsmeDetailData.selectfa17) {

    if (state.faMsmeDetailData.fa17LetterNo) {
        fd.append('fa17LetterNo', state.faMsmeDetailData.fa17LetterNo);
    }

    if (state.faMsmeDetailData.fa17LetterDate) {
        fd.append('fa17LetterDate', state.faMsmeDetailData.fa17LetterDate);
    }

    if (state.faMsmeDetailData.fa17Amt) {
        fd.append('fa17Amount', state.faMsmeDetailData.fa17Amt);
    }

    if (state.faMsmeDetailData.fa17Remarks) {
        fd.append('fa17Remarks', state.faMsmeDetailData.fa17Remarks);
    }
}
if (state.faMsmeDetailData.selectfa18) {

    if (state.faMsmeDetailData.fa18LetterNo) {
        fd.append('fa18LetterNo', state.faMsmeDetailData.fa18LetterNo);
    }

    if (state.faMsmeDetailData.fa18LetterDate) {
        fd.append('fa18LetterDate', state.faMsmeDetailData.fa18LetterDate);
    }

    if (state.faMsmeDetailData.fa18Amt) {
        fd.append('fa18Amount', state.faMsmeDetailData.fa18Amt);
    }

    if (state.faMsmeDetailData.fa18Remarks) {
        fd.append('fa18Remarks', state.faMsmeDetailData.fa18Remarks);
    }
}
if (state.faMsmeDetailData.selectfa19) {

    if (state.faMsmeDetailData.fa19LetterNo) {
        fd.append('fa19LetterNo', state.faMsmeDetailData.fa19LetterNo);
    }

    if (state.faMsmeDetailData.fa19LetterDate) {
        fd.append('fa19LetterDate', state.faMsmeDetailData.fa19LetterDate);
    }

    if (state.faMsmeDetailData.fa19Amt) {
        fd.append('fa19Amount', state.faMsmeDetailData.fa19Amt);
    }

    if (state.faMsmeDetailData.fa19Remarks) {
        fd.append('fa19Remarks', state.faMsmeDetailData.fa19Remarks);
    }
}
if (state.faMsmeDetailData.selectfa20) {

    if (state.faMsmeDetailData.fa20LetterNo) {
        fd.append('fa20LetterNo', state.faMsmeDetailData.fa20LetterNo);
    }

    if (state.faMsmeDetailData.fa20LetterDate) {
        fd.append('fa20LetterDate', state.faMsmeDetailData.fa20LetterDate);
    }

    if (state.faMsmeDetailData.fa20Amt) {
        fd.append('fa20Amount', state.faMsmeDetailData.fa20Amt);
    }

    if (state.faMsmeDetailData.fa20Remarks) {
        fd.append('fa20Remarks', state.faMsmeDetailData.fa20Remarks);
    }
}
if (state.faMsmeDetailData.selectfa21) {

    if (state.faMsmeDetailData.fa21LetterNo) {
        fd.append('fa21LetterNo', state.faMsmeDetailData.fa21LetterNo);
    }

    if (state.faMsmeDetailData.fa21LetterDate) {
        fd.append('fa21LetterDate', state.faMsmeDetailData.fa21LetterDate);
    }

    if (state.faMsmeDetailData.fa21Amt) {
        fd.append('fa21Amount', state.faMsmeDetailData.fa21Amt);
    }

    if (state.faMsmeDetailData.fa21Remarks) {
        fd.append('fa21Remarks', state.faMsmeDetailData.fa21Remarks);
    }
}
if (state.faMsmeDetailData.selectfa22) {

    if (state.faMsmeDetailData.fa22LetterNo) {
        fd.append('fa22LetterNo', state.faMsmeDetailData.fa22LetterNo);
    }

    if (state.faMsmeDetailData.fa22LetterDate) {
        fd.append('fa22LetterDate', state.faMsmeDetailData.fa22LetterDate);
    }

    if (state.faMsmeDetailData.fa22Amt) {
        fd.append('fa22Amount', state.faMsmeDetailData.fa22Amt);
    }

    if (state.faMsmeDetailData.fa22Remarks) {
        fd.append('fa22Remarks', state.faMsmeDetailData.fa22Remarks);
    }
    }
								
								if(state.faMsmeDetailData.faSanctionLetterNo){
									fd
										.append(
											'faSanctionLetterNo',
											state.faMsmeDetailData.faSanctionLetterNo);
								}
								if(state.faMsmeDetailData.faSanctionLetterDate){
									fd
										.append(
											'faSanctionLetterDate',
											state.faMsmeDetailData.faSanctionLetterDate);
								}
								fd
									.append(
										'applicationId',
										params.applicationId);

								state.faMsmeDetailData.applicationId = params.applicationId;
								loading.start('sample-1');
								var responsePromise = request
									.post(
										'addfamsmedetailunitforsanction',


										fd,
										{
											transformRequest: identity,
											headers: {
												'Content-Type': undefined
											}
										});

								responsePromise
									.success(function(data,
										status,
										headers, config) {

										state.responseObject = data;

										if (state.responseObject.successMessage != null) {
											later(
												function() {
													state.responseObject.successMessage = null;
												}, 3000);
											
											if (params.establishmentType == 'Unit') {
												navigation.location.href = '#dticfapendingapplicantsunit';
											} else {
												navigation.location.href = '#dticfapendingapplicantsapparel';
											}
										}


										loading
											.finish('sample-1');
									});
							}
						}});
						
			};
state.fetchDisbursementsDetails = function() {
				state.applicationId = params.applicationId;
				state.establishmentType = params.establishmentType;

				state.fasDisbursementList = {};
				state.IsVisible = false;
				

				loading.start('sample-1');

				var responsePromise = request
					.get(
						'fetchDisbursementsUpload' + '/' + params.applicationId
					);


				responsePromise.success(function(data, status, headers,
					config) {
					state.fasDisbursementList = data;

					state.totalDisbursementAmt = state.calcTotalDisAmt(state.fasDisbursementList);

					state.loadFAMSMEDetailUnitForSanction();

					

				});

           

			};
state.calcTotalDisAmt = function(dataArray) {

				var total = parseFloat("0");
				each(dataArray, function(data) {
					if (null != data.disbursementAmt) {
						total += parseFloat(data.disbursementAmt);
					}
				})
				return total;
			};
state.loadFAMSMEDetailUnitForSanction = function() {

				loading.start('sample-1');
				var responsePromise = request
					.get(
						'fetchFAMSMEDetailUnitForSanction',
						{
							params: {
								'applicationId': params.applicationId
							}
						});
				state.applicationId = params.applicationId;
				responsePromise
					.success(function(data, status, headers, config) {
						state.faData = data;

						state.faMsmeDetailData={};
						if (state.faData.faIndustSubsidyAmt != null) {

							state.faMsmeDetailData.faIndustSubsidyAmt = state.faData.faIndustSubsidyAmt;
						}



						if (state.faData.faIndustSubsidyRemarks != null) {
							state.faMsmeDetailData.faIndustSubsidyRemarks = state.faData.faIndustSubsidyRemarks;
						}

						if (state.faData.faQualityCerfAmt != null) {

							state.faMsmeDetailData.faQualityCerfAmt = state.faData.faQualityCerfAmt;
						}

						if (state.faData.faqualityCerfAmtRemarks != null) {

							state.faMsmeDetailData.faqualityCerfAmtRemarks = state.faData.faqualityCerfAmtRemarks;
						}

						if (state.faData.faReimbursementPatentsAmt != null) {

							state.faMsmeDetailData.faReimbursementPatentsAmt = state.faData.faReimbursementPatentsAmt;
						}

						if (state.faData.faReimbursementPatentsAmtRemarks != null) {

							state.faMsmeDetailData.faReimbursementPatentsAmtRemarks = state.faData.faReimbursementPatentsAmtRemarks;
						}

						if (state.faData.faInfraDevAmt != null) {

							state.faMsmeDetailData.faInfraDevAmt = state.faData.faInfraDevAmt;
						}


						if (state.faData.faInfraDevAmtRemarks != null) {

							state.faMsmeDetailData.faInfraDevAmtRemarks = state.faData.faInfraDevAmtRemarks;
						}

						if (state.faData.faPlantTreatAmt != null) {

							state.faMsmeDetailData.faPlantTreatAmt = state.faData.faPlantTreatAmt;
						}

						if (state.faData.faPlantTreatAmtRemarks != null) {

							state.faMsmeDetailData.faPlantTreatAmtRemarks = state.faData.faPlantTreatAmtRemarks;
						}

						if (state.faData.faEnergyAmt != null) {

							state.faMsmeDetailData.faEnergyAmt = state.faData.faEnergyAmt;
						}


						if (state.faData.faEnergyAmtRemarks != null) {

							state.faMsmeDetailData.faEnergyAmtRemarks = state.faData.faEnergyAmtRemarks;
						}

						if (state.faData.faUpgradeAmt != null) {

							state.faMsmeDetailData.faUpgradeAmt = state.faData.faUpgradeAmt;
						}

						if (state.faData.faUpgradeAmtRemarks != null) {

							state.faMsmeDetailData.faUpgradeAmtRemarks = state.faData.faUpgradeAmtRemarks;
						}

						if (state.faData.faPharmLabAmt != null) {

							state.faMsmeDetailData.faPharmLabAmt = state.faData.faPharmLabAmt;
						}

						if (state.faData.faPharmLabAmtRemarks != null) {

							state.faMsmeDetailData.faPharmLabAmtRemarks = state.faData.faPharmLabAmtRemarks;
						}

						if (state.faData.dlacSanctionUploadId != null) {

							state.faMsmeDetailData.dlacSanctionUploadId = state.faData.dlacSanctionUploadId;
						}
						
						if (state.faData.fa11Amount != null) {
							state.faMsmeDetailData.fa11Amount = state.faData.fa11Amount;
						}

						if (state.faData.fa12Amount != null) {
							state.faMsmeDetailData.fa12Amount = state.faData.fa12Amount;
						}

						if (state.faData.fa13Amount != null) {
							state.faMsmeDetailData.fa13Amount = state.faData.fa13Amount;
						}

						if (state.faData.fa14Amount != null) {
							state.faMsmeDetailData.fa14Amount = state.faData.fa14Amount;
						}

						if (state.faData.fa15Amount != null) {
							state.faMsmeDetailData.fa15Amount = state.faData.fa15Amount;
						}

						if (state.faData.fa16Amount != null) {
							state.faMsmeDetailData.fa16Amount = state.faData.fa16Amount;
						}

						if (state.faData.fa17Amount != null) {
							state.faMsmeDetailData.fa17Amount = state.faData.fa17Amount;
						}

						if (state.faData.fa18Amount != null) {
							state.faMsmeDetailData.fa18Amount = state.faData.fa18Amount;
						}

						if (state.faData.fa19Amount != null) {
							state.faMsmeDetailData.fa19Amount = state.faData.fa19Amount;
						}

						if (state.faData.fa20Amount != null) {
							state.faMsmeDetailData.fa20Amount = state.faData.fa20Amount;
						}

						if (state.faData.fa21Amount != null) {
							state.faMsmeDetailData.fa21Amount = state.faData.fa21Amount;
						}
                        if (state.faData.fa22Amount != null) {
							state.faMsmeDetailData.fa22Amount = state.faData.fa22Amount;
						}


					});

				var responsePromise2 = request
					.get(
						'fetchMsmeDetailSelectionByApplicationId',
						{
							params: {
								'applicationId': params.applicationId
							}
						});
				state.applicationId = params.applicationId;
				responsePromise2
					.success(function(data, status, headers, config) {
						state.faData2 = data;
						
						if (state.faData2.selectfa1) {
							state.faMsmeDetailData.selectfa1 = state.faData2.selectfa1;
						}

						if (state.faData2.selectfa2) {
							state.faMsmeDetailData.selectfa2 = state.faData2.selectfa2;
						}

						if (state.faData2.selectfa3) {
							state.faMsmeDetailData.selectfa3 = state.faData2.selectfa3;
						}

						if (state.faData2.selectfa4) {
							state.faMsmeDetailData.selectfa4 = state.faData2.selectfa4;
						}
						if (state.faData2.selectfa5) {
							state.faMsmeDetailData.selectfa5 = state.faData2.selectfa5;
						}



						if (state.faData2.selectfa6) {
							state.faMsmeDetailData.selectfa6 = state.faData2.selectfa6;
						}

						if (state.faData2.selectfa7) {
							state.faMsmeDetailData.selectfa7 = state.faData2.selectfa7;
						}

						if (state.faData2.selectfa8) {
							state.faMsmeDetailData.selectfa8 = state.faData2.selectfa8;
						}
						if (state.faData2.selectfa11) {
							state.faMsmeDetailData.selectfa11 = state.faData2.selectfa11;
						}
						if (state.faData2.selectfa12) {
							state.faMsmeDetailData.selectfa12 = state.faData2.selectfa12;
						}
						if (state.faData2.selectfa13) {
							state.faMsmeDetailData.selectfa13 = state.faData2.selectfa13;
						}
						if (state.faData2.selectfa14) {
							state.faMsmeDetailData.selectfa14 = state.faData2.selectfa14;
						}
						if (state.faData2.selectfa15) {
							state.faMsmeDetailData.selectfa15 = state.faData2.selectfa15;
						}
						if (state.faData2.selectfa16) {
							state.faMsmeDetailData.selectfa16 = state.faData2.selectfa16;
						}
						if (state.faData2.selectfa17) {
							state.faMsmeDetailData.selectfa17 = state.faData2.selectfa17;
						}
						if (state.faData2.selectfa18) {
							state.faMsmeDetailData.selectfa18 = state.faData2.selectfa18;
						}
						if (state.faData2.selectfa19) {
							state.faMsmeDetailData.selectfa19 = state.faData2.selectfa19;
						}
						if (state.faData2.selectfa20) {
							state.faMsmeDetailData.selectfa20 = state.faData2.selectfa20;
						}
						if (state.faData2.selectfa21) {
							state.faMsmeDetailData.selectfa21 = state.faData2.selectfa21;
						}
						
						if (state.faData2.selectfa22) {
							state.faMsmeDetailData.selectfa22 = state.faData2.selectfa22;
						}


						var total = parseFloat("0");
						var select1 = parseFloat("0");
						var select2 = parseFloat("0");
						var select3 = parseFloat("0");
						var select4 = parseFloat("0");
						var select5 = parseFloat("0");
						var select6 = parseFloat("0");
						var select7 = parseFloat("0");
						var select8 = parseFloat("0");
						var select11 = parseFloat("0");
						var select12 = parseFloat("0");
						var select13 = parseFloat("0");
						var select14 = parseFloat("0");
						var select15 = parseFloat("0");
						var select16 = parseFloat("0");
						var select17 = parseFloat("0");
						var select18 = parseFloat("0");
						var select19 = parseFloat("0");
						var select20 = parseFloat("0");
						var select21 = parseFloat("0");
						var select22 = parseFloat("0");

						if (null != state.faMsmeDetailData
							&& null != state.faMsmeDetailData.faIndustSubsidyAmt) {
							select1 = parseFloat(state.faMsmeDetailData.faIndustSubsidyAmt);
						}
						if (null != state.faMsmeDetailData
							&& null != state.faMsmeDetailData.faQualityCerfAmt) {
							select2 = parseFloat(state.faMsmeDetailData.faQualityCerfAmt);
						}
						if (null != state.faMsmeDetailData
							&& null != state.faMsmeDetailData.faReimbursementPatentsAmt) {
							select3 = parseFloat(state.faMsmeDetailData.faReimbursementPatentsAmt);
						}

						if (null != state.faMsmeDetailData
							&& null != state.faMsmeDetailData.faInfraDevAmt) {
							select4 = parseFloat(state.faMsmeDetailData.faInfraDevAmt);
						}

						if (null != state.faMsmeDetailData
							&& null != state.faMsmeDetailData.faPlantTreatAmt) {
							select5 = parseFloat(state.faMsmeDetailData.faPlantTreatAmt);
						}
						if (null != state.faMsmeDetailData
							&& null != state.faMsmeDetailData.faEnergyAmt) {
							select6 = parseFloat(state.faMsmeDetailData.faEnergyAmt);
						}

						if (null != state.faMsmeDetailData
							&& null != state.faMsmeDetailData.faUpgradeAmt) {
							select7 = parseFloat(state.faMsmeDetailData.faUpgradeAmt);

						}

						if (null != state.faMsmeDetailData
							&& null != state.faMsmeDetailData.faPharmLabAmt) {
							select8 = parseFloat(state.faMsmeDetailData.faPharmLabAmt);
						}
						
						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa11Amount) {
							select11 = parseFloat(state.faMsmeDetailData.fa11Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa12Amount) {
							select12 = parseFloat(state.faMsmeDetailData.fa12Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa13Amount) {
							select13 = parseFloat(state.faMsmeDetailData.fa13Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa14Amount) {
							select14 = parseFloat(state.faMsmeDetailData.fa14Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa15Amount) {
							select15 = parseFloat(state.faMsmeDetailData.fa15Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa16Amount) {
							select16 = parseFloat(state.faMsmeDetailData.fa16Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa17Amount) {
							select17 = parseFloat(state.faMsmeDetailData.fa17Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa18Amount) {
							select18 = parseFloat(state.faMsmeDetailData.fa18Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa19Amount) {
							select19 = parseFloat(state.faMsmeDetailData.fa19Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa20Amount) {
							select20 = parseFloat(state.faMsmeDetailData.fa20Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa21Amount) {
							select21 = parseFloat(state.faMsmeDetailData.fa21Amount);
						}
						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa22Amount) {
							select22 = parseFloat(state.faMsmeDetailData.fa22Amount);
						}


						total = (select1 + select2 + select3 + select4 + select5 + select6 + select7 + select8 + select11 + select12 + select13 + select14 + select15 + select16 + select17 + select18 + select19 + select20 + select21+select22).toFixed(2);
						state.faMsmeDetailData.totalamt = parseInt(total);



						loading.finish('sample-1');


					});


			};
state.faDisbursementUnitView = function(status) {
						
						if(status=="Disbursement Letter Released"){
						
						navigation.location.href ='#viewfaDisbursementUnit/'
								+ params.applicationId+'/'+ params.establishmentType;
								}
						else if(status=="DLAC Sanction Order Uploaded"){
						
						navigation.location.href ='#fa/viewfaacceptanceamountdetailunit/'
								+ params.applicationId+'/'+ params.establishmentType;
					}
						else if(status=="Inspection Approved"){
						
						navigation.location.href ='#viewfaacceptanceamountdetailunit/'
								+ params.applicationId+'/'+ params.establishmentType;
								}						
					};
state.uploadDisbursementOrder = function(isValid) {

				
				

				

					if (state.faData.disbursementDoc==null) {
									alert("Please upload disbursement order");
					}
					
			
			else if(state.faData.disbursementDoc!=null && state.faData.disbursementAmt!=null  && state.faData.remarks!=null){
				request
					.get('getMessage/fa.applicant.detailsSubmit')
					.then(
						function(response) {
							
							if (navigation
								.confirm(response.data.value)) {

								var fd = new FormData();
								if (state.faData.disbursementDoc) {
									fd.append(
										
										
										'disbursementDoc',
										state.faData.disbursementDoc);

								}

								if (state.faData.disbursementAmt != null) {
									fd.append(
										
										'disbursementAmt',
										state.faData.disbursementAmt);
								}

								if (state.faData.remarks != null) {
									fd.append(
										'remarks',
										state.faData.remarks);
								}

								fd
									.append(
										'applicationId',
										params.applicationId);
								
								if (state.faData.faLetterNo != null) {
									fd.append(
										'faLetterNo',
										state.faData.faLetterNo);
								}
								if (state.faData.faLetterDate != null) {
									fd.append(
										'faLetterDate',
										state.faData.faLetterDate);
								}
								
								loading.start('sample-1');
								var responsePromise = request
									.post(
										
										
										'uploadFaDisbursementOrder/' + params.applicationId,
										fd,
										{
											transformRequest: identity,
											headers: {
												'Content-Type': undefined
											}
										});

								responsePromise
									.success(function(data,
										status,
										headers, config) {

										state.responseObject = data;

										if (state.responseObject.successMessage != null) {
											later(
												function() {
													state.responseObject.successMessage = null;
												}, 3000);

											navigation.location.href = '#dticfapendingapplicantsunit';

										}

										loading
											.finish('sample-1');
									});
							} else {
								return false;
							}
						});
			}};
state.calcTotalCompExpUnderID = function(){
	    var forRoad=parseFloat("0");
	    var forElect=parseFloat("0");
	    var forWater=parseFloat("0");
	    if(null!=state.faData.faRequiredAssistanceBean){
			 if(null!= state.faData.faRequiredAssistanceBean.infraDevCompRoadConExpAmt){
	    	  forRoad=parseFloat(state.faData.faRequiredAssistanceBean.infraDevCompRoadConExpAmt);
		  }
	      if(null!= state.faData.faRequiredAssistanceBean.infraDevElecExpAmt){
	    	  forElect=parseFloat(state.faData.faRequiredAssistanceBean.infraDevElecExpAmt);
		  }
	      if(null!= state.faData.faRequiredAssistanceBean.infraDevCompWaterExpAmt){
	    	  forWater=parseFloat(state.faData.faRequiredAssistanceBean.infraDevCompWaterExpAmt);
		  }
		}
		 return (forRoad+forElect+forWater).toFixed(2)+""; 	 
	  };
state.calcTotal = function(dataArray){
		    var total=parseFloat("0");
		    each(dataArray, function(data){
		    	if(null!=data.amount){
		    		 total += parseFloat(data.amount);
		    	}
		    })
			 return total.toFixed(2)+""; 	 
		  };
state.downloadFaDocumentsByApplicant = function (documentId) {

    loading.start('sample-1');

    var appId = params.applicationId;

    if (!/^[0-9]+$/.test(documentId) || !/^[0-9]+$/.test(appId)) {
        loading.finish('sample-1');
        return;
    }
 
    var pathParts = window.location.pathname.split('/');
    var contextPath = '/mpmsme';
    
    var safeUrl = window.location.origin +
        contextPath +'/applicant/downloadFaDocumentByDocumentId/' +
        documentId + '/' + appId;

    navigation.open(safeUrl, '_blank');

    loading.finish('sample-1');
};
state.calcTotalProductAnnualAmt = function(dataArray){
		    var total=parseFloat("0");
		    
		    each(dataArray, function(data){
			
		    	if(null!=data.annualCapacity){
		    		 total += parseFloat(data.annualCapacity);
		    	}
		    })
			 return total.toFixed(2)+"";  
		  };
state.ShowHideDisbursementDetails = function() {
				
				state.IsVisible = state.IsVisible ? false : true;
			};
state.getApplicationId = function() {
				state.applicationId = params.applicationId;
				state.establishmentType = params.establishmentType;
			};
state.downloadAcceptanceLetter = function() {
				navigation.open('downloadacceptanceletter/'
					+ params.applicationId);
			};
state.uploadAcceptanceLetter = function(acceptanceFile) {
				request
					.get('getMessage/fa.applicant.detailsSubmit')
					.then(
						function(response) {
							
							if (navigation
								.confirm(response.data.value)) {
								var fd = new FormData();
								if (acceptanceFile) {
									fd.append('acceptanceFile',
										acceptanceFile);
								}

								fd
									.append(
										'applicationId',
										params.applicationId);

								loading.start('sample-1');
								var responsePromise = request
									.post(
										'uploadacceptancefile',
										fd,
										{
											transformRequest: identity,
											headers: {
												'Content-Type': undefined
											}
										});

								responsePromise
									.success(function(data,
										status,
										headers, config) {

										state.responseObject = data;

										if (state.responseObject.successMessage != null) {
											later(
												function() {
													state.responseObject.successMessage = null;
												}, 3000);
											if (params.establishmentType == 'Unit') {
												navigation.location.href = '#dticfapendingapplicantsunit';
											} else {
												navigation.location.href = '#dticfapendingapplicantsapparel';
											}
											
											
											
										}
										loading
											.finish('sample-1');

									});
							} else {
								return false;
							}
						});
			};
}