public with sharing class AccountController {

  public static List<Account> getAllActiveAccounts() { 
    return [SELECT Id, Name, Active__c, CreatedBy.Name, CreatedDate,            LastModifiedDate  FROM Account WHERE Active__c = {PLCH_ACCOUNT_FILTER} ];
  }

}
