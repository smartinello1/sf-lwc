public class CalloutAPIProva {
  @AuraEnabled
  public static String getCall() {
    HttpRequest req = new HttpRequest();
    req.setEndpoint('https://api.chucknorris.io/jokes/random');
    req.setMethod('GET');

    Http h = new Http();
    HttpResponse res = h.send(req);
    Map<String, Object> root = (Map<String, Object>) JSON.deserializeUntyped(
      res.getBody()
    );
    System.debug('RESPONSE: '+ res.getBody());
    String value = (String) root.get('value');

    return value;
  }
}