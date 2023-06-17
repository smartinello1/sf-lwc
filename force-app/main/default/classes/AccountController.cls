public with sharing class AccountController {
  public static List<Account> getAllActiveAccounts() {
    return [SELECT Id, Name, Active__c, LastModifiedDate FROM Account WHERE Active__c = _ACCOUNT_FILTER];
  }
}
