import { LightningElement, api } from 'lwc';

import getAccountIdFromCustomerCode from '@salesforce/apex/SurveyController.getAccountIdFromCustomerCode'
import saveSurveyResponse from '@salesforce/apex/SurveyController.saveSurveyResponse'

export default class SurveyContainer extends LightningElement {

    @api customerCode
    accountId

    surveyId
    isLoading = true

    state = {
        landingPage: true,
        firstQuestion: false,
        secondQuestion: false,
        thirdQuestion: false,
        fourthQuestion: false,
        rejectPage: false,
        thankYouPage: false
    }

    async connectedCallback() {
        console.log('this.customerCode: ' , this.customerCode)
        this.accountId = await getAccountIdFromCustomerCode({ customerCode: this.customerCode })
        this.isLoading = false
    }

    handleBtn(event) {
        console.log('name: ' , event.target.name)
        console.log('name: ' , event.target.label)
        let btnName = event.target.name
        switch (btnName) {
            case 'SiVoglioRispondere':
                this.SiVoglioRispondere(event.target.label)
                break;
            default:
                break;
        }
    }

    async SiVoglioRispondere(surveyResponseBtnLabel) {
        this.isLoading = true
        try {
            let resultLandingPageSave = await saveSurveyResponse({ question: 'Vuoi rispondere al questionario?', answer: surveyResponseBtnLabel, accountId: this.accountId })
        } catch (err) {
            console.log('err: ' , err)
        }

        this.state.landingPage = false
        this.state.firstQuestion = true

        this.isLoading = false
    }
}