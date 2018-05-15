import Controller from '@ember/controller';

export default Controller.extend({
  authentication: Ember.inject.service(),
  firebaseApp: Ember.inject.service(),
  toastMessages: Ember.inject.service(),
  listOfAppointments: [],
  actions: {
    goToCompanyCalendar() {
      this.transitionToRoute('companyCalendar', {
        queryParams: {
          cN: this.get('authentication').getTok()
        }
      })
    },
    goBackToIndex() {
      this.transitionToRoute('index');
    },
    Logout() {
      this.get('authentication').logout();
      this.transitionToRoute('index');
    }
  }
});
