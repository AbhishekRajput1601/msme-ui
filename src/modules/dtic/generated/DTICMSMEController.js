// Source: angular/dtic/controller.js. Generated static JS, with explicit React IO dependencies.
export function installActions(state, { request, loading, navigation, params, format, later, dom }) {
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,Array.isArray(items) ? Number(k) : k));
const identity = value => value;
const fetchMSMEApplications = () => { state.listVersion++; loading.finish(); };
const fetchMicroLevelApplicants = () => { state.listVersion++; loading.finish(); };
const fetchSmallLevelApplicants = () => { state.listVersion++; loading.finish(); };
const fetchMediumLevelApplicants = () => { state.listVersion++; loading.finish(); };
const $sce = { trustAsHtml: value => value?.message || value };

let lastObjectId="", lastSchemeId="", lastSchemeTypeId="";
state.started = false;
state.startOrStopSpinner = function(isStart) {

				if (isStart) {
					loading.start('sample-1');
				} else {
					loading.finish('sample-1');
				}

			};
state.populateDetailsThroughUdyogAadhaar = function(isUAM,
				uamNumber, aadhaarNumber) {
				
				if (isUAM == 'yes' && null != uamNumber
					&& null != aadhaarNumber) {

					loading.start('sample-1');
					var responseUAM = request.get('fetchuamdetails', {
						params: {
							'uamNumber': uamNumber,
							'aadhaarNumber': aadhaarNumber
						}
					});
					responseUAM
						.success(function(data, status, headers,
							config) {
							if (data.table != null
								&& data.table.applicationId != null) {
								state.msmeDetailData.uamDate = data.table.appliedDate;
								state.msmeDetailData.ownerOrPartnerName = data.table.ownerName;
								state.msmeDetailData.unitName = data.table.enterpriseName;
								if (null != data.table.organisationType) {
									state.msmeDetailData.typeOfOrganization = data.table.organisationType
										.trim();
								}
								state.msmeDetailData.unitAddress1 = data.table.address
									.split(' ')[0];
								if (data.table.address.split(' ')[3] != null) {
									state.msmeDetailData.unitAddress2 = data.table.address
										.split(' ')[1]
										+ " "
										+ data.table.address
											.split(' ')[2]
										+ " "
										+ data.table.address
											.split(' ')[3];
								} else if (data.table.address
									.split(' ')[2] != null) {
									state.msmeDetailData.unitAddress2 = data.table.address
										.split(' ')[1]
										+ " "
										+ data.table.address
											.split(' ')[2];
								} else if (data.table.address
									.split(' ')[1] != null) {
									state.msmeDetailData.unitAddress2 = data.table.address
										.split(' ')[1];
								}

								if (data.table.address.split(' ')[11] != null) {
									state.msmeDetailData.unitAddress3 = data.table.address
										.split(' ')[4]
										+ " "
										+ data.table.address
											.split(' ')[5]
										+ " "
										+ data.table.address
											.split(' ')[6]
										+ " "
										+ data.table.address
											.split(' ')[7]
										+ " "
										+ data.table.address
											.split(' ')[8]
										+ " "
										+ data.table.address
											.split(' ')[9]
										+ " "
										+ data.table.address
											.split(' ')[10]
										+ " "
										+ data.table.address
											.split(' ')[11];
								} else if (data.table.address
									.split(' ')[10] != null) {
									state.msmeDetailData.unitAddress3 = data.table.address
										.split(' ')[4]
										+ " "
										+ data.table.address
											.split(' ')[5]
										+ " "
										+ data.table.address
											.split(' ')[6]
										+ " "
										+ data.table.address
											.split(' ')[7]
										+ " "
										+ data.table.address
											.split(' ')[8]
										+ " "
										+ data.table.address
											.split(' ')[9]
										+ " "
										+ data.table.address
											.split(' ')[10];
								} else if (data.table.address
									.split(' ')[9] != null) {
									state.msmeDetailData.unitAddress3 = data.table.address
										.split(' ')[4]
										+ " "
										+ data.table.address
											.split(' ')[5]
										+ " "
										+ data.table.address
											.split(' ')[6]
										+ " "
										+ data.table.address
											.split(' ')[7]
										+ " "
										+ data.table.address
											.split(' ')[8]
										+ " "
										+ data.table.address
											.split(' ')[9];
								} else if (data.table.address
									.split(' ')[8] != null) {
									state.msmeDetailData.unitAddress3 = data.table.address
										.split(' ')[4]
										+ " "
										+ data.table.address
											.split(' ')[5]
										+ " "
										+ data.table.address
											.split(' ')[6]
										+ " "
										+ data.table.address
											.split(' ')[7]
										+ " "
										+ data.table.address
											.split(' ')[8];
								} else if (data.table.address
									.split(' ')[7] != null) {
									state.msmeDetailData.unitAddress3 = data.table.address
										.split(' ')[4]
										+ " "
										+ data.table.address
											.split(' ')[5]
										+ " "
										+ data.table.address
											.split(' ')[6]
										+ " "
										+ data.table.address
											.split(' ')[7];
								} else if (data.table.address
									.split(' ')[6] != null) {
									state.msmeDetailData.unitAddress3 = data.table.address
										.split(' ')[4]
										+ " "
										+ data.table.address
											.split(' ')[5]
										+ " "
										+ data.table.address
											.split(' ')[6];
								} else if (data.table.address
									.split(' ')[5] != null) {
									state.msmeDetailData.unitAddress3 = data.table.address
										.split(' ')[4]
										+ " "
										+ data.table.address
											.split(' ')[5];
								} else if (data.table.address
									.split(' ')[4] != null) {
									state.msmeDetailData.unitAddress3 = data.table.address
										.split(' ')[4];
								}

								state.msmeDetailData.unitPinCode = data.table.pincode;
								var districtIdResponse = request
									.get(
										'fetchdistrictidbyname',
										{
											params: {
												'districtName': data.table.districtname
											}
										});
								districtIdResponse
									.success(function(
										districtId, status,
										headers, config) {
										state.msmeDetailData.unitDistrict = districtId
											+ "";
										var tehsilBlockMapResponse = request
											.get(
												'fetchalltehsilsmap',
												{
													params: {
														'districtId': districtId
													}
												});
										tehsilBlockMapResponse
											.success(function(
												tehsilBlockMap,
												status,
												headers,
												config) {
												state.unitTehsils = tehsilBlockMap;
											});
									});

								
								state.msmeDetailData.unitPhoneNumber = data.table.mobileNo;
								if (data.table.socialCategory == "General") {
									state.msmeDetailData.category = "4";
								} else if (data.table.category == "SC") {
									state.msmeDetailData.category = "1";
								} else if (data.table.socialCategory == "ST") {
									state.msmeDetailData.category = "2";
								} else if (data.table.socialCategory == "OBC") {
									state.msmeDetailData.category = "3";
								}
								state.msmeDetailData.unitEmail = data.table.emailId;
								state.msmeDetailData.msmeType = data.table.enterpriseType;
								state.msmeDetailData.productionDate = data.table.commmenceDate;
								state.msmeDetailData.enterpriseType = data.table.majorActivity;
								state.msmeDetailData.totalEmployments = data.table.totalEmp

								if (null != data.table1List) {

									each(
											data.table1List,
											function(value,
												index) {

												if (null == state.msmeDetailData.activityDetailsList[index]) {
													state.msmeDetailData.activityDetailsList
														.push({});
												}

												if (value.activity == 'Manufacturing') {
													state.msmeDetailData.activityDetailsList[index].activityType = "1";
												} else if (value.activity == 'Services') {
													state.msmeDetailData.activityDetailsList[index].activityType = "2";
												}

												var activityResponse = request
													.get(
														'finduamactivitiesidbyname',
														{
															params: {
																'activityName': value.twoDigitActivity
																	.split('-')[1]
															}
														});
												activityResponse
													.success(function(
														activityDetail1Id,
														status,
														headers,
														config) {
														state
															.fetchUamActivitiesByType(
																state.msmeDetailData.activityDetailsList[index].activityType,
																index);
														
														
														
														
														
														
														
														
														
														
														
														
														
														
														
														
														
														
														
														
														
														
														state.msmeDetailData.activityDetailsList[index].activityDetail1 = activityDetail1Id
															+ '';
													});
												state.msmeDetailData.activityDetailsList[index].activityDetail2 = value.fourDigitActivity
													.split('-')[1];
												state.msmeDetailData.activityDetailsList[index].activityDetail3 = value.fiveDigitActivity
													.split('-')[1];
											})
								}
							}
							loading.finish('sample-1');
						});
					responseUAM
						.error(function(data, status, headers,
							config) {
							
							request
								.get(
									'getMessage/dtic.fa.adyogAadharError')
								.then(function(response) {
									alert(response.data.value);
								});
							loading.finish('sample-1');
						});
				} else {
					
					state.resetUAMDetails();
				}
			};
