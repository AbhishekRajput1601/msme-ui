// Source: angular/dtic/controller.js. Generated static JS, with explicit React IO dependencies.
export function installActions(state, { request, loading, navigation, params, format, later, dom }) {
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,Array.isArray(items) ? Number(k) : k));
const identity = value => value;
const $sce = { trustAsHtml: identity, trustAsResourceUrl: identity };
const fetchDTICBudgetByFY = () => { state.listVersion++; loading.finish(); };
const fetchDTICDemandByFY = () => { state.listVersion++; loading.finish(); };

let lastObjectId="", lastSchemeId="", lastSchemeTypeId="";
state.started = false;
function calculateAmounts() {
				var headsAmount = 0;
				var remainingAmount = 0;

				var schemesAmount = 0;
				each(
						state.budgetData.planningSchemeAmountBeans,
						function(planningSchemeAmountBean) {
							schemesAmount = schemesAmount
								+ Number((planningSchemeAmountBean.schemeAmount == null) ? 0
									: planningSchemeAmountBean.schemeAmount);
							if (state.availableAmount) {
								if (schemesAmount > state.availableAmount) {
									
									request
										.get(
											'getMessage/budget.ho.availableAmount')
										.then(
											function(
												response) {
												alert(response.data.value);
											});
									planningSchemeAmountBean.schemeAmount = planningSchemeAmountBean.schemeAmount
										.slice(0, -1);
								}
								if (planningSchemeAmountBean.availableAmount) {
									if (schemesAmount > planningSchemeAmountBean.availableAmount) {
										
										request
											.get(
												'getMessage/budget.ho.allocatedAvailableAmount')
											.then(
												function(
													response) {
													alert(response.data.value);
												});
										planningSchemeAmountBean.schemeAmount = planningSchemeAmountBean.schemeAmount
											.slice(0, -1);
									}
								}
							}

							var objectsAmount = 0;
							each(
									planningSchemeAmountBean.planningObjectAmountBeans,
									function(
										planningObjectAmountBean) {
										objectsAmount = objectsAmount
											+ Number((planningObjectAmountBean.objectAmount == null) ? 0
												: planningObjectAmountBean.objectAmount);
										if (planningSchemeAmountBean.schemeAmount) {
											if (objectsAmount > planningSchemeAmountBean.schemeAmount) {
												
												request
													.get(
														'getMessage/budget.ho.schemeAmount')
													.then(
														function(
															response) {
															alert(response.data.value);
														});
												planningObjectAmountBean.objectAmount = planningObjectAmountBean.objectAmount
													.slice(
														0,
														-1);
											}
										}
										if (planningObjectAmountBean.availableAmount) {
											if (objectsAmount > planningObjectAmountBean.availableAmount) {
												
												request
													.get(
														'getMessage/budget.ho.allocatedAvailableAmount')
													.then(
														function(
															response) {
															alert(response.data.value);
														});
												planningObjectAmountBean.objectAmount = planningObjectAmountBean.objectAmount
													.slice(
														0,
														-1);
											}
										}
										if (objectsAmount > 0) {
											planningSchemeAmountBean.sa = true;
										} else {
											planningSchemeAmountBean.sa = false;
										}

										var detailsAmount = 0;
										each(
												planningObjectAmountBean.planningDetailAmountBeans,
												function(
													planningDetailAmountBean) {
													detailsAmount = detailsAmount
														+ Number((planningDetailAmountBean.detailAmount == null) ? 0
															: planningDetailAmountBean.detailAmount);
													if (planningObjectAmountBean.objectAmount) {
														if (detailsAmount > planningObjectAmountBean.objectAmount) {
															
															request
																.get(
																	'getMessage/budget.ho.objectAmount')
																.then(
																	function(
																		response) {
																		alert(response.data.value);
																	});
															planningDetailAmountBean.detailAmount = planningDetailAmountBean.detailAmount
																.slice(
																	0,
																	-1);
														}
													}
													if (planningDetailAmountBean.availableAmount) {
														if (detailsAmount > planningDetailAmountBean.availableAmount) {
															
															request
																.get(
																	'getMessage/budget.ho.allocatedAvailableAmount')
																.then(
																	function(
																		response) {
																		alert(response.data.value);
																	});
															planningDetailAmountBean.detailAmount = planningDetailAmountBean.detailAmount
																.slice(
																	0,
																	-1);
														}
													}
													if (detailsAmount > 0) {
														planningObjectAmountBean.oa = true;
													} else {
														planningObjectAmountBean.oa = false;
													}
												});
									});

							headsAmount = headsAmount
								+ Number((planningSchemeAmountBean.schemeAmount == null) ? 0
									: planningSchemeAmountBean.schemeAmount);
						});

				state.headsAmount = headsAmount;
				state.remainingAmount = Number(state.availableAmount)
					- Number(state.headsAmount);
			}
