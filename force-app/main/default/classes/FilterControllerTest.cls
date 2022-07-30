@isTest
private without sharing class FilterControllerTest {
	@isTest
	static void getFilterTest() {
		Test.startTest();
		FilterController.getFilters();
		Test.stopTest();
	}
}
