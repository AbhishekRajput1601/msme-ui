// Ported from angular/applicant/msme/controller.js. Regenerate with compile-applicant-services.py.
export function installAwardActions(state, { request, loading, navigation, params, later, format }) {
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,k));
const identity = value => value;
state.addMsmeApplicationAwardDetails = function(isValid) {
		  loading.start('sample-1');
			request.get('getMessage/common.confirmToSave').then(function (response) {
				if(!isValid) {
					loading.finish('sample-1');
				  return false;
				} else if (navigation.confirm(response.data.value)) {
					
						state.awardFormData.awardId=params.id;
					var responsePromise = request.post('addMsmeApplicationAwardDetails', state.awardFormData);
					responsePromise.success(function(data, status, headers, config) {
						state.responseObject = data;
						alert("Data saved successfully. Please upload the required documents!");
						loading.finish('sample-1');
						if(state.responseObject.successMessage != null) {
							navigation.location.href = '#uploadMsmeAwardDocs'+'/'+params.id+'/'+state.responseObject.id;
						}
						
					});
				} else {
					loading.finish('sample-1');
					return false;
				}
			});		
		};

state.addRow = function(list) {
		
	list.push({});
	
  };

state.applyFormInit = function(){
		state.loadMsmeAwardDetailsById();
		state.awardFormData={};
		state.awardFormData.indvPartnerDetailsList=[{}];
		state.awardFormData.productDetailsList=[{}];
		state.awardFormData.estPlantMachineList=[{}];
		state.awardFormData.polluControlInfoList=[{}];
		state.awardFormData.infoTaxRepaymentList=[{}];
		state.awardFormData.anyOtherInfoList=[{}];
		
		state.initializeVariousFormLists();
		
		loading.start('sample-1');
		 var responseCategories = request.get('fetchcategoriesmap');
		responseCategories.success(function(data, status, headers, config) {
		   state.categories = data;
		   loading.finish('sample-1');
		});
		
		loading.start('sample-1');
		 var responseFyears = request.get('fetchFinancialYear');
		 responseFyears.success(function(data, status, headers, config) {
		   state.fyList = data;
		   loading.finish('sample-1');
		});
		 
		 loading.start('sample-1');
		 var responseYears = request.get('fetchMasterYears');
		 responseYears.success(function(data, status, headers, config) {
		   state.yearsList = data;
		   loading.finish('sample-1');
		});
		 
		 loading.start('sample-1');
		 var responseCountries = request.get('fetchMasterCountries');
		 responseCountries.success(function(data, status, headers, config) {
		   state.countryList = data;
		   loading.finish('sample-1');
		});
	};

state.calcEmploymentTotal = function(dataArray){
		    var total=parseFloat("0");
		    each(dataArray, function(data){
		    	if(null!=data.amount){
		    		 total += parseFloat(data.amount);
		    	}
		    })
			 return total.toFixed(0)+""; 	 
		  };

state.calcTotal = function(dataArray){
	    var total=parseFloat("0");
	    each(dataArray, function(data){
	    	if(null!=data.amount){
	    		 total += parseFloat(data.amount);
	    	}
	    })
		 return total.toFixed(2)+""; 	 
	  };

state.downloadMsmeAwardDocument = function(documentTypeCode) {
							
							navigation.open('downloadMsmeAwardDocument/'+documentTypeCode+'/'+params.applicationId);

						};

state.draftMsmeApplicationAwardDetails = function() {
    	 loading.start('sample-1');
			request.get('getMessage/application.msme.want.saveasdraft').then(function (response) {
				
				  
				
					if (navigation.confirm(response.data.value)) {
						
						state.awardFormData.awardId=params.id;
					var responsePromise = request.post('addMsmeApplicationAwardDetails', state.awardFormData);
					responsePromise.success(function(data, status, headers, config) {
						state.responseObject1 = data;
						alert("Data saved as draft successfully.");
						state.responseObject1.successMessage="Data saved as draft successfully";
						if(state.responseObject1.successMessage != null) {
							navigation.location.href = '#editMsmeAward/'+state.awardFormData.awardId+'/'+state.responseObject1.id;
							later(function() {
								 state.responseObject1.successMessage = null;
						    }, 5000);
							loading.finish('sample-1');
						}
					});
				} else {
					loading.finish('sample-1');
					return false;
				}
			});		
		};

