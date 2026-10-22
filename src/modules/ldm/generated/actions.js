// Generated from LdmController.js and FaViewController.js.
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,k));
export function installLdmActions(state, {request, navigation, loading, params, later}) {
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
		return app.currentStatusId != 21;
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
state.viewProgress = function(app) {
		var id = app && (app.applicationId || app.applicationNo);
		if (id) { navigation.location.href = '#fa/viewfaapplicantHistory/' + id + '/Unit'; }
	};
state.viewDetail = function(app) {
		navigation.location.href = '#/detail/' + app.applicationId;
	};
state.loadDetail = function(applicationNo) {
		if (!applicationNo) { applicationNo = params.applicationNo; }
		if (!applicationNo) { return; }
		state.applicationNo = applicationNo;
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
state.hasAssistanceRemark = function(asst) {
		return !!(asst && asst.remark && String(asst.remark).trim() !== '');
	};
state.assistanceAmountText = function(asst) {
		if (!asst || asst.eligibleAmount == null) { return '-'; }
		if (Number(asst.eligibleAmount) === 0 && state.hasAssistanceRemark(asst)) { return '--'; }
		return asst.eligibleAmount;
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
    request.get('batchDetail/' + b.batchId).success(function(d) {

        if (d && d.applications) {
            each(d.applications, function(app) {

                
                if (!app.remark) {
                    app.remark = 'Agree';
                }

            });
        }

        state.activeBatch = d;
        state.faActiveBatch = d;
    });
};
state.closeBatch = function() { state.activeBatch = null; state.faActiveBatch = null; };
state.submitBatch = function(decision) {
		var apps = (state.activeBatch && state.activeBatch.applications) || [];
		var actions = [];
		for (var i = 0; i < apps.length; i++) {
			var a = apps[i];
			if (!a.remark) { alert('Every application must have a remark before forwarding the batch.'); return; }
			
			if (a.remark === 'Disagree' && (!a.remarkText || !a.remarkText.trim())) {
				alert('Remark Note is mandatory when the decision is "Disagree" (application ' + a.applicationNo + ').');
				return;
			}
			actions.push({ applicationNo: a.applicationNo, remark: a.remark, remarkText: a.remarkText });
		}
		loading.start('sample-1');
		request.post('submitBatch/' + state.activeBatch.batchId, actions).success(function(res) {
			loading.finish('sample-1');
			state.responseObject = res;
			later(function() { state.responseObject = {}; }, 5000);
			if (res && res.successMessage) { state.activeBatch = null; state.faActiveBatch = null; state.loadBatches(); }
		}).error(function() { loading.finish('sample-1'); alert('Something went wrong.'); });
	};
state.submitVerify = function() {
		var selected = state.getSelected();
		if (selected.length == 0) { alert('Please select at least one application.'); return; }
		if (!confirm('Verify ' + selected.length + ' selected application(s)?')) { return; }
		loading.start('sample-1');
		request.post('verify', selected).success(function(data) {
			loading.finish('sample-1');
			state.responseObject = data;
			later(function() { state.responseObject = {}; }, 4000);
			state.loadApplications();
		}).error(function() {
			loading.finish('sample-1');
			alert('Something went wrong. Please try again.');
		});
	};
state.submitQuery = function() {
		var selected = state.getSelected();
		if (selected.length == 0) { alert('Please select at least one application.'); return; }
		if (!confirm('Raise query on ' + selected.length + ' selected application(s)? They will be sent back to DTIC.')) { return; }
		loading.start('sample-1');
		request.post('query', selected).success(function(data) {
			loading.finish('sample-1');
			state.responseObject = data;
			later(function() { state.responseObject = {}; }, 4000);
			state.loadApplications();
		}).error(function() {
			loading.finish('sample-1');
			alert('Something went wrong. Please try again.');
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
