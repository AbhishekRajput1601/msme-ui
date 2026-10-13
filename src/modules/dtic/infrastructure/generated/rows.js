export const rowRules = {
"dtic/dticVacantLandList": (cell,nRow,aData,iDataIndex) => {

								if (aData.industrialAreaMap) {
									cell('td:eq(1)', nRow)
											.html(
													'<b> Area: </b>'
															+ aData.industrialAreaName
															+ '<br/> <b>District: </b>'
															+ aData.districtName
															+ '<br/> <b>Tehsil: </b>'
															+ aData.tehsilName
															+ '<br/> <b>Location: </b>'
															+ aData.location
															+ '<br/> <a class="blue" href="javascript:downloadIndustrialAreaMap('
															+ '\''
															+ aData.locationId
															+ '\''
															+ ')"><span th:text="#{application.page.viewMap}" >Download/View Map</span></a>');
								} else {
									cell('td:eq(1)', nRow)
											.html(
													'<b> Area: </b>'
															+ aData.industrialAreaName
															+ '<br/> <b>District: </b>'
															+ aData.districtName
															+ '<br/> <b>Tehsil: </b>'
															+ aData.tehsilName
															+ '<br/> <b>Location: </b>'
															+ aData.location
															
															+ '<br/> (<b><span th:text="#{application.page.noMap}" >No Map Available</span></b>)');
								}

								if (aData.mapName && aData.googleMap
										&& aData.googleMap.trim() !== '') {
									
									cell('td:eq(21)', nRow)
											.html(
													'<div class="action-buttons">'
															+ '<a class="blue" href="javascript:downloadVacantLandMap(\''
															+ aData.vacantLandId
															+ '\')">'
															+ '<span th:text="#{application.page.viewMap}">Download/View Map</span>'
															+ '</a> | '
															+ '<a href="' + aData.googleMap + '" target="_blank">View Google Map</a>'
															+ '</div>');
								} else if (aData.mapName) {
									
									cell('td:eq(21)', nRow)
											.html(
													'<div class="action-buttons">'
															+ '<a class="blue" href="javascript:downloadVacantLandMap(\''
															+ aData.vacantLandId
															+ '\')">'
															+ '<span th:text="#{application.page.viewMap}">Download/View Map</span>'
															+ '</a>' + '</div>');
								} else if (aData.googleMap
										&& aData.googleMap.trim() !== '') {
									
									cell('td:eq(21)', nRow)
											.html(
													'<a href="' + aData.googleMap + '" target="_blank">View Google Map</a>');
								} else {
									
									cell('td:eq(21)', nRow).html(
											'No Map Available');
								}
								cell('td:eq(22)', nRow)
										.html(
												'<div class="action-buttons">'
														+ (aData.mapFileName
																&& aData.mapFileName
																		.trim() !== '' ? '<a class="blue" href="/mpmsme/idLanding/vacantLandListLanding1?vacantLandId='
																+ aData.vacantLandId
																+ '" target="_blank">View KML Map</a>'
																: '<span style="color: gray;">No KML uploaded</span>')
														+ '</div>');
								if (aData.isEditable) {

									cell('td:eq(23)', nRow)
											.html(
													'<div class="action-buttons"><a class="blue"  href="#id/editVacantLandDetail/'+aData.vacantLandId+'"><span th:text="#{application.page.Edit}"> Edit </span></a></div>');
									
								} else {
									

									cell('td:eq(23)', nRow)
											.html(
													'<div class="action-buttons"><a class="blue"  href="#id/viewAppliedApplicants/'+aData.vcId+'"><span th:text="#{application.page.Applicants}"> Applicants </span></a></div>');
									if (aData.hoStatus === 'Suspend') {
										cell('td:eq(23)', nRow)
												.html(
														'<div class="action-buttons"><a class="blue"  href="javascript:downloadHoldReleaseDoc('
																+ '\''
																+ aData.vacantLandId
																+ '\''
																+ ')"><span>TERMINATE Document</span></a></div>');
									} else if (aData.hoStatus === 'Hold') {
										cell('td:eq(23)', nRow)
												.html(
														'<div class="action-buttons"><a class="blue"  href="javascript:downloadHoldReleaseDoc('
																+ '\''
																+ aData.vacantLandId
																+ '\''
																+ ')"><span>Hold Document</span></a></div>');
									}
								}
								if (aData.bookingStarted) {
									cell('td:eq(16)', nRow)
											.html('Booking Started');
								}
								
								cell('td:eq(4)', nRow)
										.html(
												(aData.plotShed != null) ? aData.plotShed
														: "--");
								cell('td:eq(6)', nRow).html(
										parseFloat(aData.premiumCharges)
												.toFixed(2));
								cell('td:eq(7)', nRow).html(
										parseFloat(aData.developmentCharges)
												.toFixed(2));
								cell('td:eq(8)', nRow).html(
										parseFloat(aData.maintenanceCharges)
												.toFixed(2));
								cell('td:eq(9)', nRow).html(
										parseFloat(aData.leaseRent).toFixed(2));
								cell('td:eq(10)', nRow).html(
										parseFloat(aData.securityDeposit)
												.toFixed(2));
								cell('td:eq(11)', nRow).html(
										parseFloat(aData.advanceRent || 0.00)
												.toFixed(2));
								cell('td:eq(12)', nRow).html(
										parseFloat(
												aData.otherRentCharges || 0.00)
												.toFixed(2));
								cell('td:eq(13)', nRow).html(
										parseFloat(aData.totalAmount)
												.toFixed(2));
								cell('td:eq(14)', nRow).html(
										parseFloat(aData.premiumCharges * 0.25)
												.toFixed(2));

								cell('td:eq(15)', nRow)
										.html(
												(aData.bookingStartDate != null) ? aData.bookingStartDate
														: "");
								cell('td:eq(16)', nRow)
										.html(
												(aData.bookingEndDate != null) ? aData.bookingEndDate
														: "");
								cell('td:eq(18)', nRow).html(aData.newArea);
								cell('td:eq(19)', nRow).html(
										aData.industrialCategoryName);

							
},
"dtic/id/applicantListForNotice": (cell,nRow,aData,iDataIndex) => {

        	cell('td:eq(4)', nRow).html('<b>Industrial Area: </b>' + aData.vacantLandBean.industrialAreaName + '<br/> <b>District: </b>' +aData.vacantLandBean.districtName + '<br/> <b>Tehsil: </b>'+ aData.vacantLandBean.tehsilName);
        	if(aData.idNoticeBean!=null){
        		if(aData.idNoticeBean.complianceStatus)
        			cell('td:eq(7)', nRow).html('<a class="blue" href="#viewNoticeHistory/'+aData.idNoticeBean.noticeId+'"><span th:text="#{application.id.viewNoticeHistory}">View/Print Notice History</span></a>');
        		else
        			cell('td:eq(7)', nRow).html('<a class="blue" href="#reviewCompliance/'+aData.idNoticeBean.noticeId+'"><span th:text="#{application.id.reviewCompliance}">Review Compliance</span></a>');
        	}else{
        		cell('td:eq(7)', nRow).html('<a class="blue" href="#viewIssueNotice/'+aData.applicantId+'"><span th:text="#{application.id.issueNotice}">Issue Notice</span></a>');	        		
        	}
        	if (aData.statusId==15 && aData.idNoticeBean?.zoAppealBean!=null && aData.idNoticeBean?.zoAppealBean.finalDecisionHearingBean && (aData.idNoticeBean?.zoAppealBean.statusId==23 || aData.idNoticeBean?.zoAppealBean.statusId==26)) {
        		
        		cell('td:eq(7)', nRow).append(' | <a class="blue" href="#viewZOAppeal/'+aData.idNoticeBean?.zoAppealBean.appealId+'"><span th:text="#{application.id.viewZOAppeal}">View ZO Appeal</span></a>');
        		
        		if(aData.idNoticeBean?.zoAppealBean.finalDecisionHearingBean.isTimeFrameExpired==true){
        			cell('td:eq(7)', nRow).append(' | <a class="blue" href="#reviewConditionalComplianceZO/'+aData.idNoticeBean?.zoAppealBean.finalDecisionHearingBean.appealHearingId+'"><span th:text="#{application.id.reviewConditionalComplianceZO}">Review ZO Conditional decision compliance</span></a>');	
        		}else if(aData.idNoticeBean?.zoAppealBean.finalDecisionHearingBean.appealConditionalDecisionZOBean!=null){
        			cell('td:eq(7)', nRow).append(' | <a class="blue" href="#reviewConditionalComplianceZO/'+aData.idNoticeBean?.zoAppealBean.finalDecisionHearingBean.appealHearingId+'/'+aData.idNoticeBean?.zoAppealBean.finalDecisionHearingBean.appealConditionalDecisionZOBean.decisionId+'"><span th:text="#{application.id.reviewConditionalComplianceZO}">Review ZO Conditional decision compliance</span></a>');
        		}
        	}else if((aData.statusId==15 || aData.statusId==18) && aData.idNoticeBean?.zoAppealBean!=null && aData.idNoticeBean?.zoAppealBean.finalDecisionHearingBean!=null && aData.idNoticeBean?.zoAppealBean.finalDecisionHearingBean.appealConditionalDecisionZOBean!=null){
        		cell('td:eq(7)', nRow).append(' | <a class="blue" href="#viewZOAppeal/'+aData.idNoticeBean?.zoAppealBean.appealId+'"><span th:text="#{application.id.viewZOAppeal}">View ZO Appeal</span></a>');
        		cell('td:eq(7)', nRow).append(' | <a class="blue" href="#viewConditionalDecisionZO/'+aData.idNoticeBean?.zoAppealBean.finalDecisionHearingBean.appealConditionalDecisionZOBean.appealHearingId+'/'+aData.idNoticeBean?.zoAppealBean.finalDecisionHearingBean.appealConditionalDecisionZOBean.decisionId+'"><span th:text="#{application.id.viewZOConditionalDecision}">View ZO Conditional decision</span></a>');
        	}
        	
        	if (aData.statusId==15 && aData.idNoticeBean?.icAppealBean!=null && aData.idNoticeBean?.icAppealBean.finalDecisionHearingBean && (aData.idNoticeBean?.icAppealBean.statusId==32 || aData.idNoticeBean?.icAppealBean.statusId==34)) {
        		
        		cell('td:eq(7)', nRow).append(' | <a class="blue" href="#viewICAppeal/'+aData.idNoticeBean?.icAppealBean.appealId+'"><span th:text="#{application.id.viewICAppeal}">View IC Appeal</span></a>');
        		
        		if(aData.idNoticeBean?.icAppealBean.finalDecisionHearingBean.isTimeFrameExpired==true){
        			cell('td:eq(7)', nRow).append(' | <a class="blue" href="#reviewConditionalComplianceIC/'+aData.idNoticeBean?.icAppealBean.finalDecisionHearingBean.appealHearingId+'"><span th:text="#{application.id.reviewConditionalComplianceIC}">Review IC Conditional decision compliance</span></a>');	
        		}else if(aData.idNoticeBean?.icAppealBean.finalDecisionHearingBean.appealConditionalDecisionICBean!=null){
        			cell('td:eq(7)', nRow).append(' | <a class="blue" href="#reviewConditionalComplianceIC/'+aData.idNoticeBean?.icAppealBean.finalDecisionHearingBean.appealHearingId+'/'+aData.idNoticeBean?.icAppealBean.finalDecisionHearingBean.appealConditionalDecisionICBean.decisionId+'"><span th:text="#{application.id.reviewConditionalComplianceIC}">Review IC Conditional decision compliance</span></a>');
        		}
        	}else if((aData.statusId==15 || aData.statusId==18) && aData.idNoticeBean?.icAppealBean!=null && aData.idNoticeBean?.icAppealBean.finalDecisionHearingBean!=null && aData.idNoticeBean?.icAppealBean.finalDecisionHearingBean.appealConditionalDecisionICBean!=null){
        		
        		cell('td:eq(7)', nRow).append(' | <a class="blue" href="#viewICAppeal/'+aData.idNoticeBean?.icAppealBean.appealId+'"><span th:text="#{application.id.viewICAppeal}">View IC Appeal</span></a>');
        		
        		cell('td:eq(7)', nRow).append(' | <a class="blue" href="#viewConditionalDecisionIC/'+aData.idNoticeBean?.icAppealBean.finalDecisionHearingBean.appealConditionalDecisionICBean.appealHearingId+'/'+aData.idNoticeBean?.icAppealBean.finalDecisionHearingBean.appealConditionalDecisionICBean.decisionId+'"><span th:text="#{application.id.viewICConditionalDecision}">View IC Conditional decision</span></a>');
        	}
      
}
}
