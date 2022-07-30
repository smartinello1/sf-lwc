import {track, api, wire, LightningElement} from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class LightningMap extends LightningElement {
    @track
    mapMarkers;
    
    @track
    show = false;

    @track
    selectedMarker;

    @track
    fields = [];

    @track
    recordIdInternal;

    @wire(getRecord, { recordId: '$recordId', fields: '$fields' })
    wiredRecord({data, error}) {
        console.log(error);
        if (!data) return;
        console.log(data);
        this.mapMarkers = [{
            location: {
                City: data.fields[this.getFieldMapping("City")].value,
                State: data.fields[this.getFieldMapping("State")].value,
                Street: data.fields[this.getFieldMapping("Street")].value
            },
            title: data.fields[this.getFieldMapping("Name")].value,
            description: data.fields[this.getFieldMapping("Street")].value + ', ' +
                         data.fields[this.getFieldMapping("City")].value + ', ' +
                         data.fields[this.getFieldMapping("State")].value,
            value: data.id
        }];
        this.show = true;
        this.selectedMarker = data.id;
    }

    @api
    get recordId() {
        return this.recordIdInternal;
    }

    set recordId(recordId) {
        this.recordIdInternal = recordId;
        this.fields = getFields(getEntity(recordId));
    }

    getFieldMapping(field) {
        return fieldsMap[getEntity(this.recordId)][field];
    }
}

const fieldsMap = {
    "Account" : {
        "City" : "ShippingCity",
        "Street" : "ShippingStreet",
        "State" : "ShippingState",
        "Name" : "Name"
    },
    "Contact" : {
        "City" : "MailingCity",
        "Street" : "MailingStreet",
        "State" : "MailingState",
        "Name" : "FirstName"
    }
};

function getFields(entity) {
    if (!entity) {
        return [];
    }

    return Object.values(fieldsMap[entity]).map((field) => {
        return `${entity}.${field}`;
    });
}

function getEntity(recordId) {
    if (!recordId) {
        return null;
    } else if (recordId.indexOf("001") === 0) {
        return "Account";
    } else if (recordId.indexOf("003") === 0) {
        return "Contact";
    } else {
        return null;
    }
}