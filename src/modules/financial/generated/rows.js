export const rowRules = {
"fa/fapendingapplicantsunit": (cell,nRow,aData,iDataIndex)=>{
    		
        	var status=aData.currentStatusId;
        	var zonalRequired = aData.zonalRequired;
        	var commiteeRequired = aData.commiteeRequired;
        	
        	
        	if(status == 3 || status ==5 || status ==7 || status==6 ||status==9 || status==10 ||status==17 ||status==2){   
        		cell('td:eq(0)', nRow).html('<input type="checkbox" disabled="disabled" name="applicationId" id="applicationId" onclick ="javascript:selectApplication(this,'+'\''+aData.applicationId+'\''+')" value="'+aData.applicationId+'"/>');
        	}
        	else {
        		cell('td:eq(0)', nRow).html('<input type="checkbox" name="applicationId"  id="applicationId"   onclick ="javascript:selectApplication(this,'+'\''+aData.applicationId+'\''+')" value="'+aData.applicationId+'"/>');
        	}
        	
        	if(status==19){
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#querybydtic/'+aData.applicationId+'/Unit"><span th:text="#{application.page.query}" >Send Back to Applicant</span></a></div>');
        	}
        	if (status == 2 && status != 19) {
    cell('td:eq(5)', nRow).html(`
        <div class="hidden-sm hidden-xs action-buttons">
            <a class="blue" href="#/viewfaapplicantdetailunitnew/${aData.applicationId}">
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
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> |  <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> </div>');
        	}
        	else if(status==11){
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> |  <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> </div> | <a class="blue" href="#querybydtic/'+aData.applicationId+'/Unit"><span th:text="#{application.page.query}" >Send Back to Applicant</span></a></div>');
        	}
        	else if((status==3 && commiteeRequired) || status==8){
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="#faCommitteeStatusUnit/'+aData.applicationId+'/Unit"><span th:text="#{application.page.updateCommitteeStatus}" >update Committee Status</span></a></div>');
        	}else if((status==3 && !commiteeRequired) || status==7){
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadRejectionLetter('+'\''+aData.applicationId+'\''+')"><span >Download SLEC Minutes</span></a> </div>');
        	}else if(((status==12 || status==13) && commiteeRequired) || (status==6)){
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadDLCLetter('+'\''+aData.applicationId+'\''+')"><span >Download SLEC Minutes</span></a> | <br> <a class="blue" href="#faOtherUploadDocuments/'+aData.applicationId+'/Unit"><span th:text="#{application.page.uploadAcceptance}" >Other Upload/View</span></a> | <a class="blue" href="#faacceptanceamountdetailunit/'+aData.applicationId+'/Unit"><span th:text="#{application.page.uploadAcceptance}" >Sanction Letter Upload</span></a> </div>');
        	} else if(status==12 && !commiteeRequired){
        			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> </div>');
        	} else if(status==9){
    			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadDLCLetter('+'\''+aData.applicationId+'\''+')"><span>Download SLEC Minutes</span></a> | <br> <a class="blue" href="javascript:downloadSanctionDocuments('+'\''+aData.applicationId+'\''+')"><span th:text="#{application.page.downloadDLCLetter}" >Download Sanction Order</span></a> | <a class="blue" href="#faOtherUploadDocuments/'+aData.applicationId+'/Unit"><span th:text="#{application.page.uploadAcceptance}" >Other Upload/View</span></a> |<a class="blue" href="#faDisbursementUnit/'+aData.applicationId+'/unit"><span th:text="#{application.page.uploadDisbursementefile}" >Upload Disbursement Order</span></a> </div>');
    		} 
    		
    		 else if(status==10){
    			
    			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadDLCLetter('+'\''+aData.applicationId+'\''+')"><span >Download SLEC Minutes </span></a> |<br> <a class="blue" href="javascript:downloadSanctionDocuments('+'\''+aData.applicationId+'\''+')"><span th:text="#{application.page.downloadDLCLetter}" >Download Sanction Order</span></a> |  <a class="blue" href="#viewfaDisbursementUnit/'+aData.applicationId+'/unit"><span th:text="#{application.fa.viewDisbursementefile}" >Download Disbursement Order</span></a> | <br> <a class="blue" href="#faOtherUploadDocuments/'+aData.applicationId+'/Unit"><span th:text="#{application.page.uploadAcceptance}" >Other Upload/View</span></a> | <a class="blue" href="#faDisbursementUnit/'+aData.applicationId+'/unit"><span th:text="#{application.page.uploadDisbursementefile}" >Upload Disbursement Order</span></a></div>');
    		} 
    		
    		
    		
    		
    		 else if(status==15 && commiteeRequired){
    			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> | <a class="blue" href="javascript:downloadDLCLetter('+'\''+aData.applicationId+'\''+')"><span th:text="#{application.page.downloadDLCLetter}" >Download Sanction Order</span></a> </div>');
    		}else if(status==15 && !commiteeRequired){
    			cell('td:eq(5)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#/viewfaapplicantdetailunitnew/'+aData.applicationId+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a> | <a class="blue" href="#fa/viewfaapplicantHistory/'+aData.applicationId+'/Unit"><span th:text="#{application.page.ProgressDetails}" >Progress Details</span></a> </div>');
    		}
    		
    		
    		
    		
    		
    	

      },
"fa/infradevelopmetList": (cell,nRow,aData,iDataIndex)=>{
    		
        	cell('td:eq(4)', nRow).html('<div class="hidden-sm hidden-xs action-buttons"><a class="blue" href="#/viewfaInfrastructure/'+aData.id+'"><span th:text="#{application.page.viewprint}" >View/Print</span></a></div>'); 

      },
"dtic/fapendingapplicantsapparel": (cell,nRow,aData,iDataIndex)=>{
    		
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
      }
}