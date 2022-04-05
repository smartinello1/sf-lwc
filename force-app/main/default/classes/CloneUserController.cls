public class CloneUserController {
  public CloneUserController() {
  }

  @AuraEnabled
  public static User getUserInfo(
    String id,
    String firstname,
    String lastname,
    String alias,
    String username,
    String email
  ) {
    User uToCopy = [
      SELECT
        Id,
        FirstName,
        LastName,
        Email,
        Username,
        Alias,
        TimeZoneSidKey,
        LocaleSidKey,
        EmailEncodingKey,
        LanguageLocaleKey,
        ProfileId,
        UserRoleId
      FROM User
      WHERE Id = :id
    ];
    System.debug('@@@ user to copy : ' + uToCopy);
    User u = new User();
    u.FirstName = firstname;
    u.LastName = lastname;
    System.debug('@@@ email ' + email);
    u.Email = email;
    u.Username = username;
    u.Alias = alias;
    u.ProfileId = uToCopy.ProfileId;
    u.UserRoleId = uToCopy.UserRoleId;
    u.TimeZoneSidKey = uToCopy.TimeZoneSidKey;
    u.LocaleSidKey = uToCopy.LocaleSidKey;
    u.LanguageLocaleKey = uToCopy.LanguageLocaleKey;
    u.EmailEncodingKey = uToCopy.EmailEncodingKey;
    u.isActive = false;
    insert u;
    System.debug('@@@ user created ' + u);
    return u;
  }
}