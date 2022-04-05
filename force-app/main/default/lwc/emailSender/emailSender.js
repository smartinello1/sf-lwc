import { LightningElement, api, wire } from "lwc";
import getEmailTemplate from "@salesforce/apex/EmailController.getEmailTemplate";

export default class EmailSender extends LightningElement {
  @api recordId;

  @wire(getEmailTemplate, {})
  templateEmail;

  sendEmail(evt) {
    console.log(this.templateEmail.data);
  }

  @api
  get loaded() {
    return !this.templateEmail.data;
  }
}