state.startOrStopSpinner = function(isStart) {

				if (isStart) {
					loading.start('sample-1');
				} else {
					loading.finish('sample-1');
				}

			};
state.loadParam = function() {
				

				if (params.financialYearId == undefined) {
					state.financialYearId = '0';
				} else {
					state.financialYearId = params.financialYearId;
					var responsePromise = request
						.get('fetchFinancialYearById/'
							+ state.financialYearId);
					responsePromise.success(function(data, status,
						headers, config) {
						state.financialYear = data.financialYear;
					});
				}

				if (params.quarterId == undefined) {
					state.quarterId = '0';
				} else {
					state.quarterId = params.quarterId;
					var responsePromise = request.get('fetchQuarterById/'
						+ state.quarterId);
					responsePromise.success(function(data, status,
						headers, config) {
						state.quarterName = data.quarterName;
					});
				}

				
			};
state.loadFinancialYear = function() {
				

				var responsePromise = request.get('fetchFinancialYear');
				responsePromise.success(function(data, status, headers,
					config) {
					state.fyList = data;
				});

				if (state.financialYearId == '0') {
					state.financialYearId = '';
				}

				
			};
state.loadQuarter = function() {
				

				var responsePromise = request.get('fetchQuarter');
				responsePromise.success(function(data, status, headers,
					config) {
					state.quarterList = data;
				});

				if (state.quarterId == '0') {
					state.quarterId = '';
				}

				
			};
state.loadDTICBudget = function() {
				loading.start('sample-1');

				if (state.financialYearId == "0") {
					fetchDTICBudgetByFY();
					loading.finish('sample-1');
				} else if (state.financialYearId != "0"
					&& state.quarterId == "0") {
					var responsePromise = request
						.get('fetchDTICBudgetByUserFYId/'
							+ state.financialYearId);
					responsePromise.success(function(data, status,
						headers, config) {
						state.budgetList = data;
						loading.finish('sample-1');
					});
				} else if (state.financialYearId != "0"
					&& state.quarterId != "0") {
					var responsePromise = request
						.get('fetchDTICBudgetByFYQuarterId/'
							+ state.financialYearId + '/'
							+ state.quarterId);
					responsePromise.success(function(data, status,
						headers, config) {
						state.budgetList = data;
						loading.finish('sample-1');
					});
				}
			};
state.loadDTICHeadsBudget = function() {
				state.budgetData = {};

				loading.start('sample-1');

				var responsePromise = request
					.get('fetchDTICHeadsBudgetFYQuarterId/'
						+ state.financialYearId + "/"
						+ state.quarterId);
				responsePromise
					.success(function(data, status, headers, config) {
						state.budgetData.planningSchemeAmountBeans = data.planningSchemeAmountBeans;
						loading.finish('sample-1');
					});
			};
state.loadDTICDemand = function() {
				loading.start('sample-1');

				if (state.financialYearId == "0") {
					fetchDTICDemandByFY();
					loading.finish('sample-1');
				} else {
					var responsePromise = request
						.get('fetchDTICDemandByUserFYId/'
							+ state.financialYearId);
					responsePromise.success(function(data, status,
						headers, config) {
						state.budgetList = data;
						loading.finish('sample-1');
					});
				}
			};
state.calculateAmounts = function() {
				calculateAmounts();
			};
