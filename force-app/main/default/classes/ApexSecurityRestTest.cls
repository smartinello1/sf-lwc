@isTest
private without sharing class ApexSecurityRestTest {
	@TestSetup
	static void makeData() {
		Contact c = new Contact(LastName = 'testapexrest');
		insert c;
	}

	@isTest
	static void testApexSecurity() {
		Contact c = [SELECT Id FROM Contact LIMIT 1];
		RestRequest req = new RestRequest();
		RestResponse res = new RestResponse();

		req.requestURI = '/services/apexrest/apexSecurityRest'; //Request URL
		req.httpMethod = 'GET'; //HTTP Request Type
		req.addParameter('id', c.Id);
		RestContext.request = req;
		RestContext.response = res;

		ApexSecurityRest.doGet();
	}
}
