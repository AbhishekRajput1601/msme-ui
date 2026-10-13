// Source: angular/dtic/controller.js. Generated static JS, with explicit React IO dependencies.
export function installActions(state, { request, loading, navigation, params, format, later, dom }) {
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,Array.isArray(items) ? Number(k) : k));
const identity = value => value;
const fetchInspectionOffices = () => { state.listVersion++; loading.finish(); };
let lastObjectId="", lastSchemeId="", lastSchemeTypeId="";
state.started = false;
state.startOrStopSpinner = function(isStart) {

				if (isStart) {
					loading.start('sample-1');
				} else {
					loading.finish('sample-1');
				}

			};
state.loadOfficers = function() {

				loading.start('sample-1');

				var responsePromise = request.get('fetchOfficersList');
				responsePromise.success(function(data, status, headers,
					config) {
					state.officers = data;

					loading.finish('sample-1');
				});

			};
state.loadUserById = function(prevInspectionBean) {

				loading.start('sample-1');

				
				var responsePromise = request.get('fetchUserDetails/', {
					params: {
						'userId': prevInspectionBean.officerId
					}
				});
				responsePromise.success(function(data, status, headers,
					config) {
					prevInspectionBean.designation = data.designation;

					loading.finish('sample-1');
				});

			};
state.loadDesignation = function() {

				loading.start('sample-1');

				var responsePromise = request
					.get('fetchDesignationByGroup/'
						+ 'coordination');
				responsePromise.success(function(data, status, headers,
					config) {
					state.designations = data;

					loading.finish('sample-1');
				});

			};
state.loadFinancialYear = function(beanObject) {
				loading.start('sample-1');

				var responsePromise = request.get('fetchFinancialYear');
				responsePromise.success(function(data, status, headers,
					config) {
					state.fyList = data;
				});

				if (beanObject.financialYearId != undefined) {
					beanObject.financialYearId = beanObject.financialYearId
						+ "";
				}

				loading.finish('sample-1');
			};
state.loadSelfEmploymentScheme = function(beanObject) {
				loading.start('sample-1');

				var responsePromise = request
					.get('fetchSelfEmploymentSchemes');
				responsePromise.success(function(data, status, headers,
					config) {
					state.seList = data;
				});

				if (beanObject.schemeId != undefined) {
					beanObject.schemeId = beanObject.schemeId + "";
				}

				loading.finish('sample-1');
			};
state.loadInspectionOffices = function() {
				loading.start('sample-1');

				fetchInspectionOffices();
			};
