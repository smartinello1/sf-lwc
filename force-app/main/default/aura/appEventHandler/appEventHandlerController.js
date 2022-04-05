({
  doInit: function (component, event, helper) {
    console.log("@@@ prova");
  },

  handleEvent: function (component, event, helper) {
    var p = event.getParam("parametro");
    console.log("@@@ p ", p);
    component.set("v.message", p);
  }
});