// Source: angular/dtic/controller.js. Generated static JS, with explicit React IO dependencies.
export function installFaActions(state, { request, loading, navigation, params, format, later, dom }) {
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,Array.isArray(items) ? Number(k) : k));
const identity = value => value;
state.faMsmeDetailData = {};
state.sectorofinductryList = [];
state.eligRows = [];
state.eligAppNo = '';
state.IdList = [];
state.commentsOnlyAssistance = {
				13: true,   
				14: true,   
				15: true,   
				21: true    
			};
state.faMsmeDetailData = {};
state.amtModelToAssistId = {
				faIndustSubsidyAmt: 1, faQualityCerfAmt: 2, faReimbursementPatentsAmt: 3, faInfraDevAmt: 4,
				faPlantTreatAmt: 5, faEnergyAmt: 6, faUpgradeAmt: 7, faPharmLabAmt: 8,
				fa11Amt: 11, fa12Amt: 12, fa13Amt: 13, fa14Amt: 14, fa15Amt: 15, fa16Amt: 16,
				fa17Amt: 17, fa18Amt: 18, fa19Amt: 19, fa20Amt: 20, fa21Amt: 21, fa22Amt: 22
			};
state.assistMap = {};
state.startOrStopSpinner = function(isStart) {

				if (isStart) {
					loading.start('sample-1');
				} else {
					loading.finish('sample-1');
				}

			};
state.fetchStates = function() {
				var responseStates = request
					.get('fetchallstates');
				responseStates.success(function(data,
					status, headers, config) {
					state.respondentStates = data;
				});
			};
state.fetchDistrictTehsilBlockByDistrict = function(districtId) {

				

				if (null != districtId) {
					loading.start('sample-1');
					var responseDistricts = request.get(
						'fetchdistricttehsilmapbydistrictid', {
						params: {
							'districtId': districtId
						}
					});
					responseDistricts.success(function(data, status,
						headers, config) {
						state.tehsils = data;
						var responseDistricts1 = request.get(
							'fetchdistrictblockmapbydistrictid', {
							params: {
								'districtId': districtId
							}
						});

						responseDistricts1.success(function(data, status,
							headers, config) {
							state.blocks = data;
							loading.finish('sample-1');
						});
					});
				} else {
					state.tehsils = "";
					state.blocks = "";
				}
			};
state.fetchPresentAddDistrictByState = function(stateId) {

				if (state.signupData) {
					state.tehsils = "";
					state.signupData.districtId = "";
					state.signupData.tehsilId = "";
				}

				if (state.officeData) {
					state.tehsils = "";
					state.officeData.districtId = "";
					state.officeData.tehsilId = "";
				}

				if (null != stateId) {
					loading.start('sample-1');
					var responseDistricts = request.get(
						'fetchdistrictmapbystate', {
						params: {
							'stateId': stateId
						}
					});
					responseDistricts.success(function(data, status,
						headers, config) {
						state.districts = data;
						loading.finish('sample-1');
					});
				}

				
			};
state.loadBacklogForm = function() {
				
				var responsePromise = request.get('fetchBacklog');
				responsePromise
					.success(function(data, status, headers, config) {
						state.backlog = data;
						console.log(state.backlog); 
						console.log(state.backlog.sanctionDeatils);
					})
					.error(function(data, status, headers, config) {
						console.error("Error occurred:", data);
					});

			};
state.calTotalEmployment = function(dataArray,
				withPrecision) {
				var total = 0;
				each(dataArray, function(data) {
					total += Number(data.empNumber || 0);
				})
				if (withPrecision) {
					return parseFloat(total).toFixed(2);
				} else {
					return parseFloat(total).toFixed(0);
				}
			};
state.calcTotalCompExpUnderID = function() {
				var forRoad = parseFloat("0");
				var forElect = parseFloat("0");
				var forWater = parseFloat("0");
				if (null != state.faData.faRequiredAssistanceBean.infraDevCompRoadConExpAmt) {
					forRoad = parseFloat(state.faData.faRequiredAssistanceBean.infraDevCompRoadConExpAmt);
				}
				if (null != state.faData.faRequiredAssistanceBean.infraDevElecExpAmt) {
					forElect = parseFloat(state.faData.faRequiredAssistanceBean.infraDevElecExpAmt);
				}
				if (null != state.faData.faRequiredAssistanceBean.infraDevCompWaterExpAmt) {
					forWater = parseFloat(state.faData.faRequiredAssistanceBean.infraDevCompWaterExpAmt);
				}
				return (forRoad + forElect + forWater).toFixed(2) + "";
			};
