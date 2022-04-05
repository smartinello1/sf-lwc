({
  doInit: function (component, event, helper) {
    helper.initialize(component, event, helper);
  },

  changeFilter: function (component, event, helper) {
    console.log("@@@ source ", event.getSource().get("v.value"));
    component.set("v.selectedFilter", event.getSource().get("v.value"));
  },

  applyFilter: function (component, event, helper) {
    helper.applyFilter(component, event, helper);
  },

  clearFilter: function (component, event, helper) {
    helper.clearFilter(component, event, helper);
  }
});