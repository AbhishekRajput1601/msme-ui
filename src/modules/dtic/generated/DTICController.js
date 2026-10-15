// Source: angular/dtic/controller.js. Generated static JS, with explicit React IO dependencies.
export function installActions(state, { request, loading, navigation, params, format, later, dom }) {
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,Array.isArray(items) ? Number(k) : k));
const identity = value => value;
const fetchSupplyNameList = () => { state.listVersion++; loading.finish(); };
const fetchSupplierNameList = () => { state.listVersion++; loading.finish(); };
const fetchEnrolment = () => { state.listVersion++; loading.finish(); };
let lastObjectId="", lastSchemeId="", lastSchemeTypeId="";
state.started = false;
state.isNotCurrent = false;
state.loadSupplyNameDetails = function() {
				loading.start('sample-1');
				var response = request.get('fetchSupplyNameDetailsById/' + params.id);
				response.success(function(data, status, headers, config) {
					if (null != data) {
						state.supplyNameBean = data;
						state.supplyNameBean.supplyTypeId = state.supplyNameBean.supplyTypeId + "";
						if (null != state.supplyNameBean.districtId) {
							state.supplyNameBean.districtId = state.supplyNameBean.districtId + "";
						}
					}

					
					loading.finish('sample-1');
				});
			};
