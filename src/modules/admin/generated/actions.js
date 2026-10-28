// Generated from AdminController.js and CommonController.js. No runtime Angular.
const each = (items, fn) => Object.entries(items || {}).forEach(([k, v]) => fn(v, Array.isArray(items) ? Number(k) : k));
const identity = value => value;
const $sce = { trustAsHtml: x => x };

export function installAdminActions(state, { request, navigation, loading, params, later, format, animateCounter }) {
state.changePasswordFunction = function(isValid) {

				if (!isValid || state.weakPassword) {
					return false;
				}
				if (state.changePasswordData.otp === undefined) {
					return false;
				}

				loading.start('sample-1');

				var responsePromise = request.post('dochangepassword', state.changePasswordData);

				responsePromise
					.success(function(data, status, headers, config) {
						state.responseObject = data;
						if (state.responseObject.successMessage != null) {
							
							navigation.location.href = '#success';
							alert("Your password changed successfully");
							loading.finish('sample-1');

							
							navigation.location.href = 'home#/dashboard';
							window.location.reload();
						} else if (state.responseObject.errorMessage != null) {
							
							alert("Incorrect OTP. Please try again.");
							loading.finish('sample-1');
							
						}
					})
					.error(function(data, status, headers, config) {
						
						alert("An error occurred. Please try again.");
						loading.finish('sample-1');
					});
			};
state.changePasswordFunction1 = function() {


				loading.start('sample-1');

				var responsePromise = request.post('dochangepasswordgenerateotp',
					state.changePasswordData);

				responsePromise
					.success(function(data, status, headers, config) {
						state.responseObject = data;
						if (state.responseObject.successMessage != null) {
							state.otpGenerated = true;
							state.isOtpButtonDisabled = true;
                            alert(data.successMessage);
							
							
						} else {
							state.otpGenerated = false;
							state.isOtpButtonDisabled = false;
						}
						loading.finish('sample-1');
					});
			};
state.toggleCurrentPassword = function(event) {
				state.showCurrentPassword = !state.showCurrentPassword;
				
				later(function() {
					document.getElementById("currentPassword").focus();
				}, 0);
			};
state.toggleNewPassword = function(event) {
				state.showNewPassword = !state.showNewPassword;
				
				later(function() {
					document.getElementById("newPassword").focus();
				}, 0);
			};
state.toggleConfirmPassword = function(event) {
				state.showConfirmPassword = !state.showConfirmPassword;
				
				later(function() {
					document.getElementById("confirmPassword").focus();
				}, 0);
			};
state.focusInput = function(passwordField) {
				var inputElement = document.getElementById(passwordField);
				inputElement.focus();
			};
state.hidePassword = function(passwordType) {
				state.showCurrentPassword = false;
				state.showNewPassword = false;
				state.showConfirmPassword = false;
			};
state.verifyUserPasswordExpiry = function() {
				
				loading.start('sample-1');

				request.get('verifyUserPasswordExpiry')
					.then(function(response) {
						
						if (response.status === 200) {
							state.responseObject = response.data; 

							
							if (response.data.successMessage.includes("Your password has expired")) {
								
								alert("Your password has expired. Please Update your Password");
								document.getElementById("sideNav").style.display = "none"; 
								window.location.href = '#/changepassword'; 

							}
							
							else if (response.data.successMessage.includes("Your password will expire")) {
								
								if (!navigation.confirm(response.data.successMessage)) {
									window.location.href = '#/dashboard'; 
								}
							}
							
							else if (response.data.successMessage.includes("Your password is still valid")) {
								
								document.getElementById("sideNav").style.display = "block"; 
							}
							else {
								alert(response.data.successMessage);

							}
						}
						loading.finish('sample-1');
					});
			};
state.firstPasswordChange = function(isValid) {
				if (!isValid || state.weakPassword) {
					return false;
				}

				loading.start('sample-1');

				var responsePromise = request.post('dofirstpasswordchange',
					state.changePasswordData);
				responsePromise
					.success(function(data, status, headers, config) {
						state.responseObject = data;
						if (state.responseObject.successMessage != null) {
							var currentSection = navigation.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
							navigation.location.href = currentSection + '/home#dashboard';
						}
						loading.finish('sample-1');
					});
			};
state.startOrStopSpinner = function(isStart) {

						if (isStart) {
							loading.start('sample-1');
						} else {
							loading.finish('sample-1');
						}

					};
state.loadLetterPage = function() {
				loading.start('sample-1');

				var responsePromise = request.get('fetchusergroupsmap');
				responsePromise.success(function(data, status, headers,
					config) {
					state.assignedToSectionList = data;
					loading.finish('sample-1');
				});

			};
state.loadUSERList = function() {
				loading.start('sample-1');

				fetchUSER();
			};
state.populateAssignToUsers = function() {
				loading.start('sample-1');

				var responsePromise = request
					.get('fetchusersbygroupcode/'
						+ state.requestProcessBean.assigneeSection);
				responsePromise.success(function(data, status, headers,
					config) {
					state.assigneeList = data;
					loading.finish('sample-1');
				});

			};
state.loadLetterList = function() {
				loading.start('sample-1');
				fetchLetters();
			};
state.loadLetterById = function() {
				state.disabled = true;
				state.letterId = params.letterId;

				loading.start('sample-1');

				var responsePromise = request.get('fetchLetterDetail/'
					+ params.letterId);
				responsePromise.success(function(data, status, headers,
					config) {
					state.letterData = data;
				});

				var responsePromise = request.get('getStatusList');
				responsePromise.success(function(data, status, headers,
					config) {
					state.statusList = data;
				});

				var responsePromise = request.get('fetchusergroupsmap');
				responsePromise.success(function(data, status, headers,
					config) {
					state.assignedToSectionList = data;
					loading.finish('sample-1');
				});

			};
state.populateAssignToUsersInUpdate = function() {
				loading.start('sample-1');

				var responsePromise = request
					.get('fetchusersbygroupcode/'
						+ state.requestProcessBean.assigneeSection);
				responsePromise.success(function(data, status, headers,
					config) {
					state.assigneeList = data;
					loading.finish('sample-1');
				});

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

								if (tot > gen) {
									alert("Employment given to MP SC Candidates, MP ST Candidates, MP OBC candidates should not be greater than MP Candidates!");
									return false;
								}
								if (fileData == undefined && null == state.msmeDetailData.employmentGivenUploadId) {
									alert("Please Upload Employment given (Unit) Proof Document");
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
							angular
								.forEach(
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
state.updateProcessSubmit = function(isValid) {

				if (!isValid) {
					return false;
				}

				var fd = new FormData();

				fd.append('letterId', params.letterId);

				if (state.requestProcessBean.comments) {
					fd.append('comments', state.requestProcessBean.comments);
				}

				if (state.requestProcessBean.decisionDate) {
					state.requestProcessBean.decisionDate = format('date')(state.requestProcessBean.decisionDate, 'dd/MM/yyyy');
					fd.append('decisionDate', state.requestProcessBean.decisionDate);
				}

				if (state.requestProcessBean.assigneeSection) {
					fd.append('assigneeSection', state.requestProcessBean.assigneeSection);
				}

				if (state.requestProcessBean.assignee) {
					fd.append('assignee', state.requestProcessBean.assignee);
				}

				if (state.requestProcessBean.statusId) {
					fd.append('statusId', state.requestProcessBean.statusId);
				}

				if (state.document) {
					fd.append('document', state.document);
				}

				if (state.requestProcessBean.documentDesc) {
					fd.append('documentDesc', state.requestProcessBean.documentDesc);
				}

				loading.start('sample-1');

				var responsePromise = request.post('updateProcessSubmit', fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});

				responsePromise.success(function(data, status, headers, config) {
					state.responseObject = data;
					if (state.responseObject.successMessage != null) {
						navigation.location.href = '#/success';
					}
					loading.finish('sample-1');
				});
			};
state.loadHistoryByLetterId = function() {
				loading.start('sample-1');

				var responsePromise = request
					.get('fetchHistoryByLetterId/'
						+ params.letterId);
				responsePromise.success(function(data, status, headers,
					config) {
					state.hearingList = data;
					loading.finish('sample-1');
				});
			};
state.downloadDocument = function(documentId) {
				navigation.open('downloadDocument/' + documentId);
			};
state.onInDateChange = function() {
				state.inDateGreater = false;
			};
state.loadUserDetails = function() {
						state.disabled = true;

						loading.start('sample-1');

						var responsePromise = request.get('fetchUserDetails', {
							params : {
								'userId' : params.userId
							}
						});
						responsePromise
								.success(function(data, status, headers, config) {
									state.signupData = {};
									state.signupData = data;
									if (state.signupData.genderId) {
										state.signupData.genderId = state.signupData.genderId+"";
									}
									if (state.signupData.districtId) {
										state.signupData.districtId = state.signupData.districtId+"";
									}
									if (state.signupData.tehsilId) {
										state.signupData.tehsilId = state.signupData.tehsilId+"";
									}
									if (state.signupData.statusId) {
										state.signupData.statusId = state.signupData.statusId+"";
									}
									if (state.signupData.designationCode) {
										state.signupData.designationCode = state.signupData.designationCode+"";
									}
									if (state.signupData.allocatedTehsilId) {
										for (var i=0;i<state.signupData.allocatedTehsilId.length;i++) {
											state.signupData.allocatedTehsilId[i] = state.signupData.allocatedTehsilId[i]+"";
										}
									}
									
												
									if (state.signupData.officeLocationId) {
										var responseOffice = request
												.get(
														'fetchofficeaddresssbyofficeid',
														{
															params : {
																'officeId' : state.signupData.officeLocationId
															}
														});
										responseOffice.success(function(data,
												status, headers, config) {
											state.respondentOffices = data;
										});
										
										var responseTehsils = request
										.get(
												'fetchtehsilsbyofficeid',
												{
													params : {
														'officeId' : state.signupData.officeLocationId
													}
												});
										responseTehsils.success(function(data,
										status, headers, config) {
									state.respondentTehsils = data;
										});
										
										
								}
										
									
									var responseStates = request
											.get('fetchallstates');
									responseStates.success(function(data,
											status, headers, config) {
										state.respondentStates = data;
									});
									
									if (state.signupData.stateId) {
										state.signupData.stateId = state.signupData.stateId+"";
									}
									if (state.signupData.districtId) {
										state.signupData.districtId = state.signupData.districtId+"";
									}
									if (state.signupData.tehsilId) {
										state.signupData.tehsilId = state.signupData.tehsilId+"";
									}
									
									
									
									if (state.signupData.permanentStateId) {
										state.signupData.permanentStateId = state.signupData.permanentStateId+"";
									}
									if (state.signupData.permanentDistrictId) {
										state.signupData.permanentDistrictId = state.signupData.permanentDistrictId+"";
									}
									if (state.signupData.permanentTehsilId) {
										state.signupData.permanentTehsilId = state.signupData.permanentTehsilId+"";
									}
									
									
									
									if (state.signupData.stateId) {
										var responseDistricts = request
												.get(
														'fetchdistrictmapbystate',
														{
															params : {
																'stateId' : state.signupData.stateId
															}
														});
										responseDistricts.success(function(
												data, status, headers, config) {
											state.districts = data;
										});
									}
									if (state.signupData.districtId) {
										var responseDistricts = request
												.get(
														'fetchdistricttehsilmapbydistrictid',
														{
															params : {
																'districtId' : state.signupData.districtId
															}
														});
										responseDistricts.success(function(
												data, status, headers, config) {
											state.tehsils = data;
										});
									}
									if (state.signupData.permanentStateId) {
										var responsePermanentDistricts = request
												.get(
														'fetchdistrictmapbystate',
														{
															params : {
																'stateId' : state.signupData.permanentStateId
															}
														});
										responsePermanentDistricts
												.success(function(data, status,
														headers, config) {
													state.permanentDistricts = data;
												});
									}
									if (state.signupData.permanentDistrictId) {
										var responsepDistricts = request
												.get(
														'fetchdistricttehsilmapbydistrictid',
														{
															params : {
																'districtId' : state.signupData.permanentDistrictId
															}
														});
										responsepDistricts.success(function(
												data, status, headers, config) {
											state.permanentTehsils = data;

										});
									}
									
									
									
									loading.finish('sample-1');
								});
					};
state.getPOIPattern = function(poiType) {
							
						    switch(poiType) {
						        case 'Voter ID':
						            return /^[a-zA-Z]{3}[0-9]{7}$/; 
						        case 'Driving Licence':
						            return /^[A-Z]{2}[0-9]{2}\s?[0-9]{11}$/; 
						        case 'PAN No.':
						            return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i; 
						        default:
						            return /.*/; 
						    }
						};
state.isUndefinedNullOrEmpty = function(value) {
				return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
			};
state.loadUserIndustrialDetails = function() {
				state.disabled = true;
				state.isUdyamAndGstAvailable = true;
				state.isPoaCategoryAvailable = true;
				loading.start('sample-1');
				var responsePromise = request.get('fetchUserIndustrialDetails', {
					params: {
						'userId': ""
					}
				});
				responsePromise
					.success(function(data, status, headers, config) {
						state.signupData = data;
						if (null != state.signupData.industrialArea)
							state.signupData.unitInIndustrialArea = 'Yes';
						else
							state.signupData.unitInIndustrialArea = 'No';
						if (null == state.signupData.industrialPartnerslist)
							state.signupData.industrialPartnerslist = [{}];
						if (null == state.signupData.regNocList)
							state.signupData.regNocList = [{}];
						if (state.signupData.genderId) {
							state.signupData.genderId = state.signupData.genderId
								+ "";
						}
						if (state.signupData.categoryId) {
							state.signupData.categoryId = state.signupData.categoryId
								+ "";
						}
						if (state.signupData.statusId) {
							state.signupData.statusId = state.signupData.statusId
								+ "";
						}
						if (state.signupData.designationCode) {
							state.signupData.designationCode = state.signupData.designationCode
								+ "";
						}
						if (state.signupData.industrialArea) {
							state.signupData.industrialArea = state.signupData.industrialArea
								+ "";
						}
						
						if (state.signupData.userId) {
							state.fetchApplicantDetails(state.signupData.userId);
						}
						var responseStates = request
							.get('fetchallstates');
						responseStates.success(function(data,
							status, headers, config) {
							state.respondentStates = data;
						});

						if (state.signupData.stateId) {
							state.signupData.stateId = state.signupData.stateId
								+ "";
						}
						if (state.signupData.districtId) {
							state.signupData.districtId = state.signupData.districtId
								+ "";
						}
						if (state.signupData.tehsilId) {
							state.signupData.tehsilId = state.signupData.tehsilId
								+ "";
						}
						if (state.signupData.blockId) {
							state.signupData.blockId = state.signupData.blockId
								+ "";
						}

						
						
						if (state.signupData.permanentStateId) {
							state.signupData.permanentStateId = state.signupData.permanentStateId
								+ "";
						}
						if (state.signupData.permanentDistrictId) {
							state.signupData.permanentDistrictId = state.signupData.permanentDistrictId
								+ "";
						}
						if (state.signupData.permanentTehsilId) {
							state.signupData.permanentTehsilId = state.signupData.permanentTehsilId
								+ "";
						}
						if (state.signupData.permanentBlockId) {
							state.signupData.permanentBlockId = state.signupData.permanentBlockId
								+ "";
						}
                        state.signupData.hasUdyam = data.hasUdyam;
						
						if(state.isUndefinedNullOrEmpty(state.signupData.udyamRegNo) ||
							state.isUndefinedNullOrEmpty(state.signupData.udyamRegDate) ||
							state.isUndefinedNullOrEmpty(state.signupData.udyamUploadId) ||
							state.isUndefinedNullOrEmpty(state.signupData.gstNo) ||
							state.isUndefinedNullOrEmpty(state.signupData.gstUploadId)) {
								state.signupData.hasUdyam = true;
								state.isUdyamAndGstAvailable = false;
						}
						
						if(state.isUndefinedNullOrEmpty(state.signupData.poaCategory)) {
							state.isPoaCategoryAvailable = false;
						}

						if (state.signupData.stateId) {
							var responseDistricts = request
								.get(
									'fetchdistrictmapbystate',
									{
										params: {
											'stateId': state.signupData.stateId
										}
									});
							responseDistricts.success(function(
								data, status, headers, config) {
								state.districts = data;
							});
						}
						if (state.signupData.districtId) {
							state.fetchIndustrialAreasByDistrictId(state.signupData.districtId);
							var responseDistricts = request
								.get(
									'fetchdistricttehsilmapbydistrictid',
									{
										params: {
											'districtId': state.signupData.districtId
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
										params: {
											'districtId': state.signupData.districtId
										}
									});
							responseDistricts1.success(function(
								data, status, headers, config) {
								state.blocks = data;
							});
						}
						if (state.signupData.permanentStateId) {
							var responsePermanentDistricts = request
								.get(
									'fetchdistrictmapbystate',
									{
										params: {
											'stateId': state.signupData.permanentStateId
										}
									});
							responsePermanentDistricts
								.success(function(data, status,
									headers, config) {
									state.permanentDistricts = data;
								});
						}
						if (state.signupData.permanentDistrictId) {
							var responseDistricts = request
								.get(
									'fetchdistricttehsilmapbydistrictid',
									{
										params: {
											'districtId': state.signupData.permanentDistrictId
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
										params: {
											'districtId': state.signupData.permanentDistrictId
										}
									});
							responseDistricts1.success(function(
								data, status, headers, config) {
								state.permanentBlocks = data;
							});
						}
						
						var fetchAllIndustryCategory = request
							.get('fetchAllIndustryCategory');
							fetchAllIndustryCategory.success(function(data,
								status, headers, config) {
							state.categoryOfIndustryList = data;
						});
						
					

						loading.finish('sample-1');
					});
			};
state.toggleCaseForm = function() {
						loading.start('sample-1');
						state.disabled = !state.disabled;
						loading.finish('sample-1');
					};
state.fetchApplicantDetails = function(username) {
		loading.start('sample-1');

		var responsePromise = request.get('fetchUserIndustrialDetail/' + username);
		responsePromise.success(function(data, status, headers, config) {
			state.IndustrialDetail = data;	
			if(state.IndustrialDetail==='false' || state.IndustrialDetail===false ){
				state.profile = true;				
			}
			loading.finish('sample-1');
		});
	};
state.loadGender = function() {
						loading.start('sample-1');
						var responseStatus = request.get('fetchGender');
						responseStatus.success(function(data, status, headers,
								config) {
							state.genderList = data;
							
						});
					};
state.addNewChoice = function() {

				state.signupData.industrialPartnerslist.push({});

			};
state.addNewChoiceNocList = function() {

				state.signupData.regNocList.push({});

			};
state.removeChoice = function(index) {
				state.signupData.industrialPartnerslist.splice(index, 1);
			};
state.removeChoiceNocList = function(index) {
				state.signupData.regNocList.splice(index, 1);
			};
state.loadBanks = function() {
				var responseStatus = request.get('fetchBanksMap');
				responseStatus.success(function(data, status, headers,
					config) {
					state.bankList = data;
				});
			};
state.loadCategory = function() {
				var responseStatus = request.get('fetchcategoriesmap');
				responseStatus.success(function(data, status, headers,
					config) {
					state.categoryList = data;
				});
			};
state.loadStatus = function() {
						loading.start('sample-1');
						var responseStatus = request
								.get('fetchmasteruserstatusmap');
						responseStatus.success(function(data, status, headers,
								config) {
							state.statusList = data;
							
						});
					};
state.loadDesignation = function() {
						loading.start('sample-1');
						var responseStatus = request.get('fetchdesignationmap');
						responseStatus.success(function(data, status, headers,
								config) {
							state.designationList = data;
							
						});
					};
state.fetchPresentAddDistrictByState = function(stateId) {
						
						if (state.signupData) {
							state.tehsils = "";
							state.signupData.districtId = "";							
							state.signupData.tehsilId = "";							
						}
												
						if (state.officeData) {
							state.tehsils = "";
							state.officeData.districtId = "";
							state.officeData.tehsilId = "";
						}												

						if (null != stateId) {
							
							var responseDistricts = request.get(
									'fetchdistrictmapbystate', {
										params : {
											'stateId' : stateId
										}
									});
							responseDistricts.success(function(data, status,
									headers, config) {
								state.districts = data;
								
							});
						}
						

					};
state.fetchTehsilByDistrict = function(districtId) {

						if (state.signupData) {
							state.signupData.tehsilId = "";
						}
						
						if (state.officeData) {
							state.officeData.tehsilId = "";
						}

						if (null != districtId) {

							loading.start('sample-1');
							var responseDistricts = request.get(
									'fetchdistricttehsilmapbydistrictid', {
										params : {
											'districtId' : districtId
										}
									});

							responseDistricts.success(function(data, status,
									headers, config) {
								state.tehsils = data;
								loading.finish('sample-1');
							});

							
							
							
							
							
							
							
							

						} else {
							state.tehsils = "";
							
						}

					};
state.fetchDistrictTehsilBlockByDistrict = function(districtId) {

				if (state.signupData) {
					state.signupData.tehsilId = "";
					state.signupData.blockId = "";
				}

				if (state.officeData) {
					state.officeData.tehsilId = "";
					scope.officeData.blockId = "";
				}

				if (null != districtId) {
					loading.start('sample-1');
					var responseDistricts = request.get(
						'fetchdistricttehsilmapbydistrictid', {
						params: {
							'districtId': districtId
						}
					});
					responseDistricts.success(function(data, status,
						headers, config) {
						state.tehsils = data;
						var responseDistricts1 = request.get(
							'fetchdistrictblockmapbydistrictid', {
							params: {
								'districtId': districtId
							}
						});

						responseDistricts1.success(function(data, status,
							headers, config) {
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

				if (null != districtId && districtId != '') {
					var responseAreas = request.get(
						'fetchindustrialareamapbydistrict', {
						params: {
							'districtId': districtId
						}
					});
					responseAreas.success(function(data, status, headers,
						config) {
						state.areas = data;
					});
				} else {
					state.areas = null;
				}

			};
state.fetchPermanentAddDistrictByState = function(stateId) {
						state.signupData.permanentDistrictId = "";
						state.signupData.permanentTehsilId = "";
						
						
						
						if (null != stateId) {
							loading.start('sample-1');
							var responsePermanentDistricts = request.get(
									'fetchdistrictmapbystate', {
										params : {
											'stateId' : stateId
										}
									});
							responsePermanentDistricts.success(function(data,
									status, headers, config) {
								state.permanentDistricts = data;
								loading.finish('sample-1');
							});
						} else {
							state.permanentDistricts = "";
							state.permanentTehsils = "";
							loading.finish('sample-1');
						}
					};
state.fetchPermanentDistrictTehsilBlockByDistrict = function(districtId) {

				if (state.signupData) {
					state.signupData.permanentTehsilId = "";
					state.signupData.permanentBlockId = "";
				}

				if (state.officeData) {
					state.officeData.permanentTehsilId = "";
					scope.officeData.permanentBlockId = "";
				}

				if (null != districtId) {
					loading.start('sample-1');
					var responseDistricts = request.get(
						'fetchdistricttehsilmapbydistrictid', {
						params: {
							'districtId': districtId
						}
					});
					responseDistricts.success(function(data, status,
						headers, config) {
						state.permanentTehsils = data;
						var responseDistricts1 = request.get(
							'fetchdistrictblockmapbydistrictid', {
							params: {
								'districtId': districtId
							}
						});

						responseDistricts1.success(function(data, status,
							headers, config) {
							state.permanentBlocks = data;
							loading.finish('sample-1');
						});
					});
				} else {
					state.permanentTehsils = "";
					state.permanentBlocks = "";
				}
			};
state.fetchPermanentTehsilByDistrict = function(districtId) {

						state.signupData.permanentTehsilId = "";
						

						if (null != districtId) {

							loading.start('sample-1');
							var responsepDistricts = request.get(
									'fetchdistricttehsilmapbydistrictid', {
										params : {
											'districtId' : districtId
										}
									});

							responsepDistricts.success(function(data, status,
									headers, config) {
								state.permanentTehsils = data;
								loading.finish('sample-1');
							});

							
							
							
							
							
							
							
							

						} else {
							state.permanentTehsils = "";
							
							
						}

					};
state.fetchPermanentBlockByDistrict = function(districtId) {

				state.signupData.permanentBlockId = "";

				if (null != districtId) {

					loading.start('sample-1');
					var responsepDistricts = request.get(
						'fetchblockmapbydistrictid', {
						params: {
							'districtId': districtId
						}
					});

					responsepDistricts.success(function(data, status,
						headers, config) {
						state.permanentBlocks = data;
						loading.finish('sample-1');
					});
				} else {
					state.permanentBlocks = "";
				}
			};
state.setSameAddress = function() {
						if (state.sameAsAbovecheck == true) {
							state.signupData.permanentAddress1 = state.signupData.address1;
							state.signupData.permanentAddress2 = state.signupData.address2;
							state.signupData.permanentAddress3 = state.signupData.address3;
							state.signupData.permanentPinCode = state.signupData.pinCode;
							state.signupData.permanentStateId = state.signupData.stateId;
							state.signupData.permanentDistrictId = state.signupData.districtId;
							state.signupData.permanentTehsilId = state.signupData.tehsilId;
							if ("" != state.signupData.permanentStateId) {
								state
										.fetchPermanentAddDistrictByState(state.signupData.permanentStateId);
								state.signupData.permanentDistrictId = state.signupData.districtId;
								if ("" != state.signupData.permanentDistrictId) {
									state
											.fetchPermanentTehsilByDistrict(state.signupData.permanentDistrictId);
									state.signupData.permanentTehsilId = state.signupData.tehsilId;
								}
							}

						} else {
							state.signupData.permanentAddress1 = "";
							state.signupData.permanentAddress2 = "";
							state.signupData.permanentAddress3 = "";
							state.signupData.permanentStateId = "";
							state.signupData.permanentDistrictId = "";
							state.signupData.permanentTehsilId = "";
							state.permanentDistricts = "";
							state.permanentTehsils = "";
							state.signupData.permanentPinCode = "";
						}

					};
state.setSameAddressIndustrial = function() {
				if (state.sameAsAbovecheck == true) {
					state.signupData.permanentAddress1 = state.signupData.address1;
					state.signupData.permanentAddress2 = state.signupData.address2;
					state.signupData.permanentAddress3 = state.signupData.address3;
					state.signupData.permanentPinCode = state.signupData.pinCode;
					state.signupData.permanentStateId = state.signupData.stateId;
					state.signupData.permanentDistrictId = state.signupData.districtId;
					state.signupData.permanentTehsilId = state.signupData.tehsilId;
					state.signupData.permanentBlockId = state.signupData.blockId;
					state.signupData.permanentAddMobileNo = state.signupData.presentAddMobileNo;
					state.signupData.permanentAddTelephoneNo = state.signupData.presentAddTelephoneNo;
					if ("" != state.signupData.permanentStateId) {
						state
							.fetchPermanentAddDistrictByState(state.signupData.permanentStateId);
						state.signupData.permanentDistrictId = state.signupData.districtId;
						if ("" != state.signupData.permanentDistrictId) {
							state.fetchPermanentDistrictTehsilBlockByDistrict(state.signupData.permanentDistrictId);
							state.signupData.permanentTehsilId = state.signupData.tehsilId;
							state.signupData.permanentBlockId = state.signupData.blockId;
						}
					}

				} else {
					state.signupData.permanentAddress1 = "";
					state.signupData.permanentAddress2 = "";
					state.signupData.permanentAddress3 = "";
					state.signupData.permanentStateId = "";
					state.signupData.permanentDistrictId = "";
					state.signupData.permanentTehsilId = "";
					state.signupData.permanentBlockId = "";
					state.permanentDistricts = "";
					state.permanentTehsils = "";
					state.permanentBlocks = "";
					state.signupData.permanentPinCode = "";
					state.signupData.permanentAddMobileNo = "";
					state.signupData.permanentAddTelephoneNo = "";
				}

			};
state.updateDepartmentUserProfile = function(isValid) {
				if (!isValid) {
					return false;
				}
				var fd = new FormData();
				var language = $('#language').val();
				if (state.signupData.userId) {
					fd.append('userId', state.signupData.userId);
				}

				if (state.signupData.firstName) {
					fd.append('firstName', state.signupData.firstName);
				}

				if (state.signupData.middleName) {
					fd.append('middleName',
						state.signupData.middleName);
				}

				if (state.signupData.lastName) {
					fd.append('lastName', state.signupData.lastName);
				}
				
				if (state.signupData.firstName) {
					fd.append('fatherOrHusbandFirstName', state.signupData.fatherOrHusbandFirstName);
				}

				if (state.signupData.middleName) {
					fd.append('fatherOrHusbandMiddleName',
						state.signupData.fatherOrHusbandMiddleName);
				}

				if (state.signupData.lastName) {
					fd.append('fatherOrHusbandLastName', state.signupData.fatherOrHusbandLastName);
				}
				
				if (state.signupData.emailId) {
					fd.append('emailId', state.signupData.emailId);
				}

				if (state.signupData.mobileNumber) {
					fd.append('mobileNumber',
						state.signupData.mobileNumber);
				}
				if (state.signupData.mobileNumberPrev) {
					fd.append('mobileNumberPrev',
						state.signupData.mobileNumberPrev);
				}

				if (state.signupData.aadhaarNumber) {

					fd.append('aadhaarNumber',
						state.signupData.aadhaarNumber);
				}

				if (state.signupData.telephoneNumber) {
					fd.append('telephoneNumber',
						state.signupData.telephoneNumber);
				}

				if (state.signupData.genderId) {
					fd.append('genderId', state.signupData.genderId);
				}

				if (state.signupData.designationCode) {
					fd.append('designation',
						state.signupData.designationCode);
				}

				if (state.signupData.address1) {
					fd.append('address1', state.signupData.address1);
				}

				if (state.signupData.address2) {
					fd.append('address2', state.signupData.address2);
				}

				if (state.signupData.address3) {
					fd.append('address3', state.signupData.address3);
				}

				if (state.signupData.districtId) {
					fd.append('districtId',
						state.signupData.districtId);
				}

				if (state.signupData.tehsilId) {
					fd.append('tehsilId', state.signupData.tehsilId);
				}
				if (state.signupData.blockId) {
					fd.append('blockId', state.signupData.blockId);
				}

				if (state.signupData.pinCode) {
					fd.append('pinCode', state.signupData.pinCode);
				}

				if (state.signupData.permanentAddress1) {
					fd.append('permanentAddress1',
						state.signupData.permanentAddress1);
				}

				if (state.signupData.permanentAddress2) {
					fd.append('permanentAddress2',
						state.signupData.permanentAddress2);
				}

				if (state.signupData.permanentAddress3) {
					fd.append('permanentAddress3',
						state.signupData.permanentAddress3);
				}
				if (state.signupData.permanentCity) {
					fd.append('permanentCity',
						state.signupData.permanentCity);
				}
				if (state.signupData.permanentDistrictId) {
					fd.append('permanentDistrictId',
						state.signupData.permanentDistrictId);
				}

				if (state.signupData.permanentTehsilId) {
					fd.append('permanentTehsilId',
						state.signupData.permanentTehsilId);
				}
				if (state.signupData.permanentBlockId) {
					fd.append('permanentBlockId',
						state.signupData.permanentBlockId);
				}

				if (state.signupData.permanentPinCode) {
					fd.append('permanentPinCode',
						state.signupData.permanentPinCode);
				}
				loading.start('sample-1');

				var responsePromise = request.post('updateDepartmentUser', fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});

				responsePromise
					.success(function(data, status, headers, config) {
						loading.finish('sample-1');
						state.responseObject = data;
						if (state.responseObject.successMessage != null) {
							if (language == 'en_US') {
								alert("User's Profile Updated successfully.");
							} else if (language == 'hi_IN') {
								alert("उपयोगकर्ता का  प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया।");
							}
							state.disabled = true;
						}
					});

			};
state.updateUserProfile = function(isValid) {
		if (!isValid) {
    console.log("⚠️ Form validation failed. Field details:");
    each(state.signupForm, function(field, fieldName) {
        if (fieldName[0] !== '$') { 
            console.log(fieldName + ' -> valid: ' + field.$valid + ', dirty: ' + field.$dirty);
        }
    });
    return false;
}

				var fd = new FormData();
				var language = $('#language').val();

				

				if (state.signupData.firstName) {
					fd.append('firstName', state.signupData.firstName);
				}

				if (state.signupData.middleName) {
					fd.append('middleName',
						state.signupData.middleName);
				}

				if (state.signupData.lastName) {
					fd.append('lastName', state.signupData.lastName);
				}
				
				if (state.signupData.firstName) {
					fd.append('fatherOrHusbandFirstName', state.signupData.fatherOrHusbandFirstName);
				}

				if (state.signupData.middleName) {
					fd.append('fatherOrHusbandMiddleName',
						state.signupData.fatherOrHusbandMiddleName);
				}
				if (state.signupData.benificiaryUser) {
					fd.append('benificiaryUser', state.signupData.benificiaryUser)
				}
				if (state.signupData.lastName) {
					fd.append('fatherOrHusbandLastName', state.signupData.fatherOrHusbandLastName);
				}
				
				if (state.signupData.emailId) {
					fd.append('emailId', state.signupData.emailId);
				}
				
				if (state.signupData.mobileNumber) {
					fd.append('mobileNumber',
						state.signupData.mobileNumber);
				}
				if (state.signupData.mobileNumberPrev) {
					fd.append('mobileNumberPrev',
						state.signupData.mobileNumberPrev);
				}

				if (state.signupData.aadhaarNumber) {

					fd.append('aadhaarNumber',
						state.signupData.aadhaarNumber);
				}

				if (state.signupData.telephoneNumber) {
					fd.append('telephoneNumber',
						state.signupData.telephoneNumber);
				}
				if (state.certificateLink) {
					fd.append('certificateLink',
						state.certificateLink);
				}
				if (state.signupData.genderId) {
					fd.append('genderId', state.signupData.genderId);
				}

				if (state.signupData.designationCode) {
					fd.append('designation',
						state.signupData.designationCode);
				}

				if (state.signupData.address1) {
					fd.append('address1', state.signupData.address1);
				}

				if (state.signupData.address2) {
					fd.append('address2', state.signupData.address2);
				}

				if (state.signupData.address3) {
					fd.append('address3', state.signupData.address3);
				}

				if (state.signupData.districtId) {
					fd.append('districtId',
						state.signupData.districtId);
				}

				if (state.signupData.tehsilId) {
					fd.append('tehsilId', state.signupData.tehsilId);
				}
				if (state.signupData.blockId) {
					fd.append('blockId', state.signupData.blockId);
				}

				if (state.signupData.pinCode) {
					fd.append('pinCode', state.signupData.pinCode);
				}

				if (state.signupData.permanentAddress1) {
					fd.append('permanentAddress1',
						state.signupData.permanentAddress1);
				}

				if (state.signupData.permanentAddress2) {
					fd.append('permanentAddress2',
						state.signupData.permanentAddress2);
				}

				if (state.signupData.permanentAddress3) {
					fd.append('permanentAddress3',
						state.signupData.permanentAddress3);
				}
				if (state.signupData.permanentCity) {
					fd.append('permanentCity',
						state.signupData.permanentCity);
				}
				if (state.signupData.permanentDistrictId) {
					fd.append('permanentDistrictId',
						state.signupData.permanentDistrictId);
				}

				if (state.signupData.permanentTehsilName) {
					fd.append('permanentTehsilName',
						state.signupData.permanentTehsilName);
				}
				if (state.signupData.permanentBlockName) {
					fd.append('permanentBlockName',
						state.signupData.permanentBlockName);
				}

				if (state.signupData.permanentPinCode) {
					fd.append('permanentPinCode',
						state.signupData.permanentPinCode);
				}

				if (state.signupData.officeLocationId) {
					fd.append('officeLocationId',
						state.signupData.officeLocationId);
				}
				if (state.signupData.dob) {
					fd.append('dob', state.signupData.dob);
				}
				if (state.signupData.panNo) {

					fd.append('panNo', state.signupData.panNo.toUpperCase());
				}

				if (state.signupData.proofOfIdentity) {
					fd.append('proofOfIdentity', state.signupData.proofOfIdentity);
				}
				if (state.signupData.proofOfIdentityNo) {
					fd.append('proofOfIdentityNo', state.signupData.proofOfIdentityNo);
				}
				if (state.signupData.proofOfAddress) {
					fd.append('proofOfAddress', state.signupData.proofOfAddress);
				}
				if (state.signupData.categoryId) {
					fd.append('categoryId', state.signupData.categoryId);
				}
				
				if (state.signupData.domicile) {
					fd.append('domicile', state.signupData.domicile)
				}
				if (state.signupData.minority) {
					fd.append('minority', state.signupData.minority)
				} else {
					fd.append('minority', 0)
				}

				if (state.signupData.physicallyDisabled) {
					fd.append('physicallyDisabled', state.signupData.physicallyDisabled)
				} else {
					fd.append('physicallyDisabled', 0)
				}

				if (state.signupData.city) {
					fd.append('city', state.signupData.city);
				}
				if (state.signupData.fax) {
					fd.append('fax', state.signupData.fax);
				}
				if (state.signupData.website) {
					fd.append('website', state.signupData.website);
				}
				if (state.signupData.religion) {
					fd.append('religion', state.signupData.religion);
				}
				
				if (state.signupData.panNo) {
					if (state.signupData.panUpload) {
						if ($("#panUpload")[0].files[0].size / 1024 < 513)
							fd.append('panUpload', state.signupData.panUpload);
						else {
							alert("PAN Card File size should not exceed 500KB");
							return false;
						}

					} else {
						if (state.signupData.panUploadId == null) {
							if (language == 'en_US') {
								alert("Please Upload PAN.");
							} else if (language == 'hi_IN') {
								alert("कृपया पैन अपलोड करें।");
							}
							return false;
						}
					}
				}

			
				if (state.signupData.proofOfIdentityUpload) {
					if ($("#proofOfIdentityUpload")[0].files[0].size / 1024 < 513)
						fd.append('proofOfIdentityUpload', state.signupData.proofOfIdentityUpload);
					else {
						alert("ID Proof File size should not exceed 500KB");
						return false;
					}

				} else {
				
					if (null != state.signupData.proofOfIdentity && state.signupData.proofOfIdentityUploadId == null) {
						if (language == 'en_US') {
							alert("Please upload Proof of Identity.");
						} else if (language == 'hi_IN') {
							alert("कृपया पहचान का प्रमाण अपलोड करें।");
						}
						return false;
					}
				}
				if (state.signupData.proofOfAddress) {
					if (state.signupData.proofOfAddressUpload) {
						if ($("#proofOfAddressUpload")[0].files[0].size / 1024 < 513)
							fd.append('proofOfAddressUpload', state.signupData.proofOfAddressUpload);
						else {
							alert("Proof of Address Upload File size should not exceed 500KB");
							return false;
						}


					} else {
						if (state.signupData.proofOfAddressUploadId == null) {
							if (language == 'en_US') {
								alert("Please upload Proof of Address.");
							} else if (language == 'hi_IN') {
								alert("कृपया पते का प्रमाण अपलोड करें।");
							}
							return false;
						}
					}
				}
				if (state.signupData.categoryUpload) {
					fd.append('categoryUpload', state.signupData.categoryUpload);
				} else {
					if (state.signupData.categoryId != null && state.signupData.categoryId != '' && state.signupData.categoryId != 4 && state.signupData.categoryUploadId == null) {
						if (language == 'en_US') {
							alert("Please upload Caste Certificate.");
						} else if (language == 'hi_IN') {
							alert("जाति प्रमाण पत्र अपलोड करें।");
						}
						return false;
					}
				}


				loading.start('sample-1');

				var responsePromise = request.post('updateUser', fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});

				responsePromise
					.success(function(data, status, headers, config) {
						loading.finish('sample-1');
						state.responseObject = data;
						if (state.responseObject.successMessage != null) {
							if (language == 'en_US') {
								alert("User's Profile Updated successfully.");
							} else if (language == 'hi_IN') {
								alert("उपयोगकर्ता का  प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया।");
							}
							state.disabled = true;
						}
					});
			};
state.fetchPanDetailsFromUserProfile = function() {
				state.signupData.panNo = null;
				state.signupData.panUploadId = null;
				var userIdEncoded = encodeURIComponent(state.signupData.userId);
				if (state.signupData.firmConstitution != null && state.signupData.firmConstitution != "" && state.signupData.firmConstitution == 'Proprietorship') {
					loading.start('sample-1');

					
					var responsePromise = request.get('fetchPanDetailsByUserId?userId=' + userIdEncoded);
					responsePromise.success(function(data, status, headers,
						config) {
						if (data.panNo == null) {
							var language = $('#language').val();
							if (language == 'en_US') {
								alert("PAN No. Details not found for Proprietorship in User Profile. Please update your User Profile for fetching PAN Details.");
							} else if (language == 'hi_IN') {
								alert("पैन नंबर उपयोगकर्ता प्रोफाइल में एकल स्वामित्व के लिए विवरण नहीं मिला। पैन विवरण प्राप्त करने के लिए कृपया अपना उपयोगकर्ता प्रोफ़ाइल अपडेट करें।");
							}
						} else {
							state.signupData.panNo = data.panNo;
							state.signupData.panUploadId = data.panUploadId;
						}
						loading.finish('sample-1');
					});
				}
			};
state.fetchSamagraDetails = function(memberId) {
				if (memberId != null) {
					loading.start('sample-1');

					


					request.get('fetchSamagraDetails', { params: { 'memberId': memberId } })
						.then(function(response) {
							console.log(response);
							var data = response.data; 

							
							if (Array.isArray(data) && data.length > 0) {
								for (var i = 0; i < data.length; i++) {
									var entry = data[i];

									
									if (entry && entry.gender !== null && entry.caste !== null && entry.religion !== null) {
										var categoryId;
										var genderId;

										
										if (entry.gender === "M") {
											genderId = 1;
										} else if (entry.gender === "F") {
											genderId = 2;
										} else if (entry.gender === "Transgender") {
											genderId = 3;
										}

										
										if (entry.caste === "SC") {
											categoryId = 1;
										} else if (entry.caste === "ST") {
											categoryId = 2;
										} else if (entry.caste === "OBC") {
											categoryId = 3;
										}

										
										state.signupData.genderId = genderId + "";
										state.signupData.categoryId = categoryId + "";
										state.signupData.religion = entry.religion;
										state.certificateLink = entry.certificateLink;

										
										break;
									}
								}

								
								if (!state.signupData.genderId && !state.signupData.categoryId && !state.signupData.religion) {
									console.error("No valid entry found in data array:", data);
									
								}
							} else {
								console.error("No data or empty array returned:", data);
								
							}

							loading.finish('sample-1'); 
						})
						.catch(function(error) {
							console.error("Error fetching Samagra details:", error);
							
							loading.finish('sample-1'); 
						});
				}
			};
state.handleRadioChange = function() {
				if (state.signupData.scRadio === "1") {
					
					state.fetchSamagraDetails(state.signupData.memberId);

				} else {
					
					state.signupData.genderId = "";
					state.signupData.categoryId = "";
					state.signupData.religion = "";
				}
			};
state.showPopup = function() {
				if (state.signupData.scRadio === "0" && (state.signupData.categoryId === "1" || state.signupData.categoryId === "2")) {
					alert("You are not availing services which are offered to SC/ST category.");
				}
			};
state.updateUserIndustrialProfile = function(isValid) {

				if (!isValid) {
					return false;
				}
				var language = $('#language').val();

				var fd = new FormData();
				
				if(state.signupData.hasUdyam){
					fd.append('hasUdyam', state.signupData.hasUdyam);
				}else{
					
					state.signupData.hasUdyam= false;
					fd.append('hasUdyam', false);
				}
				fd.append('userId', state.signupData.userId);
				if (state.signupData.indOrgName) {
					fd.append('indOrgName', state.signupData.indOrgName);
				}
				if (state.signupData.firmSector) {
					fd.append('firmSector',
						state.signupData.firmSector);
				}

				if (state.signupData.firmCategory) {
					fd.append('firmCategory',
						state.signupData.firmCategory);
				}

				if (state.signupData.firmConstitution) {
					fd.append('firmConstitution', state.signupData.firmConstitution);
				}

				if (state.signupData.statusOfPremises) {
					fd.append('statusOfPremises', state.signupData.statusOfPremises);
				}


				if (state.signupData.address1) {
					fd.append('address1', state.signupData.address1);
				}

				if (state.signupData.address2) {
					fd.append('address2', state.signupData.address2);
				}

				if (state.signupData.address3) {
					fd.append('address3', state.signupData.address3);
				}

				if (state.signupData.districtId) {
					fd.append('districtId',
						state.signupData.districtId);
				}

				if (state.signupData.tehsilId) {
					fd.append('tehsilId', state.signupData.tehsilId);
				}
				if (state.signupData.blockId) {
					fd.append('blockId', state.signupData.blockId);
				}

				if (state.signupData.pinCode) {
					fd.append('pinCode', state.signupData.pinCode);
				}
				if (state.signupData.unitInIndustrialArea == 'Yes' && state.signupData.industrialArea) {
					fd.append('industrialArea', state.signupData.industrialArea);
				}
				if (state.signupData.plotNos) {
					fd.append('plotNos', state.signupData.plotNos);
				}
				if (state.signupData.areaInSqm) {
					fd.append('areaInSqm', state.signupData.areaInSqm);
				}
				if (state.signupData.presentAddMobileNo) {
					fd.append('presentAddMobileNo', state.signupData.presentAddMobileNo);
				}
				if (state.signupData.presentAddTelephoneNo) {
					fd.append('presentAddTelephoneNo', state.signupData.presentAddTelephoneNo);
				}

				if (state.signupData.permanentAddress1) {
					fd.append('permanentAddress1',
						state.signupData.permanentAddress1);
				}

				if (state.signupData.permanentAddress2) {
					fd.append('permanentAddress2',
						state.signupData.permanentAddress2);
				}

				if (state.signupData.permanentAddress3) {
					fd.append('permanentAddress3',
						state.signupData.permanentAddress3);
				}

				if (state.signupData.permanentDistrictId) {
					fd.append('permanentDistrictId',
						state.signupData.permanentDistrictId);
				}

				if (state.signupData.permanentTehsilId) {
					fd.append('permanentTehsilId',
						state.signupData.permanentTehsilId);
				}
				if (state.signupData.permanentBlockId) {
					fd.append('permanentBlockId',
						state.signupData.permanentBlockId);
				}

				if (state.signupData.permanentPinCode) {
					fd.append('permanentPinCode',
						state.signupData.permanentPinCode);
				}
				if (state.signupData.permanentAddMobileNo) {
					fd.append('permanentAddMobileNo', state.signupData.permanentAddMobileNo);
				}
				if (state.signupData.permanentAddTelephoneNo) {
					fd.append('permanentAddTelephoneNo', state.signupData.permanentAddTelephoneNo);
				}

				if (state.signupData.panNo) {
					fd.append('panNo', state.signupData.panNo);
				}
				if (state.signupData.tanNo) {
					fd.append('tanNo', state.signupData.tanNo);
				}
				if (state.signupData.proofOfAddress) {
					fd.append('proofOfAddress', state.signupData.proofOfAddress);
				}
				if (state.signupData.udyamRegNo && state.signupData.hasUdyam) {
					fd.append('udyamRegNo', state.signupData.udyamRegNo);
				}
				
				if (state.signupData.udyamRegDate && state.signupData.hasUdyam) {
					fd.append('udyamRegDate', state.signupData.udyamRegDate);
				}
				
				if (state.signupData.factoryActLicNo) {
					fd.append('factoryActLicNo', state.signupData.factoryActLicNo);
				}
				if (state.signupData.factoryActLicNoDoi) {
					fd.append('factoryActLicNoDoi', state.signupData.factoryActLicNoDoi);
				}
				if (state.signupData.factoryActLicNoValidUpto) {
					fd.append('factoryActLicNoValidUpto', state.signupData.factoryActLicNoValidUpto);
				}
				if (state.signupData.gstNo) {
					fd.append('gstNo', state.signupData.gstNo);
				}
				if (state.signupData.cin) {
					fd.append('cin', state.signupData.cin);
				}
				if (state.signupData.cinDoi) {
					fd.append('cinDoi', state.signupData.cinDoi);
				}
				if (state.signupData.pcbRegNoEstablished) {
					fd.append('pcbRegNoEstablished', state.signupData.pcbRegNoEstablished);
				}
				if (state.signupData.pcbRegNoEstablishedDoi) {
					fd.append('pcbRegNoEstablishedDoi', state.signupData.pcbRegNoEstablishedDoi);
				}
				if (state.signupData.pcbRegNoEstablishedValidUpto) {
					fd.append('pcbRegNoEstablishedValidUpto', state.signupData.pcbRegNoEstablishedValidUpto);
				}
				if (state.signupData.pcbRegNoOperate) {
					fd.append('pcbRegNoOperate', state.signupData.pcbRegNoOperate);
				}
				if (state.signupData.pcbRegNoOperateDoi) {
					fd.append('pcbRegNoOperateDoi', state.signupData.pcbRegNoOperateDoi);
				}
				if (state.signupData.pcbRegNoOperateValidUpto) {
					fd.append('pcbRegNoOperateValidUpto', state.signupData.pcbRegNoOperateValidUpto);
				}
				if (state.signupData.bankName) {
					fd.append('bankName', state.signupData.bankName);
				}
				if (state.signupData.otherBankName) {
					fd.append('otherBankName', state.signupData.otherBankName);
				}
				if (state.signupData.bankAccountName) {
					fd.append('bankAccountName', state.signupData.bankAccountName);
				}
				if (state.signupData.accountNumber) {
					fd.append('accountNumber', state.signupData.accountNumber);
				}
				if (state.signupData.ifsc) {
					fd.append('ifsc', state.signupData.ifsc);
				}
				if (state.signupData.poaFirstName) {
					fd.append('poaFirstName', state.signupData.poaFirstName);
				}
				if (state.signupData.poaLastName) {
					fd.append('poaLastName', state.signupData.poaLastName);
				}
				if (state.signupData.poaFatherName) {
					fd.append('poaFatherName', state.signupData.poaFatherName);
				}
				if (state.signupData.poaDob) {
					fd.append('poaDob', state.signupData.poaDob);
				}
				if (state.signupData.poaGender) {
					fd.append('poaGender', state.signupData.poaGender);
				}
				if (state.signupData.poaCategory) {
					fd.append('poaCategory', state.signupData.poaCategory);
				}

				if (state.signupData.panUpload) {
					if ($("#panUpload")[0].files[0].size / 1024 < 513)
						fd.append('panUpload', state.signupData.panUpload);
					else {
						alert("PAN Card File size should not exceed 500KB");
						return false;
					}
					
				} else {
					if (state.signupData.firmConstitution != null && state.signupData.firmConstitution != ''
						&& state.signupData.firmConstitution != 'Proprietorship' && state.signupData.panUploadId == null) {
						if (language == 'en_US') {
							alert("Please Upload PAN.");
						} else if (language == 'hi_IN') {
							alert("कृपया पैन अपलोड करें।");
						}
						return false;
					} else if (state.signupData.firmConstitution != null && state.signupData.firmConstitution != ''
						&& state.signupData.firmConstitution == 'Proprietorship') {
						fd.append('panUploadId', state.signupData.panUploadId);
					}
				}
				if (state.signupData.tanUpload && state.signupData.firmConstitution != 'Proprietorship') {
					if ($("#tanUpload")[0].files[0].size / 1024 < 513)
						fd.append('tanUpload', state.signupData.tanUpload);
					else {
						alert("TAN No. File size should not exceed 500KB");
						return false;
					}
					
				}
				
				if (state.signupData.proofOfIdentityUpload) {
					if ($("#proofOfIdentityUpload")[0].files[0].size < 5242880)
						fd.append('proofOfIdentityUpload', state.signupData.proofOfIdentityUpload);
					else {
						alert("Proof of Identity File size should not exceed 5MB");
						return false;
					}
					
					
				} else {
					if (
						 state.signupData.firmConstitution != 'Proprietorship' && state.signupData.proofOfIdentityUploadId == null) {
						if (language == 'en_US') {
							alert("Please upload Proof of Identity.");
						} else if (language == 'hi_IN') {
							alert("कृपया पहचान का प्रमाण अपलोड करें।");
						}
						return false;
					}
				}
				if (state.signupData.proofOfAddressUpload) {
					if ($("#proofOfAddressUpload")[0].files[0].size / 1024 < 513)
						fd.append('proofOfAddressUpload', state.signupData.proofOfAddressUpload);
					else {
						alert("Proof of Address File size should not exceed 500KB");
						return false;
					}
					
				} 
				if (state.signupData.categoryUpload) {
					if ($("#categoryUpload")[0].files[0].size < 5242880)
						fd.append('categoryUpload', state.signupData.categoryUpload);
					else {
						alert("Caste Certifcate File size should not exceed 5MB");
						return false;
					}

					
				}
				if (state.signupData.deedUpload) {
					if ($("#deedUpload")[0].files[0].size < 5242880)
						fd.append('deedUpload', state.signupData.deedUpload);
					else {
						alert("Partnership Deed File size should not exceed 5MB");
						return false;
					}
					
				} else {
					if (state.signupData.firmConstitution != null && state.signupData.firmConstitution != ''
						&& state.signupData.firmConstitution != 'Proprietorship' && state.signupData.deedUploadId == null) {
						if (language == 'en_US') {
							alert("Please upload Deed.");
						} else if (language == 'hi_IN') {
							alert("कृपया डीड अपलोड करें।");
						}
						return false;
					}
				}
				if (state.signupData.hasUdyam && !state.signupData.udyamUpload && !state.signupData.udyamUploadId) {
					if (language == 'en_US') {
						alert("Please upload the Udyam Registration document.");
					} else if (language == 'hi_IN') {
						alert("कृपया उद्यम पंजीकरण दस्तावेज़ अपलोड करें।");
					}
					return;
				}
				if (state.signupData.udyamUpload) {
					if ($("#udyamUpload")[0].files[0].size < 2097152)
						fd.append('udyamUpload', state.signupData.udyamUpload);
					else {
						alert("Udyam Resgistration No. File size should not exceed 2MB");
						return false;
					}
					

				}
				if (state.signupData.factoryUpload) {
					if ($("#factoryUpload")[0].files[0].size < 2097152)
						fd.append('factoryUpload', state.signupData.factoryUpload);
					else {
						alert("Factory Act License No. File size should not exceed 2MB");
						return false;
					}
					
				}
				
				if (state.signupData.gstUpload) {
					if ($("#gstUpload")[0].files[0].size < 2097152)
						fd.append('gstUpload', state.signupData.gstUpload);
					else {
						alert("GST No. File size should not exceed 2MB");
						return false;
					}
					
				} else {
		
					
				}
				if (state.signupData.cinUpload) {
					if ($("#cinUpload")[0].files[0].size < 2097152)
						fd.append('cinUpload', state.signupData.cinUpload);
					else {
						alert("CIN upload File size should not exceed 2MB");
						return false;
					}
					
				} else {
					if ((state.signupData.firmConstitution == 'Private' || state.signupData.firmConstitution == 'Public' || state.signupData.firmConstitution == 'One Person') && state.signupData.cinUploadId == null) {
						if (language == 'en_US') {
							alert("Please upload CIN.");
						} else if (language == 'hi_IN') {
							alert("कृपया सीआईएन अपलोड करें।");
						}
						return false;
					}
				}
				if (state.signupData.pcbEstUpload) {
					if ($("#pcbEstUpload")[0].files[0].size < 5242880)
						fd.append('pcbEstUpload', state.signupData.pcbEstUpload);
					else {
						alert("Pollution control board Registration Number for consent to Established Upload File size should not exceed 5MB");
						return false;
					}
					
				}
				
				if (state.signupData.pcbOperateUpload) {
					if ($("#pcbOperateUpload")[0].files[0].size < 5242880)
						fd.append('pcbOperateUpload', state.signupData.pcbOperateUpload);
					else {
						alert("Pollution control board Registration Number for consent to Operate Upload File size should not exceed 5MB");
						return false;
					}
					
				}
				
				if (state.signupData.aoaUpload) {
					if ($("#aoaUpload")[0].files[0].size < 5242880)
						fd.append('aoaUpload', state.signupData.aoaUpload);
					else {
						alert("Article of Association Upload File size should not exceed 5MB");
						return false;
					}
					
				} else {
					if ((state.signupData.firmConstitution == 'Private' || state.signupData.firmConstitution == 'Public' || state.signupData.firmConstitution == 'One Person') && state.signupData.aoaUploadId == null) {
						if (language == 'en_US') {
							alert("Please upload Article of Association.");
						} else if (language == 'hi_IN') {
							alert("कृपया एसोसिएशन का लेख अपलोड करें");
						}
						return false;
					}
				}
				if (state.signupData.moaUpload) {
					if ($("#moaUpload")[0].files[0].size < 5242880)
						fd.append('moaUpload', state.signupData.moaUpload);
					else {
						alert("Memorandum of Association Upload File size should not exceed 5MB");
						return false;
					}
					
				} else {
					if ((state.signupData.firmConstitution == 'Private' || state.signupData.firmConstitution == 'Public' || state.signupData.firmConstitution == 'One Person') && state.signupData.moaUploadId == null) {
						if (language == 'en_US') {
							alert("Please upload Memorandum of Association.");
						} else if (language == 'hi_IN') {
							alert("कृपया मेमोरेंडम ऑफ एसोसिएशन अपलोड करें।");
						}
						return false;
					}
				}
				if (state.signupData.cancelledChequeUpload) {
					if ($("#cancelledChequeUpload")[0].files[0].size / 1024 < 513)
						fd.append('cancelledChequeUpload', state.signupData.cancelledChequeUpload);
					else {
						alert("Cancelled Cheque/Bank Passbook Upload  File size should not exceed 500KB");
						return false;
					}
					
				} else {
					if (state.signupData.cancelledChequeUploadId == null) {
						if (language == 'en_US') {
							alert("Please Upload Cancelled Cheque/Bank Passbook.");
						} else if (language == 'hi_IN') {
							alert("कृपया रद्द चेक/बैंक पासबुक अपलोड करें।");
						}
						return false;
					}
				}
				if (state.signupData.specimenSignUpload) {
					if ($("#specimenSignUpload")[0].files[0].size / 1024 < 513)
						fd.append('specimenSignUpload', state.signupData.specimenSignUpload);
					else {
						alert("Speciman Signature File size should not exceed 500KB");
						return false;
					}
					
				} else {
					if (state.signupData.specimenSignUploadId == null) {
						if (language == 'en_US') {
							alert("Please Upload specimen signature.");
						} else if (language == 'hi_IN') {
							alert("कृपया नमूना हस्ताक्षर अपलोड करें।");
						}
						return false;
					}
				}


				loading.start('sample-1');

				var responsePromise = request.post('updateUserIndustrialProfile', fd, {
					transformRequest: identity,
					headers: {
						'Content-Type': undefined
					}
				});

				responsePromise
					.success(function(data, status, headers, config) {
						state.responseObject = data;
						if (state.responseObject.successMessage != null) {
							if (null != state.signupData.industrialPartnerslist && state.signupData.industrialPartnerslist.length > 0) {
								var industrialProfileBean = {};
								industrialProfileBean.userId = state.signupData.userId;
								industrialProfileBean.industrialPartnerslist = state.signupData.industrialPartnerslist;
								var responsePromise1 = request.post('updateUserIndustrialProfilePartners', industrialProfileBean);
								responsePromise1.success(function(data, status, headers, config) {
									
									if (null != state.signupData.regNocList && state.signupData.regNocList.length > 0) {
										var industrialProfileBean1 = {};
										industrialProfileBean1.userId = state.signupData.userId;
										industrialProfileBean1.regNocList = state.signupData.regNocList;
										var responsePromise2 = request.post('updateUserIndustrialRegNocList', industrialProfileBean1);
										responsePromise2.success(function(data, status, headers, config) {
											
											loading.finish('sample-1');
											state.disabled = true;
											if (language == 'en_US') {
												alert("User's Industrial Profile Updated successfully.");
												
											} else if (language == 'hi_IN') {
												alert("उपयोगकर्ता का औद्योगिक प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया।");
											}
										});
									} else {
										loading.finish('sample-1');
										state.disabled = true;
										if (language == 'en_US') {
											alert("User's Industrial Profile Updated successfully.");
										} else if (language == 'hi_IN') {
											alert("उपयोगकर्ता का औद्योगिक प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया।");
										}
									}
								});
							} else {
								var industrialProfileBean1 = {};
								industrialProfileBean1.userId = state.signupData.userId;
								if (null != state.signupData.regNocList && state.signupData.regNocList.length > 0) {
									industrialProfileBean1.regNocList = state.signupData.regNocList;
									var responsePromise2 = request.post('updateUserIndustrialRegNocList', industrialProfileBean1);
									responsePromise2.success(function(data, status, headers, config) {
										
										loading.finish('sample-1');
										state.disabled = true;
										if (language == 'en_US') {
											alert("User's Industrial Profile Updated successfully.");
										} else if (language == 'hi_IN') {
											alert("उपयोगकर्ता का औद्योगिक प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया।");
										}
									});
								} else {
									loading.finish('sample-1');
									state.disabled = true;
									if (language == 'en_US') {
										alert("User's Industrial Profile Updated successfully.");
									} else if (language == 'hi_IN') {
										alert("उपयोगकर्ता का औद्योगिक प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया।");
									}
								}
							}
							state.loadUserIndustrialDetails();
						} else {
							alert("Please check the Validation/Error on Page.");
							loading.finish('sample-1');
						}
					});
			};
state.loadDashboardData = function() {
						loading.start('sample-1');
						var responseOffice = request.get('fetchHoCount');
						responseOffice.success(function(data, status, headers,config) {
							state.hoCount = data;
							animateCounter("hoCount",data);
							loading.finish('sample-1');
						});
						
						loading.start('sample-2');
						var responseOffice = request.get('fetchZonalCount');
						responseOffice.success(function(data, status, headers,config) {
							state.zonalCount = data;
							animateCounter("zonalCount",data);
							loading.finish('sample-2');
						});
						
						loading.start('sample-3');
						var responseOffice = request.get('fetchDTICCount');
						responseOffice.success(function(data, status, headers,config) {
							state.dticCount = data;
							animateCounter("dticCount",data);
							loading.finish('sample-3');
						});
						
						loading.start('sample-4');
						var responseOffice = request.get('fetchOfficerCount');
						responseOffice.success(function(data, status, headers,config) {
							state.officerCount = data;
							animateCounter("officerCount",data);
							loading.finish('sample-4');
						});									
					};
state.loadHoList = function() {
						loading.start('sample-1');
						fetchHo();
					};
state.loadofficerList = function() {
						loading.start('sample-1');
						fetchOfficer();
					};
state.loadzonalList = function() {
						loading.start('sample-1');
						fetchZonal();
					};
state.loaddticList = function() {
						loading.start('sample-1');
						fetchDtic();
					};
state.loadapplicantList = function() {
						loading.start('sample-1');
						fetchApplicant();
					};
state.loadUserDetails2 = function() {
						state.disabled = true;

						loading.start('sample-1');

						var responsePromise = request.get('fetchUserDetails', {
							params : {
								'userId' : params.userId
							}
						});
						responsePromise
								.success(function(data, status, headers, config) {
									state.signupData = data;
									state.signupData.password='';
									
									loading.finish('sample-1');
								});
					};
state.fetchOfficeAddDetailsByOfficeId = function(
							officeLocationId) {
						loading.start('sample-1');
						if (null != officeLocationId) {
							var responseOffice = request.get(
									'fetchofficeaddresssbyofficeid', {
										params : {
											'officeId' : officeLocationId
										}
									});
							responseOffice.success(function(data, status,
									headers, config) {
								state.respondentOffices = data;
							});
						}
						loading.finish('sample-1');
					};
state.fetchAllStates = function() {
						var responseStates = request.get('fetchallstates');
						responseStates.success(function(data, status, headers,
								config) {
							state.respondentStates = data;
						});
					};
state.fetchAllOffices = function() {
						var responseOffice = request
								.get('fetchallofficesforofficer');
						responseOffice.success(function(data, status, headers,
								config) {
							state.respondentOfficeslist = data;
						});
					};
state.loadStatusforadd = function() {
						loading.start('sample-1');
						var responseStatus = request
								.get('fetchmasteruserstatusmap');
						responseStatus.success(function(data, status, headers,
								config) {
							state.statusList = data;
							loading.finish('sample-1');
						});
					};
state.loadGroup = function() {
						loading.start('sample-1');

						var responsePromise = request.get('fetchusergroupsmap');
						responsePromise.success(function(data, status, headers,
								config) {
							state.groupList = data;
							loading.finish('sample-1');
						});

					};
state.loadGroupforadd = function() {
						loading.start('sample-1');

						var responsePromise = request.get('fetchusergroupsmap');
						responsePromise.success(function(data, status, headers,
								config) {
							state.groupList = data;
							loading.finish('sample-1');
						});

					};
state.loadDesignationforadd = function() {
						loading.start('sample-1');
						var responseStatus = request.get('fetchdesignationmap');
						responseStatus.success(function(data, status, headers,
								config) {
							state.designationList = data;
							loading.finish('sample-1');
						});
					};
state.updateHo = function(isValid) {
						if (!isValid) {
							return false;
						}

						var fd = new FormData();

						fd.append('userId', params.userId);

						if (state.signupData.firstName) {
							fd.append('firstName', state.signupData.firstName);
						}

						if (state.signupData.middleName) {
							fd.append('middleName',
									state.signupData.middleName);
						}

						if (state.signupData.lastName) {
							fd.append('lastName', state.signupData.lastName);
						}

						if (state.signupData.emailId) {
							fd.append('emailId', state.signupData.emailId);
						}

						if (state.signupData.mobileNumber) {
							fd.append('mobileNumber',
									state.signupData.mobileNumber);
						}

						if (state.signupData.aadhaarNumber) {
							fd.append('aadhaarNumber',
									state.signupData.aadhaarNumber);
						}

						if (state.signupData.telephoneNumber) {
							fd.append('telephoneNumber',
									state.signupData.telephoneNumber);
						}

						if (state.signupData.genderId) {
							fd.append('genderId', state.signupData.genderId);
						}

						if (state.signupData.statusId) {
							fd.append('statusId', state.signupData.statusId);
						}

						if (state.signupData.address1) {
							fd.append('address1', state.signupData.address1);
						}

						if (state.signupData.address2) {
							fd.append('address2', state.signupData.address2);
						}

						if (state.signupData.address3) {
							fd.append('address3', state.signupData.address3);
						}

						if (state.signupData.districtId) {
							fd.append('districtId', state.signupData.districtId);
						}

						if (state.signupData.tehsilId) {
							fd.append('tehsilId', state.signupData.tehsilId);
						}

						if (state.signupData.pinCode) {
							fd.append('pinCode', state.signupData.pinCode);
						}

						if (state.signupData.permanentAddress1) {
							fd.append('permanentAddress1',
									state.signupData.permanentAddress1);
						}

						if (state.signupData.permanentAddress2) {
							fd.append('permanentAddress2',
									state.signupData.permanentAddress2);
						}

						if (state.signupData.permanentAddress3) {
							fd.append('permanentAddress3',
									state.signupData.permanentAddress3);
						}

						if (state.signupData.permanentDistrictId) {
							fd.append('permanentDistrictId',
									state.signupData.permanentDistrictId);
						}

						if (state.signupData.permanentTehsilId) {
							fd.append('permanentTehsilId',
									state.signupData.permanentTehsilId);
						}

						if (state.signupData.permanentPinCode) {
							fd.append('permanentPinCode',
									state.signupData.permanentPinCode);
						}

						

						loading.start('sample-1');

						var responsePromise = request.post('updateUser', fd, {
							transformRequest : identity,
							headers : {
								'Content-Type' : undefined
							}
						});

						responsePromise
								.success(function(data, status, headers, config) {
									state.responseObject = data;
									later(
											function() {
												state.responseObject.errorMessage = null;
											}, 5000);
									if (state.responseObject.successMessage != null) {
										later(
												function() {
													state.responseObject.successMessage = null;
												}, 5000);
										navigation.location.href = '#/hoList';
									}
									loading.finish('sample-1');
								});
					};
state.updateOfficer = function(isValid) {
						if (!isValid) {
							return false;
						}

						var fd = new FormData();

						fd.append('userId', params.userId);

						if (state.signupData.firstName) {
							fd.append('firstName', state.signupData.firstName);
						}

						if (state.signupData.middleName) {
							fd.append('middleName',
									state.signupData.middleName);
						}

						if (state.signupData.lastName) {
							fd.append('lastName', state.signupData.lastName);
						}

						if (state.signupData.emailId) {
							fd.append('emailId', state.signupData.emailId);
						}

						if (state.signupData.mobileNumber) {
							fd.append('mobileNumber',
									state.signupData.mobileNumber);
						}

						if (state.signupData.aadhaarNumber) {
							fd.append('aadhaarNumber',
									state.signupData.aadhaarNumber);
						}

						if (state.signupData.telephoneNumber) {
							fd.append('telephoneNumber',
									state.signupData.telephoneNumber);
						}

						if (state.signupData.genderId) {
							fd.append('genderId', state.signupData.genderId);
						}

						if (state.signupData.statusId) {
							fd.append('statusId', state.signupData.statusId);
						}

						if (state.signupData.designationCode) {
							fd.append('designation',
									state.signupData.designationCode);
						}

						if (state.signupData.address1) {
							fd.append('address1', state.signupData.address1);
						}

						if (state.signupData.address2) {
							fd.append('address2', state.signupData.address2);
						}

						if (state.signupData.address3) {
							fd.append('address3', state.signupData.address3);
						}

						if (state.signupData.districtId) {
							fd.append('districtId', state.signupData.districtId);
						}

						if (state.signupData.tehsilId) {
							fd.append('tehsilId', state.signupData.tehsilId);
						}

						if (state.signupData.pinCode) {
							fd.append('pinCode', state.signupData.pinCode);
						}

						if (state.signupData.permanentAddress1) {
							fd.append('permanentAddress1',
									state.signupData.permanentAddress1);
						}

						if (state.signupData.permanentAddress2) {
							fd.append('permanentAddress2',
									state.signupData.permanentAddress2);
						}

						if (state.signupData.permanentAddress3) {
							fd.append('permanentAddress3',
									state.signupData.permanentAddress3);
						}

						if (state.signupData.permanentDistrictId) {
							fd.append('permanentDistrictId',
									state.signupData.permanentDistrictId);
						}

						if (state.signupData.permanentTehsilId) {
							fd.append('permanentTehsilId',
									state.signupData.permanentTehsilId);
						}

						if (state.signupData.permanentPinCode) {
							fd.append('permanentPinCode',
									state.signupData.permanentPinCode);
						}

						if (state.signupData.officeLocationId) {
							fd.append('officeLocationId',
									state.signupData.officeLocationId);
						}

						loading.start('sample-1');

						var responsePromise = request.post('updateUser', fd, {
							transformRequest : identity,
							headers : {
								'Content-Type' : undefined
							}
						});

						responsePromise
								.success(function(data, status, headers, config) {
									state.responseObject = data;
									later(
											function() {
												state.responseObject.errorMessage = null;
											}, 5000);
									if (state.responseObject.successMessage != null) {
										later(
												function() {
													state.responseObject.successMessage = null;
												}, 5000);
										navigation.location.href = '#/officerList';
									}
									loading.finish('sample-1');
								});
					};
state.insertOfficer = function(isValid) {

						if (!isValid) {
							return false;
						}
						loading.start('sample-1');
						var responsePromise = request.post('insertOfficer',
								state.signupData);

						responsePromise
								.success(function(data, status, headers, config) {
									state.responseObject = data;
									later(
											function() {
												state.responseObject.errorMessage = null;
											}, 5000);
									if (state.responseObject.successMessage != null) {
										later(
												function() {
													state.responseObject.successMessage = null;
												}, 5000);
										navigation.location.href = '#/officerList';
									}
									loading.finish('sample-1');
								});
						
					};
state.updateZonal = function(isValid) {
						if (!isValid) {
							return false;
						}

						var fd = new FormData();

						fd.append('userId', params.userId);

						if (state.signupData.firstName) {
							fd.append('firstName', state.signupData.firstName);
						}

						if (state.signupData.middleName) {
							fd.append('middleName',
									state.signupData.middleName);
						}

						if (state.signupData.lastName) {
							fd.append('lastName', state.signupData.lastName);
						}

						if (state.signupData.emailId) {
							fd.append('emailId', state.signupData.emailId);
						}

						if (state.signupData.mobileNumber) {
							fd.append('mobileNumber',
									state.signupData.mobileNumber);
						}

						if (state.signupData.aadhaarNumber) {
							fd.append('aadhaarNumber',
									state.signupData.aadhaarNumber);
						}

						if (state.signupData.telephoneNumber) {
							fd.append('telephoneNumber',
									state.signupData.telephoneNumber);
						}

						if (state.signupData.genderId) {
							fd.append('genderId', state.signupData.genderId);
						}

						if (state.signupData.statusId) {
							fd.append('statusId', state.signupData.statusId);
						}

						if (state.signupData.address1) {
							fd.append('address1', state.signupData.address1);
						}

						if (state.signupData.address2) {
							fd.append('address2', state.signupData.address2);
						}

						if (state.signupData.address3) {
							fd.append('address3', state.signupData.address3);
						}

						if (state.signupData.districtId) {
							fd.append('districtId', state.signupData.districtId);
						}

						if (state.signupData.tehsilId) {
							fd.append('tehsilId', state.signupData.tehsilId);
						}

						if (state.signupData.pinCode) {
							fd.append('pinCode', state.signupData.pinCode);
						}

						if (state.signupData.permanentAddress1) {
							fd.append('permanentAddress1',
									state.signupData.permanentAddress1);
						}

						if (state.signupData.permanentAddress2) {
							fd.append('permanentAddress2',
									state.signupData.permanentAddress2);
						}

						if (state.signupData.permanentAddress3) {
							fd.append('permanentAddress3',
									state.signupData.permanentAddress3);
						}

						if (state.signupData.permanentDistrictId) {
							fd.append('permanentDistrictId',
									state.signupData.permanentDistrictId);
						}

						if (state.signupData.permanentTehsilId) {
							fd.append('permanentTehsilId',
									state.signupData.permanentTehsilId);
						}

						if (state.signupData.permanentPinCode) {
							fd.append('permanentPinCode',
									state.signupData.permanentPinCode);
						}

						if (state.signupData.officeLocationId) {
							fd.append('officeLocationId',
									state.signupData.officeLocationId);
						}

						loading.start('sample-1');

						var responsePromise = request.post('updateUser', fd, {
							transformRequest : identity,
							headers : {
								'Content-Type' : undefined
							}
						});

						responsePromise
								.success(function(data, status, headers, config) {
									state.responseObject = data;
									later(
											function() {
												state.responseObject.errorMessage = null;
											}, 5000);
									if (state.responseObject.successMessage != null) {
										later(
												function() {
													state.responseObject.successMessage = null;
												}, 5000);
										navigation.location.href = '#/zonalList';
									}
									loading.finish('sample-1');
								});
					};
state.updateDtic = function(isValid) {
						if (!isValid) {
							return false;
						}

						var fd = new FormData();

						fd.append('userId', params.userId);

						if (state.signupData.firstName) {
							fd.append('firstName', state.signupData.firstName);
						}

						if (state.signupData.middleName) {
							fd.append('middleName',
									state.signupData.middleName);
						}

						if (state.signupData.lastName) {
							fd.append('lastName', state.signupData.lastName);
						}

						if (state.signupData.emailId) {
							fd.append('emailId', state.signupData.emailId);
						}

						if (state.signupData.mobileNumber) {
							fd.append('mobileNumber',
									state.signupData.mobileNumber);
						}

						if (state.signupData.aadhaarNumber) {
							fd.append('aadhaarNumber',
									state.signupData.aadhaarNumber);
						}

						if (state.signupData.telephoneNumber) {
							fd.append('telephoneNumber',
									state.signupData.telephoneNumber);
						}

						if (state.signupData.genderId) {
							fd.append('genderId', state.signupData.genderId);
						}
						
						if (state.signupData.allocatedTehsilId) {
							fd.append('allocatedTehsilId', state.signupData.allocatedTehsilId);
						}

						if (state.signupData.statusId) {
							fd.append('statusId', state.signupData.statusId);
						}

						if (state.signupData.address1) {
							fd.append('address1', state.signupData.address1);
						}

						if (state.signupData.address2) {
							fd.append('address2', state.signupData.address2);
						}

						if (state.signupData.address3) {
							fd.append('address3', state.signupData.address3);
						}

						if (state.signupData.districtId) {
							fd.append('districtId', state.signupData.districtId);
						}

						if (state.signupData.tehsilId) {
							fd.append('tehsilId', state.signupData.tehsilId);
						}

						if (state.signupData.pinCode) {
							fd.append('pinCode', state.signupData.pinCode);
						}

						if (state.signupData.permanentAddress1) {
							fd.append('permanentAddress1',
									state.signupData.permanentAddress1);
						}

						if (state.signupData.permanentAddress2) {
							fd.append('permanentAddress2',
									state.signupData.permanentAddress2);
						}

						if (state.signupData.permanentAddress3) {
							fd.append('permanentAddress3',
									state.signupData.permanentAddress3);
						}

						if (state.signupData.permanentDistrictId) {
							fd.append('permanentDistrictId',
									state.signupData.permanentDistrictId);
						}

						if (state.signupData.permanentTehsilId) {
							fd.append('permanentTehsilId',
									state.signupData.permanentTehsilId);
						}

						if (state.signupData.permanentPinCode) {
							fd.append('permanentPinCode',
									state.signupData.permanentPinCode);
						}

						if (state.signupData.officeLocationId) {
							fd.append('officeLocationId',
									state.signupData.officeLocationId);
						}

						loading.start('sample-1');

						var responsePromise = request.post('updateUser', fd, {
							transformRequest : identity,
							headers : {
								'Content-Type' : undefined
							}
						});

						responsePromise
								.success(function(data, status, headers, config) {
									state.responseObject = data;
									later(
											function() {
												state.responseObject.errorMessage = null;
											}, 5000);
									if (state.responseObject.successMessage != null) {
										later(
												function() {
													state.responseObject.successMessage = null;
												}, 5000);
										navigation.location.href = '#/dticList';
									}
									loading.finish('sample-1');
								});
					};
state.updateApplicant = function(isValid) {
						if (!isValid) {
							return false;
						}

						var fd = new FormData();

						fd.append('userId', params.userId);
						fd.append('officeLocationId', '0');
						if (state.signupData.firstName) {
							fd.append('firstName', state.signupData.firstName);
						}

						if (state.signupData.middleName) {
							fd.append('middleName',
									state.signupData.middleName);
						}

						if (state.signupData.lastName) {
							fd.append('lastName', state.signupData.lastName);
						}

						if (state.signupData.emailId) {
							fd.append('emailId', state.signupData.emailId);
						}

						if (state.signupData.mobileNumber) {
							fd.append('mobileNumber',
									state.signupData.mobileNumber);
						}

						if (state.signupData.aadhaarNumber) {
							fd.append('aadhaarNumber',
									state.signupData.aadhaarNumber);
						}

						if (state.signupData.telephoneNumber) {
							fd.append('telephoneNumber',
									state.signupData.telephoneNumber);
						}

						if (state.signupData.genderId) {
							fd.append('genderId', state.signupData.genderId);
						}

						if (state.signupData.statusId) {
							fd.append('statusId', state.signupData.statusId);
						}

						if (state.signupData.address1) {
							fd.append('address1', state.signupData.address1);
						}

						if (state.signupData.address2) {
							fd.append('address2', state.signupData.address2);
						}

						if (state.signupData.address3) {
							fd.append('address3', state.signupData.address3);
						}

						if (state.signupData.districtId) {
							fd.append('districtId', state.signupData.districtId);
						}

						if (state.signupData.tehsilId) {
							fd.append('tehsilId', state.signupData.tehsilId);
						}

						if (state.signupData.pinCode) {
							fd.append('pinCode', state.signupData.pinCode);
						}

						if (state.signupData.permanentAddress1) {
							fd.append('permanentAddress1',
									state.signupData.permanentAddress1);
						}

						if (state.signupData.permanentAddress2) {
							fd.append('permanentAddress2',
									state.signupData.permanentAddress2);
						}

						if (state.signupData.permanentAddress3) {
							fd.append('permanentAddress3',
									state.signupData.permanentAddress3);
						}

						if (state.signupData.permanentDistrictId) {
							fd.append('permanentDistrictId',
									state.signupData.permanentDistrictId);
						}

						if (state.signupData.permanentTehsilId) {
							fd.append('permanentTehsilId',
									state.signupData.permanentTehsilId);
						} 

						if (state.signupData.permanentPinCode) {
							fd.append('permanentPinCode',
									state.signupData.permanentPinCode);
						}

						loading.start('sample-1');

						var responsePromise = request.post('updateUser', fd, {
							transformRequest : identity,
							headers : {
								'Content-Type' : undefined
							}
						});

						responsePromise
								.success(function(data, status, headers, config) {
									state.responseObject = data;
									later(
											function() {
												state.responseObject.errorMessage = null;
											}, 5000);
									if (state.responseObject.successMessage != null) {
										later(
												function() {
													state.responseObject.successMessage = null;
												}, 5000);
										navigation.location.href = '#/applicantList';
									}
									loading.finish('sample-1');
								});
					};
state.changePassword = function(isValid) {

						if (!isValid || state.weakPassword) {
							return false;
						}

						if (state.signupData.password != state.signupData.confirmPassword) {
							state.IsMatch = true;
							return false;
						}
						state.IsMatch = false;

						var fd = new FormData();

						fd.append('userId', params.userId);

						if (state.signupData.password) {
							fd.append('password', state.signupData.password);
						}

						if (state.signupData.mobileNumber) {
							fd.append('mobileNumber',
									state.signupData.mobileNumber);
						}

						if (state.signupData.emailId) {
							fd.append('emailId', state.signupData.emailId);
						}

						loading.start('sample-1');

						var responsePromise = request.post(
								'updatePasswordByAdmin', fd, {
									transformRequest : identity,
									headers : {
										'Content-Type' : undefined
									}
								});

						responsePromise
								.success(function(data, status, headers, config) {
									state.responseObject = data;
									if (state.responseObject.successMessage != null) {
										later(
												function() {
													state.responseObject.successMessage = null;
												}, 5000);

										switch (params.userType) {
										case 'ho':
											navigation.location.href = '#/hoList';
											break;
										case 'officer':
											navigation.location.href = '#/officerList';
											break;
										case 'externalOfficer':
											navigation.location.href = '#/externalOfficerList';
											break;
										case 'zonal':
											navigation.location.href = '#/zonalList';
											break;
										case 'dtic':
											navigation.location.href = '#/dticList';
											break;
										case 'applicant':
											navigation.location.href = '#/applicantList';
											break;

										default:
											break;
										}										
									}
									loading.finish('sample-1');
								});
					};
state.fetchAllOfficeTypes = function() {					
						var responseStates = request
						.get('fetchallofficestypelist');
						responseStates.success(function(data,
								status, headers, config) {
							state.respondentOfficesTypeList = data;
						});
					};
state.loadofficeList = function() {
						loading.start('sample-1');
						fetchOffice();
					};
state.loadOfficeDetails = function() {
						state.disabled = true;
						
						loading.start('sample-1');
						
						var responsePromise = request.get('fetchOfficeDetails', {
							params : {
								'officeId' : params.officeId
							}
						});
						responsePromise.success(function(data, status, headers,
								config) {
							state.officeData = data;
							state.officeData.officeTypeId = state.officeData.officeTypeId+"";
							
							var responseStates = request
							.get('fetchallofficestypelist');
							responseStates.success(function(data,
									status, headers, config) {
								state.respondentOfficesTypeList = data;
							});
							
							var responseStates = request
							.get('fetchallstates');
							responseStates.success(function(data,
									status, headers, config) {
								state.respondentStates = data;
							});							
							
							if (state.officeData.stateId) {
								var responseDistricts = request
										.get(
												'fetchdistrictmapbystate',
												{
													params : {
														'stateId' : state.officeData.stateId
													}
												});
								responseDistricts.success(function(
										data, status, headers, config) {
									state.districts = data;
								});
							}
							
							if (state.officeData.districtId) {
								var responseDistricts = request
										.get(
												'fetchdistricttehsilmapbydistrictid',
												{
													params : {
														'districtId' : state.officeData.districtId
													}
												});
								responseDistricts.success(function(
										data, status, headers, config) {
									state.tehsils = data;
								});
							}
							
							loading.finish('sample-1');
						});
						
						
						state.updateOffice = function(isValid) {
							if (!isValid) {
								return false;
							}

							var fd = new FormData();

							fd.append('officeId', params.officeId);

							if (state.officeData.officeNameEnglish) {
								fd.append('officeNameEnglish', state.officeData.officeNameEnglish);
							}

							if (state.officeData.officeNameHindi) {
								fd.append('officeNameHindi',
										state.officeData.officeNameHindi);
							}

							if (state.officeData.officeTypeId) {
								fd.append('officeTypeId', state.officeData.officeTypeId);
							}

							if (state.officeData.address1) {
								fd.append('address1', state.officeData.address1);
							}

							if (state.officeData.address2) {
								fd.append('address2',
										state.officeData.address2);
							}

							if (state.officeData.address3) {
								fd.append('address3',
										state.officeData.address3);
							}

							if (state.officeData.stateId) {
								fd.append('stateId',
										state.officeData.stateId);
							}

							if (state.officeData.districtId) {
								fd.append('districtId', state.officeData.districtId);
							}

							if (state.officeData.tehsilId) {
								fd.append('tehsilId', state.officeData.tehsilId);
							}

							if (state.officeData.pincode) {
								fd.append('pincode',
										state.officeData.pincode);
							}

							loading.start('sample-1');

							var responsePromise = request.post('updateOffice', fd, {
								transformRequest : identity,
								headers : {
									'Content-Type' : undefined
								}
							});

							responsePromise
									.success(function(data, status, headers, config) {
										state.responseObject = data;
										later(
												function() {
													state.responseObject.errorMessage = null;
												}, 5000);
										if (state.responseObject.successMessage != null) {
											later(
													function() {
														state.responseObject.successMessage = null;
													}, 5000);
											navigation.location.href = '#/officeList';
										}
										loading.finish('sample-1');
									});
						};
						
					};
state.updateOffice = function(isValid) {
							if (!isValid) {
								return false;
							}

							var fd = new FormData();

							fd.append('officeId', params.officeId);

							if (state.officeData.officeNameEnglish) {
								fd.append('officeNameEnglish', state.officeData.officeNameEnglish);
							}

							if (state.officeData.officeNameHindi) {
								fd.append('officeNameHindi',
										state.officeData.officeNameHindi);
							}

							if (state.officeData.officeTypeId) {
								fd.append('officeTypeId', state.officeData.officeTypeId);
							}

							if (state.officeData.address1) {
								fd.append('address1', state.officeData.address1);
							}

							if (state.officeData.address2) {
								fd.append('address2',
										state.officeData.address2);
							}

							if (state.officeData.address3) {
								fd.append('address3',
										state.officeData.address3);
							}

							if (state.officeData.stateId) {
								fd.append('stateId',
										state.officeData.stateId);
							}

							if (state.officeData.districtId) {
								fd.append('districtId', state.officeData.districtId);
							}

							if (state.officeData.tehsilId) {
								fd.append('tehsilId', state.officeData.tehsilId);
							}

							if (state.officeData.pincode) {
								fd.append('pincode',
										state.officeData.pincode);
							}

							loading.start('sample-1');

							var responsePromise = request.post('updateOffice', fd, {
								transformRequest : identity,
								headers : {
									'Content-Type' : undefined
								}
							});

							responsePromise
									.success(function(data, status, headers, config) {
										state.responseObject = data;
										later(
												function() {
													state.responseObject.errorMessage = null;
												}, 5000);
										if (state.responseObject.successMessage != null) {
											later(
													function() {
														state.responseObject.successMessage = null;
													}, 5000);
											navigation.location.href = '#/officeList';
										}
										loading.finish('sample-1');
									});
						};
state.insertOffice = function(isValid) {

						if (!isValid) {
							return false;
						}
						loading.start('sample-1');
						var responsePromise = request.post('insertOffice',
								state.officeData);

						responsePromise
								.success(function(data, status, headers, config) {
									state.responseObject = data;
									later(
											function() {
												state.responseObject.errorMessage = null;
											}, 5000);
									if (state.responseObject.successMessage != null) {
										later(
												function() {
													state.responseObject.successMessage = null;
												}, 5000);
										navigation.location.href = '#/officeList';
									}
									loading.finish('sample-1');
								});
					};
state.loadSupplierNameListAdmin = function() {
						loading.start('sample-1');
						fetchSupplierNameListAdmin();
					};
state.loadExternalOfficerList = function() {
						loading.start('sample-1');
						fetchExternalOfficer();
					};
state.loadExternalOfficers = function() {
						var responseOffice = request.get('fetchExternalOfficers');
						responseOffice.success(function(data, status, headers, config) {
							state.selectionDropdown = "all";
							state.externalOfficersList = data;
						});
					};
state.loadSupplyNameDetailsAdmin = function() {
						loading.start('sample-1');
						var response = request.get('fetchSupplyNameDetailsAdminById/'+params.id);
						response.success(function(data, status, headers, config) {
							if(null != data) {
								state.supplyNameBean = data;
								state.supplyNameBean.supplyTypeId = state.supplyNameBean.supplyTypeId+"";
								if(null != state.supplyNameBean.districtId) {
									
									var response1 = request
									.get(
											'fetchdistrictmapbystate',
											{
												params : {
													'stateId' : 20
												}
											});

									response1.success(function(data, status, headers,
											config) {
										state.districts = data;
										state.supplyNameBean.districtId = state.supplyNameBean.districtId+"";
										loading.finish('sample-1');
									});
								}
								
							}
						});
						
					};
state.loadSupplyTypes = function() {

						

						var response = request.get('fetchSupplyTypes');

						response.success(function(data, status, headers,
								config) {
							state.supplyTypes = data;
							
						});

					};
state.fetchSupplyTypes = function() {

						loading.start('sample-1');

						var response = request.get('fetchSupplyTypes');

						response.success(function(data, status, headers,
								config) {
							state.supplyTypes = data;
							
						});

					};
state.fetchSupplyTypesForDashboard = function() {

						loading.start('sample-1');

						var response = request.get('fetchSupplyTypes');

						response.success(function(data, status, headers,
								config) {
							state.supplyTypes = data;
							loading.finish('sample-1');
						});

					};
state.assignSupplyNamesBySupplyTypeId = function(ox1DetailsBean) {
						if(ox1DetailsBean.supplyTypeId!=null){
							loading.start('sample-1');
							ox1DetailsBean.supplyNames = state.supplyNames.filter(x => x.id==(ox1DetailsBean.supplyTypeId));
							loading.finish('sample-1');
						}
					};
state.fetchSupplyNames = function() {
						loading.start('sample-1');

						var response = request.get('fetchSupplyNamesBySupplyTypeId?supplyTypeId='+0);

						response.success(function(data, status, headers,
								config) {
							state.supplyNames = data;
							
						});
					};
state.fetchSupplyNamesBySupplyTypeId = function(ox1DetailsBean) {
						if(ox1DetailsBean.supplyTypeId!=null){
							loading.start('sample-1');

							var response = request.get('fetchSupplyNamesBySupplyTypeId?supplyTypeId='+ox1DetailsBean.supplyTypeId);

							response.success(function(data, status, headers,
									config) {
								ox1DetailsBean.supplyNames = data;
								loading.finish('sample-1');
							});
						}
					};
state.fetchSupplyNamesBySupplyTypeIdOrDistrictId = function() {
						if(state.supplyTypeId!=null || state.supplyDistrictId!=null){
							state.supplyNameId=null;
							var supplyTypeId=0;
							if(state.supplyTypeId!=null && state.supplyTypeId!=''){
								supplyTypeId=state.supplyTypeId;
							}
							var districtId=0;
							if(state.supplyDistrictId!=null && state.supplyDistrictId!=''){
								districtId=state.supplyDistrictId;
							}
							loading.start('sample-1');

							var response = request.get('fetchSupplyNamesBySupplyTypeIdOrDistrictId?supplyTypeId='+supplyTypeId+'&districtId='+districtId);

							response.success(function(data, status, headers,
									config) {
								state.supplyNames = data;
								loading.finish('sample-1');
							});
						}
					};
state.fetchSupplyNamesBySupplyTypeIdAdmin = function(ox1DetailsBean) {
						if(ox1DetailsBean.supplyTypeId!=null && null != ox1DetailsBean.createdBy){
							loading.start('sample-1');
							var supply = ox1DetailsBean.supplyTypeId+'~'+ox1DetailsBean.createdBy;
							var response1 = request.get('fetchSupplyNamesBySupplyTypeIdAdmin?supply='+supply);
							
							response1.success(function(data, status, headers,
									config) {
								ox1DetailsBean.supplyNames = data;
								loading.finish('sample-1');
							});
						}
					};
state.assignSupplyNamesBySupplyTypeIdAdmin = function(ox1DetailsBean) {
						
						if(state.supplyNames==null || state.supplyNames.length==0){
							
							loading.start('sample-1');

							var response = request.get('fetchSupplyNamesBySupplyTypeId?supplyTypeId='+0);

							response.success(function(data, status, headers,
									config) {
								state.supplyNames = data;
								
							}).then(function (){
								
								if(ox1DetailsBean.supplyTypeId!=null){
									ox1DetailsBean.supplyNames = state.supplyNames.filter(x => x.id==(ox1DetailsBean.supplyTypeId));
								}
								loading.finish('sample-1');
							})	
						}else{
							loading.start('sample-1');
							if(ox1DetailsBean.supplyTypeId!=null){
								ox1DetailsBean.supplyNames = state.supplyNames.filter(x => x.id==(ox1DetailsBean.supplyTypeId));
							}
							loading.finish('sample-1');
						}
						
					};
state.checkSupplyQty1 = function(ox1Data, ox1Bean, ox1DetailsBean) {
						
						var qty = 0;
				    	each(ox1Bean.ox1DetailsBeans, function(ox1DetailsBean) {
				    		qty = qty + Number((ox1DetailsBean.supplyQty==null)?0:ox1DetailsBean.supplyQty);					
						});
						if(qty > ox1Bean.totalAvailable){
							ox1DetailsBean.supplyQty = "";
							alert("Total Supply quantity should be less than or equal to Total Available quantity.");
						}
						state.calculateTotalQty1(ox1Data.ox1BeanList);
						state.calculateClosingStock1(ox1Bean);
					};
state.checkSupplyQty2 = function(ox2Data, ox2Bean, ox2DetailsBean) {
							
							var qty = 0;
					    	each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
					    		qty = qty + Number((ox2DetailsBean.supplyQty==null)?0:ox2DetailsBean.supplyQty);					
							});
							if(qty > ox2Bean.totalAvailable){
								ox2DetailsBean.supplyQty = "";
								alert("Total Supply quantity should be less than or equal to Total Available quantity.");
							}
							state.calculateTotalQty2(ox2Data.ox2BeanList);
							state.calculateTotalDTypeCyl2(ox2Data.ox2BeanList);
							state.calculateTotalBTypeCyl2(ox2Data.ox2BeanList);
							state.calculateClosingStock2(ox2Bean);
						};
state.setAsNumber1 = function(ox1Bean, ox1DetailsBean) {	
						if(ox1Bean){
							ox1Bean.openingStock = Number(ox1Bean.openingStock); 
							ox1Bean.receivedQty = Number(ox1Bean.receivedQty);
						}
						if(ox1DetailsBean){
							ox1DetailsBean.supplyQty = Number(ox1DetailsBean.supplyQty ? ox1DetailsBean.supplyQty : 0);
						}
				    };
state.setAsNumber2 = function(ox2Bean, ox2DetailsBean) {	
						if(ox2Bean){
							ox2Bean.dtypeClosing = Number(ox2Bean.dtypeClosing);
							ox2Bean.btypeClosing = Number(ox2Bean.btypeClosing);
							ox2Bean.openingStock = Number(ox2Bean.openingStock); 
							ox2Bean.receivedQty = Number(ox2Bean.receivedQty);
						}
						if(ox2DetailsBean){
							ox2DetailsBean.supplyQty = Number(ox2DetailsBean.supplyQty ? ox2DetailsBean.supplyQty : 0);
							ox2DetailsBean.dtype = Number(ox2DetailsBean.dtype ? ox2DetailsBean.dtype : 0);
							ox2DetailsBean.btype = Number(ox2DetailsBean.btype ? ox2DetailsBean.btype : 0);
						}
				    };
state.setAsNumber3 = function(ox3Bean, ox3DetailsBean) {	
						if(ox3Bean){
							ox3Bean.closingStockDType = Number(ox3Bean.closingStockDType);
							ox3Bean.closingStockBType = Number(ox3Bean.closingStockBType);
							ox3Bean.perDayCapacity = Number(ox3Bean.perDayCapacity); 
							ox3Bean.totalOxygenMfg = Number(ox3Bean.totalOxygenMfg);
						}
						if(ox3DetailsBean){
							ox3DetailsBean.dtype = Number(ox3DetailsBean.dtype ? ox3DetailsBean.dtype : 0);
							ox3DetailsBean.btype = Number(ox3DetailsBean.btype ? ox3DetailsBean.btype : 0);
						}
				    };
state.setAsNumber4 = function(ox4Bean, ox4DetailsBean) {	
						if(ox4Bean){
							ox4Bean.dtypeOpening = Number(ox4Bean.dtypeOpening);
							ox4Bean.btypeOpening = Number(ox4Bean.btypeOpening);
							ox4Bean.dtypeReceived = Number(ox4Bean.dtypeReceived); 
							ox4Bean.btypeReceived = Number(ox4Bean.btypeReceived);
						}
						if(ox4DetailsBean){
							ox4DetailsBean.dtype = Number(ox4DetailsBean.dtype ? ox4DetailsBean.dtype : 0);
							ox4DetailsBean.btype = Number(ox4DetailsBean.btype ? ox4DetailsBean.btype : 0);
						}
				    };
state.addEntry = function(list) {			
				    	list.push({});
					};
state.removeEntryOx2ReceivedFrom = function(index, list) {
						list.splice(index, 1);
					};
state.setAsNumber2Qty = function(ox2ReceivedBean) {	
						if(ox2ReceivedBean){
							ox2ReceivedBean.quantity = Number(ox2ReceivedBean.quantity ? ox2ReceivedBean.quantity : 0);
						}
				    };
state.setAsNumber4Qty = function(ox4ReceivedBean) {	
						if(ox4ReceivedBean){
							ox4ReceivedBean.quantityDType = Number(ox4ReceivedBean.quantityDType ? ox4ReceivedBean.quantityDType : 0);
							ox4ReceivedBean.quantityBType = Number(ox4ReceivedBean.quantityBType ? ox4ReceivedBean.quantityBType : 0);
						}
				    };
state.calculateReceivedQtyDType = function(ox4Bean) {
				    	   var receivedQty=0;
				    	   
				    	   each(ox4Bean.ox4ReceivedFromBeans, function(ox4ReceivedFromBean) {
				    		   receivedQty = receivedQty + Number((ox4ReceivedFromBean.quantityDType==null)?0:ox4ReceivedFromBean.quantityDType);					
							});
				    	   ox4Bean.dtypeReceived=receivedQty;
					    };
state.calculateReceivedQty = function(ox2ReceivedFromBean,ox2Bean) {
				    	   var receivedQty=0;
				    	   
				    	   each(ox2Bean.ox2ReceivedFromBeans, function(ox2ReceivedFromBean) {
				    		   receivedQty = receivedQty + Number((ox2ReceivedFromBean.quantity==null)?0:ox2ReceivedFromBean.quantity);					
							});
				    	   ox2Bean.receivedQty=receivedQty.toFixed(3);
					    	state.calculateTotalDTypeCyl2(state.ox2Data.ox2BeanList);
					    };
state.addEntryMain = function(list) {
						var element={};
						element.tankerMgmtSourceBeans=[{}];
						element.tankerMgmtExpDestBeans=[{}];
						element.tankerMgmtActArrBeans=[{}];
				    	list.push(element);
					};
state.removeEntry = function(parentIndex, index, list) {
						list.splice(index, 1);
						state.calculateTotalQty1(state.ox1Data.ox1BeanList);
						state.calculateClosingStock1(state.ox1Data.ox1BeanList[parentIndex]);
					};
state.removeEntryTankerEntryForm = function(index, list) {
						list.splice(index, 1);
					};
state.removeEntryOx2 = function(parentIndex, index, list) {
						list.splice(index, 1);
						state.calculateTotalQty2(state.ox2Data.ox2BeanList);
						state.calculateClosingStock2(state.ox2Data.ox2BeanList[parentIndex]);
					};
state.removeEntryOx3 = function(parentIndex, index, list) {
						list.splice(index, 1);
						state.calculateTotalBTypeCyl3(state.ox3Data.ox3BeanList);
						state.calculateTotalDTypeCyl3Admin(state.ox3Data.ox3BeanList);
					};
state.removeEntryOx4 = function(parentIndex, index, list) {
						list.splice(index, 1);
						state.calculateClosingStockDType(state.ox4Data.ox4BeanList[parentIndex]);
						state.calculateClosingStockBType(state.ox4Data.ox4BeanList[parentIndex]);
						state.calculateTotalDTypeCyl4Admin(state.ox4Data.ox4BeanList);
						state.calculateTotalBTypeCyl4(state.ox4Data.ox4BeanList);
					};
state.checkCurrentDate = function(entryDate) {
						var currentDate = new Date();
						currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
						var parts =entryDate.split('/');
						
						
						var mydate = new Date(parts[2], parts[1] - 1, parts[0]); 
						if (mydate.getTime() == currentDate.getTime()) {
							state.isNotCurrent = false;
						}else{
							
							state.isNotCurrent = false;
						}
					};
state.calculateTotalAvailable1 = function(ox1Bean) {	
				    	
				    	ox1Bean.totalAvailable = (Number(ox1Bean.openingStock) + Number(ox1Bean.receivedQty)).toFixed(3);
				    };
state.calculateClosingStock1 = function(ox1Bean) {	
				    	
				    	var qty = 0;
				    	each(ox1Bean.ox1DetailsBeans, function(ox1DetailsBean) {
				    		qty = qty + Number((ox1DetailsBean.supplyQty==null)?0:ox1DetailsBean.supplyQty);					
						});	
				    	ox1Bean.closingStock = (Number(ox1Bean.totalAvailable) - Number(qty)).toFixed(3);
				    };
state.calculateTotalDTypeCyl3 = function(ox3BeanList) {				
						state.totalDTypeCyl=0;
						each(ox3BeanList, function(ox3Bean) {
							each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
								state.totalDTypeCyl = state.totalDTypeCyl + Number((ox3DetailsBean.dtype==null)?0:ox3DetailsBean.dtype);					
							});				
						});						
				    };
state.calculateTotalBTypeCyl3 = function(ox3BeanList) {				
						state.totalBTypeCyl=0;
						each(ox3BeanList, function(ox3Bean) {
							each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
								state.totalBTypeCyl = state.totalBTypeCyl + Number((ox3DetailsBean.btype==null)?0:ox3DetailsBean.btype);					
							});				
						});						
				    };
state.calculateClosingStockDType = function(ox4Bean) {	
	    	
	    	var dtype = 0;
	    	each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
	    		dtype = dtype + Number((ox4DetailsBean.dtype==null)?0:ox4DetailsBean.dtype);					
			});	
	    	ox4Bean.dtypeClosing = Number(ox4Bean.dtypeOpening) + Number(ox4Bean.dtypeReceived) - Number(dtype);
	    	ox4Bean.closingStockM3 = Number(ox4Bean.dtypeClosing*7) + Number(ox4Bean.btypeClosing*1.5);
	    };
