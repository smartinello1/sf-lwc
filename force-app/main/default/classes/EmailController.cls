public with sharing class EmailController {
  @AuraEnabled
  public static String Send(
    String toAddress,
    String fromAddress,
    String subject,
    String body
  ) {
    EmailMessage em = new EmailMessage(
      ToAddress = toAddress,
      FromAddress = fromAddress,
      Subject = subject,
      TextBody = body
    );
    insert em;
    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    String[] toAddresses = new List<String>{ toAddress };
    mail.setToAddresses(toAddresses);
    mail.setSenderDisplayName(fromAddress);
    mail.setSubject(subject);
    mail.setPlainTextBody(body);
    Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ mail });

    return mail.PlainTextBody;
  }

  @AuraEnabled
  public static String getPicklist() {
    String lista = [SELECT Id, DisplayName FROM OrgWideEmailAddress]
    .DisplayName;
    System.debug('@@@ org email address: ' + lista);

    return lista;
  }

  @AuraEnabled(cacheable=true)
  public static Map<String, Object> getEmailTemplate() {
    Map<String, Object> response = new Map<String, Object>();
    try {
      Map<Id, EmailTemplate> templates = new Map<Id, EmailTemplate>(
        [SELECT Id, Name, Folder.Name FROM EmailTemplate]
      );
      for (EmailTemplate t : templates.values()) {
        response.put(t.Id, t.Name);
      }
    } catch (Exception e) {
      // throw new AuraHandledException(e.getMessage());
      return new Map<String, Object>{ 'error' => e.getMessage() };
    }

    return response;
  }
}