({
  init: function (cmp, event, helper) {
    cmp.set("v.columns", [
      { type: "text", fieldName: "opportunityName" },
      { type: "text", fieldName: "opportunitySurname" },
      { type: "text", fieldName: "opportunitySimone" }
    ]);

    cmp.set("v.data", [
      {
        opportunityName: "Clienti Attivati",
        opportunitySurname: "frecciasu",
        opportunitySimone: "+22"
      },
      {
        opportunityName: "Clienti Persi",
        opportunitySurname: "frecciagiù",
        opportunitySimone: "-10"
      },
      {
        opportunityName: "Clienti Dormienti",
        opportunitySurname: "frecciadestra",
        opportunitySimone: "10"
      }
    ]);
  }
});