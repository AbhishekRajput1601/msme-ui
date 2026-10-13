export const rowRules = {
"dtic/fapendingapplicantsunit": (cell,nRow,aData,iDataIndex) => {
    		
        	var status=aData.currentStatusId;
        	var zonalRequired = aData.zonalRequired;
        	var commiteeRequired = aData.commiteeRequired;
        	
        	
        	 
        	 
        	 if(status == 3 || status==8 || status ==7 || status==6 ||status==9 || status==10 ||status==17 ||status==2 || status==20 || status==21 || status==22){
        		cell('td:eq(0)', nRow).html('<input type="checkbox" disabled="disabled" name="applicationId" id="applicationId" onclick ="javascript:selectApplication(this,'+'\''+aData.applicationId+'\''+')" value="'+aData.applicationId+'"/>');
        	}
        	else if(status==19){
        		
        		
        		
        		cell('td:eq(0)', nRow).html('<input type="checkbox" disabled="disabled" class="elig-gated" name="applicationId" onclick ="javascript:selectApplication(this,'+'\''+aData.applicationId+'\''+')" value="'+aData.applicationId+'"/>');
        	}
        	else {
        		cell('td:eq(0)', nRow).html('<input type="checkbox" name="applicationId"  id="applicationId"   onclick ="javascript:selectApplication(this,'+'\''+aData.applicationId+'\''+')" value="'+aData.applicationId+'"/>');
        	}
        	
        	
        	
        	if(status==19){
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#querybydtic/'+aData.applicationId+'/Unit"><span th:text="#{application.page.query}" >Send Back to Applicant</span></a> | <a class="blue" href="#fa/financialAssistanceTracking/'+aData.applicationId+'"><span >Assistant Type Eligibility</span></a></div>');
        	}
        	       	
        	
if (status == 2 && status != 19) {
    cell('td:eq(5)', nRow).html(`
        <div class="hidden-sm hidden-xs action-buttons">
            <a class="blue" href="#fa/viewfaapplicantdetailunitnew/${aData.applicationId}">
                <span th:text="#{application.page.viewprint}">View/Print</span>
            </a> | 
            <a href="javascript:void(0);" class="blue accept-link" 
               data-application-id="${aData.applicationId}" 
               data-processing="false">
                <span>Accept</span>
            </a>
        </div>
    `);
}       	
        	else if(status==5){
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> |  <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> </div>');
        	}
        	else if(status==11){
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> |  <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> </div> | <a class="blue" href="#querybydtic/'+aData.applicationId+'/Unit"><span th:text="#{application.page.query}" >Send Back to Applicant</span></a></div>');
        	}
        	else if((status==3 && commiteeRequired) || status==8){
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="#faCommitteeStatusUnit/'+aData.applicationId+'/Unit"><span th:text="#{application.page.updateCommitteeStatus}" >update Committee Status</span></a></div>');
        	}else if((status==3 && !commiteeRequired) || status==7){
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadRejectionLetter('+'\''+aData.applicationId+'\''+')"><span th:text="#{application.page.downloadDlac}" >Download DLAC Minutes</span></a> </div>');
        	}else if(((status==12 || status==13) && commiteeRequired) || (status==6)){
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadDLCLetter('+'\''+aData.applicationId+'\''+')"><span th:text="#{application.page.downloadDlac}" >Download DLAC Minutes</span></a> | <br> <a class="blue" href="#faOtherUploadDocuments/'+aData.applicationId+'/Unit"><span th:text="#{application.page.uploadAcceptance}" >Other Upload/View</span></a> | <a class="blue" href="#faacceptanceamountdetailunit/'+aData.applicationId+'/Unit"><span th:text="#{application.page.uploadAcceptance}" >Sanction Letter Upload</span></a> </div>');
        	} else if(status==12 && !commiteeRequired){
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> </div>');
        	} else if(status==9){
    			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadDLCLetter('+'\''+aData.applicationId+'\''+')"><span th:text="#{application.page.downloadDlac}" >Download DLAC Minutes</span></a> | <br> <a class="blue" href="javascript:downloadSanctionDocuments('+'\''+aData.applicationId+'\''+')"><span th:text="#{application.page.downloadDLCLetter}" >Download Sanction Order</span></a> | <a class="blue" href="#faOtherUploadDocuments/'+aData.applicationId+'/Unit"><span th:text="#{application.page.uploadAcceptance}" >Other Upload/View</span></a> |<a class="blue" href="#faDisbursementUnit/'+aData.applicationId+'/unit"><span th:text="#{application.page.uploadDisbursementefile}" >Upload Disbursement Order</span></a> </div>');
    		} 
    		
    		 else if(status==10){
    			
    			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadDLCLetter('+'\''+aData.applicationId+'\''+')"><span th:text="#{application.page.downloadDlac}" >Download DLAC Minutes </span></a> |<br> <a class="blue" href="javascript:downloadSanctionDocuments('+'\''+aData.applicationId+'\''+')"><span th:text="#{application.page.downloadDLCLetter}" >Download Sanction Order</span></a> |  <a class="blue" href="#viewfaDisbursementUnit/'+aData.applicationId+'/unit"><span th:text="#{application.fa.viewDisbursementefile}" >Download Disbursement Order</span></a> | <br> <a class="blue" href="#faOtherUploadDocuments/'+aData.applicationId+'/Unit"><span th:text="#{application.page.uploadAcceptance}" >Other Upload/View</span></a> | <a class="blue" href="#faDisbursementUnit/'+aData.applicationId+'/unit"><span th:text="#{application.page.uploadDisbursementefile}" >Upload Disbursement Order</span></a></div>');
    		} 
    		
    		
    		
    		
    		 else if(status==15 && commiteeRequired){
    			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadDLCLetter('+'\''+aData.applicationId+'\''+')"><span th:text="#{application.page.downloadDLCLetter}" >Download Sanction Order</span></a> </div>');
    		}else if(status==15 && !commiteeRequired){
    			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> </div>');
    		}
    		
    		
    		
    		
    		
    	

        	
        	
        	
        	if(status==6 || status==9 || status==10 || status==12 || status==13){
        		cell('td:eq(5)', nRow).find('div.action-buttons').append(' | <a class="blue" href="javascript:downloadCollectorSignedDoc('+'\''+aData.applicationId+'\''+')">Download Collector Signed Doc</a>');
        	}
        	
        	if(status==20){
    			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> </div>');
    	}
        	if(status==21){
    			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> </div>');
    	}
        	if(status==22){
    			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> </div>');
    	}

      
},
"dtic/fapendingapplicantsapparel": (cell,nRow,aData,iDataIndex) => {

    		
			var status=aData.currentStatusId;
			var zonalRequired = aData.zonalRequired;
			
			if(status == 3 || status==8){
        		cell('td:eq(0)', nRow).html('<input type="checkbox" name="applicationId"  id="applicationId" onclick ="javascript:selectApplication(this,'+'\''+aData.applicationId+'\''+')" value="'+aData.applicationId+'"/>');
        	}
        	else {
        		cell('td:eq(0)', nRow).html('<input type="checkbox" name="applicationId"  id="applicationId" disabled="disabled"  onclick ="javascript:selectApplication(this,'+'\''+aData.applicationId+'\''+')"  value="'+aData.applicationId+'"/>');
        	}
			
			if(status==2 || status==11){
    			cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailapparelnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> |  <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Institute"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="#faInspectionStatusUnit/'+aData.applicationId+'/Institute"><span th:text="#{application.page.updateInspectionStatus}" >update Inspection Status</span></a></div>');
	    	}else if(status==3 || status==8){
	    			cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailapparelnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a>  | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Institute"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="#faCommitteeStatusUnit/'+aData.applicationId+'/Institute"><span th:text="#{application.page.updateCommitteeStatus}" >update Committee Status</span></a></div>');
	    	}else if(status==6){
	    			cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailapparelnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a>  | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Institute"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> |  <a class="blue" href="#faacceptanceamountdetailunit/'+aData.applicationId+'/Institute"><span th:text="#{application.page.uploadAcceptance}" >Upload Acceptance</span></a></div>');
	    	} else if(status==9){
				cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailapparelnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a>  | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Institute"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadAcceptanceLetter('+'\''+aData.applicationId+'\''+')"><span th:text="#{application.page.downloadAcceptanceLetter}" >Download Acceptance</span></a></div>');
			} else if(status==10){
				cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailapparelnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a>  | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Institute"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadAcceptanceLetter('+'\''+aData.applicationId+'\''+')"><span th:text="#{application.page.downloadAcceptanceLetter}" >Download Acceptance</span></a> | <a class="blue" href="javascript:downloadDisbursementLetter('+'\''+aData.applicationId+'\''+')"><span th:text="#{application.page.downloadDisbursementLetter}" >Download Acceptance</span></a></div>');
			} else{
	    		if(status!=1){
	    			cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#fa/viewfaapplicantdetailapparelnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a>  | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Institute"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a></div>');
	    		}
	    	}
      
},
"dtic/allapplicationslist": (cell,nRow,aData,iDataIndex) => {

        	
        cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
        	
        	
      
},
"dtic/applicationslistbystatus": (cell,nRow,aData,iDataIndex) => {

        	
        	cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
        	
      
},
"dtic/sendbackapplicationslist": (cell,nRow,aData,iDataIndex) => {

        	cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
      
},
"dtic/resubmittedapplicationslist": (cell,nRow,aData,iDataIndex) => {

        	cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
      
},
"dtic/viewapplicationsacceptedbydtic": (cell,nRow,aData,iDataIndex) => {

        	cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
      
},
"dtic/viewapplicationsrejectedbydtic": (cell,nRow,aData,iDataIndex) => {

        	cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
      
},
"dtic/viewapplicationsacceptedbydtfc": (cell,nRow,aData,iDataIndex) => {

        	cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
      
},
"dtic/viewapplicationsrejectedbydtfc": (cell,nRow,aData,iDataIndex) => {

        	cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
      
},
"dtic/viewapplicationsacceptedbybank": (cell,nRow,aData,iDataIndex) => {

        	cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
      
},
"dtic/viewapplicationsrejectedbybank": (cell,nRow,aData,iDataIndex) => {

        	cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
      
},
"dtic/applicantlist": (cell,nRow,aData,iDataIndex) => {

        	
        	if(aData.statusCode == 'PENDING_FROM_BANK') {
        		cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a>| <a class="blue" href="#uploadBankCoveringLetter/'+aData.applicantId+'/SE"><span th:text="#{application.page.uploadBankCovering}" >Upload Bank Covering Letter</span></a></div>');
        	} else {
        		cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
        	}
    		
      
},
"dtic/yuvaudhamiapplicantlist": (cell,nRow,aData,iDataIndex) => {

        	
        	if(aData.statusCode == 'PENDING_FROM_BANK') {
        		cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewyuapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a> | <a class="blue" href="#uploadBankCoveringLetter/'+aData.applicantId+'/YU"><span th:text="#{application.page.uploadBankCovering}" >Upload Bank Covering Letter</span></a></div>');
        	} else {
        		cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewyuapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
        	}
      
},
"dtic/inprocessapplicantlist": (cell,nRow,aData,iDataIndex) => {

        	
        	if(aData.statusCode == 'PENDING_FROM_DTFC') {
        		cell('td:eq(0)', nRow).html('<input name="selectBox" value="'+aData.applicantId+'" type="checkbox"/>');	
        	} else {
        		cell('td:eq(0)', nRow).html('');
        	}
        	
        	if(aData.statusCode == 'PENDING_FROM_BANK') {
        		cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a>| <a class="blue" href="#uploadBankCoveringLetter/'+aData.applicantId+'/SE"><span th:text="#{application.page.uploadBankCovering}" >Upload Bank Covering Letter</span></a></div>');
        	} else {
        		cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
        	}
      
},
"dtic/inprocessyuvaudhamiapplicants": (cell,nRow,aData,iDataIndex) => {

        	
        	if(aData.statusCode == 'PENDING_FROM_DTFC') {
        		cell('td:eq(0)', nRow).html('<input name="selectBox" value="'+aData.applicantId+'" type="checkbox"/>');	
        	} else {
        		cell('td:eq(0)', nRow).html('');
        	}
        	
        	if(aData.statusCode == 'PENDING_FROM_BANK') {
        		cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a> | <a class="blue" href="#uploadBankCoveringLetter/'+aData.applicantId+'/YU"><span th:text="#{application.page.uploadBankCovering}" >Upload Bank Covering Letter</span></a></div>');
        	} else {
        		cell('td:eq(6)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
        	}
    		
      
},
"dtic/resubmittedapplicantlist": (cell,nRow,aData,iDataIndex) => {

    		cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
      
},
"dtic/resubmittedyuvaudhamiapplicantlist": (cell,nRow,aData,iDataIndex) => {

    		cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#viewapplicantdetail/'+aData.applicantId+'"><span th:text="#{application.page.view}" >View</span></a></div>');
      
},
"dtic/msmeapplicationlist": (cell,nRow,aData,iDataIndex) => {

    		
        	cell('td:eq(6)', nRow).html('<div class="action-buttons"><a class="blue" href="#viewmsmedetail/'+aData.msmeDetailId+'"><span th:text="#{application.page.viewprint}" >View</span></a> | <a class="blue" href="#viewmsmeeditform/'+aData.msmeDetailId+'"><span th:text="#{application.page.edit}" >Edit</span></a> </div>');
      
},
"dtic/microlevelreportform": (cell,nRow,aData,iDataIndex) => {

    		cell('td:eq(0)', nRow).addClass( 'customFont' );
    		cell('td:eq(1)', nRow).addClass( 'customFont' );
    		cell('td:eq(2)', nRow).addClass( 'customFont' );
    		cell('td:eq(3)', nRow).addClass( 'customFont' );
    		cell('td:eq(4)', nRow).addClass( 'customFont' );
    		
    		cell('td:eq(5)', nRow).addClass( 'customFont' );
    		cell('td:eq(6)', nRow).addClass( 'customFont' );
    		cell('td:eq(7)', nRow).addClass( 'customFont' );
    		cell('td:eq(8)', nRow).addClass( 'customFont' );
    		cell('td:eq(9)', nRow).addClass( 'customFont' );
    		
    		cell('td:eq(10)', nRow).addClass( 'customFont' );
    		cell('td:eq(11)', nRow).addClass( 'customFont' );
    		cell('td:eq(12)', nRow).addClass( 'customFont' );
    		cell('td:eq(13)', nRow).addClass( 'customFont' );
    		cell('td:eq(14)', nRow).addClass( 'customFont' );
    		
    		cell('td:eq(15)', nRow).addClass( 'customFont' );
    		cell('td:eq(16)', nRow).addClass( 'customFont' );
    		cell('td:eq(17)', nRow).addClass( 'customFont' );
      
},
"dtic/smalllevelreportform": (cell,nRow,aData,iDataIndex) => {

    		cell('td:eq(0)', nRow).addClass( 'customFont' );
    		cell('td:eq(1)', nRow).addClass( 'customFont' );
    		cell('td:eq(2)', nRow).addClass( 'customFont' );
    		cell('td:eq(3)', nRow).addClass( 'customFont' );
    		cell('td:eq(4)', nRow).addClass( 'customFont' );
    		
    		cell('td:eq(5)', nRow).addClass( 'customFont' );
    		cell('td:eq(6)', nRow).addClass( 'customFont' );
    		cell('td:eq(7)', nRow).addClass( 'customFont' );
    		cell('td:eq(8)', nRow).addClass( 'customFont' );
    		cell('td:eq(9)', nRow).addClass( 'customFont' );
    		
    		cell('td:eq(10)', nRow).addClass( 'customFont' );
    		cell('td:eq(11)', nRow).addClass( 'customFont' );
    		cell('td:eq(12)', nRow).addClass( 'customFont' );
    		cell('td:eq(13)', nRow).addClass( 'customFont' );
    		cell('td:eq(14)', nRow).addClass( 'customFont' );
    		
    		cell('td:eq(15)', nRow).addClass( 'customFont' );
    		cell('td:eq(16)', nRow).addClass( 'customFont' );
    		cell('td:eq(17)', nRow).addClass( 'customFont' );
      
},
"dtic/mediumlevelreportform": (cell,nRow,aData,iDataIndex) => {

    		cell('td:eq(0)', nRow).addClass( 'customFont' );
    		cell('td:eq(1)', nRow).addClass( 'customFont' );
    		cell('td:eq(2)', nRow).addClass( 'customFont' );
    		cell('td:eq(3)', nRow).addClass( 'customFont' );
    		cell('td:eq(4)', nRow).addClass( 'customFont' );
    		
    		cell('td:eq(5)', nRow).addClass( 'customFont' );
    		cell('td:eq(6)', nRow).addClass( 'customFont' );
    		cell('td:eq(7)', nRow).addClass( 'customFont' );
    		cell('td:eq(8)', nRow).addClass( 'customFont' );
    		cell('td:eq(9)', nRow).addClass( 'customFont' );
    		
    		cell('td:eq(10)', nRow).addClass( 'customFont' );
    		cell('td:eq(11)', nRow).addClass( 'customFont' );
    		cell('td:eq(12)', nRow).addClass( 'customFont' );
    		cell('td:eq(13)', nRow).addClass( 'customFont' );
    		cell('td:eq(14)', nRow).addClass( 'customFont' );
    		
    		cell('td:eq(15)', nRow).addClass( 'customFont' );
    		cell('td:eq(16)', nRow).addClass( 'customFont' );
    		cell('td:eq(17)', nRow).addClass( 'customFont' );
      
},
"dtic/budgetPlanning/allocatedBudgetDetails": (cell,nRow,aData,iDataIndex) => {

			cell('td:eq(4)', nRow).html((aData.amount-aData.headsAmount).toFixed(2));
			cell('td:eq(5)', nRow).html('<a class="blue" href="#allocatedBudgetDetails/'+aData.financialYearId+'"><span th:text="#{application.page.view}">View</span></a>');			        	
		
},
"dtic/budgetPlanning/demandBudgetDetails": (cell,nRow,aData,iDataIndex) => {

			cell('td:eq(4)', nRow).html(aData.amount-aData.headsAmount);
			cell('td:eq(5)', nRow).html('<a class="blue" href="#demandBudgetDetails/'+aData.financialYearId+'"><span th:text="#{application.page.view}">View</span></a>');			        	
		
},
"dtic/budgetPlanning/usesSurrenderDetails": (cell,nRow,aData,iDataIndex) => {

			cell('td:eq(5)', nRow).html(aData.amount-(aData.usedAmount+aData.surrenderAmount));
			cell('td:eq(6)', nRow).html('<a class="blue" href="#usesSurrenderDetails/'+aData.financialYearId+'"><span th:text="#{application.page.view}">View</span></a>');			        	
		
},
"dtic/coordination/inspectionDetails": (cell,nRow,aData,iDataIndex) => {

				if (aData.statusId==9) {
					cell('td:eq(7)', nRow).html('<a class="blue" href="#viewEditRoster/'+aData.inspectionOfficeId+'"><span th:text="#{application.coordination.viewEditCompliance}">View/Edit Compliance</span></a> | <a class="blue" href="#printRoster/'+aData.inspectionOfficeId+'"><span th:text="#{application.coordination.printRoster}">Print Roster</span></a>');	
				} else {
					cell('td:eq(7)', nRow).html('<a class="blue" href="#viewRoster/'+aData.inspectionOfficeId+'"><span th:text="#{application.coordination.viewRoster}">View Roster</span></a>');
				}				
			
},
"dtic/audit/internalAuditListForDTIC": (cell,nRow,aData,iDataIndex) => {
				
				
				if(aData.statusId == 1 || aData.statusId == 5){  
					cell('td:eq(4)', nRow).html('<a class="blue" href="#dticInternalAuditEnterOpinion/'+aData.auditRosterId+'"><span th:text="#{application.audit.enterOpinion}">Enter Opinion</span></a>');
				}
				else {
					cell('td:eq(4)', nRow).html('<a class="blue" href="#viewInternalAudit/'+aData.auditRosterId+'"><span th:text="#{application.page.viewprint}">View/Print</span></a>');
				}
			
},
"dtic/audit/externalAuditListForDTIC": (cell,nRow,aData,iDataIndex) => {
				
				if(aData.statusid === 1 || aData.statusid === 8 || aData.isQueried){
					cell('td:eq(5)', nRow).html('<a class="blue" href="#dticExternalAuditEnterOpinion/'+aData.rosterId+'"><span th:text="#{application.audit.enterOpinion}">Enter Opinion</span></a> | <a class="blue" href="#viewExternalAudit/'+aData.rosterId+'"><span th:text="#{application.page.viewprint}">View/Print</span></a>');
				} else {
					cell('td:eq(5)', nRow).html('<a class="blue" href="#viewExternalAudit/'+aData.rosterId+'"><span th:text="#{application.page.viewprint}">View/Print</span></a>');	
				}				
			
},
"dtic/audit/factualDetailListForDTIC": (cell,nRow,aData,iDataIndex) => {
				
				if(aData.statusId === 8 || aData.statusId === 12){
					cell('td:eq(6)', nRow).html('<a class="blue" href="#dticFactualDetailEnterOpinion/'+aData.factualDetailId+'"><span th:text="#{application.audit.enterOpinion}">Enter Opinion</span></a> | <a class="blue" href="#viewFactualDetail/'+aData.factualDetailId+'"><span th:text="#{application.page.viewprint}">View/Print</span></a>');					
				} else {
					cell('td:eq(6)', nRow).html('<a class="blue" href="#viewFactualDetail/'+aData.factualDetailId+'"><span th:text="#{application.page.viewprint}">View/Print</span></a>');
				}
			
},
"dtic/audit/proformaClauseListForDTIC": (cell,nRow,aData,iDataIndex) => {
				
				if(aData.statusId === 8 || aData.statusId === 12){
					cell('td:eq(6)', nRow).html('<a class="blue" href="#dticProformaClauseEnterOpinion/'+aData.proformaId+'"><span th:text="#{application.audit.enterOpinion}">Enter Opinion</span></a> | <a class="blue" href="#viewProformaClause/'+aData.proformaId+'"><span th:text="#{application.page.viewprint}">View/Print</span></a>');		
				}else
					cell('td:eq(6)', nRow).html('<a class="blue" href="#viewProformaClause/'+aData.proformaId+'"><span th:text="#{application.page.viewprint}">View/Print</span></a>');
			
}
}
