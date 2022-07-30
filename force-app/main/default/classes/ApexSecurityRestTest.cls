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

		req.requestURI = '/services/apexrest/apexSecurityRest?id=' + c.Id; //Request URL
		req.httpMethod = 'GET'; //HTTP Request Type
		RestContext.request = req;
		RestContext.response = res;

		ApexSecurityRest.doGet();
	}
}
