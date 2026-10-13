// Generated from the legacy DTICIDController; React supplies IO adapters.
export function installInfrastructureActions(state, { request, loading, params, navigation, format, later, dom }) {
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v, Array.isArray(items) ? Number(k) : k));
const identity = value => value;
const encodeForm = value => new URLSearchParams(value).toString();
const refresh = () => { state.listVersion++; loading.finish(); state.notify(); };
const fetchApplicationList = refresh, fetchLandAllotmentList = refresh, reDraw = refresh, fetchLandAllotmentListForGroupLOI = refresh;
state.started = false;
state.legacyData = {

				industrialAreaId: "",
				locationType: "",
				purpose: "",
				categoryAllottee: "",
				ownerGender: "",
				allotmentType: "",
				categoryOfIndustry: "",
				currentStatus: ""
			};
state.formData = {
				totalPremium: "0.00",
				totalAmount: "0.00",
				totalPlotArea: "0.00",
				totalLease: "0.00",
				totalSecurity: "0.00",
				totalDevelopment: "0.00",
				additionalPremium: "0.00",
				otherCharges: "0.00",
				eoiAmount: ""
			};
state.pointData = {}
			state.workCreationData = {};
state.vacantLandData = {};
state.formData = {
				totalPremium: "0.00",
				totalAmount: "0.00",
				totalPlotArea: "0.00",
				totalLease: "0.00",
				totalSecurity: "0.00",
				totalDevelopment: "0.00",
				eoiAmount: ""
			};
state.applicationID = "";
state.applicantId = "";
state.signOption = null;
state.allotmentLetterData = {};
state.fileTooLarge = false;
state.formData = {
				h1BidAmount: 0,
				advancePremiumH1: 0,
				annualGroundRent: 0,
				annualMaintenance: 0,
				securityDeposite: 0,
				otherCharges: 0
			};
state.undevlopmentVisibilty = true;
state.industrialAreaList = null;
state.showH1Details = false;
state.showButton = true;
state.tenderInitiate = true;
state.isUndevelopedLandByApplicant = false;
function validateDates() {
				const pubDate = state.formData.publicationDate ? new Date(state.formData.publicationDate) : null;
				const startDate = state.formData.bidStartDate ? new Date(state.formData.bidStartDate) : null;
				const endDate = state.formData.bidEndDate ? new Date(state.formData.bidEndDate) : null;

				state.bidStartBeforePublication = false;
				state.bidEndBeforeStart = false;

				if (pubDate && startDate) {
					state.bidStartBeforePublication = startDate < pubDate;
				}

				if (startDate && endDate) {
					state.bidEndBeforeStart = endDate <= startDate;
				}
			}
