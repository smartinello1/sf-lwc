public class MassDeleteFlowVersionController {
  @AuraEnabled
  public static String getFlowsDefinition() {
    HttpRequest req = new HttpRequest();
    //PUT FLOW ID
    req.setEndpoint(
      'callout:SFAPI_CREDENTIAL/services/data/v48.0/tooling/query/?q=SELECT+Id,+DeveloperName+FROM+FlowDefinition'
    );
    req.setMethod('GET');
    Http http = new Http();
    HttpResponse WSResponse = http.send(req);

    System.debug('@@@ wsresp ' + WSResponse.getBody());

    WsResponseClass WSResponseObj = (WSResponseClass) JSON.deserialize(
      WSResponse.getBody(),
      WSResponseClass.class
    );
    System.debug('@@@ WsResponseObj ' + JSON.serialize(WSResponseObj));

    return JSON.serialize(WSResponseObj);
  }

  @AuraEnabled
  public static String MassDelete(List<String> flowIds) {
    String resp = '';
    String joinFlowIds = '';
    String joinFlowVersionIds = '';
    List<String> flowVersionids = new List<String>();
    try {
      joinFlowIds = String.join(flowIds, ',');
      joinFlowIds = '\'' + joinFlowIds.replace(',', '\',\'') + '\'';
      System.debug('@@@ join ' + joinFlowIds);

      Http http = new Http();
      HttpRequest reqFlowVersion = new HttpRequest();
      ///services/data/v48.0/tooling/query/?q=SELECT+Id,+Status+FROM+Flow+WHERE+DefinitionId+IN('3001n000000HRVoAAO','3001n000000kacQAAQ')+AND+Status!='Active'
      reqFlowVersion.setEndpoint(
        'callout:SFAPI_CREDENTIAL/services/data/v48.0/tooling/query/?q=SELECT+Id,+Status+FROM+Flow+WHERE+DefinitionId+IN(' +
        joinFlowIds +
        ')+AND+Status!=\'Active\''
      );
      reqFlowVersion.setMethod('GET');
      HttpResponse WSResponse = http.send(reqFlowVersion);
      WsResponseClass WSResponseObj = (WSResponseClass) JSON.deserialize(
        WSResponse.getBody(),
        WSResponseClass.class
      );
      System.debug('@@@ WsResponseObj ' + JSON.serialize(WSResponseObj));

      for (WsResponseRecordClass record : WSResponseObj.records) {
        flowVersionids.add(record.Id);
      }
      joinFlowVersionIds = String.join(flowVersionids, ',');

      HttpRequest req = new HttpRequest();
      //PUT FLOW ID
      // req.setEndpoint('callout:SFAPI_CREDENTIAL/services/data/v48.0/tooling/query/?q=SELECT+Id,+Status+FROM+Flow+WHERE+DefinitionId=\'3001n000000kacQAAQ\'+Status!=\'Active\'');
      req.setEndpoint(
        'callout:SFAPI_CREDENTIAL/services/data/v48.0/composite/sobjects?ids=' +
        joinFlowVersionIds +
        '&allOrNone=false'
      );
      req.setMethod('DELETE');
      //Use token in custom settings
      //req.setHeader('Authorization', 'Bearer '+'RZ7M9bdCD21et1j9RPZoYGXc');

      //Flow Version /services/data/v48.0/tooling/sobjects/Flow/3011n000000mM5VAAU
      //Flow Definition /services/data/v48.0/tooling/sobjects/FlowDefinition/3001n000000kacQAAQ

      //Good query /services/data/v48.0/tooling/query/?q=SELECT+Id,+Status+FROM+Flow+WHERE+DefinitionId='3001n000000kacQAAQ'

      WSResponse = http.send(req);

      System.debug('@@@ wsresp ' + WSResponse.getBody());

      WSResponseObj = (WSResponseClass) JSON.deserialize(
        WSResponse.getBody(),
        WSResponseClass.class
      );
      System.debug('@@@ WsResponseObj ' + JSON.serialize(WSResponseObj));

      resp = JSON.serialize(WSResponseObj);
    } catch (Exception e) {
      return e.getStackTraceString();
    }

    return resp;
  }

  public class WsResponseClass {
    @AuraEnabled
    public Integer size;
    @AuraEnabled
    public Integer totalSize;
    @AuraEnabled
    public Boolean done;
    @AuraEnabled
    public String queryLocator;
    @AuraEnabled
    public String entityTypeName;
    @AuraEnabled
    public List<WsResponseRecordClass> records;
  }

  public class WsResponseRecordClass {
    @AuraEnabled
    public WsResponseRecordAttributes attributes;
    @AuraEnabled
    public String Id;
    @AuraEnabled
    public String Status;
    @AuraEnabled
    public String DeveloperName;
  }

  public class WsResponseRecordAttributes {
    @AuraEnabled
    public String type;
    @AuraEnabled
    public String url;
  }
}