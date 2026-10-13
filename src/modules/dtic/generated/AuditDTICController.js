// Source: angular/dtic/controller.js. Generated static JS, with explicit React IO dependencies.
export function installActions(state, { request, loading, navigation, params, format, later, dom }) {
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,Array.isArray(items) ? Number(k) : k));
const identity = value => value;
const fetchInternalAuditList = () => { state.listVersion++; loading.finish(); };
const fetchExternalAuditListForDTIC = () => { state.listVersion++; loading.finish(); };
const fetchFactualDetailListForDTIC = () => { state.listVersion++; loading.finish(); };
const fetchProformaClauseListForDTIC = () => { state.listVersion++; loading.finish(); };
let lastObjectId="", lastSchemeId="", lastSchemeTypeId="";
state.started = false;
state.startOrStopSpinner = function(isStart) {

				if (isStart) {
					loading.start('sample-1');
				} else {
					loading.finish('sample-1');
				}

			};
state.loadInternalAuditList = function() {
				loading.start('sample-1');

				fetchInternalAuditList();
			};
state.loadExternalAuditListForDTIC = function() {
				loading.start('sample-1');

				fetchExternalAuditListForDTIC();
			};
state.loadViewInternalAudit = function() {
				loading.start('sample-1');

				
				
				
				var responsePromise = request
					.get('fetchInternalAuditById/'
						+ params.rosterId);
				responsePromise
					.success(
						function(data, status, headers, config) {
							state.auditInternalData = data;
							loading.finish('sample-1');
						})
					.then(
						function() {
							state
								.generateTableArray(state.auditInternalData.auditInternalBeanList);
						});
			};
state.loadDTICExternalAuditEnterOpinion = function() {
				loading.start('sample-1');

				var responsePromise = request.get(
					'fetchExternalAuditById', {
					params: {
						'rosterId': params.rosterId
					}
				});
				responsePromise.success(function(data, status, headers,
					config) {
					state.auditExternalData = data;
					loading.finish('sample-1');
				});
			};
state.saveDTICOpinionExternalAudit = function(isValid) {
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
										'saveDTICOpinionExternalAudit',
										state.auditExternalData);
								responsePromise
									.success(function(data,
										status,
										headers, config) {
										state.responseObject = data;
										if (state.responseObject.errorMsgList != null) {
											var fd = new FormData();
											fd
												.append(
													'requestProcessIds',
													state.responseObject.errorMsgList);
											if (state.document) {
												fd
													.append(
														'document',
														state.document);
											}
											if (state.documentDesc) {
												fd
													.append(
														'documentDesc',
														state.documentDesc);
											}

											var docUploadPromise = request
												.post(
													'saveDTICOpinionExternalAuditDocument',
													fd,
													{
														transformRequest: identity,
														headers: {
															'Content-Type': undefined
														}
													});

											docUploadPromise
												.success(function(
													data,
													status,
													headers,
													config) {
													later(
														function() {
															state.responseObject.successMessage = null;
														},
														5000);
													navigation.location.href = '#/externalauditlist';
													loading
														.finish('sample-1');
												});
										}

										
									});
							}
						});
			};
state.loadDTICInternalAuditEnterOpinion = function() {
				loading.start('sample-1');

				var responsePromise = request
					.get('fetchInternalAuditById/'
						+ params.rosterId);
				responsePromise.success(function(data, status, headers,
					config) {
					state.auditInternalData = data;
					loading.finish('sample-1');
				});
			};
state.saveDTICOpinionInternalAudit = function(isValid) {
				if (!isValid) {
					return false;
				}

				request
					.get('getMessage/common.confirmToSave')
					.then(
						function(response) {
							
							if (confirm(response.data.value)) {
								loading.start('sample-1');

								state.auditInternalData.rosterId = params.rosterId;
								var responsePromise = request
									.post(
										'saveDTICOpinionInternalAudit',
										state.auditInternalData);
								responsePromise
									.success(function(data,
										status,
										headers, config) {
										state.responseObject = data;
										if (state.responseObject.errorMsgList != null) {
											var fd = new FormData();
											fd
												.append(
													'requestProcessIds',
													state.responseObject.errorMsgList);
											if (state.document) {
												fd
													.append(
														'document',
														state.document);
											}
											if (state.documentDesc) {
												fd
													.append(
														'documentDesc',
														state.documentDesc);
											}

											var docUploadPromise = request
												.post(
													'saveDTICOpinionInternalAuditDocument',
													fd,
													{
														transformRequest: identity,
														headers: {
															'Content-Type': undefined
														}
													});

											docUploadPromise
												.success(function(
													data,
													status,
													headers,
													config) {
													later(
														function() {
															state.responseObject.successMessage = null;
														},
														5000);
													navigation.location.href = '#/internalAuditList';
													loading
														.finish('sample-1');
												});
										}
										
									});
							}
						});
			};
state.loadFactualDetailListForDTIC = function() {
				loading.start('sample-1');

				fetchFactualDetailListForDTIC();
			};
state.loadDTICFactualDetailEnterOpinion = function() {
				loading.start('sample-1');

				var responsePromise = request
					.get(
						'fetchFactualDetailById',
						{
							params: {
								'factualDetailId': params.factualDetailId
							}
						});
				responsePromise.success(function(data, status, headers,
					config) {
					state.factualDetailData = data;
					loading.finish('sample-1');
				});
			};
state.saveDTICOpinionFactualDetail = function(isValid) {
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
								if (state.factualDetailData.deptSerialNo) {
									fd
										.append(
											'deptSerialNo',
											state.factualDetailData.deptSerialNo);
								}
								if (state.factualDetailData.deptDate) {
									fd
										.append(
											'deptDate',
											state.factualDetailData.deptDate);
								}
								if (state.factualDetailData.deptComments) {
									fd
										.append(
											'deptComments',
											state.factualDetailData.deptComments);
								}
								if (state.factualDetailData.deptReply) {
									fd
										.append(
											'deptReply',
											state.factualDetailData.deptReply);
								}
								if (state.factualDetailData.factualDetailId) {
									fd
										.append(
											'factualDetailId',
											state.factualDetailData.factualDetailId);
								}

								var responsePromise = request
									.post(
										'saveDTICOpinionFactualDetail',
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
											navigation.location.href = '#/factualdetaillist';
										}
										loading
											.finish('sample-1');
									});
							}
						});
			};
state.loadProformaClauseListForDTIC = function() {
				loading.start('sample-1');

				fetchProformaClauseListForDTIC();
			};
state.loadDTICProformaClauseEnterOpinion = function() {
				loading.start('sample-1');

				var responsePromise = request.get(
					'fetchProformaClauseById', {
					params: {
						'proformaId': params.proformaId
					}
				});
				responsePromise.success(function(data, status, headers,
					config) {
					state.proformaClauseData = data;
					loading.finish('sample-1');
				});
			};
state.saveDTICOpinionProformaClause = function(isValid) {
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
								if (state.proformaClauseData.deptSerialNo) {
									fd
										.append(
											'deptSerialNo',
											state.proformaClauseData.deptSerialNo);
								}
								if (state.proformaClauseData.deptDate) {
									fd
										.append(
											'deptDate',
											state.proformaClauseData.deptDate);
								}
								if (state.proformaClauseData.deptComments) {
									fd
										.append(
											'deptComments',
											state.proformaClauseData.deptComments);
								}
								if (state.proformaClauseData.deptReply) {
									fd
										.append(
											'deptReply',
											state.proformaClauseData.deptReply);
								}
								if (state.proformaClauseData.proformaId) {
									fd
										.append(
											'proformaId',
											state.proformaClauseData.proformaId);
								}

								var responsePromise = request
									.post(
										'saveDTICOpinionProformaClause',
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
											navigation.location.href = '#/proformaclauselist';
										}
										loading
											.finish('sample-1');
									});
							}
						});
			};
state.downloadDocument = function(documentId) {
				navigation.open('downloadauditdocument/' + documentId);
			};
state.loadViewProformaClause = function() {
				loading.start('sample-1');

				var responsePromise = request.get(
					'fetchProformaClauseById', {
					params: {
						'proformaId': params.proformaId
					}
				});
				responsePromise
					.success(
						function(data, status, headers, config) {
							state.proformaClauseData = data;
							loading.finish('sample-1');
						})
					.then(
						function() {
							state
								.generateTableArrayForExternalAuditProforma(state.proformaClauseData);
						});
			};
