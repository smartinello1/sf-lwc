@isTest
private without sharing class SecureApexRestTest {
	@TestSetup
	static void makeData() {
		Contact c = new Contact(LastName = 'a');  
		insert c;
	}

	@isTest
	static void doGetTest() {
		Contact c = [SELECT Id FROM Contact LIMIT 1];
		RestRequest req = new RestRequest();
		RestResponse res = new RestResponse();

		req.requestURI = '/services/apexrest/secureApexRest'; //Request URL
		req.httpMethod = 'GET'; //HTTP Request Type
		req.addParameter('id', c.Id);
		RestContext.request = req;
		RestContext.response = res;

		SecureApexRest.doGet();
	}
}
