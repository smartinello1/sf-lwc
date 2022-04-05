({
  handleProva: function (component, event, helper) {
    console.log("### prova evento ", event.getParams().oldValue);
  },

  cambia: function (component, event, helper) {
    $A.createComponent(
      "lightning:card",
      { title: "Prova Card" },
      function (cmp, status, error) {
        console.log("### body ", cmp);
        console.log("### status ", status);
        console.log("### error ", error);
        var b = component.get("v.body");
        b.push(cmp);
        component.set("v.body", b);
      }
    );
  }
});