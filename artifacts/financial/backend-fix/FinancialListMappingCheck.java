import java.util.*;
import com.mapit.mpindustry.fa.bean.FaNewMsmeBean;
public class FinancialListMappingCheck {
 interface Tuple { Object get(String alias); }
 static List<FaNewMsmeBean> map(List<Tuple> results) {
  List<FaNewMsmeBean> beans = new ArrayList<>();
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
 public static void main(String[] args) {
  for (Number district : new Number[]{null, 23L, 23, new java.math.BigInteger("23"),new java.math.BigDecimal("23")}) {
   Map<String,Object> values=new HashMap<>();
   values.put("districtId",district); values.put("applicationId","TEST-1");
   values.put("applicationDate","15-10-2026");values.put("unitOrInstName","Test Unit");
   values.put("currentStatusId",2L);values.put("status","Submitted");
   for(int i=1;i<=8;i++)values.put("selectFa"+i,i==1?1:0);
   List<FaNewMsmeBean> rows=map(List.of(values::get));
   if(rows.size()!=1)throw new AssertionError("A row was lost");
   FaNewMsmeBean row=rows.get(0);
   if(!Objects.equals(row.getDistrictId(),district==null?null:Long.valueOf(23)))throw new AssertionError("Wrong district");
   if(!"TEST-1".equals(row.getApplicationId())||!"Test Unit".equals(row.getUnitOrInstName())||row.getCurrentStatusId()!=2L||!row.isSelectFa1()||row.isSelectFa2())throw new AssertionError("Other fields changed");
  }
  System.out.println("PASS: null and four numeric district representations; application and status fields retained.");
 }
}
