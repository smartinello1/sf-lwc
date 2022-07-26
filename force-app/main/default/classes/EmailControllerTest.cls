@isTest
private with sharing class EmailControllerTest {
	@TestSetup
	static void makeData() {
	}

	@isTest
	static void sendTest() {
		Test.startTest();
		EmailController.Send(
			'testmio@test.test',
			UserInfo.getUserEmail(),
			'test',
			'test'
		);
		EmailController.getPicklist();
		EmailController.getEmailTemplate();
		String str;
		String aa;
		Test.stopTest();
	}
}