state.resetUAMDetails = function() {
				state.msmeDetailData.uamDate = null;
				;
				state.msmeDetailData.ownerOrPartnerName = null;
				;
				state.msmeDetailData.unitName = null;
				state.msmeDetailData.typeOfOrganization = null;
				state.msmeDetailData.unitAddress1 = null;
				state.msmeDetailData.unitAddress2 = null;
				state.msmeDetailData.unitAddress3 = null;
				state.msmeDetailData.unitPinCode = null;
				state.msmeDetailData.unitDistrict = null;
				state.unitTehsils = null;
				state.msmeDetailData.unitPhoneNumber = null;
				state.msmeDetailData.category = null;
				state.msmeDetailData.unitEmail = null;
				state.msmeDetailData.msmeType = null;
				state.msmeDetailData.productionDate = null;
				state.msmeDetailData.enterpriseType = null;
				state.msmeDetailData.totalEmployments = null;
				state.msmeDetailData.activityDetailsList = [{}]

			};
state.resetUAMAvailDetailsIfNo = function() {
				state.msmeDetailData.uamNumber = null;
				state.msmeDetailData.udyogAadhaar = 'no';
				state.resetUAMDetails();
			};
state.resetUAMAvailDetailsIfYes = function() {
				state.msmeDetailData.previousRegistrationName = null;
				state.msmeDetailData.previousRegistrationValue = null;
				state.resetUAMDetails();
			};
