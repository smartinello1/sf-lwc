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

		req.requestURI = '/services/apexrest/secureApexRest?id=' + c.Id; //Request URL
		req.httpMethod = 'GET'; //HTTP Request Type
		RestContext.request = req;
		RestContext.response = res;

		SecureApexRest.doGet();
	}
}