state.verifyLegacyEntity = function() {
				var isConfirmed = window.confirm("Are you sure you want to verify this entity?");
				if (isConfirmed) {
					state.id = params.id;
					loading.start('sample-1');
					request.post('verifyLegacyEntity', state.id, {
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(function(response) {
						
						if (response.status === 201) {
							
							state.responseObject = response.data; 
							alert(state.responseObject.successMessage);
							navigation.location.href = '#/legacyData'; 

						}
						loading.finish('sample-1');
					}).catch(function(error) {
						
						loading.finish('sample-1'); 
						if (error.status === 400) {
							
							state.responseObject = error.data; 
							alert(state.responseObject.errorMessage);

						} else {
							
							alert("An unexpected error occurred: " + error.statusText);
						}
					});



				}
			};
state.checkSelection = function(item) {
				
				console.log('Item selected:', item.selected);
			};
state.saveLegacyData = function() {
				loading.start('sample-1');
				const legacyData = {
					id: state.id,
					zone: state.zone,
					district: state.district,
					industrialArea: state.industrialArea,
					dticName: state.dticName,
					plotNo: state.plotNo,
					areaInSqm: state.areaInSqm,
					locationType: state.locationType,
					purpose: state.purpose,
					nameOfUnit: state.nameOfUnit,
					constitutionOfTheFirm: state.constitutionOfTheFirm,
					nameOfAllottee: state.nameOfAllottee,
					categoryAllottee: state.categoryAllottee,
					ownerGender: state.ownerGender,
					allotmentType: state.allotmentType,
					loiDate: state.loiDate,
					dateOfAllotmentOrTransferOrder: state.dateOfAllotmentOrTransferOrder,
					premiumAmount: state.premiumAmount,
					leaseRent: state.leaseRent,
					developmentCharge: state.developmentCharge,
					maintenanceCharge: state.maintenanceCharge,
					otherCharges: state.otherCharges,
					leaseDeedExecutionDate: state.leaseDeedExecutionDate,
					possessionDate: state.possessionDate,
					leaseStartDate: state.leaseStartDate,
					leaseEndDate: state.leaseEndDate,
					dateOfProduction: state.dateOfProduction,
					productsManufacturing: state.productsManufacturing,
					categoryOfIndustry: state.categoryOfIndustry,
					investment: state.investment,
					employment: state.employment,
					currentStatus: state.currentStatus,
					statusOfPlots: state.statusOfPlots,
					additionalInformation: state.additionalInformation,
					verifyedEntity: state.verifyedEntity,
				};
				request.post('dticlegacyData', legacyData, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function(response) {
					
					if (response.status === 201) {
						
						state.responseObject = response.data; 
						alert(state.responseObject.successMessage);

					}
					loading.finish('sample-1');
				}).catch(function(error) {
					
					loading.finish('sample-1'); 
					if (error.status === 400) {
						
						state.responseObject = error.data; 
						alert(state.responseObject.errorMessage);
					} else {
						
						alert("An unexpected error occurred: " + error.statusText);
					}
				});
			};
state.loadLegacyDataWithID = function() {
				loading.start('sample-1');
				if (params.id) {
					state.id = params.id;
					var responseLegacyData = request
						.get('fetchLegacyDataWithID/' + state.id);
					responseLegacyData.success(function(data, status,
						headers, config) {
						state.id = data.id;
						state.zone = data.zone;
						state.district = data.district;
						state.industrialArea = data.industrialArea;
						state.dticName = data.dticName;
						state.plotNo = data.plotNo;
						state.areaInSqm = data.areaInSqm;
						state.locationType = data.locationType;
						state.purpose = data.purpose;
						state.nameOfUnit = data.nameOfUnit;
						state.constitutionOfTheFirm = data.constitutionOfTheFirm;
						state.nameOfAllottee = data.nameOfAllottee;
						state.categoryAllottee = data.categoryAllottee;
						state.ownerGender = data.ownerGender;
						state.allotmentType = data.allotmentType;
						state.loiDate = data.loiDate;
						state.dateOfAllotmentOrTransferOrder = data.dateOfAllotmentOrTransferOrder;
						state.premiumAmount = data.premiumAmount;
						state.leaseRent = data.leaseRent;
						state.developmentCharge = data.developmentCharge;
						state.maintenanceCharge = data.maintenanceCharge;
						state.otherCharges = data.otherCharges;
						state.leaseDeedExecutionDate = data.leaseDeedExecutionDate;
						state.possessionDate = data.possessionDate;
						state.leaseStartDate = data.leaseStartDate;
						state.leaseEndDate = data.leaseEndDate;
						state.dateOfProduction = data.dateOfProduction;
						state.productsManufacturing = data.productsManufacturing;
						state.categoryOfIndustry = data.categoryOfIndustry;
						state.investment = data.investment;
						state.employment = data.employment;
						state.currentStatus = data.currentStatus;
						state.statusOfPlots = data.statusOfPlots;
						state.additionalInformation = data.additionalInformation;
					});
					loading.finish('sample-1');
				}
			};
state.legacyDataList = function() {

				loading.start('sample-1');
				later(function() {
					state.verify = false;
					state.legacyDataList = [];
					state.legacyDataList = fetchHistoricDataListDTIC();  
				}, 0);


			};
state.fetchDticWiseCompleteDataOfLandApplicant = function() {
				loading.start('sample-1');
				state.errorMessage = '';
				state.dticResponseObject = '';

				if (state.month && state.year) {
					request.get('fetchDticWiseCompleteDataOfLandApplicant', {
						params: {
							month: state.month,
							year: state.year
						}
					}).then(function(response) {
						state.dticResponseObject = response.data;
					}).catch(function(error) {
						state.errorMessage = $sce.trustAsHtml(error.data || 'Something went wrong.');
					}).finally(function() {
						loading.finish('sample-1'); 
					});
				} else {
					state.errorMessage = $sce.trustAsHtml('Please select month and year');
					loading.finish('sample-1'); 
				}
			};
state.esignPaymentPendencyReportBean = function() {
				loading.start('sample-1');
				state.errorMessage = '';
				state.dticResponseObject = '';

				if (state.month && state.year) {
					request.get('fetchEsignPaymentPendencyReport', {
						params: {
							month: state.month,
							year: state.year
						}
					}).then(function(response) {
						state.esignResponseObject = response.data;
					}).catch(function(error) {
						state.errorMessage = $sce.trustAsHtml(error.data || 'Something went wrong.');
					}).finally(function() {
						loading.finish('sample-1'); 
					});
				} else {
					state.errorMessage = $sce.trustAsHtml('Please select month and year');
					loading.finish('sample-1'); 
				}
			};
state.getYear = function() {
				state.years = [];

				var currentYear = new Date().getFullYear(); 
				var startYear = 2015; 

				for (var y = startYear; y <= currentYear; y++) {
					state.years.push(y);
				}
			};
state.esignListExportToExcel = function() {
				var table = document.getElementById('dataTable');
				var wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
				var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
				saveAs(new Blob([wbout], { type: "application/octet-stream" }), 'esign_and_payment_pendency_report.xlsx');
			};
state.landApplicantListExportToExcel = function() {
				var table = document.getElementById('dataTable');
				var wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
				var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
				saveAs(new Blob([wbout], { type: "application/octet-stream" }), 'applicant_wise_complete_land_details.xlsx');
			};
state.loadIndustrialArea = function() {
				loading.start('sample-1');
				var responseIndusAreas = request
					.get('fetchIndustrialAreaListDTIC');

				responseIndusAreas.success(function(data, status,
					headers, config) {
					state.industrialAreaList = data;
					loading.finish('sample-1');
				});
			};
state.loadCategoryOfIndustry = function() {
				loading.start('sample-1');
				var responseIndusAreas = request
					.get('fatchCategoryOfIndustryDTIC');

				responseIndusAreas.success(function(data, status,
					headers, config) {
					state.categoryOfIndustryList = data;
					loading.finish('sample-1');
				});
			};
state.loadPurpose = function() {
				loading.start('sample-1');
				var responseIndusAreas = request
					.get('fetchPurposeAreaListDTIC');

				responseIndusAreas.success(function(data, status,
					headers, config) {
					state.industrialPurposeList = data;
					loading.finish('sample-1');
				});
			};
state.searchByLegecyDataFilters = function() {
				loading.start('sample-1');
				reDraw();
			};
state.loadIndustrialAreaByDistrictForLegacy = function(districtId) {
				loading.start('sample-1');
				var responseIndusAreas = request
					.get('fetchIndustrialAreaListforLegacyDTIC/' + districtId);

				responseIndusAreas.success(function(data, status,
					headers, config) {
					state.industrialAreaList = data;
					loading.finish('sample-1');
				});
			};
state.historicListExportToExcel = function() {
				
				var params = {
					industrialArea: state.legacyData.industrialAreaId,
					locationType: state.legacyData.locationType,
					purpose: state.legacyData.purpose,
					categoryAllottee: state.legacyData.categoryAllottee,
					ownerGender: state.legacyData.ownerGender,
					allotmentType: state.legacyData.allotmentType,
					categoryOfIndustry: state.legacyData.categoryOfIndustry,
					currentStatus: state.legacyData.currentStatus
				};

				var queryString = Object.keys(params)
					.map(key => key + '=' + encodeURIComponent(params[key]))
					.join('&')

				navigation.open('historicListExportToExcelDTIC?' + queryString, '_blank');
			};
state.startOrStopSpinner = function(isStart) {

				if (isStart) {
					loading.start('sample-1');
				} else {
					loading.finish('sample-1');
				}

			};
state.loadEnrolment = function() {
				loading.start('sample-1');
				fetchEnrolment();
			};
state.downloadDocument = function(documentType) {

				navigation.open('downloadIdDocument/' + documentType + '/'
					+ params.applicantId);

			};
state.loadDocumentsList = function() {

				state.vacantLandId = params.vacantLandId;
				state.applicantId = params.applicantId;

				loading.start('sample-1');
				var responsePromise = request
					.get(
						'id/fetchDocumentsList',
						{
							params: {
								'applicantId': params.applicantId
							}
						});
				responsePromise.success(function(data, status, headers,
					config) {
					state.applicantDocumentsList = data;
					state.applicantId = params.applicantId;
					loading.finish('sample-1');
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
state.loadPage = function() {
				state.vacantLandId = params.vacantLandId;
				state.applicantId = params.applicantId;
			};
state.addInspectionStatus = function(isValid) {

				if (!isValid) {
					return false;
				}
				request.get('getMessage/common.confirmToSave').then(function(response) {
					
					if (confirm(response.data.value)) {

						if (state.faMsmeDetailData.decisionDate) {
							state.faMsmeDetailData.decisionDate = format(
								'date')(
									state.faMsmeDetailData.decisionDate,
									'dd/MM/yyyy');
						}

						state.faMsmeDetailData.applicationId = params.applicantId;

						loading.start('sample-1');
						var responsePromise = request.post(
							'id/addInspectionStatus',
							state.faMsmeDetailData);

						responsePromise
							.success(function(data, status, headers, config) {

								state.responseObject = data;

								if (state.responseObject.successMessage != null) {

									navigation.location.href = '#id/viewAppliedApplicants' + '/' + params.vacantLandId;
								}

								loading.finish('sample-1');

							});
					}
				});



			};
state.loadVacantLandFormDetail = function() {

				loading.start('sample-1');
				var responseIndusAreas = request
					.get('fetchIndustrialAreaList');

				responseIndusAreas.success(function(data, status,
					headers, config) {
					state.industrialAreaList = data;
					loading.finish('sample-1');
				});

				
				state.fetchCategoryOfIndustry();

				var districtId;
				var dticId;
				state.vacantLandData = {};
				

				loading.start('sample-2');
				var responseDistricts = request
					.get('fetchdticdistrictsmap');

				responseDistricts.success(function(data, status,
					headers, config) {
					state.districts = data;
					each(state.districts,
						function(district) {
							districtId = district.key;
						});
					
					state.fetchTehsilByDistrict(districtId);
					state.vacantLandData.districtId = districtId + "";
					loading.finish('sample-2');
				});

				loading.start('sample-3');
				var responsedtic = request.get('fetchdticmap');

				responsedtic.success(function(data, status, headers,
					config) {
					state.dticList = data;
					for (var i in state.dticList) {
						dticId = i;
					}
					
					state.vacantLandData.dticId = dticId + "";
					loading.finish('sample-3');
				});

				loading.start('sample-4');
				var responsePurposes = request.get('fetchPurposeList');

				responsePurposes.success(function(data, status,
					headers, config) {
					state.purposeList = data;
					loading.finish('sample-4');
				});

				


			};
state.fetchTehsilByDistrict = function(districtId) {

				loading.start('sample-4');
				var responseTehsils = request.get(
					'fetchtehsilmapbydistrict', {
					params: {
						'districtId': districtId
					}
				});
				responseTehsils.success(function(data, status, headers,
					config) {
					state.tehsils = data;
					loading.finish('sample-4');
				});
			};
state.fetchIndustrialAreaLocations = function(
				industrialAreaId, edit) {
				
				state.industrialAreaLocations = null;
				state.vacantLandData.tehsilId = null;
				if (null != industrialAreaId) {
					loading.start('sample-1');

					var responsePromise = request
						.get(
							'fetchIndustrialAreaLocations',
							{
								params: {
									'industrialAreaId': industrialAreaId
								}
							});
					responsePromise
						.success(function(data, status, headers,
							config) {
							state.industrialAreaLocations = data;
							loading.finish('sample-1');
							if (null != data[0]) {
								state.vacantLandData.tehsilId = data[0].tehsilId
									+ "";
							}

							if (!edit) {
								state.vacantLandData.locationId = "";
							}
						});

					
				}
			};
state.loadVacantLandList = function(collectorRateId) {
				if (collectorRateId) {
					loading.start('sample-1');
					var responseLands = request
						.get(
							'fetchVacantLandList',
							{
								params: {
									'collectorRateId': collectorRateId
								}
							});
					responseLands.success(function(data, status,
						headers, config) {
						state.vacantLandList = data;
						loading.finish('sample-1');
					});

					if (state.vacantLandData.totalPlotArea) {
						state.fetchRatesByIndustrialAreaId(
							collectorRateId,
							state.vacantLandData.totalPlotArea);
					}
				}
			};
state.downloadVacantLandGoogleMap = function(vacantLandId) {
				navigation.open('downloadVacantLandGoogleMap/' + vacantLandId);
			};
state.downloadVacantLandMap = function(vacantLandId) {
				navigation.open('downloadVacantLandMap/' + vacantLandId);
			};
state.downloadHoldReleaseDoc = function(vacantLandId) {
				navigation.open('downloadHoldReleaseDoc/' + vacantLandId);
			};
state.initialize = function() {
				var hiddenValue = document.getElementById('vId').value.trim();
				state.populateForm(true, hiddenValue);
			};
state.populateForm = function(edit) {

				if (params.vacantLandId) {
					state.vacantLandId = params.vacantLandId;
					loading.start('sample-10');

					var responsePromise = request.get('fetchvacantlanddetail/' + state.vacantLandId);

					responsePromise.success(function(data, status, headers, config) {
						state.vacantLandData = data;

						
						state.vacantLandData.kmlUpload = state.vacantLandData.mapFileName;
						state.vacantLandData.hasGoogleMap = !!(state.vacantLandData.googleMap && state.vacantLandData.googleMap.trim() !== '');
						state.vacantLandData.kmlUpload = !!(state.vacantLandData.kmlUpload && state.vacantLandData.kmlUpload.trim() !== '');

						state.vacantLandData.industrialAreaId = data.industrialAreaId + "";

						
						var response = request.get('loadFYCollectorRates/' + state.vacantLandData.industrialAreaId);
						response.success(function(data2) {
							state.fyCollectorRatesList = data2;
							if (state.fyCollectorRatesList.length > 0) {
								state.vacantLandData.collectorRateId = data.collectorRateId + "";
							} else {
								state.vacantLandData.collectorRateId = "";
							}
						});

						state.fetchIndustrialAreaLocations(data.industrialAreaId, edit);

						state.vacantLandData.locationId = data.locationId + "";
						state.vacantLandData.districtId = data.districtId + "";
						state.vacantLandData.dticId = data.dticId + "";
						state.vacantLandData.vacantLandTehsil = data.tehsilId + "";
						state.vacantLandData.mapImage = "";
						state.vacantLandData.category = data.category;
						state.vacantLandData.categoryOfIndustryId = data.industrialCategory;
						state.vacantLandData.otherRentChargeReson = data.otherRentChargesReason;

						if (data.otherRentCharges != 0.0) {
							state.vacantLandData.totalAmountHidden = data.totalAmount - data.otherRentCharges;
						} else {
							state.vacantLandData.totalAmountHidden = data.totalAmount;
						}

						state.vacantLandData.newArea = data.newArea;

						
						if (data.kmlPoints && data.kmlPoints.length > 0) {
							try {
								state.responseObject = data.kmlPoints; 
								let polygonCoords = [];

								for (let i = 0; i < data.kmlPoints.length; i++) {
									const lat = parseFloat(data.kmlPoints[i].lattitude);
									const lon = parseFloat(data.kmlPoints[i].longitude);
									if (!isNaN(lat) && !isNaN(lon)) {
										polygonCoords.push([lat, lon]);
									}
								}

								state.setMapPolygon(polygonCoords);

							} catch (innerErr) {
								console.error("Error drawing polygon:", innerErr);
							}
						}
						
						var selectedId = state.vacantLandData.industrialAreaId;

										if (!state.industrialAreaList || state.industrialAreaList.length === 0) {
											console.error("industrialAreaList is null or empty");
											state.loadIndustrialAreaTable();
											
										}
										

										var selectedArea = state.industrialAreaList.find(function(item) {
											return item.key == selectedId;
										});

										if (selectedArea?.value && selectedArea.value.indexOf("Undeveloped Land") !== -1) {
											
											state.vacantLandData.newArea = "Old";

											
											state.showNewAreaField = false;

										} else {
											
											state.showNewAreaField = true;
											
										}
	
										
						
						loading.finish('sample-10');
					});
				}
			};
state.fetchVacantLandTehsilByDistrict = function(
				districtId) {

				loading.start('sample-1');
				var responseDistricts = request.get('fetchalltehsilsmap',
					{
						params: {
							'districtId': districtId
						}
					});

				responseDistricts.success(function(data, status,
					headers, config) {
					state.vacantLandTehsils = data;
					loading.finish('sample-1');
				});

			};
state.onDateChange = function() {
				state.bookingDateGreater = false;
				
			};
state.onEndDateChange = function() {
				var sdate = state.vacantLandData.bookingStartDate;
				var year = sdate.substr(6, 4)
				var month = sdate.substr(3, 2)
				if (month > 3)
					var year1 = parseInt(year) + 1;
				else
					var year1 = year;
				var newDate = new Date(year1 + "/04/01");
				var eDate = state.vacantLandData.bookingEndDate;
				var day1 = eDate.substr(0, 2);
				var month1 = eDate.substr(3, 2);
				var year1 = eDate.substr(6, 4)
				var endDate = new Date(year1 + "/" + month1 + "/" + day1);
				if (endDate >= newDate) {
					alert("End date should not exceed current financial year !!")
					return false;
				}
				state.bookingDateGreater = false;
			};
state.applicationReset = function() {

				var responsePromise = request
					.get('applicationReset/'
						+ params.applicantId);
				responsePromise.success(function(data, status, headers,
					config) {
					alert("Application Reseted!!");
					navigation.location.href = '#dticLandAllotment';
					loading.finish('sample-1');
				});

			};
state.loadApplicationList = function() {
				loading.start('sample-1');

				fetchApplicationList();
			};
state.loadApplicantDetails = function() {
				loading.start('sample-1');
				
				var responsePromise = request
					.get('fetchApplicantDetails/'
						+ params.applicantId);
				responsePromise.success(function(data, status, headers, config) {
					state.historyList = data;
					loading.finish('sample-1');
				});

				
				
			};
state.mergeApp = function() {
				var landArea = 0;
				

				for (var i = 0; i < state.historyList.length; i++) {
					if (state.historyList[i].selected) {
						alert(state.historyList[i].vacantLandBean[i].districtId);
						
						
						landArea += parseInt(state.historyList[i].totalPresentAndSubsequentArea, 10);
					}

				}



			};
state.checkFileSize = function(files) {
				if (files && files.length > 0) {
					const file = files[0];
					const maxSizeInBytes = 2 * 1024 * 1024; 

					if (file.size > maxSizeInBytes) {
						alert("File size exceeds 2MB. Please upload a smaller PDF.");
						
						dom(document.querySelector('input[type="file"]')).val(null);
						state.formData.document = null;
						state.$apply(); 
					} else if (file.type !== 'application/pdf') {
						alert("Only PDF files are allowed.");
						dom(document.querySelector('input[type="file"]')).val(null);
						state.formData.document = null;
						state.$apply();
					}
				}
			};
state.addVacantLandDetailFunction = function(isValid,
				mapImage, mapFile) {

				
				if (!isValid || state.maxSizeError || state.fileExtentionError) {
					return false;
				}
				var fd = new FormData();

				if (mapImage) {
					fd.append('mapImage', mapImage);
				}
				if (mapFile) {
					fd.append('mapFile', mapFile); 
				}

				if (params.vacantLandId) {

					fd
						.append('vacantLandId',
							params.vacantLandId);
				}

				var bookingStartDate;
				var bookingEndDate;
				if (state.vacantLandData.bookingStartDate) {
					var arr = state.vacantLandData.bookingStartDate
						.split('/');
					var timeArr = (arr[2].split(' '))[1].split(':');
					bookingStartDate = new Date((arr[2].split(' '))[0],
						arr[1] - 1, arr[0], timeArr[0]);
					
				}
				if (state.vacantLandData.bookingEndDate) {
					var arr = state.vacantLandData.bookingEndDate
						.split('/');
					var timeArr = (arr[2].split(' '))[1].split(':');
					bookingEndDate = new Date((arr[2].split(' '))[0],
						arr[1] - 1, arr[0], timeArr[0]);
					

					if (bookingStartDate >= bookingEndDate) {
						state.bookingDateGreater = true;
						alert("Booking End Date cannot be before the Booking Start Date!");
						return false;
					}
				}

				fd.append('collectorRateId',
					state.vacantLandData.collectorRateId)
				fd.append('locationId',
					state.vacantLandData.locationId);
				fd.append('districtId',
					state.vacantLandData.districtId);
				fd.append('dticId', state.vacantLandData.dticId)
				fd.append('tehsilId', state.vacantLandData.tehsilId);
				fd.append('purposeId', state.vacantLandData.purposeId);
				fd.append('plotNumber',
					state.vacantLandData.plotNumber);
				
				fd.append('totalPlotArea',
					state.vacantLandData.totalPlotArea);
				fd.append('premiumCharges',
					state.vacantLandData.premiumCharges);
				fd.append('developmentCharges',
					state.vacantLandData.developmentCharges);
				fd.append('maintenanceCharges',
					state.vacantLandData.maintenanceCharges);
				fd.append('leaseRent', state.vacantLandData.leaseRent);
				fd.append('advanceRent', state.vacantLandData.advanceRent);

				fd.append('otherRentCharges', state.vacantLandData.otherRentCharges || 0);

				fd.append('securityDeposit', state.vacantLandData.securityDeposit);
				fd.append('totalAmount',
					state.vacantLandData.totalAmount);
				fd.append('bookingStartDate',
					state.vacantLandData.bookingStartDate);
				fd.append('bookingEndDate',
					state.vacantLandData.bookingEndDate);
				
				fd.append('newArea', state.vacantLandData.newArea);

				
				fd.append('googleMap', state.vacantLandData.googleMap);
				fd.append('plotShed', state.vacantLandData.plotShed);
				fd.append('category', state.vacantLandData.category);
				fd.append('industrialCategory', state.vacantLandData.categoryOfIndustryId);
				fd.append('otherRentChargesReason', state.vacantLandData.otherRentChargeReson);
				loading.start('sample-1');

				var responsePromise = request.post('addVacantlandDetail',
					fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject = data;

						later(
							function() {
								state.responseObject.errorMessage = null;
							}, 5000);

						if (state.responseObject.successMessage != null) {

							navigation.location.href = '#dticLandAllotment';
						}

						loading.finish('sample-1');
					});

			};
state.initKml = function() {
				if (state.vacantLandData.wdtKmlFile) {
					
					state.vacantLandData.kmlUpload = true;

					
					state.processKmlFile();
				}
			};
state.editVacantLandDetailFunction = function(isValid,
				mapImage, mapFile) {

				
				if (!isValid || state.maxSizeError || state.fileExtentionError) {
					return false;
				}
				var fd = new FormData();


				
				var vacantlandId = params.vacantLandId;


				if (mapImage) {
					fd.append('mapImage', mapImage);
				}

				if (mapFile) {
					fd.append('mapFile', mapFile); 
				}

				fd.append('vacantLandId', vacantlandId);


				var bookingStartDate;
				var bookingEndDate;
				if (state.vacantLandData.bookingStartDate) {
					var arr = state.vacantLandData.bookingStartDate
						.split('/');
					var timeArr = (arr[2].split(' '))[1].split(':');
					bookingStartDate = new Date((arr[2].split(' '))[0],
						arr[1] - 1, arr[0], timeArr[0]);
					
				}
				if (state.vacantLandData.bookingEndDate) {
					var arr = state.vacantLandData.bookingEndDate
						.split('/');
					var timeArr = (arr[2].split(' '))[1].split(':');
					bookingEndDate = new Date((arr[2].split(' '))[0],
						arr[1] - 1, arr[0], timeArr[0]);
					

					if (bookingStartDate >= bookingEndDate) {
						state.bookingDateGreater = true;
						return false;
					}
				}

				fd.append('collectorRateId',
					state.vacantLandData.collectorRateId)
				fd.append('locationId',
					state.vacantLandData.locationId);
				fd.append('districtId',
					state.vacantLandData.districtId);
				fd.append('dticId', state.vacantLandData.dticId)
				fd.append('tehsilId', state.vacantLandData.tehsilId);
				fd.append('purposeId', state.vacantLandData.purposeId);
				fd.append('plotNumber',
					state.vacantLandData.plotNumber);
				
				fd.append('totalPlotArea',
					state.vacantLandData.totalPlotArea);
				fd.append('premiumCharges',
					state.vacantLandData.premiumCharges);
				fd.append('developmentCharges',
					state.vacantLandData.developmentCharges);
				fd.append('maintenanceCharges',
					state.vacantLandData.maintenanceCharges);
				fd.append('leaseRent', state.vacantLandData.leaseRent);
				fd.append('advanceRent', state.vacantLandData.advanceRent);

				fd.append('otherRentCharges', state.vacantLandData.otherRentCharges || 0);
				fd.append('otherRentChargesReason', state.vacantLandData.otherRentChargeReson);

				fd.append('securityDeposit', state.vacantLandData.securityDeposit);
				fd.append('totalAmount',
					state.vacantLandData.totalAmount);
				fd.append('bookingStartDate',
					state.vacantLandData.bookingStartDate);
				fd.append('bookingEndDate',
					state.vacantLandData.bookingEndDate);

				

				fd.append('newArea', state.vacantLandData.newArea);

				fd.append('googleMap', state.vacantLandData.googleMap);
				fd.append('plotShed', state.vacantLandData.plotShed);
				fd.append('category', state.vacantLandData.category);
				fd.append('industrialCategory', state.vacantLandData.categoryOfIndustryId);

				loading.start('sample-1');

				var responsePromise = request.post('addVacantlandDetail',
					fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject = data;

						later(
							function() {
								state.responseObject.errorMessage = null;
							}, 5000);

						if (state.responseObject.successMessage != null) {

							navigation.location.href = '#dticLandAllotment';

						}

						loading.finish('sample-1');
					});

			};
state.loadLandAllotmentDetailList = function() {
				loading.start('sample-1');
				fetchLandAllotmentList();
			};
state.searchLandDatabyAreaFilters = function() {

				loading.start('sample-1');
				reDraw();

			};
state.loadLandAllotmentDetailListForGroupLOI = function() {
				loading.start('sample-1');

				alert(params.applicantId);
				fetchLandAllotmentListForGroupLOI(params.applicantId);
			};
state.loadLandAllotments = function() {
				var responsePromise = request.get('fetchLandAllotmentListForGroupLOI?applicationId=' + params.applicantId);

				loading.start('sample-1');
				responsePromise.success(function(data, status, headers, config) {

					state.landAllotments = data; 
					loading.finish('sample-1');
				});
			};
state.updateTotals = function() {
				let totalPremium = 0.00;
				let totalAmount = 0.00;
				let totalPlotArea = 0.00;
				let totalLease = 0.00;
				let totalSecurity = 0.00;
				let totalDevelopment = 0.00;
				let totaladditionalPremium = 0.00;
				let totalplotNumber = "";
				let totalotherCharges = 0.00;
				let totalgroupLoiAdvancePremium = 0.00;
				let totalmaintenanceCharges = 0.00;
				let totalapplicantIds = "";

				state.landAllotments.forEach(function(item) {
					if (item.selected) {
						totalPremium += parseFloat(item.premiumCharges) || 0;
						totalAmount += parseFloat(item.totalAmount) || 0;
						totalPlotArea += parseFloat(item.totalPlotArea) || 0;
						totalLease += parseFloat(item.leaseRent) || 0; 
						totalSecurity += parseFloat(item.securityDeposit) || 0; 
						totalDevelopment += parseFloat(item.developmentCharges) || 0;
						totaladditionalPremium += parseFloat(item.advanceRent) || 0;
						totalotherCharges += parseFloat(item.otherRentCharges) || 0; 
						totalgroupLoiAdvancePremium += parseFloat(item.advancePremiumH1) || 0; 
						totalmaintenanceCharges += parseFloat(item.maintenanceCharges) || 0; 
						if (item.plotNumber) {
							if (totalplotNumber !== "") {
								totalplotNumber += ", ";
							}
							totalplotNumber += item.plotNumber.toString();
						}
						if (item.groupLoiApplicantIds) {
							if (totalapplicantIds !== "") {
								totalapplicantIds += "#";
							}
							totalapplicantIds += item.groupLoiApplicantIds.toString();
						}

					}
				});

				state.formData.totalPremium = totalPremium.toFixed(2);
				state.formData.totalAmount = totalAmount.toFixed(2);
				state.formData.totalPlotArea = totalPlotArea.toFixed(2);
				state.formData.totalLease = totalLease.toFixed(2);
				state.formData.totalSecurity = totalSecurity.toFixed(2);
				state.formData.totalDevelopment = totalDevelopment.toFixed(2);
				state.formData.totaladditionalPremium = totaladditionalPremium.toFixed(2);
				state.formData.totalotherCharges = totalotherCharges.toFixed(2);
				state.formData.totalgroupLoiAdvancePremium = totalgroupLoiAdvancePremium.toFixed(2);
				state.formData.totalmaintenanceCharges = totalmaintenanceCharges.toFixed(2);
				state.formData.totalplotNumber = totalplotNumber;
				state.formData.totalapplicantIds = totalapplicantIds;
			};
state.submitSelectedAllotments = function() {
				let selectedApplicants = [];
				params.applicantId;

				state.landAllotments.forEach(function(item) {
					if (item.selected) {
						selectedApplicants.push({
							checkId: true,
							statusId: item.statusId || 0,
							vacantLandId: item.vacantLandId, 
							groupLoiPrimaryVacantLand: item.groupLoiPrimaryVacantLand
						});
					}
				});

				if (selectedApplicants.length === 0) {
					alert("Please select at least one plot to proceed.");
					return;
				}

				
				if (!(state.formData.eoiAmount && /^\d+(\.\d{1,2})?$/.test(state.formData.eoiAmount))) {
					alert("Please enter a valid EOI amount.");
					return;
				}

				let requestPayload = {
					status: "GroupLoi",
					idPendingApplicants: selectedApplicants,
					totalPremiumCharges: state.formData.totalPremium,
					totalAmount: state.formData.totalAmount,
					totalPlotArea: state.formData.totalPlotArea,
					applicantId: params.applicantId,
					eoiAmount: state.formData.eoiAmount,
					totalLease: state.formData.totalLease,
					totalSecurity: state.formData.totalSecurity,
					totalDevelopment: state.formData.totalDevelopment,
					totaladditionalPremium: state.formData.totaladditionalPremium,
					totalotherCharges: state.formData.totalotherCharges,
					nonPrimaryPlotName: state.formData.totalplotNumber,
					totalgroupLoiAdvancePremium: state.formData.totalgroupLoiAdvancePremium,
					totalmaintenanceCharges: state.formData.totalmaintenanceCharges,
					plotName: state.formData.totalapplicantIds


				};
				loading.start('sample-1');
				request.post("id/saveGroupLoiDetails", requestPayload)
					.then(function(response) {
						alert("Submitted successfully!");
						console.log("Server Response:", response.data);
						navigation.location.href = '#dticLandAllotment';
					}, function(error) {
						alert("Error while submitting data.");
						console.error("Submission failed", error);
					});
			};
state.calculateLeaseRent = function() {
				var eoiAmount = parseFloat(state.formData.eoiAmount);
				if (!isNaN(eoiAmount)) {
					state.formData.totalLease = (eoiAmount * 0.02).toFixed(2);
					state.formData.totalSecurity = (state.formData.totalLease * 3).toFixed(2);
					state.formData.totalAmount = (
						(parseFloat(state.formData.totalLease) || 0) +
						(parseFloat(state.formData.totalSecurity) || 0) +
						(parseFloat(state.formData.totalmaintenanceCharges) || 0) +
						(parseFloat(state.formData.totalDevelopment) || 0) +
						(parseFloat(state.formData.totalotherCharges) || 0) +
						(parseFloat(state.formData.eoiAmount) || 0) +
						(parseFloat(state.formData.totaladditionalPremium) || 0) -
						(parseFloat(state.formData.totalgroupLoiAdvancePremium) || 0)).toFixed(2);

					;
				} else {
					state.formData.totalLease = '';
				}
			};
state.getLatLngFrommap = function(templat, templong) {
				
				
				request.post('getLatLng/' + templat + '/' + templong)
					.then(function(response) {
						let responseData = response.data;
						
						state.pointData = response.data;







						
						
						state.khasra_number = responseData.AttributeList[0].khasra_number;
						state.workCreationData.khasraNo = state.khasra_number;
						var khasraGeom = JSON.parse(responseData.AttributeList[0].khasra_geom);
						var coordinates = khasraGeom.geometry.coordinates[0][0];
						state.lat = coordinates[0][1];
						state.lon = coordinates[0][0];
						
						state.workCreationData.latitude = state.lat + "";
						state.workCreationData.longitude = state.lon + "";
						if (geojsonLayer != null) {
							map.removeLayer(geojsonLayer);
							geojsonLayer = null;
						}
						geojsonLayer = L.geoJson(JSON.parse(responseData.AttributeList[0].khasra_geom), {
							style: { color: "#FFFF00", weight: 3, fillColor: "#FFFF00", fillOpacity: 0.1 },
						})
						geojsonLayer.addTo(map);
						map.fitBounds(geojsonLayer.getBounds());
						return responseData;
					})
					.catch(function(error) {
						console.log("Error:", error);
					});
			};
state.processKmlFile = async function() {

				if (!state.vacantLandData.wdtKmlFile) {
					alert("Please select a KML file.");
					return;
				}

				if (state.vacantLandData.wdtKmlFile.size >= 1048576) {
					alert("File size should not exceed 1 MB.");
					return;
				}

				var file = state.vacantLandData.wdtKmlFile;
				var fileName = file.name;
				var fileExtension = fileName.split('.').pop().toLowerCase();

				if (fileExtension !== 'kml') {
					alert("Only .kml files are allowed.");
					return;
				}

				var formData = new FormData();
				formData.append('KmlFile', file);

				loading.start('sample-1');

				try {
					const response = await request.post('processKmlFile', formData, {
						transformRequest: identity,
						headers: { 'Content-Type': undefined }
					});

					state.responseObject = response.data;

					
					let polygonCoords = [];
					for (let i = 0; i < response.data.length; i++) {
						const lat = response.data[i].lattitude;
						const lon = response.data[i].longitude;
						polygonCoords.push([lat, lon]);

						
						try {

						} catch (innerErr) {
							console.error("Error calling getLatLng for:", lat, lon, innerErr);
						}
					}

					
					state.setMapPolygon(polygonCoords);

				} catch (err) {
					console.error("Error uploading/processKmlFile:", err);
					alert("Error processing KML file.");
					window.location.reload();

				}

				loading.finish('sample-1');
			};
state.submitGroupLOIForm = function() {
				console.log("Form submitted with:");

				
			};
state.loadIdPendingApplicantList = function() {
				loading.start('sample-1');

				var vacantlandId = document.getElementById('vId').value.trim();
				var v = document.getElementById('vcId').value.trim();
				console.log(vacantlandId);
				state.vacantLandId = vacantlandId;
				state.vacantLandId = vacantlandId;

				
				

				var responsePromise = request
					.get('loadIdPendingApplicants/'
						+ state.vacantLandId);
				responsePromise.success(function(data, status, headers,
					config) {
					state.idPendingApplicantList = data;

					loading.finish('sample-1');
				});
				var responsePromise = request
					.get('fetchvacantlanddetail/'
						+ state.vacantLandId);
				responsePromise
					.success(function(data, status, headers,
						config) {

						state.vacantLandData = data;

						state.vacantLandData.industrialAreaId = data.industrialAreaId + "";


						loading.finish('sample-10');
					});

			};
state.loadIdPendingApplicantList1 = function() {

				if (!state.formData) {
					state.formData = {};
				}
				state.formData.plotDetails = state.vacantLandData.plotNumber;
				state.formData.industrialArea = state.vacantLandData.industrialAreaName;
				state.formData.vacantLandId = state.vacantLandData.vacantLandId;
			};
state.updateGroupLOI1 = function(action1) {
				var countCheck = 0;
			};
state.updateGroupLOI = function(action) {

				request.get('getMessage/common.confirmToSave').then(function(response) {
					if (confirm(response.data.value)) {
						var countCheck = 0;
						var countTender = 0;
						var committeeDecision = 0;

						for (var i = 0; i < state.idPendingApplicantList.length; i++) {
							if (state.idPendingApplicantList[i].checkId) {
								countCheck++;
								if (state.idPendingApplicantList[i].statusId == 38 || state.idPendingApplicantList[i].statusId == 37) {
									committeeDecision++;
								}
							}
						}

						if (action == 'committeeDecision' && countTender > 0) {
							request.get('getMessage/dtic.id.applicationCommitteeDecision').then(function(response) {
								alert(response.data.value);
							});
						} else {
							
							var formDataToSend = new FormData();
							formDataToSend.append("status", action);
							formDataToSend.append("statusId", state.formData.decision);
							formDataToSend.append("committeeRemarks", state.formData.remarks || "");
							
							formDataToSend.append("createdDate", state.formatDateToDDMMYYYY(state.formData.decisionDate));

							if (state.formData.document) {
								formDataToSend.append("committeeDecisionFile", state.formData.document);
							}

							
							formDataToSend.append("idPendingApplicants", JSON.stringify(state.idPendingApplicantList));

							loading.start('sample-1');

							request.post('id/updateCommitteeStatus', formDataToSend, {
								transformRequest: identity,
								headers: { 'Content-Type': undefined }
							}).then(function(response) {
								state.responseObject = response.data;
								state.loadIdPendingApplicantList();

								if (state.responseObject.successMessage) {
									later(() => {
										state.responseObject.successMessage = null;
									}, 3000);
								} else if (state.responseObject.errorMessage) {
									later(() => {
										state.responseObject.errorMessage = null;
									}, 3000);
								}
								navigation.location.href = '#id/viewAppliedApplicants/'
									+ params.vacantLandId;
								loading.finish('sample-1');
							}, function(error) {
								console.error("Error submitting data:", error);
								alert("Error submitting committee decision.");
								loading.finish('sample-1');
							});
						}
					}
				});
			};
state.updateCommitteeByStatus = function(action) {
				if (
					!state.formData ||
					action == null ||
					state.formData.decision == null ||
					state.formData.decisionDate == null ||
					state.formData.document == null ||
					state.formData.remarks == null
				) {
					alert("Please fill all required fields and upload the required document.");
					return;
				}
				request.get('getMessage/common.confirmToSave').then(function(response) {
					if (confirm(response.data.value)) {
						var countCheck = 0;
						var countTender = 0;
						var committeeDecision = 0;

						for (var i = 0; i < state.idPendingApplicantList.length; i++) {
							if (state.idPendingApplicantList[i].checkId) {
								countCheck++;
								if (state.idPendingApplicantList[i].statusId == 38 || state.idPendingApplicantList[i].statusId == 37) {
									committeeDecision++;
								}
							}
						}

						if (action == 'committeeDecision' && countTender > 0) {
							request.get('getMessage/dtic.id.applicationCommitteeDecision').then(function(response) {
								alert(response.data.value);
							});
						} else {
							
							var formDataToSend = new FormData();
							formDataToSend.append("status", action);
							formDataToSend.append("statusId", state.formData.decision);
							formDataToSend.append("committeeRemarks", state.formData.remarks || "");
							formDataToSend.append("createdDate", state.formatDateToDDMMYYYY(state.formData.decisionDate));

							if (state.formData.document) {
								formDataToSend.append("committeeDecisionFile", state.formData.document);
							}

							
							formDataToSend.append("idPendingApplicants", JSON.stringify(state.idPendingApplicantList));

							loading.start('sample-1');

							request.post('id/updateCommitteeStatus', formDataToSend, {
								transformRequest: identity,
								headers: { 'Content-Type': undefined }
							}).then(function(response) {
								state.responseObject = response.data;
								state.loadIdPendingApplicantList();

								if (state.responseObject.successMessage) {
									later(() => {
										state.responseObject.successMessage = null;
									}, 3000);
								} else if (state.responseObject.errorMessage) {
									later(() => {
										state.responseObject.errorMessage = null;
									}, 3000);
								}
								navigation.location.href = '#id/viewAppliedApplicants/'
									+ params.vacantLandId;
								loading.finish('sample-1');
							}, function(error) {
								console.error("Error submitting data:", error);
								alert("Error submitting committee decision.");
								loading.finish('sample-1');
							});
						}
					}
				});
			};
state.formatDateToDDMMYYYY = function(date) {
				if (!date) return '';
				var d = new Date(date);
				var day = ('0' + d.getDate()).slice(-2);
				var month = ('0' + (d.getMonth() + 1)).slice(-2);
				var year = d.getFullYear();
				return day + '/' + month + '/' + year;
			};
state.onPublicationDateChange = function() {
				validateDates();
			};
state.onBidStartDateChange = function() {
				validateDates();
			};
state.onBidEndDateChange = function() {
				validateDates();
			};
state.submitTenderForm = function(form) {
				validateDates();
				if (form.$valid && !state.bidStartBeforePublication && !state.bidEndBeforeStart) {
					var fd = new FormData();
					fd.append("tenderId", state.formData.tenderId || '');
					fd.append("nitNumber", state.formData.nitNumber || '');
					fd.append("plotDetails", state.formData.plotDetails || '');
					fd.append("industrialArea", state.formData.industrialArea || '');
					fd.append("publicationDate", state.formatDateToDDMMYYYY(state.formData.publicationDate));
					fd.append("bidStartDate", state.formatDateToDDMMYYYY(state.formData.bidStartDate));
					fd.append("bidEndDate", state.formatDateToDDMMYYYY(state.formData.bidEndDate));
					fd.append("vacantLandId", state.formData.vacantLandId);
					loading.start('sample-1');

					request.post('SavetenderInfo', fd, {
						transformRequest: identity,
						headers: { 'Content-Type': undefined }
					}).then(function(response) {
						state.responseObject = response.data;

						navigation.location.href = '#id/viewAppliedApplicants/'
							+ params.vacantLandId;
						loading.finish('sample-1');
					}, function(error) {
						console.error("API Error:", error);
						loading.finish('sample-1');
					});
				} else {
					alert("Please fill in all required fields.");
				}
			};
state.updateApplicantByStatus = function(action) {
				state.idApplicantBean = {};

				request
					.get('getMessage/common.confirmToSave')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								var countCheck = 0;
								var countApproved = 0;
								var countRejected = 0;
								var countPossession = 0;
								var countTender = 0;
								var groupLOIApplicantId = 0;
								var h1ApplicantId = 0;

								for (var i = 0; i < state.idPendingApplicantList.length; i++) {
									if (state.idPendingApplicantList[i].checkId) {
										countCheck++;
										if (state.idPendingApplicantList[i].statusId > 2
											&& state.idPendingApplicantList[i].statusId < 13) {
											countApproved++;
										}
										if (state.idPendingApplicantList[i].statusId == 13) {
											countRejected++;
										}
										if (state.idPendingApplicantList[i].statusId == 11) {
											countPossession++;
										}
										if (state.idPendingApplicantList[i].statusId == 37) {
											countTender++;
										}
										if (state.idPendingApplicantList[i].statusId == 2) {
											groupLOIApplicantId = state.idPendingApplicantList[i].applicantId;
										}
										
										if (state.idPendingApplicantList[i].statusId == 41) {
											h1ApplicantId = state.idPendingApplicantList[i].applicantId;

										}
									}
								}

								if ((action == 'approve'
									&& countCheck > 1) ) {
										
										
									
									request
										.get(
											'getMessage/dtic.id.multipleApplication')
										.then(
											function(
												response) {
												alert(response.data.value);
											});
								} else if (action == 'approve'
									&& countApproved > 0) {
									
									request
										.get(
											'getMessage/dtic.id.applicationApproved')
										.then(
											function(
												response) {
												alert(response.data.value);
											});
								} else if (action == 'approve'
									&& countRejected > 0) {
									
									request
										.get(
											'getMessage/dtic.id.applicationApproveRejected')
										.then(
											function(
												response) {
												alert(response.data.value);
											});
								} else if (action == 'reject'
									&& countPossession > 0) {
									
									request
										.get(
											'getMessage/dtic.id.applicationPossessionReject')
										.then(
											function(
												response) {
												alert(response.data.value);
											});
								}
								else if (action == 'InitiateTender'
									&& countTender > 0) {
									
									request
										.get(
											'getMessage/dtic.id.applicationInitiateTender')
										.then(
											function(
												response) {
												alert(response.data.value);
											});
								} else if (action == 'GroupLOI'
								) {
									navigation.location.href = '#openGroupLOI/' + groupLOIApplicantId;
								}
								else if (action == 'committeeDecision'
									&& countTender > 0) {

									request
										.get(
											'getMessage/dtic.id.applicationCommitteeDecision')
										.then(
											function(
												response) {
												alert(response.data.value);
											});

								}
								else if (action == 'h1Detail') {


									state.loadLOIPageH1(h1ApplicantId);

								}
								else {
									state.idApplicantBean.idPendingApplicants = state.idPendingApplicantList;
									state.idApplicantBean.status = action;
									
									for (var i = 0; i < state.idPendingApplicantList.length; i++) {
										if (state.idPendingApplicantList[i].checkId) {

											if (action == 'reject' && (state.idPendingApplicantList[i].checkId) && (state.idPendingApplicantList[i].comments == null || state.idPendingApplicantList[i].comments == '')) {
												alert("Please enter Remarks for Application no. " + state.idPendingApplicantList[i].applicationId)
												return false;
											};
										}
									}

									loading.start('sample-1');
									var responsePromise = request
										.post(
											'id/updateApplicantByStatus',
											state.idApplicantBean);
									responsePromise
										.success(function(
											data,
											status,
											headers,
											config) {
											state.responseObject = data;
											state
												.loadIdPendingApplicantList();
											if (state.responseObject.successMessage != null) {
												later(
													function() {
														state.responseObject.successMessage = null;
													},
													3000);
											} else if (state.responseObject.errorMessage != null) {
												later(
													function() {
														state.responseObject.errorMessage = null;
													},
													3000);
											}
											navigation.location.href = '#id/viewAppliedApplicants/'
												+ params.vacantLandId;
											loading
												.finish('sample-1');
										});

								}
							}
						});
			};
