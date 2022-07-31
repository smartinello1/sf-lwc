import { LightningElement, api, track } from 'lwc';

export default class JobItem extends LightningElement {
  @track _item;
  @api get item() {
    return this._item;
  }

  set item(value) {
    this._item = value;
  }
}