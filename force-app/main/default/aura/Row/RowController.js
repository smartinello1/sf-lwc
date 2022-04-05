({
  doInit: function (component, event, helper) {
    component.set("v.columns", [
      { label: "Opportunity name", fieldName: "opportunityName", type: "text" },
      { label: "Ciao", fieldName: "Ciao", type: "text" }
    ]);

    component.set("v.data", [
      {
        opportunityName: "Cloudhub",
        Ciao: "Ciao"
      }
    ]);
  }
});