state.loadHistory = function() {

				loading.start('sample-1');
				var responsePromise = request.get('id/fetchHistory', {
					params: {
						'applicantId': params.applicantId
					}
				});

				state.applicantId = params.applicantId;
				state.vacantLandId = params.vacantLandId;

				responsePromise.success(function(data, status, headers,
					config) {
					state.idRequestProcessBeanList = data;
					state.dticBack = true;
					loading.finish('sample-1');

				});
			};
state.dateWiseApplicationReport = function() {

				

			};
state.generateLOILetter = function() {
				
				
				loading.start('sample-1');
				dom("#loader").show();
				
				var applicantId = params.applicantId;

				request.get('generateLOILetter1/' + applicantId)
					.then(function(response) {
						var data = response.data;
						if (data != null) {
							state.idApplicantBean = data;
							state.applicantId = state.idApplicantBean.applicationId; 
							state.ish1VacantLand = (state.idApplicantBean.vacantLandBean.ish1VacantLand);
							state.groupLoi = (state.idApplicantBean.vacantLandBean.groupLoi);
						} else {
							alert("No data found for the given applicant ID.");
						}

					})
					.catch(function(error) {
						console.error("Error while loading allotment letter data:", error);
						alert("Failed to load data. Please try again.");

					}).finally(function() {
						loading.finish('sample-1');
					});
			};
