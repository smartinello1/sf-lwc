@isTest
private without sharing class JWTTest {
	@isTest
	static void jwt() {
		JWT j = new JWT('RS256');
		j.issue();
		j.alg = 'HS256';
		j.issue();
	}
}
