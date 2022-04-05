import { LightningElement, track } from "lwc";
import getRecordsFromSOQL from "@salesforce/apex/GlobalSearchController.getRecordsFromSOQL";

export default class Global_search_container extends LightningElement {
  @track results = [];

  search() {
    let query = this.template.querySelector(
      "c-global_search_filter"
    ).soqlTextUI;
    console.log("@@@ query ", query);
    getRecordsFromSOQL({ query: query })
      .then((response) => {
        console.log("@@@ queryres ", response);
        this.results = response;
      })
      .catch((err) => {
        console.log("@@@ err soql ", err);
      });
  }
}