state.eSignAppDetailFormPossession = function(isValid) {

				if (!isValid)
					return false;
				if (confirm("Are you sure you want to eSign the Application Form?")) {

					loading.start('sample-1');
					state.eSignBean = {};
					state.eSignBean.aadhaarLast4Digits = state.aadhaarLast4Digits;
					state.eSignBean.remark = state.remark;
					state.eSignBean.type = 'APPLICANT_APPLICATION_POSSESSION';
					state.eSignBean.primaryId = params.applicantId;
					state.eSignBean.unsignedBase64 = dom('.esignHtml').html();
					state.eSignBean.applicantNumber = state.applicantId;
					state.eSignBean.title = "Possession Provider";
					var responsePromise = request.post('eSignaturePossession', state.eSignBean);


					responsePromise.success(function(data, status, headers, config) {
						if (data.successMessage != null) {
							dom('#msg').val(data.eHastaksharHiddenInputTAG);
							dom("#ICGForm").attr("action", data.aspUrl);
							dom('#ICGForm').submit();
						}
						loading.finish('sample-1');
					});
					responsePromise.error(function() {
						loading.finish('sample-1');
					});
				}
			};
state.eSignAppDetailFormAO = function(isValid) {
				if (!isValid)
					return false;
				if (confirm("Are you sure you want to eSign the Application Form?")) {

					loading.start('sample-1');
					state.eSignBean = {};
					state.eSignBean.aadhaarLast4Digits = state.aadhaarLast4Digits;
					state.eSignBean.remark = state.remark;
					state.eSignBean.type = 'APPLICATION_AO';
					state.eSignBean.primaryId = params.applicantId;
					state.eSignBean.unsignedBase64 = dom('.esignHtml').html();
					state.eSignBean.applicantNumber = state.applicantId;
					state.eSignBean.title = "Digital Signature";
					var responsePromise = request.post('eSignatureAO', state.eSignBean);


					responsePromise.success(function(data, status, headers, config) {
						if (data.successMessage != null) {
							dom('#msg').val(data.eHastaksharHiddenInputTAG);
							dom("#ICGForm").attr("action", data.aspUrl);
							dom('#ICGForm').submit();
						}
						loading.finish('sample-1');
					});
					responsePromise.error(function() {
						loading.finish('sample-1');
					});
				}
			};
state.openGroupLOI = function(applicant) {
				
				if (!applicant || !applicant.applicantId) {
					alert("Applicant ID is missing!");
					return;
				}

				if (confirm("Do you want to view the Group LOI?")) {
					loading.start('sample-1'); 

					
					responsePromise.success(function(data) {
						if (data && data.redirectUrl) {
							
						} else {
							
							
						}
						loading.finish('sample-1');
					});

					responsePromise.error(function() {
						alert("Unable to fetch Group LOI details.");
						loading.finish('sample-1');
					});
				}
			};
state.eSignAppDetailForm = function(isValid) {

				if (!isValid)
					return false;
				if (confirm("Are you sure you want to eSign the Application Form?")) {

					loading.start('sample-1');
					state.eSignBean = {};
					state.eSignBean.aadhaarLast4Digits = state.aadhaarLast4Digits;
					state.eSignBean.remark = state.remark;
					state.eSignBean.type = 'APPLICATION_LOI';
					state.eSignBean.primaryId = params.applicantId;
					state.eSignBean.unsignedBase64 = dom('.esignHtml').html();
					state.eSignBean.applicantNumber = state.applicantId;
					state.eSignBean.title = "Digital Signature";
					var responsePromise = request.post('eSignatureLOI', state.eSignBean);


					responsePromise.success(function(data, status, headers, config) {
						if (data.successMessage != null) {
							dom('#msg').val(data.eHastaksharHiddenInputTAG);
							dom("#ICGForm").attr("action", data.aspUrl);
							dom('#ICGForm').submit();
						}
						loading.finish('sample-1');
					});
					responsePromise.error(function() {
						loading.finish('sample-1');
					});
				}
			};
state.digitalSign = function() {
				if (confirm("Are you sure you want to digitally sign the Application Form?")) {

					loading.start('sample-1');

					state.eSignBean = {
						aadhaarLast4Digits: state.aadhaarLast4Digits,
						remark: state.remark,
						type: 'APPLICATION_LOI',
						primaryId: params.applicantId,
						unsignedBase64: dom('.esignHtml').html(),
						applicantNumber: state.applicantId,
						title: "Digital Signature"
					};

					var responsePromise = request.post('generateLOIPDF', state.eSignBean);

					responsePromise.success(function(data, status, headers, config) {
						if (data.successMessage != null) {
							state.base64Response = data;
							state.digitalSignPDFFile(params.applicantId, state.eSignBean.type);
						}
						loading.finish('sample-1');
					});

					responsePromise.error(function() {
						loading.finish('sample-1');
					});
				}
			};
state.digitalSignPDFFile = function(billId, type) {
				var url = 'http://localhost:8060/jsonsigner/Sign';

				var data = {
					ServerDateTime: state.base64Response.serverDateTime,
					DocumentType: 'PDF',
					Data: state.base64Response.eHastaksharHiddenInputTAG,
					SignatureName: state.base64Response.signatureName,
					Reason: state.base64Response.reason,
					Location: state.base64Response.location
				};

				request.post(url, data).then(function(response) {
					if (response && response.data && response.data.SignedData) {

						state.base64Response = {
							id: billId,
							value: response.data.SignedData || '',
							signedBase64PDF: response.data.SignedData || '',
							billId: billId.toString(),
							reason: "LOI Signing",
							serverDateTime: state.base64Response.serverDateTime || '',
							signatureName: state.base64Response.signatureName || 'Authorized Signatory',
							type: type || 'APPLICATION_LOI',
							errorMessage: null,
							successMessage: 'success',
							errorMsgList: null,
							sarthakFacilityId: null,
							responseCode: null,
							responseMessage: null,
							sarthakSupplierId: null,
							action: null,
							transactionId: state.base64Response.transactionId || null
						};

						loading.start('sample-1');

						var responsePromise = request.post('signPDFLoi', state.base64Response);

						responsePromise.success(function(data) {
							state.responseObject = data;
							alert("Digital Signature Successfully");
							window.location.reload();
							loading.finish('sample-1');
						});

						responsePromise.error(function() {
							state.responseObject = {
								errorMessage: "Some error occurred while saving the data"
							};
							later(function() {
								state.responseObject.errorMessage = null;
							}, 10000);
							loading.finish('sample-1');
						});

					} else {
						alert("Invalid response from DSC Signer. Please check your DSC setup.");
						loading.finish('sample-1');
					}
				}).catch(function(errResponse) {
					if (errResponse.status === -1) {
						alert("Could not connect to DSC Signer. Please ensure it is running.");
					} else {
						alert("DSC Signing failed: " + errResponse.statusText);
					}
					loading.finish('sample-1');
				});
			};
