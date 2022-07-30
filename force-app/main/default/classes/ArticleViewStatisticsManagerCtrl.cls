/*
 * @description: Class to manage Article_View_Statistic__c sobject, count the view for each user and for each Knoledge Article
 * @see: ArticleViewStatisticManagerCtrlTest
 */
public with sharing class ArticleViewStatisticsManagerCtrl {
  /*
   * @description: method to create a record for view count of Knowledge Article, or increase the counter of the existing record
   * @param: recordId -> Knowledge Article's Id
   */
  @AuraEnabled
  public static Boolean manageArticleView(Id recordId) {
    Boolean result = true;

    try {
      Id userId = UserInfo.getUserId();
      String uniqueId = recordId + '_' + userId;
      List<Article_View_Statistic__c> avs = new List<Article_View_Statistic__c>(
        [
          SELECT Id, Account__c, User__c, uniqueId__c, Viewed__c, View__c
          FROM Article_View_Statistic__c
          WHERE uniqueId__c = :uniqueId
          LIMIT 1
        ]
      );
      if (avs.isEmpty()) {
        result = createNewAvs(recordId, userId, uniqueId);
      } else {
        avs[0].View__c += 1;
        if (!Schema.sObjectType.Article_View_Statistic__c.isUpdateable()) {
          throw new DmlException(
            'SObject Article View Statistic not updatable'
          );
        }
        update avs;
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getStackTraceString());
    }

    return result;
  }

  private static Boolean createNewAvs(Id recordId, Id userId, String uniqueId) {
    Boolean result = true;
    try {
      Article_View_Statistic__c newAvs = new Article_View_Statistic__c(
        Account__c = recordId,
        User__c = userId,
        uniqueId__c = uniqueId,
        Viewed__c = System.now(),
        View__c = 1
      );

      if (!Schema.sObjectType.Article_View_Statistic__c.isCreateable()) {
        throw new DmlException('SObject Article View Statistic not updatable');
      }
      insert newAvs;
    } catch (Exception e) {
      throw new DmlException(e.getMessage());
    }

    return result;
  }
}