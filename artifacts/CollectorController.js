var mpindustry = angular.module('mpindustry');

mpindustry.run(['$rootScope', function($rootScope) {
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
		if (null != current && null != current.$$route)
			$rootScope.title = current.$$route.title;
	});
}]);

mpindustry.controller('CollectorController', function($scope, $loading, $rootScope,
		$window, $compile, $filter, $routeParams, $http, $timeout, $uibModal, $sce) {

	$scope.applications = [];
	$scope.searchText = '';
	$scope.detail = null;
	$scope.detailHistory = [];
	$scope.dticInfo = null;   // GM-DTIC eligible amount + remark (batch_detail)

	$scope.$on('IdleTimeout', function() {
		var language = $('#language').val();
		if (language == 'hi_IN') {
			alert('आपका सत्र समाप्त हो गया है, कृपया पुनः प्रवेश करें।');
		} else {
			alert('Your Session has expired, Please relogin.');
		}
		$window.location.reload();
	});

	// ---- list (status 22, mapped district) ----
	$scope.loadApplications = function() {
		$loading.start('sample-1');
		var url = 'fetchApplications';
		if ($scope.searchText) {
			url = url + '?search=' + encodeURIComponent($scope.searchText);
		}
		$http.get(url).success(function(data) {
			$scope.applications = data || [];
			angular.forEach($scope.applications, function(a) {
				a.selected = false;
				if (!a.remark) { a.remark = ''; }
			});
			$loading.finish('sample-1');
		}).error(function() {
			$loading.finish('sample-1');
		});
	};

	$scope.pendingCount = function() {
		return $scope.applications ? $scope.applications.length : 0;
	};

	$scope.isProcessed = function(app) {
		return app.currentStatusId != 22;
	};

	$scope.getSelected = function() {
		var selected = [];
		angular.forEach($scope.applications, function(a) {
			if (a.selected && !$scope.isProcessed(a)) {
				selected.push({ applicationNo: a.applicationId, remark: a.remark });
			}
		});
		return selected;
	};

	// ---- full detail view ----
	$scope.loadDetail = function(applicationNo) {
		if (!applicationNo) { applicationNo = $routeParams.applicationNo; }
		if (!applicationNo) { return; }
		$loading.start('sample-1');
		$http.get('detailData/' + applicationNo).success(function(data) {
			$scope.detail = data;
			$loading.finish('sample-1');
		}).error(function() { $loading.finish('sample-1'); });
		$http.get('history/' + applicationNo).success(function(data) {
			$scope.detailHistory = data || [];
		});
		// GM-DTIC eligible amount + remark entered for this application (batch_detail).
		$http.get('dticEligible/' + applicationNo).success(function(data) {
			$scope.dticInfo = data || {};
		});
		// Assistance-wise Type + Eligible Amount (applicant_assistance) for the read-only detail.
		$http.get('applicantAssistances/' + applicationNo).success(function(data) {
			$scope.assistanceList = data || [];
		});
	};

	$scope.secretaryRemarks = function() {
		return ($scope.detailHistory || []).filter(function(h) { return h.roleCode == 'ROLE_SECRETARY'; });
	};
	$scope.ldmRemarks = function() {
		return ($scope.detailHistory || []).filter(function(h) { return h.roleCode == 'ROLE_LDM'; });
	};

	$scope.viewDetail = function(app) {
		$window.location.href = '#/detail/' + app.applicationId;
	};

	// Non-null uploaded documents, flattened from the profile + nested unit bean.
	$scope.documentList = function() {
		var d = $scope.detail;
		if (!d) { return []; }
		var u = d.faIndustrialUnitBean || {};
		var defs = [
			['Udyam Registration', d.udyamUploadId],
			['PAN Card', d.panUploadId],
			['TAN', d.tanUploadId],
			['Proof of Identity', d.proofOfIdentityUploadId],
			['Proof of Address', d.proofOfAddressUploadId],
			['Category Certificate', d.categoryUploadId],
			['Factory Act Licence', d.factoryUploadId],
			['GST Certificate', d.gstUploadId],
			['CIN Document', d.cinUploadId],
			['PCB (Established)', d.pcbEstUploadId],
			['PCB (Operate)', d.pcbOperateUploadId],
			['Deed', d.deedUploadId],
			['Articles of Association (AOA)', d.aoaUploadId],
			['Memorandum of Association (MOA)', d.moaUploadId],
			['Cancelled Cheque', d.cancelledChequeUploadId],
			['Specimen Signature', d.specimenSignUploadId],
			['GST Sale Document', u.gstSellDocUploadId],
			['Permission Document', u.permissionDocUploadId],
			['Employment Proof', u.employmentGivenUploadId],
			['Scheme Document', u.schemeDocUploadId]
		];
		var out = [];
		angular.forEach(defs, function(x) { if (x[1]) { out.push({ label: x[0], id: x[1] }); } });
		return out;
	};

	// ---- remarks / history popups ----
	$scope.openRemarks = function(app) {
		var modal = $uibModal.open({
			size: 'md',
			template:
				'<div class="modal-header"><h4 class="modal-title">Remarks - {{app.applicationId}}</h4></div>' +
				'<div class="modal-body"><textarea class="form-control" rows="4" maxlength="2000" data-ng-model="app.remark" placeholder="Enter remark"></textarea></div>' +
				'<div class="modal-footer"><button class="btn btn-success" data-ng-click="ok()">Save</button> <button class="btn btn-default" data-ng-click="cancel()">Close</button></div>',
			controller: function($scope, $uibModalInstance, app) {
				$scope.app = app;
				$scope.ok = function() { $uibModalInstance.close(); };
				$scope.cancel = function() { $uibModalInstance.dismiss(); };
			},
			resolve: { app: function() { return app; } }
		});
		modal.result.then(function() {}, function() {});
	};

	$scope.viewHistory = function(app) {
		$http.get('history/' + app.applicationId).success(function(data) {
			$uibModal.open({
				size: 'lg',
				template:
					'<div class="modal-header"><h4 class="modal-title">Remark History - {{appNo}}</h4></div>' +
					'<div class="modal-body" style="max-height:400px;overflow-y:auto">' +
					'  <table class="table table-bordered table-striped">' +
					'    <thead><tr><th>Role</th><th>Action</th><th>Remark</th><th>By</th><th>Date</th></tr></thead>' +
					'    <tbody><tr data-ng-repeat="h in history"><td>{{h.roleName}}</td><td>{{h.actionStatus}}</td><td>{{h.remarks}}</td><td>{{h.verifiedBy}}</td><td>{{h.verifiedDate}}</td></tr>' +
					'    <tr data-ng-if="history.length==0"><td colspan="5" class="text-center">No history yet.</td></tr></tbody>' +
					'  </table></div>' +
					'<div class="modal-footer"><button class="btn btn-default" data-ng-click="close()">Close</button></div>',
				controller: function($scope, $uibModalInstance) {
					$scope.history = data || [];
					$scope.appNo = app.applicationId;
					$scope.close = function() { $uibModalInstance.dismiss(); };
				}
			});
		});
	};

	// --- FA workflow Progress Details (fa_request_process) ---
	// Progress Details now opens the SAME DTIC history page (routed), replacing the modal,
	// so the full application history renders exactly as it does for GM-DTIC.
	$scope.viewProgress = function(app) {
		var id = app && (app.applicationId || app.applicationNo);
		if (id) { $window.location.href = '#fa/viewfaapplicantHistory/' + id + '/Unit'; }
	};

	// ---- Download the DSC/eSign signed approval PDF ----
	$scope.downloadSigned = function(appId) {
		$window.open('downloadSignedDocument/' + appId);
	};

	// ---- assistance comments (batch grid) ----
	// A comment can exist on any assistance, with or without an amount.
	$scope.hasAssistanceRemark = function(asst) {
		return !!(asst && asst.remark && String(asst.remark).trim() !== '');
	};

	// Proposed Eligible Amount cell. A comments-only assistance carries 0 in the
	// backend/DB, but that 0 carries no meaning on screen, so it is not shown.
	$scope.assistanceAmountText = function(asst) {
		if (!asst || asst.eligibleAmount == null) { return '-'; }
		if (Number(asst.eligibleAmount) === 0 && $scope.hasAssistanceRemark(asst)) { return '--'; }
		return asst.eligibleAmount;
	};

	/**
	 * A comments-only assistance carries no amount: 0 in the backend/DB plus a
	 * comment. Same rule the amount cell uses - never a plain "is it zero" test.
	 */
	$scope.isCommentOnlyAssistance = function(asst) {
		return !!asst && Number(asst.eligibleAmount) === 0 && $scope.hasAssistanceRemark(asst);
	};

	/**
	 * Splits an application's assistances into the two tables the Collector sees:
	 * amountAssist (figures + subtotal) and commentAssist (comments only).
	 */
	$scope.splitAssistances = function(app) {
		var list = (app && app.assistanceList) || [];
		var amt = [], cmt = [];
		for (var i = 0; i < list.length; i++) {
			if ($scope.isCommentOnlyAssistance(list[i])) { cmt.push(list[i]); }
			else { amt.push(list[i]); }
		}
		app.amountAssist = amt;
		app.commentAssist = cmt;
	};

	/** Sub-total of the Proposed Eligible Amount column (amount table only). */
	$scope.subtotalProposed = function(app) {
		var list = (app && app.amountAssist) || [];
		var t = 0;
		for (var i = 0; i < list.length; i++) { t += Number(list[i].eligibleAmount) || 0; }
		return Math.round(t * 100) / 100;
	};

	/** Sub-total of the Approved Eligible Amount column; live as the Collector types. */
	$scope.subtotalApproved = function(app) {
		var list = (app && app.amountAssist) || [];
		var t = 0;
		for (var i = 0; i < list.length; i++) { t += Number(list[i].sanctionedAmount) || 0; }
		return Math.round(t * 100) / 100;
	};

	// Read the comment behind a highlighted assistance. Rendered as a plain
	// overlay in the template (see batches.html) instead of a Bootstrap modal,
	// because ui-bootstrap targets Bootstrap 3 markup while this build ships
	// Bootstrap 5, which positions such popups off-screen.
	$scope.assistRemarkOpen = false;
	$scope.assistRemarkTitle = '';
	$scope.assistRemarkText = '';

	$scope.showAssistanceRemark = function(asst) {
		$scope.assistRemarkTitle = (asst && asst.assistanceType) || 'Comment';
		$scope.assistRemarkText = (asst && asst.remark) || '';
		$scope.assistRemarkOpen = true;
	};

	$scope.closeAssistanceRemark = function() {
		$scope.assistRemarkOpen = false;
	};

	// ---- batch-wise processing (Collector) ----
	$scope.batchHeading = 'Collector Approval';
	$scope.isCollector = true;
	$scope.batches = [];
	$scope.activeBatch = null;
	$scope.loadBatches = function() {
		$http.get('fetchBatches').success(function(d) { $scope.batches = d || []; });
		// Restore the batch the user was working on before View/Print / Progress
		// Details so Back/Cancel returns to the SAME open batch with the values
		// already entered (held on $rootScope, which survives the hash-route change).
		if ($rootScope.faActiveBatch) { $scope.activeBatch = $rootScope.faActiveBatch; }
	};
	// Download the existing batch covering letter (not regenerated); friendly error if unavailable.
	$scope.downloadCoveringLetter = function(b) {
		if (!b || !b.batchId) { return; }
		$http.get('downloadCoveringLetter/' + b.batchId, { responseType: 'arraybuffer' })
			.success(function(data, status, headers) {
				var type = headers('Content-Type') || 'application/octet-stream';
				var blob = new Blob([data], { type: type });
				var cd = headers('Content-Disposition') || '';
				var m = /filename="?([^";]+)"?/.exec(cd);
				var fileName = (m && m[1]) ? m[1] : ('CoveringLetter-' + (b.batchCode || b.batchId));
				var urlApi = window.URL || window.webkitURL;
				var link = document.createElement('a');
				link.href = urlApi.createObjectURL(blob);
				link.download = fileName;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			})
			.error(function() {
				$rootScope.responseObject = { errorMessage: 'Covering letter is not available for this batch.' };
				$timeout(function() { $rootScope.responseObject = {}; }, 5000);
			});
	};
	$scope.openBatch = function(b) {
		$loading.start('sample-1');
		$http.get('batchDetail/' + b.batchId).success(function(d) {
			$loading.finish('sample-1');
			$scope.activeBatch = d;
			$rootScope.faActiveBatch = d;
			var apps = (d && d.applications) || [];
			for (var i = 0; i < apps.length; i++) {
				// Per-assistance Sanctioned Amount: prefill from the SAVED sanctioned value, else
				// from the Eligible Amount (editable). App-level total = sum -> drives the existing
				// batch_detail save/approval (workflow unchanged).
				var list = apps[i].assistanceList || [];
				var total = 0;
				for (var k = 0; k < list.length; k++) {
					if (list[k].sanctionedAmount === null || list[k].sanctionedAmount === undefined || list[k].sanctionedAmount === '') {
						list[k].sanctionedAmount = list[k].eligibleAmount;
					}
					total += Number(list[k].sanctionedAmount) || 0;
				}
				if (list.length) {
					apps[i].sanctionedAmount = total;
				} else if (apps[i].sanctionedAmount === null || apps[i].sanctionedAmount === undefined || apps[i].sanctionedAmount === '') {
					apps[i].sanctionedAmount = apps[i].eligibleAmount;
				}
				// Per-application Collector Action: default "Approved" (unless already saved).
				if (!apps[i].remark) { apps[i].remark = 'Approved'; }
				// Split the assistances into the amount table and the comments-only table.
				// Done once here (not in the template) so ng-repeat keeps a stable array.
				$scope.splitAssistances(apps[i]);
			}
		}).error(function() { $loading.finish('sample-1'); });
	};
	// Collector per-application Action options (Secretary/LDM use their own remark options).
	$scope.remarkOptions = ['Approved', 'Rejected', 'Queried'];
	$scope.closeBatch = function() { $scope.activeBatch = null; $rootScope.faActiveBatch = null; };
	$scope.viewSignatures = function(a) {
		$http.get('signatures/' + a.applicationNo).success(function(d) {
			var s = (d || []).map(function(x) { return x.roleCode + ': ' + x.signStatus; }).join('\n');
			alert('Signatures for ' + a.applicationNo + '\n' + (s || 'None yet'));
		});
	};
	$scope.submitBatch = function(decision) {
		var apps = ($scope.activeBatch && $scope.activeBatch.applications) || [];
		if (decision === 'Approve') {
			for (var j = 0; j < apps.length; j++) {
				if (!apps[j].sanctionedAmount || apps[j].sanctionedAmount <= 0) {
					alert('Every application must have a sanctioned amount before approval.');
					return;
				}
			}
		}
		if (!confirm('Confirm "' + decision + '" for the entire batch ' + $scope.activeBatch.batchCode + '?')) { return; }
		var actions = [];
		for (var i = 0; i < apps.length; i++) {
			actions.push({ applicationNo: apps[i].applicationNo, sanctionedAmount: apps[i].sanctionedAmount, remarkText: apps[i].remarkText });
		}
		$loading.start('sample-1');
		$http.post('submitBatch/' + $scope.activeBatch.batchId + '?decision=' + decision, actions).success(function(res) {
			$loading.finish('sample-1');
			$rootScope.responseObject = res;
			$timeout(function() { $rootScope.responseObject = {}; }, 6000);
			if (res && res.successMessage) {
				$scope.activeBatch = null;
				$rootScope.faActiveBatch = null;
				$scope.loadBatches();
			}
		}).error(function() { $loading.finish('sample-1'); alert('Something went wrong.'); });
	};
	$scope.onRemarkChange = function(app) {

    var list = app.assistanceList || [];

    if (app.remark === 'Rejected') {

        // Rejected => Sanctioned Amount = 0
        app.sanctionedAmount = 0;

        angular.forEach(list, function(asst) {
            asst.sanctionedAmount = 0;
        });

    } else if (app.remark === 'Approved' || app.remark === 'Queried') {

        // Approved / Queried => Eligible Amount restore
        var total = 0;

        angular.forEach(list, function(asst) {
            asst.sanctionedAmount = asst.eligibleAmount;
            total += Number(asst.eligibleAmount) || 0;
        });

        if (list.length) {
            app.sanctionedAmount = total;
        } else {
            app.sanctionedAmount = app.eligibleAmount;
        }
    }
};
	// ==== Batch View + consolidated Batch-PDF Digital Signature ====
	// "Approved Batch (Digital Signature)" saves sanctioned amounts (NO status change)
	// and opens the Batch View page where the ONE consolidated Batch PDF is signed.
	$scope.currentBatchId = null;
	$scope.batchView = null;
	$scope.approveBatch = function() {
		var apps = ($scope.activeBatch && $scope.activeBatch.applications) || [];
		if (apps.length === 0) { alert('No applications in this batch.'); return; }
		var assistanceSanctions = [];
		for (var j = 0; j < apps.length; j++) {
			var list = apps[j].assistanceList || [];
			var total = 0, changed = false;
			// Per-assistance: Sanctioned must be a non-null number (0 allowed). Collect for UPSERT.
			for (var k = 0; k < list.length; k++) {
				var s = list[k].sanctionedAmount;
				if (s === null || s === undefined || s === '') {
					alert('Enter Sanctioned Amount for every assistance (application ' + apps[j].applicationNo + ').');
					return;
				}
				if (Number(s) < 0) {
					alert('Sanctioned Amount cannot be negative (application ' + apps[j].applicationNo + ').');
					return;
				}
				// Sanctioned Amount cannot exceed the Eligible Amount (0 is allowed).
				if (Number(s) > Number(list[k].eligibleAmount || 0)) {
					alert('Sanctioned Amount cannot be more than the Eligible Amount (application ' + apps[j].applicationNo
						+ (list[k].assistanceType ? ', ' + list[k].assistanceType : '')
						+ ' - Eligible: ' + (list[k].eligibleAmount || 0) + ').');
					return;
				}
				total += Number(s) || 0;
				if (Number(s) !== Number(list[k].eligibleAmount)) { changed = true; }
				assistanceSanctions.push({
					id: list[k].id,
					applicationId: apps[j].applicationNo,
					assistanceId: list[k].assistanceId,
					assistanceType: list[k].assistanceType,
					eligibleAmount: list[k].eligibleAmount,
					sanctionedAmount: s
				});
			}
			// Fallback when an application has no assistance rows: use the single app-level input.
			if (!list.length) {
				if (apps[j].sanctionedAmount === null || apps[j].sanctionedAmount === undefined || apps[j].sanctionedAmount === '') {
					alert('Every application must have a sanctioned amount before approval.');
					return;
				}
				if (Number(apps[j].sanctionedAmount) < 0) {
					alert('Sanctioned Amount cannot be negative (application ' + apps[j].applicationNo + ').');
					return;
				}
				// Sanctioned Amount cannot exceed the Eligible Amount (0 is allowed).
				if (Number(apps[j].sanctionedAmount) > Number(apps[j].eligibleAmount || 0)) {
					alert('Sanctioned Amount cannot be more than the Eligible Amount (application ' + apps[j].applicationNo + ').');
					return;
				}
				total = Number(apps[j].sanctionedAmount) || 0;
				if (Number(apps[j].sanctionedAmount) !== Number(apps[j].eligibleAmount)) { changed = true; }
			}
			// Remark Note mandatory if ANY sanctioned amount differs from its eligible amount.
			if (changed && (!apps[j].remarkText || !apps[j].remarkText.trim())) {
				alert('Remark Note is mandatory when a Sanctioned Amount differs from the Eligible Amount (application ' + apps[j].applicationNo + ').');
				return;
			}
			// Per-application Action changed from "Approved" to "Rejected"/"Queried" -> Remark/Note mandatory.
			if (apps[j].remark && apps[j].remark !== 'Approved' && (!apps[j].remarkText || !apps[j].remarkText.trim())) {
				alert('Remark / Note is mandatory when the Action is "' + apps[j].remark + '" (application ' + apps[j].applicationNo + ').');
				return;
			}
			apps[j].sanctionedAmount = total;   // app total (= sum of per-assistance) -> batch_detail
		}
		var actions = [];
		for (var i = 0; i < apps.length; i++) {
			// Save the per-application Collector Action (remark) + note along with the amounts.
			actions.push({ applicationNo: apps[i].applicationNo, sanctionedAmount: apps[i].sanctionedAmount, remark: apps[i].remark, remarkText: apps[i].remarkText });
		}
		var batchId = $scope.activeBatch.batchId;
		$loading.start('sample-1');
		// 1) UPSERT per-assistance sanctioned amounts, then 2) save the app totals + action (existing), then preview + sign.
		$http.post('saveSanctionedAmounts', assistanceSanctions).success(function() {
			$http.post('saveBatchAmounts/' + batchId, actions).success(function(res) {
				if (res && res.errorMessage) { $loading.finish('sample-1'); alert(res.errorMessage); return; }
				// On Digital-Signature click, apply the per-application Chairman Decision to each
				// application's status (Approved -> 6, Rejected -> -4, Queried -> 5). Then continue the
				// existing Preview + CDAC eSign flow on the Batch Sign page (#/batchSign/{batchId}).
				$http.post('applyCollectorDecisions/' + batchId, actions).success(function() {
					$loading.finish('sample-1');
					$window.location.href = '#/batchSign/' + batchId;
				}).error(function() { $loading.finish('sample-1'); alert('Could not apply the chairman decisions.'); });
			}).error(function() { $loading.finish('sample-1'); alert('Could not prepare the batch for signing.'); });
		}).error(function() { $loading.finish('sample-1'); alert('Could not save the sanctioned amounts.'); });
	};

	// Batch View / Signature page bootstrap.
	$scope.initBatchSign = function() {
		var batchId = $routeParams.batchId;
		if (!batchId) { $window.location.href = '#/batches'; return; }
		$scope.currentBatchId = batchId;
		$scope.signedDone = false;
		$scope.esignReady = false;
		$scope.esignLetterHtml = $sce.trustAsHtml('');
		$scope.approveConfirmed = false;
		$loading.start('sample-1');
		$http.get('batchViewData/' + batchId).success(function(d) {
			$scope.batchView = d || {};
			// esignApps drives appNoList() used by the reused eSign/DSC signing functions.
			$scope.esignApps = ($scope.batchView.applications || []);
			// Same split the batch grid uses, so this screen shows the amount table
			// (with its sub-total) and the comments-only table.
			for (var bi = 0; bi < $scope.esignApps.length; bi++) {
				$scope.splitAssistances($scope.esignApps[bi]);
			}
			// Once the batch is signed / approved, NEVER show the sign options again -> only download.
			if ($scope.batchView.signedPdfPath || $scope.batchView.currentStage === 'APPROVED') {
				$scope.signedDone = true;
			}
			$loading.finish('sample-1');
		}).error(function() { $loading.finish('sample-1'); });
		// The ONE consolidated Batch PDF HTML. Keep the RAW html (with styles) so CDAC eSign
		// signs the clean server-built PDF, not the style-stripped sanitized DOM.
		$http.get('batchApprovalSheetHtml/' + batchId).success(function(html) {
			$scope.batchPdfHtml = html;
			$scope.esignLetterHtml = $sce.trustAsHtml(html);
			$scope.esignReady = true;
		}).error(function() { $scope.esignReady = true; });
	};

	// Print the consolidated Batch PDF preview. Uses the HTML already fetched for
	// the on-screen preview, so what prints is exactly what the PDF will contain -
	// no second server round-trip and no chance of the two drifting apart.
	$scope.printBatchPdf = function() {
		var html = $scope.batchPdfHtml;
		if (!html) {
			alert('The Batch PDF is still being prepared. Please wait a moment and try again.');
			return;
		}
		var w = $window.open('', '_blank', 'width=1100,height=800');
		if (!w) {
			alert('Please allow pop-ups for this site to print the Batch PDF.');
			return;
		}
		w.document.open();
		w.document.write(html);
		w.document.close();
		w.focus();
		// Let the new window lay the document out before opening the print dialog.
		$timeout(function() {
			try { w.print(); } catch (e) { /* user can still print from the window */ }
		}, 400);
	};

	// Download the ONE consolidated signed Batch PDF (shared by Collector + GM-DTIC).
	$scope.downloadBatchSigned = function() {
		if ($scope.currentBatchId) { $window.open('downloadBatchSignedDocument/' + $scope.currentBatchId); }
	};

	// Approve the batch after the Collector has reviewed the preview and ticked the
	// confirmation box. Replaces the previous CDAC eSign / DSC signing step; the
	// server reuses the same finalisation, so statuses and the GM-DTIC hand-off
	// are unchanged.
	$scope.approveBatchWithoutSign = function() {
		if (!$scope.approveConfirmed) {
			alert('Please confirm that you have reviewed the Batch PDF.');
			return;
		}
		if (!confirm('Approve this batch and forward it to GM-DTIC?')) { return; }
		$loading.start('sample-1');
		$http.post('approveBatchWithoutSign/' + $scope.currentBatchId + '?confirmed=true')
			.success(function(res) {
				$loading.finish('sample-1');
				if (res && res.successMessage) {
					$scope.signedDone = true;
					alert(res.successMessage);
				} else {
					alert((res && res.errorMessage) ? res.errorMessage : 'Could not approve the batch.');
				}
			})
			.error(function() {
				$loading.finish('sample-1');
				alert('Could not approve the batch.');
			});
	};

	// ---- Approved applications (status 6) with signed-PDF download ----
	$scope.approvedList = [];
	$scope.loadApproved = function() {
		$loading.start('sample-1');
		var url = 'fetchApproved';
		if ($scope.searchText) { url = url + '?search=' + encodeURIComponent($scope.searchText); }
		$http.get(url).success(function(data) {
			$scope.approvedList = data || [];
			$loading.finish('sample-1');
		}).error(function() { $loading.finish('sample-1'); });
	};

	// ---- Dashboard: all applications processed by the Collector (Queried/Approved/Rejected/Pending) ----
	$scope.loadProcessed = function() {
		$loading.start('sample-1');
		var url = 'fetchProcessed';
		if ($scope.searchText) { url = url + '?search=' + encodeURIComponent($scope.searchText); }
		$http.get(url).success(function(data) {
			$scope.applications = data || [];
			$loading.finish('sample-1');
		}).error(function() { $loading.finish('sample-1'); });
	};

	// Download the STORED Collector-signed Batch PDF for an application (never regenerates);
	// shows a message when no signed Batch PDF exists.
	$scope.downloadCollectorSignedDoc = function(appId) {
		if (!appId) { return; }
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'downloadCollectorSignedDoc/' + appId, true);
		xhr.responseType = 'blob';
		xhr.onload = function() {
			if (xhr.status === 200) {
				var blob = xhr.response;
				var urlApi = window.URL || window.webkitURL;
				var link = document.createElement('a');
				link.href = urlApi.createObjectURL(blob);
				link.download = 'CollectorSigned-' + appId + '.pdf';
				document.body.appendChild(link); link.click(); document.body.removeChild(link);
			} else {
				alert('Collector Signed Document not available.');
			}
		};
		xhr.onerror = function() { alert('Collector Signed Document not available.'); };
		xhr.send();
	};

	// ---- decisions ----
	function postDecision(urlPath, selected, confirmMsg) {
		if (selected.length == 0) { alert('Please select at least one application.'); return; }
		if (!confirm(confirmMsg)) { return; }
		$loading.start('sample-1');
		$http.post(urlPath, selected).success(function(data) {
			$loading.finish('sample-1');
			$rootScope.responseObject = data;
			$timeout(function() { $rootScope.responseObject = {}; }, 5000);
			$scope.loadApplications();
		}).error(function() {
			$loading.finish('sample-1');
			alert('Something went wrong. Please try again.');
		});
	}

	$scope.reject = function() {
		postDecision('reject', $scope.getSelected(), 'Reject selected application(s)?');
	};
	$scope.markPending = function() {
		postDecision('pending', $scope.getSelected(), 'Mark selected application(s) as Pending?');
	};
	$scope.raiseQuery = function() {
		postDecision('query', $scope.getSelected(), 'Raise query on selected application(s)? They will be sent back to DTIC.');
	};

	// ---- Approve: digital signature is MANDATORY ----
	// Routes to the eSign approval screen which signs the FA acceptance/sanction
	// letter via the existing CDAC eSign flow. Status -> 6 is set ONLY by the
	// verified eSign callback (server side); there is no way to approve without a
	// valid signature.
	$scope.approve = function() {
		var selected = $scope.getSelected();
		if (selected.length == 0) { alert('Please select at least one application.'); return; }
		// Stash the selection for the eSign screen (batch signature for all).
		$rootScope.collectorEsignApps = selected;
		$window.location.href = '#/esignApproval';
	};

	// ---- eSign approval screen ----
	$scope.esignReady = false;
	$scope.esignLetterHtml = $sce.trustAsHtml('');
	$scope.aadhaarLast4Digits = '';

	$scope.initEsignApproval = function() {
		$scope.batchPdfHtml = null;   // legacy per-application flow -> sign the DOM, not a batch PDF
		var apps = $rootScope.collectorEsignApps;
		if (!apps || apps.length == 0) {
			$window.location.href = '#/dashboard';
			return;
		}
		$scope.esignApps = apps;
		// Build the combined acceptance/sanction letter HTML for all selected apps.
		var combined = '';
		var pending = apps.length;
		$loading.start('sample-1');
		angular.forEach(apps, function(a) {
			$http.get('approvalSheetHtml/' + a.applicationNo).success(function(html) {
				combined += '<div style="page-break-after:always">' + html + '</div>';
			}).error(function() {
				combined += '<div>Application ' + a.applicationNo + ' - letter unavailable.</div>';
			}).finally(function() {
				pending--;
				if (pending == 0) {
					$scope.esignLetterHtml = $sce.trustAsHtml(combined);
					$scope.esignReady = true;
					$loading.finish('sample-1');
				}
			});
		});
	};

	$scope.appNoList = function() {
		var ids = [];
		angular.forEach($scope.esignApps || [], function(a) {
			// Only Approved applications are signed / finalized. Rejected (-4) and Queried (5) are
			// excluded - their status was already applied on the Digital-Signature click (Chairman
			// Decision), and the eSign finalize would otherwise reject those non-approved statuses.
			if (a.currentStatusId !== -4 && a.currentStatusId !== 5) { ids.push(a.applicationNo); }
		});
		return ids.join(',');
	};

	// Two signing options (same as existing LOI/AO eSign screens).
	$scope.signOption = 'eSign';

	function buildBean() {
		return {
			type: 'COLLECTOR_APPROVAL',
			applicantNumber: $scope.appNoList(),
			aadhaarLast4Digits: $scope.aadhaarLast4Digits,
			remark: 'Collector approval',
			title: 'Digital Signature',   // routes PDF hashing to the working branch (fixes NPE)
			// Batch-wise: sign the RAW consolidated Batch HTML (with styles). Legacy: the DOM.
			unsignedBase64: $scope.batchPdfHtml
				? $scope.batchPdfHtml
				: (document.querySelector('.esignHtml') ? document.querySelector('.esignHtml').innerHTML : '')
		};
	}

	// ---- Option 1: Aadhaar-based eSign (CDAC gateway) ----
	$scope.eSignApprove = function() {
		if (!$scope.aadhaarLast4Digits || $scope.aadhaarLast4Digits.length != 4) {
			alert('Please enter the last 4 digits of Aadhaar.');
			return;
		}
		$loading.start('sample-1');
		$http.post('eSignature', buildBean()).success(function(data) {
			$loading.finish('sample-1');
			if (!data || !data.aspUrl || !data.eHastaksharHiddenInputTAG) {
				alert('Unable to initiate eSign. Please try again.');
				return;
			}
			$('#msg').val(data.eHastaksharHiddenInputTAG);
			$('#ICGForm').attr('action', data.aspUrl);
			$('#ICGForm').submit();     // -> CDAC gateway (needs gov network)
		}).error(function() {
			$loading.finish('sample-1');
			alert('Unable to initiate eSign. Please try again.');
		});
	};

	// ---- Option 2: DSC sign (local jsonsigner utility on :8060) ----
	$scope.dscSign = function() {
		if (!confirm('Digitally sign & approve the selected application(s) using your DSC token?')) { return; }
		$loading.start('sample-1');
		$http.post('generateApprovalPDF', buildBean()).success(function(data) {
			if (!data || !data.eHastaksharHiddenInputTAG) {
				$loading.finish('sample-1');
				alert('Unable to prepare document for DSC signing.');
				return;
			}
			$scope.base64Response = data;
			var url = 'http://localhost:8060/jsonsigner/Sign';
			var payload = {
				ServerDateTime: data.serverDateTime,
				DocumentType: 'PDF',
				Data: data.eHastaksharHiddenInputTAG,
				SignatureName: data.signatureName,
				Reason: data.reason,
				Location: data.location
			};
			$http.post(url, payload).then(function(resp) {
				if (resp && resp.data && resp.data.SignedData) {
					// DigitalSignBean shape (value = signed PDF base64, billId = app list)
					var saveBean = {
						value: resp.data.SignedData,
						signedBase64PDF: resp.data.SignedData,
						transactionId: data.transactionId,
						billId: $scope.appNoList(),
						reason: 'Collector Approval'
					};
					$http.post('signApprovalPDF', saveBean).success(function(d) {
						$loading.finish('sample-1');
						if (d && d.successMessage) {
							// signing complete -> reveal Download Signed PDF button
							$scope.signedDone = true;
							$scope.signedAppNo = ($scope.appNoList().split(',')[0]) || '';
							alert('Digitally signed & approved successfully.');
						} else {
							alert(d && d.errorMessage ? d.errorMessage : 'Error saving the DSC-signed document.');
						}
					}).error(function() {
						$loading.finish('sample-1');
						alert('Error saving the DSC-signed document.');
					});
				} else {
					$loading.finish('sample-1');
					alert('Invalid response from DSC Signer. Please check your DSC setup (utility on port 8060).');
				}
			}, function() {
				$loading.finish('sample-1');
				alert('DSC signer not reachable. Install/run "Digital Signature setup" and try again.');
			});
		}).error(function() {
			$loading.finish('sample-1');
			alert('Unable to prepare document for DSC signing.');
		});
	};
});
