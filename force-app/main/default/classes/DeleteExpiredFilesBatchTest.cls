@isTest
private with sharing class DeleteExpiredFilesBatchTest {
  static final String CRON_EXP = '0 0 13 * * ?';

  @TestSetup
  static void makeData() {
    ContentVersion cv = new ContentVersion(
      Title = 'test',
      VersionData = Blob.valueOf('test'),
      PathOnClient = 'test.txt',
      Expiration_Date__c = System.Today().addDays(-1)
    );
    insert cv;
  }

  @isTest
  static void testSchedulingDeleteExpiredFilesBatch() {
    System.schedule(
      'Test Delete Expired Files Batch',
      CRON_EXP,
      new DeleteExpiredFilesBatch()
    );

    List<AsyncApexJob> jobs = new List<AsyncApexJob>(
      [
        SELECT Id, ApexClass.Name
        FROM AsyncApexJob
        WHERE ApexClass.Name = 'DeleteExpiredFilesBatch'
      ]
    );
    System.assertEquals(true, !jobs.isEmpty(), 'Scheduled Job not found');
  }

  @isTest
  static void testDeleteExpiredFilesBatch() {
    Test.startTest();
    Database.executeBatch(new DeleteExpiredFilesBatch());
    Test.stopTest();

    List<ContentVersion> cvs = new List<ContentVersion>(
      [SELECT Id FROM ContentVersion WHERE Title = 'test']
    );
    System.assertEquals(true, cvs.isEmpty(), 'Content Version not deleted');
  }
}