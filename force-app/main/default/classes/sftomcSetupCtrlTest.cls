@isTest
private without sharing class sftomcSetupCtrlTest {
	@TestSetup
	static void makeData() {
		MailChimp_Secrets__c ms = new MailChimp_Secrets__c(
			NamedCredential_Name__c = 'a'
		);
		insert ms;
	}

	@isTest
	static void sftomcSetupTest() {
		sftomcSetupCtrl.isSetupCompleted();
		sftomcSetupCtrl.getSettings();
		sftomcSetupCtrl.saveSettings('a', new MailChimp_Settings__c());
	}
}