state.calculateClosingStockBType = function(ox4Bean) {	
	    	
	    	var btype = 0;
	    	each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
	    		btype = btype + Number((ox4DetailsBean.btype==null)?0:ox4DetailsBean.btype);					
			});	
	    	ox4Bean.btypeClosing = Number(ox4Bean.btypeOpening) + Number(ox4Bean.btypeReceived) - Number(btype);
	    	ox4Bean.closingStockM3 = Number(ox4Bean.dtypeClosing*7) + Number(ox4Bean.btypeClosing*1.5);
	    };
state.checkDType4 = function(ox4Data, ox4Bean, ox4DetailsBean) {
						
						var dtype = 0;
				    	each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
				    		dtype = dtype + Number((ox4DetailsBean.dtype==null)?0:ox4DetailsBean.dtype);					
						});
						if(dtype > (Number(ox4Bean.dtypeOpening) + Number(ox4Bean.dtypeReceived))){
							ox4DetailsBean.dtype = "";
							alert("Total D Type Cylinders should be less than or equal to Total Available quantity.");
						}
						state.calculateTotalDTypeCyl4(ox4Data.ox4BeanList);
						state.calculateClosingStockDType(ox4Bean);
					};
state.checkBType4 = function(ox4Data, ox4Bean, ox4DetailsBean) {
						
						var btype = 0;
				    	each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
				    		btype = btype + Number((ox4DetailsBean.btype==null)?0:ox4DetailsBean.btype);					
						});
						if(btype > (Number(ox4Bean.btypeOpening) + Number(ox4Bean.btypeReceived))){
							ox4DetailsBean.btype = "";
							alert("Total B Type Cylinders should be less than or equal to Total Available quantity.");
						}
						state.calculateTotalBTypeCyl4(ox4Data.ox4BeanList);
						state.calculateClosingStockBType(ox4Bean);
					};
