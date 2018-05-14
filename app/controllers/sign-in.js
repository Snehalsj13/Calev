import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  authentication: Ember.inject.service(),
  toastMessages: Ember.inject.service(),
  firebaseApp: Ember.inject.service(),
  isAuth: null,
  init() {
    this.isAuth = this.get('authentication').isAuthenticated();
  },
  actions: {
    goBackToIndex() {
      this.transitionToRoute('index');
    },
    signIn() {
      const email = this.get('email');
      const pass = this.get('password');
      this.get('authentication').signIn(email, pass).then((userResponse) => {
        this.get('authentication').getCurrentUserToken();
        var id = this.get('authentication').getTok();
        var promise = new Promise((resolve, reject) => {
          var message = '<p>Signed in successfully. Please wait while you are being redirected.</p>';
          var el = this.get('toastMessages');
          el.SnackBar(message);
          el.displayMessage(4800);
          setTimeout(() => {
            resolve();
          }, 4800)
        });

        promise.then(() => {
          var currentUser = this.get('firebaseApp').database().ref().child('users/' + id);
          currentUser.on('value', (snapshot) => {
            var snapshot = snapshot.val();
            if (snapshot.company == false) {
              this.transitionToRoute('userDash');
            } else if (snapshot.company == true) {
              this.transitionToRoute('companyDash');
            }
          });
        });
      }, (error) => {
        var message = '<p>Could not sign you in. Please try again later.</p>';
        var el = this.get('toastMessages');
        el.SnackBar(message);
        el.displayMessage(4800);
      });
    }
  }
});