state.loadViewExternalAudit = function() {
				loading.start('sample-1');

				var responsePromise = request.get(
					'fetchExternalAuditById', {
					params: {
						'rosterId': params.rosterId
					}
				});
				responsePromise
					.success(
						function(data, status, headers, config) {
							state.auditExternalData = data;
							loading.finish('sample-1');
						})
					.then(
						function() {
							state
								.generateTableArrayForExternalAuditAG(state.auditExternalData);
						});
			};
state.loadViewFactualDetail = function() {
				loading.start('sample-1');

				var responsePromise = request
					.get(
						'fetchFactualDetailById',
						{
							params: {
								'factualDetailId': params.factualDetailId
							}
						});
				responsePromise
					.success(
						function(data, status, headers, config) {
							state.factualDetailData = data;
							loading.finish('sample-1');
						})
					.then(
						function() {
							state
								.generateTableArrayForExternalAuditFactual(state.factualDetailData);
						});
			};
state.doTheBack = function() {
				window.history.back();
			};
state.generateTableArray = function(auditInternalBeanList) {
				var tableArray = [];

				for (var i in auditInternalBeanList) {

					var row = {};
					row.sNo = parseInt(i) + 1;

					var processBeanCount = 0;
					for (var j in auditInternalBeanList[i].processBeanList) {
						processBeanCount = (auditInternalBeanList[i].processBeanList[j].icComments) ? processBeanCount + 3
							: processBeanCount + 1;
						processBeanCount++;
					}
					var docCount = 0;
					for (var k in auditInternalBeanList[i].processBeanList) {
						if (auditInternalBeanList[i].processBeanList[k].documentId) {
							docCount = docCount + 1;
						}
					}
					row.processLength = processBeanCount + docCount + 1;

					row.auditDateFrom = auditInternalBeanList[i].auditDateFrom;
					row.auditDateTo = auditInternalBeanList[i].auditDateTo;
					row.applicationId = auditInternalBeanList[i].applicationId;
					row.auditDetails = auditInternalBeanList[i].auditDetails;
					tableArray.push(row);

					for (var j in auditInternalBeanList[i].processBeanList) {
						var row = {};
						if (auditInternalBeanList[i].processBeanList[j].dticComments) {
							row.dticComments = auditInternalBeanList[i].processBeanList[j].dticComments;
						}
						if (auditInternalBeanList[i].processBeanList[j].zonalComments) {
							row.zonalComments = auditInternalBeanList[i].processBeanList[j].zonalComments;
						}
						tableArray.push(row);

						if (auditInternalBeanList[i].processBeanList[j].icComments) {
							var row = {};
							row.icOpinionStatus = auditInternalBeanList[i].processBeanList[j].icOpinionStatus;
							tableArray.push(row);

							var row = {};
							row.icComments = auditInternalBeanList[i].processBeanList[j].icComments;
							tableArray.push(row);
						}

						if (auditInternalBeanList[i].processBeanList[j].documentId) {
							var row = {};
							row.documentId = auditInternalBeanList[i].processBeanList[j].documentId;
							row.documentName = auditInternalBeanList[i].processBeanList[j].documentName;
							row.documentDesc = auditInternalBeanList[i].processBeanList[j].documentDesc;
							tableArray.push(row);
						}

						var row = {};
						row.blank = "blank";
						tableArray.push(row);
					}
				}
				

				state.tableArray = tableArray;
			};