state.editFormInit = function() {
	    	  var responsePromise = request.get('loadMsmeAwardDetailsById/'+ params.id);
				responsePromise.success(function(data, status, headers, config) {
					state.awardData = data;
					state.awardData.financialYearId=data.financialYearId+"";
					
				});
	    	  
	 		 var responseCategories = request.get('fetchcategoriesmap');
	 		responseCategories.success(function(data, status, headers, config) {
	 		   state.categories = data;
	 		   
	 		});
	 		
	 		
	 		 var responseFyears = request.get('fetchFinancialYear');
	 		 responseFyears.success(function(data, status, headers, config) {
	 		   state.fyList = data;
	 		   
	 		});
	 		 
	 		
	 		 var responseYears = request.get('fetchMasterYears');
	 		 responseYears.success(function(data, status, headers, config) {
	 		   state.yearsList = data;
	 		 
	 		});
	 		 
	 		
	 		 var responseCountries = request.get('fetchMasterCountries');
	 		 responseCountries.success(function(data, status, headers, config) {
	 		   state.countryList = data;
	 		 
	 		});
				loading.start('sample-1');
				var applicationId = params.applicationId;
				var responsePromise = request.get('loadMsmeAwardApplicantDetailsById/'+applicationId);
				responsePromise.success(function(data, status, headers, config) {
					state.awardFormData = data;
					
					if(null!= data.womenEntrepreneur){
						state.awardFormData.womenEntrepreneur=''+data.womenEntrepreneur;
					}
					if(null!= data.anyQualityCertificate){
						state.awardFormData.anyQualityCertificate=''+data.anyQualityCertificate;
					}
					if(null!= data.anySpecialProgram){
						state.awardFormData.anySpecialProgram=''+data.anySpecialProgram;
					}
					if(null!= data.anyStateOfTheArt){
						state.awardFormData.anyStateOfTheArt=''+data.anyStateOfTheArt;
					}
					if(null!= data.areStartupCategory){
						state.awardFormData.areStartupCategory=''+data.areStartupCategory;
					}
					
					if(null!= data.isUnitInvolvedCsr){
						state.awardFormData.isUnitInvolvedCsr=''+data.isUnitInvolvedCsr;
					}
					
					if(null!= data.masterCategoryId){
						state.awardFormData.masterCategoryId=''+data.masterCategoryId;
					}
					
					
					if(null== state.awardFormData.capacityEstbList || state.awardFormData.capacityEstbList.length==0){
						state.awardFormData.capacityEstbList=[];
						for (var i=0; i<3; i++) {
							state.awardFormData.capacityEstbList.push({});
						}
					}else{
						for (var i=state.awardFormData.capacityEstbList.length; i<3; i++) {
							state.awardFormData.capacityEstbList.push({});
						}
					}
					
					
					if(null== state.awardFormData.annualProdCostList || state.awardFormData.annualProdCostList.length==0){
						state.awardFormData.annualProdCostList=[];
						for (var i=0; i<3; i++) {
							state.awardFormData.annualProdCostList.push({});
						}
					}else{
						for (var i=state.awardFormData.annualProdCostList.length; i<3; i++) {
							state.awardFormData.annualProdCostList.push({});
						}
					}
					
					
					
					if(null== state.awardFormData.salesProfitList || state.awardFormData.salesProfitList.length==0){
						state.awardFormData.salesProfitList=[];
						for (var i=0; i<3; i++) {
							state.awardFormData.salesProfitList.push({});
						}
					}else{
						for (var i=state.awardFormData.salesProfitList.length; i<3; i++) {
							state.awardFormData.salesProfitList.push({});
						}
					}
					
					
					
					if(null== state.awardFormData.netProfitList || state.awardFormData.netProfitList.length==0){
						state.awardFormData.netProfitList=[];
						for (var i=0; i<3; i++) {
							state.awardFormData.netProfitList.push({});
						}
					}else{
						for (var i=state.awardFormData.netProfitList.length; i<3; i++) {
							state.awardFormData.netProfitList.push({});
						}
					}
					
					
					
					
					if(null== state.awardFormData.exportInfoList || state.awardFormData.exportInfoList.length==0){
						state.awardFormData.exportInfoList=[];
						for (var i=0; i<3; i++) {
							state.awardFormData.exportInfoList.push({});
						}
					}else{
						for (var i=state.awardFormData.exportInfoList.length; i<3; i++) {
							state.awardFormData.exportInfoList.push({});
						}
					}
					
					
					
					if(null== state.awardFormData.sourceUseElectList || state.awardFormData.sourceUseElectList.length==0){
						state.awardFormData.sourceUseElectList=[];
						for (var i=0; i<3; i++) {
							state.awardFormData.sourceUseElectList.push({});
						}
					}else{
						for (var i=state.awardFormData.sourceUseElectList.length; i<3; i++) {
							state.awardFormData.sourceUseElectList.push({});
						}
					}
					
					if(null==state.awardFormData.indvPartnerDetailsList || state.awardFormData.indvPartnerDetailsList.length==0){
						state.awardFormData.indvPartnerDetailsList=[{}];
					}
					if(null==state.awardFormData.productDetailsList || state.awardFormData.productDetailsList.length==0){
						state.awardFormData.productDetailsList=[{}];
					}
					if(null==state.awardFormData.estPlantMachineList || state.awardFormData.estPlantMachineList.length==0){
						state.awardFormData.estPlantMachineList=[{}];
					}
					if(null==state.awardFormData.polluControlInfoList || state.awardFormData.polluControlInfoList.length==0){
						state.awardFormData.polluControlInfoList=[{}];
					}
					if(null==state.awardFormData.infoTaxRepaymentList || state.awardFormData.infoTaxRepaymentList.length==0){
						state.awardFormData.infoTaxRepaymentList=[{}]
					}
					if(null==state.awardFormData.anyOtherInfoList || state.awardFormData.anyOtherInfoList.length==0){
						state.awardFormData.anyOtherInfoList=[{}]
					}
					
					loading.finish('sample-1');
				});
			};