state.newLoadDTICDemandHeadsBudget = function() {
				state.budgetData = {};

				state.availableAmount = 0;
				state.headsAmount = 0;
				state.remainingAmount = 0;

				loading.start('sample-1');

				state.budgetData.planningSchemeAmountBeans = [{}];

				var responsePromise = request.get('fetchSchemeType');
				responsePromise.success(function(data, status, headers,
					config) {
					state.stList = data;
				});

				loading.finish('sample-1');
			};
state.viewLoadDTICDemandHeadsBudget = function() {
				state.budgetData = {};

				state.availableAmount = 0;
				state.headsAmount = 0;
				state.remainingAmount = 0;

				loading.start('sample-1');

				var responsePromise = request.get('fetchSchemeType');
				responsePromise.success(function(data, status, headers,
					config) {
					state.stList = data;
				});

				var responsePromise = request.get('fetchDTICDemandById/'
					+ params.dticDemandId);
				responsePromise
					.success(function(data, status, headers, config) {
						state.budgetData = data;

						state.budgetData.financialYearId = state.budgetData.financialYearId
							+ "";
						state.budgetData.quarterId = state.budgetData.quarterId
							+ "";
						state.documentDesc = state.budgetData.documentDesc;
						state.availableAmount = data.amount;

						state.budgetData.planningSchemeAmountBeans = data.planningSchemeAmountBeans;
						each(
								state.budgetData.planningSchemeAmountBeans,
								function(
									planningSchemeAmountBean) {
									planningSchemeAmountBean.schemeTypeId = planningSchemeAmountBean.schemeTypeId
										+ "";

									var responsePromise = request
										.get('fetchSchemes/'
											+ planningSchemeAmountBean.schemeTypeId);
									responsePromise
										.success(function(
											data,
											status,
											headers,
											config) {
											planningSchemeAmountBean.snList = data;
											planningSchemeAmountBean.schemeId = planningSchemeAmountBean.schemeId
												+ "";
											if (planningSchemeAmountBean.planningObjectAmountBeans == "") {
												state
													.loadObjects(planningSchemeAmountBean);
											}

											each(
													planningSchemeAmountBean.planningObjectAmountBeans,
													function(
														planningObjectAmountBean) {
														var responsePromise = request
															.get('fetchObjects/'
																+ planningSchemeAmountBean.schemeId);
														responsePromise
															.success(function(
																data,
																status,
																headers,
																config) {
																planningObjectAmountBean.ocList = data;
																planningObjectAmountBean.objectId = planningObjectAmountBean.objectId
																	+ "";
																if (planningObjectAmountBean.planningDetailAmountBeans == "") {
																	state
																		.loadDetails(planningObjectAmountBean);
																}

																each(
																		planningObjectAmountBean.planningDetailAmountBeans,
																		function(
																			planningDetailAmountBean) {
																			var responsePromise = request
																				.get('fetchDetails/'
																					+ planningObjectAmountBean.objectId);
																			responsePromise
																				.success(function(
																					data,
																					status,
																					headers,
																					config) {
																					planningDetailAmountBean.dcList = data;
																					planningDetailAmountBean.detailId = planningDetailAmountBean.detailId
																						+ "";
																				});
																		});

															});
													});
										});
								});
						loading.finish('sample-1');
					});
			};
state.printLoadDTICDemandHeadsBudget = function() {
				state.budgetData = {};

				state.availableAmount = 0;
				state.headsAmount = 0;
				state.remainingAmount = 0;

				loading.start('sample-1');

				var responsePromise = request.get('fetchDTICDemandById/'
					+ params.dticDemandId);
				responsePromise
					.success(
						function(data, status, headers, config) {
							state.budgetData = data;

							state.budgetData.financialYearId = state.budgetData.financialYearId
								+ "";
							state.budgetData.quarterId = state.budgetData.quarterId
								+ "";
							state.documentDesc = state.budgetData.documentDesc;
							state.availableAmount = data.amount;

							state.budgetData.planningSchemeAmountBeans = data.planningSchemeAmountBeans;
							loading.finish('sample-1');
						})
					.then(
						function() {
							state
								.generateTableArray(state.budgetData.planningSchemeAmountBeans);
						});
			};
