import { LightningElement, api } from 'lwc';

import manageArticleView from '@salesforce/apex/ArticleViewStatisticsManagerCtrl.manageArticleView';

export default class ArticleViewStatisticsManager extends LightningElement {
  _recordId;

  @api get recordId() {
    return this._recordId;
  }

  set recordId(v) {
    this._recordId = v;
    console.log(v);
    manageArticleView({ recordId: v })
      .then((result) => {
        console.log('result article: ', result);
      })
      .catch((err) => {
        console.log('err article: ', err);
      });
  }
}