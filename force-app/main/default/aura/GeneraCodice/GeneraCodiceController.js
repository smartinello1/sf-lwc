({
  init: function (component, event, helper) {
    var record = component.get("v.recordId");
    console.log("@@@ record " + record);
    component.set("v.recordId", record);
  },

  GeneraCodice: function (component, event, helper) {
    var action = component.get("c.getGeneraCodice");
    action.setParams({ record: component.get("v.recordId") });
    action.setCallback(this, function (response) {
      var state = response.getState();
      //console.log("state " + state);
      if (state == "SUCCESS") {
        //console.log("state " + state);
        console.log("response : " + response.getReturnValue());
        component.set("v.res", response.getReturnValue());
      }
      if (state == "ERROR") {
        alert("ERRORE");
        //console.log("state " + state);
      }
      if (state == "INCOMPLETE") {
        alert(state);
        //console.log("state " + state);
      }
    });

    $A.enqueueAction(action);
  }
});