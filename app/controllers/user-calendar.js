import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  firebaseApp: Ember.inject.service(),
  authentication: Ember.inject.service(),
  toastMessages: Ember.inject.service(),
  mainData: {},
  calDiagram: Ember.A(),
  init() {
    // Get appointments data
    // var id = this.get('authentication').getTok();
    // var promise6 = new Promise((resolve, reject) => {
    //   var data = this.get('firebaseApp').database().ref().child('users/' + id);
    //   data.on('value', (snapshot) => {
    //     data = snapshot.val();
    //     this.mainData = data;
    //     if (this.mainData != null) {
    //       this.updateCalendar();
    //     }
    //     resolve();
    //   }, (error) => {
    //     Error(error);
    //     reject();
    //   });
    // });
    //
    // promise6.then(() => {
    //
    // });
  },
  checkIfTwoApptExist() {
    var count = 0;
    for (var i = 0; i < this.calDiagram.length; i++) {
      if (this.calDiagram[i].uId === this.get('authentication').getTok() && this.calDiagram[i].cId === this.mainData.uid) {
        count = count + 1;
      } else {
        continue;
      }
    }
    return count;
  },
  initialize_calendar() {
    var el = $(document.querySelectorAll('.calendar'));
    var calendar = $(el);
    calendar.fullCalendar({
      customButtons: {
        add_event: {
          text: 'Save Appointments',
          click: () => {
              this.get('firebaseApp').database().ref('appointments/').set({
                calDiagram: this.calDiagram
              }).then(
                (response) => {
                  // Response
                },
                (error) => {
                  Error(error);
                }
              );
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
      eventOverlap: false,
      selectOverlap: false,
      select: (startDate, endDate) => {
        var check = startDate.format();
        var dateCurrent = $('.calendar').fullCalendar('getDate');
        var today = dateCurrent.format();
        if (Date.parse(check) < Date.parse(today)) {
          var message = '<p>You cannot book past dates. Please make sure to select a valid date and time.</p>';
          var el = this.get('toastMessages');
          el.SnackBar(message);
          el.displayMessage(4800);
          return;
        }
        var promise7 = new Promise((resolve, reject) => {
          var count = this.checkIfTwoApptExist();
          resolve(count);
        });
        promise7.then((count) => {
          if (count === 2) {
            var message = '<p>Only two appointments are allowed per user per company. Please delete existing appointments or wait for an appointment to complete before making a new one.</p>';
            var el = this.get('toastMessages');
            el.SnackBar(message);
            el.displayMessage(4800);
            $('.calendar').fullCalendar('unselect');
            return;
          } else {
            var eventData;
            var title = prompt('Event Title:');
            if (title) {
              eventData = {
                cId: this.mainData.uid,
                uId: this.get('authentication').getTok(),
                title: title,
                id: +new Date(),
                start: startDate.format(),
                end: endDate.format()
              };
              var promise = new Promise((resolve, reject) => {
                if (this.calDiagram.push(eventData)) {
                  resolve();
                }
              });
              promise.then(() => {
                $('.calendar').fullCalendar('removeEvents');
                for (var i in this.calDiagram) {
                  $('.calendar').fullCalendar('renderEvent', this.calDiagram[i], true);
                }
              });
            }
            $('.calendar').fullCalendar('unselect');
          }
        });
      },
      eventClick: (event) => {
        var promise8 = new Promise((resolve, reject) => {
          if(event.uId !== this.get('authentication').getTok()) {
            var message = '<p>You can only select or modify your appointments. Please make a valid selection</p>';
            var el = this.get('toastMessages');
            el.SnackBar(message);
            el.displayMessage(4800);
            return;
          } else {
            resolve();
          }
        });
        promise8.then(() => {
          var eventId = event.id;
          $('#scheduleModal').modal('toggle');
          $(document).on('click', '#scheduleModal .modal-body h4', () => {
            var promise = new Promise((resolve, reject) => {
              for (var i = 0; i < this.calDiagram.length; i++) {
                if (this.calDiagram[i].id === eventId) {
                  this.calDiagram.splice(i, 1);
                  $('#scheduleModal').modal('hide');
                  resolve();
                }
              }
            });
            promise.then(() => {
              $('.calendar').fullCalendar('removeEvents');
              for (var j in this.calDiagram) {
                $('.calendar').fullCalendar('renderEvent', this.calDiagram[j], true);
              }
            });
          });
        });
      },
      eventDrop: (event, delta, revertFunc) => {
        var promise10 = new Promise((resolve, reject) => {
          if(event.uId !== this.get('authentication').getTok()) {
            var message = '<p>You can only select or modify your appointments. Please make a valid selection</p>';
            var el = this.get('toastMessages');
            el.SnackBar(message);
            el.displayMessage(4800);
            revertFunc();
          } else {
            resolve();
          }
        });
        promise10.then(() => {
          var check = event.start.format();
          var dateCurrent = $('.calendar').fullCalendar('getDate');
          var today = dateCurrent.format();
          if (Date.parse(check) < Date.parse(today)) {
            var message = '<p>You cannot book past dates. Please make sure to select a valid date and time.</p>';
            var el = this.get('toastMessages');
            el.SnackBar(message);
            el.displayMessage(4800);
            revertFunc();
            return;
          }
          var promise = new Promise((resolve, reject) => {
            for (var i in this.calDiagram) {
              if (this.calDiagram[i].id === event.id) {
                this.calDiagram[i].start = event.start.format();
                this.calDiagram[i].end = event.end.format();
                resolve();
              }
            }
          });
          promise.then(() => {
            $('.calendar').fullCalendar('removeEvents');
            for (var j in this.calDiagram) {
              $('.calendar').fullCalendar('renderEvent', this.calDiagram[j], true);
            }
          });
        });
      },
      eventResize: (event, delta, revertFunc) => {
        var promise9 = new Promise((resolve, reject) => {
          if(event.uId !== this.get('authentication').getTok()) {
            var message = '<p>You can only select or modify your appointments. Please make a valid selection</p>';
            var el = this.get('toastMessages');
            el.SnackBar(message);
            el.displayMessage(4800);
            revertFunc();
          } else {
            resolve();
          }
        });
        promise9.then(() => {
          var promise = new Promise((resolve, reject) => {
            for (var i in this.calDiagram) {
              if (this.calDiagram[i].id === event.id) {
                this.calDiagram[i].start = event.start.format();
                this.calDiagram[i].end = event.end.format();
                resolve();
              }
            }
          });
          promise.then(() => {
            $('.calendar').fullCalendar('removeEvents');
            for (var i in this.calDiagram) {
              $('.calendar').fullCalendar('renderEvent', this.calDiagram[i], true);
            }
          });
        });
      },
      eventRender: (event, element) => {
        element.find('.fc-title').append("<br/> Start: " + moment(event.start).format('MMMM Do YYYY, h:mm A'));
        element.find('.fc-title').append("<br/> End: " + moment(event.end).format('MMMM Do YYYY, h:mm A'));
        element.find('.fc-time').empty();
      },
      eventAfterRender: (event, element, view) => {
        if(event.uId === this.get('authentication').getTok()) {
          element.css('background-color', '#11998e');
        }
      }
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

    // Get appointments data
    var promise6 = new Promise((resolve, reject) => {
      var data = this.get('firebaseApp').database().ref('appointments/calDiagram');
      data.on('value', (snapshot) => {
        if (snapshot.val() === null) {
          resolve();
        } else {
          var data = snapshot.val();
          data = Object.values(data);
          this.calDiagram = [];
          for (var i=0; i< data.length; i++) {
            this.calDiagram.push(data[i]);
          }
          resolve();
        }
      }, (error) => {
        Error(error);
        reject();
      });
    });

    promise6.then(() => {
      $('.calendar').fullCalendar('removeEvents');
      for (var i in this.calDiagram) {
        $('.calendar').fullCalendar('renderEvent', this.calDiagram[i], true);
      }
    });
  }
});
