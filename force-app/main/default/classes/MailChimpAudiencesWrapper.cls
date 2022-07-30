public class MailChimpAudiencesWrapper {
  @AuraEnabled
  public Integer total_items;
  @AuraEnabled
  public List<Map<String, String>> mc_links;
  @AuraEnabled
  public List<MailChimpAudienceWrapper> lists;
  @AuraEnabled
  public MailChimpAudiencesConstraints constraints;

  public class MailChimpAudiencesConstraints {
    @AuraEnabled
    public Boolean may_create;
    @AuraEnabled
    public Integer max_instances;
    @AuraEnabled
    public Integer current_total_instances;
  }

  public class MailChimpAudienceWrapper {
    @AuraEnabled
    public String mc_id;
    @AuraEnabled
    public Integer web_id;
    @AuraEnabled
    public String name;
    @AuraEnabled
    public Map<String, String> contact;
    @AuraEnabled
    public Map<String, String> stats;
  }
}