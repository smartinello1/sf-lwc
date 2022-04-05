({
  doInit: function (component, event, helper) {
    helper.initialize(component, event, helper);
    console.log("@@@ initialize");
  },

  handleComponentEvent: function (cmp, event) {
    console.log("@@@ prova");

    var message = event.getParam("message");

    // set the handler attributes based on event data
    cmp.set("v.messageFromEvent", message);
    var numEventsHandled = parseInt(cmp.get("v.numEvents")) + 1;
    cmp.set("v.numEvents", numEventsHandled);
  }
});