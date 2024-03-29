import { LightningElement, api } from 'lwc';

export default class ScreenFlowComponent extends LightningElement {

    _textValue
    @api textValue

    // @api get textValue() {
    //     return this._textValue
    // }

    // set textValue(v) {
    //     console.log('setter: ' , v)
    //     this._textValue = v
    // }
}