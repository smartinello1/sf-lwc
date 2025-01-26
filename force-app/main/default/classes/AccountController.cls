public with sharing class AccountController {

  public static List<Account> getAllActiveAccounts() { 
    return [SELECT Id, Name, Active__c, Phone, CreatedBy.Name, CreatedBy.Id, CreatedDate, LastModifiedDate FROM Account WHERE Active__c = {PLCH_ACCOUNT_FILTER} ];
  }

}
