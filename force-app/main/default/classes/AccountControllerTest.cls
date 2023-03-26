@isTest
private with sharing class AccountControllerTest {
	@TestSetup
	static void makeData() {
		Account acc = new Account(
			Name = 'Active', 
			Active__c = 'Yes'
		);
		insert acc;
	}

	@isTest
	static void getAllActiveAccountsTest() {
		Test.startTest();
		AccountController.getAllActiveAccounts();
		Test.stopTest();
	}
}
