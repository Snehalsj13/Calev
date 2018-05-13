import Controller from '@ember/controller';

export default Controller.extend({
  authentication: Ember.inject.service(),
  isAuth: null,
  init() {
    this.isAuth = this.get('authentication').isAuthenticated();
  },
  actions: {
    Logout() {
      this.get('authentication').logout();
    },
    toggleSignup() {
      this.transitionToRoute('sign-up');
    },
    toggleLogin() {
      this.transitionToRoute('sign-in');
    },
    toggleModalAbout() {
      this.set('modal3', true);
    },
    goToDash() {
      this.transitionToRoute('userDash');
    }
  }
});