state.digitalSignAo = function() {
				if (confirm("Are you sure you want to digitally sign the Application Form?")) {

					loading.start('sample-1');

					state.eSignBean = {
						aadhaarLast4Digits: state.aadhaarLast4Digits,
						remark: state.remark,
						type: 'APPLICATION_AO',
						primaryId: params.applicantId,
						unsignedBase64: dom('.esignHtml').html(),
						applicantNumber: state.applicantId,
						title: "Digital Signature"
					};

					var responsePromise = request.post('generateLOIPDF', state.eSignBean);

					responsePromise.success(function(data, status, headers, config) {
						if (data.successMessage != null) {
							state.base64Response = data;
							state.digitalSignAoPDFFile(params.applicantId, state.eSignBean.type);
						}
						loading.finish('sample-1');
					});

					responsePromise.error(function() {
						loading.finish('sample-1');
					});
				}
			};
state.digitalSignAoPDFFile = function(billId, type) {
				var url = 'http://localhost:8060/jsonsigner/Sign';

				var data = {
					ServerDateTime: state.base64Response.serverDateTime,
					DocumentType: 'PDF',
					Data: state.base64Response.eHastaksharHiddenInputTAG,
					SignatureName: state.base64Response.signatureName,
					Reason: state.base64Response.reason,
					Location: state.base64Response.location
				};

				request.post(url, data).then(function(response) {
					if (response && response.data && response.data.SignedData) {

						state.base64Response = {
							id: billId,
							value: response.data.SignedData || '',
							signedBase64PDF: response.data.SignedData || '',
							billId: billId.toString(),
							reason: "LOI Signing",
							serverDateTime: state.base64Response.serverDateTime || '',
							signatureName: state.base64Response.signatureName || 'Authorized Signatory',
							type: type || 'APPLICATION_AO',
							errorMessage: null,
							successMessage: 'success',
							errorMsgList: null,
							sarthakFacilityId: null,
							responseCode: null,
							responseMessage: null,
							sarthakSupplierId: null,
							action: null,
							transactionId: state.base64Response.transactionId || null
						};

						loading.start('sample-1');

						var responsePromise = request.post('signPDFAo', state.base64Response);

						responsePromise.success(function(data) {
							if (data.vcId) {
								navigation.location.href = '#id/viewAppliedApplicants/' + data.vcId;
							} else if (data.error) {
								alert("Error: " + data.error);
							}
							loading.finish('sample-1');
						});

						responsePromise.error(function() {
							state.responseObject = {
								errorMessage: "Some error occurred while saving the data"
							};
							later(function() {
								state.responseObject.errorMessage = null;
							}, 10000);
							loading.finish('sample-1');
						});

					} else {
						alert("Invalid response from DSC Signer. Please check your DSC setup.");
						loading.finish('sample-1');
					}
				}).catch(function(errResponse) {
					if (errResponse.status === -1) {
						alert("Could not connect to DSC Signer. Please ensure it is running.");
					} else {
						alert("DSC Signing failed: " + errResponse.statusText);
					}
					loading.finish('sample-1');
				});
			};
state.digitalSignDticPoss = function() {
				if (confirm("Are you sure you want to digitally sign the Application Form?")) {

					loading.start('sample-1');

					state.eSignBean = {
						aadhaarLast4Digits: state.aadhaarLast4Digits,
						remark: state.remark,
						type: 'APPLICANT_APPLICATION_POSSESSION',
						primaryId: params.applicantId,
						unsignedBase64: dom('.esignHtml').html(),
						applicantNumber: state.applicantId,
						title: "Possession Provider"
					};

					var responsePromise = request.post('generateLOIPDF1', state.eSignBean);

					responsePromise.success(function(data, status, headers, config) {
						if (data.successMessage != null) {
							state.base64Response = data;
							state.digitalSignPossPDFFile(params.applicantId, state.eSignBean.type);
						}
						loading.finish('sample-1');
					});

					responsePromise.error(function() {
						loading.finish('sample-1');
					});
				}
			};
state.digitalSignPossPDFFile = function(billId, type) {
				var url = 'http://localhost:8060/jsonsigner/Sign';

				
				
				
				
				
				
				
				
				var data = {
					ServerDateTime: state.base64Response.serverDateTime,
					DocumentType: 'PDF',
					Data: state.base64Response.eHastaksharHiddenInputTAG,
					SignatureName: state.base64Response.signatureName,
					Reason: state.base64Response.reason,
					Location: state.base64Response.location
				};

				request.post(url, data).then(function(response) {
					if (response && response.data && response.data.SignedData) {

						state.base64Response = {
							id: billId,
							value: response.data.SignedData || '',
							signedBase64PDF: response.data.SignedData || '',
							billId: billId.toString(),
							reason: "FINAL POSSESSION Signing",
							serverDateTime: state.base64Response.serverDateTime || '',
							signatureName: state.base64Response.signatureName || 'Authorized Signatory',
							type: type || 'APPLICANT_APPLICATION_POSSESSION',
							errorMessage: null,
							successMessage: 'success',
							errorMsgList: null,
							sarthakFacilityId: null,
							responseCode: null,
							responseMessage: null,
							sarthakSupplierId: null,
							action: null,
							transactionId: state.base64Response.transactionId || null
						};

						loading.start('sample-1');

						var responsePromise = request.post('signFinalPDFPossession', state.base64Response);

						responsePromise.success(function(data) {
							if (data.vcId) {
								window.location.reload();
								
							} else if (data.error) {
								alert("Error: " + data.error);
							}
							loading.finish('sample-1');
						});

						responsePromise.error(function() {
							state.responseObject = {
								errorMessage: "Some error occurred while saving the data"
							};
							later(function() {
								state.responseObject.errorMessage = null;
							}, 10000);
							loading.finish('sample-1');
						});

					} else {
						alert("Invalid response from DSC Signer. Please check your DSC setup.");
						loading.finish('sample-1');
					}
				}).catch(function(errResponse) {
					if (errResponse.status === -1) {
						alert("Could not connect to DSC Signer. Please ensure it is running.");
					} else {
						alert("DSC Signing failed: " + errResponse.statusText);
					}
					loading.finish('sample-1');
				});
			};
state.submitSignOption = function() {
				if (!state.signOption) {
					alert("Please select a signing method.");
					return;
				}

				if (state.signOption === 'eSign') {
					
					console.log("User selected e-Sign.");
					state.signOption = 'eSign';

				} else if (state.signOption === 'DSC') {
					
					console.log("User selected DSC.");
					state.signOption = 'DSC';
				}
			};
state.generateAllotmentLetter = function(isValid) {

				if (!isValid)
					return false;
				
				
				

				var responsePromise = request.post(
					'saveAllotmentLetterData',
					state.allotmentLetterDataList);

				responsePromise.success(function(data, status, headers,
					config) {

					state.responseObject = data;

					if (data.successMessage != null) {
						

						

						navigation.location.href = '#eSingAOLetter/' + params.applicantId;
					}


				});

			};
state.loadAllotmentLetterData = function() {
				state.vacantLandId = params.vacantLandId;

				loading.start('sample-1');
				request.get('fetchAllotmentLetterDetail/' + params.applicantId + '/')
					.then(function(response) {
						state.allotmentLetterDataList = response.data || [];
					})
					.finally(function() {
						loading.finish('sample-1');
					});
			};
state.uploadLOILetter = function(isValid, loiFile) {

				if (!isValid || !loiFile) {
					state.fileAbsent = true;
					return false;
				}

				var fd = new FormData();

				
			};
state.uploadAllotmentLetter = function(isValid,
				allotmentLetter) {

				if (!isValid || !allotmentLetter) {
					state.fileAbsent = true;
					return false;
				}

				var fd = new FormData();

				if (allotmentLetter) {
					fd.append('allotmentFile', allotmentLetter);
				}

				fd.append('applicantId', params.applicantId);

				loading.start('sample-1');
				var responsePromise = request.post(
					'uploadAllotmentLetter', fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject1 = data;

						
						if (state.responseObject1.successMessage != null) {
							later(
								function() {
									state.responseObject1.successMessage = null;
								}, 5000);
							navigation.location.href = '#id/viewAppliedApplicants/'
								+ params.vacantLandId;
						}

						loading.finish('sample-1');
					});

			};
state.generateLeaseLetter = function() {
				navigation.open('generateLeaseLetter/'
					+ params.applicantId);
			};
state.generatePossessionLetter = function() {
				
				
				
				loading.start('sample-1');
				
				var applicantId = params.applicantId;

				request.get('generateLOILetter1/' + applicantId)
					.then(function(response) {
						var data = response.data;
						if (data != null) {
							state.idApplicantBean = data;
							state.applicantId = state.idApplicantBean.applicationId; 
						} else {
							alert("No data found for the given applicant ID.");
						}

					})
					.catch(function(error) {
						console.error("Error while loading allotment letter data:", error);
						alert("Failed to load data. Please try again.");

					}).finally(function() {
						
						loading.finish('sample-1');
					});
			};
state.uploadLeaseLetter = function(isValid, leaseFile) {

				if (!isValid || !leaseFile) {
					state.fileAbsent = true;
					return false;
				}
				var fd = new FormData();

				if (leaseFile) {
					fd.append('leaseFile', leaseFile);
				}

				fd.append('applicantId', params.applicantId);

				fd.append('leaseNo', state.formData.leaseNo);

				if (state.formData.leaseDate) {
					state.formData.leaseDate = format('date')(
						state.formData.leaseDate, 'dd/MM/yyyy');
					fd.append('leaseDate', state.formData.leaseDate);
				}

				loading.start('sample-1');
				var responsePromise = request.post('uploadLeaseLetter',
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

							navigation.location.href = '#dticLandAllotment';

							
							
						}

						loading.finish('sample-1');
					});

			};
state.uploadPossessionLetter = function(isValid,
				possessionFile) {

				if (!isValid || !possessionFile) {
					state.fileAbsent = true;
					return false;
				}

				var fd = new FormData();

				if (possessionFile) {
					fd.append('possessionFile', possessionFile);
				}

				fd.append('applicantId', params.applicantId);

				fd.append('possessionNo', state.formData.possessionNo);

				if (state.formData.possessionDate) {
					state.formData.possessionDate = format('date')(
						state.formData.possessionDate,
						'dd/MM/yyyy');
					fd.append('possessionDate',
						state.formData.possessionDate);
				}

				loading.start('sample-1');
				var responsePromise = request.post(
					'uploadPossessionLetter', fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject = data;

						if (state.responseObject.successMessage != null) {

							navigation.location.href = '#dticLandAllotment';

							
							
						}

						loading.finish('sample-1');
					});

			};
state.loadLOIPage = function() {

				state.applicantId = params.applicantId;
				state.vacantLandId = params.vacantLandId;

				loading.start('sample-1');

				
				var responsePromise = request.get('fetchEncryptedVacantLandDetail/' + state.applicantId + '/' + params.vacantLandId);
				responsePromise.success(function(data, status, headers, config) {
					state.formData.premium = parseFloat((data.premiumCharges)).toFixed(2);
					state.formData.annualGroundRent = parseFloat(data.leaseRent).toFixed(2);
					state.formData.securityDeposite = parseFloat(data.securityDeposit).toFixed(2);
					state.formData.annualMaintenance = parseFloat(data.maintenanceCharges).toFixed(2);
					
					state.formData.developmentCharges = parseFloat(data.developmentCharges).toFixed(2);
					
					
					
					
					state.formData.totalAmount = parseFloat(data.totalAmount).toFixed(2);
					state.ish1VacantLand = (data.ish1VacantLand);


					state.ish1value = false;
					if (state.ish1VacantLand) {
						state.ish1value = true;

					}
					if (data.groupLoi) {
						state.formData.premium = parseFloat((data.premiumCharges)).toFixed(2) - parseFloat(data.advancePremiumH1).toFixed(2);

					}


					loading.finish('sample-1');
				});


			};
state.loadLOIPageH1 = function(applicantId) {

				state.showH1Details = true;

				state.applicantId = applicantId;
				state.vacantLandId = params.vacantLandId;

				if (!state.applicantId || !state.vacantLandId) {
					alert("Please select at least one land allotment.");
					return;
				}

				loading.start('sample-1');

				var responsePromise = request.get(
					'fetchEncryptedVacantLandDetail/' + state.applicantId + '/' + state.vacantLandId
				);

				responsePromise.success(function(data) {
					state.formData = state.formData || {};

					state.formData.premium = parseFloat(data.premiumCharges).toFixed(2);
					state.formData.annualGroundRent = parseFloat(data.leaseRent).toFixed(2);
					state.formData.securityDeposite = parseFloat(data.securityDeposit).toFixed(2);
					state.formData.annualMaintenance = parseFloat(data.maintenanceCharges).toFixed(2);
					state.formData.developmentCharges = parseFloat(data.developmentCharges).toFixed(2);
					state.formData.advancePremiumH1 = parseFloat(data.advancePremiumH1).toFixed(2);
					state.formData.applicantId = state.applicantId;

					loading.finish('sample-1');

				}).error(function() {
					loading.finish('sample-1');
					alert("Failed to fetch data. Please try again.");
				});
			};
state.addLOIDetails = function(isValid) {

				if (!isValid)
					return false;

				loading.start('sample-1');

				state.formData.applicantId = params.applicantId;

				var responsePromise = request.post('addLOIDetails',
					state.formData);

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject = data;

						if (state.responseObject.successMessage != null) {
							navigation.location.href = '#viewUploadDownloadLOI/'
								+ params.applicantId;
							loading.finish('sample-1');
						}

					});



			};
state.addH1Details = function(isValid) {

				if (!isValid)
					return false;
				if (confirm("Are you sure you want to save the payment details?")) {

					loading.start('sample-1');


					state.formData.vacantLandId = params.vacantLandId;
					
					var responsePromise = request.post('addH1Details',
						state.formData);

					responsePromise
						.success(function(data, status, headers, config) {

							state.responseObject = data;

							if (state.responseObject.successMessage != null) {
								
								state.loadIdPendingApplicantList();
								navigation.location.href = '#dticLandAllotment';
								
								loading.finish('sample-1');
							}

						});
				}

			};
