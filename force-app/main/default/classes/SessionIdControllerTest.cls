@isTest
private without sharing class SessionIdControllerTest {
	@isTest
	static void getSessionIdTest() {
		Test.startTest();
		SessionIdController.getSessionId();
		Test.stopTest();
	}
}
