public with sharing class GeneraCodice {
  @AuraEnabled
  public static String Codice(Id record, String ownername) {
    //Integer oggi = 1;
    Opportunity opty = [SELECT Id, Owner.Name, Name FROM Opportunity];
    Integer anno = System.TODAY().YEAR();
    System.debug('@@@ anno : ' + anno);
    String result = 'Cod';
    Double rand = Math.Random();
    System.debug('@@@ rand ' + rand);
    System.debug('@@@ ownername before substring : ' + ownername);
    ownername = ownername.substring(0, 2);
    System.debug('@@@ ownername : ' + ownername);
    String owner = opty.Owner.Name;
    owner = owner.substring(0, 3);
    result = result + '.' + owner + '.' + anno;
    return result;
  }

  public String prova() {
    String str = 'aaa';
    return str;
  }
}