@isTest
private with sharing class CloneUserControllerTest {
	@TestSetup
	static void makeData() {
		Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
		User u = new User(
			Alias = 'standt',
			Email = 'standarduser@testorgdev.com',
			EmailEncodingKey = 'UTF-8',
			LastName = 'Testing',
			LanguageLocaleKey = 'en_US',
			LocaleSidKey = 'en_US',
			ProfileId = p.Id,
			TimeZoneSidKey = 'America/Los_Angeles',
			UserName = 'standarduser@testorgdev.com' + UserInfo.getOrganizationId()
		);
		insert u;
		String s;
		String s1;
		String s2;
		String s3;
	}

	@isTest
	static void cloneUserTest() {
		User u = [SELECT Id FROM User WHERE Email = 'standarduser@testorgdev.com'];
		Test.startTest();
		CloneUserController.getUserInfo(
			u.Id,
			'test',
			'test',
			'tst',
			'test@test.com.dev' + UserInfo.getOrganizationId(),
			'test@test.com.dev' + UserInfo.getOrganizationId()
		);
		Test.stopTest();
	}
}
