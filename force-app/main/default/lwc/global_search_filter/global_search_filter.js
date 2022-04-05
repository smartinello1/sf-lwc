import { LightningElement, api, track } from "lwc";
import getOrgSObjects from "@salesforce/apex/GlobalSearchController.getOrgSObjects";
import getSObjectFields from "@salesforce/apex/GlobalSearchController.getSObjectFields";

export default class Global_search_filter extends LightningElement {
  @track options = [{ label: "All", value: "" }];
  @track selectedObject;
  @track fields = [];
  @track soqlText = "";

  connectedCallback() {
    getOrgSObjects({})
      .then((res) => {
        console.log(res);
        this.options = this.options.concat(res);
      })
      .finally(() => {
        this.template.querySelector(".cstm-spinner").classList.toggle("hide");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(event) {
    this.template.querySelector(".cstm-spinner").classList.toggle("hide");
    this.selectedObject = event.detail.value;
    getSObjectFields({ sobjectName: this.selectedObject })
      .then((response) => {
        console.log("@@@ response ", response);
        this.fields = response;
        //this.fromClause = 'FROM ' + this.selectedObject;
        this.soqlText = "FROM " + this.selectedObject;
        this.template.querySelector(".cstm-spinner").classList.toggle("hide");
      })
      .catch((err) => {
        console.log("@@@ err ", err);
      });
  }

  selectField(evt) {
    if (this.soqlText == "")
      this.soqlText += "SELECT " + evt.target.dataset.fieldname + ",";
    else {
      let soql = this.soqlText;
      let fromIndex = soql.indexOf("FROM");
      this.soqlText =
        soql.substring(0, fromIndex) +
        evt.target.dataset.fieldname +
        ", " +
        soql.substring(fromIndex);
      //this.soqlText = evt.target.dataset.fieldname + ', ' + this.soqlText;
    }
  }

  changeSoqlText(evt) {
    this.soqlText = evt.target.value;
  }

  get isAllSearch() {
    return this.selectedObject == "";
  }

  @api
  get soqlTextUI() {
    return this.soqlText;
    //return this.selectClause + this.fromClause + this.whereClause;
  }

  set soqlTextUI(v) {
    this.soqlText = v;
  }
}