state.editSupplyName = function(form, isValid) {

				if (!isValid) {
					return false;
				}

				if (confirm("Are you sure you want to save the data?")) {


					loading.start('sample-1');

					var responsePromise = request.post('addSupplyName', state.supplyNameBean);

					responsePromise.success(function(data, status, headers, config) {

						state.responseObject = data;

						if (state.responseObject.successMessage != null) {
							later(function() {
								state.responseObject.successMessage = null;
							}, 10000);
							alert(state.responseObject.successMessage);
							navigation.location.href = '#supplyNameList';
						}
						if (state.responseObject.errorMessage != null) {
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
state.addSupplyName = function(form, isValid) {

				if (!isValid) {
					return false;
				}

				if (confirm("Are you sure you want to save the data?")) {


					loading.start('sample-1');

					var responsePromise = request.post('addSupplyName', state.supplyNameBean);

					responsePromise.success(function(data, status, headers, config) {

						state.responseObject = data;

						if (state.responseObject.successMessage != null) {
							later(function() {
								state.responseObject.successMessage = null;
							}, 10000);
							alert(state.responseObject.successMessage);
							navigation.location.href = '#supplyNameList';
						}
						if (state.responseObject.errorMessage != null) {
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
state.loadDticDistricts = function() {

				loading.start('sample-1');

				var response = request.get('fetchDticDistricts');

				response.success(function(data, status, headers,
					config) {
					state.districts = data;
					if (null == state.supplyNameBean) {
						state.supplyNameBean = {};
					}
					state.supplyNameBean.districtId = state.districts[0].key + "";
					loading.finish('sample-1');
				});

			};
state.loadAllDistricts = function() {

				loading.start('sample-1');

				var response = request
					.get(
						'fetchdistrictmapbystate',
						{
							params: {
								'stateId': 20
							}
						});

				response.success(function(data, status, headers,
					config) {
					state.districts = data;
					if (null == state.supplyNameBean) {
						state.supplyNameBean = {};
					}
					
					loading.finish('sample-1');
				});

			};
state.loadDticDistrictsForSupplier1 = function() {

				loading.start('sample-1');

				var response = request.get('fetchDticDistricts');

				response.success(function(data, status, headers,
					config) {
					state.districts = data;
					state.supplierInfoData = {};
					state.supplierInfoData.districtId = state.districts[0].key + "";
					loading.finish('sample-1');
				});

			};
state.loadSupplierDetails = function() {
				loading.start('sample-1');
				var response = request.get('fetchSupplierNameDetailsById/' + params.id);
				response.success(function(data, status, headers, config) {
					if (null != data) {
						state.supplierInfoData = data;
						state.supplierInfoData.supplierTypeId = state.supplierInfoData.supplierTypeId + "";
						if (null != state.supplierInfoData.districtId) {

							var response1 = request.get('fetchDticDistricts');

							response1.success(function(data, status, headers,
								config) {
								state.districts = data;
								state.supplierInfoData.districtId = state.districts[0].key + "";
							});
						}
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
state.editSupplier = function(form, isValid) {

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
					fd.append('supplySource', state.supplierInfoData.supplySource);
					fd.append('id', params.id);
					fd.append('external', state.supplierInfoData.external);
					
					

					


					var responsePromise = request.post('addSupplier',
						fd, {
						transformRequest: identity,
						headers: {
							'Content-Type': undefined
						}
					});


					responsePromise.success(function(data, status, headers, config) {

						state.responseObject = data;

						if (state.responseObject.successMessage != null) {
							later(function() {
								state.responseObject.successMessage = null;
							}, 10000);
							navigation.location.href = '#supplierNameList';
						}
						if (state.responseObject.errorMessage != null) {
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
state.loadSupplyTypes = function() {

				loading.start('sample-1');

				var response = request.get('fetchSupplyTypes');

				response.success(function(data, status, headers,
					config) {
					state.supplyTypes = data;
					loading.finish('sample-1');
				});

			};
state.loadSupplyNameList = function() {
				loading.start('sample-1');
				fetchSupplyNameList();
			};
state.loadSupplierNameList = function() {
				loading.start('sample-1');
				fetchSupplierNameList();
			};
state.startOrStopSpinner = function(isStart) {

				if (isStart) {
					loading.start('sample-1');
				} else {
					loading.finish('sample-1');
				}
			};
state.fetchSupplyTypes = function() {

				loading.start('sample-1');

				var response = request.get('fetchSupplyTypes');

				response.success(function(data, status, headers,
					config) {
					state.supplyTypes = data;
					
				});

			};
state.fetchSupplyNames = function() {
				loading.start('sample-1');

				var response = request.get('fetchSupplyNamesBySupplyTypeId?supplyTypeId=' + 0);

				response.success(function(data, status, headers,
					config) {
					state.supplyNames = data;
					
				});
			};
state.fetchSupplyNamesBySupplyTypeId = function(ox1DetailsBean) {
				if (ox1DetailsBean.supplyTypeId != null) {
					loading.start('sample-1');

					var response = request.get('fetchSupplyNamesBySupplyTypeId?supplyTypeId=' + ox1DetailsBean.supplyTypeId);

					response.success(function(data, status, headers,
						config) {
						ox1DetailsBean.supplyNames = data;
						loading.finish('sample-1');
					});
				}
			};
state.assignSupplyNamesBySupplyTypeId = function(ox1DetailsBean) {

				if (state.supplyNames == null || state.supplyNames.length == 0) {

					loading.start('sample-1');

					var response = request.get('fetchSupplyNamesBySupplyTypeId?supplyTypeId=' + 0);

					response.success(function(data, status, headers,
						config) {
						state.supplyNames = data;
						
					}).then(function() {

						if (ox1DetailsBean.supplyTypeId != null) {
							ox1DetailsBean.supplyNames = state.supplyNames.filter(x => x.id == (ox1DetailsBean.supplyTypeId));
						}
						loading.finish('sample-1');
					})
				} else {
					if (ox1DetailsBean.supplyTypeId != null) {
						ox1DetailsBean.supplyNames = state.supplyNames.filter(x => x.id == (ox1DetailsBean.supplyTypeId));
					}
					loading.finish('sample-1');
				}
			};
state.fetchOx1FormDetails = function() {
				loading.start('sample-1');
				var responsePromise = request.get('fetchOx1FormDetails', { params: { 'entryDate': state.ox1Data.entryDate } });
				responsePromise.success(function(data, status, headers,
					config) {
					state.ox1Data = data;
					if (data.ox1BeanList == null) {
						
					}
					loading.finish('sample-1');
				});
			};
state.saveOX1Form = function(isValid) {

				if (!isValid)
					return false;

				if (confirm("Are you sure you want to save the data?")) {
					loading.start('sample-1');
					if (null != document.getElementById("submitBtn"))
						document.getElementById("submitBtn").disabled = true;
					var responsePromise = request.post('saveOX1Form', state.ox1Data);

					responsePromise
						.success(function(data, status, headers, config) {

							state.responseObject = data;
							if (state.responseObject.successMessage != null) {
								later(
									function() {
										state.responseObject.successMessage = null;
									}, 10000);
								navigation.location.href = '#ox1Form';
								
								
								
								
								if (null != document.getElementById("submitBtn"))
									document.getElementById("submitBtn").disabled = false;
								loading.finish('sample-1');
							}

						});
				}

			};
state.addEntry = function(list) {
				list.push({});
			};
state.removeEntryOx2ReceivedFrom = function(index, list) {
				list.splice(index, 1);
			};
state.removeEntry = function(parentIndex, index, list) {
				list.splice(index, 1);
				state.calculateTotalQty1(state.ox1Data.ox1BeanList);
				state.calculateClosingStock1(state.ox1Data.ox1BeanList[parentIndex]);
			};
state.removeEntryOx2 = function(parentIndex, index, list) {
				list.splice(index, 1);
				state.calculateTotalDTypeCyl2(state.ox2Data.ox2BeanList);
				state.calculateTotalBTypeCyl2(state.ox2Data.ox2BeanList);
				state.calculateClosingStockDTypeOx2(state.ox2Data.ox2BeanList[parentIndex]);
				state.calculateClosingStockBTypeOx2(state.ox2Data.ox2BeanList[parentIndex]);
			};
state.removeEntryOx3 = function(parentIndex, index, list) {
				list.splice(index, 1);
				state.calculateTotalBTypeCyl3(state.ox3Data.ox3BeanList);
				state.calculateTotalDTypeCyl3(state.ox3Data.ox3BeanList);
				state.calculateClosingStockDTypeOx3(state.ox3Data.ox3BeanList[parentIndex]);
				state.calculateClosingStockBTypeOx3(state.ox3Data.ox3BeanList[parentIndex]);
			};
state.removeEntryOx4 = function(parentIndex, index, list) {
				list.splice(index, 1);
				state.calculateClosingStockDType(state.ox4Data.ox4BeanList[parentIndex]);
				state.calculateClosingStockBType(state.ox4Data.ox4BeanList[parentIndex]);
				state.calculateTotalDTypeCyl4(state.ox4Data.ox4BeanList);
				state.calculateTotalBTypeCyl4(state.ox4Data.ox4BeanList);
			};
state.calculateTotalQty1 = function(ox1BeanList) {
				state.totalQty = 0;
				state.totalOpeningStock = 0;
				state.totalReceived = 0;
				state.grandTotalAvailable = 0;
				state.totalClosingStock = 0;
				each(ox1BeanList, function(ox1Bean) {
					var openingStock = ox1Bean.openingStock;
					if (null != openingStock) {
						state.totalOpeningStock = Number(state.totalOpeningStock) + Number(openingStock);
					}
					var receivedQty = ox1Bean.receivedQty;
					if (null != receivedQty) {
						state.totalReceived = Number(state.totalReceived) + Number(receivedQty);
					}
					var totalAvailable = ox1Bean.totalAvailable;
					if (null != totalAvailable) {
						state.grandTotalAvailable = Number(state.grandTotalAvailable) + Number(totalAvailable);
					}
					var closingStock = ox1Bean.closingStock;
					if (null != closingStock) {
						state.totalClosingStock = Number(state.totalClosingStock) + Number(closingStock);
					}
					each(ox1Bean.ox1DetailsBeans, function(ox1DetailsBean) {
						var supplyQty = ox1DetailsBean.supplyQty;
						if (null != supplyQty) {
							state.totalQty = Number(state.totalQty) + Number(ox1DetailsBean.supplyQty);
						}
						
					});
				});
				state.totalOpeningStock = state.totalOpeningStock.toFixed(3);
				state.totalReceived = state.totalReceived.toFixed(3);
				state.grandTotalAvailable = state.grandTotalAvailable.toFixed(3);
				state.totalClosingStock = state.totalClosingStock.toFixed(3);
				state.totalQty = (state.totalQty).toFixed(3);
			};
state.calculateTotalAvailable1 = function(ox1Bean) {

				ox1Bean.totalAvailable = (Number(ox1Bean.openingStock) + Number(ox1Bean.receivedQty)).toFixed(3);
			};
state.calculateClosingStock1 = function(ox1Bean) {

				var qty = 0;
				each(ox1Bean.ox1DetailsBeans, function(ox1DetailsBean) {
					qty = qty + Number((ox1DetailsBean.supplyQty == null) ? 0 : ox1DetailsBean.supplyQty);
				});
				ox1Bean.closingStock = (Number(ox1Bean.totalAvailable) - Number(qty)).toFixed(3);
			};
state.checkSupplyQty1 = function(ox1Data, ox1Bean, ox1DetailsBean) {

				var qty = 0;
				each(ox1Bean.ox1DetailsBeans, function(ox1DetailsBean) {
					qty = qty + Number((ox1DetailsBean.supplyQty == null) ? 0 : ox1DetailsBean.supplyQty);
				});
				if (qty > ox1Bean.totalAvailable) {
					ox1DetailsBean.supplyQty = "";
					alert("Total Supply quantity should be less than or equal to Total Available quantity.");
				}
				state.calculateTotalQty1(ox1Data.ox1BeanList);
				state.calculateClosingStock1(ox1Bean);
			};
state.calculateTotalDTypeCyl2 = function(ox2BeanList) {
				state.totalDTypeCyl = 0;

				state.totalOpeningStock = 0;
				state.totalReceived = 0;
				state.grandTotalAvailable = 0;
				state.totalOpeningStockDType = 0;
				state.totalOpeningStockBType = 0;
				state.totalDTypeFilled = 0;
				state.totalBTypeFilled = 0;
				state.totalClosingStock = 0;
				state.totalClosingStockDType = 0;
				state.totalClosingStockBType = 0;
				each(ox2BeanList, function(ox2Bean) {
					var openingStock = ox2Bean.openingStock;
					if (null != openingStock) {
						state.totalOpeningStock = Number(state.totalOpeningStock) + Number(openingStock);
					}
					var openingStockDType = ox2Bean.openingStockDType;
					if (null != openingStockDType) {
						state.totalOpeningStockDType = Number(state.totalOpeningStockDType) + Number(openingStockDType);
					}
					var openingStockBType = ox2Bean.openingStockBType;
					if (null != openingStockBType) {
						state.totalOpeningStockBType = Number(state.totalOpeningStockBType) + Number(openingStockBType);
					}
					var dtypeFilled = ox2Bean.dtypeFilled;
					if (null != dtypeFilled) {
						state.totalDTypeFilled = Number(state.totalDTypeFilled) + Number(dtypeFilled);
					}
					var btypeFilled = ox2Bean.btypeFilled;
					if (null != btypeFilled) {
						state.totalBTypeFilled = Number(state.totalBTypeFilled) + Number(btypeFilled);
					}
					var receivedQty = ox2Bean.receivedQty;
					if (null != receivedQty) {
						state.totalReceived = Number(state.totalReceived) + Number(receivedQty);
					}
					var totalAvailable = ox2Bean.totalAvailable;
					if (null != totalAvailable) {
						state.grandTotalAvailable = Number(state.grandTotalAvailable) + Number(totalAvailable);
					}
					var dtypeClosing = ox2Bean.dtypeClosing;
					if (null != dtypeClosing) {
						state.totalClosingStockDType = Number(state.totalClosingStockDType) + Number(dtypeClosing);
					}
					var btypeClosing = ox2Bean.btypeClosing;
					if (null != btypeClosing) {
						state.totalClosingStockBType = Number(state.totalClosingStockBType) + Number(btypeClosing);
					}
					var closingStock = ox2Bean.closingStock;
					if (null != closingStock) {
						state.totalClosingStock = Number(state.totalClosingStock) + Number(closingStock);
					}
					each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
						state.totalDTypeCyl = state.totalDTypeCyl + Number((ox2DetailsBean.dtype == null) ? 0 : ox2DetailsBean.dtype);
					});
					state.totalOpeningStock = state.totalOpeningStock.toFixed(3);
					state.totalReceived = state.totalReceived.toFixed(3);
					state.totalClosingStock = state.totalClosingStock.toFixed(3);
				});
				state.calculateTotalBTypeCyl2(ox2BeanList);
			};
state.calculateTotalBTypeCyl2 = function(ox2BeanList) {
				state.totalBTypeCyl = 0;
				each(ox2BeanList, function(ox2Bean) {
					each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
						state.totalBTypeCyl = state.totalBTypeCyl + Number((ox2DetailsBean.btype == null) ? 0 : ox2DetailsBean.btype);
					});
				});
			};
state.calculateReceivedQty = function(ox2ReceivedFromBean, ox2Bean) {
				var receivedQty = 0;

				each(ox2Bean.ox2ReceivedFromBeans, function(ox2ReceivedFromBean) {
					receivedQty = receivedQty + Number((ox2ReceivedFromBean.quantity == null) ? 0 : ox2ReceivedFromBean.quantity);
				});
				ox2Bean.receivedQty = receivedQty.toFixed(3);
				state.calculateTotalDTypeCyl2(state.ox2Data.ox2BeanList);
			};
state.calculateReceivedQtyDType = function(ox4Bean) {
				var receivedQty = 0;

				each(ox4Bean.ox4ReceivedFromBeans, function(ox4ReceivedFromBean) {
					receivedQty = receivedQty + Number((ox4ReceivedFromBean.quantityDType == null) ? 0 : ox4ReceivedFromBean.quantityDType);
				});
				ox4Bean.dtypeReceived = receivedQty;
			};
state.calculateReceivedQtyBType = function(ox4Bean) {
				var receivedQty = 0;

				each(ox4Bean.ox4ReceivedFromBeans, function(ox4ReceivedFromBean) {
					receivedQty = receivedQty + Number((ox4ReceivedFromBean.quantityBType == null) ? 0 : ox4ReceivedFromBean.quantityBType);
				});
				ox4Bean.btypeReceived = receivedQty;
			};
state.calculateTotalAvailable2 = function(ox2Bean) {

				ox2Bean.totalAvailable = (Number(ox2Bean.openingStock) + Number(ox2Bean.receivedQty)).toFixed(3);
				state.calculateTotalDTypeCyl2(state.ox2Data.ox2BeanList);
			};
state.calculateTotalDTypeCyl3 = function(ox3BeanList) {
				state.totalDTypeCyl = 0;

				state.totalPerDayCapacity = 0;
				state.totalOpeningStockDType = 0;
				state.totalOpeningStockBType = 0;
				state.grandTotalOxygenMfg = 0;
				state.totalDTypeFilled = 0;
				state.totalBTypeFilled = 0;
				state.totalClosingStockM3 = 0;
				state.totalClosingStockDType = 0;
				state.totalClosingStockBType = 0;

				each(ox3BeanList, function(ox3Bean) {

					var perDayCapacity = ox3Bean.perDayCapacity;
					if (null != perDayCapacity) {
						state.totalPerDayCapacity = Number(state.totalPerDayCapacity) + Number(perDayCapacity);
					}
					var openingStockDType = ox3Bean.openingStockDType;
					if (null != openingStockDType) {
						state.totalOpeningStockDType = Number(state.totalOpeningStockDType) + Number(openingStockDType);
					}
					var openingStockBType = ox3Bean.openingStockBType;
					if (null != openingStockBType) {
						state.totalOpeningStockBType = Number(state.totalOpeningStockBType) + Number(openingStockBType);
					}
					var totalOxygenMfg = ox3Bean.totalOxygenMfg;
					if (null != totalOxygenMfg) {
						state.grandTotalOxygenMfg = Number(state.grandTotalOxygenMfg) + Number(totalOxygenMfg);
					}
					var dtypeFilled = ox3Bean.dtypeFilled;
					if (null != dtypeFilled) {
						state.totalDTypeFilled = Number(state.totalDTypeFilled) + Number(dtypeFilled);
					}
					var btypeFilled = ox3Bean.btypeFilled;
					if (null != btypeFilled) {
						state.totalBTypeFilled = Number(state.totalBTypeFilled) + Number(btypeFilled);
					}
					var dtypeClosing = ox3Bean.closingStockDType;
					if (null != dtypeClosing) {
						state.totalClosingStockDType = Number(state.totalClosingStockDType) + Number(dtypeClosing);
					}
					var btypeClosing = ox3Bean.closingStockBType;
					if (null != btypeClosing) {
						state.totalClosingStockBType = Number(state.totalClosingStockBType) + Number(btypeClosing);
					}
					var closingStockM3 = ox3Bean.closingStockM3;
					if (null != closingStockM3) {
						state.totalClosingStockM3 = Number(state.totalClosingStockM3) + Number(closingStockM3);
					}

					each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
						state.totalDTypeCyl = state.totalDTypeCyl + Number((ox3DetailsBean.dtype == null) ? 0 : ox3DetailsBean.dtype);
					});
				});
				state.totalPerDayCapacity = state.totalPerDayCapacity.toFixed(3);
				state.grandTotalOxygenMfg = state.grandTotalOxygenMfg.toFixed(3);
				state.totalClosingStockM3 = state.totalClosingStockM3.toFixed(3);
				state.calculateTotalBTypeCyl3(ox3BeanList);
			};
state.calculateTotalBTypeCyl3 = function(ox3BeanList) {
				state.totalBTypeCyl = 0;
				each(ox3BeanList, function(ox3Bean) {
					each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
						state.totalBTypeCyl = state.totalBTypeCyl + Number((ox3DetailsBean.btype == null) ? 0 : ox3DetailsBean.btype);
					});
				});
			};
state.calculateTotalDTypeCyl4 = function(ox4BeanList) {
				state.totalDTypeCyl = 0;

				state.totalOpeningStockDType = 0;
				state.totalOpeningStockBType = 0;
				state.totalReceivedDType = 0;
				state.totalReceivedBType = 0;
				state.totalClosingStockDType = 0;
				state.totalClosingStockBType = 0;
				state.totalClosingStockM3 = 0;

				each(ox4BeanList, function(ox4Bean) {

					var openingStockDType = ox4Bean.dtypeOpening;
					if (null != openingStockDType) {
						state.totalOpeningStockDType = Number(state.totalOpeningStockDType) + Number(openingStockDType);
					}
					var openingStockBType = ox4Bean.btypeOpening;
					if (null != openingStockBType) {
						state.totalOpeningStockBType = Number(state.totalOpeningStockBType) + Number(openingStockBType);
					}
					var dtypeReceived = ox4Bean.dtypeReceived;
					if (null != dtypeReceived) {
						state.totalReceivedDType = Number(state.totalReceivedDType) + Number(dtypeReceived);
					}
					var btypeReceived = ox4Bean.btypeReceived;
					if (null != btypeReceived) {
						state.totalReceivedBType = Number(state.totalReceivedBType) + Number(btypeReceived);
					}
					var closingStockDType = ox4Bean.dtypeClosing;
					if (null != closingStockDType) {
						state.totalClosingStockDType = Number(state.totalClosingStockDType) + Number(closingStockDType);
					}
					var closingStockBType = ox4Bean.btypeClosing;
					if (null != closingStockBType) {
						state.totalClosingStockBType = Number(state.totalClosingStockBType) + Number(closingStockBType);
					}
					var closingStockM3 = ox4Bean.closingStockM3;
					if (null != closingStockM3) {
						state.totalClosingStockM3 = Number(state.totalClosingStockM3) + Number(closingStockM3);
					}

					each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
						state.totalDTypeCyl = state.totalDTypeCyl + Number((ox4DetailsBean.dtype == null) ? 0 : ox4DetailsBean.dtype);
					});
				});
				state.totalClosingStockM3 = state.totalClosingStockM3.toFixed(3);
				state.calculateTotalBTypeCyl4(ox4BeanList);
			};
state.calculateTotalBTypeCyl4 = function(ox4BeanList) {
				state.totalBTypeCyl = 0;
				each(ox4BeanList, function(ox4Bean) {
					each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
						state.totalBTypeCyl = state.totalBTypeCyl + Number((ox4DetailsBean.btype == null) ? 0 : ox4DetailsBean.btype);
					});
				});
			};
state.calculateClosingStockDType = function(ox4Bean) {

				var dtype = 0;
				each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
					dtype = dtype + Number((ox4DetailsBean.dtype == null) ? 0 : ox4DetailsBean.dtype);
				});
				ox4Bean.dtypeClosing = Number(ox4Bean.dtypeOpening) + Number(ox4Bean.dtypeReceived) - Number(dtype);
				ox4Bean.closingStockM3 = Number(ox4Bean.dtypeClosing * 7) + Number(ox4Bean.btypeClosing * 1.5);
			};
state.calculateClosingStockBType = function(ox4Bean) {

				var btype = 0;
				each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
					btype = btype + Number((ox4DetailsBean.btype == null) ? 0 : ox4DetailsBean.btype);
				});
				ox4Bean.btypeClosing = Number(ox4Bean.btypeOpening) + Number(ox4Bean.btypeReceived) - Number(btype);
				ox4Bean.closingStockM3 = Number(ox4Bean.dtypeClosing * 7) + Number(ox4Bean.btypeClosing * 1.5);
			};
state.checkDType4 = function(ox4Data, ox4Bean, ox4DetailsBean) {

				var dtype = 0;
				each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
					dtype = dtype + Number((ox4DetailsBean.dtype == null) ? 0 : ox4DetailsBean.dtype);
				});
				if (dtype > (Number(ox4Bean.dtypeOpening) + Number(ox4Bean.dtypeReceived))) {
					ox4DetailsBean.dtype = "";
					alert("Total D Type Cylinders should be less than or equal to Total Available quantity.");
				}
				state.calculateTotalDTypeCyl4(ox4Data.ox4BeanList);
				state.calculateClosingStockDType(ox4Bean);
			};