state.loadApplicationDetail = function() {

				state.vacantLandId = params.vacantLandId;
				state.applicantId = params.applicantId;

				loading.start('sample-1');

				request.get('fetchApplicationDetail/' + params.applicantId)
					.success(function(data, status, headers, config) {
						state.applicationData = data;

						if (data.profileImageString != null) {
							state.profileImage = data.profileImageString;
						}

						
						request.get('id/fetchDocumentsList', {
							params: { 'applicantId': state.applicationData.applicantId }
						}).success(function(data, status, headers, config) {
							state.applicantDocumentsList = data;

							
							request.get('id/fetchIndustrialProfileDocumentsList', {
								params: { 'applicantId': state.applicationData.applicantId }
							}).success(function(data, status, headers, config) {
								state.industrialProfileDocumentsList = data;

								
								loading.finish('sample-1');
							});

						});

					});

			};
state.loadCreateIndustrialArea = function() {
				var districtId;
				var dticId;
				state.industrialAreaData = {};
				loading.start('sample-1');
				var responseDistricts = request
					.get('fetchdticdistrictsmap');

				responseDistricts
					.success(
						function(data, status, headers, config) {
							state.districts = data;
							each(
									state.districts,
									function(district) {
										districtId = district.key;
									});
							state.industrialAreaData.districtId = districtId
								+ "";

							state
								.fetchTehsilByDistrict(districtId);

							var responseAreas = request
								.get(
									'fetchindustrialareamapbydistrict',
									{
										params: {
											'districtId': districtId
										}
									});
							responseAreas.success(function(
								data, status, headers,
								config) {
								state.areas = data;
							});
						})
					.then(
						function() {
							var responsedtic = request
								.get('fetchdticmap');

							responsedtic
								.success(function(data,
									status, headers,
									config) {
									state.dticList = data;
									for (var i in state.dticList) {
										dticId = i;
									}
									state.industrialAreaData.dticId = dticId
										+ "";
									loading
										.finish('sample-1');
								});
						}).then(function() {
							state.loadIndustrialAreaTable();
						}).then(function() {
							state.populateIAEditForm();
						});
			};
state.loadCollectorRates = function() {
				var districtId;
				var dticId;
				state.collectorRateData = {};

				loading.start('sample-1');

				var responseDistricts = request
					.get('fetchdticdistrictsmap');
				responseDistricts
					.success(
						function(data, status, headers, config) {
							state.districts = data;
							each(
									state.districts,
									function(district) {
										districtId = district.key;
									});
							state.collectorRateData.districtId = districtId
								+ "";
						})
					.then(
						function() {
							var responsedtic = request
								.get('fetchdticmap');
							responsedtic
								.success(function(data,
									status, headers,
									config) {
									state.dticList = data;
									for (var i in state.dticList) {
										dticId = i;
									}
									state.collectorRateData.dticId = dticId
										+ "";
								});
						})
					.then(
						function() {
							var responsePromise = request.get('fetchFinancialYear');
							responsePromise.success(function(data, status, headers, config) {
								state.fyList = data;
							});

							var responseIndusAreas = request
								.get('fetchIndustrialAreaList');
							responseIndusAreas
								.success(function(data,
									status, headers,
									config) {
									state.industrialAreaList = data;
									loading
										.finish('sample-1');
								});

							var responseIndusAreas = request
								.get('fetchCollectorRateList');
							responseIndusAreas
								.success(function(data,
									status, headers,
									config) {
									state.collectorRateList = data;
									loading
										.finish('sample-1');
								});
						});

			};
state.loadSuppliersDetails = function() {
				var districtId;
				
				state.supplierData = {};

				loading.start('sample-1');

				var responseDistricts = request
					.get('fetchdticdistrictsmap');
				responseDistricts
					.success(
						function(data, status, headers, config) {
							state.districts = data;
							each(
									state.districts,
									function(district) {
										districtId = district.key;
									});
							state.supplierInfoData.districtId = districtId
								+ "";
						})

					.then(
						function() {
							var responsePromise = request.get('fetchFinancialYear');
							responsePromise.success(function(data, status, headers, config) {
								state.fyList = data;
							});

							var responseIndusAreas = request
								.get('fetchSupplierTypes');
							responseIndusAreas
								.success(function(data,
									status, headers,
									config) {
									state.supplierTypeList = data;
									loading
										.finish('sample-1');
								});

							var responseIndusAreas = request
								.get('fetchCollectorRateList');
							responseIndusAreas
								.success(function(data,
									status, headers,
									config) {
									state.collectorRateList = data;
									loading
										.finish('sample-1');
								});
						});

			};
state.loadDticDistrictsForSupplier = function() {

				loading.start('sample-1');

				var response = request.get('fetchDticDistricts');

				response.success(function(data, status, headers,
					config) {
					state.districts = data;
					state.supplierInfoData = {};
					state.supplierInfoData.external = 'N';
					state.supplierInfoData.districtId = state.districts[0].key + "";
					if (null == state.supplierInfoData.status) {
						state.supplierInfoData.status = 'INACTIVE';
					}
					loading.finish('sample-1');
				});

			};
state.fetchSupplierTypes = function() {

				loading.start('sample-1');

				var response = request.get('fetchSupplierTypes');

				response.success(function(data, status, headers,
					config) {
					state.supplierTypes = data;
					loading.finish('sample-1');
				});

			};
state.loadCollectorRateForm = function() {
				state.disabled = true;

				var districtId;
				var dticId;
				state.collectorRateData = {};

				loading.start('sample-1');

				var responseDistricts = request
					.get('fetchdticdistrictsmap');
				responseDistricts
					.success(
						function(data, status, headers, config) {
							state.districts = data;
							each(
									state.districts,
									function(district) {
										districtId = district.key;
									});
							state.collectorRateData.districtId = districtId
								+ "";
						})
					.then(
						function() {
							var responsedtic = request
								.get('fetchdticmap');
							responsedtic.success(function(data,
								status, headers, config) {
								state.dticList = data;
								for (var i in state.dticList) {
									dticId = i;
								}
								state.collectorRateData.dticId = dticId
									+ "";
							});

							var responsePromise = request.get('fetchFinancialYear');
							responsePromise.success(function(data, status, headers, config) {
								state.fyList = data;
							});

							var responseIndusAreas = request
								.get('fetchIndustrialAreaList');
							responseIndusAreas
								.success(function(data,
									status, headers,
									config) {
									state.industrialAreaList = data;
								});
						})
					.then(
						function() {
							var responseCollectorRate = request.get('fetchCollectorRateById/' + params.collectorRateId);
							responseCollectorRate.success(function(data, status, headers, config) {
								state.collectorRateData.financialYearId = data.financialYearId + "";
								
								state.collectorRateData.areaId = data.industrialAreaId + "";
								state.collectorRateData.collectorRate = data.collectorRate;

								loading.finish('sample-1');
							});
						});

			};
state.toggleForm = function() {
				loading.start('sample-1');
				state.disabled = !state.disabled;
				loading.finish('sample-1');
			};
state.refreshVacantLandData = function() {
				state.vacantLandData.otherRentChargeReson = "";
				state.vacantLandData.plotNumber = "";
				state.vacantLandData.totalPlotArea = "";
				state.vacantLandData.premiumCharge = "";
				state.vacantLandData.developmentCharges = "";
				state.vacantLandData.maintenanceCharges = "";
				state.vacantLandData.leaseRent = "";
				state.vacantLandData.securityDeposit = "";
				state.vacantLandData.advanceRent = "";
				state.vacantLandData.otherRentCharges = "";
				state.vacantLandData.totalAmount = "";
				state.vacantLandData.premiumCharges = "";
				state.vacantLandData.bookingStartDate = "";
				state.vacantLandData.bookingEndDate = "";


			};
state.fetchCategoryOfIndustry = function() {
				
				request.get('fetchIndustrialCategories')
					.then(function(response) {
						state.categoryOfIndustryList = response.data;

					}, function(error) {
						
						console.error('Error fetching industrial categories:', error);
					});
				var selectedId = state.vacantLandData.industrialAreaId;

				if (!state.industrialAreaList || state.industrialAreaList.length === 0) {
					console.error("industrialAreaList is null or empty");
					return;
				}
				

				var selectedArea = state.industrialAreaList.find(function(item) {
					return item.key == selectedId;
				});

				if (selectedArea?.value && selectedArea.value.indexOf("Undeveloped Land") !== -1) {
					
					state.vacantLandData.newArea = "Old";

					
					state.showNewAreaField = false;

				} else {
					
					state.showNewAreaField = true;
					state.vacantLandData.newArea = "";  
				}


			};
state.loadFYCollectorRates = function(industrialAreaId) {
				if (state.industrialAreaRateData) {
					state.industrialAreaRateData.collectorRateId = "";
				}
				if (industrialAreaId) {
					loading.start('sample-1');

					var response = request.get('loadFYCollectorRates/' + industrialAreaId);
					response.success(function(data, status, headers, config) {
						state.fyCollectorRatesList = data;
					}).then(function() {
						if (state.industrialAreaRateData) {
							state.industrialAreaRateData.collectorRateId = "";
							state.industrialAreaRateData.rateTypeId = "";
						} else if (state.vacantLandData) {
							state.vacantLandData.collectorRateId = "";
						}
						loading.finish('sample-1');
					});
				}
			};
state.loadBacklogLandAllotment = function() {
				var districtId;
				var dticId;
				state.backlogData = {};
				loading.start('sample-1');

				state.loadBacklogEntries();

				var responseDistricts = request
					.get('fetchdticdistrictsmap');
				responseDistricts
					.success(
						function(data, status, headers, config) {
							state.districts = data;
							each(
									state.districts,
									function(district) {
										districtId = district.key;
									});
							state.backlogData.districtId = districtId
								+ "";
						})
					.then(
						function() {
							var responsedtic = request
								.get('fetchdticmap');
							responsedtic
								.success(function(data,
									status, headers,
									config) {
									state.dticList = data;
									for (var i in state.dticList) {
										dticId = i;
									}
									state.backlogData.dticId = dticId
										+ "";
									loading
										.finish('sample-1');
								});
						});
			};
state.loadBacklogEntries = function() {
				var response = request.get('loadBacklogEntries');
				response.success(function(data, status, headers, config) {
					state.backlogEntries = data;
				});
			};
state.downloadBacklogDocument = function(backlogAllotmentId) {
				navigation.open('downloadBacklogDocument/' + backlogAllotmentId);
			};
state.addBacklogLandAllotment = function(form, backlogFile) {
				if (!form.$valid || !backlogFile) {
					state.fileAbsent = true;
					return false;
				}
				var fd = new FormData();

				fd.append('districtId', state.backlogData.districtId);
				fd.append('dticId', state.backlogData.dticId);

				if (backlogFile) {
					fd.append('backlogFile', backlogFile);
				}

				loading.start('sample-1');

				var responsePromise = request.post(
					'addBacklogLandAllotment', fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});
				responsePromise
					.success(function(data, status, headers, config) {
						state.responseObject = data;
						loading.finish('sample-1');
						if (state.responseObject.successMessage != null) {
							later(
								function() {
									state.responseObject.successMessage = null;
								}, 30000);
						}
						if (state.responseObject.errorMessage != null) {
							later(
								function() {
									state.responseObject.errorMessage = null;
								}, 30000);
							
							
						}
						state.loadBacklogEntries();
						dom("#backlogFile").val('');
					});
			};
state.populateIAEditForm = function() {
				if (params.locationId) {
					var locationId = params.locationId;
					var responsePromise = request.get('fetchIADetails/'
						+ locationId);
					responsePromise
						.success(function(data, status, headers,
							config) {
							state.industrialAreaData.tehsilId = data.tehsilId;
							state.industrialAreaData.areaId = data.areaId;
							state.industrialAreaData.location = data.location;
							state.industrialAreaData.totalArea = data.totalArea;
							state.industrialAreaData.mapName = data.mapName;
							state.industrialAreaData.locationId = data.locationId;
						});
				}
			};
state.fetchIAAndTehsilByDistrict = function(districtId) {
				
				var responseTehsils = request
					.get('fetchtehsilmapbydticid');
				responseTehsils.success(function(data, status, headers,
					config) {
					if (!$.trim(data)) {
						var responseTehsils = request.get(
							'fetchtehsilmapbydistrict', {
							params: {
								'districtId': districtId
							}
						});
						responseTehsils.success(function(data, status,
							headers, config) {
							state.tehsils = data;
						});
					} else {
						state.tehsils = data;
					}

				});

				var responseAreas = request.get(
					'fetchindustrialareamapbydistrict', {
					params: {
						'districtId': districtId
					}
				});
				responseAreas.success(function(data, status, headers,
					config) {
					state.areas = data;
				});
			};
state.createIndustrialArea = function(form, mapImage) {
				if (!form.$valid || !mapImage || state.maxSizeError || state.fileExtentionError) {
					state.noFileError = true;
					return false;
				}
				var fd = new FormData();

				if (mapImage) {
					fd.append('mapImage', mapImage);
				}

				fd.append('districtId',
					state.industrialAreaData.districtId);
				fd.append('tehsilId',
					state.industrialAreaData.tehsilId);
				fd.append('dticId', state.industrialAreaData.dticId);
				fd.append('areaId', state.industrialAreaData.areaId);
				fd.append('location',
					state.industrialAreaData.location);
				fd.append('totalArea',
					state.industrialAreaData.totalArea);

				loading.start('sample-1');

				var responsePromise = request.post('addIndustrialArea',
					fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject = data;
						loading.finish('sample-1');
						if (state.responseObject.successMessage != null) {
							later(
								function() {
									state.responseObject.successMessage = null;
								}, 5000);
							navigation.location.href = '#/dticCreateIndustrialArea';
						}
						state.industrialAreaData = {};
						dom("#mapImage").val('');
						form.$setUntouched();
						form.$setPristine();
						state.loadIndustrialAreaTable();
						state.loadCreateIndustrialArea();
						

					});
			};
state.editIndustrialArea = function(form, mapImage) {
				if (!form.$valid || state.maxSizeError || state.fileExtentionError) {
					return false;
				}
				var fd = new FormData();

				if (mapImage) {
					fd.append('mapImage', mapImage);
				}
				if (params.locationId) {

					fd.append('locationId', params.locationId);
				}

				fd.append('location',
					state.industrialAreaData.location);
				fd.append('totalArea',
					state.industrialAreaData.totalArea);

				loading.start('sample-1');

				var responsePromise = request.post('editIndustrialArea',
					fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject = data;
						loading.finish('sample-1');
						if (state.responseObject.successMessage != null) {
							later(
								function() {
									state.responseObject.successMessage = null;
								}, 5000);
							navigation.location.href = '#dticCreateIndustrialArea';
						}
					});
			};