state.calculateTotalDTypeCyl4 = function(ox4BeanList) {				
						state.totalDTypeCyl=0;
						each(ox4BeanList, function(ox4Bean) {
							each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
								state.totalDTypeCyl = state.totalDTypeCyl + Number((ox4DetailsBean.dtype==null)?0:ox4DetailsBean.dtype);					
							});				
						});						
				    };
state.calculateReceivedQtyBType = function(ox4Bean) {
				    	   var receivedQty=0;
				    	   
				    	   each(ox4Bean.ox4ReceivedFromBeans, function(ox4ReceivedFromBean) {
				    		   receivedQty = receivedQty + Number((ox4ReceivedFromBean.quantityBType==null)?0:ox4ReceivedFromBean.quantityBType);					
							});
				    	   ox4Bean.btypeReceived=receivedQty;
					    };
state.calculateTotalBTypeCyl4 = function(ox4BeanList) {				
						state.totalBTypeCyl=0;
						each(ox4BeanList, function(ox4Bean) {
							each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
								state.totalBTypeCyl = state.totalBTypeCyl + Number((ox4DetailsBean.btype==null)?0:ox4DetailsBean.btype);					
							});				
						});						
				    };
state.saveOX1Form = function(isValid) {

				    	if (!isValid)
				    		return false;

				    	if (confirm("Are you sure you want to save the data?")) {
				    		loading.start('sample-1');
				    		if(null!=document.getElementById("submitBtn"))
								document.getElementById("submitBtn").disabled=true;
				    		var responsePromise = request.post('saveOX1Form', state.ox1Data);

				    		responsePromise
				    		.success(function(data, status, headers, config) {

				    			state.responseObject = data;
				    			if (state.responseObject.successMessage != null) {
				    				later(
				    						function() {
				    							state.responseObject.successMessage = null;
				    						}, 10000);
				    				navigation.location.href = '#editOx1FormAdmin';
				    				if(null!=document.getElementById("submitBtn"))
				    					document.getElementById("submitBtn").disabled=true;
				    				loading.finish('sample-1');
				    			}

				    		});
				    	}

				    };
