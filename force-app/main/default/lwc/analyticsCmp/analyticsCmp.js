import { LightningElement, api } from 'lwc';

export default class AnalyticsCmp extends LightningElement {
  @api title;
  @api results;

  get stringResults() {
    return JSON.stringify(this.results);
  }
}