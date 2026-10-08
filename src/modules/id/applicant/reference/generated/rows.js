// Static port of the original fnCreatedRow branches; no jQuery or eval.
export const rowRules = {
vacantLandList(cell,nRow,aData,iDataIndex) {
								
								cell('td:eq(5)', nRow)
										.html(
												Math
														.round(parseFloat(aData.premiumCharges)));
								cell('td:eq(16)', nRow).html(aData.category);
								cell('td:eq(17)', nRow).html(aData.newArea);
								cell('td:eq(18)', nRow).html(
										aData.industrialCategoryName);
								cell('td:eq(6)', nRow)
										.html(
												Math
														.round(parseFloat(aData.developmentCharges)));
								cell('td:eq(7)', nRow)
										.html(
												Math
														.round(parseFloat(aData.maintenanceCharges)));
								cell('td:eq(8)', nRow)
										.html(
												Math
														.round(parseFloat(aData.leaseRent)));
								cell('td:eq(9)', nRow)
										.html(
												Math
														.round(parseFloat(aData.securityDeposit)));
								cell('td:eq(10)', nRow)
										.html(
												Math
														.round(parseFloat(aData.advanceRent || 0.00)));
								cell('td:eq(11)', nRow)
										.html(
												Math
														.round(parseFloat(aData.otherRentCharges || 0.00)));
								cell('td:eq(12)', nRow)
										.html(
												Math
														.round(parseFloat(aData.totalAmount)));
								cell('td:eq(13)', nRow)
										.html(
												Math
														.round(parseFloat(aData.premiumCharges * 0.25)));
								
								
								
								
								
								
								
								

								if (aData.industrialAreaMap) {
									cell('td:eq(1)', nRow)
											.html(
													'<b> Area: </b>'
															+ aData.industrialAreaName
															+ '<br/> <b>District:</b>'
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
													'<b>Industrial Area: </b>'
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
									
									cell('td:eq(20)', nRow)
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
									
									cell('td:eq(20)', nRow)
											.html(
													'<div class="action-buttons">'
															+ '<a class="blue" href="javascript:downloadVacantLandMap(\''
															+ aData.vacantLandId
															+ '\')">'
															+ '<span th:text="#{application.page.viewMap}">Download/View Map</span>'
															+ '</a>' + '</div>');
								} else if (aData.googleMap
										&& aData.googleMap.trim() !== '') {
									
									cell('td:eq(20)', nRow)
											.html(
													'<a href="' + aData.googleMap + '" target="_blank">View Google Map</a>');
								} else {
									
									cell('td:eq(20)', nRow).html(
											'No Map Available');
								}
								cell('td:eq(21)', nRow)
										.html(
												'<div class="action-buttons">'
														+ (aData.mapFileName
																&& aData.mapFileName
																		.trim() !== '' ? '<a class="blue" href="/mpmsme/idLanding/vacantLandListLanding1?vacantLandId='
																+ aData.vacantLandId
																+ '" target="_blank">View KML Map</a>'
																: '<span style="color: gray;">No KML uploaded</span>')
														+ '</div>');

								if (aData.alreadyApplied) {
									cell('td:eq(22)', nRow)
											.html('Already Applied');
									

								}else if (aData.bookingClosed) {
									cell('td:eq(22)', nRow).html('Booking Closed');
								}
								else if (aData.hoStatus === 'Release'
									&& aData.commingSoon) {
								cell('td:eq(22)', nRow).html('Coming Soon');
							}
								else if (aData.commingSoon) {

									cell('td:eq(22)', nRow).html('Coming Soon');

								}
								else if (null != aData.totalApplicationReceived
										&& aData.totalApplicationReceived > 0) {
									
									
									cell('td:eq(22)', nRow)
											.html(
													'<div class="action-buttons"><a class="blue" href="#/id/idInstruction/0/' + aData.vcId + '"><span>Apply</span></a></div>');

								} else if (aData.active) {
									cell('td:eq(22)', nRow)
											.html(
													'<div class="action-buttons"><a class="blue" href="#/id/idInstruction/0/' + aData.vcId + '"><span>Apply</span></a></div>');

								} 

								
								
								if (aData.hoStatus === 'Hold') {
									
									cell('td:eq(22)', nRow)
											.html(
													'<div class="action-buttons">WITHELD <a class="blue"  href="javascript:downloadHoldReleaseDoc('
															+ '\''
															+ aData.vcId
															+ '\''
															+ ')"><span>DOCUMENT</span></a></div>');
								} else if (aData.hoStatus === 'Suspend') {
									
									cell('td:eq(22)', nRow)
											.html(
													'<div class="action-buttons">TERMINATE <a class="blue"  href="javascript:downloadHoldReleaseDoc('
															+ '\''
															+ aData.vcId
															+ '\''
															+ ')"><span>DOCUMENT</span></a></div>');
								} 

							},
vacantLandListUN(cell,nRow,aData,iDataIndex) {
								
								cell('td:eq(5)', nRow)
										.html(
												Math
														.round(parseFloat(aData.premiumCharges)));
								
								
								cell('td:eq(13)', nRow).html(
										aData.industrialCategoryName);
								
								
								cell('td:eq(6)', nRow)
										.html(
												Math
														.round(parseFloat(aData.leaseRent)));
								cell('td:eq(7)', nRow)
										.html(
												Math
														.round(parseFloat(aData.securityDeposit)));
								
								cell('td:eq(8)', nRow).html(Math.round(parseFloat(aData.otherRentCharges || 0.00)));
								cell('td:eq(9)', nRow)
										.html(
												Math
														.round(parseFloat(aData.totalAmount)));
								cell('td:eq(10)', nRow)
										.html(
												Math
														.round(parseFloat(aData.premiumCharges * 0.25)));
								
								
								
								
								
								
								
								

								if (aData.industrialAreaMap) {
									cell('td:eq(1)', nRow)
											.html(
													'<b> Area: </b>'
															+ aData.industrialAreaName
															+ '<br/> <b>District:</b>'
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
													'<b>Industrial Area: </b>'
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
									
									cell('td:eq(15)', nRow)
											.html(
													'<div class="action-buttons">'
															+ '<a class="blue" href="javascript:downloadVacantLandMap(\''
															+ aData.vacantLandId
															+ '\')">'
															+ '<span th:text="#{application.page.viewMap}">Download/View Map</span>'
															+ '</a> | '
															+ '<a href="' + aData.googleMap + '" target="_blank">View Map</a>'
															+ '</div>');
								} else if (aData.mapName) {
									
									cell('td:eq(15)', nRow)
											.html(
													'<div class="action-buttons">'
															+ '<a class="blue" href="javascript:downloadVacantLandMap(\''
															+ aData.vacantLandId
															+ '\')">'
															+ '<span th:text="#{application.page.viewMap}">Download/View Map</span>'
															+ '</a>' + '</div>');
								} else if (aData.googleMap
										&& aData.googleMap.trim() !== '') {
									
									cell('td:eq(15)', nRow)
											.html(
													'<a href="' + aData.googleMap + '" target="_blank">View Map</a>');
								} else {
									
									cell('td:eq(15)', nRow).html(
											'No Map Available');
								}
								cell('td:eq(16)', nRow)
										.html(
												'<div class="action-buttons">'
														+ (aData.mapFileName
																&& aData.mapFileName
																		.trim() !== '' ? '<a class="blue" href="/mpmsme/idLanding/vacantLandListLanding1?vacantLandId='
																+ aData.vacantLandId
																+ '" target="_blank">Indicative Plot Map (KML)</a>'
																: '<span style="color: gray;">No KML uploaded</span>')
														+ '</div>');

								if (aData.alreadyApplied) {
									cell('td:eq(17)', nRow)
											.html('Already Applied');
									

								} else if (aData.bookingClosed) {
									cell('td:eq(17)', nRow).html('Booking Closed');
								} else if (aData.hoStatus === 'Release'
										&& aData.commingSoon) {
									cell('td:eq(17)', nRow).html('Coming Soon');
								} else if (aData.commingSoon) {

									cell('td:eq(17)', nRow).html('Coming Soon');

								} else if (null != aData.totalApplicationReceived
										&& aData.totalApplicationReceived > 0) {
									
									
									cell('td:eq(17)', nRow)
											.html(
													'<div class="action-buttons"><a class="blue" href="#/id/idInstructionUL/0/' + aData.vcId + '"><span>Apply</span></a></div>');

								} else if (aData.active) {
									cell('td:eq(17)', nRow)
											.html(
													'<div class="action-buttons"><a class="blue" href="#/id/idInstructionUL/0/' + aData.vcId + '"><span>Apply</span></a></div>');

								}

								
								if (aData.hoStatus === 'Hold') {
									
									cell('td:eq(17)', nRow)
											.html(
													'<div class="action-buttons">WITHELD <a class="blue"  href="javascript:downloadHoldReleaseDoc('
															+ '\''
															+ aData.vcId
															+ '\''
															+ ')"><span>DOCUMENT</span></a></div>');
								} else if (aData.hoStatus === 'Suspend') {
									
									cell('td:eq(17)', nRow)
											.html(
													'<div class="action-buttons">TERMINATE <a class="blue"  href="javascript:downloadHoldReleaseDoc('
															+ '\''
															+ aData.vcId
															+ '\''
															+ ')"><span>DOCUMENT</span></a></div>');
								}

							},
applicationList(cell,nRow,aData,iDataIndex) {
        	
        	
        	cell('td:eq(3)', nRow).html('<b>Industrial Area: </b>' + (aData.vacantLandBean.industrialAreaName?aData.vacantLandBean.industrialAreaName:"-") + '<br/> <b>District: </b>' +aData.vacantLandBean.districtName + '<br/> <b>Tehsil: </b>'+ aData.vacantLandBean.tehsilName);
        	
        	
        	
        	if(aData.ctPaymentBean!=null){
        		cell('td:eq(6)', nRow).html('<b>CRN: </b>' + (aData.ctPaymentBean.crn!=null ? aData.ctPaymentBean.crn : "NA") + '<br/> <b>CIN: </b>' + (aData.ctPaymentBean.cin!=null ? aData.ctPaymentBean.cin : "NA") + '<br/> <b>Payment Date: </b>'+ (aData.ctPaymentBean.transactionDateTime!=null ? aData.ctPaymentBean.transactionDateTime : "NA") + '<br/> <b>Total Amount: </b>' + (aData.ctPaymentBean.amount!=null ? aData.ctPaymentBean.amount : "NA")+ '<br/> <b>Status: </b>' + (aData.ctPaymentBean.status!=null ? aData.ctPaymentBean.status : "NA"));
        		if(aData.statusId==11 || aData.statusId==15 ||aData.statusId==16 ||aData.statusId==17 ||aData.statusId==18){
        			cell('td:eq(6)', nRow).append('<div class="action-buttons"><a class="blue" href="#id/viewAnnualPaymentHistory/'+aData.applicantId+'"><span th:text="#{application.id.viewAnnualPaymentHistory}" >View Annual Payment History</span></a></div> ');
        		}
        	}else{
        		cell('td:eq(6)', nRow).html('NA');
        	}
        	
        	var status = aData.statusId;
        	cell('td:eq(8)', nRow).html(aData.dticComments && aData.dticComments.trim() !== '' ? aData.dticComments : '-');

        	
        	if(status==5){
        		
        		cell('td:eq(9)', nRow).html('<span class="action-buttons"><a class="blue" href="#id/viewApplicationDetail/'+aData.applicantId+'/'+aData.vacantLandId+'"><span th:text="#{application.page.viewFilledForm}" >View</span></a> | <a class="blue" title="Progress Details" href="#id/viewIdHistory/'+aData.applicantId+'"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="#id/queryReplyByApplicant/'+aData.applicantId+'/'+aData.vacantLandIDEncrypt+'"><span th:text="#{application.page.queryReply}" >Query Reply</span></a></span> ');
        	}
        	else if(status==7){
        		cell('td:eq(9)', nRow).html('<span class="action-buttons"><a class="blue" href="#id/viewApplicationDetail/'+aData.applicantId+'/'+aData.vacantLandId+'"><span th:text="#{application.page.viewFilledForm}" >View</span></a> | <a class="blue" title="Progress Details" href="#id/viewIdHistory/'+aData.applicantId+'"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadLOILetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadLOI}" >Download LOI</span></a> | <a class="blue" href="#uploadLOC/'+aData.applicantId+'"><span th:text="#{application.page.uploadLOC}" >Upload LOC</span></a></span> ');
        	}
        	else if(status==8){
        		cell('td:eq(9)', nRow).html('<span class="action-buttons"><a class="blue" href="#id/viewApplicationDetail/'+aData.applicantId+'/'+aData.vacantLandId+'"><span th:text="#{application.page.viewFilledForm}" >View</span></a> | <a class="blue" title="Progress Details" href="#id/viewIdHistory/'+aData.applicantId+'"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadLOILetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadLOI}" >Download LOI</span></a> | <a class="blue" href="#viewLOCDetails/'+aData.applicantId+'"><span th:text="#{application.id.viewLOCDetails}" >View LOC Details</span></a></span>');
        	}
        	else if(status==9){
        		cell('td:eq(9)', nRow).html('<span class="action-buttons"><a class="blue" href="#id/viewApplicationDetail/'+aData.applicantId+'/'+aData.vacantLandId+'"><span th:text="#{application.page.viewFilledForm}" >View</span></a> | <a class="blue" title="Progress Details" href="#id/viewIdHistory/'+aData.applicantId+'"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadLOILetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadLOI}" >Download LOI</span></a> | <a class="blue" href="#viewLOCDetails/'+aData.applicantId+'"><span th:text="#{application.id.viewLOCDetails}" >View LOC Details</span></a> | <a class="blue" href="javascript:downloadAllotmentLetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadAllotmentLetter}" >Download Allotment Letter</span></a></span> ');
        	}
        	else if(status==10){
        		cell('td:eq(9)', nRow).html('<span class="action-buttons"><a class="blue" href="#id/viewApplicationDetail/'+aData.applicantId+'/'+aData.vacantLandId+'"><span th:text="#{application.page.viewFilledForm}" >View</span></a> | <a class="blue" title="Progress Details" href="#id/viewIdHistory/'+aData.applicantId+'"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadLOILetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadLOI}" >Download LOI</span></a> | <a class="blue" href="#viewLOCDetails/'+aData.applicantId+'"><span th:text="#{application.id.viewLOCDetails}" >View LOC Details</span></a> | <a class="blue" href="javascript:downloadAllotmentLetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadAllotmentLetter}" >Download Allotment Letter</span></a> | <a class="blue" href="javascript:downloadLeaseLetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadLease}" >Download Lease</span></a> | <a class="blue" href="#id/updatePossessionLetter/'+aData.applicantId+'/'+aData.vacantLandId+'"> Upload Possession Letter</a> </span> ');
        	}
        	else if(status==11 || status==15 || status==16 || status==17 || status==18){
        		cell('td:eq(9)', nRow).html('<span class="action-buttons"><a class="blue" href="#id/viewApplicationDetail/'+aData.applicantId+'/'+aData.vacantLandId+'"><span th:text="#{application.page.viewFilledForm}" >View</span></a> | <a class="blue" title="Progress Details" href="#id/viewIdHistory/'+aData.applicantId+'"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> |  <a class="blue" href="javascript:downloadLOILetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadLOI}" >Download LOI</span></a> | <a class="blue" href="#viewLOCDetails/'+aData.applicantId+'"><span th:text="#{application.id.viewLOCDetails}" >View LOC Details</span></a> | <a class="blue" href="javascript:downloadAllotmentLetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadAllotmentLetter}" >Download Allotment Letter</span></a> | <a class="blue" href="javascript:downloadLeaseLetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadLease}" >Download Lease</span></a> | <a class="blue" href="javascript:downloadPossessionLetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadPossession}" >Download Possession Letter</span></a></span>');
        	}
        	else if(status==39 || status==40){
        		cell('td:eq(9)', nRow).html('<span class="action-buttons"><a class="blue" href="#id/viewApplicationDetail/'+aData.applicantId+'/'+aData.vacantLandId+'"><span th:text="#{application.page.viewFilledForm}" >View</span></a> | <a class="blue" title="Progress Details" href="#id/viewIdHistory/'+aData.applicantId+'"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadLOILetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadLOI}" >Download LOI</span></a> | <a class="blue" href="#uploadLOC/'+aData.applicantId+'"><span th:text="#{application.page.uploadLOC}" >Upload LOC</span></a> | <a class="blue" href="javascript:downloadCommitteeLetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadCommittee}" >Download Committee Decision</span></a></span> ');
        	}
        	else if(status==41){
        		cell('td:eq(9)', nRow).html('<span class="action-buttons"><a class="blue" href="#id/viewApplicationDetail/'+aData.applicantId+'/'+aData.vacantLandId+'"><span th:text="#{application.page.viewFilledForm}" >View</span></a> | <a class="blue" title="Progress Details" href="#id/viewIdHistory/'+aData.applicantId+'"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="#id/tenderDetails/'+aData.vacantLandId+'"><span >Tender Details</span></a> </span> ');        	}
        	else if(status==42){
        		cell('td:eq(9)', nRow).html('<span class="action-buttons"><a class="blue" href="#id/viewApplicationDetail/'+aData.applicantId+'/'+aData.vacantLandId+'"><span th:text="#{application.page.viewFilledForm}" >View</span></a> | <a class="blue" title="Progress Details" href="#id/viewIdHistory/'+aData.applicantId+'"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> |  <a class="blue" href="javascript:downloadLOILetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadLOI}" >Download LOI</span></a> | <a class="blue" href="#viewLOCDetails/'+aData.applicantId+'"><span th:text="#{application.id.viewLOCDetails}" >View LOC Details</span></a> | <a class="blue" href="javascript:downloadAllotmentLetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadAllotmentLetter}" >Download Allotment Letter</span></a> | <a class="blue" href="javascript:downloadLeaseLetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadLease}">Download Lease</span></a> </span>');
        	}
        	else if(status==44){
        		cell('td:eq(9)', nRow).html('<span class="action-buttons"><a class="blue" href="#id/viewApplicationDetail/'+aData.applicantId+'/'+aData.vacantLandId+'"><span th:text="#{application.page.viewFilledForm}" >View</span></a> | <a class="blue" href="javascript:downloadLOILetter('+'\''+aData.applicantId+'\''+')"><span th:text="#{application.page.downloadLOI}" >Download LOI</span></a>|<a class="blue" title="Progress Details" href="#id/viewIdHistory/'+aData.applicantId+'"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a></span> ');
        	}
        	else if(status==1){
        		
        		cell('td:eq(9)', nRow).html('<span class="action-buttons"><a class="blue" href="#id/viewApplyForLandForm/'+aData.applicantId+'/'+aData.vacantLandIDEncrypt+'"><span th:text="#{application.page.completeIncompleteForm}" >View Form/ Upload Documents</span></a></span> ');
        	}
        	else {
        		cell('td:eq(9)', nRow).html('<span class="action-buttons"><a class="blue" href="#id/viewApplicationDetail/'+aData.applicantId+'/'+aData.vacantLandId+'"><span th:text="#{application.page.viewFilledForm}" >View</span></a> | <a class="blue" title="Progress Details" href="#id/viewIdHistory/'+aData.applicantId+'"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a></span> ');
        	}
        	
        	if (status>=2 && aData.ctPaymentBean!=null) {
        		cell('td:eq(9)', nRow).append(' | <a class="blue" href="#id/paymentReceipt/'+aData.ctPaymentBean.crn+'"><span th:text="#{application.page.paymentReceipt}" >Payment Receipt</span></a>');
        	}
        	 if(status>=2 && aData.ctPaymentBean!=null){
        		 if(aData.signedApplicationFormUploadDocId==null){
        				cell('td:eq(9)', nRow).append(' | <a class="blue" href="#id/viewESignApplicationDetail/'+aData.applicantId+'/'+aData.vacantLandIDEncrypt+'">eSign Application</a>');
            	        }
        				 else{
        				 cell('td:eq(9)', nRow).append(' | <a class="blue" href="javascript:downloadEsignedApplicationForm('+'\''+aData.signedApplicationFormUploadDocId+'\''+')">Download Esigned EOI Form</a>');
        				 }
        	}
        	
        	
        	
        	
      },
annualPayments(cell,nRow,aData,iDataIndex) {        	
        	
        	cell('td:eq(8)', nRow).html('<a class="blue" href="#id/viewAnnualPaymentHistory/'+aData.applicantId+'"><span th:text="#{application.id.paymentHistory}">Payment History</span></a> | <a class="blue" href="#id/applicantAnnualPayment/'+aData.applicantId+'/'+aData.vacantLandId+'"><span th:text="#{application.page.makePayment}">Make Payment</span></a>');
        	
      },
noticeAppealList(cell,nRow,aData,iDataIndex) {
        	cell('td:eq(4)', nRow).html('<b>Industrial Area: </b>' + aData.vacantLandBean.industrialAreaName + '<br/> <b>District: </b>' +aData.vacantLandBean.districtName + '<br/> <b>Tehsil: </b>'+ aData.vacantLandBean.tehsilName);
        	if (aData.idNoticeBean.statusId==16) {
        		if (aData.idNoticeBean.noticeDaysLeft<=0) {
        			cell('td:eq(7)', nRow).html('<span th:text="#{application.id.noticeExpired}">Notice Expired</span>');	
        		} else {
        			cell('td:eq(7)', nRow).html('<a class="blue" href="#id/enterCompliance/'+aData.idNoticeBean.noticeId+'"><span th:text="#{application.id.enterCompliance}">Enter Compliance</span></a> <span style="color:brown;">('+((aData.idNoticeBean.noticeDaysLeft>1)?(aData.idNoticeBean.noticeDaysLeft+' days'):(aData.idNoticeBean.noticeDaysLeft+' day'))+ ' remaining)</span>');	
        		}       			
       		} else if (aData.idNoticeBean.statusId==17 && aData.statusId==17) {
       			cell('td:eq(7)', nRow).html('<a class="blue" href="#id/viewCompliance/'+aData.idNoticeBean.noticeId+'"><span th:text="#{application.id.viewCompliance}">View Compliance</span></a>');
       		} else if(aData.statusId==15 || aData.statusId==18 || aData.idNoticeBean.statusId==19) {
       			cell('td:eq(7)', nRow).html('<a class="blue" href="#id/viewCompliance/'+aData.idNoticeBean.noticeId+'"><span th:text="#{application.id.viewNoticeHistory}">View/Print Notice History</span></a>');
       		}
        	
        	if (aData.statusId==15 && aData.idNoticeBean.statusId==17) {
        		cell('td:eq(7)', nRow).append(' | <a class="blue" href="#id/newAppeal/'+aData.idNoticeBean.noticeId+'"><span th:text="#{application.id.appealToZO}">Appeal to ZO</span></a>');
        	} else if (aData.idNoticeBean.zoAppealId!=null) {
        		cell('td:eq(7)', nRow).append(' | <a class="blue" href="#id/viewAppeal/'+aData.idNoticeBean.zoAppealId+'"><span th:text="#{application.id.viewZOAppealDetails}">View ZO Appeal Details</span></a>');	
        	}

        	if (aData.statusId==15 && aData.idNoticeBean.zoAppealBean!=null && aData.idNoticeBean.zoAppealBean.statusId==23) {
        		if (aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.timeFrameDaysLeft<=0) {
        			cell('td:eq(7)', nRow).append(' | <span th:text="#{application.id.zoTimeFrameExpired}">ZO Conditional decision Timeframe Expired</span>');	
        		}else{
        			cell('td:eq(7)', nRow).append(' | <a class="blue" href="#id/enterConditionalComplianceZO/'+aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.appealHearingId+'"><span th:text="#{application.id.enterZOConditionalDecisionCompliance}">Enter ZO Conditional decision compliance</span></a><span style="color:brown;">('+((aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.timeFrameDaysLeft>1)?(aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.timeFrameDaysLeft+' days'):(aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.timeFrameDaysLeft+' day'))+ ' remaining)</span>');
        		}
        	}else if((aData.statusId==15 || aData.statusId==18) && aData.idNoticeBean.zoAppealBean!=null && aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean!=null && aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.appealConditionalDecisionZOBean!=null){
        		cell('td:eq(7)', nRow).append(' | <a class="blue" href="#id/viewConditionalDecisionZO/'+aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.appealConditionalDecisionZOBean.appealHearingId+'/'+aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.appealConditionalDecisionZOBean.decisionId+'"><span th:text="#{application.id.viewZOConditionalDecision}">View ZO Conditional decision</span></a>');
        	}
        	
        	if (aData.statusId==15 && aData.idNoticeBean.statusId==22) {
        		cell('td:eq(7)', nRow).append(' | <a class="blue" href="#id/newAppealForIC/'+aData.idNoticeBean.noticeId+'"><span th:text="#{application.id.appealToIC}">Appeal to IC</span></a>');        		
        	} else if (aData.idNoticeBean.icAppealId!=null) {
        		cell('td:eq(7)', nRow).append(' | <a class="blue" href="#id/viewAppealForIC/'+aData.idNoticeBean.icAppealId+'"><span th:text="#{application.id.viewICAppealDetails}">View IC Appeal Details</span></a>');
        	}
        	
        	if (aData.statusId==15 && aData.idNoticeBean.icAppealBean!=null && aData.idNoticeBean.icAppealBean.statusId==32) {
        		if (aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.timeFrameDaysLeft<=0) {
        			cell('td:eq(7)', nRow).append(' | <span th:text="#{application.id.icTimeFrameExpired}">IC Conditional decision Timeframe Expired</span>');	
        		}else{
        			cell('td:eq(7)', nRow).append(' | <a class="blue" href="#id/enterConditionalComplianceIC/'+aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.appealHearingId+'"><span th:text="#{application.id.enterICConditionalDecisionCompliance}">Enter IC Conditional decision compliance</span></a><span style="color:brown;">('+((aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.timeFrameDaysLeft>1)?(aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.timeFrameDaysLeft+' days'):(aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.timeFrameDaysLeft+' day'))+ ' remaining)</span>');
        		}
        	}else if((aData.statusId==15 || aData.statusId==18) && aData.idNoticeBean.icAppealBean!=null && aData.idNoticeBean.icAppealBean.finalDecisionHearingBean!=null && aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.appealConditionalDecisionICBean!=null){
        		cell('td:eq(7)', nRow).append(' | <a class="blue" href="#id/viewConditionalDecisionIC/'+aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.appealConditionalDecisionICBean.appealHearingId+'/'+aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.appealConditionalDecisionICBean.decisionId+'"><span th:text="#{application.id.viewICConditionalDecision}">View IC Conditional decision</span></a>');
        	}
        	
      }
}
