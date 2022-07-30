@isTest
private without sharing class ListCaseControllerTest {
	@isTest
	static void initTest() {
		Test.startTest();
		ListCaseController.init(new List<String>());
		ListCaseController.init(new List<String>{ 'test' });
		Test.stopTest();
	}

	@isTest
	static void redirectTest() {
		Test.startTest();
		ListCaseController.redirect();
		Test.stopTest();
	}
}
