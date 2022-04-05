import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getFlowsList from "@salesforce/apex/MassDeleteFlowVersionController.getFlowsDefinition";
import MassDelete from "@salesforce/apex/MassDeleteFlowVersionController.MassDelete";

export default class FlowContainerTab extends LightningElement {
  @api title = "Flows";
  @api noFlowsLabel = "No Flows Available";
  @track flowsList = [];
  columns = [
    {
      label: "Name",
      fieldName: "formattedId",
      type: "url",
      typeAttributes: {
        label: { fieldName: "DeveloperName" },
        target: "_blank"
      }
    }
  ];
  @track isLoaded = false;

  connectedCallback() {
    this.isLoaded = false;
    getFlowsList({})
      .then((result) => {
        result = JSON.parse(result);
        console.log("@@@ result ", result);
        console.log("@@@ result.records ", result.records);
        result.records.forEach((item) => {
          item.formattedId = "/" + item.Id;
        });
        this.flowsList = result.records;
      })
      .finally(() => {
        this.isLoaded = true;
      })
      .catch((err) => {
        console.log("@@@ err ", err);
      });
  }

  /* EVENT HANDLERS - START */

  refreshBtn(event) {
    this.connectedCallback();
  }

  getSelectedFlow(event) {
    console.log("@@@ event ", event.detail.selectedRows);
  }

  deleteVersion(event) {
    let selectedFlows = this.template
      .querySelector("lightning-datatable")
      .getSelectedRows();
    console.log("@@@ selectedFlows ", selectedFlows);

    let flowIds = selectedFlows.map((f) => {
      return f.Id;
    });
    MassDelete({ flowIds: flowIds })
      .then((result) => {
        const event = new ShowToastEvent({
          title: "Success",
          message: "All inactive flows version are now deleted",
          variant: "success"
        });
        this.dispatchEvent(event);
      })
      .catch((err) => {
        console.log("@@@ err ", err);
        const event = new ShowToastEvent({
          title: "Error",
          message: err,
          variant: "error"
        });
        this.dispatchEvent(event);
      });
  }

  /* EVENT HANDLERS - END */

  /* GETTER & SETTER - START */

  get hasFlowRecords() {
    return this.flowsList.length > 0;
  }

  /* GETTER & SETTER - END */
}