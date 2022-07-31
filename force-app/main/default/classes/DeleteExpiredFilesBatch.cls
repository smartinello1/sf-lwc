public with sharing class DeleteExpiredFilesBatch implements Schedulable, Database.Batchable<SObject> {
  public DeleteExpiredFilesBatch() {
  }

  public void execute(SchedulableContext sc) {
    Database.executeBatch(new DeleteExpiredFilesBatch(), 100);
  }

  public Database.QueryLocator start(Database.BatchableContext BC) {
    Set<Id> cdIds = new Set<Id>();
    List<ContentVersion> cvs = new List<ContentVersion>(
      [
        SELECT Id, ContentDocumentId
        FROM ContentVersion
        WHERE Expiration_Date__c < :System.Today()
      ]
    );

    for (ContentVersion cv : cvs) {
      cdIds.add(cv.ContentDocumentId);
    }

    String query = 'SELECT Id FROM ContentDocument WHERE Id IN: cdIds';
    return Database.getQueryLocator(query);
  }

  public void execute(
    Database.BatchableContext BC,
    List<ContentDocument> docsToDelete
  ) {
    Database.delete(docsToDelete, false);
  }

  public void finish(Database.BatchableContext BC) {
  }
}