state.loadMSMEFormDetail = function() {

				state.msmeDetailId = params.msmeDetailId;

				loading.start('sample-1');

				var responseIndusAreas = request
					.get('fetchIndustrialAreaList');

				responseIndusAreas.success(function(data, status,
					headers, config) {
					state.industrialAreaList = data;
					loading.finish('sample-1');
				});
				var responseDistricts = request
					.get('fetchalldistrictsmap');

				responseDistricts.success(function(data, status,
					headers, config) {
					state.districts = data;
					state.unitDistricts = data;
				});

				var responseCategories = request
					.get('fetchcategoriesmap');

				responseCategories.success(function(data, status,
					headers, config) {
					state.categories = data;
				});

				var responseBanks = request.get('fetchBanksMap');

				responseBanks.success(function(data, status, headers,
					config) {
					state.bankList1 = data;
				});

				loading.finish('sample-1');

			};
state.addMSMEDetailFunction = function(form, isValid, fileData) {
				request
					.get('getMessage/common.confirmToSave')
					.then(
						function(response) {
							if (!isValid) {
								return false;
								
							} else if (navigation
								.confirm(response.data.value)) {
								
								
								
								
								
								
								
								

								if (!isValid)
									return false;
								var gen = parseInt(state.msmeDetailData.msmeMpEmptGen, 10);
								var sc = parseInt(state.msmeDetailData.msmeMpScEmptGen, 10);
								var st = parseInt(state.msmeDetailData.msmeMpStEmptGen, 10);
								var obc = parseInt(state.msmeDetailData.msmeMpObcEmptGen, 10);
								var total = parseInt(state.msmeDetailData.totalEmployments, 10);

								var tot = sc + st + obc;

								if (tot > total) {
									alert("Employment given to MP SC Candidates, MP ST Candidates, MP OBC candidates should not be greater than total employment!");
									return false;
								}
								


								var responsePromise = request
									.post(
										'addmsmedetail',
										state.msmeDetailData);

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

											if ((fileData != undefined || fileData != null) && state.responseObject.id != null) {
												var fd = new FormData();
												if (null != state.fileData.employmentGivenUpload) {
													fd.append('employmentGivenUpload', state.fileData.employmentGivenUpload);
												}
												if (state.responseObject.id != null) {
													fd.append('msmeDetailId', state.responseObject.id);

												}
												var responsePromise1 = request.post('uploadMsmeDetailDocument', fd, {
													transformRequest: identity,
													headers: { 'Content-Type': undefined }
												});
												responsePromise1.success(function(data, status, headers, config) {
													
												});
											}
											navigation.location.href = '#viewapplicationlist';
										}
										loading
											.finish('sample-1');
									});
							} else {
								return false;
							}
						});
			};
state.fetchUnitTehsilByDistrict = function(districtId) {

				var responseDistricts = request.get('fetchalltehsilsmap',
					{
						params: {
							'districtId': districtId
						}
					});
				responseDistricts.success(function(data, status,
					headers, config) {
					state.unitTehsils = data;
				});

			};
state.loadMSMEApplicationList = function() {

				loading.start('sample-1');
				fetchMSMEApplications();
			};
