import { LightningElement } from 'lwc';
import { getDocumentScanner } from 'lightning/mobileCapabilities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DocumentTextScanner extends LightningElement {

    scannedDocument
    scanningOptions = {
        imageSource: "DEVICE_CAMERA",
        scriptHint: "LATIN",
        returnImageBytes: true
    }

    myDocumentScanner

    connectedCallback() {
        this.myDocumentScanner = getDocumentScanner();
        if(this.myDocumentScanner.isAvailable()) {
            this.scannedDocument = 'Ready to scan...'
        } else {
            this.scannedDocument = 'Scan not enabled...'
        }
    }

    
    handleBeginScanEventClick(event) {
        if(this.myDocumentScanner.isAvailable()) {
            // Perform document scanning operations
            this.myDocumentScanner.scan({
                imageSource: "DEVICE_CAMERA",
                scriptHint: "LATIN",
                returnImageBytes: true
            }).then((result) => {
                // Do something with the result of the scan
                this.scannedDocument = JSON.stringify(result);
            }).catch((error) => {
                // Handle cancellation and scanning errors here
                console.error(error);
                this.scannedDocument = error.message
            })
        }
        else {
            // DocumentScanner not available, or consuming app hasn’t implemented it
            // Not running on hardware with a scanner
            // Handle with message, error, beep, and so on
        }
    }
}