({
  doInit: function (component, event, helper) {
    helper.initialize(component, event, helper);
  },

  fireComponentEvent: function (component, event, helper) {
    // Get the component event by using the
    // name value from aura:registerEvent
    var cmpEvent = component.getEvent("CmpEvent");
    cmpEvent.setParams({
      message: "A component event fired me. "
    });
    cmpEvent.fire();
    console.log("@@@ fired ");
  }
});