state.saveOX2Form = function(isValid) {

				    	if (!isValid)
				    		return false;

				    	if (confirm("Are you sure you want to save the data?")) {
				    		loading.start('sample-1');
				    		if(null!=document.getElementById("submitBtn"))
								document.getElementById("submitBtn").disabled=true;
				    		var responsePromise = request.post('saveOX2Form', state.ox2Data);

				    		responsePromise
				    		.success(function(data, status, headers, config) {

				    			state.responseObject = data;
				    			if (state.responseObject.successMessage != null) {
				    				later(
				    						function() {
				    							state.responseObject.successMessage = null;
				    						}, 10000);
				    				navigation.location.href = '#editOx2FormAdmin';
				    				if(null!=document.getElementById("submitBtn"))
				    					document.getElementById("submitBtn").disabled=true;
				    				loading.finish('sample-1');
				    			}

				    		});
				    	}
				    };
state.saveOX3Form = function(isValid) {

						if (!isValid)
							return false;

						if (confirm("Are you sure you want to save the data?")) {
						loading.start('sample-1');
						if(null!=document.getElementById("submitBtn"))
							document.getElementById("submitBtn").disabled=true;
						var responsePromise = request.post('saveOX3Form', state.ox3Data);

						responsePromise
								.success(function(data, status, headers, config) {

									state.responseObject = data;
									if (state.responseObject.successMessage != null) {
										later(
												function() {
													state.responseObject.successMessage = null;
												}, 10000);
										navigation.location.href = '#editOx3FormAdmin';
										if(null!=document.getElementById("submitBtn"))
											document.getElementById("submitBtn").disabled=true;
										loading.finish('sample-1');
									}
									
								});
						}
					};