state.addDTICHeadsDemandBudget = function(isValid) {
				if (!isValid) {
					return false;
				}

				request
					.get('getMessage/common.confirmToSave')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								loading.start('sample-1');

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

								state.budgetData.amount = state.availableAmount;

								var responsePromise = request
									.post(
										'addDTICHeadsDemandBudget',
										state.budgetData);
								responsePromise
									.success(
										function(
											data,
											status,
											headers,
											config) {
											fd
												.append(
													'dticDemandId',
													data);
										})
									.then(
										function() {
											var responsePromise = request
												.post(
													'updateDemandByDocument',
													fd,
													{
														transformRequest: identity,
														headers: {
															'Content-Type': undefined
														}
													});
											responsePromise
												.success(function(
													data,
													status,
													headers,
													config) {
													state.responseObject = data;
													if (state.responseObject.successMessage != null) {
														later(
															function() {
																state.responseObject.successMessage = null;
															},
															5000);
														navigation.location.href = '#/demandBudgetDetails';
													}
													loading
														.finish('sample-1');
												});
										});
								
							}
						});
			};
state.updateDTICHeadsDemandBudget = function(isValid) {
				if (!isValid) {
					return false;
				}

				request
					.get('getMessage/common.confirmToSave')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								loading.start('sample-1');

								state.budgetData.dticDemandId = params.dticDemandId;
								state.budgetData.amount = state.availableAmount;

								if (state.document) {
									var responsePromise = request
										.post(
											'updateDTICHeadsDemandBudget',
											state.budgetData);
									responsePromise
										.success(
											function(
												data,
												status,
												headers,
												config) {
												state.responseObject = data;
												if (state.responseObject.errorMessage != null) {
													later(
														function() {
															state.responseObject.errorMessage = null;
														},
														5000);
												}
											})
										.then(
											function() {
												var fd = new FormData();

												fd
													.append(
														'document',
														state.document);

												if (state.documentDesc) {
													fd
														.append(
															'documentDesc',
															state.documentDesc);
												}

												fd
													.append(
														'dticDemandId',
														params.dticDemandId);

												var responsePromise = request
													.post(
														'updateDemandByDocument',
														fd,
														{
															transformRequest: identity,
															headers: {
																'Content-Type': undefined
															}
														});
												responsePromise
													.success(function(
														data,
														status,
														headers,
														config) {
														state.responseObject = data;
														if (state.responseObject.successMessage != null) {
															later(
																function() {
																	state.responseObject.successMessage = null;
																},
																5000);
															navigation.location.href = '#/demandBudgetDetails/'
																+ state.budgetData.financialYearId;
														}
														loading
															.finish('sample-1');
													});
											});
								} else {
									var responsePromise = request
										.post(
											'updateDTICHeadsDemandBudget',
											state.budgetData);
									responsePromise
										.success(function(
											data,
											status,
											headers,
											config) {
											state.responseObject = data;
											if (state.responseObject.successMessage != null) {
												later(
													function() {
														state.responseObject.successMessage = null;
													},
													5000);
												navigation.location.href = '#/demandBudgetDetails/'
													+ state.budgetData.financialYearId;
											}
											loading
												.finish('sample-1');
										});
								}
							}
						});
			};
state.loadDTICHeadsUsesSurrenderBudget = function() {
				state.budgetData = {};

				loading.start('sample-1');

				var responsePromise = request
					.get('fetchDTICHeadsUsesSurrenderBudgetFYQuarterId/'
						+ state.financialYearId
						+ "/"
						+ state.quarterId);
				responsePromise
					.success(function(data, status, headers, config) {
						state.budgetData.planningSchemeAmountBeans = data.planningSchemeAmountBeans;
						loading.finish('sample-1');
					});

				state.budgetData.planningDocuments = [{}];
			};
state.loadDTICHeadsUsesSurrenderBudgetPrint = function() {
				state.budgetData = {};

				loading.start('sample-1');

				var responsePromise = request
					.get('fetchDTICHeadsUsesSurrenderBudgetFYQuarterId/'
						+ state.financialYearId
						+ "/"
						+ state.quarterId);
				responsePromise
					.success(
						function(data, status, headers, config) {
							state.budgetData = data;
							state.budgetData.planningSchemeAmountBeans = data.planningSchemeAmountBeans;
							loading.finish('sample-1');
						})
					.then(
						function() {
							state
								.generateTableArray(state.budgetData.planningSchemeAmountBeans);
						});

				state.budgetData.planningDocuments = [{}];
			};
