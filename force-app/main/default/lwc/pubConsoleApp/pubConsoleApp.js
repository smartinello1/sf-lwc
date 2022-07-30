import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';

import consoleApp from '@salesforce/messageChannel/consoleApp__c';

export default class PubConsoleApp extends LightningElement {
	@wire(MessageContext)
	messageContext;

	handleClick(event) {
		publish(this.messageContext, consoleApp, {});
	}
}