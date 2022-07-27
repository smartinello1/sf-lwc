@isTest
private with sharing class ContactAccount_ControllerTest {
	@TestSetup
	static void makeData() {
		Account acc = new Account(Name = 'testacc');

		insert acc;

		Contact c = new Contact(
			AccountId = acc.Id,
			FirstName = 'test',
			LastName = 'test'
		);
		insert c;
	}

	@isTest
	static void getAccountInfoTest() {
		Contact c = [SELECT Id FROM Contact WHERE AccountId != NULL];

		Test.startTest();
		ContactAccount_Controller.getAccountInfo(c.Id);
		ContactAccount_Controller.getAccountInfo('ab');
		String s;
		Test.stopTest();
	}
}
