@isTest
private with sharing class AccountControllerTest_v3 {

	@TestSetup
	static void makeData() {
		Account acc = new Account( 
			Name = 'Active', 
			Active__c = 'Yes', 
			Phone = '123'
		);
		insert acc;
	}


	@isTest
	static void getAllActiveAccountsTest() {
		Test.startTest();
			AccountController_v3.getAllActiveAccounts();
		Test.stopTest();
	}
}
