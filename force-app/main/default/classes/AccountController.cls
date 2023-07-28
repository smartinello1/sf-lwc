public with sharing class AccountController {
  // comment
  
  public static List<Account> getAllActiveAccounts() { 

    return [SELECT Id, Name, Active__c, LastModifiedDate  FROM Account WHERE Active__c = {PLCH_ACCOUNT_FILTER} ];
  





    
  }
}