state.checkBType4 = function(ox4Data, ox4Bean, ox4DetailsBean) {

				var btype = 0;
				each(ox4Bean.ox4DetailsBeans, function(ox4DetailsBean) {
					btype = btype + Number((ox4DetailsBean.btype == null) ? 0 : ox4DetailsBean.btype);
				});
				if (btype > (Number(ox4Bean.btypeOpening) + Number(ox4Bean.btypeReceived))) {
					ox4DetailsBean.btype = "";
					alert("Total B Type Cylinders should be less than or equal to Total Available quantity.");
				}
				state.calculateTotalBTypeCyl4(ox4Data.ox4BeanList);
				state.calculateClosingStockBType(ox4Bean);
			};
state.checkCurrentDate = function(entryDate) {
				var currentDate = new Date();
				currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
				var parts = entryDate.split('/');
				
				
				var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
				if (mydate.getTime() == currentDate.getTime()) {
					state.isNotCurrent = false;
				} else {
					state.isNotCurrent = true;
					
				}
			};
state.fetchOx2FormDetails = function() {
				loading.start('sample-1');
				var responsePromise = request.get('fetchOx2FormDetails', { params: { 'entryDate': state.ox2Data.entryDate } });
				responsePromise.success(function(data, status, headers,
					config) {
					state.ox2Data = data;
					if (data.ox2BeanList == null) {
						
					}
					loading.finish('sample-1');
				});
			};
