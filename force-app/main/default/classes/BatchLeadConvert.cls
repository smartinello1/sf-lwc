public with sharing class BatchLeadConvert implements Database.Batchable<SObject>, Database.RaisesPlatformEvents {
	private final String CONVERTED_STATUS = [
		SELECT Id, MasterLabel
		FROM LeadStatus
		WHERE IsConverted = TRUE
		LIMIT 1
	]
	.MasterLabel;

	public Database.QueryLocator start(Database.BatchableContext ctx) {
		return Database.getQueryLocator(
			[SELECT Id, FirstName, LastName FROM Lead WHERE ConvertedContactId = NULL]
		);
	}

	public void execute(Database.BatchableContext ctx, List<Lead> records) {
		List<Database.LeadConvert> leadConverts = new List<Database.LeadConvert>();
		for (Lead record : records) {
			Database.LeadConvert lc = new Database.LeadConvert();
			lc.setConvertedStatus(CONVERTED_STATUS);
			lc.setLeadId(record.Id);

			leadConverts.add(lc);
		}
		Database.convertLead(leadConverts, true);
	}

	public void finish(Database.BatchableContext ctx) {
	}
}
