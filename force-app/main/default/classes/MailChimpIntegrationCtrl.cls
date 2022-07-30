public without sharing class MailChimpIntegrationCtrl {
  public static void getSegments() {
    HTTPRequest req = new HTTPRequest();
    req.setHeader(
      'Authorization',
      'Bearer 513dae9dbf3ca641d782831dff507c07-us14'
    );
    req.setEndpoint(
      'https://us14.api.mailchimp.com/3.0/lists/7f79705a51/segments'
    );
    req.setMethod('GET');

    HTTPResponse res = new Http().send(req);
    System.debug('@@@ res ' + res.getBody());
  }

  /*
   * @description: Method to sync in both ways Lead and Contact to MailChimp subscribers and MailChimp subscribers to Lead and Contact
   *
   *
   */
  @AuraEnabled
  public static MailChimpAudiencesWrapper syncLeadContactSubscribers() {
    try {
      HTTPRequest req = new HTTPRequest();
      req.setHeader(
        'Authorization',
        'Bearer 513dae9dbf3ca641d782831dff507c07-us14'
      );
      req.setEndpoint('https://us14.api.mailchimp.com/3.0/lists');
      req.setMethod('GET');

      HTTPResponse res = new Http().send(req);
      if (res.getStatusCode() != 200) {
        //TODO: Handle errors
        throw new CalloutException('');
      }
      System.debug('@@@ res ' + res.getBody());
      String body = stripKeywords(res.getBody());
      MailChimpAudiencesWrapper audiences = (MailChimpAudiencesWrapper) JSON.deserialize(
        body,
        MailChimpAudiencesWrapper.class
      );

      return audiences;
    } catch (CalloutException ce) {
      throw new AuraHandledException(ce.getStackTraceString());
    }
  }

  public static String stripKeywords(String bodyInput) {
    bodyInput = bodyInput.replaceAll('"_links"', '"mc_links"');
    bodyInput = bodyInput.replaceAll('"id"', '"mc_id"');
    return bodyInput;
  }
}