state.saveOX2Form = function(isValid) {

				if (!isValid)
					return false;

				if (confirm("Are you sure you want to save the data?")) {
					loading.start('sample-1');
					if (null != document.getElementById("submitBtn"))
						document.getElementById("submitBtn").disabled = true;
					var responsePromise = request.post('saveOX2Form', state.ox2Data);

					responsePromise
						.success(function(data, status, headers, config) {

							state.responseObject = data;
							if (state.responseObject.successMessage != null) {
								later(
									function() {
										state.responseObject.successMessage = null;
									}, 10000);
								navigation.location.href = '#ox2Form';
								
								
								
								
								if (null != document.getElementById("submitBtn"))
									document.getElementById("submitBtn").disabled = false;
								loading.finish('sample-1');
							}

						});
				}
			};
state.fetchOx3FormDetails = function() {
				loading.start('sample-1');
				var responsePromise = request.get('fetchOx3FormDetails', { params: { 'entryDate': state.ox3Data.entryDate } });
				responsePromise.success(function(data, status, headers,
					config) {
					state.ox3Data = data;
					if (data.ox3BeanList == null) {
						
					}
					loading.finish('sample-1');
				});
			};
state.saveOX3Form = function(isValid) {

				if (!isValid)
					return false;

				if (confirm("Are you sure you want to save the data?")) {
					loading.start('sample-1');
					if (null != document.getElementById("submitBtn"))
						document.getElementById("submitBtn").disabled = true;
					var responsePromise = request.post('saveOX3Form', state.ox3Data);

					responsePromise
						.success(function(data, status, headers, config) {

							state.responseObject = data;
							if (state.responseObject.successMessage != null) {
								later(
									function() {
										state.responseObject.successMessage = null;
									}, 10000);
								navigation.location.href = '#ox3Form';
								
								
								
								
								if (null != document.getElementById("submitBtn"))
									document.getElementById("submitBtn").disabled = true;
								loading.finish('sample-1');
							}

						});
				}
			};
state.fetchOx4FormDetails = function() {
				loading.start('sample-1');
				var responsePromise = request.get('fetchOx4FormDetails', { params: { 'entryDate': state.ox4Data.entryDate } });
				responsePromise.success(function(data, status, headers,
					config) {
					state.ox4Data = data;
					if (data.ox4BeanList == null) {
						
					}
					loading.finish('sample-1');
				});
			};
state.exportToExcel = function(tableId) { 
				var exportHref = Excel.tableToExcel(tableId, '1', 'sheet 1');
				later(function() { location.href = exportHref; }, 1); 
			};
state.saveOX4Form = function(isValid) {

				if (!isValid)
					return false;

				if (confirm("Are you sure you want to save the data?")) {
					loading.start('sample-1');
					if (null != document.getElementById("submitBtn"))
						document.getElementById("submitBtn").disabled = true;
					var responsePromise = request.post('saveOX4Form', state.ox4Data);

					responsePromise
						.success(function(data, status, headers, config) {

							state.responseObject = data;
							if (state.responseObject.successMessage != null) {
								later(
									function() {
										state.responseObject.successMessage = null;
									}, 10000);
								navigation.location.href = '#ox4Form';
								
								
								
								
								if (null != document.getElementById("submitBtn"))
									document.getElementById("submitBtn").disabled = true;
								loading.finish('sample-1');
							}
						});
				}
			};
