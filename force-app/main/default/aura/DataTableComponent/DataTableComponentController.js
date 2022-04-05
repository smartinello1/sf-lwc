({
  doInit: function (component, event, helper) {
    var action = component.get("c.getRelatedContacts");
    action.setParams({
      id: component.get("v.recordId")
    });
    action.setCallback(this, function (response) {
      if (response.getState() == "SUCCESS") {
        var ret = response.getReturnValue();
        console.log("@@@ ret " + JSON.stringify(ret));
        component.set(" v.RelatedContacts ", ret);
      } else {
        alert(response.getState());
      }
    });
    $A.enqueueAction(action);
  }
});