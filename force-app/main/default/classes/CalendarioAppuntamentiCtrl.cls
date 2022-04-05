public with sharing class CalendarioAppuntamentiCtrl {
  @AuraEnabled
  public static Map<String, Object> getBH() {
    Map<String, Object> response = new Map<String, Object>{
      'success' => true,
      'message' => ''
    };
    try {
      List<BusinessHours> bhList = new List<BusinessHours>(
        [
          SELECT
            Id,
            Name,
            IsDefault,
            SundayStartTime,
            SundayEndTime,
            MondayStartTime,
            MondayEndTime,
            TuesdayStartTime,
            TuesdayEndTime,
            WednesdayStartTime,
            WednesdayEndTime,
            ThursdayStartTime,
            ThursdayEndTime,
            FridayStartTime,
            FridayEndTime,
            SaturdayStartTime,
            SaturdayEndTime
          FROM BusinessHours
          WHERE IsActive = TRUE
        ]
      );
      response.put('data', bhList);
    } catch (Exception e) {
      // throw new AuraHandledException(e.getMessage());
      response.put('success', false);
      response.put('message', e.getMessage());
    }

    return response;
  }

  @AuraEnabled
  public static Map<String, Object> getHolidays() {
    Map<String, Object> response = new Map<String, Object>{
      'success' => true,
      'message' => ''
    };
    try {
      List<Holiday> holidays = new List<Holiday>(
        [
          SELECT
            Id,
            Name,
            Description,
            IsAllDay,
            ActivityDate,
            StartTimeInMinutes,
            EndTimeInMinutes,
            IsRecurrence,
            RecurrenceStartDate,
            RecurrenceEndDateOnly,
            RecurrenceType,
            RecurrenceInterval,
            RecurrenceDayOfWeekMask,
            RecurrenceDayOfMonth,
            RecurrenceInstance,
            RecurrenceMonthOfYear
          FROM Holiday
        ]
      );
      response.put('data', holidays);
    } catch (Exception e) {
      // throw new AuraHandledException(e.getMessage());
      response.put('success', false);
      response.put('message', e.getMessage());
    }

    return response;
  }

  @AuraEnabled
  public static Map<String, Object> getScheduledAppointments(
    Date dtInizio,
    Date dtFine
  ) {
    Map<String, Object> response = new Map<String, Object>{
      'success' => true,
      'message' => ''
    };
    try {
      List<Appuntamento__c> appointments = new List<Appuntamento__c>(
        [
          SELECT Id, Name, Data_Inizio__c, Data_Fine__c
          FROM Appuntamento__c
          WHERE
            Data_Appuntamento__c >= :dtInizio
            OR Data_Appuntamento__c <= :dtFine
        ]
      );
      response.put('data', appointments);
    } catch (Exception e) {
      // throw new AuraHandledException(e.getMessage());
      response.put('success', false);
      response.put('message', e.getMessage());
    }

    return response;
  }

  @AuraEnabled
  public static Map<String, Object> createAppointments(
    Appuntamento__c appointment
  ) {
    Map<String, Object> response = new Map<String, Object>{
      'success' => true,
      'message' => ''
    };
    try {
      System.debug('@@@ dt ' + appointment);
      // Appuntamento__c appointment = new Appuntamento__c(Data_Inizio__c = (DateTime)params.get('Data_Inizio__c'), Data_Fine__c = (DateTime)params.get('Data_Fine__c'));
      insert appointment;
    } catch (Exception e) {
      response.put('success', false);
      response.put('message', e.getMessage());
    }

    return response;
  }
}