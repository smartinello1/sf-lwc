public with sharing class GlobalSearchController {
	@AuraEnabled
	public static List<Map<String, String>> getOrgSObjects() {
		Map<String, SObjectType> sobjectTypes = Schema.getGlobalDescribe();
		List<Map<String, String>> sobjects = new List<Map<String, String>>();
		for (String sobjName : sobjectTypes.keySet()) {
			Schema.DescribeSObjectResult describe = sobjectTypes.get(sobjName)
				.getDescribe();
			if (
				describe.isAccessible() &&
				describe.isQueryable() &&
				describe.isSearchable()
			) {
				sobjects.add(
					new Map<String, String>{
						'label' => describe.getLabel(),
						'value' => describe.getLocalName()
					}
				);
				// sobjects.put(describe.getLocalName(), new Map<String,String>{'label' => describe.getLabel(), 'value' => ''});
				// sobjects.put(describe.getLabel(), describe.getLocalName());
			}
		}
		return sobjects;
	}

	@AuraEnabled
	public static List<FieldWrapper> getSObjectFields(String sobjectName) {
		List<FieldWrapper> response = new List<FieldWrapper>();
		try {
			SObjectType sobjectType = Schema.getGlobalDescribe().get(sobjectName);
			Map<String, Schema.SObjectField> sobjectFieldMap = sobjectType.getDescribe()
				.fields.getMap();
			for (Schema.SObjectField sobjF : sobjectFieldMap.values()) {
				Schema.DescribeFieldResult dfr = sobjF.getDescribe();
				if (dfr.isAccessible()) {
					//response.put(dfr.getName(), new FieldWrapper(dfr.getName(), dfr.getLabel()));
					response.add(new FieldWrapper(dfr.getName(), dfr.getLabel()));
				}
			}
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}

		return response;
	}

	@AuraEnabled
	public static List<SObject> getRecordsFromSOQL(String query) {
		List<SObject> records = new List<SObject>();
		try {
			System.debug('@@@ query ' + query);
			records = Database.query(query);
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}

		return records;
	}

	public class FieldWrapper {
		@AuraEnabled
		public String name;
		@AuraEnabled
		public String label;

		public FieldWrapper(String name, String label) {
			this.name = name;
			this.label = label;
		}
	}
}