state.saveOX4Form = function(isValid) {

						if (!isValid)
							return false;

						if (confirm("Are you sure you want to save the data?")) {
							loading.start('sample-1');
							if(null!=document.getElementById("submitBtn"))
								document.getElementById("submitBtn").disabled=true;
							var responsePromise = request.post('saveOX4Form', state.ox4Data);

							responsePromise
							.success(function(data, status, headers, config) {

								state.responseObject = data;
								if (state.responseObject.successMessage != null) {
									later(
											function() {
												state.responseObject.successMessage = null;
											}, 10000);
									navigation.location.href = '#editOx4FormAdmin';
									if(null!=document.getElementById("submitBtn"))
										document.getElementById("submitBtn").disabled=true;
									loading.finish('sample-1');
								}
							});
						}
					};
state.loadSupplierDetailsAdmin = function() {
						loading.start('sample-1');
						var response = request.get('fetchSupplierDetailsByIdAdmin/'+params.id);
						response.success(function(data, status, headers, config) {
							if(null != data) {
								state.supplierInfoData = data;
								state.supplierInfoData.supplierTypeId = state.supplierInfoData.supplierTypeId+"";
								state.supplierInfoData.districtId = state.supplierInfoData.districtId+"";
							}
							loading.finish('sample-1');
						});
					};