state.initializeVariousFormLists = function(){
		
		state.awardFormData.fixedAssetsList=[];
		for (var i=0; i<5; i++) {
			state.awardFormData.fixedAssetsList.push({});
		}
		
		state.awardFormData.fixedAssetsList[0].details='Land';
		state.awardFormData.fixedAssetsList[1].details='Building';
		state.awardFormData.fixedAssetsList[2].details='Plant and Machinery';
		state.awardFormData.fixedAssetsList[3].details='Other Fixed Costs';
		state.awardFormData.fixedAssetsList[4].details='Working Capital';
		
		
		state.awardFormData.employmentList=[];
		for (var i=0; i<8; i++) {
			state.awardFormData.employmentList.push({});
		}
		state.awardFormData.employmentList[0].details='Permanent employees - Female';
		state.awardFormData.employmentList[1].details='Permanent employees - Male';
		state.awardFormData.employmentList[2].details='Permanent employees - SC';
		state.awardFormData.employmentList[3].details='Permanent employees - ST';
		
		
		state.awardFormData.employmentList[4].details='Permanent employees - Differently Abled';
		state.awardFormData.employmentList[5].details='Permanent employees - Other Backward Class';
		state.awardFormData.employmentList[6].details='Temporary employees - Female';
		state.awardFormData.employmentList[7].details='Temporary employees - Male';
		
		
		state.awardFormData.capacityEstbList=[];
		for (var i=0; i<3; i++) {
			state.awardFormData.capacityEstbList.push({});
		}
		
		
		state.awardFormData.annualProdCostList=[];
		for (var i=0; i<3; i++) {
			state.awardFormData.annualProdCostList.push({});
		}
		
		
		state.awardFormData.salesProfitList=[];
		for (var i=0; i<3; i++) {
			state.awardFormData.salesProfitList.push({});
		}
		
		
		state.awardFormData.netProfitList=[];
		for (var i=0; i<3; i++) {
			state.awardFormData.netProfitList.push({});
		}
		
		
		state.awardFormData.exportInfoList=[];
		for (var i=0; i<3; i++) {
			state.awardFormData.exportInfoList.push({});
		}
		
		
		state.awardFormData.sourceUseElectList=[];
		for (var i=0; i<3; i++) {
			state.awardFormData.sourceUseElectList.push({});
		}
		
	};

state.loadMSMEAwardDocumentsInit = function() {
				loading.start('sample-1');
				var applicationId = params.applicationId;
				var responsePromise = request.get('loadMsmeAwardApplicantDetailsById/'+applicationId);
				responsePromise.success(function(data, status, headers, config) {
					state.awardData = data;
					loading.finish('sample-1');
				});
			};

state.loadMsmeAwardDetailsById = function() {
		loading.start('sample-1');
		
		var responsePromise = request.get('loadMsmeAwardDetailsById/'+ params.id);
		responsePromise.success(function(data, status, headers, config) {
			state.awardData = data;
			state.awardData.financialYearId=data.financialYearId+"";
			loading.finish('sample-1');
		});
		
		
	};

state.loadMsmeAwardDocumentsList = function() {
					    
						loading.start('sample-1');
						var responsePromise = request.get('fetchMsmeAwardDocumentsList', {params: {'applicationId': params.applicationId}});
						responsePromise.success(function(data, status, headers, config) {
						state.applicantDocumentsList = data;
						
						loading.finish('sample-1');
						});
					};

