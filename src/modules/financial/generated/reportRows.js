export const reportRows={
"fa/financialReportDitrictWise": (table,dataList,startRecord,params)=>{
const {districtId,status,scheme}=params;
const recordNotFound="Record not found !! Try again";
function prepareApplicationList(dataList) {
    try {
        var j = 0;
        var srNo = startRecord + 1;
        
        var applicationListTable = table;
        var tot=0;var totPending=0;var totQuried=0;var totMeetingAgd=0;
        var totDlac=0;var totSanOrder=0;var totDisOrder=0;
        if (dataList != null) {
            for (const i in dataList) {
			
                var row = applicationListTable.insertRow(j++);
                createRowForApplicationList(row, srNo++, dataList[i])
                tot+=parseInt(dataList[i].applicationId);
                totPending+=parseInt(dataList[i].status2);
                totQuried+=parseInt(dataList[i].status5);
                totMeetingAgd+=parseInt(dataList[i].status9);
                totDlac+=parseInt(dataList[i].status9);
                totSanOrder+=parseInt(dataList[i].status9);
                totDisOrder+=parseInt(dataList[i].status10);
            }
        }
        if (j == 0 || j == '0') {
            var row = applicationListTable.insertRow(j++);
            var tdNotFound = row.insertCell(0);
            tdNotFound.setAttribute("align", "center");
            tdNotFound.setAttribute("colspan", "14");
            tdNotFound.innerHTML = recordNotFound;
        }
        var row = applicationListTable.insertRow(j++);
        var l=0;
        var blank1=row.insertCell(l++);
        var blank2=row.insertCell(l++);
        blank2.innerHTML="Total";
        var summary1= row.insertCell(l++);
        summary1.innerHTML = tot;
        var summary2= row.insertCell(l++);
        summary2.innerHTML = totPending;
        var summary3= row.insertCell(l++);
        summary3.innerHTML = totQuried;
        var summary4= row.insertCell(l++);
        summary4.innerHTML = totMeetingAgd;
        var summary5= row.insertCell(l++);
        summary5.innerHTML = totDlac;
		var summary6= row.insertCell(l++);
        summary6.innerHTML = totSanOrder;
        var summary6= row.insertCell(l++);
        summary6.innerHTML = totDisOrder;
        
    } catch (e) {
        alert(e);
        console.error('Some error in prepare list : ', e);

    }
}
function createRowForApplicationList(row, j, rowData) {
    var k = 0;
    var view = "";
    
    var tdSrNo = row.insertCell(k++);
    tdSrNo.setAttribute("align", "center");
    tdSrNo.innerHTML = j;
    
	var tddistrictName = row.insertCell(k++);
    tddistrictName.innerHTML = rowData.districtName;
   										
    var tdtotalApplications = row.insertCell(k++);
    view = "#report/"+rowData.districtId;
    
	tdtotalApplications.innerHTML= '<a  href="'+view+'">' + rowData.applicationId+ '</a>';
	
    var tdPendingProcess = row.insertCell(k++);
    
     view = "#reportStatus/"+rowData.districtId+"/2";
    tdPendingProcess.innerHTML= '<a href="'+view+'">' + rowData.status2+ '</a>';
   

    var tdQueried = row.insertCell(k++);
    view = "#reportStatus/"+rowData.districtId+"/5";
    tdQueried.innerHTML= '<a href="'+view+'">' + rowData.status5+ '</a>';
   

    var tdAmount = row.insertCell(k++);
    view = "#reportStatus/"+rowData.districtId+"/9";
    tdAmount.innerHTML= '<a href="'+view+'">' + rowData.status9+ '</a>';
   

  	var tdDlac = row.insertCell(k++);
  	view = "#reportStatus/"+rowData.districtId+"/9";
  	tdDlac.innerHTML= '<a href="'+view+'">' + rowData.status9+ '</a>';
  	
    

    var tdsanctionDate = row.insertCell(k++);
    view = "#reportStatus/"+rowData.districtId+"/9";
    tdsanctionDate.innerHTML= '<a href="'+view+'">' + rowData.status9+ '</a>';
   

    var tdDisbursement = row.insertCell(k++);
    view = "#reportStatus/"+rowData.districtId+"/10";
    tdDisbursement.innerHTML= '<a href="'+view+'">' + rowData.status10+ '</a>';
    

    
}
prepareApplicationList(dataList);
},
"fa/financialReportSchemeWise": (table,dataList,startRecord,params)=>{
const {districtId,status,scheme}=params;
const recordNotFound="Record not found !! Try again";
function prepareApplicationList(dataList) {
    try {
        var j = 0;
        var srNo = startRecord + 1;
        var totIndustrial=0;var totQuality=0;var totPatent=0; var totInfra=0;
        var totWaste=0; var totPower=0; var totPharma=0;var totEnergy=0;
        
        var applicationListTable = table;
        if (dataList != null) {
            for (const i in dataList) {
                var row = applicationListTable.insertRow(j++);
                createRowForApplicationList(row, srNo++, dataList[i])
                totIndustrial+=dataList[i].industrial;
                totQuality+=dataList[i].quality;
                totPatent+=dataList[i].patent;
                totInfra+=dataList[i].infra;
                totWaste+=dataList[i].waste;
                totPower+=dataList[i].power;
                totPharma+=dataList[i].pharma;
                totEnergy+=dataList[i].energy;
            }
        }
        if (j == 0 || j == '0') {
            var row = applicationListTable.insertRow(j++);
            var tdNotFound = row.insertCell(0);
            tdNotFound.setAttribute("align", "center");
            tdNotFound.setAttribute("colspan", "14");
            tdNotFound.innerHTML = recordNotFound;
        }
         var row = applicationListTable.insertRow(j++);
        var l=0;
        var blank1=row.insertCell(l++);
        var blank2=row.insertCell(l++);
        blank2.innerHTML="Total";
        var summary1= row.insertCell(l++);
        summary1.innerHTML = totIndustrial;
		var summary2= row.insertCell(l++);
        summary2.innerHTML = totQuality;
        var summary3= row.insertCell(l++);
        summary3.innerHTML = totPatent;
        var summary4= row.insertCell(l++);
        summary4.innerHTML = totInfra;
        var summary5= row.insertCell(l++);
        summary5.innerHTML = totWaste;
        var summary6= row.insertCell(l++);
        summary6.innerHTML = totEnergy;
        var summary7= row.insertCell(l++);
        summary7.innerHTML = totPower;
        var summary8= row.insertCell(l++);
        summary8.innerHTML = totPharma;

    } catch (e) {
        alert(e);
        console.error('Some error in prepare list : ', e);

    }
}
function createRowForApplicationList(row, j, rowData) {
    var k = 0;
    var view = "";
    
    var tdSrNo = row.insertCell(k++);
    tdSrNo.setAttribute("align", "center");
    tdSrNo.innerHTML = j;
    
	var tddistrictName = row.insertCell(k++);
    tddistrictName.innerHTML = rowData.districtName;
   										
   
    
	
	
    var tdIndustrial = row.insertCell(k++);
    view="#report/"+rowData.districtId+"/industrial";
    
    tdIndustrial.innerHTML ='<a  href="'+view+'">' + rowData.industrial+ '</a>';

    var tdQuality = row.insertCell(k++);
    view="#report/"+rowData.districtId+"/quality";
   
    
	tdQuality.innerHTML ='<a  href="'+view+'">' + rowData.quality+ '</a>';
	
    var tdPatent = row.insertCell(k++);
    view="#report/"+rowData.districtId+"/patent";
    tdPatent.innerHTML = '<a  href="'+view+'">' + rowData.patent;

  	var tdInfra = row.insertCell(k++);
  	view="#report/"+rowData.districtId+"/infra";
    tdInfra.innerHTML = '<a  href="'+view+'">' + rowData.infra ;

    var tdWaste = row.insertCell(k++);
    view="#report/"+rowData.districtId+"/waste";
    tdWaste.innerHTML = '<a  href="'+view+'">' + rowData.waste;

    var tdEnergy = row.insertCell(k++);
    view="#report/"+rowData.districtId+"/energy";
    tdEnergy.innerHTML = '<a  href="'+view+'">' + rowData.energy;

	var tdPower = row.insertCell(k++);
	view="#report/"+rowData.districtId+"/power";
    tdPower.innerHTML = '<a  href="'+view+'">' + rowData.power;
    
    var tdPharma = row.insertCell(k++);
    view="#report/"+rowData.districtId+"/pharma";
    tdPharma.innerHTML = '<a  href="'+view+'">' + rowData.pharma;
    
}
prepareApplicationList(dataList);
},
"fa/sanctionedVsDisbursementReport": (table,dataList,startRecord,params)=>{
const {districtId,status,scheme}=params;
const recordNotFound="Record not found !! Try again";
function prepareApplicationList(dataList) {
    try {
        var j = 0;
        var srNo = startRecord + 1;
        var totCount1=0;var totAmount1=0;var totCount2=0; var totAmount2=0;
        
        var applicationListTable = table;
        if (dataList != null) {
            for (const i in dataList) {
                var row = applicationListTable.insertRow(j++);
                createRowForApplicationList(row, srNo++, dataList[i])
                totCount1+=dataList[i].count1;
                totAmount1+=dataList[i].amount1;
                totCount2+=dataList[i].count2;
                totAmount2+=dataList[i].amount2;
                
            }
        }
        if (j == 0 || j == '0') {
            var row = applicationListTable.insertRow(j++);
            var tdNotFound = row.insertCell(0);
            tdNotFound.setAttribute("align", "center");
            tdNotFound.setAttribute("colspan", "14");
            tdNotFound.innerHTML = recordNotFound;
        }
         var row = applicationListTable.insertRow(j++);
        var l=0;
        var blank1=row.insertCell(l++);
        var blank2=row.insertCell(l++);
        blank2.innerHTML="Total";
        var summary1= row.insertCell(l++);
        summary1.innerHTML = totCount1;
		var summary2= row.insertCell(l++);
        summary2.innerHTML = totAmount1;
        var summary3= row.insertCell(l++);
        summary3.innerHTML = totCount2;
        var summary4= row.insertCell(l++);
        summary4.innerHTML = totAmount2;
        
    } catch (e) {
        alert(e);
        console.error('Some error in prepare list : ', e);

    }
}
function createRowForApplicationList(row, j, rowData) {
    var k = 0;
    var view = "";
    
    var tdSrNo = row.insertCell(k++);
    tdSrNo.setAttribute("align", "center");
    tdSrNo.innerHTML = j;
    
	var tddistrictName = row.insertCell(k++);
    tddistrictName.innerHTML = rowData.districtName;
   
    var tdCount1 = row.insertCell(k++);
    tdCount1.innerHTML = rowData.count1 != null ? rowData.count1 : ' ------ ';

    var tdAmount1 = row.insertCell(k++);
    tdAmount1.innerHTML = rowData.amount1 != null ? rowData.amount1 : '0';

	
    var tdCount2 = row.insertCell(k++);
   	tdCount2.innerHTML = rowData.count2 != null ? rowData.count2 : ' ------ ';
  	
  	 var tdAmount2 = row.insertCell(k++);
    tdAmount2.innerHTML = rowData.amount2 != null ? rowData.amount2 : ' ------ ';    
}
prepareApplicationList(dataList);
},
"fa/msmeDetailsReportDistrictWise": (table,dataList,startRecord,params)=>{
const {districtId,status,scheme}=params;
const recordNotFound="Record not found !! Try again";
function prepareApplicationList(dataList) {
    try {
        var j = 0;
        var srNo = startRecord + 1;
        
        var applicationListTable = table;
        var tot=0;var totPending=0;var totQuried=0;var totMeetingAgd=0;
        var totDlac=0;var totSanOrder=0;var totDisOrder=0;
        if (dataList != null) {
            for (const i in dataList) {
			
                var row = applicationListTable.insertRow(j++);
                createRowForApplicationList(row, srNo++, dataList[i])
                tot+=parseInt(dataList[i].applicationId);
          
          
           
           
            
             
            }
        }
          if (j == 0 || j == '0') {
            var row = applicationListTable.insertRow(j++);
            var tdNotFound = row.insertCell(0);
            tdNotFound.setAttribute("align", "center");
            tdNotFound.setAttribute("colspan", "14");
            tdNotFound.innerHTML = recordNotFound;
        }
        var row = applicationListTable.insertRow(j++);
        var l=0;
        var blank1=row.insertCell(l++);
        var blank2=row.insertCell(l++);
        blank2.innerHTML="Total";
        var summary1= row.insertCell(l++);
        summary1.innerHTML = tot;
       
        
    } catch (e) {
        alert(e);
        console.error('Some error in prepare list : ', e);

    }
}
function createRowForApplicationList(row, j, rowData) {
    var k = 0;
    var view = "";
    
    var tdSrNo = row.insertCell(k++);
    tdSrNo.setAttribute("align", "center");
    tdSrNo.innerHTML = j;
    
	var tddistrictName = row.insertCell(k++);
    tddistrictName.innerHTML = rowData.districtName;
   										
    var tdtotalApplications = row.insertCell(k++);
    view = "#msmeDetailReportList/"+rowData.districtId;
    
	tdtotalApplications.innerHTML= '<a  href="'+view+'">' + rowData.applicationId+ '</a>';
	
    
    
}
prepareApplicationList(dataList);
},
"fa/msmeDetailReportList": (table,dataList,startRecord,params)=>{
const {districtId,status,scheme}=params;
const recordNotFound="Record not found !! Try again";
function prepareApplicationList(dataList) {
    try {
        var j = 0;
        var srNo = startRecord + 1;
        
        var applicationListTable = table;
        if (dataList != null) {
            for (const i in dataList) {
                var row = applicationListTable.insertRow(j++);
                createRowForApplicationList(row, srNo++, dataList[i])
            }
        }
        if (j == 0 || j == '0') {
            var row = applicationListTable.insertRow(j++);
            var tdNotFound = row.insertCell(0);
            tdNotFound.setAttribute("align", "center");
            tdNotFound.setAttribute("colspan", "14");
            tdNotFound.innerHTML = recordNotFound;
        }

    } catch (e) {
        alert(e);
        console.error('Some error in prepare list : ', e);

    }
}
function createRowForApplicationList(row, j, rowData) {
    var k = 0;
    
    var tdSrNo = row.insertCell(k++);
    tdSrNo.setAttribute("align", "center");
    tdSrNo.innerHTML = j;
    var tdApplicationid =row.insertCell(k++);;
    tdApplicationid.innerHTML=rowData.udyamRegNumber;
    
	var tddistrictName = row.insertCell(k++);
    tddistrictName.innerHTML = rowData.udyamRegDate;
    var tdtehsilName = row.insertCell(k++);
	tdtehsilName.innerHTML = rowData.msmeType !=null ? rowData.msmeType : ' ------ '; 

    var tdblockName = row.insertCell(k++);
    tdblockName.innerHTML = rowData.ownerOrPartnerName != null ? rowData.ownerOrPartnerName : ' ------ ';

    var tdunitName = row.insertCell(k++);
    tdunitName.innerHTML = rowData.productionDate != null ? rowData.productionDate : ' ------ ';

    var tdAddress = row.insertCell(k++);
    tdAddress.innerHTML = rowData.createdOn != null ? rowData.createdOn : ' ------ ';
   
}
prepareApplicationList(dataList);
},
"fa/report": (table,dataList,startRecord,params)=>{
const {districtId,status,scheme}=params;
const recordNotFound="Record not found !! Try again";
function prepareApplicationList(dataList) {
    try {
        var j = 0;
        var srNo = startRecord + 1;
        
        var applicationListTable = table;
        if (dataList != null) {
            for (const i in dataList) {
                var row = applicationListTable.insertRow(j++);
                createRowForApplicationList(row, srNo++, dataList[i])
            }
        }
        if (j == 0 || j == '0') {
            var row = applicationListTable.insertRow(j++);
            var tdNotFound = row.insertCell(0);
            tdNotFound.setAttribute("align", "center");
            tdNotFound.setAttribute("colspan", "14");
            tdNotFound.innerHTML = recordNotFound;
        }

    } catch (e) {
        alert(e);
        console.error('Some error in prepare list : ', e);

    }
}
function createRowForApplicationList(row, j, rowData) {
    var k = 0;
    
    var tdSrNo = row.insertCell(k++);
    tdSrNo.setAttribute("align", "center");
    tdSrNo.innerHTML = j;
    var tdApplicationid =row.insertCell(k++);;
    tdApplicationid.innerHTML=rowData.application_id;
    
	var tddistrictName = row.insertCell(k++);
    tddistrictName.innerHTML = rowData.district_name;
    var tdtehsilName = row.insertCell(k++);
	tdtehsilName.innerHTML = rowData.tehsil_name !=null ? rowData.tehsil_name : ' ------ '; 

    var tdblockName = row.insertCell(k++);
    tdblockName.innerHTML = rowData.block_name != null ? rowData.block_name : ' ------ ';

    var tdunitName = row.insertCell(k++);
    tdunitName.innerHTML = rowData.unit_or_inst_name != null ? rowData.unit_or_inst_name : ' ------ ';

    var tdAddress = row.insertCell(k++);
    tdAddress.innerHTML = rowData.address1 != null ? rowData.address1 : ' ------ ';


    var tdAmount = row.insertCell(k++);
    tdAmount.innerHTML = rowData.amount != null ? parseFloat(rowData.amount).toFixed(2) : ' ------ ';

  	var tdCount = row.insertCell(k++);
    tdCount.innerHTML = rowData.unit_mp_empt_gen + rowData.unit_mp_obc_empt_gen + rowData.unit_mp_sc_empt_gen + rowData.unit_mp_st_empt_gen;

    var tdsanctionDate = row.insertCell(k++);
    tdsanctionDate.innerHTML = rowData.sanction_letter_date != null ? rowData.sanction_letter_date : ' ------ ';

    var tddisDate = row.insertCell(k++);
    tddisDate.innerHTML = rowData.sanction_letter_date != null ? rowData.sanction_letter_date : ' ------ ';

    var tdletterDate = row.insertCell(k++);
    tdletterDate.innerHTML = rowData.letter_date != null ? rowData.letter_date : ' ------ ';

    var tdunitType = row.insertCell(k++);
    tdunitType.innerHTML = rowData.unit_type != null ? rowData.unit_type : ' ------ ';

	 var tdcategory = row.insertCell(k++);
    tdcategory.innerHTML = rowData.category_name != null ? rowData.category_name : ' ------ ';
    




















}
prepareApplicationList(dataList);
},
"fa/reportScheme": (table,dataList,startRecord,params)=>{
const {districtId,status,scheme}=params;
const recordNotFound="Record not found !! Try again";
function prepareApplicationList(dataList) {
    try {
        var j = 0;
        var srNo = startRecord + 1;
        
        var applicationListTable = table;
        if (dataList != null) {
            for (const i in dataList) {
                var row = applicationListTable.insertRow(j++);
                createRowForApplicationList(row, srNo++, dataList[i])
            }
        }
        if (j == 0 || j == '0') {
            var row = applicationListTable.insertRow(j++);
            var tdNotFound = row.insertCell(0);
            tdNotFound.setAttribute("align", "center");
            tdNotFound.setAttribute("colspan", "14");
            tdNotFound.innerHTML = recordNotFound;
        }

    } catch (e) {
        alert(e);
        console.error('Some error in prepare list : ', e);

    }
}
function createRowForApplicationList(row, j, rowData) {
    var k = 0;
    
    var tdSrNo = row.insertCell(k++);
    tdSrNo.setAttribute("align", "center");
    tdSrNo.innerHTML = j;
    var tdApplicationid =row.insertCell(k++);;
    tdApplicationid.innerHTML=rowData.application_id;
    
	var tddistrictName = row.insertCell(k++);
    tddistrictName.innerHTML = rowData.district_name;
    var tdtehsilName = row.insertCell(k++);
	tdtehsilName.innerHTML = rowData.tehsil_name !=null ? rowData.tehsil_name : ' ------ '; 
											
    var tdblockName = row.insertCell(k++);
    tdblockName.innerHTML = rowData.block_name != null ? rowData.block_name : ' ------ ';

    var tdunitName = row.insertCell(k++);
    tdunitName.innerHTML = rowData.unit_or_inst_name != null ? rowData.unit_or_inst_name : ' ------ ';

    var tdAddress = row.insertCell(k++);
    tdAddress.innerHTML = rowData.address1 != null ? rowData.address1 : ' ------ ';

    var tdAmount = row.insertCell(k++);
    tdAmount.innerHTML = rowData.amount != null ? parseFloat(rowData.amount).toFixed(2) : ' ------ ';

  	var tdCount = row.insertCell(k++);
    tdCount.innerHTML = rowData.unit_mp_empt_gen + rowData.unit_mp_obc_empt_gen + rowData.unit_mp_sc_empt_gen + rowData.unit_mp_st_empt_gen;

    var tdsanctionDate = row.insertCell(k++);
    tdsanctionDate.innerHTML = rowData.sanction_letter_date != null ? rowData.sanction_letter_date : ' ------ ';

    var tddisDate = row.insertCell(k++);
    tddisDate.innerHTML = rowData.sanction_letter_date != null ? rowData.sanction_letter_date : ' ------ ';

    var tdletterDate = row.insertCell(k++);
    tdletterDate.innerHTML = rowData.letter_date != null ? rowData.letter_date : ' ------ ';

    var tdunitType = row.insertCell(k++);
    tdunitType.innerHTML = rowData.unit_type != null ? rowData.unit_type : ' ------ ';

	 var tdcategory = row.insertCell(k++);
    tdcategory.innerHTML = rowData.category_name != null ? rowData.category_name : ' ------ ';
    




















}
prepareApplicationList(dataList);
}
}