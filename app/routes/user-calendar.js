import Route from '@ember/routing/route';

export default Route.extend({
  uidVal: '',
  qParam: '',
  beforeModel(transition) {
    if (transition.queryParams.cN === undefined) {
      this.transitionTo('index');
    } else {
      this.uidVal = transition.queryParams.cN;
    }
  },
  setupController() {
    var controller = this.controllerFor('user-calendar');
    // Get data
    var promise = new Promise((resolve, reject) => {
      var data = controller.get('firebaseApp').database().ref('users').child(this.uidVal);
      data.on('value', (snapshot) => {
        data = snapshot.val();
        controller.mainData = data;
        resolve();
      }, (error) => {
        Error(error);
        reject();
      });
    });

    promise.then(() => {
      var promise1 = new Promise((resolve, reject) => {
        this.controllerFor('user-calendar').initialize_calendar();
        resolve();
      });
      promise1.then(() => {
        this.controllerFor('user-calendar').updateCalendar();
      })
    });
  }
});
