package com.mapit.mpindustry.fa.controller;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.CellCopyPolicy;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mapit.mpindustry.common.bean.SortFieldBean;
import com.mapit.mpindustry.common.constants.MPIndustryConstants;
import com.mapit.mpindustry.common.controller.BaseController;
import com.mapit.mpindustry.common.dao.UserDao;
import com.mapit.mpindustry.common.exceptions.MPIndustryBusinessException;
import com.mapit.mpindustry.common.response.ResponseObject;
import com.mapit.mpindustry.common.service.NotificationService;
import com.mapit.mpindustry.common.service.UserService;
import com.mapit.mpindustry.common.util.MPIndustryUtil;
import com.mapit.mpindustry.common.validator.ChangePasswordValidator;
import com.mapit.mpindustry.fa.bean.CommitteeMeeting;
import com.mapit.mpindustry.fa.bean.FAApplicantBean;
import com.mapit.mpindustry.fa.bean.FAInfrastructreJson;
import com.mapit.mpindustry.fa.bean.FAReportJson;
import com.mapit.mpindustry.fa.bean.FARequiredAssistanceBean;
import com.mapit.mpindustry.fa.bean.FASanctionedVsDisbursementReportBean;
import com.mapit.mpindustry.fa.bean.FASchemeJsonNew;
import com.mapit.mpindustry.fa.bean.FASchemesBean;
import com.mapit.mpindustry.fa.bean.FaDisbursementBean;
import com.mapit.mpindustry.fa.bean.FaDisbursementCalculatorBean;
import com.mapit.mpindustry.fa.bean.FaDisbursementUploadBean;
import com.mapit.mpindustry.fa.bean.FaDistrictWiseReportBean;
import com.mapit.mpindustry.fa.bean.FaIndustrialProfileBean;
import com.mapit.mpindustry.fa.bean.FaMsmeSchemeBean;
import com.mapit.mpindustry.fa.bean.FaNewMsmeBean;
import com.mapit.mpindustry.fa.bean.FaOtherUploadBean;
import com.mapit.mpindustry.fa.bean.FaReportBean;
import com.mapit.mpindustry.fa.bean.FaRequestProcessBean;
import com.mapit.mpindustry.fa.bean.FaSchemeCapitalInvestmentBean;
import com.mapit.mpindustry.fa.bean.FaSchemeWiseReportBean;
import com.mapit.mpindustry.fa.bean.InfrastructureBean;
import com.mapit.mpindustry.fa.bean.MsmeDetailReportBean;
import com.mapit.mpindustry.fa.service.FAService;

