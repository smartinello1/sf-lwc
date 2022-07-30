public with sharing class sftomcAudiencesCtrl {
  /*
   * @description: Method to sync in both ways Lead and Contact to MailChimp subscribers and MailChimp subscribers to Lead and Contact
   *
   *
   */
  @AuraEnabled
  public static MailChimpAudiencesWrapper syncLeadContactSubscribers() {
    try {
      HTTPRequest req = new HTTPRequest();
      // req.setHeader(
      //   'Authorization',
      //   'Bearer 513dae9dbf3ca641d782831dff507c07-us14'
      // );
      // String namedCredential = 'MailChimp';
      req.setEndpoint(
        'callout:' +
        sftomcConstants.DEVNAME_NAMEDCREDENTIAL +
        '/3.0/lists'
      );
      // req.setEndpoint('https://us14.api.mailchimp.com/3.0/lists');
      // req.setHeader(
      //   'Authorization',
      //   'Bearer ' + MailChimp_Secrets__c.getOrgDefaults().OAuth_Token__c
      // );
      req.setMethod('GET');

      HTTPResponse res = new Http().send(req);
      if (res.getStatusCode() != 200) {
        //TODO: Handle errors
        throw new CalloutException('');
      }
      System.debug('@@@ res ' + res.getBody());
      String body = sftomcUtils.stripKeywords(res.getBody());
      MailChimpAudiencesWrapper audiences = (MailChimpAudiencesWrapper) JSON.deserialize(
        body,
        MailChimpAudiencesWrapper.class
      );

      return audiences;
    } catch (CalloutException ce) {
      throw new AuraHandledException(ce.getStackTraceString());
    }
  }
}