state.generateTableArrayForExternalAuditAG = function(
				auditExternalData) {
				console.log(auditExternalData);

				var auditExternalBeanList = auditExternalData.auditExternalBeanList;
				var tableArray = [];

				for (var i in auditExternalBeanList) {
					var row = {};
					row.sNo = parseInt(i) + 1;

					var processBeanCount = 0;
					var docCount = 0;
					var factualCount = 0;
					var proformaCount = 0;
					var cagCount = 0;
					var pacCount = 0;
					for (var j in auditExternalBeanList[i].processBeanList) {
						processBeanCount = (auditExternalBeanList[i].processBeanList[j].agSentSerialNo) ? processBeanCount + 4
							: processBeanCount + 1;
						if (auditExternalBeanList[i].processBeanList[j].documentId) {
							docCount = docCount + 1;
						}
					}
					if (auditExternalBeanList[i].auditFactualDetailStatusBean) {
						factualCount = 6;
						if (auditExternalBeanList[i].auditFactualDetailStatusBean.documentId) {
							factualCount = factualCount + 1;
						}
						for (var j in auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList) {
							if (auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].deptSerialNo) {
								factualCount = factualCount + 2;
							}
							if (auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].deptComments) {
								factualCount = factualCount + 1;
							}
							if (auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].directorComments) {
								factualCount = factualCount + 1;
							}

							if (auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].agOpinionStatus) {
								factualCount = factualCount + 4;
							}
							if (auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].documentId) {
								factualCount = factualCount + 1;
							}
						}
					}
					if (auditExternalBeanList[i].proformaClauseBean) {
						proformaCount = 6;
						if (auditExternalBeanList[i].proformaClauseBean.documentId) {
							proformaCount = proformaCount + 1;
						}
						for (var j in auditExternalBeanList[i].proformaClauseBean.processBeanList) {
							if (auditExternalBeanList[i].proformaClauseBean.processBeanList[j].deptSerialNo) {
								proformaCount = proformaCount + 2;
							}
							if (auditExternalBeanList[i].proformaClauseBean.processBeanList[j].deptComments) {
								proformaCount = proformaCount + 1;
							}
							if (auditExternalBeanList[i].proformaClauseBean.processBeanList[j].directorComments) {
								proformaCount = proformaCount + 1;
							}
							if (auditExternalBeanList[i].proformaClauseBean.processBeanList[j].agOpinionStatus) {
								proformaCount = proformaCount + 4;
							}
							if (auditExternalBeanList[i].proformaClauseBean.processBeanList[j].documentId) {
								proformaCount = proformaCount + 1;
							}
						}

						if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean) {
							cagCount = 2;
							if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.documentId) {
								cagCount = cagCount + 1;
							}
							for (var j in auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList) {
								if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].statusId == 11
									|| auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].statusId == 19) {
									cagCount = cagCount + 3;
								}
								if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].statusId == 6
									|| auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].statusId == 16
									|| auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].statusId == 20) {
									cagCount = cagCount + 4;
								}
								if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].documentId) {
									cagCount = cagCount + 1;
								}
							}
						}

						if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean) {
							pacCount = 4;
							if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.documentId) {
								pacCount = pacCount + 1;
							}
							for (var j in auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans) {
								if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].statusId == 18) {
									pacCount = pacCount + 3;
								}
								if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].statusId == 6) {
									pacCount = pacCount + 4;
								}
								if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].documentId) {
									pacCount = pacCount + 1;
								}
							}
						}
					}

					row.processLength = processBeanCount + docCount
						+ factualCount + proformaCount + cagCount
						+ pacCount + 1;

					row.auditDateFrom = auditExternalBeanList[i].auditDateFrom;
					row.auditDateTo = auditExternalBeanList[i].auditDateTo;
					row.applicationId = auditExternalBeanList[i].applicationId;
					row.auditDetails = auditExternalBeanList[i].auditDetails;

					tableArray.push(row);

					for (var j in auditExternalBeanList[i].processBeanList) {
						var row = {};
						if (auditExternalBeanList[i].processBeanList[j].dticComments) {
							row.dticComments = auditExternalBeanList[i].processBeanList[j].dticComments;
						}
						if (auditExternalBeanList[i].processBeanList[j].zonalComments) {
							row.zonalComments = auditExternalBeanList[i].processBeanList[j].zonalComments;
						}
						if (auditExternalBeanList[i].processBeanList[j].icComments) {
							row.icComments = auditExternalBeanList[i].processBeanList[j].icComments;
						}
						tableArray.push(row);

						if (auditExternalBeanList[i].processBeanList[j].agSentSerialNo) {
							var row = {};
							row.agSent = true;
							tableArray.push(row);

							var row = {};
							row.agSentSerialNo = auditExternalBeanList[i].processBeanList[j].agSentSerialNo;
							row.agSentDate = auditExternalBeanList[i].processBeanList[j].agSentDate;
							tableArray.push(row);

							var row = {};
							row.agOpinionStatus = auditExternalBeanList[i].processBeanList[j].agOpinionStatus;
							row.agRemark = auditExternalBeanList[i].processBeanList[j].agRemark;
							tableArray.push(row);
						}
						if (auditExternalBeanList[i].processBeanList[j].documentId) {
							var row = {};
							row.documentId = auditExternalBeanList[i].processBeanList[j].documentId;
							row.documentName = auditExternalBeanList[i].processBeanList[j].documentName;
							row.documentDesc = auditExternalBeanList[i].processBeanList[j].documentDesc;
							tableArray.push(row);
						}
					}

					if (auditExternalBeanList[i].auditFactualDetailStatusBean) {
						var row = {};
						row.factualDetails = true;
						tableArray.push(row);

						var row = {};
						row.factualDetailsReceipt = true;
						tableArray.push(row);

						var row = {};
						row.factualDetailReceiptNo = auditExternalBeanList[i].auditFactualDetailStatusBean.factualDetailReceiptNo;
						row.factualDetailReceiptDate = auditExternalBeanList[i].auditFactualDetailStatusBean.factualDetailReceiptDate;
						tableArray.push(row);

						var row = {};
						row.factualAuditReportClause = true;
						tableArray.push(row);

						var row = {};
						row.factualClauseNo = auditExternalBeanList[i].auditFactualDetailStatusBean.clauseNo;
						row.factualDeptName = auditExternalBeanList[i].auditFactualDetailStatusBean.deptName;
						tableArray.push(row);

						var row = {};
						row.factualClauseDetails = auditExternalBeanList[i].auditFactualDetailStatusBean.clauseDetails;
						tableArray.push(row);

						if (auditExternalBeanList[i].auditFactualDetailStatusBean.documentId) {
							var row = {};
							row.factualDocumentId = auditExternalBeanList[i].auditFactualDetailStatusBean.documentId;
							row.factualDocumentName = auditExternalBeanList[i].auditFactualDetailStatusBean.documentName;
							row.factualDocumentDesc = auditExternalBeanList[i].auditFactualDetailStatusBean.documentDesc;
							tableArray.push(row);
						}

						for (var j in auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList) {
							if (auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].deptSerialNo) {
								var row = {};
								row.tDept = true;
								tableArray.push(row);

								var row = {};
								row.tDeptSerialNo = auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].deptSerialNo;
								row.tDeptDate = auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].deptDate;
								tableArray.push(row);
							}

							if (auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].deptComments) {
								var row = {};
								row.tDeptComments = auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].deptComments;
								tableArray.push(row);
							}

							if (auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].directorComments) {
								var row = {};
								row.tDirectorComments = auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].directorComments;
								tableArray.push(row);
							}

							if (auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].agOpinionStatus) {
								var row = {};
								row.tAgOpinion = true;
								tableArray.push(row);

								var row = {};
								row.tAgSentSerialNo = auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].agSentSerialNo;
								row.tAgSentDate = auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].agSentDate;
								tableArray.push(row);

								var row = {};
								row.tAgOpinionStatus = auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].agOpinionStatus;
								tableArray.push(row);

								var row = {};
								row.tAgRemark = auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].agRemark;
								tableArray.push(row);
							}

							if (auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].documentId) {
								var row = {};
								row.factualProcessDocumentId = auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].documentId;
								row.factualProcessDocumentName = auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].documentName;
								row.factualProcessDocumentDesc = auditExternalBeanList[i].auditFactualDetailStatusBean.processBeanList[j].documentDesc;
								tableArray.push(row);
							}
						}
					}

					if (auditExternalBeanList[i].proformaClauseBean) {
						var row = {};
						row.proformaClause = true;
						tableArray.push(row);

						var row = {};
						row.proformaDispatch = true;
						tableArray.push(row);

						var row = {};
						row.proformaDispatchNo = auditExternalBeanList[i].proformaClauseBean.dispatchNo;
						row.proformaDispatchDate = auditExternalBeanList[i].proformaClauseBean.dispatchDate;
						tableArray.push(row);

						var row = {};
						row.proformaFactualDetails = true;
						tableArray.push(row);

						var row = {};
						row.proformaClauseNo = auditExternalBeanList[i].proformaClauseBean.auditClauseNo;
						row.proformaDeptName = auditExternalBeanList[i].proformaClauseBean.deptName;
						tableArray.push(row);

						var row = {};
						row.proformaClauseDetails = auditExternalBeanList[i].proformaClauseBean.auditClauseDetails;
						tableArray.push(row);

						if (auditExternalBeanList[i].proformaClauseBean.documentId) {
							var row = {};
							row.proformaDocumentId = auditExternalBeanList[i].proformaClauseBean.documentId;
							row.proformaDocumentName = auditExternalBeanList[i].proformaClauseBean.documentName;
							row.proformaDocumentDesc = auditExternalBeanList[i].proformaClauseBean.documentDesc;
							tableArray.push(row);
						}
						for (var j in auditExternalBeanList[i].proformaClauseBean.processBeanList) {
							if (auditExternalBeanList[i].proformaClauseBean.processBeanList[j].deptSerialNo) {
								var row = {};
								row.pDept = true;
								tableArray.push(row);

								var row = {};
								row.pDeptSerialNo = auditExternalBeanList[i].proformaClauseBean.processBeanList[j].deptSerialNo;
								row.pDeptDate = auditExternalBeanList[i].proformaClauseBean.processBeanList[j].deptDate;
								tableArray.push(row);
							}

							if (auditExternalBeanList[i].proformaClauseBean.processBeanList[j].deptComments) {
								var row = {};
								row.pDeptComments = auditExternalBeanList[i].proformaClauseBean.processBeanList[j].deptComments;
								tableArray.push(row);
							}

							if (auditExternalBeanList[i].proformaClauseBean.processBeanList[j].directorComments) {
								var row = {};
								row.pDirectorComments = auditExternalBeanList[i].proformaClauseBean.processBeanList[j].directorComments;
								tableArray.push(row);
							}

							if (auditExternalBeanList[i].proformaClauseBean.processBeanList[j].agOpinionStatus) {
								var row = {};
								row.pAgOpinion = true;
								tableArray.push(row);

								var row = {};
								row.pAgSentSerialNo = auditExternalBeanList[i].proformaClauseBean.processBeanList[j].agSentSerialNo;
								row.pAgSentDate = auditExternalBeanList[i].proformaClauseBean.processBeanList[j].agSentDate;
								tableArray.push(row);

								var row = {};
								row.pAgOpinionStatus = auditExternalBeanList[i].proformaClauseBean.processBeanList[j].agOpinionStatus;
								tableArray.push(row);

								var row = {};
								row.pAgRemark = auditExternalBeanList[i].proformaClauseBean.processBeanList[j].agRemark;
								tableArray.push(row);
							}

							if (auditExternalBeanList[i].proformaClauseBean.processBeanList[j].documentId) {
								var row = {};
								row.proformaProcessDocumentId = auditExternalBeanList[i].proformaClauseBean.processBeanList[j].documentId;
								row.proformaProcessDocumentName = auditExternalBeanList[i].proformaClauseBean.processBeanList[j].documentName;
								row.proformaProcessDocumentDesc = auditExternalBeanList[i].proformaClauseBean.processBeanList[j].documentDesc;
								tableArray.push(row);
							}
						}

						if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean) {
							var row = {};
							row.cagIndiaReport = true;
							tableArray.push(row);

							var row = {};
							row.cagReportYear = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.reportYear;
							row.cagDeptRelatedClause = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.deptRelatedClause;
							tableArray.push(row);

							if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.documentId) {
								var row = {};
								row.cagDocumentId = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.documentId;
								row.cagDocumentName = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.documentName;
								row.cagDocumentDesc = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.documentDesc;
								tableArray.push(row);
							}

							for (var j in auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList) {
								if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].statusId == 11
									|| auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].statusId == 19) {
									var row = {};
									row.cICComments = true;
									tableArray.push(row);

									var row = {};
									row.cICOpinion = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].comments;
									tableArray.push(row);

									var row = {};
									row.cSerialNo = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].serialNo;
									row.cDecisionDate = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].decisionDate;
									tableArray.push(row);
								}
								if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].statusId == 6
									|| auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].statusId == 16
									|| auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].statusId == 20) {
									var row = {};
									row.cGovtForward = true;
									tableArray.push(row);

									var row = {};
									row.cGovSerialNo = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].serialNo;
									row.cGovDecisionDate = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].decisionDate;
									tableArray.push(row);

									var row = {};
									row.cGovAssemblySecretariat = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].comments;
									tableArray.push(row);

									var row = {};
									row.cGovAGOpinionRemark = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].remarks;
									tableArray.push(row);
								}
								if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].documentId) {
									var row = {};
									row.cagProcessDocumentId = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].documentId;
									row.cagProcessDocumentName = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].documentName;
									row.cagProcessDocumentDesc = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.cagReportProcessBeanList[j].documentDesc;
									tableArray.push(row);
								}
							}

							if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean) {
								var row = {};
								row.pacReport = true;
								tableArray.push(row);

								var row = {};
								row.pacReportNo = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.pacReportNo;
								row.pacReportDate = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.pacReportDate;
								tableArray.push(row);

								var row = {};
								row.pacClauseNo = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.clauseNo;
								tableArray.push(row);

								var row = {};
								row.pacClauseDetails = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.clauseDetails;
								tableArray.push(row);

								if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.documentId) {
									var row = {};
									row.pacDocumentId = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.documentId;
									row.pacDocumentName = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.documentName;
									row.pacDocumentDesc = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.documentDesc;
									tableArray.push(row);
								}
								for (var j in auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans) {
									if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].statusId == 18) {
										var row = {};
										row.pICComments = true;
										tableArray.push(row);

										var row = {};
										row.pICOpinion = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].comments;
										tableArray.push(row);

										var row = {};
										row.pSerialNo = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].serialNo;
										row.pDecisionDate = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].decisionDate;
										tableArray.push(row);
									}
									if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].statusId == 6) {
										var row = {};
										row.pLAReport = true;
										tableArray.push(row);

										var row = {};
										row.pLAOpinion = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].comments;
										tableArray.push(row);

										var row = {};
										row.pLASerialNo = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].serialNo;
										row.pLADecisionDate = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].decisionDate;
										tableArray.push(row);

										var row = {};
										row.pLARemark = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].remarks;
										tableArray.push(row);
									}
									if (auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].documentId) {
										var row = {};
										row.pacProcessDocumentId = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].documentId;
										row.pacProcessDocumentName = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].documentName;
										row.pacProcessDocumentDesc = auditExternalBeanList[i].proformaClauseBean.auditCagReportBean.auditPacReportBean.processBeans[j].documentDesc;
										tableArray.push(row);
									}
								}
							}
						}
					}
				}

				state.tableArray = tableArray;
			};
