@isTest
private without sharing class EinsteinVisionControllerTest {
	@isTest
	static void testToken() {
		// EinsteinVisionController.getAccessToken();
		ContentVersion cv = new ContentVersion(
			Title = 'test1233123',
			VersionData = Blob.valueOf('test'),
			PathOnClient = 'test1233123'
		);
		insert cv;

		cv = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id = :cv.Id];
		Account acc = new Account(Name = 'test24143123');
		insert acc;
		EinsteinVisionController.createPublicLink(cv.ContentDocumentId, acc.Id);
	}
}
