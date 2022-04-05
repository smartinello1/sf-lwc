({
  initialize: function (component, event, helper) {
    var action = component.get("c.getAccountInfo");
    action.setParams({
      contactId: component.get("v.recordId")
    });
    action.setCallback(this, function (response) {
      if (response.getState() == "SUCCESS") {
        var account = response.getReturnValue();
        console.log("@@@ account ", account);

        component.set("v.accountData", account);
        component.set("v.isLoaded", true);
      } else if (response.getState() == "ERROR") {
        alert("Error in calling server-side controller");
        component.set("v.isLoaded", true);
      }
    });
    $A.enqueueAction(action);
  }
});