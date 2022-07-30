import { LightningElement } from 'lwc';

import syncLeadContactSubscribers from '@salesforce/apex/sftomcAudiencesCtrl.syncLeadContactSubscribers';

export default class SftomcAudiences extends LightningElement {
  data;
  errors;
  isLoading = true;
  blockCreateAudiences = true;

  connectedCallback() {
    this.getListsInfo();
  }

  async getListsInfo() {
    this.isLoading = true;
    try {
      let results = await syncLeadContactSubscribers({});
      console.log('@@@ results ', results);
      this.blockCreateAudiences = !results.constraints.may_create;
      // this.lists = results.list;
      this.data = results;
      this.data.lists = this.data.lists.map((l, ind) => {
        if (ind === this.data.lists.length - 1) l.isLast = true;
        return l;
      });
    } catch (err) {
      console.log('### err ', err);
      this.errors = err;
    } finally {
      this.isLoading = false;
    }
  }

  handleRefresh() {
    this.getListsInfo();
  }

  createNewAudience() {}

  get lists() {
    return this.data?.lists;
  }
}