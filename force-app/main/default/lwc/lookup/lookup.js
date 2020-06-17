import { LightningElement, api, track } from 'lwc';
import search from '@salesforce/apex/LookupController.getSearchResult';

export default class Lookup extends LightningElement {

    @api _readOnly = false;
    @api sObjectName = 'Opportunity';
    @api iconName = 'standard:opportunity';
    @api strSearch = '';
    @api placeholderInput = 'Cerca...';
    @api fieldLabel = 'Lookup';
    @api noResultMsg = 'Nessun risultato';

    @api minStrSearch = 2;

    @api results = [];
    @api selectedSObject;

    @track cachedResult = [];
    @track isLoading = false;

    /* EVENT HANDLERS - START */

    clickSearch(event){
        if(!this.hasSelection && (this.results.length > 0 || this.cachedResult.length > 0)){
            this.template.querySelector('.slds-combobox').classList.add('slds-is-open');

            if(this.cachedResult.length > 0)
                this.results = this.cachedResult;
        }
    }

    blurInput(event){
        this.template.querySelector('.slds-combobox').classList.remove('slds-is-open');
    }

    selectItem(event){
        let objId = event.currentTarget.dataset.value;
        this.selectedSObject = this.results.find(r => { return r.objId == objId });
        if(this.cachedResult.length < 3)
            this.cachedResult.unshift(this.selectedSObject);
        else{
            this.cachedResult.unshift(this.selectedSObject);
            this.cachedResult.pop();
        }
    }

    removeSelectedItem(event){
        this.selectedSObject = undefined;
        this.strSearch = '';
    }

    changeFilter(event){
        let strToSearch = event.target.value;
        this.strSearch = event.target.value;

        if(strToSearch.length >= this.minStrSearch){
            this.isLoading = true;
            this.template.querySelector('.slds-combobox').classList.add('slds-is-open');
            search({ strSearch: strToSearch, sObjectName: this.sObjectName, iconName: this.iconName, condition: null }).then(res => {
                this.results = res;
            }).finally(() => {
                this.isLoading = false;
            }).catch(err => {
                console.log('@@@ err ' , err);
            });
        } else if(strToSearch.length > 0)
            this.template.querySelector('.slds-combobox').classList.remove('slds-is-open');
    }

    /* EVENT HANDLERS - END */

    /* GETTER & SETTER - START */

    get hasSelection(){
        return this.selectedSObject != null && this.selectedSObject != undefined;
    }

    get hasResult(){
        return this.results.length > 0;
    }

    /* GETTER & SETTER - END */

}