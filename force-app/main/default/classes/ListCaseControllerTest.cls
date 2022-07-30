@isTest
private without sharing class ListCaseControllerTest {
	@TestSetup
	static void makeData() {
		Case c = new Case(Status = 'Open');
		insert c;
	}

	@isTest
	static void redirectTest() {
		List<Case> ccc = new List<Case>([SELECT Id FROM Case]);
		Test.startTest();
		ListCaseController.init(JSON.serialize(ccc));
		Test.stopTest();
	}

	@isTest
	static void redirectTest() {
		Test.startTest();
		ListCaseController.redirect();
		Test.stopTest();
	}
}
