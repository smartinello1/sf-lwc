import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import isSetupCompleted from '@salesforce/apex/sftomcSetupCtrl.isSetupCompleted';
import getSettings from '@salesforce/apex/sftomcSetupCtrl.getSettings';
import saveSettings from '@salesforce/apex/sftomcSetupCtrl.saveSettings';

export default class SftomcSetup extends LightningElement {
  _setupCompletedFn;
  setupCompleted = false;
  namedCredentialName;
  settings = {};

  @wire(isSetupCompleted)
  setupCompletedFn(wireSetupCompleted) {
    const { data, error } = wireSetupCompleted;
    this._setupCompletedFn = wireSetupCompleted;
    console.log('err ', error);
    if (error) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Error',
          message:
            'Check configuration for Named Credential and Auth Provider to enable the connector',
          variant: 'error'
        })
      );
    }
    if (data) {
      console.log('data ', data);
      this.setupCompleted = true;
      getSettings()
        .then((result) => {
          console.log('@@@ result ', result);
          this.settings = result;
        })
        .catch((err) => {
          console.log('@@@ err ', err.message);
        });
    } else {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Error',
          message:
            'Check configuration for Named Credential and Auth Provider to enable the connector',
          variant: 'error'
        })
      );
    }
  }

  connectedCallback() {}

  handleChangeNamedCredential(event) {
    this.namedCredentialName = event.target.value;
  }

  handleFieldChange(event) {
    console.log('@@@ event ', event.target);
    console.log('@@@ event ', event.target.type);
    this.settings[event.target.name] =
      event.target.type === 'toggle'
        ? event.target.checked
        : event.target.value;
  }

  save(event) {
    saveSettings({
      namedCredentialName: this.namedCredentialName,
      settings: this.settings
    })
      .then((result) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: result ? 'Success!' : 'Error!',
            message: result
              ? 'Settings Updated Correctly'
              : 'Error during updating connector settings',
            variant: result ? 'success' : 'error'
          })
        );

        return refreshApex(this._setupCompletedFn);
      })
      .then((updated) => {
        console.log('@@@ updated ', updated);
      })
      .catch((err) => {
        console.log('@@@ result ', err);
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error!',
            message: 'Error during updating connector settings: ' + err.message,
            variant: 'error'
          })
        );
      });
  }
}