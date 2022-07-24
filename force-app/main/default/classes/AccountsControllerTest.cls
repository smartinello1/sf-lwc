@isTest
private with sharing class AccountsControllerTest {
	@TestSetup
	static void makeData() {
		Account acc = new Account(Name = 'testaccount');
		insert acc;
	}

	@isTest
	static void getAccountsTest() {
		Test.startTest();
		AccountsController.getAccounts();
		Test.stopTest();
	}

	@isTest
	static void delAccountTest() {
		Account acc = [SELECT Id, Name FROM Account LIMIT 1];
		Test.startTest();
		AccountsController.delAccount(acc);
		Test.stopTest();
	}
}