import com.mapit.mpindustry.fa.dto.*;
import com.mapit.mpindustry.fa.entity.FaDisbursementUpload;
import com.mapit.mpindustry.fa.entity.FaDocumentUpload;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/fa/*")

public class FAController extends BaseController {
	@Autowired
	private FAService faService;

	@Autowired
	private UserService userService;

	@Autowired
	ChangePasswordValidator changePasswordValidator;

	@Autowired
	private UserDao userDao;
	
	@Autowired
	NotificationService notificationService;
	

	public NotificationService getNotificationService() {
		return notificationService;
	}

	public FAService getFaService() {
		return faService;
	}

	public void setFaService(FAService faService) {
		this.faService = faService;
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public ChangePasswordValidator getChangePasswordValidator() {
		return changePasswordValidator;
	}

	public void setChangePasswordValidator(ChangePasswordValidator changePasswordValidator) {
		this.changePasswordValidator = changePasswordValidator;
	}

	public UserDao getUserDao() {
		return userDao;
	}

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	@RequestMapping(value = "/home", method = RequestMethod.GET)
	public ModelAndView viewHome(HttpServletRequest request,
			@RequestParam(value = "isSSO", required = false) String isSSO,
			@RequestParam(value = "rUrl", required = false) String rUrl,
			@RequestParam(value = "redirectUrl", required = false) String redirectUrl) {
		ModelAndView modelAndView = new ModelAndView("fa/faHome");
		User user = getUserDetail();
		modelAndView.addObject("userName", user.getUsername());
		modelAndView.addObject("isSSO", isSSO);
		modelAndView.addObject("rUrl", rUrl);
		modelAndView.addObject("redirectUrl", redirectUrl);
		return modelAndView;
	}

	// 28 july
	
	@RequestMapping(value = "/powerBiDashbord", method = RequestMethod.GET)
	public ModelAndView powerBiDashbord(HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("fa/powerBiDashbord");
		return modelAndView;
	}
	@RequestMapping(value = "/dashboard", method = RequestMethod.GET)
	public ModelAndView viewDashboard(HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("fa/dashboard");
		Map<String, Long> countsMap = faService.getDashBorad();
		modelAndView.addObject("countData", countsMap);
		return modelAndView;
	}
	@RequestMapping(value = "/detailList", method = RequestMethod.GET)
	public ModelAndView viewDashBoardDetails(HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("fa/detailList");
		return modelAndView;
	}
	
	
	@RequestMapping(value = "/districtWiseReport", method = RequestMethod.GET)
	public ModelAndView viewDistrictWiseReport(HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("fa/financialReportDitrictWise");
		return modelAndView;
	}

	@RequestMapping(value = "/districtWiseMsmeDetailsReport", method = RequestMethod.GET)
	public ModelAndView viewDistrictWiseMsmeDetailsReport(HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("fa/msmeDetailsReportDistrictWise");
		return modelAndView;
	}
	@RequestMapping(value = "/msmeDetailReportList/{districtId}", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	// public ModelAndView viewReport(HttpServletRequest request) {
	public ModelAndView msmeDetailReportList(@PathVariable Integer districtId, HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("fa/msmeDetailReportList");
		return modelAndView;
	}
	// @RequestMapping(value = "/report", method = RequestMethod.GET)
	@RequestMapping(value = "/report/{districtId}", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	// public ModelAndView viewReport(HttpServletRequest request) {
	public ModelAndView viewReport(@PathVariable Integer districtId, HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("fa/report");
		return modelAndView;
	}
	@RequestMapping(value = "fa/viewfaacceptanceamountdetailunit/{applicationId}/{establishmentType}", method = RequestMethod.GET)
	public ModelAndView viewfaacceptanceamountdetailunit() {
		// ModelAndView modelAndView = new
		// ModelAndView("applicant/fa/viewFADetailUnitNew");
		ModelAndView modelAndView = new ModelAndView("applicant/fa/viewfaacceptanceamountdetailunit");
		return modelAndView;
	}
	@RequestMapping(value = "/reportStatus/{districtId}/{status}", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	// public ModelAndView viewReport(HttpServletRequest request) {
	public ModelAndView viewReportStatusWise(@PathVariable Integer districtId,@PathVariable Integer status, HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("fa/report");
		return modelAndView;
	}
	@RequestMapping(value = "/reportStatus/{districtId}/{status}/{entryDate1}/{entryDate2}", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	// public ModelAndView viewReport(HttpServletRequest request) {
	public ModelAndView viewReportStatusDateWise(@PathVariable Integer districtId,@PathVariable Integer status,@PathVariable String entryDate1,@PathVariable String entryDate2, HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("fa/report");
		return modelAndView;
	}

	@RequestMapping(value = "/fetchReportData", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public @ResponseBody List<Object> fetchReportData(HttpServletRequest request) {

		User user = getUserDetail();
		// System.out.println("000" + request.getParameter("districtId"));

		FaDto searchDto = new FaDto();
		
		if (request.getParameter("reportType") != null) {
			searchDto.setReportType(request.getParameter("reportType"));
		}
		
		if (request.getParameter("searchField") != null)
			searchDto.setSearch(request.getParameter("searchField"));
		if (request.getParameter("fromDate") != null)
			searchDto.setFromDate(request.getParameter("fromDate"));
		if (request.getParameter("toDate") != null)
			searchDto.setToDate(request.getParameter("toDate"));
		if (request.getParameter("districtId") != null && request.getParameter("districtId") != "")
			searchDto.setDitrictId(request.getParameter("districtId"));
		if (request.getParameter("schemeName") != null)
			searchDto.setSchemeName(request.getParameter("schemeName"));
		
		if(request.getParameter("status")!=null) {
			searchDto.setStatus(request.getParameter("status"));
			System.out.print(request.getParameter("status"));
		}

		String sSortCol = request.getParameter("iSortCol_0");
		String sSortDir = request.getParameter("sSortDir_0");
		String sColName = request.getParameter("mDataProp_" + sSortCol);
		SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);
	
		// Fetch the page number from client
		Integer pageNumber = 0;

		// Fetch search parameter
		String searchParameter = request.getParameter("sSearch");

		// Fetch Page display length
		Integer pageDisplayLength = 0;
		if (request.getParameter("iDisplayLength") != null)
			pageDisplayLength = Integer.valueOf(request.getParameter("iDisplayLength"));
		if (null != request.getParameter("iDisplayStart")) {
			pageNumber = (Integer.valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1;
		}

		Integer firstResult = (pageNumber - 1) * pageDisplayLength;


		Integer displayCount = getFaService().fetchFACount(sColName, searchParameter); // .fetchFACountNo(user.getUsername(),searchParameter);
		Integer totalCount = getFaService().fetchFACount(sColName, null); /// fetchFACount(user.getUsername(), null);

		FAReportJson reportJson = new FAReportJson();
		reportJson.setiTotalDisplayRecords(displayCount);
		reportJson.setiTotalRecords(totalCount);
		// reportJson.setAaData(applicants);

		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		String json = gson.toJson(reportJson);
		List<Object> list = new ArrayList<Object>();
		if (request.getParameter("noOfRows") != null) {
			searchDto.setNoOfRows(Integer.parseInt(request.getParameter("noOfRows")));
		}
		if (request.getParameter("startRecord") != null) {
			searchDto.setStartRecord(Integer.parseInt(request.getParameter("startRecord")));
		}
		
		List<?> states =null;
		
		if(searchDto.getReportType()!=null && searchDto.getReportType().equalsIgnoreCase(MPIndustryConstants.MSME_DETAIL_REPORT)) {
			states = getFaService().fetchMsmeDetailReportListPageWise(sColName, firstResult, pageDisplayLength, sortField,
					searchDto);
		}else {
			
		 states = getFaService().fetchFAReportPageWise(sColName, firstResult, pageDisplayLength, sortField,
					searchDto);
		}
		if (request.getParameter("maxRows") != null && Integer.parseInt(request.getParameter("maxRows")) == 0) {
			Integer noOfrecords = getFaService().getNoOfRows(user.getUsername(), searchDto);
			//Integer noOfrecords =states.size();
			//Integer noOfrecords =1351;
			list.add(noOfrecords);
		
		}
		list.add(states);

		return list;
	}

	@RequestMapping(value = "/fetchDistrictWiseReportData", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public @ResponseBody List<Object> fetchDistrictWiseReportData(HttpServletRequest request) {
				User user = getUserDetail();
		FaDto searchDto = new FaDto();
		if (request.getParameter("reportType") != null) {
			searchDto.setReportType(request.getParameter("reportType"));
		}
		if (request.getParameter("searchField") != null)
			searchDto.setSearch(request.getParameter("searchField"));
		if (request.getParameter("fromDate") != null)
			searchDto.setFromDate(request.getParameter("fromDate"));
		if (request.getParameter("toDate") != null)
			searchDto.setToDate(request.getParameter("toDate"));
		if (request.getParameter("appType") != null)
			searchDto.setAppType(request.getParameter("appType"));
		if (request.getParameter("status") != null)
			searchDto.setAppType(request.getParameter("status"));
		String sSortCol = request.getParameter("iSortCol_0");
		String sSortDir = request.getParameter("sSortDir_0");
		String sColName = request.getParameter("mDataProp_" + sSortCol);
		SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);

		// Fetch the page number from client
		Integer pageNumber = 0;

		// Fetch Page display length
		Integer pageDisplayLength = 0;
		if (request.getParameter("iDisplayLength") != null)
			pageDisplayLength = Integer.valueOf(request.getParameter("iDisplayLength"));
		if (null != request.getParameter("iDisplayStart")) {
			pageNumber = (Integer.valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1;
		}
		Integer firstResult = (pageNumber - 1) * pageDisplayLength;

		List<Object> list = new ArrayList<Object>();
		if (request.getParameter("noOfRows") != null) {
			searchDto.setNoOfRows(Integer.parseInt(request.getParameter("noOfRows")));
		}
		if (request.getParameter("startRecord") != null) {
			searchDto.setStartRecord(Integer.parseInt(request.getParameter("startRecord")));
		}
		if (request.getParameter("maxRows") != null && Integer.parseInt(request.getParameter("maxRows")) == 0) {
			searchDto.setStartRecord(Integer.parseInt(request.getParameter("maxRows")));
		}
		
		//// System.out.println("rows "+request.getParameter("maxRows"));
		List<?> states = getFaService().fetchFADistrictWiseReportPageWise(sColName, firstResult, pageDisplayLength,
				sortField, searchDto);
		list.add(states);

		return list;
	}

	@RequestMapping(value = "/schemeWiseReport", method = RequestMethod.GET)
	public ModelAndView viewschemeWiseReport(HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("fa/financialReportSchemeWise");
		return modelAndView;
	}

	@RequestMapping(value = "/fetchSchemeWiseReportData", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public @ResponseBody List<Object> fetchWiseReportData(HttpServletRequest request) {

		User user = getUserDetail();
		FaDto searchDto = new FaDto();
		if (request.getParameter("searchField") != null)
			searchDto.setSearch(request.getParameter("searchField"));
		if (request.getParameter("fromDate") != null)
			searchDto.setFromDate(request.getParameter("fromDate"));
		if (request.getParameter("toDate") != null)
			searchDto.setToDate(request.getParameter("toDate"));
		if (request.getParameter("appType") != null)
			searchDto.setAppType(request.getParameter("appType"));

		String sSortCol = request.getParameter("iSortCol_0");
		String sSortDir = request.getParameter("sSortDir_0");
		String sColName = request.getParameter("mDataProp_" + sSortCol);
		SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);

		// Fetch the page number from client
		Integer pageNumber = 0;

		// Fetch Page display length
		Integer pageDisplayLength = 0;
		if (request.getParameter("iDisplayLength") != null)
			pageDisplayLength = Integer.valueOf(request.getParameter("iDisplayLength"));
		if (null != request.getParameter("iDisplayStart")) {
			pageNumber = (Integer.valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1;
		}

		Integer firstResult = (pageNumber - 1) * pageDisplayLength;

		List<Object> list = new ArrayList<Object>();
		if (request.getParameter("noOfRows") != null) {
			searchDto.setNoOfRows(Integer.parseInt(request.getParameter("noOfRows")));
		}
		if (request.getParameter("startRecord") != null) {
			searchDto.setStartRecord(Integer.parseInt(request.getParameter("startRecord")));
		}
		List<?> states = getFaService().fetchFASchemeWiseReportPageWise(sColName, firstResult, pageDisplayLength,
				sortField, searchDto);
		list.add(states);

		return list;
	}

	@RequestMapping(value = "/report/{districtId}/{scheme}", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public ModelAndView viewReportScheme(@PathVariable Integer districtId, @PathVariable String scheme,
			HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("fa/reportScheme");
		return modelAndView;
	}

	@RequestMapping(value = "/fetchSchemeReportData", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public @ResponseBody List<Object> fetchSchemeReportData(HttpServletRequest request) {

		User user = getUserDetail();
		// System.out.println("000" + request.getParameter("districtId"));

		FaDto searchDto = new FaDto();
		if (request.getParameter("searchField") != null)
			searchDto.setSearch(request.getParameter("searchField"));
		if (request.getParameter("fromDate") != null)
			searchDto.setFromDate(request.getParameter("fromDate"));
		if (request.getParameter("toDate") != null)
			searchDto.setToDate(request.getParameter("toDate"));
		if (request.getParameter("districtId") != null && request.getParameter("districtId") != "")
			searchDto.setDitrictId(request.getParameter("districtId"));
		if (request.getParameter("schemeName") != null)
			searchDto.setSchemeName(request.getParameter("schemeName"));

		String sSortCol = request.getParameter("iSortCol_0");
		String sSortDir = request.getParameter("sSortDir_0");
		String sColName = request.getParameter("mDataProp_" + sSortCol);
		SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);
		if (request.getParameter("faSanctionLetterDate") != null)
			System.out.print("ok");

		// Fetch the page number from client
		Integer pageNumber = 0;

		// Fetch search parameter
		String searchParameter = request.getParameter("sSearch");

		// Fetch Page display length
		Integer pageDisplayLength = 0;
		if (request.getParameter("iDisplayLength") != null)
			pageDisplayLength = Integer.valueOf(request.getParameter("iDisplayLength"));
		if (null != request.getParameter("iDisplayStart")) {
			pageNumber = (Integer.valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1;
		}

		Integer firstResult = (pageNumber - 1) * pageDisplayLength;

		// Create page list data
		// List<FaReportBean> applicants= getFaService().fetchFAReportPageWise(sColName,
		// firstResult,
		// pageDisplayLength, sortField, searchParameter);

		Integer displayCount = getFaService().fetchFACount(sColName, searchParameter); // .fetchFACountNo(user.getUsername(),searchParameter);
		Integer totalCount = getFaService().fetchFACount(sColName, null); /// fetchFACount(user.getUsername(), null);

		FAReportJson reportJson = new FAReportJson();
		reportJson.setiTotalDisplayRecords(displayCount);
		reportJson.setiTotalRecords(totalCount);
		// reportJson.setAaData(applicants);

		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		String json = gson.toJson(reportJson);
		List<Object> list = new ArrayList<Object>();
		if (request.getParameter("noOfRows") != null) {
			searchDto.setNoOfRows(Integer.parseInt(request.getParameter("noOfRows")));
		}
		if (request.getParameter("startRecord") != null) {
			searchDto.setStartRecord(Integer.parseInt(request.getParameter("startRecord")));
		}
		if (request.getParameter("maxRows") != null && Integer.parseInt(request.getParameter("maxRows")) == 0) {
			Integer noOfrecords = getFaService().getNoOfRowsSchemeWise(user.getUsername(), searchDto);
			list.add(noOfrecords);
		}
		List<?> states = getFaService().fetchFASchemeReportPageWise(sColName, firstResult, pageDisplayLength, sortField,
				searchDto);
		list.add(states);

		return list;
	}

	@RequestMapping(value = "/SanctionedVsDisbursement", method = RequestMethod.GET)
	public ModelAndView viewSanctionedVsDisbursementReport(HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("fa/sanctionedVsDisbursementReport");
		return modelAndView;
	}

	@RequestMapping(value = "/faReportExportToExcel", method = RequestMethod.GET)
	public void faReportExportToExcel(HttpServletRequest request, HttpServletResponse response) {

		String fileName = "FA_REPORT_List.xlsx";
		
		User user = getUserDetail();
		FaDto searchDto = new FaDto();
		if (request.getParameter("searchField") != null)
			searchDto.setSearch(request.getParameter("searchField"));
		if (request.getParameter("fromDate") != null)
			searchDto.setFromDate(request.getParameter("fromDate"));
		if (request.getParameter("toDate") != null)
			searchDto.setToDate(request.getParameter("toDate"));
		if (request.getParameter("startRecord") != null) {
			searchDto.setStartRecord(Integer.parseInt(request.getParameter("startRecord")));
		}
		if (request.getParameter("noOfRows") != null) {
			//searchDto.setNoOfRows(Integer.parseInt(request.getParameter("noOfRows")));
		}

		String sSortCol = request.getParameter("iSortCol_0");
		String sSortDir = request.getParameter("sSortDir_0");
		String sColName = request.getParameter("mDataProp_" + sSortCol);
		SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);

		// Fetch the page number from client
		Integer pageNumber = 100;

		// Fetch search parameter
		String searchParameter = request.getParameter("sSearch");

		// Fetch Page display length
		// Integer pageDisplayLength =
		// Integer.valueOf(request.getParameter("iDisplayLength"));
		Integer pageDisplayLength = 100;

		if (null != request.getParameter("iDisplayStart")) {
			pageNumber = (Integer.valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1;
		}

		Integer firstResult = (pageNumber - 1) * pageDisplayLength;

		try {
			String fileRealPath = request.getSession().getServletContext().getRealPath("/WEB-INF/classes/" + fileName);

			FileInputStream excelFile = new FileInputStream(new File(fileRealPath));

			XSSFWorkbook workbook = new XSSFWorkbook(excelFile);
			XSSFSheet sheet1 = workbook.getSheetAt(0);
			int snoCounter = 1, rowCounter = 7 ;
			int totCol1=0 , totCol2 = 0 , totCol3 = 0 , totCol4 = 0 , totCol5 = 0 , totCol6 = 0, totCol7 = 0;

			// List<VacantLandBean> landList = idService.fetchAllVacantLands();
			//List<FaReportBean> applicants = getFaService().fetchFAReportPageWise(sColName, firstResult,
				//	pageDisplayLength, sortField, searchDto);
			List<FaDistrictWiseReportBean> applicants = getFaService().fetchFADistrictWiseReportPageWise(sColName, firstResult, pageDisplayLength,
					sortField, searchDto);
			for (FaDistrictWiseReportBean applicant : applicants) {

				XSSFRow row = sheet1.createRow(rowCounter);

				row.createCell(0).setCellValue(String.valueOf(snoCounter));
				row.createCell(1)
						.setCellValue(applicant.getDistrictName() != null ? applicant.getDistrictName() : "");
				row.createCell(2).setCellValue(applicant.getApplicationId());
				totCol1 = totCol1 + Integer.valueOf(applicant.getApplicationId());
				row.createCell(3).setCellValue(applicant.getStatus2());
				totCol2+= applicant.getStatus2();
				row.createCell(4).setCellValue(applicant.getStatus5());
				totCol3+=applicant.getStatus5();
				row.createCell(5).setCellValue(applicant.getStatus9());
				totCol4+=applicant.getStatus9();
				row.createCell(6).setCellValue(applicant.getStatus9());
				totCol5+=applicant.getStatus9();
				row.createCell(7).setCellValue(applicant.getStatus9());
				totCol6+=applicant.getStatus9();
				row.createCell(8).setCellValue(applicant.getStatus10());
				totCol7+=applicant.getStatus10();
				

				snoCounter++;
				rowCounter++;
			}
			XSSFRow row = sheet1.createRow(rowCounter);
			row.createCell(0).setCellValue("");
			row.createCell(1).setCellValue("Total");
			//row.createCell(2).setCellValue(totCount);
			row.createCell(2).setCellValue(totCol1);
			row.createCell(3).setCellValue(totCol2);
			row.createCell(4).setCellValue(totCol3);
			row.createCell(5).setCellValue(totCol4);
			row.createCell(6).setCellValue(totCol5);
			row.createCell(7).setCellValue(totCol6);
			row.createCell(8).setCellValue(totCol7);
			

			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			workbook.write(outStream);
			byte[] outArray = outStream.toByteArray();
			response.setContentLength(outArray.length);
			String mimeType = request.getServletContext().getMimeType(fileRealPath);
			if (mimeType == null) {
				mimeType = "application/octet-stream";
			}
			response.setContentType(mimeType);
			// set headers for the response
			String headerKey = "Content-Disposition";
			String headerValue = String.format("attachment; filename=\"%s\"", fileName);
			response.setHeader(headerKey, headerValue);
			OutputStream outStream1 = response.getOutputStream();
			outStream1.write(outArray);
			outStream1.flush();
			workbook.close();

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@RequestMapping(value = "/fetchSanctionedVsDisbursementReportData", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public @ResponseBody List<Object> fetchSanctionedVsDisbursementReportData(HttpServletRequest request) {

		User user = getUserDetail();
		FaDto searchDto = new FaDto();
		if (request.getParameter("searchField") != null)
			searchDto.setSearch(request.getParameter("searchField"));
		if (request.getParameter("fromDate") != null)
			searchDto.setFromDate(request.getParameter("fromDate"));
		if (request.getParameter("toDate") != null)
			searchDto.setToDate(request.getParameter("toDate"));
		if (request.getParameter("districtId") != null && request.getParameter("districtId") != "")
			searchDto.setDitrictId(request.getParameter("districtId"));
		if (request.getParameter("schemeName") != null)
			searchDto.setSchemeName(request.getParameter("schemeName"));
		if (request.getParameter("appType") != null)
			searchDto.setAppType(request.getParameter("appType"));
		
		List<Object> list = new ArrayList<Object>();
		List<?> states = getFaService().fetchFASanctionedVsDisbursmentReport(searchDto);
		list.add(states);
		return list;
	}

	@RequestMapping(value = "/faReportSchemWiseExportToExcel", method = RequestMethod.GET)
	public void faReportSchemWiseExportToExcel(HttpServletRequest request, HttpServletResponse response) {

		String fileName = "FA_Scheme_Report.xlsx";
		User user = getUserDetail();
		FaDto searchDto = new FaDto();
		if (request.getParameter("searchField") != null)
			searchDto.setSearch(request.getParameter("searchField"));
		if (request.getParameter("fromDate") != null)
			searchDto.setFromDate(request.getParameter("fromDate"));
		if (request.getParameter("toDate") != null)
			searchDto.setToDate(request.getParameter("toDate"));
		if (request.getParameter("startRecord") != null) {
			searchDto.setStartRecord(Integer.parseInt(request.getParameter("startRecord")));
		}
		if (request.getParameter("noOfRows") != null) {
			//searchDto.setNoOfRows(Integer.parseInt(request.getParameter("noOfRows")));
		}

		String sSortCol = request.getParameter("iSortCol_0");
		String sSortDir = request.getParameter("sSortDir_0");
		String sColName = request.getParameter("mDataProp_" + sSortCol);
		SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);

		// Fetch the page number from client
		Integer pageNumber = 100;

		// Fetch search parameter
		String searchParameter = request.getParameter("sSearch");

		// Fetch Page display length
		// Integer pageDisplayLength =
		// Integer.valueOf(request.getParameter("iDisplayLength"));
		Integer pageDisplayLength = 100;

		if (null != request.getParameter("iDisplayStart")) {
			pageNumber = (Integer.valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1;
		}

		Integer firstResult = (pageNumber - 1) * pageDisplayLength;

		try {
			String fileRealPath = request.getSession().getServletContext().getRealPath("/WEB-INF/classes/" + fileName);
			
			FileInputStream excelFile = new FileInputStream(new File(fileRealPath));

			XSSFWorkbook workbook = new XSSFWorkbook(excelFile);
			XSSFSheet sheet1 = workbook.getSheetAt(0);
			int snoCounter = 1, rowCounter = 7;

			// List<VacantLandBean> landList = idService.fetchAllVacantLands();
			//List<FaReportBean> applicants = getFaService().fetchFAReportPageWise(sColName, firstResult,
				//	pageDisplayLength, sortField, searchDto);
			List<FaSchemeWiseReportBean> applicants = getFaService().fetchFASchemeWiseReportPageWise(fileRealPath, firstResult, pageDisplayLength, sortField, searchDto);
			int totIndustrial=0;int totQuality=0; int totPatent=0;int totCount=0;
			int totInfra=0; int totWaste=0; int totEnegy=0; int totPower=0;
			int totPharma=0;
			for (FaSchemeWiseReportBean applicant : applicants) {

				XSSFRow row = sheet1.createRow(rowCounter);

				row.createCell(0).setCellValue(String.valueOf(snoCounter));
				row.createCell(1)
						.setCellValue(applicant.getDistrictName() != null ? applicant.getDistrictName() : "");
				//row.createCell(2).setCellValue(applicant.getApplicationId());
				row.createCell(2).setCellValue(applicant.getIndustrial());
				row.createCell(3).setCellValue(applicant.getQuality());
				row.createCell(4).setCellValue(applicant.getPatent());
				row.createCell(5).setCellValue(applicant.getInfra());
				row.createCell(6).setCellValue(applicant.getWaste());
				row.createCell(7).setCellValue(applicant.getEnergy());
				row.createCell(8).setCellValue(applicant.getPower());
				row.createCell(9).setCellValue(applicant.getPharma());
				totCount+=applicant.getApplicationId();
				totIndustrial+=applicant.getIndustrial();
				totQuality+=applicant.getQuality();
				totPatent+=applicant.getPatent();
				totInfra+=applicant.getInfra();
				totWaste+=applicant.getWaste();
				totEnegy+=applicant.getEnergy();
				totPower+=applicant.getPower();
				totPharma+=applicant.getPharma();
				snoCounter++;
				rowCounter++;
			}
			XSSFRow row = sheet1.createRow(rowCounter);
			row.createCell(0).setCellValue("");
			row.createCell(1).setCellValue("Total");
			//row.createCell(2).setCellValue(totCount);
			row.createCell(2).setCellValue(totIndustrial);
			row.createCell(3).setCellValue(totQuality);
			row.createCell(4).setCellValue(totPatent);
			row.createCell(5).setCellValue(totInfra);
			row.createCell(6).setCellValue(totWaste);
			row.createCell(7).setCellValue(totEnegy);
			row.createCell(8).setCellValue(totPower);
			row.createCell(9).setCellValue(totPharma);
			
			
			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			workbook.write(outStream);
			byte[] outArray = outStream.toByteArray();
			response.setContentLength(outArray.length);
			String mimeType = request.getServletContext().getMimeType(fileRealPath);
			if (mimeType == null) {
				mimeType = "application/octet-stream";
			}
			response.setContentType(mimeType);
			// set headers for the response
			String headerKey = "Content-Disposition";
			String headerValue = String.format("attachment; filename=\"%s\"", fileName);
			response.setHeader(headerKey, headerValue);
			OutputStream outStream1 = response.getOutputStream();
			outStream1.write(outArray);
			outStream1.flush();
			workbook.close();

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@RequestMapping(value = "/faDetailReportExportToExcel", method = RequestMethod.GET)
	public void faDetailReportExportToExcel(HttpServletRequest request, HttpServletResponse response) {

		String fileName = "FA_REPORT_Detail_List.xlsx";
		User user = getUserDetail();
		FaDto searchDto = new FaDto();
		if (request.getParameter("searchField") != null)
			searchDto.setSearch(request.getParameter("searchField"));
		if (request.getParameter("fromDate") != null)
			searchDto.setFromDate(request.getParameter("fromDate"));
		if (request.getParameter("toDate") != null)
			searchDto.setToDate(request.getParameter("toDate"));
		if (request.getParameter("districtId") != null && request.getParameter("districtId") != "")
			searchDto.setDitrictId(request.getParameter("districtId"));
		if (request.getParameter("schemeName") != null)
			searchDto.setSchemeName(request.getParameter("schemeName"));
		if (request.getParameter("startRecord") != null) {
			searchDto.setStartRecord(Integer.parseInt(request.getParameter("startRecord")));
		}
		if (request.getParameter("noOfRows") != null) {
			searchDto.setNoOfRows(Integer.parseInt(request.getParameter("noOfRows")));
		}
		if(request.getParameter("status") != null) {
			searchDto.setStatus(request.getParameter("status"));
		}
			

		String sSortCol = request.getParameter("iSortCol_0");
		String sSortDir = request.getParameter("sSortDir_0");
		String sColName = request.getParameter("mDataProp_" + sSortCol);
		SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);

		// Fetch the page number from client
		Integer pageNumber = 100;

		// Fetch search parameter
		String searchParameter = request.getParameter("sSearch");

		// Fetch Page display length
		// Integer pageDisplayLength =
		// Integer.valueOf(request.getParameter("iDisplayLength"));
		Integer pageDisplayLength = 100;

		if (null != request.getParameter("iDisplayStart")) {
			pageNumber = (Integer.valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1;
		}

		Integer firstResult = (pageNumber - 1) * pageDisplayLength;

		try {
			String fileRealPath = request.getSession().getServletContext().getRealPath("/WEB-INF/classes/" + fileName);

			FileInputStream excelFile = new FileInputStream(new File(fileRealPath));

			XSSFWorkbook workbook = new XSSFWorkbook(excelFile);
			XSSFSheet sheet1 = workbook.getSheetAt(0);
			int snoCounter = 1, rowCounter = 7;

			// List<VacantLandBean> landList = idService.fetchAllVacantLands();
			//List<FaReportBean> applicants = getFaService().fetchFAReportPageWise(sColName, firstResult,
				//	pageDisplayLength, sortField, searchDto);
			List<FaReportBean> applicants = getFaService().fetchFaReportListPageWiseExport(sColName, firstResult, pageDisplayLength, sortField,
					searchDto);

			for (FaReportBean applicant : applicants) {

				XSSFRow row = sheet1.createRow(rowCounter);

				row.createCell(0).setCellValue(String.valueOf(snoCounter));
				row.createCell(1).setCellValue(applicant.getApplication_id());
				row.createCell(2)
						.setCellValue(applicant.getDistrict_name() != null ? applicant.getDistrict_name() : "");
				row.createCell(3).setCellValue(applicant.getUnit_or_inst_name());
				row.createCell(4).setCellValue(applicant.getAmount() != null ? applicant.getAmount() : 0);
				//row.createCell(5).setCellValue(applicant.getUnit_mp_empt_gen()+applicant.getUnit_mp_obc_empt_gen()+applicant.getUnit_mp_sc_empt_gen()+applicant.getUnit_mp_st_empt_gen());
				int totEmp=0;
				if(applicant.getUnit_mp_empt_gen()!=null)
					totEmp +=applicant.getUnit_mp_empt_gen();
				if(applicant.getUnit_mp_obc_empt_gen()!=null)
						totEmp += applicant.getUnit_mp_obc_empt_gen();
				if(applicant.getUnit_mp_sc_empt_gen()!=null)
					totEmp += applicant.getUnit_mp_sc_empt_gen();
				if(applicant.getUnit_mp_st_empt_gen()!=null)
					totEmp += applicant.getUnit_mp_st_empt_gen();
				row.createCell(5).setCellValue(totEmp);

				row.createCell(6).setCellValue(applicant.getSanction_letter_date());
				row.createCell(7).setCellValue(applicant.getSanction_letter_date());
				row.createCell(8).setCellValue(applicant.getLetter_date());
				row.createCell(9).setCellValue(applicant.getUnit_type());
				

				snoCounter++;
				rowCounter++;
			}

			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			workbook.write(outStream);
			byte[] outArray = outStream.toByteArray();
			response.setContentLength(outArray.length);
			String mimeType = request.getServletContext().getMimeType(fileRealPath);
			if (mimeType == null) {
				mimeType = "application/octet-stream";
			}
			response.setContentType(mimeType);
			// set headers for the response
			String headerKey = "Content-Disposition";
			String headerValue = String.format("attachment; filename=\"%s\"", fileName);
			response.setHeader(headerKey, headerValue);
			OutputStream outStream1 = response.getOutputStream();
			outStream1.write(outArray);
			outStream1.flush();
			workbook.close();

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping(value = "/faReportSanctionedVsDisbursementExportToExcel", method = RequestMethod.GET)
	public void faReportSanctionedVsDisbursementExportToExcel(HttpServletRequest request, HttpServletResponse response) {

		String fileName = "FA_REPORT_SanctionedVsDisbursement.xlsx";
		User user = getUserDetail();
		FaDto searchDto = new FaDto();
		if (request.getParameter("searchField") != null)
			searchDto.setSearch(request.getParameter("searchField"));
		if (request.getParameter("fromDate") != null)
			searchDto.setFromDate(request.getParameter("fromDate"));
		if (request.getParameter("toDate") != null)
			searchDto.setToDate(request.getParameter("toDate"));
		if (request.getParameter("startRecord") != null) {
			searchDto.setStartRecord(Integer.parseInt(request.getParameter("startRecord")));
		}
		if (request.getParameter("noOfRows") != null) {
			//searchDto.setNoOfRows(Integer.parseInt(request.getParameter("noOfRows")));
		}

		String sSortCol = request.getParameter("iSortCol_0");
		String sSortDir = request.getParameter("sSortDir_0");
		String sColName = request.getParameter("mDataProp_" + sSortCol);
		SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);

		// Fetch the page number from client
		Integer pageNumber = 100;

		// Fetch search parameter
		String searchParameter = request.getParameter("sSearch");

		// Fetch Page display length
		// Integer pageDisplayLength =
		// Integer.valueOf(request.getParameter("iDisplayLength"));
		Integer pageDisplayLength = 100;

		if (null != request.getParameter("iDisplayStart")) {
			pageNumber = (Integer.valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1;
		}

		Integer firstResult = (pageNumber - 1) * pageDisplayLength;

		try {
			String fileRealPath = request.getSession().getServletContext().getRealPath("/WEB-INF/classes/" + fileName);

			FileInputStream excelFile = new FileInputStream(new File(fileRealPath));

			XSSFWorkbook workbook = new XSSFWorkbook(excelFile);
			XSSFSheet sheet1 = workbook.getSheetAt(0);
			int snoCounter = 1, rowCounter = 8;

			// List<VacantLandBean> landList = idService.fetchAllVacantLands();
			//List<FaReportBean> applicants = getFaService().fetchFAReportPageWise(sColName, firstResult,
				//	pageDisplayLength, sortField, searchDto);
			List<FASanctionedVsDisbursementReportBean> applicants = getFaService().fetchFASanctionedVsDisbursmentReport(searchDto);
			int totCount1=0;int totCount2=0;
			int totAmount1=0; int totAmount2=0;
			for (FASanctionedVsDisbursementReportBean applicant : applicants) {

				XSSFRow row = sheet1.createRow(rowCounter);

				row.createCell(0).setCellValue(String.valueOf(snoCounter));
				row.createCell(1)
						.setCellValue(applicant.getDistrictName() != null ? applicant.getDistrictName() : "");
				//
				row.createCell(2).setCellValue(applicant.getCount1());
				row.createCell(3).setCellValue(applicant.getAmount1() != null ? applicant.getAmount1():0);
				row.createCell(4).setCellValue(applicant.getCount2());
				row.createCell(5).setCellValue(applicant.getAmount2() != null ? applicant.getAmount2():0);
				totCount1+=applicant.getCount1();
				if(applicant.getAmount1()!=null)
					totAmount1+=applicant.getAmount1();
				
				totCount2+=applicant.getCount2();
				if(applicant.getAmount2()!=null)
					totAmount2+=applicant.getAmount2();	
				snoCounter++;
				rowCounter++;
			}
			XSSFRow row = sheet1.createRow(rowCounter);
			row.createCell(0).setCellValue("");
			row.createCell(1).setCellValue("Total");
			row.createCell(2).setCellValue(totCount1);
			row.createCell(3).setCellValue(totAmount1);
			row.createCell(4).setCellValue(totCount2);
			row.createCell(5).setCellValue(totAmount2);
			
			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			workbook.write(outStream);
			byte[] outArray = outStream.toByteArray();
			response.setContentLength(outArray.length);
			String mimeType = request.getServletContext().getMimeType(fileRealPath);
			if (mimeType == null) {
				mimeType = "application/octet-stream";
			}
			response.setContentType(mimeType);
			// set headers for the response
			String headerKey = "Content-Disposition";
			String headerValue = String.format("attachment; filename=\"%s\"", fileName);
			response.setHeader(headerKey, headerValue);
			OutputStream outStream1 = response.getOutputStream();
			outStream1.write(outArray);
			outStream1.flush();
			workbook.close();

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@RequestMapping(value = "/dashboardReportData", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public @ResponseBody List<Object> dashboardReportData(HttpServletRequest request) {

		User user = getUserDetail();
		// System.out.println("000" + request.getParameter("districtId"));

		FaDto searchDto = new FaDto();
		if (request.getParameter("searchField") != null)
			searchDto.setSearch(request.getParameter("searchField"));
		if (request.getParameter("fromDate") != null)
			searchDto.setFromDate(request.getParameter("fromDate"));
		if (request.getParameter("toDate") != null)
			searchDto.setToDate(request.getParameter("toDate"));
		if (request.getParameter("districtId") != null && request.getParameter("districtId") != "")
			searchDto.setDitrictId(request.getParameter("districtId"));
		if (request.getParameter("schemeName") != null)
			searchDto.setSchemeName(request.getParameter("schemeName"));
		
		if(request.getParameter("status")!=null) {
			searchDto.setStatus(request.getParameter("status"));
			System.out.print(request.getParameter("status"));
		}

		String sSortCol = request.getParameter("iSortCol_0");
		String sSortDir = request.getParameter("sSortDir_0");
		String sColName = request.getParameter("mDataProp_" + sSortCol);
		SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);
	
		// Fetch the page number from client
		Integer pageNumber = 0;

		// Fetch search parameter
		String searchParameter = request.getParameter("sSearch");

		// Fetch Page display length
		Integer pageDisplayLength = 0;
		if (request.getParameter("iDisplayLength") != null)
			pageDisplayLength = Integer.valueOf(request.getParameter("iDisplayLength"));
		if (null != request.getParameter("iDisplayStart")) {
			pageNumber = (Integer.valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1;
		}

		Integer firstResult = (pageNumber - 1) * pageDisplayLength;


		Integer displayCount = getFaService().fetchFACount(sColName, searchParameter); // .fetchFACountNo(user.getUsername(),searchParameter);
		Integer totalCount = getFaService().fetchFACount(sColName, null); /// fetchFACount(user.getUsername(), null);

		FAReportJson reportJson = new FAReportJson();
		reportJson.setiTotalDisplayRecords(displayCount);
		reportJson.setiTotalRecords(totalCount);
		// reportJson.setAaData(applicants);

		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		String json = gson.toJson(reportJson);
		List<Object> list = new ArrayList<Object>();
		if (request.getParameter("noOfRows") != null) {
			searchDto.setNoOfRows(Integer.parseInt(request.getParameter("noOfRows")));
		}
		if (request.getParameter("startRecord") != null) {
			searchDto.setStartRecord(Integer.parseInt(request.getParameter("startRecord")));
		}
		if (request.getParameter("maxRows") != null && Integer.parseInt(request.getParameter("maxRows")) == 0) {
			Integer noOfrecords = getFaService().getNoOfRows(user.getUsername(), searchDto);
			list.add(noOfrecords);
		}
		List<?> states = getFaService().fetchFAReportPageWise(sColName, firstResult, pageDisplayLength, sortField,
				searchDto);
		list.add(states);

		return list;
	}
	@RequestMapping(value = "/dticfapendingapplicantsunit", method = RequestMethod.GET)
	public ModelAndView viewPendingApplicantsUnit(HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView(
				"fa/fapendingapplicantsunit");
		return modelAndView;
	}
	
	@RequestMapping(value = "/fetchpendingapplicants/{establishmentType}", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public @ResponseBody String fetchInProcessApplicants(
			@PathVariable String establishmentType, HttpServletRequest request) {

		User user = getUserDetail();

		String sSortCol = request.getParameter("iSortCol_0");
		String sSortDir = request.getParameter("sSortDir_0");
		String sColName = request.getParameter("mDataProp_" + sSortCol);
		SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);

		// Fetch the page number from client
		Integer pageNumber = 0;

		// Fetch search parameter
		String searchParameter = request.getParameter("sSearch");

		// Fetch Page display length
		Integer pageDisplayLength = Integer.valueOf(request
				.getParameter("iDisplayLength"));

		if (null != request.getParameter("iDisplayStart")) {
			pageNumber = (Integer
					.valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1;
		}

		Integer firstResult = (pageNumber - 1) * pageDisplayLength;

		// Create page list data
		List<FaNewMsmeBean> applicants = getFaService()
				.fetchTenCrchPendingSchemePageWiseNew(user.getUsername(),
						establishmentType, firstResult, pageDisplayLength,
						sortField, searchParameter);

		Integer displayCount = getFaService().fetchTenCrPendingSchemeCount(
				user.getUsername(), establishmentType, searchParameter);
		Integer totalCount = getFaService().fetchTenCrPendingSchemeCount(
				user.getUsername(), establishmentType, null);

		//FASchemeJson faSchemeJson = new FASchemeJson();
		FASchemeJsonNew faSchemeJson = new FASchemeJsonNew();
		// Set Total display record
		faSchemeJson.setiTotalDisplayRecords(displayCount);
		// Set Total record
		faSchemeJson.setiTotalRecords(totalCount);
		faSchemeJson.setAaData(applicants);

		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		String json = gson.toJson(faSchemeJson);

		return json;

	}
	@RequestMapping(value = "/infradevelopmetList", method = RequestMethod.GET)
	public ModelAndView infradevelopmetList(HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView(
				"fa/infradevelopmetList");
		return modelAndView;
	}
	@RequestMapping(value = "/fetchInfrastructureList", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	public @ResponseBody String fetchInfrastructureList(HttpServletRequest request) {

		User user = getUserDetail();

		String sSortCol = request.getParameter("iSortCol_0");
		String sSortDir = request.getParameter("sSortDir_0");
		String sColName = request.getParameter("mDataProp_" + sSortCol);
		SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);

		// Fetch the page number from client
		Integer pageNumber = 0;

		// Fetch search parameter
		String searchParameter = request.getParameter("sSearch");

		// Fetch Page display length
		Integer pageDisplayLength = Integer.valueOf(request
				.getParameter("iDisplayLength"));

		if (null != request.getParameter("iDisplayStart")) {
			pageNumber = (Integer
					.valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1;
		}

		Integer firstResult = (pageNumber - 1) * pageDisplayLength;

		// Create page list data
		
		List<InfrastructureBean> infrastructureList=getFaService().fetchInfrastructureList(sColName, firstResult,
				pageDisplayLength, sortField, searchParameter);

		Integer displayCount = getFaService().fetchInfrastructureCount(user.getUsername(),  searchParameter);
		Integer totalCount = getFaService().fetchInfrastructureCount(user.getUsername(),  null);

		
		FAInfrastructreJson faInfrastructureJson = new FAInfrastructreJson();
		// Set Total display record
		faInfrastructureJson.setiTotalDisplayRecords(displayCount);
		// Set Total record
		faInfrastructureJson.setiTotalRecords(totalCount);
		faInfrastructureJson.setAaData(infrastructureList);

		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		String json = gson.toJson(faInfrastructureJson);

		return json;

	}
	@RequestMapping(value = "/viewfaInfrastructure/{id}", method = RequestMethod.GET)
	public ModelAndView viewfaInfrastructure(@PathVariable Long id) {
		ModelAndView modelAndView = new ModelAndView(
		"/fa/viewfaInfrastructure");
		return modelAndView;
	}
	@RequestMapping(value = "/fetchInfrastructureById", method = RequestMethod.GET)
	@ResponseBody
	public InfrastructureBean fetchInfrastructureById(
			@RequestParam(value = "id", required = true) String applicationId,
			HttpServletRequest request) {
		InfrastructureBean bean = new InfrastructureBean();
		Long id=Long.parseLong(request.getParameter("id"));
		if(id!=null) {
			bean = (InfrastructureBean) faService.fetchInfrastructureListById(id);
		}
		return bean;
	}
	
	@RequestMapping(value = "/downloadInfrastructuredocument/{docuementCode}/{documentType}/{id}", method = RequestMethod.GET)
	public void downloadInfrastructuredocument(@PathVariable Long docuementCode, 
			@PathVariable String documentType,@PathVariable Long id, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		String fileName = getFaService().fetchInfrastructureDownloadFileName(docuementCode,documentType,id);

		File file = new File(fileName);
		InputStream is = new FileInputStream(file);

		// MIME type of the file
		response.setContentType("application/octet-stream");
		// Response header
		response.setHeader("Content-Disposition", "attachment; filename=\""
				+ file.getName() + "\"");
		// Read from the file and write into the response
		OutputStream os = response.getOutputStream();
		byte[] buffer = new byte[1024];
		int len;
		while ((len = is.read(buffer)) != -1) {
			os.write(buffer, 0, len);
		}
		os.flush();
		os.close();
		is.close();
	}
	
	
	@RequestMapping(value = "/fa/viewfaapplicantdetailunitnew", method = RequestMethod.GET)
	public ModelAndView viewFADetailUnitNew() {
		/*ModelAndView modelAndView = new ModelAndView(
				"applicant/fa/viewFADetailUnitNew");*/
		ModelAndView modelAndView = new ModelAndView(
		"applicant/fa/viewFADetailUnitNew2");
		return modelAndView;
	}
	@RequestMapping(value = "/fetchUserIndustrialDetailsByApplicationId", method = RequestMethod.GET)
	@ResponseBody
	public FaIndustrialProfileBean fetchUserIndustrialDetailsByApplicationId(
			@RequestParam(value = "applicationId", required = true) String applicationId,
			HttpServletRequest request) {
		FaIndustrialProfileBean bean = new FaIndustrialProfileBean();
		if (applicationId != "") {
			bean = faService.fetchUserIndustrialDetailsByApplicationId(applicationId);
		} 
		return bean;
	}
	@RequestMapping(value = "/raiseQueryByDtic", method = RequestMethod.POST)
	@ResponseBody
	public ResponseObject raiseQueryByDtic(
			FaRequestProcessBean faRequestProcessBean,
			HttpServletRequest request) throws Exception {

		ResponseObject response = new ResponseObject();

		String[] params = {};
		
		User user = getUserDetail();

		long statusId = 0;


		if (StringUtils.equals(faRequestProcessBean.getStatus(), "query")) {
			statusId = MPIndustryConstants.STATUS_INSPECTION_QUERY;
		}

		String applicationId = faRequestProcessBean.getApplicationId();

		faService.updateFAMSMEScheme(applicationId, user.getUsername(),
				statusId, faRequestProcessBean);

		response.setSuccessMessage(MPIndustryUtil.getMessage(MPIndustryConstants.RESPONSE_FILE, "fa.dtic.inspectionUpdated", params));

		return response;
	}
	
	@RequestMapping(value = "/querybydtic/{applicationId}/{establishmentType}", method = RequestMethod.GET)
	public ModelAndView querybydtic(
			@PathVariable String applicationId,
			@PathVariable String establishmentType) {

		ModelAndView modelAndView = new ModelAndView(
				"fa/querybydtic");
		return modelAndView;
	}
	@RequestMapping(value = "/viewFaHistory/{applicationId}/{establishmentType}", method = RequestMethod.GET)
	public ModelAndView viewfaapplicantHistory(
			@PathVariable String applicationId,
			@PathVariable String establishmentType, HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("applicant/fa/faHistory");
		return modelAndView;
	}
	@RequestMapping(value = "/fa/fetchfaapplicantdetail", method = RequestMethod.GET)
	@ResponseBody
	public FAApplicantBean fetchApplicantDetail(
			@RequestParam(value = "applicationId", required = true) String applicationId)
			throws MPIndustryBusinessException {

		FAApplicantBean applicant = getFaService().fetchFAApplicantDetail(
				applicationId);
		return applicant;
	}
	@RequestMapping(value = "/fa/fetchHistory", method = RequestMethod.GET)
	@ResponseBody
	public List<FaRequestProcessBean> fetchHistory(
			@RequestParam(value = "applicationId", required = true) String applicationId,
			@RequestParam(value = "establishmentType", required = true) String establishmentType)
			throws MPIndustryBusinessException {

		List<FaRequestProcessBean> list = getFaService().fetchHistory(
				applicationId);

		return list;
	}
	
	@RequestMapping(value = "/generateExcelNewMeetingAgenda/{establishmentType}/{applicationIds}", method = RequestMethod.GET)
	public void generateExcelNewMeetingAgenda(@PathVariable String establishmentType,
			@PathVariable String[] applicationIds, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		String fileName = null;

		if (StringUtils.equalsIgnoreCase(
				MPIndustryConstants.ESTABLISHMENT_TYPE_UNIT, establishmentType)) {
			fileName = "FA_Committee_Output_New_Format.xlsx";
		} else {
			fileName = "FA_Committee_Output_Apparel.xlsx";
		}

		// Templates are packaged in src/main/resources, including embedded-server runs.
		XSSFWorkbook workbook;
		try (java.io.InputStream excelFile =
				new org.springframework.core.io.ClassPathResource(fileName).getInputStream()) {
			workbook = new XSSFWorkbook(excelFile);
		}
		XSSFSheet sheet1 = workbook.getSheetAt(0);
		int rowCounter = 13;
	//	int rowCounter2 = 4;
		int sNoCounter = 1;
		int sheet1RowCount = sheet1.getLastRowNum();

		for (String applicationId : applicationIds) {

			CommitteeMeeting commiteeMeeting = faService
					.getCommitteeMeetingData(applicationId);
			// FAApplicantBean applicant = getFaService().fetchMsmeDetailsByApplicationId(applicationId);
			
			//FASchemesBean faSchemeBean = getFaService().fetchFASchemesSelection(applicationId);
			
			
			FARequiredAssistanceBean faRequiredAssistanceBean=new FARequiredAssistanceBean();
			FaIndustrialProfileBean bean = getFaService().fetchUserIndustrialDetailsByApplicationId(applicationId);
			faRequiredAssistanceBean = bean.getFaRequiredAssistanceBean();
			FASchemesBean selectionD = faRequiredAssistanceBean.getSelectedOptions();
			faRequiredAssistanceBean.setSelectfa1(selectionD.isSelectfa1());
			faRequiredAssistanceBean.setSelectfa2(selectionD.isSelectfa2());
			faRequiredAssistanceBean.setSelectfa3(selectionD.isSelectfa3());
			faRequiredAssistanceBean.setSelectfa4(selectionD.isSelectfa4());
			faRequiredAssistanceBean.setSelectfa5(selectionD.isSelectfa5());
			faRequiredAssistanceBean.setSelectfa6(selectionD.isSelectfa6());
			faRequiredAssistanceBean.setSelectfa7(selectionD.isSelectfa7());
			faRequiredAssistanceBean.setSelectfa8(selectionD.isSelectfa8());
			
			
			FaIndustrialProfileBean faIndustrialProfileBean = faService.fetchUserIndustrialDetailsByApplicationId(applicationId);
			
			XSSFRow row = null;
			
			row = sheet1.getRow(1);
			row.getCell(0).setCellValue("à¤œà¤¿à¤²à¤¾ à¤‰à¤¦à¥à¤¯à¥‹à¤— à¤à¤µà¤‚ à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤° à¤•à¥‡à¤‚à¤¦à¥à¤° â€¦â€¦"+faIndustrialProfileBean.getDistrict());
			
			
		//	// System.out.println("District -"+faIndustrialProfileBean.getDistrict());
			if (rowCounter == 13) {
				row = sheet1.getRow(rowCounter);
			//	// System.out.println("if not");
			} else {
				
				sheet1.shiftRows(rowCounter, sheet1RowCount, 1);
				row = sheet1.createRow(rowCounter);
				row.copyRowFrom(sheet1.getRow(13), new CellCopyPolicy());
				row.setHeightInPoints(77);
			//	// System.out.println("if yes");
			}

			row.getCell(0).setCellValue(sNoCounter);
			row.getCell(1).setCellValue(commiteeMeeting.getApplicationId());
			row.getCell(2).setCellValue(faIndustrialProfileBean.getSubmittedOn());
			row.getCell(3).setCellValue(commiteeMeeting.getUnitDetails());
			row.getCell(4).setCellValue(commiteeMeeting.getUnitAddress());
			row.getCell(5).setCellValue(faIndustrialProfileBean.getFaIndustrialUnitBean().getUnitStartDate());
			row.getCell(6).setCellValue(faIndustrialProfileBean.getUdyamRegNo());
		List<FaSchemeCapitalInvestmentBean> ls = faIndustrialProfileBean.getFaIndustrialUnitBean().getCapitalInvestmentBeans();
		Integer total = 0;
		for (FaSchemeCapitalInvestmentBean capitalInvestmentBean : ls) {
			total=total+
				Integer.parseInt(capitalInvestmentBean.getAmount());
		}
			row.getCell(7).setCellValue(total.toString());
			
			StringBuilder sb = new StringBuilder();
			
		
			
			String stext = "";
			if(faRequiredAssistanceBean.isSelectfa1()) {
				stext = "Industrial Development Subsidy";
				sb.append(stext+",");
			}
			if(faRequiredAssistanceBean.isSelectfa2()) {
				stext ="Assistance In Quality Certification";
				sb.append(stext+",");
			}
			if(faRequiredAssistanceBean.isSelectfa3()) {
				stext = "Reimbursement for Patents";
				sb.append(stext+",");
			}
			if(faRequiredAssistanceBean.isSelectfa4()) {
				stext = "Financial Assistance for Infrastructure development upto premises of industrial units";
				sb.append(stext+",");
			}
			if(faRequiredAssistanceBean.isSelectfa5()) {
				stext ="Financial Assistance for setting up effluent treatment plant";
				sb.append(stext+",");
			}
			if(faRequiredAssistanceBean.isSelectfa6()) {
				stext = "Assistance for Energy Audit";
				sb.append(stext+",");
			}
			if(faRequiredAssistanceBean.isSelectfa7()) {
				stext ="Assistance for Powerloom upgradation";
				sb.append(stext+",");
			}
			if(faRequiredAssistanceBean.isSelectfa8()) {
				stext = "Assistance for Setting up Pharmaceutical Lab";
				sb.append(stext);
			}
			
			row.getCell(8).setCellValue(sb.toString());
			//row.getCell(10).setCellValue(applicant.getStatus());


			rowCounter++;
			sNoCounter++;
		}

		try {
			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			workbook.write(outStream);
			byte[] outArray = outStream.toByteArray();
			response.setContentLength(outArray.length);
			String mimeType = request.getServletContext().getMimeType(
					fileName);
			if (mimeType == null) {
				// set to binary type if MIME mapping not found
				mimeType = "application/octet-stream";
			}
			response.setContentType(mimeType);
			// set headers for the response
			String headerKey = "Content-Disposition";
			String headerValue = String.format("attachment; filename=\"%s\"",
					fileName);
			response.setHeader(headerKey, headerValue);
			OutputStream outStream1 = response.getOutputStream();
			outStream1.write(outArray);
			outStream1.flush();
			workbook.close();
			if (null != getUserDetail()) {
				faService.sendNotificationToCommiteeUsers(applicationIds,
						getUserDetail().getUsername());
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping(value = "/faCommitteesStatusUnit/{applicationIds}/{establishmentType}", method = RequestMethod.GET)
	public ModelAndView viewFACcommitteeUnits(
			@PathVariable String[] applicationIds,
			@PathVariable String establishmentType) {

		ModelAndView modelAndView = new ModelAndView(
				"fa/faCommitteesStatusUnit");
		

		List<FAApplicantBean> applicantList = new LinkedList<FAApplicantBean>();
		for (String applicationId : applicationIds) {
		
			FAApplicantBean applicant = getFaService().fetchFAApplicantDetail(applicationId);
			applicantList.add(applicant);
		}
		
		modelAndView.addObject("applicantList",applicantList);
		
		return modelAndView.addObject("applicantList");
	}
	@RequestMapping(value = "/fetchpendingapplicantsByIds/{applicationIds}/{establishmentType}", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public List<FAApplicantBean> fetchInProcessApplicantsById(@PathVariable String[] applicationIds,
			@PathVariable String establishmentType, HttpServletRequest request) {

		List<FAApplicantBean> applicantList = new ArrayList<FAApplicantBean>();
		for (String applicationId : applicationIds) {
			FAApplicantBean applicant = getFaService().fetchMsmeDetailsByApplicationId(applicationId);
			applicantList.add(applicant);
		}
		//// System.out.println(applicantList);
		return applicantList;
		
	}
	
	@RequestMapping(value = "/addCommitteeStatus", method = RequestMethod.POST)
	@ResponseBody
	public ResponseObject addCommitteeStatus(
			FaRequestProcessBean faRequestProcessBean,
			HttpServletRequest request) throws Exception {

		ResponseObject response = new ResponseObject();

		String[] params = {};
		if (faRequestProcessBean.getDocument() == null) {
			response.setErrorMessage(MPIndustryUtil.getMessage(MPIndustryConstants.RESPONSE_FILE, "fa.dtic.uploadDocument", params));
			return response;
		}
		
		
		

		User user = getUserDetail();

		long statusId = 0;

		if (StringUtils.equals(faRequestProcessBean.getStatus(), "yes")) {
			statusId = MPIndustryConstants.STATUS_COMMITTEE_APPROVED;
		}

		else if (StringUtils.equals(faRequestProcessBean.getStatus(), "no")) {
			statusId = MPIndustryConstants.STATUS_COMMITTEE_REJECTED;
		}

		else if (StringUtils
				.equals(faRequestProcessBean.getStatus(), "pending")) {
			statusId = MPIndustryConstants.STATUS_COMMITTEE_PENDING;
		}

		String applicationId = faRequestProcessBean.getApplicationId();

		faService.updateFAMSMEScheme(applicationId, user.getUsername(),
				statusId, faRequestProcessBean);

		response.setSuccessMessage(MPIndustryUtil.getMessage(MPIndustryConstants.RESPONSE_FILE, "fa.dtic.committeeStatusUpdated", params));
		return response;
	}
	
		//04-12
	@RequestMapping(value = "/updateStatus", method = RequestMethod.POST)
	public ResponseObject updateStatus(
	        @RequestParam String applicationId,
	        @RequestParam String status) {

	    ResponseObject response = new ResponseObject();

	    // Validate input parameters
	    if (StringUtils.isBlank(applicationId) || StringUtils.isBlank(status)) {
	        response.setErrorMessage("Invalid input: applicationId and status are required.");
	        return response;
	    }

	    User user = getUserDetail();
	    if (user == null) {
	        response.setErrorMessage("User details could not be retrieved.");
	        return response;
	    }

	    long statusId;
	    try {
	        // Map status to statusId
	        if (StringUtils.equalsIgnoreCase(status, "accepted")) {
	            statusId = MPIndustryConstants.STATUS_COMMITTEE_ACCEPT;
	        }  else {
	            response.setErrorMessage("Invalid status value.");
	            return response;
	        }

	        // Update status in the database
	        boolean updateSuccess = faService.updateStatusFAMSMEScheme(applicationId, user.getUsername(), statusId);

	        if (updateSuccess) {
	            response.setSuccessMessage("Status updated successfully.");
	        } else {
	            response.setErrorMessage("Failed to update status. Please try again.");
	        }

	    } catch (Exception e) {
	        // Log the exception
	        //logger.error("Error updating status for applicationId: " + applicationId, e);
	        response.setErrorMessage("An error occurred while updating the status. Please contact support.");
	    }

	    return response;
	}
	
	@RequestMapping(value = "/addCommitteesStatus/{applicationIds}", method = RequestMethod.POST)
	@ResponseBody
	public ResponseObject addCommitteesStatus(
			FaRequestProcessBean faRequestProcessBean,@PathVariable String[] applicationIds,
			HttpServletRequest request) throws Exception {

		ResponseObject response = new ResponseObject();

		for (String Id : applicationIds){
		//// System.out.println(Id);
		faRequestProcessBean.setApplicationId(Id);
		String[] params = {};
		if (faRequestProcessBean.getDocument() == null) {
			response.setErrorMessage(MPIndustryUtil.getMessage(MPIndustryConstants.RESPONSE_FILE, "fa.dtic.uploadDocument", params));
			return response;
		}

		if (faRequestProcessBean.getComments() == null) {
			response.setErrorMessage(MPIndustryUtil.getMessage(MPIndustryConstants.RESPONSE_FILE, "fa.dtic.committeeComments", params));
			return response;
		}
		
		if (faRequestProcessBean.getDecisionDate() == null) {
			response.setErrorMessage(MPIndustryUtil.getMessage(MPIndustryConstants.RESPONSE_FILE, "fa.dtic.decisionDate", params));
			return response;
		}
		
		User user = getUserDetail();
System.out.print(faRequestProcessBean.getStatus());
		long statusId = 0;

		if (StringUtils.equals(faRequestProcessBean.getStatus(), "yes")) {
			statusId = MPIndustryConstants.STATUS_COMMITTEE_APPROVED;
		}

		else if (StringUtils.equals(faRequestProcessBean.getStatus(), "no")) {
			statusId = MPIndustryConstants.STATUS_COMMITTEE_REJECTED;
			//faRequestProcessBean.setDocument(null);
		}

		else if (StringUtils
				.equals(faRequestProcessBean.getStatus(), "pending")) {
			statusId = MPIndustryConstants.STATUS_COMMITTEE_PENDING;
		}
		
		
	//	// System.out.println("no 1"+statusId);
		String applicationId = faRequestProcessBean.getApplicationId();

		faService.updateFAMSMEScheme(applicationId, user.getUsername(),
				statusId, faRequestProcessBean);
		
		response.setSuccessMessage(MPIndustryUtil.getMessage(MPIndustryConstants.RESPONSE_FILE, "fa.dtic.committeeStatusUpdated", params));
		
		FAApplicantBean schemeBean = getFaService().fetchFAApplicantDetail(applicationId);
		String mobile=schemeBean.getApplicantPhoneNo();
		String tempId="1007633164598622412";
		String msg="Case decided by the Committee against your application "+Id+" for Financial Assistance of MSME. To know more, login to mpmsme.gov.in. Thanks, MPMSME Helpdesk";
		//getNotificationService().sendSMSCaseDecision(mobile, applicationId);
		getNotificationService().sendSMS(mobile, tempId, msg);
		
		}
		
		return response;
	}
	@RequestMapping(value = "/downloadfadocument/{documentTypeCode}/{applicationId}", method = RequestMethod.GET)
	public void downloadDocument(@PathVariable String documentTypeCode,
			@PathVariable String applicationId, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		String fileName = getFaService().fetchFADownloadFileName(
				documentTypeCode, applicationId);

		File file = new File(fileName);
		InputStream is = new FileInputStream(file);

		// MIME type of the file
		response.setContentType("application/octet-stream");
		// Response header
		response.setHeader("Content-Disposition", "attachment; filename=\""
				+ file.getName() + "\"");
		// Read from the file and write into the response
		OutputStream os = response.getOutputStream();
		byte[] buffer = new byte[1024];
		int len;
		while ((len = is.read(buffer)) != -1) {
			os.write(buffer, 0, len);
		}
		os.flush();
		os.close();
		is.close();
	}

	@RequestMapping(value = "/faOtherUploadDocuments/{applicationId}/{establishmentType}", method = RequestMethod.GET)
	public ModelAndView faOtherUploadDocuments(
			@PathVariable String applicationId,
			@PathVariable String establishmentType) {

		ModelAndView modelAndView = new ModelAndView("fa/faOtherUploadDocuments");
		return modelAndView;
	}
	@RequestMapping(value = "/uploadOtherDocument/{applicationId}", method = RequestMethod.POST)
	@ResponseBody
	public ResponseObject uploadOtherDocument(FaOtherUploadBean faOtherUploadBean,@PathVariable String applicationId,HttpServletRequest request)
			throws MPIndustryBusinessException {
			
			try {
				 	
		//	FaMsmeSchemeBean bean = getFaService().fetchFAMSMEDetailUnitForSanction(applicationId, getUserDetail().getUsername());
			ResponseObject response = getFaService().validateOtherUpload(faOtherUploadBean);
			
			if (StringUtils.isNotBlank(response.getErrorMessage()) && applicationId!=null) {
			
			return response;
			}
			
			else if (StringUtils.isEmpty(response.getErrorMessage()) && applicationId!=null) {
			
			
				faOtherUploadBean.setApplicationId(applicationId);
				getFaService().faOtherDocUpload(faOtherUploadBean, getUserDetail().getUsername());
				
				
				// System.out.println("uploaded");
				response.setSuccessMessage("File Successfully uploaded");
				
				return response;
			}
		}
			catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		return null;				
		
	}
	
	@RequestMapping(value = "/getFaOtherDocuments/{applicationId}", method = RequestMethod.GET)
	@ResponseBody
	public List<FaOtherUploadBean> getFaOtherDocuments(@PathVariable String applicationId,HttpServletRequest request)
			throws MPIndustryBusinessException {
			
			try {
				 	
				List<FaDocumentUpload> doclist = getFaService().fetchFADownload("FA_MSME_OTHER_DOCUMENT", applicationId);
				
				List<FaOtherUploadBean> beanlist = new ArrayList<FaOtherUploadBean>();
				for (FaDocumentUpload faDocumentUpload : doclist) {
					FaOtherUploadBean bean = new FaOtherUploadBean();
		
					bean.setRemarks(faDocumentUpload.getRemarks());
					bean.setSubmittedDate(faDocumentUpload.getCreatedOn().toString());
					bean.setFaOtherDocumentId(faDocumentUpload.getDocumentId());
					beanlist.add(bean);
				}
				
				return beanlist;
				}
			catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		return null;				
		
	}
	
	@RequestMapping(value = "/faacceptanceamountdetailunit/{applicationId}/{establishmentType}", method = RequestMethod.GET)
	public ModelAndView viewFAAcceptanceDetailUnit(
			@PathVariable String applicationId,
			@PathVariable String establishmentType) {

		boolean isAvailable = false;
		if (StringUtils.equalsIgnoreCase(
				MPIndustryConstants.ESTABLISHMENT_TYPE_INSTITUTION,
				establishmentType)) {
			isAvailable = getFaService().checkFAAcceptanceDetail(applicationId,
					null);
		} else {
			isAvailable = getFaService().checkFAAcceptanceDetail(applicationId,
					"commitee");
		}

		if (isAvailable) {

			ModelAndView modelAndView = new ModelAndView(
					"dtic/viewdownloadfaacceptanceform");
			return modelAndView;

		}
		ModelAndView modelAndView = new ModelAndView(
				"fa/faacceptanceamountdetailunit");
		return modelAndView;
	}
	
	@RequestMapping(value = "/fetchMsmeDetailSelectionByApplicationId", method = RequestMethod.GET)
	@ResponseBody
	public FARequiredAssistanceBean fetchMsmeDetailsByApplicationId(
			@RequestParam(value = "applicationId", required = true) String applicationId,
			HttpServletRequest request) {
		
		FARequiredAssistanceBean faRequiredAssistanceBean=new FARequiredAssistanceBean();
		FaIndustrialProfileBean bean = getFaService().fetchUserIndustrialDetailsByApplicationId(applicationId);
		faRequiredAssistanceBean = bean.getFaRequiredAssistanceBean();
		FASchemesBean selectionD = faRequiredAssistanceBean.getSelectedOptions();
		faRequiredAssistanceBean.setSelectfa1(selectionD.isSelectfa1());
		faRequiredAssistanceBean.setSelectfa2(selectionD.isSelectfa2());
		faRequiredAssistanceBean.setSelectfa3(selectionD.isSelectfa3());
		faRequiredAssistanceBean.setSelectfa4(selectionD.isSelectfa4());
		faRequiredAssistanceBean.setSelectfa5(selectionD.isSelectfa5());
		faRequiredAssistanceBean.setSelectfa6(selectionD.isSelectfa6());
		faRequiredAssistanceBean.setSelectfa7(selectionD.isSelectfa7());
		faRequiredAssistanceBean.setSelectfa8(selectionD.isSelectfa8());
		faRequiredAssistanceBean.setSelectfa9(selectionD.isSelectfa9());
		return faRequiredAssistanceBean;
	}
	
	@RequestMapping(value = "/addfamsmedetailunitforsanction", method = RequestMethod.POST)
	@ResponseBody
	public ResponseObject addfamsmedetailunitforsanction(
			FaMsmeSchemeBean faMSMESchemeBean,
			HttpServletRequest request) throws Exception {
		
	//	// System.out.println(faMSMESchemeBean.getApplicationId());
		FASchemesBean faSchemesBean = getFaService().fetchFASchemesSelection(
				faMSMESchemeBean.getApplicationId());
		faMSMESchemeBean.setFaSchemesBean(faSchemesBean);
	
		
		ResponseObject response = getFaService().validateFAMSMEDetailUnitDTICSanction(
				faMSMESchemeBean);

		//ResponseObject response = new ResponseObject();
		if (StringUtils.isNotBlank(response.getErrorMessage())) {
			return response;
		}
		
		if(faMSMESchemeBean.getAcceptanceFile()!=null) {
		//	// System.out.println("file ok");
		}
		
		User user = getUserDetail();

		getFaService()
				.addFAMSMEDetailUnitForSanction(faMSMESchemeBean, user.getUsername());

		String[] params = {};
		response.setSuccessMessage(MPIndustryUtil.getMessage(MPIndustryConstants.RESPONSE_FILE, "fa.dtic.detailsAdded", params));
		/// for Sending SMS
		FAApplicantBean schemeBean = getFaService().fetchFAApplicantDetail(faMSMESchemeBean.getApplicationId());
		String mobile=schemeBean.getApplicantPhoneNo();
		String templateId="1007900250722606160";
		String msg="Sanction letter issued for Financial Assistance of MSME. To know more, login to mpmsme.gov.in Thanks, MPMSME Helpdesk";
		//getNotificationService().sendSMS(mobile, templateId,msg);
		//// end of sending SMS
		
		return response;

	}

	@RequestMapping(value = "/faDisbursementUnit/{applicationId}/{establishmentType}", method = RequestMethod.GET)
	public ModelAndView uploadFADisbursementUnit(
			@PathVariable String applicationId,
			@PathVariable String establishmentType) {

		ModelAndView modelAndView = new ModelAndView("fa/faDisbursementUnit");
		return modelAndView;
	}
	@RequestMapping(value = "/faDisbursementUnit1", method = RequestMethod.GET)
	public ModelAndView uploadFADisbursementUnit1() {

		ModelAndView modelAndView = new ModelAndView("fa/faDisbursementUnit_new");
		return modelAndView;
	}
	@RequestMapping(value = "/faDisbursementUnit_new", method = RequestMethod.GET)
	public ModelAndView uploadFADisbursementUnit_new() {

		ModelAndView modelAndView = new ModelAndView("fa/faDisbursementUnit_new1");
		return modelAndView;
	}
	
	@RequestMapping(value = "/faDisbursementUnit_new2", method = RequestMethod.GET)
	public ModelAndView uploadFADisbursementUnit_new2()throws MPIndustryBusinessException {
		// System.out.println("ok");
		ModelAndView modelAndView = new ModelAndView("fa/faDisbursementUnit_new2");
		return modelAndView;
	}
	
	@RequestMapping(value = "/viewfaDisbursementUnit/{applicationId}/{establishmentType}", method = RequestMethod.GET)
	public ModelAndView viewFADisbursementUnit(
			@PathVariable String applicationId,
			@PathVariable String establishmentType) throws MPIndustryBusinessException {

		ModelAndView modelAndView = new ModelAndView("fa/viewfaDisbursementUnit");
		
		return modelAndView;
	}

	@RequestMapping(value = "/fetchDisbursementsUpload/{applicationId}", method = RequestMethod.GET)
	@ResponseBody
	public List<FaDisbursementUploadBean> fetchDisbursementsUpload(@PathVariable String applicationId,HttpServletRequest request)
			throws MPIndustryBusinessException {
		
			
		List<FaDisbursementUploadBean> fasDisbursementList = new ArrayList<FaDisbursementUploadBean>();

		try {			
		List<FaDisbursementUpload> list = getFaService().fetchDisbursementDetails(applicationId);			
		
		for (FaDisbursementUpload faDisbursementUpload : list) {
			FaDisbursementUploadBean bean = new FaDisbursementUploadBean();	
			bean.setApplicationId(faDisbursementUpload.getApplicationId());
			bean.setDisbursementAmt(faDisbursementUpload.getDisbursementAmt().stripTrailingZeros().toPlainString());
			
			bean.setRemarks(faDisbursementUpload.getRemarks());
			bean.setCreatedBy(faDisbursementUpload.getCreatedBy().getEmailId());
			bean.setSubmittedDate(MPIndustryUtil.getformattedDateFromDate(faDisbursementUpload.getCreatedOn()));
			bean.setDisbursementID(faDisbursementUpload.getDisbursementDocId().toString());
			fasDisbursementList.add(bean);
		
		}
		 return fasDisbursementList;
	
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		
		return fasDisbursementList;
		
	}
	
	@RequestMapping(value = "/fetchFAMSMEDetailUnitForSanction", method = RequestMethod.GET)
	@ResponseBody
	public FaMsmeSchemeBean fetchFAMSMEDetailUnitForSanction(@RequestParam(value= "applicationId", required = true) String applicationId)
			throws MPIndustryBusinessException {
		
		User user = getUserDetail();
		FaMsmeSchemeBean faMSMESchemeBean = getFaService().fetchFAMSMEDetailUnitForSanction(applicationId, user.getUsername());
		
		return faMSMESchemeBean;
	}
	
	@RequestMapping(value = "/fetchFAMSMEDetailsForDisbursment", method = RequestMethod.GET)
	@ResponseBody
	public FaMsmeSchemeBean fetchFAMSMEDetailsForDisbursment(@RequestParam(value= "applicationId", required = true) String applicationId)
			throws MPIndustryBusinessException {
		
		FaMsmeSchemeBean faMSMESchemeBean = getFaService().fetchMsmeDetails(applicationId);
		
		return faMSMESchemeBean;
	}
	@RequestMapping(value = "/uploadFaDisbursementOrder/{applicationId}", method = RequestMethod.POST)
	@ResponseBody
	public ResponseObject faDisbursementsUpload(FaDisbursementUploadBean faDisbursementUploadBean,@PathVariable String applicationId,HttpServletRequest request)
			throws MPIndustryBusinessException {
			
			try {
				 	
			FaMsmeSchemeBean bean = getFaService().fetchFAMSMEDetailUnitForSanction(applicationId, getUserDetail().getUsername());
			
			
			ResponseObject response = getFaService().validateDisbursementUpload(
					faDisbursementUploadBean, bean);
			
			if (StringUtils.isNotBlank(response.getErrorMessage()) && applicationId!=null) {
			
			return response;
			}
			
			else if (StringUtils.isEmpty(response.getErrorMessage()) && applicationId!=null) {
			
			
				faDisbursementUploadBean.setApplicationId(applicationId);
				getFaService().saveFaDisbursementsUpload(faDisbursementUploadBean, getUserDetail().getUsername());
				
				
				// System.out.println("uploaded");
				response.setSuccessMessage("Disbursement order Successfully uploaded");
				
				/// for Sending SMS
				FAApplicantBean schemeBean = getFaService().fetchFAApplicantDetail(applicationId);
				String mobile=schemeBean.getApplicantPhoneNo();
				String templateId="1007420090202313730";
				String msg="Installment disbursed for Financial Assistance of MSME. To know more, login to mpmsme.gov.in Thanks, MPMSME Helpdesk.";
				getNotificationService().sendSMS(mobile, templateId,msg);
				//// end of sending SMS
				
				return response;
			}
		}
			catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		return null;				
		
	}
	@RequestMapping(value = "/faCommitteeStatusUnit/{applicationId}/{establishmentType}", method = RequestMethod.GET)
	public ModelAndView viewFACcommitteeUnit(
			@PathVariable String applicationId,
			@PathVariable String establishmentType) {

		ModelAndView modelAndView = new ModelAndView(
				"fa/faCommitteeStatusUnit");
		return modelAndView;
	}
	
	@RequestMapping(value = "/viewfaCommitteeStatusUnit/{applicationId}/{establishmentType}", method = RequestMethod.GET)
	public ModelAndView view2FACcommitteeUnit(
			@PathVariable String applicationId,
			@PathVariable String establishmentType) {

		ModelAndView modelAndView = new ModelAndView(
				"fa/viewfaCommitteeStatusUnit");
		return modelAndView;
	}
	
	
	@RequestMapping(value = "/msmeReportExportToExcel", method = RequestMethod.GET)
	public void msmeReportExportToExcel(HttpServletRequest request, HttpServletResponse response) {

		String fileName = "MSME_DISTRICT_WISE_REPORT_LIST.xlsx";
		User user = getUserDetail();
		
		
		FaDto searchDto = new FaDto();
		
		if (request.getParameter("reportType") != null) {
			searchDto.setReportType(request.getParameter("reportType"));
		}
		if (request.getParameter("searchField") != null)
			searchDto.setSearch(request.getParameter("searchField"));
		if (request.getParameter("fromDate") != null)
			searchDto.setFromDate(request.getParameter("fromDate"));
		if (request.getParameter("toDate") != null)
			searchDto.setToDate(request.getParameter("toDate"));
		if (request.getParameter("startRecord") != null) {
			searchDto.setStartRecord(Integer.parseInt(request.getParameter("startRecord")));
		}
		if (request.getParameter("noOfRows") != null) {
			//searchDto.setNoOfRows(Integer.parseInt(request.getParameter("noOfRows")));
		}

		String sSortCol = request.getParameter("iSortCol_0");
		String sSortDir = request.getParameter("sSortDir_0");
		String sColName = request.getParameter("mDataProp_" + sSortCol);
		SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);

		// Fetch the page number from client
		Integer pageNumber = 100;

		// Fetch search parameter
		String searchParameter = request.getParameter("sSearch");

		// Fetch Page display length
		// Integer pageDisplayLength =
		// Integer.valueOf(request.getParameter("iDisplayLength"));
		Integer pageDisplayLength = 100;

		if (null != request.getParameter("iDisplayStart")) {
			pageNumber = (Integer.valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1;
		}

		Integer firstResult = (pageNumber - 1) * pageDisplayLength;

		try {
			String fileRealPath = request.getSession().getServletContext().getRealPath("/WEB-INF/classes/" + fileName);

			FileInputStream excelFile = new FileInputStream(new File(fileRealPath));

			XSSFWorkbook workbook = new XSSFWorkbook(excelFile);
			XSSFSheet sheet1 = workbook.getSheetAt(0);
			int snoCounter = 1, rowCounter = 7 ;
			int totCol1=0 , totCol2 = 0 , totCol3 = 0 , totCol4 = 0 , totCol5 = 0 , totCol6 = 0, totCol7 = 0;

			// List<VacantLandBean> landList = idService.fetchAllVacantLands();
			//List<FaReportBean> applicants = getFaService().fetchFAReportPageWise(sColName, firstResult,
				//	pageDisplayLength, sortField, searchDto);
			List<FaDistrictWiseReportBean> applicants = getFaService().fetchFADistrictWiseReportPageWise(sColName, firstResult, pageDisplayLength,
					sortField, searchDto);
			for (FaDistrictWiseReportBean applicant : applicants) {

				XSSFRow row = sheet1.createRow(rowCounter);

				row.createCell(0).setCellValue(String.valueOf(snoCounter));
				row.createCell(1)
						.setCellValue(applicant.getDistrictName() != null ? applicant.getDistrictName() : "");
				row.createCell(2).setCellValue(applicant.getApplicationId());
				totCol1 = totCol1 + Integer.valueOf(applicant.getApplicationId());
				/*
				 * row.createCell(3).setCellValue(applicant.getStatus2()); totCol2+=
				 * applicant.getStatus2();
				 * row.createCell(4).setCellValue(applicant.getStatus5());
				 * totCol3+=applicant.getStatus5();
				 * row.createCell(5).setCellValue(applicant.getStatus9());
				 * totCol4+=applicant.getStatus9();
				 * row.createCell(6).setCellValue(applicant.getStatus9());
				 * totCol5+=applicant.getStatus9();
				 * row.createCell(7).setCellValue(applicant.getStatus9());
				 * totCol6+=applicant.getStatus9();
				 * row.createCell(8).setCellValue(applicant.getStatus10());
				 * totCol7+=applicant.getStatus10();
				 */
				

				snoCounter++;
				rowCounter++;
			}
			XSSFRow row = sheet1.createRow(rowCounter);
			row.createCell(0).setCellValue("");
			row.createCell(1).setCellValue("Total");
			row.createCell(2).setCellValue(totCol1);
			/*
			 * row.createCell(2).setCellValue(totCol1);
			 * row.createCell(3).setCellValue(totCol2);
			 * row.createCell(4).setCellValue(totCol3);
			 * row.createCell(5).setCellValue(totCol4);
			 * row.createCell(6).setCellValue(totCol5);
			 * row.createCell(7).setCellValue(totCol6);
			 * row.createCell(8).setCellValue(totCol7);
			 */
			

			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			workbook.write(outStream);
			byte[] outArray = outStream.toByteArray();
			response.setContentLength(outArray.length);
			String mimeType = request.getServletContext().getMimeType(fileRealPath);
			if (mimeType == null) {
				mimeType = "application/octet-stream";
			}
			response.setContentType(mimeType);
			// set headers for the response
			String headerKey = "Content-Disposition";
			String headerValue = String.format("attachment; filename=\"%s\"", fileName);
			response.setHeader(headerKey, headerValue);
			OutputStream outStream1 = response.getOutputStream();
			outStream1.write(outArray);
			outStream1.flush();
			workbook.close();

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping(value = "/msmeDetailReportExportToExcel", method = RequestMethod.GET)
	public void msmeDetailReportExportToExcel(HttpServletRequest request, HttpServletResponse response) {

		String fileName = "MSME_DETAILS_REPORT_LIST.xlsx";
		User user = getUserDetail();
		FaDto searchDto = new FaDto();
		if (request.getParameter("searchField") != null)
			searchDto.setSearch(request.getParameter("searchField"));
		if (request.getParameter("fromDate") != null)
			searchDto.setFromDate(request.getParameter("fromDate"));
		if (request.getParameter("toDate") != null)
			searchDto.setToDate(request.getParameter("toDate"));
		if (request.getParameter("districtId") != null && request.getParameter("districtId") != "")
			searchDto.setDitrictId(request.getParameter("districtId"));
		if (request.getParameter("schemeName") != null)
			searchDto.setSchemeName(request.getParameter("schemeName"));
		if (request.getParameter("startRecord") != null) {
			searchDto.setStartRecord(Integer.parseInt(request.getParameter("startRecord")));
		}
		if (request.getParameter("noOfRows") != null) {
			searchDto.setNoOfRows(Integer.parseInt(request.getParameter("noOfRows")));
		}
		if(request.getParameter("status") != null) {
			searchDto.setStatus(request.getParameter("status"));
		}
			

		String sSortCol = request.getParameter("iSortCol_0");
		String sSortDir = request.getParameter("sSortDir_0");
		String sColName = request.getParameter("mDataProp_" + sSortCol);
		SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);

		// Fetch the page number from client
		Integer pageNumber = 100;

		// Fetch search parameter
		String searchParameter = request.getParameter("sSearch");

		// Fetch Page display length
		// Integer pageDisplayLength =
		// Integer.valueOf(request.getParameter("iDisplayLength"));
		Integer pageDisplayLength = 100;

		if (null != request.getParameter("iDisplayStart")) {
			pageNumber = (Integer.valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1;
		}

		Integer firstResult = (pageNumber - 1) * pageDisplayLength;

		try {
			String fileRealPath = request.getSession().getServletContext().getRealPath("/WEB-INF/classes/" + fileName);

			FileInputStream excelFile = new FileInputStream(new File(fileRealPath));

			XSSFWorkbook workbook = new XSSFWorkbook(excelFile);
			XSSFSheet sheet1 = workbook.getSheetAt(0);
			int snoCounter = 1, rowCounter = 7;

			// List<VacantLandBean> landList = idService.fetchAllVacantLands();
			//List<FaReportBean> applicants = getFaService().fetchFAReportPageWise(sColName, firstResult,
				//	pageDisplayLength, sortField, searchDto);
			List<MsmeDetailReportBean> applicants = getFaService().fetchMsmeDetailReportListPageWiseExport(sColName, firstResult, pageDisplayLength, sortField,
					searchDto);

			for (MsmeDetailReportBean applicant : applicants) {

				XSSFRow row = sheet1.createRow(rowCounter);

				row.createCell(0).setCellValue(String.valueOf(snoCounter));
				row.createCell(1).setCellValue(applicant.getUdyamRegNumber());
				row.createCell(2).setCellValue(applicant.getUdyamRegDate() != null ? applicant.getUdyamRegDate() : "");
				row.createCell(3).setCellValue(applicant.getMsmeType());
				row.createCell(4).setCellValue(applicant.getOwnerOrPartnerName());
				row.createCell(5).setCellValue(applicant.getProductionDate() != null ? applicant.getProductionDate() : "");
				row.createCell(6).setCellValue(applicant.getCreatedOn() != null ? applicant.getCreatedOn() : "");
				row.createCell(7).setCellValue(applicant.getLeaseDeedDate() != null ? applicant.getLeaseDeedDate() : "");
				row.createCell(8).setCellValue(applicant.getActivity() != null ? applicant.getActivity() : "");
				row.createCell(9).setCellValue(applicant.getProducts() != null ? applicant.getProducts() : "");
				row.createCell(10).setCellValue(applicant.getInvestmentInLac() != null ? applicant.getInvestmentInLac() : "");
				row.createCell(11).setCellValue(applicant.getLeaseRentPerYear() != null ? applicant.getLeaseRentPerYear() : "");
				row.createCell(12).setCellValue(applicant.getMaintenanceCharge() != null ? applicant.getMaintenanceCharge() : "");
				row.createCell(13).setCellValue(applicant.getInIndustrialArea() != null ? applicant.getInIndustrialArea() : "");
				row.createCell(14).setCellValue(applicant.getIndustrialArea() != null ? applicant.getIndustrialArea() : "");
				
				row.createCell(15).setCellValue(applicant.getProdCapacity() != null ? applicant.getProdCapacity() : "");
				row.createCell(16).setCellValue(applicant.getIsExport() != null ? applicant.getIsExport() : "");
				row.createCell(17).setCellValue(applicant.getAnnualTurnOver() != null ? applicant.getAnnualTurnOver() : "");
				row.createCell(18).setCellValue(applicant.getInstalledCapacity() != null ? applicant.getInstalledCapacity() : "");
				row.createCell(19).setCellValue(applicant.getInstalledCapacityUnits() != null ? applicant.getInstalledCapacityUnits() : "");
				snoCounter++;
				rowCounter++;
			}

			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			workbook.write(outStream);
			byte[] outArray = outStream.toByteArray();
			response.setContentLength(outArray.length);
			String mimeType = request.getServletContext().getMimeType(fileRealPath);
			if (mimeType == null) {
				mimeType = "application/octet-stream";
			}
			response.setContentType(mimeType);
			// set headers for the response
			String headerKey = "Content-Disposition";
			String headerValue = String.format("attachment; filename=\"%s\"", fileName);
			response.setHeader(headerKey, headerValue);
			OutputStream outStream1 = response.getOutputStream();
			outStream1.write(outArray);
			outStream1.flush();
			workbook.close();

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	// new disbursement distribution
//		@RequestMapping(value = "/fetchDisbursementList/{establishmentType}", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
//		public @ResponseBody List<FaDisbursementBean> fetchDisbursementList(
//				@PathVariable String establishmentType, HttpServletRequest request) {
//
//			User user = getUserDetail();
//
//			String sSortCol = request.getParameter("iSortCol_0");
//			String sSortDir = request.getParameter("sSortDir_0");
//			String sColName = request.getParameter("mDataProp_" + sSortCol);
//			SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);
//
//			// Fetch the page number from client
//			Integer pageNumber = 0;
//
//			// Fetch search parameter
//			String searchParameter = request.getParameter("sSearch");
//
//			Integer pageDisplayLength =0;
//			Integer firstResult =0;
//			/*
//			 * // Fetch Page display length Integer pageDisplayLength =
//			 * Integer.valueOf(request.getParameter("iDisplayLength"));
//			 * 
//			 * if (null != request.getParameter("iDisplayStart")) { pageNumber = (Integer
//			 * .valueOf(request.getParameter("iDisplayStart")) / pageDisplayLength) + 1; }
//			 * 
//			 * Integer firstResult = (pageNumber - 1) * pageDisplayLength;
//			 */
//
//			// Create page list data
//			List<FaDisbursementBean> applicants = getFaService()
//					.fetchDisbursementList(user.getUsername(),
//							establishmentType, firstResult, pageDisplayLength,
//							sortField, searchParameter);
//
//			
//			return applicants;
//
//		}
		@RequestMapping(value = "/fetchDisbursementListNew/{establishmentType}/{searchString}/{orderDate1}/{orderDate2}", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
		public @ResponseBody List<FaDisbursementBean> fetchDisbursementListNew(
		        @PathVariable String establishmentType,
		        @PathVariable String searchString,
		        @PathVariable String orderDate1,
		        @PathVariable String orderDate2,
		        HttpServletRequest request) {
			User user = getUserDetail();

			String sSortCol = request.getParameter("iSortCol_0");
			String sSortDir = request.getParameter("sSortDir_0");
			String sColName = request.getParameter("mDataProp_" + sSortCol);
			SortFieldBean sortField = new SortFieldBean(sColName, sSortDir);

			// Fetch the page number from client
			Integer pageNumber = 0;

			// Fetch search parameter
			String searchParameter = request.getParameter("sSearch");

			Integer pageDisplayLength =0;
			Integer firstResult =0;
			

			// Create page list data
			List<FaDisbursementBean> applicants = getFaService()
					.fetchDisbursementListNew(user.getUsername(),
							establishmentType, firstResult, pageDisplayLength,
							sortField, searchString,orderDate1,orderDate2);

						return applicants;

	}
		
		@RequestMapping(value = "/uploadFaDisbursementOrder_new", method = RequestMethod.POST)
		@ResponseBody
		public ResponseObject faDisbursementsUpload_new(
				@RequestParam("disbursementDoc") List<MultipartFile> disbursementDocList,
				@RequestParam("applicationId") List<String> applicationIdList,
		        @RequestParam("disbursementAmt") List<String> disbursementAmtList,
		        @RequestParam("faLetterNo") List<String> faLetterNoList,
		        @RequestParam("faLetterDate") List<String> faLetterDateList,
		        @RequestParam("remark") List<String> remarkList,
		        HttpServletRequest request) throws MPIndustryBusinessException {
			
		    // Your processing logic...
			ResponseObject response=null;
		    // Create FaDisbursementUploadBean objects based on the received parameters
		    List<FaDisbursementUploadBean> faDisbursementUploadBeansList = new ArrayList<>();

		    for (int i = 0; i < disbursementAmtList.size(); i++) {
		        FaDisbursementUploadBean faDisbursBean = new FaDisbursementUploadBean();
		        faDisbursBean.setApplicationId(applicationIdList.get(i));
		        faDisbursBean.setDisbursementAmt(disbursementAmtList.get(i));
		        faDisbursBean.setFaLetterNo(faLetterNoList.get(i));
		        faDisbursBean.setFaLetterDate(faLetterDateList.get(i));
		        faDisbursBean.setRemarks(remarkList.get(i));
		        faDisbursBean.setDisbursementDoc(disbursementDocList.get(i));

		        // Add the bean to the list
		        faDisbursementUploadBeansList.add(faDisbursBean);
		        // actual code
		        String applicationId="";
		        List<FaDisbursementUploadBean> faBeanList = new LinkedList<FaDisbursementUploadBean>();
				for(FaDisbursementUploadBean faBean: faDisbursementUploadBeansList) {
					applicationId=faBean.getApplicationId();
					FaMsmeSchemeBean bean = getFaService().fetchFAMSMEDetailUnitForSanction(faBean.getApplicationId(),getUserDetail().getUsername());
					faBeanList.add(faBean);
					response = getFaService().validateDisbursementUpload(
							faBean, bean);
				
					if (StringUtils.isNotBlank(response.getErrorMessage()) && applicationId!=null) {
						
						return response;
						}
					else if (StringUtils.isEmpty(response.getErrorMessage()) && applicationId!=null) {
						
						
						faBean.setApplicationId(applicationId);
						getFaService().saveFaDisbursementsUpload(faBean, getUserDetail().getUsername());
						
						
						// System.out.println("uploaded");
						response.setSuccessMessage("Disbursement order Successfully uploaded");
		    }

		    // Continue with your logic using faDisbursementUploadBeansList...
				}
		    
		}
		    return response; // Return your actual response object
		}

		@RequestMapping(value = "/save_disbursementCalculator", method = RequestMethod.POST)
		@ResponseBody
		public ResponseObject saveDisbursementCalculator(
				
				@RequestParam("applicationId") List<String> applicationIdList,
				@RequestParam("establishmentName") List<String> establishmentNameList,
		        @RequestParam("disbursementAmt") List<String> disbursementAmtList,
		        @RequestParam("remark") List<String> remarkList,
		        @RequestParam("sanctioneAmount") List<String> sanctioneAmountList,
		        @RequestParam("remainingAmount") List<String> remainingAmountList,
		        @RequestParam("percent") List<String> percent,
		        @RequestParam("disbursedAmount") List<String> disbursedAmount,
		        HttpServletRequest request) throws MPIndustryBusinessException {
			
		    // Your processing logic...
			ResponseObject response=null;
		    // Create FaDisbursementUploadBean objects based on the received parameters
		    List<FaDisbursementCalculatorBean> faDisbursementCalculatorBeansList = new ArrayList<>();

		    for (int i = 0; i < disbursementAmtList.size(); i++) {
		    	FaDisbursementCalculatorBean faDisbursBean = new FaDisbursementCalculatorBean();
		    	
		        faDisbursBean.setApplicationId(applicationIdList.get(i));
		        faDisbursBean.setEstablishmentName(establishmentNameList.get(i));
		        faDisbursBean.setDisbursementAmount(disbursementAmtList.get(i));
		        faDisbursBean.setRemaningAmount(remainingAmountList.get(i));
		        faDisbursBean.setSanctionedAmount(sanctioneAmountList.get(i));
		        faDisbursBean.setPercent(percent.get(i));
		        faDisbursBean.setDisbursedAmount(disbursedAmount.get(i));
		 	        // Add the bean to the list
		        faDisbursementCalculatorBeansList.add(faDisbursBean);
		       

				}
		    User user = getUserDetail();
		    	faService.saveDisbursementCalculator(faDisbursementCalculatorBeansList, user.getUsername());
		
		    return response; // Return your actual response object
		}
		@RequestMapping(value = "/fetchfaapplicants/{establishmentType}/{userId}", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
		public @ResponseBody String fetchFAApplicants(@PathVariable String establishmentType,@PathVariable String userId) {

			List<FaNewMsmeBean> applicants = getFaService().fetchFAApplicantsForMpidc(userId,establishmentType);

			Integer displayCount = getFaService().fetchFAApplicantsForMpidcCount(userId, establishmentType);
			Integer totalCount = getFaService().fetchFAApplicantsCount(userId, establishmentType, null);

			FASchemeJsonNew selfApplicantJson = new FASchemeJsonNew();
			// FAApplicantJson selfApplicantJson = new FAApplicantJson();
		//	selfApplicantJson.setiTotalDisplayRecords(displayCount);
			selfApplicantJson.setiTotalRecords(totalCount);
			selfApplicantJson.setAaData(applicants);

			Gson gson = new GsonBuilder().setPrettyPrinting().create();
			String json = gson.toJson(selfApplicantJson);
			return json;
		}
		
//		@RequestMapping(value = "/uploadFaDisbursementOrder_new", method = RequestMethod.POST)
//		@ResponseBody
//		public ResponseObject faDisbursementsUpload_new(@RequestBody List<FaDisbursementUploadBean> faDisbursementUploadBeansList,HttpServletRequest request)
//				throws MPIndustryBusinessException {
//			ResponseObject response=null;
//		    // Log incoming data
//		  
//		        // System.out.println("okkkkkkkk");
//		      // for (FaDisbursementUploadBean bean : faDisbursementUploadBeans) {
//		        //String appId=faDisbursementUploadBeans.getApplicationId();
//		        
//		       // }
////		      
//		    return response;
//		    // Your logic here
//		}
		
//		@RequestMapping(value = "/uploadFaDisbursementOrder_new", method = RequestMethod.POST , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//		@ResponseBody
//		public ResponseObject faDisbursementsUpload_new(@RequestPart("faDisbursementUploadBean") List<FaDisbursementUploadBean> faDisbursementUploadBean, HttpServletRequest request)
//				throws MPIndustryBusinessException {
//			ResponseObject response=null;String applicationId="";
//			// System.out.println("okkkkkk");
//				try {
//			
//					List<FaDisbursementUploadBean> faBeanList = new LinkedList<FaDisbursementUploadBean>();
//				for(FaDisbursementUploadBean faBean: faDisbursementUploadBean) {
//					applicationId=faBean.getApplicationId();
//					FaMsmeSchemeBean bean = getFaService().fetchFAMSMEDetailUnitForSanction(faBean.getApplicationId(),getUserDetail().getUsername());
//					faBeanList.add(faBean);
//					response = getFaService().validateDisbursementUpload(
//							faBean, bean);
//				
//					if (StringUtils.isNotBlank(response.getErrorMessage()) && applicationId!=null) {
//						
//						return response;
//						}
//					else if (StringUtils.isEmpty(response.getErrorMessage()) && applicationId!=null) {
//						
//						
//						faBean.setApplicationId(applicationId);
//						getFaService().saveFaDisbursementsUpload(faBean, getUserDetail().getUsername());
//						
//						
//						// System.out.println("uploaded");
//						response.setSuccessMessage("Disbursement order Successfully uploaded");
//						
//						/// for Sending SMS
//						FAApplicantBean schemeBean = getFaService().fetchFAApplicantDetail(applicationId);
//						String mobile=schemeBean.getApplicantPhoneNo();
//						String templateId="1007420090202313730";
//						String msg="Installment disbursed for Financial Assistance of MSME. To know more, login to mpmsme.gov.in Thanks, MPMSME Helpdesk.";
//						getNotificationService().sendSMS(mobile, templateId,msg);
//						//// end of sending SMS
//						
//						return response;
//					}
//					
//				}
//				}
//				catch (Exception e) {
//					// TODO: handle exception
//					e.printStackTrace();
//				}
//				//FaMsmeSchemeBean bean = getFaService().fetchFAMSMEDetailUnitForSanction(applicationId, getUserDetail().getUsername());
//				
//				
//				/* ResponseObject response = getFaService().validateDisbursementUpload(
//						faDisbursementUploadBean, bean);
//				
//				if (StringUtils.isNotBlank(response.getErrorMessage()) && applicationId!=null) {
//				
//				return response;
//				}
//				
//				else if (StringUtils.isEmpty(response.getErrorMessage()) && applicationId!=null) {
//				
//				
//					faDisbursementUploadBean.setApplicationId(applicationId);
//					getFaService().saveFaDisbursementsUpload(faDisbursementUploadBean, getUserDetail().getUsername());
//					
//					
//					// System.out.println("uploaded");
//					response.setSuccessMessage("Disbursement order Successfully uploaded");
//					
//					/// for Sending SMS
//					FAApplicantBean schemeBean = getFaService().fetchFAApplicantDetail(applicationId);
//					String mobile=schemeBean.getApplicantPhoneNo();
//					String templateId="1007420090202313730";
//					String msg="Installment disbursed for Financial Assistance of MSME. To know more, login to mpmsme.gov.in Thanks, MPMSME Helpdesk.";
//					getNotificationService().sendSMS(mobile, templateId,msg);
//					//// end of sending SMS
//					
//					return response;
//				}
//			}*/
//				
//			return null;				
//			
//		}
//		@RequestMapping(value = "/print_disbursementCalculator", method = RequestMethod.POST)
//		public String generatePDF(@RequestParam("applicationId") String applicantId,
//		                       HttpServletRequest request HttpServletResponse response)
//		        throws Exception {
//		    Map<Integer, FaDisbursementCalculatorBean> searchReport = getFaService().fetchFaDistributionDetail(applicantId);
//		    String result = PDFGenerator.generate("ve/fa/acceptanceletter",
//		            searchReport, MPIndustryConstants.DLAC_SANCTION_ORDER + "-"
//		                    + applicantId);
//		    // System.out.println("Result: " + searchReport);
	//
//		    try {
//		        response.setContentType("application/pdf");
//		        response.setContentLength(result.getBytes("UTF-8").length);
//		        response.setHeader("Content-Disposition", "attachment; filename=DLAC_SANCTION_ORDER-" + applicantId + ".pdf");
	//
//		        try (OutputStream outStream = response.getOutputStream();
//		             InputStream inputStream = new ByteArrayInputStream(result.getBytes("UTF-8"))) {
	//
//		            byte[] outputByte = new byte[4096];
//		            int bytesRead;
//		            while ((bytesRead = inputStream.read(outputByte, 0, 4096)) != -1) {
//		                outStream.write(outputByte, 0, bytesRead);
//		            }
//		        }
//		    } catch (FileNotFoundException e) {
//		        e.printStackTrace();
//		    } catch (IOException e) {
//		        e.printStackTrace();
//		    }
//		    return "PDF generated successfully";
	//	
//		}
//		@RequestMapping(value = "/print_disbursementCalculator", method = RequestMethod.POST)
//		public String generatePDF(@RequestParam("applicationId") String applicantId,
//		                       HttpServletRequest request, HttpServletResponse response)
//		        throws Exception {
//		    List< FaDisbursementCalculatorBean> searchReport = getFaService().fetchFaDistributionDetail(applicantId);
//		    try {
//		    ExportPdfDataDTO dataDTO = new ExportPdfDataDTO();
//		    dataDTO.setFileName("PDF List");
//		    dataDTO.setHeading("PDF List");
//		    dataDTO.getTableHeading().add("Application Id");
//		    dataDTO.getTableHeading().add("Disbursed Amount");
//		    dataDTO.getTableHeading().add("Sanctioned Amount");
//		    for (FaDisbursementCalculatorBean s : searchReport) {
//		    	ArrayList<Object> arrayList = new ArrayList<Object>();
//		    	arrayList.add(s.getApplicationId());
//		    	arrayList.add(s.getDisbursementAmount());
//		    	arrayList.add(s.getSanctionedAmount());
//		    	dataDTO.getData().add(arrayList);
//		}
//		    ExportPDFByHTML.downloadPdfFile(request,response, dataDTO);
//		    
//		}catch (Exception ex) {
//			//log.error("Error occured while exporting data for employee list", ex);
//			ex.printStackTrace();
//			try {
//				response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//			} catch (Exception e) {
//			}
//		}
//		    return "PDF generated successfully";
//		}
		@RequestMapping(value = "/print_disbursementCalculator", method = RequestMethod.GET)
		public void generateExcel(HttpServletRequest request, HttpServletResponse response)
			        throws Exception {
				//String applicantId = request.getParameter("applicationId");
				String[] applicantIds = request.getParameterValues("applicationId");
				String applicantId="";
				String fileName = "Disbursement_REPORT_List.xlsx";
				LocalDate today = LocalDate.now();
		        // System.out.println("Today's date: " + today);
				
				String fileRealPath = request.getSession().getServletContext().getRealPath("/WEB-INF/classes/" + fileName);
		// System.out.println(fileRealPath);
				FileInputStream excelFile = new FileInputStream(new File(fileRealPath));
				XSSFWorkbook workbook = new XSSFWorkbook(excelFile);
			XSSFSheet sheet1 = workbook.getSheetAt(0);
			int snoCounter = 1, rowCounter = 6 ;
			
		   
		    try {
		    	
		    	
		    	@SuppressWarnings("unchecked")
				List <FaDisbursementCalculatorBean> searchReport = getFaService().fetchDistributionCalulator(applicantId);
		    	
		     for (FaDisbursementCalculatorBean s : searchReport) {


				XSSFRow row = sheet1.createRow(rowCounter);

				row.createCell(0).setCellValue(String.valueOf(snoCounter));
				//setCellValue(applicant.getDistrictName() != null ? applicant.getDistrictName() : "");
				row.createCell(1).setCellValue(s.getApplicationId());
				
				row.createCell(2).setCellValue(s.getEstablishmentName());
				
				row.createCell(3).setCellValue(s.getSanctionedAmount());
				
				row.createCell(4).setCellValue(s.getDisbursedAmount()!=null ? s.getDisbursedAmount() : "");
				
				row.createCell(5).setCellValue(s.getRemaningAmount()!=null ? s.getRemaningAmount() : "");
				
				row.createCell(6).setCellValue(s.getPercent());
				
				row.createCell(7).setCellValue(s.getDisbursementAmount().toString());
				
				
				snoCounter++;
				rowCounter++;
		     }
				ByteArrayOutputStream outStream = new ByteArrayOutputStream();
				workbook.write(outStream);
				byte[] outArray = outStream.toByteArray();
				response.setContentLength(outArray.length);
				String mimeType = request.getServletContext().getMimeType(fileRealPath);
				if (mimeType == null) {
					mimeType = "application/octet-stream";
				}
				response.setContentType(mimeType);
				// set headers for the response
				String headerKey = "Content-Disposition";
				String headerValue = String.format("attachment; filename=\"%s\"", fileName);
				response.setHeader(headerKey, headerValue);
				OutputStream outStream1 = response.getOutputStream();
				outStream1.write(outArray);
				outStream1.flush();
				workbook.close();
		
		   
		    
		}catch (Exception ex) {
			//log.error("Error occured while exporting data for employee list", ex);
			ex.printStackTrace();
			try {
				response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			} catch (Exception e) {
			}
		}
		    
		}	
	
		
	
}


