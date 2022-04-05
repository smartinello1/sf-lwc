({
  init: function (component, event, helper) {
    var utente = component.get("v.recordId");
    console.log("id utente : " + utente);
    component.set("v.usrId", utente);
  },

  doSomething: function (component, event, helper) {
    var action = component.get("c.getUserInfo");
    action.setParams({
      id: component.get("v.usrId"),
      firstname: component.get("v.FirstName"),
      lastname: component.get("v.LastName"),
      alias: component.get("v.Alias"),
      username: component.get("v.Username"),
      email: component.get("v.Email")
    });
    console.log("usrId : " + component.get("v.usrId"));
    action.setCallback(this, function (response) {
      if (response.getState() == "SUCCESS") {
        component.set("v.usr", response.getReturnValue());
        console.log("UserInfo : " + response.getReturnValue());
        var utentecreato = component.find("v.utentecreato");
        console.log("utentecreato : " + utentecreato);
      } else if (response.getState() == "ERROR") {
        alert("Is not possible to clone the user");
      }
    });
    $A.enqueueAction(action);
  }
});