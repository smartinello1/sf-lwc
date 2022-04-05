public class DataTableController {
  @AuraEnabled
  public static List<Contact> getRelatedContacts(String id) {
    System.debug(' @@@ id ' + id);
    List<Contact> lstcnt = [
      SELECT FirstName, LastName, Email
      FROM Contact
      WHERE AccountId = :id
    ];
    System.debug(' @@@ lstcnt ' + lstcnt);
    return lstcnt;
  }
}