state.updateDTICHeadsUsesSurrenderBudget = function(
				isValid) {
				if (!isValid) {
					return false;
				}

				request
					.get('getMessage/common.confirmToSave')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								loading.start('sample-1');

								state.budgetData.financialYearId = state.financialYearId;
								state.budgetData.quarterId = state.quarterId;

								var responsePromise = request
									.post(
										'updateDTICHeadsUsesSurrenderBudget',
										state.budgetData);
								responsePromise
									.success(
										function(
											data,
											status,
											headers,
											config) {
											state.responseObject = data;
											if (state.responseObject.successMessage != null) {
												later(
													function() {
														state.responseObject.successMessage = null;
													},
													5000);
												navigation.location.href = '#/usesSurrenderDetails/'
													+ state.financialYearId;
											}
											loading
												.finish('sample-1');
										}).then(
											function() {
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
												
											});
							}
						});
			};
state.loadlastSchemeTypeId = function(
				planningSchemeAmountBean) {
				lastSchemeTypeId = (planningSchemeAmountBean.schemeTypeId == undefined || planningSchemeAmountBean.schemeTypeId == null) ? ""
					: planningSchemeAmountBean.schemeTypeId;
			};
state.loadSchemes = function(planningSchemeAmountBean) {
				loading.start('sample-1');

				request
					.get('getMessage/common.confirmToChange')
					.then(
						function(response) {
							if ((lastSchemeTypeId != "") ? confirm(response.data.value)
								: true) {
								if (planningSchemeAmountBean.schemeTypeId) {
									var responsePromise = request
										.get('fetchSchemes/'
											+ planningSchemeAmountBean.schemeTypeId);
									responsePromise
										.success(function(
											data,
											status,
											headers,
											config) {
											if (data.length > 0) {
												planningSchemeAmountBean.schemeId = '';
												planningSchemeAmountBean.snList = data;
												planningSchemeAmountBean.planningObjectAmountBeans = [];
											}
										});
								}
							} else {
								planningSchemeAmountBean.schemeTypeId = lastSchemeTypeId;
							}
						});

				loading.finish('sample-1');
			};
state.loadSchemeAvailableAmount = function(
				planningSchemeAmountBean) {
				loading.start('sample-1');

				planningSchemeAmountBean.availableAmount = 0;
				var responsePromise = request.get('fetchSchemeAmount/'
					+ state.financialYearId + "/"
					+ state.quarterId + "/"
					+ planningSchemeAmountBean.schemeId);
				responsePromise.success(function(data, status, headers,
					config) {
					planningSchemeAmountBean.availableAmount = data;
					loading.finish('sample-1');
				});
			};
state.verifySchemeSelection = function(
				planningSchemeAmountBean, planningSchemeAmountBeans) {
				var selectedSchemeId = planningSchemeAmountBean.schemeId;
				var selectedSchemeCounter = 0;

				for (var i = 0; i < planningSchemeAmountBeans.length; i++) {
					if (planningSchemeAmountBeans[i].schemeId == selectedSchemeId) {
						selectedSchemeCounter++;
					}
				}

				if (selectedSchemeCounter > 1) {
					
					request.get('getMessage/budget.ho.schemeSeleted')
						.then(function(response) {
							alert(response.data.value);
						});
					planningSchemeAmountBean.schemeId = "";
				}

				state.loadObjects(planningSchemeAmountBean);
			};
state.loadlastSchemeId = function(planningSchemeAmountBean) {
				lastSchemeId = (planningSchemeAmountBean.schemeId == undefined || planningSchemeAmountBean.schemeId == null) ? ""
					: planningSchemeAmountBean.schemeId;
			};
