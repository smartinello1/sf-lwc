import { LightningElement } from "lwc";
//Libreria utilizzata per gestire le date
import momentJS from "@salesforce/resourceUrl/moment";
import { loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import { createRecord } from "lightning/uiRecordApi";
import getBusinessHours from "@salesforce/apex/CalendarioAppuntamentiCtrl.getBH";
import getHolidays from "@salesforce/apex/CalendarioAppuntamentiCtrl.getHolidays";
import getScheduledAppointments from "@salesforce/apex/CalendarioAppuntamentiCtrl.getScheduledAppointments";
import createAppointments from "@salesforce/apex/CalendarioAppuntamentiCtrl.createAppointments";

export default class CalendarioAppuntamenti extends LightningElement {
  //Giorni della settimana visualizzati
  days = [];
  //Lista di business hours
  bh = [];
  //Holidays raggruppate per data per facilitare la verifica
  groupedHolidays = new Map();
  //Lista di appuntamenti della settimana
  appointments = [];
  //Appuntamenti raggruppati per data ora
  groupedAppointments = new Map();
  //Slot raggruppati
  groupedSlots = new Map();
  //Data di riferimento per la settimana corrente per gestire la navigazione avanti ed indietro delle settimane
  dataRiferimento;
  //Inizio della settimana attualmente visualizzata
  selectedWeekStartDate;
  //Fine della settimana attualmente visualizzata
  selectedWeekEndDate;
  //Disabilita il back button per andare indietro nel calendario
  disabledBackButton = true;
  //Toggle modal
  showModal = false;
  btnDisabled = false;
  //Record da salvare
  appointment = {};

  connectedCallback() {
    loadScript(this, momentJS + "/moment/moment.js")
      .then(() => {
        return getBusinessHours({});
      })
      .then((result) => {
        this.bh = result.data;
        console.log("@@@ bh ", this.bh);

        return getHolidays({});
      })
      .then((result) => {
        var dateXHolidays = new Map();

        result.data.forEach((h) => {
          dateXHolidays.set(h.ActivityDate, h);
        });

        this.groupedHolidays = dateXHolidays;
        console.log("@@@ this.groupedHolidays ", this.groupedHolidays);

        this.createCalendar();
      })
      .catch((err) => {
        console.log("@@@ error ", err);
      });
  }

  createCalendar(startOfWeek) {
    var now =
      startOfWeek != null && startOfWeek != undefined
        ? moment(startOfWeek)
        : moment();

    this.dataRiferimento = moment({ ...now });

    var weekStart = moment(now);
    var weekEnd = moment(now);
    var weekStartDate = moment(weekStart).startOf("week").add(1, "d");
    this.selectedWeekStartDate = weekStartDate.format("DD MMMM YY");
    var weekEndDate = moment(weekEnd).endOf("week").subtract(1, "d");
    this.selectedWeekEndDate = weekEndDate.format("DD MMMM YY");

    console.log("@@@ ccc ", moment(weekStartDate).format("YYYY-MM-DD"));
    getScheduledAppointments({
      dtInizio: moment(weekStartDate).format("YYYY-MM-DD"),
      dtFine: moment(weekEndDate).format("YYYY-MM-DD")
    })
      .then((result) => {
        console.log("@@@ result ", result);

        this.appointments = result.data;
        this.appointments.forEach((a) => {
          this.groupedAppointments.set(
            moment(a.Data_Inizio__c).format("YYYY-MM-DD") +
              "_" +
              moment(a.Data_Inizio__c).hours() +
              "_" +
              moment(a.Data_Fine__c).hours(),
            a
          );
        });

        console.log("@@@ groupedAppointments ", this.groupedAppointments);

        var checkEndWeek = false;
        this.days.push(weekStartDate);
        while (!checkEndWeek) {
          let lastDay = moment({ ...this.days[this.days.length - 1] });
          lastDay = lastDay.add(1, "d");

          console.log("@@@ lastDay ", lastDay);
          console.log(
            "@@@ lastDay isSame ",
            lastDay.date() == weekEndDate.date()
          );
          if (lastDay.date() == weekEndDate.date()) checkEndWeek = true;
          else this.days.push(lastDay);
        }
        this.days.push(weekEndDate);
        console.log("@@@ days ", this.days);

        this.days = this.days.map((d) => {
          var ddd = {
            id: d.format("DDD"),
            value: d.format("DD ddd"),
            isHoliday: this.groupedHolidays.has(d.format("YYYY-MM-DD")),
            hours: [
              { id: "0", value: 1, isAvailable: true, cssClass: "" },
              {
                id: "1",
                value: 2,
                isAvailable: false,
                cssClass: "background: grey; color:white;"
              }
            ]
          };
          console.log("@@@ date ", d.date());
          console.log("@@@ date ", d.day());

          var start = { ...d };
          var end = { ...d };

          console.log("@@@ start ", start);
          console.log("@@@ end ", end);

          start = moment(start)
            .startOf("day")
            .millisecond(
              this.bh[0][
                moment(start).startOf("day").format("dddd") + "StartTime"
              ]
            );
          end = moment(end)
            .startOf("day")
            .millisecond(
              this.bh[0][
                moment(start).startOf("day").format("dddd") + "EndTime"
              ]
            );
          var diff = end.diff(start, "hours");
          console.log("@@@ diff ", end.diff(start, "hours"));

          var hours = [];
          for (var key = 0; key < diff; key++) {
            var startHour = start.hours() + key;
            console.log("@@@ startHour ", startHour);
            var endHour = start.hours() + key + 1;
            console.log("@@@ endHour ", endHour);
            let keySlot =
              d.format("YYYY-MM-DD") + "_" + startHour + "_" + endHour;
            let hasAlreadyScheduled = this.groupedAppointments.has(keySlot);
            var newSlot = {
              id: keySlot,
              date: d.format("YYYY-MM-DD"),
              dateStart: moment({ ...d }).hours(startHour),
              dateEnd: moment({ ...d }).hours(endHour),
              start: startHour,
              end: endHour,
              isAvailable: !hasAlreadyScheduled,
              cssClass: hasAlreadyScheduled
                ? "background: grey; color:white;"
                : "cursor: pointer;"
            };

            console.log(
              "@@@ get ",
              d.format("YYYY-MM-DD") + "_" + startHour + "_" + endHour
            );
            console.log(
              "@@@ get ",
              this.groupedAppointments.has(
                d.format("YYYY-MM-DD") + "_" + startHour + "_" + endHour
              )
            );

            this.groupedSlots.set(keySlot, newSlot);

            hours.push(newSlot);
          }

          console.log("@@@ hours ", hours);
          ddd.hours = hours;

          return ddd;
        });
      })
      .catch((err) => {
        console.log("@@@ err ", err);
      });
  }

  onClickBackWeek(event) {
    this.days = [];
    var now = moment({ ...this.dataRiferimento }).subtract(1, "w");

    var nowWeek = moment();
    var beforeWeek = moment({ ...this.dataRiferimento }).subtract(1, "w");
    //Se la settimana precedente, è minore di oggi allora disabilito il pulsante
    this.disabledBackButton = beforeWeek.isBefore(nowWeek);

    this.createCalendar(now);
  }

  onClickNextWeek(event) {
    this.days = [];
    var now = moment({ ...this.dataRiferimento }).add(1, "w");

    var nowWeek = moment().startOf("week");
    var beforeWeek = moment({ ...this.dataRiferimento });
    //Se la settimana precedente, è minore di oggi allora disabilito il pulsante
    this.disabledBackButton = beforeWeek.isBefore(nowWeek);

    this.createCalendar(now);
  }

  onClickAppointmentSlot(event) {
    event.preventDefault();
    var isAvailable =
      event.currentTarget.dataset.available === "true" ? true : false;
    console.log("@@@ isAvailable ", isAvailable);
    if (!isAvailable) return;

    let slot = this.groupedSlots.get(event.currentTarget.dataset.key);
    console.log("@@@ slot ", slot);

    // this.appointment.Data_Inizio__c = moment(slot.dateStart).utc().format();
    // console.log('@@@ prova ' , this.appointment.Data_Inizio__c);
    // this.appointment.Data_Fine__c =  moment(slot.dateEnd).utc().format();
    // console.log('@@@ prova ' , this.appointment.Data_Fine__c);
    this.appointment.Data_Inizio__c = moment(slot.dateStart).utc().format();
    this.appointment.Data_Fine__c = moment(slot.dateEnd).utc().format();
    this.appointment.Email__c = "test@test.it";

    this.showModal = true;
  }

  handleDialogClose(event) {
    this.showModal = false;
  }

  saveAppointment(event) {
    this.btnDisabled = true;
    createAppointments({ appointment: this.appointment })
      .then((result) => {
        console.log("@@@ result ", result);
        this.days = [];
        this.createCalendar(moment({ ...this.dataRiferimento }));
        this.showModal = false;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Successo!",
            message: "Appuntamento prenotato con successo!",
            variant: "success"
          })
        );
        this.btnDisabled = false;
      })
      .catch((err) => {
        console.log("@@@ err ", err);
      });
  }
}