state.setAsNumber1 = function(ox1Bean, ox1DetailsBean) {
				if (ox1Bean) {
					ox1Bean.openingStock = Number(ox1Bean.openingStock);
					ox1Bean.receivedQty = Number(ox1Bean.receivedQty);
				}
				if (ox1DetailsBean) {
					ox1DetailsBean.supplyQty = Number(ox1DetailsBean.supplyQty ? ox1DetailsBean.supplyQty : 0);
				}
			};
state.setAsNumber2 = function(ox2Bean, ox2DetailsBean) {
				if (ox2Bean) {
					ox2Bean.openingStock = Number(ox2Bean.openingStock);
					ox2Bean.receivedQty = Number(ox2Bean.receivedQty);
					ox2Bean.dtypeFilled = Number(ox2Bean.dtypeFilled);
					ox2Bean.btypeFilled = Number(ox2Bean.btypeFilled);
					ox2Bean.closingStock = Number(ox2Bean.closingStock);
					ox2Bean.openingStockDType = Number(ox2Bean.openingStockDType);
					ox2Bean.openingStockBType = Number(ox2Bean.openingStockBType);
				}
				if (ox2DetailsBean) {
					
					ox2DetailsBean.dtype = Number(ox2DetailsBean.dtype ? ox2DetailsBean.dtype : 0);
					ox2DetailsBean.btype = Number(ox2DetailsBean.btype ? ox2DetailsBean.btype : 0);
				}
			};
state.setAsNumber2Qty = function(ox2ReceivedBean) {
				if (ox2ReceivedBean) {
					ox2ReceivedBean.quantity = Number(ox2ReceivedBean.quantity ? ox2ReceivedBean.quantity : 0);
				}
			};
state.setAsNumber4Qty = function(ox4ReceivedBean) {
				if (ox4ReceivedBean) {
					ox4ReceivedBean.quantityDType = Number(ox4ReceivedBean.quantityDType ? ox4ReceivedBean.quantityDType : 0);
					ox4ReceivedBean.quantityBType = Number(ox4ReceivedBean.quantityBType ? ox4ReceivedBean.quantityBType : 0);
				}
			};
state.setAsNumber3 = function(ox3Bean, ox3DetailsBean) {
				if (ox3Bean) {
					ox3Bean.openingStockDType = Number(ox3Bean.openingStockDType);
					ox3Bean.openingStockBType = Number(ox3Bean.openingStockBType);
					ox3Bean.perDayCapacity = Number(ox3Bean.perDayCapacity);
					ox3Bean.totalOxygenMfg = Number(ox3Bean.totalOxygenMfg);
					ox3Bean.dtypeFilled = Number(ox3Bean.dtypeFilled);
					ox3Bean.btypeFilled = Number(ox3Bean.btypeFilled);
				}
				if (ox3DetailsBean) {
					ox3DetailsBean.dtype = Number(ox3DetailsBean.dtype ? ox3DetailsBean.dtype : 0);
					ox3DetailsBean.btype = Number(ox3DetailsBean.btype ? ox3DetailsBean.btype : 0);
				}
			};
state.setAsNumber4 = function(ox4Bean, ox4DetailsBean) {
				if (ox4Bean) {
					ox4Bean.dtypeOpening = Number(ox4Bean.dtypeOpening);
					ox4Bean.btypeOpening = Number(ox4Bean.btypeOpening);
					ox4Bean.dtypeReceived = Number(ox4Bean.dtypeReceived);
					ox4Bean.btypeReceived = Number(ox4Bean.btypeReceived);
				}
				if (ox4DetailsBean) {
					ox4DetailsBean.dtype = Number(ox4DetailsBean.dtype ? ox4DetailsBean.dtype : 0);
					ox4DetailsBean.btype = Number(ox4DetailsBean.btype ? ox4DetailsBean.btype : 0);
				}
			};
state.checkTimeForDTICUpdation = function() {
				var currentDate = new Date();
				var DticOpenTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 19, 0, 0, 0);
				var DticCloseTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 0);

				if (currentDate < DticOpenTime || currentDate > DticCloseTime) {
					
					
				}
				state.isNotCurrent = false;
			};
state.populateCurrentDay = function() {
				var d = new Date();

				state.entryDate = ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
			};
state.sum = function(items, prop) {
				if (items == null) {
					return 0;
				}
				return items.reduce(function(a, b) {
					return (b[prop] == null || !b[prop]) ? a : a + parseFloat(b[prop] ? b[prop] : 0);
				}, 0);
			};
state.fetchSupplierOxgAvailabilityReport = function() {
				loading.start('sample-1');
				var responsePromise = request.get('fetchSupplierOxgAvailabilityReport', { params: { 'entryDate': state.entryDate } });
				responsePromise.success(function(data, status, headers,
					config) {
					state.reportData = data;
					loading.finish('sample-1');
				}).then(
					function(response) {
						state.receivedTotal = state.sum(state.reportData, 'received');
						state.dispatchedTotal = state.sum(state.reportData, 'dispatched');
						state.closingTotal = state.sum(state.reportData, 'closingStock');
					});
			};
state.fetchFacilityOxgAvailabilityReport = function() {
				loading.start('sample-1');
				var responsePromise = request.get('fetchFacilityOxgAvailabilityReport', { params: { 'entryDate': state.entryDate } });
				responsePromise.success(function(data, status, headers,
					config) {
					state.reportData = data;
					loading.finish('sample-1');
				}).then(
					function(response) {
						state.receivedTotal = state.sum(state.reportData, 'received');
					});
			};
state.facilityNameOnChange = function(type, oxDetailsBean) {
				if (type == 1 && oxDetailsBean.supplyQty == null) {
					oxDetailsBean.supplyQty = 0;
				} else if (type == 2) {
					if (oxDetailsBean.supplyQty == null) {
						oxDetailsBean.supplyQty = 0;
					}
					if (oxDetailsBean.dtype == null) {
						oxDetailsBean.dtype = 0;
					}
					if (oxDetailsBean.btype == null) {
						oxDetailsBean.btype = 0;
					}
				} else if (type == 3) {
					if (oxDetailsBean.dtype == null) {
						oxDetailsBean.dtype = 0;
					}
					if (oxDetailsBean.btype == null) {
						oxDetailsBean.btype = 0;
					}
				} else if (type == 4) {
					if (oxDetailsBean.dtype == null) {
						oxDetailsBean.dtype = 0;
					}
					if (oxDetailsBean.btype == null) {
						oxDetailsBean.btype = 0;
					}
				}

			};
state.validateSuppliedDTypeOx2 = function(ox2Bean, ox2DetailsBean) {
				var dtype = 0;

				each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
					dtype = dtype + Number((ox2DetailsBean.dtype == null) ? 0 : ox2DetailsBean.dtype);
				});

				if (dtype > (Number(ox2Bean.openingStockDType) + Number(ox2Bean.dtypeFilled))) {
					ox2DetailsBean.dtype = "";
					alert("Total D Type Cylinders should be less than or equal to Opening Stock D-Type + Cylinders Filled (D-Type).");
				}
				
				state.calculateClosingStockDTypeOx2(ox2Bean);
			};
