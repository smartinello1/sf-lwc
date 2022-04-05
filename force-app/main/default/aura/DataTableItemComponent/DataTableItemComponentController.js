({
  init: function (component, event, helper) {
    var recordId = component.get("v.recordId");
    console.log("@@@ recordId" + recordId);
    var contact = component.get("v.contact.FirstName");
    console.log("@@@ contact " + JSON.stringify(contact));
  }
});