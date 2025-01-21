public with sharing class AccountController {
  public static List<Account> getAllActiveAccounts() {
    return [SELECT Id, Name, Phone, Active__c, LastModifiedDate FROM Account WHERE Active__c = {PLCH_ACCOUNT_FILTER} ];
  }
}
