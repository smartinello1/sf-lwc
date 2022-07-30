import { LightningElement, wire } from 'lwc';

export default class JobManager extends LightningElement {
  jobs = [];
  error;
  /*
  @wire(getAsyncJobs, {})
  wiredAsyncJobs({ error, data }) {
    if (data) {
      this.jobs = data;
    }
    if (error) {
      console.log('@@@ error retrieving jobs: ', error);
      this.error = error;
    }
  }
  */

  get hasJobs() {
    return this.jobs.length > 0;
  }
}