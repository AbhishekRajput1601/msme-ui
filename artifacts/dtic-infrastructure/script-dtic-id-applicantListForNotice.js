


    
	jQuery.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
	{
		return {
			"iStart":         oSettings._iDisplayStart,
			"iEnd":           oSettings.fnDisplayEnd(),
			"iLength":        oSettings._iDisplayLength,
			"iTotal":         oSettings.fnRecordsTotal(),
			"iFilteredTotal": oSettings.fnRecordsDisplay(),
			"iPage":          oSettings._iDisplayLength === -1 ?
				0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
			"iTotalPages":    oSettings._iDisplayLength === -1 ?
				0 : Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
		};
	};

	function fetchApplicationList() {

	$("#dynamic-table").dataTable( {
        "bProcessing": true,
        "bServerSide": true,
        "sort": "position",
        
        "bStateSave": false,
        
        "iDisplayLength": 10,
        
        "iDisplayStart": 0,
        "pagingType": "full_numbers",
        "aaSorting": [],
        
        "fnDrawCallback": function () {
           
        	angular.element('#StartOrFinishSpinnerId').scope().startOrStopSpinner(false);
        	
        	
            
            
        	
        }, 
        "fnCreatedRow" : function (nRow, aData, iDataIndex) {
        	$('td:eq(4)', nRow).html('<b>Industrial Area: </b>' + aData.vacantLandBean.industrialAreaName + '<br/> <b>District: </b>' +aData.vacantLandBean.districtName + '<br/> <b>Tehsil: </b>'+ aData.vacantLandBean.tehsilName);
        	if(aData.idNoticeBean!=null){
        		if(aData.idNoticeBean.complianceStatus)
        			$('td:eq(7)', nRow).html('<a class="blue" href="#viewNoticeHistory/'+aData.idNoticeBean.noticeId+'"><span th:text="#{application.id.viewNoticeHistory}">View/Print Notice History</span></a>');
        		else
        			$('td:eq(7)', nRow).html('<a class="blue" href="#reviewCompliance/'+aData.idNoticeBean.noticeId+'"><span th:text="#{application.id.reviewCompliance}">Review Compliance</span></a>');
        	}else{
        		$('td:eq(7)', nRow).html('<a class="blue" href="#viewIssueNotice/'+aData.applicantId+'"><span th:text="#{application.id.issueNotice}">Issue Notice</span></a>');	        		
        	}
        	if (aData.statusId==15 && aData.idNoticeBean.zoAppealBean!=null && aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean && (aData.idNoticeBean.zoAppealBean.statusId==23 || aData.idNoticeBean.zoAppealBean.statusId==26)) {
        		
        		$('td:eq(7)', nRow).append(' | <a class="blue" href="#viewZOAppeal/'+aData.idNoticeBean.zoAppealBean.appealId+'"><span th:text="#{application.id.viewZOAppeal}">View ZO Appeal</span></a>');
        		
        		if(aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.isTimeFrameExpired==true){
        			$('td:eq(7)', nRow).append(' | <a class="blue" href="#reviewConditionalComplianceZO/'+aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.appealHearingId+'"><span th:text="#{application.id.reviewConditionalComplianceZO}">Review ZO Conditional decision compliance</span></a>');	
        		}else if(aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.appealConditionalDecisionZOBean!=null){
        			$('td:eq(7)', nRow).append(' | <a class="blue" href="#reviewConditionalComplianceZO/'+aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.appealHearingId+'/'+aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.appealConditionalDecisionZOBean.decisionId+'"><span th:text="#{application.id.reviewConditionalComplianceZO}">Review ZO Conditional decision compliance</span></a>');
        		}
        	}else if((aData.statusId==15 || aData.statusId==18) && aData.idNoticeBean.zoAppealBean!=null && aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean!=null && aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.appealConditionalDecisionZOBean!=null){
        		$('td:eq(7)', nRow).append(' | <a class="blue" href="#viewZOAppeal/'+aData.idNoticeBean.zoAppealBean.appealId+'"><span th:text="#{application.id.viewZOAppeal}">View ZO Appeal</span></a>');
        		$('td:eq(7)', nRow).append(' | <a class="blue" href="#viewConditionalDecisionZO/'+aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.appealConditionalDecisionZOBean.appealHearingId+'/'+aData.idNoticeBean.zoAppealBean.finalDecisionHearingBean.appealConditionalDecisionZOBean.decisionId+'"><span th:text="#{application.id.viewZOConditionalDecision}">View ZO Conditional decision</span></a>');
        	}
        	
        	if (aData.statusId==15 && aData.idNoticeBean.icAppealBean!=null && aData.idNoticeBean.icAppealBean.finalDecisionHearingBean && (aData.idNoticeBean.icAppealBean.statusId==32 || aData.idNoticeBean.icAppealBean.statusId==34)) {
        		
        		$('td:eq(7)', nRow).append(' | <a class="blue" href="#viewICAppeal/'+aData.idNoticeBean.icAppealBean.appealId+'"><span th:text="#{application.id.viewICAppeal}">View IC Appeal</span></a>');
        		
        		if(aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.isTimeFrameExpired==true){
        			$('td:eq(7)', nRow).append(' | <a class="blue" href="#reviewConditionalComplianceIC/'+aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.appealHearingId+'"><span th:text="#{application.id.reviewConditionalComplianceIC}">Review IC Conditional decision compliance</span></a>');	
        		}else if(aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.appealConditionalDecisionICBean!=null){
        			$('td:eq(7)', nRow).append(' | <a class="blue" href="#reviewConditionalComplianceIC/'+aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.appealHearingId+'/'+aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.appealConditionalDecisionICBean.decisionId+'"><span th:text="#{application.id.reviewConditionalComplianceIC}">Review IC Conditional decision compliance</span></a>');
        		}
        	}else if((aData.statusId==15 || aData.statusId==18) && aData.idNoticeBean.icAppealBean!=null && aData.idNoticeBean.icAppealBean.finalDecisionHearingBean!=null && aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.appealConditionalDecisionICBean!=null){
        		
        		$('td:eq(7)', nRow).append(' | <a class="blue" href="#viewICAppeal/'+aData.idNoticeBean.icAppealBean.appealId+'"><span th:text="#{application.id.viewICAppeal}">View IC Appeal</span></a>');
        		
        		$('td:eq(7)', nRow).append(' | <a class="blue" href="#viewConditionalDecisionIC/'+aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.appealConditionalDecisionICBean.appealHearingId+'/'+aData.idNoticeBean.icAppealBean.finalDecisionHearingBean.appealConditionalDecisionICBean.decisionId+'"><span th:text="#{application.id.viewICConditionalDecision}">View IC Conditional decision</span></a>');
        	}
      },
      "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
    	  $('td:eq(0)', nRow).html((this.fnPagingInfo().iPage * this.fnPagingInfo().iLength + (iDisplayIndex +1)));
   	  },

      "language": {
	        searchPlaceholder: "Application ID"
	    },
        "sAjaxSource": "fetchApplicationForNoticeList",
        
        "aoColumns": [
			{ "mData": null, "bSortable": false },
            { "mData": "applicationId", "bSortable": false  },
            { "mData": "fullName", "bSortable": false },
            { "mData": "submittedOn", "bSortable": false  },
            { "mData": null, "bSortable": false  },
            { "mData": "vacantLandBean.plotNumber", "bSortable": false  },
            
            { "mData": "status", "bSortable": false },
            { "mData": null, "bSortable": false },
        ],
        
    } );

}
	
