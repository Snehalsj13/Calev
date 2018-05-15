import Route from '@ember/routing/route';

export default Route.extend({
  names: [],
  mainNames: {},
  actions: {
    didTransition() {
      var controller = this.controllerFor('companyDash');

      controller.listOfAppointments = [];
      this.names = [];
      this.mainNames = [];

      // Get list of all appointments
      var promise = new Promise((resolve, reject) => {
        var data = controller.get('firebaseApp').database().ref().child('appointments/calDiagram');
        data.on('value', (snapshot) => {
          var data = snapshot.val();
          for (var i = 0; i < data.length; i++) {
            if (data[i].cId === controller.get('authentication').getTok()) {
              controller.listOfAppointments.push(data[i]);
            } else {
              continue;
            }
          }
          resolve();
        }, (error) => {
          Error(error);
          reject();
        });
      });

      promise.then(() => {
        var promise12 = new Promise((resolve, reject) => {
          var el = $(document.querySelector('.mainBox1'));
          resolve(el);
        });
        promise12.then((el) => {
          var promise16 = new Promise((resolve, reject) => {
            for (var i = 0; i < controller.listOfAppointments.length; i++) {
              var duid = controller.listOfAppointments[i].uId;
              var data = controller.get('firebaseApp').database().ref('users/' + duid);
              data.on('value', (snapshot) => {
                var data = snapshot.val();
                this.names.push(data);
                resolve()
              }, (error) => {
                Error(error);
                reject();
              });
            }
          });
          promise16.then(() => {
            setTimeout(() => {
              var promise17 = new Promise((resolve, reject) => {
                for (var i = 0; i < this.names.length; i++) {
                  this.mainNames[this.names[i].uid] = this.names[i].name;
                }
                resolve();
              });

              promise17.then(() => {
                console.log(this.mainNames);
              });
            }, 50);
          });
          var promise2 = new Promise((resolve, reject) => {
            setTimeout(() => {
              for (var i = 0; i < controller.listOfAppointments.length; i++) {
                el.append('<a class="boxCompany1">User: ' + this.mainNames[controller.listOfAppointments[i].uId] + ',' + '<br>' + 'Start: ' + moment(controller.listOfAppointments[i].start).format('MMMM Do YYYY, h:mm A') + ',' + '<br>' + 'End:' + moment(controller.listOfAppointments[i].end).format('MMMM Do YYYY, h:mm A') + '</a>');
              }
              resolve();
            }, 150);
          });
          promise2.then(() => {
            $('.boxCompany1').css('transition', 'all .2s');
            $('.boxCompany1').css('opacity', '1');
          });
        });

      });

      return true; // Bubble the didTransition event
    }
  }
});
