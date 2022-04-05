import { LightningElement, api, track } from "lwc";

export default class Global_search_results extends LightningElement {
  @track _results = [];
  @track _columns = [];

  @api get results() {
    return this._results;
  }

  set results(v) {
    let cols = [];
    if (v != undefined && v != null && v.length > 0) {
      let obj = v[0];
      for (var key in obj) {
        //let col = Object.create({}, { label: { value: key}, fieldName: { value: key}, type: { value: 'text'} });
        let col = { label: key, fieldName: key, type: "text" };
        cols.push(col);
      }
    }
    this._columns = cols;
    console.log("@@@ this._columns ", this._columns);
    this._results = v;
  }
}