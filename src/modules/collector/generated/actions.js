// Generated from CollectorController.js and FaViewController.js.
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,k));
const $sce = { trustAsHtml: x => x };
export function installCollectorActions(state, {request, navigation, loading, params, later}) {
state.loadApplications = function() {
		loading.start('sample-1');
		var url = 'fetchApplications';
		if (state.searchText) {
			url = url + '?search=' + encodeURIComponent(state.searchText);
		}
		request.get(url).success(function(data) {
			state.applications = data || [];
			each(state.applications, function(a) {
				a.selected = false;
				if (!a.remark) { a.remark = ''; }
			});
			loading.finish('sample-1');
		}).error(function() {
			loading.finish('sample-1');
		});
	};
state.pendingCount = function() {
		return state.applications ? state.applications.length : 0;
	};
state.isProcessed = function(app) {
		return app.currentStatusId != 22;
	};
state.getSelected = function() {
		var selected = [];
		each(state.applications, function(a) {
			if (a.selected && !state.isProcessed(a)) {
				selected.push({ applicationNo: a.applicationId, remark: a.remark });
			}
		});
		return selected;
	};
state.loadDetail = function(applicationNo) {
		if (!applicationNo) { applicationNo = params.applicationNo; }
		if (!applicationNo) { return; }
		loading.start('sample-1');
		request.get('detailData/' + applicationNo).success(function(data) {
			state.detail = data;
			loading.finish('sample-1');
		}).error(function() { loading.finish('sample-1'); });
		request.get('history/' + applicationNo).success(function(data) {
			state.detailHistory = data || [];
		});
		
		request.get('dticEligible/' + applicationNo).success(function(data) {
			state.dticInfo = data || {};
		});
		
		request.get('applicantAssistances/' + applicationNo).success(function(data) {
			state.assistanceList = data || [];
		});
	};
state.secretaryRemarks = function() {
		return (state.detailHistory || []).filter(function(h) { return h.roleCode == 'ROLE_SECRETARY'; });
	};
state.ldmRemarks = function() {
		return (state.detailHistory || []).filter(function(h) { return h.roleCode == 'ROLE_LDM'; });
	};
state.viewDetail = function(app) {
		navigation.location.href = '#/detail/' + app.applicationId;
	};
state.documentList = function() {
		var d = state.detail;
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
		each(defs, function(x) { if (x[1]) { out.push({ label: x[0], id: x[1] }); } });
		return out;
	};
state.viewProgress = function(app) {
		var id = app && (app.applicationId || app.applicationNo);
		if (id) { navigation.location.href = '#fa/viewfaapplicantHistory/' + id + '/Unit'; }
	};
state.hasAssistanceRemark = function(asst) {
		return !!(asst && asst.remark && String(asst.remark).trim() !== '');
	};
state.assistanceAmountText = function(asst) {
		if (!asst || asst.eligibleAmount == null) { return '-'; }
		if (Number(asst.eligibleAmount) === 0 && state.hasAssistanceRemark(asst)) { return '--'; }
		return asst.eligibleAmount;
	};
state.isCommentOnlyAssistance = function(asst) {
		return !!asst && Number(asst.eligibleAmount) === 0 && state.hasAssistanceRemark(asst);
	};
state.splitAssistances = function(app) {
		var list = (app && app.assistanceList) || [];
		var amt = [], cmt = [];
		for (var i = 0; i < list.length; i++) {
			if (state.isCommentOnlyAssistance(list[i])) { cmt.push(list[i]); }
			else { amt.push(list[i]); }
		}
		app.amountAssist = amt;
		app.commentAssist = cmt;
	};
state.subtotalProposed = function(app) {
		var list = (app && app.amountAssist) || [];
		var t = 0;
		for (var i = 0; i < list.length; i++) { t += Number(list[i].eligibleAmount) || 0; }
		return Math.round(t * 100) / 100;
	};
state.subtotalApproved = function(app) {
		var list = (app && app.amountAssist) || [];
		var t = 0;
		for (var i = 0; i < list.length; i++) { t += Number(list[i].sanctionedAmount) || 0; }
		return Math.round(t * 100) / 100;
	};
state.showAssistanceRemark = function(asst) {
		state.assistRemarkTitle = (asst && asst.assistanceType) || 'Comment';
		state.assistRemarkText = (asst && asst.remark) || '';
		state.assistRemarkOpen = true;
	};
state.closeAssistanceRemark = function() {
		state.assistRemarkOpen = false;
	};
state.loadBatches = function() {
		request.get('fetchBatches').success(function(d) { state.batches = d || []; });
		
		
		
		if (state.faActiveBatch) { state.activeBatch = state.faActiveBatch; }
	};
state.openBatch = function(b) {
		loading.start('sample-1');
		request.get('batchDetail/' + b.batchId).success(function(d) {
			loading.finish('sample-1');
			state.activeBatch = d;
			state.faActiveBatch = d;
			var apps = (d && d.applications) || [];
			for (var i = 0; i < apps.length; i++) {
				
				
				
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
				
				if (!apps[i].remark) { apps[i].remark = 'Approved'; }
				
				
				state.splitAssistances(apps[i]);
			}
		}).error(function() { loading.finish('sample-1'); });
	};
state.closeBatch = function() { state.activeBatch = null; state.faActiveBatch = null; };
state.viewSignatures = function(a) {
		request.get('signatures/' + a.applicationNo).success(function(d) {
			var s = (d || []).map(function(x) { return x.roleCode + ': ' + x.signStatus; }).join('\n');
			alert('Signatures for ' + a.applicationNo + '\n' + (s || 'None yet'));
		});
	};
state.submitBatch = function(decision) {
		var apps = (state.activeBatch && state.activeBatch.applications) || [];
		if (decision === 'Approve') {
			for (var j = 0; j < apps.length; j++) {
				if (!apps[j].sanctionedAmount || apps[j].sanctionedAmount <= 0) {
					alert('Every application must have a sanctioned amount before approval.');
					return;
				}
			}
		}
		if (!confirm('Confirm "' + decision + '" for the entire batch ' + state.activeBatch.batchCode + '?')) { return; }
		var actions = [];
		for (var i = 0; i < apps.length; i++) {
			actions.push({ applicationNo: apps[i].applicationNo, sanctionedAmount: apps[i].sanctionedAmount, remarkText: apps[i].remarkText });
		}
		loading.start('sample-1');
		request.post('submitBatch/' + state.activeBatch.batchId + '?decision=' + decision, actions).success(function(res) {
			loading.finish('sample-1');
			state.responseObject = res;
			later(function() { state.responseObject = {}; }, 6000);
			if (res && res.successMessage) {
				state.activeBatch = null;
				state.faActiveBatch = null;
				state.loadBatches();
			}
		}).error(function() { loading.finish('sample-1'); alert('Something went wrong.'); });
	};
state.onRemarkChange = function(app) {

    var list = app.assistanceList || [];

    if (app.remark === 'Rejected') {

        
        app.sanctionedAmount = 0;

        each(list, function(asst) {
            asst.sanctionedAmount = 0;
        });

    } else if (app.remark === 'Approved' || app.remark === 'Queried') {

        
        var total = 0;

        each(list, function(asst) {
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
state.approveBatch = function() {
		var apps = (state.activeBatch && state.activeBatch.applications) || [];
		if (apps.length === 0) { alert('No applications in this batch.'); return; }
		var assistanceSanctions = [];
		for (var j = 0; j < apps.length; j++) {
			var list = apps[j].assistanceList || [];
			var total = 0, changed = false;
			
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
			
			if (!list.length) {
				if (apps[j].sanctionedAmount === null || apps[j].sanctionedAmount === undefined || apps[j].sanctionedAmount === '') {
					alert('Every application must have a sanctioned amount before approval.');
					return;
				}
				if (Number(apps[j].sanctionedAmount) < 0) {
					alert('Sanctioned Amount cannot be negative (application ' + apps[j].applicationNo + ').');
					return;
				}
				
				if (Number(apps[j].sanctionedAmount) > Number(apps[j].eligibleAmount || 0)) {
					alert('Sanctioned Amount cannot be more than the Eligible Amount (application ' + apps[j].applicationNo + ').');
					return;
				}
				total = Number(apps[j].sanctionedAmount) || 0;
				if (Number(apps[j].sanctionedAmount) !== Number(apps[j].eligibleAmount)) { changed = true; }
			}
			
			if (changed && (!apps[j].remarkText || !apps[j].remarkText.trim())) {
				alert('Remark Note is mandatory when a Sanctioned Amount differs from the Eligible Amount (application ' + apps[j].applicationNo + ').');
				return;
			}
			
			if (apps[j].remark && apps[j].remark !== 'Approved' && (!apps[j].remarkText || !apps[j].remarkText.trim())) {
				alert('Remark / Note is mandatory when the Action is "' + apps[j].remark + '" (application ' + apps[j].applicationNo + ').');
				return;
			}
			apps[j].sanctionedAmount = total;   
		}
		var actions = [];
		for (var i = 0; i < apps.length; i++) {
			
			actions.push({ applicationNo: apps[i].applicationNo, sanctionedAmount: apps[i].sanctionedAmount, remark: apps[i].remark, remarkText: apps[i].remarkText });
		}
		var batchId = state.activeBatch.batchId;
		loading.start('sample-1');
		
		request.post('saveSanctionedAmounts', assistanceSanctions).success(function() {
			request.post('saveBatchAmounts/' + batchId, actions).success(function(res) {
				if (res && res.errorMessage) { loading.finish('sample-1'); alert(res.errorMessage); return; }
				
				
				
				request.post('applyCollectorDecisions/' + batchId, actions).success(function() {
					loading.finish('sample-1');
					navigation.location.href = '#/batchSign/' + batchId;
				}).error(function() { loading.finish('sample-1'); alert('Could not apply the chairman decisions.'); });
			}).error(function() { loading.finish('sample-1'); alert('Could not prepare the batch for signing.'); });
		}).error(function() { loading.finish('sample-1'); alert('Could not save the sanctioned amounts.'); });
	};
state.initBatchSign = function() {
		var batchId = params.batchId;
		if (!batchId) { navigation.location.href = '#/batches'; return; }
		state.currentBatchId = batchId;
		state.signedDone = false;
		state.esignReady = false;
		state.esignLetterHtml = $sce.trustAsHtml('');
		state.approveConfirmed = false;
		loading.start('sample-1');
		request.get('batchViewData/' + batchId).success(function(d) {
			state.batchView = d || {};
			
			state.esignApps = (state.batchView.applications || []);
			
			
			for (var bi = 0; bi < state.esignApps.length; bi++) {
				state.splitAssistances(state.esignApps[bi]);
			}
			
			if (state.batchView.signedPdfPath || state.batchView.currentStage === 'APPROVED') {
				state.signedDone = true;
			}
			loading.finish('sample-1');
		}).error(function() { loading.finish('sample-1'); });
		
		
		request.get('batchApprovalSheetHtml/' + batchId).success(function(html) {
			state.batchPdfHtml = html;
			state.esignLetterHtml = $sce.trustAsHtml(html);
			state.esignReady = true;
		}).error(function() { state.esignReady = true; });
	};
state.approveBatchWithoutSign = function() {
		if (!state.approveConfirmed) {
			alert('Please confirm that you have reviewed the Batch PDF.');
			return;
		}
		if (!confirm('Approve this batch and forward it to GM-DTIC?')) { return; }
		loading.start('sample-1');
		request.post('approveBatchWithoutSign/' + state.currentBatchId + '?confirmed=true')
			.success(function(res) {
				loading.finish('sample-1');
				if (res && res.successMessage) {
					state.signedDone = true;
					alert(res.successMessage);
				} else {
					alert((res && res.errorMessage) ? res.errorMessage : 'Could not approve the batch.');
				}
			})
			.error(function() {
				loading.finish('sample-1');
				alert('Could not approve the batch.');
			});
	};
state.loadApproved = function() {
		loading.start('sample-1');
		var url = 'fetchApproved';
		if (state.searchText) { url = url + '?search=' + encodeURIComponent(state.searchText); }
		request.get(url).success(function(data) {
			state.approvedList = data || [];
			loading.finish('sample-1');
		}).error(function() { loading.finish('sample-1'); });
	};
state.loadProcessed = function() {
		loading.start('sample-1');
		var url = 'fetchProcessed';
		if (state.searchText) { url = url + '?search=' + encodeURIComponent(state.searchText); }
		request.get(url).success(function(data) {
			state.applications = data || [];
			loading.finish('sample-1');
		}).error(function() { loading.finish('sample-1'); });
	};
state.reject = function() {
		postDecision('reject', state.getSelected(), 'Reject selected application(s)?');
	};
state.markPending = function() {
		postDecision('pending', state.getSelected(), 'Mark selected application(s) as Pending?');
	};
state.raiseQuery = function() {
		postDecision('query', state.getSelected(), 'Raise query on selected application(s)? They will be sent back to DTIC.');
	};
state.approve = function() {
		var selected = state.getSelected();
		if (selected.length == 0) { alert('Please select at least one application.'); return; }
		
		state.collectorEsignApps = selected;
		navigation.location.href = '#/esignApproval';
	};
state.initEsignApproval = function() {
		state.batchPdfHtml = null;   
		var apps = state.collectorEsignApps;
		if (!apps || apps.length == 0) {
			navigation.location.href = '#/dashboard';
			return;
		}
		state.esignApps = apps;
		
		var combined = '';
		var pending = apps.length;
		loading.start('sample-1');
		each(apps, function(a) {
			request.get('approvalSheetHtml/' + a.applicationNo).success(function(html) {
				combined += '<div style="page-break-after:always">' + html + '</div>';
			}).error(function() {
				combined += '<div>Application ' + a.applicationNo + ' - letter unavailable.</div>';
			}).finally(function() {
				pending--;
				if (pending == 0) {
					state.esignLetterHtml = $sce.trustAsHtml(combined);
					state.esignReady = true;
					loading.finish('sample-1');
				}
			});
		});
	};
state.appNoList = function() {
		var ids = [];
		each(state.esignApps || [], function(a) {
			
			
			
			if (a.currentStatusId !== -4 && a.currentStatusId !== 5) { ids.push(a.applicationNo); }
		});
		return ids.join(',');
	};
state.eSignApprove = function() {
		if (!state.aadhaarLast4Digits || state.aadhaarLast4Digits.length != 4) {
			alert('Please enter the last 4 digits of Aadhaar.');
			return;
		}
		loading.start('sample-1');
		request.post('eSignature', buildBean()).success(function(data) {
			loading.finish('sample-1');
			if (!data || !data.aspUrl || !data.eHastaksharHiddenInputTAG) {
				alert('Unable to initiate eSign. Please try again.');
				return;
			}
			$('#msg').val(data.eHastaksharHiddenInputTAG);
			$('#ICGForm').attr('action', data.aspUrl);
			$('#ICGForm').submit();     
		}).error(function() {
			loading.finish('sample-1');
			alert('Unable to initiate eSign. Please try again.');
		});
	};
state.dscSign = function() {
		if (!confirm('Digitally sign & approve the selected application(s) using your DSC token?')) { return; }
		loading.start('sample-1');
		request.post('generateApprovalPDF', buildBean()).success(function(data) {
			if (!data || !data.eHastaksharHiddenInputTAG) {
				loading.finish('sample-1');
				alert('Unable to prepare document for DSC signing.');
				return;
			}
			state.base64Response = data;
			var url = 'http://localhost:8060/jsonsigner/Sign';
			var payload = {
				ServerDateTime: data.serverDateTime,
				DocumentType: 'PDF',
				Data: data.eHastaksharHiddenInputTAG,
				SignatureName: data.signatureName,
				Reason: data.reason,
				Location: data.location
			};
			request.post(url, payload).then(function(resp) {
				if (resp && resp.data && resp.data.SignedData) {
					
					var saveBean = {
						value: resp.data.SignedData,
						signedBase64PDF: resp.data.SignedData,
						transactionId: data.transactionId,
						billId: state.appNoList(),
						reason: 'Collector Approval'
					};
					request.post('signApprovalPDF', saveBean).success(function(d) {
						loading.finish('sample-1');
						if (d && d.successMessage) {
							
							state.signedDone = true;
							state.signedAppNo = (state.appNoList().split(',')[0]) || '';
							alert('Digitally signed & approved successfully.');
						} else {
							alert(d && d.errorMessage ? d.errorMessage : 'Error saving the DSC-signed document.');
						}
					}).error(function() {
						loading.finish('sample-1');
						alert('Error saving the DSC-signed document.');
					});
				} else {
					loading.finish('sample-1');
					alert('Invalid response from DSC Signer. Please check your DSC setup (utility on port 8060).');
				}
			}, function() {
				loading.finish('sample-1');
				alert('DSC signer not reachable. Install/run "Digital Signature setup" and try again.');
			});
		}).error(function() {
			loading.finish('sample-1');
			alert('Unable to prepare document for DSC signing.');
		});
	};
}
export function installViewActions(state, {request, navigation, loading, params, later}) {
state.faData = {};
		state.disabled = true;                 
		state.applicationId = params.applicationId;

		
		
		
		
		
		
		state.isVerificationView = true;
		
		state.goBackToBatch = function() {
			navigation.location.hash = '#/batches';
		};

		
		state.showFaExpansionTable = function() {
			state.showExpFlag = false;
			if (state.faData.faIndustrialUnitBean
					&& state.faData.faIndustrialUnitBean.unitType == 'Other') {
				state.showExpFlag = true;
			}
		};

		state.showTextBox = function() {
			state.showprevAppId = (state.appliedBefore == 'yes');
		};

		
		state.sectorofinductryList = {};
		state.sectorofinductry1 = function() {
			request.get('fetchAllIndustryCategory').then(function(resp) {
				state.sectorofinductryList = resp.data;
				if (state.faData && state.faData.firmSector) {
					state.sectorName = resp.data[state.faData.firmSector];
				}
			}, function() {  });
		};

		
		function applyNullGuards(d) {
			if (null == d.industrialPartnerslist) { d.industrialPartnerslist = [{}]; }
			if (null == d.regNocList) { d.regNocList = [{}]; }
			if (null == d.faIndustrialUnitBean) { d.faIndustrialUnitBean = {}; }
			var u = d.faIndustrialUnitBean;
			if (null == u.activityDetailsList) { u.activityDetailsList = [{}]; }
			if (null == u.capitalInvestmentBeans) {
				u.capitalInvestmentBeans = [{ investmentName: 'Plant & Machinery' }, { investmentName: 'Building' }];
			}
			if (null == u.unitProductDetailsBeans) { u.unitProductDetailsBeans = [{}]; }
			if (null == u.unitExpansionDetailsBeans) {
				u.unitExpansionDetailsBeans = [
					{ description: 'Capital Investment in Plant & Machinery (in Lakh Rs.)' },
					{ description: 'Employment' }, {}];
			}
			if (null == d.faRequiredAssistanceBean) { d.faRequiredAssistanceBean = {}; }
			var a = d.faRequiredAssistanceBean;
			var lists = ['caExpInvDetailsBean', 'wasteMgmtEstbCompExpInvDetailsBeans',
				'entryTaxExempRawMatDetailsBeans', 'entryTaxExempFYProdSellDetailsBeans',
				'vatCstExempProdDetails', 'pharmaExpInvDetailsBeans'];
			for (var i = 0; i < lists.length; i++) {
				if (null == a[lists[i]] || a[lists[i]].length == 0) { a[lists[i]] = [{}]; }
			}
		}

		
		state.loadUserIndustrialDetailsByApplicationId = function() {
			if (!state.applicationId) { return; }
			loading.start('sample-1');
			request.get('fetchUserIndustrialDetailsByApplicationId', {
				params: { applicationId: state.applicationId }
			}).success(function(data) {
				state.faData = data || {};
				state.schemeYear = state.faData.schemeYear;   
				applyNullGuards(state.faData);
				state.appliedBefore = (state.faData.faIndustrialUnitBean.oldApplicationId != null) ? 'yes' : 'no';
				state.showTextBox();
				state.showFaExpansionTable();
				state.sectorofinductry1();
				loading.finish('sample-1');
			}).error(function() {
				loading.finish('sample-1');
			});
		};

		
		state.loadIndustryDetails = function() {  };

		
		state.downloadFaDocuments = function(documentId) {
			if (!documentId) { return; }
			navigation.open('downloadFaDocumentByDocumentId/' + documentId + '/' + state.applicationId);
		};

		
		state.downloadChequeDocuments = function(documentId) {
			if (!documentId) { return; }
			navigation.open('downloadDocumentById/' + documentId);
		};

		
		state.viewSchemeDetailForm = function() {  };

		state.printPage = function() { navigation.print(); };

		
		
		
		
		
		state.faApplicantBean = {};
		state.faRequestProcessBeanList = [];

		
		state.loadFAApplicantDetail = function() {
			if (!state.applicationId) { return; }
			request.get('fetchUserIndustrialDetailsByApplicationId', {
				params: { applicationId: state.applicationId }
			}).success(function(data) {
				data = data || {};
				state.faApplicantBean = {
					applicationId: data.applicationId || state.applicationId,
					fullName: data.fullName
						|| ((data.firstName ? (data.firstName + ' ' + (data.middleName || '') + ' ' + (data.lastName || '')) : '')
							|| ((data.poaFirstName || '') + ' ' + (data.poaLastName || ''))).trim()
						|| data.indOrgName,
					unitOrInstName: data.indOrgName || data.unitName || data.firmEntityName2,
					unitAddress: { districtName: data.district }
				};
			});
		};

		
		state.loadHistory = function() {
			state.applicationId = params.applicationId;
			state.establishmentType = params.establishmentType;
			if (state.establishmentType == 'Unit') { state.showUnitList = true; }
			else { state.showInstitueList = true; }
			if (!state.applicationId) { return; }
			loading.start('sample-1');
			request.get('fa/fetchHistory', {
				params: { applicationId: state.applicationId, establishmentType: state.establishmentType }
			}).success(function(data) {
				state.faRequestProcessBeanList = data || [];
				loading.finish('sample-1');
			}).error(function() { loading.finish('sample-1'); });
		};

		
		state.faDisbursementUnitView = function(status) {  };
	
state.calcTotal = function(dataArray){
		    var total=parseFloat("0");
		    each(dataArray, function(data){
		    	if(null!=data.amount){
		    		 total += parseFloat(data.amount);
		    	}
		    })
			 return total.toFixed(2)+""; 	 
		  };
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
state.calcTotalProductAnnualAmt = function(dataArray){
		    var total=parseFloat("0");
		    
		    each(dataArray, function(data){
			
		    	if(null!=data.annualCapacity){
		    		 total += parseFloat(data.annualCapacity);
		    	}
		    })
			 return total.toFixed(2)+"";  
		  };
}
