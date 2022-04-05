public class FilterController {
  @AuraEnabled
  public static WrapperResponse getFilters() {
    WrapperResponse response = new WrapperResponse();

    try {
      List<User> uList = new List<User>(
        [SELECT Id, Name FROM User WHERE IsActive = TRUE]
      );
      List<FilterMap> filtri = new List<FilterMap>();

      for (User u : uList) {
        FilterMap f = new FilterMap(u.Id, u.Name, false);
        filtri.add(f);
      }

      response.data.add(filtri);
    } catch (exception e) {
      System.debug('@@@ error ' + e.getMessage() + ' -- ' + e.getLineNumber());
      response.message = e.getMessage();
      response.success = false;
    }

    return response;
  }

  public class WrapperResponse {
    @AuraEnabled
    public List<Object> data;
    @AuraEnabled
    public String message;
    @AuraEnabled
    public Boolean success;

    public WrapperResponse() {
      this.data = new List<Object>();
      this.message = '';
      this.success = true;
    }
  }

  public class FilterMap {
    @AuraEnabled
    public String value;
    @AuraEnabled
    public String label;
    @AuraEnabled
    public Boolean isTeam;

    public FilterMap(String value, String label, Boolean isTeam) {
      this.value = value;
      this.label = label;
      this.isTeam = isTeam;
    }
  }
}