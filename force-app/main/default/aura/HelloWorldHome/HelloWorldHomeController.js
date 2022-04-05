({
  doInit: function (component, event, helper) {
    helper.initialize(component, event, helper);
  },

  onClickBtn: function (component, event, helper) {
    var appEvent = $A.get("e.c:appEv");
    appEvent.setParams({
      parametro: component.get("v.testo")
    });
    appEvent.fire();
  }
});