state.loadIndustryDetails = function() {
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

					each(state.faData.industrialPartnerslist, function(partner) {
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
						state.showTextBox();
						if (null == state.faData.faIndustrialUnitBean.activityDetailsList)
							state.faData.faIndustrialUnitBean.activityDetailsList = [{}];
						if (null == state.faData.faIndustrialUnitBean.capitalInvestmentBeans) {
							state.faData.faIndustrialUnitBean.capitalInvestmentBeans = [{}];
							state.faData.faIndustrialUnitBean.capitalInvestmentBeans.push({});
							state.faData.faIndustrialUnitBean.capitalInvestmentBeans[0].investmentName = 'Plant & Machinery';
							state.faData.faIndustrialUnitBean.capitalInvestmentBeans[1].investmentName = 'Building';
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

						state.cerfdata = {};
						state.cerfdata.CertificationDetails = {};
						params.udyamRegNo = state.faData.udyamRegNo;
						state.cerfdata.cerfnumber = state.faData.faRequiredAssistanceBean.certificateNumber;
						state.cerfdata.CertificationDetails.CertificationDate = state.faData.faRequiredAssistanceBean.certificationDate;
						state.cerfdata.CertificationDetails.ExpiryDate = state.faData.faRequiredAssistanceBean.expiryDate;
						state.cerfdata.CertificationDetails.BronzeCertified = state.faData.faRequiredAssistanceBean.bronzeCertified;
						state.cerfdata.CertificationDetails.SilverCertified = state.faData.faRequiredAssistanceBean.silverCertified;
						state.cerfdata.CertificationDetails.GoldCertified = state.faData.faRequiredAssistanceBean.goldCertified;


						loading.finish('sample-1');
					});
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
state.calcTotalProductAnnualAmt = function(dataArray) {
				var total = parseFloat("0");

				each(dataArray, function(data) {

					if (null != data.annualCapacity) {
						total += parseFloat(data.annualCapacity);
					}
				})
				return total.toFixed(2) + "";
			};
state.showFaExpansionTable = function() {

				state.showExpFlag = false;
				if (state.faData.faIndustrialUnitBean.unitType == 'Other') {
					state.showExpFlag = true;
				}
			};
state.showTextBox = function() {

				state.showprevAppId = false;

				if (state.appliedBefore == "yes") {
					state.showprevAppId = true;
				}
				else {
					state.showprevAppId = false;
				}

			};
state.downloadFaDocuments = function(documentId) {
				loading.start('sample-1');



				navigation.open('downloadFaDocumentByDocumentId/' + documentId + '/' + params.applicationId);
				loading.finish('sample-1');
			};
state.downloadSanctionDocuments = function(applicationId) {
				loading.start('sample-1');

				var responsePromise = request
					.get(
						'fetchFAMSMEDetailUnitForSanction',
						{
							params: {
								'applicationId': applicationId
							}
						});

				responsePromise
					.success(function(data, status, headers, config) {
						state.faData = data;

						state.documentId = state.faData.dlacSanctionUploadId;
						navigation.open('downloadFaDocumentByDocumentId/' + state.documentId + '/' + applicationId);
					});

				loading.finish('sample-1');

			};
state.downloadPrapatra = function(name) {
				navigation.open('download/' + name);
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
state.openEligible = function() {
				if (state.IdList && state.IdList.length === 1) { state.eligAppNo = state.IdList[0]; }
				if (state.eligRows.length === 0) { state.addEligRow(); }
			};
state.addEligRow = function() {
				state.eligRows.push({ componentCode: 'C' + (state.eligRows.length + 1), componentName: '', eligibleAmount: null });
			};
state.removeEligRow = function(i) { state.eligRows.splice(i, 1); };
state.loadEligible = function() {
				if (!state.eligAppNo) { return; }
				request.get('fetchEligibleAmounts/' + state.eligAppNo).success(function(d) {
					state.eligRows = (d && d.length) ? d : [{ componentCode: 'C1', componentName: '', eligibleAmount: null }];
				});
			};
state.saveEligible = function() {
				if (!state.eligAppNo || !state.eligAppNo.trim()) { alert('Please enter the application number.'); return; }
				var payload = [];
				for (var i = 0; i < state.eligRows.length; i++) {
					var r = state.eligRows[i];
					if (r.componentName && r.componentName.trim()) {
						payload.push({ applicationNo: state.eligAppNo.trim(), componentCode: (r.componentCode || ('C' + (i + 1))), componentName: r.componentName, eligibleAmount: r.eligibleAmount });
					}
				}
				if (payload.length === 0) { alert('Add at least one component with an amount.'); return; }
				request.post('saveEligibleAmounts', payload).success(function() {
					alert('Eligible amounts saved for ' + state.eligAppNo + '.');
					dom('#eligibleModal').modal('hide');
				}).error(function() { alert('Could not save eligible amounts.'); });
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
state.loadFASchemesSelection = function() {

				loading.start('sample-1');
				var responsePromise = request
					.get(
						'fa/fetchFASchemesSelection',
						{
							params: {
								'applicationId': params.applicationId
							}
						});
				state.applicationId = params.applicationId;
				responsePromise
					.success(function(data, status, headers, config) {
						state.faData = data;

						if (state.faData.selectfa1) {
							state.faMsmeDetailData.capitalApprove = 'false';
							state.faMsmeDetailData.interestApprove = 'false';
						}
						if (state.faData.selectfa4) {
							state.faMsmeDetailData.entryTaxApprove = 'false';
						}
						if (state.faData.selectfa5) {
							state.faMsmeDetailData.vatCstApprove = 'false';
						}
						if (state.faData.selectfa6) {
							state.faMsmeDetailData.electricityApprove = 'false';
						}
						if (state.faData.selectfa7) {
							state.faMsmeDetailData.mandiFeeApprove = 'false';
						}
						var responsePromise1 = request
							.get(
								'fa/fetchrequestprocess',
								{
									params: {
										'applicationId': params.applicationId,
										'statusId': 6
									}
								});
						responsePromise1
							.success(function(data, status,
								headers, config) {
								state.faMsmeDetailData.meetingDate = data.decisionDate;
								loading.finish('sample-1');
							});

					});

			};
state.fetchFAMSMEDetailsForDisbursment = function() {

				loading.start('sample-1');
				var responsePromise = request
					.get(
						'fetchFAMSMEDetailsForDisbursment',
						{
							params: {
								'applicationId': params.applicationId
							}
						});
				state.applicationId = params.applicationId;
				responsePromise
					.success(function(data, status, headers, config) {
						state.faData = data;

						if (state.faData.disbursementeAmt != null) {
							state.faMsmeDetailData.disbursementeAmt = state.faData.disbursementeAmt;

						}
						if (state.faData.disbursementeUploadId != null) {
							state.faMsmeDetailData.disbursementeUploadId = state.faData.disbursementeUploadId;

						}


						loading.finish('sample-1');


					});

			};
state.isRndAmountApplicable = function() {
				return true;
			};
state.isAmountApplicable = function(assistanceId) {
				var id = Number(assistanceId);
				if (id === 20) { return state.isRndAmountApplicable(); }
				return !state.commentsOnlyAssistance[id];
			};
state.saveEligibleAmount = function() {

				var applicantAssistanceList = [];

				function addAssistance(assistanceId, assistanceType, amount) {

    var remark = state.faData['remarkFA' + assistanceId];

    
    
    
    var hasAmount = (amount !== null && amount !== undefined && String(amount).trim() !== "");
    var hasRemark = (remark !== null && remark !== undefined && String(remark).trim() !== "");

    
    
    if (!state.isAmountApplicable(assistanceId)) {
        hasAmount = false;
    }

    if (hasAmount || hasRemark) {

        applicantAssistanceList.push({
            applicationId: state.faData.applicationId,
            assistanceId: assistanceId,
            assistanceType: assistanceType,
            eligibleAmount: hasAmount ? amount : 0,
            remark: hasRemark ? remark : null
        });

    }
}

				addAssistance(1, "Industrial Development Subsidy", state.faData.eligibleAmountFA1);
				addAssistance(2, "Quality Certification", state.faData.eligibleAmountFA2);
				addAssistance(3, "Patent Reimbursement", state.faData.eligibleAmountFA3);
				addAssistance(4, "Infrastructure Development", state.faData.eligibleAmountFA4);
				addAssistance(5, "Effluent Treatment Plant", state.faData.eligibleAmountFA5);
				addAssistance(6, "Energy Audit", state.faData.eligibleAmountFA6);
				addAssistance(7, "Powerloom Upgradation", state.faData.eligibleAmountFA7);
				addAssistance(8, "Pharmaceutical Lab", state.faData.eligibleAmountFA8);
				addAssistance(11, "Freight Export", state.faData.eligibleAmountFA11);
				addAssistance(12, "Global Competitiveness", state.faData.eligibleAmountFA12);
				addAssistance(13, "Food Processing", state.faData.eligibleAmountFA13);
				addAssistance(14, "Apparel Sector", state.faData.eligibleAmountFA14);
				addAssistance(15, "Textile Units", state.faData.eligibleAmountFA15);
				addAssistance(16, "Footwear", state.faData.eligibleAmountFA16);
				addAssistance(17, "Boosting Circular Economy", state.faData.eligibleAmountFA17);
				addAssistance(18, "Motor Vehicle Scrapping", state.faData.eligibleAmountFA18);
				addAssistance(19, "Logistics", state.faData.eligibleAmountFA19);
				addAssistance(20, "Research Development", state.faData.eligibleAmountFA20);
				addAssistance(21, "Revival Sick Unit", state.faData.eligibleAmountFA21);

				var fd = new FormData();

				fd.append("applicationId", state.faData.applicationId);
				fd.append("assistanceList", JSON.stringify(applicantAssistanceList));
				loading.start('sample-1');

				var responsePromise = request.post('fa/saveEligibleAmount', fd, {

					transformRequest: identity,

					headers: {
						'Content-Type': undefined
					}

				});
				responsePromise.success(function(data, status, headers, config) {

					state.responseObject = data;

					if (state.responseObject.successMessage != null) {
						later(
							function() {
								state.responseObject.successMessage = null;
							}, 3000);
						alert(state.responseObject.successMessage);
					}

					loading.finish('sample-1');

				});
			};
state.loadFASchemesSelectionForZonal = function() {

				loading.start('sample-1');
				var responsePromise = request
					.get(
						'fa/fetchFASchemesSelection',
						{
							params: {
								'applicationId': params.applicationId
							}
						});
				state.applicationId = params.applicationId;
				responsePromise
					.success(function(data, status, headers, config) {
						state.faData = data;

						
						
						
						
						if (state.faData.selectfa2) {
							state.faMsmeDetailData.infraApprove = 'false';
						}
						if (state.faData.selectfa3) {
							state.faMsmeDetailData.wasteApprove = 'false';
						}

						var responsePromise1 = request
							.get(
								'fa/fetchrequestprocess',
								{
									params: {
										'applicationId': params.applicationId,
										'statusId': 12
									}
								});
						responsePromise1
							.success(function(data, status,
								headers, config) {
								state.faMsmeDetailData.zonalMeetingDate = data.decisionDate;
								loading.finish('sample-1');
							});

					});

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
state.loadPages = function() {
				state.applicationIds = params.applicationIds;
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
state.loadQuery = function() {
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
						'fetchpendingapplicantsByIds' + '/' + state.applicationIds + '/' + params.establishmentType
					);


				responsePromise.success(function(data, status, headers,
					config) {
					state.faRequestProcessBeanList = data;
					loading.finish('sample-1');
				});


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
state.ShowHideDisbursementDetails = function() {
				
				state.IsVisible = state.IsVisible ? false : true;
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


						total = (select1 + select2 + select3 + select4 + select5 + select6 + select7 + select8 + select11 + select12 + select13 + select14 + select15 + select16 + select17 + select18 + select19 + select20 + select21).toFixed(2);
						state.faMsmeDetailData.totalamt = parseInt(total);



						loading.finish('sample-1');


					});


			};
state.addInspectionStatus = function(isValid) {

				if (!isValid) {
					return false;
				}

				request.get('getMessage/common.confirmToSave').then(function(response) {
					
					if (confirm(response.data.value)) {

						var fd = new FormData();

						if (state.faMsmeDetailData.comments) {
							fd.append('comments',
								state.faMsmeDetailData.comments);
						}

						if (state.faMsmeDetailData.decisionDate) {
							state.faMsmeDetailData.decisionDate = format(
								'date')(
									state.faMsmeDetailData.decisionDate,
									'dd/MM/yyyy');
							fd.append('decisionDate',
								state.faMsmeDetailData.decisionDate);
						}

						if (state.faMsmeDetailData.status) {
							fd.append('status', state.faMsmeDetailData.status);
						}

						if (state.faMsmeDetailData.document) {
							fd.append('document',
								state.faMsmeDetailData.document);
						}

						if (state.faMsmeDetailData.faInspectionBean.productionDate) {
							state.faMsmeDetailData.faInspectionBean.productionDate = format(
								'date')
								(
									state.faMsmeDetailData.faInspectionBean.productionDate,
									'dd/MM/yyyy');
							fd
								.append(
									'faInspectionBean.productionDate',
									state.faMsmeDetailData.faInspectionBean.productionDate);
						}

						if (state.faMsmeDetailData.faInspectionBean.machineIvestment) {
							fd
								.append(
									'faInspectionBean.machineIvestment',
									state.faMsmeDetailData.faInspectionBean.machineIvestment);
						}

						if (state.faMsmeDetailData.faInspectionBean.verification) {
							fd
								.append(
									'faInspectionBean.verification',
									state.faMsmeDetailData.faInspectionBean.verification);
						}

						if (state.faMsmeDetailData.faInspectionBean.firstMaterialDate) {
							state.faMsmeDetailData.faInspectionBean.firstMaterialDate = format(
								'date')
								(
									state.faMsmeDetailData.faInspectionBean.firstMaterialDate,
									'dd/MM/yyyy');
							fd
								.append(
									'faInspectionBean.firstMaterialDate',
									state.faMsmeDetailData.faInspectionBean.firstMaterialDate);
						}

						if (state.faMsmeDetailData.faInspectionBean.infraDevelopment) {
							fd
								.append(
									'faInspectionBean.infraDevelopment',
									state.faMsmeDetailData.faInspectionBean.infraDevelopment);
						}

						if (state.faMsmeDetailData.faInspectionBean.electricity) {
							fd
								.append(
									'faInspectionBean.electricity',
									state.faMsmeDetailData.faInspectionBean.electricity);
						}

						if (state.faMsmeDetailData.faInspectionBean.subsidy) {
							fd
								.append(
									'faInspectionBean.subsidy',
									state.faMsmeDetailData.faInspectionBean.subsidy);
						}

						if (state.faMsmeDetailData.faInspectionBean.apparel) {
							fd
								.append(
									'faInspectionBean.apparel',
									state.faMsmeDetailData.faInspectionBean.apparel);
						}

						if (state.faMsmeDetailData.faInspectionBean.others) {
							fd
								.append(
									'faInspectionBean.others',
									state.faMsmeDetailData.faInspectionBean.others);
						}

						if (state.faMsmeDetailData.faInspectionBean.primaryVikaskhand) {
							fd
								.append(
									'faInspectionBean.primaryVikaskhand',
									state.faMsmeDetailData.faInspectionBean.primaryVikaskhand);
						}

						fd.append('applicationId', params.applicationId);

						state.faMsmeDetailData.applicationId = params.applicationId;

						loading.start('sample-1');

						var responsePromise = request.post('addInspectionStatus',
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
state.raiseQueryByDtic = function(isValid) {

				if (!isValid) {
					return false;
				}

				request.get('getMessage/common.confirmToSave').then(function(response) {
					
					if (confirm(response.data.value)) {

						var fd = new FormData();
						state.faMsmeDetailData.status = "query";
						if (state.faMsmeDetailData.comments != null) {
							fd.append('comments',
								state.faMsmeDetailData.comments);
						}

						if (state.faMsmeDetailData.decisionDate != null) {
							state.faMsmeDetailData.decisionDate = format(
								'date')(
									state.faMsmeDetailData.decisionDate,
									'dd/MM/yyyy');
							fd.append('decisionDate',
								state.faMsmeDetailData.decisionDate);
						}

						if (state.faMsmeDetailData.status != null) {
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
state.addCommitteesStatus = function(isValid) {
				if (!isValid) {
					return false;
				}

				if (state.faMsmeDetailData.document == null) {
					alert("Please upload DLAC order");
				}

				else {
					if (dom("#document")[0].files[0].size > 2097152) {
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

									if (state.faMsmeDetailData.comments != null) {
										fd
											.append(
												'comments',
												state.faMsmeDetailData.comments);
									}

									if (state.faMsmeDetailData.decisionDate != null) {
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

									if (state.faMsmeDetailData.status != null) {
										fd
											.append(
												'status',
												state.faMsmeDetailData.status);
									}

									if (state.faMsmeDetailData.document != null) {
										fd.append('document', state.faMsmeDetailData.document);
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
				}
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
state.viewCommitteeStatusDetails = function() {


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

				loading.finish('sample-1');
			};
state.uploadDisbursementOrder = function(isValid) {

				
				

				

				if (state.faData.disbursementDoc == null) {
					alert("Please upload disbursement order");
				}

				
				else if (state.faData.disbursementDoc != null && state.faData.disbursementAmt != null && state.faData.remarks != null) {
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
				}
			};
state.uploadOtherDocument = function(isVaild) {

				
				

				

				if (state.faData.faOtherDocument == null) {
					alert("Please upload document file");
				}


				else if (state.faData.faOtherDocument != null && state.faData.remarks != null) {
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

												navigation.location.href = '#faOtherUploadDocuments/' + params.applicationId + '/' + 'Unit';

											}

											loading
												.finish('sample-1');
										});
								} else {
									return false;
								}
							});
				}
			};
state.addZonalStatus = function(isValid) {
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

								if (state.faMsmeDetailData.document) {
									fd
										.append(
											'document',
											state.faMsmeDetailData.document);
								}

								if (state.faMsmeDetailData.decisionDate) {
									fd
										.append(
											'decisionDate',
											format(
												'date')
												(
													state.faMsmeDetailData.decisionDate,
													'dd/MM/yyyy'));
								}
								if (params.applicationId) {
									fd
										.append(
											'applicationId',
											params.applicationId);
								}
								if (state.faMsmeDetailData.status) {
									fd
										.append(
											'status',
											state.faMsmeDetailData.status);
								}
								if (state.faMsmeDetailData.comments) {
									fd
										.append(
											'comments',
											state.faMsmeDetailData.comments);
								}

								state.faMsmeDetailData.applicationId = params.applicationId;

								loading.start('sample-1');
								
								
								

								var responsePromise = request
									.post(
										'addZonalStatus',
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
state.onCapitalApproveSelected = function() {
				state.unitAmountRequired = false;
				if (state.faMsmeDetailData.capitalApprove == 'true') {
					state.unitAmountRequired = true;
				}
			};
state.onInterestApproveSelected = function() {
				state.interestRequired = false;
				if (state.faMsmeDetailData.interestApprove == 'true') {
					state.interestRequired = true;
				}
			};
state.onVatApproveSelected = function() {
				state.investmentRequired = false;
				if (state.faMsmeDetailData.vatCstApprove == 'true') {
					state.investmentRequired = true;
				}
			};
state.onEntryApproveSelected = function() {
				state.rawMaterialPurDateRequired = false;
				if (state.faMsmeDetailData.entryTaxApprove == 'true') {
					state.rawMaterialPurDateRequired = true;
				}
			};
state.onElecticityApproveSelected = function() {
				state.electRequired = false;
				if (state.faMsmeDetailData.electricityApprove == 'true') {
					state.electRequired = true;
				}
			};
state.onMandiFeeApproveSelected = function() {
				state.mandiRequired = false;
				if (state.faMsmeDetailData.mandiFeeApprove == 'true') {
					state.mandiRequired = true;
				}
			};
state.calcTotalCompExpUnderSanctionAmt = function() {
				var s = parseFloat("0");
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
					return (select1 + select2 + select3 + select4 + select5 + select6 + select7 + select8).toFixed(2) + "";

				}
			};
state.calcTotalCompExpUnderIDForApproval = function() {
				var forRoad = parseFloat("0");
				var forElect = parseFloat("0");
				var forWater = parseFloat("0");
				if (null != state.faMsmeDetailData
					&& null != state.faMsmeDetailData.infraApproveRoadAmt) {
					forRoad = parseFloat(state.faMsmeDetailData.infraApproveRoadAmt);
				}
				if (null != state.faMsmeDetailData
					&& null != state.faMsmeDetailData.infraApproveElectAmt) {
					forElect = parseFloat(state.faMsmeDetailData.infraApproveElectAmt);
				}
				if (null != state.faMsmeDetailData
					&& null != state.faMsmeDetailData.infraApproveWaterAmt) {
					forWater = parseFloat(state.faMsmeDetailData.infraApproveWaterAmt);
				}
				return (forRoad + forElect + forWater).toFixed(2) + "";
			};
state.validateApprovedAmount = function(isRoad, isElect,
				isWater) {

				if (isRoad
					&& parseFloat(state.faMsmeDetailData.infraApproveRoadAmt) > parseFloat(state.faData.infraDevCompRoadConExpAmt)) {
					state.faMsmeDetailData.infraApproveRoadAmt = null;
					
					request.get('getMessage/dtic.fa.roadConstruction')
						.then(function(response) {
							alert(response.data.value);
						});
				} else if (isElect
					&& parseFloat(state.faMsmeDetailData.infraApproveElectAmt) > parseFloat(state.faData.infraDevElecExpAmt)) {
					state.faMsmeDetailData.infraApproveElectAmt = null;
					
					request.get('getMessage/dtic.fa.electrification')
						.then(function(response) {
							alert(response.data.value);
						});
				} else if (isWater
					&& parseFloat(state.faMsmeDetailData.infraApproveWaterAmt) > parseFloat(state.faData.infraDevCompWaterExpAmt)) {
					state.faMsmeDetailData.infraApproveWaterAmt = null;
					
					request.get('getMessage/dtic.fa.waterInfra').then(
						function(response) {
							alert(response.data.value);
						});
				}
			};
state.validateApprovedAmountForWasteMgmt = function() {
				if (parseFloat(state.faMsmeDetailData.wasteApproveAmt) > state
					.calcTotal(state.faData.wasteMgmtEstbCompExpInvDetailsBeans)) {
					state.faMsmeDetailData.wasteApproveAmt = null;
					
					request.get('getMessage/dtic.fa.wasteMgmt').then(
						function(response) {
							alert(response.data.value);
						});
				}
			};
state.calcTotal = function(dataArray) {
				var total = parseFloat("0");
				each(dataArray, function(data) {
					if (null != data.amount) {
						total += parseFloat(data.amount);
					}
				})
				return total.toFixed(2) + "";
			};
state.calcTotalInt = function(dataArray) {
				var total = parseFloat("0");
				each(dataArray, function(data) {
					if (null != data.amount) {
						total += parseFloat(data.amount);
					}
				})
				return total + "";
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
state.calTotalExpansion = function(isInt, data) {
				var expansionUnder = parseFloat("0");
				var expansionPre = parseFloat("0");
				if (null != data.expansionUnder) {
					expansionUnder = parseFloat(data.expansionUnder);
				}
				if (null != data.expansionPre) {
					expansionPre = parseFloat(data.expansionPre);
				}
				if (isInt) {
					return (expansionUnder + expansionPre) + "";
				} else {
					return (expansionUnder + expansionPre).toFixed(2)
						+ "";
				}
			};
state.addFAMSMEDetailUnitFunction = function(isValid) {
				if (!isValid)
					return false;

				request
					.get('getMessage/fa.applicant.detailsSubmit')
					.then(
						function(response) {
							
							if (navigation
								.confirm(response.data.value)) {
								if (state.faMsmeDetailData.meetingDate) {
									state.faMsmeDetailData.meetingDate = format(
										'date')
										(
											state.faMsmeDetailData.meetingDate,
											'dd/MM/yyyy');
								}
								if (state.faMsmeDetailData.zonalMeetingDate) {
									state.faMsmeDetailData.zonalMeetingDate = format(
										'date')
										(
											state.faMsmeDetailData.zonalMeetingDate,
											'dd/MM/yyyy');
								}

								if (state.faMsmeDetailData.commercialProductionDate) {
									state.faMsmeDetailData.commercialProductionDate = format(
										'date')
										(
											state.faMsmeDetailData.commercialProductionDate,
											'dd/MM/yyyy');
								}

								if (state.faMsmeDetailData.rawMaterialPurchaseDate) {
									state.faMsmeDetailData.rawMaterialPurchaseDate = format(
										'date')
										(
											state.faMsmeDetailData.rawMaterialPurchaseDate,
											'dd/MM/yyyy');
								}

								if (state.faMsmeDetailData.connectionDate) {
									state.faMsmeDetailData.connectionDate = format(
										'date')
										(
											state.faMsmeDetailData.connectionDate,
											'dd/MM/yyyy');
								}

								if (state.faMsmeDetailData.mandiProductionDate) {
									state.faMsmeDetailData.mandiProductionDate = format(
										'date')
										(
											state.faMsmeDetailData.mandiProductionDate,
											'dd/MM/yyyy');
								}

								state.faMsmeDetailData.applicationId = params.applicationId;
								loading.start('sample-1');
								var responsePromise = request
									.post(
										'addfamsmedetailunit',
										state.faMsmeDetailData);

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
											if (null != state.faMsmeDetailData.zonalMeetingDate) {
												navigation.location.href = '#viewdownloadfazonalacceptanceform/'
													+ params.applicationId;
											} else {
												navigation.location.href = '#viewdownloadfaacceptanceform/'
													+ params.applicationId
													+ '/'
													+ params.establishmentType;
											}
										}
										loading
											.finish('sample-1');
									});
							}
						});
			};
state.loadCollectorAssistances = function(appId) {
				request.get('fa/applicantAssistances/' + appId).success(function(list) {
					var m = {};
					each(list || [], function(x) {
						if (x && x.assistanceId != null) { m[x.assistanceId] = x; }
					});
					state.assistMap = m;
					each(state.amtModelToAssistId, function(id, model) {
						var x = m[id];
						
						
						if (!x) { return; }
						
						
						var amount = (x.sanctionedAmount != null) ? x.sanctionedAmount : 0;
						
						
						
						state.faMsmeDetailData[model] = String(amount);
					});
					state.zeroFillVisibleAmounts();
				});
			};
state.zeroFillVisibleAmounts = function() {
				each(state.amtModelToAssistId, function(id, model) {
					if (!state.faMsmeDetailData['selectfa' + id]) { return; }
					var current = state.faMsmeDetailData[model];
					if (current === null || current === undefined || current === '') {
						state.faMsmeDetailData[model] = '0';
					}
				});
			};
state.eligByModel = function(model) {
				var id = state.amtModelToAssistId[model];
				var x = (id != null) ? state.assistMap[id] : null;
				if (!x) { return '-'; }
				return (x.eligibleAmount != null) ? x.eligibleAmount : 0;
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
				
				
				
				
				
				
				state.loadCollectorAssistances(params.applicationId);
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

						
						
						
						state.zeroFillVisibleAmounts();

						loading.finish('sample-1');


					});

			};
state.addFAMSMEDetailUnitForSanction = function(isValid, obj) {

				
				

				request
					.get('getMessage/fa.applicant.detailsSubmit')
					.then(
						function(response) {
							
							if (navigation
								.confirm(response.data.value)) {
								if (state.faMsmeDetailData.acceptanceFile == null) {
									alert("please upload file");
								}
								else {

									var fd = new FormData();

									if (state.faMsmeDetailData.faIndustSubsidyLetterNo) {
										fd.append('faIndustSubsidyLetterNo', state.faMsmeDetailData.faIndustSubsidyLetterNo);
									}

									if (state.faMsmeDetailData.faIndustSubsidyLetterDate) {
										fd.append('faIndustSubsidyLetterDate', state.faMsmeDetailData.faIndustSubsidyLetterDate);
									}


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

									if (state.faMsmeDetailData.faQualityCerfLetterNo) {
										fd.append('faQualityCerfLetterNo', state.faMsmeDetailData.faQualityCerfLetterNo);
									}

									if (state.faMsmeDetailData.faQualityCerfLetterDate) {
										fd.append('faQualityCerfLetterDate', state.faMsmeDetailData.faQualityCerfLetterDate);
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

									if (state.faMsmeDetailData.faReimbursementPatentsLetterNo) {
										fd.append('faReimbursementPatentsLetterNo', state.faMsmeDetailData.faReimbursementPatentsLetterNo);
									}

									if (state.faMsmeDetailData.faReimbursementPatentsLetterDate) {
										fd.append('faReimbursementPatentsLetterDate', state.faMsmeDetailData.faReimbursementPatentsLetterDate);
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

									if (state.faMsmeDetailData.faInfraDevLetterNo) {
										fd.append('faInfraDevLetterNo', state.faMsmeDetailData.faInfraDevLetterNo);
									}

									if (state.faMsmeDetailData.faInfraDevLetterDate) {
										fd.append('faInfraDevLetterDate', state.faMsmeDetailData.faInfraDevLetterDate);
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

									if (state.faMsmeDetailData.faPlantTreatLetterNo) {
										fd.append('faPlantTreatLetterNo', state.faMsmeDetailData.faPlantTreatLetterNo);
									}

									if (state.faMsmeDetailData.faPlantTreatLetterDate) {
										fd.append('faPlantTreatLetterDate', state.faMsmeDetailData.faPlantTreatLetterDate);
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

									if (state.faMsmeDetailData.faEnergyLetterNo) {
										fd.append('faEnergyLetterNo', state.faMsmeDetailData.faEnergyLetterNo);
									}

									if (state.faMsmeDetailData.faEnergyLetterDate) {
										fd.append('faEnergyLetterDate', state.faMsmeDetailData.faEnergyLetterDate);
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

									if (state.faMsmeDetailData.faUpgradeLetterNo) {
										fd.append('faUpgradeLetterNo', state.faMsmeDetailData.faUpgradeLetterNo);
									}

									if (state.faMsmeDetailData.faUpgradeLetterDate) {
										fd.append('faUpgradeLetterDate', state.faMsmeDetailData.faUpgradeLetterDate);
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

									if (state.faMsmeDetailData.faPharmLabLetterNo) {
										fd.append('faPharmLabLetterNo', state.faMsmeDetailData.faPharmLabLetterNo);
									}

									if (state.faMsmeDetailData.faPharmLabLetterDate) {
										fd.append('faPharmLabLetterDate', state.faMsmeDetailData.faPharmLabLetterDate);
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
							}
						});

			};
state.getApplicationId = function() {
				state.applicationId = params.applicationId;
				state.establishmentType = params.establishmentType;
			};
state.addFAMSMEDetailApparelFunction = function(isValid) {

				if (!isValid)
					return false;

				if (state.faMsmeDetailData.meetingDate) {
					state.faMsmeDetailData.meetingDate = format(
						'date')(
							state.faMsmeDetailData.meetingDate,
							'dd/MM/yyyy');
				}

				state.faMsmeDetailData.applicationId = params.applicationId;
				loading.start('sample-1');
				var responsePromise = request.post(
					'addfamsmedetailapparel',
					state.faMsmeDetailData);

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject = data;

						if (state.responseObject.successMessage != null) {
							later(
								function() {
									state.responseObject.successMessage = null;
								}, 3000);
							navigation.location.href = '#viewdownloadfaacceptanceform/'
								+ params.applicationId
								+ '/'
								+ params.establishmentType;

						}
						loading.finish('sample-1');
					});

			};
state.downloadAcceptanceLetter = function() {
				navigation.open('downloadacceptanceletter/'
					+ params.applicationId);
			};
state.downloadZonalDecisionLetter = function() {
				navigation.open('downloadzonaldecisionletter/'
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
state.uploadZonalDecisionLetter = function(acceptanceFile) {

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
										'uploadzonaldecisionfile',
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
			};
state.faDisbursementUnitView = function(status) {

				state.showbt = true;

				if (status == "Disbursement Letter Released") {

					navigation.location.href = '#viewfaDisbursementUnit/'
						+ params.applicationId + '/' + params.establishmentType;
				}
				
				else if (status == "DLAC Sanction Order Uploaded") {
					navigation.location.href = '#viewfaacceptanceamountdetailunit/'
						+ params.applicationId + '/' + params.establishmentType;
				}
				
				else if (status == "Inspection Approved") {

					navigation.location.href = '#viewfaacceptanceamountdetailunit/'
						+ params.applicationId + '/' + params.establishmentType;
				}
			};
state.loadFAApplicantDetail = function() {

				loading.start('sample-1');
				var responsePromise = request
					.get(
						'fa/fetchfaapplicantdetail',
						{
							params: {
								'applicationId': params.applicationId
							}
						});
				responsePromise.success(function(data, status, headers,
					config) {
					state.faApplicantBean = data;
					loading.finish('sample-1');
				});
			};
state.loadHistory = function() {

				loading.start('sample-1');
				var responsePromise = request
					.get(
						'fa/fetchHistory',
						{
							params: {
								'applicationId': params.applicationId,
								'establishmentType': params.establishmentType
							}
						});

				state.applicationId = params.applicationId;
				state.establishmentType = params.establishmentType;

				if (state.establishmentType == 'Unit') {
					state.showUnitList = true;
				} else {
					state.showInstitueList = true;
				}

				responsePromise.success(function(data, status, headers,
					config) {
					state.faRequestProcessBeanList = data;
					loading.finish('sample-1');
				});
			};
state.loadFASchemesDetail = function() {

				loading.start('sample-1');
				state.applicationId = params.applicationId;
				var responsePromise = request
					.get(
						'fa/fetchfaschemesdetail',
						{
							params: {
								'applicationId': params.applicationId
							}
						});
				responsePromise.success(function(data, status, headers,
					config) {
					state.faData = data;
					loading.finish('sample-1');
				});
			};
state.loadFADocumentsList = function() {

				loading.start('sample-1');
				var responsePromise = request
					.get(
						'fetchfaapplicantdocumentslist',
						{
							params: {
								'applicationId': params.applicationId
							}
						});
				responsePromise.success(function(data, status, headers,
					config) {
					state.applicantDocumentsList = data;
					state.applicationId = params.applicationId;
					loading.finish('sample-1');
				});
			};
state.downloadFADocument = function(documentTypeCode) {

				navigation.open('downloadfadocument/' + documentTypeCode
					+ '/' + params.applicationId);

			};
state.initTodayDate();
}