state.loadObjects = function(planningSchemeAmountBean) {
				loading.start('sample-1');

				request
					.get('getMessage/common.confirmToChange')
					.then(
						function(response) {
							if ((lastSchemeId != "") ? confirm(response.data.value)
								: true) {
								planningSchemeAmountBean.planningObjectAmountBeans = [];
								if (planningSchemeAmountBean.schemeId) {
									var responsePromise = request
										.get('fetchObjects/'
											+ planningSchemeAmountBean.schemeId);
									responsePromise
										.success(function(
											data,
											status,
											headers,
											config) {
											if (data.length > 0) {
												planningSchemeAmountBean.planningObjectAmountBeans = [{}];
												var lastItem = planningSchemeAmountBean.planningObjectAmountBeans.length - 1;
												planningSchemeAmountBean.planningObjectAmountBeans[lastItem].ocList = data;
											} else {
												planningSchemeAmountBean.sa = false;
											}
										});
								}
							} else {
								planningSchemeAmountBean.schemeId = lastSchemeId;
							}
						});

				loading.finish('sample-1');
			};
state.loadObjectAvailableAmount = function(
				planningSchemeAmountBean, planningObjectAmountBean) {
				loading.start('sample-1');

				planningObjectAmountBean.availableAmount = 0;
				var responsePromise = request.get('fetchObjectAmount/'
					+ state.financialYearId + "/"
					+ state.quarterId + "/"
					+ planningObjectAmountBean.objectId + "/"
					+ planningSchemeAmountBean.schemeId);
				responsePromise.success(function(data, status, headers,
					config) {
					planningObjectAmountBean.availableAmount = data;
				});

				loading.finish('sample-1');
			};
state.verifyObjectSelection = function(
				planningObjectAmountBean, planningObjectAmountBeans) {
				var selectedObjectId = planningObjectAmountBean.objectId;
				var selectedObjectCounter = 0;

				for (var i = 0; i < planningObjectAmountBeans.length; i++) {
					if (planningObjectAmountBeans[i].objectId == selectedObjectId) {
						selectedObjectCounter++;
					}
				}

				if (selectedObjectCounter > 1) {
					
					request.get('getMessage/budget.ho.objectSeleted')
						.then(function(response) {
							alert(response.data.value);
						});
					planningObjectAmountBean.objectId = "";
				}

				state.loadDetails(planningObjectAmountBean);
			};
state.loadlastObjectId = function(planningObjectAmountBean) {
				lastObjectId = (planningObjectAmountBean.objectId == undefined || planningObjectAmountBean.objectId == null) ? ""
					: planningObjectAmountBean.objectId;
			};
state.loadDetails = function(planningObjectAmountBean) {
				loading.start('sample-1');

				request
					.get('getMessage/common.confirmToChange')
					.then(
						function(response) {
							if ((lastObjectId != "") ? confirm(response.data.value)
								: true) {
								planningObjectAmountBean.planningDetailAmountBeans = [];
								if (planningObjectAmountBean.objectId) {
									var responsePromise = request
										.get('fetchDetails/'
											+ planningObjectAmountBean.objectId);
									responsePromise
										.success(function(
											data,
											status,
											headers,
											config) {
											if (data.length > 0) {
												planningObjectAmountBean.planningDetailAmountBeans = [{}];
												var lastItem = planningObjectAmountBean.planningDetailAmountBeans.length - 1;
												planningObjectAmountBean.planningDetailAmountBeans[lastItem].dcList = data;
											} else {
												planningObjectAmountBean.oa = false;
											}
										});
								}
							} else {
								planningObjectAmountBean.objectId = lastObjectId;
							}
						});

				loading.finish('sample-1');
			};
state.loadDetailAvailableAmount = function(
				planningSchemeAmountBean, planningObjectAmountBean,
				planningDetailAmountBean) {
				loading.start('sample-1');

				planningDetailAmountBean.availableAmount = 0;
				var responsePromise = request.get('fetchDetailAmount/'
					+ state.financialYearId + "/"
					+ state.quarterId + "/"
					+ planningDetailAmountBean.detailId + "/"
					+ planningObjectAmountBean.objectId + "/"
					+ planningSchemeAmountBean.schemeId);
				responsePromise.success(function(data, status, headers,
					config) {
					planningDetailAmountBean.availableAmount = data;
				});

				loading.finish('sample-1');
			};
