({
  myAction: function (component, event, helper) {
    component.find("accountRecord").saveRecord(
      $A.getCallback(function (saveResult) {
        if (saveResult.state === "SUCCESS") {
          console.log("saved successfully");
        } else if (saveResult.state === "ERROR") {
          var errMsg = saveResult.error.message;
          component.set("v.recordSaveError", errMsg);
        } else {
          component.set("v.recordSaveError", "");
        }
      })
    );
  },

  recordUpdated: function (component, event, helper) {
    var eventParams = event.getParams();
    if (eventParams.changeType == "CHANGED") {
      var changedFields = eventParams.changedFields;
      console.log("These fields are changed: " + JSON.stringify(changedFields));
      var resultToast = $A.get("e.force:showToast");
      resultToast.setParams({
        title: "Saved",
        message: "The record was updated",
        severity: "SUCCESS"
      });
      resultToast.fire();
    }
  }
});