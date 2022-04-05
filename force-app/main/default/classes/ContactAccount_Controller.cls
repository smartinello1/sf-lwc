public class ContactAccount_Controller {
  @AuraEnabled
  public static Account getAccountInfo(String contactId) {
    List<Contact> lstCnt = new List<Contact>();

    lstCnt = [SELECT Id, AccountId FROM Contact WHERE Id = :contactId];

    if (!lstCnt.isEmpty()) {
      Account a = new Account();
      a = [
        SELECT Id, Name, Owner.Name, Rating
        FROM Account
        WHERE Id = :lstCnt.get(0).AccountId
      ];
      return a;
    } else {
      return null;
    }
  }
}