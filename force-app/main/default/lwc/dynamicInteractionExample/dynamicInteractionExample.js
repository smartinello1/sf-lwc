import { LightningElement, api } from 'lwc';

export default class DynamicInteractionExample extends LightningElement {
  @api apiName;
  @api listViewApiName;

  handleClick(event) {
    this.dispatchEvent(
      new CustomEvent('itemselected', {
        cancelable: true,
        bubbles: true,
        composed: true,
        detail: {
          apiName: this.apiName,
          recId: this.listViewApiName
        }
      })
    );
  }
}