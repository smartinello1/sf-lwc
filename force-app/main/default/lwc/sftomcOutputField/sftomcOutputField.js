import { LightningElement, api } from 'lwc';

export default class SftomcOutputField extends LightningElement {
  _label;
  _type;
  _value;

  @api get label() {
    return this._label;
  }

  set label(v) {
    this._label = v;
  }

  @api get type() {
    return this._type;
  }

  set type(v) {
    this._type = v;
  }

  @api get format() {
    return this._format;
  }

  set format(v) {
    this._format = v;
  }

  @api get value() {
    let v = this._value;
    if (this.isNumber) {
      v = Number(this._value);
      if (this.format === 'percent') v = v / 100;
    }
    return v;
  }

  set value(v) {
    this._value = v;
  }

  get isText() {
    return (
      this.type === undefined ||
      this.type === null ||
      this.type === '' ||
      (!this.isDate && !this.isNumber)
    );
  }

  get isDate() {
    return this.type === 'date';
  }

  get isNumber() {
    return this.type === 'number';
  }
}