state.fetchSupplierTypes1 = function() {

						loading.start('sample-1');

						var response = request.get('fetchSupplierTypes');

						response.success(function(data, status, headers,
								config) {
							state.supplierTypes = data;
							loading.finish('sample-1');
						});

					};
state.fetchOx1FormDetailsAdmin = function() {
						loading.start('sample-1');
						var responsePromise = request.get('fetchOx1FormDetailsAdmin', {params : {'entryDate' : state.ox1Data.entryDate, 'districtId' : state.districtId, 'supplyTypeId' : state.supplyTypeId, 'supplyNameId' : state.supplyNameId, 'supplyDistrictId' : state.supplyDistrictId} });
						responsePromise.success(function(data, status, headers,
								config) {
							state.ox1Data = data;
							
							
							
							loading.finish('sample-1');
						});
					};
state.fetchOx2FormDetailsAdmin = function() {
						loading.start('sample-1');
						var responsePromise = request.get('fetchOx2FormDetailsAdmin', {params : {'entryDate' : state.ox2Data.entryDate, 'districtId' : state.districtId, 'supplyTypeId' : state.supplyTypeId, 'supplyNameId' : state.supplyNameId, 'supplyDistrictId' : state.supplyDistrictId} });
						responsePromise.success(function(data, status, headers,
								config) {
							state.ox2Data = data;
							loading.finish('sample-1');
						});
					};
state.fetchOx3FormDetailsAdmin = function() {
						loading.start('sample-1');
						var responsePromise = request.get('fetchOx3FormDetailsAdmin', {params : {'entryDate' : state.ox3Data.entryDate, 'districtId' : state.districtId, 'supplyTypeId' : state.supplyTypeId, 'supplyNameId' : state.supplyNameId, 'supplyDistrictId' : state.supplyDistrictId} });
						responsePromise.success(function(data, status, headers,
								config) {
							state.ox3Data = data;
							loading.finish('sample-1');
						});
					};
state.exportOx2FormDataList = function() {
						var url = window.location.href;
						
						var arr = url.split('#');
						
						window.location.href = arr[0]+"/../exportOx2FormDataList?entryDate="+state.ox2Data.entryDate+"&districtId="+state.districtId;
					};
state.fetchOx4FormDetailsAdmin = function() {
						loading.start('sample-1');
						var responsePromise = request.get('fetchOx4FormDetailsAdmin', {params : {'entryDate' : state.ox4Data.entryDate, 'districtId' : state.districtId, 'supplyTypeId' : state.supplyTypeId, 'supplyNameId' : state.supplyNameId, 'supplyDistrictId' : state.supplyDistrictId} });
						responsePromise.success(function(data, status, headers,
								config) {
							state.ox4Data = data;
							if(data.ox4BeanList==null){
								
							}
							loading.finish('sample-1');
						});
					};
state.calculateTotalQty1Admin = function(ox1BeanList) {				
						state.totalQty=0;
						state.totalOpeningStock=0;
						state.totalReceived=0;
						state.grandTotalAvailable=0;
						state.totalClosingStock=0;
						each(ox1BeanList, function(ox1Bean) {
							var openingStock=ox1Bean.openingStock;
							if(null!=openingStock){
								state.totalOpeningStock=Number(state.totalOpeningStock)+Number(openingStock);
							}
							var receivedQty=ox1Bean.receivedQty;
							if(null!=receivedQty){
								state.totalReceived=Number(state.totalReceived)+Number(receivedQty);
							}
							var totalAvailable=ox1Bean.totalAvailable;
							if(null!=totalAvailable){
								state.grandTotalAvailable=Number(state.grandTotalAvailable)+Number(totalAvailable);
							}
							var closingStock=ox1Bean.closingStock;
							if(null!=closingStock){
								state.totalClosingStock=Number(state.totalClosingStock)+Number(closingStock);
							}
							each(ox1Bean.ox1DetailsBeans, function(ox1DetailsBean) {
								var supplyQty=ox1DetailsBean.supplyQty;
								if(null!=supplyQty){
									state.totalQty=Number(state.totalQty)+Number(ox1DetailsBean.supplyQty);
								}
								
							});				
						});
						state.totalOpeningStock=state.totalOpeningStock.toFixed(3);
						state.totalReceived=state.totalReceived.toFixed(3);
						state.grandTotalAvailable=state.grandTotalAvailable.toFixed(3);
						state.totalClosingStock=state.totalClosingStock.toFixed(3);
						state.totalQty=(state.totalQty).toFixed(3);
				    };
state.calculateTotalQty1 = function(ox1BeanList) {				
						state.totalQty=0;
						each(ox1BeanList, function(ox1Bean) {
							each(ox1Bean.ox1DetailsBeans, function(ox1DetailsBean) {
								state.totalQty = state.totalQty + Number((ox1DetailsBean.supplyQty==null)?0:ox1DetailsBean.supplyQty);					
							});				
						});
						state.totalQty=(state.totalQty).toFixed(3);
				    };
state.calculateTotalQty2 = function(ox2BeanList) {				
						state.totalQty=0;
						each(ox2BeanList, function(ox2Bean) {
							each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
								state.totalQty = state.totalQty + Number((ox2DetailsBean.supplyQty==null)?0:ox2DetailsBean.supplyQty);					
							});				
						});						
				    };
