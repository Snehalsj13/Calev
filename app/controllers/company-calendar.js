import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  firebaseApp: Ember.inject.service(),
  authentication: Ember.inject.service(),
  toastMessages: Ember.inject.service(),
  mainData: {},
  calDiagram: [],
  init() {
    // Get data
    var id = this.get('authentication').getTok();
    var promise = new Promise((resolve, reject) => {
      var data = this.get('firebaseApp').database().ref().child('users/' + id);
      data.on('value', (snapshot) => {
        data = snapshot.val();
        this.mainData = data;
        if (this.mainData != null) {
          this.updateCalendar();
        }
        resolve();
      }, (error) => {
        Error(error);
        reject();
      });
    });

    promise.then(() => {
      var promise1 = new Promise((resolve, reject) => {
        initialize_calendar();
        resolve();
      });
      promise1.then(() => {
        this.updateCalendar();
      })
    });

    var initialize_calendar = () => {
      var el = $(document.querySelectorAll('.calendar'));
        var calendar = $(el);
        calendar.fullCalendar({
          customButtons: {
            add_event: {
              text: 'Save Appointment',
              click: () => {
                // firebase.database().ref('events/' + CalendarComponent.idss).update(
                //   {
                //     calDiagram: CalendarComponent.calDiagram
                //   }
                // ).then(
                //   (response) => {
                //     CalendarComponent.messageImage = 'Calendar updated successfully.';
                //     CalendarComponent.myFunctionImage(4800);
                //   },
                //   (error) => {
                //     CalendarComponent.messageImage = 'Could not store data due to some technical issue. Please try again later.';
                //     CalendarComponent.myFunctionImage(4800);
                //   }
                // );
                alert('Hi!');
              }
            }
          },
          header: {
            left: '',
            center: 'title',
            right: 'add_event',
          },
          views: {
            week: {
              type: 'agendaWeek',
              duration: {weeks: 1}
            },
            week2: {
              type: 'agendaWeek',
              duration: {weeks: 2}
            },
            week3: {
              type: 'agendaWeek',
              duration: {weeks: 3}
            },
            week4: {
              type: 'agendaWeek',
              duration: {weeks: 4}
            },
          },
          allDaySlot: false,
          selectable: true,
          editable: true,
          defaultView: 'agendaWeek',
          themeSystem: 'bootstrap3',
          // select: (startDate, endDate) => {
          //   var eventData;
          //   var title = prompt('Event Title:');
          //   if (title) {
          //     eventData = {
          //       title: title,
          //       id: +new Date(),
          //       start: startDate.format(),
          //       end: endDate.format()
          //     };
          //     var promise = new Promise((resolve, reject) => {
          //       if (this.calDiagram.push(eventData)) {
          //         resolve();
          //       }
          //     });
          //     promise.then(() => {
          //       $('.calendar').fullCalendar('removeEvents');
          //       for (var i in this.calDiagram) {
          //         $('.calendar').fullCalendar('renderEvent', this.calDiagram[i], true);
          //       }
          //     });
          //   }
          //   $('.calendar').fullCalendar('unselect');
          // },
          eventClick: function (event) {
          },
          eventDrop: function (event) {
          },
          eventResize: function (event) {
          },
          eventRender: function (event, element) {
          }
        });
    }
  },
  updateCalendar() {
    var el = $(document.querySelectorAll('.calendar'));
    if (this.mainData.timeline == '1 Week') {
      el.fullCalendar('changeView', 'week');
    } else if (this.mainData.timeline == '2 Weeks') {
      el.fullCalendar('changeView', 'week2');
    } else if (this.mainData.timeline == '3 Weeks') {
      el.fullCalendar('changeView', 'week3');
    } else {
      el.fullCalendar('changeView', 'week4');
    }
  }
});
