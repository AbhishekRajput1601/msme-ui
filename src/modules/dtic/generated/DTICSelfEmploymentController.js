// Source: angular/dtic/controller.js. Generated static JS, with explicit React IO dependencies.
export function installActions(state, { request, loading, navigation, params, format, later, dom }) {
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,Array.isArray(items) ? Number(k) : k));
const identity = value => value;
const fetchAllApplicationsList = () => { state.listVersion++; loading.finish(); };
const fetchApplicationsListByStatus = () => { state.listVersion++; loading.finish(); };
const fetchApplicants = () => { state.listVersion++; loading.finish(); };
const fetchYuvaUdhamiApplicants = () => { state.listVersion++; loading.finish(); };
const fetchResubmittedApplicants = () => { state.listVersion++; loading.finish(); };
const fetchResubmittedYuvaudhamiApplicants = () => { state.listVersion++; loading.finish(); };
const fetchInProcessApplicants = () => { state.listVersion++; loading.finish(); };
const fetchInProcessYuvaudhamiApplicants = () => { state.listVersion++; loading.finish(); };
let lastObjectId="", lastSchemeId="", lastSchemeTypeId="";
state.started = false;
state.setApplicationId = function() {
				state.applicantId = params.applicantId;
			};
state.startOrStopSpinner = function(isStart) {

				if (isStart) {
					loading.start('sample-1');
				} else {
					loading.finish('sample-1');
				}

			};
state.setSchemeType = function() {
				state.schemeType = params.schemeType;
			};
state.generateTFCLetter = function() {

				if (state.tfcLetterData.fromDate) {
					
					
					

					state.tfcLetterData.fromDate = state.tfcLetterData.fromDate
						.split('/').join('-');

				}

				if (state.tfcLetterData.toDate) {
					
					
					
					state.tfcLetterData.toDate = state.tfcLetterData.toDate
						.split('/').join('-');

				}

				navigation.open('generateTFCLetter/' + state.schemeType
					+ '/' + state.tfcLetterData.fromDate + '/'
					+ state.tfcLetterData.toDate);

			};
state.loadDTFCDecision = function() {

				loading.start('sample-1');

				var responseBanks = request.get('fetchBanksMap');

				responseBanks.success(function(data, status, headers,
					config) {
					state.bankList = data;
					loading.finish('sample-1');
				});

				var responsePromise = request
					.get('fetchdtfcdecisiondata/'
						+ params.applicantId);
				responsePromise.success(function(data, status, headers,
					config) {
					state.dtfcData = data;
					state.meetingDate = data.meetingDate;

					loading.finish('sample-1');
				});

			};
state.submitTFCDecisionFunction = function(isValid) {

				if (!isValid)
					return false;

				state.dtfcData.applicantId = params.applicantId;

				loading.start('sample-1');

				var responsePromise = request.post('addDTFCDecision',
					state.dtfcData);

				responsePromise.error(function(data, status, headers,
					config) {
					loading.finish('sample-1');
				});

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject = data;

						if (state.responseObject.successMessage != null) {
							navigation.location.href = '#success';

						}
						loading.finish('sample-1');
					});
			};
state.loadDashboardData = function() {

				loading.start('sample-1');
				var responsePromise = request
					.get('fetchdticdashboarddata');
				responsePromise
					.success(function(data, status, headers, config) {
						state.dashboardData = data;

						var msmeDashboard = request
							.get('fetchdticmsmedashboarddata');
						msmeDashboard
							.success(function(data, status,
								headers, config) {
								state.dashboardData.totalMSMEApplications = data.totalMSMEApplications;

							});

						loading.finish('sample-1');
					});
			};
state.loadAllApplicationsList = function() {

				loading.start('sample-1');
				fetchAllApplicationsList();
			};
state.loadApplicationsListByStatus = function() {

				loading.start('sample-1');
				fetchApplicationsListByStatus();
			};