state.fetchMSMEDetail = function() {

				state.msmeDetailId = params.msmeDetailId;
				loading.start('sample-1');
				var responsePromise = request
					.get(
						'fetchmsmedetailbyid',
						{
							params: {
								'msmeDetailId': params.msmeDetailId
							}
						});

				responsePromise.success(function(data, status, headers,
					config) {
					state.msmeDetailData = data;
					if (null != data.uamNumber) {
						state.msmeDetailData.uamAvailability = 'yes';
					} else {
						state.msmeDetailData.uamAvailability = 'no';
					}

					var responseIndusAreas = request
						.get('fetchIndustrialAreaList');

					responseIndusAreas.success(function(data, status,
						headers, config) {
						state.industrialAreaList = data;
						loading.finish('sample-1');
					});
					loading.finish('sample-1');
				});

			};
state.fetchMSMEDetailForEdit = function() {

				loading.start('sample-1');
				var responsePromise = request
					.get(
						'fetchmsmedetailbyid',
						{
							params: {
								'msmeDetailId': params.msmeDetailId
							}
						});

				responsePromise
					.success(function(data, status, headers, config) {
						state.msmeDetailData = data;
						state.uamDate = data.uamDate;
						state.productionDate = data.productionDate;
						if (null != data.uamNumber) {
							state.msmeDetailData.uamAvailability = 'yes';
							state.msmeDetailData.udyogAadhaar = "no";
						} else {
							state.msmeDetailData.uamAvailability = 'no';
						}
						if (null != data.activityDetailsList) {
							each(
									data.activityDetailsList,
									function(value, index) {

										var responseUamAct = request
											.get(
												'fetchuamactivitiesbytype',
												{
													params: {
														'activityType': value.activityType
													}
												});
										responseUamAct
											.success(function(
												data,
												status,
												headers,
												config) {
												state.msmeDetailData.activityDetailsList[index].uamActivities = data;
											});
									})
						}

						var responseTehsil = request
							.get(
								'fetchalltehsilsmap',
								{
									params: {
										'districtId': state.msmeDetailData.unitDistrict
									}
								});
						responseTehsil.success(function(data,
							status, headers, config) {
							state.unitTehsils = data;
						});
						loading.finish('sample-1');
					});
			};
state.fetchUamActivitiesByType = function(activityType,
				index) {
				loading.start('sample-1');
				if (null != activityType) {
					var responseDistricts = request.get(
						'fetchuamactivitiesbytype', {
						params: {
							'activityType': activityType + ""
						}
					});
					responseDistricts
						.success(function(data, status, headers,
							config) {
							state.msmeDetailData.activityDetailsList[index].uamActivities = data;
							
						});
				} else {
					state.msmeDetailData.activityDetailsList[index].uamActivities = null;
					state.msmeDetailData.activityDetailsList[index].activityDetail1 = null;
				}
				loading.finish('sample-1');
			};
state.addNewUamDetailsChoice = function() {

				state.msmeDetailData.activityDetailsList.push({});

			};
state.removeUamDetailsChoice = function() {

				var lastItem = state.msmeDetailData.activityDetailsList.length - 1;
				state.msmeDetailData.activityDetailsList
					.splice(lastItem);
			};
state.searchServiceReport = function() {

				state.errorMessage = '';

				state.reportData = '';

				if (state.fromDateInput && state.toDateInput) {

					var fromDate = format('date')(
						state.fromDateInput, 'dd/MM/yyyy');
					var toDate = format('date')(state.toDateInput,
						'dd/MM/yyyy');

					var responsePromise = request.get(
						'fetchserviceenterprisereport', {
						params: {
							'fromDate': fromDate,
							'toDate': toDate
						}
					});

					responsePromise.error(function(data, status,
						headers, config) {
						state.errorMessage = $sce.trustAsHtml(data);

					});

					responsePromise.success(function(data, status,
						headers, config) {
						state.reportData = data;
					});

				} else {
					state.errorMessage = $sce
						.trustAsHtml('Please enter date');
				}

			};
state.searchProductionReport = function() {

				state.errorMessage = '';

				state.reportData = '';

				if (state.fromDateInput && state.toDateInput) {

					var fromDate = format('date')(
						state.fromDateInput, 'dd/MM/yyyy');
					var toDate = format('date')(state.toDateInput,
						'dd/MM/yyyy');

					var responsePromise = request.get(
						'fetchmanufacturingenterprisereport', {
						params: {
							'fromDate': fromDate,
							'toDate': toDate
						}
					});

					responsePromise.error(function(data, status,
						headers, config) {
						state.errorMessage = $sce.trustAsHtml(data);

					});

					responsePromise.success(function(data, status,
						headers, config) {
						state.reportData = data;
					});

				} else {
					state.errorMessage = $sce
						.trustAsHtml('Please enter date');
				}

			};
