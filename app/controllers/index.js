import Controller from '@ember/controller';

export default Controller.extend({
  authentication: Ember.inject.service(),
  firebaseApp: Ember.inject.service(),
  isAuth: false,
  actions: {
    Logout() {
      this.get('authentication').logout();
      this.set('isAuth', false);
    },
    toggleSignup() {
      this.transitionToRoute('sign-up');
    },
    toggleLogin() {
      this.transitionToRoute('sign-in');
    },
    goToDash() {
      var currentUser = this.get('firebaseApp').database().ref().child('users/' + this.get('authentication').getTok());
      currentUser.on('value', (snapshot) => {
        var snapshot = snapshot.val();
        if (snapshot.company == false) {
          this.transitionToRoute('userDash');
        } else if (snapshot.company == true) {
          this.transitionToRoute('companyDash');
        }
      });
    }
  }
});