state.removeRow = function(list) {
	 
	  	var lastItem = list.length-1;
	  	list.splice(lastItem);
  };

state.uploadMSMEAwardDocuments = function() {
				
				 var fd = new FormData();
				  
				  if(state.awardData.MSME_AWARD_QUALITY_CERT) {
					  fd.append('MSME_AWARD_QUALITY_CERT', state.awardData.MSME_AWARD_QUALITY_CERT);  
				  }
				  if(state.awardData.MSME_AWARD_SPL_PROG_SCHEME_LEV) {
					  fd.append('MSME_AWARD_SPL_PROG_SCHEME_LEV', state.awardData.MSME_AWARD_SPL_PROG_SCHEME_LEV);  
				  }
				  if(state.awardData.MSME_AWARD_STATE_OF_ART_TECH) {
					  fd.append('MSME_AWARD_STATE_OF_ART_TECH', state.awardData.MSME_AWARD_STATE_OF_ART_TECH);  
				  }
				  if(state.awardData.MSME_AWARD_STARTUP_CATEGORY) {
					  fd.append('MSME_AWARD_STARTUP_CATEGORY', state.awardData.MSME_AWARD_STARTUP_CATEGORY);  
				  }
				  if(state.awardData.MSME_AWARD_UNIT_INVOLVED_CSR) {
					  fd.append('MSME_AWARD_UNIT_INVOLVED_CSR', state.awardData.MSME_AWARD_UNIT_INVOLVED_CSR);  
				  }
				  if(state.awardData.MSME_AWARD_UAM_EM1_REGISTRATION) {
					  fd.append('MSME_AWARD_UAM_EM1_REGISTRATION', state.awardData.MSME_AWARD_UAM_EM1_REGISTRATION);  
				  }
				  
				  
				  if(state.awardData.Deed_under_Indian_Partnership_Act) {
					  fd.append('Deed_under_Indian_Partnership_Act', state.awardData.Deed_under_Indian_Partnership_Act);  
				  }
				  if(state.awardData.Certificate_of_Category_of_Unit) {
					  fd.append('Certificate_of_Category_of_Unit', state.awardData.Certificate_of_Category_of_Unit);  
				  }
				  
				  
				  if(state.awardData.MSME_AWARD_AUTH_LETTER_AUTHE_PERSON) {
					  fd.append('MSME_AWARD_AUTH_LETTER_AUTHE_PERSON', state.awardData.MSME_AWARD_AUTH_LETTER_AUTHE_PERSON);  
				  }
				  if(state.awardData.MSME_AWARD_INFO_TAX_REPAYMENT) {
					  fd.append('MSME_AWARD_INFO_TAX_REPAYMENT', state.awardData.MSME_AWARD_INFO_TAX_REPAYMENT);  
				  }
				  
				  
				  if(state.awardData.anyOtherInfoListDoc_0) {
					  fd.append('anyOtherInfoListDoc_0', state.awardData.anyOtherInfoListDoc_0);  
				  }
				  if(state.awardData.anyOtherInfoListDoc_1) {
					  fd.append('anyOtherInfoListDoc_1', state.awardData.anyOtherInfoListDoc_1);  
				  }
				  if(state.awardData.anyOtherInfoListDoc_2) {
					  fd.append('anyOtherInfoListDoc_2', state.awardData.anyOtherInfoListDoc_2);  
				  }
				  if(state.awardData.anyOtherInfoListDoc_3) {
					  fd.append('anyOtherInfoListDoc_3', state.awardData.anyOtherInfoListDoc_3);  
				  }
				  if(state.awardData.anyOtherInfoListDoc_4) {
					  fd.append('anyOtherInfoListDoc_4', state.awardData.anyOtherInfoListDoc_4);  
				  }
			      
				  fd.append('applicationId', params.applicationId);
				  
				  fd.append('bookingEndDate', state.awardData.bookingEndDate);  
				  
				  
				  request.get('getMessage/common.confirmToSave').then(function (response) {
						if (navigation.confirm(response.data.value)) {
							
							 loading.start('sample-1');
							  var responsePromise = request.post('addMsmeAwardApplicantDocuments', fd, {
					          transformRequest: identity,
					          headers: {'Content-Type': undefined}
					         });
							  
							  responsePromise.success(function(data, status, headers, config) {
									state.responseObject1 = data;
						            if(null!=state.responseObject1.errorMsgList && state.responseObject1.errorMsgList.length>0) {
										alert("File validation Error!");
										loading.finish('sample-1');
									} else if(state.responseObject1.successMessage != null) {
										request.get('getMessage/fa.applicant.detailsSubmit').then(function (response) {
												
												navigation.location.href = '#msmeAwardList';	
												later(function() {
													 state.responseObject1.successMessage = null;
											    }, 5000);
									});
									loading.finish('sample-1');
								  }
							});
						} else {
							return false;
						}
					});	
	      };

