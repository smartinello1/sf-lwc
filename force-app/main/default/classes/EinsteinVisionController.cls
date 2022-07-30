public with sharing class EinsteinVisionController {
  public static String getAccessToken() {
    // Ignore the File upload part and "jwt.pkcs" if you used a Salesforce certificate to sign up
    // for an Einstein Platform account
    String keyContents = 'MIIEowIBAAKCAQEAqy56ezx0yjITsPnI+esmCgf2SISWcSttdXUwtB+3AhBlYEPuIUtnM+PrQa1CPWvXezxv2jarFRnczWvbBd5KVwx0Mlmhhh7K/DJspy0YydBapBksVsidnwIEWuMiua1WHjucG7xlUjlJbBLsVhpJD4SSyZ+I98daV+WkvLzMzIs2kcyTfCiihWI8ZQ0zoCjeTfM5hqWgGhMt7CnfIYMVwRQKJZ25ua6FikmuEUupVdG9AaxFuVAlDO5ewXNjTGDJSBth1jItgVJxOGsQTGnw2hYrK5n1e+fLA7x1dUpqbDReiYDIJeGsdyAPJkbV/JQqUjsznw0J8NW9PKa/HG3wvQIDAQABAoIBAB2uvYZJAWdeL5PsfDD52Wq73rTMaNnO0fggDgXtyeoNtcZvgQc87/RLfSuyQ14rKP4xiKOp/xh1l5f3L89gsDtP6YYhjKSZClGY3MZQR5AXFOCHjOyvdMVxsBeicw8HQ3uSkossq9UKIfUfguObQzfxoRJdG377jmrXYy1m/4wn/qWnlY29lUMpCPDKbSDzNpSC4B+j2NmaEA34Gu0xvxMS21Gq+JRi6ZWANtseYTkFg7zCSKwpIjO82oVKNY5cM+e6cl9Pxc4iNXOR9Zje6X57dNuoPUIXBBlzLTzqtDn362aOyK0biRVFo3N9NQ3EFOVHRW9AWEy9RCn6ORM1EvECgYEA5ygmq/UPbnDipTQEuiiy10fn4YkVZR1Zsa7MBHnhBcUqIS3oOTwPc2/HU39DNYybrx5213OVOVQ2vsC831kHy5Pi/TEDfO5o+8bvmxRsB8+UnKAaoO4iDiIwfl/BMf3/6MPftz5JbJYPfuvwSMV2ep6BZDFXhX67bTSPkrUHEnsCgYEAvZQ4K1mc4BTlrpQq2lkWKXOVjoo5cb2sM7N+/n0tL1LTVC+GahFpaVHiwzPARGbuOF4pgQzUo4ZHByEiwzHA7QkM0rgOlfLguj8f4XdTuyTi+skyiWU3lh+l8jdUB8GkhmLpFJoBiakLrmOX3lYtk2CNJSfVmzgJiC/GXe6EYCcCgYAlLBzD7F216etYm7vi3+aanhKY/z10jDq/Sxe95IeeMO2sdkBw68qkSqZoM//v3ZOvnpuH3Ct0E6nWFRKKbDvHrhmDk902uvQhAQXJD4ir3OLOKST/GixZz3+y4t0jl/AOU2lng1m1X5BQXcq/ORnrcA/ot9KWQiIL1rb75aakfwKBgQCBPjYY36wCXFzFav/YAdoJAmKYXYWSFFP8n0dZqe8PDzFBeHDziNFLWub0WyiduWp4hUFYWG3y2Y08wAtZ9WZocr4KPi67bWxlrLlIVbiAokIX5OiOILIHp6XTfoLMEujeMTpjsCaSOevbxMv5aNkDW1R+WyzV+BsPfDqJOR2ICwKBgHbdpNAbrGRjxycWZ5ihwCZniK+Abpbbk+dMvW3LYt5940J98kMKpwF068L4NtKpH/uJJ9eS1jeHUjK3pA1f7UclR9nuiyzENGDtTPFnqX8cEKkAFszGfPCq/f9nrnlvrhNoNdIlDqLblbk0QImR6I3KJepFAOA8oXURH9PvoZdg';

    // Get a new token
    JWT jwt = new JWT('RS256');
    // jwt.cert = 'JWTCert'; // Uncomment this if you used a Salesforce certificate to sign up for an Einstein Platform account
    jwt.pkcs8 = keyContents; // Comment this if you are using jwt.cert
    jwt.iss = 'developer.force.com';
    jwt.sub = 'martinellosimone01@gmail.com';
    jwt.aud = 'https://api.einstein.ai/v2/oauth2/token';
    jwt.exp = '3600';
    String access_token = JWTBearerFlow.getAccessToken(
      'https://api.einstein.ai/v2/oauth2/token',
      jwt
    );

    System.debug(access_token);
    return access_token;
  }

  @AuraEnabled
  public static String createPublicLink(Id documentId, Id recordId) {
    String url;
    try {
      ContentVersion cv = [
        SELECT Id, ContentDocument.Title
        FROM ContentVersion
        WHERE ContentDocumentId = :documentId
        LIMIT 1
      ];

      List<ContentDistribution> existingCD = new List<ContentDistribution>(
        [
          SELECT Id, ContentDownloadUrl
          FROM ContentDistribution
          WHERE RelatedRecordId = :recordId
          ORDER BY CreatedDate DESC
          LIMIT 1
        ]
      );

      ContentDistribution cd;
      if (existingCD.isEmpty()) {
        cd = new ContentDistribution();
        cd.PreferencesAllowViewInBrowser = true;
        cd.PreferencesLinkLatestVersion = true;
        cd.RelatedRecordId = recordId;
        cd.Name = 'public ' + ContentDocument.Title;
        cd.ContentVersionId = cv.Id;
        insert cd;

        ContentDistribution cdCopy = [
          SELECT Id, ContentDownloadUrl
          FROM ContentDistribution
          WHERE Id = :cd.Id
          LIMIT 1
        ];

        url = cdCopy.ContentDownloadUrl;
      } else {
        cd = existingCD[0];
        url = cd.ContentDownloadUrl;
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getStackTraceString());
    }

    return url;
  }

  @AuraEnabled
  public static Object getDocInfo(String publicUrl) {
    Map<String, Object> returnVal = new Map<String, Object>();
    try {
      // returnVal.put('ContentDownloadUrl', cdCopy.ContentDownloadUrl);
      returnVal.put(
        'responseEinstein',
        EinsteinVisionController.testCallOCR(publicUrl)
      );
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }

    System.debug('@@@ returnVal ' + JSON.serialize(returnVal));
    return returnVal;
  }

  public static Object testCallOCR(String url) {
    HttpRequest request = new HttpRequest();
    request.setMethod('POST');
    request.setEndpoint('https://api.einstein.ai/v2/vision/ocr');
    request.setHeader(
      'Authorization',
      'Bearer ' + EinsteinVisionController.getAccessToken()
    );
    request.setHeader('Content-Type', 'application/json');

    Map<String, String> bodyMap = new Map<String, String>{
      'sampleLocation' => url,
      // 'modelId' => 'tabulatev2', // Meglio per immagini e pdf dove non c'è un contesto particolare, tipo carta d'identità
      // 'task' => 'text' // Usato con modelId = tabulatev2
      'modelId' => 'OCRModel', // Meglio per biglietti da visita e per schede rettangolari tipo carta di credito
      'task' => 'contact' // Usato con modelId = OCRModel
    };
    request.setBody(JSON.serialize(bodyMap));

    HttpResponse response = new Http().send(request);
    System.debug('@@@ response ' + response.getBody());

    return JSON.deserializeUntyped(response.getBody());
  }

  // IS NOT WORKING, AUTH.JWT CLASS IS NOT CORRECT
  @AuraEnabled
  public static Object getAccessToken(String assert) {
    StaticResource static_resource = [
      SELECT Id, Body
      FROM StaticResource
      WHERE Name = 'einstein_cert'
      LIMIT 1
    ];

    String res_json_body = static_resource.Body.toString();
    res_json_body = res_json_body.replace(
      '-----BEGIN RSA PRIVATE KEY-----',
      ''
    );
    res_json_body = res_json_body.replace('-----END RSA PRIVATE KEY-----', '');
    res_json_body = res_json_body.replace('\n', '');
    System.debug('@@@ ' + res_json_body);

    HttpRequest request = new HttpRequest();
    request.setMethod('POST');
    request.setEndpoint('https://api.einstein.ai/v2/oauth2/token');
    request.setHeader('Content-Type', 'application/x-www-form-urlencoded');

    String grant_type = 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=';
    String assertionString = 'MIIEowIBAAKCAQEAqy56ezx0yjITsPnI+esmCgf2SISWcSttdXUwtB+3AhBlYEPuIUtnM+PrQa1CPWvXezxv2jarFRnczWvbBd5KVwx0Mlmhhh7K/DJspy0YydBapBksVsidnwIEWuMiua1WHjucG7xlUjlJbBLsVhpJD4SSyZ+I98daV+WkvLzMzIs2kcyTfCiihWI8ZQ0zoCjeTfM5hqWgGhMt7CnfIYMVwRQKJZ25ua6FikmuEUupVdG9AaxFuVAlDO5ewXNjTGDJSBth1jItgVJxOGsQTGnw2hYrK5n1e+fLA7x1dUpqbDReiYDIJeGsdyAPJkbV/JQqUjsznw0J8NW9PKa/HG3wvQIDAQABAoIBAB2uvYZJAWdeL5PsfDD52Wq73rTMaNnO0fggDgXtyeoNtcZvgQc87/RLfSuyQ14rKP4xiKOp/xh1l5f3L89gsDtP6YYhjKSZClGY3MZQR5AXFOCHjOyvdMVxsBeicw8HQ3uSkossq9UKIfUfguObQzfxoRJdG377jmrXYy1m/4wn/qWnlY29lUMpCPDKbSDzNpSC4B+j2NmaEA34Gu0xvxMS21Gq+JRi6ZWANtseYTkFg7zCSKwpIjO82oVKNY5cM+e6cl9Pxc4iNXOR9Zje6X57dNuoPUIXBBlzLTzqtDn362aOyK0biRVFo3N9NQ3EFOVHRW9AWEy9RCn6ORM1EvECgYEA5ygmq/UPbnDipTQEuiiy10fn4YkVZR1Zsa7MBHnhBcUqIS3oOTwPc2/HU39DNYybrx5213OVOVQ2vsC831kHy5Pi/TEDfO5o+8bvmxRsB8+UnKAaoO4iDiIwfl/BMf3/6MPftz5JbJYPfuvwSMV2ep6BZDFXhX67bTSPkrUHEnsCgYEAvZQ4K1mc4BTlrpQq2lkWKXOVjoo5cb2sM7N+/n0tL1LTVC+GahFpaVHiwzPARGbuOF4pgQzUo4ZHByEiwzHA7QkM0rgOlfLguj8f4XdTuyTi+skyiWU3lh+l8jdUB8GkhmLpFJoBiakLrmOX3lYtk2CNJSfVmzgJiC/GXe6EYCcCgYAlLBzD7F216etYm7vi3+aanhKY/z10jDq/Sxe95IeeMO2sdkBw68qkSqZoM//v3ZOvnpuH3Ct0E6nWFRKKbDvHrhmDk902uvQhAQXJD4ir3OLOKST/GixZz3+y4t0jl/AOU2lng1m1X5BQXcq/ORnrcA/ot9KWQiIL1rb75aakfwKBgQCBPjYY36wCXFzFav/YAdoJAmKYXYWSFFP8n0dZqe8PDzFBeHDziNFLWub0WyiduWp4hUFYWG3y2Y08wAtZ9WZocr4KPi67bWxlrLlIVbiAokIX5OiOILIHp6XTfoLMEujeMTpjsCaSOevbxMv5aNkDW1R+WyzV+BsPfDqJOR2ICwKBgHbdpNAbrGRjxycWZ5ihwCZniK+Abpbbk+dMvW3LYt5940J98kMKpwF068L4NtKpH/uJJ9eS1jeHUjK3pA1f7UclR9nuiyzENGDtTPFnqX8cEKkAFszGfPCq/f9nrnlvrhNoNdIlDqLblbk0QImR6I3KJepFAOA8oXURH9PvoZdg';
    Auth.JWT assertion = new Auth.JWT();
    assertion.setAdditionalClaims(
      new Map<String, String>{
        'pkcs8' => 'MIIEowIBAAKCAQEAqy56ezx0yjITsPnI+esmCgf2SISWcSttdXUwtB+3AhBlYEPuIUtnM+PrQa1CPWvXezxv2jarFRnczWvbBd5KVwx0Mlmhhh7K/DJspy0YydBapBksVsidnwIEWuMiua1WHjucG7xlUjlJbBLsVhpJD4SSyZ+I98daV+WkvLzMzIs2kcyTfCiihWI8ZQ0zoCjeTfM5hqWgGhMt7CnfIYMVwRQKJZ25ua6FikmuEUupVdG9AaxFuVAlDO5ewXNjTGDJSBth1jItgVJxOGsQTGnw2hYrK5n1e+fLA7x1dUpqbDReiYDIJeGsdyAPJkbV/JQqUjsznw0J8NW9PKa/HG3wvQIDAQABAoIBAB2uvYZJAWdeL5PsfDD52Wq73rTMaNnO0fggDgXtyeoNtcZvgQc87/RLfSuyQ14rKP4xiKOp/xh1l5f3L89gsDtP6YYhjKSZClGY3MZQR5AXFOCHjOyvdMVxsBeicw8HQ3uSkossq9UKIfUfguObQzfxoRJdG377jmrXYy1m/4wn/qWnlY29lUMpCPDKbSDzNpSC4B+j2NmaEA34Gu0xvxMS21Gq+JRi6ZWANtseYTkFg7zCSKwpIjO82oVKNY5cM+e6cl9Pxc4iNXOR9Zje6X57dNuoPUIXBBlzLTzqtDn362aOyK0biRVFo3N9NQ3EFOVHRW9AWEy9RCn6ORM1EvECgYEA5ygmq/UPbnDipTQEuiiy10fn4YkVZR1Zsa7MBHnhBcUqIS3oOTwPc2/HU39DNYybrx5213OVOVQ2vsC831kHy5Pi/TEDfO5o+8bvmxRsB8+UnKAaoO4iDiIwfl/BMf3/6MPftz5JbJYPfuvwSMV2ep6BZDFXhX67bTSPkrUHEnsCgYEAvZQ4K1mc4BTlrpQq2lkWKXOVjoo5cb2sM7N+/n0tL1LTVC+GahFpaVHiwzPARGbuOF4pgQzUo4ZHByEiwzHA7QkM0rgOlfLguj8f4XdTuyTi+skyiWU3lh+l8jdUB8GkhmLpFJoBiakLrmOX3lYtk2CNJSfVmzgJiC/GXe6EYCcCgYAlLBzD7F216etYm7vi3+aanhKY/z10jDq/Sxe95IeeMO2sdkBw68qkSqZoM//v3ZOvnpuH3Ct0E6nWFRKKbDvHrhmDk902uvQhAQXJD4ir3OLOKST/GixZz3+y4t0jl/AOU2lng1m1X5BQXcq/ORnrcA/ot9KWQiIL1rb75aakfwKBgQCBPjYY36wCXFzFav/YAdoJAmKYXYWSFFP8n0dZqe8PDzFBeHDziNFLWub0WyiduWp4hUFYWG3y2Y08wAtZ9WZocr4KPi67bWxlrLlIVbiAokIX5OiOILIHp6XTfoLMEujeMTpjsCaSOevbxMv5aNkDW1R+WyzV+BsPfDqJOR2ICwKBgHbdpNAbrGRjxycWZ5ihwCZniK+Abpbbk+dMvW3LYt5940J98kMKpwF068L4NtKpH/uJJ9eS1jeHUjK3pA1f7UclR9nuiyzENGDtTPFnqX8cEKkAFszGfPCq/f9nrnlvrhNoNdIlDqLblbk0QImR6I3KJepFAOA8oXURH9PvoZdg'
      }
    );
    assertion.setSub('martinellosimone01@gmail.com');
    assertion.setAud('https://api.einstein.ai/v2/oauth2/token');
    assertion.setValidityLength(3600);

    Blob signedJWT = Crypto.sign(
      'RSA',
      Blob.valueOf(assertion.toJSONString()),
      EncodingUtil.base64Decode(assertionString) // assertion string
    );

    System.debug('@@@ signedJWT ' + EncodingUtil.base64Encode(signedJWT));
    request.setBody(grant_type + EncodingUtil.base64Encode(signedJWT));

    HttpResponse response = new Http().send(request);

    System.debug('@@@ ' + response.getBody());
    System.debug('@@@ ' + response.getStatusCode());

    return response;
  }
}