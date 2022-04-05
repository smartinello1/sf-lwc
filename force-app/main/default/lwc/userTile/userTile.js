import { LightningElement, api, wire } from "lwc";
import ICON from "@salesforce/resourceUrl/AAA_ICON";

export default class UserTile extends LightningElement {
  @api recordId = "";
  svgURL = `${ICON}#logo`;
}