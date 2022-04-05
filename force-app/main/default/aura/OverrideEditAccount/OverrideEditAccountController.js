({
  doInit: function (component, event, helper) {
    console.log("record id ", component.get("v.recordId"));
    console.log("object ", component.get("v.objectName"));
  },

  saveRec: function (component, event, helper) {
    event.preventDefault(); // stop the form from submitting
    var fields = event.getParam("fields");
    component.find("myRecordForm").submit(fields);
  },

  onSucc: function (component, event, helper) {
    var resId = event.getParams().response.Id;
    console.log("@@@ response Id ", resId);

    var navigator = component.find("navLib");
    var pageRef = {
      type: "standard__recordPage",
      attributes: {
        recordId: resId,
        objectApiName: "Account",
        actionName: "view"
      }
    };

    navigator.navigate(pageRef);
  }
});