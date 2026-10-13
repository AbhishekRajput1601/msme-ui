// Source: angular/dtic/controller.js. Generated static JS, with explicit React IO dependencies.
export function installActions(state, { request, loading, navigation, params, format, later, dom }) {
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,Array.isArray(items) ? Number(k) : k));
const identity = value => value;
const fetchLetters = () => { state.listVersion++; loading.finish(); };
let lastObjectId="", lastSchemeId="", lastSchemeTypeId="";
state.started = false;
state.changePasswordData = {};
state.otpGenerated = false;
state.isOtpButtonDisabled = false;
state.showCurrentPassword = false;
state.showNewPassword = false;
state.showConfirmPassword = false;
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
							each(
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
					params: {
						'userId': ""
					}
				});
				responsePromise
					.success(function(data, status, headers, config) {
						state.signupData = data;
						state.signupData.industrialPartnerslist = [{}];
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
						
						
						if (state.signupData.userId) {
							state.fetchApplicantDetails(state.signupData.userId);
						}
						
						if (state.signupData.officeLocationId) {
							var responseOffice = request
								.get(
									'fetchofficeaddresssbyofficeid',
									{
										params: {
											'officeId': state.signupData.officeLocationId
										}
									});
							responseOffice.success(function(data,
								status, headers, config) {
								state.respondentOffices = data;
							});
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
						state.signupData.stateId = 20 + "";
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
						
						var fetchAllConstitution = request
							.get('fetchAllConstitutionFirm');
						fetchAllConstitution.success(function(data,
							status, headers, config) {
							state.constitutionFirmList = [];
							each(data, function(value, key) {
								   state.constitutionFirmList.push({ key: key, value: value });
								});
						});

						
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
					loading.start('sample-1');
					var responseDistricts = request.get(
						'fetchdistrictmapbystate', {
						params: {
							'stateId': stateId
						}
					});
					responseDistricts.success(function(data, status,
						headers, config) {
						state.districts = data;
						loading.finish('sample-1');
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
						
						'fetchtehsilmapbydistrict', {
						params: {
							'districtId': districtId
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
						params: {
							'stateId': stateId
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
						
						'fetchtehsilmapbydistrict', {
						params: {
							'districtId': districtId
						}
					});

					responsepDistricts.success(function(data, status,
						headers, config) {
						state.permanentTehsils = data;
						loading.finish('sample-1');
					});

					var responseBlocks = request.get('fetchBlocksMap',
						{ params: { 'districtId': districtId } });

					
					
					
					
					

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
					state.signupData.permanentBlockId = state.signupData.blockId;
					state.signupData.permTelephoneNumber = state.signupData.telephoneNumber;
					state.signupData.permanentCity = state.signupData.city;

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
					state.signupData.permTelephoneNumber = "";
					signupData.permanentCity = "";
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
				var language = dom('#language').val();
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
				var language = dom('#language').val();

				

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
						if (dom("#panUpload")[0].files[0].size / 1024 < 513)
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
					if (dom("#proofOfIdentityUpload")[0].files[0].size / 1024 < 513)
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
						if (dom("#proofOfAddressUpload")[0].files[0].size / 1024 < 513)
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
							var language = dom('#language').val();
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
				var language = dom('#language').val();

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
					if (dom("#panUpload")[0].files[0].size / 1024 < 513)
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
					if (dom("#tanUpload")[0].files[0].size / 1024 < 513)
						fd.append('tanUpload', state.signupData.tanUpload);
					else {
						alert("TAN No. File size should not exceed 500KB");
						return false;
					}
					
				}
				
				if (state.signupData.proofOfIdentityUpload) {
					if (dom("#proofOfIdentityUpload")[0].files[0].size < 5242880)
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
					if (dom("#proofOfAddressUpload")[0].files[0].size / 1024 < 513)
						fd.append('proofOfAddressUpload', state.signupData.proofOfAddressUpload);
					else {
						alert("Proof of Address File size should not exceed 500KB");
						return false;
					}
					
				} 
				if (state.signupData.categoryUpload) {
					if (dom("#categoryUpload")[0].files[0].size < 5242880)
						fd.append('categoryUpload', state.signupData.categoryUpload);
					else {
						alert("Caste Certifcate File size should not exceed 5MB");
						return false;
					}

					
				}
				if (state.signupData.deedUpload) {
					if (dom("#deedUpload")[0].files[0].size < 5242880)
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
					if (dom("#udyamUpload")[0].files[0].size < 2097152)
						fd.append('udyamUpload', state.signupData.udyamUpload);
					else {
						alert("Udyam Resgistration No. File size should not exceed 2MB");
						return false;
					}
					

				}
				if (state.signupData.factoryUpload) {
					if (dom("#factoryUpload")[0].files[0].size < 2097152)
						fd.append('factoryUpload', state.signupData.factoryUpload);
					else {
						alert("Factory Act License No. File size should not exceed 2MB");
						return false;
					}
					
				}
				
				if (state.signupData.gstUpload) {
					if (dom("#gstUpload")[0].files[0].size < 2097152)
						fd.append('gstUpload', state.signupData.gstUpload);
					else {
						alert("GST No. File size should not exceed 2MB");
						return false;
					}
					
				} else {
		
					
				}
				if (state.signupData.cinUpload) {
					if (dom("#cinUpload")[0].files[0].size < 2097152)
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
					if (dom("#pcbEstUpload")[0].files[0].size < 5242880)
						fd.append('pcbEstUpload', state.signupData.pcbEstUpload);
					else {
						alert("Pollution control board Registration Number for consent to Established Upload File size should not exceed 5MB");
						return false;
					}
					
				}
				
				if (state.signupData.pcbOperateUpload) {
					if (dom("#pcbOperateUpload")[0].files[0].size < 5242880)
						fd.append('pcbOperateUpload', state.signupData.pcbOperateUpload);
					else {
						alert("Pollution control board Registration Number for consent to Operate Upload File size should not exceed 5MB");
						return false;
					}
					
				}
				
				if (state.signupData.aoaUpload) {
					if (dom("#aoaUpload")[0].files[0].size < 5242880)
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
					if (dom("#moaUpload")[0].files[0].size < 5242880)
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
					if (dom("#cancelledChequeUpload")[0].files[0].size / 1024 < 513)
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
					if (dom("#specimenSignUpload")[0].files[0].size / 1024 < 513)
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
state.loadLetterPage = function() {
	loading.start('sample-1');
	var responsePromise = request.get('fetchusergroupsmap');
	responsePromise.success(function(data, status, headers, config) {
		state.assignedToSectionList = data;
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
	var responsePromise = request.get('fetchLetterDetail/' + params.letterId);
	responsePromise.success(function(data, status, headers, config) {
		state.letterData = data;
	});
	var responsePromise2 = request.get('getStatusList');
	responsePromise2.success(function(data, status, headers, config) {
		state.statusList = data;
	});
	var responsePromise3 = request.get('fetchusergroupsmap');
	responsePromise3.success(function(data, status, headers, config) {
		state.assignedToSectionList = data;
		loading.finish('sample-1');
	});
};
state.updateProcessSubmit = function(isValid) {
	if (!isValid) {
		return false;
	}
	state.letterId = params.letterId;
	state.requestProcessBean = state.requestProcessBean || {};
	state.requestProcessBean.letterId = params.letterId;
	loading.start('sample-1');
	var responsePromise = request.post('updateProcessSubmit', state.requestProcessBean);
	responsePromise.success(function(data, status, headers, config) {
		state.responseObject = data;
		if (state.responseObject && state.responseObject.successMessage != null) {
			navigation.location.href = '#letterList';
		}
		loading.finish('sample-1');
	});
};
state.loadHistoryByLetterId = function() {
	loading.start('sample-1');
	var responsePromise = request.get('fetchHistoryByLetterId/' + params.letterId);
	responsePromise.success(function(data, status, headers, config) {
		state.hearingList = data;
		loading.finish('sample-1');
	});
};
state.downloadDocument = function(documentId) {
	navigation.open('downloadDocument/' + documentId);
};
state.populateAssignToUsersInUpdate = function() {
	loading.start('sample-1');
	var responsePromise = request.get('fetchusersbygroupcode/' + (state.requestProcessBean && state.requestProcessBean.assigneeSection));
	responsePromise.success(function(data, status, headers, config) {
		state.assigneeList = data;
		loading.finish('sample-1');
	});
};

state.loadDate = () => {};
}
