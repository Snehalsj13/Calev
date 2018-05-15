import Route from '@ember/routing/route';

export default Route.extend({
  cidVal: '',
  qParam: '',
  beforeModel(transition) {
    if (transition.queryParams.cN === undefined) {
      this.transitionTo('index');
    } else {
      this.cidVal = transition.queryParams.cN;
    }
  },
  setupController() {
    var controller = this.controllerFor('company-calendar');

    controller.calDiagram = [];
    // Get list of all appointments
    var promise = new Promise((resolve, reject) => {
      var data = controller.get('firebaseApp').database().ref().child('appointments/calDiagram');
      data.on('value', (snapshot) => {
        var data = snapshot.val();
        for (var i = 0; i < data.length; i++) {
          if (data[i].cId === controller.get('authentication').getTok()) {
            controller.calDiagram.push(data[i]);
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
      var promise1 = new Promise((resolve, reject) => {
        this.controllerFor('company-calendar').initialize_calendar();
        resolve();
      });
      promise1.then(() => {
        this.controllerFor('company-calendar').upCal();
        this.controllerFor('company-calendar').updateCalendar();
      });
    });
  }
});