state.validateSuppliedBTypeOx2 = function(ox2Bean, ox2DetailsBean) {
				var btype = 0;

				each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
					btype = btype + Number((ox2DetailsBean.btype == null) ? 0 : ox2DetailsBean.btype);
				});

				if (btype > (Number(ox2Bean.openingStockBType) + Number(ox2Bean.btypeFilled))) {
					ox2DetailsBean.btype = "";
					alert("Total B Type Cylinders should be less than or equal to Opening Stock B-Type + Cylinders Filled (B-Type).");
				}
				state.calculateTotalBTypeCyl2(state.ox2Data.ox2BeanList);
				state.calculateClosingStockBTypeOx2(ox2Bean);
			};
state.validateSuppliedDTypeOx3 = function(ox3Bean, ox3DetailsBean) {
				var dtype = 0;

				each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
					dtype = dtype + Number((ox3DetailsBean.dtype == null) ? 0 : ox3DetailsBean.dtype);
				});

				if (dtype > (Number(ox3Bean.openingStockDType) + Number(ox3Bean.dtypeFilled))) {
					ox3DetailsBean.dtype = "";
					alert("Total D Type Cylinders should be less than or equal to Opening Stock D-Type + Cylinders Filled (D-Type).");
				}
				state.calculateTotalDTypeCyl3(state.ox3Data.ox3BeanList);
				state.calculateClosingStockDTypeOx3(ox3Bean);
			};
state.validateSuppliedBTypeOx3 = function(ox3Bean, ox3DetailsBean) {
				var btype = 0;

				each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
					btype = btype + Number((ox3DetailsBean.btype == null) ? 0 : ox3DetailsBean.btype);
				});

				if (btype > (Number(ox3Bean.openingStockBType) + Number(ox3Bean.btypeFilled))) {
					ox3DetailsBean.btype = "";
					alert("Total B Type Cylinders should be less than or equal to Opening Stock B-Type + Cylinders Filled (B-Type).");
				}
				state.calculateTotalBTypeCyl3(state.ox3Data.ox3BeanList);
				state.calculateClosingStockBTypeOx3(ox3Bean);
			};
state.calculateClosingStockDTypeOx3 = function(ox3Bean) {
				var totalDTypeCyl = 0;
				each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
					totalDTypeCyl = totalDTypeCyl + Number((ox3DetailsBean.dtype == null) ? 0 : ox3DetailsBean.dtype);
				});
				ox3Bean.closingStockDType = Number(ox3Bean.openingStockDType) + Number(ox3Bean.dtypeFilled) - Number(totalDTypeCyl);
				ox3Bean.closingStockM3 = Number(ox3Bean.closingStockDType * 7) + Number(ox3Bean.closingStockBType * 1.5);
			};
state.calculateClosingStockBTypeOx3 = function(ox3Bean) {
				var totalBTypeCyl = 0;
				each(ox3Bean.ox3DetailsBeans, function(ox3DetailsBean) {
					totalBTypeCyl = totalBTypeCyl + Number((ox3DetailsBean.btype == null) ? 0 : ox3DetailsBean.btype);
				});
				ox3Bean.closingStockBType = Number(ox3Bean.openingStockBType) + Number(ox3Bean.btypeFilled) - Number(totalBTypeCyl);
				ox3Bean.closingStockM3 = Number(ox3Bean.closingStockDType * 7) + Number(ox3Bean.closingStockBType * 1.5);
			};
state.calculateClosingStockDTypeOx2 = function(ox2Bean) {
				var totalDTypeCyl = 0;
				each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
					totalDTypeCyl = totalDTypeCyl + Number((ox2DetailsBean.dtype == null) ? 0 : ox2DetailsBean.dtype);
				});
				ox2Bean.dtypeClosing = Number(ox2Bean.openingStockDType) + Number(ox2Bean.dtypeFilled) - Number(totalDTypeCyl);
				state.calculateTotalDTypeCyl2(state.ox2Data.ox2BeanList);
			};
state.calculateClosingStockBTypeOx2 = function(ox2Bean) {
				var totalBTypeCyl = 0;
				each(ox2Bean.ox2DetailsBeans, function(ox2DetailsBean) {
					totalBTypeCyl = totalBTypeCyl + Number((ox2DetailsBean.btype == null) ? 0 : ox2DetailsBean.btype);
				});
				ox2Bean.btypeClosing = Number(ox2Bean.openingStockBType) + Number(ox2Bean.btypeFilled) - Number(totalBTypeCyl);
				state.calculateTotalDTypeCyl2(state.ox2Data.ox2BeanList);
			};
state.fetchLMOSupplierReport = function() {
				loading.start('sample-1');
				var responsePromise = request.get('fetchLMOSupplierReport', { params: { 'entryDate': state.entryDate } });
				responsePromise.success(function(data, status, headers,
					config) {
					state.reportData = data;
					loading.finish('sample-1');
				}).then(
					function(response) {
						
					});
			};
state.fetchSupplyFromSuppliersForOx2OrOx4 = function(oxBean, type, districtId, supplySource) {


				if (state.receivedFroms == null || state.receivedFroms.length == 0) {
					
					var response = request.get('fetchSupplyFromSuppliersForOx2OrOx4?type=' + type);

					response.success(function(data, status, headers,
						config) {
						state.receivedFroms = data;
						
					}).then(function(data, status, headers,
						config) {
						var external = null;
						if (supplySource == 'Other State') {
							external = 'Y';
						} else if (supplySource == 'Madhya Pradesh') {
							external = 'N';
						}
						
						if (null != external)
							
							oxBean.receivedFroms = state.receivedFroms;
						else
							oxBean.receivedFroms = state.receivedFroms;
						
					});
				} else {
					var external = null;
					if (supplySource == 'Other State') {
						external = 'Y';
					} else if (supplySource == 'Madhya Pradesh') {
						external = 'N';
					}
					
					if (null != external)
						
						oxBean.receivedFroms = state.receivedFroms;
					else
						oxBean.receivedFroms = state.receivedFroms;
					
				}

			};
state.fetchSupplyFromSuppliersForOx2OrOx4Main = function(type) {

				
				var response = request.get('fetchSupplyFromSuppliersForOx2OrOx4?type=' + type);

				response.success(function(data, status, headers,
					config) {
					state.receivedFroms = data;
					
				})

			};
state.exportToExcel1 = function(fileName, tableId) { 

				var uri = 'data:application/vnd.ms-excel;base64,',
					template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
					base64 = function(s) { return navigation.btoa(unescape(encodeURIComponent(s))); },
					format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) };
				name = fileName + '.xls';
				var table = document.querySelector(tableId),
					ctx = { table: table.innerHTML };
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
state.fetchDistrictFacilityTypeSummaryDashboardAdmin = function(type) {
				var districtId = 0;
				if (null != state.districtId && state.districtId != '') {
					districtId = state.districtId;
				}
				loading.start('sample-1');
				var responsePromise = request.get('fetchDistrictFacilityTypeSummaryDashboardAdmin?entryDate=' + state.entryDate + '&districtId=' + districtId + '&type=' + type);
				responsePromise.success(function(data, status, headers,
					config) {
					state.districtFacilityTypeBeans = data;
					if (null != state.districtFacilityTypeBeans) {
						var districtFacilityTypeBean = state.districtFacilityTypeBeans[0];

						state.totalSuppliedGovtMedicalCollege = districtFacilityTypeBean.totalSuppliedGovtMedicalCollege;
						state.totalSuppliedPvtMedicalCollege = districtFacilityTypeBean.totalSuppliedPvtMedicalCollege;
						state.totalSuppliedGovtHospital = districtFacilityTypeBean.totalSuppliedGovtHospital;
						state.totalSuppliedPvtHospital = districtFacilityTypeBean.totalSuppliedPvtHospital;
						state.totalSuppliedIndustrialUsers = districtFacilityTypeBean.totalSuppliedIndustrialUsers;
						state.totalSuppliedSumOfIndividualUsers = districtFacilityTypeBean.totalSuppliedSumOfIndividualUsers;
						state.grandTotalSupplied = districtFacilityTypeBean.grandTotalSupplied;
					}
					loading.finish('sample-1');
				});
			};
