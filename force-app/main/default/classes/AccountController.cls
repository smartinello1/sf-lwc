public with sharing class AccountController {

  public static List<Account> getAllActiveAccounts() { 
    return [SELECT Id, Name, Active__c, Phone, CreatedBy.Name, CreatedById, CreatedDate, LastModifiedDate FROM Account WHERE Active__c = {PLCH_ACCOUNT_FILTER} ];
  }

}
