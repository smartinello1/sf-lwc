public without sharing class SurveyController {

    @AuraEnabled
    public static Id getAccountIdFromCustomerCode(String customerCode){
        try {
            return [SELECT Id FROM Account WHERE Name =: customerCode].Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void saveSurveyResponse(String question, String answer, Id accountId){
        try {
            GT_SurveyResponse__c sr = new GT_SurveyResponse__c(
                GT_AccountId__c = accountId,
                GT_Question__c = question,
                GT_Answer__c = answer
            );
            insert sr;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}