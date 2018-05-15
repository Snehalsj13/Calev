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

    });
  },
  initialize_calendar() {
    var el = $(document.querySelectorAll('.calendar'));
    var calendar = $(el);
    calendar.fullCalendar({
      customButtons: {
        go_back: {
          text: 'Go back',
          click: () => {
            this.transitionToRoute('companyDash').then(() => {
              // If you want to do something here
            });
          }
        }
      },
      header: {
        left: 'go_back',
        center: 'title',
        right: '',
      },
      views: {
        week: {
          type: 'agendaWeek',
          duration: {
            weeks: 1
          }
        },
        week2: {
          type: 'agendaWeek',
          duration: {
            weeks: 2
          }
        },
        week3: {
          type: 'agendaWeek',
          duration: {
            weeks: 3
          }
        },
        week4: {
          type: 'agendaWeek',
          duration: {
            weeks: 4
          }
        },
      },
      allDaySlot: false,
      selectable: false,
      editable: false,
      defaultView: 'agendaWeek',
      themeSystem: 'bootstrap3',
      eventRender: (event, element) => {
        element.find('.fc-title').append("<br/> Start: " + moment(event.start).format('MMMM Do YYYY, h:mm A'));
        element.find('.fc-title').append("<br/> End: " + moment(event.end).format('MMMM Do YYYY, h:mm A'));
        element.find('.fc-time').empty();
      },
    });
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
  },
  upCal() {
    $('.calendar').fullCalendar('removeEvents');
    for (var i in this.calDiagram) {
      $('.calendar').fullCalendar('renderEvent', this.calDiagram[i], true);
    }
  }
});
