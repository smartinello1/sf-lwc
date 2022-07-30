public with sharing class JobManagerController {
	@AuraEnabled(cacheable=true)
	public static List<AsyncApexJob> getAsyncApexJobs() {
		return [SELECT Id, ApexClass.Name FROM AsyncApexJob];
	}
}