state.viewFormInit = function() {
				var responsePromise = request.get('loadMsmeAwardDetailsById/'+ params.id);
				responsePromise.success(function(data, status, headers, config) {
					state.awardData = data;
					state.awardData.financialYearId=data.financialYearId+"";
					
				});
		    	 
					loading.start('sample-1');
					var applicationId = params.applicationId;
					var responsePromise = request.get('loadMsmeAwardApplicantDetailsById/'+applicationId);
					responsePromise.success(function(data, status, headers, config) {
						state.awardFormData = data;
						
						
						if(null== state.awardFormData.capacityEstbList || state.awardFormData.capacityEstbList.length==0){
							state.awardFormData.capacityEstbList=[];
							for (var i=0; i<3; i++) {
								state.awardFormData.capacityEstbList.push({});
							}
						}else{
							for (var i=state.awardFormData.capacityEstbList.length; i<3; i++) {
								state.awardFormData.capacityEstbList.push({});
							}
						}
						
						
						if(null== state.awardFormData.annualProdCostList || state.awardFormData.annualProdCostList.length==0){
							state.awardFormData.annualProdCostList=[];
							for (var i=0; i<3; i++) {
								state.awardFormData.annualProdCostList.push({});
							}
						}else{
							for (var i=state.awardFormData.annualProdCostList.length; i<3; i++) {
								state.awardFormData.annualProdCostList.push({});
							}
						}
						
						
						
						if(null== state.awardFormData.salesProfitList || state.awardFormData.salesProfitList.length==0){
							state.awardFormData.salesProfitList=[];
							for (var i=0; i<3; i++) {
								state.awardFormData.salesProfitList.push({});
							}
						}else{
							for (var i=state.awardFormData.salesProfitList.length; i<3; i++) {
								state.awardFormData.salesProfitList.push({});
							}
						}
						
						
						
						if(null== state.awardFormData.netProfitList || state.awardFormData.netProfitList.length==0){
							state.awardFormData.netProfitList=[];
							for (var i=0; i<3; i++) {
								state.awardFormData.netProfitList.push({});
							}
						}else{
							for (var i=state.awardFormData.netProfitList.length; i<3; i++) {
								state.awardFormData.netProfitList.push({});
							}
						}
						
						
						
						
						if(null== state.awardFormData.exportInfoList || state.awardFormData.exportInfoList.length==0){
							state.awardFormData.exportInfoList=[];
							for (var i=0; i<3; i++) {
								state.awardFormData.exportInfoList.push({});
							}
						}else{
							for (var i=state.awardFormData.exportInfoList.length; i<3; i++) {
								state.awardFormData.exportInfoList.push({});
							}
						}
						
						
						
						if(null== state.awardFormData.sourceUseElectList || state.awardFormData.sourceUseElectList.length==0){
							state.awardFormData.sourceUseElectList=[];
							for (var i=0; i<3; i++) {
								state.awardFormData.sourceUseElectList.push({});
							}
						}else{
							for (var i=state.awardFormData.sourceUseElectList.length; i<3; i++) {
								state.awardFormData.sourceUseElectList.push({});
							}
						}
						
						if(null==state.awardFormData.indvPartnerDetailsList || state.awardFormData.indvPartnerDetailsList.length==0){
							state.awardFormData.indvPartnerDetailsList=[{}];
						}
						if(null==state.awardFormData.productDetailsList || state.awardFormData.productDetailsList.length==0){
							state.awardFormData.productDetailsList=[{}];
						}
						if(null==state.awardFormData.estPlantMachineList || state.awardFormData.estPlantMachineList.length==0){
							state.awardFormData.estPlantMachineList=[{}];
						}
						if(null==state.awardFormData.polluControlInfoList || state.awardFormData.polluControlInfoList.length==0){
							state.awardFormData.polluControlInfoList=[{}];
						}
						if(null==state.awardFormData.infoTaxRepaymentList || state.awardFormData.infoTaxRepaymentList.length==0){
							state.awardFormData.infoTaxRepaymentList=[{}]
						}
						if(null==state.awardFormData.anyOtherInfoList || state.awardFormData.anyOtherInfoList.length==0){
							state.awardFormData.anyOtherInfoList=[{}]
						}
						state.loadMsmeAwardDocumentsList();
						loading.finish('sample-1');
					});
				};
}
