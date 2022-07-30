@isTest
public with sharing class ArticleViewStatisticsManagerCtrlTest {
  @TestSetup
  static void makeData() {
    Account acc = new Account(Name = 'testUpdate');
    Account acc2 = new Account(Name = 'testInsert');

    List<Account> accs = new List<Account>{ acc, acc2 };
    insert accs;

    Article_View_Statistic__c avs = new Article_View_Statistic__c(
      Account__c = accs[0].Id,
      User__c = UserInfo.getUserId(),
      View__c = 1,
      Viewed__c = System.now(),
      uniqueId__c = accs[0].Id + '_' + UserInfo.getUserId()
    );
    insert avs;
  }

  //Test case for record create with positive outcome
  @isTest
  static void testInsertArticleViewStatisticsOK() {
    Account acc = [SELECT Id FROM Account WHERE Name = 'testInsert'];
    Test.startTest();
    try {
      ArticleViewStatisticsManagerCtrl.manageArticleView(acc.Id);
    } catch (AuraHandledException e) {
      System.debug('aura exc: ' + e.getStackTraceString());
    }
    Test.stopTest();

    String uniqueId = acc.Id + '_' + UserInfo.getUserId();

    List<Article_View_Statistic__c> avs = new List<Article_View_Statistic__c>(
      [
        SELECT Id, View__c
        FROM Article_View_Statistic__c
        WHERE uniqueId__c = :uniqueId
      ]
    );
    System.assertEquals(true, avs[0].View__c == 1, 'Not created');
  }

  //Test case for record create with negative outcome, user who does not have access to the sobject
  @isTest
  static void testInsertArticleViewStatisticsKO() {
    Account acc = [SELECT Id FROM Account WHERE Name = 'testInsert'];
    Test.startTest();
    Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
    User u = new User(
      Alias = 'standt',
      Email = 'standarduser@testorg.com',
      EmailEncodingKey = 'UTF-8',
      LastName = 'Testing',
      LanguageLocaleKey = 'en_US',
      LocaleSidKey = 'en_US',
      ProfileId = p.Id,
      TimeZoneSidKey = 'America/Los_Angeles',
      UserName = 'standarduser@testorg.com' + UserInfo.getOrganizationId()
    );

    System.runAs(u) {
      System.debug('Current User: ' + UserInfo.getUserName());
      System.debug('Current Profile: ' + UserInfo.getProfileId());
      try {
        ArticleViewStatisticsManagerCtrl.manageArticleView(acc.Id);
      } catch (AuraHandledException e) {
        System.debug('aura exc: ' + e.getStackTraceString());
      }
    }
    Test.stopTest();

    String uniqueId = acc.Id + '_' + UserInfo.getUserId();

    List<Article_View_Statistic__c> avs = new List<Article_View_Statistic__c>(
      [
        SELECT Id, View__c
        FROM Article_View_Statistic__c
        WHERE uniqueId__c = :uniqueId
      ]
    );
    System.assertEquals(
      true,
      avs.isEmpty(),
      'User does not have access to the object'
    );
  }

  //Test case for record update with positive outcome
  @isTest
  static void testUpdateArticleViewStatisticsOK() {
    Account acc = [SELECT Id FROM Account WHERE Name = 'testUpdate'];
    Test.startTest();
    try {
      ArticleViewStatisticsManagerCtrl.manageArticleView(acc.Id);
    } catch (AuraHandledException e) {
      System.debug('aura exc: ' + e.getStackTraceString());
    }
    Test.stopTest();

    String uniqueId = acc.Id + '_' + UserInfo.getUserId();

    List<Article_View_Statistic__c> avs = new List<Article_View_Statistic__c>(
      [
        SELECT Id, View__c
        FROM Article_View_Statistic__c
        WHERE uniqueId__c = :uniqueId
      ]
    );
    System.assertEquals(true, avs[0].View__c == 2, 'Not updated');
  }

  //Test case for record update with negative outcome, user who does not have access to the sobject
  @isTest
  static void testUpdateArticleViewStatisticsKO() {
    Account acc = [SELECT Id FROM Account WHERE Name = 'testUpdate'];
    Test.startTest();
    Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
    User u = new User(
      Alias = 'standt',
      Email = 'standarduser@testorg.com',
      EmailEncodingKey = 'UTF-8',
      LastName = 'Testing',
      LanguageLocaleKey = 'en_US',
      LocaleSidKey = 'en_US',
      ProfileId = p.Id,
      TimeZoneSidKey = 'America/Los_Angeles',
      UserName = 'standarduser@testorg.com' + UserInfo.getOrganizationId()
    );
    insert u;

    Article_View_Statistic__c avs2 = new Article_View_Statistic__c(
      Account__c = acc.Id,
      User__c = u.Id,
      View__c = 1,
      Viewed__c = System.now(),
      uniqueId__c = acc.Id + '_' + u.Id
    );
    insert avs2;

    System.runAs(u) {
      System.debug('Current User: ' + UserInfo.getUserName());
      System.debug('Current Profile: ' + UserInfo.getProfileId());
      try {
        ArticleViewStatisticsManagerCtrl.manageArticleView(acc.Id);
      } catch (AuraHandledException e) {
        System.debug('aura exc: ' + e.getStackTraceString());
      }
    }
    Test.stopTest();

    String uniqueId = acc.Id + '_' + u.Id;

    List<Article_View_Statistic__c> avs = new List<Article_View_Statistic__c>(
      [
        SELECT Id, View__c
        FROM Article_View_Statistic__c
        WHERE uniqueId__c = :uniqueId
      ]
    );
    System.assertEquals(true, avs[0].View__c == 1, 'Not updated');
  }
}