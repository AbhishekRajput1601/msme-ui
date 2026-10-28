export const rowRules = {
"admuser/hoList": (cell,nRow,aData,iDataIndex) => {
cell('td:eq(4)', nRow).html((function(data, type, row){
				  	            		var emailId=row.emailId;
				  	            		if(null== emailId){
				  	            			emailId="-";
				  	            		}
				  	            		return emailId; 
				  	            	})(null, 'display', aData));
cell('td:eq(5)', nRow).html((function(data, type, row){
				  	            		var mobileNumber=row.mobileNumber;
				  	            		if(null== mobileNumber){
				  	            			mobileNumber="-";
				  	            		}
				  	            		return mobileNumber; 
				  	            	})(null, 'display', aData));

								
							
								
								
								
								cell('td:eq(6)', nRow)
										.html(
												'<a class="blue" href="#viewHo/'+aData.userId+'" ><span th:text="#{application.page.viewEdit}">View Edit</span></a> | <a class="blue" href="#resetPassword/ho/'+aData.userId+'" ><span th:text="#{application.page.resetPassword}">Reset Password</span></a>');
							
},
"admuser/officerList": (cell,nRow,aData,iDataIndex) => {
cell('td:eq(2)', nRow).html((function(data, type, row){
			  	            		var designation=row.designation;
			  	            		if(null== designation){
			  	            			designation="-";
			  	            		}
			  	            		return designation; 
			  	            	})(null, 'display', aData));
cell('td:eq(3)', nRow).html((function(data, type, row){
			  	            		var userGroupDescription=row.userGroupDescription;
			  	            		if(null== userGroupDescription){
			  	            			userGroupDescription="-";
			  	            		}
			  	            		return userGroupDescription; 
			  	            	})(null, 'display', aData));
cell('td:eq(4)', nRow).html((function(data, type, row){
			  	            		var designation=row.designation;
			  	            		if(null== designation){
			  	            			designation="-";
			  	            		}
			  	            		return designation; 
			  	            	})(null, 'display', aData));
cell('td:eq(5)', nRow).html((function(data, type, row){
			  	            		var emailId=row.emailId;
			  	            		if(null== emailId){
			  	            			emailId="-";
			  	            		}
			  	            		return emailId; 
			  	            	})(null, 'display', aData));
cell('td:eq(6)', nRow).html((function(data, type, row){
			  	            		var mobileNumber=row.mobileNumber;
			  	            		if(null== mobileNumber){
			  	            			mobileNumber="-";
			  	            		}
			  	            		return mobileNumber; 
			  	            	})(null, 'display', aData));

								cell('td:eq(0)', nRow)
										.html(
												(iDataIndex + 1));
							


								
								
								
								cell('td:eq(7)', nRow)
										.html(
												'<a class="blue" href="#viewOfficer/'+aData.userId+'" ><span th:text="#{application.page.viewEdit}">View Edit</span></a> | <a class="blue" href="#resetPassword/officer/'+aData.userId+'" ><span th:text="#{application.page.resetPassword}">Reset Password</span></a>');
							
},
"admuser/zonalList": (cell,nRow,aData,iDataIndex) => {
cell('td:eq(4)', nRow).html((function(data, type, row){
			  	            		var designation=row.designation;
			  	            		if(null== designation){
			  	            			designation="-";
			  	            		}
			  	            		return designation; 
			  	            	})(null, 'display', aData));
cell('td:eq(6)', nRow).html((function(data, type, row){
			  	            		var mobileNumber=row.mobileNumber;
			  	            		if(null== mobileNumber){
			  	            			mobileNumber="-";
			  	            		}
			  	            		return mobileNumber; 
			  	            	})(null, 'display', aData));

								cell('td:eq(0)', nRow)
										.html(
												(iDataIndex + 1));
							

								
							
								
							
								
								cell('td:eq(7)', nRow)
										.html(
												'<a class="blue" href="#viewZonal/'+aData.userId+'" ><span th:text="#{application.page.viewEdit}">View Edit</span></a> | <a class="blue" href="#resetPassword/zonal/'+aData.userId+'" ><span th:text="#{application.page.resetPassword}">Reset Password</span></a>');
							
},
"admuser/dticList": (cell,nRow,aData,iDataIndex) => {
cell('td:eq(5)', nRow).html((function(data, type, row){
			  	            		var emailId=row.emailId;
			  	            		if(null== emailId){
			  	            			emailId="-";
			  	            		}
			  	            		return emailId; 
			  	            	})(null, 'display', aData));
cell('td:eq(6)', nRow).html((function(data, type, row){
			  	            		var mobileNumber=row.mobileNumber;
			  	            		if(null== mobileNumber){
			  	            			mobileNumber="-";
			  	            		}
			  	            		return mobileNumber; 
			  	            	})(null, 'display', aData));

								cell('td:eq(0)', nRow)
										.html(
												(iDataIndex + 1));
							

								
							
								
							
								
							
								
								cell('td:eq(7)', nRow)
										.html(
												'<a class="blue" href="#viewDtic/'+aData.userId+'" ><span th:text="#{application.page.viewEdit}">View Edit</span></a> | <a class="blue" href="#resetPassword/dtic/'+aData.userId+'" ><span th:text="#{application.page.resetPassword}">Reset Password</span></a>');
							
},
"admuser/applicantList": (cell,nRow,aData,iDataIndex) => {
cell('td:eq(5)', nRow).html((function(data, type, row){
			  	            		var aadhaarNumber=row.aadhaarNumber;
			  	            		if(null== aadhaarNumber){
			  	            			aadhaarNumber="-";
			  	            		}
			  	            		return aadhaarNumber; 
			  	            	})(null, 'display', aData));

								cell('td:eq(0)', nRow)
										.html(
												(iDataIndex + 1));
							

								
								
								
					
								cell('td:eq(6)', nRow)
										.html(
												'<a class="blue" href="#viewApplicant/'+aData.userId+'" ><span th:text="#{application.page.viewEdit}">View Edit</span></a> | <a class="blue" href="#resetPassword/applicant/'+aData.userId+'" ><span th:text="#{application.page.resetPassword}">Reset Password</span></a>');
							
},
"admuser/officeList": (cell,nRow,aData,iDataIndex) => {
cell('td:eq(1)', nRow).html((function(data, type, row){
			  	            		if(null== officeNameEnglish){
			  	            		var officeNameEnglish=row.officeNameEnglish;
			  	            		if(null== officeNameEnglish){
			  	            			officeNameEnglish="-";
			  	            		}
			  	            		return officeNameEnglish; 
			  	            		} else if(null== officeNameHindi){
			  	            		var officeNameHindi=row.officeNameHindi;
			  	            		if(null== officeNameHindi){
			  	            			officeNameHindi="-";
			  	            		}
			  	            		return officeNameHindi; 
			  	            		}
			  	            	})(null, 'display', aData));

								cell('td:eq(0)', nRow)
										.html(
												(iDataIndex + 1));
							


								
								cell('td:eq(6)', nRow)
										.html(
												'<a class="blue" href="#viewOffice/'+aData.officeId+'" ><span th:text="#{application.page.viewEdit}">View Edit</span></a>');
							
},
"admuser/externalOfficerList": (cell,nRow,aData,iDataIndex) => {

								cell('td:eq(0)', nRow)
										.html(
												(iDataIndex + 1));
							


								
								
								
								cell('td:eq(7)', nRow)
										.html(
												'<a class="blue" href="#resetPassword/externalOfficer/'+aData.userId+'" ><span th:text="#{application.page.resetPassword}">Reset Password</span></a>');
							
},
"admuser/supplyNameListAdm": (cell,nRow,aData,iDataIndex) => {
cell('td:eq(4)', nRow).html((function(data, type, row){
            	            		var supplyCategory=row.supplyCategory;
            	            		if(null== supplyCategory){
            	            			supplyCategory="-";
            	            		}
            	            		return supplyCategory; 
            	            	})(null, 'display', aData));
cell('td:eq(6)', nRow).html((function(data, type, row){
            	            		var emailId=row.emailId;
            	            		if(null== emailId){
            	            			emailId="-";
            	            		}
            	            		return emailId; 
            	            	})(null, 'display', aData));
cell('td:eq(7)', nRow).html((function(data, type, row){
            	            		var mobileNo=row.mobileNo;
            	            		if(null== mobileNo){
            	            			mobileNo="-";
            	            		}
            	            		return mobileNo; 
            	            	})(null, 'display', aData));

                                cell('td:eq(0)', nRow)
                                        .html(
                                                (iDataIndex + 1));
                            

                               
                                
                                cell('td:eq(9)', nRow).html('<a class="blue" href="#viewSupplyNameAdmin/'+aData.id+'" ><span>View</span></a>');
                                cell('td:eq(9)', nRow)
								.append( (aData.status != 'DELETED'  ? ' | <a data-toggle="tooltip" data-placement="top" title="Delete" onclick="return deleteSupply('
										+ aData.id
										+ ');" href="">Delete</a> '
										: ""));
                                cell('td:eq(9)', nRow).append((aData.status != 'DELETED'  ? ' | <a class="blue" href="#editSupplyNameAdmin/'+aData.id+'" ><span> Edit </span></a>': ""));
                            
},
"admuser/supplierNameListAdmin": (cell,nRow,aData,iDataIndex) => {
cell('td:eq(3)', nRow).html((function(data, type, row){
            	            		var supplySource=row.supplySource;
            	            		if(null== supplySource){
            	            			supplySource="-";
            	            		}
            	            		return supplySource; 
            	            	})(null, 'display', aData));
cell('td:eq(5)', nRow).html((function(data, type, row){
            	            		var emailId=row.emailId;
            	            		if(null== emailId){
            	            			emailId="";
            	            		}
            	            		return emailId; 
            	            	})(null, 'display', aData));
cell('td:eq(6)', nRow).html((function(data, type, row){
            	            		var mobileNo=row.mobileNo;
            	            		if(null== mobileNo){
            	            			mobileNo="";
            	            		}
            	            		return mobileNo; 
            	            	})(null, 'display', aData));
cell('td:eq(7)', nRow).html((function(data, type, row){
            	            		var external="No";
            	            		if(row.external=='Y'){
            	            			external="Yes";
            	            		}
            	            		return external; 
            	            	})(null, 'display', aData));

                                cell('td:eq(0)', nRow)
                                        .html(
                                                (iDataIndex + 1));
                            

                               
                                cell('td:eq(9)', nRow).html('<a class="blue" href="#viewSupplierNameAdmin/'+aData.id+'" ><span>View </span></a>');
                            	cell('td:eq(9)', nRow)
								.append( (aData.status != 'DELETED'  ? ' | <a data-toggle="tooltip" data-placement="top" title="Delete" onclick="return deleteSupplier('
										+ aData.id
										+ ');" href="">Delete</a> '
										: ""));
                            	 cell('td:eq(9)', nRow).append((aData.status != 'DELETED'  ? ' | <a class="blue" href="#editSupplierNameAdmin/'+aData.id+'" ><span> Edit </span></a>': ""));
                                
                                
                                
                                
                            
},
"admuser/tankerList": (cell,nRow,aData,iDataIndex) => {
cell('td:eq(3)', nRow).html((function(data, type, row){
            	            		var tankerCapacity=row.tankerCapacity;
            	            		if(null== tankerCapacity){
            	            			tankerCapacity="-";
            	            		}
            	            		return tankerCapacity; 
            	            	})(null, 'display', aData));

                                cell('td:eq(0)', nRow)
                                        .html(
                                                (iDataIndex + 1));
                            

                                cell('td:eq(5)', nRow).html('<a class="blue" href="#editTankerForm/'+aData.id+'" ><span>Edit</span></a>');
                                cell('td:eq(5)', nRow).append( ' | <a data-toggle="tooltip" data-placement="top" title="Delete" onclick="return deleteTanker('
										+ aData.id
										+ ');" href="">Delete</a> ');
                            
},
"admuser/supplySourceList": (cell,nRow,aData,iDataIndex) => {

                                cell('td:eq(0)', nRow)
                                        .html(
                                                (iDataIndex + 1));
                            

                                cell('td:eq(3)', nRow).html('<a class="blue" href="#editSupplySourceForm/'+aData.id+'" ><span>Edit</span></a>');
                                cell('td:eq(3)', nRow).append( ' | <a data-toggle="tooltip" data-placement="top" title="Delete" onclick="return deleteSupplySource('
										+ aData.id
										+ ');" href="">Delete</a> ');
                            
},
"admuser/tankerSupplierList": (cell,nRow,aData,iDataIndex) => {
cell('td:eq(3)', nRow).html((function(data, type, row){
            	            		var supplySource=row.supplySource;
            	            		if(null== supplySource){
            	            			supplySource="-";
            	            		}
            	            		return supplySource; 
            	            	})(null, 'display', aData));
cell('td:eq(4)', nRow).html((function(data, type, row){
            	            		var emailId=row.emailId;
            	            		if(null== emailId){
            	            			emailId="";
            	            		}
            	            		return emailId; 
            	            	})(null, 'display', aData));
cell('td:eq(5)', nRow).html((function(data, type, row){
            	            		var mobileNo=row.mobileNo;
            	            		if(null== mobileNo){
            	            			mobileNo="";
            	            		}
            	            		return mobileNo; 
            	            	})(null, 'display', aData));

                                cell('td:eq(0)', nRow)
                                        .html(
                                                (iDataIndex + 1));
                            

                               
                                cell('td:eq(7)', nRow).html('<a class="blue" href="#viewSupplierNameAdmin/'+aData.id+'" ><span>View </span></a>');
                            	cell('td:eq(7)', nRow)
								.append( (aData.status != 'DELETED'  ? ' | <a data-toggle="tooltip" data-placement="top" title="Delete" onclick="return deleteSupplier('
										+ aData.id
										+ ');" href="">Delete</a> '
										: ""));
                            	 cell('td:eq(7)', nRow).append((aData.status != 'DELETED'  ? ' | <a class="blue" href="#editSupplierNameAdmin/'+aData.id+'" ><span> Edit </span></a>': ""));
                                
                                
                                
                                
                            
}
}
