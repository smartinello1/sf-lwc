@isTest
private without sharing class sftomcAuthCallbackCtrlTest {
	@isTest
	static void testConstructor() {
		sftomcAuthCallbackCtrl c = new sftomcAuthCallbackCtrl();
		String str = c.code;
		str = c.CALLBACK_URL;
		c.handleClick();
	}
}
