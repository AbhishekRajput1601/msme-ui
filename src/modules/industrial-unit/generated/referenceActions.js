// Ported Industrial Unit calculations and data loading. React owns the state and DOM.
// Source: angular/applicant/fa/controller.js; regenerate with scripts/port-industrial-actions.py.
export function installReferenceActions(state, { request, loading, navigation, params, format, later, commit, dom }) {
const each = (items, callback) => Object.entries(items || {}).forEach(([key, value]) => callback(value, Array.isArray(items) ? Number(key) : key));
state.addFASchemeDetails = function(isValid, establishmentType) {
		
		if (!isValid)
			return false;
		request.get('getMessage/fa.applicant.detailsSubmit').then(function (response) {
			
			if (confirm(response.data.value)) {
				if(state.faData.caFirstSellBillDate){
	
					
					 state.faData.caFirstSellBillDate = state.faData.caFirstSellBillDate.split('/').join('-');
				}
				if(state.faData.entryTaxExempTinDate){
	
					state.faData.entryTaxExempTinDate = state.faData.entryTaxExempTinDate.split('/').join('-');
				}
				if(state.faData.entryTaxExempFirstRawMatBuyDate){
	
					state.faData.entryTaxExempFirstRawMatBuyDate = state.faData.entryTaxExempFirstRawMatBuyDate.split('/').join('-');
				}
				if(state.faData.vatCstExempTinDate){
	
					
					state.faData.vatCstExempTinDate = state.faData.vatCstExempTinDate.split('/').join('-');
				}
				if(state.faData.electFeeExempHtConnCompDate){
	
					
					state.faData.electFeeExempHtConnCompDate = state.faData.electFeeExempHtConnCompDate.split('/').join('-');
				}
				if(state.faData.mandeeFeeExempValidLicenceDate){
	
					
					state.faData.mandeeFeeExempValidLicenceDate = state.faData.mandeeFeeExempValidLicenceDate.split('/').join('-');
				}
				if(state.faData.trainingInstEstbDate){
	
					
					state.faData.trainingInstEstbDate = state.faData.trainingInstEstbDate.split('/').join('-');
				}
				
				loading.start('sample-1');
				var responsePromise = request.post('fa/addfaapplicantschemedetails', state.faData);
				responsePromise.success(function(data) {
					state.responseObject1 = data;
					if (state.responseObject1.successMessage != null) {
						navigation.location.reload();
						 later(function() {
							 state.responseObject1.successMessage = null;
					    }, 3000);
						if(establishmentType == 'Unit') {
							navigation.location.href = '#fa/viewfadocumentsuploadunit/'+state.responseObject1.id;	
						} else {
							navigation.location.href = '#fa/viewfadocumentsuploadapparel/'+state.responseObject1.id;
						}
					}
					loading.finish('sample-1');
				});
	        } else {
	       	 return false;
	        }
		});
	};

state.addFaNewChoice = function() {
		
		
			state.faData.faIndustrialUnitBean.unitProductDetailsBeans.push({});
			state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans.push({});
			
		
	  };

state.addNewHeadwise = function() {
		
		state.faData.faRequiredAssistanceBean.caExpInvDetailsBean.push({});
	
  };

state.addNewHeadwise1 = function() {
		
		state.faData.faRequiredAssistanceBean.pharmaExpInvDetailsBeans.push({});
	
  };

state.calTotalExpansion = function(isInt, data){
		  var expansionUnder=parseFloat("0");
		  var expansionPre=parseFloat("0");
		  if(null!= data.expansionUnder){
			  expansionUnder=parseFloat(data.expansionUnder);
		  }
		  if(null!= data.expansionPre){
			  expansionPre=parseFloat(data.expansionPre);
		  }
		  if(isInt){
			  return (expansionUnder + expansionPre)+""; 	 
		  }else{
			  return (expansionUnder + expansionPre).toFixed(2)+""; 	 
		  }
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

state.calcTotalDisAmt = function(dataArray) {

				var total = parseFloat("0");
				each(dataArray, function(data) {
					if (null != data.disbursementAmt) {
						total += parseFloat(data.disbursementAmt);
					}
				})
				return total;
			};

state.calcTotalInt = function(dataArray){
			    var total=parseFloat("0");
			    each(dataArray, function(data){
			    	if(null!=data.amount){
			    		 total += parseFloat(data.amount);
			    	}
			    })
				 return total+""; 	 
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

state.faDisbursementUnitView = function(status) {
						
						if(status=="Disbursement Letter Released"){
						
						navigation.location.href ='#fa/viewfaDisbursementUnit/'
								+ params.applicationId+'/'+ params.establishmentType;
								}
						else if(status=="Sanction Order Uploaded"){
						
						navigation.location.href ='#fa/viewfaacceptanceamountdetailunit/'
								+ params.applicationId+'/'+ params.establishmentType;
					}
						else if(status=="Inspection Approved"){
						
						navigation.location.href ='#viewfaacceptanceamountdetailunit/'
								+ params.applicationId+'/'+ params.establishmentType;
								}						
					};

state.fetchBankList1 = function() {

    loading.start('sample-1');

    request.get('fetchBankDetails')
        .then(function(response) {

            if (response.data) {

                state.addedList1 = response.data.value;

                state.bankList1 = JSON.parse(response.data.value);

                
                each(state.bankList1, function(bank) {
                    bank.id = parseInt(bank.id);
                });

                
                if (state.faData && state.faData.bankId) {
                    state.faData.bankId = parseInt(state.faData.bankId);
                }

                console.log("bankList1 =", state.bankList1);
                console.log("selected bankId =", state.faData.bankId);

                if (!state.bankList1 || state.bankList1.length === 0) {

                    alert("Please add Bank Details first.");

                    navigation.location.href = '#/bank/addBankDetails';
                }
            }

            loading.finish('sample-1');
        });
};

state.fetchDisbursementsDetails = function() {
				state.applicationId = params.applicationId;
				state.establishmentType = params.establishmentType;

				state.fasDisbursementList = {};
				state.IsVisible = false;
				

				loading.start('sample-1');

				var responsePromise = request
					.get(
						'fetchDisbursementsUpload' + '/' + params.applicationId
					);


				responsePromise.success(function(data) {
					state.fasDisbursementList = data;

					state.totalDisbursementAmt = state.calcTotalDisAmt(state.fasDisbursementList);

					state.loadFAMSMEDetailUnitForSanction();

					

				});

           

			};

state.fetchDistrictTehsilBlockByDistrict = function(districtId) {

			if (state.faData) {
				state.faData.tehsilId = "";
				state.faData.blockId = "";
			}

			if (null != districtId) {
				loading.start('sample-1');
				var responseDistricts = request.get(
					'fetchdistricttehsilmapbydistrictid', {
					params: {
						'districtId': districtId
					}
				});
				responseDistricts.success(function(data) {
					state.tehsils = data;
					var responseDistricts1 = request.get(
						'fetchdistrictblockmapbydistrictid', {
						params: {
							'districtId': districtId
						}
					});

					responseDistricts1.success(function(data) {
						state.blocks = data;
						loading.finish('sample-1');
					});
				});
			} else {
				state.tehsils = "";
				state.blocks = "";
			}
		};

state.fetchIndustrialAreasByDistrictId = function(districtId) {
					
					if(null!= districtId && districtId!=''){
					var responseAreas = request.get(
								'fetchindustrialareamapbydistrict', {
									params : {
										'districtId' : districtId
									}
								});
						responseAreas.success(function(data) {
							state.areas = data;
						});
					}else{
					  state.areas=null;
					}
						
					};

state.fetchPresentAddDistrictByState = function(stateId) {
		 	state.tehsils = null;
		 	state.blocks = null;
		 	if (null != stateId) {
		 		loading.start('sample-1');
		 		var responseDistricts = request.get('fetchdistrictmapbystate', {
		 			params: { 'stateId': stateId }
		 		});
		 		responseDistricts.success(function(data) {
		 			state.districts = data;
		 			loading.finish('sample-1');
		 		});
		 	} else {
		 		state.districts = null;
		 	}
		 };

state.fetchUnitAddressDetailsList = function(){
	 loading.start('sample-1');

    request({
        method: 'GET',
        url: 'fetchUnitAddressDetails',        
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        
        var list = JSON.parse(response.data.value);
         state.unitList = JSON.parse(response.data.value);
         

        if (list) {
           console.log(list);
        }

        loading.finish('sample-1');

    }, function (error) {
			alert("Error submitting Unit Address Details")        

        loading.finish('sample-1');
    });
};

state.fetchUnitAddressDetailsList1 = function () {

    loading.start('sample-1');

    request({
        method: 'GET',
        url: 'fetchUnitAddressDetails',
        headers: {
            'Content-Type': 'application/json'
        }

    }).then(function (response) {

        state.unitList = JSON.parse(response.data.value);

        
        each(state.unitList, function (unit) {

            unit.unitAddressId =
                String(unit.unitAddressId);

        });

        
        
        setTimeout(function () {

            commit(function () {

                if (state.faData &&
                    state.faData.unitAddressId) {

                    state.faData.unitAddressId =
                        String(state.faData.unitAddressId);
                }

            });

        }, 100);

        if (!state.unitList ||
            state.unitList.length === 0) {

            alert("Please Add Unit Address !!!");

            navigation.location.href =
                '#fa/addUnitDetailsform';
        }

        loading.finish('sample-1');

    }, function (error) {

        alert("Error submitting Unit Address Details");

        loading.finish('sample-1');
    });
};

state.findUserDetails = function () {
    state.disabled = true;

    loading.start('sample-1');

    request.get('fetchUserDetails', {
        params: {
            userId: ""
        }
    }).success(function (data, status, headers, config) {
        
        state.signupData = data;

        if(state.isUndefinedNullOrEmpty(state.signupData.permanentAddress1) ||
										state.isUndefinedNullOrEmpty(state.signupData.permanentStateId) ||
										state.isUndefinedNullOrEmpty(state.signupData.permanentDistrictId) ||
										state.isUndefinedNullOrEmpty(state.signupData.tehsilId) ||
										state.isUndefinedNullOrEmpty(state.signupData.proofOfIdentityUploadId) ||
										state.isUndefinedNullOrEmpty(state.signupData.proofOfIdentityNo) ||
										state.isUndefinedNullOrEmpty(state.signupData.panUploadId) ||
										state.isUndefinedNullOrEmpty(state.signupData.panNo) ||
										state.isUndefinedNullOrEmpty(state.signupData.mobileNumber)){
											alert("Please complete User Profile!!!");
											navigation.location.href = '#/updateprofileapplicant';
											return;
									}

        loading.finish('sample-1');
    });
};

state.getIndustryName = function (industryId) {	
    return state.sectorofinductryList[industryId] || industryId;
};

state.isUndefinedNullOrEmpty = function(value) {
		    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
		};

state.loadApplicantAndDistricts = function() {
		
		loading.start('sample-1');
		var responseStates = request.get('fetchallstates');
		responseStates.success(function(data) {
			state.respondentStates = data;
			
			var responseDistricts = request.get('fetchdistrictsmap');
			responseDistricts.success(function(data) {
				state.respondentDistricts = data;
				state.districts = data;
				state.unitDistricts = data;
				
				var responseCategories = request.get('fetchcategoriesmap');
					responseCategories.success(function(data) {
					state.categories = data;
					if(null!= params.applicationId){
						var responsePromise = request.get('fa/fetchfaapplicantdetail', {params: {'applicationId': params.applicationId}});
						responsePromise.success(function(data) {
						state.faData = data;
						state.faData.udyogAadhaar='no';
						state.faData.aadhaarEkyc='no';
						state.faData.womenEntrepreneur=''+data.womenEntrepreneur;
						if(null!= data.oldApplicationId){
							state.appliedBefore='yes';
						}else{
							state.appliedBefore='no';
						}
						
						if(state.faData.unitType=='Other' &&(state.faData.expansion || state.faData.diversification || state.faData.technicalUp)){
							state.anySelected=true;
						}
						
		               if(state.faData.unitAddress.district){
		            	   var responseDistricts1 = request.get('fetchalltehsilsmap', {
								params : {
									'districtId' : state.faData.unitAddress.district
								}
							});
							responseDistricts1.success(function(data) {
								state.unitTehsils = data;
								if(state.faData.applicantDistrict){
									var responseDistricts = request.get('fetchalltehsilsmap', {
										params : {
											'districtId' : state.faData.applicantDistrict
										}
									});
									responseDistricts.success(function(data) {
										state.tehsils = data;
									});
								}
								if(state.faData.applicantAddress.district){
									var responseDistricts = request.get('fetchalltehsilsmap', {
										params : {
											'districtId' : state.faData.applicantAddress.district
										}
									});
									responseDistricts.success(function(data) {
										state.tehsils = data;
									});
								}
								loading.finish('sample-1');
							});
						}
		               
					});
					}else{
						var responsePromise = request.get('fa/fetchfaapplicant');
						responsePromise.success(function(data) {
							state.faData = data;
							state.faData.state = "Madhya Pradesh";
							state.faData.applicantAddress = {};
							state.showExpFlag = false;
							var responsePromise = request.get('fa/fetchfaapplicant');
							responsePromise.success(function(data) {
								state.username = data.username;
								state.faData = data;
								state.faData.state = "Madhya Pradesh";
								state.faData.applicantAddress = {};
								state.showExpFlag = false;
								state.faData.activityDetailsList=[{}];
								loading.finish('sample-1');
							});
						});
					}
				});
			});
			
		});
			
	};

state.loadBanks = function() {
						var responseStatus = request.get('fetchBanksMap');
						responseStatus.success(function(data) {
							state.bankList = data;
						});
					};

state.loadFAApplicantDetail = function() {
		    
			loading.start('sample-1');
			var responsePromise = request.get('fa/fetchfaapplicantdetail', {params: {'applicationId': params.applicationId}});
			responsePromise.success(function(data) {
			state.faApplicantBean = data;
			loading.finish('sample-1');
			});
		};

state.loadFADocumentsInit = function() {
				loading.start('sample-1');
				state.applicationId = params.applicationId;
				var responsePromise = request.get('fa/fetchfaschemesdetail', {params: {'applicationId': params.applicationId}});
				responsePromise.success(function(data) {
					state.faData = data;
					loading.finish('sample-1');
					});
			};

state.loadFADocumentsList = function() {
			    
				loading.start('sample-1');
				var responsePromise = request.get('fetchfaapplicantdocumentslist', {params: {'applicationId': params.applicationId}});
				responsePromise.success(function(data) {
				state.applicantDocumentsList = data;
				state.applicationId = params.applicationId;
				loading.finish('sample-1');
				});
			};

state.loadFAMSMEDetailUnitForSanction = function() {
						state.faData = {};
						state.faMsmeDetailData={};
						loading.start('sample-1');
						var responsePromise = request
								.get(
										'fetchFAMSMEDetailUnitForSanction',
										{
											params : {
												'applicationId' : params.applicationId
											}
										});
						state.applicationId = params.applicationId;
						responsePromise
								.success(function(data) {
									state.faData = data;


												if (state.faData.faIndustSubsidyAmt!=null) {
													
												state.faMsmeDetailData.faIndustSubsidyAmt=state.faData.faIndustSubsidyAmt;
												}

					

												if (state.faData.faIndustSubsidyRemarks!=null) {
													state.faMsmeDetailData.faIndustSubsidyRemarks=state.faData.faIndustSubsidyRemarks;
												}
												
												if (state.faData.faQualityCerfAmt!=null) {
													
														state.faMsmeDetailData.faQualityCerfAmt=state.faData.faQualityCerfAmt;
												}
												
												if (state.faData.faqualityCerfAmtRemarks!=null) {
													
														state.faMsmeDetailData.faqualityCerfAmtRemarks=state.faData.faqualityCerfAmtRemarks;
												}
												
												if (state.faData.faReimbursementPatentsAmt!=null) {
													
														state.faMsmeDetailData.faReimbursementPatentsAmt=state.faData.faReimbursementPatentsAmt;
												}
												
												if (state.faData.faReimbursementPatentsAmtRemarks!=null) {
													
														state.faMsmeDetailData.faReimbursementPatentsAmtRemarks=state.faData.faReimbursementPatentsAmtRemarks;
												}
												
												if (state.faData.faInfraDevAmt!=null) {
													
														state.faMsmeDetailData.faInfraDevAmt=state.faData.faInfraDevAmt;
												}
												
													
												if (state.faData.faInfraDevAmtRemarks!=null) {
													
														state.faMsmeDetailData.faInfraDevAmtRemarks=state.faData.faInfraDevAmtRemarks;
												}
												
												if (state.faData.faPlantTreatAmt!=null) {
													
														state.faMsmeDetailData.faPlantTreatAmt=state.faData.faPlantTreatAmt;
												}
												
												if (state.faData.faPlantTreatAmtRemarks!=null) {
													
														state.faMsmeDetailData.faPlantTreatAmtRemarks=state.faData.faPlantTreatAmtRemarks;
												}
												
												if (state.faData.faEnergyAmt!=null) {
													
														state.faMsmeDetailData.faEnergyAmt=state.faData.faEnergyAmt;
												}
												
												
												if (state.faData.faEnergyAmtRemarks!=null) {
													
														state.faMsmeDetailData.faEnergyAmtRemarks=state.faData.faEnergyAmtRemarks;
												}
												
												if (state.faData.faUpgradeAmt!=null) {
													
														state.faMsmeDetailData.faUpgradeAmt=state.faData.faUpgradeAmt;
												}
												
												if (state.faData.faUpgradeAmtRemarks!=null) {
													
														state.faMsmeDetailData.faUpgradeAmtRemarks=state.faData.faUpgradeAmtRemarks;
												}
												
												if (state.faData.faPharmLabAmt!=null) {
													
														state.faMsmeDetailData.faPharmLabAmt=state.faData.faPharmLabAmt;
												}
												
												if (state.faData.faPharmLabAmtRemarks!=null) {
													
														state.faMsmeDetailData.faPharmLabAmtRemarks=state.faData.faPharmLabAmtRemarks;
												}
												
												if (state.faData.dlacSanctionUploadId!=null) {
													
												state.faMsmeDetailData.dlacSanctionUploadId=state.faData.dlacSanctionUploadId;
												}
								
												
								});
								
								var responsePromise2 = request
								.get(
										'fetchMsmeDetailSelectionByApplicationId',
										{
											params : {
												'applicationId' : params.applicationId
											}
										});
						state.applicationId = params.applicationId;
						responsePromise2
								.success(function(data) {
									state.faData2 = data;

									if (state.faData2.selectfa1) {
										state.faMsmeDetailData.selectfa1 = state.faData2.selectfa1;
									}
									
									if (state.faData2.selectfa2) {
										state.faMsmeDetailData.selectfa2 = state.faData2.selectfa2;
									}
									
									if (state.faData2.selectfa3) {
										state.faMsmeDetailData.selectfa3 = state.faData2.selectfa3;
									}
									
									if (state.faData2.selectfa4) {
										state.faMsmeDetailData.selectfa4 = state.faData2.selectfa4;
									}
									if (state.faData2.selectfa5) {
										state.faMsmeDetailData.selectfa5 = state.faData2.selectfa5;
									}
									
									
									
									if (state.faData2.selectfa6) {
										state.faMsmeDetailData.selectfa6 = state.faData2.selectfa6;
									}
									
									if (state.faData2.selectfa7) {
										state.faMsmeDetailData.selectfa7 = state.faData2.selectfa7;
									}
									
									if (state.faData2.selectfa8) {
										state.faMsmeDetailData.selectfa8 = state.faData2.selectfa8;
									}
									if (state.faData2.selectfa11) {
							state.faMsmeDetailData.selectfa11 = state.faData2.selectfa11;
						}
						if (state.faData2.selectfa12) {
							state.faMsmeDetailData.selectfa12 = state.faData2.selectfa12;
						}
						if (state.faData2.selectfa13) {
							state.faMsmeDetailData.selectfa13 = state.faData2.selectfa13;
						}
						if (state.faData2.selectfa14) {
							state.faMsmeDetailData.selectfa14 = state.faData2.selectfa14;
						}
						if (state.faData2.selectfa15) {
							state.faMsmeDetailData.selectfa15 = state.faData2.selectfa15;
						}
						if (state.faData2.selectfa16) {
							state.faMsmeDetailData.selectfa16 = state.faData2.selectfa16;
						}
						if (state.faData2.selectfa17) {
							state.faMsmeDetailData.selectfa17 = state.faData2.selectfa17;
						}
						if (state.faData2.selectfa18) {
							state.faMsmeDetailData.selectfa18 = state.faData2.selectfa18;
						}
						if (state.faData2.selectfa19) {
							state.faMsmeDetailData.selectfa19 = state.faData2.selectfa19;
						}
						if (state.faData2.selectfa20) {
							state.faMsmeDetailData.selectfa20 = state.faData2.selectfa20;
						}
						if (state.faData2.selectfa21) {
							state.faMsmeDetailData.selectfa21 = state.faData2.selectfa21;
						}
						
						if (state.faData2.selectfa22) {
							state.faMsmeDetailData.selectfa22 = state.faData2.selectfa22;
						}
											
											
											var total = parseFloat("0");
								var select1 = parseFloat("0");
						var select2 = parseFloat("0");
						var select3 = parseFloat("0");
						var select4 = parseFloat("0");
						var select5 = parseFloat("0");
						var select6 = parseFloat("0");
						var select7 = parseFloat("0");
						var select8 = parseFloat("0");
						var select11 = parseFloat("0");
						var select12 = parseFloat("0");
						var select13 = parseFloat("0");
						var select14 = parseFloat("0");
						var select15 = parseFloat("0");
						var select16 = parseFloat("0");
						var select17 = parseFloat("0");
						var select18 = parseFloat("0");
						var select19 = parseFloat("0");
						var select20 = parseFloat("0");
						var select21 = parseFloat("0");
						var select22 = parseFloat("0");
						
						if (null != state.faMsmeDetailData
								&& null != state.faMsmeDetailData.faIndustSubsidyAmt) {
							select1 = parseFloat(state.faMsmeDetailData.faIndustSubsidyAmt);
						}
						if (null != state.faMsmeDetailData
								&& null != state.faMsmeDetailData.faQualityCerfAmt) {
							select2 = parseFloat(state.faMsmeDetailData.faQualityCerfAmt);
						}
						if (null != state.faMsmeDetailData
								&& null != state.faMsmeDetailData.faReimbursementPatentsAmt) {
							select3 = parseFloat(state.faMsmeDetailData.faReimbursementPatentsAmt);
						}
						
						if (null != state.faMsmeDetailData
								&& null != state.faMsmeDetailData.faInfraDevAmt) {
							select4 = parseFloat(state.faMsmeDetailData.faInfraDevAmt);
						}
						
						if (null != state.faMsmeDetailData
								&& null != state.faMsmeDetailData.faPlantTreatAmt) {
							select5 = parseFloat(state.faMsmeDetailData.faPlantTreatAmt);
						}
						if (null != state.faMsmeDetailData
								&& null != state.faMsmeDetailData.faEnergyAmt) {
							select6 = parseFloat(state.faMsmeDetailData.faEnergyAmt);
						}
						
						if (null != state.faMsmeDetailData
								&& null != state.faMsmeDetailData.faUpgradeAmt) {
							select7 = parseFloat(state.faMsmeDetailData.faUpgradeAmt);
							
						}
						
						if (null != state.faMsmeDetailData
								&& null != state.faMsmeDetailData.faPharmLabAmt) {
							select8 = parseFloat(state.faMsmeDetailData.faPharmLabAmt);
							}
							if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa11Amount) {
							select11 = parseFloat(state.faMsmeDetailData.fa11Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa12Amount) {
							select12 = parseFloat(state.faMsmeDetailData.fa12Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa13Amount) {
							select13 = parseFloat(state.faMsmeDetailData.fa13Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa14Amount) {
							select14 = parseFloat(state.faMsmeDetailData.fa14Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa15Amount) {
							select15 = parseFloat(state.faMsmeDetailData.fa15Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa16Amount) {
							select16 = parseFloat(state.faMsmeDetailData.fa16Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa17Amount) {
							select17 = parseFloat(state.faMsmeDetailData.fa17Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa18Amount) {
							select18 = parseFloat(state.faMsmeDetailData.fa18Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa19Amount) {
							select19 = parseFloat(state.faMsmeDetailData.fa19Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa20Amount) {
							select20 = parseFloat(state.faMsmeDetailData.fa20Amount);
						}

						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa21Amount) {
							select21 = parseFloat(state.faMsmeDetailData.fa21Amount);
						}
						if (null != state.faMsmeDetailData && null != state.faMsmeDetailData.fa22Amount) {
							select22 = parseFloat(state.faMsmeDetailData.fa22Amount);
						}


						total = (select1 + select2 + select3 + select4 + select5 + select6 + select7 + select8 + select11 + select12 + select13 + select14 + select15 + select16 + select17 + select18 + select19 + select20 + select21+select22).toFixed(2);
						state.faMsmeDetailData.totalamt = parseInt(total);

					
											
												loading.finish('sample-1');
											

								});
									
								
		};

state.loadFASchemeDetails = function() {
		
		if(params.statusId==5){
			loading.start('sample-1');
			var responsePromise = request.get('fa/fetchfaschemesdetail', {params: {'applicationId': params.applicationId}});
			state.applicationId=params.applicationId;
			responsePromise.success(function(data) {
			state.faData = data;
			if(state.faData.selectedOptions.selectfa5 && state.faData.vatCstExempVikasKhandName){
				state.faData.vatCstCompIsVikasKhand='yes';
			}
			loading.finish('sample-1');
			});
			
		}else{
			loading.start('sample-1');
			var responsePromise = request.get('fa/fetchfaschemes/'+ params.applicationId);
			state.applicationId=params.applicationId;
			responsePromise.success(function(data) {
				state.faData = data;
				state.faData.vatCstCompIsVikasKhand = 'no';
				loading.finish('sample-1');
			});
		}
		
		
		loading.start('sample-1');
		var responseDistricts = request.get('fetchdistrictsmap');
		responseDistricts.success(function(data) {
			state.vikasKhandDistricts = data;
			loading.finish('sample-1');
		});

	};

state.loadFASchemesDetail = function() {
			    
				loading.start('sample-1');
				var responsePromise = request.get('fa/fetchfaschemesdetail', {params: {'applicationId': params.applicationId}});
				state.applicationId=params.applicationId;
				responsePromise.success(function(data) {
				state.faData = data;
				loading.finish('sample-1');
				});
			};

state.loadFinancialYear = function() {
				loading.start('sample-1');
							var responsePromise = request.get('fetchFinancialYear');
							responsePromise.success(function(data) {
								state.fyList = data;
								state.findUserDetails();
								loading
										.finish('sample-1');
							});
							

			};

state.loadFinancialYearNew = function() {
				loading.start('sample-1');
							var responsePromise = request.get('fetchFinancialYearNew');
							responsePromise.success(function(data) {
								state.fyearList = data;
								loading
										.finish('sample-1');
							});
							

			};

state.loadHistory = function() {
	    
		loading.start('sample-1');
		var responsePromise = request.get('fa/fetchHistory', {params: {'applicationId': params.applicationId, 'establishmentType': params.establishmentType}});
		
		state.applicationId =  params.applicationId;
		state.establishmentType =  params.establishmentType;
		
		if(state.establishmentType == 'Unit') {
			state.showUnitList = true;	
		} else {
			state.showInstitueList = true;
		}
		
		responsePromise.success(function(data) {
		state.faRequestProcessBeanList = data;
		loading.finish('sample-1');
		});
	};

state.loadIndustryDetails = function () {
		if (state.faData.firmConstitution === 'Proprietorship') {
			state.leadByDetails = {
				male: '',
				female: '',
				transgender: '',
				general: '',
				obc: '',
				sc: '',
				st: ''
			};

			if (state.faData.poaGender) {
				if (state.faData.poaGender === '1') state.leadByDetails.male = '100%';
				else if (state.faData.poaGender === '2') state.leadByDetails.female = '100%';
				else state.leadByDetails.transgender = '100%';
			}

			if (state.faData.poaCategory) {
				if (state.faData.poaCategory === '1') state.leadByDetails.sc = '100%';
				else if (state.faData.poaCategory === '2') state.leadByDetails.st = '100%';
				else if (state.faData.poaCategory === '3') state.leadByDetails.obc = '100%';
				else state.leadByDetails.general = '100%';
			}

		} else {
			let malePercent = 0,
				femalePercent = 0,
				transPercent = 0,
				scPercent = 0,
				stPercent = 0,
				obcPercent = 0,
				genPercent = 0;

			each(state.faData.industrialPartnerslist, function (partner) {
				let share = parseFloat(partner.sharePercentage || '0');

				if (isNaN(share)) share = 0; 

				
				if (partner.gender === '1') malePercent += share;
				else if (partner.gender === '2') femalePercent += share;
				else transPercent += share;

				
				if (partner.category === '1') scPercent += share;
				else if (partner.category === '2') stPercent += share;
				else if (partner.category === '3') obcPercent += share;
				else genPercent += share;
			});

			state.leadByDetails = {
				male: malePercent.toFixed(2) + '%',
				female: femalePercent.toFixed(2) + '%',
				transgender: transPercent.toFixed(2) + '%',
				sc: scPercent.toFixed(2) + '%',
				st: stPercent.toFixed(2) + '%',
				obc: obcPercent.toFixed(2) + '%',
				general: genPercent.toFixed(2) + '%'
			};
		}
	};

state.loadQueryReplyPage= function() {
					loading.start('sample-1');
					state.applicationId=params.applicationId;
					state.establishmentType=params.establishmentType;
					var responsePromise = request.get('fa/fetchquerybydtic', {params: {'applicationId': params.applicationId}});
					responsePromise.success(function(data) {
						state.queryReplyData = data;
						state.queryReplyData.queryAsked = data.comments;
						state.queryReplyData.comments=null;
						loading.finish('sample-1');
						});
				};

state.loadUserIndustrialDetails = function() {
						state.isGstAvailable = true;
						state.isIndustrialAdressAvailable = true;
						state.disabled = true;
						
						loading.start('sample-1');
						
						var responsePromise = request.get('fetchUserIndustrialDetails', {
							params : {
								'userId' : ""
							}
						});
					
						responsePromise
								.success(function(data) {
									state.faData = data;
									
									if(state.isUndefinedNullOrEmpty(state.faData.indOrgName) ||
										state.isUndefinedNullOrEmpty(state.faData.firmCategory) ||
										state.isUndefinedNullOrEmpty(state.faData.firmConstitution) ||
										state.isUndefinedNullOrEmpty(state.faData.statusOfPremises) ||
										state.isUndefinedNullOrEmpty(state.faData.panNo) ||
										state.isUndefinedNullOrEmpty(state.faData.poaFirstName) ||
										state.isUndefinedNullOrEmpty(state.faData.poaLastName) ||
										state.isUndefinedNullOrEmpty(state.faData.poaFatherName) ||
										state.isUndefinedNullOrEmpty(state.faData.poaGender) ||
										state.isUndefinedNullOrEmpty(state.faData.poaCategory)) {
  											alert("Please complete Industrial Profile!!!");
  											navigation.location.href = '#updateindustryprofileapplicant';
											return;
									}

									if(state.isUndefinedNullOrEmpty(state.faData.permanentAddress1) ||
										state.isUndefinedNullOrEmpty(state.faData.permanentStateId) ||
										state.isUndefinedNullOrEmpty(state.faData.permanentDistrictId) ||
										state.isUndefinedNullOrEmpty(state.faData.permanentTehsilId) ||
										state.isUndefinedNullOrEmpty(state.faData.permanentBlockId) ||
										state.isUndefinedNullOrEmpty(state.faData.permanentPinCode)){
											alert("Please complete User Profile!!!");
											navigation.location.href = '#/updateprofileapplicant';
											return;
									}

									if(state.isUndefinedNullOrEmpty(state.faData.udyamRegNo) ||
										state.isUndefinedNullOrEmpty(state.faData.udyamRegDate) ||
										state.isUndefinedNullOrEmpty(state.faData.udyamUploadId) ||
										state.isUndefinedNullOrEmpty(state.faData.gstUploadId)) {
											alert("Please complete Udyam and GST Details in Industrial Profile!!!");
  											navigation.location.href = '#updateindustryprofileapplicant';
											return;
									}

									state.faData.applicationId=params.applicationId;
									if(null==state.faData.industrialPartnerslist)
									state.faData.industrialPartnerslist=[{}];
									if(null==state.faData.regNocList)
									state.faData.regNocList=[{}];
									if(null==state.faData.faIndustrialUnitBean)
									state.faData.faIndustrialUnitBean={};
									if(null==state.faData.faIndustrialUnitBean.activityDetailsList)
	                                state.faData.faIndustrialUnitBean.activityDetailsList=[{}];
	                                if(null==state.faData.faIndustrialUnitBean.capitalInvestmentBeans){
	                                 state.faData.faIndustrialUnitBean.capitalInvestmentBeans = [];

									 state.faData.faIndustrialUnitBean.capitalInvestmentBeans.push({ investmentName: 'Plant & Machinery' });
									 state.faData.faIndustrialUnitBean.capitalInvestmentBeans.push({ investmentName: 'Building' });
									 if(state.schemeYear === '2025')
									 	state.faData.faIndustrialUnitBean.capitalInvestmentBeans.push({ investmentName: 'Additional Eligible Item' });
	                                }
	                                if(null==state.faData.faIndustrialUnitBean.unitProductDetailsBeans)
	                                state.faData.faIndustrialUnitBean.unitProductDetailsBeans=[{}];
	                                if(null==state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans){
									
	                                  state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans = [];
									  
	                                  state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans.push({description:'Capital Investment in Plant & Machinery (in Lakh Rs.)'});
	                                  if(state.schemeYear === '2025'){state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans.push({description:'Employment'});}
	                                  
	                                  state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans.push({description:'Building'});
	                                  state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans.push({description:'Others'});
	                                }
	                                if(null==state.faData.faRequiredAssistanceBean)
	                                state.faData.faRequiredAssistanceBean={};
	                                if(null==state.faData.faRequiredAssistanceBean.caExpInvDetailsBean)
	                                state.faData.faRequiredAssistanceBean.caExpInvDetailsBean=[{}];
	                                if(null==state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompExpInvDetailsBeans)
	                                state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompExpInvDetailsBeans=[{}];
	                                if(null==state.faData.faRequiredAssistanceBean.entryTaxExempRawMatDetailsBeans)
	                                state.faData.faRequiredAssistanceBean.entryTaxExempRawMatDetailsBeans=[{}];
	                                if(null==state.faData.faRequiredAssistanceBean.entryTaxExempFYProdSellDetailsBeans)
	                                state.faData.faRequiredAssistanceBean.entryTaxExempFYProdSellDetailsBeans=[{}];
	                                if(null==state.faData.faRequiredAssistanceBean.vatCstExempProdDetails)
	                                state.faData.faRequiredAssistanceBean.vatCstExempProdDetails=[{}];
	                                if(null==state.faData.faRequiredAssistanceBean.pharmaExpInvDetailsBeans)
	                                state.faData.faRequiredAssistanceBean.pharmaExpInvDetailsBeans=[{}];
	                               
									if (state.faData.genderId) {
										state.faData.genderId = state.faData.genderId
												+ "";
									}
									if (state.faData.categoryId) {
										state.faData.categoryId = state.faData.categoryId
												+ "";
									}
									if (state.faData.statusId) {
										state.faData.statusId = state.faData.statusId
												+ "";
									}
									if (state.faData.designationCode) {
										state.faData.designationCode = state.faData.designationCode
												+ "";
									}
									
									state.cerfdata={};
									state.cerfdata.CertificationDetails={};
									state.cerfdata.isAvailable = false;
									
									var responseStates = request
											.get('fetchallstates');
									responseStates.success(function(data) {
										state.respondentStates = data;
									});

									if(state.isUndefinedNullOrEmpty(state.faData.plotNos) ||
									    state.isUndefinedNullOrEmpty(state.faData.areaInSqm) ||
									    state.isUndefinedNullOrEmpty(state.faData.address1) ||
									    state.isUndefinedNullOrEmpty(state.faData.stateId) ||
									    state.isUndefinedNullOrEmpty(state.faData.districtId) ||
									    state.isUndefinedNullOrEmpty(state.faData.tehsilId) ||
									    state.isUndefinedNullOrEmpty(state.faData.blockId) ||
									    state.isUndefinedNullOrEmpty(state.faData.pinCode) ||
									    state.isUndefinedNullOrEmpty(state.faData.presentAddMobileNo)) {
											state.isIndustrialAdressAvailable = false;
										}

									if (state.faData.industrialArea) {
										state.faData.industrialArea = state.faData.industrialArea
												+ "";
									}

									if (state.faData.stateId) {
										state.faData.stateId = state.faData.stateId
												+ "";
									} else {
										state.faData.stateId = 20 + "";
									}
									if (state.faData.districtId) {
										state.faData.districtId = state.faData.districtId
												+ "";
									}
									if (state.faData.tehsilId) {
										state.faData.tehsilId = state.faData.tehsilId
												+ "";
									}
									if (state.faData.blockId) {
										state.faData.blockId = state.faData.blockId
												+ "";
									}
									
									if (state.faData.permanentStateId) {
										state.faData.permanentStateId = state.faData.permanentStateId
												+ "";
									}
									if (state.faData.permanentDistrictId) {
										state.faData.permanentDistrictId = state.faData.permanentDistrictId
												+ "";
									}
									if (state.faData.permanentTehsilId) {
										state.faData.permanentTehsilId = state.faData.permanentTehsilId
												+ "";
									}
									if (state.faData.permanentBlockId) {
										state.faData.permanentBlockId = state.faData.permanentBlockId
												+ "";
									}
									
									if(state.isUndefinedNullOrEmpty(state.faData.gstNo))
											state.isGstAvailable = false;
										
									params.udyamno = state.faData.udyamRegNo;
									
									
									if (state.faData.stateId) {
										var responseDistricts = request
												.get(
														'fetchdistrictmapbystate',
														{
															params : {
																'stateId' : state.faData.stateId
															}
														});
										responseDistricts.success(function(
												data, status, headers, config) {
											state.districts = data;
										});
									}
									if (state.faData.districtId) {
									state.fetchIndustrialAreasByDistrictId(state.faData.districtId);
										var responseDistricts = request
												.get(
														'fetchdistricttehsilmapbydistrictid',
														{
															params : {
																'districtId' : state.faData.districtId
															}
														});
										responseDistricts.success(function(
												data, status, headers, config) {
											state.tehsils = data;
										});
										var responseDistricts1 = request
												.get(
														'fetchdistrictblockmapbydistrictid',
														{
															params : {
																'districtId' : state.faData.districtId
															}
														});
										responseDistricts1.success(function(
												data, status, headers, config) {
											state.blocks = data;
										});
									}
									if (state.faData.permanentStateId) {
										var responsePermanentDistricts = request
												.get(
														'fetchdistrictmapbystate',
														{
															params : {
																'stateId' : state.faData.permanentStateId
															}
														});
										responsePermanentDistricts
												.success(function(data) {
													state.permanentDistricts = data;
												});
									}
									if (state.faData.permanentDistrictId) {
										var responseDistricts = request
												.get(
														'fetchdistricttehsilmapbydistrictid',
														{
															params : {
																'districtId' : state.faData.permanentDistrictId
															}
														});
										responseDistricts.success(function(
												data, status, headers, config) {
											state.permanentTehsils = data;

										});
										var responseDistricts1 = request
												.get(
														'fetchdistrictblockmapbydistrictid',
														{
															params : {
																'districtId' : state.faData.permanentDistrictId
															}
														});
										responseDistricts1.success(function(
												data, status, headers, config) {
											state.permanentBlocks = data;
										});
									}
									var fetchAllIndustryCategory = request.get('fetchAllIndustryCategory');
									fetchAllIndustryCategory.success(function(data) {
										state.categoryOfIndustryList = data;
									});
                                   loading.finish('sample-1');
								});
					};

state.loadUserIndustrialDetailsByApplicationId = function() {
						state.disabled = true;
						state.isGstAvailable = true;
						state.isIndustrialAdressAvailable = true;
                      loading.start('sample-1');
                      var responsePromise = request.get('fetchUserIndustrialDetailsByApplicationId', {
							params : {
								'applicationId' : params.applicationId
							}
						});
						responsePromise
								.success(function(data) {
								state.faData = data;
								state.schemeYear = data.schemeYear;
								state.showFaExpansionTable();
								if(state.isUndefinedNullOrEmpty(state.faData.plotNos) ||
									state.isUndefinedNullOrEmpty(state.faData.areaInSqm) ||
									state.isUndefinedNullOrEmpty(state.faData.address1) ||
									state.isUndefinedNullOrEmpty(state.faData.stateId) ||
									state.isUndefinedNullOrEmpty(state.faData.districtId) ||
									state.isUndefinedNullOrEmpty(state.faData.tehsilId) ||
									state.isUndefinedNullOrEmpty(state.faData.blockId) ||
									state.isUndefinedNullOrEmpty(state.faData.pinCode) ||
									state.isUndefinedNullOrEmpty(state.faData.presentAddMobileNo)) {
										state.isIndustrialAdressAvailable = false;
									}

								if(null==state.faData.industrialPartnerslist)
									state.faData.industrialPartnerslist=[{}];
									if(null==state.faData.regNocList)
									state.faData.regNocList=[{}];
									if(null==state.faData.faIndustrialUnitBean)
									state.faData.faIndustrialUnitBean={};
									if(null!= state.faData.faIndustrialUnitBean.oldApplicationId){
							         state.appliedBefore='yes';
						            }else{
							         state.appliedBefore='no';
						            }
						            state.showTextBox(state.appliedBefore);
									if(null==state.faData.faIndustrialUnitBean.activityDetailsList)
	                                state.faData.faIndustrialUnitBean.activityDetailsList=[{}];
	                                if(null==state.faData.faIndustrialUnitBean.capitalInvestmentBeans){
	                                 state.faData.faIndustrialUnitBean.capitalInvestmentBeans = [];

									 state.faData.faIndustrialUnitBean.capitalInvestmentBeans.push({ investmentName: 'Plant & Machinery' });
									 state.faData.faIndustrialUnitBean.capitalInvestmentBeans.push({ investmentName: 'Building' });
									 if(state.schemeYear === '2025')
									 	state.faData.faIndustrialUnitBean.capitalInvestmentBeans.push({ investmentName: 'Additional Eligible Item' });
	                                }
	                                if(null==state.faData.faIndustrialUnitBean.unitProductDetailsBeans)
	                                state.faData.faIndustrialUnitBean.unitProductDetailsBeans=[{}];
	                                if(null==state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans){
										
										state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans = [];
																			  
	                                    state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans.push({description:'Capital Investment in Plant & Machinery (in Lakh Rs.)'});
	                                  
	                                  	state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans.push({description:'Building'});
	                                  	state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans.push({description:'others'});
	                                  
	                                }
	                                if(null==state.faData.faRequiredAssistanceBean)
	                                state.faData.faRequiredAssistanceBean={};
	                                if(null==state.faData.faRequiredAssistanceBean.caExpInvDetailsBean || state.faData.faRequiredAssistanceBean.caExpInvDetailsBean.length==0)
	                                state.faData.faRequiredAssistanceBean.caExpInvDetailsBean=[{}];
	                                if(null==state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompExpInvDetailsBeans || state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompExpInvDetailsBeans.length==0)
	                                state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompExpInvDetailsBeans=[{}];
	                                if(null==state.faData.faRequiredAssistanceBean.entryTaxExempRawMatDetailsBeans || state.faData.faRequiredAssistanceBean.entryTaxExempRawMatDetailsBeans.length==0)
	                                state.faData.faRequiredAssistanceBean.entryTaxExempRawMatDetailsBeans=[{}];
	                                if(null==state.faData.faRequiredAssistanceBean.entryTaxExempFYProdSellDetailsBeans || state.faData.faRequiredAssistanceBean.entryTaxExempFYProdSellDetailsBeans.length==0)
	                                state.faData.faRequiredAssistanceBean.entryTaxExempFYProdSellDetailsBeans=[{}];
	                                if(null==state.faData.faRequiredAssistanceBean.vatCstExempProdDetails || state.faData.faRequiredAssistanceBean.vatCstExempProdDetails.length==0)
	                                state.faData.faRequiredAssistanceBean.vatCstExempProdDetails=[{}];
	                                if(null==state.faData.faRequiredAssistanceBean.pharmaExpInvDetailsBeans || state.faData.faRequiredAssistanceBean.pharmaExpInvDetailsBeans.length==0)
	                                state.faData.faRequiredAssistanceBean.pharmaExpInvDetailsBeans=[{}];
	                                
	                                if(null==state.faData.presentAddTelephoneNo){
										state.faData.presentAddTelephoneNo="NA";
									}
									
									if(state.isUndefinedNullOrEmpty(state.faData.gstNo))
											state.isGstAvailable = false;
									
									var responseStates = request
											.get('fetchallstates');
									responseStates.success(function(data) {
										state.respondentStates = data;
									});
																		
									if (state.faData.genderId) {
										state.faData.genderId = state.faData.genderId
												+ "";
									}
									if (state.faData.categoryId) {
										state.faData.categoryId = state.faData.categoryId
												+ "";
									}
									if (state.faData.statusId) {
										state.faData.statusId = state.faData.statusId
												+ "";
									}
									if (state.faData.designationCode) {
										state.faData.designationCode = state.faData.designationCode
												+ "";
									}
									if (state.faData.industrialArea) {
										state.faData.industrialArea = state.faData.industrialArea
												+ "";
									}

									if (state.faData.stateId) {
										state.faData.stateId = state.faData.stateId
												+ "";
									}
									if (state.faData.districtId) {
										state.faData.districtId = state.faData.districtId
												+ "";
									}
									if (state.faData.tehsilId) {
										state.faData.tehsilId = state.faData.tehsilId
												+ "";
									}
									if (state.faData.blockId) {
										state.faData.blockId = state.faData.blockId
												+ "";
									}
									if (state.faData.permanentStateId) {
										state.faData.permanentStateId = state.faData.permanentStateId
												+ "";
									}
									if (state.faData.permanentDistrictId) {
										state.faData.permanentDistrictId = state.faData.permanentDistrictId
												+ "";
									}
									if (state.faData.permanentTehsilId) {
										state.faData.permanentTehsilId = state.faData.permanentTehsilId
												+ "";
									}
									if (state.faData.permanentBlockId) {
										state.faData.permanentBlockId = state.faData.permanentBlockId
												+ "";
									}
									state.cerfdata={};
									state.cerfdata.CertificationDetails={};
									params.udyamRegNo =  state.faData.udyamRegNo;
									state.cerfdata.isAvailable = !!state.faData.faRequiredAssistanceBean.isCertificateAvailable;
									if(state.cerfdata.isAvailable) {
										state.cerfdata.cerfnumber=state.faData.faRequiredAssistanceBean.certificateNumber;
										state.cerfdata.CertificationDetails.CertificationDate= format('date')(state.faData.faRequiredAssistanceBean.certificationDate,'dd/MM/yyyy');
										state.cerfdata.CertificationDetails.ExpiryDate= format('date')(state.faData.faRequiredAssistanceBean.expiryDate, 'dd/MM/yyyy');
										state.cerfdata.CertificationDetails.BronzeCertified=state.faData.faRequiredAssistanceBean.bronzeCertified;
										state.cerfdata.CertificationDetails.SilverCertified=state.faData.faRequiredAssistanceBean.silverCertified;
										state.cerfdata.CertificationDetails.GoldCertified=state.faData.faRequiredAssistanceBean.goldCertified;
									}
									if (state.faData.stateId) {
										var responseDistricts = request
												.get(
														'fetchdistrictmapbystate',
														{
															params : {
																'stateId' : state.faData.stateId
															}
														});
										responseDistricts.success(function(
												data, status, headers, config) {
											state.districts = data;
										});
									}
									if (state.faData.districtId) {
										state.fetchIndustrialAreasByDistrictId(state.faData.districtId);
										var responseDistricts = request
												.get(
														'fetchdistricttehsilmapbydistrictid',
														{
															params : {
																'districtId' : state.faData.districtId
															}
														});
										responseDistricts.success(function(
												data, status, headers, config) {
											state.tehsils = data;
										});
										var responseDistricts1 = request
												.get(
														'fetchdistrictblockmapbydistrictid',
														{
															params : {
																'districtId' : state.faData.districtId
															}
														});
										responseDistricts1.success(function(
												data, status, headers, config) {
											state.blocks = data;
										});
									}
									var fetchAllIndustryCategory = request.get('fetchAllIndustryCategory');
									fetchAllIndustryCategory.success(function(data) {
										state.categoryOfIndustryList = data;
									});
									loading.finish('sample-1');
						});
	};

state.onCheckBoxSelected = function() {
	state.faData.faRequiredAssistanceBean.anySelected=false;
        for(var key in state.faData.faRequiredAssistanceBean.selectedOptions){
            if(state.faData.faRequiredAssistanceBean.selectedOptions[key]){
            	state.faData.faRequiredAssistanceBean.anySelected=true;
     
            }
        }
        state.loadFinancialYear();
	};

state.onFYToChanges = function(index, type) {
		if(null!=state.faData.entryTaxExempFYProdSellDetailsBeans[index].financialYear2 && null!= state.faData.entryTaxExempFYProdSellDetailsBeans[index].financialYear1 && state.faData.entryTaxExempFYProdSellDetailsBeans[index].financialYear2 <= state.faData.entryTaxExempFYProdSellDetailsBeans[index].financialYear1) {
			if(type=='from'){
				state.faData.entryTaxExempFYProdSellDetailsBeans[index].financialYear1=null;
			}else if(type=='to'){
				state.faData.entryTaxExempFYProdSellDetailsBeans[index].financialYear2=null;
			}
			
			request.get('getMessage/fa.applicant.fy').then(function (response) {
			    alert(response.data.value);
		    });	
		}
	};

state.onFYToChangesForCompVATCST = function(type) {
		if(null!=state.faData.vatCstExempFinancialYear1 && null!= state.faData.vatCstExempFinancialYear2 && state.faData.vatCstExempFinancialYear2 <= state.faData.vatCstExempFinancialYear1) {
			if(type=='from'){
				state.faData.vatCstExempFinancialYear1=null;
			}else if(type=='to'){
				state.faData.vatCstExempFinancialYear2=null;
			}
			
			request.get('getMessage/fa.applicant.fy').then(function (response) {
			    alert(response.data.value);
		    });			
		}
	};

state.onFaUnitCheckBoxSelected = function() {
		
		state.anySelected = false;
		
		if(state.faData.faIndustrialUnitBean.expansion == true || 	state.faData.faIndustrialUnitBean.diversification == true || state.faData.faIndustrialUnitBean.technicalUp == true) {
			state.anySelected=true;
		}
	};

state.onIndustryTypeSelected = function() {
		state.textileRequired=false;
		if(state.faData.faRequiredAssistanceBean.vatCstExempUnitIndustryType == 'textile') {
		state.textileRequired = true;
		}
	};

state.onProductNameChange = function(index) {
						
					if(null!= state.faData.faIndustrialUnitBean.unitProductDetailsBeans[index].productName)
						if(state.faData.schemeYear == '2021')
							state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans[index+2].description='Annual Capacity of Product - ' + state.faData.faIndustrialUnitBean.unitProductDetailsBeans[index].productName;
						else if(state.faData.schemeYear == '2025')
							state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans[index+3].description='Annual Capacity of Product - ' + state.faData.faIndustrialUnitBean.unitProductDetailsBeans[index].productName;
					};

state.removeFaChoice = function(index) {
		
		    state.faData.faIndustrialUnitBean.unitProductDetailsBeans.splice(index, 1);
		    
		    state.faData.faIndustrialUnitBean.unitExpansionDetailsBeans.splice(index+3, 1);
	  };

state.removeHeadwise = function(index) {
	    state.faData.faRequiredAssistanceBean.caExpInvDetailsBean.splice(index, 1);
  };

state.removeHeadwise1 = function(index) {
	    state.faData.faRequiredAssistanceBean.pharmaExpInvDetailsBeans.splice(index, 1);
  };

state.sectorofinductry1 = function () {
    loading.start('sample-1');

    request.get('fetchAllIndustryCategory')
        .then(function (response) {
            state.sectorofinductryList = response.data;

            
            if (state.faData && state.faData.firmSector) {
                state.sectorName = state.getIndustryName(state.faData.firmSector);
            }
        })
        .catch(function (error) {
            console.log("Error while fetching industry category", error);
        })
        .finally(function () {
            loading.finish('sample-1');
        });
};

state.showFaExpansionTable = function() {
			state.showExpFlag = false;
			if(state.faData.faIndustrialUnitBean.unitType == 'Other') {
				state.showExpFlag = true;
			}
			
	};

state.showTextBox= function(appliedBefore) {
		 
		 state.showprevAppId= false;
		
		 if(appliedBefore == "yes")	{
			 state.showprevAppId= true;
		 }
		 else {
			 state.showprevAppId= false;
		 }
		 
	 };

state.submitQueryReply = function(isValid) {
					if (!isValid) {
						return false;
					}
					request.get('getMessage/fa.applicant.detailsSubmit').then(function (response) {
						
						if (confirm(response.data.value)) {
							state.queryReplyData.applicationId = params.applicationId;
		
							loading.start('sample-1');
							
							var responsePromise = request.post('fa/submitQueryReply',
									state.queryReplyData);
		
							responsePromise.success(function(data) {
		
								state.responseObject1 = data;
		
								if (state.responseObject1.successMessage != null) {
									 later(function() {
										 state.responseObject1.successMessage = null;
								    }, 3000);
									if(state.establishmentType == 'Unit') {
										navigation.location.href = '#/fa/newapplicantform';	
									} else {
										navigation.location.href = '#fa/newapplicantformapparel';
									}
								}
								loading.finish('sample-1');
		
							});
						} else {
							return false;
						}
					});
				};

state.submitUnitAddressDetails = function () {

    if (state.faUnitAddressDetails.$invalid) {
		alert("Please fill all required fields.");       
        return;
    }

    loading.start('sample-1');

    request({
        method: 'POST',
        url: 'submitUnitAddressDetails',
        data: state.UnitAddressDetailsBean,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {

        state.unitData = response.data.successMessage;

        if (state.unitData === 'saved success') {
			alert("Unit Detail saved successfully");
			navigation.location.reload();
            
        }else{
			alert("Unit Detail unsaved");			
		}

        loading.finish('sample-1');

    }, function (error) {
			alert("Error submitting Unit Address Details");      

        loading.finish('sample-1');
    });
};

state.validateUnit = function(isValid) {
	    if (!isValid && state.saveAndNext==true)
			return false;
		
		 if (state.faData.faIndustrialUnitBean.unitType=="New"){
			  if (state.isNewUnitDisabled()){
				  alert("Commercial date is before 13 August 2021, so “New Unit” is not applicable; only “Other” is allowed");			
			return false;}
			}
			
		var gen = parseInt(state.faData.faIndustrialUnitBean.unitMpEmptGen, 10);
		var total = parseInt(state.faData.faIndustrialUnitBean.unitTotalEmptGen, 10);

		if(total<gen){
			alert("Employment given to MP Candidates should not be greater than Total Candidates!");
			return false;
		}
		var sc = parseInt(state.faData.faIndustrialUnitBean.unitMpScEmptGen, 10);
  		var st = parseInt(state.faData.faIndustrialUnitBean.unitMpStEmptGen, 10);
  		var obc = parseInt(state.faData.faIndustrialUnitBean.unitMpObcEmptGen, 10);
			
		var tot= sc+st+obc;
		if(tot>gen){
			alert("Employment given to MP SC Candidates, MP ST Candidates, MP OBC candidates should not be greater than MP Candidates!");
			return false;
		}
			

if (state.saveAndNext == true) {
    if (state.fileData.gstSellDocUpload == null && state.faData.faIndustrialUnitBean.gstSellDocUploadId == null) {
        alert("Please Upload Sales made by the unit in the last month as per GST Portal Upload.");
        return false;
    }
}

if (dom("#gstSellDocUpload")[0].files[0] != null && dom("#gstSellDocUpload")[0].files[0].size > 1048576) {
    alert("Sales made by the unit in the last month as per GST Portal Upload File size must be less than 1MB");
    return false;
}

if(state.schemeYear == '2021' && state.saveAndNext==true) {
    if (null==state.fileData.employmentGivenUpload && null==state.faData.faIndustrialUnitBean.employmentGivenUploadId) {
     alert("Please Upload Employment given (Unit) Proof Document");
     return false;
    }
    
	if (dom("#employmentGiven")[0].files[0] != null && dom("#employmentGiven")[0].files[0].size > 1048576) {
	    alert("Employment Given in Unit Upload File size must be less than 1MB");
	    return false;
	}
}
   
	if( null!=state.fileData.permissionDocUpload){
		if (null!=dom("#permissionDocUpload")[0].files[0] && dom("#permissionDocUpload")[0].files[0].size>1048576){
			alert("Permission/No Objection Certificate/Registration Certificate issued by Competent Authority Upload File size must be less than 1MB");
			return false;
		}
		
	}
	if(null != state.fileData.schemeDocUpload && state.schemeYear == '2025') {
		if(null != dom("#schemeDocUpload")[0].files[0] && dom("#schemeDocUpload")[0].files[0].size>10485760) {
			alert("Scheme Upload File size must be less than 10MB");
			return false;
		}
	}
		
return true;
};

state.validateScheme = function(isValid) {
			
			 if (!isValid && state.finalSubmit==true)
			     return false;
			     
			     if (!validateAllFiles()) {
    return false;
} 
		if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa1){
		if(state.faData.faRequiredAssistanceBean.caUnitOwnerCategory!=null && state.faData.faRequiredAssistanceBean.caUnitOwnerCategory !=''){
		console.log(state.faData.faRequiredAssistanceBean.caUnitOwnerCategory);
		if (state.finalSubmit==true && null==state.fileData.caProofOfOwnershipUpload && null==state.faData.faRequiredAssistanceBean.caProofOfOwnershipUploadId) {
     		alert("Please Upload Proof of ownership file.");
    		 return false;
    		 }
    		 else{
					if (null!=dom("#proofOfOwnershipUpload")[0].files[0] && dom("#proofOfOwnershipUpload")[0].files[0].size>1048576){
					alert("Proof of ownership file should not exceed 1MB.");
    		 return false;
				}
			}
    		
   	 	}
		if (state.finalSubmit==true && null==state.fileData.cafirstSellBillDateUpload && null==state.faData.faRequiredAssistanceBean.cafirstSellBillDateUploadId) {
			alert("Please Upload Details of First Selling Bill (Attach Document)");
			return false;
		}
		
		else{
				if (null!=dom("#cafirstSellBillDateUpload")[0].files[0] && dom("#cafirstSellBillDateUpload")[0].files[0].size>1048576){
					alert("First Selling Bill file should not exceed 1MB.");
    		 return false;
				}
			}

		if (state.finalSubmit==true && null==state.fileData.plantMachineExpenseUpload && null==state.faData.faRequiredAssistanceBean.plantMachineExpenseUploadId) {
			alert("Please Upload Details of Plant and Machinery and Building Bill (Attach Document)");
			return false;
		}
		else{
				if (null!=dom("#plantMachineExpenseUpload")[0].files[0] && dom("#plantMachineExpenseUpload")[0].files[0].size>1048576){
					alert("Details of Plant and Machinery and Building Bill file should not exceed 1MB.");
    		 return false;
				}
			}
		if (null!=state.fileData.caLoanAcceptanceDocUpload){
			if (null!=dom("#loanAcceptanceDocUpload")[0].files[0] && dom("#loanAcceptanceDocUpload")[0].files[0].size>1048576){
					alert("Loan Acceptance and Disbursement Letter of Financial Institution Upload file should not exceed 1MB.");
    		 return false;
				}
			
		}
    }
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa2){
   if(state.finalSubmit==true && null==state.fileData.qualityCertUpload1 && null==state.faData.faRequiredAssistanceBean.qualityCertUpload1Id) {
     alert("Please Upload [A] (i) Attested copy of ISO/BIS/BEE certification ");
     return false;
    }
   else {
	   if (null!=dom("#qualityCertUpload1")[0].files[0] && dom("#qualityCertUpload1")[0].files[0].size > 1048576) {
		   alert("Attested copy of ISO/BIS/BEE certification file should not exceed 1MB.");
		   return false;
	   }
   }
    
    if (state.finalSubmit==true && null==state.fileData.qualityCertUpload2 && null==state.faData.faRequiredAssistanceBean.qualityCertUpload2Id) {
     alert("Please Upload [A] (ii) Expenses incurred to obtain that certification");
     return false;
    }
	else {
		if (null!=dom("#qualityCertUpload2")[0].files[0] && dom("#qualityCertUpload2")[0].files[0].size > 1048576) {
			alert("Expenses incurred to obtain that certification file should not exceed 1MB.");
			return false;
		}
	}
    if (state.finalSubmit==true && null==state.fileData.qualityCertUpload3 && null==state.faData.faRequiredAssistanceBean.qualityCertUpload3Id) {
     alert("Please Upload [B] (i) Attested copy of ZED certification.");
     return false;
    }
    else {
		if (null!=dom("#qualityCertUpload3")[0].files[0] && dom("#qualityCertUpload3")[0].files[0].size > 1048576) {
			alert("Attested copy of ZED certification file should not exceed 1MB.");
			return false;
		}
	}
    if (state.finalSubmit==true && null==state.fileData.qualityCertUpload4 && null==state.faData.faRequiredAssistanceBean.qualityCertUpload4Id) {
     alert("Please Upload [B] (ii) Expenditure incurred for obtaining that certification and assistance received from Government of India");
     return false;
    }
     else {
		if (null!=dom("#qualityCertUpload4")[0].files[0] && dom("#qualityCertUpload4")[0].files[0].size > 1048576) {
			alert("Expenditure incurred for obtaining that certification and assistance received from Government of India file should not exceed 1MB.");
			return false;
		}
	}
    if (state.finalSubmit==true && null==state.fileData.qualityCertUpload5 && null==state.faData.faRequiredAssistanceBean.qualityCertUpload5Id) {
     alert("Please Upload [C] (i) Attested copy of Quality Certification for Export (for export to USA/European Union/OECD member countries) ");
     return false;
    }
    else {
		if (null!=dom("#qualityCertUpload5")[0].files[0] && dom("#qualityCertUpload5")[0].files[0].size > 1048576) {
			alert("Attested copy of Quality Certification for Export (for export to USA/European Union/OECD member countries file should not exceed 1MB.");
			return false;
		}
	}
    if (state.finalSubmit==true && null==state.fileData.qualityCertUpload6 && null==state.faData.faRequiredAssistanceBean.qualityCertUpload6Id) {
     alert("Please Upload [C] (ii) Expenses incurred to obtain that certification Upload");
     return false;
    }
     else {
		if (null!=dom("#qualityCertUpload6")[0].files[0] && dom("#qualityCertUpload6")[0].files[0].size > 1048576) {
			alert("Expenses incurred to obtain that certification Upload file should not exceed 1MB.");
			return false;
		}
	}
    
    if (state.finalSubmit==true && null==state.fileData.qualityCertUpload7 && null==state.faData.faRequiredAssistanceBean.qualityCertUpload7Id) {
     alert("Please Upload [C] (iii) Information regarding commencement of export by the entity to the USA/European Union/OECD member countries");
     return false;
    }
    else {
		if (null!=dom("#qualityCertUpload7")[0].files[0] && dom("#qualityCertUpload7")[0].files[0].size > 1048576) {
			alert("Information regarding commencement of export by the entity to the USA/European Union/OECD member countries file should not exceed 1MB.");
			return false;
		}
	}
    if (state.finalSubmit==true && null==state.fileData.qualityCertUpload8 && null==state.faData.faRequiredAssistanceBean.qualityCertUpload8Id) {
     alert("Please Upload [D] (i) For Export, Attested copy of certification of WHO, GMP or US-FDA (applicable for pharmaceutical unit)");
     return false;
    }
    else {
		if (null!=dom("#qualityCertUpload8")[0].files[0] && dom("#qualityCertUpload8")[0].files[0].size > 1048576) {
			alert("Attested copy of certification of WHO, GMP or US-FDA (applicable for pharmaceutical unit) file should not exceed 1MB.");
			return false;
		}
	}
    if (state.finalSubmit==true && null==state.fileData.qualityCertUpload9 && null==state.faData.faRequiredAssistanceBean.qualityCertUpload9Id) {
     alert("Please Upload [D] (ii) Expenditure incurred in creating facilities to obtain that certification");
     return false;
    }
    else {
		if (null!=dom("#qualityCertUpload9")[0].files[0] && dom("#qualityCertUpload9")[0].files[0].size > 1048576) {
			alert("Expenditure incurred in creating facilities to obtain that certification file should not exceed 1MB.");
			return false;
		}
	}
    }
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa3){
    if (state.finalSubmit==true && null==state.fileData.patentIprExpUpload && null==state.faData.faRequiredAssistanceBean.patentIprExpUploadId) {
     alert("Please Upload Expenses incurred for obtaining Patent/IPR (Attach attested copy of document certifying the expenditure)");
     return false;
      }
      else{
				if (null!=dom("#patentIprExpUpload")[0].files[0] && dom("#patentIprExpUpload")[0].files[0].size>1048576){
					alert("Expenses incurred for obtaining Patent/IPR (Attach attested copy of document certifying the expenditure file should not exceed 1MB.");
    		 return false;
				}
			}
    }
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa4){
    if (state.finalSubmit==true && null==state.fileData.infraDevExpAmtUpload && null==state.faData.faRequiredAssistanceBean.infraDevExpAmtUploadId) {
     alert("Please Upload Headwise Amount Certified by Chartered Engineer/Chartered Accountant To develop the infrastructure up to the industrial unit, the information sheet regarding the Permission/Deemed permission granted by the Commissioner of Industries upto date of the commercial production of the unit Upload");
     return false;
     }
     else{
				if (null!=dom("#infraDevExpAmtUpload")[0].files[0] && dom("#infraDevExpAmtUpload")[0].files[0].size>1048576){
					alert("Headwise Amount Certified by Chartered Engineer/Chartered Accountant To develop the infrastructure up to the industrial unit, the information sheet regarding the Permission/Deemed permission granted by the Commissioner of Industries upto date of the commercial production of the unit Upload file should not exceed 1MB.");
    		 return false;
				}
			}
     
    }
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa5){
    if (state.finalSubmit==true && null==state.fileData.wasteMgmtEstbCompUpload1 && null==state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompUpload1Id) {
     alert("Please Upload Headwise Amount Certified by Chartered Engineer/Chartered Accountant for Expense on Establishment of Waste Management Systems Upload");
     return false;
    }
	else {
		if (null!=dom("#wasteMgmtEstbCompUpload1")[0].files[0] && dom("#wasteMgmtEstbCompUpload1")[0].files[0].size > 1048576) {
			alert("Headwise Amount Certified by Chartered Engineer/Chartered Accountant for Expense on Establishment of Waste Management Systems Upload file should not exceed 1MB.");
			return false;
		}
	}
			
    if (state.finalSubmit==true && null==state.fileData.wasteMgmtEstbCompUpload2 && null==state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompUpload2Id) {
     alert("Please Upload Attach the certificate of Pollution Control Board / Industrial Health and Directorate of Security");
     return false;
    }
    else {
		if (null!=dom("#wasteMgmtEstbCompUpload2")[0].files[0] && dom("#wasteMgmtEstbCompUpload2")[0].files[0].size > 1048576) {
			alert("The certificate of Pollution Control Board / Industrial Health and Directorate of Security file should not exceed 1MB.");
			return false;
		}
	}
    if (state.finalSubmit==true && null==state.fileData.wasteMgmtEstbCompUpload3 && null==state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompUpload3Id) {
     alert("Please Upload Details of Documents/Agreement relating to Group Count in case of Public Waste Treatment Plant (Attach attested copy)");
     return false;
    	}
    	 else {
		if (null!=dom("#wasteMgmtEstbCompUpload3")[0].files[0] && dom("#wasteMgmtEstbCompUpload3")[0].files[0].size > 1048576) {
			alert("Details of Documents/Agreement relating to Group Count in case of Public Waste Treatment Plant file should not exceed 1MB.");
			return false;
		}
	}
    }
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa6){
    if (state.finalSubmit==true && null==state.fileData.energyAuditUpload && null==state.faData.faRequiredAssistanceBean.energyAuditUploadId) {
     alert("Please Upload Attach attested copy of audit");
     return false;
    }
    else {
		if (null!=dom("#energyAuditUpload")[0].files[0] && dom("#energyAuditUpload")[0].files[0].size > 1048576) {
			alert("Copy of audit file should not exceed 1MB.");
			return false;
		}
	}
    
    if (state.finalSubmit==true && null==state.fileData.energyAuditExpUpload && null==state.faData.faRequiredAssistanceBean.energyAuditExpUploadId) {
     alert("Please Upload Attach photocopies of documents certifying the expenditure");
     return false;
    }
     else {
		if (null!=dom("#energyAuditExpUpload")[0].files[0] && dom("#energyAuditExpUpload")[0].files[0].size > 1048576) {
			alert("Documents certifying the expenditure file should not exceed 1MB.");
			return false;
		}
	}
    if (state.finalSubmit==true && null==state.fileData.energyAuditSellExpUpload && null==state.faData.faRequiredAssistanceBean.energyAuditSellExpUploadId) {
     alert("Please Upload Attach a photocopy of the certificate/assessment provided by the Chartered Engineer/Chartered Accountant");
     return false;
    }
    else {
		if (null!=dom("#energyAuditSellExpUpload")[0].files[0] && dom("#energyAuditSellExpUpload")[0].files[0].size > 1048576) {
			alert("The certificate/assessment provided by the Chartered Engineer/Chartered Accountant file should not exceed 1MB.");
			return false;
		}
	}
    if (state.finalSubmit==true && null==state.fileData.energyAuditSellSavingUpload && null==state.faData.faRequiredAssistanceBean.energyAuditSellSavingUploadId) {
     alert("Please Upload Attach photocopies of the documents");
     return false;
     }
       else {
		if (null!=dom("#energyAuditSellSavingUpload")[0].files[0] && dom("#energyAuditSellSavingUpload")[0].files[0].size > 1048576) {
			alert("Attach photocopies of the documents file should not exceed 1MB.");
			return false;
		}
    }
    }
     if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa7){
    if (state.finalSubmit==true && null==state.fileData.powerloomExpAfterUpload && null==state.faData.faRequiredAssistanceBean.powerloomExpAfterUploadId) {
     alert("Please Upload Attach certificate/assessment provided by Chartered Engineer/Chartered Accountant");
     return false;
    }
    else {
		if (null!=dom("#powerloomExpAfterUpload")[0].files[0] && dom("#powerloomExpAfterUpload")[0].files[0].size > 1048576) {
			alert("Attach certificate/assessment provided by Chartered Engineer/Chartered Accountant file should not exceed 1MB.");
			return false;
		}
    }
    }
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa8){
     if (state.finalSubmit==true && null==state.fileData.pharmaExpUpload1 && null==state.faData.faRequiredAssistanceBean.pharmaExpUploadId1Id) {
     alert("Please Upload Attach certificate for cost of setting up the machinery and equipment of the Pharmaceutical lab");
     return false;
    }
     else {
		if (null!=dom("#pharmaExpUpload1")[0].files[0] && dom("#pharmaExpUpload1")[0].files[0].size > 1048576) {
			alert("Attach certificate for cost of setting up the machinery and equipment of the Pharmaceutical lab file should not exceed 1MB.");
			return false;
		}
    }
     if (state.finalSubmit==true && null==state.fileData.pharmaExpUpload2 && null==state.faData.faRequiredAssistanceBean.pharmaExpUploadId2Id) {
     alert("Please Upload Desired registration/permission/certificate information in the context of pharmaceutical labs (Attested copy to be attached)");
     return false;
    }
    else {
		if (null!=dom("#pharmaExpUpload2")[0].files[0] && dom("#pharmaExpUpload2")[0].files[0].size > 1048576) {
			alert("Desired registration/permission/certificate information in the context of pharmaceutical labs file should not exceed 1MB.");
			return false;
		}
    }
     if (state.finalSubmit==true && null==state.fileData.pharmaExpUpload3 && null==state.faData.faRequiredAssistanceBean.pharmaExpUploadId3Id) {
     alert("Please Upload Details of Utility of Pharamaceutical Lab (Attach Document)");
     return false;
   	 }
   	  else {
		if (null!=dom("#pharmaExpUpload3")[0].files[0] && dom("#pharmaExpUpload3")[0].files[0].size > 1048576) {
			alert("Details of Utility of Pharamaceutical Lab file should not exceed 1MB.");
			return false;
		}
    }
    }
    
     if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa11){   
  
		if (state.finalSubmit==true && null==state.fileData.caCertificateAnnexure8 && null==state.faData.faRequiredAssistanceBean.caCertificateAnnexure8) {
     alert("Please Upload Relevant caCertificateAnnexure8 Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.transportInvoicePaymentProof && null==state.faData.faRequiredAssistanceBean.transportInvoicePaymentProof) {
     alert("Please Upload Relevant transportInvoicePaymentProof Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.exportInvoices && null==state.faData.faRequiredAssistanceBean.exportInvoices) {
     alert("Please Upload Relevant exportInvoices Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.customsClearanceDocuments && null==state.faData.faRequiredAssistanceBean.customsClearanceDocuments) {
     alert("Please Upload Relevant customsClearanceDocuments Document");
     return false;
    }
	}
	
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa12){
		if (state.finalSubmit==true && null==state.fileData.proofOfParticipation && null==state.faData.faRequiredAssistanceBean.proofOfParticipation) {
     alert("Please Upload Relevant proofOfParticipation Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.registrationInvoice && null==state.faData.faRequiredAssistanceBean.registrationInvoice) {
     alert("Please Upload Relevant registrationInvoice Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.travelAndTransportBills && null==state.faData.faRequiredAssistanceBean.travelAndTransportBills) {
     alert("Please Upload Relevant travelAndTransportBills Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.caCertificateExpenditure && null==state.faData.faRequiredAssistanceBean.caCertificateExpenditure) {
     alert("Please Upload Relevant caCertificateExpenditure Document");
     return false;
    }
	}
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa13){
		if (state.finalSubmit==true && null==state.fileData.fssaiLicenceCopyFile && null==state.faData.faRequiredAssistanceBean.fssaiLicenceCopyFile) {
     alert("Please Upload Relevant fssaiLicenceCopyFile Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.projectReportProductionProofFile && null==state.faData.faRequiredAssistanceBean.projectReportProductionProofFile) {
     alert("Please Upload Relevant projectReportProductionProofFile Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.caCertificateMachineryInfrastructureFile && null==state.faData.faRequiredAssistanceBean.caCertificateMachineryInfrastructureFile) {
     alert("Please Upload Relevant caCertificateMachineryInfrastructureFile Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.billsAndPaymentProofsFile && null==state.faData.faRequiredAssistanceBean.billsAndPaymentProofsFile) {
     alert("Please Upload Relevant billsAndPaymentProofsFile Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.qualityCertificateFile && null==state.faData.faRequiredAssistanceBean.qualityCertificateFile) {
     alert("Please Upload Relevant qualityCertificateFile Document");
     return false;
    }
	}
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa14){
		if (state.finalSubmit==true && null==state.fileData.projectReport && null==state.faData.faRequiredAssistanceBean.projectReport) {
     alert("Please Upload Relevant projectReport Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.powerLabourRegistrationCertificate && null==state.faData.faRequiredAssistanceBean.powerLabourRegistrationCertificate) {
     alert("Please Upload Relevant powerLabourRegistrationCertificate Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.caCertificateMachineryExpenditure && null==state.faData.faRequiredAssistanceBean.caCertificateMachineryExpenditure) {
     alert("Please Upload Relevant caCertificateMachineryExpenditure Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.employmentListSalaryProof && null==state.faData.faRequiredAssistanceBean.employmentListSalaryProof) {
     alert("Please Upload Relevant employmentListSalaryProof Document");
     return false;
    }
	}
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa15){
		if (state.finalSubmit==true && null==state.fileData.textileUnitRegistrationAck && null==state.faData.faRequiredAssistanceBean.textileUnitRegistrationAck) {
     alert("Please Upload Relevant textileUnitRegistrationAck Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.billsInstallationProofMachinery && null==state.faData.faRequiredAssistanceBean.billsInstallationProofMachinery) {
     alert("Please Upload Relevant billsInstallationProofMachinery Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.caCertificateEligibleInvestment && null==state.faData.faRequiredAssistanceBean.caCertificateEligibleInvestment) {
     alert("Please Upload Relevant caCertificateEligibleInvestment Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.powerConnectionProof && null==state.faData.faRequiredAssistanceBean.powerConnectionProof) {
     alert("Please Upload Relevant powerConnectionProof Document");
     return false;
    }
	}
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa16){
		if (state.finalSubmit==true && null==state.fileData.productManufacturingProofMachineryBills && null==state.faData.faRequiredAssistanceBean.productManufacturingProofMachineryBills) {
     alert("Please Upload Relevant productManufacturingProofMachineryBills Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.caCertificateInvestment && null==state.faData.faRequiredAssistanceBean.caCertificateInvestment) {
     alert("Please Upload Relevant caCertificateInvestment Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.landBuildingProof && null==state.faData.faRequiredAssistanceBean.landBuildingProof) {
     alert("Please Upload Relevant landBuildingProof Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.employmentProductionCertificate && null==state.faData.faRequiredAssistanceBean.employmentProductionCertificate) {
     alert("Please Upload Relevant employmentProductionCertificate Document");
     return false;
    }
	}
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa17){
		if (state.finalSubmit==true && null==state.fileData.projectReportWasteToValue && null==state.faData.faRequiredAssistanceBean.projectReportWasteToValue) {
     alert("Please Upload Relevant projectReportWasteToValue Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.pollutionControlBoardConsent && null==state.faData.faRequiredAssistanceBean.pollutionControlBoardConsent) {
     alert("Please Upload Relevant pollutionControlBoardConsent Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.equipmentInvoicesPaymentProof && null==state.faData.faRequiredAssistanceBean.equipmentInvoicesPaymentProof) {
     alert("Please Upload Relevant equipmentInvoicesPaymentProof Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.caCertificateTotalInvestment && null==state.faData.faRequiredAssistanceBean.caCertificateTotalInvestment) {
     alert("Please Upload Relevant caCertificateTotalInvestment Document");
     return false;
    }
	}
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa18){
		if (state.finalSubmit==true && null==state.fileData.morthRegistrationConsent && null==state.faData.faRequiredAssistanceBean.morthRegistrationConsent) {
     alert("Please Upload Relevant morthRegistrationConsent Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.landBuildingDocuments && null==state.faData.faRequiredAssistanceBean.landBuildingDocuments) {
     alert("Please Upload Relevant landBuildingDocuments Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.machineryEquipmentInvoices && null==state.faData.faRequiredAssistanceBean.machineryEquipmentInvoices) {
     alert("Please Upload Relevant machineryEquipmentInvoices Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.caCertificateInvestmentVerification && null==state.faData.faRequiredAssistanceBean.caCertificateInvestmentVerification) {
     alert("Please Upload Relevant caCertificateInvestmentVerification Document");
     return false;
    }
	}
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa19){
		if (state.finalSubmit==true && null==state.fileData.landOwnershipLeaseProof && null==state.faData.faRequiredAssistanceBean.landOwnershipLeaseProof) {
     alert("Please Upload Relevant landOwnershipLeaseProof Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.buildingPlanCompletionCertificate && null==state.faData.faRequiredAssistanceBean.buildingPlanCompletionCertificate) {
     alert("Please Upload Relevant buildingPlanCompletionCertificate Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.infrastructureUtilitiesBills && null==state.faData.faRequiredAssistanceBean.infrastructureUtilitiesBills) {
     alert("Please Upload Relevant infrastructureUtilitiesBills Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.caCertificateCostConfirmation && null==state.faData.faRequiredAssistanceBean.caCertificateCostConfirmation) {
     alert("Please Upload Relevant caCertificateCostConfirmation Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.engineerCertificateSiteVerification && null==state.faData.faRequiredAssistanceBean.engineerCertificateSiteVerification) {
     alert("Please Upload Relevant engineerCertificateSiteVerification Document");
     return false;
    }
	}
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa20){
		if (state.finalSubmit==true && null==state.fileData.rndRegistrationDsirBody && null==state.faData.faRequiredAssistanceBean.rndRegistrationDsirBody) {
     alert("Please Upload Relevant rndRegistrationDsirBody Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.instrumentsSoftwareInstallationBills && null==state.faData.faRequiredAssistanceBean.instrumentsSoftwareInstallationBills) {
     alert("Please Upload Relevant instrumentsSoftwareInstallationBills Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.caCertificateInvestmentConfirmation && null==state.faData.faRequiredAssistanceBean.caCertificateInvestmentConfirmation) {
     alert("Please Upload Relevant caCertificateInvestmentConfirmation Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.researchProposalReportCopy && null==state.faData.faRequiredAssistanceBean.researchProposalReportCopy) {
     alert("Please Upload Relevant researchProposalReportCopy Document");
     return false;
    }
	}
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa21){
		if (state.finalSubmit==true && null==state.fileData.applicationFormAnnexure18 && null==state.faData.faRequiredAssistanceBean.applicationFormAnnexure18) {
     alert("Please Upload Relevant applicationFormAnnexure18 Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.applicationFeeChallan && null==state.faData.faRequiredAssistanceBean.applicationFeeChallan) {
     alert("Please Upload Relevant applicationFeeChallan Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.bankStatementNpaCertificate && null==state.faData.faRequiredAssistanceBean.bankStatementNpaCertificate) {
     alert("Please Upload Relevant bankStatementNpaCertificate Document");
     return false;
    }
    if (state.finalSubmit==true && null==state.fileData.balanceSheetProfitLossStatements && null==state.faData.faRequiredAssistanceBean.balanceSheetProfitLossStatements) {
     alert("Please Upload Relevant balanceSheetProfitLossStatements Document");
     return false;
    }
     if (state.finalSubmit==true && null==state.fileData.revivalPlanDicInspectionReport && null==state.faData.faRequiredAssistanceBean.revivalPlanDicInspectionReport) {
     alert("Please Upload Relevant revivalPlanDicInspectionReport Document");
     return false;
    }
     if (state.finalSubmit==true && null==state.fileData.caCertificateCurrentInvestment && null==state.faData.faRequiredAssistanceBean.caCertificateCurrentInvestment) {
     alert("Please Upload Relevant caCertificateCurrentInvestment Document");
     return false;
    }
	}
    
    
		
return true;
};

state.validateTenCrore = function(isValid) {
	     if (!isValid && state.finalSubmit==true)
			return false;
			
		
		if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa1){
		if(state.faData.faRequiredAssistanceBean.caUnitOwnerCategory!=null && state.faData.faRequiredAssistanceBean.caUnitOwnerCategory !=''){
		console.log(state.faData.faRequiredAssistanceBean.caUnitOwnerCategory);
		if (state.finalSubmit==true && null==state.fileData.caProofOfOwnershipUpload && null==state.faData.faRequiredAssistanceBean.caProofOfOwnershipUploadId) {
     		alert("Please Upload Proof of ownership file.");
    		 return false;
    		 }
    		 else if (null!=state.fileData.caProofOfOwnershipUpload && state.fileData.caProofOfOwnershipUpload.size > 1048576) {
				alert("Proof of ownership file size should not exceed 1 MB");
				return false;
			   }
    		
   	 	}
   	 	 	if (state.finalSubmit==true && null==state.fileData.cafirstSellBillDateUpload && null==state.faData.faRequiredAssistanceBean.cafirstSellBillDateUploadId) {
			alert("Please Upload Details of First Selling Bill (Attach Document)");
			return false;
			}else if (null!=state.fileData.cafirstSellBillDateUpload && state.fileData.cafirstSellBillDateUpload.size > 1048576) {
				alert("Details of First Selling Bill file size should not exceed 1 MB");
				return false;
			}
			
			if (state.finalSubmit==true && null==state.fileData.plantMachineExpenseUpload && null==state.faData.faRequiredAssistanceBean.plantMachineExpenseUploadId) {
			alert("Please Upload Details of Plant and Machinery and Building Bill (Attach Document)");
			return false;
			}else if (null!=state.fileData.plantMachineExpenseUpload && state.fileData.plantMachineExpenseUpload.size > 1048576) {
				alert("Details of Plant and Machinery and Building Bill file size should not exceed 1 MB");
				return false;
			}
			if (null!= state.fileData.caLoanAcceptanceDocUpload){
				if (state.fileData.caLoanAcceptanceDocUpload.size > 1048576) {
					alert("Details of Plant and Machinery and Building Bill file size should not exceed 1 MB");
					return false;
				}
			}
			if (null!= state.fileData.mandiSamitiDoc1){
				if (state.fileData.mandiSamitiDoc1.size > 1048576) {
					alert("Mandi Samiti file should not exceed 1MB");
					return false;
				}
			}
			if (null!= state.fileData.mandiSamitiDoc2){
				if (state.fileData.mandiSamitiDoc2.size > 1048576) {
					alert("Mandi Samiti file should not exceed 1MB");
					return false;
				}
			}
			if (state.finalSubmit == true && null == state.fileData.bankDoc1 && null == state.faData.faRequiredAssistanceBean.bankDoc1Id
				&& state.caUnitType == "Made-ups and readymade garment") {
				alert("Please Upload Bank Repayment Schedule Document (Attach Document)");
				return false;
			}
			if (null!= state.fileData.bankDoc1){
				if (state.fileData.bankDoc1.size > 1048576) {
					alert("Bank Repayment Schedule Document file should not exceed 1MB");
					return false;
				}
			}
			if (state.finalSubmit == true && null == state.fileData.bankDoc2 && null == state.faData.faRequiredAssistanceBean.bankDoc2Id
				&& state.caUnitType == "Made-ups and readymade garment") {
				alert("Please Upload Certificate and due diligence issued by the sanctioning bank in the prescribed format (Attach Document)");
				return false;
			}
			if (null!= state.fileData.bankDoc2){
				if (state.fileData.bankDoc2.size > 1048576) {
					alert("Certificate and due diligence issued by the sanctioning bank in the prescribed forma file should not exceed 1MB");
					return false;
				}
			}
	
	
	}
   	 	  if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa3){
    if (state.finalSubmit==true && null==state.fileData.patentIprExpUpload && null==state.faData.faRequiredAssistanceBean.patentIprExpUploadId) {
     alert("Please Upload Expenses incurred for obtaining Patent/IPR (Attach attested copy of document certifying the expenditure)");
     return false;
      }
		if (null != state.fileData.patentIprExpUpload) {
			if (state.fileData.patentIprExpUpload.size > 1048576) {
				alert("Expenses incurred for obtaining Patent/IPR (Attach attested copy of document certifying the expenditure file should not exceed 1MB");
				return false;
			}
		}
      
    }
     if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa4){
    if (state.finalSubmit==true && null==state.fileData.infraDevExpAmtUpload && null==state.faData.faRequiredAssistanceBean.infraDevExpAmtUploadId) {
     alert("Please Upload Headwise Amount Certified by Chartered Engineer/Chartered Accountant To develop the infrastructure up to the industrial unit, the information sheet regarding the Permission/Deemed permission granted by the Commissioner of Industries upto date of the commercial production of the unit Upload");
     return false;
     }
     		if (null != state.fileData.infraDevExpAmtUpload) {
			if (state.fileData.infraDevExpAmtUpload.size > 1048576) {
				alert("Headwise Amount Certified by Chartered Engineer/Chartered Accountant To develop the infrastructure up to the industrial unit, the information sheet regarding the Permission/Deemed permission granted by the Commissioner of Industries upto date of the commercial production of the unit Upload file should not exceed 1MB");
				return false;
			}
		}
     
    }
    if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa5){
	    if (state.finalSubmit==true && null==state.fileData.wasteMgmtEstbCompUpload1 && null==state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompUpload1Id) {
		     alert("Please Upload Headwise Amount Certified by Chartered Engineer/Chartered Accountant for Expense on Establishment of Waste Management Systems Upload");
		     return false;
	    }
	    if (null != state.fileData.wasteMgmtEstbCompUpload1) {
			if (state.fileData.wasteMgmtEstbCompUpload1.size > 1048576) {
				alert("Headwise Amount Certified by Chartered Engineer/Chartered Accountant for Expense on Establishment of Waste Management Systems file should not exceed 1MB");
				return false;
			}
		}
	    if (state.finalSubmit==true && null==state.fileData.wasteMgmtEstbCompUpload2 && null==state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompUpload2Id) {
		     alert("Please Upload Attach the certificate of Pollution Control Board / Industrial Health and Directorate of Security");
		     return false;
	    }
	    if (null != state.fileData.wasteMgmtEstbCompUpload2) {
			if (state.fileData.wasteMgmtEstbCompUpload2.size > 1048576) {
				alert("certificate of Pollution Control Board / Industrial Health and Directorate of Security file should not exceed 1MB");
				return false;
			}
		}
	    if (state.finalSubmit==true && null==state.fileData.wasteMgmtEstbCompUpload3 && null==state.faData.faRequiredAssistanceBean.wasteMgmtEstbCompUpload3Id) {
		     alert("Please Upload Details of Documents/Agreement relating to Group Count in case of Public Waste Treatment Plant (Attach attested copy)");
		     return false;
	    }
	    if (null != state.fileData.wasteMgmtEstbCompUpload3) {
			if (state.fileData.wasteMgmtEstbCompUpload3.size > 1048576) {
				alert("Details of Documents/Agreement relating to Group Count in case of Public Waste Treatment Plant file should not exceed 1MB");
				return false;
			}
		}
    }
   
	if (null != state.fileData.revelantDco1Upload) {
		if (state.fileData.revelantDco1Upload.size > 1048576) {
			alert("Relevant Document file should not exceed 1MB");
			return false;
		}
	}
	if (null != state.fileData.revelantDco2Upload) {
		if (state.fileData.revelantDco2Upload.size > 1048576) {
			alert("Relevant Document file should not exceed 1MB");
			return false;
		}
	}
	if (null != state.fileData.revelantDco3Upload) {
		if (state.fileData.revelantDco3Upload.size > 1048576) {
			alert("Relevant Document file should not exceed 1MB");
			return false;
		}
	}
	





		
		
		
	
	

		

		
		
		if(state.faData.faRequiredAssistanceBean.selectedOptions.selectfa10){
			if (state.finalSubmit==true && null==state.profileImage) {
				alert("Please upload Industrial Photo !");
				return false;
				}
				if (null != state.profileImage) {
					if (state.profileImage.size > 5242880) {
						alert("Image 1 size should not exceed 5MB");
						return false;
					}
				}
				if (state.finalSubmit==true && null==state.profileImage1) {
				alert("Please upload Industrial Photo !");
				return false;
				}
				if (null != state.profileImage1) {
					if (state.profileImage1.size > 5242880) {
						alert("Image 2 size should not exceed 5MB");
						return false;
					}
				}
				if (state.finalSubmit==true && null==state.profileImage2) {
				alert("Please upload Industrial Photo !");
				return false;
				}
				if (null != state.profileImage2) {
					if (state.profileImage2.size > 5242880) {
						alert("Image 3 size should not exceed 5MB");
						return false;
					}
				}
			}
    
   
     
		
return true;
};

function validateAllFiles() {

    const fileIds = [
        "caCertificateAnnexure8",
        "exportInvoices",
        "transportInvoicePaymentProof",
        "customsClearanceDocuments",

        "proofOfParticipation",
        "registrationInvoice",
        "travelAndTransportBills",
        "caCertificateExpenditure",

        "fssaiLicenceCopyFile",
        "projectReportProductionProofFile",
        "caCertificateMachineryInfrastructureFile",
        "billsAndPaymentProofsFile",
        "qualityCertificateFile",

        "projectReport",
        "powerLabourRegistrationCertificate",
        "caCertificateMachineryExpenditure",
        "employmentListSalaryProof",

        "textileUnitRegistrationAck",
        "billsInstallationProofMachinery",
        "caCertificateEligibleInvestment",
        "powerConnectionProof",

        "productManufacturingProofMachineryBills",
        "caCertificateInvestment",
        "landBuildingProof",
        "employmentProductionCertificate",

        "projectReportWasteToValue",
        "pollutionControlBoardConsent",
        "equipmentInvoicesPaymentProof",
        "caCertificateTotalInvestment",

        "morthRegistrationConsent",
        "landBuildingDocuments",
        "machineryEquipmentInvoices",
        "caCertificateInvestmentVerification",

        "landOwnershipLeaseProof",
        "buildingPlanCompletionCertificate",
        "infrastructureUtilitiesBills",
        "caCertificateCostConfirmation",
        "engineerCertificateSiteVerification",

        "rndRegistrationDsirBody",
        "instrumentsSoftwareInstallationBills",
        "caCertificateInvestmentConfirmation",
        "researchProposalReportCopy",

        "applicationFormAnnexure18",
        "applicationFeeChallan",
        "bankStatementNpaCertificate",
        "balanceSheetProfitLossStatements",
        "revivalPlanDicInspectionReport",
        "caCertificateCurrentInvestment"
    ];

    const MAX_SIZE = 1048576; 

    for (let id of fileIds) {
        let fileInput = dom("#" + id)[0];

        if (fileInput && fileInput.files.length > 0) {
            let file = fileInput.files[0];

            if (file.size > MAX_SIZE) {
                alert(id + " file size must be less than 1 MB");
                return false;
            }
        }
    }

    return true;
}
}
