public without sharing class sftomcSetupCtrl {
  // Metodo per verificare la presenza dell'auth provider e della connected app per poter utilizzare le funzionalità del connettore
  @AuraEnabled(cacheable=true)
  public static Boolean isSetupCompleted() {
    List<NamedCredential> nds = [
      SELECT Id
      FROM NamedCredential
      WHERE DeveloperName = 'sftomcConnector'
    ];

    String namedCredentialName = MailChimp_Secrets__c.getOrgDefaults()
      .NamedCredential_Name__c;

    return !nds.isEmpty() && namedCredentialName != null;
  }

  @AuraEnabled
  public static MailChimp_Settings__c getSettings() {
    List<MailChimp_Settings__c> settings = new List<MailChimp_Settings__c>(
      [
        SELECT Id, Scheduled_DataSync_SF_to_MC__c, Allow_MC_to_SF_Sync__c
        FROM MailChimp_Settings__c
        WHERE SetupOwnerId = :UserInfo.getOrganizationId()
      ]
    );

    return !settings.isEmpty() ? settings[0] : new MailChimp_Settings__c();
  }

  @AuraEnabled
  public static Boolean saveSettings(
    String namedCredentialName,
    MailChimp_Settings__c settings
  ) {
    Boolean result = true;

    MailChimp_Secrets__c secrets = [
      SELECT Id, NamedCredential_Name__c
      FROM MailChimp_Secrets__c
      WHERE SetupOwnerId = :UserInfo.getOrganizationId()
      LIMIT 1
    ];

    if (String.isNotBlank(namedCredentialName)) {
      secrets.NamedCredential_Name__c = namedCredentialName;
      update secrets;
    }

    List<MailChimp_Settings__c> mc_settings = new List<MailChimp_Settings__c>(
      [
        SELECT Id
        FROM MailChimp_Settings__c
        WHERE SetupOwnerId = :UserInfo.getOrganizationId()
        LIMIT 1
      ]
    );

    MailChimp_Settings__c mc_setting = new MailChimp_Settings__c();
    if (!mc_settings.isEmpty()) {
      mc_setting = mc_settings[0];
    }

    mc_setting.Scheduled_DataSync_SF_to_MC__c = settings.Scheduled_DataSync_SF_to_MC__c;
    mc_setting.Allow_MC_to_SF_Sync__c = settings.Allow_MC_to_SF_Sync__c;
    upsert mc_setting;

    return result;
  }
}