public class WrapperClassGeneratorController {
  /*@param jsonToParse, json used to create wrapper class
   * @param className, apex class's name
   * @param withSharing, choose to insert the keyword with sharing
   * @param apiSave, choose if you want to save throug api the apex class
   * @param objectSave, choose if you want to save throug CustomObject
   */
  public static String generateWrapperClass(
    String jsonToParse,
    String className,
    Boolean withSharing,
    Boolean apiSave,
    Boolean objectSave
  ) {
    String apexClassId = '';
    String response = 'Class generated with id ';
    String classBody = '';
    String[] innerClasses = new List<String>{};

    try {
      classBody +=
        'public ' +
        (withSharing == true ? 'with sharing ' : '') +
        'class ' +
        className +
        ' { \n';
      JSONParser parsed = JSON.createParser(jsonToParse);
      while (parsed.nextToken() != null) {
        if (parsed.hasCurrentToken()) {
          System.debug('@@@ currentName ' + parsed.getCurrentName());
          System.debug('@@@ currentToken ' + parsed.getCurrentToken());
          System.debug('@@@ hasCurrentToken ' + parsed.hasCurrentToken());

          if (parsed.getCurrentToken() == JSONToken.FIELD_NAME) {
            String tmpTokenName = parsed.getCurrentName();
            //Skip to value
            parsed.nextToken();

            JSONToken tmpNextTokenType = parsed.getCurrentToken();
            classBody +=
              '      public ' +
              getCurrentTokenType(tmpNextTokenType, tmpTokenName) +
              ' ' +
              tmpTokenName +
              '; \n';
          }
          if (
            isObject_Start(parsed.getCurrentToken()) &&
            parsed.getCurrentName() != null
          ) {
            System.debug('@@@ isObject');
            //innerClasses.add(createInnerClass(parsed));
            innerClasses = createInnerClass(parsed);
          }
        }
      }

      classBody += String.join(innerClasses, ' ');

      classBody += ' }';
      System.debug('@@@ classBody final ' + classBody);
      System.debug('@@@ innerClasses final ' + innerClasses);

      if (apiSave) {
        String wsResp = makeRequest(classBody, className);
        System.debug('@@@ wsResp ' + wsResp);
      }

      if (objectSave) {
        Apex_Class__c apxClass = new Apex_Class__c(
          Name = className,
          Body__c = classBody
        );
        insert apxClass;

        apexClassId = apxClass.Id;
      }

      //TODO IMPLEMENTA
      //if(wsResp.contains('DUPLICATE_VALUE'))
      //makeRequestDelete(idApexClassToDelete);

      response += apexClassId;
    } catch (exception e) {
      System.debug('@@@ ecc ' + e.getMessage() + ' -- ' + e.getLineNumber());
      response = e.getMessage() + ' -- ' + e.getLineNumber();
    }

    return response;
  }

  public static String getCurrentTokenType(JSONToken token, String tokenName) {
    switch on token {
      when VALUE_STRING {
        return 'String';
      }
      when VALUE_NUMBER_INT {
        return 'Integer';
      }
      when VALUE_NUMBER_FLOAT {
        return 'Decimal';
      }
      when VALUE_FALSE {
        return 'Boolean';
      }
      when VALUE_TRUE {
        return 'Boolean';
      }
      when START_OBJECT {
        return createInnerClassName(tokenName);
      }
      when else {
        return null;
      }
    }
  }

  public static String[] createInnerClass(JSONParser json) {
    String[] innerClasses = new List<String>{};

    String innerClass =
      '   public class ' +
      json.getCurrentName() +
      'WrapperClass { \n';

    while (json.nextToken() != JSONToken.END_OBJECT) {
      if (json.getCurrentToken() == JSONToken.FIELD_NAME) {
        String tmpTokenName = json.getCurrentName();
        //Skip to value
        json.nextToken();

        JSONToken tmpNextTokenType = json.getCurrentToken();
        innerClass +=
          '     public ' +
          getCurrentTokenType(tmpNextTokenType, tmpTokenName) +
          ' ' +
          tmpTokenName +
          '; \n';
      }
      if (
        isObject_Start(json.getCurrentToken()) && json.getCurrentName() != null
      ) {
        System.debug('@@@ isObject');
        innerClasses = createInnerClass(json);
      }
    }

    innerClass += '   } \n';
    innerClasses.add(innerClass);
    return innerClasses;
  }

  public static String createInnerClassName(String tokenName) {
    return tokenName + 'WrapperClass';
  }

  public static String makeRequest(String classBody, String className) {
    HttpRequest req = new HttpRequest();
    req.setMethod('POST');
    //req.setEndpoint(Url.getOrgDomainUrl().toExternalForm() + '/services/data/v48.0/ApexClass');
    req.setEndpoint(
      'callout:SFAPI_CREDENTIAL/services/data/v48.0/tooling/sobjects/ApexClass'
    );
    req.setHeader('Content-Type', 'application/json; charset=UTF-8');
    req.setHeader('Accept', 'application/json');

    String body =
      '{ "Body" : "' +
      classBody +
      '", "Name" : "' +
      className +
      '", "Status" : "Active", "ApiVersion" : 48 }';
    System.debug('@@@ body ' + body);
    req.setBody(body);

    Http http = new Http();
    HTTPResponse res = http.send(req);

    return res.getBody();
  }

  /* UTILITY METHOD - START */

  public static Boolean isObject_Start(JSONToken token) {
    return token == JSONToken.START_OBJECT;
  }

  public static Boolean isObject_End(JSONToken token) {
    return token == JSONToken.END_OBJECT;
  }

  public static Boolean isArray_Start(JSONToken token) {
    return token == JSONToken.START_ARRAY;
  }

  public static Boolean isArray_End(JSONToken token) {
    return token == JSONToken.END_ARRAY;
  }

  /* UTILITY METHOD - END */
}