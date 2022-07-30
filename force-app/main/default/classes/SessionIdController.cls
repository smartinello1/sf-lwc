public class SessionIdController {
	public static String getSessionId() {
		if (!Test.isRunningTest()) {
			return (String) JSON.deserialize(
				Page.SessionIdPage.getContent().toString(),
				String.class
			);
		}

		return 'NOT AVAILABLE';
	}
}