state.generateTableArrayForExternalAuditFactual = function(
				auditExternalData) {
				console.log(auditExternalData);

				var tableArray = [];

				var row = {};
				row.auditDateFrom = auditExternalData.auditExternalBean.auditDateFrom;
				row.auditDateTo = auditExternalData.auditExternalBean.auditDateTo;
				row.applicationId = auditExternalData.auditExternalBean.applicationId;
				row.auditDetails = auditExternalData.auditExternalBean.auditDetails;
				tableArray.push(row);

				if (auditExternalData.auditExternalBean.documentId) {
					var row = {};
					row.documentId = auditExternalData.auditExternalBean.documentId;
					row.documentName = auditExternalData.auditExternalBean.documentName;
					row.documentDesc = auditExternalData.auditExternalBean.documentDesc;
					tableArray.push(row);
				}

				for (var i in auditExternalData.auditExternalBean.processBeanList) {
					var row = {};
					if (auditExternalData.auditExternalBean.processBeanList[i].dticComments) {
						row.dticComments = auditExternalData.auditExternalBean.processBeanList[i].dticComments;
					}
					if (auditExternalData.auditExternalBean.processBeanList[i].zonalComments) {
						row.zonalComments = auditExternalData.auditExternalBean.processBeanList[i].zonalComments;
					}
					if (auditExternalData.auditExternalBean.processBeanList[i].icComments) {
						row.icComments = auditExternalData.auditExternalBean.processBeanList[i].icComments;
					}
					tableArray.push(row);

					if (auditExternalData.auditExternalBean.processBeanList[i].agSentSerialNo) {
						var row = {};
						row.agSent = true;
						tableArray.push(row);

						var row = {};
						row.agSentSerialNo = auditExternalData.auditExternalBean.processBeanList[i].agSentSerialNo;
						row.agSentDate = auditExternalData.auditExternalBean.processBeanList[i].agSentDate;
						tableArray.push(row);

						var row = {};
						row.agOpinionStatus = auditExternalData.auditExternalBean.processBeanList[i].agOpinionStatus;
						row.agRemark = auditExternalData.auditExternalBean.processBeanList[i].agRemark;
						tableArray.push(row);
					}

					if (auditExternalData.auditExternalBean.processBeanList[i].documentId) {
						var row = {};
						row.processDocumentId = auditExternalData.auditExternalBean.processBeanList[i].documentId;
						row.processDocumentName = auditExternalData.auditExternalBean.processBeanList[i].documentName;
						row.processDocumentDesc = auditExternalData.auditExternalBean.processBeanList[i].documentDesc;
						tableArray.push(row);
					}
				}

				if (auditExternalData.factualDetailReceiptNo) {
					var row = {};
					row.factualDetails = true;
					tableArray.push(row);

					var row = {};
					row.factualDetailsReceipt = true;
					tableArray.push(row);

					var row = {};
					row.factualDetailReceiptNo = auditExternalData.factualDetailReceiptNo;
					row.factualDetailReceiptDate = auditExternalData.factualDetailReceiptDate;
					tableArray.push(row);

					var row = {};
					row.factualAuditReportClause = true;
					tableArray.push(row);

					var row = {};
					row.factualClauseNo = auditExternalData.clauseNo;
					row.factualDeptName = auditExternalData.deptName;
					tableArray.push(row);

					var row = {};
					row.factualClauseDetails = auditExternalData.clauseDetails;
					tableArray.push(row);

					if (auditExternalData.documentId) {
						var row = {};
						row.factualDocumentId = auditExternalData.documentId;
						row.factualDocumentName = auditExternalData.documentName;
						row.factualDocumentDesc = auditExternalData.documentDesc;
						tableArray.push(row);
					}

					for (var j in auditExternalData.processBeanList) {
						if (auditExternalData.processBeanList[j].deptSerialNo) {
							var row = {};
							row.tDept = true;
							tableArray.push(row);

							var row = {};
							row.tDeptSerialNo = auditExternalData.processBeanList[j].deptSerialNo;
							row.tDeptDate = auditExternalData.processBeanList[j].deptDate;
							tableArray.push(row);
						}

						if (auditExternalData.processBeanList[j].deptComments) {
							var row = {};
							row.tDeptComments = auditExternalData.processBeanList[j].deptComments;
							tableArray.push(row);
						}

						if (auditExternalData.processBeanList[j].directorComments) {
							var row = {};
							row.tDirectorComments = auditExternalData.processBeanList[j].directorComments;
							tableArray.push(row);
						}

						if (auditExternalData.processBeanList[j].agOpinionStatus) {
							var row = {};
							row.tAgOpinion = true;
							tableArray.push(row);

							var row = {};
							row.tAgSentSerialNo = auditExternalData.processBeanList[j].agSentSerialNo;
							row.tAgSentDate = auditExternalData.processBeanList[j].agSentDate;
							tableArray.push(row);

							var row = {};
							row.tAgOpinionStatus = auditExternalData.processBeanList[j].agOpinionStatus;
							tableArray.push(row);

							var row = {};
							row.tAgRemark = auditExternalData.processBeanList[j].agRemark;
							tableArray.push(row);
						}

						if (auditExternalData.processBeanList[j].documentId) {
							var row = {};
							row.factualProcessDocumentId = auditExternalData.processBeanList[j].documentId;
							row.factualProcessDocumentName = auditExternalData.processBeanList[j].documentName;
							row.factualProcessDocumentDesc = auditExternalData.processBeanList[j].documentDesc;
							tableArray.push(row);
						}
					}
				}

				state.tableArray = tableArray;
			};
state.onPreviousRegistrationNameChange = function() {

				state.previousRegistrationValueRequired = false;

				if (state.msmeDetailData.previousRegistrationName != 'NONE') {
					state.previousRegistrationValueRequired = true;
				}

			};
