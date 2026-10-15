package com.mapit.mpindustry.fa.dao.impl;

import java.util.*;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Session;
import org.hibernate.query.NativeQuery;
import org.hibernate.query.Query;
import com.mapit.mpindustry.common.util.AliasToBeanTupleTransformer;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.FlushModeType;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.Tuple;

import com.mapit.mpindustry.common.bean.SortFieldBean;
import com.mapit.mpindustry.common.constants.MPIndustryConstants;
import com.mapit.mpindustry.common.dao.impl.CommonDaoImpl;
import com.mapit.mpindustry.common.entity.CommonAddress;
import com.mapit.mpindustry.common.entity.MasterStartupDomains;
import com.mapit.mpindustry.common.entity.MasterStatus;
import com.mapit.mpindustry.fa.bean.FAApplicantBean;
import com.mapit.mpindustry.fa.bean.FASanctionedVsDisbursementReportBean;
import com.mapit.mpindustry.fa.bean.FaDisbursementBean;
import com.mapit.mpindustry.fa.bean.FaDistrictWiseReportBean;
import com.mapit.mpindustry.fa.bean.FaNewMsmeBean;
import com.mapit.mpindustry.fa.bean.FaReportBean;
import com.mapit.mpindustry.fa.bean.FaSchemeCapitalInvestmentBean;
import com.mapit.mpindustry.fa.bean.FaSchemeWiseReportBean;
import com.mapit.mpindustry.fa.bean.InfrastructureBean;
import com.mapit.mpindustry.fa.bean.MsmeDetailReportBean;
import com.mapit.mpindustry.fa.dao.FADao;
import com.mapit.mpindustry.fa.dto.FaDto;
import com.mapit.mpindustry.fa.entity.FaApparelSector;
import com.mapit.mpindustry.fa.entity.FaBoostingCircularEconomy;
import com.mapit.mpindustry.fa.entity.FaCapitalAssistExpInvDet;
import com.mapit.mpindustry.fa.entity.FaCapitalAssistance;
import com.mapit.mpindustry.fa.entity.FaDisbursementCalculator;
import com.mapit.mpindustry.fa.entity.FaDisbursementUpload;
import com.mapit.mpindustry.fa.entity.FaDocumentUpload;
import com.mapit.mpindustry.fa.entity.FaEnergyAuditAssistance;
import com.mapit.mpindustry.fa.entity.FaFoodProcessingUnit;
import com.mapit.mpindustry.fa.entity.FaFootwearFurnitureToysValueChainProduct;
import com.mapit.mpindustry.fa.entity.FaFreightAssistanceforExport;
import com.mapit.mpindustry.fa.entity.FaGlobalCompetitiveness;
import com.mapit.mpindustry.fa.entity.FaGrievanceDocuments;
import com.mapit.mpindustry.fa.entity.FaGrievanceProcess;
import com.mapit.mpindustry.fa.entity.FaGrievanceRederessal;
import com.mapit.mpindustry.fa.entity.FaHelpSupport;
import com.mapit.mpindustry.fa.entity.FaIncubationContacts;
import com.mapit.mpindustry.fa.entity.FaIncubationRegistration;
import com.mapit.mpindustry.fa.entity.FaIncubatorCapacityEnhancement;
import com.mapit.mpindustry.fa.entity.FaIncubatorDetails;
import com.mapit.mpindustry.fa.entity.FaIncubatorOrganizingEvent;
import com.mapit.mpindustry.fa.entity.FaIncubatorStartupFundingAssistance;
import com.mapit.mpindustry.fa.entity.FaIncubatorWorkFlow;
import com.mapit.mpindustry.fa.entity.FaInfraDevExpCompensation;
import com.mapit.mpindustry.fa.entity.FaInspection;
import com.mapit.mpindustry.fa.entity.FaLogisticsWarehousingProject;
import com.mapit.mpindustry.fa.entity.FaMasterCities;
import com.mapit.mpindustry.fa.entity.FaMasterIndentors;
import com.mapit.mpindustry.fa.entity.FaMasterIndustries;
import com.mapit.mpindustry.fa.entity.FaMasterIndustrySectors;
import com.mapit.mpindustry.fa.entity.FaMasterStartupStatus;
import com.mapit.mpindustry.fa.entity.FaMotorVehicleScrappingCentre;
import com.mapit.mpindustry.fa.entity.FaMsmeDetail;
import com.mapit.mpindustry.fa.entity.FaMsmeScheme;
import com.mapit.mpindustry.fa.entity.FaPharmaLabAssistance;
import com.mapit.mpindustry.fa.entity.FaPowerloomUpgradation;
import com.mapit.mpindustry.fa.entity.FaQualityAssistance;
import com.mapit.mpindustry.fa.entity.FaReimbursementPatents;
import com.mapit.mpindustry.fa.entity.FaRequestProcess;
import com.mapit.mpindustry.fa.entity.FaResearchDevelopmentProject;
import com.mapit.mpindustry.fa.entity.FaRevivalOfSickUnit;
import com.mapit.mpindustry.fa.entity.FaStartupBenefits;
import com.mapit.mpindustry.fa.entity.FaStartupDetails;
import com.mapit.mpindustry.fa.entity.FaStartupFundingAssis;
import com.mapit.mpindustry.fa.entity.FaStartupFundingAssisHistory;
import com.mapit.mpindustry.fa.entity.FaStartupFundingDetails;
import com.mapit.mpindustry.fa.entity.FaStartupIncubationDetails;
import com.mapit.mpindustry.fa.entity.FaStartupLeaseAssis;
import com.mapit.mpindustry.fa.entity.FaStartupPartners;
import com.mapit.mpindustry.fa.entity.FaStartupPatentAssis;
import com.mapit.mpindustry.fa.entity.FaStartupProductAssis;
import com.mapit.mpindustry.fa.entity.FaStartupRegistration;
import com.mapit.mpindustry.fa.entity.FaStartupWorkFlow;
import com.mapit.mpindustry.fa.entity.FaTextileUnit;
import com.mapit.mpindustry.fa.entity.FaWasteMgmtEstbExpComp;
import com.mapit.mpindustry.fa.entity.InfrastructreDevelopmentEntity;
import com.mapit.mpindustry.fa.entity.InfrastructureDocumentUpload;
import com.mapit.mpindustry.fa.entity.RequestGeneratorFA;
import com.mapit.mpindustry.fa.entity.RequestGeneratorFAApparel;
import com.mapit.mpindustry.fa.entity.RequestGeneratorFAUnit;
import com.mapit.mpindustry.fa.entity.StartupMasterAssistanceEntity;

import org.springframework.stereotype.Repository;
import com.mapit.mpindustry.fa.entity.ApplicantAssistance;
import com.mapit.mpindustry.fa.entity.UnitAddressDetails;
import com.mapit.mpindustry.common.entity.UserBankDetails;
import org.hibernate.type.StandardBasicTypes;

@Repository
// JAVA 21 / HIBERNATE 6 NOTE:
// Native COUNT(*) ka result type badal gaya hai -- Hibernate 5 me MySQL par
// BigInteger aata tha, Hibernate 6 me Long aata hai. Purana (BigInteger) cast
// isliye runtime par fail hota tha:
//   ClassCastException: class java.lang.Long cannot be cast to class java.math.BigInteger
// Ab Number use kiya gaya hai (Long, BigInteger, Integer -- sabka supertype),
// isliye driver/Hibernate jo bhi laute, intValue() chalta rahega.
public class FADaoImpl extends CommonDaoImpl implements FADao {

	public String generateFARequestId(long requestId) {

		Session session = getCurrentSession();

		RequestGeneratorFA requestGenerator = (RequestGeneratorFA) session.get(RequestGeneratorFA.class, requestId);

		if (requestGenerator == null) {

			RequestGeneratorFA generator = new RequestGeneratorFA();
			generator.setId(requestId);
			generator.setRequestCount(BigDecimal.ONE);
			session.persist(generator);

			return MPIndustryConstants.FA_APPLICATION_ID_PREFIX + requestId + 1;
		}

		int requestCount = requestGenerator.getRequestCount().intValue() + 1;

		requestGenerator.setRequestCount(BigDecimal.valueOf(requestCount));
		session.persist(requestGenerator);

		return MPIndustryConstants.FA_APPLICATION_ID_PREFIX + requestId + requestCount;

	}

	public String generateFAUnitRequestId(String requestId) {

		Session session = getCurrentSession();

		RequestGeneratorFAUnit requestGenerator = (RequestGeneratorFAUnit) session.get(RequestGeneratorFAUnit.class,
				requestId);

		if (requestGenerator == null) {

			RequestGeneratorFAUnit generator = new RequestGeneratorFAUnit();
			generator.setId(requestId);
			generator.setRequestCount(BigDecimal.ONE);
			session.persist(generator);

			return "0001";
		}
		int requestCount = requestGenerator.getRequestCount().intValue() + 1;

		String reqCount = "";
		requestGenerator.setRequestCount(BigDecimal.valueOf(requestCount));
		session.persist(requestGenerator);

		if (requestCount <= 9) {
			reqCount = "000" + requestCount;
		} else if (requestCount <= 99) {
			reqCount = "00" + requestCount;
		} else if (requestCount <= 999) {
			reqCount = "0" + requestCount;
		} else if (requestCount <= 9999) {
			// reqCount = "0" + requestCount;
			reqCount = String.valueOf(requestCount);
		}

		return reqCount;

	}

	public String generateFAApparelRequestId(String requestId) {
		Session session = getCurrentSession();

		RequestGeneratorFAApparel requestGenerator = (RequestGeneratorFAApparel) session
				.get(RequestGeneratorFAApparel.class, requestId);

		if (requestGenerator == null) {

			RequestGeneratorFAApparel generator = new RequestGeneratorFAApparel();
			generator.setId(requestId);
			generator.setRequestCount(BigDecimal.ONE);
			session.persist(generator);

			return "0001";
		}
		int requestCount = requestGenerator.getRequestCount().intValue() + 1;
		String reqCount = "";

		requestGenerator.setRequestCount(BigDecimal.valueOf(requestCount));
		session.persist(requestGenerator);

		if (requestCount <= 9) {
			reqCount = "000" + requestCount;
		} else if (requestCount <= 99) {
			reqCount = "00" + requestCount;
		} else if (requestCount <= 999) {
			reqCount = "0" + requestCount;
		} else if (requestCount <= 9999) {
			// reqCount = "0" + requestCount;
			reqCount = String.valueOf(requestCount);
		}

		return reqCount;

	}

	/**
	 * JAVA 21 / Hibernate 6: {@code Session.saveOrUpdate()} is deprecated for removal, so
	 * this uses the supported persist()/merge() pair. Same split (and same reasoning) as
	 * {@code CommonDaoImpl.saveOrUpdateEntity(Object)}:
	 *
	 * <ul>
	 * <li><b>already managed</b> - nothing to do; dirty checking flushes it at commit.</li>
	 * <li><b>transient (no id)</b> - persist() attaches THIS instance so a generated id is
	 * written back onto the caller's object, exactly as saveOrUpdate() did. This matters:
	 * several FAServiceImpl callers save a parent (e.g. incubationRegistration) and then
	 * read its id to link children. merge() would set the id on a copy and they would
	 * read null.</li>
	 * <li><b>detached (has id)</b> - merge() is the only non-deprecated option.</li>
	 * </ul>
	 */
	public void saveOrUpdate(Object obj) {
		Session session = getCurrentSession();
		Object id;
		try {
			if (session.contains(obj)) {
				return;
			}
			id = session.getSessionFactory().getPersistenceUnitUtil().getIdentifier(obj);
		} catch (IllegalArgumentException notAMappedEntity) {
			session.merge(obj);
			return;
		}
		if (id == null) {
			session.persist(obj);
		} else {
			session.merge(obj);
		}
	}

	public void save(Object obj) {

		Session session = getCurrentSession();

		session.persist(obj);

	}

	public Long saveDoc(FaDocumentUpload faDocumentUpload) {

		Session session = getCurrentSession();

		session.persist(faDocumentUpload);
		return faDocumentUpload.getDocumentId();

	}

	public Long saveDisbursement(FaDisbursementUpload faDisbursementUpload) {

		Session session = getCurrentSession();

		session.persist(faDisbursementUpload);
		return faDisbursementUpload.getDocumentId();

	}

	public void merge(Object obj) {

		Session session = getCurrentSession();

		session.merge(obj);

	}

	/*
	 * public FaMasterStatus findApplicantStatus(String status) {
	 * 
	 * Session session = getCurrentSession(); try {
	 * 
	 * Criteria criteria = session.createCriteria(MasterStatus.class);
	 * 
	 * criteria.add(Restrictions.eq("statusCode", status));
	 * 
	 * List result = criteria.getResultList();
	 * 
	 * return (FaMasterStatus) result.get(0); }
	 */
	public boolean checkFADocumentsDetail(String applicationId) {
		Session session = getCurrentSession();

		FaMsmeScheme applicant = (FaMsmeScheme) session.get(FaMsmeScheme.class, applicationId);
		Set<FaDocumentUpload> applicantDocuments = applicant.getFaDocumentUploadCollection();
		return !applicantDocuments.isEmpty();

	}

	public boolean checkFASchemesDetail(String applicationId) {
		Session session = getCurrentSession();

		FaMsmeScheme applicant = (FaMsmeScheme) session.get(FaMsmeScheme.class, applicationId);
		if (null != applicant.getUpdatedOn()) {
			return true;
		} else {
			return false;
		}

	}

	@Override
	public String fetchMobileNo(String applicationId) {
		Session session = getCurrentSession();
		String mobileNo = null;
		long startTime = System.currentTimeMillis();

		try {
			String sql = "SELECT APPLICANT_PHONENO FROM fa_msme_scheme WHERE application_id = :applicationId";
			NativeQuery<String> query = session.createNativeQuery(sql, String.class);
			query.setParameter("applicationId", applicationId);

			Object res = query.uniqueResult();
			if (res != null) {
				mobileNo = res.toString();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		long endTime = System.currentTimeMillis();
		return mobileNo;
	}

	//
	public FaMsmeScheme fetchFAApplicantDetail(String applicationId) {
		Session session = getCurrentSession();

		FaMsmeScheme applicant = (FaMsmeScheme) session.get(FaMsmeScheme.class, applicationId);
		return applicant;

	}
	/*
	 * @Override
	 * 
	 * @SuppressWarnings("unchecked")
	 * public FaMsmeScheme fetchFAApplicantDetail(String applicationId) {
	 * Session session = getCurrentSession();
	 * Transaction transaction = null;
	 * FaMsmeScheme result = null;
	 * long startTime = System.currentTimeMillis(); // Start timing
	 * 
	 * try {
	 * transaction = session.beginTransaction();
	 * //clearCache();
	 * // Using named parameters for clarity and security
	 * //String sql =
	 * "SELECT * FROM fa_msme_scheme WHERE application_id = :applicationId";
	 * String sql
	 * ="SELECT APPLICATION_ID,UNIT_OR_INST_NAME,MEMO_PART2_ACK_NO,MEMO_PART2_DATE,UNIT_TYPE,UNIT_ELECT_COMP_LOAD,UNIT_ELECT_COMP_NO,UNIT_ELECT_COMP_DATE,ESTABLISHMENT_TYPE,UNIT_START_DATE,UNIT_CAPITAL_INVESTMENT,\r\n"
	 * +
	 * "UNIT_TOTAL_EMPT_GEN,INST_ESTABLISHMENT_DATE,INST_TOTAL_TRAINEES_CAPACITY,STATUS,CREATED_ON,UPDATED_ON,CREATED_BY,UPDATED_BY,DISTRICT_ID,PHONENO,EMAIL,CATEGORY_ID,STATE,WOMEN_ENTREPRENEUR,\r\n"
	 * +
	 * "INDUSTRY_TYPE,EXPANSION,DIVERSIFICATION,TECHNICALUP,MAJOR_ACTIVITY,ACTIVITY_DETAILS,OLD_APPLICATION_ID,APPLICANT_EMAIL,APPLICANT_PHONENO,APPLICANT_STATE,APPLICANT_DISTRICT,\r\n"
	 * +
	 * "AUTHORISED_PERSON,firm_sector,firm_constitution,pan_document,udyam_document,tan_no,tan_document,gst_no,gst_document,cin,cin_document,industrial_area,plot_nos,\r\n"
	 * +
	 * "area_in_sqm,AUTHORISED_PERSON_LNAME,AUTHORISED_PERSON_FHNAME,UNIT_MP_EMPT_GEN,UNIT_MP_SC_EMPT_GEN,UNIT_MP_ST_EMPT_GEN,UNIT_MP_OBC_EMPT_GEN,gst_document,\r\n"
	 * +
	 * "gst_sell_document,permission_document,employment_given_document,submitted_on,pan_no\r\n"
	 * + "FROM fa_msme_scheme WHERE application_id ='"+applicationId+"'";
	 * // System.out.print(sql);
	 * NativeQuery query = session.createNativeQuery(sql);
	 * //query.setParameter("applicationId", applicationId);
	 * query.addEntity(FaMsmeScheme.class);
	 * 
	 * result = (FaMsmeScheme) query.uniqueResult();
	 * 
	 * // transaction.commit();
	 * } catch (Exception e) {
	 * if (transaction != null) {
	 * transaction.rollback();
	 * }
	 * e.printStackTrace();
	 * }
	 * 
	 * long endTime = System.currentTimeMillis(); // End timing
	 * // System.out.println("Query execution time: " + (endTime - startTime) +
	 * "ms");
	 * return result;
	 * }
	 */

	@Override
	public FaMsmeScheme fetchFaMsmeDetail(String applicationId) {
		Session session = getCurrentSession();
		FaMsmeScheme result = null;
		long startTime = System.currentTimeMillis();

		try {
			String sql = "SELECT APPLICATION_ID,UNIT_OR_INST_NAME,MEMO_PART2_ACK_NO,MEMO_PART2_DATE,UNIT_TYPE,UNIT_ELECT_COMP_LOAD,UNIT_ELECT_COMP_NO,UNIT_ELECT_COMP_DATE,ESTABLISHMENT_TYPE,UNIT_START_DATE,UNIT_CAPITAL_INVESTMENT,\r\n"
					+ "UNIT_TOTAL_EMPT_GEN,INST_ESTABLISHMENT_DATE,INST_TOTAL_TRAINEES_CAPACITY,STATUS,CREATED_ON,UPDATED_ON,CREATED_BY,UPDATED_BY,DISTRICT_ID,PHONENO,EMAIL,CATEGORY_ID,STATE,WOMEN_ENTREPRENEUR,\r\n"
					+ "INDUSTRY_TYPE,EXPANSION,DIVERSIFICATION,TECHNICALUP,MAJOR_ACTIVITY,ACTIVITY_DETAILS,OLD_APPLICATION_ID,APPLICANT_EMAIL,APPLICANT_PHONENO,APPLICANT_STATE,APPLICANT_DISTRICT,\r\n"
					+ "AUTHORISED_PERSON,firm_sector,firm_constitution,pan_document,udyam_document,tan_no,tan_document,gst_no,gst_document,cin,cin_document,industrial_area,plot_nos,\r\n"
					+ "area_in_sqm,AUTHORISED_PERSON_LNAME,AUTHORISED_PERSON_FHNAME,UNIT_MP_EMPT_GEN,UNIT_MP_SC_EMPT_GEN,UNIT_MP_ST_EMPT_GEN,UNIT_MP_OBC_EMPT_GEN,gst_document,\r\n"
					+ "gst_sell_document,permission_document,employment_given_document,submitted_on,pan_no\r\n"
					+ "FROM fa_msme_scheme WHERE application_id ='" + applicationId + "'";
			NativeQuery<FaMsmeScheme> query = session.createNativeQuery(sql, FaMsmeScheme.class);

			result = query.uniqueResult();
		} catch (Exception e) {
			e.printStackTrace();
		}

		long endTime = System.currentTimeMillis();
		return result;
	}

	public List<FaDisbursementCalculator> fetchFADisbursementCalculator(String applicationId) {
		Session session = getCurrentSession();
		LocalDate today = LocalDate.now();
		Date startDate = java.sql.Date.valueOf(today.atStartOfDay().toLocalDate());
		Date endDate = java.sql.Date.valueOf(today.plusDays(1).atStartOfDay().toLocalDate());

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaDisbursementCalculator> cq = cb.createQuery(FaDisbursementCalculator.class);
		Root<FaDisbursementCalculator> root = cq.from(FaDisbursementCalculator.class);

		Predicate predicate = cb.and(
				cb.greaterThanOrEqualTo(root.get("createdOn"), startDate),
				cb.lessThan(root.get("createdOn"), endDate));
		cq.where(predicate);

		return session.createQuery(cq).getResultList();
	}

	public List<FaDisbursementCalculator> fetchFADisbursementCalculatorPrint(String today) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaDisbursementCalculator> cq = cb.createQuery(FaDisbursementCalculator.class);
		Root<FaDisbursementCalculator> root = cq.from(FaDisbursementCalculator.class);

		cq.where(cb.equal(root.get("createdOn"), today));

		return session.createQuery(cq).getResultList();
	}

	public List<FaDisbursementUpload> fetchDisbursementUploads(String applicationId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaDisbursementUpload> cq = cb.createQuery(FaDisbursementUpload.class);
		Root<FaDisbursementUpload> root = cq.from(FaDisbursementUpload.class);

		cq.where(cb.equal(root.get("applicationId"), applicationId));

		return session.createQuery(cq).getResultList();
	}

	// @SuppressWarnings("rawtypes")
	// public boolean checkApplicantDetail(String username, String
	// establishmentType) {
	//
	// Session session = getCurrentSession();
	// try {
	//
	// Criteria criteria = session.createCriteria(FaMsmeScheme.class);
	//
	// criteria.add(Restrictions.and(Restrictions.eq("createdBy.userId", username),
	// Restrictions.eq("establishmentType", establishmentType)));
	//
	// List records = criteria.getResultList();
	//
	// return !records.isEmpty();
	//
	// }
	// }

	@SuppressWarnings("rawtypes")
	public boolean checkApplicantDetail(String username, String establishmentType) {
		Session session = getCurrentSession();

		NativeQuery<Number> query = session
				.createNativeQuery(" SELECT count(*)  FROM fa_msme_scheme  WHERE CREATED_BY ='" + username
						+ "' AND ESTABLISHMENT_TYPE = '" + establishmentType + "'", Number.class);

		Number count = query.uniqueResult();
		int rowCount = count.intValue();
		if (rowCount > 0) {

			return true;
		} else {
			return false;
		}

	}

	public List<FaMsmeScheme> fetchFAApplicantsListPageWise(String username, String establishmentType,
			Integer firstResult, Integer pageDisplayLength, String colDir, String colName, String searchParameter) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMsmeScheme> cq = cb.createQuery(FaMsmeScheme.class);
		Root<FaMsmeScheme> root = cq.from(FaMsmeScheme.class);

		Predicate predicate = cb.and(
				cb.equal(root.get("createdBy").get("userId"), username),
				cb.equal(root.get("establishmentType"), establishmentType));

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter + "%";
			predicate = cb.and(predicate, cb.or(
					cb.like(root.get("applicationId"), pattern),
					cb.like(root.get("establishmentType"), pattern)));
		}

		cq.where(predicate);
		cq.orderBy(cb.desc(root.get("createdOn")));