state.calculateTotalDTypeCyl2 = function(ox2BeanList) {				
						state.totalDTypeCyl=0;
						
						state.totalOpeningStock=0;
						state.totalReceived=0;
						state.grandTotalAvailable=0;
						state.totalOpeningStockDType=0;
						state.totalOpeningStockBType=0;
						state.totalDTypeFilled=0;
						state.totalBTypeFilled=0;
						state.totalClosingStock=0;
						state.totalClosingStockDType=0;
						state.totalClosingStockBType=0;
						each(ox2BeanList, function(ox2Bean) {
							var openingStock=ox2Bean.openingStock;
							if(null!=openingStock){
								state.totalOpeningStock=Number(state.totalOpeningStock)+Number(openingStock);
							}
							var openingStockDType=ox2Bean.openingStockDType;
							if(null!=openingStockDType){
								state.totalOpeningStockDType=Number(state.totalOpeningStockDType)+Number(openingStockDType);
							}
							var openingStockBType=ox2Bean.openingStockBType;
							if(null!=openingStockBType){
								state.totalOpeningStockBType=Number(state.totalOpeningStockBType)+Number(openingStockBType);
							}
							var dtypeFilled=ox2Bean.dtypeFilled;
							if(null!=dtypeFilled){
								state.totalDTypeFilled=Number(state.totalDTypeFilled)+Number(dtypeFilled);
							}
							var btypeFilled=ox2Bean.btypeFilled;
							if(null!=btypeFilled){
								state.totalBTypeFilled=Number(state.totalBTypeFilled)+Number(btypeFilled);
							}
							var receivedQty=ox2Bean.receivedQty;
							if(null!=receivedQty){
								state.totalReceived=Number(state.totalReceived)+Number(receivedQty);
							}
							var totalAvailable=ox2Bean.totalAvailable;
							if(null!=totalAvailable){
								state.grandTotalAvailable=Number(state.grandTotalAvailable)+Number(totalAvailable);
							}
							var dtypeClosing=ox2Bean.dtypeClosing;
							if(null!=dtypeClosing){
								state.totalClosingStockDType=Number(state.totalClosingStockDType)+Number(dtypeClosing);
							}
							var btypeClosing=ox2Bean.btypeClosing;
							if(null!=btypeClosing){
								state.totalClosingStockBType=Number(state.totalClosingStockBType)+Number(btypeClosing);
							}
							var closingStock=ox2Bean.closingStock;
							if(null!=closingStock){
								state.totalClosingStock=Number(state.totalClosingStock)+Number(closingStock);
							}
							each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
								state.totalDTypeCyl = state.totalDTypeCyl + Number((ox2DetailsBean.dtype==null)?0:ox2DetailsBean.dtype);
							});
							state.totalOpeningStock=state.totalOpeningStock.toFixed(3);
							state.totalReceived=state.totalReceived.toFixed(3);
							state.totalClosingStock=state.totalClosingStock.toFixed(3);
						});
						state.calculateTotalBTypeCyl2(ox2BeanList);
				    };
state.calculateTotalBTypeCyl2 = function(ox2BeanList) {				
						state.totalBTypeCyl=0;
						each(ox2BeanList, function(ox2Bean) {
							each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
								state.totalBTypeCyl = state.totalBTypeCyl + Number((ox2DetailsBean.btype==null)?0:ox2DetailsBean.btype);
							});				
						});						
				    };
state.calculateTotalDTypeCyl2Ox2 = function(ox2BeanList) {				
						state.totalDTypeCylOx2=0;
						each(ox2BeanList, function(ox2Bean) {
							each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
								state.totalDTypeCylOx2 = state.totalDTypeCylOx2 + Number((ox2DetailsBean.dtype==null)?0:ox2DetailsBean.dtype);
							});				
						});
				    };
state.calculateTotalBTypeCyl2Ox2 = function(ox2BeanList) {				
						state.totalBTypeCylOx2=0;
						each(ox2BeanList, function(ox2Bean) {
							each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
								state.totalBTypeCylOx2 = state.totalBTypeCylOx2 + Number((ox2DetailsBean.btype==null)?0:ox2DetailsBean.btype);
							});				
						});
				    };
state.calculateTotalAvailable2 = function(ox2Bean) {	
				    	
				    	ox2Bean.totalAvailable = (Number(ox2Bean.openingStock) + Number(ox2Bean.receivedQty)).toFixed(3);
				    	state.calculateTotalDTypeCyl2(state.ox2Data.ox2BeanList);
				    };
state.calculateClosingStock2 = function(ox2Bean) {	
				    	
				    	var qty = 0;
				    	each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
				    		qty = qty + Number((ox2DetailsBean.supplyQty==null)?0:ox2DetailsBean.supplyQty);					
						});	
				    	ox2Bean.closingStock = Number(ox2Bean.totalAvailable) - Number(qty);
				    };
state.calculateTotalQty2Admin = function(ox2BeanList) {				
						state.totalQty=0;
						each(ox2BeanList, function(ox2Bean) {
							each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
								state.totalQty = state.totalQty + Number((ox2DetailsBean.supplyQty==null)?0:ox2DetailsBean.supplyQty);					
							});				
						});						
				    };
state.calculateTotalDTypeCyl3Admin = function(ox3BeanList) {				
						state.totalDTypeCyl=0;
						
						state.totalPerDayCapacity=0;
						state.totalOpeningStockDType=0;
						state.totalOpeningStockBType=0;
						state.grandTotalOxygenMfg=0;
						state.totalDTypeFilled=0;
						state.totalBTypeFilled=0;
						state.totalClosingStockM3=0;
						state.totalClosingStockDType=0;
						state.totalClosingStockBType=0;
						
						each(ox3BeanList, function(ox3Bean) {
							
							var perDayCapacity=ox3Bean.perDayCapacity;
							if(null!=perDayCapacity){
								state.totalPerDayCapacity=Number(state.totalPerDayCapacity)+Number(perDayCapacity);
							}
							var openingStockDType=ox3Bean.openingStockDType;
							if(null!=openingStockDType){
								state.totalOpeningStockDType=Number(state.totalOpeningStockDType)+Number(openingStockDType);
							}
							var openingStockBType=ox3Bean.openingStockBType;
							if(null!=openingStockBType){
								state.totalOpeningStockBType=Number(state.totalOpeningStockBType)+Number(openingStockBType);
							}
							var totalOxygenMfg=ox3Bean.totalOxygenMfg;
							if(null!=totalOxygenMfg){
								state.grandTotalOxygenMfg=Number(state.grandTotalOxygenMfg)+Number(totalOxygenMfg);
							}
							var dtypeFilled=ox3Bean.dtypeFilled;
							if(null!=dtypeFilled){
								state.totalDTypeFilled=Number(state.totalDTypeFilled)+Number(dtypeFilled);
							}
							var btypeFilled=ox3Bean.btypeFilled;
							if(null!=btypeFilled){
								state.totalBTypeFilled=Number(state.totalBTypeFilled)+Number(btypeFilled);
							}
							var dtypeClosing=ox3Bean.closingStockDType;
							if(null!=dtypeClosing){
								state.totalClosingStockDType=Number(state.totalClosingStockDType)+Number(dtypeClosing);
							}
							var btypeClosing=ox3Bean.closingStockBType;
							if(null!=btypeClosing){
								state.totalClosingStockBType=Number(state.totalClosingStockBType)+Number(btypeClosing);
							}
							var closingStockM3=ox3Bean.closingStockM3;
							if(null!=closingStockM3){
								state.totalClosingStockM3=Number(state.totalClosingStockM3)+Number(closingStockM3);
							}
							
							each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
								state.totalDTypeCyl = state.totalDTypeCyl + Number((ox3DetailsBean.dtype==null)?0:ox3DetailsBean.dtype);					
							});				
						});
						state.totalPerDayCapacity=state.totalPerDayCapacity.toFixed(3);
						state.grandTotalOxygenMfg=state.grandTotalOxygenMfg.toFixed(3);
						state.totalClosingStockM3=state.totalClosingStockM3.toFixed(3);
						state.calculateTotalBTypeCyl3Admin(ox3BeanList);
				    };
state.calculateTotalBTypeCyl3Admin = function(ox3BeanList) {				
						state.totalBTypeCyl=0;
						each(ox3BeanList, function(ox3Bean) {
							each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
								state.totalBTypeCyl = state.totalBTypeCyl + Number((ox3DetailsBean.btype==null)?0:ox3DetailsBean.btype);					
							});				
						});						
				    };
state.calculateTotalDTypeCyl3AdminOx3 = function(ox3BeanList) {				
						state.totalDTypeCylOx3=0;
						each(ox3BeanList, function(ox3Bean) {
							each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
								state.totalDTypeCylOx3 = state.totalDTypeCylOx3 + Number((ox3DetailsBean.dtype==null)?0:ox3DetailsBean.dtype);					
							});				
						});						
				    };
state.calculateTotalBTypeCyl3AdminOx3 = function(ox3BeanList) {				
						state.totalBTypeCylOx3=0;
						each(ox3BeanList, function(ox3Bean) {
							each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
								state.totalBTypeCylOx3 = state.totalBTypeCylOx3 + Number((ox3DetailsBean.btype==null)?0:ox3DetailsBean.btype);					
							});				
						});						
				    };
state.calculateTotalDTypeCyl4Admin = function(ox4BeanList) {				
						state.totalDTypeCyl=0;
						
						state.totalOpeningStockDType=0;
						state.totalOpeningStockBType=0;
						state.totalReceivedDType=0;
						state.totalReceivedBType=0;
						state.totalClosingStockDType=0;
						state.totalClosingStockBType=0;
						state.totalClosingStockM3=0;
						
						each(ox4BeanList, function(ox4Bean) {
							
							var openingStockDType=ox4Bean.dtypeOpening;
							if(null!=openingStockDType){
								state.totalOpeningStockDType=Number(state.totalOpeningStockDType)+Number(openingStockDType);
							}
							var openingStockBType=ox4Bean.btypeOpening;
							if(null!=openingStockBType){
								state.totalOpeningStockBType=Number(state.totalOpeningStockBType)+Number(openingStockBType);
							}
							var dtypeReceived=ox4Bean.dtypeReceived;
							if(null!=dtypeReceived){
								state.totalReceivedDType=Number(state.totalReceivedDType)+Number(dtypeReceived);
							}
							var btypeReceived=ox4Bean.btypeReceived;
							if(null!=btypeReceived){
								state.totalReceivedBType=Number(state.totalReceivedBType)+Number(btypeReceived);
							}
							var closingStockDType=ox4Bean.dtypeClosing;
							if(null!=closingStockDType){
								state.totalClosingStockDType=Number(state.totalClosingStockDType)+Number(closingStockDType);
							}
							var closingStockBType=ox4Bean.btypeClosing;
							if(null!=closingStockBType){
								state.totalClosingStockBType=Number(state.totalClosingStockBType)+Number(closingStockBType);
							}
							var closingStockM3=ox4Bean.closingStockM3;
							if(null!=closingStockM3){
								state.totalClosingStockM3=Number(state.totalClosingStockM3)+Number(closingStockM3);
							}
							
							each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
								state.totalDTypeCyl = state.totalDTypeCyl + Number((ox4DetailsBean.dtype==null)?0:ox4DetailsBean.dtype);					
							});				
						});
						state.totalClosingStockM3=state.totalClosingStockM3.toFixed(3);
						state.calculateTotalBTypeCyl4Admin(ox4BeanList);
				    };
state.calculateTotalBTypeCyl4Admin = function(ox4BeanList) {				
						state.totalBTypeCyl=0;
						each(ox4BeanList, function(ox4Bean) {
							each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
								state.totalBTypeCyl = state.totalBTypeCyl + Number((ox4DetailsBean.btype==null)?0:ox4DetailsBean.btype);					
							});				
						});						
				    };
state.calculateTotalDTypeCyl4AdminOx4 = function(ox4BeanList) {				
						state.totalDTypeCylOx4=0;
						each(ox4BeanList, function(ox4Bean) {
							each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
								state.totalDTypeCylOx4 = state.totalDTypeCylOx4 + Number((ox4DetailsBean.dtype==null)?0:ox4DetailsBean.dtype);					
							});				
						});						
				    };
state.calculateTotalBTypeCyl4AdminOx4 = function(ox4BeanList) {				
						state.totalBTypeCylOx4=0;
						each(ox4BeanList, function(ox4Bean) {
							each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
								state.totalBTypeCylOx4 = state.totalBTypeCylOx4 + Number((ox4DetailsBean.btype==null)?0:ox4DetailsBean.btype);					
							});				
						});						
				    };
state.loadSupplierListAdmin = function() {
						loading.start('sample-1');
						fetchSupplierListAdmin();
					};
state.deleteSupplier = function(id) {		
						if (confirm("Are you sure to delete this entry?")) {
							loading.start('sample-1');

							var responsePromise = request.get('deleteSupplier/'+ id);
							responsePromise.success(function(data, status, headers, config) {
								state.responseObject = data;
								if (state.responseObject.successMessage != null) {
									later(function() {
										 state.responseObject.successMessage = null;
								    }, 5000);
									navigation.location.href = '#/supplierNameListAdmin';
									
								}
								if(state.responseObject.errorMessage != null) {
									later(function() {
										state.responseObject.errorMessage = null;
									}, 5000);
								}
								loading.finish('sample-1');
							});
						}else{
							return false;
						}
					};
state.deleteSupply = function(id) {		
						if (confirm("Are you sure to delete this entry?")) {
							loading.start('sample-1');

							var responsePromise = request.get('deleteSupply/'+ id);
							responsePromise.success(function(data, status, headers, config) {
								state.responseObject = data;
								if (state.responseObject.successMessage != null) {
									later(function() {
										 state.responseObject.successMessage = null;
								    }, 5000);
									navigation.location.href = '#/supplyNameList';
									
								}
								if(state.responseObject.errorMessage != null) {
									later(function() {
										state.responseObject.errorMessage = null;
									}, 5000);
								}
								loading.finish('sample-1');
							});
						}else{
							return false;
						}
					};
state.editSupplierAdmin = function(form, isValid) {
							
							if (!isValid) {
								return false;
							}

							if (confirm("Are you sure you want to Edit the data?")) {
								
								
								loading.start('sample-1');
								
								var fd = new FormData();
								fd.append('supplierName', state.supplierInfoData.supplierName);
								fd.append('supplierTypeId', state.supplierInfoData.supplierTypeId);
								fd.append('authorisedPersonName', state.supplierInfoData.authorisedPersonName);
								fd.append('mobileNo', state.supplierInfoData.mobileNo);
								fd.append('emailId', state.supplierInfoData.emailId);
								fd.append('address', state.supplierInfoData.address);
								fd.append('pin', state.supplierInfoData.pin);
								fd.append('districtId', state.supplierInfoData.districtId);
								fd.append('status', state.supplierInfoData.status);
								fd.append('id', params.id);
								fd.append('supplySource', state.supplierInfoData.supplySource);
								fd.append('external', state.supplierInfoData.external);
								
								
							
								


								var responsePromise = request.post('addSupplierAdmin',
										fd, {
											transformRequest : identity,
											headers : {
												'Content-Type' : undefined
											}
										});


								responsePromise.success(function(data, status, headers, config) {

									state.responseObject = data;

									if(state.responseObject.successMessage != null) {
										later(function() {
											state.responseObject.successMessage = null;
										}, 10000);
										navigation.location.href = '#supplierNameListAdmin';
									}
									if(state.responseObject.errorMessage != null) {
										later(function() {
											state.responseObject.errorMessage = null;
										}, 10000);
									}
									loading.finish('sample-1');
								});
								responsePromise.error(function() {
									state.responseObject = {};
									state.responseObject.errorMessage = "Some error occured while saving the data";
									later(function() {
										state.responseObject.errorMessage = null;
									}, 10000);
									loading.finish('sample-1');
								});
								
							} 
						};
state.editSupplyNameAdminDet = function(form, isValid) {
							
							if (!isValid) {
								return false;
							}

							if (confirm("Are you sure you want to save the data?")) {
								
								
								loading.start('sample-1');
								
								if(null!= state.supplyNameBean)
								state.supplyNameBean.action='edit';

								var responsePromise = request.post('addSupplyNameAdminDet', state.supplyNameBean);

								responsePromise.success(function(data, status, headers, config) {

									state.responseObject = data;

									if(state.responseObject.successMessage != null) {
										later(function() {
											state.responseObject.successMessage = null;
										}, 10000);
										alert(state.responseObject.successMessage);
										navigation.location.href = '#supplyNameList';
									}
									if(state.responseObject.errorMessage != null) {
										later(function() {
											state.responseObject.errorMessage = null;
										}, 10000);
									}
									loading.finish('sample-1');
								});
								responsePromise.error(function() {
									state.responseObject = {};
									state.responseObject.errorMessage = "Some error occured while saving the data";
									later(function() {
										state.responseObject.errorMessage = null;
									}, 10000);
									loading.finish('sample-1');
								});
								
							} 
						};
state.loadSupplyNameListAdmin = function() {
						loading.start('sample-1');
						fetchSupplyNameListAdmin();
					};
state.exportToExcel=function(tableId){ 
				        var exportHref=Excel.tableToExcel(tableId,'1','sheet 1');
				        later(function(){location.href=exportHref;},1); 
				    };
state.exportToExcel1=function(fileName, tableId){ 
						
						var uri = 'data:application/vnd.ms-excel;base64,',
				           template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
				           base64 = function (s) { return navigation.btoa(unescape(encodeURIComponent(s))); },
				           format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
						 name = fileName + '.xls';
				            var table = document.querySelector(tableId),
				                ctx = {table: table.innerHTML};
				            var browser = window.navigator.appVersion;

				            if ((browser.indexOf('Trident') !== -1 && browser.indexOf('rv:11') !== -1) ||
				                (browser.indexOf('MSIE 10') !== -1)) {
				                var builder = new window.MSBlobBuilder();
				                builder.append(uri + format(template, ctx));
				                var blob = builder.getBlob('data:application/vnd.ms-excel');
				                window.navigator.sSaveOrOpenBlob(blob, name);

				            } else {

				                var link = document.createElement('a');
				                link.download = name;
				                link.href = uri + base64(format(template, ctx));
				                link.click();
				            }
				    };
state.checkTimeForAdminUpdation= function(){
						var currentDate = new Date();
						var AdminOpenTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 18, 30, 0, 0);
						var AdminCloseTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 19, 59, 59, 0);
						
						if (currentDate < AdminOpenTime || currentDate > AdminCloseTime) {
							
							state.isNotCurrent = false;
						}
					};
state.populateCurrentDay = function() {
						var d = new Date();
					
						state.entryDate = ("0" + d.getDate()).slice(-2)  + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
					};
state.sum = function (items, prop) {
					    if (items == null) {
					        return 0;
					    }
					    return items.reduce(function (a, b) {
					        return (b[prop] == null || !b[prop]) ? a : a + parseFloat(b[prop] ? b[prop] : 0);
					    }, 0);
					};
state.fetchSupplierOxgAvailabilityReport = function() {
						loading.start('sample-1');
						var responsePromise = request.get('fetchSupplierOxgAvailabilityReport', {params : {'entryDate' : state.entryDate} });
						responsePromise.success(function(data, status, headers,
								config) {
							state.reportData = data;
							loading.finish('sample-1');
						}).then(
						        function (response) {
						            state.receivedTotal = state.sum(state.reportData, 'received');
						            state.dispatchedTotal = state.sum(state.reportData, 'dispatched');
						            state.closingTotal = state.sum(state.reportData, 'closingStock');
						        });
					};
state.fetchFacilityOxgAvailabilityReport = function() {
						loading.start('sample-1');
						var responsePromise = request.get('fetchFacilityOxgAvailabilityReport', {params : {'entryDate' : state.entryDate} });
						responsePromise.success(function(data, status, headers,
								config) {
							state.reportData = data;
							loading.finish('sample-1');
						}).then(
						        function (response) {
						            state.receivedTotal = state.sum(state.reportData, 'received');
						        });
					};
state.exportExcelNew = function(type, entryDate){
		                
						exportExcelNew(type, null, null, entryDate);
		        };
state.fetchReportData1 = function(type) {		
							loading.start('sample-1');

							var responsePromise = request.get('fetchOxgAvailabilityReport?type='+type+'&entryDate='+state.entryDate);
							responsePromise.success(function(data, status, headers, config) {
								state.reportData1 = data;
								loading.finish('sample-1');
							})
					};
state.fetchReportData2 = function(type) {		
						loading.start('sample-1');

						var responsePromise = request.get('fetchOxgAvailabilityReport?type='+type+'&entryDate='+state.entryDate);
						responsePromise.success(function(data, status, headers, config) {
							state.reportData2 = data;
							loading.finish('sample-1');
						})
				};
