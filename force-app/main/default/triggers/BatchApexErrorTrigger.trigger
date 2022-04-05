trigger BatchApexErrorTrigger on BatchApexErrorEvent(after insert) {
  List<BatchLeadConvertErrors__c> errors = new List<BatchLeadConvertErrors__c>();

  for (BatchApexErrorEvent baee : Trigger.NewMap.values()) {
    BatchLeadConvertErrors__c err = new BatchLeadConvertErrors__c(
      AsyncApexJobId__c = baee.AsyncApexJobId,
      Records__c = baee.JobScope,
      StackTrace__c = baee.StackTrace
    );
    errors.add(err);
  }

  insert errors;
}