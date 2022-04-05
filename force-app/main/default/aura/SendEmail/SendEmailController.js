({
  myAction: function (component, event, helper) {
    component.set("v.prova", "Hello");
    component.set("v.prova2", "Hello2");
    var text2 = component.find("text2");
    console.log("text 2 " + text2.value);
    var dat = new Date().toLocaleString();
    component.set("v.data", dat);
    console.log("ciao");
    alert("ciao");
    var act = component.get("c.getPicklist");
    console.log("init: " + act);
    act.setCallback(this, function (response) {
      var state = response.getState();
      console.log("response: " + state);
      if (state == "SUCCESS") {
        console.log("response: " + response.getReturnValue());
        alert("org wide address: " + response.getReturnValue());
        component.set("v.fromAddress", response.getReturnValue());
      } else if (state == "INCOMPLETE") {
        alert(state);
      }
    });
    $A.enqueueAction(act);
  },
  handleClick: function (component, event, helper) {
    var prova2 = component.get("v.prova2");
    console.log("valore di prova 2 : " + prova2);

    var target = event.getSource();
    console.log("valore dell'evento : " + target);

    alert(prova2);

    prova2 = component.set("v.prova2", "Ciao2");
    prova2 = component.get("v.prova2");
    console.log("prova 2 " + prova2);
  },
  Reset: function (cmp, event, helper) {
    var res = cmp.get("v.prova2");
    res = cmp.set("v.prova2", " ");
    var prova = cmp.get("v.prova");
    prova = cmp.set("v.prova", " ");
    var data = cmp.get("v.data");
    data = cmp.set("v.data", " ");
    var err = cmp.find("error");
    $A.util.toggleClass(err, "errorc");
    alert("Hai Cancellato i Dati");
  },
  InviaMail: function (cmp, event, helper) {
    var action = cmp.get("c.Send");
    action.setParams({
      toAddress: cmp.get("v.toAddress"),
      fromAddress: cmp.get("v.fromAddress"),
      subject: cmp.get("v.subject"),
      body: cmp.get("v.body")
    });

    // Create a callback that is executed after
    // the server-side action returns
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state == "SUCCESS") {
        // Alert the user with the value returned
        // from the server
        alert("From server: " + response.getReturnValue());
        cmp.set("v.prova", response.getReturnValue());

        var toast = $A.get("e.force:showToast");
        toast.setParams({
          title: "Success",
          message: "Email Inviata Correttamente!",
          duration: "1000",
          mode: "dismissible",
          type: "successs"
        });
        toast.fire();

        // You would typically fire a event here to trigger
        // client-side notification that the server-side
        // action is complete
      } else if (state == "INCOMPLETE") {
        alert("response : " + response);
      } else if (state === "ERROR") {
        var errors = response.getError();
        if (errors) {
          if (errors[0] && errors[0].message) {
            console.log("Error message: " + errors[0].message);
          }
        } else {
          console.log("Unknown error");
        }
      }
    });

    // optionally set storable, abortable, background flag here

    // A client-side action could cause multiple events,
    // which could trigger other events and
    // other server-side action calls.
    // $A.enqueueAction adds the server-side action to the queue.
    $A.enqueueAction(action);
  }
});