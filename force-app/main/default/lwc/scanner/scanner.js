import { LightningElement } from 'lwc';
import { getDocumentScanner } from 'lightning/mobileCapabilities';

export default class Scanner extends LightningElement {
	scanner;
	result;

	connectedCallback() {
		this.scanner = getDocumentScanner();
		if (!this.scanner.isAvailable()) {
			console.log('scanner not available');
		}
	}

	async handleClickScan() {
		const options = {
			imageSource: 'DEVICE_CAMERA',
			scriptHint: 'LATIN',
			returnImageBytes: true
		};

		// Perform document scan
		const result = await this.scanner.scan(options);
		this.result = JSON.stringify(result);
	}
}