state.verifyDetailSelection = function(
				planningDetailAmountBean, planningDetailAmountBeans) {
				var selectedDetailId = planningDetailAmountBean.detailId;
				var selectedDetailCounter = 0;

				for (var i = 0; i < planningDetailAmountBeans.length; i++) {
					if (planningDetailAmountBeans[i].detailId == selectedDetailId) {
						selectedDetailCounter++;
					}
				}

				if (selectedDetailCounter > 1) {
					
					request.get('getMessage/budget.ho.detailSeleted')
						.then(function(response) {
							alert(response.data.value);
						});
					planningDetailAmountBean.detailId = "";
				}
			};
state.addScheme = function() {
				state.budgetData.planningSchemeAmountBeans.push({});
				
				
				
			};
state.removeScheme = function() {
				request
					.get('getMessage/budget.ho.removeScheme')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								var lastItem = state.budgetData.planningSchemeAmountBeans.length - 1;
								state.budgetData.planningSchemeAmountBeans
									.splice(lastItem);
							}
						});
			};
state.addObject = function(planningSchemeAmountBean) {
				planningSchemeAmountBean.planningObjectAmountBeans
					.push({});
				var length = planningSchemeAmountBean.planningObjectAmountBeans.length;
				planningSchemeAmountBean.planningObjectAmountBeans[length - 1].ocList = planningSchemeAmountBean.planningObjectAmountBeans[length - 2].ocList;
			};
state.removeObject = function(planningSchemeAmountBean) {
				request
					.get('getMessage/budget.ho.removeScheme')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								var lastItem = planningSchemeAmountBean.planningObjectAmountBeans.length - 1;
								planningSchemeAmountBean.planningObjectAmountBeans
									.splice(lastItem);
							}
						});
			};
state.addDetail = function(planningObjectAmountBean) {
				planningObjectAmountBean.planningDetailAmountBeans
					.push({});
				var length = planningObjectAmountBean.planningDetailAmountBeans.length;
				planningObjectAmountBean.planningDetailAmountBeans[length - 1].dcList = planningObjectAmountBean.planningDetailAmountBeans[length - 2].dcList;
			};
state.removeDetail = function(planningObjectAmountBean) {
				request
					.get('getMessage/budget.ho.removeScheme')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								var lastItem = planningObjectAmountBean.planningDetailAmountBeans.length - 1;
								planningObjectAmountBean.planningDetailAmountBeans
									.splice(lastItem);
							}
						});
			};
state.addDocument = function() {
				state.budgetData.planningDocuments.push({});
			};
state.removeDocument = function() {
				request
					.get('getMessage/budget.ho.removeScheme')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								var lastItem = state.budgetData.planningDocuments.length - 1;
								state.budgetData.planningDocuments
									.splice(lastItem);
							}
						});
			};
state.getBudgetTotalAmount = function() {
				var total = 0;
				for (var i = 0; i < state.budgetList.length; i++) {
					var budget = state.budgetList[i];
					total += (budget.amount);
				}
				return total;
			};
state.downloadDocument = function(documentId) {
				navigation.open('downloaddocument/' + documentId);
			};