state.checkReceivedQty = function(oxBean) {
				if (null != oxBean.receivedQty) {
					var split = oxBean.receivedQty.split(".")[0];
					if (split > 99) {
						alert("Received Qty (KL) should be less than 100");
						oxBean.receivedQty = null;
					}
				}
			};
state.checkSupplyQty = function(oxDetailsBean) {
				if (null != oxDetailsBean.supplyQty) {
					var split = oxDetailsBean.supplyQty.split(".")[0];
					if (split > 99) {
						alert("Supply Qty (KL) should be less than 100");
						oxDetailsBean.supplyQty = null;
					}
				}
			};
state.checkReceivedFromQty = function(oxReceivedFromBean) {
				if (null != oxReceivedFromBean.quantity) {
					var split = oxReceivedFromBean.quantity.split(".")[0];
					if (split > 99) {
						alert("Received From - Quantity (KL) should be less than 100");
						oxReceivedFromBean.quantity = null;
					}
				}
			};
state.loadDticDistrictsForSupplier = function() {
	loading.start('sample-1');
	var response = request.get('fetchDticDistricts');
	response.success(function(data) {
		state.districts = data;
		state.supplierInfoData = state.supplierInfoData || {};
		state.supplierInfoData.external = state.supplierInfoData.external || 'N';
		if (data && data.length) {
			state.supplierInfoData.districtId = data[0].key + "";
		}
		if (state.supplierInfoData.status == null) {
			state.supplierInfoData.status = 'INACTIVE';
		}
		loading.finish('sample-1');
	});
};
state.fetchSupplierTypes = function() {
	loading.start('sample-1');
	var response = request.get('fetchSupplierTypes');
	response.success(function(data) {
		state.supplierTypes = data;
		loading.finish('sample-1');
	});
};
state.addSupplier = function(form, isValid) {
	if (!isValid) return false;
	if (navigation.confirm("Are you sure you want to save the data?")) {
		loading.start('sample-1');
		var fd = new FormData();
		var d = state.supplierInfoData || {};
		fd.append('supplierName', d.supplierName || '');
		fd.append('supplierTypeId', d.supplierTypeId || '');
		fd.append('authorisedPersonName', d.authorisedPersonName || '');
		fd.append('mobileNo', d.mobileNo || '');
		fd.append('emailId', d.emailId || '');
		fd.append('address', d.address || '');
		fd.append('pin', d.pin || '');
		fd.append('districtId', d.districtId || '');
		fd.append('status', d.status || 'INACTIVE');
		fd.append('supplySource', d.supplySource || '');
		fd.append('external', d.external || 'N');
		var responsePromise = request.post('addSupplier', fd);
		responsePromise.success(function(data) {
			state.responseObject = data;
			if (state.responseObject && state.responseObject.successMessage != null) {
				later(function() { state.responseObject.successMessage = null; }, 10000);
				navigation.location.href = '#supplierNameList';
			}
			loading.finish('sample-1');
		});
		responsePromise.error(function() {
			state.responseObject = { errorMessage: "Some error occured while saving the data" };
			loading.finish('sample-1');
		});
	}
};
state.loadSupplierDetails = function() {
	loading.start('sample-1');
	var response = request.get('fetchSupplierDetailsById/' + params.id);
	response.success(function(data) {
		if (data) {
			state.supplierInfoData = data;
			if (data.supplierTypeId != null) state.supplierInfoData.supplierTypeId = data.supplierTypeId + "";
			if (data.districtId != null) state.supplierInfoData.districtId = data.districtId + "";
			if (data.external != null) state.supplierInfoData.external = data.external + "";
		}
		loading.finish('sample-1');
	});
};
state.fetchSupplierTypes1 = function() {
	state.fetchSupplierTypes();
};
state.editSupplier = function(form, isValid) {
	if (!isValid) return false;
	if (navigation.confirm("Are you sure you want to save the data?")) {
		loading.start('sample-1');
		var fd = new FormData();
		var d = state.supplierInfoData || {};
		if (params.id || d.id) fd.append('id', params.id || d.id);
		fd.append('supplierName', d.supplierName || '');
		fd.append('supplierTypeId', d.supplierTypeId || '');
		fd.append('authorisedPersonName', d.authorisedPersonName || '');
		fd.append('mobileNo', d.mobileNo || '');
		fd.append('emailId', d.emailId || '');
		fd.append('address', d.address || '');
		fd.append('pin', d.pin || '');
		fd.append('districtId', d.districtId || '');
		fd.append('status', d.status || 'INACTIVE');
		fd.append('supplySource', d.supplySource || '');
		fd.append('external', d.external || 'N');
		var responsePromise = request.post('addSupplier', fd);
		responsePromise.success(function(data) {
			state.responseObject = data;
			if (state.responseObject && state.responseObject.successMessage != null) {
				later(function() { state.responseObject.successMessage = null; }, 10000);
				navigation.location.href = '#supplierNameList';
			}
			loading.finish('sample-1');
		});
		responsePromise.error(function() {
			state.responseObject = { errorMessage: "Some error occured while saving the data" };
			loading.finish('sample-1');
		});
	}
};
state.loadSupplierNameList = function() {
	loading.start('sample-1');
	fetchSupplierNameList();
};
state.loadEnrolment = function() {
	loading.start('sample-1');
	fetchEnrolment();
};
state.loadEnrollment = function() {
	loading.start('sample-1');
	fetchEnrolment();
};
state.loadEnrollmentDetail = function() {
	state.loadEnlrolmentDetail();
};
state.loadEnlrolmentDetail = function() {
	state.disabled = true;
	loading.start('sample-1');
	var responsePromise = request.get('fetchEnrolmentDetails', { params: { 'userId': params.userId } });
	responsePromise.success(function(data) {
		state.opData = data || {};
		if (data) {
			if (data.gender) state.opData.gender = data.gender + "";
			if (data.status) state.opData.status = data.status + "";
			if (data.employeeType) state.opData.employeeType = data.employeeType + "";
			if (data.maritalStatus) state.opData.maritalStatus = data.maritalStatus + "";
			if (data.physicallyDisabled != null) state.opData.physicallyDisabled = data.physicallyDisabled + "";
			if (data.category) state.opData.category = data.category + "";
			if (data.bloodGroup) state.opData.bloodGroup = data.bloodGroup + "";
			if (data.state) state.opData.state = data.state + "";
			if (data.district) state.opData.district = data.district + "";
			if (data.tehsil) state.opData.tehsil = data.tehsil + "";
			if (data.permanentState) state.opData.permanentState = data.permanentState + "";
			if (data.permanentDistrict) state.opData.permanentDistrict = data.permanentDistrict + "";
			if (data.permanentTehsil) state.opData.permanentTehsil = data.permanentTehsil + "";
			if (data.dateOfBirth) state.opData.dateOfBirth = data.dateOfBirth + "";
			if (data.dateOfJoining) state.opData.dateOfJoining = data.dateOfJoining + "";
			if (data.dateOfRetirement) state.opData.dateOfRetirement = data.dateOfRetirement + "";
			if (data.designation) state.opData.designation = data.designation + "";
			if (data.posterOfficeType) state.opData.officeType = data.posterOfficeType + "";
			if (data.officeName) state.opData.officeName = data.officeName + "";
		}
		var responseCategories = request.get('fetchcategoriesmap');
		responseCategories.success(function(cat) { state.categories = cat; });
		var responseDesignation = request.get('fetchdesignationmap');
		responseDesignation.success(function(des) { state.designationList = des; });
		var responseGender = request.get('fetchgendermap');
		responseGender.success(function(gen) { state.genderList = gen; });
		var responseOfficeTypes = request.get('fetchallofficestypelist');
		responseOfficeTypes.success(function(oft) {
			state.officeTypeList = oft;
			if (state.opData && state.opData.officeType) {
				var responseOffice = request.get('fetchOfficeByTypeId/' + state.opData.officeType);
				responseOffice.success(function(off) { state.officesList = off; });
			}
		});
		if (state.opData && state.opData.state) {
			state.fetchPresentAddDistrictByState(state.opData.state);
		}
		if (state.opData && state.opData.district) {
			state.fetchTehsilByDistrict(state.opData.district);
		}
		if (state.opData && state.opData.permanentState) {
			state.fetchPermanentAddDistrictByState(state.opData.permanentState);
		}
		if (state.opData && state.opData.permanentDistrict) {
			state.fetchPermanentTehsilByDistrict(state.opData.permanentDistrict);
		}
		loading.finish('sample-1');
	});
};
state.fetchAllOfficeTypes = function() {
	var response = request.get('fetchallofficestypelist');
	response.success(function(data) {
		state.officeTypeList = data;
	});
};
state.fetchAllOfficesByOfficeType = function() {
	if (!state.opData || !state.opData.officeType) return;
	loading.start('sample-1');
	state.opData.officeName = null;
	var response = request.get('fetchOfficeByTypeId/' + state.opData.officeType);
	response.success(function(data) {
		state.officesList = data;
		loading.finish('sample-1');
	});
};
state.fetchAllStates = function() {
	var response = request.get('fetchallstates');
	response.success(function(data) {
		state.respondentStates = data;
		state.states = data;
	});
};
state.fetchPresentAddDistrictByState = function(stateId) {
	if (!stateId) return;
	var response = request.get('fetchdistrictmapbystate', { params: { stateId: stateId } });
	response.success(function(data) {
		state.districts = data;
	});
};
state.fetchTehsilByDistrict = function(districtId) {
	if (!districtId) return;
	var response = request.get('fetchtehsilmapbydistrict', { params: { districtId: districtId } });
	response.success(function(data) {
		state.tehsils = data;
	});
};
state.fetchPermanentAddDistrictByState = function(stateId) {
	if (!stateId) return;
	var response = request.get('fetchdistrictmapbystate', { params: { stateId: stateId } });
	response.success(function(data) {
		state.permanentDistricts = data;
	});
};
state.fetchPermanentTehsilByDistrict = function(districtId) {
	if (!districtId) return;
	var response = request.get('fetchtehsilmapbydistrict', { params: { districtId: districtId } });
	response.success(function(data) {
		state.permanentTehsils = data;
	});
};
state.setSameAddress = function() {
	if (state.sameAsAbovecheck) {
		state.opData.permanentAddress1 = state.opData.address1;
		state.opData.permanentAddress2 = state.opData.address2;
		state.opData.permanentAddress3 = state.opData.address3;
		state.opData.permanentState = state.opData.state;
		state.fetchPermanentAddDistrictByState(state.opData.permanentState);
		state.opData.permanentDistrict = state.opData.district;
		state.fetchPermanentTehsilByDistrict(state.opData.permanentDistrict);
		state.opData.permanentTehsil = state.opData.tehsil;
		state.opData.permanentPinCode = state.opData.pinCode;
	} else {
		state.opData.permanentAddress1 = '';
		state.opData.permanentAddress2 = '';
		state.opData.permanentAddress3 = '';
		state.opData.permanentState = '';
		state.opData.permanentDistrict = '';
		state.opData.permanentTehsil = '';
		state.opData.permanentPinCode = '';
	}
};
state.saveEnrolmentForm = function(isValid, profileImage) {
	if (!isValid) return false;
	loading.start('sample-1');
	var fd = new FormData();
	var d = state.opData || {};
	if (params.userId) fd.append('userId', params.userId);
	if (d.userEnrolmentId) fd.append('userEnrolmentId', d.userEnrolmentId);
	if (profileImage) fd.append('profileImage', profileImage);
	if (d.fullName) fd.append('fullName', d.fullName);
	if (d.address) fd.append('address', d.address);
	if (d.dateOfBirth) fd.append('dateOfBirth', d.dateOfBirth);
	if (d.employeeId) fd.append('employeeId', d.employeeId);
	if (d.employeeType) fd.append('employeeType', d.employeeType);
	if (d.officeType) fd.append('posterOfficeType', d.officeType);
	if (d.officeName) fd.append('officeName', d.officeName);
	if (d.dateOfJoining) fd.append('dateOfJoining', d.dateOfJoining);
	if (d.designation) fd.append('designation', d.designation);
	if (d.fatherOrHusbandName) fd.append('fatherOrHusbandName', d.fatherOrHusbandName);
	if (d.maritalStatus) fd.append('maritalStatus', d.maritalStatus);
	if (d.physicallyDisabled != null) fd.append('physicallyDisabled', d.physicallyDisabled);
	if (d.officeEmailId) fd.append('officeEmailId', d.officeEmailId);
	if (d.category) fd.append('category', d.category);
	if (d.gender) fd.append('gender', d.gender);
	if (d.bloodGroup) fd.append('bloodGroup', d.bloodGroup);
	if (d.mobileNumber) fd.append('mobileNumber', d.mobileNumber);
	if (d.address1) fd.append('address1', d.address1);
	if (d.address2) fd.append('address2', d.address2);
	if (d.address3) fd.append('address3', d.address3);
	if (d.state) fd.append('state', d.state);
	if (d.district) fd.append('district', d.district);
	if (d.tehsil) fd.append('tehsil', d.tehsil);
	if (d.pinCode) fd.append('pinCode', d.pinCode);
	if (d.permanentAddress1) fd.append('permanentAddress1', d.permanentAddress1);
	if (d.permanentAddress2) fd.append('permanentAddress2', d.permanentAddress2);
	if (d.permanentAddress3) fd.append('permanentAddress3', d.permanentAddress3);
	if (d.permanentState) fd.append('permanentState', d.permanentState);
	if (d.permanentDistrict) fd.append('permanentDistrict', d.permanentDistrict);
	if (d.permanentTehsil) fd.append('permanentTehsil', d.permanentTehsil);
	if (d.permanentPinCode) fd.append('permanentPinCode', d.permanentPinCode);
	if (d.dateOfRetirement) fd.append('dateOfRetirement', d.dateOfRetirement);

	var responsePromise = request.post('saveEnrolment', fd);
	responsePromise.success(function(data) {
		state.responseObject = data;
		if (state.responseObject && state.responseObject.successMessage != null) {
			later(function() { state.responseObject.successMessage = null; }, 5000);
			navigation.location.href = '#enrolmentList';
		}
		loading.finish('sample-1');
	});
	responsePromise.error(function() {
		state.responseObject = { errorMessage: "Some error occured while saving enrolment data" };
		loading.finish('sample-1');
	});
};
state.loadGender = function() {
	var response = request.get('fetchgendermap');
	response.success(function(data) {
		state.genderList = data;
	});
};
state.loadDesignation = function() {
	var response = request.get('fetchdesignationmap');
	response.success(function(data) {
		state.designationList = data;
	});
};
state.loadDesignationforadd = function() {
	var response = request.get('fetchdesignationmap');
	response.success(function(data) {
		state.designationList = data;
	});
};

state.loadDate = () => {};
}
