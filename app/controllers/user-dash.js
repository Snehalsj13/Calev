import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  firebaseApp: Ember.inject.service(),
  authentication: Ember.inject.service(),
  toastMessages: Ember.inject.service(),
  listOfCompanies: [],
  init() {},
  actions: {
    goBackToIndex() {
      this.transitionToRoute('index');
    },
    Logout() {
      this.get('authentication').logout();
      this.transitionToRoute('index');
    }
  }
});