state.generateTableArray = function(
				planningSchemeAmountBeans) {

				var tableArray = [];

				for (var i in planningSchemeAmountBeans) {
					var sLength = 0;
					var sPreSet = false;
					if (planningSchemeAmountBeans[i].planningObjectAmountBeans.length == 0) {
						sLength++;
					}
					for (var j in planningSchemeAmountBeans[i].planningObjectAmountBeans) {
						if (planningSchemeAmountBeans[i].planningObjectAmountBeans[j].planningDetailAmountBeans.length == 0) {
							sLength++;
						}
						for (var k in planningSchemeAmountBeans[i].planningObjectAmountBeans[j].planningDetailAmountBeans) {
							sLength++;
						}
					}

					if (planningSchemeAmountBeans[i].planningObjectAmountBeans.length == 0) {
						var row = {};
						row.sType = planningSchemeAmountBeans[i].schemeType;
						row.sName = planningSchemeAmountBeans[i].schemeName;
						row.sAmount = planningSchemeAmountBeans[i].schemeAmount;
						row.sDate = planningSchemeAmountBeans[i].allocationDate;
						row.sAllocatedAmount = planningSchemeAmountBeans[i].allocatedSchemeAmount;
						row.sUsedAmount = planningSchemeAmountBeans[i].usedSchemeAmount;
						row.sSurrenderAmount = planningSchemeAmountBeans[i].surrenderSchemeAmount;

						row.oCode = "";
						row.oAmount = "";
						row.oDate = "";
						row.oAllocatedAmount = "";
						row.oUsedAmount = "";
						row.oSurrenderAmount = "";

						row.dCode = "";
						row.dAmount = "";
						row.dDate = "";
						row.dAllocatedAmount = "";
						row.dUsedAmount = "";
						row.dSurrenderAmount = "";

						row.sLength = 1;
						row.oLength = 1;

						tableArray.push(row);
					}
					for (var j in planningSchemeAmountBeans[i].planningObjectAmountBeans) {
						var oLength = 0;
						var oPreSet = false;
						oLength = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].planningDetailAmountBeans.length;

						if (planningSchemeAmountBeans[i].planningObjectAmountBeans[j].planningDetailAmountBeans.length == 0) {
							var row = {};
							row.sType = planningSchemeAmountBeans[i].schemeType;
							row.sName = planningSchemeAmountBeans[i].schemeName;
							row.sAmount = planningSchemeAmountBeans[i].schemeAmount;
							row.sDate = planningSchemeAmountBeans[i].allocationDate;
							row.sAllocatedAmount = planningSchemeAmountBeans[i].allocatedSchemeAmount;
							row.sUsedAmount = planningSchemeAmountBeans[i].usedSchemeAmount;
							row.sSurrenderAmount = planningSchemeAmountBeans[i].surrenderSchemeAmount;

							row.oCode = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].objectName;
							row.oAmount = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].objectAmount;
							row.oDate = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].allocationDate;
							row.oAllocatedAmount = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].allocatedObjectAmount;
							row.oUsedAmount = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].usedObjectAmount;
							row.oSurrenderAmount = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].surrenderObjectAmount;

							row.dCode = "";
							row.dAmount = "";
							row.dDate = "";
							row.dAllocatedAmount = "";
							row.dUsedAmount = "";
							row.dSurrenderAmount = "";

							if (sPreSet == false) {
								row.sLength = sLength;
								sPreSet = true;
							}
							row.oLength = 1;

							tableArray.push(row);
						}
						for (var k in planningSchemeAmountBeans[i].planningObjectAmountBeans[j].planningDetailAmountBeans) {
							var row = {};
							row.sType = planningSchemeAmountBeans[i].schemeType;
							row.sName = planningSchemeAmountBeans[i].schemeName;
							row.sAmount = planningSchemeAmountBeans[i].schemeAmount;
							row.sDate = planningSchemeAmountBeans[i].allocationDate;
							row.sAllocatedAmount = planningSchemeAmountBeans[i].allocatedSchemeAmount;
							row.sUsedAmount = planningSchemeAmountBeans[i].usedSchemeAmount;
							row.sSurrenderAmount = planningSchemeAmountBeans[i].surrenderSchemeAmount;

							row.oCode = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].objectName;
							row.oAmount = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].objectAmount;
							row.oDate = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].allocationDate;
							row.oAllocatedAmount = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].allocatedObjectAmount;
							row.oUsedAmount = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].usedObjectAmount;
							row.oSurrenderAmount = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].surrenderObjectAmount;

							row.dCode = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].planningDetailAmountBeans[k].detailName;
							row.dAmount = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].planningDetailAmountBeans[k].detailAmount;
							row.dDate = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].planningDetailAmountBeans[k].allocationDate;
							row.dAllocatedAmount = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].planningDetailAmountBeans[k].allocatedDetailAmount;
							row.dUsedAmount = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].planningDetailAmountBeans[k].usedDetailAmount;
							row.dSurrenderAmount = planningSchemeAmountBeans[i].planningObjectAmountBeans[j].planningDetailAmountBeans[k].surrenderDetailAmount;

							if (sPreSet == false) {
								row.sLength = sLength;
								sPreSet = true;
							}

							if (oPreSet == false) {
								row.oLength = oLength;
								oPreSet = true;
							}

							tableArray.push(row);
						}
					}
				}
				
				state.tableArray = tableArray;
			};
state.loadDate = () => {};
}