state.loadApplicantDetailList = function() {

				loading.start('sample-1');
				fetchApplicants();
			};
state.loadYuvaudhamiApplicantsList = function() {

				loading.start('sample-1');
				fetchYuvaUdhamiApplicants();
			};
state.loadResubmittedApplicantList = function() {

				loading.start('sample-1');
				fetchResubmittedApplicants();
			};
state.loadResubmittedYuvaudhamiApplicantList = function() {

				loading.start('sample-1');
				fetchResubmittedYuvaudhamiApplicants();
			};
state.loadInProcessApplicantList = function() {

				loading.start('sample-1');
				fetchInProcessApplicants();
			};
state.loadInProcessYuvaudhamiApplicants = function() {
				loading.start('sample-1');
				fetchInProcessYuvaudhamiApplicants();
			};
state.loadApplicantDetail = function() {

				loading.start('sample-1');
				var responsePromise = request
					.get(
						'fetchapplicantdetail',
						{
							params: {
								'applicantId': params.applicantId
							}
						});
				responsePromise.success(function(data, status, headers,
					config) {
					state.applicantDetail = data;
					if (data.profileImageString != null) {
						state.profileImage = data.profileImageString;
					}
					loading.finish('sample-1');
				});
			};
state.loadDocumentsList = function() {

				loading.start('sample-1');
				var responsePromise = request
					.get(
						'fetchapplicantdocumentslist',
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
state.loadBusinessDetail = function() {

				loading.start('sample-1');
				var responsePromise = request
					.get(
						'fetchBusinessDetail',
						{
							params: {
								'applicantId': params.applicantId
							}
						});
				responsePromise.success(function(data, status, headers,
					config) {

					state.businessSchemeDetailData = data;

					loading.finish('sample-1');
				});

			};
state.loadSchemeDetail = function() {

				loading.start('sample-1');
				var responsePromise = request.get('fetchschemedetail', {
					params: {
						'applicantId': params.applicantId
					}
				});
				responsePromise.success(function(data, status, headers,
					config) {

					state.schemeDetailData = data;

					loading.finish('sample-1');
				});

			};
state.downloadDocument = function(documentType) {

				navigation.open('downloaddocument/' + documentType + '/'
					+ params.applicantId);

			};
state.viewSchemeDetailForm = function() {
				navigation.location.href = '#viewschemedetailform' + '/'
					+ params.applicantId;

			};
state.acceptbydtic = function(comment) {

				var fd = new FormData();

				fd.append('applicantId', params.applicantId);

				if (comment != null || comment != undefined) {
					fd.append('comment', comment);
				}

				loading.start('sample-1');
				var responsePromise = request.post('acceptbydtic', fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject = data;

						if (state.responseObject.successMessage != null) {
							navigation.location.href = '#success';

						}

						loading.finish('sample-1');

					});

			};
state.rejectbydtic = function(comment) {

				var fd = new FormData();

				fd.append('applicantId', params.applicantId);

				if (comment != null || comment != undefined) {
					fd.append('comment', comment);
				}

				loading.start('sample-1');
				var responsePromise = request.post('rejectbydtic', fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject = data;

						if (state.responseObject.successMessage != null) {
							navigation.location.href = '#success';

						}

						loading.finish('sample-1');

					});

			};
state.resubmitbydtic = function(comment) {

				var fd = new FormData();

				fd.append('applicantId', params.applicantId);

				if (comment != null || comment != undefined) {
					fd.append('comment', comment);
				}

				loading.start('sample-1');
				var responsePromise = request.post('resubmitbydtic', fd,
					{
						transformRequest: identity,
						headers: {
							'Content-Type': undefined
						}
					});

				responsePromise
					.success(function(data, status, headers, config) {

						state.responseObject = data;

						if (state.responseObject.successMessage != null) {
							navigation.location.href = '#success';

						}

						loading.finish('sample-1');

					});

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
state.loadDate = () => {};
}
