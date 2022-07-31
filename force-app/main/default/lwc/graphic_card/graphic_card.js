import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import chartJS from "@salesforce/resourceUrl/ChartJS";
import { loadScript } from "lightning/platformResourceLoader";
import getChartData from "@salesforce/apex/GraphicCardController.getChartData";

export default class Graphic_card extends LightningElement {
  @api recordId;
  chartJsLoaded = false;
  chart;
  @api cnts;
  @track buttons = [
    { label: "Grafico 1", value: 1, class: "brand" },
    { label: "Grafico 2", value: 2, class: "neutral" },
    { label: "Grafico 3", value: 3, class: "neutral" }
  ];

  renderedCallback() {
    if (this.chartJsLoaded) {
      return;
    }
    this.chartJsLoaded = true;
    loadScript(this, chartJS + "/Chart.js-2.9.3/dist/Chart.min.js")
      .then(() => {
        return getChartData({ recordId: this.recordId });
        /*
            .then((result) =>{
                this.cnts = result;
            });
            */
      })
      .then((result) => {
        this.cnts = result;
        this.loadChart();
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error loading ChartJS",
            message: error.message,
            variant: "error"
          })
        );
      });
  }

  selectBtn(event) {
    this.buttons.forEach((btn) => {
      if (btn.value === event.target.value) {
        btn.class = "brand";
      } else {
        btn.class = "neutral";
      }
    });
    this.loadChart();
  }

  loadChart() {
    const canvas = document.createElement("canvas");
    this.template.querySelector("div.chart").appendChild(canvas);
    console.log("@@@ canvas ", typeof canvas);
    const ctx = canvas.getContext("2d");
    console.log("@@@ ctx ", ctx);
    this.chart = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: this.generateData(),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: this.generateOptions()
    });
  }

  generateData() {
    let indx = this.cnts.map((cnt, index) => {
      return index + 1;
    });
    return indx;
  }

  generateOptions() {
    var opt = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    };

    return opt;
  }
}