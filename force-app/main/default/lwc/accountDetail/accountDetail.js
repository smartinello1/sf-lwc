import { api, track, LightningElement } from 'lwc';

export default class AccountDetail extends LightningElement {

    @api
    recId;

    @api
    apiName = "Account";

    show() {
        return true;
        //return !!this.recId;
    }
}