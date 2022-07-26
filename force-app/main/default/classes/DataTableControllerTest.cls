@isTest
private with sharing class DataTableControllerTest {
	@TestSetup
	static void makeData() {
		Account acc = new Account(Name = 'testdatatable');
		insert acc;

		Contact cnt = new Contact(
			AccountId = acc.Id,
			FirstName = 'test',
			LastName = 'testdatatable'
		);
		insert cnt;
	}

	@isTest
	static void getRelatedTest() {
		Contact c = [SELECT Id FROM Contact LIMIT 1];
		Test.startTest();
		DataTableController.getRelatedContacts(c.Id);
		String s;
		String str;
		String s;
		Test.stopTest();
	}
}
