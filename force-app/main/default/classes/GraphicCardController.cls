public class GraphicCardController {
  public GraphicCardController() {
  }

  @AuraEnabled
  public static List<Contact> getChartData(String recordId) {
    List<Contact> cntList = new List<Contact>(
      [SELECT Id, Name FROM Contact WHERE AccountId = :recordId]
    );
    System.debug('@@@ cntList ' + cntList);
    return cntList;
  }
}