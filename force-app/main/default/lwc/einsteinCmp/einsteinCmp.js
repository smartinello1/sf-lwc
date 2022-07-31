import { LightningElement, api, track } from 'lwc';

import createPublicLink from '@salesforce/apex/EinsteinVisionController.createPublicLink';
import getDocInfo from '@salesforce/apex/EinsteinVisionController.getDocInfo';
export default class EinsteinCmp extends LightningElement {
  @api recordId;

  options = [
    { label: 'Carta Identità', value: 'CI' },
    { label: 'Passaporto', value: 'P' },
    { label: 'Codice Fiscale', value: 'CF' }
  ];

  doc;
  @track
  recordInfo = {};

  connectedCallback() {
    console.log(this.evaluateExpr('this.recordInfo === undefined', true));
  }

  evaluateExpr(expr, bool) {
    return `${expr === bool}`;
  }

  handleChangeDoc(event) {
    this.doc = event.target.value;
  }

  handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;
    const docId = uploadedFiles[0].documentId;

    createPublicLink({ documentId: docId, recordId: this.recordId })
      .then((result) => {
        console.log('@@@ result ', result);
        return getDocInfo({ publicUrl: result });
      })
      .then((resultEinstein) => {
        console.log('@@@ resultEinstein ', resultEinstein);

        if (
          resultEinstein.responseEinstein !== undefined &&
          resultEinstein.responseEinstein.probabilities.length > 0
        ) {
          resultEinstein.responseEinstein.probabilities.forEach((elem) => {
            console.log('@@@ elem.label ', elem.label);
            console.log('@@@ elem.boundingBox.minX ', elem.boundingBox.minX);
            console.log('@@@ elem.boundingBox.maxX ', elem.boundingBox.maxX);
            if (
              elem.boundingBox.minX >= 615 &&
              elem.boundingBox.maxX <= 915 &&
              ((elem.boundingBox.minY >= 920 && elem.boundingBox.maxY <= 960) ||
                (elem.boundingBox.minY >= 400 && elem.boundingBox.maxY <= 440))
            ) {
              console.log('@@@ test ', elem);
              this.recordInfo.cognome = elem.label;
            }
          });
        }
      })
      .catch((err) => {
        console.log('@@@ err ', err.body);
        console.log('@@@ err ', err.message);
      });
  }

  get isChosenDocType() {
    return this.doc !== undefined;
  }
}