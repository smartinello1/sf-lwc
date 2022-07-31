import { LightningElement, wire } from 'lwc';

import {
	subscribe,
	unsubscribe,
	APPLICATION_SCOPE,
	MessageContext
} from 'lightning/messageService';

import consoleApp from '@salesforce/messageChannel/consoleApp__c';
import LightningAlert from 'lightning/alert';

export default class SubConsoleApp extends LightningElement {
	@wire(MessageContext)
	messageContext;

	subscription;

	connectedCallback() {
		if (!this.subscription) {
			this.subscription = subscribe(
				this.messageContext,
				consoleApp,
				(message) => this.handleMessage(message),
				{ scope: APPLICATION_SCOPE }
			);
		}
	}

	handleMessage(message) {
		// window.alert('Arrivato');
		this.handleAlertClick();
	}

	async handleAlertClick() {
		await LightningAlert.open({
			message: 'this is the alert message',
			theme: 'error', // a red theme intended for error states
			label: 'Error!' // this is the header text
		});
		//Alert has been closed
	}
}