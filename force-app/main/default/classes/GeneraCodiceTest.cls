@isTest
public with sharing class GeneraCodiceTest {
	@TestSetup
	static void makeData() {
		Account acc = new Account(Name = 'generacodice');
		insert acc;
		Opportunity o = new Opportunity(
			Name = acc.Name,
			StageName = 'Closed/Won',
			AccountId = acc.Id
		);
		insert o;
	}

	@isTest
	static void generaCodiceTest() {
		Test.startTest();
		GeneraCodice.Codice('', 'ciao');
		String s;
		Test.stopTest();
	}
}