state.downloadServiceEnterpriseReport = function(
				fromDateInput, toDateInput) {

				var fromDate = state.fromDateInput.split('/')
					.join('-');
				var toDate = state.toDateInput.split('/').join('-');

				navigation.open('downloadserviceenterprisereport/'
					+ fromDate + '/' + toDate);

			};
state.downloadManufacturingEnterpriseReport = function(
				fromDateInput, toDateInput) {

				var fromDate = state.fromDateInput.split('/')
					.join('-');
				var toDate = state.toDateInput.split('/').join('-');

				navigation.open('downloadmanufacturingenterprisereport/'
					+ fromDate + '/' + toDate);

			};
state.validateReportForm1 = function() {
				state.errorMessage = '';
				state.responseObject = '';

				if (state.month && state.year) {
					var responsePromise = request.get('CompleteDataOfLandApplicant', {
						params: {
							month: state.month,
							year: state.year
						}
					});

					responsePromise.success(function(data) {
						state.responseObject = data;
					});

					responsePromise.error(function(data) {
						state.errorMessage = $sce.trustAsHtml(data);
					});

				} else {
					state.errorMessage = $sce.trustAsHtml('Please select month and year');
				}
			};
state.validateReportForm = function() {

				state.errorMessage = '';
				state.responseObject = '';
				if (state.fromDateInput && state.toDateInput) {

					var fromDate = format('date')(
						state.fromDateInput, 'dd/MM/yyyy');
					var toDate = format('date')(state.toDateInput,
						'dd/MM/yyyy');

					var responsePromise = request.get(
						'validatemicrolevelreportform', {
						params: {
							'fromDate': fromDate,
							'toDate': toDate
						}
					});

					responsePromise.error(function(data, status,
						headers, config) {
						state.errorMessage = $sce.trustAsHtml(data);
					});
					responsePromise.success(function(data, status,
						headers, config) {
						state.responseObject = data;
					});

				} else {
					state.errorMessage = $sce
						.trustAsHtml('Please enter date');
				}

			};
state.downloadMicroLevelReport = function() {

				state.errorMessage = '';

				if (state.fromDateInput && state.toDateInput) {

					var fromDate = state.fromDateInput.split('/')
						.join('-');
					var toDate = state.toDateInput.split('/')
						.join('-');

					navigation.open('downloadmicrolevelreport/' + fromDate
						+ '/' + toDate);

				} else {
					state.errorMessage = $sce
						.trustAsHtml('Please enter date');
				}

			};
state.fetchMicroLevelApplicantList = function() {

				if (null != state.fromDateInput
					&& null != state.toDateInput) {
					loading.start('sample-1');
					var fromDate = state.fromDateInput.split('/')
						.join('-');
					var toDate = state.toDateInput.split('/')
						.join('-');
					fetchMicroLevelApplicants(fromDate, toDate);
				}
			};
state.downloadSmallLevelReport = function() {

				state.errorMessage = '';

				if (state.fromDateInput && state.toDateInput) {

					var fromDate = state.fromDateInput.split('/')
						.join('-');
					var toDate = state.toDateInput.split('/')
						.join('-');

					navigation.open('downloadsmalllevelreport/' + fromDate
						+ '/' + toDate);

				} else {
					state.errorMessage = $sce
						.trustAsHtml('Please enter date');
				}

			};
state.fetchSmallLevelApplicantList = function() {

				if (null != state.fromDateInput
					&& null != state.toDateInput) {
					loading.start('sample-1');
					var fromDate = state.fromDateInput.split('/')
						.join('-');
					var toDate = state.toDateInput.split('/')
						.join('-');
					fetchSmallLevelApplicants(fromDate, toDate);
				}
			};
state.downloadMediumLevelReport = function() {

				state.errorMessage = '';

				if (state.fromDateInput && state.toDateInput) {

					var fromDate = state.fromDateInput.split('/')
						.join('-');
					var toDate = state.toDateInput.split('/')
						.join('-');

					navigation.open('downloadmediumlevelreport/'
						+ fromDate + '/' + toDate);

				} else {
					state.errorMessage = $sce
						.trustAsHtml('Please enter date');
				}

			};
state.fetchMediumLevelApplicantList = function() {

				if (null != state.fromDateInput
					&& null != state.toDateInput) {
					loading.start('sample-1');
					var fromDate = state.fromDateInput.split('/')
						.join('-');
					var toDate = state.toDateInput.split('/')
						.join('-');
					fetchMediumLevelApplicants(fromDate, toDate);
				}
			};
state.loadDate = () => {};
}
