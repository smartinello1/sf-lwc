import { LightningElement } from 'lwc';

export default class WebllmWrapper extends LightningElement {
	payload = "";
	isLoading = true;
	initDone = false;
	isStreaming = true;
	disableNewMessage = true;

	usageDataList = [];

	constructor() {
		super();
		window.addEventListener('message', this.handleMessage);
	}

	connectedCallback() {
		this.initDone = true;
	}

	disconnectedCallback() {}

	get iframeUrlWithParams() {
		let baseUrl = '/apex/webllmVFWrapper';
		baseUrl += `?isStreaming=${this.isStreaming}`;
		return baseUrl;
	}

	handleMessage = (payload) => {
		// todo: add origin check, dynamic based on the org
		if (payload.origin !== 'https://martinellosimone-dev-ed--c.vf.force.com') {
			return;
		}
		console.log('payload: ', payload.origin, payload.data);
		if (payload.data.type === "initCallback") {
			if(payload.data.data.progress === 1) {
				this.isLoading = false;
				this.disableNewMessage = false;
			}
			return;
		}

		if (payload.data.type === "usage") {
			this.usageDataList.push(payload.data.usageData);
			this.disableNewMessage = false;
			return;
		}

		this.payload += payload.data.message;
	};

	handleSend() {
		let chatInput = this.refs.chatInput.value;
		this.refs.webllmWrapper.contentWindow.postMessage(
			{ message: chatInput },
			'https://martinellosimone-dev-ed--c.vf.force.com'
		);
		this.disableNewMessage = true;
	}
}