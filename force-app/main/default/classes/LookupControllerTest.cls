@isTest
public class LookupControllerTest {
  @TestSetup
  static void makeData() {
    Account acc = new Account(Name = 'TestAccount');
    insert acc;

    Opportunity opp = new Opportunity(
      Name = 'TestOpportunity',
      StageName = 'Won',
      AccountId = acc.Id,
      CloseDate = System.Today()
    );
    insert opp;
  }

  @isTest
  public static void test_method1() {
    Test.startTest();
    LookupController constructor = new LookupController();
    //With results
    List<LookupController> results = LookupController.getSearchResult(
      'Test',
      'Opportunity',
      'standard:opportunity'
    );
    //With no results
    List<LookupController> noresults = LookupController.getSearchResult(
      '',
      'Opportunity',
      'standard:opportunity'
    );
    Test.stopTest();
  }
}