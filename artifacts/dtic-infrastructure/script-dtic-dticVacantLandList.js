

	function downloadVacantLandMap(vacantLandId) {
		window.open('downloadVacantLandMap/' + vacantLandId);
	}
	function downloadHoldReleaseDoc(vacantLandId) {
		window.open('downloadHoldReleaseDoc/' + vacantLandId);
	}
	function downloadIndustrialAreaMap(locationId) {
		window.open('downloadIndustrialAreaMap/' + locationId);
	}
	
	function fetchApplicants(vacantLandId) {
		$.ajax({
			url : '#id/viewAppliedApplicants',
			type : 'POST',
			data : {
				id : vacantLandId
			},
			success : function(response) {
				
				console.log("Applicants fetched successfully.");
			},
			error : function() {
				
				console.log("Error fetching applicants.");
			}
		});
	}
	
	
	jQuery.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings) {
		return {
			"iStart" : oSettings._iDisplayStart,
			"iEnd" : oSettings.fnDisplayEnd(),
			"iLength" : oSettings._iDisplayLength,
			"iTotal" : oSettings.fnRecordsTotal(),
			"iFilteredTotal" : oSettings.fnRecordsDisplay(),
			"iPage" : oSettings._iDisplayLength === -1 ? 0 : Math
					.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
			"iTotalPages" : oSettings._iDisplayLength === -1 ? 0 : Math
					.ceil(oSettings.fnRecordsDisplay()
							/ oSettings._iDisplayLength)
		};
	};
	var t = null;

function formatPlotNumbers(text) {
    if (!text || text.trim() === '') return '-';

    var html = '';
    for (var i = 0; i < text.length; i++) {
        html += text[i];

        if ((i + 1) % 27 === 0) {
            html += '<br>';
        }
    }
    return html;
}
	function fetchLandAllotmentList() {

		if (!$.fn.DataTable.isDataTable('#dynamic-table')) {
		     $('#dynamic-table').DataTable().destroy();
		}
	
		t = $("#dynamic-table")
				.dataTable(
						{
							"bProcessing" : true,
							"bServerSide" : true,
							"sort" : "position",
							
							"bStateSave" : false,
							
							"iDisplayLength" : 10,
							
							"iDisplayStart" : 0,
							"aaSorting" : [],
							"pagingType" : "full_numbers",
							"fnDrawCallback" : function() {

								angular.element('#StartOrFinishSpinnerId')
										.scope().startOrStopSpinner(false);

								
								
								
								
							},
							"fnServerParams" : function(aoData) {

								aoData.push({
									"name" : "industrialArea",
									"value" : $('#selectindustrialArea').val()
								});

							},
							"fnCreatedRow" : function(nRow, aData, iDataIndex) {
								if (aData.industrialAreaMap) {
									$('td:eq(1)', nRow)
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
									$('td:eq(1)', nRow)
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
									
									$('td:eq(21)', nRow)
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
									
									$('td:eq(21)', nRow)
											.html(
													'<div class="action-buttons">'
															+ '<a class="blue" href="javascript:downloadVacantLandMap(\''
															+ aData.vacantLandId
															+ '\')">'
															+ '<span th:text="#{application.page.viewMap}">Download/View Map</span>'
															+ '</a>' + '</div>');
								} else if (aData.googleMap
										&& aData.googleMap.trim() !== '') {
									
									$('td:eq(21)', nRow)
											.html(
													'<a href="' + aData.googleMap + '" target="_blank">View Google Map</a>');
								} else {
									
									$('td:eq(21)', nRow).html(
											'No Map Available');
								}
								$('td:eq(22)', nRow)
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

									$('td:eq(23)', nRow)
											.html(
													'<div class="action-buttons"><a class="blue"  href="#id/editVacantLandDetail/'+aData.vacantLandId+'"><span th:text="#{application.page.Edit}"> Edit </span></a></div>');
									
								} else {
									

									$('td:eq(23)', nRow)
											.html(
													'<div class="action-buttons"><a class="blue"  href="#id/viewAppliedApplicants/'+aData.vcId+'"><span th:text="#{application.page.Applicants}"> Applicants </span></a></div>');
									if (aData.hoStatus === 'Suspend') {
										$('td:eq(23)', nRow)
												.html(
														'<div class="action-buttons"><a class="blue"  href="javascript:downloadHoldReleaseDoc('
																+ '\''
																+ aData.vacantLandId
																+ '\''
																+ ')"><span>TERMINATE Document</span></a></div>');
									} else if (aData.hoStatus === 'Hold') {
										$('td:eq(23)', nRow)
												.html(
														'<div class="action-buttons"><a class="blue"  href="javascript:downloadHoldReleaseDoc('
																+ '\''
																+ aData.vacantLandId
																+ '\''
																+ ')"><span>Hold Document</span></a></div>');
									}
								}
								if (aData.bookingStarted) {
									$('td:eq(16)', nRow)
											.html('Booking Started');
								}
								
								$('td:eq(4)', nRow)
										.html(
												(aData.plotShed != null) ? aData.plotShed
														: "--");
								$('td:eq(6)', nRow).html(
										parseFloat(aData.premiumCharges)
												.toFixed(2));
								$('td:eq(7)', nRow).html(
										parseFloat(aData.developmentCharges)
												.toFixed(2));
								$('td:eq(8)', nRow).html(
										parseFloat(aData.maintenanceCharges)
												.toFixed(2));
								$('td:eq(9)', nRow).html(
										parseFloat(aData.leaseRent).toFixed(2));
								$('td:eq(10)', nRow).html(
										parseFloat(aData.securityDeposit)
												.toFixed(2));
								$('td:eq(11)', nRow).html(
										parseFloat(aData.advanceRent || 0.00)
												.toFixed(2));
								$('td:eq(12)', nRow).html(
										parseFloat(
												aData.otherRentCharges || 0.00)
												.toFixed(2));
								$('td:eq(13)', nRow).html(
										parseFloat(aData.totalAmount)
												.toFixed(2));
								$('td:eq(14)', nRow).html(
										parseFloat(aData.premiumCharges * 0.25)
												.toFixed(2));

								$('td:eq(15)', nRow)
										.html(
												(aData.bookingStartDate != null) ? aData.bookingStartDate
														: "");
								$('td:eq(16)', nRow)
										.html(
												(aData.bookingEndDate != null) ? aData.bookingEndDate
														: "");
								$('td:eq(18)', nRow).html(aData.newArea);
								$('td:eq(19)', nRow).html(
										aData.industrialCategoryName);

							},
							"fnRowCallback" : function(nRow, aData,
									iDisplayIndex, iDisplayIndexFull) {
								$('td:eq(0)', nRow)
										.html(
												(this.fnPagingInfo().iPage
														* this.fnPagingInfo().iLength + (iDisplayIndex + 1)));
							},
							"language" : {
								searchPlaceholder : "Industrial Area/ District/ Tehsil"
							},
							"sAjaxSource" : "fetchLandAllotmentList",

							"aoColumns" : [ {
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							},   
				{
					"mData": "plotNumber",
					"bSortable": false,
					"render": function (data, type, row) {
						return formatPlotNumbers(data);
					}
				}, {
								"mData" : "purposeName",
								"bSortable" : false
							}, {
								"mData" : "plotShed",
								"bSortable" : false
							}, {
								"mData" : "totalPlotArea",
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							},

							{
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : "category",
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : "totalApplicationReceived",
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							}, {
								"mData" : null,
								"bSortable" : false
							},

							{
								"mData" : null,
								"bSortable" : false
							}

							],

						});

	}
	function reDraw() {
		  t.fnDraw();
		}
