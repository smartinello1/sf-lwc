public with sharing class ContactController {
	@AuraEnabled(cacheable=true)
	public static List<Contact> getContacts() {
        throw new AuraHandledException('errors');
		// return [SELECT Id, FirstName, LastName, Email FROM Contact];
	}
}