import { LightningElement, api, track } from 'lwc';
const columns = [{ label: 'Label', fieldName: 'name', sortable: true },
{ label: 'Website', fieldName: 'website', type: 'url', sortable: true },
{ label: 'Phone', fieldName: 'phone', type: 'phone', sortable: true },
{ label: 'Balance', fieldName: 'amount', type: 'currency', sortable: true },
{ label: 'CloseAt', fieldName: 'closeAt', type: 'date', sortable: true }];

export default class CustomDatatable extends LightningElement {
    @api recordsPerPage = '5';
    @api optionsRecordsPerPage = [{ label: '1', value: '1'}, { label: '5', value: '5'}, { label: '10', value: '10'}, { label: '25', value: '25'}, { label: '50', value: '50'}];
    @api pageNumber = 0;

    @api records = [
        { id: 'test1', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test2', name: 'Test2', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test3', name: 'Test3', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test4', name: 'Test4', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test5', name: 'Test5', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test6', name: 'Test6', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test7', name: 'Test7', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test8', name: 'Test8', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test9', name: 'Test9', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test10', name: 'Test10', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test11', name: 'Test11', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test12', name: 'Test12', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test13', name: 'Test13', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test14', name: 'Test14', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test15', name: 'Test15', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test16', name: 'Test16', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test17', name: 'Test17', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test18', name: 'Test18', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test19', name: 'Test19', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test20', name: 'Test20', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test21', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test22', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test23', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test24', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test25', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test26', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test27', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test28', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test29', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test30', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test31', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test32', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test33', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test34', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test35', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test36', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test37', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
        { id: 'test38', name: 'Test1', website: 'test1', phone: 1234, amount: 100, closeAt: Date.now()},
    ];

    @api slicedArray = [];

    @api selectedRecords = [];
    columns = columns;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;

    @track isRendered = false;

    connectedCallback(){
        this.setupPagination();
    }

    setupPagination(){
        this.isRendered = false;
        this.splitArrayPerSize();
        this.setPage();
        this.isRendered = true;
        // this.template.querySelector('lightning-spinner').classList.toggle("slds-show");
    }

    splitArrayPerSize(){
        this.slicedArray = [];
        for(var i=0; i < this.records.length; i+= parseInt(this.recordsPerPage)){
            var finalIndex = i + parseInt(this.recordsPerPage);
            this.slicedArray.push(this.records.slice(i,finalIndex));
        }
    }

    setPage(){
        this.selectedRecords = this.slicedArray[this.pageNumber];
    }

    //EVENT HANDLERS -- START
    handleChangeRecordsPerPage(event){
        this.recordsPerPage = event.target.value;
        this.pageNumber = 0;
        this.setupPagination();
    }

    nextPage(event){
        if(this.pageNumber < this.slicedArray.length - 1){ 
            this.pageNumber++;
            this.selectedRecords = this.slicedArray[this.pageNumber];
        }
    }

    prevPage(event){
        if(this.pageNumber > 0){ 
            this.pageNumber--;
            this.selectedRecords = this.slicedArray[this.pageNumber];
        }
    }

    sortBy(field, reverse, primer) {
        const key = primer
            ? function(x) {
                  return primer(x[field]);
              }
            : function(x) {
                  return x[field];
              };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.selectedRecords];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.selectedRecords = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    //EVENT HANDLERS -- END

    //GETTER & SETTER -- START
    get disableNextPage(){
        return this.pageNumber >= this.slicedArray.length - 1;
    }

    get disablePrevPage(){
        return this.pageNumber == 0;
    }

    get currentPageNumber(){
        var pageNumber = this.pageNumber;
        pageNumber++;
        return pageNumber;
    }
    //GETTER & SETTER -- ENDs
}