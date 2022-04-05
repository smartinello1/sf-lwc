import { LightningElement, api } from "lwc";
//Import utils.js
//import utils from './utils';

export default class First_LWC_Test extends LightningElement {
  @api first = 0;
  @api second = 0;
  @api result = 0;
  @api condition = false;

  @api nomecmp = "pdfcreator";

  connectedCallback() {
    //this.result = parseInt(this.first + this.second,10);
  }

  //console.log('@@@ this ' + this.first + ' -- ' + this.second);

  changeVal(event) {
    if (event.target.name === "first") {
      this.first = parseInt(event.target.value, 10);
    } else {
      this.second = parseInt(event.target.value, 10);
    }

    this.result = parseInt(this.first + this.second, 10);

    if (this.result > 10) this.condition = true;

    /*
        window.clearTimeout(this.delay);

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delay = setTimeout(() => {
			this.condition = false;
        }, 30000);
        */
  }
}