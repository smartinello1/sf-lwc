public class SessionIdController {
  public static String getSessionId() {
    return (String) JSON.deserialize(
      Page.SessionIdPage.getContent().toString(),
      String.class
    );
  }
}