state.generateTableArrayForExternalAuditProforma = function(
				auditExternalData) {
				console.log(auditExternalData);

				var tableArray = [];

				var row = {};
				row.auditDateFrom = auditExternalData.factualDetailStatusBean.auditExternalBean.auditDateFrom;
				row.auditDateTo = auditExternalData.factualDetailStatusBean.auditExternalBean.auditDateTo;
				row.applicationId = auditExternalData.factualDetailStatusBean.auditExternalBean.applicationId;
				row.auditDetails = auditExternalData.factualDetailStatusBean.auditExternalBean.auditDetails;
				tableArray.push(row);

				if (auditExternalData.factualDetailStatusBean.auditExternalBean.documentId) {
					var row = {};
					row.documentId = auditExternalData.factualDetailStatusBean.auditExternalBean.documentId;
					row.documentName = auditExternalData.factualDetailStatusBean.auditExternalBean.documentName;
					row.documentDesc = auditExternalData.factualDetailStatusBean.auditExternalBean.documentDesc;
					tableArray.push(row);
				}

				for (var i in auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList) {
					var row = {};
					if (auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].dticComments) {
						row.dticComments = auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].dticComments;
					}
					if (auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].zonalComments) {
						row.zonalComments = auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].zonalComments;
					}
					if (auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].icComments) {
						row.icComments = auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].icComments;
					}
					tableArray.push(row);

					if (auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agSentSerialNo) {
						var row = {};
						row.agSent = true;
						tableArray.push(row);

						var row = {};
						row.agSentSerialNo = auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agSentSerialNo;
						row.agSentDate = auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agSentDate;
						tableArray.push(row);

						var row = {};
						row.agOpinionStatus = auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agOpinionStatus;
						row.agRemark = auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agRemark;
						tableArray.push(row);
					}

					if (auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].documentId) {
						var row = {};
						row.processDocumentId = auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].documentId;
						row.processDocumentName = auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].documentName;
						row.processDocumentDesc = auditExternalData.factualDetailStatusBean.auditExternalBean.processBeanList[i].documentDesc;
						tableArray.push(row);
					}

				}

				if (auditExternalData.factualDetailStatusBean.factualDetailReceiptNo) {
					var row = {};
					row.factualDetails = true;
					tableArray.push(row);

					var row = {};
					row.factualDetailsReceipt = true;
					tableArray.push(row);

					var row = {};
					row.factualDetailReceiptNo = auditExternalData.factualDetailStatusBean.factualDetailReceiptNo;
					row.factualDetailReceiptDate = auditExternalData.factualDetailStatusBean.factualDetailReceiptDate;
					tableArray.push(row);

					var row = {};
					row.factualAuditReportClause = true;
					tableArray.push(row);

					var row = {};
					row.factualClauseNo = auditExternalData.factualDetailStatusBean.clauseNo;
					row.factualDeptName = auditExternalData.factualDetailStatusBean.deptName;
					tableArray.push(row);

					var row = {};
					row.factualClauseDetails = auditExternalData.factualDetailStatusBean.clauseDetails;
					tableArray.push(row);

					if (auditExternalData.factualDetailStatusBean.documentId) {
						var row = {};
						row.factualDocumentId = auditExternalData.factualDetailStatusBean.documentId;
						row.factualDocumentName = auditExternalData.factualDetailStatusBean.documentName;
						row.factualDocumentDesc = auditExternalData.factualDetailStatusBean.documentDesc;
						tableArray.push(row);
					}

					for (var j in auditExternalData.factualDetailStatusBean.processBeanList) {
						if (auditExternalData.factualDetailStatusBean.processBeanList[j].deptSerialNo) {
							var row = {};
							row.tDept = true;
							tableArray.push(row);

							var row = {};
							row.tDeptSerialNo = auditExternalData.factualDetailStatusBean.processBeanList[j].deptSerialNo;
							row.tDeptDate = auditExternalData.factualDetailStatusBean.processBeanList[j].deptDate;
							tableArray.push(row);
						}

						if (auditExternalData.factualDetailStatusBean.processBeanList[j].deptComments) {
							var row = {};
							row.tDeptComments = auditExternalData.factualDetailStatusBean.processBeanList[j].deptComments;
							tableArray.push(row);
						}

						if (auditExternalData.factualDetailStatusBean.processBeanList[j].directorComments) {
							var row = {};
							row.tDirectorComments = auditExternalData.factualDetailStatusBean.processBeanList[j].directorComments;
							tableArray.push(row);
						}

						if (auditExternalData.factualDetailStatusBean.processBeanList[j].agOpinionStatus) {
							var row = {};
							row.tAgOpinion = true;
							tableArray.push(row);

							var row = {};
							row.tAgSentSerialNo = auditExternalData.factualDetailStatusBean.processBeanList[j].agSentSerialNo;
							row.tAgSentDate = auditExternalData.factualDetailStatusBean.processBeanList[j].agSentDate;
							tableArray.push(row);

							var row = {};
							row.tAgOpinionStatus = auditExternalData.factualDetailStatusBean.processBeanList[j].agOpinionStatus;
							tableArray.push(row);

							var row = {};
							row.tAgRemark = auditExternalData.factualDetailStatusBean.processBeanList[j].agRemark;
							tableArray.push(row);
						}

						if (auditExternalData.factualDetailStatusBean.processBeanList[j].documentId) {
							var row = {};
							row.factualProcessDocumentId = auditExternalData.factualDetailStatusBean.processBeanList[j].documentId;
							row.factualProcessDocumentName = auditExternalData.factualDetailStatusBean.processBeanList[j].documentName;
							row.factualProcessDocumentDesc = auditExternalData.factualDetailStatusBean.processBeanList[j].documentDesc;
							tableArray.push(row);
						}
					}

					if (auditExternalData.dispatchNo) {
						var row = {};
						row.proformaClause = true;
						tableArray.push(row);

						var row = {};
						row.proformaDispatch = true;
						tableArray.push(row);

						var row = {};
						row.proformaDispatchNo = auditExternalData.dispatchNo;
						row.proformaDispatchDate = auditExternalData.dispatchDate;
						tableArray.push(row);

						var row = {};
						row.proformaFactualDetails = true;
						tableArray.push(row);

						var row = {};
						row.proformaClauseNo = auditExternalData.auditClauseNo;
						row.proformaDeptName = auditExternalData.deptName;
						tableArray.push(row);

						var row = {};
						row.proformaClauseDetails = auditExternalData.auditClauseDetails;
						tableArray.push(row);

						if (auditExternalData.documentId) {
							var row = {};
							row.proformaDocumentId = auditExternalData.documentId;
							row.proformaDocumentName = auditExternalData.documentName;
							row.proformaDocumentDesc = auditExternalData.documentDesc;
							tableArray.push(row);
						}
						for (var j in auditExternalData.processBeanList) {
							if (auditExternalData.processBeanList[j].deptSerialNo) {
								var row = {};
								row.pDept = true;
								tableArray.push(row);

								var row = {};
								row.pDeptSerialNo = auditExternalData.processBeanList[j].deptSerialNo;
								row.pDeptDate = auditExternalData.processBeanList[j].deptDate;
								tableArray.push(row);
							}

							if (auditExternalData.processBeanList[j].deptComments) {
								var row = {};
								row.pDeptComments = auditExternalData.processBeanList[j].deptComments;
								tableArray.push(row);
							}

							if (auditExternalData.processBeanList[j].directorComments) {
								var row = {};
								row.pDirectorComments = auditExternalData.processBeanList[j].directorComments;
								tableArray.push(row);
							}

							if (auditExternalData.processBeanList[j].agOpinionStatus) {
								var row = {};
								row.pAgOpinion = true;
								tableArray.push(row);

								var row = {};
								row.pAgSentSerialNo = auditExternalData.processBeanList[j].agSentSerialNo;
								row.pAgSentDate = auditExternalData.processBeanList[j].agSentDate;
								tableArray.push(row);

								var row = {};
								row.pAgOpinionStatus = auditExternalData.processBeanList[j].agOpinionStatus;
								tableArray.push(row);

								var row = {};
								row.pAgRemark = auditExternalData.processBeanList[j].agRemark;
								tableArray.push(row);
							}

							if (auditExternalData.processBeanList[j].documentId) {
								var row = {};
								row.proformaProcessDocumentId = auditExternalData.processBeanList[j].documentId;
								row.proformaProcessDocumentName = auditExternalData.processBeanList[j].documentName;
								row.proformaProcessDocumentDesc = auditExternalData.processBeanList[j].documentDesc;
								tableArray.push(row);
							}
						}
					}
				}

				state.tableArray = tableArray;
			};
