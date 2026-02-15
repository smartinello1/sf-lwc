"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lwc_1 = require("lwc");
class HelloWorld extends lwc_1.LightningElement {
    // @ts-ignore
    @lwc_1.api
    objectApiName;
    get computedClassNames() {
        return [
            "slds-box",
            "slds-theme_alert-texture",
            this.objectApiName === 'Account'
                ? "slds-theme_shade"
                : "slds-theme_success"
        ];
    }
}
exports.default = HelloWorld;
