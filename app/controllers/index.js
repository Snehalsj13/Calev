import Controller from '@ember/controller';

export default Controller.extend({
  authentication: Ember.inject.service(),
  isAuth: null,
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
      this.transitionToRoute('userDash').then(() => {
        // If you want to do something here
      });
    }
  }
});