state.generateTableArrayForExternalAuditCAG = function(
				proformaClauseData, cagIndiaReportData) {
				console.log(proformaClauseData);

				var tableArray = [];

				var row = {};
				row.auditDateFrom = proformaClauseData.factualDetailStatusBean.auditExternalBean.auditDateFrom;
				row.auditDateTo = proformaClauseData.factualDetailStatusBean.auditExternalBean.auditDateTo;
				row.applicationId = proformaClauseData.factualDetailStatusBean.auditExternalBean.applicationId;
				row.auditDetails = proformaClauseData.factualDetailStatusBean.auditExternalBean.auditDetails;
				tableArray.push(row);

				if (proformaClauseData.factualDetailStatusBean.auditExternalBean.documentId) {
					var row = {};
					row.documentId = proformaClauseData.factualDetailStatusBean.auditExternalBean.documentId;
					row.documentName = proformaClauseData.factualDetailStatusBean.auditExternalBean.documentName;
					row.documentDesc = proformaClauseData.factualDetailStatusBean.auditExternalBean.documentDesc;
					tableArray.push(row);
				}

				for (var i in proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList) {
					var row = {};
					if (proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].dticComments) {
						row.dticComments = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].dticComments;
					}
					if (proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].zonalComments) {
						row.zonalComments = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].zonalComments;
					}
					if (proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].icComments) {
						row.icComments = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].icComments;
					}
					tableArray.push(row);

					if (proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agSentSerialNo) {
						var row = {};
						row.agSent = true;
						tableArray.push(row);

						var row = {};
						row.agSentSerialNo = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agSentSerialNo;
						row.agSentDate = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agSentDate;
						tableArray.push(row);

						var row = {};
						row.agOpinionStatus = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agOpinionStatus;
						row.agRemark = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agRemark;
						tableArray.push(row);
					}

					if (proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].documentId) {
						var row = {};
						row.processDocumentId = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].documentId;
						row.processDocumentName = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].documentName;
						row.processDocumentDesc = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].documentDesc;
						tableArray.push(row);
					}

				}

				if (proformaClauseData.factualDetailStatusBean.factualDetailReceiptNo) {
					var row = {};
					row.factualDetails = true;
					tableArray.push(row);

					var row = {};
					row.factualDetailsReceipt = true;
					tableArray.push(row);

					var row = {};
					row.factualDetailReceiptNo = proformaClauseData.factualDetailStatusBean.factualDetailReceiptNo;
					row.factualDetailReceiptDate = proformaClauseData.factualDetailStatusBean.factualDetailReceiptDate;
					tableArray.push(row);

					var row = {};
					row.factualAuditReportClause = true;
					tableArray.push(row);

					var row = {};
					row.factualClauseNo = proformaClauseData.factualDetailStatusBean.clauseNo;
					row.factualDeptName = proformaClauseData.factualDetailStatusBean.deptName;
					tableArray.push(row);

					var row = {};
					row.factualClauseDetails = proformaClauseData.factualDetailStatusBean.clauseDetails;
					tableArray.push(row);

					if (proformaClauseData.factualDetailStatusBean.documentId) {
						var row = {};
						row.factualDocumentId = proformaClauseData.factualDetailStatusBean.documentId;
						row.factualDocumentName = proformaClauseData.factualDetailStatusBean.documentName;
						row.factualDocumentDesc = proformaClauseData.factualDetailStatusBean.documentDesc;
						tableArray.push(row);
					}

					for (var j in proformaClauseData.factualDetailStatusBean.processBeanList) {
						if (proformaClauseData.factualDetailStatusBean.processBeanList[j].deptSerialNo) {
							var row = {};
							row.tDept = true;
							tableArray.push(row);

							var row = {};
							row.tDeptSerialNo = proformaClauseData.factualDetailStatusBean.processBeanList[j].deptSerialNo;
							row.tDeptDate = proformaClauseData.factualDetailStatusBean.processBeanList[j].deptDate;
							tableArray.push(row);
						}

						if (proformaClauseData.factualDetailStatusBean.processBeanList[j].deptComments) {
							var row = {};
							row.tDeptComments = proformaClauseData.factualDetailStatusBean.processBeanList[j].deptComments;
							tableArray.push(row);
						}

						if (proformaClauseData.factualDetailStatusBean.processBeanList[j].directorComments) {
							var row = {};
							row.tDirectorComments = proformaClauseData.factualDetailStatusBean.processBeanList[j].directorComments;
							tableArray.push(row);
						}

						if (proformaClauseData.factualDetailStatusBean.processBeanList[j].agOpinionStatus) {
							var row = {};
							row.tAgOpinion = true;
							tableArray.push(row);

							var row = {};
							row.tAgSentSerialNo = proformaClauseData.factualDetailStatusBean.processBeanList[j].agSentSerialNo;
							row.tAgSentDate = proformaClauseData.factualDetailStatusBean.processBeanList[j].agSentDate;
							tableArray.push(row);

							var row = {};
							row.tAgOpinionStatus = proformaClauseData.factualDetailStatusBean.processBeanList[j].agOpinionStatus;
							tableArray.push(row);

							var row = {};
							row.tAgRemark = proformaClauseData.factualDetailStatusBean.processBeanList[j].agRemark;
							tableArray.push(row);
						}

						if (proformaClauseData.factualDetailStatusBean.processBeanList[j].documentId) {
							var row = {};
							row.factualProcessDocumentId = proformaClauseData.factualDetailStatusBean.processBeanList[j].documentId;
							row.factualProcessDocumentName = proformaClauseData.factualDetailStatusBean.processBeanList[j].documentName;
							row.factualProcessDocumentDesc = proformaClauseData.factualDetailStatusBean.processBeanList[j].documentDesc;
							tableArray.push(row);
						}
					}

					if (proformaClauseData.dispatchNo) {
						var row = {};
						row.proformaClause = true;
						tableArray.push(row);

						var row = {};
						row.proformaDispatch = true;
						tableArray.push(row);

						var row = {};
						row.proformaDispatchNo = proformaClauseData.dispatchNo;
						row.proformaDispatchDate = proformaClauseData.dispatchDate;
						tableArray.push(row);

						var row = {};
						row.proformaFactualDetails = true;
						tableArray.push(row);

						var row = {};
						row.proformaClauseNo = proformaClauseData.auditClauseNo;
						row.proformaDeptName = proformaClauseData.deptName;
						tableArray.push(row);

						var row = {};
						row.proformaClauseDetails = proformaClauseData.auditClauseDetails;
						tableArray.push(row);

						if (proformaClauseData.documentId) {
							var row = {};
							row.proformaDocumentId = proformaClauseData.documentId;
							row.proformaDocumentName = proformaClauseData.documentName;
							row.proformaDocumentDesc = proformaClauseData.documentDesc;
							tableArray.push(row);
						}
						for (var j in proformaClauseData.processBeanList) {
							if (proformaClauseData.processBeanList[j].deptSerialNo) {
								var row = {};
								row.pDept = true;
								tableArray.push(row);

								var row = {};
								row.pDeptSerialNo = proformaClauseData.processBeanList[j].deptSerialNo;
								row.pDeptDate = proformaClauseData.processBeanList[j].deptDate;
								tableArray.push(row);
							}

							if (proformaClauseData.processBeanList[j].deptComments) {
								var row = {};
								row.pDeptComments = proformaClauseData.processBeanList[j].deptComments;
								tableArray.push(row);
							}

							if (proformaClauseData.processBeanList[j].directorComments) {
								var row = {};
								row.pDirectorComments = proformaClauseData.processBeanList[j].directorComments;
								tableArray.push(row);
							}

							if (proformaClauseData.processBeanList[j].agOpinionStatus) {
								var row = {};
								row.pAgOpinion = true;
								tableArray.push(row);

								var row = {};
								row.pAgSentSerialNo = proformaClauseData.processBeanList[j].agSentSerialNo;
								row.pAgSentDate = proformaClauseData.processBeanList[j].agSentDate;
								tableArray.push(row);

								var row = {};
								row.pAgOpinionStatus = proformaClauseData.processBeanList[j].agOpinionStatus;
								tableArray.push(row);

								var row = {};
								row.pAgRemark = proformaClauseData.processBeanList[j].agRemark;
								tableArray.push(row);
							}

							if (proformaClauseData.processBeanList[j].documentId) {
								var row = {};
								row.proformaProcessDocumentId = proformaClauseData.processBeanList[j].documentId;
								row.proformaProcessDocumentName = proformaClauseData.processBeanList[j].documentName;
								row.proformaProcessDocumentDesc = proformaClauseData.processBeanList[j].documentDesc;
								tableArray.push(row);
							}
						}

						if (cagIndiaReportData.reportYear) {
							var row = {};
							row.cagIndiaReport = true;
							tableArray.push(row);

							var row = {};
							row.cagReportYear = cagIndiaReportData.reportYear;
							row.cagDeptRelatedClause = cagIndiaReportData.deptRelatedClause;
							tableArray.push(row);

							if (cagIndiaReportData.documentId) {
								var row = {};
								row.cagDocumentId = cagIndiaReportData.documentId;
								row.cagDocumentName = cagIndiaReportData.documentName;
								row.cagDocumentDesc = cagIndiaReportData.documentDesc;
								tableArray.push(row);
							}

							for (var j in cagIndiaReportData.cagReportProcessBeanList) {
								if (cagIndiaReportData.cagReportProcessBeanList[j].statusId == 11
									|| cagIndiaReportData.cagReportProcessBeanList[j].statusId == 19) {
									var row = {};
									row.cICComments = true;
									tableArray.push(row);

									var row = {};
									row.cICOpinion = cagIndiaReportData.cagReportProcessBeanList[j].comments;
									tableArray.push(row);

									var row = {};
									row.cSerialNo = cagIndiaReportData.cagReportProcessBeanList[j].serialNo;
									row.cDecisionDate = cagIndiaReportData.cagReportProcessBeanList[j].decisionDate;
									tableArray.push(row);
								}
								if (cagIndiaReportData.cagReportProcessBeanList[j].statusId == 6
									|| cagIndiaReportData.cagReportProcessBeanList[j].statusId == 16
									|| cagIndiaReportData.cagReportProcessBeanList[j].statusId == 20) {
									var row = {};
									row.cGovtForward = true;
									tableArray.push(row);

									var row = {};
									row.cGovSerialNo = cagIndiaReportData.cagReportProcessBeanList[j].serialNo;
									row.cGovDecisionDate = cagIndiaReportData.cagReportProcessBeanList[j].decisionDate;
									tableArray.push(row);

									var row = {};
									row.cGovAssemblySecretariat = cagIndiaReportData.cagReportProcessBeanList[j].comments;
									tableArray.push(row);

									var row = {};
									row.cGovAGOpinionRemark = cagIndiaReportData.cagReportProcessBeanList[j].remarks;
									tableArray.push(row);
								}
								if (cagIndiaReportData.cagReportProcessBeanList[j].documentId) {
									var row = {};
									row.cagProcessDocumentId = cagIndiaReportData.cagReportProcessBeanList[j].documentId;
									row.cagProcessDocumentName = cagIndiaReportData.cagReportProcessBeanList[j].documentName;
									row.cagProcessDocumentDesc = cagIndiaReportData.cagReportProcessBeanList[j].documentDesc;
									tableArray.push(row);
								}
							}
						}
					}
				}
				state.tableArray = tableArray;
			};
