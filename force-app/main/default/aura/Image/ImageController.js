({
  init: function (component, event, helper) {
    $(".grid").masonry({
      itemSelector: ".grid-item",
      columnWidth: ".grid-sizer"
    });

    var data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Dataset #1",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 2,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: [65, 59, 20, 81, 56, 55, 40]
        }
      ]
    };

    var options = {
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            stacked: true,
            gridLines: {
              display: true,
              color: "rgba(255,99,132,0.2)"
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              display: false
            }
          }
        ]
      }
    };

    Chart.Bar("chart", {
      options: options,
      data: data
    });
  },

  setup: function (component, event, helper) {
    console.log("QUA");
    var data = {
      labels: ["January", "February", "March", "April", "May"],
      datasets: [
        {
          label: "Data One",
          fillColor: "rgba(41, 128, 185, 0.5)",
          strokeColor: "none",
          pointColor: "rgba(41, 128, 185, 0.9)",
          pointStrokeColor: "rgba(41, 128, 185, 0)",
          pointHighlightFill: "rgba(41, 128, 185, 0.9)",
          pointHighlightStroke: "rgba(41, 128, 185, 0)",
          data: [40, 39, 10, 40, 39, 80, 40]
        },
        {
          label: "Data Two",
          fillColor: "rgba(155, 89, 182, 0.5)",
          strokeColor: "none",
          pointColor: "rgba(155, 89, 182, 0.9)",
          pointStrokeColor: "rgba(231, 76, 60, 255, 0)",
          pointHighlightFill: "rgba(155, 89, 182, 0.9)",
          pointHighlightStroke: "rgba(231, 76, 60, 0)",
          data: [60, 25, 32, 10, 2, 12, 53]
        }
      ]
    };
    var el = component.find("chart").getElement();
    var ctx = el.getContext("2d");
    var myNewChart = new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        title: {
          fontSize: 20,
          display: true,
          text: "My First Chart !"
        }
      }
    });
  },

  navigateToMyComponent: function (component, event, helper) {
    console.log("Enter Here");
    var evt = $A.get("event.force:navigateToComponent");
    console.log("evt: " + evt);
    evt.setParams({
      componentDef: "c:Image",
      componentAttributes: {
        title: component.get("v.title")
      }
    });

    evt.fire();
  }
});