state.fetchReportData3 = function(type) {		
					loading.start('sample-1');

					var responsePromise = request.get('fetchOxgAvailabilityReport?type='+type+'&entryDate='+state.entryDate);
					responsePromise.success(function(data, status, headers, config) {
						state.reportData3 = data;
						loading.finish('sample-1');
					})
			};
state.fetchReportData4 = function(type) {		
				loading.start('sample-1');

				var responsePromise = request.get('fetchOxgAvailabilityReport?type='+type+'&entryDate='+state.entryDate);
				responsePromise.success(function(data, status, headers, config) {
					state.reportData4 = data;
					loading.finish('sample-1');
				})
		};
state.fetchReportData5 = function(type) {		
			loading.start('sample-1');

			var responsePromise = request.get('fetchOxgAvailabilityReport?type='+type+'&entryDate='+state.entryDate);
			responsePromise.success(function(data, status, headers, config) {
				state.reportData5 = data;
				loading.finish('sample-1');
			})
	};
state.fetchOxFormDetailsForFacilityWiseDashboard = function() {
		state.ox2Data={};
		state.ox3Data={};
		state.ox4Data={};
		if(null!= state.entryDate){
			state.ox1Data.entryDate=state.entryDate;
			state.ox2Data.entryDate=state.entryDate;
			state.ox3Data.entryDate=state.entryDate;
			state.ox4Data.entryDate=state.entryDate;
			state.fetchOx1FormDetailsAdmin();
			state.fetchOx2FormDetailsAdmin();
			state.fetchOx3FormDetailsAdmin();
			state.fetchOx4FormDetailsAdmin();
		}
	};
state.fetchDistrictWiseDashboardAdmin = function() {
		var districtId=0;
		if(null!= state.districtId && state.districtId!=''){
			districtId=state.districtId;
		}
		loading.start('sample-1');
		var responsePromise = request.get('fetchDistrictWiseDashboardAdmin?entryDate='+state.entryDate+'&districtId='+districtId);
		responsePromise.success(function(data, status, headers,
				config) {
			state.supplyTypeBeans = data;
			loading.finish('sample-1');
		});
	};
state.fetchDistrictFacilityTypeSummaryDashboardAdmin = function(type) {
		var districtId=0;
		if(null!= state.facilityDistrictId && state.facilityDistrictId!=''){
			districtId=state.facilityDistrictId;
		}
		loading.start('sample-1');
		var responsePromise = request.get('fetchDistrictFacilityTypeSummaryDashboardAdmin?entryDate='+state.entryDate+'&districtId='+districtId+'&type='+type);
		responsePromise.success(function(data, status, headers,
				config) {
			state.districtFacilityTypeBeans = data;
			if(null!= state.districtFacilityTypeBeans){
				var districtFacilityTypeBean=state.districtFacilityTypeBeans[0];
				
				state.totalSuppliedGovtMedicalCollege=districtFacilityTypeBean.totalSuppliedGovtMedicalCollege;
				state.totalSuppliedPvtMedicalCollege=districtFacilityTypeBean.totalSuppliedPvtMedicalCollege;
				state.totalSuppliedGovtHospital=districtFacilityTypeBean.totalSuppliedGovtHospital;
				state.totalSuppliedPvtHospital=districtFacilityTypeBean.totalSuppliedPvtHospital;
				state.totalSuppliedIndustrialUsers=districtFacilityTypeBean.totalSuppliedIndustrialUsers;
				state.totalSuppliedSumOfIndividualUsers=districtFacilityTypeBean.totalSuppliedSumOfIndividualUsers;
				state.grandTotalSupplied=districtFacilityTypeBean.grandTotalSupplied;
			}
			loading.finish('sample-1');
		});
	};
state.calculateClosingStockDTypeOx3 = function(ox3Bean) {		
	    var totalDTypeCyl=0;
			each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
				totalDTypeCyl = totalDTypeCyl + Number((ox3DetailsBean.dtype==null)?0:ox3DetailsBean.dtype);					
			});
			ox3Bean.closingStockDType= Number(ox3Bean.openingStockDType)+Number(ox3Bean.dtypeFilled)-Number(totalDTypeCyl);
			ox3Bean.closingStockM3 = Number(ox3Bean.closingStockDType*7) + Number(ox3Bean.closingStockBType*1.5);
 };
state.calculateClosingStockBTypeOx3 = function(ox3Bean) {		
	    var totalBTypeCyl=0;
			each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
				totalBTypeCyl = totalBTypeCyl + Number((ox3DetailsBean.btype==null)?0:ox3DetailsBean.btype);					
			});
			ox3Bean.closingStockBType= Number(ox3Bean.openingStockBType)+Number(ox3Bean.btypeFilled)-Number(totalBTypeCyl);
			ox3Bean.closingStockM3 = Number(ox3Bean.closingStockDType*7) + Number(ox3Bean.closingStockBType*1.5);
 };
state.fetchSupplyFromSuppliersForOx2OrOx4 = function(oxBean, type, districtId, supplySource) {

		
		if(state.receivedFroms==null || state.receivedFroms.length==0){
			
			var response = request.get('fetchSupplyFromSuppliersForOx2OrOx4?type='+type);

			response.success(function(data, status, headers,
					config) {
				state.receivedFroms = data;
				
			}).then(function(data, status, headers,
					config) {
				var external=null;
				if(supplySource=='Other State'){
					external='Y';
				}else if(supplySource=='Madhya Pradesh'){
					external='N';
				}
				
				if(null!= external)
					
					oxBean.receivedFroms = state.receivedFroms;
				else
					oxBean.receivedFroms = state.receivedFroms;
				
			});
		}else{
			var external=null;
			if(supplySource=='Other State'){
				external='Y';
			}else if(supplySource=='Madhya Pradesh'){
				external='N';
			}
			
			if(null!= external)
				
				oxBean.receivedFroms = state.receivedFroms;
			else
				oxBean.receivedFroms = state.receivedFroms;
			
		}

	};
state.fetchSupplyFromSuppliersForOx2OrOx4Main = function(type) {
		
			
			var response = request.get('fetchSupplyFromSuppliersForOx2OrOx4?type='+type);

			response.success(function(data, status, headers,
					config) {
				state.receivedFroms = data;
				
			})

	};
state.calculateClosingStockDTypeOx2 = function(ox2Bean) {		
	    var totalDTypeCyl=0;
			each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
				totalDTypeCyl = totalDTypeCyl + Number((ox2DetailsBean.dtype==null)?0:ox2DetailsBean.dtype);					
			});
			ox2Bean.dtypeClosing= Number(ox2Bean.openingStockDType)+Number(ox2Bean.dtypeFilled)-Number(totalDTypeCyl);
			state.calculateTotalDTypeCyl2(state.ox2Data.ox2BeanList);
	};
state.calculateClosingStockBTypeOx2 = function(ox2Bean) {		
	    var totalBTypeCyl=0;
			each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
				totalBTypeCyl = totalBTypeCyl + Number((ox2DetailsBean.btype==null)?0:ox2DetailsBean.btype);					
			});
			ox2Bean.btypeClosing= Number(ox2Bean.openingStockBType)+Number(ox2Bean.btypeFilled)-Number(totalBTypeCyl);
			state.calculateTotalDTypeCyl2(state.ox2Data.ox2BeanList);
 };
state.facilityNameOnChange = function(type, oxDetailsBean) {
		if(type==1 && oxDetailsBean.supplyQty==null){
			oxDetailsBean.supplyQty=0;
		}else if(type==2){
			if(oxDetailsBean.supplyQty==null){
				oxDetailsBean.supplyQty=0;
			}
			if(oxDetailsBean.dtype==null){
				oxDetailsBean.dtype=0;
			}
			if(oxDetailsBean.btype==null){
				oxDetailsBean.btype=0;
			}
		}else if(type==3){
			if(oxDetailsBean.dtype==null){
				oxDetailsBean.dtype=0;
			}
			if(oxDetailsBean.btype==null){
				oxDetailsBean.btype=0;
			}
		}else if(type==4){
			if(oxDetailsBean.dtype==null){
				oxDetailsBean.dtype=0;
			}
			if(oxDetailsBean.btype==null){
				oxDetailsBean.btype=0;
			}
		}
	};
state.validateSuppliedDTypeOx2 = function(ox2Bean, ox2DetailsBean) {		
		 var dtype = 0;
		
			 each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
		    		dtype = dtype + Number((ox2DetailsBean.dtype==null)?0:ox2DetailsBean.dtype);					
				}); 
	    	
			if(dtype > (Number(ox2Bean.openingStockDType) + Number(ox2Bean.dtypeFilled))){
				ox2DetailsBean.dtype = "";
				alert("Total D Type Cylinders should be less than or equal to Opening Stock D-Type + Cylinders Filled (D-Type).");
			}
			state.calculateTotalDTypeCyl2(state.ox2Data.ox2BeanList);
			state.calculateClosingStockDTypeOx2(ox2Bean);
	 };
state.validateSuppliedBTypeOx2 = function(ox2Bean, ox2DetailsBean) {		
		 var btype = 0;
		
			 each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
		    		btype = btype + Number((ox2DetailsBean.btype==null)?0:ox2DetailsBean.btype);					
				}); 
	    	
			if(btype > (Number(ox2Bean.openingStockBType) + Number(ox2Bean.btypeFilled))){
				ox2DetailsBean.btype = "";
				alert("Total B Type Cylinders should be less than or equal to Opening Stock B-Type + Cylinders Filled (B-Type).");
			}
			state.calculateTotalBTypeCyl2(state.ox2Data.ox2BeanList);
			state.calculateClosingStockBTypeOx2(ox2Bean);
	 };
state.validateSuppliedDTypeOx3 = function(ox3Bean, ox3DetailsBean) {		
			 var dtype = 0;
			
				 each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
			    		dtype = dtype + Number((ox3DetailsBean.dtype==null)?0:ox3DetailsBean.dtype);					
					}); 
		    	
				if(dtype > (Number(ox3Bean.openingStockDType) + Number(ox3Bean.dtypeFilled))){
					ox3DetailsBean.dtype = "";
					alert("Total D Type Cylinders should be less than or equal to Opening Stock D-Type + Cylinders Filled (D-Type).");
				}
				state.calculateTotalDTypeCyl3Admin(state.ox3Data.ox3BeanList);
				state.calculateClosingStockDTypeOx3(ox3Bean);
		 };
state.loadTankerList = function() {
				loading.start('sample-1');
				fetchTankerList();
			};
state.deleteTanker = function(id) {		
				if (confirm("Are you sure to delete this entry?")) {
					loading.start('sample-1');

					var responsePromise = request.get('deleteTanker/'+ id);
					responsePromise.success(function(data, status, headers, config) {
						state.responseObject = data;
						if (state.responseObject.successMessage != null) {
							later(function() {
								 state.responseObject.successMessage = null;
						    }, 5000);
							navigation.location.href = '#/tankerList';
							
						}
						if(state.responseObject.errorMessage != null) {
							later(function() {
								state.responseObject.errorMessage = null;
							}, 5000);
						}
						loading.finish('sample-1');
					});
				}else{
					return false;
				}
			};
state.addTanker = function(form, isValid) {
				
				if (!isValid) {
					return false;
				}

				if (confirm("Are you sure you want to save the data?")) {
					
					
					loading.start('sample-1');

					var responsePromise = request.post('addTanker', state.tankerData);

					responsePromise.success(function(data, status, headers, config) {

						state.responseObject = data;

						if(state.responseObject.successMessage != null) {
							later(function() {
								state.responseObject.successMessage = null;
							}, 10000);
							alert(state.responseObject.successMessage);
							navigation.location.href = '#tankerList';
						}
						if(state.responseObject.errorMessage != null) {
							later(function() {
								state.responseObject.errorMessage = null;
							}, 10000);
						}
						loading.finish('sample-1');
					});
					responsePromise.error(function() {
						state.responseObject = {};
						state.responseObject.errorMessage = "Some error occured while saving the data";
						later(function() {
							state.responseObject.errorMessage = null;
						}, 10000);
						loading.finish('sample-1');
					});
					
				} 
			};
state.fetchTankerMgmtFormDetailsAdmin = function() {
				loading.start('sample-1');
				var responsePromise = request.get('fetchTankerMgmtFormDetailsAdmin', {params : {'entryDate' : state.tankerMgmtData.entryDate, 'districtId' : state.districtId, 'supplyTypeId' : state.supplyTypeId, 'supplyNameId' : state.supplyNameId, 'supplyDistrictId' : state.supplyDistrictId} });
				responsePromise.success(function(data, status, headers,
						config) {
					state.tankerMgmtData = data;
					loading.finish('sample-1');
				});
			};
state.editTanker = function(form, isValid) {
				
				if (!isValid) {
					return false;
				}

				if (confirm("Are you sure you want to save the data?")) {
					
					
					loading.start('sample-1');

					var responsePromise = request.post('addTanker', state.tankerData);

					responsePromise.success(function(data, status, headers, config) {

						state.responseObject = data;

						if(state.responseObject.successMessage != null) {
							later(function() {
								state.responseObject.successMessage = null;
							}, 10000);
							alert(state.responseObject.successMessage);
							navigation.location.href = '#tankerList';
						}
						if(state.responseObject.errorMessage != null) {
							later(function() {
								state.responseObject.errorMessage = null;
							}, 10000);
						}
						loading.finish('sample-1');
					});
					responsePromise.error(function() {
						state.responseObject = {};
						state.responseObject.errorMessage = "Some error occured while saving the data";
						later(function() {
							state.responseObject.errorMessage = null;
						}, 10000);
						loading.finish('sample-1');
					});
					
				} 
			};
state.loadTankerDetails = function() {
				loading.start('sample-1');
				var response = request.get('fetchTankerDetailsById/'+params.id);
				response.success(function(data, status, headers, config) {
					if(null != data) {
						state.tankerData = data;
						state.tankerData.supplierId = state.tankerData.supplierId+"";
						loading.finish('sample-1');
					}
				});
				
			};
state.fetchTankersBySupplierId = function(tankerMgmtTankerInfoBean, supplierId) {
				loading.start('sample-1');
				var responsePromise = request.get('fetchTankersBySupplierId', {params : {'supplierId' : supplierId} });
				responsePromise.success(function(data, status, headers,
						config) {
					tankerMgmtTankerInfoBean.tankers = data;
					loading.finish('sample-1');
				});
			};
state.fetchSupplySources = function(supplierId) {
				loading.start('sample-1');
				var responsePromise = request.get('fetchSupplySources');
				responsePromise.success(function(data, status, headers,
						config) {
					state.supplySources = data;
					loading.finish('sample-1');
				});
			};
state.saveTankerMgmtForm = function(isValid) {

		    	if (!isValid)
		    		return false;

		    	if (confirm("Are you sure you want to save the data?")) {
		    		loading.start('sample-1');
		    		if(null!=document.getElementById("submitBtn"))
						document.getElementById("submitBtn").disabled=true;
		    		var responsePromise = request.post('saveTankerMgmtForm', state.tankerMgmtData);

		    		responsePromise
		    		.success(function(data, status, headers, config) {

		    			state.responseObject = data;
		    			if (state.responseObject.successMessage != null) {
		    				later(
		    						function() {
		    							state.responseObject.successMessage = null;
		    						}, 10000);
		    				navigation.location.href = '#tankerDetailsEntryFormAdmin';
		    				if(null!=document.getElementById("submitBtn"))
		    					document.getElementById("submitBtn").disabled=true;
		    				loading.finish('sample-1');
		    			}

		    		});
		    	}
		    };
state.loadSupplySourceList = function() {
				loading.start('sample-1');
				fetchSupplySourceList();
			};
state.addEditSupplySource = function(form, isValid, type) {
				
				if (!isValid) {
					return false;
				}

				if (confirm("Are you sure you want to save the data?")) {
					
					
					loading.start('sample-1');
					
					var responsePromise = request.post('addSupplySource', state.supplySourceData);

					responsePromise.success(function(data, status, headers, config) {

						state.responseObject = data;

						if(state.responseObject.successMessage != null) {
							later(function() {
								state.responseObject.successMessage = null;
							}, 10000);
							alert(state.responseObject.successMessage);
							navigation.location.href = '#supplySourceList';
						}
						if(state.responseObject.errorMessage != null) {
							later(function() {
								state.responseObject.errorMessage = null;
							}, 10000);
						}
						loading.finish('sample-1');
					});
					responsePromise.error(function() {
						state.responseObject = {};
						state.responseObject.errorMessage = "Some error occured while saving the data";
						later(function() {
							state.responseObject.errorMessage = null;
						}, 10000);
						loading.finish('sample-1');
					});
				} 
			};
state.deleteSupplySource = function(id) {		
				if (confirm("Are you sure to delete this entry?")) {
					loading.start('sample-1');

					var responsePromise = request.get('deleteSupplySource/'+ id);
					responsePromise.success(function(data, status, headers, config) {
						state.responseObject = data;
						if (state.responseObject.successMessage != null) {
							alert("Supply Source deleted successfully.");
							later(function() {
								 state.responseObject.successMessage = null;
						    }, 5000);
							navigation.location.href = '#/supplySourceList';
							
						}
						if(state.responseObject.errorMessage != null) {
							later(function() {
								state.responseObject.errorMessage = null;
							}, 5000);
						}
						loading.finish('sample-1');
					});
				}else{
					return false;
				}
			};
state.loadTankerSupplierNameList = function() {
				loading.start('sample-1');
				fetchTankerSupplierNameList();
			};
state.fetchTankerSuppliers = function() {
				loading.start('sample-1');
				var response = request.get('fetchTankerSuppliers');
				response.success(function(data, status, headers, config) {
					if(null != data) {
						state.tankerSuppliers = data;
						loading.finish('sample-1');
					}
				});
				
			};
state.loadSupplySourceDetails = function() {
				loading.start('sample-1');
				var response = request.get('fetchSupplySourceDetailsById/'+params.id);
				response.success(function(data, status, headers, config) {
					if(null != data) {
						state.supplySourceData = data;
						loading.finish('sample-1');
					}
				});
				
			};
state.addSupplierAdmin = function(form, isValid) {
				
				if (!isValid) {
					return false;
				}

				if (confirm("Are you sure you want to save the data?")) {
					
					
					loading.start('sample-1');
					
					var responsePromise = request.post('addSupplierAdmin2', state.supplierInfoData);

					responsePromise.success(function(data, status, headers, config) {

						state.responseObject = data;

						if(state.responseObject.successMessage != null) {
							later(function() {
								state.responseObject.successMessage = null;
							}, 10000);
							alert(state.responseObject.successMessage);
							navigation.location.href = '#tankerSupplierList';
						}
						if(state.responseObject.errorMessage != null) {
							later(function() {
								state.responseObject.errorMessage = null;
							}, 10000);
						}
						loading.finish('sample-1');
					});
					responsePromise.error(function() {
						state.responseObject = {};
						state.responseObject.errorMessage = "Some error occured while saving the data";
						later(function() {
							state.responseObject.errorMessage = null;
						}, 10000);
						loading.finish('sample-1');
					});
				} 
			};
state.editSupplier = state.editSupplierAdmin;
state.editSupplyName = state.editSupplyNameAdminDet;
state.loadDticDistrictsForSupplierAdmin = function() {
  return request.get('fetchDticDistrictsAdmin').success(function(data) {
    state.districts = data;
    state.dticDistricts = data;
  });
};
state.validateSuppliedBTypeOx3 = state.validateSuppliedDTypeOx3 || state.validateSuppliedBTypeOx2;

}
