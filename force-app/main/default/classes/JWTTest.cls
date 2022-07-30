@isTest
private without sharing class JWTTest {
	@isTest
	static void jwt() {
		JWT j = new JWT('RS256');
		j.iss = 'a';
		j.sub = 'a';
		j.aud = 'a';
		j.exp = 'a';
		j.iat = 'a';
		j.pkcs8 = 'a';
		j.privateKey = 'a';
		j.issue();
		j.alg = 'HS256';
		j.issue();
	}
}
