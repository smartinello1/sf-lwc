@isTest
private without sharing class MyPropertyControllerTest {
	@isTest
	static void getSimilarPropertiesTest() {
		MyPropertyController.getSimilarProperties(null, 'Bedrooms', 1, 10, 20);
		MyPropertyController.getSimilarProperties(null, 'Price', 1, 10, 20);
		MyPropertyController.getSimilarProperties(null, 'Price', 1, 10, null);
	}
}
