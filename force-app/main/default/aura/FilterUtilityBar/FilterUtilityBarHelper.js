({
  initialize: function (component, event, helper) {
    var action = component.get("c.getFilters");
    action.setCallback(this, (response) => {
      if (response.getState() == "SUCCESS") {
        var risposta = response.getReturnValue();

        if (risposta.success) {
          component.set("v.filterOptions", risposta.data[0]);
        } else {
          console.log("@@@ errore msg ", risposta.message);
        }
      } else {
        console.log("@@@ errore ", response.getError());
      }

      component.set("v.isLoaded", true);
    });
    $A.enqueueAction(action);

    var empApi = component.find("empApi");

    // Uncomment below line to enable debug logging (optional)
    empApi.setDebugFlag(true);

    // Register error listener and pass in the error handler function
    empApi.onError(
      $A.getCallback((error) => {
        // Error can be any type of error (subscribe, unsubscribe...)
        console.error("EMP API error: ", error);
      })
    );

    helper.subscribe(component, event, helper);
  },

  subscribe: function (component, event, helper) {
    // Get the empApi component
    const empApi = component.find("empApi");
    // Get the channel from the input box
    const channel = "/event/TestPE__e";
    // Replay option to get new events
    const replayId = -1;

    // Subscribe to an event
    empApi
      .subscribe(
        channel,
        replayId,
        $A.getCallback((eventReceived) => {
          // Process event (this is called each time we receive an event)
          console.log("Received event ", JSON.stringify(eventReceived));
        })
      )
      .then((subscription) => {
        // Confirm that we have subscribed to the event channel.
        // We haven't received an event yet.
        console.log("Subscribed to channel ", subscription.channel);
        // Save subscription to unsubscribe later
        component.set("v.subscription", subscription);
      });
  },

  applyFilter: function (component, event, helper) {
    var filtro = component.get("v.selectedFilter");
    console.log("@@@ filtro " + filtro);

    if (filtro != undefined) {
      var filterEvt = $A.get("e.c:FilterEvent");
      filterEvt.setParams({
        value: filtro.value,
        label: filtro.label,
        isTeam: filtro.isTeam
      });

      filterEvt.fire();
    } else {
      var msgToast = $A.get("e.force:showToast");
      msgToast.setParams({
        title: "ATTENZIONE",
        message: "Selezionare un filtro",
        type: "warning"
      });
      msgToast.fire();
    }
  },

  clearFilter: function (component, event, helper) {
    component.set("v.selectedFilter", undefined);

    var filterEvt = $A.get("e.c:FilterEvent");
    filterEvt.setParams({
      value: "",
      label: "",
      isTeam: false
    });

    filterEvt.fire();
  }
});