state.createCollectorRate = function(form) {

				if (!form.$valid) {
					return false;
				}

				var fd = new FormData();
				fd.append('financialYearId', state.collectorRateData.financialYearId);
				
				fd.append('industrialAreaId',
					state.collectorRateData.areaId);
				fd.append('collectorRate',
					state.collectorRateData.collectorRate);

				loading.start('sample-1');

				var responsePromise = request.post('addCollectorRate',
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
								}, 5000);
						} else if (state.responseObject.errorMessage != null) {
							later(
								function() {
									state.responseObject.errorMessage = null;
								}, 6000);
						}
					}).then(function() {
						var responseIndusAreas = request
							.get('fetchCollectorRateList');
						responseIndusAreas
							.success(function(data,
								status, headers,
								config) {
								state.collectorRateList = data;
							});
					}).then(function() {
						state.collectorRateData.financialYearId = "";
						
						state.collectorRateData.areaId = "";
						state.collectorRateData.collectorRate = "";
						form.$setUntouched();
						form.$setPristine();
						loading.finish('sample-1');
					});
			};
state.addSupplier = function(form, isValid) {

				if (!isValid) {
					return false;
				}

				if (confirm("Are you sure you want to save the data?")) {


					loading.start('sample-1');

					var fd = new FormData();
					fd.append('supplierName', state.supplierInfoData.supplierName);
					fd.append('supplierTypeId', state.supplierInfoData.supplierTypeId);
					fd.append('authorisedPersonName', state.supplierInfoData.authorisedPersonName);
					fd.append('mobileNo', state.supplierInfoData.mobileNo);
					fd.append('emailId', state.supplierInfoData.emailId);
					fd.append('address', state.supplierInfoData.address);
					fd.append('pin', state.supplierInfoData.pin);
					fd.append('districtId', state.supplierInfoData.districtId);
					fd.append('status', state.supplierInfoData.status);
					fd.append('supplySource', state.supplierInfoData.supplySource);
					fd.append('external', state.supplierInfoData.external);

					


					var responsePromise = request.post('addSupplier',
						fd, {
						transformRequest: identity,
						headers: {
							'Content-Type': undefined
						}
					});


					responsePromise.success(function(data, status, headers, config) {

						state.responseObject = data;

						if (state.responseObject.successMessage != null) {
							later(function() {
								state.responseObject.successMessage = null;
							}, 10000);
							navigation.location.href = '#supplierNameList';
						}
						if (state.responseObject.errorMessage != null) {
							later(function() {
								state.responseObject.errorMessage = null;
							}, 10000);
						}
						loading.finish('sample-1');
					});
					responsePromise.error(function() {
						state.responseObject = {};
						state.responseObject.errorMessage = "Some error occured while saving the data";
						later(function() {
							state.responseObject.errorMessage = null;
						}, 10000);
						loading.finish('sample-1');
					});

				}
			};
state.updateCollectorRate = function(form) {

				if (!form.$valid) {
					return false;
				}

				var fd = new FormData();
				fd.append('financialYearId', state.collectorRateData.financialYearId);
				
				fd.append('industrialAreaId',
					state.collectorRateData.areaId);
				fd.append('collectorRate',
					state.collectorRateData.collectorRate);
				fd.append('collectorRateId', params.collectorRateId);

				loading.start('sample-1');

				var responsePromise = request.post('updateCollectorRate',
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
								}, 5000);
						} else if (state.responseObject.errorMessage != null) {
							later(
								function() {
									state.responseObject.errorMessage = null;
								}, 6000);
						}
						loading.finish('sample-1');
					});
			};
state.deleteCollectorRate = function() {
				request.get('getMessage/common.confirmToDelete').then(function(response) {
					
					if (confirm(response.data.value)) {

						loading.start('sample-1');

						var responsePromise = request.post('deleteCollectorRate/' + params.collectorRateId);
						responsePromise.success(function(data, status, headers, config) {
							state.responseObject = data;
							if (state.responseObject.successMessage != null) {
								later(function() {
									state.responseObject.successMessage = null;
									navigation.location.href = '#/dticCreateCollectorRate';
								}, 1000);
							} else if (state.responseObject.errorMessage != null) {
								later(function() {
									state.responseObject.errorMessage = null;
								}, 5000);
							}
							loading.finish('sample-1');
						});
					}
				});
			};
state.loadIndustrialAreaTable = function() {

				var responsePromise = request
					.get('fetchIndustrialAreas/');
				responsePromise.success(function(data, status, headers,
					config) {
					state.industrialAreaList = data;
				});
			};
state.downloadIndustrialAreaMap = function(locationId) {
				navigation.open('downloadIndustrialAreaMap/' + locationId);
			};
state.loadCreateIndustrialAreaRate = function() {

				

				loading.start('sample-1');

				var responseRateTypes = request.get('fetchRateTypeList');

				responseRateTypes.success(function(data, status,
					headers, config) {
					state.rateTypeList = data;
					loading.finish('sample-1');
				});

				

				loading.start('sample-2');
				var responseIndusAreas = request
					.get('fetchIndustrialAreaList');

				responseIndusAreas.success(function(data, status,
					headers, config) {
					state.industrialAreaList = data;
					loading.finish('sample-2');
				});

				

				if (params.industrialAreaRateId) {
					state.disabled = true;

					loading.start('sample-3');
					var responseRateTypes = request.get('fetchIndustrialAreaRateById/' + params.industrialAreaRateId);
					responseRateTypes.success(function(data, status, headers, config) {
						state.industrialAreaRateData = data;
					}).then(function() {
						var response = request.get('loadFYCollectorRates/' + state.industrialAreaRateData.industrialAreaId);
						response.success(function(data2, status, headers, config) {
							state.fyCollectorRatesList = data2;
						});
						state.industrialAreaRateData.industrialAreaId = state.industrialAreaRateData.industrialAreaId + "";
						state.industrialAreaRateData.collectorRateId = state.industrialAreaRateData.collectorRateId + "";
						state.industrialAreaRateData.rateTypeId = state.industrialAreaRateData.rateTypeId + "";
						loading.finish('sample-3');
					});
				}
			};
state.fetchIndustrialAreaRates = function(collectorRateId) {
				state.industrialAreaRatesList = {};
				if (collectorRateId) {
					loading.start('sample-1');
					var responseRates = request
						.get(
							'fetchRatesByIndustrialArea',
							{
								params: {
									'collectorRateId': collectorRateId
								}
							});
					responseRates.success(function(data, status,
						headers, config) {
						state.industrialAreaRatesList = data;
						loading.finish('sample-1');
					});
				}
			};
state.createIndustrialAreaRate = function(form) {
				if (!form.$valid)
					return false;
				if (state.industrialAreaRateData.rateTypeId < 7) {
					alert("Data submission for selected Approved Rate not allowed as these are the Old Approved rates.")
					return false;
				}

				loading.start('sample-1');

				var industrialAreaId = state.industrialAreaRateData.industrialAreaId;
				var collectorRateId = state.industrialAreaRateData.collectorRateId;

				state.industrialAreaRateData.totalAmount = +(state.industrialAreaRateData.premiumCharges)
					+ +(state.industrialAreaRateData.maintenanceCharges)
					+ +(state.industrialAreaRateData.developmentCharges)
					+ +(state.industrialAreaRateData.leaseRent)
					+ +(state.industrialAreaRateData.securityDeposit);
				if (state.industrialAreaRateData.totalAmount == 0) {
					loading.finish('sample-1');
					
					request.get('getMessage/dtic.id.totalAmount').then(
						function(response) {
							alert(response.data.value);
						});
					return false;
				}

				var responsePromise = request.post(
					'addIndustrialAreaRate',
					state.industrialAreaRateData);

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject = data;
						loading.finish('sample-1');
						if (state.responseObject.successMessage != null) {
							later(
								function() {
									state.responseObject.successMessage = null;
								}, 5000);
							state.industrialAreaRateData = {};
							form.$setUntouched();
							form.$setPristine();
							
							state.industrialAreaRateData.industrialAreaId = industrialAreaId;
							state.industrialAreaRateData.collectorRateId = collectorRateId;
							state.fetchIndustrialAreaRates(collectorRateId);
							
							navigation.location.href = '#/dticCreateIndustrialAreaRate';
							
						}
						
					});
			};
state.updateIndustrialAreaRate = function(form) {
				if (!form.$valid)
					return false;

				if (state.industrialAreaRateData.rateTypeId < 7) {
					alert("Data updation for selected Approved Rate not allowed as these are the Old Approved rates.")
					return false;
				}

				loading.start('sample-1');

				state.industrialAreaRateData.industrialAreaRateId = params.industrialAreaRateId;

				state.industrialAreaRateData.totalAmount = +(state.industrialAreaRateData.premiumCharges)
					+ +(state.industrialAreaRateData.maintenanceCharges)
					+ +(state.industrialAreaRateData.developmentCharges)
					+ +(state.industrialAreaRateData.leaseRent)
					+ +(state.industrialAreaRateData.securityDeposit);
				if (state.industrialAreaRateData.totalAmount == 0) {
					loading.finish('sample-1');
					
					request.get('getMessage/dtic.id.totalAmount').then(
						function(response) {
							alert(response.data.value);
						});
					return false;
				}

				var responsePromise = request.post(
					'updateIndustrialAreaRate',
					state.industrialAreaRateData);

				responsePromise
					.success(function(data, status, headers, config) {
						state.responseObject = data;
						loading.finish('sample-1');
						if (state.responseObject.successMessage != null) {
							later(
								function() {
									state.responseObject.successMessage = null;
								}, 5000);
							
						}
					});
			};
state.fetchMasterRates = function() {
				var rateTypeId = state.industrialAreaRateData.rateTypeId;
				var collectorRateId = state.industrialAreaRateData.collectorRateId;



				state.industrialAreaRateData.premiumCharges = undefined
				state.industrialAreaRateData.developmentCharges = '100.00';
				if (rateTypeId == 7 || rateTypeId == 8 || rateTypeId == 9 || rateTypeId == 10)
					state.industrialAreaRateData.developmentCharges = '150.00';
				state.industrialAreaRateData.maintenanceCharges = '10.00';
				state.industrialAreaRateData.leaseRent = undefined;
				state.industrialAreaRateData.securityDeposit = undefined;
				

				var areaId = state.industrialAreaRateData.industrialAreaId;
				var responseArea = request
					.get(
						'fetchAreaName',
						{
							params: {
								'areaId': areaId

							}
						});

				responseArea.success(function(data, status, headers, config) {
					console.log(data);
					var areaName = data.responseMessage;
					if (areaName && areaName.toLowerCase().includes("undeveloped land".toLowerCase())) {
                        state.industrialAreaRateData.developmentCharges = '0';
                        state.industrialAreaRateData.maintenanceCharges = '0';
                       }

				});

				
				if (collectorRateId && rateTypeId) {
					loading.start('sample-1');

					var responseRates = request
						.get(
							'fetchMasterRatesByCollectorRateId',
							{
								params: {
									'collectorRateId': collectorRateId
								}
							});
					responseRates
						.success(function(data, status, headers,
							config) {
							var landRatePerSQM = data;
							if (landRatePerSQM == 0) {
								
								request
									.get(
										'getMessage/dtic.id.masterRates')
									.then(
										function(response) {
											alert(response.data.value);
										});
								state.industrialAreaRateData.collectorRateId = "";
								state.industrialAreaRateData.rateTypeId = "";
							} else {
								var premiumCharges;
								if (rateTypeId == 1) {
									premiumCharges = (5 / 100)
										* landRatePerSQM; 
									
									
									
									
									
									
									
								} else if (rateTypeId == 2) {
									premiumCharges = (10 / 100)
										* landRatePerSQM;
									
									
									
									
									
									
									
									
								} else if (rateTypeId == 3) {
									premiumCharges = (20 / 100)
										* landRatePerSQM;
									
									
									
									
									
									
									
									
								} else if (rateTypeId == 4) {
									premiumCharges = (50 / 100)
										* landRatePerSQM;
									
									
									
									
									
									
									
									
								} else if (rateTypeId == 5) {
									premiumCharges = (75 / 100)
										* landRatePerSQM;
									
									
									
									
									
									
									
									
								} else if (rateTypeId == 6) {
									premiumCharges = (100 / 100)
										* landRatePerSQM;
									
									
									
									
									
									
									
									
								}
								else if (rateTypeId == 7) {
									premiumCharges = (10 / 100)
										* landRatePerSQM;
									
									
									
									
									
									
									
									
								}
								else if (rateTypeId == 8) {
									premiumCharges = (25 / 100)
										* landRatePerSQM;
									
									
									
									
									
									
									
									
								}
								else if (rateTypeId == 9) {
									premiumCharges = (50 / 100)
										* landRatePerSQM;
									
									
									
									
									
									
									
									
								}
								else if (rateTypeId == 10) {
									premiumCharges = (100 / 100)
										* landRatePerSQM;
									
									
									
									
									
									
									
									
								} else {
									
									
									
								}
								state.industrialAreaRateData.premiumCharges = premiumCharges;
								if (premiumCharges) {
									state.industrialAreaRateData.premiumCharges = parseFloat(
										state.industrialAreaRateData.premiumCharges)
										.toFixed(2);
									state.industrialAreaRateData.leaseRent = (2 / 100)
										* premiumCharges; 
									
									
									state.industrialAreaRateData.leaseRent = parseFloat(
										state.industrialAreaRateData.leaseRent)
										.toFixed(2);

									
									state.industrialAreaRateData.securityDeposit = parseFloat(3 * state.industrialAreaRateData.leaseRent)
										.toFixed(2);

								}
							}
							loading.finish('sample-1');
						});
				}
			};
state.onReservationChange = function(value) {

				state.vacantLandData.totalPlotArea = "";
				state.vacantLandData.premiumCharge = "";
				state.vacantLandData.developmentCharges = "";
				state.vacantLandData.maintenanceCharges = "";
				state.vacantLandData.leaseRent = "";
				state.vacantLandData.securityDeposit = "";
				state.vacantLandData.advanceRent = "";
				state.vacantLandData.otherRentCharges = "";
				state.vacantLandData.otherRentChargeReson = "";
				state.vacantLandData.totalAmount = "";
				state.vacantLandData.premiumCharges = "";
			};