		return session.createQuery(cq)
				.setFirstResult(firstResult)
				.setMaxResults(pageDisplayLength)
				.getResultList();
	}

	// new query for financial assistance at applicant login
	@SuppressWarnings("unchecked")
	public List<FaNewMsmeBean> fetchFAApplicantsListPageWiseNew(String username, String establishmentType,
			Integer firstResult, Integer pageDisplayLength, SortFieldBean sortField, String searchParameter) {

		Session session = getCurrentSession();
		String sql1 = "";

		if (null != searchParameter && searchParameter != "") {
			sql1 = " and (schm.APPLICATION_ID like '" + searchParameter + "'";
			sql1 += " or schm.UNIT_OR_INST_NAME like trim('%" + searchParameter + "%'))";
		}
		String sql = "select distinct schm.APPLICATION_ID as applicationId,schm.DISTRICT_ID as districtId, date_format(schm.submitted_on,'%d-%m-%Y') as submittedOn"
				+ ",schm.UNIT_OR_INST_NAME as unitOrInstName,schm.STATUS as currentStatusId,schm.UNIT_TYPE as unitType,schm.MEMO_PART2_ACK_NO as memoPart2AckNo\r\n"
				+ ",schm.CREATED_ON as createdOn\r\n"
				+ ", (case when cap.APPLICATION_ID is null then  0 else 1 end) as selectfa1,(case when infra.APPLICATION_ID is null then  0 else 1 end) as selectfa2,\r\n"
				+ " (case when waste.APPLICATION_ID is null then  0 else 1 end) as selectfa3,(case when elec.APPLICATION_ID is null then  0 else 1 end) as selectfa4,\r\n"
				+ " (case when tax.APPLICATION_ID is null then  0 else 1 end) as selectfa5,(case when mandi.APPLICATION_ID is null then  0 else 1 end) as selectfa6,\r\n"
				+ " (case when vat.APPLICATION_ID is null then  0 else 1 end) as selectfa7,(case when inst.APPLICATION_ID is null then  0 else 1 end) as selectfa8"
				+ ",  stat.STATUS_DESCRIPTION as status, schm.ESTABLISHMENT_TYPE as establishmentType"
				+ " from fa_msme_scheme schm \r\n"
				+ "left join fa_capital_assistance cap on schm.APPLICATION_ID=cap.APPLICATION_ID\r\n"
				+ "left join fa_infra_dev_exp_compensation infra on schm.APPLICATION_ID=infra.APPLICATION_ID\r\n"
				+ "left join fa_waste_mgmt_estb_exp_comp waste on schm.APPLICATION_ID=waste.APPLICATION_ID\r\n"
				+ "left join fa_electricity_fee_exemption elec on schm.APPLICATION_ID=elec.APPLICATION_ID\r\n"
				+ "left join fa_entry_tax_exemption_concess tax on schm.APPLICATION_ID=tax.APPLICATION_ID\r\n"
				+ "left join fa_mandi_fee_exemption mandi on schm.APPLICATION_ID=mandi.APPLICATION_ID\r\n"
				+ "left join fa_vat_cst_compensation vat on schm.APPLICATION_ID=vat.APPLICATION_ID\r\n"
				+ "left join fa_inst_estab_assistance inst on schm.APPLICATION_ID=inst.APPLICATION_ID\r\n"
				+ "left join fa_master_status stat  on schm.STATUS= stat.MASTER_STATUS_ID\r\n"
				+ "where \r\n"
				+ "schm.CREATED_BY='" + username + "' and ESTABLISHMENT_TYPE='" + establishmentType + "'"
				+ sql1
				+ " order by schm.CREATED_ON desc";
		Integer min_val = firstResult;
		Integer max_val = pageDisplayLength;
		sql += " limit " + min_val + ", " + max_val;

		NativeQuery<Tuple> query = session.createNativeQuery(sql, Tuple.class);

		List<Tuple> results = query.getResultList();
		List<FaNewMsmeBean> beans = new java.util.ArrayList<>();

		for (Tuple row : results) {
			FaNewMsmeBean bean = new FaNewMsmeBean();
			bean.setDistrictId(((Number) row.get("districtId")).longValue());
			bean.setApplicationId((String) row.get("applicationId"));
			bean.setSubmittedOn((String) row.get("submittedOn"));
			bean.setUnitOrInstName((String) row.get("unitOrInstName"));
			bean.setCurrentStatusId(((Number) row.get("currentStatusId")).longValue());
			bean.setUnitType((String) row.get("unitType"));
			bean.setMemoPart2AckNo((String) row.get("memoPart2AckNo"));
			bean.setSelectFa1(((Number) row.get("selectfa1")).intValue() == 1);
			bean.setSelectFa2(((Number) row.get("selectfa2")).intValue() == 1);
			bean.setSelectFa3(((Number) row.get("selectfa3")).intValue() == 1);
			bean.setSelectFa4(((Number) row.get("selectfa4")).intValue() == 1);
			bean.setSelectFa5(((Number) row.get("selectfa5")).intValue() == 1);
			bean.setSelectFa6(((Number) row.get("selectfa6")).intValue() == 1);
			bean.setSelectFa7(((Number) row.get("selectfa7")).intValue() == 1);
			bean.setSelectFa8(((Number) row.get("selectfa8")).intValue() == 1);
			bean.setStatus((String) row.get("status"));
			bean.setEstablishmentType((String) row.get("establishmentType"));
			beans.add(bean);
		}

		return beans;

	}

	// using stored procedure
	/*
	 * public List<FaNewMsmeBean> fetchFAApplicantsListPageWiseNew(String username,
	 * String establishmentType,
	 * Integer firstResult, Integer pageDisplayLength, SortFieldBean sortField,
	 * String searchParameter) {
	 * Session session = getCurrentSession();
	 * 
	 * try {
	 * String sql = "{CALL GetApplicationDetails(?, ?, ?,?)}";
	 * 
	 * Query query = session.createNativeQuery(sql)
	 * .addScalar("applicationId", String.class)
	 * .addScalar("districtId", Long.class)
	 * .addScalar("submittedOn", String.class)
	 * .addScalar("unitOrInstName", String.class)
	 * .addScalar("currentStatusId", Long.class)
	 * .addScalar("unitType", String.class)
	 * .addScalar("memoPart2AckNo", String.class)
	 * .addScalar("selectFa1", Boolean.class) // BOOLEAN in MySQL is
	 * typically 1 or 0, use INTEGER
	 * .addScalar("selectFa2", Boolean.class)
	 * .addScalar("selectFa3", Boolean.class)
	 * .addScalar("selectFa4", Boolean.class)
	 * .addScalar("selectFa5", Boolean.class)
	 * .addScalar("selectFa6", Boolean.class)
	 * .addScalar("selectFa7", Boolean.class)
	 * .addScalar("selectFa8", Boolean.class)
	 * .addScalar("status", String.class)
	 * .addScalar("establishmentType", String.class)
	 * .setParameter(0, username)
	 * .setParameter(1, establishmentType)
	 * .setParameter(2, firstResult)
	 * .setParameter(3, pageDisplayLength);
	 * 
	 * query.setResultTransformer(Transformers.aliasToBean(FaNewMsmeBean.class));
	 * 
	 * return (List<FaNewMsmeBean>) query.getResultList();
	 * }
	 * }
	 */

	@SuppressWarnings("unchecked")
	@Override
	public FaSchemeCapitalInvestmentBean fetchInvestmentAmount(String applicationId) {
		Session session = getCurrentSession();

		FaSchemeCapitalInvestmentBean result = null;

		try {

			// Using named parameters for clarity and security
			String sql = "select INVESTMENT_NAME as investmentName,amount as amount from fa_scheme_capital_investment WHERE application_id = :applicationId and INVESTMENT_NAME='Plant & Machinery' order by created_on desc";
			NativeQuery<Object[]> query = session.createNativeQuery(sql, Object[].class);
			query.setParameter("applicationId", applicationId);

			List<Object[]> list = query.getResultList();

			if (!list.isEmpty()) {
				Object[] row = list.get(0);
				result = new FaSchemeCapitalInvestmentBean();
				result.setInvestmentName((String) row[0]);
				// result.setAmount((String) row[1]);
				BigDecimal amount = (BigDecimal) row[1];
				result.setAmount(amount != null ? amount.toString() : null);
			}

		} catch (Exception e) {

			e.printStackTrace();
		}

		return result;
	}

	public List<FAApplicantBean> fetchFAApplicantsBeanListPageWise(String username, String establishmentType,
			Integer firstResult, Integer pageDisplayLength, String colDir, String colName, String searchParameter) {
		Session session = getCurrentSession();

		String applicationId = "%" + "" + "%";
		if (StringUtils.isNotBlank(searchParameter)) {
			applicationId = "%" + searchParameter + "%";
		}

		NativeQuery<Object[]> query = session.createNativeQuery(
				"SELECT APPLICATION_ID, DATE_FORMAT(submitted_on, '%d/%m/%Y %T %p'), ESTABLISHMENT_TYPE, UNIT_OR_INST_NAME, STATUS_DESCRIPTION from fa_msme_scheme inner join fa_master_status on MASTER_STATUS_ID=STATUS where created_by=COALESCE(:createdBy, CREATED_BY) and ESTABLISHMENT_TYPE=COALESCE(:establishmentType, ESTABLISHMENT_TYPE) and APPLICATION_ID like :applicationId and status>0 order by created_on desc limit :firstResult, :pageDisplayLength",
				Object[].class)
				.setParameter("createdBy", username)
				.setParameter("establishmentType", establishmentType)
				.setParameter("applicationId", applicationId)
				.setParameter("firstResult", firstResult)
				.setParameter("pageDisplayLength", pageDisplayLength);

		List<Object[]> results = query.getResultList();
		List<FAApplicantBean> beans = new java.util.ArrayList<>();

		for (Object[] row : results) {
			FAApplicantBean bean = new FAApplicantBean();
			bean.setApplicationId((String) row[0]);
			bean.setSubmittedOn((String) row[1]);
			bean.setEstablishmentType((String) row[2]);
			bean.setUnitOrInstName((String) row[3]);
			bean.setStatus((String) row[4]);
			beans.add(bean);
		}

		return beans;
	}
	
	public Integer fetchFAMsmeApplicantsCountPageWise(
	        String username,
	        String establishmentType,
	        String searchParameter) {

	    Session session = getCurrentSession();

	    String applicationId = "%";
	    String unitOrInstName = "%";

	    if (StringUtils.isNotBlank(searchParameter)) {
	        applicationId = "%" + searchParameter + "%";
	        unitOrInstName = "%" + searchParameter + "%";
	    }

	    String sql = """
	            SELECT COUNT(*)
	            FROM fa_msme_scheme
	            INNER JOIN fa_master_status
	                ON MASTER_STATUS_ID = STATUS
	            WHERE created_by = COALESCE(:createdBy, CREATED_BY)
	              AND ESTABLISHMENT_TYPE =
	                  COALESCE(:establishmentType, ESTABLISHMENT_TYPE)
	              AND (
	                    APPLICATION_ID LIKE :applicationId
	                    OR UNIT_OR_INST_NAME LIKE :unitOrInstName
	                  )
	              AND status > 0
	            """;

	    NativeQuery<Long> query = session.createNativeQuery(sql, Long.class); // JAVA 21: typed createNativeQuery (COUNT -> Long)

	    query.setParameter("createdBy", username);
	    query.setParameter("establishmentType", establishmentType);
	    query.setParameter("applicationId", applicationId);
	    query.setParameter("unitOrInstName", unitOrInstName);

	    Object result = query.uniqueResult();

	    return ((Number) result).intValue();
	}

	/*
	 * public Integer fetchFAMsmeApplicantsCountPageWise(String username, String
	 * establishmentType, String searchParameter) { Session session =
	 * getCurrentSession();
	 * 
	 * String applicationId = "%" + "" + "%"; String unitOrInstName = "%" + "" +
	 * "%"; if (StringUtils.isNotBlank(searchParameter)) { applicationId = "%" +
	 * searchParameter + "%"; unitOrInstName = "%" + searchParameter + "%"; }
	 * NativeQuery<Number> query = session.createNativeQuery(
	 * "SELECT count(*) from fa_msme_scheme inner join fa_master_status on MASTER_STATUS_ID=STATUS where created_by=COALESCE(:createdBy, CREATED_BY) and ESTABLISHMENT_TYPE=COALESCE(:establishmentType, ESTABLISHMENT_TYPE) and (APPLICATION_ID like :applicationId or UNIT_OR_INST_NAME like :unitOrInstName) and status>0"
	 * , Number.class) .setParameter("createdBy", username)
	 * .setParameter("establishmentType", establishmentType)
	 * .setParameter("applicationId", applicationId) .setParameter("unitOrInstName",
	 * unitOrInstName); Number bi = query.uniqueResult(); return bi.intValue();
	 * 
	 * }
	 */

	// Added by Eshan(Intern)
	public List<FaStartupDetails> fetchFAStartupDetailList(String username, String searchParameter) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupDetails> cq = cb.createQuery(FaStartupDetails.class);
		Root<FaStartupDetails> root = cq.from(FaStartupDetails.class);

		Predicate predicate;
		if (StringUtils.isNotBlank(username)) {
			predicate = cb.equal(root.get("createdBy").get("userId"), username);
		} else {
			predicate = cb.notEqual(root.get("status").get("statusId"), 1L);
		}

		predicate = cb.and(predicate,
				cb.notEqual(root.get("status").get("statusId"), 0L),
				cb.notEqual(root.get("status").get("statusId"), 5L));

		if (StringUtils.isNotBlank(searchParameter)) {
			predicate = cb.and(predicate, cb.like(root.get("nameOfEntity"), searchParameter + "%"));
		}

		cq.where(predicate);
		cq.orderBy(cb.desc(root.get("createdOn")));

		return session.createQuery(cq).getResultList();
	}

	public List<FaIncubatorDetails> fetchFAIncubatorDetailList(String username, String searchParameter) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubatorDetails> cq = cb.createQuery(FaIncubatorDetails.class);
		Root<FaIncubatorDetails> root = cq.from(FaIncubatorDetails.class);

		Predicate predicate;
		if (StringUtils.isNotBlank(username)) {
			predicate = cb.equal(root.get("createdBy").get("userId"), username);
		} else {
			predicate = cb.notEqual(root.get("status").get("statusId"), 1L);
		}

		predicate = cb.and(predicate, cb.notEqual(root.get("status").get("statusId"), 0L));

		cq.where(predicate);
		cq.orderBy(cb.desc(root.get("createdOn")));

		return session.createQuery(cq).getResultList();
	}

	public List<FaMsmeScheme> fetchFAApplicantDetailList(String username, String establishmentType,
			String searchParameter) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMsmeScheme> cq = cb.createQuery(FaMsmeScheme.class);
		Root<FaMsmeScheme> root = cq.from(FaMsmeScheme.class);

		Predicate predicate = cb.and(
				cb.equal(root.get("createdBy").get("userId"), username),
				cb.equal(root.get("establishmentType"), establishmentType));

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter + "%";
			predicate = cb.and(predicate, cb.or(
					cb.like(root.get("applicationId"), pattern),
					cb.like(root.get("establishmentType"), pattern)));
		}

		cq.where(predicate);

		return session.createQuery(cq).getResultList();
	}

	public List<FaRequestProcess> fetchHistory(String applicationId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaRequestProcess> cq = cb.createQuery(FaRequestProcess.class);
		Root<FaRequestProcess> root = cq.from(FaRequestProcess.class);

		cq.where(cb.equal(root.get("faMsmeScheme").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdDate")));

		return session.createQuery(cq).getResultList();
	}

	public CommonAddress fetchAddressByApplicationIdAndType(String applicationId, String type) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<CommonAddress> cq = cb.createQuery(CommonAddress.class);
		Root<CommonAddress> root = cq.from(CommonAddress.class);

		Predicate predicate = cb.and(
				cb.equal(root.get("commonAddressPK").get("applicationId"), applicationId),
				cb.equal(root.get("commonAddressPK").get("type"), type));
		cq.where(predicate);

		List<CommonAddress> result = session.createQuery(cq).getResultList();

		return result.isEmpty() ? null : result.get(0);
	}

	@SuppressWarnings("unchecked")
	public List<FaMsmeScheme> fetchPendingSchemePageWiseNew(long districtId, String establishmentType,
			Integer firstResult,
			Integer pageDisplayLength, SortFieldBean sortField, String searchParameter, String username) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMsmeScheme> cq = cb.createQuery(FaMsmeScheme.class);
		Root<FaMsmeScheme> root = cq.from(FaMsmeScheme.class);
		Join<Object, Object> statusJoin = root.join("status");

		Predicate predicate;
		if (districtId == 420) {
			if (username.equals("gmimalbhi-mp@mp.nic.in")) {
				predicate = cb.and(
					cb.equal(root.get("districtId"), 420L),
					cb.greaterThanOrEqualTo(statusJoin.get("masterStatusId"), MPIndustryConstants.STATUS_SUBMITTED),
					cb.equal(root.get("establishmentType"), establishmentType)
				);
			} else {
				predicate = cb.and(
					cb.equal(root.get("districtId"), districtId),
					cb.greaterThanOrEqualTo(statusJoin.get("masterStatusId"), MPIndustryConstants.STATUS_SUBMITTED),
					cb.equal(root.get("establishmentType"), establishmentType)
				);
			}
		} else {
			predicate = cb.and(
				cb.equal(root.get("districtId"), districtId),
				cb.greaterThanOrEqualTo(statusJoin.get("masterStatusId"), MPIndustryConstants.STATUS_SUBMITTED),
				cb.equal(root.get("establishmentType"), establishmentType)
			);
		}

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter + "%";
			predicate = cb.and(predicate, cb.or(
				cb.like(root.get("applicationId"), pattern),
				cb.like(root.get("unitOrInstName"), pattern)
			));
		}

		cq.where(predicate);
		cq.orderBy(cb.asc(root.get("createdOn")));

		return session.createQuery(cq)
				.setFirstResult(firstResult)
				.setMaxResults(pageDisplayLength)
				.getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<FaMsmeScheme> fetchPendingSchemePageWise(long districtId, String establishmentType, Integer firstResult,
			Integer pageDisplayLength, SortFieldBean sortField, String searchParameter) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMsmeScheme> cq = cb.createQuery(FaMsmeScheme.class);
		Root<FaMsmeScheme> root = cq.from(FaMsmeScheme.class);
		Join<Object, Object> statusJoin = root.join("status");

		Predicate predicate = cb.and(
				cb.equal(root.get("districtId"), districtId),
				cb.greaterThanOrEqualTo(statusJoin.get("masterStatusId"), MPIndustryConstants.STATUS_SUBMITTED),
				cb.equal(root.get("establishmentType"), establishmentType));

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter + "%";
			predicate = cb.and(predicate, cb.or(
					cb.like(root.get("applicationId"), pattern),
					cb.like(root.get("unitOrInstName"), pattern)));
		}

		cq.where(predicate);
		cq.orderBy(cb.asc(root.get("createdOn")));

		return session.createQuery(cq)
				.setFirstResult(firstResult)
				.setMaxResults(pageDisplayLength)
				.getResultList();
	}

	/// new query to fetch records
	@SuppressWarnings("unchecked")
	public List<FaNewMsmeBean> fetchPendingSchemePageWiseNew(long districtId, String establishmentType,
			Integer firstResult,
			Integer pageDisplayLength, SortFieldBean sortField, String searchParameter) {
		Session session = getCurrentSession();

		/*
		 * String sql =
		 * "select distinct d.DISTRICT_ID as districtId,d.DISTRICT_NAME as districtName,coalesce(count(o.APPLICATION_ID),0) as applicationId,SUM(CASE WHEN status=1 THEN 1 ELSE 0 END ) as status1,sum(case when status = 2 then 1 else 0 end) as status2,"
		 * +
		 * "sum(case when status = 3 then  1 else 0 end) as status3,sum(case when status = 4 then 1 else 0 end) as status4,sum(case when status = 5 then 1 else 0 end) as status5,"
		 * +
		 * "sum(case when status = 6 then 1 else 0 end) as status6,sum(case when status = 7 then 1 else 0 end) as status7,sum(case when status = 8 then 1 else 0 end) as status8,"
		 * + "sum(case when status = 9 then 1 else 0 end) as status9,"
		 * + "sum(case when status = 10 then 1 else 0 end) as status10,"
		 * + "sum(case when status = 11 then 1 else 0 end) as status11,"
		 * + "sum(case when status = 12 then 1 else 0 end) as status12 " +
		 * " from master_districts d "
		 * + " left join fa_msme_scheme o on d.DISTRICT_ID=o.DISTRICT_ID "
		 * + " left join  fa_msme_detail fd on o.APPLICATION_ID=fd.APPLICATION_ID "
		 * +
		 * " left join fa_disbursement_save fds on o.APPLICATION_ID=fds.application_id"
		 * + " where STATE_ID=20 ";
		 */
		String sql1 = "";
		if (null != searchParameter && !searchParameter.equals("")) { // âœ… safer string check
			sql1 = " and (schm.APPLICATION_ID like '" + searchParameter + "'";
			sql1 += " or schm.UNIT_OR_INST_NAME like trim('%" + searchParameter + "%'))";
		}

		String sql = "select distinct schm.APPLICATION_ID as applicationId,"
				+ " schm.DISTRICT_ID as districtId,"
				+ " date_format(schm.CREATED_ON,'%d-%m-%Y') as applicationDate,"
				+ " schm.CREATED_ON as createdOn,"
				+ " schm.CREATED_BY AS createdBy,"
				+ " schm.UNIT_OR_INST_NAME as unitOrInstName,"
				+ " schm.STATUS as currentStatusId,"
				+ " schm.UNIT_TYPE as unitType,"
				+ " schm.MEMO_PART2_ACK_NO as memoPart2AckNo,"
				+ " (case when cap.APPLICATION_ID is null then 0 else 1 end) as selectfa1,"
				+ " (case when infra.APPLICATION_ID is null then 0 else 1 end) as selectfa2,"
				+ " (case when waste.APPLICATION_ID is null then 0 else 1 end) as selectfa3,"
				+ " (case when elec.APPLICATION_ID is null then 0 else 1 end) as selectfa4,"
				+ " (case when tax.APPLICATION_ID is null then 0 else 1 end) as selectfa5,"
				+ " (case when mandi.APPLICATION_ID is null then 0 else 1 end) as selectfa6,"
				+ " (case when vat.APPLICATION_ID is null then 0 else 1 end) as selectfa7,"
				+ " (case when inst.APPLICATION_ID is null then 0 else 1 end) as selectfa8,"
				+ " stat.STATUS_DESCRIPTION as status "
				+ " from fa_msme_scheme schm "
				+ " left join fa_capital_assistance cap on schm.APPLICATION_ID=cap.APPLICATION_ID"
				+ " left join fa_infra_dev_exp_compensation infra on schm.APPLICATION_ID=infra.APPLICATION_ID"
				+ " left join fa_waste_mgmt_estb_exp_comp waste on schm.APPLICATION_ID=waste.APPLICATION_ID"
				+ " left join fa_electricity_fee_exemption elec on schm.APPLICATION_ID=elec.APPLICATION_ID"
				+ " left join fa_entry_tax_exemption_concess tax on schm.APPLICATION_ID=tax.APPLICATION_ID"
				+ " left join fa_mandi_fee_exemption mandi on schm.APPLICATION_ID=mandi.APPLICATION_ID"
				+ " left join fa_vat_cst_compensation vat on schm.APPLICATION_ID=vat.APPLICATION_ID"
				+ " left join fa_inst_estab_assistance inst on schm.APPLICATION_ID=inst.APPLICATION_ID"
				+ " left join fa_master_status stat on schm.STATUS= stat.MASTER_STATUS_ID"
				+ " left join fa_scheme_capital_investment invest on schm.APPLICATION_ID=invest.APPLICATION_ID"
				+ " where schm.DISTRICT_ID=" + districtId
				+ " and schm.STATUS>=2"
				+ " and schm.ESTABLISHMENT_TYPE='" + establishmentType + "'"
				+ " and invest.AMOUNT <= 100000000"
				+ " and invest.INVESTMENT_NAME='Plant & Machinery'"
				+ sql1
				+ " order by schm.CREATED_ON desc";

		Integer min_val = firstResult;
		Integer max_val = pageDisplayLength;
		sql += " limit " + min_val + ", " + max_val;

		// System.out.println(sql);
		NativeQuery<Tuple> query = session.createNativeQuery(sql, Tuple.class);
		List<Tuple> results = query.getResultList();
		List<FaNewMsmeBean> beans = new java.util.ArrayList<>();

		for (Tuple row : results) {
			FaNewMsmeBean bean = new FaNewMsmeBean();
			bean.setDistrictId(((Number) row.get("districtId")).longValue());
			bean.setApplicationId((String) row.get("applicationId"));
			bean.setApplicationDate((String) row.get("applicationDate"));
			bean.setUnitOrInstName((String) row.get("unitOrInstName"));
			bean.setCurrentStatusId(((Number) row.get("currentStatusId")).longValue());
			bean.setUnitType((String) row.get("unitType"));
			bean.setMemoPart2AckNo((String) row.get("memoPart2AckNo"));
			bean.setSelectFa1(((Number) row.get("selectFa1")).intValue() == 1);
			bean.setSelectFa2(((Number) row.get("selectFa2")).intValue() == 1);
			bean.setSelectFa3(((Number) row.get("selectFa3")).intValue() == 1);
			bean.setSelectFa4(((Number) row.get("selectFa4")).intValue() == 1);
			bean.setSelectFa5(((Number) row.get("selectFa5")).intValue() == 1);
			bean.setSelectFa6(((Number) row.get("selectFa6")).intValue() == 1);
			bean.setSelectFa7(((Number) row.get("selectFa7")).intValue() == 1);
			bean.setSelectFa8(((Number) row.get("selectFa8")).intValue() == 1);
			bean.setStatus((String) row.get("status"));
			bean.setCreatedBy((String) row.get("createdBy"));
			beans.add(bean);
		}

		return beans;

	}

	// for investment more than 10Cr
	public List<FaNewMsmeBean> fetchTenCrPendingSchemePageWiseNew(long districtId, String establishmentType,
			Integer firstResult,
			Integer pageDisplayLength, SortFieldBean sortField, String searchParameter) {
		Session session = getCurrentSession();

		String sql = "select distinct schm.APPLICATION_ID as applicationId,schm.DISTRICT_ID as districtId, date_format(schm.CREATED_ON,'%d-%m-%Y') as applicationDate"
				+ ",schm.UNIT_OR_INST_NAME as unitOrInstName,schm.STATUS as currentStatusId,schm.UNIT_TYPE as unitType,schm.MEMO_PART2_ACK_NO as memoPart2AckNo\r\n"
				+ ", (case when cap.APPLICATION_ID is null then  0 else 1 end) as selectfa1,(case when infra.APPLICATION_ID is null then  0 else 1 end) as selectfa2,\r\n"
				+ " (case when waste.APPLICATION_ID is null then  0 else 1 end) as selectfa3,(case when elec.APPLICATION_ID is null then  0 else 1 end) as selectfa4,\r\n"
				+ " (case when tax.APPLICATION_ID is null then  0 else 1 end) as selectfa5,(case when mandi.APPLICATION_ID is null then  0 else 1 end) as selectfa6,\r\n"
				+ " (case when vat.APPLICATION_ID is null then  0 else 1 end) as selectfa7,(case when inst.APPLICATION_ID is null then  0 else 1 end) as selectfa8"
				+ ",  stat.STATUS_DESCRIPTION as status "
				+ " from fa_msme_scheme schm \r\n"
				+ "left join fa_capital_assistance cap on schm.APPLICATION_ID=cap.APPLICATION_ID\r\n"
				+ "left join fa_infra_dev_exp_compensation infra on schm.APPLICATION_ID=infra.APPLICATION_ID\r\n"
				+ "left join fa_waste_mgmt_estb_exp_comp waste on schm.APPLICATION_ID=waste.APPLICATION_ID\r\n"
				+ "left join fa_electricity_fee_exemption elec on schm.APPLICATION_ID=elec.APPLICATION_ID\r\n"
				+ "left join fa_entry_tax_exemption_concess tax on schm.APPLICATION_ID=tax.APPLICATION_ID\r\n"
				+ "left join fa_mandi_fee_exemption mandi on schm.APPLICATION_ID=mandi.APPLICATION_ID\r\n"
				+ "left join fa_vat_cst_compensation vat on schm.APPLICATION_ID=vat.APPLICATION_ID\r\n"
				+ "left join fa_inst_estab_assistance inst on schm.APPLICATION_ID=inst.APPLICATION_ID\r\n"
				+ "left join fa_master_status stat  on schm.STATUS= stat.MASTER_STATUS_ID\r\n"
				+ " left join fa_scheme_capital_investment invest on schm.APPLICATION_ID=invest.APPLICATION_ID "
				+ " where \r\n"
				+ " STATUS>=2 and ESTABLISHMENT_TYPE='" + establishmentType + "'"
				+ " and invest.AMOUNT > 100000000 and invest.INVESTMENT_NAME='Plant & Machinery'"
				+ " and schm.CREATED_ON >= '2025-07-15'"
				+ " order by schm.CREATED_ON desc";
		Integer min_val = firstResult;
		Integer max_val = pageDisplayLength;
		sql += " limit " + min_val + ", " + max_val;

		// System.out.println(sql);
		NativeQuery<Tuple> query = session.createNativeQuery(sql, Tuple.class);
		List<Tuple> results = query.getResultList();
		List<FaNewMsmeBean> beans = new java.util.ArrayList<>();

		for (Tuple row : results) {
			FaNewMsmeBean bean = new FaNewMsmeBean();
			// Legacy applications may not have a district assigned yet.
			Number districtIdValue = (Number) row.get("districtId");
			bean.setDistrictId(districtIdValue == null ? null : districtIdValue.longValue());
			bean.setApplicationId((String) row.get("applicationId"));
			bean.setApplicationDate((String) row.get("applicationDate"));
			bean.setUnitOrInstName((String) row.get("unitOrInstName"));
			bean.setCurrentStatusId(((Number) row.get("currentStatusId")).longValue());
			bean.setUnitType((String) row.get("unitType"));
			bean.setMemoPart2AckNo((String) row.get("memoPart2AckNo"));
			bean.setSelectFa1(((Number) row.get("selectFa1")).intValue() == 1);
			bean.setSelectFa2(((Number) row.get("selectFa2")).intValue() == 1);
			bean.setSelectFa3(((Number) row.get("selectFa3")).intValue() == 1);
			bean.setSelectFa4(((Number) row.get("selectFa4")).intValue() == 1);
			bean.setSelectFa5(((Number) row.get("selectFa5")).intValue() == 1);
			bean.setSelectFa6(((Number) row.get("selectFa6")).intValue() == 1);
			bean.setSelectFa7(((Number) row.get("selectFa7")).intValue() == 1);
			bean.setSelectFa8(((Number) row.get("selectFa8")).intValue() == 1);
			bean.setStatus((String) row.get("status"));
			beans.add(bean);
		}

		return beans;

	}

	///
	public Integer fetchPendingSchemeCount(long districtId, String establishmentType, String searchParameter) {

		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<Long> cq = cb.createQuery(Long.class);
		Root<FaMsmeScheme> root = cq.from(FaMsmeScheme.class);
		Join<Object, Object> statusJoin = root.join("status");

		cq.select(cb.count(root));

		Predicate predicate = cb.and(
				cb.equal(root.get("districtId"), districtId),
				cb.greaterThanOrEqualTo(statusJoin.get("masterStatusId"), MPIndustryConstants.STATUS_SUBMITTED),
				cb.equal(root.get("establishmentType"), establishmentType));

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter + "%";
			predicate = cb.and(predicate, cb.or(
					cb.like(root.get("applicationId"), pattern),
					cb.like(root.get("unitOrInstName"), pattern)));
		}

		cq.where(predicate);

		return session.createQuery(cq).uniqueResult().intValue();
	}

	// new query count to fetch records
	public Integer fetchPendingSchemeCountNew(long districtId, String establishmentType, String searchParameter) {

		Session session = getCurrentSession();

		// String districtId = "";
		String status = "";
		String sql = "select count(schm.application_id)\r\n"
				+ "  from fa_msme_scheme schm \r\n"
				+ "left join fa_capital_assistance cap on schm.APPLICATION_ID=cap.APPLICATION_ID\r\n"
				+ "left join fa_infra_dev_exp_compensation infra on schm.APPLICATION_ID=infra.APPLICATION_ID\r\n"
				+ "left join fa_waste_mgmt_estb_exp_comp waste on schm.APPLICATION_ID=waste.APPLICATION_ID\r\n"
				+ "left join fa_electricity_fee_exemption elec on schm.APPLICATION_ID=elec.APPLICATION_ID\r\n"
				+ "left join fa_entry_tax_exemption_concess tax on schm.APPLICATION_ID=tax.APPLICATION_ID\r\n"
				+ "left join fa_mandi_fee_exemption mandi on schm.APPLICATION_ID=mandi.APPLICATION_ID\r\n"
				+ "left join fa_vat_cst_compensation vat on schm.APPLICATION_ID=vat.APPLICATION_ID\r\n"
				+ "left join fa_inst_estab_assistance inst on schm.APPLICATION_ID=inst.APPLICATION_ID\r\n"
				+ "left join fa_master_status stat  on schm.STATUS= stat.MASTER_STATUS_ID\r\n"
				+ "where \r\n"
				+ "DISTRICT_ID=" + districtId + " and STATUS>=2 and ESTABLISHMENT_TYPE='" + establishmentType + "'";
		// System.out.println(sql);
		Query<Long> query = session.createNativeQuery(sql, Long.class); // JAVA 21: typed createNativeQuery (COUNT -> Long)
		Number bi = (Number) query.uniqueResult();
		if (bi != null)
			return bi.intValue();
		else
			return 0;

	}

	// Infrastructure List
	@SuppressWarnings("unchecked")
	public List<InfrastructureBean> fetchInfrastructureList(long districtId, Integer firstResult,
			Integer pageDisplayLength, SortFieldBean sortField, String searchParameter) {
		Session session = getCurrentSession();

		String sql = "SELECT \r\n"
				+ "    id as id, \r\n"
				+ "    CONCAT(usr.FIRST_NAME, usr.LAST_NAME) AS applicantName, uadd.DISTRICT_ID as districtId,\r\n"
				+ "    md.DISTRICT_NAME AS districtName , ifd.application_letter as applicationFileDocId,ifd.project_report as projectReportId,\r\n"
				+ "    ifd.land_ownership as ownershipDocId,ifd.land_use as khasaraDocId,ifd.electrical_installation as electricalInstallationFileDocId,\r\n"
				+ "    ifd.approach_road as approachRoadFileDocId,ifd.approach_road_noc as approachRoadNocDocId, ifd.water as waterEstimateDocId,\r\n"
				+ "    ifd.land_map as landMapDocId,ifd.electrical_installation_map as electricalInstallationMapDocId,ifd.created_on as createdDate\r\n"
				+ "\r\n"
				+ "FROM \r\n"
				+ "    infrastructure_development ifd\r\n"
				+ "LEFT JOIN \r\n"
				+ "    users usr ON ifd.user_id = usr.USER_ID\r\n"
				+ "LEFT JOIN \r\n"
				+ "    user_address uadd ON uadd.USER_ID = ifd.user_id\r\n"
				+ "LEFT JOIN \r\n"
				+ "    master_districts md ON md.DISTRICT_ID = uadd.DISTRICT_ID\r\n"
				+ "GROUP BY \r\n"
				+ "    id";
		Integer min_val = firstResult;
		Integer max_val = pageDisplayLength;
		sql += " limit " + min_val + ", " + max_val;

		// System.out.println(sql);
		NativeQuery<Tuple> query = session.createNativeQuery(sql, Tuple.class);
		List<Tuple> results = query.getResultList();
		List<InfrastructureBean> beans = new java.util.ArrayList<>();

		for (Tuple row : results) {
			InfrastructureBean bean = new InfrastructureBean();
			Number districtIdValue = (Number) row.get("districtId");
			bean.setDistrictId(districtIdValue == null ? null : districtIdValue.longValue());
			bean.setId(((Number) row.get("id")).longValue());
			bean.setApplicantName((String) row.get("applicantName"));
			bean.setDistrictName((String) row.get("districtName"));
			Number applicationFileDocIdValue = (Number) row.get("applicationFileDocId");
			bean.setApplicationFileDocId(applicationFileDocIdValue == null ? null : applicationFileDocIdValue.longValue());
			Number projectReportIdValue = (Number) row.get("projectReportId");
			bean.setProjectReportId(projectReportIdValue == null ? null : projectReportIdValue.longValue());
			Number ownershipDocIdValue = (Number) row.get("ownershipDocId");
			bean.setOwnershipDocId(ownershipDocIdValue == null ? null : ownershipDocIdValue.longValue());
			Number khasaraDocIdValue = (Number) row.get("khasaraDocId");
			bean.setKhasaraDocId(khasaraDocIdValue == null ? null : khasaraDocIdValue.longValue());
			Number landMapDocIdValue = (Number) row.get("landMapDocId");
			bean.setLandMapDocId(landMapDocIdValue == null ? null : landMapDocIdValue.longValue());
			Number electricalInstallationFileDocIdValue = (Number) row.get("electricalInstallationFileDocId");
			bean.setElectricalInstallationFileDocId(electricalInstallationFileDocIdValue == null ? null : electricalInstallationFileDocIdValue.longValue());
			Number approachRoadFileDocIdValue = (Number) row.get("approachRoadFileDocId");
			bean.setApproachRoadFileDocId(approachRoadFileDocIdValue == null ? null : approachRoadFileDocIdValue.longValue());
			Number approachRoadNocDocIdValue = (Number) row.get("approachRoadNocDocId");
			bean.setApproachRoadNocDocId(approachRoadNocDocIdValue == null ? null : approachRoadNocDocIdValue.longValue());
			Number waterEstimateDocIdValue = (Number) row.get("waterEstimateDocId");
			bean.setWaterEstimateDocId(waterEstimateDocIdValue == null ? null : waterEstimateDocIdValue.longValue());
			Number electricalInstallationMapDocIdValue = (Number) row.get("electricalInstallationMapDocId");
			bean.setElectricalInstallationMapDocId(electricalInstallationMapDocIdValue == null ? null : electricalInstallationMapDocIdValue.longValue());
			Object createdDate = row.get("createdDate");
			bean.setCreatedDate(createdDate == null ? null : createdDate.toString());
			beans.add(bean);
		}

		return beans;

	}

	public Integer fetchInfrastructureCount(long districtId, String searchParameter) {

		Session session = getCurrentSession();

		// String districtId = "";
		String sql = "SELECT COUNT(DISTINCT ifd.id) \r\n"
				+ "FROM infrastructure_development ifd\r\n"
				+ "LEFT JOIN users usr ON ifd.user_id = usr.USER_ID\r\n"
				+ "LEFT JOIN user_address uadd ON uadd.USER_ID = ifd.user_id\r\n"
				+ "LEFT JOIN master_districts md ON md.DISTRICT_ID = uadd.DISTRICT_ID ";
		// System.out.println(sql);
		Query<Long> query = session.createNativeQuery(sql, Long.class); // JAVA 21: typed createNativeQuery (COUNT -> Long)
		Number bi = (Number) query.uniqueResult();
		if (bi != null)
			return bi.intValue();
		else
			return 0;

	}

	@SuppressWarnings("unchecked")
	public List<InfrastructureBean> findByInfrastructureId(Long id) {
		Session session = getCurrentSession();

		String sql = "SELECT \r\n"
				+ "    id as id, \r\n"
				+ "    CONCAT(usr.FIRST_NAME,' ', usr.LAST_NAME) AS applicantName, uadd.DISTRICT_ID as districtId,\r\n"
				+ "    md.DISTRICT_NAME AS districtName , ifd.application_letter as applicationFileDocId,ifd.project_report as projectReportId,\r\n"
				+ "    ifd.land_ownership as ownershipDocId,ifd.land_use as khasaraDocId,ifd.electrical_installation as electricalInstallationFileDocId,\r\n"
				+ "    ifd.approach_road as approachRoadFileDocId,ifd.approach_road_noc as approachRoadNocDocId, ifd.water as waterEstimateDocId,\r\n"
				+ "    ifd.land_map as landMapDocId,ifd.electrical_installation_map as electricalInstallationMapDocId,ifd.created_on as createdDate\r\n"
				+ "\r\n"
				+ "FROM \r\n"
				+ "    infrastructure_development ifd\r\n"
				+ "LEFT JOIN \r\n"
				+ "    users usr ON ifd.user_id = usr.USER_ID\r\n"
				+ "LEFT JOIN \r\n"
				+ "    user_address uadd ON uadd.USER_ID = ifd.user_id\r\n"
				+ "LEFT JOIN \r\n"
				+ "    master_districts md ON md.DISTRICT_ID = uadd.DISTRICT_ID\r\n"
				+ " where id=" + id
				+ " GROUP BY \r\n"
				+ "    id";
		// System.out.println(sql);
		NativeQuery<Tuple> query = session.createNativeQuery(sql, Tuple.class);
		List<Tuple> results = query.getResultList();
		List<InfrastructureBean> beans = new java.util.ArrayList<>();

		for (Tuple row : results) {
			InfrastructureBean bean = new InfrastructureBean();
			Number districtIdValue = (Number) row.get("districtId");
			bean.setDistrictId(districtIdValue == null ? null : districtIdValue.longValue());
			bean.setId(((Number) row.get("id")).longValue());
			bean.setApplicantName((String) row.get("applicantName"));
			bean.setDistrictName((String) row.get("districtName"));
			Number applicationFileDocIdValue = (Number) row.get("applicationFileDocId");
			bean.setApplicationFileDocId(applicationFileDocIdValue == null ? null : applicationFileDocIdValue.longValue());
			Number projectReportIdValue = (Number) row.get("projectReportId");
			bean.setProjectReportId(projectReportIdValue == null ? null : projectReportIdValue.longValue());
			Number ownershipDocIdValue = (Number) row.get("ownershipDocId");
			bean.setOwnershipDocId(ownershipDocIdValue == null ? null : ownershipDocIdValue.longValue());
			Number khasaraDocIdValue = (Number) row.get("khasaraDocId");
			bean.setKhasaraDocId(khasaraDocIdValue == null ? null : khasaraDocIdValue.longValue());
			Number landMapDocIdValue = (Number) row.get("landMapDocId");
			bean.setLandMapDocId(landMapDocIdValue == null ? null : landMapDocIdValue.longValue());
			Number electricalInstallationFileDocIdValue = (Number) row.get("electricalInstallationFileDocId");
			bean.setElectricalInstallationFileDocId(electricalInstallationFileDocIdValue == null ? null : electricalInstallationFileDocIdValue.longValue());
			Number approachRoadFileDocIdValue = (Number) row.get("approachRoadFileDocId");
			bean.setApproachRoadFileDocId(approachRoadFileDocIdValue == null ? null : approachRoadFileDocIdValue.longValue());
			Number approachRoadNocDocIdValue = (Number) row.get("approachRoadNocDocId");
			bean.setApproachRoadNocDocId(approachRoadNocDocIdValue == null ? null : approachRoadNocDocIdValue.longValue());
			Number waterEstimateDocIdValue = (Number) row.get("waterEstimateDocId");
			bean.setWaterEstimateDocId(waterEstimateDocIdValue == null ? null : waterEstimateDocIdValue.longValue());
			Number electricalInstallationMapDocIdValue = (Number) row.get("electricalInstallationMapDocId");
			bean.setElectricalInstallationMapDocId(electricalInstallationMapDocIdValue == null ? null : electricalInstallationMapDocIdValue.longValue());
			Object createdDate = row.get("createdDate");
			bean.setCreatedDate(createdDate == null ? null : createdDate.toString());
			beans.add(bean);
		}

		return beans;

	}

	public InfrastructureDocumentUpload fetchUploadedInfrastructureDocument(Long documentId) {

		Session session = getCurrentSession();

		InfrastructureDocumentUpload document = (InfrastructureDocumentUpload) session
				.get(InfrastructureDocumentUpload.class, documentId);
		return document;
	}

	public List<InfrastructreDevelopmentEntity> fetchInfrastructureIdList() {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<InfrastructreDevelopmentEntity> cq = cb.createQuery(InfrastructreDevelopmentEntity.class);
		cq.from(InfrastructreDevelopmentEntity.class);

		return session.createQuery(cq).getResultList();
	}

	public boolean checkFAAcceptanceDetail(String applicationId, String type) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMsmeDetail> cq = cb.createQuery(FaMsmeDetail.class);
		Root<FaMsmeDetail> root = cq.from(FaMsmeDetail.class);

		Predicate predicate = cb.equal(root.get("applicationId").get("applicationId"), applicationId);

		if (StringUtils.equals("commitee", type)) {
			predicate = cb.and(predicate, cb.isNotNull(root.get("meetingDate")));
		} else if (StringUtils.equals("zonal", type)) {
			predicate = cb.and(predicate, cb.isNotNull(root.get("zonalMeetingDate")));
		}

		cq.where(predicate);

		return !session.createQuery(cq).getResultList().isEmpty();
	}

	public FaMsmeDetail fetchFaMsmeDetailByApplicationId(String applicationId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMsmeDetail> cq = cb.createQuery(FaMsmeDetail.class);
		Root<FaMsmeDetail> root = cq.from(FaMsmeDetail.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));

		List<FaMsmeDetail> list = session.createQuery(cq).getResultList();

		return list.isEmpty() ? null : list.get(0);
	}

	/*
	 * public FaMsmeScheme findById(String applicationId) {
	 * Session session = getCurrentSession();
	 * try {
	 * return (FaMsmeScheme) session.get(FaMsmeScheme.class, applicationId);
	 * 
	 * }
	 * }
	 */ // created new because of slow processiing

	/*
	 * @Override
	 * 
	 * @SuppressWarnings("unchecked")
	 * public FaMsmeScheme findById(String applicationId) {
	 * Session session = getCurrentSession();
	 * try {
	 * String sql =
	 * "SELECT * FROM fa_msme_scheme WHERE application_id = :applicationId";
	 * NativeQuery query = session.createNativeQuery(sql);
	 * query.setParameter("applicationId", applicationId);
	 * query.addEntity(FaMsmeScheme.class);
	 * 
	 * return (FaMsmeScheme) query.uniqueResult();
	 * }
	 * }
	 */
	///////////////////

	//////////////////

	/*
	 * @Override
	 * 
	 * @SuppressWarnings("unchecked")
	 * public FaMsmeScheme findById(String applicationId) {
	 * Session session = getCurrentSession();
	 * Transaction transaction = null;
	 * FaMsmeScheme result = null;
	 * long startTime = System.currentTimeMillis(); // Start timing
	 * 
	 * try {
	 * session.setFlushMode(FlushModeType.COMMIT);
	 * transaction = session.beginTransaction();
	 * 
	 * //String sql =
	 * "SELECT * FROM fa_msme_scheme WHERE application_id = :applicationId group by APPLICATION_ID"
	 * ;
	 * String sql
	 * ="SELECT APPLICATION_ID,UNIT_OR_INST_NAME,MEMO_PART2_ACK_NO,MEMO_PART2_DATE,UNIT_TYPE,UNIT_ELECT_COMP_LOAD,UNIT_ELECT_COMP_NO,UNIT_ELECT_COMP_DATE,ESTABLISHMENT_TYPE,UNIT_START_DATE,UNIT_CAPITAL_INVESTMENT,\r\n"
	 * +
	 * "UNIT_TOTAL_EMPT_GEN,INST_ESTABLISHMENT_DATE,INST_TOTAL_TRAINEES_CAPACITY,STATUS,CREATED_ON,UPDATED_ON,CREATED_BY,UPDATED_BY,DISTRICT_ID,PHONENO,EMAIL,CATEGORY_ID,STATE,WOMEN_ENTREPRENEUR,\r\n"
	 * +
	 * "INDUSTRY_TYPE,EXPANSION,DIVERSIFICATION,TECHNICALUP,MAJOR_ACTIVITY,ACTIVITY_DETAILS,OLD_APPLICATION_ID,APPLICANT_EMAIL,APPLICANT_PHONENO,APPLICANT_STATE,APPLICANT_DISTRICT,\r\n"
	 * +
	 * "AUTHORISED_PERSON,firm_sector,firm_constitution,pan_document,udyam_document,tan_no,tan_document,gst_no,gst_document,cin,cin_document,industrial_area,plot_nos,\r\n"
	 * +
	 * "area_in_sqm,AUTHORISED_PERSON_LNAME,AUTHORISED_PERSON_FHNAME,UNIT_MP_EMPT_GEN,UNIT_MP_SC_EMPT_GEN,UNIT_MP_ST_EMPT_GEN,UNIT_MP_OBC_EMPT_GEN,gst_document,\r\n"
	 * +
	 * "gst_sell_document,permission_document,employment_given_document,submitted_on,pan_no\r\n"
	 * + "FROM fa_msme_scheme WHERE application_id = :applicationId";
	 * 
	 * NativeQuery query = session.createNativeQuery(sql);
	 * query.setParameter("applicationId", applicationId); // Bind parameter
	 * securely
	 * // System.out.println(sql);
	 * query.addEntity(FaMsmeScheme.class);
	 * 
	 * result = (FaMsmeScheme) query.uniqueResult(); // Fetch the result
	 * transaction.commit(); // Commit the transaction
	 * 
	 * 
	 * } catch (Exception e) {
	 * if (transaction != null) {
	 * transaction.rollback(); // Rollback in case of an exception
	 * }
	 * e.printStackTrace();
	 * } finally {
	 * if (session != null) {
	 * // session.close();
	 * }
	 * }
	 * 
	 * long endTime = System.currentTimeMillis(); // End timing
	 * // System.out.println("Query execution time: " + (endTime - startTime) +
	 * "ms");
	 * return result;
	 * }
	 */

	/*
	 * @SuppressWarnings("rawtypes")
	 * public FaMsmeScheme findById(String applicationId) {
	 * 
	 * Session session = getCurrentSession();
	 * try {
	 * 
	 * Criteria criteria = session.createCriteria(FaMsmeScheme.class);
	 * 
	 * criteria.add(Restrictions.eq("applicationId", applicationId));
	 * 
	 * List list = criteria.getResultList();
	 * 
	 * if (!list.isEmpty()) {
	 * 
	 * return (FaMsmeScheme) list.get(0);
	 * }
	 * 
	 * return null;
	 * 
	 * }
	 * }
	 */

	public FaMsmeScheme findById(String applicationId) {
		Session session = null;
		FaMsmeScheme result = null;
		long startTime = System.currentTimeMillis();

		try {
			session = getCurrentSession();

			result = (FaMsmeScheme) session.get(FaMsmeScheme.class, applicationId);
			long endTime = System.currentTimeMillis();
			// System.out.println("FaMsmeScheme fetch Query executed in " + (endTime -
			// startTime) + " ms");
		} catch (Exception e) {
			e.printStackTrace();
			// System.out.println("Error fetching FaMsmeScheme with applicationId: " + e);
		}
		return result;
	}

	public MasterStatus findStatusByCode(String statusCode) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<MasterStatus> cq = cb.createQuery(MasterStatus.class);
		Root<MasterStatus> root = cq.from(MasterStatus.class);

		cq.where(cb.equal(root.get("statusCode"), statusCode));

		List<MasterStatus> list = session.createQuery(cq).getResultList();

		return list.isEmpty() ? null : list.get(0);
	}

	public FaDocumentUpload fetchFAApplicantDocument(String documentTypeCode, String applicationId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaDocumentUpload> cq = cb.createQuery(FaDocumentUpload.class);
		Root<FaDocumentUpload> root = cq.from(FaDocumentUpload.class);

		Predicate predicate = cb.and(
				cb.equal(root.get("applicationId").get("applicationId"), applicationId),
				cb.equal(root.get("documentType").get("documentTypeCode"), documentTypeCode));
		cq.where(predicate);

		List<FaDocumentUpload> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);
	}

	public InfrastructureDocumentUpload fetchInfrastructureDocument(Long docuementCode) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<InfrastructureDocumentUpload> cq = cb.createQuery(InfrastructureDocumentUpload.class);
		Root<InfrastructureDocumentUpload> root = cq.from(InfrastructureDocumentUpload.class);

		cq.where(cb.equal(root.get("documentId"), docuementCode));

		List<InfrastructureDocumentUpload> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);
	}

	public List<FaDocumentUpload> fetchFAApplicantDocuments(String documentTypeCode, String applicationId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaDocumentUpload> cq = cb.createQuery(FaDocumentUpload.class);
		Root<FaDocumentUpload> root = cq.from(FaDocumentUpload.class);

		Predicate predicate = cb.and(
				cb.equal(root.get("applicationId").get("applicationId"), applicationId),
				cb.equal(root.get("documentType").get("documentTypeCode"), documentTypeCode));
		cq.where(predicate);

		return session.createQuery(cq).getResultList();
	}

	public FaRequestProcess fetchRequestProcessByApplicationAndStatusId(String applicationId, Long statusId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaRequestProcess> cq = cb.createQuery(FaRequestProcess.class);
		Root<FaRequestProcess> root = cq.from(FaRequestProcess.class);

		Predicate predicate = cb.and(
				cb.equal(root.get("faMsmeScheme").get("applicationId"), applicationId),
				cb.equal(root.get("status").get("masterStatusId"), statusId));
		cq.where(predicate);
		cq.orderBy(cb.desc(root.get("createdDate")));

		List<FaRequestProcess> requestProcessList = session.createQuery(cq).getResultList();
		return (requestProcessList != null && !requestProcessList.isEmpty()) ? requestProcessList.get(0) : null;
	}

	@SuppressWarnings("unchecked")
	public List<FaMsmeScheme> fetchFAApplicantsForZonalPageWise(List<Long> districtId, long status, Integer firstResult,
			Integer pageDisplayLength, SortFieldBean sortField, String searchParameter) {

		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMsmeScheme> cq = cb.createQuery(FaMsmeScheme.class);
		Root<FaMsmeScheme> root = cq.from(FaMsmeScheme.class);
		Join<Object, Object> statusJoin = root.join("status");

		Predicate predicate = cb.and(
				root.get("districtId").in(districtId),
				cb.greaterThanOrEqualTo(statusJoin.get("masterStatusId"), status));

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter + "%";
			predicate = cb.and(predicate, cb.or(
					cb.like(root.get("applicationId"), pattern),
					cb.like(root.get("unitOrInstName"), pattern)));
		}

		cq.where(predicate);

		return session.createQuery(cq)
				.setFirstResult(firstResult)
				.setMaxResults(pageDisplayLength)
				.getResultList();

	}

	public Integer fetchFAApplicantsForZonalCount(List<Long> districtId, long status, String searchParameter) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<Long> cq = cb.createQuery(Long.class);
		Root<FaMsmeScheme> root = cq.from(FaMsmeScheme.class);
		Join<Object, Object> statusJoin = root.join("status");

		cq.select(cb.count(root));

		Predicate predicate = cb.and(
				root.get("districtId").in(districtId),
				cb.greaterThanOrEqualTo(statusJoin.get("masterStatusId"), status));

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter + "%";
			predicate = cb.and(predicate, cb.or(
					cb.like(root.get("applicationId"), pattern),
					cb.like(root.get("unitOrInstName"), pattern)));
		}

		cq.where(predicate);

		return session.createQuery(cq).uniqueResult().intValue();

	}

	public FaInspection findInspectionDataByApplicationId(String applicationId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaInspection> cq = cb.createQuery(FaInspection.class);
		Root<FaInspection> root = cq.from(FaInspection.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));

		List<FaInspection> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);
	}

	public FaIncubationRegistration fetchIncubationRegistrationById(Long incubationRegistrationId) {
		Session session = getCurrentSession();
		FaIncubationRegistration idCase = (FaIncubationRegistration) session.get(FaIncubationRegistration.class,
				incubationRegistrationId);
		return idCase;
	}

	public FaStartupRegistration fetchStartupRegistrationById(Long startupId) {
		Session session = getCurrentSession();

		FaStartupRegistration startup = (FaStartupRegistration) session.get(FaStartupRegistration.class, startupId);
		return startup;

	}

	public FaStartupBenefits fetchStartupBenefitsRegistrationById(Long startupId) {
		Session session = getCurrentSession();
		FaStartupBenefits startup = (FaStartupBenefits) session.get(FaStartupBenefits.class, startupId);
		return startup;

	}

	public FaGrievanceRederessal fetchGrievanceRedressalById(Long grievanceId) {
		Session session = getCurrentSession();
		FaGrievanceRederessal grievance = (FaGrievanceRederessal) session.get(FaGrievanceRederessal.class,
				grievanceId);
		return grievance;

	}

	public List<FaStartupPartners> fetchStartupPartnersByStartupId(Long startupId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupPartners> cq = cb.createQuery(FaStartupPartners.class);
		Root<FaStartupPartners> root = cq.from(FaStartupPartners.class);

		cq.where(cb.equal(root.get("startupId").get("startupId"), startupId));

		return session.createQuery(cq).getResultList();
	}

	public List<FaGrievanceProcess> fetchGrievanceProcessByGrievanceId(Long grievanceId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaGrievanceProcess> cq = cb.createQuery(FaGrievanceProcess.class);
		Root<FaGrievanceProcess> root = cq.from(FaGrievanceProcess.class);

		cq.where(cb.equal(root.get("grievanceId").get("grievanceId"), grievanceId));
		cq.orderBy(cb.desc(root.get("processId")));

		return session.createQuery(cq).getResultList();
	}

	public List<FaGrievanceDocuments> fetchGrievanceDocumentByGrievanceId(Long grievanceId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaGrievanceDocuments> cq = cb.createQuery(FaGrievanceDocuments.class);
		Root<FaGrievanceDocuments> root = cq.from(FaGrievanceDocuments.class);

		cq.where(cb.equal(root.get("grievanceId").get("grievanceId"), grievanceId));
		cq.orderBy(cb.desc(root.get("documentId")));

		return session.createQuery(cq).getResultList();
	}

	public List<FaIncubationContacts> fetchIncubationContactsByRegistrationId(Long incubationRegistrationId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubationContacts> cq = cb.createQuery(FaIncubationContacts.class);
		Root<FaIncubationContacts> root = cq.from(FaIncubationContacts.class);

		cq.where(
				cb.equal(root.get("incubationRegistration").get("incubationRegistrationId"), incubationRegistrationId));

		return session.createQuery(cq).getResultList();
	}

	public List<FaIncubationRegistration> fetchIncubationRegistrationPageWise(Integer firstResult,
			Integer pageDisplayLength, String colDir, String colName, String searchParameter) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubationRegistration> cq = cb.createQuery(FaIncubationRegistration.class);
		Root<FaIncubationRegistration> root = cq.from(FaIncubationRegistration.class);

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter.trim().toLowerCase() + "%";
			cq.where(cb.like(cb.lower(root.get("incubationApplicationId")), pattern));
		}

		cq.orderBy(cb.desc(root.get("incubationRegistrationId")));

		return session.createQuery(cq)
				.setFirstResult(firstResult)
				.setMaxResults(pageDisplayLength)
				.getResultList();
	}

	public List<FaStartupRegistration> fetchStartupRegistrationPageWise(Integer firstResult, Integer pageDisplayLength,
			String colDir, String colName, String searchParameter) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupRegistration> cq = cb.createQuery(FaStartupRegistration.class);
		Root<FaStartupRegistration> root = cq.from(FaStartupRegistration.class);

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter.trim().toLowerCase() + "%";
			cq.where(cb.like(cb.lower(root.get("startupRegistrationId")), pattern));
		}

		cq.orderBy(cb.desc(root.get("startupId")));

		return session.createQuery(cq)
				.setFirstResult(firstResult)
				.setMaxResults(pageDisplayLength)
				.getResultList();
	}

	public List<FaStartupBenefits> fetchStartupBenefitsRegistrationPageWise(Integer firstResult,
			Integer pageDisplayLength, String colDir, String colName, String searchParameter) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupBenefits> cq = cb.createQuery(FaStartupBenefits.class);
		Root<FaStartupBenefits> root = cq.from(FaStartupBenefits.class);

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter.trim().toLowerCase() + "%";
			cq.where(cb.like(cb.lower(root.get("applicationNo")), pattern));
		}

		cq.orderBy(cb.desc(root.get("id")));

		return session.createQuery(cq)
				.setFirstResult(firstResult)
				.setMaxResults(pageDisplayLength)
				.getResultList();
	}

	public List<FaGrievanceRederessal> fetchLodgedGrievancesPageWise(Integer firstResult, Integer pageDisplayLength,
			String colDir, String colName, String searchParameter) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaGrievanceRederessal> cq = cb.createQuery(FaGrievanceRederessal.class);
		Root<FaGrievanceRederessal> root = cq.from(FaGrievanceRederessal.class);

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter.trim().toLowerCase() + "%";
			cq.where(cb.like(cb.lower(root.get("registrationNo")), pattern));
		}

		cq.orderBy(cb.desc(root.get("grievanceId")));

		return session.createQuery(cq)
				.setFirstResult(firstResult)
				.setMaxResults(pageDisplayLength)
				.getResultList();
	}

	public List<FaGrievanceRederessal> fetchLodgedGrievancesPageWiseByUserId(Integer firstResult,
			Integer pageDisplayLength, String colDir, String colName, String searchParameter, String userId) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaGrievanceRederessal> cq = cb.createQuery(FaGrievanceRederessal.class);
		Root<FaGrievanceRederessal> root = cq.from(FaGrievanceRederessal.class);

		Predicate predicate = cb.equal(root.get("createdBy").get("userId"), userId);

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter.trim().toLowerCase() + "%";
			predicate = cb.and(predicate, cb.like(cb.lower(root.get("registrationNo")), pattern));
		}

		cq.where(predicate);
		cq.orderBy(cb.desc(root.get("grievanceId")));

		return session.createQuery(cq)
				.setFirstResult(firstResult)
				.setMaxResults(pageDisplayLength)
				.getResultList();
	}

	public List<FaHelpSupport> fetchSupportQueriesPageWise(Integer firstResult, Integer pageDisplayLength,
			String colDir, String colName, String searchParameter) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaHelpSupport> cq = cb.createQuery(FaHelpSupport.class);
		Root<FaHelpSupport> root = cq.from(FaHelpSupport.class);

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter.trim().toLowerCase() + "%";
			cq.where(cb.like(cb.lower(root.get("name")), pattern));
		}

		cq.orderBy(cb.desc(root.get("supportId")));

		return session.createQuery(cq)
				.setFirstResult(firstResult)
				.setMaxResults(pageDisplayLength)
				.getResultList();
	}

	public List<FaIncubationRegistration> fetchIncubationRegistrationList(String searchParameter) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubationRegistration> cq = cb.createQuery(FaIncubationRegistration.class);
		Root<FaIncubationRegistration> root = cq.from(FaIncubationRegistration.class);

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter.trim().toLowerCase() + "%";
			cq.where(cb.like(cb.lower(root.get("incubationApplicationId")), pattern));
		}

		cq.orderBy(cb.desc(root.get("incubationRegistrationId")));

		return session.createQuery(cq).getResultList();
	}

	public List<FaStartupRegistration> fetchStartupRegistrationList(String searchParameter) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupRegistration> cq = cb.createQuery(FaStartupRegistration.class);
		Root<FaStartupRegistration> root = cq.from(FaStartupRegistration.class);

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter.trim().toLowerCase() + "%";
			cq.where(cb.like(cb.lower(root.get("startupRegistrationId")), pattern));
		}

		cq.orderBy(cb.desc(root.get("startupId")));

		return session.createQuery(cq).getResultList();
	}

	public List<FaStartupBenefits> fetchStartupBenefitsRegistrationList(String searchParameter) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupBenefits> cq = cb.createQuery(FaStartupBenefits.class);
		Root<FaStartupBenefits> root = cq.from(FaStartupBenefits.class);

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter.trim().toLowerCase() + "%";
			cq.where(cb.like(cb.lower(root.get("applicationNo")), pattern));
		}

		cq.orderBy(cb.desc(root.get("id")));

		return session.createQuery(cq).getResultList();
	}

	public List<FaGrievanceRederessal> fetchLodgedGrievancesList(String searchParameter) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaGrievanceRederessal> cq = cb.createQuery(FaGrievanceRederessal.class);
		Root<FaGrievanceRederessal> root = cq.from(FaGrievanceRederessal.class);

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter.trim().toLowerCase() + "%";
			cq.where(cb.like(cb.lower(root.get("registrationNo")), pattern));
		}

		cq.orderBy(cb.desc(root.get("grievanceId")));

		return session.createQuery(cq).getResultList();
	}

	public List<FaHelpSupport> fetchSupportQueriesList(String searchParameter) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaHelpSupport> cq = cb.createQuery(FaHelpSupport.class);
		Root<FaHelpSupport> root = cq.from(FaHelpSupport.class);

		if (StringUtils.isNotBlank(searchParameter)) {
			String pattern = "%" + searchParameter.trim().toLowerCase() + "%";
			cq.where(cb.like(cb.lower(root.get("name")), pattern));
		}

		cq.orderBy(cb.desc(root.get("supportId")));

		return session.createQuery(cq).getResultList();
	}

	public List<FaMasterIndentors> fetchMasterIndentors(String indentor) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMasterIndentors> cq = cb.createQuery(FaMasterIndentors.class);
		Root<FaMasterIndentors> root = cq.from(FaMasterIndentors.class);

		if (StringUtils.isNotBlank(indentor)) {
			String pattern = "%" + indentor.trim().toLowerCase() + "%";
			cq.where(cb.like(cb.lower(root.get("indentorName")), pattern));
		}

		cq.orderBy(cb.asc(root.get("indentorId")));

		return session.createQuery(cq).getResultList();
	}

	public List<FaMasterIndustries> fetchMasterIndustries() {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMasterIndustries> cq = cb.createQuery(FaMasterIndustries.class);
		Root<FaMasterIndustries> root = cq.from(FaMasterIndustries.class);

		cq.orderBy(cb.asc(root.get("industryId")));

		return session.createQuery(cq).getResultList();
	}

	public List<MasterStartupDomains> fetchStartupDomains() {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<MasterStartupDomains> cq = cb.createQuery(MasterStartupDomains.class);
		Root<MasterStartupDomains> root = cq.from(MasterStartupDomains.class);

		cq.orderBy(cb.asc(root.get("id")));

		return session.createQuery(cq).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<FaMasterIndustrySectors> fetchMasterIndustrySectors(Long industryId) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMasterIndustrySectors> cq = cb.createQuery(FaMasterIndustrySectors.class);
		Root<FaMasterIndustrySectors> root = cq.from(FaMasterIndustrySectors.class);

		if (industryId != null) {
			cq.where(cb.equal(root.get("industryId"), industryId));
		}
		cq.orderBy(cb.asc(root.get("sectorId")));

		return session.createQuery(cq).getResultList();

	}

	public List<FaMasterCities> fetchMasterCities() {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMasterCities> cq = cb.createQuery(FaMasterCities.class);
		Root<FaMasterCities> root = cq.from(FaMasterCities.class);

		cq.orderBy(cb.asc(root.get("cityId")));

		return session.createQuery(cq).getResultList();
	}

	public FaStartupFundingAssis fetchStartupFundingDetailsById(Long id) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupFundingAssis> cq = cb.createQuery(FaStartupFundingAssis.class);
		Root<FaStartupFundingAssis> root = cq.from(FaStartupFundingAssis.class);

		cq.where(cb.equal(root.get("id"), id));

		List<FaStartupFundingAssis> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();

		return list.isEmpty() ? null : list.get(0);

	}

	// 04-10-2023 add Jitendra Tiwari
	@Override
	public int countStartupFundingDetailsHistoryById(Long id) {

		Session session = getCurrentSession();
		// String sql = "select count(*) from startup_funding_assis sa inner join
		// startup_funding_details sd on sd.funding_assis_id = sa.id where created_by =
		// (SELECT pan_no FROM startup_fa WHERE id = :id)";
		String sql = "select count(*) from startup_funding_assis where created_by=(SELECT pan_no FROM startup_fa WHERE id = :id)";
		// String sql = "SELECT count(*) FROM startup_fa WHERE created_by =
		// '"+createdBy+"' and startup_master_assistance_id=1 and status=6";
		NativeQuery<Long> query = session.createNativeQuery(sql, Long.class); // JAVA 21: typed createNativeQuery (COUNT -> Long)
		query.setParameter("id", id);
		Integer count = ((Number) query.uniqueResult()).intValue();
		return count;

	}

	@Override
	public int countStartupFundingDetailsHistoryByIdNew(String createdBy) {
		Session session = getCurrentSession();
		String sql = "SELECT count(*) FROM startup_fa WHERE created_by = :createdBy and startup_master_assistance_id=1 and status=6";
		NativeQuery<Number> query = session.createNativeQuery(sql, Number.class);
		query.setParameter("createdBy", createdBy);
		Integer count = query.uniqueResult().intValue();
		return count;
	}

	@Override
	public int countStartupFundingAssitance(String createdBy) {
		Session session = getCurrentSession();
		String sql = "SELECT count(*) FROM startup_fa WHERE created_by = :createdBy and startup_master_assistance_id=1 and (status<>5 and status<>6 and status<>8 and status<>7 and status<>9 and status<>1)";
		NativeQuery<Number> query = session.createNativeQuery(sql, Number.class);
		query.setParameter("createdBy", createdBy);
		Integer count = query.uniqueResult().intValue();
		return count;
	}

	@Override
	public int countStartupFundingAssitanceCheck(String createdBy) {
		Session session = getCurrentSession();
		String sql = "SELECT count(*) FROM startup_fa WHERE created_by = :createdBy and startup_master_assistance_id=1 and status=6";
		NativeQuery<Number> query = session.createNativeQuery(sql, Number.class);
		query.setParameter("createdBy", createdBy);
		Integer count = query.uniqueResult().intValue();
		return count;
	}

	@Override
	public int countStartupProductAssitance(String createdBy) {
		Session session = getCurrentSession();
		String sql = "SELECT count(*) FROM startup_fa WHERE created_by = :createdBy and startup_master_assistance_id=5 and (status<>5 and status<>6 and status<>8 and status<>7 and status<>9)";
		NativeQuery<Number> query = session.createNativeQuery(sql, Number.class);
		query.setParameter("createdBy", createdBy);
		Integer count = query.uniqueResult().intValue();
		return count;
	}

	@Override
	public int countStartupPatentAssitance(String createdBy) {
		Session session = getCurrentSession();
		String sql = "SELECT count(*) FROM startup_fa WHERE created_by = :createdBy and startup_master_assistance_id=4 and (status<>5 and status<>6 and status<>8 and status<>7 and status<>9)";
		NativeQuery<Number> query = session.createNativeQuery(sql, Number.class);
		query.setParameter("createdBy", createdBy);
		Integer count = query.uniqueResult().intValue();
		return count;
	}

	@Override
	public int countStartupIncubationAssitance(String createdBy) {
		Session session = getCurrentSession();
		String sql = "SELECT count(*) FROM startup_fa WHERE created_by = :createdBy and startup_master_assistance_id=2 and (status<>5 and status<>6 and status<>8 and status<>7 and status<>9)";
		NativeQuery<Number> query = session.createNativeQuery(sql, Number.class);
		query.setParameter("createdBy", createdBy);
		Integer count = query.uniqueResult().intValue();
		return count;
	}

	@Override
	public int countStartupLeaseAssitance(String createdBy) {
		Session session = getCurrentSession();
		String sql = "SELECT count(*) FROM startup_fa WHERE created_by = :createdBy and startup_master_assistance_id=3 and (status<>5 and status<>6 and status<>8 and status<>7 and status<>9)";
		NativeQuery<Number> query = session.createNativeQuery(sql, Number.class);
		query.setParameter("createdBy", createdBy);
		Integer count = query.uniqueResult().intValue();
		return count;
	}

	public FaStartupDetails fetchStartupUserDetailsById(Long id) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupDetails> cq = cb.createQuery(FaStartupDetails.class);
		Root<FaStartupDetails> root = cq.from(FaStartupDetails.class);

		cq.where(cb.equal(root.get("id"), id));

		List<FaStartupDetails> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? null : list.get(0);
	}

	public FaStartupDetails fetchStartupUserDetailsByPanNo(String panNo) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupDetails> cq = cb.createQuery(FaStartupDetails.class);
		Root<FaStartupDetails> root = cq.from(FaStartupDetails.class);

		Predicate predicate = cb.and(
				cb.equal(root.get("panNum"), panNo),
				cb.notEqual(root.get("status").get("statusId"), 0L));
		cq.where(predicate);
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaStartupDetails> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaStartupDetails() : list.get(0);
	}

	public FaStartupIncubationDetails fetchStartupIncubationDetailsById(Long id) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupIncubationDetails> cq = cb.createQuery(FaStartupIncubationDetails.class);
		Root<FaStartupIncubationDetails> root = cq.from(FaStartupIncubationDetails.class);

		cq.where(cb.equal(root.get("id"), id));

		List<FaStartupIncubationDetails> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaStartupIncubationDetails() : list.get(0);
	}

	public FaStartupIncubationDetails fetchStartupIncubationDetailsByStartupId(Long startupId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupIncubationDetails> cq = cb.createQuery(FaStartupIncubationDetails.class);
		Root<FaStartupIncubationDetails> root = cq.from(FaStartupIncubationDetails.class);

		cq.where(cb.equal(root.get("startupId").get("id"), startupId));

		List<FaStartupIncubationDetails> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaStartupIncubationDetails() : list.get(0);
	}

	public FaStartupFundingAssis fetchStartupFundingAssisDetailsByStartupId(Long startupId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupFundingAssis> cq = cb.createQuery(FaStartupFundingAssis.class);
		Root<FaStartupFundingAssis> root = cq.from(FaStartupFundingAssis.class);

		cq.where(cb.equal(root.get("startupId").get("id"), startupId));

		List<FaStartupFundingAssis> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaStartupFundingAssis() : list.get(0);
	}

	public FaStartupFundingDetails fetchStartupFundingDetailsDetailsByStartupId(Long fundingAssisId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupFundingDetails> cq = cb.createQuery(FaStartupFundingDetails.class);
		Root<FaStartupFundingDetails> root = cq.from(FaStartupFundingDetails.class);

		cq.where(cb.equal(root.get("fundingAssisId").get("id"), fundingAssisId));

		List<FaStartupFundingDetails> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaStartupFundingDetails() : list.get(0);
	}

	public FaStartupPatentAssis fetchStartupPatentAssisDetailsByStartupId(Long startupId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupPatentAssis> cq = cb.createQuery(FaStartupPatentAssis.class);
		Root<FaStartupPatentAssis> root = cq.from(FaStartupPatentAssis.class);

		cq.where(cb.equal(root.get("startupId").get("id"), startupId));

		List<FaStartupPatentAssis> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaStartupPatentAssis() : list.get(0);
	}

	public FaStartupLeaseAssis fetchStartupLeaseAssisDetailsByStartupId(Long startupId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupLeaseAssis> cq = cb.createQuery(FaStartupLeaseAssis.class);
		Root<FaStartupLeaseAssis> root = cq.from(FaStartupLeaseAssis.class);

		cq.where(cb.equal(root.get("startupId").get("id"), startupId));

		List<FaStartupLeaseAssis> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaStartupLeaseAssis() : list.get(0);
	}

	public FaStartupProductAssis fetchStartupProductAssisDetailsByStartupId(Long startupId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupProductAssis> cq = cb.createQuery(FaStartupProductAssis.class);
		Root<FaStartupProductAssis> root = cq.from(FaStartupProductAssis.class);

		cq.where(cb.equal(root.get("startupId").get("id"), startupId));

		List<FaStartupProductAssis> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaStartupProductAssis() : list.get(0);
	}

	public FaIncubatorDetails fetchIncubatorDetailsById(Long id) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubatorDetails> cq = cb.createQuery(FaIncubatorDetails.class);
		Root<FaIncubatorDetails> root = cq.from(FaIncubatorDetails.class);

		cq.where(cb.equal(root.get("id"), id));

		List<FaIncubatorDetails> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaIncubatorDetails() : list.get(0);
	}

	public FaIncubatorCapacityEnhancement fetchIncubatorCapacityEnhancementByIncubatorId(Long incubatorId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubatorCapacityEnhancement> cq = cb.createQuery(FaIncubatorCapacityEnhancement.class);
		Root<FaIncubatorCapacityEnhancement> root = cq.from(FaIncubatorCapacityEnhancement.class);

		cq.where(cb.equal(root.get("incubatorId").get("id"), incubatorId));

		List<FaIncubatorCapacityEnhancement> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaIncubatorCapacityEnhancement() : list.get(0);
	}

	public FaIncubatorOrganizingEvent fetchIncubatorOrganizingEventByIncubatorId(Long incubatorId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubatorOrganizingEvent> cq = cb.createQuery(FaIncubatorOrganizingEvent.class);
		Root<FaIncubatorOrganizingEvent> root = cq.from(FaIncubatorOrganizingEvent.class);

		cq.where(cb.equal(root.get("incubatorId").get("id"), incubatorId));

		List<FaIncubatorOrganizingEvent> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaIncubatorOrganizingEvent() : list.get(0);
	}

	public FaIncubatorStartupFundingAssistance fetchIncubatorStartupFundingAssistanceByIncubatorId(Long incubatorId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubatorStartupFundingAssistance> cq = cb
				.createQuery(FaIncubatorStartupFundingAssistance.class);
		Root<FaIncubatorStartupFundingAssistance> root = cq.from(FaIncubatorStartupFundingAssistance.class);

		cq.where(cb.equal(root.get("incubatorId").get("id"), incubatorId));

		List<FaIncubatorStartupFundingAssistance> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaIncubatorStartupFundingAssistance() : list.get(0);
	}

	public FaIncubatorStartupFundingAssistance fetchIncubatorStartupFundingAssistanceByPanNo(String panNo) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubatorStartupFundingAssistance> cq = cb
				.createQuery(FaIncubatorStartupFundingAssistance.class);
		Root<FaIncubatorStartupFundingAssistance> root = cq.from(FaIncubatorStartupFundingAssistance.class);

		cq.where(cb.equal(root.get("panNum"), panNo));

		List<FaIncubatorStartupFundingAssistance> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaIncubatorStartupFundingAssistance() : list.get(0);
	}

	public FaStartupLeaseAssis fetchStartupLeaseDetailsById(Long id) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupLeaseAssis> cq = cb.createQuery(FaStartupLeaseAssis.class);
		Root<FaStartupLeaseAssis> root = cq.from(FaStartupLeaseAssis.class);

		cq.where(cb.equal(root.get("id"), id));

		List<FaStartupLeaseAssis> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaStartupLeaseAssis() : list.get(0);
	}

	public FaStartupProductAssis fetchStartupProductDetailsById(Long id) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupProductAssis> cq = cb.createQuery(FaStartupProductAssis.class);
		Root<FaStartupProductAssis> root = cq.from(FaStartupProductAssis.class);

		cq.where(cb.equal(root.get("id"), id));

		List<FaStartupProductAssis> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaStartupProductAssis() : list.get(0);
	}

	public FaIncubatorDetails fetchFaIncubatorCenterDetailsById(Long id) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubatorDetails> cq = cb.createQuery(FaIncubatorDetails.class);
		Root<FaIncubatorDetails> root = cq.from(FaIncubatorDetails.class);

		cq.where(cb.equal(root.get("id"), id));

		List<FaIncubatorDetails> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaIncubatorDetails() : list.get(0);
	}

	public FaIncubatorDetails fetchFaIncubatorCenterDetailsByPanNo(String panNo) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubatorDetails> cq = cb.createQuery(FaIncubatorDetails.class);
		Root<FaIncubatorDetails> root = cq.from(FaIncubatorDetails.class);

		Predicate predicate = cb.and(
				cb.equal(root.get("panNum"), panNo),
				cb.notEqual(root.get("status").get("statusId"), 0L));
		cq.where(predicate);
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaIncubatorDetails> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaIncubatorDetails() : list.get(0);

	}

	public FaIncubatorOrganizingEvent fetchFaIncubatorOrganizingEventById(Long id) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubatorOrganizingEvent> cq = cb.createQuery(FaIncubatorOrganizingEvent.class);
		Root<FaIncubatorOrganizingEvent> root = cq.from(FaIncubatorOrganizingEvent.class);

		cq.where(cb.equal(root.get("id"), id));

		List<FaIncubatorOrganizingEvent> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaIncubatorOrganizingEvent() : list.get(0);

	}

	public FaIncubatorCapacityEnhancement fetchFaIncubatorCapacityEnhancementById(Long id) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubatorCapacityEnhancement> cq = cb.createQuery(FaIncubatorCapacityEnhancement.class);
		Root<FaIncubatorCapacityEnhancement> root = cq.from(FaIncubatorCapacityEnhancement.class);

		cq.where(cb.equal(root.get("id"), id));

		List<FaIncubatorCapacityEnhancement> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaIncubatorCapacityEnhancement() : list.get(0);

	}

	public FaIncubatorStartupFundingAssistance fetchFaIncubatorStartupFundingAssistanceById(Long id) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubatorStartupFundingAssistance> cq = cb.createQuery(FaIncubatorStartupFundingAssistance.class);
		Root<FaIncubatorStartupFundingAssistance> root = cq.from(FaIncubatorStartupFundingAssistance.class);

		cq.where(cb.equal(root.get("id"), id));

		List<FaIncubatorStartupFundingAssistance> list = session.createQuery(cq)
				.setFirstResult(0)
				.setMaxResults(1)
				.getResultList();
		return list.isEmpty() ? new FaIncubatorStartupFundingAssistance() : list.get(0);

	}

	@SuppressWarnings("unchecked")
	public List<FaStartupDetails> fetchStartupUSerDetailsListPageWise(String username, Integer firstResult,
			Integer pageDisplayLength, String getsColDir, String getsColName, String searchParameter) {

		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupDetails> cq = cb.createQuery(FaStartupDetails.class);
		Root<FaStartupDetails> root = cq.from(FaStartupDetails.class);

		Predicate predicate;
		if (StringUtils.isNotBlank(username)) {
			predicate = cb.equal(root.get("createdBy").get("userId"), username);
		} else {
			predicate = cb.notEqual(root.get("status").get("statusId"), 1L);
		}

		predicate = cb.and(predicate, cb.notEqual(root.get("status").get("statusId"), 0L));

		if (StringUtils.isNotBlank(searchParameter)) {
			predicate = cb.and(predicate, cb.like(root.get("nameOfEntity"), searchParameter + "%"));
		}

		cq.where(predicate);
		cq.orderBy(cb.desc(root.get("submittedDate")));

		return session.createQuery(cq)
				.setFirstResult(firstResult)
				.setMaxResults(pageDisplayLength)
				.getResultList();

	}

	public List<FaIncubatorDetails> fetchIncubatorDetailsListPageWise(String username, Integer firstResult,
			Integer pageDisplayLength, String getsColDir, String getsColName, String searchParameter) {

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubatorDetails> cq = cb.createQuery(FaIncubatorDetails.class);
		Root<FaIncubatorDetails> root = cq.from(FaIncubatorDetails.class);

		Predicate predicate;
		if (StringUtils.isNotBlank(username)) {
			predicate = cb.equal(root.get("createdBy").get("userId"), username);
		} else {
			predicate = cb.notEqual(root.get("status").get("statusId"), 1L);
		}

		predicate = cb.and(predicate, cb.notEqual(root.get("status").get("statusId"), 0L));

		cq.where(predicate);
		cq.orderBy(cb.desc(root.get("createdOn")));

		return session.createQuery(cq)
				.setFirstResult(firstResult)
				.setMaxResults(pageDisplayLength)
				.getResultList();
	}

	public FaDocumentUpload fetchFAApplicantDocumentByDocumentId(Long documentId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaDocumentUpload> cq = cb.createQuery(FaDocumentUpload.class);
		Root<FaDocumentUpload> root = cq.from(FaDocumentUpload.class);

		cq.where(cb.equal(root.get("documentId"), documentId));

		List<FaDocumentUpload> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);
	}

	@Override
	public List<FaStartupWorkFlow> fetchStartupWorkflowListById(Long StartupId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupWorkFlow> cq = cb.createQuery(FaStartupWorkFlow.class);
		Root<FaStartupWorkFlow> root = cq.from(FaStartupWorkFlow.class);

		cq.where(cb.equal(root.get("startupId").get("id"), StartupId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		return session.createQuery(cq).getResultList();
	}

	@Override
	public List<FaIncubatorWorkFlow> fetchIncubatorWorkflowListById(Long StartupId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaIncubatorWorkFlow> cq = cb.createQuery(FaIncubatorWorkFlow.class);
		Root<FaIncubatorWorkFlow> root = cq.from(FaIncubatorWorkFlow.class);

		cq.where(cb.equal(root.get("incubatorId").get("id"), StartupId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		return session.createQuery(cq).getResultList();
	}

	@Override
	public FaCapitalAssistance fetchFaCapitalAssistanceByApplicationId(String applicationId) {
		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaCapitalAssistance> cq = cb.createQuery(FaCapitalAssistance.class);
		Root<FaCapitalAssistance> root = cq.from(FaCapitalAssistance.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaCapitalAssistance> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);
	}

	@Override
	@SuppressWarnings("unchecked")
	public FaCapitalAssistExpInvDet fetchFaCapitalAssistanceExpInvDetById(Long id) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaCapitalAssistExpInvDet> cq = cb.createQuery(FaCapitalAssistExpInvDet.class);
		Root<FaCapitalAssistExpInvDet> root = cq.from(FaCapitalAssistExpInvDet.class);

		cq.where(cb.equal(root.get("id"), id));

		List<FaCapitalAssistExpInvDet> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	// created beacause of slow processing
	/*
	 * @Override
	 * 
	 * @SuppressWarnings("unchecked")
	 * public FaCapitalAssistance fetchFaCapitalAssistanceByApplicationId(String
	 * applicationId) {
	 * Session session = getCurrentSession();
	 * try {
	 * String sql =
	 * "SELECT * FROM fa_capital_assistance WHERE application_id = :applicationId ORDER BY created_on DESC LIMIT 1"
	 * ;
	 * NativeQuery query = session.createNativeQuery(sql);
	 * query.setParameter("applicationId", applicationId);
	 * query.addEntity(FaCapitalAssistance.class);
	 * 
	 * return (FaCapitalAssistance) query.uniqueResult();
	 * }
	 * }
	 */

	@Override
	@SuppressWarnings("unchecked")
	public FaQualityAssistance fetchFaQualityAssistanceByApplicationId(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaQualityAssistance> cq = cb.createQuery(FaQualityAssistance.class);
		Root<FaQualityAssistance> root = cq.from(FaQualityAssistance.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaQualityAssistance> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	/*
	 * @Override
	 * 
	 * @SuppressWarnings("unchecked")
	 * public FaQualityAssistance fetchFaQualityAssistanceByApplicationId(String
	 * applicationId) {
	 * Session session = getCurrentSession();
	 * 
	 * FaQualityAssistance result = null;
	 * try {
	 * 
	 * String sql =
	 * "SELECT * FROM fa_quality_assistance WHERE application_id = :applicationId ORDER BY created_on DESC LIMIT 1"
	 * ;
	 * NativeQuery query = session.createNativeQuery(sql);
	 * query.setParameter("applicationId", applicationId);
	 * query.addEntity(FaQualityAssistance.class);
	 * 
	 * result = (FaQualityAssistance) query.uniqueResult();
	 * 
	 * 
	 * }
	 * 
	 * return result;
	 * }
	 */

	@Override
	@SuppressWarnings("unchecked")
	public FaReimbursementPatents fetchFaPatentReimbursementByApplicationId(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaReimbursementPatents> cq = cb.createQuery(FaReimbursementPatents.class);
		Root<FaReimbursementPatents> root = cq.from(FaReimbursementPatents.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaReimbursementPatents> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	@SuppressWarnings("unchecked")
	public FaInfraDevExpCompensation fetchFaInfraDevExpCompensationByApplicationId(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaInfraDevExpCompensation> cq = cb.createQuery(FaInfraDevExpCompensation.class);
		Root<FaInfraDevExpCompensation> root = cq.from(FaInfraDevExpCompensation.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaInfraDevExpCompensation> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	@SuppressWarnings("unchecked")
	public FaWasteMgmtEstbExpComp fetchFaWasteMgmtEstbExpCompByApplicationId(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaWasteMgmtEstbExpComp> cq = cb.createQuery(FaWasteMgmtEstbExpComp.class);
		Root<FaWasteMgmtEstbExpComp> root = cq.from(FaWasteMgmtEstbExpComp.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaWasteMgmtEstbExpComp> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	@SuppressWarnings("unchecked")
	public FaEnergyAuditAssistance fetchFaEnergyAuditAssistanceByApplicationId(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaEnergyAuditAssistance> cq = cb.createQuery(FaEnergyAuditAssistance.class);
		Root<FaEnergyAuditAssistance> root = cq.from(FaEnergyAuditAssistance.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaEnergyAuditAssistance> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	@SuppressWarnings("unchecked")
	public FaPowerloomUpgradation fetchFaPowerloomUpgradationByApplicationId(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaPowerloomUpgradation> cq = cb.createQuery(FaPowerloomUpgradation.class);
		Root<FaPowerloomUpgradation> root = cq.from(FaPowerloomUpgradation.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaPowerloomUpgradation> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	@SuppressWarnings("unchecked")
	public FaPharmaLabAssistance fetchFaPharmaLabAssistanceByApplicationId(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaPharmaLabAssistance> cq = cb.createQuery(FaPharmaLabAssistance.class);
		Root<FaPharmaLabAssistance> root = cq.from(FaPharmaLabAssistance.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaPharmaLabAssistance> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	public FaDocumentUpload fetchFaUploadedDocument(Long documentId) {

		Session session = getCurrentSession();
		FaDocumentUpload document = (FaDocumentUpload) session.get(FaDocumentUpload.class, documentId);
		return document;
	}

	// @SuppressWarnings("unchecked")
	// public List<FaReportBean> fetchFaReportListPageWise(String username, Integer
	// firstResult, Integer pageDisplayLength,
	// String colDir, String colName, FaDto searchParameter) {
	// Session session = getCurrentSession();
	// try {
	//
	// String districtId = "";
	// String status="";
	// /*
	// * Query query = session.
	// * createSQLQuery("SELECT APPLICATION_ID applicationId,
	// DATE_FORMAT(submitted_on, '%d/%m/%Y %T %p') submittedOn, ESTABLISHMENT_TYPE
	// establishmentType , UNIT_OR_INST_NAME unitOrInstName, STATUS_DESCRIPTION
	// status from fa_msme_scheme inner join fa_master_status on
	// MASTER_STATUS_ID=STATUS where created_by=COALESCE(:createdBy, CREATED_BY) and
	// ESTABLISHMENT_TYPE=COALESCE(:establishmentType, ESTABLISHMENT_TYPE) and
	// APPLICATION_ID like :applicationId and status>0 order by created_on desc
	// limit :firstResult, :pageDisplayLength"
	// * ) .setString("createdBy", username).setString("establishmentType",
	// * establishmentType).setString("applicationId",
	// * applicationId).setInteger("firstResult",
	// * firstResult).setInteger("pageDisplayLength", pageDisplayLength);
	// */
	// /*
	// * String
	// * sql="select distinct schm.application_id,
	// unit_or_inst_name,schm.district_id,dist.district_name,
	// addrs.address1,addrs.address2,addrs.address3,addrs.tehsil_id,tehsil.tehsil_name,
	// addrs.tehsil_block_id ,tehblk.tehsil_block_name,ifnull(invst.amount,0) as
	// amount,\r\n"
	// * +
	// *
	// "unit_mp_empt_gen,unit_mp_obc_empt_gen,unit_mp_sc_empt_gen,unit_mp_st_empt_gen,sanction_letter_date,unit_type,\r\n"
	// * + "schm.category_id,cate.category_name ,disbu.letter_date \r\n"
	// * +",indus.APPLICATION_ID as industrial,quality.application_id as
	// quality,patent.APPLICATION_ID as patent"
	// * +" ,infra.APPLICATION_ID as infra, waste.APPLICATION_ID as treatment,
	// energy.application_id as energy"
	// * +",powerloom.APPLICATION_ID as powerloom,pharma.application_id as pharma "
	// +
	// * " from fa_msme_scheme schm left join common_address addrs on
	// schm.APPLICATION_ID=addrs.APPLICATION_ID "
	// * +
	// * "left join fa_msme_detail deta on schm.APPLICATION_ID=deta.APPLICATION_ID "
	// * +
	// * "left join fa_scheme_capital_investment invst on
	// schm.APPLICATION_ID=invst.APPLICATION_ID and invst.INVESTMENT_NAME='Plant &
	// Machinery' "
	// * + "left join master_districts dist on addrs.DISTRICT_ID=dist.DISTRICT_ID "
	// +
	// * "left join master_tehsils tehsil on addrs.TEHSIL_ID=tehsil.TEHSIL_ID " +
	// * "left join master_tehsils_blocks tehblk on
	// addrs.TEHSIL_BLOCK_ID=tehblk.TEHSIL_BLOCK_ID "
	// * + "left join master_category cate on schm.CATEGORY_ID=cate.CATEGORY_ID " +
	// * "left join fa_disbursement_save disbu on
	// schm.APPLICATION_ID=disbu.application_id "
	// * +
	// * " left join fa_capital_assistance indus on
	// schm.APPLICATION_ID=indus.APPLICATION_ID "
	// * +
	// * " left join fa_quality_assistance quality on
	// schm.APPLICATION_ID=quality.application_id "
	// * +
	// * " left join fa_reimbursement_patents patent on
	// schm.APPLICATION_ID=patent.application_id "
	// * +
	// * " left join fa_infra_dev_exp_compensation infra on
	// schm.APPLICATION_ID=infra.APPLICATION_ID "
	// * +
	// * " left join fa_waste_mgmt_estb_exp_comp waste on
	// schm.APPLICATION_ID=waste.APPLICATION_ID "
	// * +
	// * " left join fa_energy_audit_assistance energy on
	// schm.APPLICATION_ID=energy.application_id "
	// * +
	// * " left join fa_powerloom_upgradation powerloom on
	// schm.APPLICATION_ID=powerloom.application_id "
	// * +
	// * " left join fa_pharma_lab_assistance pharma on
	// schm.APPLICATION_ID=pharma.application_id "
	// * ;
	// */
	// String sql = "select distinct schm.application_id,
	// unit_or_inst_name,schm.district_id,dist.district_name,"
	// +
	// "unit_mp_empt_gen,unit_mp_obc_empt_gen,unit_mp_sc_empt_gen,unit_mp_st_empt_gen,"
	// + "date_format(sanction_letter_date,'%d/%m/%y') as sanction_letter_date,"
	// + "unit_type,schm.category_id,cate.category_name ,"
	// + "date_format(disbu.letter_date,'%d/%m/%y') as letter_date , invst.amount as
	// amount "
	// + " ,concat(addr.ADDRESS1,addr.ADDRESS2,addr.ADDRESS3) as
	// address1,teh.TEHSIL_NAME as tehsil_name,blk.BLOCK_NAME as block_name"
	// + " from fa_msme_scheme schm "
	// + "left join fa_msme_detail deta on schm.APPLICATION_ID=deta.APPLICATION_ID "
	// + "left join master_districts dist on schm.DISTRICT_ID=dist.DISTRICT_ID "
	// + "left join master_category cate on schm.CATEGORY_ID=cate.CATEGORY_ID "
	// + "left join fa_disbursement_save disbu on
	// schm.APPLICATION_ID=disbu.application_id "
	// + "left join fa_scheme_capital_investment invst on
	// schm.APPLICATION_ID=invst.APPLICATION_ID and invst.INVESTMENT_NAME='Plant &
	// Machinery' "
	// + " left join common_address addr on schm.APPLICATION_ID=addr.APPLICATION_ID
	// and addr.TYPE='UNIT_ADDRESS'"
	// + " left join master_tehsils teh on teh.TEHSIL_ID=addr.TEHSIL_ID"
	// + " left join master_blocks blk on blk.BLOCK_ID=addr.BLOCK_ID"
	// + " where ";
	// if (searchParameter.getDitrictId() != null && searchParameter.getDitrictId()
	// != "") {
	// districtId = searchParameter.getDitrictId();
	// sql += " schm.DISTRICT_ID=" + districtId;
	// }
	// if (searchParameter.getStatus() != null && (searchParameter.getStatus() != ""
	// && !(searchParameter.getStatus().equals("undefined")))) {
	// status = searchParameter.getStatus();
	// sql += " and schm.status=" + status;
	// }
	//
	// // if (StringUtils.isNotBlank(searchParameter)) {
	// if (searchParameter.getSearch() != null
	// && (searchParameter.getSearch().equals("1") ||
	// searchParameter.getSearch().equals("2"))) {
	// // System.out.println("000" + searchParameter.getSearch() + "000");
	// String temp = searchParameter.getSearch();
	// String searchParam = "";
	// if (temp.equals("1"))
	// searchParam = "sanction_letter_date";
	// else
	// searchParam = "disbu.letter_date";
	// // if (StringUtils.isNotBlank(searchParameter)) {
	// Date sd = new Date();
	// Date fromDate = new Date();
	// Date toDate = new Date();
	// SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
	// try {
	// // if(StringUtils.isNotBlank(searchParameter))
	// if (searchParameter.getFromDate() != null) {
	// // sd=dateFormat.parse(searchParameter.trim());
	// fromDate = dateFormat.parse(searchParameter.getFromDate());
	// }
	// if (searchParameter.getToDate() != null) {
	// toDate = dateFormat.parse(searchParameter.getToDate());
	// }
	// // else sd=null;
	// } catch (Exception e) {
	// e.printStackTrace();
	// }
	// SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd");
	// // sql+= " where Date(sanction_letter_date)= '"+dateFormat1.format(sd)+"'";
	// sql += " where " + searchParam + " between '" + dateFormat1.format(fromDate)
	// + "' and '"
	// + dateFormat1.format(toDate) + "'";
	//
	// // }
	// }
	// sql+="\r\n group by schm.application_id";
	// Integer min_val = searchParameter.getStartRecord();
	// Integer max_val = searchParameter.getNoOfRows();
	// sql += " limit " + min_val + ", " + max_val;
	//
	// // System.out.println(sql);
	// Query<Object[]> query = session.createNativeQuery(sql, Object[].class).addScalar("district_id",
	// Long.class)
	// .addScalar("district_name", String.class)
	// .addScalar("application_id", String.class)
	// .addScalar("unit_or_inst_name", String.class)
	// .addScalar("district_name", String.class)
	// .addScalar("amount", Double.class)
	// .addScalar("unit_mp_empt_gen", Integer.class)
	// .addScalar("unit_mp_obc_empt_gen", Integer.class)
	// .addScalar("unit_mp_sc_empt_gen", Integer.class)
	// .addScalar("unit_mp_st_empt_gen", Integer.class)
	// .addScalar("sanction_letter_date", String.class)
	// .addScalar("category_id", String.class)
	// .addScalar("category_name", String.class)
	// .addScalar("unit_type", String.class)
	// .addScalar("letter_date", String.class)
	// .addScalar("address1", String.class)
	// .addScalar("tehsil_name", String.class)
	// .addScalar("block_name", String.class);
	//
	// // .addScalar("industrial", String.class)
	// // .addScalar("quality", String.class)
	// // .addScalar("patent", String.class)
	// // .addScalar("infra", String.class)
	// // .addScalar("treatment", String.class)
	// // .addScalar("energy", String.class)
	// // .addScalar("powerloom", String.class)
	// // .addScalar("pharma", String.class);
	//
	// query.setResultTransformer(Transformers.aliasToBean(FaReportBean.class));
	//
	// return (List<FaReportBean>) query.getResultList();
	//
	// } finally {
	// if (session != null && session.isOpen()) {
	// // session.close();
	// }
	// }
	// }
	//
	@SuppressWarnings("unchecked")
	public List<FaReportBean> fetchFaReportListPageWise(String username, Integer firstResult, Integer pageDisplayLength,
			String colDir, String colName, FaDto searchParameter) {
		Session session = getCurrentSession();
		session.setFlushMode(FlushModeType.COMMIT);
		String districtId = "";
		String status = "";

		/*
		 * String sql =
		 * "select distinct schm.application_id, unit_or_inst_name,schm.district_id,dist.district_name,"
		 * +
		 * "unit_mp_empt_gen,unit_mp_obc_empt_gen,unit_mp_sc_empt_gen,unit_mp_st_empt_gen,"
		 * + "date_format(sanction_letter_date,'%d/%m/%y') as sanction_letter_date,"
		 * + "unit_type,schm.category_id,cate.category_name ,"
		 * +
		 * "date_format(disbu.letter_date,'%d/%m/%y') as letter_date , invst.amount as amount "
		 * +
		 * " ,concat(addr.ADDRESS1,addr.ADDRESS2,addr.ADDRESS3) as address1,teh.TEHSIL_NAME as tehsil_name,blk.BLOCK_NAME as block_name"
		 * + " from fa_msme_scheme schm  "
		 * +
		 * "left join  fa_msme_detail deta on schm.APPLICATION_ID=deta.APPLICATION_ID "
		 * + "left join master_districts dist on schm.DISTRICT_ID=dist.DISTRICT_ID "
		 * + "left join master_category cate on schm.CATEGORY_ID=cate.CATEGORY_ID "
		 * +
		 * "left join fa_disbursement_save disbu on schm.APPLICATION_ID=disbu.application_id "
		 * +
		 * "left join fa_scheme_capital_investment invst on schm.APPLICATION_ID=invst.APPLICATION_ID and invst.INVESTMENT_NAME='Plant & Machinery' "
		 * +
		 * " left join common_address addr on schm.APPLICATION_ID=addr.APPLICATION_ID and  addr.TYPE='UNIT_ADDRESS'"
		 * + " left join master_tehsils teh on teh.TEHSIL_ID=addr.TEHSIL_ID"
		 * + " left join master_blocks blk on blk.BLOCK_ID=addr.BLOCK_ID"
		 * + " where ";
		 */
		String sql = "SELECT DISTINCT\r\n" + "    schm.application_id, \r\n" + "    unit_or_inst_name,\r\n"
				+ "    schm.district_id,\r\n" + "    dist.district_name,\r\n" + "    unit_mp_empt_gen,\r\n"
				+ "    unit_mp_obc_empt_gen,\r\n" + "    unit_mp_sc_empt_gen,\r\n" + "    unit_mp_st_empt_gen,\r\n"
				+ "    DATE_FORMAT(sanction_letter_date, '%d/%m/%y') AS sanction_letter_date,\r\n"
				+ "    unit_type,\r\n" + "    schm.category_id,\r\n" + "    cate.category_name,\r\n"
				+ "    DATE_FORMAT(disbu.letter_date, '%d/%m/%y') AS letter_date,\r\n"
				+ "    invst.amount AS amount,\r\n"
				+ "    CONCAT(addr.ADDRESS1, addr.ADDRESS2, addr.ADDRESS3) AS address1,\r\n"
				+ "    teh.TEHSIL_NAME AS tehsil_name,\r\n" + "    blk.BLOCK_NAME AS block_name\r\n" + "FROM (\r\n"
				+ "    SELECT DISTINCT schm.application_id\r\n" + "    FROM fa_msme_scheme schm\r\n" + "    WHERE 1=1 ";

		if (searchParameter.getDitrictId() != null && !searchParameter.getDitrictId().isEmpty()) {
			districtId = searchParameter.getDitrictId();
			sql += " and schm.DISTRICT_ID=" + districtId;
		}
		if (searchParameter.getStatus() != null && !searchParameter.getStatus().isEmpty()
				&& !searchParameter.getStatus().equals("undefined")) {
			status = searchParameter.getStatus();
			sql += " and schm.status=" + status;
		}
		/*
		 * if (searchParameter.getDitrictId() != null && searchParameter.getDitrictId()
		 * != "") {
		 * districtId = searchParameter.getDitrictId();
		 * 
		 * }
		 * 
		 * String sql="WITH limited_ids AS (\r\n"
		 * + "    SELECT DISTINCT application_id\r\n"
		 * + "    FROM fa_msme_scheme\r\n";
		 * 
		 * sql+= "    WHERE DISTRICT_ID ="+ districtId;
		 * if (searchParameter.getStatus() != null &&
		 * (searchParameter.getStatus() != "" &&
		 * !(searchParameter.getStatus().equals("undefined")))) {
		 * status = searchParameter.getStatus();
		 * sql+= " and status="+status;
		 * 
		 * }
		 * sql+="\r\n" + ")";
		 */

		// commented as not working on mariaDB server
		/*
		 * Integer min_val = searchParameter.getStartRecord();
		 * Integer max_val = searchParameter.getNoOfRows();
		 * 
		 * sql+= " LIMIT "+ min_val+","+ max_val+" \r\n";
		 */

		sql += " ) AS limited_ids\r\n"
				+ "JOIN fa_msme_scheme schm ON limited_ids.application_id = schm.application_id\r\n"
				+ "LEFT JOIN fa_msme_detail deta ON schm.APPLICATION_ID = deta.APPLICATION_ID\r\n"
				+ "LEFT JOIN master_districts dist ON schm.DISTRICT_ID = dist.DISTRICT_ID\r\n"
				+ "LEFT JOIN master_category cate ON schm.CATEGORY_ID = cate.CATEGORY_ID\r\n"
				+ "LEFT JOIN fa_disbursement_save disbu ON schm.APPLICATION_ID = disbu.application_id\r\n"
				+ "LEFT JOIN fa_scheme_capital_investment invst ON schm.APPLICATION_ID = invst.APPLICATION_ID AND invst.INVESTMENT_NAME = 'Plant & Machinery'\r\n"
				+ "LEFT JOIN common_address addr ON schm.APPLICATION_ID = addr.APPLICATION_ID AND addr.TYPE = 'UNIT_ADDRESS'\r\n"
				+ "LEFT JOIN master_tehsils teh ON teh.TEHSIL_ID = addr.TEHSIL_ID\r\n"
				+ "LEFT JOIN master_blocks blk ON blk.BLOCK_ID = addr.BLOCK_ID\r\n";
		// + "-- Group BY schm.application_id;;";
		/*
		 * sql+="SELECT DISTINCT\r\n"
		 * + "    schm.application_id, \r\n"
		 * + "    unit_or_inst_name,\r\n"
		 * + "    schm.district_id,\r\n"
		 * + "    dist.district_name,\r\n"
		 * + "    unit_mp_empt_gen,\r\n"
		 * + "    unit_mp_obc_empt_gen,\r\n"
		 * + "    unit_mp_sc_empt_gen,\r\n"
		 * + "    unit_mp_st_empt_gen,\r\n"
		 * +
		 * "    DATE_FORMAT(sanction_letter_date, '%d/%m/%y') AS sanction_letter_date,\r\n"
		 * + "    unit_type,\r\n"
		 * + "    schm.category_id,\r\n"
		 * + "    cate.category_name,\r\n"
		 * + "    DATE_FORMAT(disbu.letter_date, '%d/%m/%y') AS letter_date,\r\n"
		 * + "    invst.amount AS amount,\r\n"
		 * + "    CONCAT(addr.ADDRESS1, addr.ADDRESS2, addr.ADDRESS3) AS address1,\r\n"
		 * + "    teh.TEHSIL_NAME AS tehsil_name,\r\n"
		 * + "    blk.BLOCK_NAME AS block_name\r\n"
		 * + "FROM limited_ids\r\n"
		 * +
		 * "JOIN fa_msme_scheme schm ON limited_ids.application_id = schm.application_id\r\n"
		 * +
		 * "LEFT JOIN fa_msme_detail deta ON schm.application_id = deta.APPLICATION_ID\r\n"
		 * +
		 * "LEFT JOIN master_districts dist ON schm.DISTRICT_ID = dist.DISTRICT_ID\r\n"
		 * + "LEFT JOIN master_category cate ON schm.CATEGORY_ID = cate.CATEGORY_ID\r\n"
		 * +
		 * "LEFT JOIN fa_disbursement_save disbu ON schm.application_id = disbu.application_id\r\n"
		 * +
		 * "LEFT JOIN fa_scheme_capital_investment invst ON schm.application_id = invst.APPLICATION_ID AND invst.INVESTMENT_NAME = 'Plant & Machinery'\r\n"
		 * +
		 * "LEFT JOIN common_address addr ON schm.application_id = addr.APPLICATION_ID AND addr.TYPE = 'UNIT_ADDRESS'\r\n"
		 * + "LEFT JOIN master_tehsils teh ON teh.TEHSIL_ID = addr.TEHSIL_ID\r\n"
		 * + "LEFT JOIN master_blocks blk ON blk.BLOCK_ID = addr.BLOCK_ID\r\n";
		 */

		Integer min_val = searchParameter.getStartRecord();
		Integer max_val = searchParameter.getNoOfRows();

		sql += " LIMIT " + max_val + " \r\n";
		// System.out.println(sql);
		Query<Object[]> query = session.createNativeQuery(sql, Object[].class).addScalar("district_id", Long.class)
				.addScalar("district_name", String.class)
				.addScalar("application_id", String.class)
				.addScalar("unit_or_inst_name", String.class)
				.addScalar("district_name", String.class).addScalar("amount", Double.class)
				.addScalar("unit_mp_empt_gen", Integer.class)
				.addScalar("unit_mp_obc_empt_gen", Integer.class)
				.addScalar("unit_mp_sc_empt_gen", Integer.class)
				.addScalar("unit_mp_st_empt_gen", Integer.class)
				.addScalar("sanction_letter_date", String.class)
				.addScalar("category_id", String.class)
				.addScalar("category_name", String.class).addScalar("unit_type", String.class)
				.addScalar("letter_date", String.class).addScalar("address1", String.class)
				.addScalar("tehsil_name", String.class).addScalar("block_name", String.class);

		// JAVA 21 / Hibernate 6: Transformers/ResultTransformer/setResultTransformer are
		// deprecated for removal; setTupleTransformer is the supported API and
		// AliasToBeanTupleTransformer reproduces aliasToBean's mapping exactly.
		return query.setTupleTransformer(new AliasToBeanTupleTransformer<>(FaReportBean.class))
				.getResultList();

	}

	@SuppressWarnings("unchecked")
	public List<FaDistrictWiseReportBean> fetchFaDistrictWiseReportListPageWise(String username, Integer firstResult,
			Integer pageDisplayLength, String colDir, String colName, FaDto searchParameter) {
		Session session = getCurrentSession();
		String sql = null;

		if (searchParameter.getReportType() != null
				&& searchParameter.getReportType().equalsIgnoreCase(MPIndustryConstants.MSME_DETAIL_REPORT)) {
			sql = "select distinct d.DISTRICT_ID as districtId,d.DISTRICT_NAME as districtName,coalesce(count(o.MSME_DETAIL_ID),0) as applicationId from master_districts d "
					+ "	left join msme_detail o on d.DISTRICT_ID=o.UNIT_DISTRICT_ID" + "	 where STATE_ID=20";
		} else {
			sql = "select distinct d.DISTRICT_ID as districtId,d.DISTRICT_NAME as districtName,coalesce(count(o.APPLICATION_ID),0) as applicationId,SUM(CASE WHEN status=1 THEN 1 ELSE 0 END ) as status1,sum(case when status = 2 then 1 else 0 end) as status2,"
					+ "sum(case when status = 3 then  1 else 0 end) as status3,sum(case when status = 4 then 1 else 0 end) as status4,sum(case when status = 5 then 1 else 0 end) as status5,"
					+ "sum(case when status = 6 then 1 else 0 end) as status6,sum(case when status = 7 then 1 else 0 end) as status7,sum(case when status = 8 then 1 else 0 end) as status8,"
					+ "sum(case when status = 9 then 1 else 0 end) as status9,"
					+ "sum(case when status = 10 then 1 else 0 end) as status10,"
					+ "sum(case when status = 11 then 1 else 0 end) as status11,"
					+ "sum(case when status = 12 then 1 else 0 end) as status12 " + " from master_districts d "
					+ " left join fa_msme_scheme o on d.DISTRICT_ID=o.DISTRICT_ID "
					+ " left join  fa_msme_detail fd on o.APPLICATION_ID=fd.APPLICATION_ID "
					+ " left join fa_disbursement_save fds on o.APPLICATION_ID=fds.application_id"
					+ " where STATE_ID=20 ";
		}
		if (searchParameter.getSearch() != null
				&& (searchParameter.getSearch().equals("1") || searchParameter.getSearch().equals("2")
						|| searchParameter.getSearch().equals("3") || searchParameter.getSearch().equals("4"))) {
			String temp = searchParameter.getSearch();
			// System.out.println(temp);
			String searchParam = "";
			if (temp.equals("1"))
				searchParam = "o.created_on";
			else if (temp.equals("2"))
				searchParam = "fd.MEETING_DATE";
			else if (temp.equals("3"))
				searchParam = "fd.sanction_letter_date";
			else if (temp.equals("4"))
				searchParam = "fds.letter_date";
			Date sd = new Date();
			Date fromDate = new Date();
			Date toDate = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			try {
				if (searchParameter.getFromDate() != null) {
					fromDate = dateFormat.parse(searchParameter.getFromDate());
				}
				if (searchParameter.getToDate() != null) {
					toDate = dateFormat.parse(searchParameter.getToDate());
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd");
			sql += " and " + searchParam + " between '" + dateFormat1.format(fromDate) + "' and '"
					+ dateFormat1.format(toDate) + "'";

		}
		if (searchParameter.getAppType() != null
				&& (searchParameter.getAppType().equals("1") || searchParameter.getAppType().equals("2"))) {
			String appType = "";
			if (searchParameter.getAppType().equals("1"))
				appType = "New";
			else
				appType = "Other";
			sql += " and o.unit_type='" + appType + "' ";

		}
		sql += " group by d.DISTRICT_ID order by DISTRICT_NAME";

		// System.out.println(sql);
		if (searchParameter.getReportType() != null
				&& searchParameter.getReportType().equalsIgnoreCase(MPIndustryConstants.MSME_DETAIL_REPORT)) {
			Query<Object[]> query = session.createNativeQuery(sql, Object[].class).addScalar("districtId", Long.class)
					.addScalar("districtName", String.class)
					.addScalar("applicationId", String.class);
			// JAVA 21 / Hibernate 6: setTupleTransformer replaces deprecated setResultTransformer.
			return query.setTupleTransformer(new AliasToBeanTupleTransformer<>(FaDistrictWiseReportBean.class))
					.getResultList();
		} else {
			Query<Object[]> query = session.createNativeQuery(sql, Object[].class).addScalar("districtId", Long.class)
					.addScalar("districtName", String.class)
					.addScalar("applicationId", String.class)
					.addScalar("status1", Integer.class).addScalar("status2", Integer.class)
					.addScalar("status3", Integer.class).addScalar("status4", Integer.class)
					.addScalar("status5", Integer.class).addScalar("status6", Integer.class)
					.addScalar("status7", Integer.class).addScalar("status8", Integer.class)
					.addScalar("status9", Integer.class).addScalar("status10", Integer.class)
					.addScalar("status11", Integer.class)
					.addScalar("status12", Integer.class);

			// JAVA 21 / Hibernate 6: setTupleTransformer replaces deprecated setResultTransformer.
			return query.setTupleTransformer(new AliasToBeanTupleTransformer<>(FaDistrictWiseReportBean.class))
					.getResultList();
		}
	}

	@SuppressWarnings("unchecked")
	public List<FaReportBean> fetchMsmeDetailReportListPageWise(String username, Integer firstResult,
			Integer pageDisplayLength,
			String colDir, String colName, FaDto searchParameter) {
		Session session = getCurrentSession();

		String districtId = "";
		String status = "";
		String sql = null;

		if (searchParameter.getReportType() != null
				&& searchParameter.getReportType().equalsIgnoreCase(MPIndustryConstants.MSME_DETAIL_REPORT)) {

			sql = "select distinct mde.UAM_NUMBER as udyamRegNumber, date_format(mde.UAM_DATE,'%d/%m/%y') as udyamRegDate,"
					+ "mde.MSME_TYPE as msmeType,mde.OWNER_OR_PARTNER_NAME as ownerOrPartnerName,date_format(mde.PRODUCTION_DATE,'%d/%m/%y') as productionDate,"
					+ "date_format(mde.CREATED_ON,'%d/%m/%y') as createdOn from msme_detail mde"
					+ " left join master_districts dist on mde.UNIT_DISTRICT_ID=dist.DISTRICT_ID ";

			if (searchParameter.getDitrictId() != null && searchParameter.getDitrictId() != "") {
				districtId = searchParameter.getDitrictId();
				sql += " where mde.UNIT_DISTRICT_ID=" + districtId;
			}
			/*
			 * if (searchParameter.getStatus() != null && (searchParameter.getStatus() != ""
			 * && !(searchParameter.getStatus().equals("undefined")))) { status =
			 * searchParameter.getStatus(); sql += " and schm.status=" + status; }
			 */
		}
		// if (StringUtils.isNotBlank(searchParameter)) {
		if (searchParameter.getSearch() != null
				&& (searchParameter.getSearch().equals("1") || searchParameter.getSearch().equals("2"))) {
			// System.out.println("000" + searchParameter.getSearch() + "000");
			String temp = searchParameter.getSearch();
			String searchParam = "";
			if (temp.equals("1"))
				searchParam = "sanction_letter_date";
			else
				searchParam = "disbu.letter_date";
			// if (StringUtils.isNotBlank(searchParameter)) {
			Date sd = new Date();
			Date fromDate = new Date();
			Date toDate = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			try {
				// if(StringUtils.isNotBlank(searchParameter))
				if (searchParameter.getFromDate() != null) {
					// sd=dateFormat.parse(searchParameter.trim());
					fromDate = dateFormat.parse(searchParameter.getFromDate());
				}
				if (searchParameter.getToDate() != null) {
					toDate = dateFormat.parse(searchParameter.getToDate());
				}
				// else sd=null;
			} catch (Exception e) {
				e.printStackTrace();
			}
			SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd");
			// sql+= " where Date(sanction_letter_date)= '"+dateFormat1.format(sd)+"'";
			sql += " where " + searchParam + " between '" + dateFormat1.format(fromDate) + "' and '"
					+ dateFormat1.format(toDate) + "'";

			// }
		}

		Integer min_val = searchParameter.getStartRecord();
		Integer max_val = searchParameter.getNoOfRows();
		sql += " limit " + min_val + ", " + max_val;

		// System.out.println(sql);
		Query<Object[]> query = session.createNativeQuery(sql, Object[].class).addScalar("udyamRegNumber", String.class)
				.addScalar("udyamRegDate", String.class).addScalar("msmeType", String.class)
				.addScalar("ownerOrPartnerName", String.class)
				.addScalar("productionDate", String.class)
				.addScalar("createdOn", String.class);

		// .addScalar("industrial", String.class)
		// .addScalar("quality", String.class)
		// .addScalar("patent", String.class)
		// .addScalar("infra", String.class)
		// .addScalar("treatment", String.class)
		// .addScalar("energy", String.class)
		// .addScalar("powerloom", String.class)
		// .addScalar("pharma", String.class);

		// JAVA 21 / Hibernate 6: setTupleTransformer replaces deprecated setResultTransformer.
		//
		// EXISTING BEHAVIOUR PRESERVED (reported separately, NOT fixed here): this method
		// is declared to return List<FaReportBean> but the rows are transformed into
		// MsmeDetailReportBean, and the two classes are unrelated. The old code hid that
		// with an unchecked (List<FaReportBean>) cast; the double cast below reproduces
		// exactly the same runtime objects and the same (unsound) static type, so nothing
		// about the behaviour changes.
		@SuppressWarnings("unchecked")
		List<FaReportBean> rows = (List<FaReportBean>) (List<?>) query
				.setTupleTransformer(new AliasToBeanTupleTransformer<>(MsmeDetailReportBean.class))
				.getResultList();
		return rows;

	}

	@SuppressWarnings("unchecked")
	public List<FaSchemeWiseReportBean> fetchFaSchemeWiseReportListPageWise(String username, Integer firstResult,
			Integer pageDisplayLength, String colDir, String colName, FaDto searchParameter) {
		Session session = getCurrentSession();
		String sql = "select distinct d.DISTRICT_ID as districtId,d.DISTRICT_NAME as districtName,coalesce(count(o.APPLICATION_ID),0) as applicationId,count(faa.APPLICATION_ID) as industrial, "
				+ "count(fqa.APPLICATION_ID) as quality,count(frp.application_id) as patent, count(fainfra.APPLICATION_ID) as infra,count(fawaste.APPLICATION_ID) as waste, "
				+ "count(faenergy.APPLICATION_ID) as energy,count(fapower.application_id) as power,count(fapharma.application_id) as pharma "
				+ "from master_districts d left join fa_msme_scheme o on d.DISTRICT_ID=o.DISTRICT_ID "
				+ "left join fa_capital_assistance faa on o.APPLICATION_ID=faa.APPLICATION_ID "
				+ "left join fa_quality_assistance fqa on o.APPLICATION_ID=fqa.APPLICATION_ID "
				+ "left join fa_reimbursement_patents frp on o.APPLICATION_ID=frp.application_id "
				+ "left join fa_infra_dev_exp_compensation fainfra on o.APPLICATION_ID=fainfra.APPLICATION_ID "
				+ "left join fa_waste_mgmt_estb_exp_comp fawaste on o.APPLICATION_ID=fawaste.APPLICATION_ID "
				+ "left join fa_energy_audit_assistance faenergy on o.APPLICATION_ID=faenergy.application_id "
				+ "left join fa_powerloom_upgradation fapower on o.APPLICATION_ID=fapower.APPLICATION_ID "
				+ "left join fa_pharma_lab_assistance fapharma on o.APPLICATION_ID=fapharma.application_id where STATE_ID=20";

		if (searchParameter.getSearch() != null
				&& (searchParameter.getSearch().equals("1") || searchParameter.getSearch().equals("2")
						|| searchParameter.getSearch().equals("3") || searchParameter.getSearch().equals("4"))) {
			String temp = searchParameter.getSearch();
			// System.out.println(temp);
			String searchParam = "";
			if (temp.equals("1"))
				searchParam = "o.created_on";
			else if (temp.equals("2"))
				searchParam = "fd.MEETING_DATE";
			else if (temp.equals("3"))
				searchParam = "fd.sanction_letter_date";
			else if (temp.equals("4"))
				searchParam = "fds.letter_date";
			Date sd = new Date();
			Date fromDate = new Date();
			Date toDate = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			try {
				if (searchParameter.getFromDate() != null) {
					fromDate = dateFormat.parse(searchParameter.getFromDate());
				}
				if (searchParameter.getToDate() != null) {
					toDate = dateFormat.parse(searchParameter.getToDate());
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd");
			sql += " and " + searchParam + " between '" + dateFormat1.format(fromDate) + "' and '"
					+ dateFormat1.format(toDate) + "'";

		}
		if (searchParameter.getAppType() != null
				&& (searchParameter.getAppType().equals("1") || searchParameter.getAppType().equals("2"))) {
			String appType = "";
			if (searchParameter.getAppType().equals("1"))
				appType = "New";
			else
				appType = "Other";
			sql += " and o.unit_type='" + appType + "' ";

		}
		sql += " group by d.DISTRICT_ID order by DISTRICT_NAME";

		// System.out.println(sql);
		Query<Object[]> query = session.createNativeQuery(sql, Object[].class).addScalar("districtId", Long.class)
				.addScalar("districtName", String.class)
				.addScalar("applicationId", Integer.class)
				.addScalar("industrial", Integer.class).addScalar("quality", Integer.class)
				.addScalar("patent", Integer.class).addScalar("infra", Integer.class)
				.addScalar("waste", Integer.class).addScalar("energy", Integer.class)
				.addScalar("power", Integer.class).addScalar("pharma", Integer.class);

		// JAVA 21 / Hibernate 6: setTupleTransformer replaces deprecated setResultTransformer.
		return query.setTupleTransformer(new AliasToBeanTupleTransformer<>(FaSchemeWiseReportBean.class))
				.getResultList();

	}

	@SuppressWarnings("unchecked")
	public int getNoOfRows(String username, FaDto searchParameter) {
		Session session = getCurrentSession();
		String districtId = "";
		String status = "";
		String sql = "select count(distinct schm.application_id) " + "from fa_msme_scheme schm  "
				+ "left join  fa_msme_detail deta on schm.APPLICATION_ID=deta.APPLICATION_ID "
				+ " left join master_districts d on schm.DISTRICT_ID=d.DISTRICT_ID "
				+ "left join master_category cate on schm.CATEGORY_ID=cate.CATEGORY_ID "
				+ "left join fa_disbursement_save disbu on schm.APPLICATION_ID=disbu.application_id "
				+ "left join fa_scheme_capital_investment invst on schm.APPLICATION_ID=invst.APPLICATION_ID and invst.INVESTMENT_NAME='Plant & Machinery' "
				+ " left join common_address addr on schm.APPLICATION_ID=addr.APPLICATION_ID  and  addr.TYPE='UNIT_ADDRESS'  \r\n"
				// + "left join common_address addr on schm.APPLICATION_ID=addr.APPLICATION_ID "
				+ " where ";

		if (searchParameter.getDitrictId() != null && searchParameter.getDitrictId() != "") {
			districtId = searchParameter.getDitrictId();
			sql += " schm.DISTRICT_ID=" + districtId;
		}
		if (searchParameter.getStatus() != null
				&& (searchParameter.getStatus() != "" && !(searchParameter.getStatus().equals("undefined")))) {
			status = searchParameter.getStatus();
			sql += " and schm.status=" + status;
		}

		if (searchParameter.getSearch() != null
				&& (searchParameter.getSearch().equals("1") || searchParameter.getSearch().equals("2")
						|| searchParameter.getSearch().equals("3") || searchParameter.getSearch().equals("4"))) {
			String temp = searchParameter.getSearch();
			// System.out.println(temp);
			String searchParam = "";
			if (temp.equals("1"))
				searchParam = "o.created_on";
			else if (temp.equals("2"))
				searchParam = "fd.MEETING_DATE";
			else if (temp.equals("3"))
				searchParam = "fd.sanction_letter_date";
			else if (temp.equals("4"))
				searchParam = "fds.letter_date";
			Date sd = new Date();
			Date fromDate = new Date();
			Date toDate = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			try {
				if (searchParameter.getFromDate() != null) {
					fromDate = dateFormat.parse(searchParameter.getFromDate());
				}
				if (searchParameter.getToDate() != null) {
					toDate = dateFormat.parse(searchParameter.getToDate());
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd");
			sql += " and " + searchParam + " between '" + dateFormat1.format(fromDate) + "' and '"
					+ dateFormat1.format(toDate) + "'";

		}
		sql += " group by d.DISTRICT_ID and schm.application_id order by DISTRICT_NAME";

		// // System.out.println(sql);
		Query<Long> query = session.createNativeQuery(sql, Long.class); // JAVA 21: typed createNativeQuery (COUNT -> Long)
		Number bi = (Number) query.uniqueResult();
		if (bi != null)
			return bi.intValue();
		else
			return 0;

	}

	public Integer fetchFACountNo(String username, String searchParameter) {
		Session session = getCurrentSession();
		String applicationId = "%" + "" + "%";
		if (StringUtils.isNotBlank(searchParameter)) {
			applicationId = "%" + searchParameter + "%";
		}

		Query<Long> query = session.createNativeQuery("select count(distinct schm.APPLICATION_ID)\r\n"
				+ "					from fa_msme_scheme schm \r\n"
				+ "					left join common_address addrs on schm.APPLICATION_ID=addrs.APPLICATION_ID\r\n"
				+ "					left join  fa_msme_detail deta on schm.APPLICATION_ID=deta.APPLICATION_ID\r\n"
				+ "					left join fa_scheme_capital_investment invst on schm.APPLICATION_ID=invst.APPLICATION_ID and invst.INVESTMENT_NAME='"
				+ "Plant & Machinery" + "'"
				+ "					left join master_districts dist on addrs.DISTRICT_ID=dist.DISTRICT_ID\r\n"
				+ "					left join master_tehsils tehsil on addrs.TEHSIL_ID=tehsil.TEHSIL_ID\r\n"
				+ "					left join master_tehsils_blocks tehblk on addrs.TEHSIL_BLOCK_ID=tehblk.TEHSIL_BLOCK_ID \r\n"
				+ "					left join master_category cate on schm.CATEGORY_ID=cate.CATEGORY_ID "
				+ "left join fa_disbursement_save disbu on schm.APPLICATION_ID=disbu.application_id", Long.class); // JAVA 21: typed createNativeQuery (COUNT -> Long)

		Number bi = (Number) query.uniqueResult();
		// Query query = session.createNativeQuery("SELECT count(*) from fa_msme_scheme
		// inner join fa_master_status on MASTER_STATUS_ID=STATUS where
		// created_by=COALESCE(:createdBy, CREATED_BY) and
		// ESTABLISHMENT_TYPE=COALESCE(:establishmentType, ESTABLISHMENT_TYPE) and
		// APPLICATION_ID like :applicationId and status>0")
		// .setString("createdBy", username).setString("establishmentType",
		// establishmentType).setString("applicationId", applicationId);
		// BigInteger bi=(BigInteger) query.uniqueResult();
		// // System.out.println("count is "+bi);
		return bi.intValue();

	}

	@SuppressWarnings("unchecked")
	public List<FaReportBean> fetchFaSchemeReportListPageWise(String username, Integer firstResult,
			Integer pageDisplayLength, String colDir, String colName, FaDto searchParameter) {
		Session session = getCurrentSession();

		String sql1 = "";
		String districtId = "";
		if (searchParameter.getSchemeName().equals("industrial")) {
			sql1 = " fa_capital_assistance ";
		}
		if (searchParameter.getSchemeName().equals("quality")) {
			sql1 = " fa_quality_assistance ";
		}
		if (searchParameter.getSchemeName().equals("patent")) {
			sql1 = " fa_reimbursement_patents";
		}
		if (searchParameter.getSchemeName().equals("infra")) {
			sql1 = " fa_infra_dev_exp_compensation";
		}
		if (searchParameter.getSchemeName().equals("waste")) {
			sql1 = " fa_waste_mgmt_estb_exp_comp";
		}
		if (searchParameter.getSchemeName().equals("energy")) {
			sql1 = " fa_energy_audit_assistance";
		}
		if (searchParameter.getSchemeName().equals("power")) {
			sql1 = " fa_powerloom_upgradation";
		}
		if (searchParameter.getSchemeName().equals("pharma")) {
			sql1 = " fa_pharma_lab_assistance";
		}
		String sql = "select distinct facap.application_id, unit_or_inst_name,schm.district_id,dist.district_name,"
				+ "unit_mp_empt_gen,unit_mp_obc_empt_gen,unit_mp_sc_empt_gen,unit_mp_st_empt_gen,"
				+ "date_format(sanction_letter_date,'%d/%m/%y') as sanction_letter_date,"
				+ "schm.category_id,cate.category_name ,"
				+ "date_format(disbu.letter_date,'%d/%m/%y') as letter_date , invst.amount as amount"
				+ ",concat(addr.ADDRESS1,addr.ADDRESS2) as address1,teh.TEHSIL_NAME as tehsil_name,blk.BLOCK_NAME as block_name"
				+ " from " + sql1
				// + " from fa_msme_scheme schm "

				+ " facap left join fa_msme_scheme schm on schm.APPLICATION_ID=facap.APPLICATION_ID "
				+ "left join  fa_msme_detail deta on schm.APPLICATION_ID=deta.APPLICATION_ID "
				+ "left join master_districts dist on schm.DISTRICT_ID=dist.DISTRICT_ID "
				+ "left join master_category cate on schm.CATEGORY_ID=cate.CATEGORY_ID "
				+ "left join fa_disbursement_save disbu on schm.APPLICATION_ID=disbu.application_id "
				+ "left join fa_scheme_capital_investment invst on schm.APPLICATION_ID=invst.APPLICATION_ID and invst.INVESTMENT_NAME='Plant & Machinery' "
				+ " left join common_address addr on schm.APPLICATION_ID=addr.APPLICATION_ID\r\n"
				+ " left join master_tehsils teh on teh.TEHSIL_ID=addr.TEHSIL_ID\r\n"
				+ " left join master_blocks blk on blk.BLOCK_ID=addr.BLOCK_ID\r\n"
				+ " where  addr.TYPE='UNIT_ADDRESS' ";

		if (searchParameter.getDitrictId() != null && searchParameter.getDitrictId() != "") {
			districtId = searchParameter.getDitrictId();
			sql += " and schm.DISTRICT_ID=" + districtId;
		}
		// if (StringUtils.isNotBlank(searchParameter)) {
		if (searchParameter.getSearch() != null
				&& (searchParameter.getSearch().equals("1") || searchParameter.getSearch().equals("2"))) {
			// System.out.println("000" + searchParameter.getSearch() + "000");
			String temp = searchParameter.getSearch();
			String searchParam = "";
			if (temp.equals("1"))
				searchParam = "sanction_letter_date";
			else
				searchParam = "disbu.letter_date";
			// if (StringUtils.isNotBlank(searchParameter)) {
			Date sd = new Date();
			Date fromDate = new Date();
			Date toDate = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			try {
				// if(StringUtils.isNotBlank(searchParameter))
				if (searchParameter.getFromDate() != null) {
					// sd=dateFormat.parse(searchParameter.trim());
					fromDate = dateFormat.parse(searchParameter.getFromDate());
				}
				if (searchParameter.getToDate() != null) {
					toDate = dateFormat.parse(searchParameter.getToDate());
				}
				// else sd=null;
			} catch (Exception e) {
				e.printStackTrace();
			}
			SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd");
			// sql+= " where Date(sanction_letter_date)= '"+dateFormat1.format(sd)+"'";
			sql += " where " + searchParam + " between '" + dateFormat1.format(fromDate) + "' and '"
					+ dateFormat1.format(toDate) + "'";

			// }
		}

		Integer min_val = searchParameter.getStartRecord();
		Integer max_val = searchParameter.getNoOfRows();
		// sql += " limit " + min_val + ", " + max_val;
		sql += " limit " + max_val;
		// System.out.println(sql);
		Query<Object[]> query = session.createNativeQuery(sql, Object[].class).addScalar("district_id", Long.class)
				.addScalar("district_name", String.class)
				.addScalar("application_id", String.class)
				.addScalar("unit_or_inst_name", String.class)
				.addScalar("district_name", String.class).addScalar("address1", String.class)
				// .addScalar("address2", String.class)
				// .addScalar("address3", String.class)
				// .addScalar("tehsil_id", String.class)
				.addScalar("tehsil_name", String.class)
				// .addScalar("tehsil_block_id", String.class)
				.addScalar("block_name", String.class).addScalar("amount", Double.class)
				.addScalar("unit_mp_empt_gen", Integer.class)
				.addScalar("unit_mp_obc_empt_gen", Integer.class)
				.addScalar("unit_mp_sc_empt_gen", Integer.class)
				.addScalar("unit_mp_st_empt_gen", Integer.class)
				.addScalar("sanction_letter_date", String.class)
				.addScalar("category_id", String.class)
				.addScalar("category_name", String.class)
				// .addScalar("unit_type", String.class)
				.addScalar("letter_date", String.class);
		// .addScalar("industrial", String.class)
		// .addScalar("quality", String.class)
		// .addScalar("patent", String.class)
		// .addScalar("infra", String.class)
		// .addScalar("treatment", String.class)
		// .addScalar("energy", String.class)
		// .addScalar("powerloom", String.class)
		// .addScalar("pharma", String.class);

		// JAVA 21 / Hibernate 6: Transformers/ResultTransformer/setResultTransformer are
		// deprecated for removal; setTupleTransformer is the supported API and
		// AliasToBeanTupleTransformer reproduces aliasToBean's mapping exactly.
		return query.setTupleTransformer(new AliasToBeanTupleTransformer<>(FaReportBean.class))
				.getResultList();

	}

	// @SuppressWarnings("unchecked")
	// public int getNoOfRowsSchemWise(String username, FaDto searchParameter) {
	// Session session = getCurrentSession();
	// try {
	// String sql1 = "";
	// String districtId = "";
	// if (searchParameter.getSchemeName().equals("industrial")) {
	// sql1 = " fa_capital_assistance ";
	// }
	// if (searchParameter.getSchemeName().equals("quality")) {
	// sql1 = " fa_quality_assistance ";
	// }
	// if (searchParameter.getSchemeName().equals("patent")) {
	// sql1 = " fa_reimbursement_patents";
	// }
	// if (searchParameter.getSchemeName().equals("infra")) {
	// sql1 = " fa_infra_dev_exp_compensation";
	// }
	// if (searchParameter.getSchemeName().equals("waste")) {
	// sql1 = " fa_waste_mgmt_estb_exp_comp";
	// }
	// if (searchParameter.getSchemeName().equals("energy")) {
	// sql1 = " fa_energy_audit_assistance";
	// }
	// if (searchParameter.getSchemeName().equals("power")) {
	// sql1 = " fa_powerloom_upgradation";
	// }
	// if (searchParameter.getSchemeName().equals("pharma")) {
	// sql1 = " fa_pharma_lab_assistance";
	// }
	// String sql = "select count(distinct facap.application_id) from" + sql1
	// + " facap left join fa_msme_scheme schm on
	// schm.APPLICATION_ID=facap.APPLICATION_ID "
	// + "left join fa_msme_detail deta on schm.APPLICATION_ID=deta.APPLICATION_ID "
	// + "left join master_districts dist on schm.DISTRICT_ID=dist.DISTRICT_ID "
	// + "left join master_category cate on schm.CATEGORY_ID=cate.CATEGORY_ID "
	// + "left join fa_disbursement_save disbu on
	// schm.APPLICATION_ID=disbu.application_id "
	// + "left join fa_scheme_capital_investment invst on
	// schm.APPLICATION_ID=invst.APPLICATION_ID and invst.INVESTMENT_NAME='Plant &
	// Machinery' ";
	//
	// if (searchParameter.getDitrictId() != null && searchParameter.getDitrictId()
	// != "") {
	// districtId = searchParameter.getDitrictId();
	// sql += " where schm.DISTRICT_ID=" + districtId;
	// }
	//
	// // System.out.println(sql);
	// Query query = session.createNativeQuery(sql);
	// Number bi = (Number) query.uniqueResult();
	// if (bi != null)
	// return bi.intValue();
	// else
	// return 0;
	//
	// }
	// }
	@SuppressWarnings("unchecked")
	public int getNoOfRowsSchemWise(String username, FaDto searchParameter) {
		Session session = getCurrentSession();
		String sql1 = "";
		String districtId = "";
		if (searchParameter.getSchemeName().equals("industrial")) {
			sql1 = " fa_capital_assistance  ";
		}
		if (searchParameter.getSchemeName().equals("quality")) {
			sql1 = " fa_quality_assistance  ";
		}
		if (searchParameter.getSchemeName().equals("patent")) {
			sql1 = " fa_reimbursement_patents";
		}
		if (searchParameter.getSchemeName().equals("infra")) {
			sql1 = " fa_infra_dev_exp_compensation";
		}
		if (searchParameter.getSchemeName().equals("waste")) {
			sql1 = " fa_waste_mgmt_estb_exp_comp";
		}
		if (searchParameter.getSchemeName().equals("energy")) {
			sql1 = " fa_energy_audit_assistance";
		}
		if (searchParameter.getSchemeName().equals("power")) {
			sql1 = " fa_powerloom_upgradation";
		}
		if (searchParameter.getSchemeName().equals("pharma")) {
			sql1 = " fa_pharma_lab_assistance";
		}
		/*
		 * String sql = "select  count(distinct facap.application_id) from" + sql1
		 * +
		 * " facap left join fa_msme_scheme schm on schm.APPLICATION_ID=facap.APPLICATION_ID "
		 * +
		 * "left join  fa_msme_detail deta on schm.APPLICATION_ID=deta.APPLICATION_ID "
		 * + "left join master_districts dist on schm.DISTRICT_ID=dist.DISTRICT_ID "
		 * + "left join master_category cate on schm.CATEGORY_ID=cate.CATEGORY_ID "
		 * +
		 * "left join fa_disbursement_save disbu on schm.APPLICATION_ID=disbu.application_id "
		 * +
		 * "left join fa_scheme_capital_investment invst on schm.APPLICATION_ID=invst.APPLICATION_ID and invst.INVESTMENT_NAME='Plant & Machinery' "
		 * ;
		 */
		String sql = "SELECT COUNT(*)\r\n" + "FROM (\r\n" + "    SELECT facap   .application_id\r\n" + "    FROM  "
				+ sql1 + "   facap \r\n"
				+ "    LEFT JOIN fa_msme_scheme schm ON schm.APPLICATION_ID = facap.APPLICATION_ID \r\n"
				+ "    LEFT JOIN fa_msme_detail deta ON schm.APPLICATION_ID = deta.APPLICATION_ID \r\n"
				+ "    LEFT JOIN master_districts dist ON schm.DISTRICT_ID = dist.DISTRICT_ID \r\n"
				+ "    LEFT JOIN master_category cate ON schm.CATEGORY_ID = cate.CATEGORY_ID \r\n"
				+ "    LEFT JOIN fa_disbursement_save disbu ON schm.APPLICATION_ID = disbu.application_id \r\n"
				+ "    LEFT JOIN fa_scheme_capital_investment invst ON schm.APPLICATION_ID = invst.APPLICATION_ID AND invst.INVESTMENT_NAME = 'Plant & Machinery' \r\n";

		// + " where schm.DISTRICT_ID=447 GROUP BY facap .application_id\r\n"
		// + ") AS subquery;";

		if (searchParameter.getDitrictId() != null && searchParameter.getDitrictId() != "") {
			districtId = searchParameter.getDitrictId();
			sql += " where schm.DISTRICT_ID=" + districtId;
		}
		sql += "    GROUP BY facap.application_id\r\n" + ") AS subquery;";
		// System.out.println(sql);
		Query<Long> query = session.createNativeQuery(sql, Long.class); // JAVA 21: typed createNativeQuery (COUNT -> Long)
		Number bi = (Number) query.uniqueResult();
		if (bi != null)
			return bi.intValue();
		else
			return 0;

	}

	@SuppressWarnings("unchecked")
	public List<FASanctionedVsDisbursementReportBean> fetchFaSanctionedVsDisbursementReport(FaDto searchParameter) {
		Session session = getCurrentSession();

		String sql1 = "";
		String sql = "SELECT d.DISTRICT_ID as districtId, d.district_name as districtName, COUNT(dt.APPLICATION_ID) as count1,"
				+ "SUM(dt.Indust_Subsidy_Sanction_Amt) as amount1,\r\n"
				+ "COALESCE(db.count, 0) as count2,COALESCE(db.disbursement_amt, 0) as amount2\r\n"
				+ "FROM master_districts d\r\n"
				+ "LEFT JOIN fa_msme_scheme schm ON d.DISTRICT_ID = schm.DISTRICT_ID\r\n"
				+ "LEFT JOIN fa_msme_detail dt ON schm.APPLICATION_ID = dt.APPLICATION_ID\r\n"
				+ "LEFT JOIN ( SELECT application_id, COUNT(*) as count,SUM(disbursement_amt) as disbursement_amt FROM fa_disbursement_save\r\n"
				+ "GROUP BY application_id ) db ON dt.APPLICATION_ID = db.application_id\r\n" + "WHERE d.STATE_ID = 20 "
				+ "";
		if (searchParameter.getSearch() != null
				&& (searchParameter.getSearch().equals("1") || searchParameter.getSearch().equals("2")
						|| searchParameter.getSearch().equals("3") || searchParameter.getSearch().equals("4"))) {
			String temp = searchParameter.getSearch();
			// System.out.println(temp);
			String searchParam = "";
			if (temp.equals("1"))
				searchParam = "schm.created_on";
			else if (temp.equals("2"))
				searchParam = "dt.MEETING_DATE";
			else if (temp.equals("3"))
				searchParam = "dt.sanction_letter_date";
			else if (temp.equals("4"))
				searchParam = "db.letter_date";
			Date sd = new Date();
			Date fromDate = new Date();
			Date toDate = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			try {
				if (searchParameter.getFromDate() != null) {
					fromDate = dateFormat.parse(searchParameter.getFromDate());
				}
				if (searchParameter.getToDate() != null) {
					toDate = dateFormat.parse(searchParameter.getToDate());
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd");
			sql += " and " + searchParam + " between '" + dateFormat1.format(fromDate) + "' and '"
					+ dateFormat1.format(toDate) + "'";

		}
		if (searchParameter.getAppType() != null
				&& (searchParameter.getAppType().equals("1") || searchParameter.getAppType().equals("2"))) {
			String appType = "";
			if (searchParameter.getAppType().equals("1"))
				appType = "New";
			else
				appType = "Other";
			sql += " and schm.unit_type='" + appType + "' ";

		}

		/*
		 * Integer min_val = searchParameter.getStartRecord(); Integer max_val =
		 * searchParameter.getNoOfRows(); sql += " limit " + min_val + ", " + max_val;
		 */
		sql += "GROUP BY d.district_name ORDER BY d.district_name;";
		// System.out.println(sql);
		Query<Object[]> query = session.createNativeQuery(sql, Object[].class).addScalar("districtId", Long.class)
				.addScalar("districtName", String.class).addScalar("count1", Integer.class)
				.addScalar("amount1", Double.class).addScalar("count2", Integer.class)
				.addScalar("amount2", Double.class);
		;

		// JAVA 21 / Hibernate 6: setTupleTransformer replaces deprecated setResultTransformer.
		return query.setTupleTransformer(
				new AliasToBeanTupleTransformer<>(FASanctionedVsDisbursementReportBean.class))
				.getResultList();

	}

	@SuppressWarnings("unchecked")
	public List<FaMasterStartupStatus> fetchMasterStartupStatus() {
		// TODO Auto-generated method stub

		Session session = getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMasterStartupStatus> cq = cb.createQuery(FaMasterStartupStatus.class);
		cq.from(FaMasterStartupStatus.class);
		
		return session.createQuery(cq).getResultList();

	}

	@SuppressWarnings("unchecked")
	public List<FaStartupDetails> fetchStartupUSerDetailsListPageWiseNew(String username, Integer firstResult,
			Integer pageDisplayLength, String getsColDir, String getsColName, FaDto searchParameter) {

		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupDetails> cq = cb.createQuery(FaStartupDetails.class);
		Root<FaStartupDetails> root = cq.from(FaStartupDetails.class);
		Join<Object, Object> statusJoin = root.join("status");

		List<Predicate> predicates = new ArrayList<>();

		// Order by submittedDate descending
		cq.orderBy(cb.desc(root.get("submittedDate")));

		// Status filter
		Long sStatus = 0L;
		if (searchParameter.getStatus() != null && !(searchParameter.getStatus().equals("{{s.masterStatusId}}"))
				&& !(searchParameter.getStatus().equals(""))) {
			sStatus = Long.valueOf(searchParameter.getStatus());
			predicates.add(cb.equal(statusJoin.get("statusId"), sStatus));
		} else {
			predicates.add(cb.notEqual(statusJoin.get("statusId"), 0L));
		}

		// Date range filter
		if ((searchParameter.getFromDate() != null && searchParameter.getToDate() != null)
				&& (!searchParameter.getFromDate().equals("") && !searchParameter.getToDate().equals(""))) {
			Date fromDate = new Date();
			Date toDate = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			try {
				if (searchParameter.getFromDate() != null) {
					fromDate = dateFormat.parse(searchParameter.getFromDate());
				}
				if (searchParameter.getToDate() != null) {
					toDate = dateFormat.parse(searchParameter.getToDate());
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			predicates.add(cb.between(root.get("submittedDate"), fromDate, toDate));
		}

		// Search filter
		if (StringUtils.isNotEmpty(searchParameter.getSearch())) {
			predicates.add(cb.like(root.get("nameOfEntity"), searchParameter.getSearch() + "%"));
		}

		if (!predicates.isEmpty()) {
			cq.where(cb.and(predicates.toArray(new Predicate[0])));
		}

		return session.createQuery(cq)
				.setFirstResult(searchParameter.getStartRecord())
				.setMaxResults(searchParameter.getNoOfRows())
				.getResultList();

	}

	@SuppressWarnings("unchecked")
	public Integer fetchCountStartupUSerDetailsListPageWiseNew(String username, String searchParameter) {

		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupDetails> cq = cb.createQuery(FaStartupDetails.class);
		Root<FaStartupDetails> root = cq.from(FaStartupDetails.class);

		cq.orderBy(cb.desc(root.get("createdOn")));

		if (StringUtils.isNotEmpty(searchParameter)) {
			cq.where(cb.like(root.get("nameOfEntity"), searchParameter + "%"));
		}

		return session.createQuery(cq).getResultList().size();

	}

	@SuppressWarnings("unchecked")
	public Integer fetchNoofRowstStartupUSerDetailsListPageWiseNew(String username, FaDto searchParameter) {

		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupDetails> cq = cb.createQuery(FaStartupDetails.class);
		Root<FaStartupDetails> root = cq.from(FaStartupDetails.class);
		Join<Object, Object> statusJoin = root.join("status");

		List<Predicate> predicates = new ArrayList<>();

		cq.orderBy(cb.desc(root.get("createdOn")));

		// Status filter
		Long sStatus = 0L;
		if (searchParameter.getStatus() != null && !(searchParameter.getStatus().equals("{{s.masterStatusId}}"))
				&& !(searchParameter.getStatus().equals(""))) {
			sStatus = Long.valueOf(searchParameter.getStatus());
			predicates.add(cb.equal(statusJoin.get("statusId"), sStatus));
		} else {
			predicates.add(cb.notEqual(statusJoin.get("statusId"), 0L));
		}

		// Date range filter
		if ((searchParameter.getFromDate() != null && searchParameter.getToDate() != null)
				&& (!searchParameter.getFromDate().equals("") && !searchParameter.getToDate().equals(""))) {
			Date fromDate = new Date();
			Date toDate = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			try {
				if (searchParameter.getFromDate() != null) {
					fromDate = dateFormat.parse(searchParameter.getFromDate());
				}
				if (searchParameter.getToDate() != null) {
					toDate = dateFormat.parse(searchParameter.getToDate());
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			predicates.add(cb.between(root.get("submittedDate"), fromDate, toDate));
		}

		// Search filter
		if (StringUtils.isNotEmpty(searchParameter.getSearch())) {
			predicates.add(cb.like(root.get("nameOfEntity"), searchParameter.getSearch() + "%"));
		}

		if (!predicates.isEmpty()) {
			cq.where(cb.and(predicates.toArray(new Predicate[0])));
		}

		return session.createQuery(cq).getResultList().size();

	}

	@SuppressWarnings("unchecked")
	public Integer getNoOfRowsStartup(String username, FaDto searchParameter) {

		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaStartupDetails> cq = cb.createQuery(FaStartupDetails.class);
		Root<FaStartupDetails> root = cq.from(FaStartupDetails.class);
		Join<Object, Object> statusJoin = root.join("status");

		List<Predicate> predicates = new ArrayList<>();

		cq.orderBy(cb.desc(root.get("createdOn")));

		// Search filter
		if (StringUtils.isNotEmpty(searchParameter.getSearch())) {
			predicates.add(cb.like(root.get("nameOfEntity"), searchParameter.getSearch() + "%"));
		}

		// Status filter
		Long sStatus = 0L;
		if (searchParameter.getStatus() != null && !(searchParameter.getStatus().equals("{{s.masterStatusId}}"))
				&& !(searchParameter.getStatus().equals(""))) {
			sStatus = Long.valueOf(searchParameter.getStatus());
			predicates.add(cb.equal(statusJoin.get("statusId"), sStatus));
		} else {
			predicates.add(cb.notEqual(statusJoin.get("statusId"), 0L));
		}

		// Date range filter
		if ((searchParameter.getFromDate() != null && searchParameter.getToDate() != null)
				&& (!searchParameter.getFromDate().equals("") && !searchParameter.getToDate().equals(""))) {
			Date fromDate = new Date();
			Date toDate = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			try {
				if (searchParameter.getFromDate() != null) {
					fromDate = dateFormat.parse(searchParameter.getFromDate());
				}
				if (searchParameter.getToDate() != null) {
					toDate = dateFormat.parse(searchParameter.getToDate());
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			predicates.add(cb.between(root.get("submittedDate"), fromDate, toDate));
		}

		if (!predicates.isEmpty()) {
			cq.where(cb.and(predicates.toArray(new Predicate[0])));
		}

		return session.createQuery(cq).getResultList().size();

	}

	// export to excel
	@SuppressWarnings("unchecked")
	public List<FaReportBean> fetchFaReportListPageWiseExport(String username, Integer firstResult,
			Integer pageDisplayLength,
			String colDir, String colName, FaDto searchParameter) {
		Session session = getCurrentSession();

		String districtId = "";
		String status = "";

		String sql = "select distinct schm.application_id, unit_or_inst_name,schm.district_id,dist.district_name,"
				+ "unit_mp_empt_gen,unit_mp_obc_empt_gen,unit_mp_sc_empt_gen,unit_mp_st_empt_gen,"
				+ "date_format(sanction_letter_date,'%d/%m/%y') as sanction_letter_date,"
				+ "unit_type,schm.category_id,cate.category_name ,"
				+ "date_format(disbu.letter_date,'%d/%m/%y') as letter_date , invst.amount as amount "
				+ " ,concat(addr.ADDRESS1,addr.ADDRESS2,addr.ADDRESS3) as address1,teh.TEHSIL_NAME as tehsil_name,blk.BLOCK_NAME as block_name"
				+ " from fa_msme_scheme schm  "
				+ "left join  fa_msme_detail deta on schm.APPLICATION_ID=deta.APPLICATION_ID "
				+ "left join master_districts dist on schm.DISTRICT_ID=dist.DISTRICT_ID "
				+ "left join master_category cate on schm.CATEGORY_ID=cate.CATEGORY_ID "
				+ "left join fa_disbursement_save disbu on schm.APPLICATION_ID=disbu.application_id "
				+ "left join fa_scheme_capital_investment invst on schm.APPLICATION_ID=invst.APPLICATION_ID and invst.INVESTMENT_NAME='Plant & Machinery' "
				+ " left join common_address addr on schm.APPLICATION_ID=addr.APPLICATION_ID\r\n"
				+ " left join master_tehsils teh on teh.TEHSIL_ID=addr.TEHSIL_ID\r\n"
				+ " left join master_blocks blk on blk.BLOCK_ID=addr.BLOCK_ID\r\n"
				+ " where  addr.TYPE='UNIT_ADDRESS' ";
		if (searchParameter.getDitrictId() != null && searchParameter.getDitrictId() != "") {
			districtId = searchParameter.getDitrictId();
			sql += "and schm.DISTRICT_ID=" + districtId;
		}
		if (searchParameter.getStatus() != null
				&& (searchParameter.getStatus() != "" && !(searchParameter.getStatus().equals("undefined")))) {
			status = searchParameter.getStatus();
			sql += " and schm.status=" + status;
		}

		// if (StringUtils.isNotBlank(searchParameter)) {
		if (searchParameter.getSearch() != null
				&& (searchParameter.getSearch().equals("1") || searchParameter.getSearch().equals("2"))) {
			// System.out.println("000" + searchParameter.getSearch() + "000");
			String temp = searchParameter.getSearch();
			String searchParam = "";
			if (temp.equals("1"))
				searchParam = "sanction_letter_date";
			else
				searchParam = "disbu.letter_date";
			// if (StringUtils.isNotBlank(searchParameter)) {
			Date sd = new Date();
			Date fromDate = new Date();
			Date toDate = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			try {
				// if(StringUtils.isNotBlank(searchParameter))
				if (searchParameter.getFromDate() != null) {
					// sd=dateFormat.parse(searchParameter.trim());
					fromDate = dateFormat.parse(searchParameter.getFromDate());
				}
				if (searchParameter.getToDate() != null) {
					toDate = dateFormat.parse(searchParameter.getToDate());
				}
				// else sd=null;
			} catch (Exception e) {
				e.printStackTrace();
			}
			SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd");
			// sql+= " where Date(sanction_letter_date)= '"+dateFormat1.format(sd)+"'";
			sql += " where " + searchParam + " between '" + dateFormat1.format(fromDate) + "' and '"
					+ dateFormat1.format(toDate) + "'";

			// }
		}

		/*
		 * Integer min_val = searchParameter.getStartRecord();
		 * Integer max_val = searchParameter.getNoOfRows();
		 * sql += " limit " + min_val + ", " + max_val;
		 */

		// System.out.println(sql);
		Query<Object[]> query = session.createNativeQuery(sql, Object[].class).addScalar("district_id", Long.class)
				.addScalar("district_name", String.class)
				.addScalar("application_id", String.class)
				.addScalar("unit_or_inst_name", String.class)
				.addScalar("district_name", String.class).addScalar("amount", Double.class)
				.addScalar("unit_mp_empt_gen", Integer.class)
				.addScalar("unit_mp_obc_empt_gen", Integer.class)
				.addScalar("unit_mp_sc_empt_gen", Integer.class)
				.addScalar("unit_mp_st_empt_gen", Integer.class)
				.addScalar("sanction_letter_date", String.class)
				.addScalar("category_id", String.class)
				.addScalar("category_name", String.class).addScalar("unit_type", String.class)
				.addScalar("letter_date", String.class).addScalar("address1", String.class)
				.addScalar("tehsil_name", String.class).addScalar("block_name", String.class);

		// JAVA 21 / Hibernate 6: Transformers/ResultTransformer/setResultTransformer are
		// deprecated for removal; setTupleTransformer is the supported API and
		// AliasToBeanTupleTransformer reproduces aliasToBean's mapping exactly.
		return query.setTupleTransformer(new AliasToBeanTupleTransformer<>(FaReportBean.class))
				.getResultList();

	}

	// export to excel - Msme detail Report
	@SuppressWarnings("unchecked")
	public List<MsmeDetailReportBean> fetchMsmeDetailReportListPageWiseExport(String username, Integer firstResult,
			Integer pageDisplayLength,
			String colDir, String colName, FaDto searchParameter) {
		Session session = getCurrentSession();

		String districtId = "";
		String status = "";
		String sql = null;

		sql = "select distinct mde.UAM_NUMBER as udyamRegNumber,"
				+ " date_format(mde.UAM_DATE,'%d/%m/%y') as udyamRegDate," + "mde.MSME_TYPE as msmeType,"
				+ "mde.OWNER_OR_PARTNER_NAME as ownerOrPartnerName,"
				+ "date_format(mde.PRODUCTION_DATE,'%d/%m/%y') as productionDate,"
				+ "date_format(mde.CREATED_ON,'%d/%m/%y') as createdOn,"
				+ "date_format(mde.lease_deed_date ,'%d/%m/%y') as leaseDeedDate," + "	mde.activity as activity,"
				+ "	mde.products as products," + "	mde.investment_in_lac as investmentInLac,"
				+ "	mde.lease_rent_per_year as leaseRentPerYear," + "	mde.maintenance_charge as maintenanceCharge,"
				+ "	mde.in_industial_area as inIndustrialArea," + "	mde.industrial_area as industrialArea ,"
				+ "	mde.PROD_CAPACITY as prodCapacity," + "	mde.IS_EXPORT as isExport,"
				+ "	mde.ANNUAL_TURN_OVER as annualTurnOver," + "	mde.INSTALLED_CAPACITY_QTY as installedCapacity,"
				+ "	mde.INSTALLED_CAPACITY_UNITS as installedCapacityUnits from msme_detail mde"
				+ " left join master_districts dist on mde.UNIT_DISTRICT_ID=dist.DISTRICT_ID ";

		if (searchParameter.getDitrictId() != null && searchParameter.getDitrictId() != "") {
			districtId = searchParameter.getDitrictId();
			sql += " where mde.UNIT_DISTRICT_ID=" + districtId;
		}
		/*
		 * if (searchParameter.getStatus() != null && (searchParameter.getStatus() != ""
		 * && !(searchParameter.getStatus().equals("undefined")))) { status =
		 * searchParameter.getStatus(); sql += " and schm.status=" + status; }
		 */

		// if (StringUtils.isNotBlank(searchParameter)) {
		if (searchParameter.getSearch() != null
				&& (searchParameter.getSearch().equals("1") || searchParameter.getSearch().equals("2"))) {
			// System.out.println("000" + searchParameter.getSearch() + "000");
			String temp = searchParameter.getSearch();
			String searchParam = "";
			if (temp.equals("1"))
				searchParam = "sanction_letter_date";
			else
				searchParam = "disbu.letter_date";
			// if (StringUtils.isNotBlank(searchParameter)) {
			Date sd = new Date();
			Date fromDate = new Date();
			Date toDate = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			try {
				// if(StringUtils.isNotBlank(searchParameter))
				if (searchParameter.getFromDate() != null) {
					// sd=dateFormat.parse(searchParameter.trim());
					fromDate = dateFormat.parse(searchParameter.getFromDate());
				}
				if (searchParameter.getToDate() != null) {
					toDate = dateFormat.parse(searchParameter.getToDate());
				}
				// else sd=null;
			} catch (Exception e) {
				e.printStackTrace();
			}
			SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd");
			// sql+= " where Date(sanction_letter_date)= '"+dateFormat1.format(sd)+"'";
			sql += " where " + searchParam + " between '" + dateFormat1.format(fromDate) + "' and '"
					+ dateFormat1.format(toDate) + "'";

			// }
		}

		Integer min_val = searchParameter.getStartRecord();
		Integer max_val = searchParameter.getNoOfRows();
		sql += " limit " + min_val + ", " + max_val;

		Query<Object[]> query = session.createNativeQuery(sql, Object[].class) // JAVA 21: typed; addScalar chain -> Object[]
				.addScalar("udyamRegNumber", String.class)
				.addScalar("udyamRegDate", String.class).addScalar("msmeType", String.class)
				.addScalar("ownerOrPartnerName", String.class)
				.addScalar("productionDate", String.class)
				.addScalar("createdOn", String.class).addScalar("leaseDeedDate", String.class)
				.addScalar("activity", String.class).addScalar("products", String.class)
				.addScalar("investmentInLac", String.class)
				.addScalar("leaseRentPerYear", String.class)
				.addScalar("maintenanceCharge", String.class)
				.addScalar("inIndustrialArea", String.class)
				.addScalar("industrialArea", String.class)
				.addScalar("prodCapacity", String.class).addScalar("isExport", String.class)
				.addScalar("annualTurnOver", String.class)
				.addScalar("installedCapacity", String.class)
				.addScalar("installedCapacityUnits", String.class);

		// JAVA 21 / Hibernate 6: setTupleTransformer replaces deprecated setResultTransformer.
		return query.setTupleTransformer(new AliasToBeanTupleTransformer<>(MsmeDetailReportBean.class))
				.getResultList();

	}

	// for dashboard
	@SuppressWarnings("unchecked")
	public List<FaMsmeScheme> getDashBorad() {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMsmeScheme> cq = cb.createQuery(FaMsmeScheme.class);
		Root<FaMsmeScheme> root = cq.from(FaMsmeScheme.class);
		Join<Object, Object> statusJoin = root.join("status");

		cq.where(cb.greaterThanOrEqualTo(statusJoin.get("masterStatusId"), MPIndustryConstants.STATUS_INCOMPLETE));

		return session.createQuery(cq).getResultList();

	}

	// for ten cr investment
	@SuppressWarnings("unchecked")
	public List<FaMsmeScheme> fetchTenCrPendingSchemePageWise(String establishmentType, Integer firstResult,
			Integer pageDisplayLength, SortFieldBean sortField, String searchParameter) {
		Session session = getCurrentSession();
		
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMsmeScheme> cq = cb.createQuery(FaMsmeScheme.class);
		Root<FaMsmeScheme> root = cq.from(FaMsmeScheme.class);
		Join<Object, Object> capJoin = root.join("faSchemeCapitalInvestmentCollection", JoinType.INNER);
		Join<Object, Object> statusJoin = root.join("status");

		List<Predicate> predicates = new ArrayList<>();
		predicates.add(cb.greaterThanOrEqualTo(statusJoin.get("masterStatusId"), MPIndustryConstants.STATUS_SUBMITTED));
		predicates.add(cb.equal(root.get("establishmentType"), establishmentType));
		predicates.add(cb.equal(capJoin.get("investmentName"), "Plant & Machinery"));
		predicates.add(cb.greaterThanOrEqualTo(capJoin.get("amount"), BigDecimal.valueOf(100000000.0)));

		if (StringUtils.isNotBlank(searchParameter)) {
			predicates.add(cb.or(
					cb.like(root.get("applicationId"), "%" + searchParameter + "%"),
					cb.like(root.get("unitOrInstName"), "%" + searchParameter + "%")));
		}

		cq.where(cb.and(predicates.toArray(new Predicate[0])));
		cq.orderBy(cb.desc(root.get("createdOn")));

		return session.createQuery(cq)
				.setFirstResult(firstResult)
				.setMaxResults(pageDisplayLength)
				.getResultList();

	}

	public Integer fetchTenCrPendingSchemeCount(long districtId, String establishmentType, String searchParameter) {

		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMsmeScheme> cq = cb.createQuery(FaMsmeScheme.class);
		Root<FaMsmeScheme> root = cq.from(FaMsmeScheme.class);
		Join<Object, Object> capJoin = root.join("faSchemeCapitalInvestmentCollection", JoinType.INNER);
		Join<Object, Object> statusJoin = root.join("status");

		List<Predicate> predicates = new ArrayList<>();
		predicates.add(cb.greaterThanOrEqualTo(statusJoin.get("masterStatusId"), MPIndustryConstants.STATUS_SUBMITTED));
		predicates.add(cb.equal(root.get("establishmentType"), establishmentType));
		predicates.add(cb.equal(capJoin.get("investmentName"), "Plant & Machinery"));
		predicates.add(cb.greaterThanOrEqualTo(capJoin.get("amount"), BigDecimal.valueOf(100000000.0)));

		if (StringUtils.isNotBlank(searchParameter)) {
			predicates.add(cb.or(
					cb.like(root.get("applicationId"), "%" + searchParameter + "%"),
					cb.like(root.get("unitOrInstName"), "%" + searchParameter + "%")));
		}

		cq.where(cb.and(predicates.toArray(new Predicate[0])));

		return session.createQuery(cq).getResultList().size();

	}

	public Integer fetchTenCrPendingSchemeCountNew(long districtId, String establishmentType, String searchParameter) {

		Session session = getCurrentSession();

		// String districtId = "";
		String status = "";
		String sql = "select count(schm.application_id)\r\n" + "  from fa_msme_scheme schm \r\n"
				+ "left join fa_capital_assistance cap on schm.APPLICATION_ID=cap.APPLICATION_ID\r\n"
				+ "left join fa_infra_dev_exp_compensation infra on schm.APPLICATION_ID=infra.APPLICATION_ID\r\n"
				+ "left join fa_waste_mgmt_estb_exp_comp waste on schm.APPLICATION_ID=waste.APPLICATION_ID\r\n"
				+ "left join fa_electricity_fee_exemption elec on schm.APPLICATION_ID=elec.APPLICATION_ID\r\n"
				+ "left join fa_entry_tax_exemption_concess tax on schm.APPLICATION_ID=tax.APPLICATION_ID\r\n"
				+ "left join fa_mandi_fee_exemption mandi on schm.APPLICATION_ID=mandi.APPLICATION_ID\r\n"
				+ "left join fa_vat_cst_compensation vat on schm.APPLICATION_ID=vat.APPLICATION_ID\r\n"
				+ "left join fa_inst_estab_assistance inst on schm.APPLICATION_ID=inst.APPLICATION_ID\r\n"
				+ "left join fa_master_status stat  on schm.STATUS= stat.MASTER_STATUS_ID\r\n"
				+ "left join fa_scheme_capital_investment invest on schm.APPLICATION_ID=invest.APPLICATION_ID\r\n"
				+ "where STATUS>=2 and ESTABLISHMENT_TYPE='" + establishmentType + "'"
				+ "and invest.AMOUNT > 100000000 and schm.CREATED_ON >= '2025-07-15' and invest.INVESTMENT_NAME='Plant & Machinery' ";
		// System.out.println(sql);
		Query<Long> query = session.createNativeQuery(sql, Long.class); // JAVA 21: typed createNativeQuery (COUNT -> Long)
		Number bi = (Number) query.uniqueResult();
		if (bi != null)
			return bi.intValue();
		else
			return 0;

	}

	@Override
	public void saveHistoryEntity(FaStartupFundingAssisHistory eh) {
		// TODO Auto-generated method stub

	}

	@Override
	public Object fAStartupFundingAssistanceDetailsById(Long id) {
		Session session = getCurrentSession();
		// String sql = "select funding_date, amount, funding_agency_type,
		// financial_instrument, funding_agency_name from startup_funding_assis sa inner
		// join startup_funding_details sd on sd.funding_assis_id = sa.id where
		// created_by = (SELECT pan_no FROM startup_fa WHERE id = :id)";
		// String sql = "SELECT funding_date, amount, funding_agency_type,
		// financial_instrument, funding_agency_name FROM
		// startup_funding_assisdetails_history WHERE startup_id = :id";
		// String sql="select funding_date, amount, funding_agency_type,
		// financial_instrument, funding_agency_name from startup_funding_assis sa inner
		// join startup_funding_details sd on sd.funding_assis_id = sa.id where
		// created_by = :id";
		String sql = "select funding_date, amount, funding_agency_type, financial_instrument, funding_agency_name,fms.status\r\n"
				+ "from startup_funding_assis sa \r\n"
				+ "inner join startup_funding_details sd on sd.funding_assis_id = sa.id \r\n"
				+ "left join startup_fa sf on sf.id=sa.startup_id \r\n"
				+ "left join master_startup_status fms on fms.STATUS_ID=sf.status \r\n" + "where sa.created_by = :id";
		NativeQuery<Object[]> query = session.createNativeQuery(sql, Object[].class); // JAVA 21: typed; multi-column row -> Object[]
		query.setParameter("id", id);
		// Assuming you expect multiple rows of results
		return query.getResultList();
	}

	@Override
	public Object fAStartupLeaseRentalAssistanceById(Long startupId) {
		Session session = getCurrentSession();
		// String sql = "select * from startup_lease_assis where created_by = (SELECT
		// pan_no FROM startup_fa WHERE id = :startupId)";
		// String sql = "SELECT * FROM startup_lease_assis WHERE startup_id =
		// :startupId";
		// String sql = "select * from startup_lease_assis_history where created_by =
		// :startupId";

		/*
		 * String sql =
		 * "select key_person_name,rent_start_date,rent_end_date,total_day,used_day,remaining_day,claimed_amount_per_month,amount_per_month,fms.status\r\n"
		 * + " from startup_lease_assis_history his\r\n" +
		 * " left join startup_fa sf on sf.id=his.startup_id\r\n" +
		 * " left join master_startup_status fms on fms.status_id=sf.status\r\n" +
		 * " where his.created_by = :startupId";
		 */
		String sql = "select key_person_name,rent_start_date,rent_end_date,total_day,used_day,remaining_day,claimed_amount_per_month,amount_per_month,fms.status\r\n"
				+ " from startup_lease_assis his\r\n" + " left join startup_fa sf on sf.id=his.startup_id\r\n"
				+ " left join master_startup_status fms on fms.status_id=sf.status\r\n"
				+ " where startup_id = :startupId";
		// " where his.created_by = :startupId";

		NativeQuery<Object[]> query = session.createNativeQuery(sql, Object[].class); // JAVA 21: typed; multi-column row -> Object[]
		query.setParameter("startupId", startupId);
		// Assuming you expect multiple rows of results
		return query.getResultList();
	}

	@Override
	public Object fAStartupIncubationById(String startupId) {
		Session session = getCurrentSession();
		// String sql = "select * from startup_lease_assis where created_by = (SELECT
		// pan_no FROM startup_fa WHERE id = :startupId)";
		// String sql = "SELECT * FROM startup_lease_assis_history WHERE startup_id =
		// :startupId";
		// String sql = "select * from startup_incubation_details where created_by =
		// :startupId";
		String sql = "select sid.id, sid.registered_incubator,fms.status from startup_incubation_details sid left join startup_fa sf on sf.id=sid.startup_id left join master_startup_status fms on fms.status_id=sf.status where sid.created_by = :startupId ";
		// System.out.println(sql);
		NativeQuery<Object[]> query = session.createNativeQuery(sql, Object[].class); // JAVA 21: typed; multi-column row -> Object[]
		query.setParameter("startupId", startupId);
		// Assuming you expect multiple rows of results
		return query.getResultList();
	}

	@Override
	public Object fAStartupPatentAssistanceById(String startupId) {
		Session session = getCurrentSession();
		// String sql = "select * from startup_lease_assis where created_by = (SELECT
		// pan_no FROM startup_fa WHERE id = :startupId)";
		// String sql = "SELECT * FROM startup_lease_assis_history WHERE startup_id =
		// :startupId";
		// String sql = "select * from startup_patent_assis where created_by =
		// :startupId";
		String sql = "select key_person_name,patent_date,govt_fee,consultation_fee,total_fee,reimbursement_claimed,fms.status\r\n"
				+ "from startup_patent_assis spa\r\n" + "left join startup_fa sf on sf.id=spa.startup_id\r\n"
				+ "left join master_startup_status fms on fms.status_id=sf.status\r\n"
				+ "where spa.created_by = :startupId";
		NativeQuery<Object[]> query = session.createNativeQuery(sql, Object[].class); // JAVA 21: typed; multi-column row -> Object[]
		System.out.print(sql);
		query.setParameter("startupId", startupId);
		// Assuming you expect multiple rows of results
		return query.getResultList();
	}

	@Override
	public Object fAStartupProductBasedAssistanceById(String startupId) {
		Session session = getCurrentSession();
		// String sql = "select * from startup_lease_assis where created_by = (SELECT
		// pan_no FROM startup_fa WHERE id = :startupId)";
		// String sql = "SELECT * FROM startup_lease_assis_history WHERE startup_id =
		// :startupId";
		// String sql = "select * from startup_product_assis where created_by =
		// :startupId";
		String sql = "select training_exp_reimbursement,emp_generation_assis,rebate_power_tariff,mss.status\r\n"
				+ " from startup_product_assis spa\r\n" + " \r\n"
				+ " left join startup_fa sf on sf.id=spa.startup_id\r\n"
				+ " left join master_startup_status mss on mss.status_id=sf.status\r\n"
				+ " where spa.created_by= :startupId";
		/*
		 * String sql =
		 * "select training_exp_reimbursement,emp_generation_assis,rebate_power_tariff , fms.STATUS_DESCRIPTION\r\n"
		 * + "from startup_product_assis  spa\r\n" +
		 * "left join startup_fa fa on fa.id=spa.startup_id\r\n" +
		 * "left join fa_master_status fms on fms.MASTER_STATUS_ID=fa.status\r\n" +
		 * "where spa.created_by =  :startupId";
		 */
		NativeQuery<Object[]> query = session.createNativeQuery(sql, Object[].class); // JAVA 21: typed; multi-column row -> Object[]
		query.setParameter("startupId", startupId);
		// Assuming you expect multiple rows of results
		return query.getResultList();
	}

	@Override
	public Object findByStartUpId(Long startupId) {
		Session session = getCurrentSession();
		// String sql = "SELECT * FROM startup_lease_assis_history WHERE created_by =
		// :startupId";
		// String sql = "SELECT * FROM startup_lease_assis WHERE created_by =
		// :startupId";
		String sql = "SELECT sla.id,startup_id,total_day,used_day,remaining_day \r\n"
				+ "FROM startup_lease_assis sla\r\n" + "left join startup_fa sf on sf.id=sla.startup_id\r\n"
				+ "WHERE sla.created_by = :startupId and sf.status<>5 ";
		NativeQuery<Object[]> query = session.createNativeQuery(sql, Object[].class); // JAVA 21: typed; multi-column row -> Object[]
		query.setParameter("startupId", startupId);
		// Assuming you expect multiple rows of results
		return query.getResultList();
	}

	@Override
	public String endDate(Long id) {
		Session session = getCurrentSession();
		// String sql = "select max(rent_end_date) from startup_lease_assis_history
		// where created_by = :id";
		// String sql = "select max(rent_end_date) from startup_lease_assis where
		// created_by = :id";
		/*
		 * String sql="select max(rent_end_date) \r\n"
		 * + "from startup_lease_assis lh\r\n"
		 * + "left join startup_fa sf on sf.id=lh.startup_id\r\n"
		 * + "where lh.created_by = :id and sf.status=6";
		 */
		String sql = "select max(rent_end_date) \r\n" + "from startup_lease_assis lh\r\n"
				+ "left join startup_fa sf on sf.id=lh.startup_id\r\n" + "where lh.startup_id = :id and sf.status=6";
		NativeQuery<Object> query = session.createNativeQuery(sql, Object.class); // JAVA 21: typed; SINGLE column -> Object (keeps raw JDBC value)
		query.setParameter("id", id);
		List<Object> results = query.getResultList();

		if (!results.isEmpty()) {
			// The maximum rent_end_date value is in the first element of the list
			Object maxEndDate = results.get(0);
			// Convert the result to a String
			String maxEndDateString = String.valueOf(maxEndDate);
			return maxEndDateString;
		}
		return null;
	}

	/*
	 * @Override public FaStartupDetails StartUpDetailsById(Long startupId) {
	 * Session session = getCurrentSession(); try { String sql =
	 * "SELECT * FROM startup_fa WHERE id = :startupId"; SQLQuery query =
	 * session.createNativeQuery(sql); query.setParameter("startupId", startupId);
	 * //
	 * Assuming you expect multiple rows of results
	 * query.setResultTransformer(Criteria.ALIAS_TO_ENTITY_MAP); return
	 * query.getResultList(); } finally { if (session != null && session.isOpen()) {
	 * // session.close(); }
	 * 
	 * }
	 * 
	 * }
	 */

	@Override
	public FaStartupDetails StartUpDetailsById(Long startupId) {
		Session session = getCurrentSession();
		String sql = "SELECT * FROM startup_fa WHERE id = :startupId";
		// JAVA 21 / Hibernate 6: createNativeQuery(String) is deprecated. The typed
		// overload is the documented shorthand for createNativeQuery(sql).addEntity(X),
		// so the separate addEntity() call below is now redundant and was removed.
		// SQL, parameter and entity mapping are unchanged.
		NativeQuery<FaStartupDetails> query = session.createNativeQuery(sql, FaStartupDetails.class);
		query.setParameter("startupId", startupId);
		// Assuming you expect a single row of result, so using getSingleResult() instead
		// of list()
		return (FaStartupDetails) query.uniqueResult();
	}

	@Override
	public FaStartupDetails getStartUpIdBydpiitNum(String dpiitNum) {
		Session session = getCurrentSession();
		String sql = "SELECT * FROM startup_fa WHERE dpiit_recog_no = 'DIPP99029'";
		// JAVA 21 / Hibernate 6: typed createNativeQuery is the documented shorthand for
		// createNativeQuery(sql).addEntity(X); the separate addEntity() call is therefore
		// redundant and was removed. SQL and entity mapping unchanged.
		NativeQuery<FaStartupDetails> query = session.createNativeQuery(sql, FaStartupDetails.class);
		// query.setParameter("dpiitNum", dpiitNum.trim());
		// System.out.println(sql);
		// Assuming you expect a single row of result, so using getSingleResult() instead
		// of list()
		return (FaStartupDetails) query.uniqueResult();
	}

	@Override
	public StartupMasterAssistanceEntity getAssistanceById(Long assistId) {
		Session session = getCurrentSession();
		// System.out.println(assistId);
		String sql = "SELECT * FROM startup_master_assistance WHERE assist_id = :assistId";
		// JAVA 21 / Hibernate 6: typed createNativeQuery is the documented shorthand for
		// createNativeQuery(sql).addEntity(X); the separate addEntity() call is therefore
		// redundant and was removed. SQL, parameter and entity mapping unchanged.
		NativeQuery<StartupMasterAssistanceEntity> query = session.createNativeQuery(sql,
				StartupMasterAssistanceEntity.class);
		query.setParameter("assistId", assistId);
		// Assuming you expect a single row of result, so using getSingleResult() instead
		// of list()
		return (StartupMasterAssistanceEntity) query.uniqueResult();
	}

	// for disbursement from ho.fa
	@SuppressWarnings("unchecked")
	public List<FaDisbursementBean> fetchDisbursementList(long districtId, String establishmentType,
			Integer firstResult,
			Integer pageDisplayLength, SortFieldBean sortField, String searchParameter) {
		Session session = getCurrentSession();

		/*
		 * String sql =
		 * "select distinct schm.APPLICATION_ID as applicationId,schm.DISTRICT_ID as districtId, date_format(schm.CREATED_ON,'%d-%m-%Y') as applicationDate,\r\n"
		 * +
		 * "schm.UNIT_OR_INST_NAME as unitOrInstName,schm.STATUS as currentStatusId,schm.UNIT_TYPE as unitType,schm.MEMO_PART2_ACK_NO as memoPart2AckNo,\r\n"
		 * +
		 * " stat.STATUS_DESCRIPTION as status  , sum(disburs.disbursement_amt) as disbursedAmount,det.Indust_Subsidy_Sanction_Amt as sanctionedAmount\r\n"
		 * 
		 * + " ,date_format(det.sanction_letter_date,'%d-%m-%Y') as sanctionedDate \r\n"
		 * + " from fa_msme_scheme schm \r\n"
		 * +
		 * "left join fa_master_status stat  on schm.STATUS= stat.MASTER_STATUS_ID\r\n"
		 * +
		 * " left join fa_scheme_capital_investment invest on schm.APPLICATION_ID=invest.APPLICATION_ID \r\n"
		 * +
		 * " left join fa_disbursement_save disburs on disburs.APPLICATION_ID=schm.APPLICATION_ID\r\n"
		 * +
		 * " left join fa_msme_detail det on det.APPLICATION_ID=schm.APPLICATION_ID\r\n"
		 * +
		 * " where  (STATUS=9 or status=10) and ESTABLISHMENT_TYPE='Unit' and invest.AMOUNT >=100000000 and invest.INVESTMENT_NAME='Plant & Machinery' \r\n"
		 * + " group by disburs.application_id  order by schm.CREATED_ON ";
		 * //Integer min_val = firstResult;
		 */
		// Integer max_val = pageDisplayLength;
		// sql += " limit " + min_val + ", " + max_val;
		String sql = "SELECT DISTINCT \r\n" + "    schm.APPLICATION_ID AS applicationId,\r\n"
				+ "    schm.DISTRICT_ID AS districtId,\r\n" + "     md.DISTRICT_NAME AS districtName, "
				+ "    DATE_FORMAT(schm.CREATED_ON,'%d-%m-%Y') AS applicationDate,\r\n"
				+ "    schm.UNIT_OR_INST_NAME AS unitOrInstName,\r\n" + "    schm.STATUS AS currentStatusId,\r\n"
				+ "    schm.UNIT_TYPE AS unitType,\r\n" + "    schm.MEMO_PART2_ACK_NO AS memoPart2AckNo,\r\n"
				+ "    stat.STATUS_DESCRIPTION AS status,\r\n"
				+ "    det.Indust_Subsidy_Sanction_Amt AS sanctionedAmount,\r\n"
				+ "    DATE_FORMAT(det.sanction_letter_date,'%d-%m-%Y') AS sanctionedDate,\r\n"
				+ "    IFNULL(disburs.disbursement_amt, 0) AS disbursedAmount,\r\n"
				+ "    (SELECT SUM(disbursement_amt) FROM fa_disbursement_save WHERE APPLICATION_ID = schm.APPLICATION_ID) AS totalDisbursedAmount\r\n"
				+ "FROM \r\n" + "    fa_msme_scheme schm \r\n" + "left join\r\n"
				+ "   	master_districts md on schm.DISTRICT_ID=md.DISTRICT_ID " + " LEFT JOIN \r\n"
				+ "    fa_master_status stat ON schm.STATUS = stat.MASTER_STATUS_ID\r\n" + "LEFT JOIN \r\n"
				+ "    fa_scheme_capital_investment invest ON schm.APPLICATION_ID = invest.APPLICATION_ID \r\n"
				+ "LEFT JOIN \r\n"
				+ "    fa_disbursement_save disburs ON disburs.APPLICATION_ID = schm.APPLICATION_ID\r\n"
				+ "LEFT JOIN \r\n" + "    fa_msme_detail det ON det.APPLICATION_ID = schm.APPLICATION_ID\r\n"
				+ "WHERE\r\n" + "    schm.ESTABLISHMENT_TYPE = 'Unit'\r\n" + "    AND invest.AMOUNT >= 100000000\r\n"
				+ "    AND invest.INVESTMENT_NAME = 'Plant & Machinery'\r\n" + "    AND schm.STATUS IN (9, 10)\r\n"
				+ "ORDER BY \r\n" + "    schm.CREATED_ON";
		// System.out.println(sql);
		Query<Object[]> query = session.createNativeQuery(sql, Object[].class).addScalar("districtId", Long.class)
				.addScalar("districtName", String.class)
				.addScalar("applicationId", String.class)
				.addScalar("applicationDate", String.class)
				.addScalar("unitOrInstName", String.class)
				.addScalar("currentStatusId", Long.class).addScalar("unitType", String.class)
				.addScalar("memoPart2AckNo", String.class).addScalar("status", String.class)
				.addScalar("disbursedAmount", String.class)
				.addScalar("sanctionedAmount", String.class)
				.addScalar("sanctionedDate", String.class);

		// JAVA 21 / Hibernate 6: setTupleTransformer replaces deprecated setResultTransformer.
		return query.setTupleTransformer(new AliasToBeanTupleTransformer<>(FaDisbursementBean.class))
				.getResultList();
	}

	// new query
	// for disbursement calculator from ho.fa
	@SuppressWarnings("unchecked")
	public List<FaDisbursementBean> fetchDisbursementListNew(long districtId, String establishmentType,
			Integer firstResult, Integer pageDisplayLength, SortFieldBean sortField, String searchParameter,
			String orderDate1, String orderDate2) {
		Session session = getCurrentSession();
		String search = "";
		String search2 = " ORDER BY schm.CREATED_ON ";

		if (searchParameter.equals("applicationDate")) {
			search = " AND schm.CREATED_ON > '" + orderDate1 + "'";
			search += " AND schm.CREATED_ON <= '" + orderDate2 + "'";
		}
		if (searchParameter.equals("sanctionedOrderDate")) {
			search = " AND det.sanction_letter_date > '" + orderDate1 + "'";
			search += " AND det.sanction_letter_date <= '" + orderDate2 + "'";
		}
		if (searchParameter.equals("descending")) {
			search2 = "ORDER BY det.Indust_Subsidy_Sanction_Amt desc";
		}
		if (searchParameter.equals("ascending")) {
			search2 = "ORDER BY det.Indust_Subsidy_Sanction_Amt asc";
		}
		if (searchParameter.equals("district")) {
			search2 = "ORDER BY schm.DISTRICT_ID , schm.created_on";
		}

		if (searchParameter.equals("appAscending")) {
			search2 = "ORDER BY schm.CREATED_ON asc";
		}
		if (searchParameter.equals("appDescending")) {
			search2 = "ORDER BY schm.CREATED_ON desc";
		}
		if (searchParameter.equals("sancAscending")) {
			search2 = "ORDER BY det.sanction_letter_date asc";
		}
		if (searchParameter.equals("sancDescending")) {
			search2 = "ORDER BY det.sanction_letter_date desc";
		}
		if (searchParameter.equals("disbursAscending")) {
			search2 = "ORDER BY totalDisbursedAmount asc";
		}
		if (searchParameter.equals("disbursDescending")) {
			search2 = "ORDER BY totalDisbursedAmount desc";
		}
		/*
		 * String sql =
		 * "select distinct schm.APPLICATION_ID as applicationId,schm.DISTRICT_ID as districtId, date_format(schm.CREATED_ON,'%d-%m-%Y') as applicationDate,\r\n"
		 * +
		 * "schm.UNIT_OR_INST_NAME as unitOrInstName,schm.STATUS as currentStatusId,schm.UNIT_TYPE as unitType,schm.MEMO_PART2_ACK_NO as memoPart2AckNo,\r\n"
		 * +
		 * " stat.STATUS_DESCRIPTION as status  , sum(disburs.disbursement_amt) as disbursedAmount,det.Indust_Subsidy_Sanction_Amt as sanctionedAmount\r\n"
		 * 
		 * + " ,date_format(det.sanction_letter_date,'%d-%m-%Y') as sanctionedDate \r\n"
		 * + " from fa_msme_scheme schm \r\n"
		 * +
		 * "left join fa_master_status stat  on schm.STATUS= stat.MASTER_STATUS_ID\r\n"
		 * +
		 * " left join fa_scheme_capital_investment invest on schm.APPLICATION_ID=invest.APPLICATION_ID \r\n"
		 * +
		 * " left join fa_disbursement_save disburs on disburs.APPLICATION_ID=schm.APPLICATION_ID\r\n"
		 * +
		 * " left join fa_msme_detail det on det.APPLICATION_ID=schm.APPLICATION_ID\r\n"
		 * +
		 * " where  (STATUS=9 or status=10) and ESTABLISHMENT_TYPE='Unit' and invest.AMOUNT >=100000000 and invest.INVESTMENT_NAME='Plant & Machinery' \r\n"
		 * + search
		 * + " group by disburs.application_id  order by schm.CREATED_ON ";
		 */
		// Integer min_val = firstResult;
		// Integer max_val = pageDisplayLength;
		// sql += " limit " + min_val + ", " + max_val;
		String sql = "SELECT DISTINCT \r\n" + "    schm.APPLICATION_ID AS applicationId,\r\n"
				+ "    schm.DISTRICT_ID AS districtId,\r\n" + "  md.DISTRICT_NAME AS districtName,"
				+ "    DATE_FORMAT(schm.CREATED_ON,'%d-%m-%Y') AS applicationDate,\r\n"
				+ "    schm.UNIT_OR_INST_NAME AS unitOrInstName,\r\n" + "    schm.STATUS AS currentStatusId,\r\n"
				+ "    schm.UNIT_TYPE AS unitType,\r\n" + "    schm.MEMO_PART2_ACK_NO AS memoPart2AckNo,\r\n"
				+ "    stat.STATUS_DESCRIPTION AS status,\r\n"
				+ "    det.Indust_Subsidy_Sanction_Amt AS sanctionedAmount,\r\n"
				+ "    DATE_FORMAT(det.sanction_letter_date,'%d-%m-%Y') AS sanctionedDate,\r\n"
				+ "    IFNULL(disburs.disbursement_amt, 0) AS disbursedAmount,\r\n"
				+ "    ifnull((SELECT SUM(disbursement_amt) FROM fa_disbursement_save WHERE APPLICATION_ID = schm.APPLICATION_ID),0) AS totalDisbursedAmount\r\n"
				+ "    FROM \r\n" + "    fa_msme_scheme schm \r\n" + "     left join\r\n"
				+ "	    master_districts md on schm.DISTRICT_ID=md.DISTRICT_ID " + "LEFT JOIN \r\n"
				+ "    fa_master_status stat ON schm.STATUS = stat.MASTER_STATUS_ID\r\n" + "LEFT JOIN \r\n"
				+ "    fa_scheme_capital_investment invest ON schm.APPLICATION_ID = invest.APPLICATION_ID \r\n"
				+ "LEFT JOIN \r\n"
				+ "    fa_disbursement_save disburs ON disburs.APPLICATION_ID = schm.APPLICATION_ID\r\n"
				+ "LEFT JOIN \r\n" + "    fa_msme_detail det ON det.APPLICATION_ID = schm.APPLICATION_ID\r\n"
				+ "WHERE\r\n" + "    schm.ESTABLISHMENT_TYPE = 'Unit'\r\n" + "    AND invest.AMOUNT >= 100000000\r\n"
				+ "    AND invest.INVESTMENT_NAME = 'Plant & Machinery'\r\n" + "    AND schm.STATUS IN (9, 10)\r\n"

				+ search + "     group by schm.APPLICATION_ID " + search2;
		// System.out.println(sql);
		Query<Object[]> query = session.createNativeQuery(sql, Object[].class).addScalar("districtId", Long.class)
				.addScalar("districtName", String.class)
				.addScalar("applicationId", String.class)
				.addScalar("applicationDate", String.class)
				.addScalar("unitOrInstName", String.class)
				.addScalar("currentStatusId", Long.class).addScalar("unitType", String.class)
				.addScalar("memoPart2AckNo", String.class).addScalar("status", String.class)
				.addScalar("disbursedAmount", String.class)
				.addScalar("sanctionedAmount", String.class)
				.addScalar("sanctionedDate", String.class)
				.addScalar("totalDisbursedAmount", String.class);

		// JAVA 21 / Hibernate 6: setTupleTransformer replaces deprecated setResultTransformer.
		return query.setTupleTransformer(new AliasToBeanTupleTransformer<>(FaDisbursementBean.class))
				.getResultList();

	}

	@Override
	public FaFreightAssistanceforExport fetchFaFreightAssistanceforExportByApplicationId(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaFreightAssistanceforExport> cq = cb.createQuery(FaFreightAssistanceforExport.class);
		Root<FaFreightAssistanceforExport> root = cq.from(FaFreightAssistanceforExport.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaFreightAssistanceforExport> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	public FaGlobalCompetitiveness fetchFaGlobalCompetitivenessByApplicationId(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaGlobalCompetitiveness> cq = cb.createQuery(FaGlobalCompetitiveness.class);
		Root<FaGlobalCompetitiveness> root = cq.from(FaGlobalCompetitiveness.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaGlobalCompetitiveness> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	public FaFoodProcessingUnit saveFoodProcessingUnits(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaFoodProcessingUnit> cq = cb.createQuery(FaFoodProcessingUnit.class);
		Root<FaFoodProcessingUnit> root = cq.from(FaFoodProcessingUnit.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaFoodProcessingUnit> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	public FaApparelSector saveApparelSector(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaApparelSector> cq = cb.createQuery(FaApparelSector.class);
		Root<FaApparelSector> root = cq.from(FaApparelSector.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaApparelSector> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	public FaTextileUnit saveTexttileUnits(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaTextileUnit> cq = cb.createQuery(FaTextileUnit.class);
		Root<FaTextileUnit> root = cq.from(FaTextileUnit.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaTextileUnit> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	public FaFootwearFurnitureToysValueChainProduct saveRelatedValueChainProducts(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaFootwearFurnitureToysValueChainProduct> cq = cb.createQuery(FaFootwearFurnitureToysValueChainProduct.class);
		Root<FaFootwearFurnitureToysValueChainProduct> root = cq.from(FaFootwearFurnitureToysValueChainProduct.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaFootwearFurnitureToysValueChainProduct> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	public FaRevivalOfSickUnit saveRevivalofSickUnit(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaRevivalOfSickUnit> cq = cb.createQuery(FaRevivalOfSickUnit.class);
		Root<FaRevivalOfSickUnit> root = cq.from(FaRevivalOfSickUnit.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaRevivalOfSickUnit> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	public FaResearchDevelopmentProject researchDevelopmentProject(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaResearchDevelopmentProject> cq = cb.createQuery(FaResearchDevelopmentProject.class);
		Root<FaResearchDevelopmentProject> root = cq.from(FaResearchDevelopmentProject.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaResearchDevelopmentProject> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	public FaLogisticsWarehousingProject saveLogisticsWarehousingProjects(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaLogisticsWarehousingProject> cq = cb.createQuery(FaLogisticsWarehousingProject.class);
		Root<FaLogisticsWarehousingProject> root = cq.from(FaLogisticsWarehousingProject.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaLogisticsWarehousingProject> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	public FaMotorVehicleScrappingCentre saveMotorVehicleScrappingCentres(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaMotorVehicleScrappingCentre> cq = cb.createQuery(FaMotorVehicleScrappingCentre.class);
		Root<FaMotorVehicleScrappingCentre> root = cq.from(FaMotorVehicleScrappingCentre.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaMotorVehicleScrappingCentre> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}

	@Override
	public FaBoostingCircularEconomy saveBoostingCircularEconomy(String applicationId) {
		Session session = getCurrentSession();

		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<FaBoostingCircularEconomy> cq = cb.createQuery(FaBoostingCircularEconomy.class);
		Root<FaBoostingCircularEconomy> root = cq.from(FaBoostingCircularEconomy.class);

		cq.where(cb.equal(root.get("applicationId").get("applicationId"), applicationId));
		cq.orderBy(cb.desc(root.get("createdOn")));

		List<FaBoostingCircularEconomy> list = session.createQuery(cq).getResultList();
		return list.isEmpty() ? null : list.get(0);

	}



	// ================= SVN se laaye gaye naye methods (FA batch / MPIDC) =================

		public List<FaNewMsmeBean> fetchFAApplicantsListForMpidc(String userId, String establishmentType){
		Session session = getSessionFactory().openSession();
		String sql1="";
		try {
			
			
		String sql ="select distinct schm.APPLICATION_ID as applicationId,schm.DISTRICT_ID as districtId, date_format(schm.submitted_on,'%d-%m-%Y') as submittedOn"
				+",schm.UNIT_OR_INST_NAME as unitOrInstName,schm.STATUS as currentStatusId,schm.UNIT_TYPE as unitType,schm.MEMO_PART2_ACK_NO as memoPart2AckNo\r\n"
				+",schm.CREATED_ON as createdOn\r\n"
				+ ", (case when cap.APPLICATION_ID is null then  0 else 1 end) as selectfa1,(case when infra.APPLICATION_ID is null then  0 else 1 end) as selectfa2,\r\n"
				+ " (case when waste.APPLICATION_ID is null then  0 else 1 end) as selectfa3,(case when elec.APPLICATION_ID is null then  0 else 1 end) as selectfa4,\r\n"
				+ " (case when tax.APPLICATION_ID is null then  0 else 1 end) as selectfa5,(case when mandi.APPLICATION_ID is null then  0 else 1 end) as selectfa6,\r\n"
				+ " (case when vat.APPLICATION_ID is null then  0 else 1 end) as selectfa7,(case when inst.APPLICATION_ID is null then  0 else 1 end) as selectfa8"
				+ ",  stat.STATUS_DESCRIPTION as status, schm.ESTABLISHMENT_TYPE as establishmentType"
				+ " from fa_msme_scheme schm \r\n"
				+ "left join fa_capital_assistance cap on schm.APPLICATION_ID=cap.APPLICATION_ID\r\n"
				+ "left join fa_infra_dev_exp_compensation infra on schm.APPLICATION_ID=infra.APPLICATION_ID\r\n"
				+ "left join fa_waste_mgmt_estb_exp_comp waste on schm.APPLICATION_ID=waste.APPLICATION_ID\r\n"
				+ "left join fa_electricity_fee_exemption elec on schm.APPLICATION_ID=elec.APPLICATION_ID\r\n"
				+ "left join fa_entry_tax_exemption_concess tax on schm.APPLICATION_ID=tax.APPLICATION_ID\r\n"
				+ "left join fa_mandi_fee_exemption mandi on schm.APPLICATION_ID=mandi.APPLICATION_ID\r\n"
				+ "left join fa_vat_cst_compensation vat on schm.APPLICATION_ID=vat.APPLICATION_ID\r\n"
				+ "left join fa_inst_estab_assistance inst on schm.APPLICATION_ID=inst.APPLICATION_ID\r\n"
				+"left join fa_master_status stat  on schm.STATUS= stat.MASTER_STATUS_ID\r\n"
				+ "where \r\n"
				+ "schm.CREATED_BY='"+userId +"' and ESTABLISHMENT_TYPE='"+establishmentType+"'"
				+sql1
				+ " order by schm.CREATED_ON desc";
		
		
		//System.out.println(sql);
		Query<Object[]> query = session.createNativeQuery(sql, Object[].class).addScalar("districtId", StandardBasicTypes.LONG)
				.addScalar("applicationId", StandardBasicTypes.STRING)
				.addScalar("submittedOn",StandardBasicTypes.STRING)
				.addScalar("unitOrInstName",StandardBasicTypes.STRING)
				.addScalar("currentStatusId",StandardBasicTypes.LONG)
				.addScalar("unitType",StandardBasicTypes.STRING)
				.addScalar("memoPart2AckNo",StandardBasicTypes.STRING)
				.addScalar("selectFa1",StandardBasicTypes.BOOLEAN)
				.addScalar("selectFa2",StandardBasicTypes.BOOLEAN)
				.addScalar("selectFa3",StandardBasicTypes.BOOLEAN)
				.addScalar("selectFa4",StandardBasicTypes.BOOLEAN)
				.addScalar("selectFa5",StandardBasicTypes.BOOLEAN)
				.addScalar("selectFa6",StandardBasicTypes.BOOLEAN)
				.addScalar("selectFa7",StandardBasicTypes.BOOLEAN)
				.addScalar("selectFa8",StandardBasicTypes.BOOLEAN)
				.addScalar("status",StandardBasicTypes.STRING)
				.addScalar("establishmentType",StandardBasicTypes.STRING) ;
		

		// JAVA 21 / Hibernate 6: setTupleTransformer replaces deprecated setResultTransformer.
		return query.setTupleTransformer(new AliasToBeanTupleTransformer<>(FaNewMsmeBean.class)).list();

		} finally {
			if (session != null && session.isOpen()) {
				session.close();
			}
		}
	};
	
	@Override
	public List<FaMsmeScheme> fetchApplicationIdByUserId(String username) {

	    Session session = getSession();

	    try {
	        /*
	         * JAVA 21 / HIBERNATE 6 NOTE:
	         * FaMsmeScheme.status is a @ManyToOne to FaMasterStatus, not a number, so
	         * "f.status >= 2" compared an ENTITY with an Integer. Hibernate 5 quietly
	         * used the identifier for such comparisons; Hibernate 6 rejects them with
	         *   SemanticException: Cannot compare left expression of type
	         *   '...FaMasterStatus' with right expression of type 'java.lang.Integer'
	         * and that surfaces as a 400 (IllegalArgumentException) on
	         * /fetchAppliedAssistance.
	         *
	         * Comparing the identifier (masterStatusId) explicitly keeps exactly the
	         * same semantics and adds no join - Hibernate reads the STATUS foreign-key
	         * column directly.
	         */
	        String hql = "FROM FaMsmeScheme f "
	                   + "WHERE f.createdBy.userId = :username "
	                   + "AND f.status.masterStatusId >= 2 "
	                   + "AND f.status.masterStatusId NOT IN (4,7,10)";

	        Query<FaMsmeScheme> query = session.createQuery(hql, FaMsmeScheme.class);
	        query.setParameter("username", username);

	        return query.getResultList();

	    } finally {
	        if (session != null && session.isOpen()) {
	            session.close();
	        }
	    }
	}

	/*
	 * @Override public List<FaMsmeScheme> fetchApplicationIdByUserId(String
	 * username) { Session session = getSession(); try { String hql =
	 * "FROM FaMsmeScheme f " + "WHERE f.createdBy.userId = :username " +
	 * "AND f.status >= 2 " + "AND f.status NOT IN (4,7,10)";
	 * 
	 * Query query = session.createQuery(hql); query.setParameter("username",
	 * username);
	 * 
	 * return query.list(); } finally { if (session != null && session.isOpen()) {
	 * session.close(); } }
	 * 
	 * }
	 */

public boolean existsByApplicationId(String tableName, String applicationId) {

    Session session = getSession();
    try {
        String sql = "SELECT 1 FROM " + tableName + 
                     " WHERE APPLICATION_ID = :appId LIMIT 1";

        Query<Integer> query = session.createNativeQuery(sql, Integer.class); // JAVA 21: typed; SELECT 1 -> Integer
        query.setParameter("appId", applicationId);

        return query.uniqueResult() != null;

    } finally {
        if (session != null && session.isOpen()) {
            session.close();
        }
    }
}

@Override
public List<CommonAddress> fetchApplicationIdByUnitName(String unitName) {
	Session session = getSession();
	try {
	
	String hql = "FROM CommonAddress f " +
            "WHERE f.unitName = :unitName ";

// JAVA 21 / Hibernate 6: typed createQuery replaces the deprecated untyped one.
Query<CommonAddress> query = session.createQuery(hql, CommonAddress.class);
query.setParameter("unitName", unitName);

return query.list();
	}
	finally {
        if (session != null && session.isOpen()) {
            session.close();
        }
    }
}

	@Override
	public UserBankDetails fetchActiveBankDetails(String userName) {

	    Session session = getSessionFactory().openSession();

	    try {

	        String hql = "FROM UserBankDetails ubd " +
	                     "WHERE ubd.userId.userId = :userName " +
	                     "AND ubd.status = 'ACTIVE'";

	        // JAVA 21 / Hibernate 6: typed createQuery replaces the deprecated untyped one.
	        Query<UserBankDetails> query = session.createQuery(hql, UserBankDetails.class);
	        query.setParameter("userName", userName);
	        query.setMaxResults(1);

	        return (UserBankDetails) query.uniqueResult();

	    } finally {
	        session.close();
	    }
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FaNewMsmeBean> fetchPendingSchemeApplicantList(
	        long districtId,
	        String applicationId,
	        String username) {

	    Session session = null;

	    try {
	        session = getSessionFactory().openSession();

			String sql = "SELECT DISTINCT\r\n"
					+ "    schm.APPLICATION_ID AS applicationId,\r\n"
					+ "    schm.DISTRICT_ID AS districtId,\r\n"
					+ "    DATE_FORMAT(schm.submitted_on,'%d-%m-%Y') AS applicationDate,\r\n"
					+ "    schm.CREATED_ON AS createdOn,\r\n"
					+ "    schm.CREATED_BY AS createdBy,\r\n"
					+ "    schm.UNIT_OR_INST_NAME AS unitOrInstName,\r\n"
					+ "    schm.STATUS AS currentStatusId,\r\n"
					+ "    schm.UNIT_TYPE AS unitType,\r\n"
					+ "    schm.MEMO_PART2_ACK_NO AS memoPart2AckNo,\r\n"
					+ "\r\n"
					+ "    CASE WHEN cap.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa1,\r\n"
					+ "    CASE WHEN infra.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa2,\r\n"
					+ "    CASE WHEN waste.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa3,\r\n"
					+ "    CASE WHEN elec.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa4,\r\n"
					+ "    CASE WHEN tax.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa5,\r\n"
					+ "    CASE WHEN mandi.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa6,\r\n"
					+ "    CASE WHEN vat.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa7,\r\n"
					+ "    CASE WHEN inst.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa8,\r\n"
					+ "\r\n"
					+ "    CASE WHEN freight.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa11,\r\n"
					+ "    CASE WHEN globalcomp.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa12,\r\n"
					+ "    CASE WHEN food.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa13,\r\n"
					+ "    CASE WHEN apparel.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa14,\r\n"
					+ "    CASE WHEN textile.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa15,\r\n"
					+ "    CASE WHEN footwear.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa16,\r\n"
					+ "    CASE WHEN circular.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa17,\r\n"
					+ "    CASE WHEN vehicle.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa18,\r\n"
					+ "    CASE WHEN logistics.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa19,\r\n"
					+ "    CASE WHEN research.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa20,\r\n"
					+ "    CASE WHEN revival.APPLICATION_ID IS NULL THEN 0 ELSE 1 END AS selectfa21,\r\n"
					+ "\r\n"
					+ "    stat.STATUS_DESCRIPTION AS status\r\n"
					+ "\r\n"
					+ "FROM fa_msme_scheme schm\r\n"
					+ "\r\n"
					+ "LEFT JOIN fa_capital_assistance cap\r\n"
					+ "    ON schm.APPLICATION_ID = cap.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_infra_dev_exp_compensation infra\r\n"
					+ "    ON schm.APPLICATION_ID = infra.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_waste_mgmt_estb_exp_comp waste\r\n"
					+ "    ON schm.APPLICATION_ID = waste.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_electricity_fee_exemption elec\r\n"
					+ "    ON schm.APPLICATION_ID = elec.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_entry_tax_exemption_concess tax\r\n"
					+ "    ON schm.APPLICATION_ID = tax.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_mandi_fee_exemption mandi\r\n"
					+ "    ON schm.APPLICATION_ID = mandi.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_vat_cst_compensation vat\r\n"
					+ "    ON schm.APPLICATION_ID = vat.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_inst_estab_assistance inst\r\n"
					+ "    ON schm.APPLICATION_ID = inst.APPLICATION_ID\r\n"
					+ "\r\n"
					+ "LEFT JOIN fa_freight_assistance_for_export freight\r\n"
					+ "    ON schm.APPLICATION_ID = freight.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_global_competitiveness globalcomp\r\n"
					+ "    ON schm.APPLICATION_ID = globalcomp.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_food_processing_unit food\r\n"
					+ "    ON schm.APPLICATION_ID = food.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_apparel_sector apparel\r\n"
					+ "    ON schm.APPLICATION_ID = apparel.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_textile_unit textile\r\n"
					+ "    ON schm.APPLICATION_ID = textile.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_footwear_furniture_toys_value_chain_product footwear\r\n"
					+ "    ON schm.APPLICATION_ID = footwear.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_boosting_circular_economy circular\r\n"
					+ "    ON schm.APPLICATION_ID = circular.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_motor_vehicle_scrapping_centre vehicle\r\n"
					+ "    ON schm.APPLICATION_ID = vehicle.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_logistics_warehousing_project logistics\r\n"
					+ "    ON schm.APPLICATION_ID = logistics.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_research_development_project research\r\n"
					+ "    ON schm.APPLICATION_ID = research.APPLICATION_ID\r\n"
					+ "LEFT JOIN fa_revival_sick_unit revival\r\n"
					+ "    ON schm.APPLICATION_ID = revival.APPLICATION_ID\r\n"
					+ "\r\n"
					+ "LEFT JOIN fa_master_status stat\r\n"
					+ "    ON schm.STATUS = stat.MASTER_STATUS_ID\r\n"
					+ "\r\n"					
					+"LEFT JOIN (\r\n"
					+ "    SELECT application_id,\r\n"
					+ "           SUM(amount) AS total_investment\r\n"
					+ "    FROM fa_scheme_capital_investment\r\n"
					+ "    GROUP BY application_id\r\n"
					+ ") inv\r\n"
					+ "ON schm.APPLICATION_ID = inv.application_id \r\n"
					+ "WHERE schm.DISTRICT_ID = :districtId\r\n"
					+ "  AND schm.STATUS IN (2, 8, 11, 19)\r\n"
					+ "  AND schm.submitted_on <= (\r\n"
					+ "        SELECT submitted_on\r\n"
					+ "        FROM fa_msme_scheme\r\n"
					+ "        WHERE APPLICATION_ID = :applicationId\r\n"
					+ "  )\r\n"
					+ "AND COALESCE(inv.total_investment,0) <= 100000000 \r\n"
					+ "\r\n"
					+ "ORDER BY schm.CREATED_ON DESC";

	        // JAVA 21 / Hibernate 6: typed createNativeQuery replaces the deprecated
	        // untyped one. The row shape is defined by the addScalar() chain below, so
	        // Object[].class is the matching result type. SQL and scalars unchanged.
	        NativeQuery<Object[]> query = session.createNativeQuery(sql, Object[].class);

	        query.setParameter("districtId", districtId);
	        query.setParameter("applicationId", applicationId);

	        query.addScalar("districtId", StandardBasicTypes.LONG)
	             .addScalar("applicationId", StandardBasicTypes.STRING)
	             .addScalar("applicationDate", StandardBasicTypes.STRING)
	             .addScalar("unitOrInstName", StandardBasicTypes.STRING)
	             .addScalar("currentStatusId", StandardBasicTypes.LONG)
	             .addScalar("unitType", StandardBasicTypes.STRING)
	             .addScalar("memoPart2AckNo", StandardBasicTypes.STRING)
	             .addScalar("selectFa1", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa2", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa3", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa4", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa5", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa6", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa7", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa8", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa11", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa12", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa13", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa14", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa15", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa16", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa17", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa18", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa19", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa20", StandardBasicTypes.BOOLEAN)
	             .addScalar("selectFa21", StandardBasicTypes.BOOLEAN)	            
	             .addScalar("status", StandardBasicTypes.STRING)
	             .addScalar("createdBy", StandardBasicTypes.STRING);

	        // JAVA 21 / Hibernate 6: setTupleTransformer replaces deprecated setResultTransformer.
	        return query.setTupleTransformer(
	                new AliasToBeanTupleTransformer<>(FaNewMsmeBean.class)
	        ).list();

	    } finally {
	        if (session != null && session.isOpen()) {
	            session.close();
	        }
	    }
	}

	@Override
	public void saveEligibleAmount(List<ApplicantAssistance> assistanceList) {
		Session session = getSessionFactory().openSession();
		org.hibernate.Transaction tx = session.beginTransaction();
		try {
			for (ApplicantAssistance a : assistanceList) {
				// UPSERT by (application_id + assistance_id): update the existing row, else insert.
				// Prevents duplicate rows on repeated "Save All Amounts".
				// JAVA 21 / Hibernate 6: typed createQuery replaces the deprecated untyped one.
				ApplicantAssistance existing = session.createQuery(
						"from ApplicantAssistance where applicationId = :app and assistanceId = :aid",
						ApplicantAssistance.class)
						.setParameter("app", a.getApplicationId())
						.setParameter("aid", a.getAssistanceId())
						.setMaxResults(1).uniqueResult();
				if (existing != null) {
					// Save only changed values (idempotent otherwise). The remark is
					// compared as well, so editing ONLY the comment still persists.
					java.math.BigDecimal oldAmt = existing.getEligibleAmount();
					java.math.BigDecimal newAmt = a.getEligibleAmount();
					boolean amtChanged = (oldAmt == null) ? (newAmt != null)
							: (newAmt == null || oldAmt.compareTo(newAmt) != 0);
					String oldRem = existing.getRemark();
					String newRem = a.getRemark();
					boolean remChanged = (oldRem == null) ? (newRem != null && !newRem.isEmpty())
							: !oldRem.equals(newRem == null ? "" : newRem);
					if (amtChanged || remChanged) {
						existing.setEligibleAmount(newAmt);
						existing.setRemark(newRem);
						if (a.getAssistanceType() != null) { existing.setAssistanceType(a.getAssistanceType()); }
						// JAVA 21 / Hibernate 6: update() is deprecated. "existing" was loaded
						// by the query above in THIS session and is therefore already managed,
						// so the setters have marked it dirty; merge() is equivalent here.
						session.merge(existing);
					}
				} else {
					// JAVA 21 / Hibernate 6: save() -> persist() for a new (transient) row.
					session.persist(a);
				}
			}
			tx.commit();
		} catch (RuntimeException e) {
			if (tx != null && tx.isActive()) { tx.rollback(); }
			throw e;
		} finally {
			if (session != null && session.isOpen()) { session.close(); }
		}
	}

	@Override
	public void saveSanctionedAmount(List<ApplicantAssistance> assistanceList) {
		Session session = getSessionFactory().openSession();
		org.hibernate.Transaction tx = session.beginTransaction();
		try {
			for (ApplicantAssistance a : assistanceList) {
				// Prefer the EXACT row by id (so each assistance line - including legacy duplicate
				// rows sharing an assistance_id - keeps its own sanctioned amount). Fall back to
				// (application_id + assistance_id) UPSERT, else insert. Only sanctioned_amount is
				// touched (eligible untouched).
				ApplicantAssistance existing = null;
				if (a.getId() != null) {
					existing = (ApplicantAssistance) session.get(ApplicantAssistance.class, a.getId());
				}
				if (existing == null) {
					// JAVA 21 / Hibernate 6: typed createQuery replaces the deprecated untyped one.
					existing = session.createQuery(
							"from ApplicantAssistance where applicationId = :app and assistanceId = :aid",
							ApplicantAssistance.class)
							.setParameter("app", a.getApplicationId())
							.setParameter("aid", a.getAssistanceId())
							.setMaxResults(1).uniqueResult();
				}
				if (existing != null) {
					java.math.BigDecimal oldAmt = existing.getSanctionedAmount();
					java.math.BigDecimal newAmt = a.getSanctionedAmount();
					boolean changed = (oldAmt == null) ? (newAmt != null)
							: (newAmt == null || oldAmt.compareTo(newAmt) != 0);
					if (changed) {
						existing.setSanctionedAmount(newAmt);
						// JAVA 21 / Hibernate 6: update() is deprecated. "existing" is already
						// managed in THIS session (loaded via get()/query above), so merge() is
						// equivalent; dirty checking writes the same UPDATE.
						session.merge(existing);
					}
				} else {
					// JAVA 21 / Hibernate 6: save() -> persist() for a new (transient) row.
					session.persist(a);
				}
			}
			tx.commit();
		} catch (RuntimeException e) {
			if (tx != null && tx.isActive()) { tx.rollback(); }
			throw e;
		} finally {
			if (session != null && session.isOpen()) { session.close(); }
		}
	}

	/** All saved assistance rows (name + eligible amount) for an app, from applicant_assistance. */
	@SuppressWarnings("unchecked")
	@Override
	public List<ApplicantAssistance> getApplicantAssistances(String applicationId) {
		Session session = getSessionFactory().openSession();
		try {
			// JAVA 21 / Hibernate 6: typed createQuery replaces the deprecated untyped one.
			Query<ApplicantAssistance> q = session.createQuery(
					"from ApplicantAssistance a where a.applicationId = :app order by a.assistanceId asc",
					ApplicantAssistance.class);
			q.setParameter("app", applicationId);
			return q.list();
		} finally {
			if (session != null && session.isOpen()) { session.close(); }
		}
	}

	/** Assistance Master (assistance_id -> assistance_name) for resolving the Assistance Type name. */
	@SuppressWarnings("unchecked")
	@Override
	public java.util.Map<Long, String> getAssistanceMasterNames() {
		java.util.Map<Long, String> map = new java.util.HashMap<Long, String>();
		Session session = getSessionFactory().openSession();
		try {
			org.hibernate.query.NativeQuery<Object[]> q = session.createNativeQuery( // JAVA 21: typed; 2 columns -> Object[]
					"select assistance_id, assistance_name from assistance_master", Object[].class);
			List<Object[]> rows = q.list();
			if (rows != null) {
				for (Object[] r : rows) {
					if (r != null && r[0] != null && r[1] != null) {
						try { map.put(Long.valueOf(r[0].toString()), r[1].toString()); }
						catch (NumberFormatException ignore) { }
					}
				}
			}
		} finally {
			if (session != null && session.isOpen()) { session.close(); }
		}
		return map;
	}

	/** assistance_id(s) that already have a saved eligible amount (NOT NULL; 0 counts) for an app. */
	@SuppressWarnings("unchecked")
	@Override
	public List<Long> getSavedEligibleAssistanceIds(String applicationId) {
		Session session = getSessionFactory().openSession();
		try {
			org.hibernate.query.NativeQuery<Object> q = session.createNativeQuery( // JAVA 21: typed; SINGLE column -> Object (keeps raw value)
					"select distinct assistance_id from applicant_assistance "
					+ "where application_id = :app and eligible_amount is not null", Object.class);
			q.setParameter("app", applicationId);
			List<?> raw = q.list();
			List<Long> ids = new java.util.ArrayList<Long>();
			if (raw != null) {
				for (Object o : raw) {
					if (o != null) {
						try { ids.add(Long.valueOf(o.toString())); } catch (NumberFormatException ignore) { }
					}
				}
			}
			return ids;
		} finally {
			if (session != null && session.isOpen()) { session.close(); }
		}
	}

@Override
	public List<UnitAddressDetails> fetchUnitAddressDetailsByUserId(String username) {

		// JAVA 21 NOTE: SVN me legacy Criteria + Restrictions.eq("user", username)
		// tha, jo Hibernate 6 me hata diya gaya. CriteriaBuilder me likha gaya hai;
		// behaviour same -- match na hone par khali list.
		Session session = getSession();
		try {
			CriteriaBuilder cb = session.getCriteriaBuilder();
			CriteriaQuery<UnitAddressDetails> query = cb.createQuery(UnitAddressDetails.class);
			Root<UnitAddressDetails> root = query.from(UnitAddressDetails.class);
			query.where(cb.equal(root.get("user"), username));
			return session.createQuery(query).getResultList();

		} finally {
			if (session != null && session.isOpen()) {
				session.close();
			}
		}
	}


	/**
	 * Bank details by primary key.
	 *
	 * NOTE: ye method SVN working copy me KAHIN NAHI thi -- FAServiceImpl ise
	 * bulati hai par na FADao me declare thi na FADaoImpl me implement.
	 * Isliye ye yahan likhi gayi hai: seedha primary-key lookup, jo call site
	 * ki null-check ke saath match karta hai (session.get na milne par null deta hai).
	 */
	public UserBankDetails fetchUserBankDetailsById(Long bankId) {
		Session session = getSessionFactory().openSession();
		try {
			return (UserBankDetails) session.get(UserBankDetails.class, bankId);
		} finally {
			if (session != null && session.isOpen()) {
				session.close();
			}
		}
	}
}



