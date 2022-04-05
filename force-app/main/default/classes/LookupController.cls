public class LookupController {
  @AuraEnabled
  public String objId;
  @AuraEnabled
  public String sObjectName;
  @AuraEnabled
  public String iconName;
  @AuraEnabled
  public String name;

  public LookupController() {
    this.objId = '';
    this.sObjectName = 'Opportunity';
    this.iconName = 'standard:opportunity';
    this.name = 'Nome Opportunità';
  }

  public LookupController(
    String objId,
    String sObjectName,
    String iconName,
    String name
  ) {
    this.objId = objId;
    this.sObjectName = sObjectName;
    this.iconName = iconName;
    this.name = name;
  }

  @AuraEnabled
  public static List<LookupController> getSearchResult(
    String strSearch,
    String sObjectName,
    String iconName
  ) {
    List<LookupController> results = new List<LookupController>();
    String query = '';

    if (String.isBlank(strSearch))
      return results;

    //TODO Migliora mettendo la lista di campi da cercare
    query =
      'SELECT Id, Name FROM ' +
      sObjectName +
      ' WHERE Name LIKE \'%' +
      strSearch +
      '%\' ';

    System.debug('@@@ final query ' + query);
    List<SObject> sobjectList = Database.query(query);

    for (SObject obj : sobjectList) {
      LookupController res = new LookupController(
        (Id) obj.get('Id'),
        sObjectName,
        iconName,
        String.valueOf(obj.get('Name'))
      );
      results.add(res);
    }

    return results;
  }

  @AuraEnabled(cacheable=true)
  public static string getSessionId() {
    System.debug('@@@ getSessionId ' + SessionIdController.getSessionId());
    return SessionIdController.getSessionId();
  }
}