state.loadDTICRoster = function() {
				loading.start('sample-1');

				state.coordinationData = {};

				var responsePromise = request.get('fetchDTICRoster/'
					+ params.inspectionOfficeId);
				responsePromise
					.success(function(data, status, headers, config) {
						if (data.inspectionOfficeBean != ""
							|| data.inspectionOfficeBean == null) {
							state.coordinationData.inspectionOfficeBean = data.inspectionOfficeBean;
						}

						if (data.prevInspectionBeans == ""
							|| data.prevInspectionBeans == null) {
							state.coordinationData.prevInspectionBeans = [{}];
						} else {
							state.coordinationData.prevInspectionBeans = data.prevInspectionBeans;
						}

						if (data.angSanctionedBeans == ""
							|| data.angSanctionedBeans == null) {
							state.coordinationData.angSanctionedBeans = [{}];
						} else {
							state.coordinationData.angSanctionedBeans = data.angSanctionedBeans;
						}

						if (data.pensionCasesBeans == ""
							|| data.pensionCasesBeans == null) {
							state.coordinationData.pensionCasesBeans = [{}];
						} else {
							state.coordinationData.pensionCasesBeans = data.pensionCasesBeans;
						}

						if (data.confidentialInfoBeans == ""
							|| data.confidentialInfoBeans == null) {
							state.coordinationData.confidentialInfoBeans = [{}];
						} else {
							state.coordinationData.confidentialInfoBeans = data.confidentialInfoBeans;
						}

						if (data.computerHardwareBeans == ""
							|| data.computerHardwareBeans == null) {
							state.coordinationData.computerHardwareBeans = [{}];
						} else {
							state.coordinationData.computerHardwareBeans = data.computerHardwareBeans;
						}

						if (data.schemeGoalsBeans == ""
							|| data.schemeGoalsBeans == null) {
							state.coordinationData.schemeGoalsBeans = [{}];
						} else {
							state.coordinationData.schemeGoalsBeans = data.schemeGoalsBeans;
						}

						if (data.amountInfoBeans == ""
							|| data.amountInfoBeans == null) {
							state.coordinationData.amountInfoBeans = [{}];
						} else {
							state.coordinationData.amountInfoBeans = data.amountInfoBeans;
						}

						if (data.msmeInfoBeans == ""
							|| data.msmeInfoBeans == null) {
							state.coordinationData.msmeInfoBeans = [{}];
						} else {
							state.coordinationData.msmeInfoBeans = data.msmeInfoBeans;
						}

						if (data.campsInfoBeans == ""
							|| data.campsInfoBeans == null) {
							state.coordinationData.campsInfoBeans = [{}];
						} else {
							state.coordinationData.campsInfoBeans = data.campsInfoBeans;
						}

						if (data.powerloomInfoBeans == ""
							|| data.powerloomInfoBeans == null) {
							state.coordinationData.powerloomInfoBeans = [{}];
						} else {
							state.coordinationData.powerloomInfoBeans = data.powerloomInfoBeans;
						}

						if (data.schemesCaseBeans == ""
							|| data.schemesCaseBeans == null) {
							state.coordinationData.schemesCaseBeans = [{}];
						} else {
							state.coordinationData.schemesCaseBeans = data.schemesCaseBeans;
						}

						if (data.recoveriesInfoBean != ""
							|| data.recoveriesInfoBean == null) {
							state.coordinationData.recoveriesInfoBean = data.recoveriesInfoBean;
						}

						if (data.rrcInfoBeans == ""
							|| data.rrcInfoBeans == null) {
							state.coordinationData.rrcInfoBeans = [{}];
						} else {
							state.coordinationData.rrcInfoBeans = data.rrcInfoBeans;
						}

						if (data.developmentWorkBeans == ""
							|| data.developmentWorkBeans == null) {
							state.coordinationData.developmentWorkBeans = [{}];
						} else {
							state.coordinationData.developmentWorkBeans = data.developmentWorkBeans;
						}

						if (data.exporterInfoBeans == ""
							|| data.exporterInfoBeans == null) {
							state.coordinationData.exporterInfoBeans = [{}];
						} else {
							state.coordinationData.exporterInfoBeans = data.exporterInfoBeans;
						}

						if (data.auditObjectionsBeans == ""
							|| data.auditObjectionsBeans == null) {
							state.coordinationData.auditObjectionsBeans = [{}];
						} else {
							state.coordinationData.auditObjectionsBeans = data.auditObjectionsBeans;
						}

						if (data.overdueAuditBeans == ""
							|| data.overdueAuditBeans == null) {
							state.coordinationData.overdueAuditBeans = [{}];
						} else {
							state.coordinationData.overdueAuditBeans = data.overdueAuditBeans;
						}

						if (data.edpTrainingBeans == ""
							|| data.edpTrainingBeans == null) {
							state.coordinationData.edpTrainingBeans = [{}];
						} else {
							state.coordinationData.edpTrainingBeans = data.edpTrainingBeans;
						}

						if (data.courtCasesBeans == ""
							|| data.courtCasesBeans == null) {
							state.coordinationData.courtCasesBeans = [{}];
						} else {
							state.coordinationData.courtCasesBeans = data.courtCasesBeans;
						}

						if (data.complaintsBeans == ""
							|| data.complaintsBeans == null) {
							state.coordinationData.complaintsBeans = [{}];
						} else {
							state.coordinationData.complaintsBeans = data.complaintsBeans;
						}

						if (data.rtiBeans == ""
							|| data.rtiBeans == null) {
							state.coordinationData.rtiBeans = [{}];
						} else {
							state.coordinationData.rtiBeans = data.rtiBeans;
						}

						if (data.psgBeans == ""
							|| data.psgBeans == null) {
							state.coordinationData.psgBeans = [{}];
						} else {
							state.coordinationData.psgBeans = data.psgBeans;
						}

						if (data.cmHelplineBeans == ""
							|| data.cmHelplineBeans == null) {
							state.coordinationData.cmHelplineBeans = [{}];
						} else {
							state.coordinationData.cmHelplineBeans = data.cmHelplineBeans;
						}

						if (data.pendingQaacBeans == ""
							|| data.pendingQaacBeans == null) {
							state.coordinationData.pendingQaacBeans = [{}];
						} else {
							state.coordinationData.pendingQaacBeans = data.pendingQaacBeans;
						}
						loading.finish('sample-1');
					});
			};
state.loadDTICRosterForPrint = function() {
				loading.start('sample-1');

				var responsePromise = request.get('fetchDTICRoster/'
					+ params.inspectionOfficeId);
				responsePromise.success(function(data, status, headers,
					config) {
					state.coordinationData = data;
					loading.finish('sample-1');
				});
			};
state.updateRoster = function(isValid) {
				if (!isValid) {
					return false;
				}

				request
					.get('getMessage/common.confirmToSave')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								loading.start('sample-1');

								var responsePromise = request
									.post(
										'updateRoster',
										state.coordinationData);
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
											navigation.location.href = '#/inspectionDetails';
										}
										loading
											.finish('sample-1');
									});
							}
						});
			};
state.submitRoster = function(isValid) {
				if (!isValid) {
					return false;
				}

				request
					.get('getMessage/common.confirmToSave')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								loading.start('sample-1');

								var responsePromise = request
									.post(
										'submitRoster',
										state.coordinationData);
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
											navigation.location.href = '#/inspectionDetails';
										}
										loading
											.finish('sample-1');
									});
							}
						});
			};
state.updateInspectionOffice = function(isValid) {
				if (!isValid) {
					return false;
				}

				request
					.get('getMessage/common.confirmToSave')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								var fd = new FormData(
									state.coordinationData);

								fd
									.append(
										'inspectionOfficeId',
										params.inspectionOfficeId);

								if (state.coordinationData.inspectionOfficeBean) {
									if (state.coordinationData.inspectionOfficeBean.dticCompliance) {
										fd
											.append(
												'dticCompliance',
												state.coordinationData.inspectionOfficeBean.dticCompliance);
									}
								}

								loading.start('sample-1');

								var responsePromise = request
									.post(
										'updateInspectionOffice',
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
											navigation.location.href = '#/inspectionDetails';
										}
										loading
											.finish('sample-1');
									});
							}
						});
			};
state.addObject = function(object) {
				object.push({});
			};
state.removeObject = function(object, index) {
				request.get('getMessage/budget.ho.removeScheme').then(
					function(response) {
						
						if (confirm(response.data.value)) {
							object.splice(index, 1);
						}
					});
			};
state.loadDate = () => {};
}
