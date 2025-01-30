public with sharing class AccountController_v3 {

  public static List<Account> getAllActiveAccounts() { 
    return [SELECT Id, Name, Active__c, CreatedBy.Name, CreatedDate, LastModifiedDate     FROM Account WHERE Active__c = 'Yes' ];
  }

}
