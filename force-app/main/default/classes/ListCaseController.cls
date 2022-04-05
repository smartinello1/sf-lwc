public without sharing class ListCaseController {
  public ListCaseController(ApexPages.StandardSetController controller) {
  }

  @RemoteAction
  public static String init(List<String> cases) {
    if (cases.isEmpty()) {
      return 'nessun case selezionato';
    }

    return 'ok';
  }

  @RemoteAction
  public static Pagereference redirect() {
    return new Pagereference('/lightning/page/home');
  }
}