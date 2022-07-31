@isTest
private with sharing class GlobalSearchControllerTest {
	@isTest
	static void getOrgSObjectsTest() {
		GlobalSearchController.getOrgSObjects();
	}

	@isTest
	static void getSObjectFieldsTest() {
		GlobalSearchController.getSObjectFields('Account');
	}

	@isTest
	static void getRecordsFromSOQLTest() {
		GlobalSearchController.getRecordsFromSOQL('SELECT Id FROM Account LIMIT 1');
	}
}
