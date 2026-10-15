import java.util.*;
import com.mapit.mpindustry.fa.bean.InfrastructureBean;
public class InfrastructureMappingCheck {
 interface Tuple {Object get(String alias);}
static List<InfrastructureBean> map0(List<Tuple> results){List<InfrastructureBean> beans=new ArrayList<>();
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

return beans;}
static List<InfrastructureBean> map1(List<Tuple> results){List<InfrastructureBean> beans=new ArrayList<>();
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

return beans;}
 public static void main(String[] args)throws Exception {
  String[] keys={"districtId","applicationFileDocId","projectReportId","ownershipDocId","khasaraDocId","landMapDocId","electricalInstallationFileDocId","approachRoadFileDocId","approachRoadNocDocId","waterEstimateDocId","electricalInstallationMapDocId"};
  for(Object date:new Object[]{null, java.sql.Timestamp.valueOf("2026-10-15 14:58:45.123456"), "2026-10-15", java.sql.Date.valueOf("2026-10-15")}) {
  for(boolean present:new boolean[]{false,true}) {
   Map<String,Object> values=new HashMap<>(); values.put("id",17L);values.put("applicantName","Test applicant");
   values.put("createdDate",date);
   for(String key:keys) values.put(key,present?new java.math.BigInteger("23"):null);
   for(List<InfrastructureBean> rows:List.of(map0(List.of(values::get)),map1(List.of(values::get)))) {
    if(rows.size()!=1||rows.get(0).getId()!=17L)throw new AssertionError("Row lost");
    if(!Objects.equals(rows.get(0).getCreatedDate(),date==null?null:date.toString()))throw new AssertionError("Date conversion");
    Object[] actual={rows.get(0).getDistrictId(),rows.get(0).getApplicationFileDocId(),rows.get(0).getProjectReportId(),rows.get(0).getOwnershipDocId(),rows.get(0).getKhasaraDocId(),rows.get(0).getLandMapDocId(),rows.get(0).getElectricalInstallationFileDocId(),rows.get(0).getApproachRoadFileDocId(),rows.get(0).getApproachRoadNocDocId(),rows.get(0).getWaterEstimateDocId(),rows.get(0).getElectricalInstallationMapDocId()};
    for(int i=0;i<keys.length;i++)if(!Objects.equals(actual[i],present?23L:null))throw new AssertionError(keys[i]);
   }
  }
  }
  System.out.println("PASS: Timestamp, SQL Date, string and null dates; list/detail mappings retain rows with 11 null or numeric optional IDs.");
 }
}
