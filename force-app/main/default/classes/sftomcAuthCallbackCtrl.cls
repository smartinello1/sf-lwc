public with sharing class sftomcAuthCallbackCtrl {
  public String code { get; set; }

  public final String CALLBACK_URL =
    URL.getSalesforceBaseUrl().toExternalForm() + 'apex/sftomcAuthCallback';

  public sftomcAuthCallbackCtrl() {
    String authcode = Apexpages.currentPage().getParameters().get('code');
    this.code = authcode;
    System.debug('@@@ authcode ' + authcode);

    // if (authcode != null) {
    //   sftomcAuthCallbackCtrl.updateToken(authcode);
    // }
  }

  public Pagereference handleClick() {
    return new Pagereference(
      'https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id=529435754121&redirect_uri=' +
      URL.getSalesforceBaseUrl().toExternalForm() +
      'apex/sftomcAuthCallback'
      //https://martinellosimone-dev-ed--c.eu18.visual.force.com/apex/sftomcAuthCallback
    );
  }

  public void updateToken() {
    MailChimp_Secrets__c existingSecrets = MailChimp_Secrets__c.getOrgDefaults();
    System.debug('@@@ existing ' + existingSecrets);
    if (
      (existingSecrets == null || existingSecrets.OAuth_Token__c == null) &&
      this.code != null
    ) {
      HttpRequest req = new HttpRequest();
      req.setMethod('POST');
      req.setEndpoint('https://login.mailchimp.com/oauth2/token');
      req.setHeader('Content-type', 'application/x-www-form-urlencoded');
      String body =
        'grant_type=authorization_code&client_id=529435754121&client_secret=13bc00253bf9f831a3c1368e1a49e2334be749ca850704732d&redirect_uri=' +
        CALLBACK_URL +
        this.code;
      req.setBody(body);

      HttpResponse res = new Http().send(req);
      System.debug('@@@ res ' + res.getBody());
      System.debug('@@@ res ' + res.getStatusCode());

      Map<String, Object> resp = (Map<String, Object>) JSON.deserializeUntyped(
        res.getBody()
      );

      if (res.getStatusCode() == 200) {
        MailChimp_Secrets__c secrets = new MailChimp_Secrets__c();
        secrets.OAuth_Token__c = (String) resp.get('access_token');
        insert secrets;
      }
    }

    // return 'ok';
  }
}