state.fetchRatesByIndustrialAreaId = function(
				collectorRateId, totalPlotArea) {
				console.log(state.vacantLandData);

				var districtId = state.vacantLandData.districtId;
				var plotShed = state.vacantLandData.plotShed;
				var newArea = state.vacantLandData.newArea;
				var category = "No";
				if (plotShed === undefined) {
					alert("Please select Plot/Shed!");
					state.vacantLandData.totalPlotArea = "";
					return false;
				}

				if (newArea === undefined) {
					alert("Please select Plot/Shed!");
					state.vacantLandData.totalPlotArea = "";
					return false;
				}
				else if (newArea === 'New' && state.vacantLandData.category === undefined) {
					alert("Please select Land is reserved for");
					state.vacantLandData.totalPlotArea = "";
					return false;
				} else if (newArea === "Old") {
					state.vacantLandData.category = "OpenForAll";
				}

				var category = state.vacantLandData.category;
				
				if (collectorRateId) {

					state.vacantLandData.premiumCharges = 0.00;
					state.vacantLandData.developmentCharges = 0.00;
					state.vacantLandData.maintenanceCharges = 0.00;
					state.vacantLandData.leaseRent = 0.00;
					state.vacantLandData.securityDeposit = 0.00;
					state.vacantLandData.advanceRent = 0.00;
					state.vacantLandData.totalAmount = 0.00;

					if (totalPlotArea
						&& !Object.is(totalPlotArea, 0)) {

						loading.start('sample-1');
						
						var responseRates = request
							.get(
								'fetchRatesByCollectorRateIdAndAreaLeaseRent',
								{
									params: {
										'collectorRateId': collectorRateId,
										'totalArea': totalPlotArea,
										'districtId': districtId,
										'plotShed': plotShed,
										'category': category
									}
								});


						responseRates
							.success(function(data, status,
								headers, config) {
								var calculatedAmounts = data;
								state.vacantLandData.premiumCharges = parseFloat(
									calculatedAmounts['premiumCharges'])
									.toFixed(2);

								state.vacantLandData.developmentCharges = parseFloat(
									calculatedAmounts['developmentCharges'])
									.toFixed(2);
								
								state.vacantLandData.maintenanceCharges = parseFloat(
									calculatedAmounts['maintenanceCharges'])
									.toFixed(2);
								state.vacantLandData.leaseRent = parseFloat(
									calculatedAmounts['leaseRent'])
									.toFixed(2);
								state.vacantLandData.advanceRent = parseFloat(
									calculatedAmounts['advanceRent'])
									.toFixed(2);

								state.vacantLandData.securityDeposit = parseFloat(
									calculatedAmounts['securityDeposit'])
									.toFixed(2);

								state.vacantLandData.totalAmount = parseFloat(
									calculatedAmounts['totalAmount'])
									.toFixed(2);

								state.vacantLandData.totalAmountHidden = state.vacantLandData.totalAmount;

								if (state.vacantLandData.totalAmount == null
									|| state.vacantLandData.totalAmount == 0) {

									request
										.get(
											'getMessage/dtic.id.plotSizeRate')
										.then(
											function(
												response) {
												alert(response.data.value);
												state.vacantLandData.totalPlotArea = "";
											});
								}
								

								if (plotShed === "plot") {
									alert(state.vacantLandData.premiumCharges);
									state.vacantLandData.premiumCharges = parseFloat(
										calculatedAmounts['premiumCharges']) / 2
											.toFixed(2);


								}
								loading.finish('sample-1');
							});
					}

				}
			};
state.updateTotalAmount = function() {
				console.log("updateTotalAmount() function called");
				console.log("Other charges:", state.vacantLandData.otherRentCharges);
				console.log("Total amount before update:", state.vacantLandData.totalAmount);

				

				var otherCharges = parseFloat(state.vacantLandData.otherRentCharges || 0); 
				var totalAmount = parseFloat(state.vacantLandData.totalAmountHidden);
				if (state.vacantLandData.plotShed === "Plot") {
					if (!isNaN(otherCharges) && !isNaN(totalAmount)) {
						
						state.vacantLandData.totalAmount = (otherCharges + totalAmount).toFixed(2);
					} else {
						alert("Invalid value encountered. Unable to update total amount.");
					}

					
					var expectedTotal = parseFloat(state.vacantLandData.premiumCharges) +
						parseFloat(state.vacantLandData.developmentCharges) +
						parseFloat(state.vacantLandData.maintenanceCharges) +
						parseFloat(state.vacantLandData.leaseRent) +
						parseFloat(state.vacantLandData.securityDeposit) +
						parseFloat(state.vacantLandData.advanceRent) +
						otherCharges; 

					
					
				} else {
					alert("Vacant land saved successfully");
				}

				console.log("Total amount after update:", state.vacantLandData.totalAmount);
			};
state.toggleApplicationListChecks = function(check) {
				loading.start('sample-1');

				for (var i = 0; i < state.idPendingApplicantList.length; i++) {
					if (state.idPendingApplicantList[i].status == "Submitted" ||
						state.idPendingApplicantList[i].statusId == "40")
						state.idPendingApplicantList[i].checkId = check;
				}
				state.countCheck();

				loading.finish('sample-1');
			};
state.h1Details = function() {
				state.showH1Details = true;

			};
state.getRejectCount = function() {
				var counter = 0;


				if (Array.isArray(state.idPendingApplicantList) && state.idPendingApplicantList.length > 0) {
					for (var i = 0; i < state.idPendingApplicantList.length; i++) {


						if (state.idPendingApplicantList[i].status == "Rejected") {
							counter++;
						}

						if (state.idPendingApplicantList[i].statusId == "37") {
							state.showTender = true;
						}
						if (state.idPendingApplicantList[i].statusId == "38") {
							state.showCommitteeForm = true;

						}
						else if (state.idPendingApplicantList[i].statusId == "39") {

							state.showButton = false;
							state.showCommitteeForm = false;
							state.tenderInitiate = false;

						}
						else if (state.idPendingApplicantList[i].statusId == "40") {
							state.showButton = false;
							state.showCommitteeForm = false;

						}
						else if (state.idPendingApplicantList[i].statusId == "41") {
							state.showButton = false;
							state.tenderInitiate = false;


						}
					}


				}
				return counter;
			};
state.countCheck = function() {
				loading.start('sample-1');

				var counter = 0;
				for (var i = 0; i < state.idPendingApplicantList.length; i++) {
					if (state.idPendingApplicantList[i].checkId) {
						counter++;
					}
					if (state.idPendingApplicantList[i].isUndevelopedLandByApplicant) {
						state.isUndevelopedLandByApplicant = true;
					}
				}
				state.checkCount = counter;
				state.check = (counter != state.idPendingApplicantList.length) ? false
					: true;

				loading.finish('sample-1');
			};
state.issueNotice = function(isValid) {
				if (!isValid) {
					return false;
				}

				request
					.get('getMessage/common.confirmToSave')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {

								var fd = new FormData();

								if (state.document) {
									fd.append('document',
										state.document);
								}
								if (state.documentDesc) {
									fd
										.append(
											'documentDesc',
											state.documentDesc);
								}
								if (state.noticeData.noticeDate) {
									fd
										.append(
											'noticeDate',
											state.noticeData.noticeDate);
								}
								if (state.noticeData.reason) {
									fd
										.append(
											'reason',
											state.noticeData.reason);
								}
								if (state.noticeData.remark) {
									fd
										.append(
											'remark',
											state.noticeData.remark);
								}
								loading.start('sample-1');

								fd
									.append(
										'applicantId',
										params.applicantId);

								var responsePromise = request
									.post(
										'issueNotice',
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
												}, 5000);
											navigation.location.href = '#/noticeList';
										}
										loading
											.finish('sample-1');
									});
							}
						});
			};
state.loadNoticeDetails = function() {
				loading.start('sample-1');

				var responsePromise = request.get('loadNoticeDetails/'
					+ params.noticeId);
				responsePromise.success(function(data, status, headers,
					config) {
					state.noticeData = data;
					loading.finish('sample-1');
				});
			};
state.downloadNoticeDocument = function(documentId) {
				loading.start('sample-1');
				navigation.open('downloadNoticeDocument/' + documentId);
				loading.finish('sample-1');
			};
state.saveComplianceStatus = function(isValid) {
				if (!isValid) {
					return false;
				}

				request
					.get('getMessage/common.confirmToSave')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {

								var fd = new FormData();

								if (state.document) {
									fd
										.append(
											'agreeDisagreeDocument',
											state.document);
								}
								if (state.documentDesc) {
									fd
										.append(
											'agreeDisagreeDocumentDesc',
											state.documentDesc);
								}
								if (state.noticeData.complianceStatus) {
									fd
										.append(
											'complianceStatus',
											state.noticeData.complianceStatus);
								}
								if (state.noticeData.cancellationDate) {
									fd
										.append(
											'cancellationDate',
											state.noticeData.cancellationDate);
								}
								if (state.noticeData.cancellationReason) {
									fd
										.append(
											'cancellationReason',
											state.noticeData.cancellationReason);
								}
								if (state.noticeData.agreeDisagreeRemark) {
									fd
										.append(
											'agreeDisagreeRemark',
											state.noticeData.agreeDisagreeRemark);
								}
								loading.start('sample-1');

								fd.append('noticeId',
									params.noticeId);

								var responsePromise = request
									.post(
										'saveComplianceStatus',
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
												}, 5000);
											navigation.location.href = '#/noticeList';
										}
										loading
											.finish('sample-1');
									});
							}
						});
			};
state.downloadEsignedApplicationForm = function(esignedDocId) {
				navigation.open('downloadEsignDocument/' + esignedDocId);
			};
state.downloadLOILetter = function(applicantId) {
				navigation
					.open('downloadIdDocument/ID_LETTER_OF_INTENT_RELEASED/'
						+ applicantId);
			};
state.downloadCommitteeLetter = function(applicantId) {
				navigation
					.open('downloadIdDocument/ID_LETTER_OF_COMMITTEE_DECISION/'
						+ applicantId);
			};
state.downloadLeaseLetter = function(applicantId) {
				navigation
					.open('downloadIdDocument/ID_LETTER_OF_LEASE_DEED/'
						+ applicantId);
			};
state.downloadPossessionLetter = function(applicantId) {
				navigation
					.open('downloadIdDocument/ID_LETTER_OF_POSSESSION_RELEASED/'
						+ applicantId);
			};
state.downloadEsignPossessionLetter = function() {
				const applicantId = params.applicantId;
				navigation
					.open('downloadIdDocument/APPLICATION_POSSESSION/'
						+ applicantId);
			};
state.downloadAllotmentLetter = function(applicantId) {
				navigation
					.open('downloadIdDocument/ID_LETTER_OF_ALLOTMENT_RELEASED/'
						+ applicantId);
			};
state.downloadLOCLetter = function(applicantId) {
				navigation
					.open('downloadIdDocument/ID_LETTER_OF_CONSENT_RELEASED/'
						+ applicantId);
			};
state.loadAnnualPaymentHistory = function() {
				loading.start('sample-1');

				var responsePromise = request
					.get('fetchAnnualPaymentHistory/'
						+ params.applicantId);
				responsePromise.success(function(data, status, headers,
					config) {
					state.historyList = data;
					loading.finish('sample-1');
				});
			};
state.doTheBack = function() {
				window.history.back();
			};
state.loadHearingDetails = function(appealType) {
				loading.start('sample-1');

				var responsePromise = request.get('fetchHearingDetails/'
					+ params.hearingId);
				responsePromise
					.success(function(data, status, headers, config) {
						state.hearingData = data;
						if (appealType == 'zonal')
							state.conditionalData = data.appealConditionalDecisionZOBean;
						else
							state.conditionalData = data.appealConditionalDecisionICBean;
						loading.finish('sample-1');
					});
			};
state.saveConditionalComplianceStatusZO = function(isValid) {
				if (!isValid) {
					return false;
				}

				request
					.get('getMessage/common.confirmToSave')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								var fd = new FormData();

								if (state.document) {
									fd
										.append(
											'dticComplianceDocument',
											state.document);
								}
								if (state.documentDesc) {
									fd
										.append(
											'dticComplianceDocumentDesc',
											state.documentDesc);
								}
								if (state.conditionalData.dticComplianceStatus) {
									fd
										.append(
											'dticComplianceStatus',
											state.conditionalData.dticComplianceStatus);
								}
								if (state.conditionalData.dticComments) {
									fd
										.append(
											'dticComments',
											state.conditionalData.dticComments);
								}
								loading.start('sample-1');

								fd.append('appealHearingId',
									params.hearingId);
								if (params.decisionId) {
									fd
										.append(
											'decisionId',
											params.decisionId);
								}

								var responsePromise = request
									.post(
										'saveConditionalComplianceStatusZO',
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
												}, 5000);
											navigation.location.href = '#/noticeList';
										}
										loading
											.finish('sample-1');
									});
							}
						});
			};
state.saveConditionalComplianceStatusIC = function(isValid) {
				if (!isValid) {
					return false;
				}

				request
					.get('getMessage/common.confirmToSave')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								var fd = new FormData();

								if (state.document) {
									fd
										.append(
											'dticComplianceDocument',
											state.document);
								}
								if (state.documentDesc) {
									fd
										.append(
											'dticComplianceDocumentDesc',
											state.documentDesc);
								}
								if (state.conditionalData.dticComplianceStatus) {
									fd
										.append(
											'dticComplianceStatus',
											state.conditionalData.dticComplianceStatus);
								}
								if (state.conditionalData.dticComments) {
									fd
										.append(
											'dticComments',
											state.conditionalData.dticComments);
								}
								loading.start('sample-1');

								fd.append('appealHearingId',
									params.hearingId);
								if (params.decisionId) {
									fd
										.append(
											'decisionId',
											params.decisionId);
								}

								var responsePromise = request
									.post(
										'saveConditionalComplianceStatusIC',
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
												}, 5000);
											navigation.location.href = '#/noticeList';
										}
										loading
											.finish('sample-1');
									});
							}
						});
			};
state.loadAppealDetails = function() {
				loading.start('sample-1');

				var responsePromise = request.get('loadAppealDetails/'
					+ params.appealId);
				responsePromise.success(
					function(data, status, headers, config) {
						state.appealData = data;
					}).then(
						function() {
							var responsePromise1 = request
								.get('loadAppealHearings/'
									+ params.appealId);
							responsePromise1.success(function(data,
								status, headers, config) {
								state.hearingList = data;
								loading.finish('sample-1');
							});
						});
			};
state.loadAppealHearingDetails = function() {
				loading.start('sample-1');

				var responsePromise = request
					.get('loadAppealHearingDetails/'
						+ params.appealHearingId);
				responsePromise
					.success(function(data, status, headers, config) {
						state.appealHearingData = data;
						if (state.appealHearingData.hearingStatusId != null) {
							state.appealHearingData.hearingStatusId = state.appealHearingData.hearingStatusId
								+ "";
						}
						loading.finish('sample-1');
					});
			};
state.loadAnnualPaymentDetails = function() {
				loading.start('sample-1');

				var responsePromise = request
					.get('fetchAnnualPaymentDetails/'
						+ params.paymentId);
				responsePromise.success(function(data, status, headers,
					config) {
					state.paymentData = data;
					loading.finish('sample-1');
				});
			};
state.downloadBacklogForm = function() {
				navigation.open('downloadBacklogForm');
			};
state.validateYear = function(collectorRateData) {
				state.collectorRateData.fyFrom = dom("#from").val();
				state.collectorRateData.fyTo = dom("#to").val();
			};
}
