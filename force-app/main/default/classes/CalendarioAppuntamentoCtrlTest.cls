@isTest
private without sharing class CalendarioAppuntamentoCtrlTest {
	@TestSetup
	static void makeData() {
	}

	@isTest
	static void tests() {
		CalendarioAppuntamentiCtrl.getBH();
		CalendarioAppuntamentiCtrl.getHolidays();
		CalendarioAppuntamentiCtrl.getScheduledAppointments(
			System.Today(),
			System.today().addDays(1)
		);
		CalendarioAppuntamentiCtrl.createAppointments(new Appuntamento__c());
	}
}
