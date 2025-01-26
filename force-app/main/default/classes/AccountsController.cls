public class AccountsController {
  @AuraEnabled
  public static List<Account> getAccounts() {
    return [
      SELECT Id, name, industry, Type, NumberOfEmployees, TickerSymbol, Phone, CreatedDate
      FROM Account
      ORDER BY createdDate ASC
    ];
  }

  @AuraEnabled
  public static String delAccount(Account acc) {
    Account accDel = [SELECT Id, Name FROM Account WHERE Id = :acc.Id];
    delete accDel;
    return ('Account ' + accDel.Name + 'Eliminato');
  }
}