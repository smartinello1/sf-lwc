@IsTest(SeeAllData=true)
public with sharing class LightningLoginFormControllerTest {
	@IsTest
	static void testLoginWithInvalidCredentials() {
		System.assertEquals(
			null,
			LightningLoginFormController.login('testUser', 'fakepwd', null)
		);
	}

	@IsTest
	static void LightningLoginFormControllerInstantiation() {
		LightningLoginFormController controller = new LightningLoginFormController();
		System.assertNotEquals(controller, null);
	}

	@IsTest
	static void testIsUsernamePasswordEnabled() {
		System.assertEquals(
			true,
			LightningLoginFormController.getIsUsernamePasswordEnabled()
		);
	}

	@IsTest
	static void testIsSelfRegistrationEnabled() {
		System.assertEquals(
			false,
			LightningLoginFormController.getIsSelfRegistrationEnabled()
		);
	}

	@IsTest
	static void testGetSelfRegistrationURL() {
		System.assertEquals(
			null,
			LightningLoginFormController.getSelfRegistrationUrl()
		);
	}

	@IsTest
	static void testAuthConfig() {
		Auth.AuthConfiguration authConfig = LightningLoginFormController.getAuthConfig();
		System.assertNotEquals(null, authConfig);
	}

	@IsTest
	static void testSetExperienceId() {
		LightningLoginFormController.setExperienceId('abc');
		LightningLoginFormController.setExperienceId(null);
	}

	@IsTest
	static void testForgotPasswordUrl() {
		LightningLoginFormController.getForgotPasswordUrl();
	}
}