state.generateTableArrayForExternalAuditPAC = function(
				proformaClauseData, cagIndiaReportData,
				pacReportData) {
				console.log(proformaClauseData);

				var tableArray = [];

				var row = {};
				row.auditDateFrom = proformaClauseData.factualDetailStatusBean.auditExternalBean.auditDateFrom;
				row.auditDateTo = proformaClauseData.factualDetailStatusBean.auditExternalBean.auditDateTo;
				row.applicationId = proformaClauseData.factualDetailStatusBean.auditExternalBean.applicationId;
				row.auditDetails = proformaClauseData.factualDetailStatusBean.auditExternalBean.auditDetails;
				tableArray.push(row);

				if (proformaClauseData.factualDetailStatusBean.auditExternalBean.documentId) {
					var row = {};
					row.documentId = proformaClauseData.factualDetailStatusBean.auditExternalBean.documentId;
					row.documentName = proformaClauseData.factualDetailStatusBean.auditExternalBean.documentName;
					row.documentDesc = proformaClauseData.factualDetailStatusBean.auditExternalBean.documentDesc;
					tableArray.push(row);
				}

				for (var i in proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList) {
					var row = {};
					if (proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].dticComments) {
						row.dticComments = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].dticComments;
					}
					if (proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].zonalComments) {
						row.zonalComments = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].zonalComments;
					}
					if (proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].icComments) {
						row.icComments = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].icComments;
					}
					tableArray.push(row);

					if (proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agSentSerialNo) {
						var row = {};
						row.agSent = true;
						tableArray.push(row);

						var row = {};
						row.agSentSerialNo = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agSentSerialNo;
						row.agSentDate = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agSentDate;
						tableArray.push(row);

						var row = {};
						row.agOpinionStatus = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agOpinionStatus;
						row.agRemark = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].agRemark;
						tableArray.push(row);
					}

					if (proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].documentId) {
						var row = {};
						row.processDocumentId = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].documentId;
						row.processDocumentName = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].documentName;
						row.processDocumentDesc = proformaClauseData.factualDetailStatusBean.auditExternalBean.processBeanList[i].documentDesc;
						tableArray.push(row);
					}

				}

				if (proformaClauseData.factualDetailStatusBean.factualDetailReceiptNo) {
					var row = {};
					row.factualDetails = true;
					tableArray.push(row);

					var row = {};
					row.factualDetailsReceipt = true;
					tableArray.push(row);

					var row = {};
					row.factualDetailReceiptNo = proformaClauseData.factualDetailStatusBean.factualDetailReceiptNo;
					row.factualDetailReceiptDate = proformaClauseData.factualDetailStatusBean.factualDetailReceiptDate;
					tableArray.push(row);

					var row = {};
					row.factualAuditReportClause = true;
					tableArray.push(row);

					var row = {};
					row.factualClauseNo = proformaClauseData.factualDetailStatusBean.clauseNo;
					row.factualDeptName = proformaClauseData.factualDetailStatusBean.deptName;
					tableArray.push(row);

					var row = {};
					row.factualClauseDetails = proformaClauseData.factualDetailStatusBean.clauseDetails;
					tableArray.push(row);

					if (proformaClauseData.factualDetailStatusBean.documentId) {
						var row = {};
						row.factualDocumentId = proformaClauseData.factualDetailStatusBean.documentId;
						row.factualDocumentName = proformaClauseData.factualDetailStatusBean.documentName;
						row.factualDocumentDesc = proformaClauseData.factualDetailStatusBean.documentDesc;
						tableArray.push(row);
					}

					for (var j in proformaClauseData.factualDetailStatusBean.processBeanList) {
						if (proformaClauseData.factualDetailStatusBean.processBeanList[j].deptSerialNo) {
							var row = {};
							row.tDept = true;
							tableArray.push(row);

							var row = {};
							row.tDeptSerialNo = proformaClauseData.factualDetailStatusBean.processBeanList[j].deptSerialNo;
							row.tDeptDate = proformaClauseData.factualDetailStatusBean.processBeanList[j].deptDate;
							tableArray.push(row);
						}

						if (proformaClauseData.factualDetailStatusBean.processBeanList[j].deptComments) {
							var row = {};
							row.tDeptComments = proformaClauseData.factualDetailStatusBean.processBeanList[j].deptComments;
							tableArray.push(row);
						}

						if (proformaClauseData.factualDetailStatusBean.processBeanList[j].directorComments) {
							var row = {};
							row.tDirectorComments = proformaClauseData.factualDetailStatusBean.processBeanList[j].directorComments;
							tableArray.push(row);
						}

						if (proformaClauseData.factualDetailStatusBean.processBeanList[j].agOpinionStatus) {
							var row = {};
							row.tAgOpinion = true;
							tableArray.push(row);

							var row = {};
							row.tAgSentSerialNo = proformaClauseData.factualDetailStatusBean.processBeanList[j].agSentSerialNo;
							row.tAgSentDate = proformaClauseData.factualDetailStatusBean.processBeanList[j].agSentDate;
							tableArray.push(row);

							var row = {};
							row.tAgOpinionStatus = proformaClauseData.factualDetailStatusBean.processBeanList[j].agOpinionStatus;
							tableArray.push(row);

							var row = {};
							row.tAgRemark = proformaClauseData.factualDetailStatusBean.processBeanList[j].agRemark;
							tableArray.push(row);
						}

						if (proformaClauseData.factualDetailStatusBean.processBeanList[j].documentId) {
							var row = {};
							row.factualProcessDocumentId = proformaClauseData.factualDetailStatusBean.processBeanList[j].documentId;
							row.factualProcessDocumentName = proformaClauseData.factualDetailStatusBean.processBeanList[j].documentName;
							row.factualProcessDocumentDesc = proformaClauseData.factualDetailStatusBean.processBeanList[j].documentDesc;
							tableArray.push(row);
						}
					}

					if (proformaClauseData.dispatchNo) {
						var row = {};
						row.proformaClause = true;
						tableArray.push(row);

						var row = {};
						row.proformaDispatch = true;
						tableArray.push(row);

						var row = {};
						row.proformaDispatchNo = proformaClauseData.dispatchNo;
						row.proformaDispatchDate = proformaClauseData.dispatchDate;
						tableArray.push(row);

						var row = {};
						row.proformaFactualDetails = true;
						tableArray.push(row);

						var row = {};
						row.proformaClauseNo = proformaClauseData.auditClauseNo;
						row.proformaDeptName = proformaClauseData.deptName;
						tableArray.push(row);

						var row = {};
						row.proformaClauseDetails = proformaClauseData.auditClauseDetails;
						tableArray.push(row);

						if (proformaClauseData.documentId) {
							var row = {};
							row.proformaDocumentId = proformaClauseData.documentId;
							row.proformaDocumentName = proformaClauseData.documentName;
							row.proformaDocumentDesc = proformaClauseData.documentDesc;
							tableArray.push(row);
						}
						for (var j in proformaClauseData.processBeanList) {
							if (proformaClauseData.processBeanList[j].deptSerialNo) {
								var row = {};
								row.pDept = true;
								tableArray.push(row);

								var row = {};
								row.pDeptSerialNo = proformaClauseData.processBeanList[j].deptSerialNo;
								row.pDeptDate = proformaClauseData.processBeanList[j].deptDate;
								tableArray.push(row);
							}

							if (proformaClauseData.processBeanList[j].deptComments) {
								var row = {};
								row.pDeptComments = proformaClauseData.processBeanList[j].deptComments;
								tableArray.push(row);
							}

							if (proformaClauseData.processBeanList[j].directorComments) {
								var row = {};
								row.pDirectorComments = proformaClauseData.processBeanList[j].directorComments;
								tableArray.push(row);
							}

							if (proformaClauseData.processBeanList[j].agOpinionStatus) {
								var row = {};
								row.pAgOpinion = true;
								tableArray.push(row);

								var row = {};
								row.pAgSentSerialNo = proformaClauseData.processBeanList[j].agSentSerialNo;
								row.pAgSentDate = proformaClauseData.processBeanList[j].agSentDate;
								tableArray.push(row);

								var row = {};
								row.pAgOpinionStatus = proformaClauseData.processBeanList[j].agOpinionStatus;
								tableArray.push(row);

								var row = {};
								row.pAgRemark = proformaClauseData.processBeanList[j].agRemark;
								tableArray.push(row);
							}

							if (proformaClauseData.processBeanList[j].documentId) {
								var row = {};
								row.proformaProcessDocumentId = proformaClauseData.processBeanList[j].documentId;
								row.proformaProcessDocumentName = proformaClauseData.processBeanList[j].documentName;
								row.proformaProcessDocumentDesc = proformaClauseData.processBeanList[j].documentDesc;
								tableArray.push(row);
							}
						}

						if (cagIndiaReportData.reportYear) {
							var row = {};
							row.cagIndiaReport = true;
							tableArray.push(row);

							var row = {};
							row.cagReportYear = cagIndiaReportData.reportYear;
							row.cagDeptRelatedClause = cagIndiaReportData.deptRelatedClause;
							tableArray.push(row);

							if (cagIndiaReportData.documentId) {
								var row = {};
								row.cagDocumentId = cagIndiaReportData.documentId;
								row.cagDocumentName = cagIndiaReportData.documentName;
								row.cagDocumentDesc = cagIndiaReportData.documentDesc;
								tableArray.push(row);
							}

							for (var j in cagIndiaReportData.cagReportProcessBeanList) {
								if (cagIndiaReportData.cagReportProcessBeanList[j].statusId == 11
									|| cagIndiaReportData.cagReportProcessBeanList[j].statusId == 19) {
									var row = {};
									row.cICComments = true;
									tableArray.push(row);

									var row = {};
									row.cICOpinion = cagIndiaReportData.cagReportProcessBeanList[j].comments;
									tableArray.push(row);

									var row = {};
									row.cSerialNo = cagIndiaReportData.cagReportProcessBeanList[j].serialNo;
									row.cDecisionDate = cagIndiaReportData.cagReportProcessBeanList[j].decisionDate;
									tableArray.push(row);
								}
								if (cagIndiaReportData.cagReportProcessBeanList[j].statusId == 6
									|| cagIndiaReportData.cagReportProcessBeanList[j].statusId == 16
									|| cagIndiaReportData.cagReportProcessBeanList[j].statusId == 20) {
									var row = {};
									row.cGovtForward = true;
									tableArray.push(row);

									var row = {};
									row.cGovSerialNo = cagIndiaReportData.cagReportProcessBeanList[j].serialNo;
									row.cGovDecisionDate = cagIndiaReportData.cagReportProcessBeanList[j].decisionDate;
									tableArray.push(row);

									var row = {};
									row.cGovAssemblySecretariat = cagIndiaReportData.cagReportProcessBeanList[j].comments;
									tableArray.push(row);

									var row = {};
									row.cGovAGOpinionRemark = cagIndiaReportData.cagReportProcessBeanList[j].remarks;
									tableArray.push(row);
								}
								if (cagIndiaReportData.cagReportProcessBeanList[j].documentId) {
									var row = {};
									row.cagProcessDocumentId = cagIndiaReportData.cagReportProcessBeanList[j].documentId;
									row.cagProcessDocumentName = cagIndiaReportData.cagReportProcessBeanList[j].documentName;
									row.cagProcessDocumentDesc = cagIndiaReportData.cagReportProcessBeanList[j].documentDesc;
									tableArray.push(row);
								}
							}
						}

						if (pacReportData.pacReportNo) {
							var row = {};
							row.pacReport = true;
							tableArray.push(row);

							var row = {};
							row.pacReportNo = pacReportData.pacReportNo;
							row.pacReportDate = pacReportData.pacReportDate;
							tableArray.push(row);

							var row = {};
							row.pacClauseNo = pacReportData.clauseNo;
							tableArray.push(row);

							var row = {};
							row.pacClauseDetails = pacReportData.clauseDetails;
							tableArray.push(row);

							if (pacReportData.documentId) {
								var row = {};
								row.pacDocumentId = pacReportData.documentId;
								row.pacDocumentName = pacReportData.documentName;
								row.pacDocumentDesc = pacReportData.documentDesc;
								tableArray.push(row);
							}
							for (var j in pacReportData.processBeans) {
								if (pacReportData.processBeans[j].statusId == 18) {
									var row = {};
									row.pICComments = true;
									tableArray.push(row);

									var row = {};
									row.pICOpinion = pacReportData.processBeans[j].comments;
									tableArray.push(row);

									var row = {};
									row.pSerialNo = pacReportData.processBeans[j].serialNo;
									row.pDecisionDate = pacReportData.processBeans[j].decisionDate;
									tableArray.push(row);
								}
								if (pacReportData.processBeans[j].statusId == 6) {
									var row = {};
									row.pLAReport = true;
									tableArray.push(row);

									var row = {};
									row.pLAOpinion = pacReportData.processBeans[j].comments;
									tableArray.push(row);

									var row = {};
									row.pLASerialNo = pacReportData.processBeans[j].serialNo;
									row.pLADecisionDate = pacReportData.processBeans[j].decisionDate;
									tableArray.push(row);

									var row = {};
									row.pLARemark = pacReportData.processBeans[j].remarks;
									tableArray.push(row);
								}
								if (pacReportData.processBeans[j].documentId) {
									var row = {};
									row.pacProcessDocumentId = pacReportData.processBeans[j].documentId;
									row.pacProcessDocumentName = pacReportData.processBeans[j].documentName;
									row.pacProcessDocumentDesc = pacReportData.processBeans[j].documentDesc;
									tableArray.push(row);
								}
							}
						}
					}
				}
				state.tableArray = tableArray;
			};
state.loadDate = () => {};
}
